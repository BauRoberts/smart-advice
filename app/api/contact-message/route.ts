// app/api/contact-message/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendContactNotification, sendContactConfirmation } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, privacyPolicy } = body;

    // Verify privacy policy acceptance
    if (!privacyPolicy) {
      return NextResponse.json(
        { success: false, error: "Debes aceptar la política de privacidad" },
        { status: 400 }
      );
    }

    // Get or create a session
    let sessionId;
    const existingSession = request.headers.get("x-session-id");

    if (existingSession) {
      sessionId = existingSession;
    } else {
      // Create new session
      const { data: sessionData, error: sessionError } = await supabase
        .from("sessions")
        .insert({})
        .select()
        .single();

      if (sessionError) {
        console.error("Error creating session:", sessionError);
        throw new Error("No se pudo crear una sesión");
      }

      sessionId = sessionData.id;
    }

    // Try to save the contact message
    try {
      const { data: contactData, error: contactError } = await supabase
        .from("contact_messages")
        .insert({
          session_id: sessionId,
          name,
          email,
          phone,
          message,
          privacy_policy_accepted: privacyPolicy,
          status: "new",
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (contactError) throw contactError;

      // Send email notifications asynchronously
      // We don't await these to keep the response time fast for the user
      sendContactNotification({
        name,
        email,
        phone,
        message,
      }).catch((error) => {
        console.error("Failed to send admin notification email:", error);
      });

      sendContactConfirmation({
        name,
        email,
      }).catch((error) => {
        console.error("Failed to send confirmation email:", error);
      });

      return NextResponse.json({
        success: true,
        message: "Mensaje recibido correctamente",
        session_id: sessionId,
        contact_id: contactData.id,
      });
    } catch (messageError) {
      // Fallback to contact_info table if contact_messages table doesn't exist
      console.error("Error saving to contact_messages:", messageError);

      const { data: contactData, error: contactError } = await supabase
        .from("contact_info")
        .insert({
          session_id: sessionId,
          name,
          email,
          phone,
          privacy_policy_accepted: privacyPolicy,
          // Store message in metadata if possible
          metadata: { message },
        })
        .select()
        .single();

      if (contactError) {
        throw new Error("No se pudo guardar la información de contacto");
      }

      // Still try to send email notifications
      sendContactNotification({
        name,
        email,
        phone,
        message,
      }).catch((error) => {
        console.error("Failed to send admin notification email:", error);
      });

      sendContactConfirmation({
        name,
        email,
      }).catch((error) => {
        console.error("Failed to send confirmation email:", error);
      });

      return NextResponse.json({
        success: true,
        message: "Mensaje recibido correctamente (modo compatibilidad)",
        session_id: sessionId,
        contact_id: contactData.id,
      });
    }
  } catch (error) {
    console.error("Error processing contact message:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error al procesar el mensaje de contacto",
      },
      { status: 500 }
    );
  }
}
