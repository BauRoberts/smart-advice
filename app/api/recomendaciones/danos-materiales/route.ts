///Users/bautistaroberts/smart-advice/app/api/recomendaciones/danos-materiales/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface Coverage {
  name: string;
  required: boolean;
  condition?: string;
  limit?: string;
  sublimit?: string;
}

interface CompanyInfo {
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
  cif?: string;
  cnae?: string;
}

interface ConstructionInfo {
  estructura?: string;
  cubierta?: string;
  cerramientos?: string;
}

interface ProtectionInfo {
  extintores?: boolean;
  bocas_incendio?: boolean;
  deposito_bombeo?: boolean;
  cobertura_total?: boolean;
  columnas_hidrantes?: boolean;
  columnas_hidrantes_tipo?: string;
  deteccion_automatica?: boolean;
  deteccion_zona?: string[];
  rociadores?: boolean;
  rociadores_zona?: string[];
  suministro_agua?: string;
  protecciones_fisicas?: boolean;
  vigilancia_propia?: boolean;
  alarma_conectada?: boolean;
  camaras_circuito?: boolean;
}

interface CapitalesInfo {
  valor_edificio?: number;
  valor_ajuar?: number;
  valor_existencias?: number;
  valor_equipo_electronico?: number;
  margen_bruto_anual?: number;
  periodo_indemnizacion?: string;
}

interface InsuranceRecommendation {
  type: string;
  companyInfo: CompanyInfo;
  constructionInfo: ConstructionInfo;
  protectionInfo: ProtectionInfo;
  capitalesInfo: CapitalesInfo;
  coverages: Coverage[];
  specialClauses: Coverage[];
}

// Indicar a Next.js que esta es una ruta dinámica
// app/api/recomendaciones/danos-materiales/route.ts

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const session_id = searchParams.get("session_id");

    if (!session_id) {
      return NextResponse.json(
        { success: false, error: "Session ID is required" },
        { status: 400 }
      );
    }

    console.log(`[Danos API] Processing request for session_id: ${session_id}`);

    // Get contact data first
    let contactData = null;
    try {
      const { data: contact, error: contactError } = await supabase
        .from("contact_info")
        .select("*")
        .eq("session_id", session_id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (!contactError && contact && contact.length > 0) {
        contactData = contact[0];
        console.log("[Danos API] Found contact data");
      }
    } catch (contactError) {
      console.error("[Danos API] Error fetching contact data:", contactError);
      // Continue without contact data
    }

    // Get the most recent form submission
    const { data: formData, error: formError } = await supabase
      .from("forms")
      .select("*")
      .eq("session_id", session_id)
      .or(`type.eq.danos_materiales,type.eq.danos-materiales`)
      .order("created_at", { ascending: false })
      .limit(1);

    if (formError) {
      console.error("[Danos API] Error fetching form:", formError);
      throw formError;
    }

    if (!formData || formData.length === 0) {
      console.log("[Danos API] No form found for session_id:", session_id);
      return NextResponse.json({
        success: false,
        error: "No form data found",
      });
    }

    // Get the most recent form's data
    const mostRecentForm = formData[0];
    console.log("[Danos API] Found form:", mostRecentForm.id);

    // Generate recommendation using both form and contact data
    const recommendation = generateDanosRecommendation(
      mostRecentForm.form_data,
      contactData
    );

    console.log("[Danos API] Generated recommendation successfully");

    return NextResponse.json({
      success: true,
      recommendations: [recommendation],
    });
  } catch (error) {
    console.error("[Danos API] Error generating recommendations:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate recommendations",
        details: error,
      },
      { status: 500 }
    );
  }
}

function generateDanosRecommendation(
  formData: any,
  contactData: any
): InsuranceRecommendation {
  console.log("Generando recomendación con datos:", {
    hasFormData: !!formData,
    hasContactData: !!contactData,
    formDataKeys: formData ? Object.keys(formData) : [],
  });

  // Preparamos la información de la empresa
  const companyInfo: CompanyInfo = {
    name:
      contactData?.name ||
      formData?.informacion_general?.company_name ||
      formData?.company?.name ||
      "",
    cif: formData?.informacion_general?.cif || formData?.company?.cif || "",
    address:
      formData?.informacion_general?.address ||
      formData?.company?.localizacion_nave ||
      "",
    cnae: formData?.informacion_general?.cnae || formData?.company?.cnae || "",
    activity:
      formData?.informacion_general?.activity ||
      formData?.company?.activity ||
      "",
    activityDescription:
      formData?.informacion_general?.activity_description || "",
    billing:
      formData?.informacion_general?.billing || formData?.company?.billing,
    employees:
      formData?.informacion_general?.employees_number ||
      formData?.company?.employees_number,
    m2:
      formData?.informacion_general?.m2_installations ||
      formData?.company?.m2_installations,
    installations_type:
      formData?.informacion_general?.installations_type ||
      formData?.company?.installations_type,
    owner_name:
      formData?.informacion_general?.owner_name ||
      formData?.company?.propietario_nombre,
    owner_cif:
      formData?.informacion_general?.owner_cif ||
      formData?.company?.propietario_cif,
  };

  // Información de construcción
  const constructionInfo: ConstructionInfo = {
    estructura: formData?.construccion?.estructura || "",
    cubierta: formData?.construccion?.cubierta || "",
    cerramientos: formData?.construccion?.cerramientos || "",
  };

  // Información de protecciones
  const protectionInfo: ProtectionInfo = {
    // Protección contra incendios
    extintores: formData?.proteccion_incendios?.extintores || false,
    bocas_incendio: formData?.proteccion_incendios?.bocas_incendio || false,
    deposito_bombeo: formData?.proteccion_incendios?.deposito_bombeo || false,
    cobertura_total: formData?.proteccion_incendios?.cobertura_total || false,
    columnas_hidrantes:
      formData?.proteccion_incendios?.columnas_hidrantes || false,
    columnas_hidrantes_tipo:
      formData?.proteccion_incendios?.columnas_hidrantes_tipo || "",
    deteccion_automatica:
      formData?.proteccion_incendios?.deteccion_automatica || false,
    deteccion_zona: formData?.proteccion_incendios?.deteccion_zona || [],
    rociadores: formData?.proteccion_incendios?.rociadores || false,
    rociadores_zona: formData?.proteccion_incendios?.rociadores_zona || [],
    suministro_agua: formData?.proteccion_incendios?.suministro_agua || "",

    // Protección contra robo
    protecciones_fisicas:
      formData?.proteccion_robo?.protecciones_fisicas || false,
    vigilancia_propia: formData?.proteccion_robo?.vigilancia_propia || false,
    alarma_conectada: formData?.proteccion_robo?.alarma_conectada || false,
    camaras_circuito: formData?.proteccion_robo?.camaras_circuito || false,
  };

  // Información de capitales
  const capitalesInfo: CapitalesInfo = {
    valor_edificio: formData?.capitales_y_coberturas?.valor_edificio || 0,
    valor_ajuar: formData?.capitales_y_coberturas?.valor_ajuar || 0,
    valor_existencias: formData?.capitales_y_coberturas?.valor_existencias || 0,
    valor_equipo_electronico:
      formData?.capitales_y_coberturas?.valor_equipo_electronico || 0,
    margen_bruto_anual:
      formData?.capitales_y_coberturas?.margen_bruto_anual || 0,
    periodo_indemnizacion:
      formData?.capitales_y_coberturas?.periodo_indemnizacion || "",
  };

  // Calculamos el total de capitales (edificio + ajuar + existencias)
  const totalCapitales =
    (capitalesInfo.valor_edificio || 0) +
    (capitalesInfo.valor_ajuar || 0) +
    (capitalesInfo.valor_existencias || 0);

  // Coberturas básicas y opcionales según formulario
  const coverages: Coverage[] = [];

  // 1. Coberturas básicas (siempre incluidas)
  coverages.push({
    name: "Incendio, Rayo y Explosión",
    required: true,
    limit: "100% capitales a asegurar",
  });

  coverages.push({
    name: "Riesgos extensivos (lluvia, pedrisco, nieve, humo, etc)",
    required: true,
    limit: "100% capitales a asegurar",
  });

  coverages.push({
    name: "Daños por Agua",
    required: true,
    limit: "100% capitales a asegurar",
  });

  // 2. Daños eléctricos (calculado según el valor del edificio)
  let danosElectricosLimit = "30.000€";
  if (
    (capitalesInfo.valor_edificio || 0) >= 500000 &&
    (capitalesInfo.valor_edificio || 0) < 1000000
  ) {
    danosElectricosLimit = "60.000€";
  } else if ((capitalesInfo.valor_edificio || 0) >= 1000000) {
    danosElectricosLimit = "100.000€";
  }

  coverages.push({
    name: "Daños eléctricos a primer riesgo",
    required: true,
    limit: danosElectricosLimit,
  });

  // 3. Robo y expoliación
  const roboPercentage = totalCapitales > 1000000 ? "50%" : "25%";
  coverages.push({
    name: "Robo y expoliación",
    required: true,
    limit: `${roboPercentage} de los capitales asegurados`,
  });

  // 4. Rotura de cristales
  coverages.push({
    name: "Rotura de cristales",
    required: true,
    limit: "6.000€",
  });

  // 5. Avería de maquinaria (si seleccionó)
  if (formData?.capitales_y_coberturas?.averia_maquinaria) {
    coverages.push({
      name: "Avería de maquinaria",
      required: true,
      limit: `${
        formData?.capitales_y_coberturas?.valor_averia_maquinaria || 0
      }€`,
    });
  }

  // 6. Dinero en caja fuerte y fuera de caja
  if (formData?.capitales_y_coberturas?.dinero_caja_fuerte) {
    const valor =
      formData?.capitales_y_coberturas?.valor_dinero_caja_fuerte || 0;
    let limitRecomendado = "500€";

    if (valor > 500 && valor <= 1500) limitRecomendado = "1.500€";
    else if (valor > 1500 && valor <= 3000) limitRecomendado = "3.000€";
    else if (valor > 3000) limitRecomendado = "6.000€";

    coverages.push({
      name: "Robo de metálico en caja fuerte",
      required: true,
      limit: limitRecomendado,
    });
  }

  if (formData?.capitales_y_coberturas?.dinero_fuera_caja) {
    const valor =
      formData?.capitales_y_coberturas?.valor_dinero_fuera_caja || 0;
    let limitRecomendado = "500€";

    if (valor > 500 && valor <= 1500) limitRecomendado = "1.500€";
    else if (valor > 1500 && valor <= 3000) limitRecomendado = "3.000€";
    else if (valor > 3000) limitRecomendado = "6.000€";

    coverages.push({
      name: "Robo de metálico en mueble cerrado",
      required: true,
      limit: limitRecomendado,
    });
  }

  // 7. Transportador de fondos (si tiene cualquiera de las dos coberturas de dinero)
  if (
    formData?.capitales_y_coberturas?.dinero_caja_fuerte ||
    formData?.capitales_y_coberturas?.dinero_fuera_caja
  ) {
    const valorCaja =
      formData?.capitales_y_coberturas?.valor_dinero_caja_fuerte || 0;
    const valorFuera =
      formData?.capitales_y_coberturas?.valor_dinero_fuera_caja || 0;
    const valorMax = Math.max(valorCaja, valorFuera);

    let limitRecomendado = "500€";
    if (valorMax > 500 && valorMax <= 1500) limitRecomendado = "1.500€";
    else if (valorMax > 1500 && valorMax <= 3000) limitRecomendado = "3.000€";
    else if (valorMax > 3000) limitRecomendado = "6.000€";

    coverages.push({
      name: "Robo al transportador de fondos",
      required: true,
      limit: limitRecomendado,
    });
  }

  // 8. Bienes de terceros depositados
  if (formData?.capitales_y_coberturas?.existencias_terceros) {
    coverages.push({
      name: "Bienes de terceros depositados en las instalaciones del asegurado",
      required: true,
      limit: `${
        formData?.capitales_y_coberturas?.valor_existencias_terceros || 0
      }€`,
      condition:
        "Esta cobertura también puede incluirse en una póliza de Responsabilidad Civil general. Se recomienda cubrir esto en una póliza de Daños porque la indemnización es mejor.",
    });
  }

  // 9. Bienes propios depositados en casa de terceros
  if (formData?.capitales_y_coberturas?.existencias_propias_terceros) {
    coverages.push({
      name: "Bienes propios depositados en casa de terceros",
      required: true,
      limit: `${
        formData?.capitales_y_coberturas?.valor_existencias_propias_terceros ||
        0
      }€`,
    });
  }

  // 10. Bienes depositados a la intemperie
  if (formData?.capitales_y_coberturas?.existencias_intemperie) {
    coverages.push({
      name: "Bienes depositados a la intemperie o aire libre",
      required: true,
      limit: `${
        formData?.capitales_y_coberturas?.valor_existencias_intemperie || 0
      }€`,
    });
  }

  // 11. Bienes refrigerados
  if (formData?.capitales_y_coberturas?.bienes_camaras_frigorificas) {
    let proteccionesText = "";
    if (
      formData?.capitales_y_coberturas?.proteccion_camaras?.control_temperatura
    ) {
      proteccionesText += "Control de temperatura. ";
    }
    if (
      formData?.capitales_y_coberturas?.proteccion_camaras?.deteccion_incendio
    ) {
      proteccionesText += "Detección automática de incendio.";
    }

    coverages.push({
      name: "Bienes refrigerados",
      required: true,
      limit: `${
        formData?.capitales_y_coberturas?.valor_bienes_camaras_frigorificas || 0
      }€`,
      condition: proteccionesText
        ? `Medidas de protección: ${proteccionesText}`
        : undefined,
    });
  }

  // 12. Placas fotovoltaicas
  if (formData?.construccion?.placas_solares) {
    coverages.push({
      name: "Placas fotovoltaicas",
      required: true,
      limit: `${formData?.capitales_y_coberturas?.valor_placas_solares || 0}€`,
    });
  }

  // 13. Vehículos aparcados
  if (formData?.capitales_y_coberturas?.vehiculos_terceros_aparcados) {
    coverages.push({
      name: "Vehículos aparcados en instalaciones",
      required: true,
      limit: `${
        formData?.capitales_y_coberturas?.valor_vehiculos_terceros || 0
      }€`,
      condition:
        "Esta cobertura también puede incluirse en una póliza de Responsabilidad Civil general. Se recomienda cubrir esto en una póliza de Daños porque la indemnización es mejor.",
    });
  }

  // 14. Bienes de empleados
  if (formData?.capitales_y_coberturas?.bienes_empleados) {
    coverages.push({
      name: "Bienes de empleados",
      required: true,
      limit: `${
        formData?.capitales_y_coberturas?.valor_bienes_empleados || 0
      }€`,
      condition:
        "Esta cobertura también puede incluirse en una póliza de Responsabilidad Civil general. Se recomienda cubrir esto en una póliza de Daños porque la indemnización es mejor.",
    });
  }

  // 15. Responsabilidad Civil (si seleccionó)
  if (formData?.capitales_y_coberturas?.responsabilidad_civil) {
    if (formData?.capitales_y_coberturas?.coberturas_rc?.explotacion) {
      coverages.push({
        name: "Responsabilidad civil general",
        required: true,
        limit: "600.000€",
      });
    }

    if (formData?.capitales_y_coberturas?.coberturas_rc?.patronal) {
      coverages.push({
        name: "Responsabilidad civil patronal",
        required: true,
        limit: "600.000€",
        sublimit: "450.000€ por víctima",
      });
    }

    if (formData?.capitales_y_coberturas?.coberturas_rc?.productos) {
      coverages.push({
        name: "Responsabilidad civil por productos",
        required: true,
        limit: "600.000€",
      });
    }

    if (
      formData?.capitales_y_coberturas?.coberturas_rc?.inmobiliaria &&
      companyInfo.installations_type === "Propietario"
    ) {
      coverages.push({
        name: "Responsabilidad civil inmobiliaria",
        required: true,
        limit: "600.000€",
      });
    }

    if (
      formData?.capitales_y_coberturas?.coberturas_rc?.locativa &&
      companyInfo.installations_type === "No propietario"
    ) {
      coverages.push({
        name: "Responsabilidad civil locativa",
        required: true,
        limit: "600.000€",
      });
    }
  }

  // Cláusulas especiales
  const specialClauses: Coverage[] = [];

  // 1. Cobertura automática para Daños materiales
  specialClauses.push({
    name: "Cobertura automática para Daños materiales",
    required: true,
    limit: "20%",
  });

  // 2. Cobertura automática para Pérdida de beneficios (si contrató margen bruto)
  if (
    capitalesInfo.margen_bruto_anual &&
    capitalesInfo.margen_bruto_anual > 0
  ) {
    specialClauses.push({
      name: "Cobertura automática para Pérdida de beneficios",
      required: true,
      limit: "30%",
    });
  }

  // 3. Valor de reposición a nuevo
  specialClauses.push({
    name: "Cláusula de Valor de reposición a nuevo",
    required: true,
  });

  // 4. Todo riesgo accidental (si seleccionó)
  if (formData?.capitales_y_coberturas?.todo_riesgo_accidental) {
    specialClauses.push({
      name: "Cláusula todo riesgo accidental",
      required: true,
    });
  }

  // 5. Cláusula de Leasing (si tiene bienes en leasing)
  if (formData?.capitales_y_coberturas?.bienes_leasing) {
    specialClauses.push({
      name:
        "Cláusula de Leasing para " +
        (formData?.capitales_y_coberturas?.leasing_arrendador || "Arrendador"),
      required: true,
      condition: `Arrendador: ${
        formData?.capitales_y_coberturas?.leasing_arrendador || ""
      }, CIF: ${
        formData?.capitales_y_coberturas?.leasing_cif || ""
      }, Contrato: ${
        formData?.capitales_y_coberturas?.leasing_contrato || ""
      }, Bien: ${
        formData?.capitales_y_coberturas?.leasing_identificacion || ""
      }`,
    });
  }

  // Añadir cláusulas especiales basadas en las características de la propiedad
  if (formData?.construccion?.estructura === "madera") {
    specialClauses.push({
      name: "Medidas especiales contra incendios",
      required: true,
      condition:
        "Por construcción en madera, se requieren medidas adicionales de protección",
    });
  }

  if (formData?.capitales_y_coberturas?.bienes_camaras_frigorificas) {
    specialClauses.push({
      name: "Mantenimiento preventivo",
      required: true,
      condition:
        "Se requiere contrato de mantenimiento para equipos de refrigeración",
    });
  }

  // Return the complete recommendation object
  return {
    type: "danos_materiales",
    companyInfo,
    constructionInfo,
    protectionInfo,
    capitalesInfo,
    coverages,
    specialClauses,
  };
}
