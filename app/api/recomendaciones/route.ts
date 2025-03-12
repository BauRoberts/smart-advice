// app/api/recomendaciones/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Indicar a Next.js que esta es una ruta dinámica
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

    // First get the forms for this session
    const { data: forms, error: formsError } = await supabase
      .from("forms")
      .select("id")
      .eq("session_id", session_id);

    if (formsError) throw formsError;

    if (!forms || forms.length === 0) {
      return NextResponse.json({
        success: true,
        recommendations: [],
      });
    }

    // Get form IDs
    const formIds = forms.map((form) => form.id);

    // Get recommendations for these forms
    const { data: recommendations, error: recsError } = await supabase
      .from("recommendations")
      .select(
        `
        *,
        insurance:insurances(*)
      `
      )
      .in("form_id", formIds);

    if (recsError) throw recsError;

    return NextResponse.json({
      success: true,
      recommendations,
    });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}
