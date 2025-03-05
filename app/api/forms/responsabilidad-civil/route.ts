// app/api/forms/responsabilidad-civil/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      session_id, 
      empresa_tipo, // 'manufactura' o 'servicios'
      company, // This is already saved, so we don't need it
      actividad,
      ambito_territorial,
      coberturas_solicitadas,
    } = body;
    
    if (!session_id) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }
    
    // First, create a form entry
    const { data: formData, error: formError } = await supabase
      .from('forms')
      .insert({
        session_id,
        type: 'responsabilidad_civil'
      })
      .select()
      .single();
    
    if (formError) throw formError;
    
    // Prepare specific activity data based on company type
    const activityData = {
      ...((empresa_tipo === 'manufactura') ? {
        producto_consumo_humano: actividad.manufactura.producto_consumo_humano,
        tiene_empleados_tecnicos: actividad.manufactura.tiene_empleados_tecnicos,
        producto_final_o_intermedio: actividad.manufactura.producto_final_o_intermedio,
        distribucion: actividad.manufactura.distribucion,
        matriz_en_espana: actividad.manufactura.matriz_en_espana,
        filiales: actividad.manufactura.filiales,
        empresa_tipo: 'manufactura'
      } : {
        trabajos_fuera_instalaciones: actividad.servicios.trabajos_fuera_instalaciones,
        corte_soldadura: actividad.servicios.corte_soldadura,
        trabajo_equipos_electronicos: actividad.servicios.trabajo_equipos_electronicos,
        empleados_tecnicos: actividad.servicios.empleados_tecnicos,
        empresa_tipo: 'servicios'
      })
    };
    
    // Then, create the specific form data
    const { data: rcFormData, error: rcFormError } = await supabase
      .from('form_responsabilidad_civil')
      .insert({
        form_id: formData.id,
        actividad: activityData,
        ambito_territorial,
        coberturas_solicitadas
      })
      .select()
      .single();
    
    if (rcFormError) throw rcFormError;
    
    // Now generate recommendations based on form data
    const { data: insurancesData, error: insurancesError } = await supabase
      .from('insurances')
      .select('*')
      .eq('tipo', 'responsabilidad_civil')
      .contains('ambito_territorial', [ambito_territorial]);
    
    if (insurancesError) throw insurancesError;
    
    // Create recommendations
    const recommendations = [];
    for (const insurance of insurancesData) {
      const { data: recData, error: recError } = await supabase
        .from('recommendations')
        .insert({
          form_id: formData.id,
          insurance_id: insurance.id
        })
        .select()
        .single();
      
      if (recError) throw recError;
      recommendations.push(recData);
    }
    
    return NextResponse.json({ 
      success: true, 
      form_id: formData.id,
      recommendations
    });
  } catch (error) {
    console.error('Error creating form:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create form' },
      { status: 500 }
    );
  }
}