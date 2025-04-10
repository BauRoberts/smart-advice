"use client";

import FormSummaryStep from "./FormSummaryStep";
import { useDanosFormContext } from "@/contexts/DanosFormContext";
import { FormData } from "@/contexts/FormContext"; // Importamos el tipo FormData del contexto general

interface DanosResumenStepProps {
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export default function DanosResumenStep({
  onSubmit,
  onBack,
  isSubmitting,
}: DanosResumenStepProps) {
  // Utilizamos el contexto de formulario de daños para acceder a los datos
  const { formData: danosFormData } = useDanosFormContext();

  // Creamos un adaptador que convierta danosFormData al formato esperado por FormSummaryStep
  const adaptedFormData: FormData = {
    // Campos básicos requeridos por FormData
    form_type: "danos-materiales",
    step: danosFormData.step || 1,

    // Adaptar contacto a contact
    contact: {
      name: danosFormData.contacto?.name || "",
      email: danosFormData.contacto?.email || "",
      phone: danosFormData.contacto?.phone || "",
    },

    // Adaptar empresa a company
    company: {
      name: danosFormData.empresa?.actividad || "",
      cnae_code: danosFormData.empresa?.cnae_code || "",
      activity: danosFormData.empresa?.actividad || "",
      employees_number: danosFormData.empresa?.num_trabajadores || 0,
      billing: danosFormData.empresa?.facturacion || 0,
      online_invoice: danosFormData.empresa?.facturacion_online || false,
      online_invoice_percentage:
        danosFormData.empresa?.facturacion_online_porcentaje || 0,
      m2_installations: danosFormData.empresa?.metros_cuadrados || 0,
    },

    // Información general (puede estar vacío para daños, pero necesitamos tenerlo)
    informacion_general: {
      name: danosFormData.empresa?.actividad || "",
      activity: danosFormData.empresa?.actividad || "",
      cnae_code: danosFormData.empresa?.cnae_code || "",
      employees_number: danosFormData.empresa?.num_trabajadores || 0,
      billing: danosFormData.empresa?.facturacion || 0,
      online_invoice: danosFormData.empresa?.facturacion_online || false,
      online_invoice_percentage:
        danosFormData.empresa?.facturacion_online_porcentaje || 0,
      m2_installations: danosFormData.empresa?.metros_cuadrados || 0,
    },

    // Valores por defecto para campos RC que no aplican a daños
    empresaTipo: null,
    actividad: { manufactura: {}, servicios: {} },
    preguntas_generales: {},
    ambito_territorial: "",

    // Adaptar capitales
    capitales_y_coberturas: {
      valor_edificio: danosFormData.capitales?.valor_edificio || 0,
      valor_ajuar: danosFormData.capitales?.valor_ajuar || 0,
      valor_existencias: danosFormData.capitales?.valor_existencias || 0,
      valor_equipo_electronico:
        danosFormData.capitales?.valor_equipo_electronico || 0,
      margen_bruto_anual: danosFormData.capitales?.margen_bruto_anual || 0,
      existencias_terceros:
        danosFormData.capitales?.existencias_terceros || false,
      existencias_propias_terceros:
        danosFormData.capitales?.existencias_propias_terceros || false,
      responsabilidad_civil: true, // Indicar que tiene RC en daños materiales
      coberturas_rc: {
        explotacion: true,
        patronal: true,
        productos: false,
        inmobiliaria: true,
        locativa: true,
      },
    },

    // Adaptar construcción
    construccion: {
      tipo_construccion: "Completa", // Valor por defecto
      material_estructuras: danosFormData.construccion?.estructura || "",
      material_cubierta: danosFormData.construccion?.cubierta || "",
      material_cerramientos_ext: danosFormData.construccion?.cerramientos || "",
      falsos_techos: false,
      material_falsos_techos: "",
    },

    // Adaptar protección incendios
    proteccion_incendios: {
      extintores: danosFormData.proteccion_incendios?.extintores || false,
      bocas_incendio:
        danosFormData.proteccion_incendios?.bocas_incendio || false,
      deposito_bombeo:
        danosFormData.proteccion_incendios?.deposito_bombeo || false,
      cobertura_total:
        danosFormData.proteccion_incendios?.cobertura_total || false,
      columnas_hidrantes:
        danosFormData.proteccion_incendios?.columnas_hidrantes || false,
      columnas_hidrantes_tipo:
        danosFormData.proteccion_incendios?.columnas_hidrantes_tipo ||
        undefined,
      deteccion_automatica:
        danosFormData.proteccion_incendios?.deteccion_automatica || false,
      deteccion_zona: danosFormData.proteccion_incendios?.deteccion_zona || [],
      rociadores: danosFormData.proteccion_incendios?.rociadores || false,
      rociadores_zona:
        danosFormData.proteccion_incendios?.rociadores_zona || [],
      suministro_agua:
        danosFormData.proteccion_incendios?.suministro_agua || "",
    },

    // Adaptar protección robo
    proteccion_robo: {
      protecciones_fisicas:
        danosFormData.proteccion_robo?.protecciones_fisicas || false,
      vigilancia_propia:
        danosFormData.proteccion_robo?.vigilancia_propia || false,
      alarma_conectada:
        danosFormData.proteccion_robo?.alarma_conectada || false,
      camaras_circuito:
        danosFormData.proteccion_robo?.camaras_circuito || false,
    },

    // Adaptar siniestralidad
    siniestralidad: {
      has_siniestros:
        danosFormData.siniestralidad?.siniestros_ultimos_3_anos || false,
      numero_siniestros: 0,
      importe_total: 0,
      causa_siniestros: danosFormData.siniestralidad?.siniestros_detalles || "",
    },

    // Coberturas solicitadas (estructura requerida por FormData)
    coberturas_solicitadas: {
      exploitation: true,
      patronal: true,
      productos: false,
      trabajos: false,
      profesional: false,
    },
  };

  // Utilizamos el componente FormSummaryStep con el tipo "danos"
  return (
    <FormSummaryStep
      onSubmit={onSubmit}
      onBack={onBack}
      formData={adaptedFormData}
      isSubmitting={isSubmitting}
      formType="danos"
    />
  );
}
