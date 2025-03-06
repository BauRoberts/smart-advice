// app/responsabilidad-civil/page.tsx
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ResponsabilidadCivilForm from '@/components/forms/ResponsabilidadCivilForm';

export default function ResponsabilidadCivilPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <ResponsabilidadCivilForm />
      <Footer />
    </main>
  );
}