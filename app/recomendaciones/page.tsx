"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSessionId } from "@/lib/session";
import { Shield, CheckCircle, FileText, HelpCircle } from "lucide-react";

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

// Smart Advice branded styles
const recommendationStyles = `
  .brand-accent {
    height: 4px;
    width: 120px;
    background-color: #FB2E25;
    margin: 0 auto 2rem auto;
  }
  
  .recommendation-card {
    border-left: 3px solid #FB2E25;
    transition: all 0.2s ease;
  }
  
  .recommendation-card:nth-child(2n) {
    border-left-color: #FC7A37;
  }
  
  .recommendation-card:nth-child(3n) {
    border-left-color: #062A5A;
  }
  
  .recommendation-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }
  
  .primary-btn {
    background-color: #062A5A;
    border: none;
    transition: all 0.2s ease;
  }
  
  .primary-btn:hover {
    background-color: #051d3e; 
  }
  
  .secondary-btn {
    color: #062A5A;
    border-color: #062A5A;
  }
  
  .secondary-btn:hover {
    background-color: rgba(6, 42, 90, 0.05);
  }
  
  .feedback-btn {
    transition: all 0.2s ease;
  }
  
  .feedback-btn:hover {
    background-color: #062A5A;
    color: white;
  }
`;

export default function RecomendacionesPage() {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const sessionId = getSessionId();

        if (!sessionId) {
          console.error("No session found");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `/api/recommendations?session_id=${sessionId}`
        );
        const data = await response.json();

        if (data.success) {
          setRecommendations(data.recommendations);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, []);

  return (
    <main className="min-h-screen">
      <style jsx>{recommendationStyles}</style>
      <Navbar />

      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-center mb-6">
            <span className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full font-medium text-sm">
              Resultados personalizados
            </span>
          </div>

          <h1 className="text-4xl font-bold text-center mb-4">
            Tus Recomendaciones Personalizadas
          </h1>

          <div className="brand-accent"></div>

          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Hemos analizado tus respuestas y seleccionado las mejores opciones
            de seguros para tu empresa
          </p>

          {loading ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-lg text-gray-700">
                Cargando recomendaciones...
              </p>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="space-y-6">
              {recommendations.map((recommendation, index) => (
                <div
                  key={recommendation.id}
                  className={`recommendation-card bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all`}
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-full p-2 bg-blue-50 flex-shrink-0">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold mb-2">
                        {recommendation.insurance?.name || "Seguro recomendado"}
                      </h2>

                      {recommendation.insurance?.description && (
                        <p className="mb-4 text-gray-600">
                          {recommendation.insurance.description}
                        </p>
                      )}

                      {recommendation.insurance?.coberturas && (
                        <div className="mb-4 bg-gray-50 p-4 rounded-md">
                          <h3 className="font-medium mb-2 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            Coberturas incluidas:
                          </h3>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {Object.entries(recommendation.insurance.coberturas)
                              .filter(([_, value]) => value === true)
                              .map(([key]) => (
                                <li
                                  key={key}
                                  className="flex items-start gap-2"
                                >
                                  <span className="text-green-500 mt-0.5">
                                    ✓
                                  </span>
                                  <span>{key}</span>
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}

                      <div className="mt-6 flex flex-col sm:flex-row gap-4">
                        <Button className="flex-1 primary-btn">
                          Solicitar más información
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 secondary-btn"
                        >
                          Ver detalles completos
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-10 text-center bg-gray-50 p-8 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">
                  ¿Quieres comparar más opciones?
                </h3>
                <p className="text-gray-600 mb-6">
                  Explora otras opciones de seguros o consulta con uno de
                  nuestros expertos para una asesoría personalizada.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button asChild variant="outline" className="secondary-btn">
                    <Link href="/seguros">Explorar más tipos de seguros</Link>
                  </Button>
                  <Button asChild className="primary-btn">
                    <Link href="/contacto">Hablar con un asesor</Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-6">
                <HelpCircle className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-semibold mb-4">
                No se encontraron recomendaciones
              </h2>
              <p className="mb-6 text-gray-600">
                No hemos encontrado seguros que se ajusten a tus necesidades
                específicas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="primary-btn">
                  <Link href="/seguros">Probar con otro tipo de seguro</Link>
                </Button>
                <Button asChild variant="outline" className="secondary-btn">
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
          <h2 className="text-2xl font-bold mb-4">
            ¿Cómo ha sido tu experiencia?
          </h2>
          <p className="mb-6 text-gray-600">
            Nos encantaría saber tu opinión para seguir mejorando nuestro
            servicio.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" className="feedback-btn">
              <span className="flex items-center gap-2">
                <span className="text-green-500">★★★★★</span> Excelente
              </span>
            </Button>
            <Button variant="outline" className="feedback-btn">
              <span className="flex items-center gap-2">
                <span className="text-green-500">★★★★</span> Buena
              </span>
            </Button>
            <Button variant="outline" className="feedback-btn">
              <span className="flex items-center gap-2">
                <span className="text-yellow-500">★★★</span> Regular
              </span>
            </Button>
            <Button variant="outline" className="feedback-btn">
              <span className="flex items-center gap-2">
                <span className="text-red-500">★★</span> Mejorable
              </span>
            </Button>
          </div>
        </div>
      </section>

      {/* Help section */}
      <section className="py-12 px-6 bg-white border-t">
        <div className="container mx-auto max-w-3xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">
                ¿Necesitas ayuda personalizada?
              </h2>
              <p className="mb-4 text-gray-600">
                Nuestros expertos en seguros están disponibles para ayudarte a
                encontrar la mejor cobertura para tu negocio.
              </p>
              <Button asChild size="lg" className="primary-btn">
                <Link href="/contacto">Solicitar asesoría gratuita</Link>
              </Button>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <h3 className="font-semibold mb-2">Contacto directo</h3>
              <p className="mb-1">
                <strong>Email:</strong> info@smart-advice.com
              </p>
              <p className="mb-1">
                <strong>Teléfono:</strong> +34 900 123 456
              </p>
              <p>
                <strong>Horario:</strong> Lunes a Viernes, 9:00 - 18:00
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
