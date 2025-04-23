// lib/services/rcEmailService.ts
import { generateRCInsuranceReport } from "./rcReportService";

// Función para enviar email de RC usando la API de email
export async function sendRCRecommendationEmail(
  recommendation: any,
  contactEmail: string,
  contactName: string
) {
  try {
    console.log("Enviando solicitud de cotización de RC a:", contactEmail);
    console.log("Datos de contacto:", { contactEmail, contactName });
    console.log("Datos de recomendación:", recommendation);

    // Asegurar que tengamos un nombre, incluso si es vacío
    const name = contactName || recommendation.companyInfo?.name || "Cliente";

    // Obtener session_id del localStorage, con manejo adecuado para SSR
    let session_id = "";
    if (typeof window !== "undefined" && window.localStorage) {
      // Intentar obtener de diferentes fuentes, por orden de prioridad
      session_id =
        localStorage.getItem("smart_advice_session_id") ||
        localStorage.getItem("last_used_session_id") ||
        localStorage.getItem("last_used_form_session_id") ||
        "";

      console.log("Session ID para solicitud de email:", session_id);
    }

    if (!session_id) {
      console.warn("No se encontró session_id en localStorage");
    }

    if (!contactEmail) {
      throw new Error("Email de contacto es obligatorio");
    }

    // Hacer una solicitud a nuestra API interna
    const response = await fetch("/api/recomendaciones/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: contactEmail,
        name: name, // Aseguramos que siempre tenemos un nombre
        session_id: session_id,
        form_type: "responsabilidad_civil",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error al enviar el email: ${response.statusText} - ${errorText}`
      );
    }

    const result = await response.json();
    console.log("Respuesta del servidor de email:", result);

    return {
      success: true,
      emailResponse: result,
    };
  } catch (error) {
    console.error("Error al enviar email de RC:", error);
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

// Función para generar el contenido del email para el template de RC exacto
export function generateRCExactEmailContent(recommendation: any): string {
  // Generar un listado de coberturas formateado
  let coveragesHTML = "";

  if (recommendation.coverages && recommendation.coverages.length > 0) {
    coveragesHTML =
      '<h3 style="color: #062A5A; margin-top: 25px;">Garantías y Límites Solicitados</h3><ul>';

    // Añadir cada cobertura como un elemento de lista
    recommendation.coverages.forEach((coverage: any) => {
      if (coverage.required) {
        // Determinar qué mostrar después del nombre de la cobertura
        let limitText = "";
        if (coverage.limit) {
          limitText = ` - <span style="color: #FB2E25;">${coverage.limit}</span>`;
        } else if (coverage.condition) {
          limitText = ` - <span style="color: #FB2E25;">${coverage.condition}</span>`;
        } else if (coverage.sublimit) {
          limitText = ` - <span style="color: #FB2E25;">Sublímite: ${coverage.sublimit}</span>`;
        }

        coveragesHTML += `<li><strong>${coverage.name}</strong>${limitText}</li>`;
      }
    });

    coveragesHTML += "</ul>";
  }

  // Generar un contenido completo y bien formateado con elementos básicos
  return `
    <p>Estimados colaboradores,</p>
    
    <p>Sirva el presente correo para solicitar cotización de seguro de Responsabilidad Civil General de acuerdo con la siguiente información:</p>
    
    <h3 style="color: #062A5A;">Datos del Tomador</h3>
    <ul>
      <li><strong>TOMADOR:</strong> ${
        recommendation.companyInfo.name || "XXXX"
      }</li>
      <li><strong>CIF:</strong> ${recommendation.companyInfo.cif || "XXXX"}</li>
      <li><strong>DIRECCIÓN:</strong> ${
        recommendation.companyInfo.address || "XXXX"
      }</li>
      <li><strong>CNAE:</strong> ${
        recommendation.companyInfo.cnae_code || "XXXXXX"
      }</li>
      <li><strong>ACTIVIDAD:</strong> ${
        recommendation.companyInfo.activity || "XXXXXX"
      }</li>
      <li><strong>FACTURACIÓN:</strong> ${formatCurrency(
        recommendation.companyInfo.billing
      )}</li>
      ${
        recommendation.companyInfo.owner_name
          ? `<li><strong>ASEGURADO ADICIONAL:</strong> INCLUIR COMO ASEGURADO ADICIONAL AL PROPIETARIO DE LA NAVE, SR./EMPRESA ${recommendation.companyInfo.owner_name}</li>`
          : ""
      }
    </ul>
    
    ${coveragesHTML}
    
    <h3 style="color: #062A5A;">Ámbito Geográfico</h3>
    <ul>
      <li><strong>Ámbito geográfico general:</strong> ${
        recommendation.ambitoTerritorial || "IDEM"
      }</li>
      <li><strong>Ámbito geográfico productos:</strong> ${
        recommendation.ambitoProductos || "IDEM"
      }</li>
    </ul>
    
    <h3 style="color: #062A5A;">Siniestralidad</h3>
    <ul>
      <li><strong>Siniestralidad últimos 3 años:</strong> ${
        recommendation.siniestralidad?.siniestros_ultimos_3_anos ? "SÍ" : "NO"
      }</li>
      ${
        recommendation.siniestralidad?.siniestros_detalles
          ? `<li><strong>Detalles de siniestralidad:</strong> ${recommendation.siniestralidad.siniestros_detalles}</li>`
          : ""
      }
    </ul>
    
    <p>Quedamos a la espera de respuesta.</p>
    
    <p>Saludos cordiales,</p>
    
    <p style="color: #062A5A; font-weight: bold;">SMART ADVICE</p>
  `;
}

// HTML del template mejorado para el email al cliente
export function generateRCClientEmailTemplate(data: any): string {
  return `
  <html>
    <head>
      <style>
        * {
          text-align: left !important;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          background-color: #f5f7fa;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background-color: #ffffff;
        }
        .header { 
          background-color: #062A5A; 
          color: white; 
          padding: 30px 20px; 
        }
        .content { 
          padding: 30px 20px; 
          background-color: #ffffff;
        }
        .footer { 
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
          color: white !important; 
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
        ul {
          list-style-position: inside;
          padding: 0;
          margin: 10px 0;
        }
        li {
          margin-bottom: 5px;
          padding-left: 15px;
        }
        p {
          margin: 10px 0;
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
          
          <p>Nos pondremos en contacto contigo a la mayor brevedad con una propuesta personalizada para tu empresa.</p>
          
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
