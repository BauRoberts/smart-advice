"use client";

import { Suspense } from "react";
import DanosRecomendacionesContent from "@/components/DanosRecomendacionesContent";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Main page component with Suspense
export default function DanosRecomendacionesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Suspense
        fallback={
          <section className="py-12 px-6 bg-white">
            <div className="container mx-auto max-w-4xl text-center">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
                <div className="h-64 bg-gray-100 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
              </div>
              <p className="text-gray-600 mt-6">Cargando informe...</p>
            </div>
          </section>
        }
      >
        <DanosRecomendacionesContent />
      </Suspense>
      <Footer />
    </main>
  );
}
