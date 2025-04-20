// lib/services/emailService.ts
import { DanosInsuranceRecommendation, Coverage } from "@/types";

interface EmailConfig {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  template: string;
  data: any;
  attachment?: any;
}

// Función principal para enviar emails
export async function sendEmail(config: EmailConfig) {
  try {
    console.log("Enviando email con configuración:", {
      to: config.to,
      subject: config.subject,
      template: config.template,
    });

    const response = await fetch("/api/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error respuesta API email:", response.status, errorText);
      throw new Error(
        `Error al enviar el email: ${response.statusText} - ${errorText}`
      );
    }

    const result = await response.json();
    console.log("Respuesta de la API de email:", result);
    return result;
  } catch (error) {
    console.error("Error en sendEmail:", error);
    throw error;
  }
}

// Formatea un número como moneda
function formatCurrency(value?: number): string {
  if (value === undefined || value === null) return "N/A";
  return (
    new Intl.NumberFormat("es-ES", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value) + "€"
  );
}

// Función específica para enviar la cotización de Daños Materiales
export async function sendDanosRecommendationEmail(
  recommendation: DanosInsuranceRecommendation,
  contactEmail: string,
  contactName: string
) {
  try {
    // Email interno con la solicitud de cotización
    const internalEmailConfig: EmailConfig = {
      to: ["bautistaroberts@gmail.com", "rodrigo@smartadvice.es"],
      cc: [contactEmail], // Añadir al cliente en copia
      subject: "Solicitud de Cotizacion - Seguro de Danos",
      template: "danos-interno", // Usamos la plantilla interna que ya existe
      data: {
        recommendation: recommendation,
      },
    };

    // Enviar el email de cotización
    const internalResponse = await sendEmail(internalEmailConfig);

    return {
      success: true,
      internalEmail: internalResponse,
    };
  } catch (error) {
    console.error("Error al enviar email de recomendación:", error);
    throw error;
  }
}

// Función para formatear materiales de construcción
function formatMaterial(material: string | undefined) {
  if (!material) return "No especificado";

  // Mapping de códigos a nombres legibles
  const materialLabels: Record<string, string> = {
    // Materiales de cubierta
    hormigon: "Hormigón",
    chapa_metalica: "Chapa metálica simple",
    panel_sandwich_lana: "Panel sándwich con lana de roca o fibra de vidrio",
    panel_sandwich_pir: "Panel sándwich PIR/PUR",
    madera: "Madera",
    // Materiales de cerramientos
    ladrillo: "Ladrillo",
    metalico: "Metálico",
    panel_sandwich: "Panel Sandwich",
    // Materiales de estructura
    metalica: "Metálica",
    mixta: "Mixta",
    otros: "Otros materiales",
  };

  return materialLabels[material] || material.replace(/_/g, " ");
}

// Safe findCoverage function
function findCoverage(coverages: Coverage[], name: string): Coverage | null {
  const coverage = coverages.find((c) => c.name === name);
  return coverage && coverage.required ? coverage : null;
}

// Función auxiliar para obtener el límite de daños eléctricos
function getDanosElectricosLimit(valorEdificio?: number): string {
  if (!valorEdificio) return "30.000€";
  if (valorEdificio >= 1500000) return "100.000€";
  if (valorEdificio >= 1000000) return "100.000€";
  if (valorEdificio >= 500000) return "60.000€";
  return "30.000€";
}

// Función auxiliar para obtener el porcentaje de robo
function getRoboPercentage(capitalesInfo: any): string {
  const totalCapitales =
    (capitalesInfo.valor_edificio || 0) +
    (capitalesInfo.valor_ajuar || 0) +
    (capitalesInfo.valor_existencias || 0);

  return totalCapitales > 1000000 ? "50%" : "25%";
}

// Nueva función para generar el contenido del email interno en formato texto plano
export function generatePlainDanosInternalEmailContent(
  recommendation: DanosInsuranceRecommendation
): string {
  const {
    companyInfo,
    constructionInfo,
    protectionInfo,
    capitalesInfo,
    coverages,
    specialClauses,
  } = recommendation;

  // Verificar si tiene margen bruto anual
  const hasMargenBruto =
    capitalesInfo.margen_bruto_anual && capitalesInfo.margen_bruto_anual > 0;

  // Calcular el límite de daños eléctricos
  const danosElectricosLimit = getDanosElectricosLimit(
    capitalesInfo.valor_edificio
  );

  // Calcular el porcentaje de robo
  const roboPercentage = getRoboPercentage(capitalesInfo);

  let emailContent = `Estimados,

Sirva el presente correo para solicitar cotización de seguro de daños Riesgos Nominados para el cliente de referencia, de acuerdo con la siguiente información:

Tomador: ${companyInfo.name || ""}
CIF: ${companyInfo.cif || ""}
Dirección: ${companyInfo.address || ""}
CNAE: ${companyInfo.cnae || ""}
ACTIVIDAD: ${companyInfo.activityDescription || companyInfo.activity || ""}`;

  // Agregar información de Asegurado Adicional si no es propietario
  if (
    companyInfo.installations_type === "No propietario" &&
    companyInfo.owner_name
  ) {
    emailContent += `
ASEGURADO ADICIONAL: Se hace constar que el Sr. O la empresa ${
      companyInfo.owner_name
    }, con NIF ${
      companyInfo.owner_cif || "XXXX"
    }, tendrá el carácter de beneficiario de la Indemnización en su calidad de propietario de las instalaciones.`;
  }

  // Características constructivas
  emailContent += `

CATACTERÍSTICAS CONSTRUCTIVAS DEL INMUEBLE
Estructura: ${formatMaterial(constructionInfo.estructura) || ""}
Cubre: ${formatMaterial(constructionInfo.cubierta) || ""}
Cerramientos: ${formatMaterial(constructionInfo.cerramientos) || ""}
M2: ${companyInfo.m2 || ""}

PROTECCIONES CONTRA INCENDIOS
`;

  // Protecciones contra incendio - añadimos la lista completa
  const fireProtections = [];
  if (protectionInfo.extintores) fireProtections.push("Extintores");
  if (protectionInfo.bocas_incendio) {
    let text = "Bocas de incendio equipadas (BIE)";
    if (protectionInfo.cobertura_total) text += " con cobertura total";
    if (protectionInfo.deposito_bombeo) text += " con depósito propio";
    fireProtections.push(text);
  }
  if (protectionInfo.columnas_hidrantes) {
    let text = "Columnas hidrantes exteriores";
    if (protectionInfo.columnas_hidrantes_tipo) {
      text += ` - Sistema ${protectionInfo.columnas_hidrantes_tipo}`;
    }
    fireProtections.push(text);
  }
  if (protectionInfo.deteccion_automatica) {
    let text = "Detección automática de incendios";
    if (
      Array.isArray(protectionInfo.deteccion_zona) &&
      protectionInfo.deteccion_zona.length > 0
    ) {
      if (protectionInfo.deteccion_zona[0] === "totalidad") {
        text += " con cobertura total";
      } else {
        text += ` en ${protectionInfo.deteccion_zona.join(", ")}`;
      }
    }
    fireProtections.push(text);
  }
  if (protectionInfo.rociadores) {
    let text = "Rociadores automáticos";
    if (
      Array.isArray(protectionInfo.rociadores_zona) &&
      protectionInfo.rociadores_zona.length > 0
    ) {
      if (protectionInfo.rociadores_zona[0] === "totalidad") {
        text += " con cobertura total";
      } else {
        text += ` en ${protectionInfo.rociadores_zona.join(", ")}`;
      }
    }
    fireProtections.push(text);
  }
  if (protectionInfo.suministro_agua) {
    fireProtections.push(
      `Suministro de agua: ${protectionInfo.suministro_agua.replace(/_/g, " ")}`
    );
  }

  emailContent += fireProtections.length > 0 ? fireProtections.join(", ") : "";

  // Protecciones contra robo
  emailContent += `

PROTECCIONES CONTRA ROBO
`;

  const theftProtections = [];
  if (protectionInfo.protecciones_fisicas)
    theftProtections.push("Protecciones físicas (rejas, cerraduras...)");
  if (protectionInfo.vigilancia_propia)
    theftProtections.push("El polígono cuenta con vigilancia propia");
  if (protectionInfo.alarma_conectada)
    theftProtections.push("Alarma de robo conectada a central de alarma");
  if (protectionInfo.camaras_circuito)
    theftProtections.push("Circuito Cerrado de Televisión/Cámaras");

  emailContent +=
    theftProtections.length > 0 ? theftProtections.join(", ") : "";

  // Capitales a asegurar
  emailContent += `

CAPITALES A ASEGURAR
* Edificio: ${formatCurrency(capitalesInfo.valor_edificio)}
* Ajuar industrial: ${formatCurrency(capitalesInfo.valor_ajuar)}
* Existencias: ${formatCurrency(capitalesInfo.valor_existencias)}
* Equipos informáticos: ${formatCurrency(
    capitalesInfo.valor_equipo_electronico
  )}`;

  if (hasMargenBruto) {
    emailContent += `
* Margen bruto anual: ${formatCurrency(capitalesInfo.margen_bruto_anual)}`;
    if (capitalesInfo.periodo_indemnizacion) {
      emailContent += `
* Periodo de indemnización: ${capitalesInfo.periodo_indemnizacion} meses`;
    }
  }

  // Coberturas solicitadas
  emailContent += `

COBERTURAS SOLICITADAS
* Coberturas básicas (Incendio, rayo y explosión) 100% capitales a asegurar
* Riesgos extensivos (lluvia, pedrisco, nieve, humo, etc) 100% capitales a asegurar
* Daños por agua 100% capitales a asegurar
* Daños eléctricos a primer riesgo: ${danosElectricosLimit}
* Avería de maquinaria: ${
    findCoverage(coverages, "Avería de maquinaria")?.limit || ""
  }
* Robo y expoliación al ${roboPercentage}`;

  // Robo de metálico
  const roboMetalicoCaja = findCoverage(
    coverages,
    "Robo de metálico en caja fuerte"
  );
  if (roboMetalicoCaja) {
    emailContent += `
* Robo de metálico en caja fuerte: ${roboMetalicoCaja.limit || ""}`;
  }

  const roboMetalicoMueble = findCoverage(
    coverages,
    "Robo de metálico en mueble cerrado"
  );
  if (roboMetalicoMueble) {
    emailContent += `
* Robo de metal en mueble cerrado: ${roboMetalicoMueble.limit || ""}`;
  }

  const roboTransportador = findCoverage(
    coverages,
    "Robo al transportador de fondos"
  );
  if (roboTransportador) {
    emailContent += `
* Robo al transportador de fondos: ${roboTransportador.limit || ""}`;
  }

  // Otros bienes
  const bienesTerceros = findCoverage(
    coverages,
    "Bienes de terceros depositados en las instalaciones del asegurado"
  );
  if (bienesTerceros) {
    emailContent += `
* Bienes de terceros depositados en las instalaciones del asegurado: ${
      bienesTerceros.limit || ""
    }`;
  }

  const bienesPropiosTerceros = findCoverage(
    coverages,
    "Bienes propios depositados en casa de terceros"
  );
  if (bienesPropiosTerceros) {
    emailContent += `
* Bienes propios depositados en casa de terceros: ${
      bienesPropiosTerceros.limit || ""
    }`;
  }

  const bienesIntemperie = findCoverage(
    coverages,
    "Bienes depositados a la intemperie o aire libre"
  );
  if (bienesIntemperie) {
    emailContent += `
* Bienes depositados a la intemperie o aire libre: ${
      bienesIntemperie.limit || ""
    }`;
  }

  const bienesRefrigerados = findCoverage(coverages, "Bienes refrigerados");
  if (bienesRefrigerados) {
    emailContent += `
* Bienes refrigerados: ${bienesRefrigerados.limit || ""}`;
    if (bienesRefrigerados.condition) {
      emailContent += ` ${bienesRefrigerados.condition}`;
    }
  }

  const placasFotovoltaicas = findCoverage(coverages, "Placas fotovoltaicas");
  if (placasFotovoltaicas) {
    emailContent += `
* Placas fotovoltaicas: ${placasFotovoltaicas.limit || ""}`;
  }

  const vehiculosAparcados = findCoverage(
    coverages,
    "Vehículos aparcados en instalaciones"
  );
  if (vehiculosAparcados) {
    emailContent += `
* Vehículos aparcados en instalaciones: ${vehiculosAparcados.limit || ""}`;
  }

  const bienesEmpleados = findCoverage(coverages, "Bienes de empleados");
  if (bienesEmpleados) {
    emailContent += `
* Bienes de empleados: ${bienesEmpleados.limit || ""}`;
  }

  emailContent += `
* Rotura de cristales 6.000€`;

  // Responsabilidad Civil
  emailContent += `

Responsabilidad civil:`;

  const rcGeneral = findCoverage(coverages, "Responsabilidad civil general");
  if (rcGeneral && rcGeneral.required) {
    emailContent += `
* Responsabilidad civil general limitada 600.000€`;
  }

  const rcPatronal = findCoverage(coverages, "Responsabilidad civil patronal");
  if (rcPatronal && rcPatronal.required) {
    emailContent += `
* Responsabilidad civil patronal 600.000€
* Sublimite victima patronal 450.000€`;
  }

  const rcProductos = findCoverage(
    coverages,
    "Responsabilidad civil por productos"
  );
  if (rcProductos && rcProductos.required) {
    emailContent += `
* Responsabilidad civil por productos 600.000€`;
  }

  const rcInmobiliaria = findCoverage(
    coverages,
    "Responsabilidad civil inmobiliaria"
  );
  if (rcInmobiliaria && rcInmobiliaria.required) {
    emailContent += `
* Responsabilidad civil Innmobiliaria 600.000€`;
  }

  const rcLocativa = findCoverage(coverages, "Responsabilidad civil locativa");
  if (rcLocativa && rcLocativa.required) {
    emailContent += `
* Responsabilidad civil locativa 600.000€`;
  }

  // Franquicias y Siniestralidad
  emailContent += `

FRANQUICIAS: GENÉRICAS

SINIESTRALIDAD: ${recommendation.siniestralidad || "NO DECLARA"}

CLAUSULAS ESPECIALES SOLICITADAS
* Cobertura automática para Daños materiales: 20%`;

  if (hasMargenBruto) {
    emailContent += `
* Cobertura automática para pérdida de beneficios: 30%`;
  }

  emailContent += `
* Cláusula de Valor de reposición a nuevo`;

  // Cláusula todo riesgo accidental
  const todoRiesgo = specialClauses.find(
    (c) => c.name === "Cláusula todo riesgo accidental" && c.required
  );
  if (todoRiesgo) {
    emailContent += `
* Cláusula todo riesgo accidental`;
  }

  // Cláusula de Leasing
  const leasing = specialClauses.find(
    (c) => c.name && c.name.includes("Cláusula de Leasing") && c.required
  );
  if (leasing) {
    emailContent += `
* Clausula de Leasing para ${companyInfo.name || ""}`;
  }

  // Finalización
  emailContent += `

Quedamos a la espera de cotización.

Saludos,
SMART ADVICE`;

  return emailContent;
}

// Función original para compatibilidad con el sistema existente
export function generateDanosInternalEmailContent(
  recommendation: DanosInsuranceRecommendation
): string {
  return generatePlainDanosInternalEmailContent(recommendation);
}
