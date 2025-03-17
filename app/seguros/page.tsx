// app/seguros/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Shield,
  FileText,
  AlertTriangle,
  User,
  Truck,
  Leaf,
  Cloud,
  Briefcase,
} from "lucide-react";

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
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
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
                  Protege tu inversión, instalaciones y bienes de tu empresa
                  frente a hechos accidentales.
                </p>
                <Button
                  asChild
                  className="w-full bg-[#062A5A] hover:bg-[#051d3e] transition-colors"
                >
                  <Link href="/danos-materiales">Seleccionar</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Próximamente section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-4">
              Próximamente disponibles
            </h2>
            <div className="h-1 w-24 bg-[#FB2E25] mx-auto mb-12"></div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Responsabilidad Civil Profesional */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-gray-300 transition-all hover:shadow-lg">
                <div className="p-6 relative">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gray-100 p-3 rounded-full">
                      <User className="w-8 h-8 text-gray-500" />
                    </div>
                  </div>
                  <h2 className="text-lg font-bold mb-2 text-center">
                    Seguro de Responsabilidad Civil Profesional
                  </h2>
                  <div className="absolute top-0 right-0 bg-gray-100 text-gray-600 text-xs font-medium py-1 px-2 rounded-bl-lg">
                    próximamente
                  </div>
                </div>
              </div>

              {/* Seguro Medioambiental */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-gray-300 transition-all hover:shadow-lg">
                <div className="p-6 relative">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gray-100 p-3 rounded-full">
                      <Leaf className="w-8 h-8 text-gray-500" />
                    </div>
                  </div>
                  <h2 className="text-lg font-bold mb-2 text-center">
                    Seguro Medioambiental
                  </h2>
                  <div className="absolute top-0 right-0 bg-gray-100 text-gray-600 text-xs font-medium py-1 px-2 rounded-bl-lg">
                    próximamente
                  </div>
                </div>
              </div>

              {/* Seguro de Transportes de Mercancías */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-gray-300 transition-all hover:shadow-lg">
                <div className="p-6 relative">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gray-100 p-3 rounded-full">
                      <Truck className="w-8 h-8 text-gray-500" />
                    </div>
                  </div>
                  <h2 className="text-lg font-bold mb-2 text-center">
                    Seguro de Transportes de Mercancías
                  </h2>
                  <div className="absolute top-0 right-0 bg-gray-100 text-gray-600 text-xs font-medium py-1 px-2 rounded-bl-lg">
                    próximamente
                  </div>
                </div>
              </div>

              {/* Seguro Ciber */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-gray-300 transition-all hover:shadow-lg">
                <div className="p-6 relative">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gray-100 p-3 rounded-full">
                      <Cloud className="w-8 h-8 text-gray-500" />
                    </div>
                  </div>
                  <h2 className="text-lg font-bold mb-2 text-center">
                    Seguro Ciber
                  </h2>
                  <div className="absolute top-0 right-0 bg-gray-100 text-gray-600 text-xs font-medium py-1 px-2 rounded-bl-lg">
                    próximamente
                  </div>
                </div>
              </div>

              {/* Seguro D&O */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-gray-300 transition-all hover:shadow-lg">
                <div className="p-6 relative">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gray-100 p-3 rounded-full">
                      <Briefcase className="w-8 h-8 text-gray-500" />
                    </div>
                  </div>
                  <h2 className="text-lg font-bold mb-2 text-center">
                    Seguro de Responsabilidad Civil de Administradores y
                    Directivos
                  </h2>
                  <div className="absolute top-0 right-0 bg-gray-100 text-gray-600 text-xs font-medium py-1 px-2 rounded-bl-lg">
                    próximamente
                  </div>
                </div>
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
