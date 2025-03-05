// app/api/companies/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { session_id, cnae_code, ...companyData } = body;
    
    if (!session_id) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabase
      .from('companies')
      .insert({
        session_id,
        cnae_code, // Agregamos el código CNAE
        ...companyData
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ 
      success: true, 
      id: data.id,
      ...data
    });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create company' },
      { status: 500 }
    );
  }
}