// app/api/test-data/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Step 1: Create a session
    const { data: sessionData, error: sessionError } = await supabase
      .from('sessions')
      .insert({})
      .select()
      .single();
    
    if (sessionError) throw sessionError;
    
    const sessionId = sessionData.id;
    
    // Step 2: Create a company
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .insert({
        session_id: sessionId,
        name: 'Empresa Test',
        cif: 'B12345678',
        activity: 'Software Development',
        employees_number: 25,
        billing: 1200000,
        online_invoice: true,
        installations_type: 'inquilino',
        m2_installations: 500,
        almacena_bienes_terceros: false,
        vehiculos_terceros_aparcados: false
      })
      .select()
      .single();
    
    if (companyError) throw companyError;
    
    // Step 3: Create a Responsabilidad Civil form
    const { data: rcFormData, error: rcFormError } = await supabase
      .from('forms')
      .insert({
        session_id: sessionId,
        type: 'responsabilidad_civil'
      })
      .select()
      .single();
    
    if (rcFormError) throw rcFormError;
    
    // Step 4: Create RC form details
    const { data: rcDetailsData, error: rcDetailsError } = await supabase
      .from('form_responsabilidad_civil')
      .insert({
        form_id: rcFormData.id,
        actividad_manufactura: true,
        producto_consumo_humano: false,
        distribucion: ['España', 'UE'],
        tiene_empleados_tecnicos: true,
        ambito_territorial: 'España',
        coberturas_solicitadas: {
          exploitation: true,
          patronal: true,
          productos: true,
          trabajos: false,
          profesional: false
        }
      })
      .select()
      .single();
    
    if (rcDetailsError) throw rcDetailsError;
    
    // Step 5: Create a Daños Materiales form
    const { data: dmFormData, error: dmFormError } = await supabase
      .from('forms')
      .insert({
        session_id: sessionId,
        type: 'danos_materiales'
      })
      .select()
      .single();
    
    if (dmFormError) throw dmFormError;
    
    // Step 6: Create DM form details
    const { data: dmDetailsData, error: dmDetailsError } = await supabase
      .from('form_danos_materiales')
      .insert({
        form_id: dmFormData.id,
        valor_edificio: 800000,
        valor_ajuar: 150000,
        proteccion_incendios: {
          extintores: true,
          bocas_incendio: true,
          deposito_bombeo: false,
          cobertura_total: false,
          columnas_hidrantes: false,
          deteccion_automatica: true,
          rociadores: false,
          suministro_agua: true
        },
        proteccion_robo: {
          protecciones_fisicas: true,
          vigilancia_propia: false,
          alarma_conectada: true,
          camaras_circuito: true
        },
        siniestralidad: {
          ultimos_3_anios: false
        },
        almacena_existencias_terceros: false,
        tiene_camaras_frigorificas: false
      })
      .select()
      .single();
    
    if (dmDetailsError) throw dmDetailsError;
    
    // Step 7: Create recommendations for both forms
    const { data: insurancesRC, error: insurancesRCError } = await supabase
      .from('insurances')
      .select('id')
      .eq('tipo', 'responsabilidad_civil');
    
    if (insurancesRCError) throw insurancesRCError;
    
    const { data: insurancesDM, error: insurancesDMError } = await supabase
      .from('insurances')
      .select('id')
      .eq('tipo', 'danos_materiales');
    
    if (insurancesDMError) throw insurancesDMError;
    
    // Create RC recommendations
    for (const insurance of insurancesRC) {
      await supabase
        .from('recommendations')
        .insert({
          form_id: rcFormData.id,
          insurance_id: insurance.id
        });
    }
    
    // Create DM recommendations
    for (const insurance of insurancesDM) {
      await supabase
        .from('recommendations')
        .insert({
          form_id: dmFormData.id,
          insurance_id: insurance.id
        });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test data created successfully',
      sessionId,
      forms: {
        responsabilidadCivil: rcFormData.id,
        danosMateriales: dmFormData.id
      }
    });
  } catch (error) {
    console.error('Error creating test data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create test data', details: error },
      { status: 500 }
    );
  }
}