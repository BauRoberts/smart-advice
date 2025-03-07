// app/page.tsx (Hero Section Part)
"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  CheckCircle,
  Shield,
  Clock,
  Award,
  Scale,
  Gavel,
  FileText,
  BookOpen,
} from "lucide-react";
import Image from "next/image";

// Smart Advice branded hero section
const heroStyles = `
  .hero-background {
    background-color: #FFFFFF;
    position: relative;
  }
  
  .hero-background::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('/images/pattern.png');
    background-size: 200px;
    background-repeat: repeat;
    opacity: 0.05;
    z-index: 0;
  }
  
  .brand-accent {
    height: 4px;
    width: 120px;
    background-color: #FB2E25;
    margin: 0 auto 2rem auto;
  }
  
  .legal-tag {
    display: inline-block;
    padding: 0.5rem 1rem;
    background-color: rgba(6, 42, 90, 0.05);
    color: #062A5A;
    border-radius: 4px;
    font-weight: 500;
    margin-bottom: 1.5rem;
  }
  
  .legal-icon {
    color: #FB2E25;
    margin-right: 0.5rem;
    vertical-align: middle;
  }
  
  .feature-card {
    border-left: 3px solid #FB2E25;
    transition: all 0.2s ease;
  }
  
  .feature-card:nth-child(2) {
    border-left-color: #FC7A37;
  }
  
  .feature-card:nth-child(3) {
    border-left-color: #062A5A;
  }
  
  .feature-card:nth-child(4) {
    border-left-color: #FB2E25;
  }
  
  .feature-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }
  
  .primary-btn {
    background-color: #062A5A;
    border: none;
    transition: all 0.2s ease;
  }
  
  .primary-btn:hover {
    background-color: #051d3e; 
  }
  
  .secondary-btn {
    color: #062A5A;
    border-color: #062A5A;
  }
  
  .secondary-btn:hover {
    background-color: rgba(6, 42, 90, 0.05);
  }
`;

export default function Home() {
  return (
    <main className="min-h-screen">
      <style jsx>{heroStyles}</style>

      <Navbar />

      {/* Smart Advice branded hero section */}
      <section className="hero-background py-20 md:py-28 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/smart-advice-logo.png"
              alt="Smart Advice"
              width={120}
              height={120}
              className="mb-8"
            />
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <span className="legal-tag">
              <Scale className="legal-icon inline-block w-4 h-4" />
              Asesoramiento especializado
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Encuentra el seguro para &quot;abogados&quot; y &quot;despachos
              jurídicos&quot;
            </h1>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 italic mb-4">
              para tu despacho jurídico.
            </h2>

            <div className="brand-accent"></div>

            <p className="text-lg text-gray-700 mb-10 leading-relaxed">
              Simplificamos la elección de seguros para proteger tu práctica
              legal y responsabilidad profesional. Coberturas diseñadas
              específicamente para el sector legal.
            </p>

            {/* <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-10">
              <div className="feature-card flex items-start p-4 bg-white rounded-lg shadow-sm">
                <Gavel className="text-[#FB2E25] w-6 h-6 mt-1 shrink-0" />
                <div className="ml-4 text-left">
                  <h3 className="font-medium text-gray-900">
                    Responsabilidad Civil Profesional
                  </h3>
                  <p className="text-sm text-gray-600">
                    Protección para tu ejercicio profesional
                  </p>
                </div>
              </div>

              <div className="feature-card flex items-start p-4 bg-white rounded-lg shadow-sm">
                <FileText className="text-[#FC7A37] w-6 h-6 mt-1 shrink-0" />
                <div className="ml-4 text-left">
                  <h3 className="font-medium text-gray-900">
                    Protección de Datos
                  </h3>
                  <p className="text-sm text-gray-600">
                    Cobertura para información confidencial
                  </p>
                </div>
              </div>

              <div className="feature-card flex items-start p-4 bg-white rounded-lg shadow-sm">
                <Shield className="text-[#062A5A] w-6 h-6 mt-1 shrink-0" />
                <div className="ml-4 text-left">
                  <h3 className="font-medium text-gray-900">Ciberriesgos</h3>
                  <p className="text-sm text-gray-600">
                    Defensa ante amenazas digitales
                  </p>
                </div>
              </div>

              <div className="feature-card flex items-start p-4 bg-white rounded-lg shadow-sm">
                <BookOpen className="text-[#FB2E25] w-6 h-6 mt-1 shrink-0" />
                <div className="ml-4 text-left">
                  <h3 className="font-medium text-gray-900">
                    Continuidad de Negocio
                  </h3>
                  <p className="text-sm text-gray-600">
                    Garantizando la estabilidad de tu despacho
                  </p>
                </div>
              </div>
            </div> */}

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <Button asChild size="lg" className="primary-btn rounded-md px-8">
                <Link href="/seguros">Solicitar asesoramiento</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="secondary-btn rounded-md px-8"
              >
                <Link href="#como-funciona">
                  <span className="flex items-center">
                    Ver coberturas
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

            <p className="text-sm text-gray-500 italic">
              "El seguro perfecto para tu despacho jurídico, con la tranquilidad
              que tú y tus clientes merecen"
            </p>
          </div>
        </div>
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

            {/* Other benefits... */}
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
