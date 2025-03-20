// components/Footer.tsx
import Link from "next/link";
import { Scale, Shield, FileText } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#062A5A] text-white py-12 px-6">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="text-[#FB2E25] mr-2">•</span>
              SmartAdvice
            </h3>
            <div className="h-1 w-20 bg-[#FB2E25] mb-4"></div>
            <p className="mb-4 text-gray-300">
              Gestiona tu empresa de manera autónoma y sencilla
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <span className="text-[#FC7A37] mr-2">›</span>Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="#como-funciona"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <span className="text-[#FC7A37] mr-2">›</span>Cómo funciona
                </Link>
              </li>
              <li>
                <Link
                  href="#preguntas-frecuentes"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <span className="text-[#FC7A37] mr-2">›</span>Preguntas
                  frecuentes
                </Link>
              </li>
              <li>
                <Link
                  href="/politica-privacidad"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <span className="text-[#FC7A37] mr-2">›</span>Política de
                  privacidad
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <p className="mb-3 text-gray-300 flex items-start">
              <span className="text-[#FB2E25] mr-2 mt-1">•</span>
              Email: info@smartadvice.es
            </p>
            <p className="mb-4 text-gray-300 flex items-start">
              <span className="text-[#FB2E25] mr-2 mt-1">•</span>
              Teléfono: +34 900 123 456
            </p>
            <div className="flex items-center space-x-4 mt-6">
              <Link
                href="#"
                aria-label="LinkedIn"
                className="bg-[#F5F2FB] text-[#062A5A] hover:bg-[#FB2E25] hover:text-white p-2 rounded-full transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </Link>
              <Link
                href="#"
                aria-label="Twitter"
                className="bg-[#F5F2FB] text-[#062A5A] hover:bg-[#FB2E25] hover:text-white p-2 rounded-full transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </Link>
              <Link
                href="#"
                aria-label="Instagram"
                className="bg-[#F5F2FB] text-[#062A5A] hover:bg-[#FB2E25] hover:text-white p-2 rounded-full transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <div className="mb-4 flex justify-center space-x-6">
            <div className="flex items-center text-sm text-gray-400">
              <Scale className="w-4 h-4 mr-2 text-[#FB2E25]" />
              <span>Asesoramiento legal</span>
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <Shield className="w-4 h-4 mr-2 text-[#FC7A37]" />
              <span>Protección garantizada</span>
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <FileText className="w-4 h-4 mr-2 text-[#FB2E25]" />
              <span>Documentación transparente</span>
            </div>
          </div>
          <p className="text-gray-400">
            © {currentYear} Smartadvice. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
