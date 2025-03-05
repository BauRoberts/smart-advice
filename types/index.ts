// Session and company types
export type Session = {
    id: string;
    created_at: string;
    expires_at: string;
  }
  
  export type Company = {
    id?: string;
    session_id: string;
    name: string;
    cif?: string;
    activity?: string;
    employees_number?: number;
    billing?: number;
    online_invoice?: boolean;
    installations_type?: string;
    m2_installations?: number;
    almacena_bienes_terceros?: boolean;
    vehiculos_terceros_aparcados?: boolean;
    created_at?: string;
  }
  
  // Form types
  export type FormType = "responsabilidad_civil" | "danos_materiales" | "riesgos_adicionales";
  
  export type Form = {
    id?: string;
    session_id: string;
    type: FormType;
    created_at?: string;
  }
  
  export type ResponsabilidadCivilForm = {
    id?: string;
    form_id: string;
    actividad_manufactura?: boolean;
    producto_consumo_humano?: boolean;
    distribucion?: string[];
    tiene_empleados_tecnicos?: boolean;
    ambito_territorial?: string;
    coberturas_solicitadas?: Record<string, boolean>;
  }
  
  export type DanosMaterialesForm = {
    id?: string;
    form_id: string;
    valor_edificio?: number;
    valor_ajuar?: number;
    proteccion_incendios?: Record<string, boolean>;
    proteccion_robo?: Record<string, boolean>;
    siniestralidad?: Record<string, any>;
    almacena_existencias_terceros?: boolean;
    tiene_camaras_frigorificas?: boolean;
  }
  
  // Insurance and recommendation types
  export type Insurance = {
    id: string;
    name: string;
    description?: string;
    coberturas: Record<string, any>;
    ambito_territorial: string[];
    tipo: FormType;
  }
  
  export type Recommendation = {
    id?: string;
    form_id: string;
    insurance_id: string;
    created_at?: string;
  }