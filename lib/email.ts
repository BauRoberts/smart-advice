// lib/email.ts
// You need to install the Resend package first:
// npm install resend
// or
// yarn add resend
import { Resend } from "resend";

// Asegurarnos de que este código solo se ejecute en el servidor
// y nunca en el cliente
let resend: Resend | null = null;

// Inicializar Resend solo en el servidor
if (typeof window === "undefined") {
  resend = new Resend(process.env.RESEND_API_KEY);
} else {
  console.warn(
    "Attempted to access email utility from client-side code - this is expected during hydration but should not be used directly"
  );
}

export async function sendQuotationRequest({
  email,
  name,
  recommendations,
  tipo,
}: {
  email: string;
  name: string;
  recommendations: any[];
  tipo?: string;
}) {
  try {
    // Verificar que estamos en el servidor
    if (typeof window !== "undefined") {
      throw new Error("This function can only be called from server-side code");
    }

    // Email de Smart Advice
    const smartAdviceEmail = "bautistaroberts@gmail.com";

    // Obtener información del cliente y recomendaciones
    const recommendation = recommendations[0] || {}; // Tomamos la primera recomendación
    const companyInfo = recommendation.companyInfo || {};

    // Debug log para ver la estructura completa
    console.log(
      "DEBUG sendQuotationRequest - companyInfo:",
      JSON.stringify(companyInfo, null, 2)
    );

    // Recopilar la información necesaria para el correo
    const tomador = companyInfo.name || "XXXX (QUE PONGA EL TOMADOR)";

    // Usar CIF/NIF desde el objeto companyInfo si existe

    const direccion =
      companyInfo.address || companyInfo.localizacion_nave || "XXXX";
    const cnae = companyInfo.cnae_code || "XXXX";

    // Actividad
    const actividad =
      companyInfo.activityDescription || companyInfo.activity || "XXXX";

    // Facturación
    const facturacion = companyInfo.billing
      ? new Intl.NumberFormat("es-ES").format(companyInfo.billing) + "€"
      : "XXXX";

    // Asegurado adicional (propietario de la nave)
    let aseguradoAdicional = "";
    if (
      companyInfo.installations_type === "No propietario" &&
      companyInfo.owner_name
    ) {
      aseguradoAdicional = `INCLUIR COMO ASEGURADO ADICIONAL AL PROPIETARIO DE LA NAVE, SR./EMPRESA ${companyInfo.owner_name}`;
    } else {
      aseguradoAdicional = "N/A";
    }

    // Generar lista de coberturas
    let garantiasLista = "";
    if (recommendation.coverages && recommendation.coverages.length > 0) {
      const coberturasRequeridas = recommendation.coverages.filter(
        (cov: any) => cov.required
      );

      coberturasRequeridas.forEach((cov: any) => {
        let coberturaTxt = cov.name;

        // Añadir los límites o condiciones si existen
        if (cov.limit) {
          coberturaTxt += ` - ${cov.limit}`;
        }
        if (cov.sublimit) {
          coberturaTxt += ` - Sublímite: ${cov.sublimit}`;
        }
        if (cov.condition && !cov.limit && !cov.sublimit) {
          coberturaTxt += ` - ${cov.condition}`;
        }

        garantiasLista += `• ${coberturaTxt}<br>`;
      });
    }

    // Ámbitos geográficos
    const ambitoGeneral =
      recommendation.ambitoTerritorial || "España y Andorra";
    const ambitoProductos =
      recommendation.ambitoProductos || "España y Andorra";

    // Siniestralidad
    const siniestralidad = recommendation.siniestralidad
      ?.siniestros_ultimos_3_anos
      ? `SÍ - ${recommendation.siniestralidad.siniestros_detalles || ""}`
      : "Ningún siniestro en los últimos 3 años";

    // First, check if we're in a test environment
    if (process.env.NODE_ENV === "development" && !process.env.RESEND_API_KEY) {
      console.log(
        "DEVELOPMENT MODE: Email would be sent with the following data:",
        {
          from: "Smart Advice <noreply@smartadvice.es>",
          to: [smartAdviceEmail],
          cc: [email],
          subject: `Solicitud de cotización de Seguro de ${
            tipo === "responsabilidad_civil"
              ? "Responsabilidad Civil"
              : "Daños Materiales"
          } - ${tomador}`,
          text: `Información para cotización de ${tomador}`,
        }
      );
      return { success: true, data: { id: "test-email-id" } };
    }

    if (!resend) {
      throw new Error(
        "Resend is not initialized - this should never happen on the server"
      );
    }

    const { data, error } = await resend.emails.send({
      from: `Smart Advice <noreply@smartadvice.es>`,
      to: [smartAdviceEmail],
      cc: [email],
      subject: `Solicitud de cotización de Seguro de ${
        tipo === "responsabilidad_civil"
          ? "Responsabilidad Civil"
          : "Daños Materiales"
      } - ${tomador}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: left;">
          <p>Estimados colaboradores,</p>
          
          <p>Sirva el presente correo para solicitar cotización de seguro de ${
            tipo === "responsabilidad_civil"
              ? "Responsabilidad Civil General"
              : "Daños Materiales"
          } de acuerdo con la siguiente información:</p>
          
          <p><strong>TOMADOR:</strong> ${tomador}</p>
          <p><strong>DIRECCIÓN:</strong> ${direccion}</p>
          <p><strong>CNAE:</strong> ${cnae}</p>
          <p><strong>ACTIVIDAD:</strong> ${actividad}</p>
          <p><strong>FACTURACIÓN:</strong> ${facturacion}</p>
          ${
            aseguradoAdicional !== "N/A"
              ? `<p><strong>ASEGURADO ADICIONAL:</strong> ${aseguradoAdicional}</p>`
              : ""
          }
          
          <p><strong>Garantías y límites</strong></p>
          <div style="text-align: center; margin: 10px 0;">
            ${garantiasLista}
          </div>
          
          <p><strong>Ámbito geográfico general:</strong> ${ambitoGeneral}</p>
          
          <p><strong>Ámbito geográfico productos:</strong> ${ambitoProductos}</p>
          
          <p><strong>Siniestralidad últimos 3 años:</strong> ${siniestralidad}</p>
          
          <p>Quedamos a la espera de respuesta.</p>
          
          <p>Saludos cordiales,</p>
          
          <p><strong>SMART ADVICE</strong></p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending quotation request email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Exception sending quotation request email:", error);
    return { success: false, error };
  }
}

/**
 * Sends a contact form notification to the administrator
 */
export async function sendContactNotification({
  name,
  email,
  phone,
  message,
}: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
  try {
    // Verificar que estamos en el servidor
    if (typeof window !== "undefined") {
      throw new Error("This function can only be called from server-side code");
    }

    // The admin email to receive notifications (replace with the actual email)
    const adminEmail = process.env.ADMIN_EMAIL || "info@smartadvice.es";

    // First, check if we're in a test environment
    if (process.env.NODE_ENV === "development" && !process.env.RESEND_API_KEY) {
      console.log(
        "DEVELOPMENT MODE: Email would be sent with the following data:",
        {
          to: [adminEmail],
          subject: `Nuevo mensaje de contacto de ${name}`,
          name,
          email,
          phone,
          message,
        }
      );
      return { success: true, data: { id: "test-email-id" } };
    }

    if (!resend) {
      throw new Error(
        "Resend is not initialized - this should never happen on the server"
      );
    }

    const { data, error } = await resend.emails.send({
      from: `Smart Advice <noreply@smartadvice.es>`,
      to: [adminEmail],
      subject: `Nuevo mensaje de contacto de ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://smartadvice.es/images/smart-advice-logo.png" alt="Smart Advice" style="max-width: 120px;">
          </div>
          <h2 style="color: #062A5A; margin-bottom: 20px;">Nuevo mensaje de contacto</h2>
          <p style="margin-bottom: 10px;"><strong>Nombre:</strong> ${name}</p>
          <p style="margin-bottom: 10px;"><strong>Email:</strong> ${email}</p>
          <p style="margin-bottom: 10px;"><strong>Teléfono:</strong> ${phone}</p>
          <div style="margin-bottom: 20px;">
            <strong>Mensaje:</strong>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 10px;">
              ${message.replace(/\n/g, "<br>")}
            </div>
          </div>
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #777777; font-size: 12px;">
            <p>Este es un email automático enviado desde el formulario de contacto de Smart Advice.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending contact notification email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Exception sending contact notification email:", error);
    return { success: false, error };
  }
}

/**
 * Sends a confirmation email to the user who submitted the contact form
 */
export async function sendContactConfirmation({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  try {
    // Verificar que estamos en el servidor
    if (typeof window !== "undefined") {
      throw new Error("This function can only be called from server-side code");
    }

    // First, check if we're in a test environment
    if (process.env.NODE_ENV === "development" && !process.env.RESEND_API_KEY) {
      console.log(
        "DEVELOPMENT MODE: Email would be sent with the following data:",
        {
          to: [email],
          subject: "Hemos recibido tu mensaje - Smart Advice",
          name,
          email,
        }
      );
      return { success: true, data: { id: "test-email-id" } };
    }

    if (!resend) {
      throw new Error(
        "Resend is not initialized - this should never happen on the server"
      );
    }

    const { data, error } = await resend.emails.send({
      from: `Smart Advice <noreply@smartadvice.es>`,
      to: [email],
      subject: "Hemos recibido tu mensaje - Smart Advice",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://smartadvice.es/images/smart-advice-logo.png" alt="Smart Advice" style="max-width: 120px;">
          </div>
          <h2 style="color: #062A5A; margin-bottom: 20px;">Gracias por contactar con nosotros</h2>
          <p>Hola ${name},</p>
          <p>Hemos recibido tu mensaje correctamente. Un miembro de nuestro equipo lo revisará y te responderá lo antes posible.</p>
          <p>Si necesitas ayuda urgente, no dudes en llamarnos al +34 912 456 789.</p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://smartadvice.es" style="display: inline-block; background-color: #062A5A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: 500;">Visitar nuestra web</a>
          </div>
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #777777; font-size: 12px;">
            <p>Este es un email automático, por favor no respondas a este mensaje.</p>
            <p>© ${new Date().getFullYear()} Smart Advice S.L. Todos los derechos reservados.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending contact confirmation email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Exception sending contact confirmation email:", error);
    return { success: false, error };
  }
}

/**
 * Sends recommendations to a user's email
 */
export async function sendRecommendationsEmail({
  email,
  name,
  recommendations,
  tipo,
}: {
  email: string;
  name: string;
  recommendations: any[];
  tipo?: string;
}) {
  try {
    // Verificar que estamos en el servidor
    if (typeof window !== "undefined") {
      throw new Error("This function can only be called from server-side code");
    }

    // First, check if we're in a test environment
    if (process.env.NODE_ENV === "development" && !process.env.RESEND_API_KEY) {
      console.log(
        "DEVELOPMENT MODE: Email would be sent with the following data:",
        {
          to: [email],
          subject: "Tu asesoramiento personalizado - Smart Advice",
          name,
          email,
          recommendationsCount: recommendations.length,
          recommendationType: tipo || "general",
        }
      );
      return { success: true, data: { id: "test-email-id" } };
    }

    if (!resend) {
      throw new Error(
        "Resend is not initialized - this should never happen on the server"
      );
    }

    let recommendationsHtml = "";

    // Generate HTML for recommendations
    recommendations.forEach((rec) => {
      recommendationsHtml += `
        <div style="margin-bottom: 30px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #f9f9f9;">
          <h3 style="color: #062A5A; margin-bottom: 15px;">${
            rec.type === "responsabilidad_civil"
              ? "Seguro de Responsabilidad Civil"
              : "Seguro de Daños Materiales"
          }</h3>
          
          ${
            rec.ambitoTerritorial
              ? `
            <div style="margin-bottom: 15px;">
              <p style="font-weight: bold; margin-bottom: 5px;">Ámbito territorial recomendado:</p>
              <p style="background-color: #F5F2FB; padding: 10px; border-radius: 4px;">${rec.ambitoTerritorial}</p>
            </div>
          `
              : ""
          }
          
          ${
            rec.limits
              ? `
            <div style="margin-bottom: 15px;">
              <p style="font-weight: bold; margin-bottom: 5px;">Límites recomendados:</p>
              <div style="background-color: #F5F2FB; padding: 10px; border-radius: 4px;">
                <p><span style="color: #777;">Límite general:</span> <strong>${
                  rec.limits.generalLimit
                }</strong></p>
                ${
                  rec.limits.victimSubLimit
                    ? `<p><span style="color: #777;">Sublímite por víctima:</span> <strong>${rec.limits.victimSubLimit}</strong></p>`
                    : ""
                }
                ${
                  rec.limits.explanation
                    ? `<p style="font-size: 12px; font-style: italic; margin-top: 5px;">${rec.limits.explanation}</p>`
                    : ""
                }
              </div>
            </div>
          `
              : ""
          }
          
          <div>
            <p style="font-weight: bold; margin-bottom: 5px;">Coberturas necesarias:</p>
            <div style="background-color: #F5F2FB; padding: 10px; border-radius: 4px;">
              <ul style="padding-left: 20px; margin: 0;">
                ${rec.coverages
                  .filter((cov: any) => cov.required)
                  .map(
                    (cov: any) => `
                  <li style="margin-bottom: 10px;">
                    <strong>${cov.name}</strong>
                    ${
                      cov.condition
                        ? `<br><span style="font-size: 12px; color: #777;">${cov.condition}</span>`
                        : ""
                    }
                  </li>
                `
                  )
                  .join("")}
              </ul>
            </div>
          </div>
        </div>
      `;
    });

    const emailSubject = tipo
      ? `Tu asesoramiento personalizado de ${
          tipo === "responsabilidad_civil"
            ? "Responsabilidad Civil"
            : "Daños Materiales"
        }`
      : "Tu asesoramiento personalizado de seguros";

    const { data, error } = await resend.emails.send({
      from: `Smart Advice <noreply@smartadvice.es>`,
      to: [email],
      subject: emailSubject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://smartadvice.es/images/smart-advice-logo.png" alt="Smart Advice" style="max-width: 120px;">
          </div>
          <h2 style="color: #062A5A; margin-bottom: 20px;">Tu asesoramiento personalizado</h2>
          <p>Hola ${name},</p>
          <p>Adjuntamos el asesoramiento personalizado que has solicitado para tu empresa. Este asesoramiento ha sido generado en base a la información que nos has proporcionado.</p>
          
          <div style="margin-top: 30px;">
            ${recommendationsHtml}
          </div>
          
          <p style="margin-top: 20px;">Para obtener más información o para contratar alguno de estos seguros, no dudes en contactarnos.</p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://smartadvice.es/contacto" style="display: inline-block; background-color: #062A5A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: 500;">Contactar con un agente</a>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #777777; font-size: 12px;">
            <p>Este es un email automático, por favor no respondas a este mensaje.</p>
            <p>© ${new Date().getFullYear()} Smart Advice S.L. Todos los derechos reservados.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending recommendations email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Exception sending recommendations email:", error);
    return { success: false, error };
  }
}
