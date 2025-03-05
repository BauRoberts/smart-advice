// app/api/forms/danos-materiales/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      session_id,
      empresa,
      capital,
      construccion,
      proteccion_incendios,
      proteccion_robo,
      siniestralidad
    } = body;
    
    if (!session_id) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }
    
    // First, check if company exists
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('session_id', session_id)
      .maybeSingle();
    
    let companyId;
    
    // If company doesn't exist, create it
    if (!companyData) {
      const { data: newCompany, error: newCompanyError } = await supabase
        .from('companies')
        .insert({
          session_id,
          name: empresa.actividad || 'Sin nombre',
          activity: empresa.actividad,
          billing: empresa.facturacion,
          employees_number: empresa.num_trabajadores,
          online_invoice: empresa.facturacion_online,
          installations_type: empresa.instalaciones_tipo,
          m2_installations: empresa.metros_cuadrados,
          almacena_bienes_terceros: empresa.almacena_bienes_terceros,
          vehiculos_terceros_aparcados: empresa.vehiculos_terceros
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
      .from('forms')
      .insert({
        session_id,
        type: 'danos_materiales'
      })
      .select()
      .single();
    
    if (formError) throw formError;
    
    // Create specific form data
    const { data: dmFormData, error: dmFormError } = await supabase
      .from('form_danos_materiales')
      .insert({
        form_id: formData.id,
        valor_edificio: capital.valor_edificio,
        valor_ajuar: capital.valor_ajuar,
        proteccion_incendios: proteccion_incendios,
        proteccion_robo: proteccion_robo,
        siniestralidad: { 
          ultimos_3_anios: siniestralidad.siniestros_ultimos_3_anos 
        },
        almacena_existencias_terceros: capital.existencias_terceros,
        tiene_camaras_frigorificas: construccion.camaras_frigorificas
      })
      .select()
      .single();
    
    if (dmFormError) throw dmFormError;
    
    // Now generate recommendations (simplified example)
    const { data: insurancesData, error: insurancesError } = await supabase
      .from('insurances')
      .select('*')
      .eq('tipo', 'danos_materiales');
    
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