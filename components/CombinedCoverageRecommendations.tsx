///Users/bautistaroberts/smart-advice/components/CombinedCoverageRecommendations.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Mail, Shield, FileText } from "lucide-react";

interface Coverage {
  name: string;
  required: boolean;
  condition?: string;
}

interface InsuranceRecommendation {
  type: "responsabilidad_civil" | "danos_materiales";
  coverages: Coverage[];
  ambitoTerritorial?: string;
}

const CoverageRecommendation: React.FC<{
  recommendation: InsuranceRecommendation;
}> = ({ recommendation }) => {
  // Filtrar solo las coberturas requeridas
  const requiredCoverages = recommendation.coverages.filter(
    (coverage) => coverage.required
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-[#FB2E25] p-6 mb-8">
      <h2 className="text-xl font-bold text-[#062A5A] mb-4">
        {recommendation.type === "responsabilidad_civil"
          ? "El seguro de Responsabilidad Civil que contrates deberá tener las siguientes coberturas:"
          : "El seguro de Daños Materiales que contrates deberá tener las siguientes coberturas:"}
      </h2>

      <div className="h-1 w-24 bg-[#FB2E25] mb-6"></div>

      <ul className="space-y-2 mb-8">
        {requiredCoverages.map((coverage, idx) => (
          <li key={idx} className="flex items-start space-x-3">
            <div className="mt-1 text-green-500 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <span className="font-medium text-gray-800">{coverage.name}</span>
              {coverage.condition && (
                <span className="text-sm text-gray-500 block">
                  {coverage.condition}
                </span>
              )}
            </div>
          </li>
        ))}

        {recommendation.ambitoTerritorial && (
          <li className="flex items-start space-x-3">
            <div className="mt-1 text-green-500 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <span className="font-medium text-gray-800">
                Ámbito Territorial: {recommendation.ambitoTerritorial}
              </span>
            </div>
          </li>
        )}
      </ul>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button className="flex-1 bg-[#062A5A] hover:bg-[#051d3e]">
          <Download className="mr-2 h-4 w-4" />
          Descargar PDF con recomendaciones
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-[#062A5A] text-[#062A5A] hover:bg-blue-50"
        >
          <Mail className="mr-2 h-4 w-4" />
          Solicitar cotización
        </Button>
      </div>
    </div>
  );
};

// Componente principal que agrupa recomendaciones por tipo
const CombinedCoverageRecommendations: React.FC<{
  recommendations: InsuranceRecommendation[];
}> = ({ recommendations }) => {
  if (recommendations.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-lg text-gray-700">
          No se encontraron recomendaciones disponibles.
        </p>
      </div>
    );
  }

  // Agrupar recomendaciones por tipo para evitar duplicados
  const rcRecommendation = recommendations.find(
    (r) => r.type === "responsabilidad_civil"
  );
  const dmRecommendation = recommendations.find(
    (r) => r.type === "danos_materiales"
  );

  // Crear array de recomendaciones únicas
  const uniqueRecommendations: InsuranceRecommendation[] = [];
  if (rcRecommendation) uniqueRecommendations.push(rcRecommendation);
  if (dmRecommendation) uniqueRecommendations.push(dmRecommendation);

  return (
    <div>
      {uniqueRecommendations.map((recommendation, index) => (
        <CoverageRecommendation
          key={`${recommendation.type}-${index}`}
          recommendation={recommendation}
        />
      ))}
    </div>
  );
};

export default CombinedCoverageRecommendations;
