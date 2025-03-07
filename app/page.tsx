// app/page.tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, Shield, Clock, Award } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="py-16 md:py-24 overflow-hidden bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Encuentra el seguro
            </h1>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 italic mb-8">
              para tu PYME.
            </h2>

            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              Simplificamos la elección de seguros para proteger los bienes y
              responsabilidades de tu negocio.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Button
                asChild
                size="lg"
                className="bg-black text-white hover:bg-gray-800 rounded-md px-8"
              >
                <Link href="/seguros">Comenzar ahora</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-black border-gray-300 hover:bg-gray-100 rounded-md px-8"
              >
                <Link href="#como-funciona">
                  <span className="flex items-center">
                    Cómo funciona
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Service showcase section
        <div className="mt-16 max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-4 md:col-span-2 rounded-lg overflow-hidden shadow-md">
              <div className="bg-blue-50 h-72 w-full flex items-center justify-center">
                <div className="text-center p-6">
                  <h3 className="text-xl font-bold mb-2">
                    Responsabilidad Civil
                  </h3>
                  <p className="text-gray-600">
                    Protege tu negocio frente a reclamaciones por daños a
                    terceros
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-2 md:col-span-1 rounded-lg overflow-hidden shadow-md">
              <div className="bg-blue-50 h-72 w-full flex items-center justify-center">
                <div className="text-center p-4">
                  <h3 className="text-lg font-bold mb-2">Daños Materiales</h3>
                  <p className="text-gray-600 text-sm">
                    Protege tus instalaciones y bienes
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-2 md:col-span-1 rounded-lg overflow-hidden shadow-md">
              <div className="bg-blue-50 h-72 w-full flex items-center justify-center">
                <div className="text-center p-4">
                  <h3 className="text-lg font-bold mb-2">
                    Riesgos Adicionales
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Coberturas especiales para necesidades específicas
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <span className="text-xs text-gray-400">Smart-Advice 2023</span>
          </div>
        </div>*/}
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white" id="beneficios">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Protege tu negocio de forma sencilla
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Benefit 1 */}
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center mb-4">
                <Clock className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">
                Rápido y sencillo
              </h3>
              <p className="text-gray-600 text-center">
                Completa el formulario en minutos y recibe recomendaciones
                personalizadas.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">
                Personalizado
              </h3>
              <p className="text-gray-600 text-center">
                Seguros adaptados a las necesidades específicas de tu negocio.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center mb-4">
                <Shield className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">
                Sin compromiso
              </h3>
              <p className="text-gray-600 text-center">
                No necesitas registrarte para recibir recomendaciones de
                seguros.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center mb-4">
                <Award className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">
                Expertos en PYMES
              </h3>
              <p className="text-gray-600 text-center">
                Plataforma diseñada específicamente para pequeñas y medianas
                empresas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 bg-gray-50" id="como-funciona">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">Cómo funciona</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Obten recomendaciones de seguros en tres sencillos pasos, sin
            necesidad de registro
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="relative bg-white p-6 rounded-lg shadow-sm">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3 mt-2">
                Completa el formulario
              </h3>
              <p className="text-gray-600">
                Responde a unas sencillas preguntas sobre tu empresa y sus
                necesidades específicas.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative bg-white p-6 rounded-lg shadow-sm">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3 mt-2">
                Recibe recomendaciones
              </h3>
              <p className="text-gray-600">
                Nuestro sistema analiza tus respuestas y te muestra las mejores
                opciones para tu negocio.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative bg-white p-6 rounded-lg shadow-sm">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3 mt-2">
                Compara y elige
              </h3>
              <p className="text-gray-600">
                Revisa las coberturas y precios para seleccionar la opción que
                mejor se adapte a tus necesidades.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/seguros">Comenzar ahora</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white" id="preguntas-frecuentes">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Preguntas frecuentes
          </h2>

          <div className="max-w-3xl mx-auto space-y-6">
            {/* FAQ Item 1 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">
                ¿Necesito registrarme?
              </h3>
              <p className="text-gray-600">
                No, nuestra plataforma no requiere registro. Simplemente
                completa el formulario y recibe recomendaciones personalizadas
                al instante.
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">
                ¿Cómo se generan las recomendaciones?
              </h3>
              <p className="text-gray-600">
                Analizamos tus respuestas y las comparamos con nuestra base de
                datos de seguros para encontrar las mejores opciones que se
                adapten a tus necesidades específicas.
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">
                ¿Puedo contratar directamente?
              </h3>
              <p className="text-gray-600">
                Te ponemos en contacto con los proveedores de seguros para que
                puedas finalizar la contratación directamente con ellos.
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">
                ¿Es seguro compartir mi información?
              </h3>
              <p className="text-gray-600">
                Absolutamente. Toda la información que proporcionas está
                protegida y solo se utiliza para generar recomendaciones
                personalizadas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            ¿Listo para proteger tu negocio?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Obtén recomendaciones de seguros personalizadas para tu PYME en
            minutos.
          </p>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="bg-white hover:bg-gray-100 text-blue-600 border-white"
          >
            <Link href="/seguros">Comenzar ahora</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
