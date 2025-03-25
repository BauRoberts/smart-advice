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
const generatePDF = (recommendation: InsuranceRecommendation) => {
  // Esta función se implementaría con una librería como jsPDF o usando una API del backend
  console.log("Generando PDF para recomendación", recommendation);
  alert("Descargando informe de aseguramiento...");
};

// Función para enviar recomendación por email
const sendRecommendationEmail = (recommendation: InsuranceRecommendation) => {
  // Esta función se implementaría con una API del backend
  console.log("Enviando recomendación por email", recommendation);
  alert(
    "Solicitud de cotización enviada. Nos pondremos en contacto contigo pronto."
  );
};

// Create a separate client component for the content that uses useSearchParams
function RecomendacionesContent() {
  const [recommendation, setRecommendation] =
    useState<InsuranceRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const tipo = searchParams.get("tipo");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const sessionId = getEffectiveSessionId();

        console.log("===== RECOMENDACIONES PAGE DEBUG =====");
        console.log("Session ID:", sessionId);
        console.log("Form Type:", tipo);

        if (!sessionId) {
          throw new Error("No session ID found");
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
  }, [tipo]);

  // Formatear el número con separador de miles
  const formatNumber = (num?: number) => {
    if (num === undefined) return "N/A";
    return num.toLocaleString() + "€";
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
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Solicita cotización de tu seguro
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
