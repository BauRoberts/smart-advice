// app/api/recomendaciones/coberturas/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface Coverage {
  name: string;
  required: boolean;
  condition?: string;
}

interface InsuranceRecommendation {
  type: "responsabilidad_civil" | "danos_materiales";
  coverages: Coverage[];
  ambitoTerritorial?: string;
  limits?: {
    generalLimit: string;
    victimSubLimit: string;
    explanation?: string;
  };
}

// Indicar a Next.js que esta es una ruta dinámica
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Usamos NextRequest para obtener los searchParams
    const searchParams = request.nextUrl.searchParams;
    const session_id = searchParams.get("session_id");
    const form_type = searchParams.get("form_type");

    if (!session_id) {
      return NextResponse.json(
        { success: false, error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Consulta base para obtener formularios
    let query = supabase
      .from("forms")
      .select(
        `
        id,
        type,
        form_data
      `
      )
      .eq("session_id", session_id);

    // Si se especifica un tipo de formulario, filtrar solo por ese tipo
    if (form_type) {
      query = query.eq("type", form_type);
    }

    // Ejecutar la consulta
    const { data: forms, error: formsError } = await query;

    if (formsError) throw formsError;

    if (!forms || forms.length === 0) {
      return NextResponse.json({
        success: true,
        recommendations: [],
      });
    }

    console.log("Formularios encontrados:", forms.length);

    // Procesar formularios para generar recomendaciones
    // Agrupar por tipo para evitar duplicados
    const recommendationsByType: Record<string, InsuranceRecommendation> = {};

    for (const form of forms) {
      // Si ya tenemos una recomendación para este tipo, omitir
      if (recommendationsByType[form.type]) continue;

      if (form.type === "responsabilidad_civil") {
        recommendationsByType[form.type] = generateRCCoverages(form.form_data);
      } else if (form.type === "danos_materiales") {
        recommendationsByType[form.type] = generateDMCoverages(form.form_data);
      }
    }

    // Convertir el objeto a array
    const recommendations = Object.values(recommendationsByType);

    console.log("Recomendaciones generadas:", recommendations.length);

    return NextResponse.json({
      success: true,
      recommendations,
    });
  } catch (error) {
    console.error("Error generating coverage recommendations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate coverage recommendations" },
      { status: 500 }
    );
  }
}

function determineLimitsRC(billingAmount?: number): {
  generalLimit: string;
  victimSubLimit: string;
} {
  if (!billingAmount) {
    return { generalLimit: "600.000€", victimSubLimit: "450.000€" };
  }

  if (billingAmount < 1000000) {
    return { generalLimit: "600.000€", victimSubLimit: "450.000€" };
  } else if (billingAmount <= 3000000) {
    return { generalLimit: "1.000.000€", victimSubLimit: "600.000€" };
  } else if (billingAmount <= 10000000) {
    return { generalLimit: "2.000.000€", victimSubLimit: "600.000€" };
  } else {
    return { generalLimit: "3.000.000€", victimSubLimit: "900.000€" };
  }
}

function generateRCCoverages(formData: any): InsuranceRecommendation {
  // Para Responsabilidad Civil, aplicamos exactamente los condicionales especificados
  const coverages: Coverage[] = [
    // Siempre incluidas
    {
      name: "Responsabilidad Civil por Explotación",
      required: true,
      condition: "Requerido en todos los casos",
    },
    {
      name: "Responsabilidad Civil Patronal",
      required: true,
      condition: "Requerido en todos los casos",
    },

    // Condicionales específicos
    {
      name: "Responsabilidad Civil Cruzada (o acc. Laborales de empleados de subcontratistas)",
      required:
        formData?.actividad?.servicios?.trabajos_subcontratistas || false,
      condition: "Requerido porque trabajas con subcontratistas",
    },
    {
      name: "Daños a Conducciones",
      required: true,
    },
    {
      name: "Daños a Transformadores o Receptor de Energía",
      required:
        formData?.actividad?.servicios?.trabajo_equipos_electronicos || false,
    },
    {
      name: "Responsabilidad Civil Daños a Bienes de Terceros",
      required: formData?.company?.almacena_bienes_terceros || false,
    },
    {
      name: "Responsabilidad Subsidiaria de Subcontratistas",
      required:
        formData?.actividad?.servicios?.trabajos_subcontratistas || false,
      condition: "Requerido porque trabajas con subcontratistas",
    },
    {
      name: "Responsabilidad por Vehículos de Terceros Aparcados en las Instalaciones",
      required: formData?.company?.vehiculos_terceros_aparcados || false,
    },
    {
      name: "Responsabilidad de Técnicos en Plantilla",
      required:
        formData?.actividad?.manufactura?.tiene_empleados_tecnicos ||
        formData?.actividad?.servicios?.empleados_tecnicos ||
        false,
    },
    {
      name: "Daños a Bienes Preexistentes",
      required: true,
    },
    {
      name: "Trabajos de Derribo y/o Demolición",
      required:
        formData?.actividad?.servicios?.trabajos_fuera_instalaciones || false,
    },
    {
      name: "Participación en Exposiciones y Ferias",
      required: true,
    },
    {
      name: "Daños a Colindantes",
      required: true,
    },
    {
      name: "Daños a Instalaciones Aéreas o Subterráneas (a Conducciones)",
      required:
        formData?.actividad?.servicios?.trabajos_fuera_instalaciones || false,
    },
    {
      name: "Daños a Bienes de Empleados",
      required: formData?.company?.bienes_empleados || false,
    },
    {
      name: "Responsabilidad Civil por Trabajos Realizados",
      required:
        formData?.actividad?.servicios?.trabajos_fuera_instalaciones || false,
    },
    {
      name: "Responsabilidad Civil Locativa",
      required: formData?.company?.installations_type === "Inquilino",
    },
    {
      name: "Responsabilidad Civil Inmobiliaria",
      required: formData?.company?.installations_type === "Propietario",
    },
    {
      name: "Responsabilidad por Productos",
      required:
        formData?.empresaTipo === "manufactura" ||
        formData?.actividad?.manufactura?.producto_consumo_humano ||
        false,
    },
    {
      name: "Responsabilidad por Unión y Mezcla",
      required:
        formData?.actividad?.manufactura?.producto_final_o_intermedio ===
          "intermedio" || false,
      condition: "Requerido porque fabricas productos intermedios",
    },
    {
      name: "Gastos de Retirada",
      required:
        formData?.actividad?.manufactura?.producto_consumo_humano || false,
      condition:
        "Requerido porque fabricas productos destinados al consumo humano",
    },
  ];

  // Determinar el ámbito territorial
  let ambitoTerritorial = "España y Andorra";
  if (formData?.ambito_territorial) {
    ambitoTerritorial = formData.ambito_territorial;
  } else if (formData?.actividad?.manufactura?.distribucion) {
    if (
      formData.actividad.manufactura.distribucion.includes("mundial-con-usa")
    ) {
      ambitoTerritorial = "Todo el Mundo incluido USA y Canadá";
    } else if (
      formData.actividad.manufactura.distribucion.includes("mundial-sin-usa")
    ) {
      ambitoTerritorial = "Todo el Mundo excepto USA y Canadá";
    } else if (formData.actividad.manufactura.distribucion.includes("ue")) {
      ambitoTerritorial = "Unión Europea";
    } else if (formData.actividad.manufactura.distribucion.includes("espana")) {
      ambitoTerritorial = "España y Andorra";
    }
  }

  // Determinar los límites de responsabilidad basados en la facturación
  const { generalLimit, victimSubLimit } = determineLimitsRC(
    formData?.company?.billing
  );

  return {
    type: "responsabilidad_civil",
    coverages,
    ambitoTerritorial,
    limits: {
      generalLimit,
      victimSubLimit,
      explanation: `Según facturación anual de ${
        formData?.company?.billing?.toLocaleString() || "N/A"
      }€`,
    },
  };
}

function generateDMCoverages(formData: any): InsuranceRecommendation {
  // Para Daños Materiales, aplicamos exactamente los condicionales especificados
  const coverages: Coverage[] = [
    // Coberturas básicas
    {
      name: "Coberturas Básicas (incendio, rayo y explosión)",
      required: true,
      condition: "100% de capitales a asegurar",
    },
    {
      name: "Extensión de Coberturas (lluvia, pedrisco, nieve, viento, humo)",
      required: true,
      condition: "100% de capitales a asegurar",
    },
    {
      name: "Cláusula de Valor de Reposición a Nuevo",
      required: true,
    },
    {
      name: "Cláusula de Compensación de Capitales",
      required: true,
    },
    {
      name: "Cobertura Automática para Daños",
      required: true,
    },
    {
      name: "Cláusula de Todo Riesgo Accidental",
      required: formData?.company?.clausula_todo_riesgo || false,
    },
    {
      name: "Cobertura de Pérdida de Beneficios",
      required: true,
      condition: "6/12/24 meses según necesidad",
    },
    {
      name: "Daños Eléctricos a Primer Riesgo",
      required: true,
      condition: determineElectricalDamageLimit(
        formData?.capitales?.valor_edificio
      ),
    },
    {
      name: "Daños por Agua",
      required: true,
      condition: "100% de capitales asegurados",
    },
    {
      name: "Bienes de Terceros en Custodia",
      required:
        formData?.company?.almacena_bienes_terceros ||
        formData?.capitales?.existencias_terceros ||
        false,
      condition: "Suma indicada en el formulario",
    },
    {
      name: "Bienes Propios en Casa de Terceros",
      required: formData?.capitales?.existencias_propias_terceros || false,
    },
    {
      name: "Bienes Refrigerados",
      required: formData?.construccion?.camaras_frigorificas || false,
    },
    {
      name: "Bienes a la Intemperie (maquinaria o existencias)",
      required: formData?.company?.existencias_intemperie || false,
    },
    {
      name: "Daños a Vehículos Aparcados en las Instalaciones",
      required: formData?.company?.vehiculos_terceros_aparcados || false,
    },
    {
      name: "Robo y Expoliación a Valor Parcial",
      required: true,
      condition: "25% del valor asegurado",
    },
    {
      name: "Desperfectos por Robo",
      required: true,
      condition: determineRobberyCoverageLimit(
        formData?.capitales?.valor_edificio
      ),
    },
  ];

  // Coberturas para dinero en efectivo
  if (
    formData?.company?.dinero_caja_fuerte &&
    formData.company.dinero_caja_fuerte > 0
  ) {
    coverages.push({
      name: "Robo Dinero en Efectivo en Caja Fuerte",
      required: true,
      condition: `${formData.company.dinero_caja_fuerte.toLocaleString()}€`,
    });
  }

  if (
    formData?.company?.dinero_fuera_caja &&
    formData.company.dinero_fuera_caja > 0
  ) {
    coverages.push({
      name: "Robo Dinero en Efectivo en Mueble Cerrado",
      required: true,
      condition: `${formData.company.dinero_fuera_caja.toLocaleString()}€`,
    });
  }

  return {
    type: "danos_materiales",
    coverages,
  };
}

function determineElectricalDamageLimit(edificioValue?: number): string {
  if (!edificioValue) return "15.000€";

  if (edificioValue > 1000000) {
    return "60.000€";
  } else if (edificioValue > 500000) {
    return "30.000€";
  } else {
    return "15.000€";
  }
}

function determineRobberyCoverageLimit(edificioValue?: number): string {
  if (!edificioValue) return "15.000€";

  if (edificioValue > 500000) {
    return "30.000€";
  } else {
    return "15.000€";
  }
}
