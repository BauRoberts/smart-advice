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

interface ExtendedRecommendation extends DanosInsuranceRecommendation {
  // Información de construcción y protecciones
  fireProtection?: string[];
  theftProtection?: string[];
  capitals?: {
    edificio?: number;
    ajuar?: number;
    existencias?: number;
    equiposInformaticos?: number;
    margenBruto?: number;
    periodoIndemnizacion?: string;
  };

  // Coberturas adicionales
  hasMachineryBreakdown?: boolean;
  machineryBreakdownLimit?: string;
  cashAmount?: {
    inSafe?: number;
    inFurniture?: number;
    inTransit?: number;
  };
  thirdPartyGoods?: number;
  ownGoodsInThirdParty?: number;
  outdoorGoods?: number;
  refrigeratedGoods?: number;
  refrigerationProtection?: string;
  photovoltaicPanels?: number;
  parkedVehicles?: number;
  employeeGoods?: number;
  liabilityCoverages?: Array<{
    name: string;
    limit?: string;
    sublimit?: string;
  }>;
  allRiskCoverage?: boolean;
  leasingAssets?: boolean;
  leasingCompany?: string;
}

const formatNumber = (num?: number) => {
  if (num === undefined || num === null) return "N/A";
  return num.toLocaleString("es-ES") + " €";
};

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
  recommendation: ExtendedRecommendation,
  downloadFile: boolean = false
) => {
  try {
    const doc = new jsPDF();
    let currentY = 20;
    const leftMargin = 14;
    const pageWidth = doc.internal.pageSize.width;

    // Funciones helper
    const addTitle = (text: string, size = 16) => {
      // Añadir espacio extra antes de títulos principales
      if (size === 16) {
        currentY += 8; // Espacio adicional antes de títulos principales
      }

      checkPageBreak(15);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(size);
      doc.setTextColor(...COLORS.primary);
      doc.text(text, leftMargin, currentY);
      if (size === 16) {
        currentY += 3;
        doc.setDrawColor(...COLORS.secondary);
        doc.setLineWidth(0.5);
        doc.line(leftMargin, currentY, leftMargin + 24, currentY);
      }
      currentY += 10;
    };

    const addText = (text: string) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.text);
      const splitText = doc.splitTextToSize(text, pageWidth - 28);
      checkPageBreak(splitText.length * 6);
      doc.text(splitText, leftMargin, currentY);
      currentY += splitText.length * 6;
    };

    const addImportantNote = (text: string) => {
      const splitText = doc.splitTextToSize(text, pageWidth - 32);
      checkPageBreak(splitText.length * 6 + 16);

      // Dibujar el cuadro de fondo
      doc.setFillColor(...COLORS.warningBg);
      doc.setDrawColor(...COLORS.warningText);
      doc.setLineWidth(0.1);
      doc.roundedRect(
        leftMargin,
        currentY,
        pageWidth - 28,
        splitText.length * 6 + 8,
        2,
        2,
        "FD"
      );

      // Agregar el texto de la nota directamente, sin "IMPORTANTE:" ni otros símbolos
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.warningText);
      doc.text(splitText, leftMargin + 10, currentY + 6);

      // Aumentar el espacio después de la nota importante
      currentY += splitText.length * 6 + 20;
    };

    const addBulletList = (items: string[]) => {
      checkPageBreak(items.length * 6 + 5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.text);

      items.forEach((item) => {
        const splitText = doc.splitTextToSize(`• ${item}`, pageWidth - 32);
        checkPageBreak(splitText.length * 6);
        doc.text(splitText, leftMargin, currentY);
        currentY += splitText.length * 6;
      });

      currentY += 4;
    };

    const checkPageBreak = (requiredSpace: number) => {
      if (currentY + requiredSpace > doc.internal.pageSize.height - 20) {
        doc.addPage();
        currentY = 20;
      }
    };

    // Título principal y descripción
    doc.setFontSize(24);
    doc.setTextColor(...COLORS.primary);
    doc.text("INFORME DE SEGURO DE DAÑOS", pageWidth / 2, currentY, {
      align: "center",
    });
    currentY += 25;

    // Línea separadora
    doc.setDrawColor(...COLORS.secondary);
    doc.setLineWidth(0.5);
    doc.line(leftMargin, currentY - 15, pageWidth - leftMargin, currentY - 15);

    // Sección: ¿Qué es un seguro de daños?
    addTitle("¿Qué es un seguro de daños?", 14);
    addText(
      "Un seguro de daños es un contrato mediante el cual una compañía aseguradora se compromete a indemnizar al asegurado por las pérdidas económicas que sufra como consecuencia de daños materiales ocasionados a sus bienes. Esta modalidad de seguro constituye una de las herramientas clave en la gestión de riesgos empresariales."
    );
    currentY += 4;
    addText(
      "Su objetivo es preservar la estabilidad patrimonial de la empresa, garantizando la recuperación del valor de los activos afectados y, en muchos casos, la continuidad operativa del negocio tras un siniestro."
    );
    currentY += 8;

    // Sección: ¿Por qué es importante para una empresa?
    addTitle("¿Por qué es importante para una empresa?", 14);
    addText(
      "Porque protege la continuidad del negocio y tu inversión. Un siniestro puede suponer no solo pérdidas materiales, sino también la paralización de la actividad. Con un seguro de daños:"
    );

    addBulletList([
      "Tienes respaldo económico ante imprevistos graves",
      "Garantizas tu capacidad para seguir operando",
      "Transmites seguridad a socios, clientes y proveedores",
    ]);
    currentY += 8;

    // Sección: ¿Qué bienes se pueden asegurar?
    addTitle("¿Qué bienes se pueden asegurar?", 14);
    addBulletList([
      "El edificio o local (continente): muros, techos, suelos, instalaciones fijas",
      "El contenido: mobiliario, maquinaria, equipos electrónicos, mercancías",
      "Bienes de terceros que estén bajo tu custodia",
      "Dinero en metálico en caja o durante transporte (según la póliza)",
      "Bienes en tránsito o en otros locales",
      "Archivos, moldes, documentos y datos digitales",
    ]);
    currentY += 8;

    // Información General
    addTitle("INFORMACIÓN GENERAL");

    const infoTable = {
      head: [] as string[][],
      body: [
        ["Tomador:", recommendation.companyInfo.name || "No especificado"],
        ["CIF:", recommendation.companyInfo.cif || "No especificado"],
        ["Dirección:", recommendation.companyInfo.address || "No especificado"],
        ["CNAE:", recommendation.companyInfo.cnae || "No especificado"],
        [
          "Actividad:",
          recommendation.companyInfo.activityDescription ||
            recommendation.companyInfo.activity ||
            "No especificado",
        ],
      ] as string[][],
    };

    // Agregar asegurado adicional si no es propietario
    if (recommendation.companyInfo.is_owner === false) {
      infoTable.body.push([
        "ASEGURADO ADICIONAL:",
        `Se hace constar que el Sr. O la empresa ${
          recommendation.companyInfo.owner_name || "X"
        }, con NIF ${
          recommendation.companyInfo.owner_cif || "XXXX"
        }, tendrá el carácter de beneficiario de la Indemnización en su calidad de propietario de las instalaciones.`,
      ]);
    }

    autoTable(doc, {
      startY: currentY,
      head: infoTable.head,
      body: infoTable.body,
      theme: "plain",
      styles: {
        fontSize: 11,
        cellPadding: { top: 4, right: 5, bottom: 4, left: 5 },
        textColor: COLORS.text as Color,
      },
      columnStyles: {
        0: {
          font: "helvetica",
          fontStyle: "bold" as FontStyle,
          textColor: COLORS.primary as Color,
          cellWidth: 40,
        },
        1: { cellWidth: 140 },
      },
      alternateRowStyles: {
        fillColor: COLORS.lightGray as Color,
      },
    });

    currentY = (doc.lastAutoTable?.finalY || currentY) + 15; // Aumentado de 10 a 15 para más espacio

    // Agregar nota importante sobre el propietario si corresponde
    if (recommendation.companyInfo.is_owner === false) {
      addImportantNote(
        "Si no eres el propietario de las instalaciones es probable que éste te haya solicitado en el contrato de arrendamiento que lo incluyas como asegurado adicional (esto es, como beneficiario). En caso de siniestro que afecte al inmueble, el propietario del inmueble tiene derecho a cobrar la indemnización del seguro que tu has contratado. Para demostrar que has cumplido con esta obligación contractual, puedes solicitarle a la compañía de seguros que te emita un certificado de seguro haciendo constar como beneficiario al propietario del inmueble."
      );
    }

    // CARACTERÍSTICAS CONSTRUCTIVAS
    addTitle("CATACTERISTICAS CONSTRUCTIVAS DEL INMUEBLE");

    const constructionTable = {
      head: [] as string[][],
      body: [
        [
          "Estructura:",
          recommendation.constructionInfo.estructura || "No especificado",
        ],
        [
          "Cubierta:",
          recommendation.constructionInfo.cubierta || "No especificado",
        ],
        [
          "Cerramientos:",
          recommendation.constructionInfo.cerramientos || "No especificado",
        ],
        ["M2:", `${recommendation.companyInfo.m2 || "No especificado"} m²`],
      ] as string[][],
    };

    autoTable(doc, {
      startY: currentY,
      head: constructionTable.head,
      body: constructionTable.body,
      theme: "plain",
      styles: {
        fontSize: 11,
        cellPadding: { top: 4, right: 5, bottom: 4, left: 5 },
        textColor: COLORS.text as Color,
      },
      columnStyles: {
        0: {
          font: "helvetica",
          fontStyle: "bold" as FontStyle,
          textColor: COLORS.primary as Color,
          cellWidth: 40,
        },
        1: { cellWidth: 140 },
      },
      alternateRowStyles: {
        fillColor: COLORS.lightGray as Color,
      },
    });

    currentY = (doc.lastAutoTable?.finalY || currentY) + 10; // Aumentado de 5 a 10 para más espacio

    addText(
      "Debes ser preciso a la hora de indicar los materiales de construcción de la nave o instalación. Además, debes comprobar que esta información haya quedado constancia en la póliza."
    );

    addImportantNote(
      "Una declaración inexacta o errónea en los materiales de construcción puede provocar la aplicación de la regla de equidad del Artículo 10 de la Ley 50/1980, de Contrato de Seguro, lo que significa que la compañía de Seguros puede reducir la indemnización proporcionalmente a lo que habría correspondido si se hubiera conocido el riesgo real."
    );

    // PROTECCIONES CONTRA INCENDIO
    addTitle("PROTECCIONES CONTRA INCENDIO");

    const fireProtectionText = recommendation.fireProtection
      ? recommendation.fireProtection.join(", ")
      : "No especificado";

    addText(fireProtectionText);

    addText(
      "Debes ser preciso a la hora de indicar las medidas de protección que cuenta la nave o instalación. Además, debes comprobar que esta información haya quedado constancia en la póliza."
    );

    addImportantNote(
      "Una declaración inexacta o errónea en las medidas de protección puede provocar la aplicación de la regla de equidad del Artículo 10 de la Ley 50/1980, de Contrato de Seguro, lo que significa que la compañía de Seguros puede reducir la indemnización proporcionalmente a lo que habría correspondido si se hubiera conocido el riesgo real."
    );

    // PROTECCIONES CONTRA ROBO
    addTitle("PROTECCIONES CONTRA ROBO");

    const theftProtectionText = recommendation.theftProtection
      ? recommendation.theftProtection.join(", ")
      : "No especificado";

    addText(theftProtectionText);

    addText(
      "Debes ser preciso a la hora de indicar las medidas de protección que cuenta la nave o instalación. Además, debes comprobar que esta información haya quedado constancia en la póliza."
    );

    addImportantNote(
      "Una declaración inexacta o errónea en las medidas de protección puede provocar la aplicación de la regla de equidad del Artículo 10 de la Ley 50/1980, de Contrato de Seguro, lo que significa que la compañía de Seguros puede reducir la indemnización proporcionalmente a lo que habría correspondido si se hubiera conocido el riesgo real."
    );

    // CAPITALES A ASEGURAR
    addTitle("CAPITALES A ASEGURAR");

    const capitalTable = {
      head: [] as string[][],
      body: [
        ["Edificio:", formatNumber(recommendation.capitals?.edificio)],
        ["Ajuar industrial:", formatNumber(recommendation.capitals?.ajuar)],
        ["Existencias:", formatNumber(recommendation.capitals?.existencias)],
        [
          "Equipos informáticos:",
          formatNumber(recommendation.capitals?.equiposInformaticos),
        ],
      ] as string[][],
    };

    // Agregar pérdida de beneficios si tiene margen bruto
    if (recommendation.capitals?.margenBruto) {
      capitalTable.body.push(
        [
          "Margen bruto anual:",
          formatNumber(recommendation.capitals.margenBruto),
        ],
        [
          "Periodo de indemnización:",
          `${
            recommendation.capitals.periodoIndemnizacion || "No especificado"
          } meses`,
        ]
      );
    }

    autoTable(doc, {
      startY: currentY,
      head: capitalTable.head,
      body: capitalTable.body,
      theme: "plain",
      styles: {
        fontSize: 11,
        cellPadding: { top: 4, right: 5, bottom: 4, left: 5 },
        textColor: COLORS.text as Color,
      },
      columnStyles: {
        0: {
          font: "helvetica",
          fontStyle: "bold" as FontStyle,
          textColor: COLORS.primary as Color,
          cellWidth: 40,
        },
        1: { cellWidth: 140 },
      },
      alternateRowStyles: {
        fillColor: COLORS.lightGray as Color,
      },
    });

    currentY = (doc.lastAutoTable?.finalY || currentY) + 15; // Aumentado de 5 a 15 para más espacio

    addText(
      "Al dar el valor de tus bienes es aconsejable valorar los bienes como si fueran nuevos, es decir: el coste de reconstrucción o reemplazo del bien dañado, utilizando materiales de calidad y funcionalidad equivalentes, en el estado inmediatamente anterior al siniestro."
    );

    addImportantNote(
      "Si el bien no se repone o reconstruye dentro del plazo estipulado en la póliza (ej. 2 años), algunas compañías lo tasan a valor real, descontando uso y antigüedad."
    );

    addText(
      "Si se trata de mercanías se valora por el precio de compra o el coste de producción, incluyendo impuestos no recuperables, transporte y manipulación."
    );

    // Si tiene margen bruto, agregar texto sobre pérdida de beneficios
    if (recommendation.capitals?.margenBruto) {
      addText(
        "La Pérdida de Beneficios es una cobertura que se aplica si la interrupción de la actividad es consecuencia de un siniestro cubierto por la póliza principal (por ejemplo, incendio, explosión, daños por agua, etc.)."
      );

      addText(
        "El periodo de indemnización debe reflejar el tiempo necesario para recuperar la actividad tras un siniestro grave."
      );
    }

    addImportantNote(
      "Es necesario que mantengas el valor de los capitales actualizados para evitar infraseguro (Artículo 30 de la Ley 50/1980, de 8 de octubre, de Contrato de Seguro). Es aconsejable que todas las anualidades, a vencimiento del seguro, le indiques a la compañía el valor de los capitales actualizados para que tengan efecto en la renovación siguiente. Además, si has comprado maquinaria o has hecho una ampliación o inversión, lo debes comunicar a la compañía de seguros cuando las hayas hechos (en cualquier momento de la vigencia del seguro) para que lo haga constar en la póliza y te emita un suplemento modificatorio a la póliza."
    );

    // COBERTURAS
    addTitle("COBERTURAS");

    // Coberturas básicas (siempre incluidas)
    const coberturasBasicas = [
      [
        "• Coberturas básicas (Incendio, rayo y explosión)",
        "100% capitales a asegurar",
      ],
      [
        "• Riesgos extensivos (lluvia, pedrisco, nieve, humo, etc)",
        "100% capitales a asegurar",
      ],
      ["• Daños por agua", "100% capitales a asegurar"],
    ];

    // Calcular daños eléctricos según el valor del edificio
    let danosElectricosLimit = "30.000€";
    if (recommendation.capitals?.edificio) {
      if (
        recommendation.capitals.edificio >= 500000 &&
        recommendation.capitals.edificio < 1000000
      ) {
        danosElectricosLimit = "60.000€";
      } else if (recommendation.capitals.edificio >= 1000000) {
        danosElectricosLimit = "100.000€";
      }
    }

    coberturasBasicas.push([
      "• Daños eléctricos a primer riesgo",
      danosElectricosLimit,
    ]);

    // Avería de maquinaria si está contratada
    if (recommendation.hasMachineryBreakdown) {
      coberturasBasicas.push([
        "• Avería de maquinaria",
        recommendation.machineryBreakdownLimit || "Límite según póliza",
      ]);

      // Agregar nota sobre avería de maquinaria
      addImportantNote(
        "La garantía de avería de maquinaria tiene un coste marcadamente más elevado que otras garantías. En consecuencia, sé prudente a la hora de indicar el importe que quieres asegurar para no incrementar innecesariamente el coste de la prima. Además, muchas compañías tienen límites máximos para esta cobertura, y pueden no ofrecerte el límite que necesites. Para estos casos, puedes contratar una póliza específica de avería de maquinaria."
      );
    }

    // Calcular porcentaje de robo según el valor total
    const valorTotal =
      (recommendation.capitals?.edificio || 0) +
      (recommendation.capitals?.ajuar || 0) +
      (recommendation.capitals?.existencias || 0);

    const roboPercentage = valorTotal > 1000000 ? "50%" : "25%";
    coberturasBasicas.push([
      "• Robo y expoliación",
      `${roboPercentage} de los capitales asegurados`,
    ]);

    // Coberturas adicionales según las respuestas
    const coveragesExtra = [] as string[][];

    // Dinero en efectivo
    if (recommendation.cashAmount) {
      coveragesExtra.push([
        "• Robo de metálico en caja fuerte",
        formatNumber(recommendation.cashAmount.inSafe),
      ]);
      coveragesExtra.push([
        "• Robo de metálico en mueble cerrado",
        formatNumber(recommendation.cashAmount.inFurniture),
      ]);
      coveragesExtra.push([
        "• Robo al transportador de fondos",
        formatNumber(recommendation.cashAmount.inTransit),
      ]);
    }

    // Bienes de terceros
    if (recommendation.thirdPartyGoods) {
      coveragesExtra.push([
        "• Bienes de terceros depositados en las instalaciones",
        formatNumber(recommendation.thirdPartyGoods),
      ]);
    }

    // Bienes propios en terceros
    if (recommendation.ownGoodsInThirdParty) {
      coveragesExtra.push([
        "• Bienes propios depositados en casa de terceros",
        formatNumber(recommendation.ownGoodsInThirdParty),
      ]);
    }

    // Bienes a la intemperie
    if (recommendation.outdoorGoods) {
      coveragesExtra.push([
        "• Bienes depositados a la intemperie o aire libre",
        formatNumber(recommendation.outdoorGoods),
      ]);

      addImportantNote(
        "Por los riesgos de exposición que tienen estos bienes a inclemencias meteorológicas, normalmente no se cubren estos bienes. Asegúrate que la compañía expresamente los cubra."
      );
    }

    // Bienes refrigerados
    if (recommendation.refrigeratedGoods) {
      coveragesExtra.push([
        "• Bienes refrigerados",
        formatNumber(recommendation.refrigeratedGoods),
      ]);

      if (recommendation.refrigerationProtection) {
        addText(
          `Medidas de protección para cámaras frigoríficas: ${recommendation.refrigerationProtection}`
        );
      }

      addImportantNote(
        "Muchas compañías te preguntarán por las medidas de protección a los bienes que tienes instaladas en las cámaras de frío, asegúrate de ser preciso en dar la información para evitar el infraseguro."
      );
    }

    // Placas fotovoltaicas
    if (recommendation.photovoltaicPanels) {
      coveragesExtra.push([
        "• Placas fotovoltaicas",
        formatNumber(recommendation.photovoltaicPanels),
      ]);

      addImportantNote(
        "Si has instalado placas fotovoltaicas debes informarlo a la compañía. La instalación de estas placas en cubierta constituye una agravación del riesgo, especialmente si están ubicadas sobre cubierta combustible. Es probable que muchas compañías no te den cobertura si las tienes instaladas en una cubierta combustible tipo PIR/PUR."
      );
    }

    // Vehículos aparcados
    if (recommendation.parkedVehicles) {
      coveragesExtra.push([
        "• Vehículos aparcados en instalaciones",
        formatNumber(recommendation.parkedVehicles),
      ]);
    }

    // Bienes de empleados
    if (recommendation.employeeGoods) {
      coveragesExtra.push([
        "• Bienes de empleados",
        formatNumber(recommendation.employeeGoods),
      ]);
    }

    // Cristales (siempre incluido)
    coveragesExtra.push(["• Rotura de cristales", "6.000€"]);

    // Responsabilidad civil
    if (
      recommendation.liabilityCoverages &&
      recommendation.liabilityCoverages.length > 0
    ) {
      recommendation.liabilityCoverages.forEach(
        (coverage: { name: string; limit?: string; sublimit?: string }) => {
          coveragesExtra.push([
            `• ${coverage.name}`,
            coverage.limit || "600.000€",
          ]);
          if (
            coverage.name === "Responsabilidad civil patronal" &&
            coverage.sublimit
          ) {
            coveragesExtra.push([
              "• Sublímite víctima patronal",
              coverage.sublimit,
            ]);
          }
        }
      );

      addImportantNote(
        "Puedes incluir en un seguro de daños coberturas de responsabilidad civil general. No obstante ello, ten en cuenta que las coberturas que tendrás serán muy básicas y con límites francamente inferiores a los que necesitas. Tratándose de cubrir la responsabilidad civil, lo más conveniente es contratar una póliza independiente con el mayor límite que puedas afrontar de prima, ya que nunca puedes saber antes del hecho el importe de daños que ocasionarás a terceros por un siniestro."
      );
    }

    // Cláusulas especiales
    coveragesExtra.push([
      "• Cobertura automática para Daños materiales",
      "20%",
    ]);

    if (recommendation.capitals?.margenBruto) {
      coveragesExtra.push([
        "• Cobertura automática para Pérdida de beneficios",
        "30%",
      ]);

      addImportantNote(
        "La cobertura automática de capitales sirve para evitar que el asegurado quede infrasegurado por pequeños incrementos no declarados en el valor de los bienes asegurados (como nuevas compras, mejoras o ampliaciones). Ten en cuenta lo que se dijo respecto de la actualización de capitales y las modificaciones sustanciales de capital."
      );
    }

    // Valor de reposición a nuevo (siempre incluido)
    coveragesExtra.push(["• Cláusula de Valor de reposición a nuevo", ""]);

    // Todo riesgo si está contratado
    if (recommendation.allRiskCoverage) {
      coveragesExtra.push(["• Cláusula todo riesgo accidental", ""]);
    }

    // Cláusula de leasing si corresponde
    if (recommendation.leasingAssets && recommendation.leasingCompany) {
      coveragesExtra.push([
        "• Cláusula de Leasing",
        `Para ${recommendation.leasingCompany}`,
      ]);
    }

    // Crear tabla de coberturas básicas
    autoTable(doc, {
      startY: currentY,
      body: coberturasBasicas,
      theme: "plain",
      styles: {
        fontSize: 11,
        cellPadding: { top: 4, right: 5, bottom: 4, left: 5 },
        textColor: COLORS.text as Color,
      },
      columnStyles: {
        0: {
          font: "helvetica",
          fontStyle: "bold" as FontStyle,
          textColor: COLORS.primary as Color,
          cellWidth: 120,
        },
        1: {
          cellWidth: 60,
          halign: "right",
        },
      },
      alternateRowStyles: {
        fillColor: COLORS.lightGray as Color,
      },
    });

    currentY = (doc.lastAutoTable?.finalY || currentY) + 10;

    // Agregar coberturas adicionales
    if (coveragesExtra.length > 0) {
      addTitle("CLÁUSULAS ESPECIALES", 14);

      autoTable(doc, {
        startY: currentY,
        body: coveragesExtra,
        theme: "plain",
        styles: {
          fontSize: 11,
          cellPadding: { top: 4, right: 5, bottom: 4, left: 5 },
          textColor: COLORS.text as Color,
        },
        columnStyles: {
          0: {
            font: "helvetica",
            fontStyle: "bold" as FontStyle,
            textColor: COLORS.primary as Color,
            cellWidth: 120,
          },
          1: {
            cellWidth: 60,
            halign: "right",
          },
        },
        alternateRowStyles: {
          fillColor: COLORS.lightGray as Color,
        },
      });
    }

    // Guardar el PDF
    const pdfBlob = doc.output("blob");

    // Guardar localmente el PDF
    if (downloadFile) {
      const fileName = `Informe_Seguro_${
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
