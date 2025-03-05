// lib/schemas.ts (actualización parcial - sólo la parte de Responsabilidad Civil)
import { z } from 'zod';

// Company information schema actualizado
export const companySchema = z.object({
  name: z.string().min(1, "El nombre de la empresa es obligatorio"),
  cif: z.string().optional(),
  cnae_code: z.string().optional(),
  activity: z.string().optional(),
  employees_number: z.number().int().positive().optional(),
  billing: z.number().positive().optional(),
  online_invoice: z.boolean().default(false),
  online_invoice_percentage: z.number().min(0).max(100).default(0),
  installations_type: z.string().optional(),
  m2_installations: z.number().positive().optional(),
  almacena_bienes_terceros: z.boolean().default(false),
  vehiculos_terceros_aparcados: z.boolean().default(false),
});

// Esquemas de actividad específicos
const actividadManufacturaSchema = z.object({
  producto_consumo_humano: z.boolean().default(false),
  tiene_empleados_tecnicos: z.boolean().default(false),
  producto_final_o_intermedio: z.string().optional(),
  distribucion: z.array(z.string()).default([]),
  matriz_en_espana: z.boolean().default(true),
  filiales: z.array(z.string()).default([]),
});

const actividadServiciosSchema = z.object({
  trabajos_fuera_instalaciones: z.boolean().default(false),
  corte_soldadura: z.boolean().default(false),
  trabajo_equipos_electronicos: z.boolean().default(false),
  empleados_tecnicos: z.boolean().default(false),
});

// Responsabilidad Civil form schema actualizado
export const responsabilidadCivilSchema = z.object({
  // Company info
  company: companySchema,
  
  // Campos para mantener compatibilidad con la versión anterior
  producto_consumo_humano: z.boolean().default(false),
  distribucion: z.array(z.string()).default([]),
  tiene_empleados_tecnicos: z.boolean().default(false),
  
  // Datos específicos por tipo de empresa
  actividad: z.object({
    manufactura: actividadManufacturaSchema,
    servicios: actividadServiciosSchema
  }),
  
  // Ámbito territorial y coberturas
  ambito_territorial: z.string().min(1, "El ámbito territorial es obligatorio"),
  coberturas_solicitadas: z.object({
    exploitation: z.boolean().default(false),
    patronal: z.boolean().default(false),
    productos: z.boolean().default(false),
    trabajos: z.boolean().default(false),
    profesional: z.boolean().default(false),
  }),
  actividad_manufactura: z.boolean(),
});

export type ResponsabilidadCivilFormData = z.infer<typeof responsabilidadCivilSchema>;

// lib/schemas.ts
// Add this schema to your existing schemas file

export const danosMaterialesSchema = z.object({
    // Step 1: Datos relativos a tu empresa
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
    
    // Step 2: Capital asegurado
    capital: z.object({
      valor_edificio: z.number().positive().optional(),
      valor_ajuar: z.number().positive().optional(),
      valor_existencias: z.number().positive().optional(),
      existencias_terceros: z.boolean().default(false),
      existencias_propias_terceros: z.boolean().default(false),
      valor_equipo_electronico: z.number().positive().optional(),
      margen_bruto_anual: z.number().positive().optional(),
    }),
    
    // Step 3: Características constructivas
    construccion: z.object({
      cubierta: z.string().optional(),
      cerramientos: z.string().optional(),
      estructura: z.string().optional(),
      camaras_frigorificas: z.boolean().default(false),
      placas_solares: z.boolean().default(false),
    }),
    
    // Step 4: Protección contra incendios
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
    
    // Step 5: Protección contra robo
    proteccion_robo: z.object({
      protecciones_fisicas: z.boolean().default(false),
      vigilancia_propia: z.boolean().default(false),
      alarma_conectada: z.boolean().default(false),
      camaras_circuito: z.boolean().default(false),
    }),
    
    // Step 6: Siniestralidad
    siniestralidad: z.object({
      siniestros_ultimos_3_anos: z.boolean().default(false),
    }),
  });
  
  export type DanosMaterialesFormData = z.infer<typeof danosMaterialesSchema>;