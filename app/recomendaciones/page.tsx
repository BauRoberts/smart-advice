"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSessionId } from "@/lib/session";
import { Shield, HelpCircle } from "lucide-react";
import CombinedCoverageRecommendations from "@/components/CombinedCoverageRecommendations";

interface Coverage {
  name: string;
  required: boolean;
  condition?: string;
}

interface InsuranceRecommendation {
  type: "responsabilidad_civil" | "danos_materiales";
  coverages: Coverage[];
  ambitoTerritorial?: string;
}

// Componente que usará useSearchParams dentro de un Suspense
function RecommendationsContent() {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<
    InsuranceRecommendation[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  // Ahora esto está dentro de un componente envuelto en Suspense
  const searchParams = useSearchParams();
  const formType = searchParams.get("tipo") || null;

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const sessionId = getSessionId();

        if (!sessionId) {
          console.error("No session found");
          setLoading(false);
          return;
        }

        // Construir URL con o sin el parámetro de tipo
        let url = `/api/recomendaciones/coberturas?session_id=${sessionId}`;
        if (formType) {
          url += `&form_type=${formType}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Error al obtener asesoramiento: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          console.log("Asesoramiento recibido:", data.recommendations);
          setRecommendations(data.recommendations);
        } else {
          setError(data.error || "Error desconocido al obtener asesoramiento");
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setError(
          "No pudimos cargar tu asesoramiento. Por favor, intenta nuevamente."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [formType]); // Ejecutar cuando cambie el tipo de formulario

  if (loading) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <div className="animate-spin w-12 h-12 border-4 border-[#FB2E25] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-lg text-gray-700">Analizando tus respuestas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-600 mb-6">
          <HelpCircle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-semibold mb-4">Ocurrió un error</h2>
        <p className="mb-6 text-gray-600">{error}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-[#062A5A] hover:bg-[#051d3e]">
            <Link href="/seguros">Volver a intentar</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-6">
          <HelpCircle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-semibold mb-4">
          No se encontró asesoramiento
        </h2>
        <p className="mb-6 text-gray-600">
          {formType === "responsabilidad_civil"
            ? "No hemos encontrado información de formularios de Responsabilidad Civil completados."
            : formType === "danos_materiales"
            ? "No hemos encontrado información de formularios de Daños Materiales completados."
            : "No hemos encontrado información de formularios completados."}
          Por favor, completa el formulario para recibir asesoramiento
          personalizado.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-[#062A5A] hover:bg-[#051d3e]">
            <Link
              href={
                formType === "responsabilidad_civil"
                  ? "/responsabilidad-civil"
                  : formType === "danos_materiales"
                  ? "/danos-materiales"
                  : "/seguros"
              }
            >
              Completar formulario
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-[#062A5A] text-[#062A5A] hover:bg-[#F5F2FB]"
          >
            <Link href="/contacto">Contactar con un asesor</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Título del resultado */}

      <CombinedCoverageRecommendations recommendations={recommendations} />

      {/* CTA Section */}
      <section className="py-12 px-6 bg-white border-t mt-8">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold mb-4">
            ¿Qué hacer con este asesoramiento?
          </h2>
          <p className="mb-6 text-gray-600">
            Con esta información, puedes ahora solicitar presupuestos a
            diferentes aseguradoras o contactar con un asesor para encontrar la
            mejor opción para tu empresa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-[#062A5A] hover:bg-[#051d3e]">
              <Link href="/contacto">Contactar con un asesor</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

// Componente de carga para el Suspense
function LoadingFallback() {
  return (
    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
      <div className="animate-spin w-12 h-12 border-4 border-[#FB2E25] border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-lg text-gray-700">Cargando asesoramiento...</p>
    </div>
  );
}

// Componente principal que usa Suspense
export default function RecomendacionesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="py-16 px-6 bg-[#F5F2FB]">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-center mb-6">
            <span className="inline-block px-4 py-2 bg-[rgba(6,42,90,0.05)] text-[#062A5A] rounded-full font-medium text-sm">
              <Shield className="inline-block mr-2 h-4 w-4 text-[#FB2E25]" />
              Asesoramiento personalizado
            </span>
          </div>

          <h1 className="text-4xl font-bold text-center mb-4">
            Tu Seguro Debe Incluir Estas Coberturas
          </h1>

          <div className="h-1 w-32 bg-[#FB2E25] mx-auto mb-6"></div>

          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            DE ACUERDO CON LA INFORMACIÓN PROPORCIONADA NECESITAS UN SEGURO QUE
            CUMPLA CON ESTAS CARACTERÍSTICAS
          </p>

          {/* Suspense boundary para useSearchParams */}
          <Suspense fallback={<LoadingFallback />}>
            <RecommendationsContent />
          </Suspense>
        </div>
      </section>

      <Footer />
    </main>
  );
}
