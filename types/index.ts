// types/index.ts
// Tipos básicos para sesiones
export type Session = {
  id: string;
  created_at: string;
  expires_at: string;
}

// Tipos para información de contacto
export type ContactInfo = {
  id?: string;
  session_id: string;
  name: string;
  email: string;
  phone: string;
  created_at?: string;
}

// Tipos para empresas
export type EmpresaTipo = 'manufactura' | 'servicios';

export type Company = {
  id?: string;
  session_id: string;
  name: string;
  cif?: string;
  cnae_code?: string;
  activity?: string;
  employees_number?: number;
  billing?: number;
  online_invoice?: boolean;
  online_invoice_percentage?: number;
  installations_type?: string;
  m2_installations?: number;
  almacena_bienes_terceros?: boolean;
  vehiculos_terceros_aparcados?: boolean;
  tipo_empresa?: EmpresaTipo;
  created_at?: string;
}

// Tipos para actividades específicas
export type ManufacturaActivity = {
  producto_consumo_humano: boolean;
  tiene_empleados_tecnicos: boolean;
  producto_final_o_intermedio: string;
  distribucion: string[];
  matriz_en_espana: boolean;
  filiales: string[];
}

export type ServiciosActivity = {
  trabajos_fuera_instalaciones: boolean;
  corte_soldadura: boolean;
  trabajo_equipos_electronicos: boolean;
  empleados_tecnicos: boolean;
}

// Tipos para coberturas
export type Coberturas = {
  exploitation: boolean;
  patronal: boolean;
  productos: boolean;
  trabajos: boolean;
  profesional: boolean;
}

// Tipos para formularios
export type FormType = "responsabilidad_civil" | "danos_materiales" | "riesgos_adicionales";

export type Form = {
  id?: string;
  session_id: string;
  type: FormType;
  form_data?: Record<string, any>;
  step?: number;
  is_completed?: boolean;
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
  coberturas_solicitadas?: Coberturas;
  actividad?: {
    manufactura?: ManufacturaActivity;
    servicios?: ServiciosActivity;
  };
  empresa_tipo?: EmpresaTipo;
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

// Tipos para seguros y recomendaciones
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
  insurance?: Insurance;
}