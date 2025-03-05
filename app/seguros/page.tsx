import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SegurosPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="py-16 px-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center mb-12">
            Selecciona el tipo de seguro
          </h1>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Responsabilidad Civil */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">Responsabilidad Civil</h2>
                <p className="text-gray-600 mb-4">
                  Protege tu negocio frente a reclamaciones por daños a terceros.
                </p>
                <Button asChild className="w-full">
                  <Link href="/responsabilidad-civil">Seleccionar</Link>
                </Button>
              </div>
            </div>
            
            {/* Daños Materiales */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">Daños Materiales</h2>
                <p className="text-gray-600 mb-4">
                  Protege las instalaciones y bienes de tu empresa.
                </p>
                <Button asChild className="w-full">
                  <Link href="/danos-materiales">Seleccionar</Link>
                </Button>
              </div>
            </div>
            
            {/* Riesgos Adicionales */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">Riesgos Adicionales</h2>
                <p className="text-gray-600 mb-4">
                  Coberturas especiales para necesidades específicas.
                </p>
                <Button asChild className="w-full">
                  <Link href="/riesgos-adicionales">Seleccionar</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}