// app/api/forms/responsabilidad_civil/route.ts

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { session_id, form_data } = body;

    console.log("===== API ROUTE DEBUG =====");
    console.log("Session ID:", session_id);
    console.log("Form Data:", JSON.stringify(form_data, null, 2));

    if (!session_id) {
      return NextResponse.json(
        { success: false, error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Ensure form_data is correctly formatted before inserting into database
    const formDataForDb = {
      ...form_data,
      // Make sure critical fields exist
      actividad: form_data.actividad || {},
      ambito_territorial: form_data.ambito_territorial || "España y Andorra",
      coberturas_solicitadas: form_data.coberturas_solicitadas || {},
      empresa_tipo: form_data.empresaTipo || "servicios",
    };

    // Insert into forms table with the complete form_data
    const { data: formData, error: formError } = await supabase
      .from("forms")
      .insert({
        session_id,
        type: "responsabilidad_civil",
        form_data: formDataForDb, // Use the validated form data
        is_completed: true,
        step: 5,
      })
      .select()
      .single();

    if (formError) {
      console.error("Error inserting into forms table:", formError);
      throw formError;
    }

    console.log("Successfully inserted into forms table:", formData);

    // For backward compatibility, also insert into form_responsabilidad_civil
    const actividad_manufactura = form_data.empresaTipo === "manufactura";

    const { data: rcFormData, error: rcFormError } = await supabase
      .from("form_responsabilidad_civil")
      .insert({
        form_id: formData.id,
        actividad_manufactura,
        actividad: form_data.actividad || {},
        ambito_territorial: form_data.ambito_territorial || "España y Andorra",
        coberturas_solicitadas: form_data.coberturas_solicitadas || {},
        empresa_tipo: actividad_manufactura ? "manufactura" : "servicios",
        distribucion: form_data.actividad?.manufactura?.distribucion || [],
      })
      .select()
      .single();

    if (rcFormError) {
      console.error(
        "Error inserting into form_responsabilidad_civil table:",
        rcFormError
      );
      throw rcFormError;
    }

    console.log(
      "Successfully inserted into form_responsabilidad_civil table:",
      rcFormData
    );

    // Return success response with form ID for tracking
    return NextResponse.json({
      success: true,
      form_id: formData.id,
      message: "Form successfully submitted",
    });
  } catch (error) {
    console.error("Error creating form:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Failed to create form: " + errorMessage },
      { status: 500 }
    );
  }
}
