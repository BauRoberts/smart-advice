// app/seguros/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, FileText, AlertTriangle } from "lucide-react";

export default function SegurosPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero section with branded style */}
      <section className="py-16 px-6 bg-[#F5F2FB] relative">
        <div className="container mx-auto text-center max-w-3xl">
          <span className="inline-block px-4 py-1 bg-[rgba(6,42,90,0.05)] text-[#062A5A] rounded-md font-medium mb-6">
            <Shield className="inline-block text-[#FB2E25] mr-2 w-4 h-4" />
            Seguros para empresas
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Selecciona el tipo de seguro
          </h1>

          <div className="h-1 w-32 bg-[#FB2E25] mx-auto mb-6"></div>

          <p className="text-lg text-gray-700 mb-10 leading-relaxed">
            Encuentra la cobertura perfecta para tu empresa con nuestras
            soluciones personalizadas
          </p>
        </div>
      </section>

      {/* Insurance options section */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Responsabilidad Civil */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-[#FB2E25] transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="p-6">
                <div className="flex justify-center mb-6">
                  <div className="bg-[rgba(251,46,37,0.1)] p-3 rounded-full">
                    <Shield className="w-10 h-10 text-[#FB2E25]" />
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-2 text-center">
                  Responsabilidad Civil
                </h2>
                <p className="text-gray-600 mb-6 text-center">
                  Protege tu negocio frente a reclamaciones por daños a terceros
                  durante el desarrollo de tu actividad.
                </p>
                <Button
                  asChild
                  className="w-full bg-[#062A5A] hover:bg-[#051d3e] transition-colors"
                >
                  <Link href="/responsabilidad-civil">Seleccionar</Link>
                </Button>
              </div>
            </div>

            {/* Daños Materiales */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-[#FC7A37] transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="p-6">
                <div className="flex justify-center mb-6">
                  <div className="bg-[rgba(252,122,55,0.1)] p-3 rounded-full">
                    <FileText className="w-10 h-10 text-[#FC7A37]" />
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-2 text-center">
                  Daños Materiales
                </h2>
                <p className="text-gray-600 mb-6 text-center">
                  Protege las instalaciones, equipamiento y bienes de tu empresa
                  frente a diversos riesgos.
                </p>
                <Button
                  asChild
                  className="w-full bg-[#062A5A] hover:bg-[#051d3e] transition-colors"
                >
                  <Link href="/danos-materiales">Seleccionar</Link>
                </Button>
              </div>
            </div>

            {/* Riesgos Adicionales */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-[#062A5A] transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="p-6">
                <div className="flex justify-center mb-6">
                  <div className="bg-[rgba(6,42,90,0.1)] p-3 rounded-full">
                    <AlertTriangle className="w-10 h-10 text-[#062A5A]" />
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-2 text-center">
                  Riesgos Adicionales
                </h2>
                <p className="text-gray-600 mb-6 text-center">
                  Coberturas especiales diseñadas para necesidades específicas
                  de tu sector o actividad.
                </p>
                <Button
                  asChild
                  className="w-full bg-[#062A5A] hover:bg-[#051d3e] transition-colors"
                >
                  <Link href="/riesgos-adicionales">Seleccionar</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-12 px-6 bg-[#062A5A] text-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold mb-4">
            ¿Necesitas ayuda para elegir?
          </h2>
          <p className="mb-8">
            Nuestros asesores están disponibles para guiarte en la selección del
            seguro ideal para tu empresa.
          </p>
          <Button
            asChild
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white hover:text-[#062A5A] transition-colors"
          >
            <Link href="/contacto">Contactar con un asesor</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
