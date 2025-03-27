import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { DanosInsuranceRecommendation } from "@/types";
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
};

export const generateInsuranceReport = async (
  recommendation: DanosInsuranceRecommendation
) => {
  try {
    const doc = new jsPDF();
    let currentY = 20;
    const leftMargin = 14;
    const pageWidth = doc.internal.pageSize.width;

    // Funciones helper
    const addTitle = (text: string, size = 16) => {
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
      doc.text(splitText, leftMargin, currentY);
      currentY += splitText.length * 6;
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

    // Descripción
    addText(
      "Un seguro de daños es un contrato mediante el cual una compañía aseguradora se compromete a indemnizar al asegurado por las pérdidas económicas que sufra como consecuencia de daños materiales ocasionados a sus bienes."
    );
    currentY += 10;

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

    currentY = (doc.lastAutoTable?.finalY || currentY) + 15;

    // CARACTERÍSTICAS CONSTRUCTIVAS
    addTitle("CARACTERÍSTICAS CONSTRUCTIVAS DEL INMUEBLE");

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

    currentY = (doc.lastAutoTable?.finalY || currentY) + 15;

    // COBERTURAS
    addTitle("COBERTURAS");

    const coberturasBody = recommendation.coverages
      .filter((cov) => cov.required)
      .map((coverage) => {
        const row = [`• ${coverage.name}`];

        if (coverage.limit || coverage.sublimit || coverage.condition) {
          let details = "";
          if (coverage.limit) details += `Límite: ${coverage.limit}`;
          if (coverage.sublimit) details += `  Sublímite: ${coverage.sublimit}`;
          if (coverage.condition) details += `\n${coverage.condition}`;
          row.push(details);
        }

        return row;
      });

    autoTable(doc, {
      startY: currentY,
      body: coberturasBody,
      theme: "plain",
      styles: {
        fontSize: 11,
        cellPadding: 4,
        textColor: COLORS.text as Color,
      },
      columnStyles: {
        0: {
          font: "helvetica",
          fontStyle: "bold" as FontStyle,
          textColor: COLORS.primary as Color,
        },
      },
    });

    currentY = (doc.lastAutoTable?.finalY || currentY) + 15;

    // Guardar el PDF
    const fileName = `Informe_Seguro_${
      recommendation.companyInfo.name || "Cliente"
    }.pdf`;
    const safeFileName = fileName.replace(/\s+/g, "_");
    doc.save(safeFileName);

    return true;
  } catch (error) {
    console.error("Error durante la generación del PDF:", error);
    throw error;
  }
};
