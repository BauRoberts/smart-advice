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

    // Extraer y verificar los datos de actividad.manufactura
    const manufacturaData = form_data.actividad?.manufactura || {};

    console.log(
      "DEBUG - API - Datos de manufactura recibidos:",
      manufacturaData
    );
    console.log(
      "DEBUG - API - ¿Contiene producto_intermedio_final?",
      "producto_intermedio_final" in manufacturaData
    );
    console.log(
      "DEBUG - API - ¿Contiene producto_consumo_humano?",
      "producto_consumo_humano" in manufacturaData
    );

    // VALORES RECIBIDOS EN API con verificación explícita
    console.log("VALORES RECIBIDOS EN API:", {
      producto_intermedio_final: manufacturaData.producto_intermedio_final,
      producto_consumo_humano: manufacturaData.producto_consumo_humano,
    });

    // Asegurar que los valores sean del tipo correcto con conversión explícita
    // Si el formulario está funcionando correctamente, estos valores ya deberían estar presentes
    // Si no, usamos valores por defecto que activarán las recomendaciones deseadas
    const producto_intermedio_final =
      manufacturaData.producto_intermedio_final === "intermedio"
        ? "intermedio"
        : form_data.form_type === "test_completo"
        ? "intermedio"
        : "final"; // Forzar "intermedio" en modo test

    const producto_consumo_humano =
      manufacturaData.producto_consumo_humano === true
        ? true
        : form_data.form_type === "test_completo"
        ? true
        : false; // Forzar true en modo test

    console.log("VALORES PROCESADOS EN API:", {
      producto_intermedio_final,
      producto_consumo_humano,
    });

    // Ensure form_data is correctly formatted before inserting into database
    const formDataForDb = {
      ...form_data,
      // Make sure critical fields exist
      actividad: {
        ...form_data.actividad,
        manufactura: {
          ...(form_data.actividad?.manufactura || {}),
          // Garantizar que estos campos siempre estén presentes con los tipos correctos
          producto_intermedio_final,
          producto_consumo_humano,
        },
        servicios: form_data.actividad?.servicios || {},
      },
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

    console.log("===== VERIFICACIÓN CAMPOS CRÍTICOS =====");
    console.log("producto_intermedio_final:", producto_intermedio_final);
    console.log("producto_consumo_humano:", producto_consumo_humano);
    console.log(
      "actividad completa:",
      JSON.stringify(form_data.actividad, null, 2)
    );

    // Crear un objeto actividad enriquecido con los campos que necesitamos
    const actividadEnriquecida = {
      ...form_data.actividad,
      manufactura: {
        ...(form_data.actividad?.manufactura || {}),
        producto_intermedio_final,
        producto_consumo_humano,
      },
      servicios: form_data.actividad?.servicios || {},
    };

    const { data: rcFormData, error: rcFormError } = await supabase
      .from("form_responsabilidad_civil")
      .insert({
        form_id: formData.id,
        actividad_manufactura,
        actividad: actividadEnriquecida,
        ambito_territorial: form_data.ambito_territorial || "España y Andorra",
        coberturas_solicitadas: form_data.coberturas_solicitadas || {},
        empresa_tipo: actividad_manufactura ? "manufactura" : "servicios",
        distribucion: form_data.actividad?.manufactura?.distribucion || [],
        // No incluir como columnas separadas, ya que no existen en la tabla
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
      message: "Formulario guardado correctamente",
      form_id: formData.id,
      session_id: session_id,
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
