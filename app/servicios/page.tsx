import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Shield,
  FileText,
  Building,
  Lock,
  FileSearch,
  Scale,
  FileSymlink,
  Database,
} from "lucide-react";
import { FaFire, FaGavel, FaHandshake } from "react-icons/fa"; // Nuevos íconos

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero section with branded style */}
      <section className="py-16 px-6 bg-[#F5F2FB] relative">
        <div className="container mx-auto text-center max-w-4xl">
          <span className="inline-block px-4 py-1 bg-[rgba(6,42,90,0.05)] text-[#062A5A] rounded-md font-medium mb-6">
            <Shield className="inline-block text-[#FB2E25] mr-2 w-4 h-4" />
            Smart Advice para tu empresa
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Asesórate sobre los siguientes cuestiones
          </h1>

          <div className="h-1 w-32 bg-[#FB2E25] mx-auto mb-6"></div>

          <p className="text-lg text-gray-700 mb-10 leading-relaxed">
            Encuentra la solución perfecta para tu empresa con nuestro
            asesoramiento personalizado
          </p>
        </div>
      </section>

      {/* Main categories section */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
            {/* SEGUROS PARA EMPRESAS */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-[#FB2E25] transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="p-5">
                <div className="flex justify-center mb-4">
                  <div className="bg-[rgba(251,46,37,0.1)] p-3 rounded-full">
                    <Shield className="w-8 h-8 text-[#FB2E25]" />
                  </div>
                </div>
                <h2 className="text-lg font-bold mb-2 text-center">
                  SEGUROS PARA EMPRESAS
                </h2>
                <div className="text-center mt-2">
                  <Button
                    asChild
                    className="bg-[#062A5A] hover:bg-[#051d3e] text-sm transition-colors"
                  >
                    <Link href="/seguros">Ver opciones</Link>
                  </Button>
                </div>
              </div>
            </div>
            {/* SINIESTROS */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-[#FC7A37] transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="p-5">
                <div className="flex justify-center mb-4">
                  <div className="bg-[rgba(252,122,55,0.1)] p-3 rounded-full">
                    <FaFire className="w-8 h-8 text-[#FC7A37]" />
                  </div>
                </div>
                <h2 className="text-lg font-bold mb-2 text-center">
                  SINIESTROS
                </h2>
                <div className="text-center mt-2">
                  <Button
                    asChild
                    className="bg-[#062A5A] hover:bg-[#051d3e] text-sm transition-colors"
                  >
                    <Link href="/siniestros">Ver opciones</Link>
                  </Button>
                </div>
              </div>
            </div>
            {/* GERENCIA DE RIESGOS INDUSTRIALES */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-gray-300 transition-all hover:shadow-lg">
              <div className="p-5 relative">
                <div className="absolute top-0 right-0 bg-gray-100 text-gray-600 text-xs font-medium py-1 px-2 rounded-bl-lg">
                  próximamente
                </div>
                <div className="flex justify-center mb-4">
                  <div className="bg-gray-100 p-3 rounded-full">
                    <Building className="w-8 h-8 text-gray-500" />
                  </div>
                </div>
                <h2 className="text-lg font-bold mb-2 text-center">
                  GERENCIA DE RIESGOS INDUSTRIALES
                </h2>
              </div>
            </div>

            {/* COMPLIANCE PROTECCION DE DATOS */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-gray-300 transition-all hover:shadow-lg">
              <div className="p-5 relative">
                <div className="absolute top-0 right-0 bg-gray-100 text-gray-600 text-xs font-medium py-1 px-2 rounded-bl-lg">
                  próximamente
                </div>
                <div className="flex justify-center mb-4">
                  <div className="bg-gray-100 p-3 rounded-full">
                    <Database className="w-8 h-8 text-gray-500" />
                  </div>
                </div>
                <h2 className="text-lg font-bold mb-2 text-center">
                  COMPLIANCE PROTECCION DE DATOS
                </h2>
              </div>
            </div>

            {/* CIBERSEGURIDAD */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-gray-300 transition-all hover:shadow-lg">
              <div className="p-5 relative">
                <div className="absolute top-0 right-0 bg-gray-100 text-gray-600 text-xs font-medium py-1 px-2 rounded-bl-lg">
                  próximamente
                </div>
                <div className="flex justify-center mb-4">
                  <div className="bg-gray-100 p-3 rounded-full">
                    <Lock className="w-8 h-8 text-gray-500" />
                  </div>
                </div>
                <h2 className="text-lg font-bold mb-2 text-center">
                  CIBERSEGURIDAD
                </h2>
              </div>
            </div>

            {/* GESTIONA TUS SEGUROS EN VIGOR */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-gray-300 transition-all hover:shadow-lg">
              <div className="p-5 relative">
                <div className="absolute top-0 right-0 bg-gray-100 text-gray-600 text-xs font-medium py-1 px-2 rounded-bl-lg">
                  próximamente
                </div>
                <div className="flex justify-center mb-4">
                  <div className="bg-gray-100 p-3 rounded-full">
                    <FileSearch className="w-8 h-8 text-gray-500" />
                  </div>
                </div>
                <h2 className="text-lg font-bold mb-2 text-center">
                  GESTIONA TUS SEGUROS EN VIGOR
                </h2>
              </div>
            </div>

            {/* ASESORAMIENTO LEGAL DIGITAL */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-gray-300 transition-all hover:shadow-lg">
              <div className="p-5 relative">
                <div className="absolute top-0 right-0 bg-gray-100 text-gray-600 text-xs font-medium py-1 px-2 rounded-bl-lg">
                  próximamente
                </div>
                <div className="flex justify-center mb-4">
                  <div className="bg-gray-100 p-3 rounded-full">
                    <Scale className="w-8 h-8 text-gray-500" />
                  </div>
                </div>
                <h2 className="text-lg font-bold mb-2 text-center">
                  ASESORAMIENTO LEGAL DIGITAL
                </h2>
              </div>
            </div>

            {/* MARCAS Y PATENTES */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-gray-300 transition-all hover:shadow-lg">
              <div className="p-5 relative">
                <div className="absolute top-0 right-0 bg-gray-100 text-gray-600 text-xs font-medium py-1 px-2 rounded-bl-lg">
                  próximamente
                </div>
                <div className="flex justify-center mb-4">
                  <div className="bg-gray-100 p-3 rounded-full">
                    <FileSymlink className="w-8 h-8 text-gray-500" />
                  </div>
                </div>
                <h2 className="text-lg font-bold mb-2 text-center">
                  MARCAS Y PATENTES
                </h2>
              </div>
            </div>

            {/* ASESORAMIENTO SOCIETARIO */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-gray-300 transition-all hover:shadow-lg">
              <div className="p-5 relative">
                <div className="absolute top-0 right-0 bg-gray-100 text-gray-600 text-xs font-medium py-1 px-2 rounded-bl-lg">
                  próximamente
                </div>
                <div className="flex justify-center mb-4">
                  <div className="bg-gray-100 p-3 rounded-full">
                    <FaHandshake className="w-8 h-8 text-gray-500" />
                  </div>
                </div>
                <h2 className="text-lg font-bold mb-2 text-center">
                  ASESORAMIENTO SOCIETARIO
                </h2>
              </div>
            </div>

            {/* MODELOS DE CONTRATOS MERCANTILES */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-gray-300 transition-all hover:shadow-lg">
              <div className="p-5 relative">
                <div className="absolute top-0 right-0 bg-gray-100 text-gray-600 text-xs font-medium py-1 px-2 rounded-bl-lg">
                  próximamente
                </div>
                <div className="flex justify-center mb-4">
                  <div className="bg-gray-100 p-3 rounded-full">
                    <FileText className="w-8 h-8 text-gray-500" />
                  </div>
                </div>
                <h2 className="text-lg font-bold mb-2 text-center">
                  MODELOS DE CONTRATOS MERCANTILES
                </h2>
              </div>
            </div>

            {/* SOLUCION DE CONFLICTOS Y RECLAMACIONES */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-gray-300 transition-all hover:shadow-lg">
              <div className="p-5 relative">
                <div className="absolute top-0 right-0 bg-gray-100 text-gray-600 text-xs font-medium py-1 px-2 rounded-bl-lg">
                  próximamente
                </div>
                <div className="flex justify-center mb-4">
                  <div className="bg-gray-100 p-3 rounded-full">
                    <FaGavel className="w-8 h-8 text-gray-500" />
                  </div>
                </div>
                <h2 className="text-lg font-bold mb-2 text-center">
                  SOLUCION DE CONFLICTOS Y RECLAMACIONES
                </h2>
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
            servicio ideal para tu empresa.
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
