// app/api/forms/responsabilidad-civil/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      session_id, 
      company, // This is already saved, so we don't need it
      actividad_manufactura,
      producto_consumo_humano,
      distribucion,
      tiene_empleados_tecnicos,
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
    
    // Then, create the specific form data
    const { data: rcFormData, error: rcFormError } = await supabase
      .from('form_responsabilidad_civil')
      .insert({
        form_id: formData.id,
        actividad_manufactura,
        producto_consumo_humano,
        distribucion,
        tiene_empleados_tecnicos,
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