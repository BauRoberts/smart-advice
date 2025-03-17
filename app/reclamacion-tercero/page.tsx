// app/reclamacion-tercero/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowLeft,
  AlertCircle,
  Shield,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

export default function ReclamacionTerceroPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero section */}
      <section className="py-12 px-6 bg-[#F5F2FB]">
        <div className="container mx-auto max-w-4xl">
          <Link
            href="/siniestros"
            className="inline-flex items-center text-[#062A5A] mb-6 hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a tipos de siniestros
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Reclamación de un tercero
          </h1>

          <div className="h-1 w-24 bg-[#FB2E25] mb-6"></div>

          <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-8">
            <div className="flex">
              <AlertCircle className="h-6 w-6 text-orange-400 mr-3 flex-shrink-0" />
              <p className="text-orange-700">
                Si has recibido una reclamación de un tercero, debes seguir las
                siguientes recomendaciones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recomendaciones section */}
      <section className="py-12 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold mb-8 text-[#062A5A]">
            Pasos a seguir ante una reclamación
          </h2>

          <div className="space-y-6">
            <div className="bg-white border rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-[#062A5A] text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-3">
                  1
                </span>
                Revisa la causa de la reclamación
              </h3>
              <p className="text-gray-700 ml-11">
                Revisa si la causa está cubierta en la póliza y la franquicia.
                Toma los datos del tercero reclamante, nombre, dirección, email
                y teléfono de contacto.
              </p>
            </div>

            <div className="bg-white border rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-[#062A5A] text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-3">
                  2
                </span>
                Comunica la reclamación
              </h3>
              <p className="text-gray-700 ml-11">
                Comunica la reclamación lo antes posible a la compañía para que
                te proporcione defensa jurídica.
              </p>
            </div>

            <div className="bg-white border rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-[#062A5A] text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-3">
                  3
                </span>
                No reconozcas culpa
              </h3>
              <p className="text-gray-700 ml-11">
                Recuerda que no puedes reconocer culpa o hechos sin la
                autorización de la compañía.
              </p>
            </div>

            <div className="bg-white border rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-[#062A5A] text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-3">
                  4
                </span>
                Si tienes abogados propios
              </h3>
              <p className="text-gray-700 ml-11">
                Si tienes a tus propios abogados en el asunto, recuerda que la
                dirección jurídica pertenece a asegurada. Es la compañía la que
                fijará la estrategia a seguir.
              </p>
            </div>

            <div className="bg-white border rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-[#062A5A] text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-3">
                  5
                </span>
                Indemnización
              </h3>
              <p className="text-gray-700 ml-11">
                La indemnización que paga la compañía al tercero será la del
                valor del mercado del bien antes del siniestro + su depreciación
                (si corresponde).
              </p>
            </div>
          </div>

          <div className="mt-10 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center text-[#062A5A]">
              <Shield className="h-5 w-5 mr-2 text-[#FB2E25]" />
              Recomendaciones importantes
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>
                Documenta todo lo relacionado con la reclamación con fotos y
                evidencias.
              </li>
              <li>Mantén comunicación constante con tu compañía de seguros.</li>
              <li>
                Guarda copias de toda la documentación que envíes o recibas.
              </li>
              <li>
                No realices acuerdos directos con el reclamante sin consultar a
                la aseguradora.
              </li>
            </ul>
          </div>

          <div className="mt-10 flex justify-center">
            <Button asChild className="bg-[#062A5A] hover:bg-[#051d3e]">
              <Link href="/contacto">
                Necesito más ayuda con este tema
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
