// app/api/recomendaciones/coberturas/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface Coverage {
  name: string;
  required: boolean;
  condition?: string;
  limit?: string;
  sublimit?: string;
}

interface InsuranceRecommendation {
  type: "responsabilidad_civil" | "danos_materiales";
  companyInfo: {
    name?: string;
    address?: string;
    activity?: string;
    activityDescription?: string;
    billing?: number;
    employees?: number;
    m2?: number;
    installations_type?: string;
    owner_name?: string;
    owner_cif?: string;
  };
  coverages: Coverage[];
  ambitoTerritorial?: string;
  ambitoProductos?: string;
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

    // Consulta para obtener datos de contacto
    const { data: contactData, error: contactError } = await supabase
      .from("contact_info")
      .select("*")
      .eq("session_id", session_id)
      .single();

    if (contactError && contactError.code !== "PGRST116") {
      throw contactError;
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
        recommendationsByType[form.type] = generateRCCoverages(
          form.form_data,
          contactData
        );
      } else if (form.type === "danos_materiales") {
        recommendationsByType[form.type] = generateDMCoverages(
          form.form_data,
          contactData
        );
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

function buildActivityDescription(formData: any): string {
  let activityDescription = "";
  const activities = [];

  // Añadir las actividades seleccionadas
  if (formData?.company?.manufactures) activities.push("Fabricación");
  if (formData?.company?.markets) activities.push("Comercialización");
  if (formData?.company?.diseno) activities.push("Diseño");
  if (formData?.company?.almacenamiento) activities.push("Almacenamiento");
  if (formData?.company?.provides_services)
    activities.push("Prestación de servicios");

  // Construir la descripción de actividad
  if (activities.length > 0) {
    activityDescription =
      activities.join(" y/o ") +
      " de " +
      (formData?.company?.product_service_types || "productos/servicios");

    if (formData?.company?.industry_types) {
      activityDescription +=
        " para el sector de " + formData.company.industry_types;
    }
  }

  return activityDescription;
}

function generateRCCoverages(
  formData: any,
  contactData: any
): InsuranceRecommendation {
  const { generalLimit, victimSubLimit } = determineLimitsRC(
    formData?.company?.billing
  );

  // Preparamos la información de la empresa
  const companyInfo = {
    name: contactData?.name || formData?.company?.name || "",
    address: formData?.company?.localizacion_nave || "",
    activity: formData?.company?.activity || "",
    activityDescription: buildActivityDescription(formData),
    billing: formData?.company?.billing,
    employees: formData?.company?.employees_number,
    m2: formData?.company?.m2_installations,
    installations_type: formData?.company?.installations_type,
    owner_name: formData?.company?.propietario_nombre,
    owner_cif: formData?.company?.propietario_cif,
  };

  // Para Responsabilidad Civil
  const coverages: Coverage[] = [];

  // Coberturas básicas (siempre incluidas)
  coverages.push({
    name: "Responsabilidad Civil por Explotación",
    required: true,
    limit: generalLimit,
  });

  // RC Patronal solo si hay empleados
  if (formData?.company?.employees_number > 1) {
    coverages.push({
      name: "Responsabilidad Civil Patronal",
      required: true,
      limit: generalLimit,
      sublimit: victimSubLimit,
    });
  }

  // Contaminación accidental
  if (
    formData?.coberturas_solicitadas?.coberturas_adicionales
      ?.cover_accidental_contamination
  ) {
    coverages.push({
      name: "Responsabilidad Civil por Contaminación Accidental",
      required: true,
      limit: generalLimit,
    });
  }

  // RC Inmobiliaria (si es propietario)
  if (formData?.company?.installations_type === "Propietario") {
    coverages.push({
      name: "Responsabilidad Civil Inmobiliaria",
      required: true,
      limit: generalLimit,
    });
  }

  // RC Locativa (si no es propietario)
  if (formData?.company?.installations_type === "No propietario") {
    coverages.push({
      name: "Responsabilidad Civil Locativa",
      required: true,
      limit:
        "Sublímite sugerido: de 300.000€ a 1.200.000€ dependiendo el valor del inmueble alquilado",
    });
  }

  // RC Cruzada (si subcontrata)
  if (formData?.actividad?.servicios?.subcontrata_personal) {
    coverages.push({
      name: "Responsabilidad Civil Cruzada y Subsidiaria",
      required: true,
      condition: "Incluida",
    });
  }

  // RC Productos (si fabrica, diseña, comercializa o almacena)
  if (
    formData?.company?.manufactures ||
    formData?.company?.markets ||
    formData?.company?.diseno ||
    formData?.company?.almacenamiento
  ) {
    coverages.push({
      name: "Responsabilidad Civil por Productos y Post-trabajos",
      required: true,
      limit: generalLimit,
    });
  }

  // RC por Unión y mezcla (si producto intermedio)
  if (formData?.actividad?.manufactura?.producto_intermedio_final) {
    coverages.push({
      name: "Responsabilidad Civil por Unión y Mezcla",
      required: true,
      limit: "Límite sugerido: entre 100.000€ a 600.000€",
    });
  }

  // Gastos de retirada (si es consumo humano)
  if (formData?.actividad?.manufactura?.producto_consumo_humano) {
    coverages.push({
      name: "Gastos de Retirada",
      required: true,
      limit: "Límite sugerido: entre 100.000€ y 600.000€",
    });
  }

  // RC de técnicos en plantilla
  if (
    formData?.coberturas_solicitadas?.coberturas_adicionales
      ?.has_contracted_professionals
  ) {
    coverages.push({
      name: "Responsabilidad Civil de Técnicos en Plantilla",
      required: true,
      limit: generalLimit,
    });
  }

  // RC Daños a conducciones
  if (formData?.actividad?.servicios?.trabajos_afectan_infraestructuras) {
    coverages.push({
      name: "Responsabilidad Civil Daños a Conducciones",
      required: true,
      limit: generalLimit,
    });
  }

  // Daños a colindantes
  if (formData?.actividad?.servicios?.trabajos_afectan_edificios) {
    coverages.push({
      name: "Daños a Colindantes",
      required: true,
      limit: generalLimit,
    });
  }

  // RC Objetos confiados/custodiados
  if (formData?.company?.almacena_bienes_terceros) {
    coverages.push({
      name: "Responsabilidad Civil Daños a Objetos Confiados y/o Custodiados",
      required: true,
      limit:
        "Límite sugerido: entre 150.000€ a 600.000€ dependiendo del valor de los bienes custodiados",
    });
  }

  // Cobertura de ferias
  if (
    formData?.coberturas_solicitadas?.coberturas_adicionales
      ?.participates_in_fairs
  ) {
    coverages.push({
      name: "Cobertura de Responsabilidad sobre Ferias y Exposiciones",
      required: true,
      condition: "Incluida",
    });
  }

  // Daños a bienes preexistentes
  if (formData?.actividad?.servicios?.cubre_preexistencias) {
    coverages.push({
      name: "Daños a Bienes Preexistentes",
      required: true,
      limit: generalLimit,
      condition:
        "Excluyéndose en cualquier caso los daños a aquella parte específica dónde trabaja el asegurado",
    });
  }

  // RC vehículos de terceros
  if (formData?.company?.vehiculos_terceros_aparcados) {
    coverages.push({
      name: "Responsabilidad Civil Daños a Vehículos de Terceros dentro de Instalaciones",
      required: true,
      condition: "Incluida",
    });
  }

  // Daños al receptor de energía
  if (formData?.company?.placas_venta_red) {
    coverages.push({
      name: "Responsabilidad Civil Daños al Receptor de la Energía",
      required: true,
      limit: generalLimit,
    });

    coverages.push({
      name: "Daños al Receptor de Energía",
      required: true,
      condition: "Incluida",
    });
  }

  // Daños a bienes de empleados
  if (
    formData?.coberturas_solicitadas?.coberturas_adicionales
      ?.cover_employee_damages
  ) {
    coverages.push({
      name: "Daños a Bienes de Empleados",
      required: true,
      limit: "Límite sugerido: entre 30.000€ a 150.000€",
    });
  }

  // Perjuicios patrimoniales puros
  if (
    formData?.coberturas_solicitadas?.coberturas_adicionales
      ?.cover_material_damages
  ) {
    coverages.push({
      name: "Perjuicios Patrimoniales Puros",
      required: true,
      limit: "Límite sugerido: 100.000€ a 300.000€",
    });
  }

  // Determinar el ámbito territorial
  let ambitoTerritorial = "España y Andorra";
  if (
    formData?.coberturas_solicitadas?.coberturas_adicionales
      ?.has_subsidiaries_outside_spain
  ) {
    const scope =
      formData?.coberturas_solicitadas?.coberturas_adicionales
        ?.territorial_scope;
    if (scope === "europe") {
      ambitoTerritorial = "Unión Europea";
    } else if (scope === "europe_uk") {
      ambitoTerritorial = "Unión Europea y Reino Unido";
    } else if (scope === "worldwide_except_usa_canada") {
      ambitoTerritorial = "Todo el Mundo excepto USA y Canadá";
    } else if (scope === "worldwide_including_usa_canada") {
      ambitoTerritorial = "Todo el Mundo incluido USA y Canadá";
    }
  }

  // Determinar el ámbito territorial para productos
  let ambitoProductos = "España y Andorra";
  if (formData?.actividad?.manufactura?.alcance_geografico) {
    const alcance = formData.actividad.manufactura.alcance_geografico;
    if (alcance === "union_europea") {
      ambitoProductos = "Unión Europea";
    } else if (alcance === "europa_reino_unido") {
      ambitoProductos = "Unión Europea y Reino Unido";
    } else if (alcance === "mundial_excepto_usa_canada") {
      ambitoProductos = "Todo el Mundo excepto USA y Canadá";
    } else if (alcance === "mundial_incluyendo_usa_canada") {
      ambitoProductos = "Todo el Mundo incluido USA y Canadá";
    }
  }

  // Return the recommendation object
  return {
    type: "responsabilidad_civil",
    companyInfo,
    coverages,
    ambitoTerritorial,
    ambitoProductos,
    limits: {
      generalLimit,
      victimSubLimit,
    },
  };
}

// Add the missing generateDMCoverages function
function generateDMCoverages(
  formData: any,
  contactData: any
): InsuranceRecommendation {
  // Preparamos la información de la empresa
  const companyInfo = {
    name: contactData?.name || formData?.company?.name || "",
    address: formData?.company?.localizacion_nave || "",
    activity: formData?.company?.activity || "",
    activityDescription: buildActivityDescription(formData),
    billing: formData?.company?.billing,
    employees: formData?.company?.employees_number,
    m2: formData?.company?.m2_installations,
    installations_type: formData?.company?.installations_type,
    owner_name: formData?.company?.propietario_nombre,
    owner_cif: formData?.company?.propietario_cif,
  };

  const coverages: Coverage[] = [
    {
      name: "Incendio, Rayo y Explosión",
      required: true,
      condition: "Incluida",
    },
    {
      name: "Daños por Agua",
      required: true,
      condition: "Incluida",
    },
    // Add more coverages as needed
  ];

  // If they have solar panels for grid sale
  if (formData?.company?.placas_venta_red) {
    coverages.push({
      name: "Daños al Receptor de Energía",
      required: true,
      condition: "Incluida",
    });
  }

  return {
    type: "danos_materiales",
    companyInfo,
    coverages,
    limits: {
      generalLimit: "Valor total declarado",
      victimSubLimit: "No aplica",
    },
  };
}
