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
        <div className="container mx-auto text-center max-w-2xl">
          <span className="inline-block px-4 py-1 bg-[rgba(6,42,90,0.05)] text-[#062A5A] rounded-md font-medium mb-6">
            <Shield className="inline-block text-[#FB2E25] mr-2 w-4 h-4" />
            Seguros para empresas
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Selecciona el tipo de siniestro
          </h1>

          <div className="h-1 w-32 bg-[#FB2E25] mx-auto mb-6"></div>

          <p className="text-lg text-gray-700 mb-10 leading-relaxed">
            Encuentra lo que necesitas en cuanto a siniestros y reclamaciones
          </p>
        </div>
      </section>

      {/* Insurance options section */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            {/* Responsabilidad Civil */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-[#FB2E25] transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="p-6">
                <div className="flex justify-center mb-6">
                  <div className="bg-[rgba(251,46,37,0.1)] p-3 rounded-full">
                    <Shield className="w-10 h-10 text-[#FB2E25]" />
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-2 text-center">
                  Reclamacion de un tercero
                </h2>
                <p className="text-gray-600 mb-6 text-center">
                  Si has recibido la reclamacion de un tercero, mira las
                  recomendaciones a tener en cuenta.
                </p>
                <Button
                  asChild
                  className="w-full bg-[#062A5A] hover:bg-[#051d3e] transition-colors"
                >
                  <Link href="/reclamacion-tercero">Seleccionar</Link>
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
                  Siniestro
                </h2>
                <p className="text-gray-600 mb-6 text-center">
                  Completa el formulario si has tenido un siniestro en tu
                  empresa
                </p>
                <Button
                  asChild
                  className="w-full bg-[#062A5A] hover:bg-[#051d3e] transition-colors"
                >
                  <Link href="/siniestros-form">Seleccionar</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Próximamente section */}
          <div className="mt-16"></div>
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
