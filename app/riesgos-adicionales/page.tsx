import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function RiesgosAdicionalesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="py-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold mb-8">Formulario de Riesgos Adicionales</h1>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <p className="mb-6 text-gray-600">Completa el formulario para recibir recomendaciones personalizadas.</p>
            
            {/* Form will be added here */}
            <div className="py-4 text-center">
              <p className="mb-4 font-medium">Formulario en desarrollo</p>
              <Button asChild>
                <Link href="/seguros">Volver a tipos de seguro</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}