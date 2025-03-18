// app/api/session/convert/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * Este endpoint convierte un ID de sesión temporal del lado del cliente en una sesión permanente del servidor
 * Crea una nueva sesión en la base de datos y devuelve el nuevo sessionId
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tempSessionId } = body;

    if (!tempSessionId) {
      return NextResponse.json(
        { success: false, error: "Se requiere un ID de sesión temporal" },
        { status: 400 }
      );
    }

    // Crear una nueva sesión en la base de datos
    const { data, error } = await supabase
      .from("sessions")
      .insert({
        // Podríamos almacenar el ID temporal como metadatos si fuera necesario
        metadata: { temp_session_id: tempSessionId },
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      sessionId: data.id,
      message: "Sesión temporal convertida a sesión permanente",
    });
  } catch (error) {
    console.error("Error al convertir la sesión:", error);
    return NextResponse.json(
      { success: false, error: "Error al convertir la sesión" },
      { status: 500 }
    );
  }
}
