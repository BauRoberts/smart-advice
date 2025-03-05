import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  return (
    <header className="py-4 px-6 border-b">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Smart-Advice</h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium">
            Inicio
          </Link>
          <Link href="#como-funciona" className="text-sm font-medium">
            Cómo funciona
          </Link>
          <Link href="#preguntas-frecuentes" className="text-sm font-medium">
            Preguntas frecuentes
          </Link>
        </nav>
        
        <Button asChild>
          <Link href="/seguros">Encuentra tu seguro</Link>
        </Button>
      </div>
    </header>
  );
}