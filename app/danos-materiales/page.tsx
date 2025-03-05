// app/danos-materiales/page.tsx
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DanosMaterialesForm from '@/components/forms/DanosMaterialesForm';

export default function DanosMaterialesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="py-16 px-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8">Formulario de Daños Materiales</h1>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <p className="mb-6 text-gray-600">Completa el formulario para recibir recomendaciones personalizadas de seguros para proteger los bienes materiales de tu empresa.</p>
            
            <DanosMaterialesForm />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}