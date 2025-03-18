// app/api/contact-message/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, message, privacyPolicy } = body;

    // Verificar que se ha aceptado la política de privacidad
    if (!privacyPolicy) {
      return NextResponse.json(
        { success: false, error: "Debes aceptar la política de privacidad" },
        { status: 400 }
      );
    }

    // Primero crear o recuperar una sesión
    let sessionId;
    const existingSession = request.headers.get("x-session-id");

    if (existingSession) {
      sessionId = existingSession;
    } else {
      // Crear nueva sesión
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

    // Guardar mensaje de contacto - intentar insertar en la tabla contact_messages
    try {
      const { data: contactData, error: contactError } = await supabase
        .from("contact_messages")
        .insert({
          session_id: sessionId,
          name,
          email,
          phone,
          company: company || null,
          message,
          privacy_policy_accepted: privacyPolicy,
        })
        .select()
        .single();

      if (contactError) throw contactError;

      return NextResponse.json({
        success: true,
        message: "Mensaje recibido correctamente",
        session_id: sessionId,
        contact_id: contactData.id,
      });
    } catch (messageError) {
      // Si falla al insertar en contact_messages, intentar con contact_info como fallback
      console.error("Error al guardar en contact_messages:", messageError);

      const { data: contactData, error: contactError } = await supabase
        .from("contact_info")
        .insert({
          session_id: sessionId,
          name,
          email,
          phone,
          privacy_policy_accepted: privacyPolicy,
        })
        .select()
        .single();

      if (contactError) {
        throw new Error("No se pudo guardar la información de contacto");
      }

      return NextResponse.json({
        success: true,
        message: "Mensaje recibido correctamente (modo compatibilidad)",
        session_id: sessionId,
        contact_id: contactData.id,
      });
    }
  } catch (error) {
    console.error("Error al procesar mensaje de contacto:", error);
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
