// app/api/forms/responsabilidad-civil/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      session_id, 
      actividad_manufactura,
      form_data
    } = body;
    
    if (!session_id) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }
    
    // Primero, crear un registro en la tabla forms
    const { data: formData, error: formError } = await supabase
      .from('forms')
      .insert({
        session_id,
        type: 'responsabilidad_civil',
        form_data,
        is_completed: true,
        step: 5
      })
      .select()
      .single();
    
    if (formError) throw formError;
    
    // Para mantener compatibilidad con el sistema actual, también insertamos en form_responsabilidad_civil
    const { data: rcFormData, error: rcFormError } = await supabase
      .from('form_responsabilidad_civil')
      .insert({
        form_id: formData.id,
        actividad_manufactura,
        actividad: form_data.actividad,
        ambito_territorial: form_data.ambito_territorial,
        coberturas_solicitadas: form_data.coberturas_solicitadas,
        empresa_tipo: actividad_manufactura ? 'manufactura' : 'servicios',
        distribucion: form_data.actividad.manufactura?.distribucion || []
      })
      .select()
      .single();
    
    if (rcFormError) throw rcFormError;
    
    // Generar recomendaciones
    const { data: insurancesData, error: insurancesError } = await supabase
      .from('insurances')
      .select('*')
      .eq('tipo', 'responsabilidad_civil')
      .contains('ambito_territorial', [form_data.ambito_territorial]);
    
    if (insurancesError) throw insurancesError;
    
    // Crear recomendaciones
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