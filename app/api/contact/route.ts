// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { ContactInfo } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const session_id = searchParams.get("session_id");

    if (!session_id) {
      return NextResponse.json(
        { success: false, error: "Session ID is required" },
        { status: 400 }
      );
    }

    console.log(
      `[Contact API] Processing request for session_id: ${session_id}`
    );

    // Obtener la información de contacto más reciente para esta sesión
    const { data: contactData, error: contactError } = await supabase
      .from("contact_info")
      .select("*")
      .eq("session_id", session_id)
      .order("created_at", { ascending: false })
      .limit(1);

    if (contactError) {
      console.error("[Contact API] Error fetching contact info:", contactError);
      throw contactError;
    }

    if (!contactData || contactData.length === 0) {
      console.log(
        "[Contact API] No contact info found for session_id:",
        session_id
      );
      return NextResponse.json({
        success: false,
        error: "No contact data found",
      });
    }

    console.log("[Contact API] Found contact info");

    return NextResponse.json({
      success: true,
      data: contactData[0],
    });
  } catch (error) {
    console.error("[Contact API] Error fetching contact info:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch contact information",
        details: error,
      },
      { status: 500 }
    );
  }
}

// Para guardar la información de contacto
export async function POST(request: NextRequest) {
  try {
    const { session_id, name, email, phone, privacy_policy_accepted } =
      await request.json();

    if (!session_id) {
      return NextResponse.json(
        { success: false, error: "Session ID is required" },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    console.log(
      `[Contact API] Saving contact info for session_id: ${session_id}`
    );

    // Insertar o actualizar la información de contacto
    const { data, error } = await supabase.from("contact_info").insert([
      {
        session_id,
        name,
        email,
        phone,
        privacy_policy_accepted: privacy_policy_accepted || false,
      },
    ]);

    if (error) {
      console.error("[Contact API] Error saving contact info:", error);
      throw error;
    }

    console.log("[Contact API] Contact info saved successfully");

    return NextResponse.json({
      success: true,
      message: "Contact information saved successfully",
    });
  } catch (error) {
    console.error("[Contact API] Error saving contact info:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to save contact information",
        details: error,
      },
      { status: 500 }
    );
  }
}
