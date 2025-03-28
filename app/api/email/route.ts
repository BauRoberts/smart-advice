// app/api/email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { generateDanosInternalEmailContent } from "@/lib/services/emailService";
import { generateRCExactEmailContent } from "@/lib/services/rcEmailService";

// Inicializar Resend con la API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Templates de email
const emailTemplates: Record<string, (data: any) => string> = {
  // Template para cliente de Daños Materiales
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
  // app/api/email/route.ts - Agregar el template exacto

  // Añade este template al objeto emailTemplates en el archivo existente:

  // Template para cliente de Responsabilidad Civil con formato exacto
  "rc-exacto": (data) => {
    return `
    <html>
      <head>
        <style>
          body { font-family: Calibri, Arial, sans-serif; line-height: 1.6; color: #333; }
          ul { list-style-type: disc; padding-left: 20px; margin-top: 15px; }
          .red-text { color: #FF0000; font-weight: bold; }
          p { margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <p>Estimados colaboradores,</p>
        
        <p>Sirva el presente correo para solicitar cotización de seguro de Responsabilidad Civil General de acuerdo con la siguiente información:</p>
        
        <ul>
          <li>TOMADOR XXXX (QUE PONGA EL TOMADOR)</li>
          <li>CIF XXXX (QUE PONGA EL CIF)</li>
          <li>DIRECCION XXXX (ASÍ SUCESIVAMENTE)</li>
          <li>CNAE: ${
            data.recommendation.companyInfo.cnae_code || "XXXXXX"
          }</li>
          <li>ACTIVIDAD: ${
            data.recommendation.companyInfo.activity || "XXXXXX"
          }</li>
          <li>FACTURACION XXX</li>
          <li>ASEGURADO ADICIONAL INCLUIR COMO ASEGURADO ADICIONAL AL PROPIETARIO DE LA NAVE, SR./EMPRESA XXXXXX</li>
        </ul>
        
        <p>Garantías y límites</p>
        
        <p class="red-text">ACA METEMOS TODO TAL CUAL EL CLIENTE NOS LO DIO Y QUE QUEDO EN LA WEB</p>
        
        <p>Ámbito geográfico general: IDEM</p>
        
        <p>Ámbito geográfico productos: IDEM</p>
        
        <p>Siniestralidad últimos 3 años: IDEM</p>
        
        <p>Quedamos a la espera de respuesta.</p>
        
        <p>Saludos cordiales.</p>
        
        <p style="font-weight: bold;">SMART ADVICE</p>
      </body>
    </html>
    `;
  },

  // Template para cliente de Responsabilidad Civil
  // Añadir este template a la colección de emailTemplates en app/api/email/route.ts

  // Template mejorado para cliente de Responsabilidad Civil con variables y mejor diseño
  "rc-client-enhanced": (data) => {
    const { clientName, recommendation, clientEmail } = data;
    const year = new Date().getFullYear();
    const companyName = recommendation.companyInfo.name || "tu empresa";
    const activityDescription =
      recommendation.companyInfo.activity ||
      recommendation.companyInfo.activityDescription ||
      "tu actividad";

    // Función para formatear números como moneda
    const formatCurrency = (value: number | undefined | null): string => {
      if (value === undefined || value === null) return "N/A";
      return (
        new Intl.NumberFormat("es-ES", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value) + "€"
      );
    };

    const billing = formatCurrency(recommendation.companyInfo.billing || 0);

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
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Tu solicitud de seguro de Responsabilidad Civil</h1>
          </div>
          <div class="content">
            <p>Hola ${clientName || "Estimado cliente"},</p>
            
            <p>Hemos recibido correctamente tu solicitud de cotización para el seguro de Responsabilidad Civil para <strong>${companyName}</strong>.</p>
            
            <div class="info-box">
              <p><strong>Detalles de la solicitud:</strong></p>
              <ul>
                <li><strong>Actividad:</strong> ${activityDescription}</li>
                <li><strong>Facturación anual:</strong> ${billing}</li>
                ${
                  recommendation.ambitoTerritorial
                    ? `<li><strong>Ámbito geográfico:</strong> ${recommendation.ambitoTerritorial}</li>`
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
            <p>© ${year} Smart Advice - Todos los derechos reservados</p>
            <p>Este mensaje ha sido enviado a ${
              clientEmail || "[email protegido]"
            }</p>
            <p><small>El contenido de este mensaje y los documentos adjuntos son confidenciales.</small></p>
          </div>
        </div>
      </body>
    </html>`;
  },

  // Template para uso interno de Daños Materiales
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

  // Template para uso interno de Responsabilidad Civil
  "rc-interno": (data) => {
    const { recommendation } = data;
    const emailContent = generateRCExactEmailContent(recommendation);

    return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          ${emailContent}
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
