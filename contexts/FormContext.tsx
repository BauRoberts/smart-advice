// contexts/FormContext.tsx
import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";

// Tipo para los datos del formulario
export interface FormData {
  step: number;
  form_type: "responsabilidad_civil" | "danos_materiales" | null;
  contact: {
    name: string;
    email: string;
    phone: string;
    privacyPolicy: boolean; // Added privacy policy field
  };
  company: {
    name: string;
    cnae_code: string;
    activity: string;
    employees_number: number;
    billing: number;
    online_invoice: boolean;
    online_invoice_percentage: number;
    installations_type: string;
    m2_installations: number;
    almacena_bienes_terceros: boolean;
    vehiculos_terceros_aparcados: boolean;
  };
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
    };
  };
  ambito_territorial: string;
  coberturas_solicitadas: {
    exploitation: boolean;
    patronal: boolean;
    productos: boolean;
    trabajos: boolean;
    profesional: boolean;
  };
  // Campos específicos para Daños Materiales
  capitales: {
    valor_edificio?: number;
    valor_ajuar?: number;
    valor_existencias?: number;
    existencias_terceros: boolean;
    existencias_propias_terceros: boolean;
    valor_equipo_electronico?: number;
    margen_bruto_anual?: number;
  };
  construccion: {
    cubierta: string;
    cerramientos: string;
    estructura: string;
    camaras_frigorificas: boolean;
    placas_solares: boolean;
    valor_placas_solares?: number;
  };
  proteccion_incendios: {
    extintores: boolean;
    bocas_incendio: boolean;
    deposito_bombeo: boolean;
    cobertura_total: boolean;
    columnas_hidrantes: boolean;
    columnas_hidrantes_tipo?: "publico" | "privado";
    deteccion_automatica: boolean;
    deteccion_zona?: string[];
    rociadores: boolean;
    rociadores_zona?: string[];
    suministro_agua: string;
  };
  proteccion_robo: {
    protecciones_fisicas: boolean;
    vigilancia_propia: boolean;
    alarma_conectada: boolean;
    camaras_circuito: boolean;
  };
  siniestralidad: {
    siniestros_ultimos_3_anos: boolean;
    siniestros_detalles?: string;
  };
}

// Valor inicial del formulario
const initialFormData: FormData = {
  step: 1,
  form_type: null, // This should be updated by SET_FORM_TYPE action
  contact: {
    name: "",
    email: "",
    phone: "",
    privacyPolicy: false, // Added privacy policy field with default false
  },
  company: {
    name: "",
    cnae_code: "",
    activity: "",
    employees_number: 0,
    billing: 0,
    online_invoice: false,
    online_invoice_percentage: 0,
    installations_type: "",
    m2_installations: 0,
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
  // Inicialización de campos específicos para Daños Materiales
  capitales: {
    valor_edificio: 0,
    valor_ajuar: 0,
    valor_existencias: 0,
    existencias_terceros: false,
    existencias_propias_terceros: false,
    valor_equipo_electronico: 0,
    margen_bruto_anual: 0,
  },
  construccion: {
    cubierta: "",
    cerramientos: "",
    estructura: "",
    camaras_frigorificas: false,
    placas_solares: false,
    valor_placas_solares: 0,
  },
  proteccion_incendios: {
    extintores: false,
    bocas_incendio: false,
    deposito_bombeo: false,
    cobertura_total: false,
    columnas_hidrantes: false,
    deteccion_automatica: false,
    rociadores: false,
    suministro_agua: "",
  },
  proteccion_robo: {
    protecciones_fisicas: false,
    vigilancia_propia: false,
    alarma_conectada: false,
    camaras_circuito: false,
  },
  siniestralidad: {
    siniestros_ultimos_3_anos: false,
  },
};

// Tipos de acciones
type FormAction =
  | { type: "RESET_FORM" }
  | { type: "SET_CONTACT"; payload: FormData["contact"] }
  | {
      type: "SET_COMPANY";
      payload: FormData["company"];
      empresaTipo?: FormData["empresaTipo"];
    }
  | {
      type: "SET_ACTIVIDAD_MANUFACTURA";
      payload: FormData["actividad"]["manufactura"];
    }
  | {
      type: "SET_ACTIVIDAD_SERVICIOS";
      payload: FormData["actividad"]["servicios"];
    }
  | { type: "SET_AMBITO_TERRITORIAL"; payload: string }
  | { type: "SET_COBERTURAS"; payload: FormData["coberturas_solicitadas"] }
  | { type: "SET_CAPITALES"; payload: FormData["capitales"] }
  | { type: "SET_CONSTRUCCION"; payload: FormData["construccion"] }
  | {
      type: "SET_PROTECCION_INCENDIOS";
      payload: FormData["proteccion_incendios"];
    }
  | { type: "SET_PROTECCION_ROBO"; payload: FormData["proteccion_robo"] }
  | { type: "SET_SINIESTRALIDAD"; payload: FormData["siniestralidad"] }
  | { type: "SET_STEP"; payload: number }
  | {
      type: "SET_FORM_TYPE";
      payload: "responsabilidad_civil" | "danos_materiales";
    };

// Reducer para manejar acciones
function formReducer(state: FormData, action: FormAction): FormData {
  switch (action.type) {
    case "RESET_FORM":
      return initialFormData;

    case "SET_CONTACT":
      return {
        ...state,
        contact: action.payload,
      };

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

    case "SET_AMBITO_TERRITORIAL":
      return {
        ...state,
        ambito_territorial: action.payload,
      };

    case "SET_COBERTURAS":
      return {
        ...state,
        coberturas_solicitadas: action.payload,
      };

    case "SET_CAPITALES":
      return {
        ...state,
        capitales: action.payload,
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

    case "SET_STEP":
      return {
        ...state,
        step: action.payload,
      };

    case "SET_FORM_TYPE":
      return {
        ...state,
        form_type: action.payload,
      };

    default:
      return state;
  }
}

// Contexto para compartir datos y métodos
interface FormContextType {
  formData: FormData;
  dispatch: React.Dispatch<FormAction>;
  goToStep: (step: number) => void;
  submitForm: () => Promise<void>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

// Hook para acceder al contexto
export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext debe usarse dentro de un FormProvider");
  }
  return context;
}

// Provider para envolver componentes
interface FormProviderProps {
  children: ReactNode;
}

export function FormProvider({ children }: FormProviderProps) {
  const [formData, dispatch] = useReducer(formReducer, initialFormData);

  // Cargar datos del localStorage si existen
  useEffect(() => {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Restablecer el formulario con los datos guardados
        Object.entries(parsedData).forEach(([key, value]) => {
          if (key === "step") {
            dispatch({ type: "SET_STEP", payload: value as number });
          } else if (key === "form_type") {
            dispatch({
              type: "SET_FORM_TYPE",
              payload: value as "responsabilidad_civil" | "danos_materiales",
            });
          } else if (key === "contact") {
            dispatch({
              type: "SET_CONTACT",
              payload: value as FormData["contact"],
            });
          } else if (key === "company") {
            dispatch({
              type: "SET_COMPANY",
              payload: value as FormData["company"],
              empresaTipo: parsedData.empresaTipo,
            });
          } else if (key === "ambito_territorial") {
            dispatch({
              type: "SET_AMBITO_TERRITORIAL",
              payload: value as string,
            });
          } else if (key === "coberturas_solicitadas") {
            dispatch({
              type: "SET_COBERTURAS",
              payload: value as FormData["coberturas_solicitadas"],
            });
          } else if (key === "capitales") {
            dispatch({
              type: "SET_CAPITALES",
              payload: value as FormData["capitales"],
            });
          } else if (key === "construccion") {
            dispatch({
              type: "SET_CONSTRUCCION",
              payload: value as FormData["construccion"],
            });
          } else if (key === "proteccion_incendios") {
            dispatch({
              type: "SET_PROTECCION_INCENDIOS",
              payload: value as FormData["proteccion_incendios"],
            });
          } else if (key === "proteccion_robo") {
            dispatch({
              type: "SET_PROTECCION_ROBO",
              payload: value as FormData["proteccion_robo"],
            });
          } else if (key === "siniestralidad") {
            dispatch({
              type: "SET_SINIESTRALIDAD",
              payload: value as FormData["siniestralidad"],
            });
          }
        });
      } catch (e) {
        console.error("Error al cargar datos guardados:", e);
      }
    }
  }, []);

  // Guardar cambios en el localStorage
  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  // Función para navegar entre pasos
  const goToStep = (step: number) => {
    dispatch({ type: "SET_STEP", payload: step });
  };

  // Función para enviar el formulario
  const submitForm = async () => {
    try {
      // Obtener el session_id
      const sessionId = localStorage.getItem("session_id");
      if (!sessionId) {
        throw new Error("No se encontró session_id");
      }

      // Endpoint diferente según el tipo de formulario
      const endpoint =
        formData.form_type === "responsabilidad_civil"
          ? "/api/forms/responsabilidad_civil"
          : "/api/forms/danos-materiales";

      // Preparar datos para la API
      let formPayload: any = {
        session_id: sessionId,
        form_data: formData,
      };

      // Si es responsabilidad civil, añadir campos específicos
      if (formData.form_type === "responsabilidad_civil") {
        formPayload = {
          ...formPayload,
          actividad_manufactura: formData.empresaTipo === "manufactura",
        };
      }
      // Si es daños materiales, añadir campos específicos
      else if (formData.form_type === "danos_materiales") {
        formPayload = {
          ...formPayload,
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
      }

      // Enviar el formulario
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formPayload),
      });

      if (!response.ok) {
        throw new Error(
          `Error al enviar el formulario: ${response.statusText}`
        );
      }

      // Retornar la respuesta
      return await response.json();
    } catch (error) {
      console.error("Error en submitForm:", error);
      throw error;
    }
  };

  return (
    <FormContext.Provider value={{ formData, dispatch, goToStep, submitForm }}>
      {children}
    </FormContext.Provider>
  );
}
