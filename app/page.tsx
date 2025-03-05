import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Encuentra el seguro perfecto para tu PYME en minutos
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600">
            Simplificamos la elección de seguros para tu negocio
          </p>
          <Button asChild size="lg" className="px-8 py-6 text-lg">
            <Link href="/seguros">Encuentra tu seguro</Link>
          </Button>

        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Beneficios
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Rápido y sencillo</h3>
              <p className="text-gray-600">Completa el formulario en minutos.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Personalizado</h3>
              <p className="text-gray-600">Seguros adaptados a tu negocio.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Sin compromiso</h3>
              <p className="text-gray-600">No necesitas registrarte.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Expertos en PYMES</h3>
              <p className="text-gray-600">Diseñado para pequeñas y medianas empresas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="como-funciona" className="py-16 px-6 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Cómo funciona
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Completa el formulario</h3>
              <p className="text-gray-600">Responde a unas sencillas preguntas sobre tu negocio.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Recibe recomendaciones</h3>
              <p className="text-gray-600">Obtendrás sugerencias personalizadas para tu PYME.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Compara y elige</h3>
              <p className="text-gray-600">Analiza las opciones y selecciona la más adecuada.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="preguntas-frecuentes" className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Preguntas frecuentes
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">¿Necesito registrarme?</h3>
              <p className="text-gray-600">No, no necesitas crear una cuenta para utilizar nuestro servicio. Simplemente completa el formulario y recibe recomendaciones personalizadas.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">¿Cómo se generan las recomendaciones?</h3>
              <p className="text-gray-600">Nuestro sistema analiza tus respuestas y las compara con nuestra base de datos de seguros para encontrar las opciones más adecuadas para tu negocio.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">¿Puedo contratar directamente?</h3>
              <p className="text-gray-600">Te pondremos en contacto con los proveedores de seguros para que puedas finalizar la contratación según tus preferencias.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">¿Es seguro compartir mi información?</h3>
              <p className="text-gray-600">Absolutamente. Todos tus datos están protegidos y solo se utilizan para generar recomendaciones personalizadas. No compartimos tu información con terceros sin tu consentimiento.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 px-6 bg-blue-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            ¿Listo para proteger tu negocio?
          </h2>
          <Button asChild size="lg" className="px-8 py-6 text-lg">
            <Link href="/seguros">Encuentra tu seguro</Link>
          </Button>   
        </div>
      </section>

      <Footer />
    </main>
  );
}