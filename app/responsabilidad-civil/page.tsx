// app/responsabilidad-civil/page.tsx
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ResponsabilidadCivilForm from '@/components/forms/ResponsabilidadCivilForm';

export default function ResponsabilidadCivilPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="py-16 px-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8">Formulario de Responsabilidad Civil</h1>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <p className="mb-6 text-gray-600">Completa el formulario para recibir recomendaciones personalizadas de seguros de responsabilidad civil para tu empresa.</p>
            
            <ResponsabilidadCivilForm />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}