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
    // Obtener los parámetros
    const searchParams = request.nextUrl.searchParams;
    const session_id = searchParams.get("session_id");
    const form_type = searchParams.get("form_type");

    console.log("===== API RECOMENDACIONES ROUTE DEBUG =====");
    console.log("Session ID recibido:", session_id);
    console.log("Form Type recibido:", form_type);

    // En lugar de filtrar por session_id, obtener el formulario más reciente
    // filtrado solo por tipo si se especifica
    let query = supabase.from("forms").select(
      `
        id,
        type,
        form_data,
        created_at
      `
    );

    // Si se especifica un tipo de formulario, filtrar solo por ese tipo
    if (form_type) {
      query = query.eq("type", form_type);
    }

    // Ordenar por fecha de creación descendente para obtener los más recientes primero
    query = query.order("created_at", { ascending: false });

    // Limitar a un resultado para obtener solo el más reciente
    query = query.limit(1);

    // Ejecutar la consulta
    const { data: forms, error: formsError } = await query;

    if (formsError) throw formsError;

    if (!forms || forms.length === 0) {
      return NextResponse.json({
        success: true,
        recommendations: [],
      });
    }

    console.log("Formulario más reciente encontrado:", forms[0].id);
    console.log("Fecha de creación:", forms[0].created_at);

    // Intentar obtener datos de contacto - primero de contact_info si existe
    const { data: contactData, error: contactError } = await supabase
      .from("contact_info")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);

    if (contactError && contactError.code !== "PGRST116") {
      console.error("Error fetching contact info:", contactError);
    }

    console.log(
      "Datos de contacto:",
      contactData ? contactData[0] : "No encontrados"
    );

    // Si no hay datos de contacto, extraerlos del formulario
    const contactInfo =
      contactData && contactData.length > 0 ? contactData[0] : null;

    // Alternativa: extraer datos de contacto del form_data si están disponibles
    const formContactInfo = forms[0].form_data?.contact || {};

    // Usar contactInfo de la base de datos o del formulario
    const contactDataToUse = contactInfo || formContactInfo;

    // Procesar formularios para generar recomendaciones
    // Agrupar por tipo para evitar duplicados
    const recommendationsByType: Record<string, InsuranceRecommendation> = {};

    for (const form of forms) {
      // Si ya tenemos una recomendación para este tipo, omitir
      if (recommendationsByType[form.type]) continue;

      if (form.type === "responsabilidad_civil") {
        recommendationsByType[form.type] = generateRCCoverages(
          form.form_data,
          contactDataToUse
        );
      } else if (form.type === "danos_materiales") {
        recommendationsByType[form.type] = generateDMCoverages(
          form.form_data,
          contactDataToUse
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

  // Añadir la descripción manual si existe
  if (formData?.company?.activity_description) {
    if (activityDescription) {
      activityDescription += ". " + formData.company.activity_description;
    } else {
      activityDescription = formData.company.activity_description;
    }
  }

  return activityDescription;
}

// Versión corregida de la función generateRCCoverages con todas las correcciones

function generateRCCoverages(
  formData: any,
  contactData: any
): InsuranceRecommendation {
  const { generalLimit, victimSubLimit } = determineLimitsRC(
    formData?.company?.billing
  );

  // Para depuración
  console.log(
    "DEBUG - Datos del formulario para recomendaciones RC:",
    JSON.stringify(formData, null, 2)
  );

  // Preparamos la información de la empresa
  const companyInfo = {
    name: formData?.company?.name || contactData?.name || "",
    address: formData?.company?.localizacion_nave || "",
    activity: formData?.company?.activity || "",
    activityDescription: buildActivityDescription(formData),
    cnae_code: formData?.company?.cnae_code || "", // Añadir esta línea
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

  // RC Patronal solo si hay empleados (más de 1)
  console.log(
    "DEBUG - Número de empleados:",
    formData?.company?.employees_number
  );
  if (formData?.company?.employees_number > 1) {
    console.log("DEBUG - RC Patronal AGREGADA");
    coverages.push({
      name: "Responsabilidad Civil Patronal",
      required: true,
      limit: generalLimit,
      sublimit: victimSubLimit,
    });
  } else {
    console.log("DEBUG - RC Patronal NO agregada, employees_number <= 1");
  }

  // RC Inmobiliaria o Locativa según tipo de instalación
  console.log("DEBUG - Verificando installations_type para RC Inmobiliaria:");
  console.log("Valor exacto:", formData?.company?.installations_type);
  console.log("Tipo:", typeof formData?.company?.installations_type);
  console.log(
    "Coincide con 'Propietario':",
    formData?.company?.installations_type === "Propietario"
  );
  console.log(
    "Incluye 'Propietario':",
    typeof formData?.company?.installations_type === "string" &&
      formData?.company?.installations_type.includes("Propietario")
  );

  // Usar una comparación más flexible para installations_type
  if (
    typeof formData?.company?.installations_type === "string" &&
    (formData.company.installations_type === "Propietario" ||
      formData.company.installations_type.includes("Propietario"))
  ) {
    console.log("DEBUG - RC Inmobiliaria AGREGADA");
    coverages.push({
      name: "Responsabilidad Civil Inmobiliaria",
      required: true,
      limit: generalLimit,
    });
  } else {
    console.log(
      "DEBUG - RC Inmobiliaria NO agregada, installation_type no coincide:",
      formData?.company?.installations_type
    );
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

  // Contaminación accidental
  console.log(
    "DEBUG - Cover accidental contamination:",
    formData?.coberturas_solicitadas?.coberturas_adicionales
      ?.cover_accidental_contamination
  );
  if (
    formData?.coberturas_solicitadas?.coberturas_adicionales
      ?.cover_accidental_contamination === true
  ) {
    console.log("DEBUG - RC Contaminación Accidental AGREGADA");
    coverages.push({
      name: "Responsabilidad Civil por Contaminación Accidental",
      required: true,
      limit: generalLimit,
    });
  }

  // RC Cruzada (si subcontrata)
  if (
    formData?.actividad?.servicios?.subcontrata_personal === true ||
    formData?.actividad?.manufactura?.subcontrata_personal === true
  ) {
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

  console.log(
    "DEBUG - Producto intermedio/final:",
    formData?.actividad?.manufactura?.producto_intermedio_final
  );

  // Verificación más robusta con fallback
  const productoTipo =
    formData?.actividad?.manufactura?.producto_intermedio_final ||
    (formData?.actividad?.manufactura &&
    "producto_intermedio_final" in formData.actividad.manufactura
      ? formData.actividad.manufactura.producto_intermedio_final
      : undefined);

  console.log("DEBUG - Tipo de producto (con fallback):", productoTipo);

  if (productoTipo === "intermedio") {
    console.log("DEBUG - RC por Unión y Mezcla AGREGADA");
    coverages.push({
      name: "Responsabilidad Civil por Unión y Mezcla",
      required: true,

      limit: "Límite sugerido: entre 100.000€ a 600.000€",
    });
  }

  // Gastos de retirada (si es consumo humano)
  console.log(
    "DEBUG - Producto consumo humano:",
    formData?.actividad?.manufactura?.producto_consumo_humano
  );

  // Verificación más robusta con fallback
  const productoConsumoHumano =
    formData?.actividad?.manufactura?.producto_consumo_humano === true ||
    (formData?.actividad?.manufactura &&
    "producto_consumo_humano" in formData.actividad.manufactura
      ? !!formData.actividad.manufactura.producto_consumo_humano
      : false);

  console.log(
    "DEBUG - Producto consumo humano (con fallback):",
    productoConsumoHumano
  );

  if (productoConsumoHumano === true) {
    console.log("DEBUG - Gastos de Retirada AGREGADA");
    coverages.push({
      name: "Gastos de Retirada",
      required: true,
      limit: "Límite sugerido: entre 100.000€ y 600.000€",
    });
  }

  // RC de técnicos en plantilla
  if (
    formData?.coberturas_solicitadas?.coberturas_adicionales
      ?.has_contracted_professionals === true
  ) {
    coverages.push({
      name: "Responsabilidad Civil de Técnicos en Plantilla",
      required: true,
      limit: generalLimit,
    });
  }

  // Trabajos en Caliente (si realiza trabajos de corte y soldadura)
  if (
    formData?.actividad?.servicios?.trabajos_corte_soldadura === true ||
    formData?.actividad?.manufactura?.trabajos_corte_soldadura === true
  ) {
    console.log("DEBUG - Trabajos en Caliente AGREGADA");
    coverages.push({
      name: "Trabajos en Caliente",
      required: true,
      condition: "Incluida",
    });
  }

  // RC Daños a conducciones
  if (
    formData?.actividad?.servicios?.trabajos_afectan_infraestructuras ===
      true ||
    formData?.actividad?.manufactura?.trabajos_afectan_infraestructuras === true
  ) {
    coverages.push({
      name: "Responsabilidad Civil Daños a Conducciones",
      required: true,
      limit: generalLimit,
    });
  }

  // Daños a colindantes
  if (
    formData?.actividad?.servicios?.trabajos_afectan_edificios === true ||
    formData?.actividad?.manufactura?.trabajos_afectan_edificios === true
  ) {
    coverages.push({
      name: "Daños a Colindantes",
      required: true,
      limit: generalLimit,
    });
  }

  // Trabajadores Desplazados Fuera de las Instalaciones
  if (
    formData?.actividad?.servicios?.trabajos_instalaciones_terceros === true ||
    formData?.actividad?.manufactura?.trabajos_instalaciones_terceros === true
  ) {
    console.log("DEBUG - Trabajadores Desplazados AGREGADA");
    coverages.push({
      name: "Trabajadores Desplazados Fuera de las Instalaciones",
      required: true,
      condition: "Incluida",
    });
  }

  // RC Objetos confiados/custodiados
  console.log(
    "DEBUG - Almacena bienes terceros:",
    formData?.company?.almacena_bienes_terceros
  );
  console.log(
    "DEBUG - Stores third party goods:",
    formData?.coberturas_solicitadas?.coberturas_adicionales
      ?.stores_third_party_goods
  );
  if (
    formData?.company?.almacena_bienes_terceros === true ||
    formData?.coberturas_solicitadas?.coberturas_adicionales
      ?.stores_third_party_goods === true
  ) {
    console.log("DEBUG - RC Objetos Confiados AGREGADA");
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
      ?.participates_in_fairs === true
  ) {
    coverages.push({
      name: "Cobertura de Responsabilidad sobre Ferias y Exposiciones",
      required: true,
      condition: "Incluida",
    });
  }

  // Daños a bienes preexistentes
  if (
    formData?.actividad?.servicios?.cubre_preexistencias === true ||
    formData?.actividad?.manufactura?.cubre_preexistencias === true
  ) {
    coverages.push({
      name: "Daños a Bienes Preexistentes",
      required: true,
      limit: generalLimit,
      condition:
        "Excluyéndose en cualquier caso los daños a aquella parte específica dónde trabaja el asegurado",
    });
  }

  // RC vehículos de terceros
  console.log(
    "DEBUG - Vehículos terceros aparcados:",
    formData?.company?.vehiculos_terceros_aparcados
  );
  console.log(
    "DEBUG - Third party vehicles parked:",
    formData?.coberturas_solicitadas?.coberturas_adicionales
      ?.third_party_vehicles_parked
  );
  if (
    formData?.company?.vehiculos_terceros_aparcados === true ||
    formData?.coberturas_solicitadas?.coberturas_adicionales
      ?.third_party_vehicles_parked === true
  ) {
    console.log("DEBUG - RC Daños a Vehículos AGREGADA");
    coverages.push({
      name: "Responsabilidad Civil Daños a Vehículos de Terceros dentro de Instalaciones",
      required: true,
      condition: "Incluida",
    });
  }

  // Daños al receptor de energía
  console.log("DEBUG - Placas venta red:", formData?.company?.placas_venta_red);
  console.log(
    "DEBUG - Placas solares:",
    formData?.company?.tiene_placas_solares
  );
  if (formData?.company?.placas_venta_red === true) {
    console.log("DEBUG - Daños al Receptor de Energía AGREGADA");
    coverages.push({
      name: "Responsabilidad Civil Daños al Receptor de la Energía",
      required: true,
      limit: generalLimit,
    });

    // Eliminar esta entrada duplicada:
    // coverages.push({
    //   name: "Daños al Receptor de Energía",
    //   required: true,
    //   condition: "Incluida",
    // });
  }

  // Daños a bienes de empleados
  if (
    formData?.coberturas_solicitadas?.coberturas_adicionales
      ?.cover_employee_damages === true
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
      ?.cover_material_damages === true
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
      ?.has_subsidiaries_outside_spain === true
  ) {
    const scope =
      formData?.coberturas_solicitadas?.coberturas_adicionales
        ?.territorial_scope;
    console.log("DEBUG - Ámbito territorial scope:", scope);
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
    console.log("DEBUG - Ámbito productos alcance (original):", alcance);

    // Verificaciones más explícitas con comparaciones estrictas
    if (alcance === "union_europea") {
      ambitoProductos = "Unión Europea";
    } else if (alcance === "europa_reino_unido") {
      ambitoProductos = "Unión Europea y Reino Unido";
    } else if (alcance === "mundial_excepto_usa_canada") {
      ambitoProductos = "Todo el Mundo excepto USA y Canadá";
    } else if (alcance === "mundial_incluyendo_usa_canada") {
      ambitoProductos = "Todo el Mundo incluido USA y Canadá";
    }

    console.log("DEBUG - Ámbito productos resultado:", ambitoProductos);
  }

  // Tratar de encontrar datos de alcance geográfico en otros campos si no está en la ruta estándar
  if (
    ambitoProductos === "España y Andorra" &&
    formData?.actividad?.manufactura
  ) {
    // Buscar en otras propiedades que podrían contener esta información
    const manufacturaData = formData.actividad.manufactura;

    if (typeof manufacturaData === "object" && manufacturaData !== null) {
      // Buscar cualquier campo que pueda contener información de alcance geográfico
      const keys = Object.keys(manufacturaData);
      console.log("DEBUG - Campos disponibles en manufactura:", keys);

      // Buscar claves que puedan contener información de alcance
      const alcanceKeys = keys.filter(
        (k) =>
          k.includes("alcance") ||
          k.includes("geografico") ||
          k.includes("scope") ||
          k.includes("mundial") ||
          k.includes("europa")
      );

      if (alcanceKeys.length > 0) {
        console.log(
          "DEBUG - Posibles campos de alcance encontrados:",
          alcanceKeys
        );

        // Intentar usar el primer campo encontrado
        const alcanceValue = (manufacturaData as any)[alcanceKeys[0]];
        console.log("DEBUG - Valor de alcance alternativo:", alcanceValue);

        // Verificar si este valor podría ser un indicador de alcance mundial
        if (typeof alcanceValue === "string") {
          if (
            alcanceValue.includes("mundial") ||
            alcanceValue.includes("world")
          ) {
            ambitoProductos = "Todo el Mundo excepto USA y Canadá";
          } else if (
            alcanceValue.includes("europa") ||
            alcanceValue.includes("europe")
          ) {
            ambitoProductos = "Unión Europea";
          }
        }
      }
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
    cnae_code: formData?.company?.cnae_code || "", // Añadir esta línea
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
