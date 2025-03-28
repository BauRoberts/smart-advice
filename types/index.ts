// types/index.ts
// Tipos básicos para sesiones
export type Session = {
  id: string;
  created_at: string;
  expires_at: string;
};

// Tipos para información de contacto
export type ContactInfo = {
  id?: string;
  session_id: string;
  name: string;
  email: string;
  phone: string;
  created_at?: string;
};

// Tipos para empresas
export type EmpresaTipo = "manufactura" | "servicios";

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
};

// Tipos para actividades específicas
export type ManufacturaActivity = {
  producto_consumo_humano: boolean;
  tiene_empleados_tecnicos: boolean;
  producto_final_o_intermedio: string;
  distribucion: string[];
  matriz_en_espana: boolean;
  filiales: string[];
};

export type ServiciosActivity = {
  trabajos_fuera_instalaciones: boolean;
  corte_soldadura: boolean;
  trabajo_equipos_electronicos: boolean;
  empleados_tecnicos: boolean;
};

// Tipos para coberturas
export type Coberturas = {
  exploitation: boolean;
  patronal: boolean;
  productos: boolean;
  trabajos: boolean;
  profesional: boolean;
};

// Tipos para formularios
export type FormType =
  | "responsabilidad_civil"
  | "danos_materiales"
  | "riesgos_adicionales";

export type Form = {
  id?: string;
  session_id: string;
  type: FormType;
  form_data?: Record<string, any>;
  step?: number;
  is_completed?: boolean;
  created_at?: string;
};

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
};

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
};

// Tipos para seguros y recomendaciones
export type Insurance = {
  id: string;
  name: string;
  description?: string;
  coberturas: Record<string, any>;
  ambito_territorial: string[];
  tipo: FormType;
};

export type Recommendation = {
  id?: string;
  form_id: string;
  insurance_id: string;
  created_at?: string;
  insurance?: Insurance;
};

// Tipos existentes...
// (mantener todo el código existente y agregar las nuevas interfaces al final)

export interface Coverage {
  name: string;
  required: boolean;
  condition?: string;
  limit?: string;
  sublimit?: string;
}

export interface CompanyInfo {
  name?: string;
  address?: string;
  activity?: string;
  activityDescription?: string;
  billing?: number;
  employees?: number;
  m2?: number;
  installations_type?: string;
  owner_name?: string;
  owner_cif?: string;
  cif?: string;
  cnae?: string;
}

export interface ConstructionInfo {
  estructura?: string;
  cubierta?: string;
  cerramientos?: string;
}

export interface ProtectionInfo {
  extintores?: boolean;
  bocas_incendio?: boolean;
  deposito_bombeo?: boolean;
  cobertura_total?: boolean;
  columnas_hidrantes?: boolean;
  columnas_hidrantes_tipo?: string;
  deteccion_automatica?: boolean;
  deteccion_zona?: string[];
  rociadores?: boolean;
  rociadores_zona?: string[];
  suministro_agua?: string;
  protecciones_fisicas?: boolean;
  vigilancia_propia?: boolean;
  alarma_conectada?: boolean;
  camaras_circuito?: boolean;
}

export interface CapitalesInfo {
  valor_edificio?: number;
  valor_ajuar?: number;
  valor_existencias?: number;
  valor_equipo_electronico?: number;
  margen_bruto_anual?: number;
  periodo_indemnizacion?: string;
}

export interface DanosInsuranceRecommendation {
  siniestralidad: string;
  type: string;
  companyInfo: CompanyInfo;
  constructionInfo: ConstructionInfo;
  protectionInfo: ProtectionInfo;
  capitalesInfo: CapitalesInfo;
  coverages: Coverage[];
  specialClauses: Coverage[];
}
