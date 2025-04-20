import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { DanosInsuranceRecommendation, CompanyInfo } from "@/types";
import type { Color, FontStyle } from "jspdf-autotable";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    } | null;
  }
}

// Definir tipos para colores como tuplas
type RGB = [number, number, number];

// Función para formatear materiales de construcción
const formatMaterial = (material: string | undefined) => {
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
};

// Formatea un número como moneda
function formatCurrency(value?: number): string {
  if (value === undefined || value === null || value === 0) return "0€";
  return (
    new Intl.NumberFormat("es-ES", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value) + "€"
  );
}

// Función para obtener la descripción de una cobertura
function getCoverageDescription(coverageName: string): {
  description: string;
  example?: string;
  additionalInfo?: string;
} {
  const descriptions: Record<
    string,
    { description: string; example?: string; additionalInfo?: string }
  > = {
    "Incendio, Rayo y Explosión": {
      description:
        "Cubre los daños materiales directos causados por incendio, caída de rayo o explosión, incluyendo las labores de extinción y salvamento.",
      example:
        "Un incendio en tu nave industrial que daña tanto el edificio como la maquinaria y existencias.",
    },
    "Riesgos extensivos": {
      description:
        "Cubre los daños materiales directos causados por fenómenos como lluvia, viento, pedrisco, nieve, humo, impacto de vehículos y caída de aeronaves.",
      example:
        "Una tormenta de granizo que daña la cubierta del edificio o una inundación que afecta tu almacén.",
    },
    "Daños por Agua": {
      description:
        "Cubre los daños materiales directos causados por derrames de agua debidos a roturas, atascos o desbordamientos de tuberías, desagües, depósitos o instalaciones fijas.",
      example:
        "La rotura de una tubería que ocasiona daños en mercancías o equipos.",
    },
    "Daños eléctricos": {
      description:
        "Cubre los daños materiales directos en la instalación eléctrica y equipos electrónicos por sobretensiones, cortocircuitos u otras alteraciones eléctricas.",
      example:
        "Un pico de tensión que daña la maquinaria o los equipos informáticos.",
    },
    "Robo y expoliación": {
      description:
        "Cubre el robo, la sustracción con violencia o intimidación (expoliación) y los daños por intento de robo.",
      example:
        "El robo de existencias o equipos de tu empresa durante un asalto o intrusión.",
    },
    "Avería de maquinaria": {
      description:
        "Cubre los daños materiales directos sufridos por la maquinaria a consecuencia de una causa accidental e imprevista.",
      example:
        "La rotura de una pieza interna de una máquina que provoca su paralización.",
      additionalInfo:
        "Esta garantía tiene un coste marcadamente más elevado que otras garantías. Sé prudente al indicar el importe a asegurar para no incrementar innecesariamente el coste de la prima.",
    },
    "Robo de metálico": {
      description:
        "Cubre el dinero en efectivo contra robo y expoliación, tanto en caja fuerte como en muebles cerrados.",
      example: "El robo del dinero guardado en la caja fuerte de tu oficina.",
    },
    "Rotura de cristales": {
      description:
        "Cubre la rotura accidental de cristales, lunas, espejos y rótulos instalados de forma fija.",
      example:
        "La rotura accidental del escaparate o de las ventanas de tus instalaciones.",
    },
    "Bienes refrigerados": {
      description:
        "Cubre los daños en mercancías almacenadas en cámaras frigoríficas por avería del equipo de refrigeración o fallo en el suministro eléctrico.",
      example:
        "El deterioro de alimentos refrigerados debido a una avería en el sistema de refrigeración.",
    },
    "Placas fotovoltaicas": {
      description:
        "Cubre los daños materiales directos en instalaciones de energía solar fotovoltaica.",
      example: "Los daños en tus placas solares causados por una tormenta.",
    },
    "Pérdida de beneficios": {
      description:
        "Cubre la pérdida económica resultante de la interrupción temporal del negocio a causa de un siniestro cubierto por la póliza.",
      example:
        "Las pérdidas de beneficios durante el tiempo que tu empresa permanece cerrada tras un incendio.",
    },
    "Responsabilidad Civil": {
      description:
        "Cubre los daños personales, materiales y perjuicios económicos causados involuntariamente a terceros en el ejercicio de tu actividad empresarial.",
      example:
        "Un cliente se lesiona al resbalar en tu establecimiento y te demanda.",
    },
    "Todo riesgo accidental": {
      description:
        "Cubre cualquier daño material accidental que no esté expresamente excluido en la póliza.",
      example:
        "El derrame accidental de un producto químico que daña tu maquinaria.",
    },
    "Bienes de terceros": {
      description:
        "Cubre los daños materiales directos en bienes propiedad de terceros que se encuentren en tus instalaciones.",
      example:
        "Un incendio que daña mercancías de tus clientes almacenadas en tu nave.",
    },
    "Bienes a la intemperie": {
      description:
        "Cubre los daños materiales directos en bienes situados al aire libre dentro del recinto asegurado.",
      example:
        "Una tormenta que daña maquinaria o mercancías almacenadas en el exterior de tus instalaciones.",
    },
  };

  // Buscar la cobertura de forma más flexible
  const coverageKey = Object.keys(descriptions).find(
    (key) =>
      coverageName.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(coverageName.toLowerCase())
  );

  return coverageKey
    ? descriptions[coverageKey]
    : {
        description:
          "Cubre los daños relacionados con esta cobertura específica.",
      };
}

// Colores corporativos como tuplas RGB
const COLORS = {
  primary: [6, 42, 90] as RGB, // #062A5A
  secondary: [251, 46, 37] as RGB, // #FB2E25
  text: [55, 65, 81] as RGB, // text-gray-700
  lightGray: [243, 244, 246] as RGB, // bg-gray-100
  warningBg: [255, 243, 205] as RGB, // Fondo para notas importantes
  warningText: [133, 100, 4] as RGB, // Texto para notas importantes
};

export const generateInsuranceReport = async (
  recommendation: DanosInsuranceRecommendation,
  downloadFile: boolean = false
) => {
  try {
    // Crear documento PDF
    const doc = new jsPDF();
    let currentY = 30; // Iniciar más abajo para dejar espacio al logo
    const leftMargin = 20;
    const pageWidth = doc.internal.pageSize.width;
    const rightMargin = pageWidth - leftMargin;

    // Función para añadir el logo a cada página
    const addLogoToPage = () => {
      try {
        // En Next.js, las rutas públicas se acceden sin el prefijo "/public"
        const logoUrl = "/images/smart-advice-logo.png";

        // Crear una imagen para obtener las dimensiones reales
        const img = new Image();
        img.src = logoUrl;

        // Esperar a que la imagen se cargue para obtener sus dimensiones
        return new Promise<void>((resolve) => {
          img.onload = () => {
            const imgWidth = img.naturalWidth;
            const imgHeight = img.naturalHeight;

            // Definir el ancho máximo deseado para el logo
            const maxWidth = 10;
            const aspectRatio = imgWidth / imgHeight;

            // Calcular el alto proporcional para mantener la relación de aspecto
            const calculatedHeight = maxWidth / aspectRatio;

            // Posicionar el logo en la esquina superior izquierda con las dimensiones ajustadas
            doc.addImage(
              logoUrl,
              "PNG",
              leftMargin,
              10,
              maxWidth,
              calculatedHeight
            );
            resolve();
          };

          img.onerror = () => {
            console.error("Error al cargar el logo");
            // Plan B: usar texto si la imagen falla
            doc.setFontSize(10);
            doc.setTextColor(...COLORS.primary);
            doc.text("SMART ADVICE", leftMargin, 15);
            resolve();
          };
        });
      } catch (error) {
        console.error("Error al añadir logo:", error);
        // Plan B: usar texto si la imagen falla
        doc.setFontSize(10);
        doc.setTextColor(...COLORS.primary);
        doc.text("SMART ADVICE", leftMargin, 15);
      }
    };

    // Añadir logo a la primera página
    await addLogoToPage();

    // Funciones helper
    const addTitle = (text: string, size = 16, bold = true) => {
      checkPageBreak(15);
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(size);
      doc.setTextColor(...COLORS.primary);
      doc.text(text, leftMargin, currentY);
      currentY += 8;
    };

    const addText = (text: string, fontSize = 10, bold = false) => {
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(fontSize);
      doc.setTextColor(...COLORS.text);
      const splitText = doc.splitTextToSize(text, pageWidth - 40);
      checkPageBreak(splitText.length * 6);
      doc.text(splitText, leftMargin, currentY);
      currentY += splitText.length * 6;
    };

    const addBulletPoint = (text: string) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.text);

      // Crear el punto de la lista
      doc.text("•", leftMargin, currentY);

      // Texto con un poco de sangría
      const bulletIndent = 5;
      const splitText = doc.splitTextToSize(
        text,
        pageWidth - 40 - bulletIndent
      );
      doc.text(splitText, leftMargin + bulletIndent, currentY);

      currentY += splitText.length * 6;
    };

    const addImportantNote = (text: string) => {
      checkPageBreak(25);

      // Calcular dimensiones del recuadro
      const maxWidth = pageWidth - 40;
      // Reducir el ancho disponible para el texto para aumentar márgenes internos
      const textWidth = maxWidth - 30; // 30 unidades totales de margen (15 a cada lado)
      const splitText = doc.splitTextToSize(`Importante: ${text}`, textWidth);
      const boxHeight = splitText.length * 6 + 16; // Aumentamos aún más el margen vertical

      // Dibujar el recuadro amarillo
      doc.setFillColor(...COLORS.warningBg);
      doc.setDrawColor(...COLORS.warningText);
      doc.setLineWidth(0.5);
      doc.roundedRect(
        leftMargin,
        currentY - 4,
        maxWidth,
        boxHeight,
        3,
        3,
        "FD"
      );

      // Configurar el estilo del texto
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.warningText);

      // Añadir el texto con mayor margen a la izquierda
      currentY += 6; // Más espacio para centrar verticalmente
      doc.text(splitText, leftMargin + 15, currentY); // 15 unidades de margen izquierdo

      // Actualizar la posición Y después del recuadro
      currentY += splitText.length * 6 + 12; // Más espacio después del recuadro
    };

    const checkPageBreak = async (requiredSpace: number) => {
      if (currentY + requiredSpace > doc.internal.pageSize.height - 20) {
        doc.addPage();
        currentY = 30; // Ajustar para dejar espacio al logo
        await addLogoToPage(); // Añadir logo a la nueva página
      }
    };

    // TÍTULO PRINCIPAL
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.primary);
    doc.text("INFORME DE SEGURO DE DAÑOS MATERIALES", pageWidth / 2, currentY, {
      align: "center",
    });
    currentY += 15;

    // INTRODUCCIÓN
    addText(
      "Un seguro de daños es un contrato mediante el cual una compañía aseguradora se compromete a indemnizar al asegurado por las pérdidas económicas que sufra como consecuencia de daños materiales ocasionados a sus bienes. Esta modalidad de seguro constituye una de las herramientas clave en la gestión de riesgos empresariales."
    );
    currentY += 4;

    addText(
      "Su objetivo es preservar la estabilidad patrimonial de la empresa, garantizando la recuperación del valor de los activos afectados y, en muchos casos, la continuidad operativa del negocio tras un siniestro."
    );
    currentY += 6;

    // PARA QUÉ SIRVE
    addTitle("¿Para qué sirve?", 12);

    addText(
      "Porque protege la continuidad del negocio y tu inversión. Un siniestro puede suponer no solo pérdidas materiales, sino también la paralización de la actividad. Con un seguro de daños:"
    );
    currentY += 4;

    addBulletPoint("Tienes respaldo económico ante imprevistos graves");
    addBulletPoint("Garantizas tu capacidad para seguir operando");
    addBulletPoint("Transmites seguridad a socios, clientes y proveedores");
    currentY += 6;

    // QUÉ BIENES SE PUEDEN ASEGURAR
    addTitle("¿Qué bienes se pueden asegurar?", 12);

    addBulletPoint(
      "El edificio o local (continente): muros, techos, suelos, instalaciones fijas"
    );
    addBulletPoint(
      "El contenido: mobiliario, maquinaria, equipos electrónicos, mercancías"
    );
    addBulletPoint("Bienes de terceros que estén bajo tu custodia");
    addBulletPoint(
      "Dinero en metálico en caja o durante transporte (según la póliza)"
    );
    addBulletPoint("Bienes en tránsito o en otros locales");
    addBulletPoint("Archivos, moldes, documentos y datos digitales");
    currentY += 6;

    // DATOS GENERALES DEL SEGURO
    addTitle("Datos generales de tu seguro", 12);

    // Usar directamente los datos de la recomendación
    const companyName = recommendation.companyInfo.name || "";
    const companyAddress = recommendation.companyInfo.address || "";
    const actividadDescripcion =
      recommendation.companyInfo.activityDescription ||
      recommendation.companyInfo.activity ||
      "";

    // Añadir datos de la empresa
    addText(`Tomador: ${companyName}`, 10, true);
    addText(`CIF: ${recommendation.companyInfo.cif || "No especificado"}`);
    addText(`Dirección: ${companyAddress}`);
    addText(`CNAE: ${recommendation.companyInfo.cnae || "No especificado"}`);
    addText(`Actividad: ${actividadDescripcion}`);

    // Determinar si es propietario para añadir asegurado adicional
    const isOwner =
      recommendation.companyInfo.installations_type === "Propietario";

    // Información de asegurado adicional (si no es propietario)
    if (!isOwner && recommendation.companyInfo.owner_name) {
      addText(
        `Asegurado adicional: Se hace constar que el Sr. o la empresa ${
          recommendation.companyInfo.owner_name
        } con NIF/DNI ${
          recommendation.companyInfo.owner_cif || "No especificado"
        } tendrá el carácter de beneficiario de la Indemnización en su calidad de propietario de las instalaciones.`
      );

      addImportantNote(
        "Si no eres el propietario de las instalaciones es probable que éste te haya solicitado en el contrato de arrendamiento que lo incluyas como asegurado adicional (esto es, como beneficiario). En caso de siniestro que afecte al inmueble, el propietario del inmueble tiene derecho a cobrar la indemnización del seguro que tu has contratado. Para demostrar que has cumplido con esta obligación contractual, puedes solicitarle a la compañía de seguros que te emita un certificado de seguro haciendo constar como beneficiario al propietario del inmueble."
      );
    }
    currentY += 6;

    // CARACTERÍSTICAS CONSTRUCTIVAS
    addTitle("Características constructivas del inmueble", 12);

    addText(
      `Estructura: ${formatMaterial(
        recommendation.constructionInfo.estructura
      )}`,
      10,
      true
    );
    addText(
      `Cubierta: ${formatMaterial(recommendation.constructionInfo.cubierta)}`
    );
    addText(
      `Cerramientos: ${formatMaterial(
        recommendation.constructionInfo.cerramientos
      )}`
    );
    addText(
      `M²: ${
        recommendation.companyInfo.m2
          ? recommendation.companyInfo.m2.toLocaleString()
          : "No especificado"
      } m²`
    );

    addText(
      "Debes ser preciso a la hora de indicar los materiales de construcción de la nave o instalación. Además, debes comprobar que esta información haya quedado constancia en la póliza."
    );

    addImportantNote(
      "Una declaración inexacta o errónea en los materiales de construcción puede provocar la aplicación de la regla de equidad del Artículo 10 de la Ley 50/1980, de Contrato de Seguro, lo que significa que la compañía de Seguros puede reducir la indemnización proporcionalmente a lo que habría correspondido si se hubiera conocido el riesgo real."
    );
    currentY += 6;

    // PROTECCIONES CONTRA INCENDIO
    addTitle("Protecciones contra incendio", 12);

    // Preparar lista de protecciones contra incendio
    if (recommendation.protectionInfo.extintores) {
      addBulletPoint("Extintores");
    }
    if (recommendation.protectionInfo.bocas_incendio) {
      let bocasText = "Bocas de incendio equipadas (BIE)";
      if (recommendation.protectionInfo.cobertura_total) {
        bocasText += " - Cobertura total";
      }
      if (recommendation.protectionInfo.deposito_bombeo) {
        bocasText += " - Con depósito propio y grupo de bombeo";
      }
      addBulletPoint(bocasText);
    }
    if (recommendation.protectionInfo.columnas_hidrantes) {
      let hidrantesText = "Columnas hidrantes exteriores";
      if (recommendation.protectionInfo.columnas_hidrantes_tipo) {
        if (
          Array.isArray(recommendation.protectionInfo.columnas_hidrantes_tipo)
        ) {
          hidrantesText += ` - Sistema ${recommendation.protectionInfo.columnas_hidrantes_tipo
            .map((tipo) => (tipo === "publico" ? "Público" : "Privado"))
            .join(", ")}`;
        } else {
          hidrantesText += ` - Sistema ${
            recommendation.protectionInfo.columnas_hidrantes_tipo === "publico"
              ? "Público"
              : "Privado"
          }`;
        }
      }
      addBulletPoint(hidrantesText);
    }
    if (recommendation.protectionInfo.deteccion_automatica) {
      let deteccionText = "Detección automática de incendios";
      if (
        Array.isArray(recommendation.protectionInfo.deteccion_zona) &&
        recommendation.protectionInfo.deteccion_zona.length > 0
      ) {
        if (recommendation.protectionInfo.deteccion_zona[0] === "totalidad") {
          deteccionText += " - Cobertura total";
        } else {
          deteccionText += ` - ${recommendation.protectionInfo.deteccion_zona.join(
            ", "
          )}`;
        }
      }
      addBulletPoint(deteccionText);
    }
    if (recommendation.protectionInfo.rociadores) {
      let rociadoresText = "Rociadores automáticos";
      if (
        Array.isArray(recommendation.protectionInfo.rociadores_zona) &&
        recommendation.protectionInfo.rociadores_zona.length > 0
      ) {
        if (recommendation.protectionInfo.rociadores_zona[0] === "totalidad") {
          rociadoresText += " - Cobertura total";
        } else {
          rociadoresText += ` - ${recommendation.protectionInfo.rociadores_zona.join(
            ", "
          )}`;
        }
      }
      addBulletPoint(rociadoresText);
    }
    if (recommendation.protectionInfo.suministro_agua) {
      let suministroText = "Suministro de agua: ";
      if (recommendation.protectionInfo.suministro_agua === "red_publica") {
        suministroText += "Red pública";
      } else if (
        recommendation.protectionInfo.suministro_agua === "sistema_privado"
      ) {
        suministroText +=
          "Sistema privado con grupo de bombeo y depósito propio";
      } else if (recommendation.protectionInfo.suministro_agua === "no_tiene") {
        suministroText += "No tiene";
      } else {
        suministroText += recommendation.protectionInfo.suministro_agua.replace(
          /_/g,
          " "
        );
      }
      addBulletPoint(suministroText);
    }

    if (
      !recommendation.protectionInfo.extintores &&
      !recommendation.protectionInfo.bocas_incendio &&
      !recommendation.protectionInfo.columnas_hidrantes &&
      !recommendation.protectionInfo.deteccion_automatica &&
      !recommendation.protectionInfo.rociadores
    ) {
      addText("No se han indicado protecciones contra incendio");
    }

    addText(
      "Debes ser preciso a la hora de indicar las medidas de protección que cuenta la nave o instalación. Además, debes comprobar que esta información haya quedado constancia en la póliza."
    );

    addImportantNote(
      "Una declaración inexacta o errónea en las medidas de protección puede provocar la aplicación de la regla de equidad del Artículo 10 de la Ley 50/1980, de Contrato de Seguro, lo que significa que la compañía de Seguros puede reducir la indemnización proporcionalmente a lo que habría correspondido si se hubiera conocido el riesgo real."
    );
    currentY += 6;

    // PROTECCIONES CONTRA ROBO
    addTitle("Protecciones contra robo", 12);

    // Preparar lista de protecciones contra robo
    if (recommendation.protectionInfo.protecciones_fisicas) {
      addBulletPoint("Protecciones físicas (rejas, cerraduras...)");
    }
    if (recommendation.protectionInfo.vigilancia_propia) {
      addBulletPoint("El polígono cuenta con vigilancia propia");
    }
    if (recommendation.protectionInfo.alarma_conectada) {
      addBulletPoint("Alarma de robo conectada a central de alarma");
    }
    if (recommendation.protectionInfo.camaras_circuito) {
      addBulletPoint("Circuito Cerrado de Televisión/Cámaras");
    }

    if (
      !recommendation.protectionInfo.protecciones_fisicas &&
      !recommendation.protectionInfo.vigilancia_propia &&
      !recommendation.protectionInfo.alarma_conectada &&
      !recommendation.protectionInfo.camaras_circuito
    ) {
      addText("No se han indicado protecciones contra robo");
    }

    addText(
      "Debes ser preciso a la hora de indicar las medidas de protección que cuenta la nave o instalación. Además, debes comprobar que esta información haya quedado constancia en la póliza."
    );

    addImportantNote(
      "Una declaración inexacta o errónea en las medidas de protección puede provocar la aplicación de la regla de equidad del Artículo 10 de la Ley 50/1980, de Contrato de Seguro, lo que significa que la compañía de Seguros puede reducir la indemnización proporcionalmente a lo que habría correspondido si se hubiera conocido el riesgo real."
    );
    currentY += 6;

    // CAPITALES A ASEGURAR
    addTitle("Capitales a asegurar", 12);

    addText(
      `Edificio: ${formatCurrency(
        recommendation.capitalesInfo.valor_edificio
      )}`,
      10,
      true
    );
    addText(
      `Ajuar industrial: ${formatCurrency(
        recommendation.capitalesInfo.valor_ajuar
      )}`
    );
    addText(
      `Existencias: ${formatCurrency(
        recommendation.capitalesInfo.valor_existencias
      )}`
    );
    addText(
      `Equipos informáticos: ${formatCurrency(
        recommendation.capitalesInfo.valor_equipo_electronico
      )}`
    );

    // Agregar pérdida de beneficios si tiene margen bruto
    if (
      recommendation.capitalesInfo.margen_bruto_anual &&
      recommendation.capitalesInfo.margen_bruto_anual > 0
    ) {
      addText(
        `Margen bruto anual: ${formatCurrency(
          recommendation.capitalesInfo.margen_bruto_anual
        )}`,
        10,
        true
      );
      addText(
        `Periodo de indemnización: ${
          recommendation.capitalesInfo.periodo_indemnizacion ||
          "No especificado"
        } meses`
      );

      addText(
        "La Pérdida de Beneficios es una cobertura que se aplica si la interrupción de la actividad es consecuencia de un siniestro cubierto por la póliza principal (por ejemplo, incendio, explosión, daños por agua, etc.)."
      );

      addText(
        "El periodo de indemnización debe reflejar el tiempo necesario para recuperar la actividad tras un siniestro grave."
      );
    }

    addText(
      "Al dar el valor de tus bienes es aconsejable valorar los bienes como si fueran nuevos, es decir: el coste de reconstrucción o reemplazo del bien dañado, utilizando materiales de calidad y funcionalidad equivalentes, en el estado inmediatamente anterior al siniestro."
    );

    addImportantNote(
      "Si el bien no se repone o reconstruye dentro del plazo estipulado en la póliza (ej. 2 años), algunas compañías lo tasan a valor real, descontando uso y antigüedad."
    );

    addText(
      "Si se trata de mercanías se valora por el precio de compra o el coste de producción, incluyendo impuestos no recuperables, transporte y manipulación."
    );

    addImportantNote(
      "Es necesario que mantengas el valor de los capitales actualizados para evitar infraseguro (Artículo 30 de la Ley 50/1980, de 8 de octubre, de Contrato de Seguro). Es aconsejable que todas las anualidades, a vencimiento del seguro, le indiques a la compañía el valor de los capitales actualizados para que tengan efecto en la renovación siguiente. Además, si has comprado maquinaria o has hecho una ampliación o inversión, lo debes comunicar a la compañía de seguros cuando las hayas hechos (en cualquier momento de la vigencia del seguro) para que lo haga constar en la póliza y te emita un suplemento modificatorio a la póliza."
    );
    currentY += 6;

    // COBERTURAS
    addTitle("Coberturas a contratar", 12);

    // Procesar cada cobertura recomendada
    for (const coverage of recommendation.coverages) {
      if (!coverage.required) continue; // Saltarse las coberturas no requeridas

      // Obtener el nombre de la cobertura y su información adicional
      const coverageName = coverage.name;
      const { description, example, additionalInfo } =
        getCoverageDescription(coverageName);

      // Añadir el título con el límite o condición si está disponible
      // Añadir el título con el límite o condición si está disponible
      let coverageTitle = coverageName;
      if (coverage.limit) {
        coverageTitle += ` con límite de ${coverage.limit}`;
      } else if (coverage.condition) {
        coverageTitle += `. ${coverage.condition}`;
      } else if (coverage.sublimit) {
        coverageTitle += ` con sublímite de ${coverage.sublimit}`;
      }

      addText(coverageTitle, 10, true); // Añadir el título en negrita

      // Añadir la descripción
      if (description) {
        addText(description);
      }

      // Añadir el ejemplo si existe
      if (example) {
        addText(`Ejemplo: ${example}`);
      }

      // Añadir información adicional si existe
      if (additionalInfo) {
        addText(additionalInfo);
      }

      // Añadir notas importantes específicas según el tipo de cobertura
      if (coverageName.toLowerCase().includes("avería de maquinaria")) {
        addImportantNote(
          "Esta cobertura tiene un coste marcadamente más elevado que otras garantías. En consecuencia, sé prudente a la hora de indicar el importe que quieres asegurar para no incrementar innecesariamente el coste de la prima. Además, muchas compañías tienen límites máximos para esta cobertura, y pueden no ofrecerte el límite que necesites. Para estos casos, puedes contratar una póliza específica de avería de maquinaria."
        );
      }

      if (coverageName.toLowerCase().includes("intemperie")) {
        addImportantNote(
          "Por los riesgos de exposición que tienen estos bienes a inclemencias meteorológicas, normalmente no se cubren estos bienes. Asegúrate que la compañía expresamente los cubra."
        );
      }

      if (
        coverageName.toLowerCase().includes("placas fotovoltaicas") ||
        coverageName.toLowerCase().includes("placas solares")
      ) {
        addImportantNote(
          "Si has instalado placas fotovoltaicas debes informarlo a la compañía. La instalación de estas placas en cubierta constituye una agravación del riesgo, especialmente si están ubicadas sobre cubierta combustible. Es probable que muchas compañías no te den cobertura si las tienes instaladas en una cubierta combustible tipo PIR/PUR."
        );
      }

      if (coverageName.toLowerCase().includes("responsabilidad civil")) {
        addImportantNote(
          "Puedes incluir en un seguro de daños coberturas de responsabilidad civil general. No obstante ello, ten en cuenta que las coberturas que tendrás serán muy básicas y con límites francamente inferiores a los que necesitas. Tratándose de cubrir la responsabilidad civil, lo más conveniente es contratar una póliza independiente con el mayor límite que puedas afrontar de prima, ya que nunca puedes saber antes del hecho el importe de daños que ocasionarás a terceros por un siniestro."
        );
      }

      // Añadir espacio después de cada cobertura
      currentY += 4;
    }

    // CLÁUSULAS ESPECIALES
    if (
      recommendation.specialClauses &&
      recommendation.specialClauses.length > 0
    ) {
      addTitle("Cláusulas especiales", 12);

      // Procesar cada cláusula especial
      for (const clause of recommendation.specialClauses) {
        if (!clause.required) continue;

        // Añadir el título con el límite o condición si está disponible
        let clauseTitle = clause.name;
        if (clause.limit) {
          clauseTitle += ` con límite de ${clause.limit}`;
        } else if (clause.condition) {
          clauseTitle += `. ${clause.condition}`;
        }

        addText(clauseTitle, 10, true);

        // Añadir información adicional para cobertura automática
        if (clause.name.includes("Cobertura automática")) {
          addText(
            "La cobertura automática de capitales sirve para evitar que el asegurado quede infrasegurado por pequeños incrementos no declarados en el valor de los bienes asegurados (como nuevas compras, mejoras o ampliaciones)."
          );
        }
      }
    }

    // Información de contacto al final
    currentY += 10;
    doc.setDrawColor(...COLORS.primary);
    doc.setFillColor(...COLORS.primary);
    doc.setLineWidth(0.5);

    // Crear un rectángulo coloreado para el contacto
    const contactBoxY = currentY - 4;
    doc.rect(leftMargin, contactBoxY, pageWidth - 40, 10, "F");

    // Añadir texto de contacto en color blanco
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255); // Texto en blanco
    doc.text(
      "Contáctanos si necesitas que te ayudemos con tu seguro rodrigo@smartadvice.es",
      pageWidth / 2,
      contactBoxY + 6,
      { align: "center" }
    );

    // Guardar el PDF
    const pdfBlob = doc.output("blob");

    // Guardar localmente el PDF si es necesario
    if (downloadFile) {
      const fileName = `Informe_Seguro_Daños_${
        recommendation.companyInfo.name || "Cliente"
      }.pdf`;
      const safeFileName = fileName.replace(/\s+/g, "_");
      doc.save(safeFileName);
    }

    return pdfBlob;
  } catch (error) {
    console.error("Error durante la generación del PDF:", error);
    throw error;
  }
};
