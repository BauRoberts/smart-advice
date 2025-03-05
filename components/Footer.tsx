import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12 px-6">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Smart-Advice</h3>
            <p className="mb-4">Simplificamos la elección de seguros para PYMEs y startups.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2">
              <li><Link href="/">Inicio</Link></li>
              <li><Link href="#como-funciona">Cómo funciona</Link></li>
              <li><Link href="#preguntas-frecuentes">Preguntas frecuentes</Link></li>
              <li><Link href="/politica-privacidad">Política de privacidad</Link></li>
              <li><Link href="/terminos-condiciones">Términos y condiciones</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <p className="mb-2">Email: info@smart-advice.com</p>
            <p className="mb-4">Teléfono: +34 900 123 456</p>
            <div className="flex space-x-4">
              <Link href="#" aria-label="LinkedIn">LinkedIn</Link>
              <Link href="#" aria-label="Twitter">Twitter</Link>
              <Link href="#" aria-label="Instagram">Instagram</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p>© {new Date().getFullYear()} Smart-Advice. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}