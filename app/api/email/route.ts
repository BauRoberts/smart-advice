// app/api/email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { generateDanosInternalEmailContent } from "@/lib/services/emailService";
import { DanosInsuranceRecommendation } from "@/types";

// Inicializar Resend con la API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Función auxiliar para obtener el límite de daños eléctricos
function getDanosElectricosLimit(valorEdificio?: number): string {
  if (!valorEdificio) return "30.000€";
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

// Función para generar la lista de coberturas en HTML
function generateCoveragesListHTML(coverages: any[]): string {
  let htmlList = "";

  // Verificar si hay coberturas específicas para añadirlas
  const coverageMappings = [
    { name: "Avería de maquinaria", label: "Avería de maquinaria" },
    {
      name: "Robo de metálico en caja fuerte",
      label: "Robo de metálico en caja fuerte",
    },
    {
      name: "Robo de metálico en mueble cerrado",
      label: "Robo de metálico en mueble cerrado",
    },
    {
      name: "Robo al transportador de fondos",
      label: "Robo al transportador de fondos",
    },
    {
      name: "Bienes de terceros depositados en las instalaciones del asegurado",
      label:
        "Bienes de terceros depositados en las instalaciones del asegurado",
    },
    {
      name: "Bienes propios depositados en casa de terceros",
      label: "Bienes propios depositados en casa de terceros",
    },
    {
      name: "Bienes depositados a la intemperie o aire libre",
      label: "Bienes depositados a la intemperie o aire libre",
    },
    { name: "Bienes refrigerados", label: "Bienes refrigerados" },
    { name: "Placas fotovoltaicas", label: "Placas fotovoltaicas" },
    {
      name: "Vehículos aparcados en instalaciones",
      label: "Vehículos aparcados en instalaciones",
    },
    { name: "Bienes de empleados", label: "Bienes de empleados" },
    {
      name: "Responsabilidad civil general",
      label: "Responsabilidad civil general",
      value: "600.000€",
    },
    {
      name: "Responsabilidad civil patronal",
      label: "Responsabilidad civil patronal",
      value: "600.000€",
    },
    {
      name: "Responsabilidad civil por productos",
      label: "Responsabilidad civil por productos",
      value: "600.000€",
    },
    {
      name: "Responsabilidad civil inmobiliaria",
      label: "Responsabilidad civil inmobiliaria",
      value: "600.000€",
    },
    {
      name: "Responsabilidad civil locativa",
      label: "Responsabilidad civil locativa",
      value: "600.000€",
    },
  ];

  // Generar elementos HTML para cada cobertura
  coverageMappings.forEach((mapping) => {
    const coverage = coverages.find(
      (c) => c.name === mapping.name && c.required
    );
    if (coverage) {
      let coverageHtml = `<li class="checklist-item">
                            <div class="checklist-icon">✓</div>
                            <div><strong>${mapping.label}:</strong> `;

      if (mapping.value) {
        coverageHtml += mapping.value;
      } else if (coverage.limit) {
        coverageHtml += coverage.limit;
      } else {
        coverageHtml += "Incluido";
      }

      if (coverage.condition) {
        coverageHtml += ` (${coverage.condition})`;
      }

      coverageHtml += `</div></li>`;
      htmlList += coverageHtml;
    }
  });

  // Añadir sublímite para patronal si existe
  if (
    coverages.find(
      (c) => c.name === "Responsabilidad civil patronal" && c.required
    )
  ) {
    htmlList += `<li class="checklist-item">
                  <div class="checklist-icon">✓</div>
                  <div><strong>Sublímite víctima patronal:</strong> 450.000€</div>
                </li>`;
  }

  return htmlList;
}

// Función para verificar si hay cláusula de todo riesgo accidental
function hasTodoRiesgoAccidental(specialClauses: any[]): boolean {
  return specialClauses.some(
    (c) => c.name === "Cláusula todo riesgo accidental" && c.required
  );
}

// Función para verificar si hay cláusula de leasing
function hasLeasingClause(specialClauses: any[], companyInfo: any): boolean {
  return specialClauses.some(
    (c) => c.name && c.name.includes("Cláusula de Leasing") && c.required
  );
}

// Función auxiliar para formatear moneda
function formatCurrency(value?: number): string {
  if (value === undefined || value === null) return "N/A";
  return (
    new Intl.NumberFormat("es-ES", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value) + "€"
  );
}

// Templates de email
const emailTemplates: Record<string, (data: any) => string> = {
  // Template para cliente
  "danos-cliente": (data) => {
    const { clientName, recommendation } = data;

    return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #062A5A; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          .btn { display: inline-block; background-color: #FB2E25; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Tu solicitud de seguro de Daños Materiales</h1>
          </div>
          <div class="content">
            <p>Hola ${clientName || "Estimado cliente"},</p>
            <p>Hemos recibido correctamente tu solicitud de cotización para el seguro de Daños Materiales para <strong>${
              recommendation.companyInfo.name || "tu empresa"
            }</strong>.</p>
            <p>Nos pondremos en contacto contigo a la mayor brevedad con una propuesta personalizada para tu empresa.</p>
            <p>Se ha adjuntado a este email un informe con el detalle de coberturas recomendadas para tu seguro.</p>
            <p>Si tienes alguna duda o quieres añadir información adicional a tu solicitud, puedes responder directamente a este correo.</p>
            <p>Saludos cordiales,</p>
            <p><strong>El equipo de Smart Advice</strong></p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Smart Advice - Todos los derechos reservados</p>
            <p>Este mensaje ha sido enviado a ${
              data.clientEmail || "[email protegido]"
            }</p>
          </div>
        </div>
      </body>
    </html>`;
  },

  // Template para uso interno - Este utiliza la función que generará el contenido exacto según la estructura solicitada
  "danos-interno": (data) => {
    const { recommendation } = data;
    const emailContent = generateDanosInternalEmailContent(recommendation);

    // Convertimos el texto plano a HTML para mantener los saltos de línea
    const htmlContent = emailContent
      .replace(/\n/g, "<br>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

    return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 800px; margin: 0 auto; padding: 20px; }
          pre { font-family: monospace; white-space: pre-wrap; }
        </style>
      </head>
      <body>
        <div class="container">
          ${htmlContent}
        </div>
      </body>
    </html>`;
  },
};

export async function POST(request: NextRequest) {
  try {
    const { to, cc, bcc, subject, template, data, attachment } =
      await request.json();

    // Validar datos requeridos
    if (!to || !Array.isArray(to) || to.length === 0) {
      return NextResponse.json(
        { success: false, error: "Destinatario requerido" },
        { status: 400 }
      );
    }

    if (!subject) {
      return NextResponse.json(
        { success: false, error: "Asunto requerido" },
        { status: 400 }
      );
    }

    if (!template || !emailTemplates[template]) {
      return NextResponse.json(
        { success: false, error: "Plantilla no válida" },
        { status: 400 }
      );
    }

    // Generar el HTML del email usando la plantilla correspondiente
    const html = emailTemplates[template](data);

    // En desarrollo, podemos simular el envío
    if (
      process.env.NODE_ENV === "development" &&
      process.env.SKIP_EMAIL_SENDING === "true"
    ) {
      console.log("Simulando envío de email:", {
        from: process.env.ADMIN_EMAIL || "noreply@smart-advice.es",
        to: to,
        cc: cc,
        bcc: bcc,
        subject: subject,
        html: html,
        attachment: attachment ? "PDF adjunto" : undefined,
      });
      return NextResponse.json({ success: true, message: "Email simulado" });
    }

    // Configurar los destinatarios en copia y copia oculta
    const ccRecipients = cc ? (Array.isArray(cc) ? cc : [cc]) : undefined;
    const bccRecipients = bcc ? (Array.isArray(bcc) ? bcc : [bcc]) : undefined;

    // Preparar el objeto para enviar el email
    const emailData: any = {
      from: process.env.ADMIN_EMAIL || "noreply@smart-advice.es",
      to: to,
      cc: ccRecipients,
      bcc: bccRecipients,
      subject: subject,
      html: html,
      replyTo: process.env.ADMIN_EMAIL || "info@smart-advice.es",
    };

    // Añadir el adjunto si existe
    if (attachment) {
      emailData.attachments = [attachment];
    }

    // Enviar el email usando Resend
    const result = await resend.emails.send(emailData);

    if (result.error) {
      throw new Error(result.error.message);
    }

    return NextResponse.json({
      success: true,
      messageId: result.data?.id,
    });
  } catch (error: any) {
    console.error("Error al enviar email:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Error desconocido al enviar el email",
      },
      { status: 500 }
    );
  }
}
