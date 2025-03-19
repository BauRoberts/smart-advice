// app/recomendaciones/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getEffectiveSessionId } from "@/lib/session";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import EmailRecommendations from "@/components/EmailRecommendations";

interface Coverage {
  name: string;
  required: boolean;
  condition?: string;
}

interface InsuranceRecommendation {
  type: string;
  coverages: Coverage[];
  ambitoTerritorial?: string;
  limits?: {
    generalLimit: string;
    victimSubLimit: string;
    explanation?: string;
  };
}

// Create a separate client component for the content that uses useSearchParams
function AsesoramientoContent() {
  const [coverages, setCoverages] = useState<InsuranceRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const tipo = searchParams.get("tipo");

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        setLoading(true);
        const sessionId = getEffectiveSessionId();

        console.log("===== ASESORAMIENTO PAGE DEBUG =====");
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

        if (coveragesData.success && coveragesData.recommendations) {
          setCoverages(coveragesData.recommendations);
          console.log(
            "Coverage advice found:",
            coveragesData.recommendations.length
          );
        } else {
          console.warn("No coverage advice found or unsuccessful response");
        }
      } catch (err: any) {
        console.error("Error in asesoramiento page:", err);
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [tipo]);

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
            Asesoramiento personalizado
          </h1>

          <div className="h-1 w-24 bg-[#FB2E25] mb-6"></div>

          <p className="text-gray-700 text-lg max-w-2xl">
            Basado en la información proporcionada en tu formulario, hemos
            creado un asesoramiento personalizado para las necesidades de tu
            negocio.
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
                    Error al cargar el asesoramiento
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
              Preparando tu asesoramiento personalizado...
            </p>
          </div>
        </section>
      ) : (
        <>
          {/* Main content */}
          <section className="py-12 px-6 bg-white">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl font-bold mb-8 text-[#062A5A]">
                {tipo === "responsabilidad_civil"
                  ? "Asesoramiento para seguro de Responsabilidad Civil"
                  : tipo === "danos_materiales"
                  ? "Asesoramiento para seguro de Daños Materiales"
                  : "Asesoramiento de seguros para tu negocio"}
              </h2>

              {coverages && coverages.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="md:col-span-2">
                      {coverages.map((rec, index) => (
                        <div key={index} className="mb-10">
                          <div className="bg-white border rounded-lg shadow-sm p-6 mb-6">
                            <h3 className="text-xl font-semibold mb-4 flex items-center text-[#062A5A]">
                              <Shield className="h-5 w-5 mr-2 text-[#FB2E25]" />
                              {rec.type === "responsabilidad_civil"
                                ? "Seguro de Responsabilidad Civil"
                                : "Seguro de Daños Materiales"}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div>
                                {rec.ambitoTerritorial && (
                                  <div className="mb-6">
                                    <h4 className="font-medium text-gray-700 mb-2">
                                      Ámbito territorial recomendado
                                    </h4>
                                    <p className="bg-[#F5F2FB] p-3 rounded-md border border-gray-200 text-[#062A5A] font-medium">
                                      {rec.ambitoTerritorial}
                                    </p>
                                  </div>
                                )}

                                {rec.limits && (
                                  <div className="mb-6">
                                    <h4 className="font-medium text-gray-700 mb-2">
                                      Límites recomendados
                                    </h4>
                                    <div className="bg-[#F5F2FB] p-4 rounded-md border border-gray-200">
                                      <div className="flex justify-between mb-2">
                                        <span className="text-gray-600">
                                          Límite general:
                                        </span>
                                        <span className="font-semibold text-[#062A5A]">
                                          {rec.limits.generalLimit}
                                        </span>
                                      </div>

                                      {rec.limits.victimSubLimit && (
                                        <div className="flex justify-between mb-2">
                                          <span className="text-gray-600">
                                            Sublímite por víctima:
                                          </span>
                                          <span className="font-semibold text-[#062A5A]">
                                            {rec.limits.victimSubLimit}
                                          </span>
                                        </div>
                                      )}

                                      {rec.limits.explanation && (
                                        <p className="text-xs text-gray-600 mt-2 italic">
                                          {rec.limits.explanation}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div>
                                <h4 className="font-medium text-gray-700 mb-2">
                                  Coberturas necesarias
                                </h4>
                                <div className="bg-[#F5F2FB] p-4 rounded-md border border-gray-200 mb-4">
                                  <ul className="space-y-2">
                                    {rec.coverages
                                      .filter((cov) => cov.required)
                                      .map((cov, i) => (
                                        <li
                                          key={i}
                                          className="flex items-start"
                                        >
                                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                          <div>
                                            <span className="text-sm font-medium">
                                              {cov.name}
                                            </span>
                                            {cov.condition && (
                                              <span className="block text-xs text-gray-500 mt-0.5">
                                                {cov.condition}
                                              </span>
                                            )}
                                          </div>
                                        </li>
                                      ))}
                                  </ul>
                                </div>

                                {rec.coverages.some((cov) => !cov.required) && (
                                  <>
                                    <h4 className="font-medium text-gray-700 mb-2">
                                      Coberturas opcionales
                                    </h4>
                                    <div className="bg-[#F5F2FB] p-4 rounded-md border border-gray-200">
                                      <ul className="space-y-2">
                                        {rec.coverages
                                          .filter((cov) => !cov.required)
                                          .slice(0, 5) // Limit to first 5 optional coverages
                                          .map((cov, i) => (
                                            <li
                                              key={i}
                                              className="flex items-start"
                                            >
                                              <span className="text-gray-400 mr-2 flex-shrink-0 mt-0.5">
                                                ○
                                              </span>
                                              <div>
                                                <span className="text-sm">
                                                  {cov.name}
                                                </span>
                                                {cov.condition && (
                                                  <span className="block text-xs text-gray-500 mt-0.5">
                                                    {cov.condition}
                                                  </span>
                                                )}
                                              </div>
                                            </li>
                                          ))}
                                      </ul>

                                      {rec.coverages.filter(
                                        (cov) => !cov.required
                                      ).length > 5 && (
                                        <p className="text-xs text-gray-500 mt-2 italic">
                                          Y{" "}
                                          {rec.coverages.filter(
                                            (cov) => !cov.required
                                          ).length - 5}{" "}
                                          coberturas opcionales más
                                        </p>
                                      )}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="bg-[#F5F2FB] border border-gray-200 rounded-lg p-6 mt-8">
                        <h3 className="text-xl font-semibold mb-4 text-[#062A5A]">
                          ¿Qué hacer con este asesoramiento?
                        </h3>
                        <p className="text-gray-700 mb-6">
                          Este asesoramiento personalizado te ayudará a entender
                          qué coberturas necesita tu negocio y qué
                          características debe tener tu póliza de seguro. Para
                          obtener una cotización específica o resolver dudas
                          sobre este asesoramiento, te recomendamos contactar
                          con uno de nuestros agentes especializados.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Button
                            asChild
                            className="bg-[#062A5A] hover:bg-[#051d3e]"
                          >
                            <Link href="/contacto">
                              Contactar con un agente
                            </Link>
                          </Button>
                          <Button
                            asChild
                            variant="outline"
                            className="border-[#062A5A] text-[#062A5A] hover:bg-[#F5F2FB]"
                          >
                            <Link href="/seguros">Explorar más seguros</Link>
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Email recommendations sidebar */}
                    <div className="md:col-span-1">
                      <EmailRecommendations tipo={tipo || undefined} />
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-yellow-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        No se encontró asesoramiento
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          No se pudo generar un asesoramiento para los datos
                          proporcionados.
                        </p>
                      </div>
                      <div className="mt-4">
                        <Button
                          asChild
                          className="bg-[#062A5A] hover:bg-[#051d3e] text-sm"
                        >
                          <Link href="/seguros">Volver a seguros</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </>
  );
}

// Main page component that wraps the content with Suspense
export default function AsesoramientoPage() {
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
              <p className="text-gray-600 mt-6">Cargando asesoramiento...</p>
            </div>
          </section>
        }
      >
        <AsesoramientoContent />
      </Suspense>
      <Footer />
    </main>
  );
}
