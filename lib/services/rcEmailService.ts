// lib/services/rcEmailService.ts
import { generateRCInsuranceReport } from "./rcReportService";

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
async function sendEmail(config: EmailConfig) {
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

// Función para convertir un Blob a Base64
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
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

// Función para generar el contenido del email para el template de RC exacto
export function generateRCExactEmailContent(recommendation: any): string {
  // Generar un contenido simple pero completo
  return `
    <p>Estimados colaboradores,</p>
    
    <p>Sirva el presente correo para solicitar cotización de seguro de Responsabilidad Civil General de acuerdo con la siguiente información:</p>
    
    <ul>
      <li>TOMADOR: ${recommendation.companyInfo.name || "XXXX"}</li>
      <li>CIF: ${recommendation.companyInfo.cif || "XXXX"}</li>
      <li>DIRECCIÓN: ${recommendation.companyInfo.address || "XXXX"}</li>
      <li>CNAE: ${recommendation.companyInfo.cnae_code || "XXXXXX"}</li>
      <li>ACTIVIDAD: ${recommendation.companyInfo.activity || "XXXXXX"}</li>
      <li>FACTURACIÓN: ${formatCurrency(
        recommendation.companyInfo.billing
      )}</li>
      ${
        recommendation.companyInfo.owner_name
          ? `<li>ASEGURADO ADICIONAL: INCLUIR COMO ASEGURADO ADICIONAL AL PROPIETARIO DE LA NAVE, SR./EMPRESA ${recommendation.companyInfo.owner_name}</li>`
          : ""
      }
    </ul>
    
    <p>Garantías y límites</p>
    
    <p style="color: #FF0000; font-weight: bold;">ACA METEMOS TODO TAL CUAL EL CLIENTE NOS LO DIO Y QUE QUEDO EN LA WEB</p>
    
    <p>Ámbito geográfico general: ${
      recommendation.ambitoTerritorial || "IDEM"
    }</p>
    
    <p>Ámbito geográfico productos: ${
      recommendation.ambitoProductos || "IDEM"
    }</p>
    
    <p>Siniestralidad últimos 3 años: ${
      recommendation.siniestralidad?.siniestros_ultimos_3_anos ? "SÍ" : "NO"
    }</p>
    ${
      recommendation.siniestralidad?.siniestros_detalles
        ? `<p>Detalles de siniestralidad: ${recommendation.siniestralidad.siniestros_detalles}</p>`
        : ""
    }
    
    <p>Quedamos a la espera de respuesta.</p>
    
    <p>Saludos cordiales,</p>
    
    <p><strong>SMART ADVICE</strong></p>
  `;
}

// Función para enviar email de RC con PDF adjunto
export async function sendRCRecommendationEmail(
  recommendation: any,
  contactEmail: string,
  contactName: string
) {
  try {
    console.log("Enviando email de RC a:", contactEmail);

    // Generar el PDF para adjuntar
    let attachmentData = null;

    try {
      const pdfBlob = await generateRCInsuranceReport(recommendation, false);
      if (pdfBlob) {
        const base64 = await blobToBase64(pdfBlob);
        attachmentData = {
          filename: `Informe_Seguro_RC_${
            recommendation.companyInfo.name || "Cliente"
          }.pdf`,
          content: base64.split(",")[1], // Eliminar el prefijo "data:application/pdf;base64,"
          encoding: "base64",
          type: "application/pdf",
        };
      }
    } catch (pdfError) {
      console.error("Error al generar el PDF para el email:", pdfError);
      // Continuamos sin adjunto si hay error
    }

    // Preparamos los datos para personalizar el email
    const emailData = {
      clientName: contactName,
      clientEmail: contactEmail,
      recommendation: recommendation,
      companyName: recommendation.companyInfo.name || "tu empresa",
      activityDescription:
        recommendation.companyInfo.activity || "tu actividad",
      billing: formatCurrency(recommendation.companyInfo.billing || 0),
      year: new Date().getFullYear(),
    };

    // Crear el asunto del email
    const subject = `Solicitud de Cotización de Seguro de Responsabilidad Civil - ${
      recommendation.companyInfo.name || contactName
    }`;

    // Enviar el email
    const emailResponse = await sendEmail({
      to: [contactEmail],
      subject: subject,
      template: "rc-client-enhanced", // Este template debe existir en la API de email
      data: emailData,
      attachment: attachmentData,
    });

    return {
      success: true,
      emailResponse,
    };
  } catch (error) {
    console.error("Error al enviar email de RC:", error);
    throw error;
  }
}

// HTML del template mejorado para el email al cliente
export function generateRCClientEmailTemplate(data: any): string {
  return `
  <html>
    <head>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          margin: 0;
          padding: 0;
          background-color: #f5f7fa;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 0;
          background-color: #ffffff;
        }
        .header { 
          background-color: #062A5A; 
          color: white; 
          padding: 30px 20px; 
          text-align: center; 
        }
        .content { 
          padding: 30px 20px; 
          background-color: #ffffff;
        }
        .footer { 
          text-align: center; 
          margin-top: 20px; 
          font-size: 12px; 
          color: #666; 
          padding: 20px;
          background-color: #f9f9f9;
          border-top: 1px solid #eeeeee;
        }
        .btn { 
          display: inline-block; 
          background-color: #FB2E25; 
          color: white; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 4px; 
          font-weight: bold;
          margin-top: 20px;
        }
        .btn:hover {
          background-color: #d92720;
        }
        .info-box {
          background-color: #f5f7fa;
          border-left: 4px solid #062A5A;
          padding: 15px;
          margin: 20px 0;
        }
        h1 { 
          margin: 0; 
          font-size: 24px; 
          font-weight: bold;
        }
        .logo {
          margin-bottom: 20px;
          width: 150px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Tu solicitud de seguro de Responsabilidad Civil</h1>
        </div>
        <div class="content">
          <p>Hola ${data.clientName || "Estimado cliente"},</p>
          
          <p>Hemos recibido correctamente tu solicitud de cotización para el seguro de Responsabilidad Civil para <strong>${
            data.companyName
          }</strong>.</p>
          
          <div class="info-box">
            <p><strong>Detalles de la solicitud:</strong></p>
            <ul>
              <li><strong>Actividad:</strong> ${data.activityDescription}</li>
              <li><strong>Facturación anual:</strong> ${data.billing}</li>
              ${
                data.recommendation.ambitoTerritorial
                  ? `<li><strong>Ámbito geográfico:</strong> ${data.recommendation.ambitoTerritorial}</li>`
                  : ""
              }
            </ul>
          </div>
          
          <p>Nos pondremos en contacto contigo a la mayor brevedad con una propuesta personalizada para tu empresa. Se ha adjuntado a este email un informe con el detalle de coberturas recomendadas para tu seguro.</p>
          
          <p>Este informe incluye:</p>
          <ul>
            <li>Información general sobre el seguro de responsabilidad civil</li>
            <li>Las garantías recomendadas para tu actividad</li>
            <li>Explicaciones sobre cada cobertura y ejemplos prácticos</li>
            <li>Recomendaciones para una adecuada protección de tu negocio</li>
          </ul>
          
          <p>Si tienes alguna duda o quieres añadir información adicional a tu solicitud, puedes responder directamente a este correo.</p>
          
          <p>Saludos cordiales,</p>
          <p><strong>El equipo de Smart Advice</strong></p>
          
          <a href="https://www.smartadvice.es/contacto" class="btn">Contactar con un especialista</a>
        </div>
        <div class="footer">
          <p>© ${data.year} Smart Advice - Todos los derechos reservados</p>
          <p>Este mensaje ha sido enviado a ${
            data.clientEmail || "[email protegido]"
          }</p>
          <p><small>El contenido de este mensaje y los documentos adjuntos son confidenciales.</small></p>
        </div>
      </div>
    </body>
  </html>`;
}
