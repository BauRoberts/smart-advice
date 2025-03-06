// app/api/companies/route.ts (actualización)
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      session_id, 
      name, 
      cnae_code, 
      activity,
      employees_number,
      billing,
      online_invoice,
      online_invoice_percentage,
      installations_type,
      m2_installations,
      almacena_bienes_terceros,
      vehiculos_terceros_aparcados,
      tipo_empresa
    } = body;
    
    if (!session_id) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }
    
    // Verificar si ya existe una empresa para esta sesión
    const { data: existingCompany, error: checkError } = await supabase
      .from('companies')
      .select('id')
      .eq('session_id', session_id)
      .maybeSingle();
      
    if (checkError) throw checkError;
    
    let companyData;
    
    if (existingCompany) {
      // Actualizar empresa existente
      const { data, error } = await supabase
        .from('companies')
        .update({
          name,
          cnae_code,
          activity,
          employees_number,
          billing,
          online_invoice,
          online_invoice_percentage,
          installations_type,
          m2_installations,
          almacena_bienes_terceros,
          vehiculos_terceros_aparcados,
          tipo_empresa
        })
        .eq('id', existingCompany.id)
        .select()
        .single();
      
      if (error) throw error;
      companyData = data;
    } else {
      // Crear nueva empresa
      const { data, error } = await supabase
        .from('companies')
        .insert({
          session_id,
          name,
          cnae_code,
          activity,
          employees_number,
          billing,
          online_invoice,
          online_invoice_percentage,
          installations_type,
          m2_installations,
          almacena_bienes_terceros,
          vehiculos_terceros_aparcados,
          tipo_empresa
        })
        .select()
        .single();
      
      if (error) throw error;
      companyData = data;
    }
    
    return NextResponse.json({ 
      success: true, 
      id: companyData.id,
      ...companyData
    });
  } catch (error) {
    console.error('Error creating/updating company:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create/update company' },
      { status: 500 }
    );
  }
}