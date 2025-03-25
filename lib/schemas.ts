// lib/schemas.ts - Versión actualizada

import { z } from "zod";

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
  localizacion_nave: z.string().optional(),
  employees_number: z
    .number()
    .int()
    .positive("El número de empleados debe ser positivo"),
  billing: z.number().positive("La facturación anual debe ser positiva"),
  online_invoice: z.boolean().default(false),
  online_invoice_percentage: z.number().min(0).max(100).default(0),
  installations_type: z
    .string()
    .min(1, "El tipo de instalaciones es obligatorio"),
  propietario_nombre: z.string().optional(),
  propietario_cif: z.string().optional(),
  m2_installations: z
    .number()
    .positive("Los metros cuadrados deben ser positivos"),
  tiene_placas_solares: z.boolean().default(false),
  placas_autoconsumo: z.boolean().default(false),
  placas_venta_red: z.boolean().default(false),
  // Detalles de actividad
  manufactures: z.boolean().default(false),
  markets: z.boolean().default(false),
  provides_services: z.boolean().default(false),
  almacenamiento: z.boolean().default(false),
  diseno: z.boolean().default(false),
  product_service_types: z.string().optional(),
  industry_types: z.string().optional(),
  // Campos comunes para todos los formularios
  almacena_bienes_terceros: z.boolean().default(false),
  vehiculos_terceros_aparcados: z.boolean().default(false),
});

export type CompanyFormData = z.infer<typeof companySchema>;

// Tipo para el tipo de empresa (manufactura o servicios)
export const empresaTipoSchema = z.enum(["manufactura", "servicios"]);
export type EmpresaTipo = z.infer<typeof empresaTipoSchema>;

// Schema para los datos de actividad de manufactura
export const manufacturaSchema = z.object({
  producto_consumo_humano: z.boolean().default(false),
  producto_contacto_humano: z.boolean().default(false),
  tiene_empleados_tecnicos: z.boolean().default(false),
  producto_final_o_intermedio: z
    .string()
    .min(1, "Debes seleccionar el tipo de producto"),
  distribucion: z
    .array(z.string())
    .min(1, "Selecciona al menos una opción de distribución"),
  facturacion_por_region: z.record(z.string(), z.number()).optional(),
  matriz_en_espana: z.boolean().default(true),
  filiales: z.array(z.string()).default([]),
  considerar_gastos_retirada: z.boolean().default(false),
});

export type ManufacturaFormData = z.infer<typeof manufacturaSchema>;

// Schema para los datos de actividad de servicios
export const serviciosSchema = z.object({
  trabajos_fuera_instalaciones: z.boolean().default(false),
  corte_soldadura: z.boolean().default(false),
  trabajo_equipos_electronicos: z.boolean().default(false),
  empleados_tecnicos: z.boolean().default(false),
  trabajos_subcontratistas: z.boolean().default(false),
  afecta_edificios_vecinos: z.boolean().default(false),
  afecta_instalaciones_subterraneas: z.boolean().default(false),
  trabajos_bienes_preexistentes: z.boolean().default(false),
});

export type ServiciosFormData = z.infer<typeof serviciosSchema>;

// Schema para preguntas generales
export const preguntasGeneralesSchema = z.object({
  filiales_extranjero: z.boolean().default(false),
  ubicacion_filiales: z.array(z.string()).default([]),
  contaminacion_accidental: z.boolean().default(false),
  responsabilidad_perjuicios_patrimoniales: z.boolean().default(false),
  participacion_ferias: z.boolean().default(false),
  cubre_bienes_empleados: z.boolean().default(false),
  siniestros_ultimos_3_anos: z.boolean().default(false),
  siniestros: z
    .array(
      z.object({
        causa: z.string(),
        importe: z.number(),
        fecha: z.string(),
      })
    )
    .default([]),
});

export type PreguntasGeneralesFormData = z.infer<
  typeof preguntasGeneralesSchema
>;

// Schema para ámbito territorial y coberturas
export const coberturasSchema = z.object({
  ambito_territorial: z
    .string()
    .min(1, "Debes seleccionar un ámbito territorial"),
  coberturas_solicitadas: z
    .object({
      exploitation: z.boolean().default(false),
      patronal: z.boolean().default(false),
      productos: z.boolean().default(false),
      trabajos: z.boolean().default(false),
      profesional: z.boolean().default(false),
    })
    .refine(
      (data) => {
        // Al menos una cobertura debe estar seleccionada
        return Object.values(data).some((value) => value === true);
      },
      {
        message: "Debes seleccionar al menos una cobertura",
        path: ["root"],
      }
    ),
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
  preguntas_generales: preguntasGeneralesSchema.optional(), // Añadir esta línea
  ambito_territorial: z.string().min(1, "El ámbito territorial es obligatorio"),
  coberturas_solicitadas: z.object({
    exploitation: z.boolean().default(false),
    patronal: z.boolean().default(false),
    productos: z.boolean().default(false),
    trabajos: z.boolean().default(false),
    profesional: z.boolean().default(false),
  }),
});

export type ResponsabilidadCivilFormData = z.infer<
  typeof responsabilidadCivilSchema
>;

// Mantenemos el schema de Daños Materiales para compatibilidad
export const danosMaterialesSchema = z.object({
  // [El resto del esquema se mantiene igual]
});

export type DanosMaterialesFormData = z.infer<typeof danosMaterialesSchema>;
