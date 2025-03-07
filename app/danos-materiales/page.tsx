// app/danos-materiales/page.tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DanosMaterialesForm from "@/components/forms/DanosMaterialesForm";

export default function DanosMaterialesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <DanosMaterialesForm />
      <Footer />
    </main>
  );
}
