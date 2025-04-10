///Users/bautistaroberts/smart-advice/components/DanosRecomendacionesContent.tsx

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getEffectiveSessionId } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft, Download, Mail } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { sendDanosRecommendationEmail } from "@/lib/services/emailService";
import { DanosInsuranceRecommendation, ContactInfo } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const formatNumber = (num?: number) => {
  if (num === undefined) return "N/A";
  return num.toLocaleString() + "€";
};

export default function DanosRecomendacionesContent() {
  const [recommendation, setRecommendation] =
    useState<DanosInsuranceRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contactData, setContactData] = useState<ContactInfo | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const { toast } = useToast();

  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const generatePDF = async (recommendation: DanosInsuranceRecommendation) => {
    try {
      const { generateInsuranceReport } = await import(
        "@/lib/services/pdfGenerator"
      );
      // Pasar true para forzar la descarga del PDF
      await generateInsuranceReport(recommendation, true);

      toast({
        title: "¡PDF generado con éxito!",
        description: "El informe de seguro se ha descargado correctamente.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error detallado al generar PDF:", error);

      toast({
        title: "Error al generar PDF",
        description:
          "Ha ocurrido un error al generar el informe. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  // Modificar la función handleSendRecommendationEmail para generar y adjuntar el PDF
  const handleSendRecommendationEmail = async () => {
    if (!recommendation) return;

    try {
      setSendingEmail(true);

      // Verificamos si tenemos datos de contacto
      if (!contactData || !contactData.email) {
        throw new Error(
          "No se encontraron datos de contacto para enviar el email"
        );
      }

      // Generamos el PDF sin descargarlo automáticamente
      const { generateInsuranceReport } = await import(
        "@/lib/services/pdfGenerator"
      );
      const pdfBlob = await generateInsuranceReport(recommendation, false); // Pasar false para evitar descarga

      // Enviamos el email usando nuestro servicio, incluyendo el PDF
      await sendDanosRecommendationEmail(
        recommendation,
        contactData.email,
        contactData.name || "Cliente",
        pdfBlob
      );

      // Actualizamos el estado
      setEmailSent(true);
      setShowSuccessDialog(true);

      toast({
        title: "Solicitud enviada con éxito",
        description:
          "Nos pondremos en contacto contigo a la mayor brevedad con una cotización personalizada. Se ha adjuntado el informe en PDF al email.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error al enviar la solicitud por email:", error);

      toast({
        title: "Error al enviar solicitud",
        description:
          "Ha ocurrido un error al enviar tu solicitud. Por favor, inténtalo de nuevo más tarde.",
        variant: "destructive",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const effectiveSessionId = sessionId || getEffectiveSessionId();

        if (!effectiveSessionId) {
          throw new Error("No session ID found");
        }

        // Obtener datos de contacto
        const contactResponse = await fetch(
          `/api/contact?session_id=${effectiveSessionId}`
        );

        if (contactResponse.ok) {
          const contactResult = await contactResponse.json();
          if (contactResult.success && contactResult.data) {
            setContactData(contactResult.data);
          }
        }

        // Obtener recomendaciones
        const recommendationsResponse = await fetch(
          `/api/recomendaciones/danos-materiales?session_id=${effectiveSessionId}`
        );

        if (!recommendationsResponse.ok) {
          throw new Error(
            `Error fetching daños materiales advice: ${recommendationsResponse.statusText}`
          );
        }

        const recommendationsData = await recommendationsResponse.json();

        if (
          recommendationsData.success &&
          recommendationsData.recommendations &&
          recommendationsData.recommendations.length > 0
        ) {
          setRecommendation(recommendationsData.recommendations[0]);
        } else {
          setError(
            "No se encontró recomendación para el seguro de daños materiales"
          );
        }
      } catch (err: any) {
        console.error("Error in recomendaciones page:", err);
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [sessionId]);

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
            En base a las respuestas que has dado, tu seguro de daños materiales
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
      ) : recommendation ? (
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
                    <h3 className="text-sm font-medium text-gray-700">CIF:</h3>
                    <p className="text-base">
                      {recommendation.companyInfo.cif || "No especificado"}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700">
                      Dirección:
                    </h3>
                    <p className="text-base">
                      {recommendation.companyInfo.address || "No especificada"}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700">CNAE:</h3>
                    <p className="text-base">
                      {recommendation.companyInfo.cnae || "No especificado"}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700">
                      Actividad:
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
                      m² de las instalaciones:
                    </h3>
                    <p className="text-base">
                      {recommendation.companyInfo.m2 || "No especificado"} m²
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
                          Se hace constar que el Sr. o la empresa{" "}
                          {recommendation.companyInfo.owner_name} con NIF/DNI{" "}
                          {recommendation.companyInfo.owner_cif ||
                            "No especificado"}{" "}
                          tendrá el carácter de beneficiario de la Indemnización
                          en su calidad de propietario de las instalaciones.
                        </p>
                      </div>
                    )}
                </div>
              </div>

              {/* Características constructivas */}
              <h2 className="text-xl font-semibold mb-6 text-[#062A5A]">
                Características constructivas del inmueble
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700">
                    Estructura:
                  </h3>
                  <p className="text-base">
                    {recommendation.constructionInfo.estructura ||
                      "No especificado"}
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700">
                    Cubierta:
                  </h3>
                  <p className="text-base">
                    {recommendation.constructionInfo.cubierta ||
                      "No especificado"}
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700">
                    Cerramientos:
                  </h3>
                  <p className="text-base">
                    {recommendation.constructionInfo.cerramientos ||
                      "No especificado"}
                  </p>
                </div>
              </div>

              {/* Protecciones contra incendio */}
              <h2 className="text-xl font-semibold mb-6 text-[#062A5A]">
                Protecciones contra incendio
              </h2>
              <div className="mb-8">
                <ul className="list-disc pl-6 space-y-2">
                  {recommendation.protectionInfo.extintores && (
                    <li>Extintores</li>
                  )}
                  {recommendation.protectionInfo.bocas_incendio && (
                    <li>
                      Bocas de incendio equipadas (BIE)
                      {recommendation.protectionInfo.cobertura_total &&
                        " - Cobertura total"}
                      {recommendation.protectionInfo.deposito_bombeo &&
                        " - Con depósito propio y grupo de bombeo"}
                    </li>
                  )}
                  {recommendation.protectionInfo.columnas_hidrantes && (
                    <li>
                      Columnas hidrantes exteriores
                      {recommendation.protectionInfo.columnas_hidrantes_tipo &&
                        ` - Sistema ${recommendation.protectionInfo.columnas_hidrantes_tipo}`}
                    </li>
                  )}
                  {recommendation.protectionInfo.deteccion_automatica && (
                    <li>
                      Detección automática de incendios
                      {Array.isArray(
                        recommendation.protectionInfo.deteccion_zona
                      ) &&
                      recommendation.protectionInfo.deteccion_zona.length > 0 &&
                      recommendation.protectionInfo.deteccion_zona[0] ===
                        "totalidad"
                        ? " - Cobertura total"
                        : recommendation.protectionInfo.deteccion_zona &&
                          recommendation.protectionInfo.deteccion_zona.length >
                            0
                        ? ` - ${recommendation.protectionInfo.deteccion_zona.join(
                            ", "
                          )}`
                        : ""}
                    </li>
                  )}
                  {recommendation.protectionInfo.rociadores && (
                    <li>
                      Rociadores automáticos
                      {Array.isArray(
                        recommendation.protectionInfo.rociadores_zona
                      ) &&
                      recommendation.protectionInfo.rociadores_zona.length >
                        0 &&
                      recommendation.protectionInfo.rociadores_zona[0] ===
                        "totalidad"
                        ? " - Cobertura total"
                        : recommendation.protectionInfo.rociadores_zona &&
                          recommendation.protectionInfo.rociadores_zona.length >
                            0
                        ? ` - ${recommendation.protectionInfo.rociadores_zona.join(
                            ", "
                          )}`
                        : ""}
                    </li>
                  )}
                  {recommendation.protectionInfo.suministro_agua && (
                    <li>
                      Suministro de agua:{" "}
                      {recommendation.protectionInfo.suministro_agua.replace(
                        "_",
                        " "
                      )}
                    </li>
                  )}
                </ul>
                {!recommendation.protectionInfo.extintores &&
                  !recommendation.protectionInfo.bocas_incendio &&
                  !recommendation.protectionInfo.columnas_hidrantes &&
                  !recommendation.protectionInfo.deteccion_automatica &&
                  !recommendation.protectionInfo.rociadores && (
                    <p className="text-gray-500 italic">
                      No se han indicado protecciones contra incendio
                    </p>
                  )}
              </div>

              {/* Protecciones contra robo */}
              <h2 className="text-xl font-semibold mb-6 text-[#062A5A]">
                Protecciones contra robo
              </h2>
              <div className="mb-8">
                <ul className="list-disc pl-6 space-y-2">
                  {recommendation.protectionInfo.protecciones_fisicas && (
                    <li>Protecciones físicas (rejas, cerraduras...)</li>
                  )}
                  {recommendation.protectionInfo.vigilancia_propia && (
                    <li>El polígono cuenta con vigilancia propia</li>
                  )}
                  {recommendation.protectionInfo.alarma_conectada && (
                    <li>Alarma de robo conectada a central de alarma</li>
                  )}
                  {recommendation.protectionInfo.camaras_circuito && (
                    <li>Circuito Cerrado de Televisión/Cámaras</li>
                  )}
                </ul>
                {!recommendation.protectionInfo.protecciones_fisicas &&
                  !recommendation.protectionInfo.vigilancia_propia &&
                  !recommendation.protectionInfo.alarma_conectada &&
                  !recommendation.protectionInfo.camaras_circuito && (
                    <p className="text-gray-500 italic">
                      No se han indicado protecciones contra robo
                    </p>
                  )}
              </div>

              {/* Capitales a asegurar */}
              <h2 className="text-xl font-semibold mb-6 text-[#062A5A]">
                Capitales a asegurar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700">
                      Edificio:
                    </h3>
                    <p className="text-base">
                      {formatNumber(
                        recommendation.capitalesInfo.valor_edificio
                      )}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700">
                      Ajuar industrial:
                    </h3>
                    <p className="text-base">
                      {formatNumber(recommendation.capitalesInfo.valor_ajuar)}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700">
                      Existencias:
                    </h3>
                    <p className="text-base">
                      {formatNumber(
                        recommendation.capitalesInfo.valor_existencias
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700">
                      Equipos informáticos:
                    </h3>
                    <p className="text-base">
                      {formatNumber(
                        recommendation.capitalesInfo.valor_equipo_electronico
                      )}
                    </p>
                  </div>

                  {recommendation.capitalesInfo.margen_bruto_anual &&
                    recommendation.capitalesInfo.margen_bruto_anual > 0 && (
                      <>
                        <div className="mb-4">
                          <h3 className="text-sm font-medium text-gray-700">
                            Margen bruto anual:
                          </h3>
                          <p className="text-base">
                            {formatNumber(
                              recommendation.capitalesInfo.margen_bruto_anual
                            )}
                          </p>
                        </div>

                        {recommendation.capitalesInfo.periodo_indemnizacion && (
                          <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-700">
                              Periodo de indemnización:
                            </h3>
                            <p className="text-base">
                              {
                                recommendation.capitalesInfo
                                  .periodo_indemnizacion
                              }{" "}
                              meses
                            </p>
                          </div>
                        )}
                      </>
                    )}
                </div>
              </div>

              {/* Coberturas */}
              <h2 className="text-xl font-semibold mb-6 text-[#062A5A]">
                Coberturas
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
                            {coverage.limit ? `Límite: ${coverage.limit}` : ""}
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

              {/* Cláusulas especiales */}
              {recommendation.specialClauses &&
                recommendation.specialClauses.length > 0 && (
                  <>
                    <h2 className="text-xl font-semibold mb-6 text-[#062A5A]">
                      Cláusulas especiales
                    </h2>
                    <ul className="space-y-3 mb-8">
                      {recommendation.specialClauses
                        .filter((clause) => clause.required)
                        .map((clause, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-medium">{clause.name}</span>
                              {(clause.limit ||
                                clause.sublimit ||
                                clause.condition) && (
                                <span className="block text-sm text-gray-600 mt-1">
                                  {clause.limit
                                    ? `Límite: ${clause.limit}`
                                    : ""}
                                  {clause.sublimit
                                    ? ` - Sublímite: ${clause.sublimit}`
                                    : ""}
                                  {clause.condition
                                    ? clause.limit || clause.sublimit
                                      ? ` - ${clause.condition}`
                                      : clause.condition
                                    : ""}
                                </span>
                              )}
                            </div>
                          </li>
                        ))}
                    </ul>
                  </>
                )}
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button
                className="bg-[#062A5A] hover:bg-[#051d3e] flex items-center justify-center"
                onClick={handleSendRecommendationEmail}
                disabled={sendingEmail || emailSent}
              >
                {sendingEmail ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Enviando...
                  </div>
                ) : emailSent ? (
                  <div className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Solicitud enviada
                  </div>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Solicita cotización de tu seguro
                  </>
                )}
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
      ) : null}

      {/* Modal de éxito */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              ¡Solicitud enviada con éxito!
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="bg-green-100 rounded-full p-3 mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <p className="text-center mb-4">
              Tu solicitud de cotización para el seguro de Daños Materiales ha
              sido enviada correctamente.
            </p>
            <p className="text-center text-gray-600">
              Nos pondremos en contacto contigo a la mayor brevedad con una
              propuesta personalizada para tu empresa.
            </p>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button
              className="bg-[#062A5A] hover:bg-[#051d3e]"
              onClick={() => setShowSuccessDialog(false)}
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
