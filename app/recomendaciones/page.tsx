'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getSessionId } from '@/lib/session';

interface Insurance {
  id: string;
  name: string;
  description: string;
  coberturas: Record<string, any>;
  ambito_territorial: string[];
  tipo: string;
}

interface Recommendation {
  id: string;
  form_id: string;
  insurance_id: string;
  created_at: string;
  insurance?: Insurance;
}

export default function RecomendacionesPage() {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  
  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const sessionId = getSessionId();
        
        if (!sessionId) {
          console.error('No session found');
          setLoading(false);
          return;
        }
        
        const response = await fetch(`/api/recommendations?session_id=${sessionId}`);
        const data = await response.json();
        
        if (data.success) {
          setRecommendations(data.recommendations);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchRecommendations();
  }, []);
  
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Tus Recomendaciones Personalizadas</h1>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-lg mb-4">Cargando recomendaciones...</p>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="space-y-6">
              {recommendations.map((recommendation) => (
                <div key={recommendation.id} className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-2">{recommendation.insurance?.name || 'Seguro recomendado'}</h2>
                  
                  {recommendation.insurance?.description && (
                    <p className="mb-4 text-gray-600">{recommendation.insurance.description}</p>
                  )}
                  
                  {recommendation.insurance?.coberturas && (
                    <div className="mb-4">
                      <h3 className="font-medium mb-2">Coberturas incluidas:</h3>
                      <ul className="list-disc list-inside">
                        {Object.entries(recommendation.insurance.coberturas)
                          .filter(([_, value]) => value === true)
                          .map(([key]) => (
                            <li key={key} className="ml-2">{key}</li>
                          ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="mt-6 flex space-x-4">
                    <Button className="flex-1">Solicitar más información</Button>
                    <Button variant="outline" className="flex-1">Ver detalles completos</Button>
                  </div>
                </div>
              ))}
              
              <div className="mt-10 text-center">
                <h3 className="text-lg font-semibold mb-4">¿Quieres comparar más opciones?</h3>
                <div className="flex justify-center gap-4 flex-wrap">
                  <Button asChild variant="outline">
                    <Link href="/seguros">Explorar más tipos de seguros</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/contacto">Hablar con un asesor</Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-semibold mb-4">No se encontraron recomendaciones</h2>
              <p className="mb-6">No hemos encontrado seguros que se ajusten a tus necesidades específicas.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/seguros">Probar con otro tipo de seguro</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/contacto">Contactar con un asesor</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Feedback section */}
      <section className="py-12 px-6 bg-blue-50">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold mb-4">¿Cómo ha sido tu experiencia?</h2>
          <p className="mb-6 text-gray-600">
            Nos encantaría saber tu opinión para seguir mejorando nuestro servicio.
          </p>
          <div className="flex justify-center space-x-2">
            <Button variant="outline">Excelente</Button>
            <Button variant="outline">Buena</Button>
            <Button variant="outline">Regular</Button>
            <Button variant="outline">Mejorable</Button>
          </div>
        </div>
      </section>

      {/* Let's also create an API endpoint */}
      <section className="py-12 px-6 bg-white border-t">
        <div className="container mx-auto max-w-3xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">¿Necesitas ayuda personalizada?</h2>
              <p className="mb-4 text-gray-600">
                Nuestros expertos en seguros están disponibles para ayudarte a encontrar la mejor cobertura para tu negocio.
              </p>
              <Button asChild size="lg">
                <Link href="/contacto">Solicitar asesoría gratuita</Link>
              </Button>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Contacto directo</h3>
              <p className="mb-1"><strong>Email:</strong> info@smart-advice.com</p>
              <p className="mb-1"><strong>Teléfono:</strong> +34 900 123 456</p>
              <p><strong>Horario:</strong> Lunes a Viernes, 9:00 - 18:00</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}