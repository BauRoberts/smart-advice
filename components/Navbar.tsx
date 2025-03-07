// components/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Search } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="py-3 px-6 bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <div className="relative h-10 w-10 mr-2">
              <Image
                src="/images/smart-advice-logo.png"
                alt="Smart Advice Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold text-[#00000]">
              Smart-Advice
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="text-sm text-gray-700 hover:text-[#FB2E25] transition-colors"
          >
            Inicio
          </Link>
          <Link
            href="#como-funciona"
            className="text-sm text-gray-700 hover:text-[#FB2E25] transition-colors"
          >
            Cómo funciona
          </Link>
          <Link
            href="#preguntas-frecuentes"
            className="text-sm text-gray-700 hover:text-[#FB2E25] transition-colors"
          >
            Preguntas frecuentes
          </Link>

          <div className="relative group">
            <button className="flex items-center text-sm text-gray-700 hover:text-[#FB2E25] transition-colors">
              <span>Seguros</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-1 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </nav>

        {/* Search and CTA */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            className="text-gray-700 hover:text-[#FB2E25]"
            aria-label="Buscar"
          >
            <Search size={20} />
          </button>

          <Button
            asChild
            className="bg-[#062A5A] text-white hover:bg-[#051d3e]"
          >
            <Link href="/seguros">Encuentra tu seguro</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-700 hover:text-[#FB2E25] focus:outline-none"
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t shadow-lg z-50">
          <div className="container mx-auto px-6 py-4 space-y-4">
            <Link
              href="/"
              className="block py-2 text-base text-gray-700 hover:text-[#FB2E25]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="#como-funciona"
              className="block py-2 text-base text-gray-700 hover:text-[#FB2E25]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cómo funciona
            </Link>
            <Link
              href="#preguntas-frecuentes"
              className="block py-2 text-base text-gray-700 hover:text-[#FB2E25]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Preguntas frecuentes
            </Link>
            <Link
              href="/seguros"
              className="block py-2 text-base text-gray-700 hover:text-[#FB2E25]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Seguros
            </Link>
            <Button
              asChild
              className="w-full mt-4 bg-[#062A5A] text-white hover:bg-[#051d3e]"
            >
              <Link href="/seguros" onClick={() => setMobileMenuOpen(false)}>
                Encuentra tu seguro
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
