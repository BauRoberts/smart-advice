// contexts/FormContext.tsx
"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  getOrCreateTempSession,
  getTempSessionId,
  convertTempToPermanentSession,
  createSession,
} from "@/lib/session";
import { toast } from "@/components/ui/toast";

// Define types
export type FormType =
  | "responsabilidad_civil"
  | "danos_materiales"
  | "riesgos_adicionales";

export interface ContactData {
  name: string;
  email: string;
  phone: string;
  privacyPolicy: boolean;
}

export interface CompanyData {
  name: string;
  cnae_code: string;
  activity?: string;
  activity_description?: string;
  employees_number: number;
  billing: number;
  online_invoice: boolean;
  online_invoice_percentage: number;
  installations_type: string;
  m2_installations: number;
  manufactures?: boolean;
  markets?: boolean;
  provides_services?: boolean;
  product_service_types?: string;
  industry_types?: string;
  almacena_bienes_terceros: boolean;
  vehiculos_terceros_aparcados: boolean;
  existencias_intemperie?: boolean;
  bienes_empleados?: boolean;
  dinero_caja_fuerte?: number;
  dinero_fuera_caja?: number;
  clausula_todo_riesgo?: boolean;
}

export interface FormData {
  form_type: FormType;
  session_id?: string;
  step: number;
  contact: ContactData;
  company: CompanyData;
  empresaTipo: "manufactura" | "servicios" | null;
  actividad: {
    manufactura?: {
      producto_consumo_humano: boolean;
      tiene_empleados_tecnicos: boolean;
      producto_final_o_intermedio: string;
      distribucion: string[];
      matriz_en_espana: boolean;
      filiales: string[];
    };
    servicios?: {
      trabajos_fuera_instalaciones: boolean;
      corte_soldadura: boolean;
      trabajo_equipos_electronicos: boolean;
      empleados_tecnicos: boolean;
      trabajos_subcontratistas?: boolean;
    };
  };
  capitales?: {
    valor_edificio?: number;
    valor_ajuar?: number;
    valor_existencias?: number;
    existencias_terceros?: boolean;
    valor_existencias_terceros?: number;
    existencias_propias_terceros?: boolean;
    valor_existencias_propias_terceros?: number;
    existencias_intemperie?: boolean;
    valor_existencias_intemperie?: number;
    vehiculos_terceros_aparcados?: boolean;
    valor_vehiculos_terceros?: number;
    bienes_empleados?: boolean;
    valor_bienes_empleados?: number;
    bienes_camaras_frigorificas?: boolean;
    valor_bienes_camaras_frigorificas?: number;
    valor_equipo_electronico?: number;
    margen_bruto_anual?: number;
  };
  construccion?: {
    cubierta?: string;
    cerramientos?: string;
    estructura?: string;
    camaras_frigorificas?: boolean;
    placas_solares?: boolean;
    valor_placas_solares?: number;
  };
  proteccion_incendios?: {
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
  };
  proteccion_robo?: {
    protecciones_fisicas?: boolean;
    vigilancia_propia?: boolean;
    alarma_conectada?: boolean;
    camaras_circuito?: boolean;
  };
  siniestralidad?: {
    siniestros_ultimos_3_anos?: boolean;
    siniestros_detalles?: string;
  };
  ambito_territorial: string;
  coberturas_solicitadas: {
    exploitation: boolean;
    patronal: boolean;
    productos: boolean;
    trabajos: boolean;
    profesional: boolean;
  };
}

// Define initial state
const initialFormData: FormData = {
  form_type: "responsabilidad_civil",
  step: 1,
  contact: {
    name: "",
    email: "",
    phone: "",
    privacyPolicy: false,
  },
  company: {
    name: "",
    cnae_code: "",
    activity: "",
    activity_description: "",
    employees_number: 0,
    billing: 0,
    online_invoice: false,
    online_invoice_percentage: 0,
    installations_type: "",
    m2_installations: 0,
    manufactures: false,
    markets: false,
    provides_services: false,
    product_service_types: "",
    industry_types: "",
    almacena_bienes_terceros: false,
    vehiculos_terceros_aparcados: false,
  },
  empresaTipo: null,
  actividad: {
    manufactura: {
      producto_consumo_humano: false,
      tiene_empleados_tecnicos: false,
      producto_final_o_intermedio: "",
      distribucion: [],
      matriz_en_espana: true,
      filiales: [],
    },
    servicios: {
      trabajos_fuera_instalaciones: false,
      corte_soldadura: false,
      trabajo_equipos_electronicos: false,
      empleados_tecnicos: false,
    },
  },
  ambito_territorial: "",
  coberturas_solicitadas: {
    exploitation: false,
    patronal: false,
    productos: false,
    trabajos: false,
    profesional: false,
  },
};

// Define action types
type FormAction =
  | { type: "SET_FORM_TYPE"; payload: FormType }
  | { type: "SET_STEP"; payload: number }
  | { type: "SET_SESSION_ID"; payload: string }
  | { type: "SET_CONTACT"; payload: ContactData }
  | {
      type: "SET_COMPANY";
      payload: CompanyData;
      empresaTipo?: "manufactura" | "servicios" | null;
    }
  | { type: "SET_ACTIVIDAD_MANUFACTURA"; payload: any }
  | { type: "SET_ACTIVIDAD_SERVICIOS"; payload: any }
  | { type: "SET_CAPITALES"; payload: any }
  | { type: "SET_CONSTRUCCION"; payload: any }
  | { type: "SET_PROTECCION_INCENDIOS"; payload: any }
  | { type: "SET_PROTECCION_ROBO"; payload: any }
  | { type: "SET_SINIESTRALIDAD"; payload: any }
  | { type: "SET_AMBITO_TERRITORIAL"; payload: string }
  | { type: "SET_COBERTURAS"; payload: any }
  | { type: "RESET_FORM" };

// Create reducer
function formReducer(state: FormData, action: FormAction): FormData {
  switch (action.type) {
    case "SET_FORM_TYPE":
      return { ...state, form_type: action.payload };
    case "SET_STEP":
      return { ...state, step: action.payload };
    case "SET_SESSION_ID":
      return { ...state, session_id: action.payload };
    case "SET_CONTACT":
      return { ...state, contact: action.payload };
    case "SET_COMPANY":
      return {
        ...state,
        company: action.payload,
        empresaTipo:
          action.empresaTipo !== undefined
            ? action.empresaTipo
            : state.empresaTipo,
      };
    case "SET_ACTIVIDAD_MANUFACTURA":
      return {
        ...state,
        actividad: {
          ...state.actividad,
          manufactura: action.payload,
        },
      };
    case "SET_ACTIVIDAD_SERVICIOS":
      return {
        ...state,
        actividad: {
          ...state.actividad,
          servicios: action.payload,
        },
      };
    case "SET_CAPITALES":
      return { ...state, capitales: action.payload };
    case "SET_CONSTRUCCION":
      return { ...state, construccion: action.payload };
    case "SET_PROTECCION_INCENDIOS":
      return { ...state, proteccion_incendios: action.payload };
    case "SET_PROTECCION_ROBO":
      return { ...state, proteccion_robo: action.payload };
    case "SET_SINIESTRALIDAD":
      return { ...state, siniestralidad: action.payload };
    case "SET_AMBITO_TERRITORIAL":
      return { ...state, ambito_territorial: action.payload };
    case "SET_COBERTURAS":
      return { ...state, coberturas_solicitadas: action.payload };
    case "RESET_FORM":
      return { ...initialFormData };
    default:
      return state;
  }
}

// Define context interface
interface FormContextType {
  formData: FormData;
  dispatch: React.Dispatch<FormAction>;
  goToStep: (step: number) => void;
  submitForm: () => Promise<any>;
}

// Create context
const FormContext = createContext<FormContextType | undefined>(undefined);

// Create provider component
export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, dispatch] = useReducer(formReducer, initialFormData);

  React.useEffect(() => {
    // Get or create a temporary session ID on component mount
    const tempSessionId = getOrCreateTempSession();
    // Load form data from localStorage if available
    const savedFormData = localStorage.getItem(`form_data_${tempSessionId}`);
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        // Restore each part of the form data
        Object.entries(parsedData).forEach(([key, value]) => {
          if (key === "step") {
            dispatch({ type: "SET_STEP", payload: value as number });
          } else if (key === "form_type") {
            dispatch({ type: "SET_FORM_TYPE", payload: value as FormType });
          } else if (key === "contact") {
            dispatch({ type: "SET_CONTACT", payload: value as ContactData });
          } else if (key === "company") {
            dispatch({
              type: "SET_COMPANY",
              payload: value as CompanyData,
              empresaTipo: parsedData.empresaTipo,
            });
          } else if (key === "capitales") {
            dispatch({ type: "SET_CAPITALES", payload: value });
          } else if (key === "construccion") {
            dispatch({ type: "SET_CONSTRUCCION", payload: value });
          } else if (key === "proteccion_incendios") {
            dispatch({ type: "SET_PROTECCION_INCENDIOS", payload: value });
          } else if (key === "proteccion_robo") {
            dispatch({ type: "SET_PROTECCION_ROBO", payload: value });
          } else if (key === "siniestralidad") {
            dispatch({ type: "SET_SINIESTRALIDAD", payload: value });
          } else if (key === "ambito_territorial") {
            dispatch({
              type: "SET_AMBITO_TERRITORIAL",
              payload: value as string,
            });
          } else if (key === "coberturas_solicitadas") {
            dispatch({ type: "SET_COBERTURAS", payload: value });
          }
        });
      } catch (error) {
        console.error("Error parsing saved form data:", error);
      }
    }
  }, []);

  // Save form data to localStorage whenever it changes
  React.useEffect(() => {
    const tempSessionId = getTempSessionId();
    if (tempSessionId) {
      localStorage.setItem(
        `form_data_${tempSessionId}`,
        JSON.stringify(formData)
      );
    }
  }, [formData]);

  // Function to navigate between steps
  const goToStep = (step: number) => {
    dispatch({ type: "SET_STEP", payload: step });
  };

  // Function to submit the complete form
  const submitForm = async () => {
    try {
      console.log("===== FORM SUBMISSION DEBUG =====");
      console.log("Form Type:", formData.form_type);
      console.log("Complete Form Data:", JSON.stringify(formData, null, 2));
      let permanentSessionId;
      try {
        permanentSessionId = await convertTempToPermanentSession();
      } catch (error) {
        console.error("Error converting session:", error);
        // Fallback to creating a direct session
        permanentSessionId = await createSession();
      }

      // Set session ID in the form context
      dispatch({ type: "SET_SESSION_ID", payload: permanentSessionId });

      // Determine which API endpoint to use based on form type
      const endpoint =
        formData.form_type === "responsabilidad_civil"
          ? "/api/forms/responsabilidad_civil"
          : "/api/forms/danos-materiales";

      // Prepare data for submission
      const submissionData = {
        session_id: permanentSessionId,
        form_data: { ...formData },
        // For RC form
        actividad_manufactura: formData.empresaTipo === "manufactura",
        // For DM form
        empresa: {
          actividad: formData.company.activity,
          facturacion: formData.company.billing,
          num_trabajadores: formData.company.employees_number,
          facturacion_online: formData.company.online_invoice,
          instalaciones_tipo: formData.company.installations_type,
          metros_cuadrados: formData.company.m2_installations,
          almacena_bienes_terceros: formData.company.almacena_bienes_terceros,
          vehiculos_terceros: formData.company.vehiculos_terceros_aparcados,
        },
        capital: formData.capitales,
        construccion: formData.construccion,
        proteccion_incendios: formData.proteccion_incendios,
        proteccion_robo: formData.proteccion_robo,
        siniestralidad: formData.siniestralidad,
      };

      // Submit the form
      console.log("Submitting to endpoint:", endpoint);
      console.log(
        "Submission payload:",
        JSON.stringify(submissionData, null, 2)
      );

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error de respuesta (${response.status}):`, errorText);
        throw new Error(
          `Error submitting form: ${response.statusText}. Status: ${response.status}. Details: ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Respuesta de la API:", data);

      if (!data.success) {
        throw new Error(data.error || "Error submitting form");
      }

      // Clear the temporary form data from localStorage
      localStorage.removeItem(`form_data_${getTempSessionId()}`);

      return data;
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description:
          "Hubo un problema al enviar el formulario. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <FormContext.Provider value={{ formData, dispatch, goToStep, submitForm }}>
      {children}
    </FormContext.Provider>
  );
}

// Custom hook to use the FormContext
export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
}

export default FormContext;
