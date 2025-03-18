// app/api/recomendaciones/productos/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Define interfaces for form data types
interface CompanyData {
  name?: string;
  billing?: number;
  employees_number?: number;
  installations_type?: string;
  almacena_bienes_terceros?: boolean;
  vehiculos_terceros_aparcados?: boolean;
  m2_installations?: number;
}

interface CapitalesData {
  valor_edificio?: number;
  valor_ajuar?: number;
  valor_existencias?: number;
  existencias_terceros?: boolean;
  existencias_propias_terceros?: boolean;
  bienes_camaras_frigorificas?: boolean;
  valor_equipo_electronico?: number;
  margen_bruto_anual?: number;
}

interface ActividadData {
  manufactura?: {
    producto_consumo_humano?: boolean;
    tiene_empleados_tecnicos?: boolean;
    producto_final_o_intermedio?: string;
    distribucion?: string[];
  };
  servicios?: {
    trabajos_fuera_instalaciones?: boolean;
    corte_soldadura?: boolean;
    trabajo_equipos_electronicos?: boolean;
    empleados_tecnicos?: boolean;
    trabajos_subcontratistas?: boolean;
  };
}

interface ProteccionRoboData {
  alarma_conectada?: boolean;
  camaras_circuito?: boolean;
  protecciones_fisicas?: boolean;
  vigilancia_propia?: boolean;
}

interface ProteccionIncendiosData {
  extintores?: boolean;
  bocas_incendio?: boolean;
  deposito_bombeo?: boolean;
  cobertura_total?: boolean;
  columnas_hidrantes?: boolean;
  deteccion_automatica?: boolean;
  rociadores?: boolean;
  suministro_agua?: boolean;
}

interface FormData {
  form_type?: string;
  company?: CompanyData;
  capitales?: CapitalesData;
  empresaTipo?: string;
  actividad?: ActividadData;
  ambito_territorial?: string;
  coberturas_solicitadas?: any;
  proteccion_robo?: ProteccionRoboData;
  proteccion_incendios?: ProteccionIncendiosData;
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const session_id = searchParams.get("session_id");
    const form_type = searchParams.get("form_type");

    if (!session_id) {
      return NextResponse.json(
        { success: false, error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Get form data
    const { data: forms, error: formsError } = await supabase
      .from("forms")
      .select("id, type, form_data")
      .eq("session_id", session_id);

    if (formsError) throw formsError;

    if (!forms || forms.length === 0) {
      return NextResponse.json({
        success: true,
        recommendations: [],
      });
    }

    console.log("Formularios encontrados para productos:", forms.length);

    // Filter forms by type if specified
    const filteredForms = form_type
      ? forms.filter((form) => form.type === form_type)
      : forms;

    // Generate dynamic product recommendations
    const recommendations = [];

    for (const form of filteredForms) {
      const formData = form.form_data;

      if (form.type === "responsabilidad_civil") {
        // Generate RC product recommendations
        recommendations.push(...generateRCProducts(formData));
      } else if (form.type === "danos_materiales") {
        // Generate DM product recommendations
        recommendations.push(...generateDMProducts(formData));
      }
    }

    console.log("Productos generados:", recommendations.length);

    return NextResponse.json({
      success: true,
      recommendations,
    });
  } catch (error) {
    console.error("Error generating product recommendations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate product recommendations" },
      { status: 500 }
    );
  }
}

// Generate Responsabilidad Civil products based on form data
function generateRCProducts(formData: FormData) {
  // Base pricing tiers
  const basePrices = {
    basic: 450,
    standard: 650,
    premium: 950,
  };

  // Extract key data from form
  const billing = formData.company?.billing || 0;
  const empleados = formData.company?.employees_number || 0;
  const ambitoTerritorial = formData.ambito_territorial || "España y Andorra";
  const empresaTipo = formData.empresaTipo || "servicios";

  // Price modifiers
  let priceFactor = 1.0;

  // Adjust by company size
  if (billing > 1000000) priceFactor *= 1.5;
  else if (billing > 500000) priceFactor *= 1.3;
  else if (billing > 100000) priceFactor *= 1.1;

  // Adjust by employee count
  if (empleados > 100) priceFactor *= 1.3;
  else if (empleados > 50) priceFactor *= 1.2;
  else if (empleados > 20) priceFactor *= 1.1;

  // Adjust by territorial scope
  if (
    ambitoTerritorial.includes("Mundial") &&
    ambitoTerritorial.includes("USA")
  )
    priceFactor *= 1.5;
  else if (ambitoTerritorial.includes("Mundial")) priceFactor *= 1.3;
  else if (ambitoTerritorial.includes("Unión Europea")) priceFactor *= 1.2;

  // Adjust by company type
  if (empresaTipo === "manufactura") priceFactor *= 1.15;

  // Generate product tiers
  return [
    {
      id: "rc-basic",
      name: "Responsabilidad Civil - Plan Básico",
      description:
        "Cobertura esencial para proteger tu negocio con las garantías fundamentales.",
      price: Math.round(basePrices.basic * priceFactor),
      rating: 4.3,
      features: [
        "Cobertura por explotación",
        "Responsabilidad civil patronal",
        "Defensa jurídica incluida",
        `Límite ${billing < 500000 ? "600.000€" : "1.000.000€"}`,
      ],
      recommended: billing < 100000,
      type: "responsabilidad_civil",
      tier: "basic",
    },
    {
      id: "rc-standard",
      name: "Responsabilidad Civil - Plan Estándar",
      description:
        "Protección ampliada para negocios con necesidades específicas.",
      price: Math.round(basePrices.standard * priceFactor),
      rating: 4.6,
      features: [
        "Todas las coberturas del plan Básico",
        "Responsabilidad civil cruzada",
        "Responsabilidad por trabajos terminados",
        formData.actividad?.servicios?.trabajos_fuera_instalaciones
          ? "Cobertura para trabajos exteriores"
          : "Incremento en límites de indemnización",
      ],
      recommended: billing >= 100000 && billing <= 500000,
      type: "responsabilidad_civil",
      tier: "standard",
    },
    {
      id: "rc-premium",
      name: "Responsabilidad Civil - Plan Premium",
      description:
        "Máxima protección para empresas con exposición amplia a riesgos.",
      price: Math.round(basePrices.premium * priceFactor),
      rating: 4.8,
      features: [
        "Todas las coberturas del plan Estándar",
        "Responsabilidad por productos",
        empresaTipo === "manufactura"
          ? "Responsabilidad por unión y mezcla"
          : "Cobertura especial para servicios",
        `Límite ${billing > 1000000 ? "3.000.000€" : "2.000.000€"}`,
        ambitoTerritorial !== "España y Andorra"
          ? `Ámbito territorial: ${ambitoTerritorial}`
          : "Ámbito territorial ampliado",
      ],
      recommended: billing > 500000,
      type: "responsabilidad_civil",
      tier: "premium",
    },
  ];
}

// Generate Daños Materiales products based on form data
function generateDMProducts(formData: FormData) {
  // Base pricing tiers based on capital values
  const valorEdificio = formData?.capitales?.valor_edificio || 0;
  const valorAjuar = formData?.capitales?.valor_ajuar || 0;
  const valorExistencias = formData?.capitales?.valor_existencias || 0;

  // Calculate total insured value
  const totalValue = valorEdificio + valorAjuar + valorExistencias;

  // Base prices
  let basicPrice = totalValue * 0.0015; // 0.15% of total value
  let standardPrice = totalValue * 0.002; // 0.20% of total value
  let premiumPrice = totalValue * 0.0025; // 0.25% of total value

  // Adjust prices based on risk factors
  const tieneAlarma = formData?.proteccion_robo?.alarma_conectada || false;
  const tieneExtintores = formData?.proteccion_incendios?.extintores || false;
  const tieneCamaras = formData?.proteccion_robo?.camaras_circuito || false;
  const tieneBocasIncendio =
    formData?.proteccion_incendios?.bocas_incendio || false;

  // Risk reduction for security measures
  let riskFactor = 1.0;
  if (tieneAlarma) riskFactor -= 0.05;
  if (tieneExtintores) riskFactor -= 0.03;
  if (tieneCamaras) riskFactor -= 0.04;
  if (tieneBocasIncendio) riskFactor -= 0.05;

  // Apply risk factor to prices (minimum 0.7 - maximum 30% discount)
  riskFactor = Math.max(0.7, riskFactor);

  basicPrice *= riskFactor;
  standardPrice *= riskFactor;
  premiumPrice *= riskFactor;

  // Round prices to avoid decimals
  basicPrice = Math.round(basicPrice);
  standardPrice = Math.round(standardPrice);
  premiumPrice = Math.round(premiumPrice);

  // Minimum prices
  basicPrice = Math.max(basicPrice, 400);
  standardPrice = Math.max(standardPrice, 550);
  premiumPrice = Math.max(premiumPrice, 750);

  // Generate product recommendations
  return [
    {
      id: "dm-basic",
      name: "Daños Materiales - Plan Básico",
      description: "Protección esencial para tus instalaciones y bienes.",
      price: basicPrice,
      rating: 4.2,
      features: [
        "Cobertura básica de incendio",
        "Daños por agua",
        "Responsabilidad civil del inmueble",
        "Asistencia 24h para emergencias",
      ],
      recommended: totalValue < 200000,
      type: "danos_materiales",
      tier: "basic",
    },
    {
      id: "dm-standard",
      name: "Daños Materiales - Plan Estándar",
      description:
        "Protección ampliada con coberturas adicionales para mayor tranquilidad.",
      price: standardPrice,
      rating: 4.5,
      features: [
        "Todas las coberturas del plan Básico",
        "Robo y expoliación",
        "Rotura de cristales",
        "Pérdida de beneficios (6 meses)",
        formData?.proteccion_robo?.alarma_conectada
          ? "Descuento por sistema de alarma"
          : "Daños estéticos",
      ],
      recommended: totalValue >= 200000 && totalValue <= 500000,
      type: "danos_materiales",
      tier: "standard",
    },
    {
      id: "dm-premium",
      name: "Daños Materiales - Plan Premium",
      description:
        "Máxima protección con coberturas todo riesgo para tu negocio.",
      price: premiumPrice,
      rating: 4.7,
      features: [
        "Todas las coberturas del plan Estándar",
        "Cláusula de todo riesgo accidental",
        "Pérdida de beneficios (12 meses)",
        "Daños eléctricos ampliados",
        formData?.capitales?.bienes_camaras_frigorificas
          ? "Cobertura para bienes refrigerados"
          : "Daños a equipos electrónicos",
      ],
      recommended: totalValue > 500000,
      type: "danos_materiales",
      tier: "premium",
    },
  ];
}
