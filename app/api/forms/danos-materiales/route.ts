// app/api/forms/danos-materiales/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      session_id,
      form_data,
      empresa,
      capital,
      construccion,
      proteccion_incendios,
      proteccion_robo,
      siniestralidad,
    } = body;

    console.log("===== API ROUTE DEBUG (DAÑOS MATERIALES) =====");
    console.log("Session ID:", session_id);
    console.log("Form Data:", JSON.stringify(form_data, null, 2));

    if (!session_id) {
      return NextResponse.json(
        { success: false, error: "Session ID is required" },
        { status: 400 }
      );
    }

    // MODIFICACIÓN: Verificar si la sesión existe y, si no, crearla
    const { data: existingSession } = await supabase
      .from("sessions")
      .select("id")
      .eq("id", session_id)
      .single();

    if (!existingSession) {
      console.log(
        "Session ID not found in database. Creating a new session record."
      );
      // La sesión no existe, así que la creamos
      const { data: newSession, error: sessionError } = await supabase
        .from("sessions")
        .insert({
          id: session_id, // Usar el mismo ID que el cliente está enviando
        })
        .select()
        .single();

      if (sessionError) {
        console.error("Error creating session record:", sessionError);
        return NextResponse.json(
          { success: false, error: "Failed to create session record" },
          { status: 500 }
        );
      }

      console.log("Created new session record:", newSession);
    } else {
      console.log(
        "Session ID found in database, proceeding with form submission"
      );
    }

    // First, save contact information to the database
    if (form_data.contact) {
      const { name, email, phone, privacyPolicy } = form_data.contact;

      const { data: contactData, error: contactError } = await supabase
        .from("contact_info")
        .insert({
          session_id,
          name,
          email,
          phone,
          privacy_policy_accepted: privacyPolicy,
        })
        .select()
        .single();

      if (contactError) {
        console.error("Error saving contact info:", contactError);
        // Continue anyway, as the form data is more important
      }
    }

    // First, check if company exists
    const { data: companyData, error: companyError } = await supabase
      .from("companies")
      .select("id")
      .eq("session_id", session_id)
      .maybeSingle();

    let companyId;

    // If company doesn't exist, create it
    if (!companyData) {
      const { data: newCompany, error: newCompanyError } = await supabase
        .from("companies")
        .insert({
          session_id,
          name: form_data.company.name || "Sin nombre",
          activity: form_data.company.activity,
          billing: form_data.company.billing,
          employees_number: form_data.company.employees_number,
          online_invoice: form_data.company.online_invoice,
          installations_type: form_data.company.installations_type,
          m2_installations: form_data.company.m2_installations,
          almacena_bienes_terceros: form_data.company.almacena_bienes_terceros,
          vehiculos_terceros_aparcados:
            form_data.company.vehiculos_terceros_aparcados,
        })
        .select()
        .single();

      if (newCompanyError) throw newCompanyError;
      companyId = newCompany.id;
    } else {
      companyId = companyData.id;
    }

    // Create a form entry
    const { data: formData, error: formError } = await supabase
      .from("forms")
      .insert({
        session_id,
        type: "danos_materiales",
        form_data,
        is_completed: true,
        step: 8,
      })
      .select()
      .single();

    if (formError) throw formError;

    // Create specific form data
    const { data: dmFormData, error: dmFormError } = await supabase
      .from("form_danos_materiales")
      .insert({
        form_id: formData.id,
        valor_edificio: form_data.capitales?.valor_edificio,
        valor_ajuar: form_data.capitales?.valor_ajuar,
        proteccion_incendios: form_data.proteccion_incendios,
        proteccion_robo: form_data.proteccion_robo,
        siniestralidad: {
          ultimos_3_anios: form_data.siniestralidad?.siniestros_ultimos_3_anos,
          detalles: form_data.siniestralidad?.siniestros_detalles,
        },
        almacena_existencias_terceros:
          form_data.capitales?.existencias_terceros,
        tiene_camaras_frigorificas:
          form_data.construccion?.camaras_frigorificas,
      })
      .select()
      .single();

    if (dmFormError) throw dmFormError;

    // Now generate recommendations (simplified example)
    const { data: insurancesData, error: insurancesError } = await supabase
      .from("insurances")
      .select("*")
      .eq("tipo", "danos_materiales");

    if (insurancesError) throw insurancesError;

    // Create recommendations
    const recommendations = [];
    for (const insurance of insurancesData) {
      const { data: recData, error: recError } = await supabase
        .from("recommendations")
        .insert({
          form_id: formData.id,
          insurance_id: insurance.id,
        })
        .select()
        .single();

      if (recError) throw recError;
      recommendations.push(recData);
    }

    return NextResponse.json({
      success: true,
      form_id: formData.id,
      recommendations,
    });
  } catch (error) {
    console.error("Error creating form:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create form" },
      { status: 500 }
    );
  }
}
