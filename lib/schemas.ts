// lib/schemas.ts
import { z } from 'zod';

// Schema para los datos de contacto
export const contactSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Por favor, introduce un email válido"),
  phone: z.string().regex(/^[0-9]{9}$/, "El teléfono debe tener 9 dígitos"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// Schema para los datos de la empresa
export const companySchema = z.object({
  name: z.string().min(2, "El nombre de la empresa es obligatorio"),
  cnae_code: z.string().min(1, "El código CNAE es obligatorio"),
  activity: z.string().optional(),
  employees_number: z.number().int().positive("El número de empleados debe ser positivo"),
  billing: z.number().positive("La facturación anual debe ser positiva"),
  online_invoice: z.boolean().default(false),
  online_invoice_percentage: z.number().min(0).max(100).default(0),
  installations_type: z.string().min(1, "El tipo de instalaciones es obligatorio"),
  m2_installations: z.number().positive("Los metros cuadrados deben ser positivos"),
  almacena_bienes_terceros: z.boolean().default(false),
  vehiculos_terceros_aparcados: z.boolean().default(false),
});

export type CompanyFormData = z.infer<typeof companySchema>;

// Tipo para el tipo de empresa (manufactura o servicios)
export const empresaTipoSchema = z.enum(['manufactura', 'servicios']);
export type EmpresaTipo = z.infer<typeof empresaTipoSchema>;

// Schema para los datos de actividad de manufactura
export const manufacturaSchema = z.object({
  producto_consumo_humano: z.boolean().default(false),
  tiene_empleados_tecnicos: z.boolean().default(false),
  producto_final_o_intermedio: z.string().min(1, "Debes seleccionar el tipo de producto"),
  distribucion: z.array(z.string()).min(1, "Selecciona al menos una opción de distribución"),
  matriz_en_espana: z.boolean().default(true),
  filiales: z.array(z.string()).default([]),
});

export type ManufacturaFormData = z.infer<typeof manufacturaSchema>;

// Schema para los datos de actividad de servicios
export const serviciosSchema = z.object({
  trabajos_fuera_instalaciones: z.boolean().default(false),
  corte_soldadura: z.boolean().default(false),
  trabajo_equipos_electronicos: z.boolean().default(false),
  empleados_tecnicos: z.boolean().default(false),
});

export type ServiciosFormData = z.infer<typeof serviciosSchema>;

// Schema para ámbito territorial y coberturas
export const coberturasSchema = z.object({
  ambito_territorial: z.string().min(1, "Debes seleccionar un ámbito territorial"),
  coberturas_solicitadas: z.object({
    exploitation: z.boolean().default(false),
    patronal: z.boolean().default(false),
    productos: z.boolean().default(false),
    trabajos: z.boolean().default(false),
    profesional: z.boolean().default(false),
  }).refine((data) => {
    // Al menos una cobertura debe estar seleccionada
    return Object.values(data).some(value => value === true);
  }, {
    message: "Debes seleccionar al menos una cobertura",
    path: ["root"],
  }),
});

export type CoberturasFormData = z.infer<typeof coberturasSchema>;

// Schema completo para Responsabilidad Civil
export const responsabilidadCivilSchema = z.object({
  contact: contactSchema,
  company: companySchema,
  empresaTipo: empresaTipoSchema,
  actividad: z.object({
    manufactura: manufacturaSchema.optional(),
    servicios: serviciosSchema.optional(),
  }),
  ambito_territorial: z.string().min(1, "El ámbito territorial es obligatorio"),
  coberturas_solicitadas: z.object({
    exploitation: z.boolean().default(false),
    patronal: z.boolean().default(false),
    productos: z.boolean().default(false),
    trabajos: z.boolean().default(false),
    profesional: z.boolean().default(false),
  }),
});

export type ResponsabilidadCivilFormData = z.infer<typeof responsabilidadCivilSchema>;

// Mantenemos el schema de Daños Materiales para compatibilidad
export const danosMaterialesSchema = z.object({
  empresa: z.object({
    actividad: z.string().optional(),
    facturacion: z.number().positive().optional(),
    num_trabajadores: z.number().int().positive().optional(),
    facturacion_online: z.boolean().default(false),
    instalaciones_tipo: z.string().optional(),
    metros_cuadrados: z.number().positive().optional(),
    almacena_bienes_terceros: z.boolean().default(false),
    existencias_intemperie: z.boolean().default(false),
    vehiculos_terceros: z.boolean().default(false),
    bienes_empleados: z.boolean().default(false),
    dinero_caja_fuerte: z.number().optional(),
    dinero_fuera_caja: z.number().optional(),
    clausula_todo_riesgo: z.boolean().default(false),
  }),
  
  capital: z.object({
    valor_edificio: z.number().positive().optional(),
    valor_ajuar: z.number().positive().optional(),
    valor_existencias: z.number().positive().optional(),
    existencias_terceros: z.boolean().default(false),
    existencias_propias_terceros: z.boolean().default(false),
    valor_equipo_electronico: z.number().positive().optional(),
    margen_bruto_anual: z.number().positive().optional(),
  }),
  
  construccion: z.object({
    cubierta: z.string().optional(),
    cerramientos: z.string().optional(),
    estructura: z.string().optional(),
    camaras_frigorificas: z.boolean().default(false),
    placas_solares: z.boolean().default(false),
  }),
  
  proteccion_incendios: z.object({
    extintores: z.boolean().default(false),
    bocas_incendio: z.boolean().default(false),
    deposito_bombeo: z.boolean().default(false),
    cobertura_total: z.boolean().default(false),
    columnas_hidrantes: z.boolean().default(false),
    deteccion_automatica: z.boolean().default(false),
    rociadores: z.boolean().default(false),
    suministro_agua: z.boolean().default(false),
  }),
  
  proteccion_robo: z.object({
    protecciones_fisicas: z.boolean().default(false),
    vigilancia_propia: z.boolean().default(false),
    alarma_conectada: z.boolean().default(false),
    camaras_circuito: z.boolean().default(false),
  }),
  
  siniestralidad: z.object({
    siniestros_ultimos_3_anos: z.boolean().default(false),
  }),
});
  
export type DanosMaterialesFormData = z.infer<typeof danosMaterialesSchema>;