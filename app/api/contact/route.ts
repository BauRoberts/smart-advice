// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone } = body;
    
    // Primero crear o recuperar una sesión
    let sessionId;
    const existingSession = request.headers.get('x-session-id');
    
    if (existingSession) {
      sessionId = existingSession;
    } else {
      // Crear nueva sesión
      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .insert({})
        .select()
        .single();
      
      if (sessionError) throw sessionError;
      sessionId = sessionData.id;
    }
    
    // Guardar información de contacto
    const { data: contactData, error: contactError } = await supabase
      .from('contact_info')
      .insert({
        session_id: sessionId,
        name,
        email,
        phone
      })
      .select()
      .single();
    
    if (contactError) throw contactError;
    
    return NextResponse.json({ 
      success: true, 
      session_id: sessionId,
      contact_id: contactData.id 
    });
  } catch (error) {
    console.error('Error saving contact info:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save contact information' },
      { status: 500 }
    );
  }
}