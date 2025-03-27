// contexts/FormContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  ContactFormData,
  CompanyFormData,
  EmpresaTipo,
  ManufacturaFormData,
  ServiciosFormData,
  CoberturasFormData,
} from "@/lib/schemas";
import { PreguntasGeneralesFormData } from "@/lib/schemas"; // Importar desde schemas, no de session
import { AdditionalCoverageData } from "@/components/forms/steps/AdditionalCoverageStep";
import { InformacionGeneralData } from "@/components/forms/steps/InformacionGeneralStep";
import { CapitalesYCoberturasData } from "@/components/forms/steps/CapitalesYCoberturasStep"; // Importar el nuevo tipo

export interface FormData {
  form_type: string;
  step: number;
  contact: Partial<ContactFormData>;
  company: Partial<CompanyFormData>;
  informacion_general?: Partial<InformacionGeneralData>;
  empresaTipo: EmpresaTipo | null;
  actividad: {
    manufactura: Partial<ManufacturaFormData>;
    servicios: Partial<ServiciosFormData>;
  };
  preguntas_generales: Partial<PreguntasGeneralesFormData>;
  ambito_territorial: string;
  capitales?: any;
  construccion?: any;
  proteccion_incendios?: any;
  proteccion_robo?: any;
  siniestralidad?: any;
  capitales_y_coberturas?: Partial<CapitalesYCoberturasData>; // Nuevo campo para CapitalesYCoberturasStep
  coberturas_solicitadas: {
    exploitation: boolean;
    patronal: boolean;
    productos: boolean;
    trabajos: boolean;
    profesional: boolean;
    coberturas_adicionales?: Partial<AdditionalCoverageData>;
  };
}

type CoberturasData = {
  exploitation: boolean;
  patronal: boolean;
  productos: boolean;
  trabajos: boolean;
  profesional: boolean;
  coberturas_adicionales?: Partial<AdditionalCoverageData>;
};

// Definir los tipos de acciones
type FormAction =
  | { type: "SET_FORM_TYPE"; payload: string }
  | { type: "SET_STEP"; payload: number }
  | { type: "SET_SESSION_ID"; payload: string }
  | { type: "SET_CONTACT"; payload: Partial<ContactFormData> }
  | {
      type: "SET_COMPANY";
      payload: Partial<CompanyFormData>;
      empresaTipo: EmpresaTipo | null;
    }
  | {
      type: "SET_INFORMACION_GENERAL";
      payload: Partial<InformacionGeneralData>;
    }
  | { type: "SET_ACTIVIDAD_MANUFACTURA"; payload: Partial<ManufacturaFormData> }
  | { type: "SET_ACTIVIDAD_SERVICIOS"; payload: Partial<ServiciosFormData> }
  | {
      type: "SET_PREGUNTAS_GENERALES";
      payload: Partial<PreguntasGeneralesFormData>;
    }
  | { type: "SET_CAPITALES"; payload: any }
  | {
      type: "SET_CAPITALES_Y_COBERTURAS";
      payload: Partial<CapitalesYCoberturasData>;
    } // Nueva acción
  | { type: "SET_CONSTRUCCION"; payload: any }
  | { type: "SET_PROTECCION_INCENDIOS"; payload: any }
  | { type: "SET_PROTECCION_ROBO"; payload: any }
  | { type: "SET_SINIESTRALIDAD"; payload: any }
  | { type: "SET_AMBITO_TERRITORIAL"; payload: string }
  | { type: "SET_COBERTURAS"; payload: Partial<CoberturasData> }
  | { type: "RESET_FORM" };

// Estado inicial del formulario
const initialFormData: FormData = {
  form_type: "",
  step: 1,
  contact: {},
  company: {},
  informacion_general: {},
  empresaTipo: null,
  actividad: {
    manufactura: {},
    servicios: {},
  },
  ambito_territorial: "",
  siniestralidad: undefined,
  capitales_y_coberturas: {}, // Inicializar el nuevo campo
  coberturas_solicitadas: {
    exploitation: false,
    patronal: false,
    productos: false,
    trabajos: false,
    profesional: false,
    coberturas_adicionales: {},
  },
  preguntas_generales: {},
};

// Función reductora para manejar acciones
function reducer(state: FormData, action: FormAction): FormData {
  switch (action.type) {
    case "SET_FORM_TYPE":
      return {
        ...state,
        form_type: action.payload,
      };
    case "SET_STEP":
      return {
        ...state,
        step: action.payload,
      };
    case "SET_CONTACT":
      return {
        ...state,
        contact: action.payload,
      };
    case "SET_COMPANY":
      return {
        ...state,
        company: action.payload,
        empresaTipo: action.empresaTipo,
      };
    case "SET_INFORMACION_GENERAL":
      return {
        ...state,
        informacion_general: action.payload,
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
    case "SET_PREGUNTAS_GENERALES":
      return {
        ...state,
        preguntas_generales: action.payload,
      };
    case "SET_CAPITALES":
      return {
        ...state,
        capitales: action.payload,
      };
    case "SET_CAPITALES_Y_COBERTURAS": // Nuevo case para manejar los capitales y coberturas combinados
      return {
        ...state,
        capitales_y_coberturas: action.payload,
      };
    case "SET_CONSTRUCCION":
      return {
        ...state,
        construccion: action.payload,
      };
    case "SET_PROTECCION_INCENDIOS":
      return {
        ...state,
        proteccion_incendios: action.payload,
      };
    case "SET_PROTECCION_ROBO":
      return {
        ...state,
        proteccion_robo: action.payload,
      };
    case "SET_SINIESTRALIDAD":
      return {
        ...state,
        siniestralidad: action.payload,
      };
    case "SET_AMBITO_TERRITORIAL":
      return {
        ...state,
        ambito_territorial: action.payload,
      };
    case "SET_COBERTURAS":
      return {
        ...state,
        coberturas_solicitadas: {
          ...state.coberturas_solicitadas,
          ...action.payload,
        },
      };
    case "RESET_FORM":
      return initialFormData;
    default:
      return state;
  }
}

// Tipo para el contexto del formulario
export interface FormContextValue {
  formData: FormData;
  dispatch: React.Dispatch<FormAction>;
  goToStep: (step: number) => void;
  submitForm: () => Promise<any>;
}

// Crear el contexto
const FormContext = createContext<FormContextValue | undefined>(undefined);

// Proveedor del contexto
export function FormProvider({ children }: { children: React.ReactNode }) {
  // Inicializar el estado del formulario con useReducer
  const [formData, dispatch] = useReducer(reducer, initialFormData);

  // Función para cambiar el paso actual
  const goToStep = (step: number) => {
    dispatch({ type: "SET_STEP", payload: step });
  };

  // Cargar datos del formulario desde localStorage al iniciar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedFormData = localStorage.getItem("formData");
      if (savedFormData) {
        try {
          const parsedData = JSON.parse(savedFormData);
          Object.entries(parsedData).forEach(([key, value]) => {
            if (key === "step") {
              dispatch({ type: "SET_STEP", payload: value as number });
            } else if (key === "form_type") {
              dispatch({ type: "SET_FORM_TYPE", payload: value as string });
            }
            // Otros casos según sea necesario
          });
        } catch (e) {
          console.error("Error parsing form data from localStorage", e);
        }
      }
    }
  }, []);

  // Guardar datos del formulario en localStorage cuando cambien
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("formData", JSON.stringify(formData));
    }
  }, [formData]);

  // Función para enviar el formulario
  const submitForm = async () => {
    try {
      const apiUrl = `/api/forms/${formData.form_type}`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: getSessionId(),
          form_data: formData,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error submitting form:", error);
      throw error;
    }
  };

  // Función auxiliar para obtener el ID de sesión
  const getSessionId = () => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("session_id") ||
        localStorage.getItem("smart_advice_session_id")
      );
    }
    return null;
  };

  return (
    <FormContext.Provider value={{ formData, dispatch, goToStep, submitForm }}>
      {children}
    </FormContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
}
