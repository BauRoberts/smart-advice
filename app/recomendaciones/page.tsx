// app/recomendaciones/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getEffectiveSessionId } from "@/lib/session";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, CheckCircle, ArrowLeft, Download, Mail } from "lucide-react";
import Link from "next/link";
import { sendRCRecommendationEmail } from "@/lib/services/rcEmailService";
import { generateRCInsuranceReport } from "@/lib/services/rcReportService";
import { useToast } from "@/components/ui/use-toast";
import { SuccessDialog } from "@/components/ui/SuccessDialog";

interface Coverage {
  name: string;
  required: boolean;
  condition?: string;
  limit?: string;
  sublimit?: string;
}

interface CompanyInfo {
  name?: string;
  address?: string;
  activity?: string;
  activityDescription?: string;
  billing?: number;
  employees?: number;
  m2?: number;
  installations_type?: string;
  owner_name?: string;
  owner_cif?: string;
}

interface InsuranceRecommendation {
  type: string;
  companyInfo: CompanyInfo;
  coverages: Coverage[];
  ambitoTerritorial?: string;
  ambitoProductos?: string;
  limits?: {
    generalLimit: string;
    victimSubLimit: string;
    explanation?: string;
  };
}

// Función para generar PDF
const generatePDF = async (recommendation: InsuranceRecommendation) => {
  try {
    // Generar el PDF de Responsabilidad Civil
    await generateRCInsuranceReport(recommendation, true);
    console.log(
      "PDF de Responsabilidad Civil generado y descargado correctamente"
    );
  } catch (error) {
    console.error("Error al generar PDF:", error);
    alert(
      "Error al generar el informe. Por favor, inténtalo de nuevo más tarde."
    );
  }
};

// Create a separate client component for the content that uses useSearchParams
function RecomendacionesContent() {
  const [recommendation, setRecommendation] =
    useState<InsuranceRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const { toast } = useToast();
  const searchParams = useSearchParams();
  const tipo = searchParams.get("tipo");
  const urlSessionId = searchParams.get("session_id");
  useEffect(() => {
    // Debug de localStorage
    if (typeof window !== "undefined") {
      console.log("===== DEBUG LOCALSTORAGE EN RECOMENDACIONES =====");
      console.log(
        "smart_advice_session_id:",
        localStorage.getItem("smart_advice_session_id")
      );
      console.log(
        "smart_advice_temp_session_id:",
        localStorage.getItem("smart_advice_temp_session_id")
      );
      console.log(
        "last_used_session_id:",
        localStorage.getItem("last_used_session_id")
      );
      console.log(
        "last_used_form_session_id:",
        localStorage.getItem("last_used_form_session_id")
      );
      console.log("session_id:", localStorage.getItem("session_id"));
      console.log("formData:", localStorage.getItem("formData"));
      console.log("===== END DEBUG LOCALSTORAGE EN RECOMENDACIONES =====");
    }

    async function fetchData() {
      try {
        setLoading(true);

        // Obtener el session_id de los parámetros de URL
        const urlSessionId = searchParams.get("session_id");

        // Intentar obtener session_id guardado específicamente del formulario
        const lastFormSessionId =
          typeof window !== "undefined"
            ? localStorage.getItem("last_used_form_session_id")
            : null;

        // Intentar obtener cualquier session_id disponible como último recurso
        const effectiveSessionId = getEffectiveSessionId();

        // Priorizar URL > formulario guardado > session_id efectivo
        const sessionId =
          urlSessionId || lastFormSessionId || effectiveSessionId;

        console.log("===== RECOMENDACIONES PAGE DEBUG =====");
        console.log("Session ID from URL:", urlSessionId);
        console.log("Session ID from last form:", lastFormSessionId);
        console.log("Effective Session ID:", effectiveSessionId);
        console.log("Final Session ID used:", sessionId);
        console.log("Form Type:", tipo);

        if (!sessionId) {
          throw new Error("No session ID found");
        }

        // Si tenemos un session_id, guardarlo para mantener consistencia
        if (typeof window !== "undefined") {
          localStorage.setItem("last_used_form_session_id", sessionId);
        }

        // Fetch coverages
        console.log(
          `Fetching coverage advice for session ${sessionId} and form type ${tipo}`
        );
        const coveragesResponse = await fetch(
          `/api/recomendaciones/coberturas?session_id=${sessionId}${
            tipo ? `&form_type=${tipo}` : ""
          }`
        );

        // [Resto del código sin cambios]

        if (!coveragesResponse.ok) {
          console.error(
            "Error fetching coverage advice:",
            coveragesResponse.statusText
          );
          throw new Error(
            `Error fetching coverage advice: ${coveragesResponse.statusText}`
          );
        }

        const coveragesData = await coveragesResponse.json();
        console.log("Coverage Advice API Response:", coveragesData);

        if (
          coveragesData.success &&
          coveragesData.recommendations &&
          coveragesData.recommendations.length > 0
        ) {
          // Tomamos la primera recomendación que corresponda al tipo seleccionado
          const filteredRecommendations = coveragesData.recommendations.filter(
            (rec: InsuranceRecommendation) => (tipo ? rec.type === tipo : true)
          );

          if (filteredRecommendations.length > 0) {
            setRecommendation(filteredRecommendations[0]);
            console.log("Recommendation found:", filteredRecommendations[0]);
          } else {
            console.warn("No recommendation found for type:", tipo);
            setError(
              "No se encontró recomendación para el tipo de seguro seleccionado"
            );
          }
        } else {
          console.warn("No coverage advice found or unsuccessful response");
          setError("No se encontraron recomendaciones para tu formulario");
        }
      } catch (err: any) {
        console.error("Error in recomendaciones page:", err);
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [tipo, urlSessionId]);

  // Formatear el número con separador de miles
  const formatNumber = (num?: number) => {
    if (num === undefined) return "N/A";
    return num.toLocaleString() + "€";
  };

  // Función para enviar recomendación por email
  const sendRecommendationEmail = async (
    recommendation: InsuranceRecommendation
  ) => {
    try {
      setSending(true);

      // Obtener los datos del contacto del formulario
      const contactData = {
        email: "",
        name: "",
      };

      // Intentamos obtener los datos del formulario
      try {
        // Primero del localStorage
        const formDataStr = localStorage.getItem("formData");
        if (formDataStr) {
          const formData = JSON.parse(formDataStr);
          if (formData.contact) {
            contactData.email = formData.contact.email || "";
            contactData.name = formData.contact.name || "";
          }
        }

        // Si no encontramos en localStorage, intentar obtener de form_data
        if (!contactData.email) {
          // Buscar en el localStorage de session_data
          const sessionDataStr = localStorage.getItem("session_data");
          if (sessionDataStr) {
            const sessionData = JSON.parse(sessionDataStr);
            if (sessionData.form_data && sessionData.form_data.contact) {
              contactData.email = sessionData.form_data.contact.email || "";
              contactData.name = sessionData.form_data.contact.name || "";
            }
          }
        }

        // Si aún no tenemos email, usar los datos de la recomendación
        if (!contactData.email && recommendation.companyInfo) {
          // Usar el nombre de la empresa como último recurso
          contactData.name = recommendation.companyInfo.name || "";
        }
      } catch (e) {
        console.error("Error al obtener datos de contacto:", e);
      }

      if (!contactData.email) {
        // Si aún no tenemos email, pedir al usuario
        const userEmail = prompt(
          "Por favor, introduce tu email para recibir la cotización:"
        );
        if (userEmail) {
          contactData.email = userEmail;
        } else {
          toast({
            title: "Email requerido",
            description: "Necesitamos un email para enviar la cotización.",
            variant: "destructive",
          });
          setSending(false);
          return;
        }
      }

      console.log("Enviando solicitud de cotización a:", contactData.email);

      try {
        // Enviar email usando nuestro servicio actualizado
        const response = await sendRCRecommendationEmail(
          recommendation,
          contactData.email,
          contactData.name
        );

        console.log("Respuesta del servidor:", response);

        // Mostrar diálogo de éxito
        setShowSuccessDialog(true);

        // También mostrar toast
        toast({
          title: "Solicitud enviada con éxito",
          description:
            "Nos pondremos en contacto contigo a la mayor brevedad con una cotización personalizada. Se ha adjuntado el informe en PDF al email.",
          variant: "default",
        });
      } catch (emailError) {
        console.error("Error en el servicio de envío de email:", emailError);
        throw emailError;
      }
    } catch (error) {
      console.error("Error al enviar la recomendación por email:", error);

      toast({
        title: "Error al enviar solicitud",
        description:
          "Ha ocurrido un error al enviar tu solicitud. Por favor, inténtalo de nuevo más tarde.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Hero section */}
      <section className="py-12 px-6 bg-[#F5F2FB]">
        <div className="container mx-auto max-w-4xl">
          <Link
            href="/seguros"
            className="inline-flex items-center text-[#062A5A] mb-6 hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a tipos de seguros
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Informe en línea
          </h1>

          <div className="h-1 w-24 bg-[#FB2E25] mb-6"></div>

          <p className="text-gray-700 text-lg max-w-2xl">
            En base a las respuestas que has dado, tu seguro de{" "}
            {tipo === "responsabilidad_civil"
              ? "responsabilidad civil"
              : "daños materiales"}{" "}
            debería contener la siguiente información y coberturas:
          </p>
        </div>
      </section>

      {/* Error message */}
      {error && (
        <section className="py-8 px-6 bg-white">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error al cargar la recomendación
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Loading state */}
      {loading ? (
        <section className="py-12 px-6 bg-white">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
              <div className="h-64 bg-gray-100 rounded-lg"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
            </div>
            <p className="text-gray-600 mt-6">
              Preparando tu informe personalizado...
            </p>
          </div>
        </section>
      ) : (
        <>
          {/* Recommendation content */}
          {recommendation && (
            <section className="py-12 px-6 bg-white">
              <div className="container mx-auto max-w-4xl">
                <div className="bg-white border rounded-lg shadow-sm p-6 mb-8">
                  {/* Información general */}
                  <h2 className="text-xl font-semibold mb-6 text-[#062A5A]">
                    Información general
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-700">
                          Tomador:
                        </h3>
                        <p className="text-base">
                          {recommendation.companyInfo.name || "No especificado"}
                        </p>
                      </div>

                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-700">
                          Dirección:
                        </h3>
                        <p className="text-base">
                          {recommendation.companyInfo.address ||
                            "No especificada"}
                        </p>
                      </div>

                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-700">
                          Actividad cubierta:
                        </h3>
                        <p className="text-base">
                          {recommendation.companyInfo.activityDescription ||
                            recommendation.companyInfo.activity ||
                            "No especificada"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-700">
                          Facturación:
                        </h3>
                        <p className="text-base">
                          {formatNumber(recommendation.companyInfo.billing)}
                        </p>
                      </div>

                      {recommendation.companyInfo.installations_type ===
                        "No propietario" &&
                        recommendation.companyInfo.owner_name && (
                          <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-700">
                              Asegurado adicional:
                            </h3>
                            <p className="text-base">
                              Se hace constar como asegurado adicional en
                              calidad de propietario de las instalaciones al Sr.
                              y/o empresa{" "}
                              {recommendation.companyInfo.owner_name} con
                              NIF/DNI{" "}
                              {recommendation.companyInfo.owner_cif ||
                                "No especificado"}
                            </p>
                          </div>
                        )}

                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-700">
                          m² de las instalaciones:
                        </h3>
                        <p className="text-base">
                          {recommendation.companyInfo.m2 || "No especificado"}{" "}
                          m²
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Garantías a contratar */}
                  <h2 className="text-xl font-semibold mb-6 text-[#062A5A]">
                    Garantías a contratar
                  </h2>
                  <ul className="space-y-3 mb-8">
                    {recommendation.coverages
                      .filter((cov) => cov.required)
                      .map((coverage, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-medium">{coverage.name}</span>
                            {(coverage.limit ||
                              coverage.sublimit ||
                              coverage.condition) && (
                              <span className="block text-sm text-gray-600 mt-1">
                                {coverage.limit
                                  ? `Límite: ${coverage.limit}`
                                  : ""}
                                {coverage.sublimit
                                  ? ` - Sublímite: ${coverage.sublimit}`
                                  : ""}
                                {coverage.condition
                                  ? coverage.limit || coverage.sublimit
                                    ? ` - ${coverage.condition}`
                                    : coverage.condition
                                  : ""}
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                  </ul>

                  {/* Ámbitos territoriales */}
                  {recommendation.ambitoTerritorial && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-700">
                        Ámbito geográfico general de cobertura:
                      </h3>
                      <p className="text-base">
                        {recommendation.ambitoTerritorial}
                      </p>
                    </div>
                  )}

                  {recommendation.ambitoProductos && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-700">
                        Ámbito geográfico para productos:
                      </h3>
                      <p className="text-base">
                        {recommendation.ambitoProductos}
                      </p>
                    </div>
                  )}
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <Button
                    className="bg-[#062A5A] hover:bg-[#051d3e] flex items-center justify-center"
                    onClick={() => sendRecommendationEmail(recommendation)}
                    disabled={sending}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    {sending
                      ? "Enviando..."
                      : "Solicita cotización de tu seguro"}
                  </Button>

                  <Button
                    className="bg-[#FB2E25] hover:bg-[#d92720] flex items-center justify-center"
                    onClick={() => generatePDF(recommendation)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Descarga informe de seguro
                  </Button>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Dialog de éxito */}
      {showSuccessDialog && (
        <SuccessDialog
          isOpen={showSuccessDialog}
          onClose={() => setShowSuccessDialog(false)}
          title="¡Solicitud enviada correctamente!"
          description={`Hemos enviado la solicitud de cotización de seguro de Responsabilidad Civil a tu correo electrónico. Nos pondremos en contacto contigo en breve con una propuesta personalizada para tu empresa.`}
          buttonText="Aceptar"
        />
      )}
    </>
  );
}

// Main page component that wraps the content with Suspense
export default function RecomendacionesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Suspense
        fallback={
          <section className="py-12 px-6 bg-white">
            <div className="container mx-auto max-w-4xl text-center">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
                <div className="h-64 bg-gray-100 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
              </div>
              <p className="text-gray-600 mt-6">Cargando informe...</p>
            </div>
          </section>
        }
      >
        <RecomendacionesContent />
      </Suspense>
      <Footer />
    </main>
  );
}
