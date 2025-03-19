// lib/email.ts
// You need to install the Resend package first:
// npm install resend
// or
// yarn add resend
import { Resend } from "resend";

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Ensure the email is not exposed in client-side bundles
if (typeof window !== "undefined") {
  throw new Error("Attempted to access email utility from client-side code");
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
