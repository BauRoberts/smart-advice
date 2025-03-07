// contexts/DanosFormContext.tsx
import { createContext, useContext, useReducer, ReactNode } from "react";
import { DanosMaterialesFormData } from "@/lib/schemas";

// Tipo para los datos del formulario
export interface DanosFormData {
  step: number;
  contacto: {
    name: string;
    email: string;
    phone: string;
  };
  empresa: {
    actividad: string;
    cnae_code?: string;
    facturacion: number;
    num_trabajadores: number;
    facturacion_online: boolean;
    facturacion_online_porcentaje?: number;
    instalaciones_tipo: string;
    metros_cuadrados: number;
    almacena_bienes_terceros: boolean;
    existencias_intemperie: boolean;
    vehiculos_terceros: boolean;
    bienes_empleados: boolean;
    dinero_caja_fuerte?: number;
    dinero_fuera_caja?: number;
    clausula_todo_riesgo: boolean;
  };
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
    suministro_agua: boolean;
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
const initialFormData: DanosFormData = {
  step: 1,
  contacto: {
    name: "",
    email: "",
    phone: "",
  },
  empresa: {
    actividad: "",
    cnae_code: "",
    facturacion: 0,
    num_trabajadores: 0,
    facturacion_online: false,
    facturacion_online_porcentaje: 0,
    instalaciones_tipo: "",
    metros_cuadrados: 0,
    almacena_bienes_terceros: false,
    existencias_intemperie: false,
    vehiculos_terceros: false,
    bienes_empleados: false,
    dinero_caja_fuerte: 0,
    dinero_fuera_caja: 0,
    clausula_todo_riesgo: false,
  },
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
    suministro_agua: false,
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
  | { type: "GO_TO_STEP"; payload: number }
  | { type: "SET_CONTACTO"; payload: DanosFormData["contacto"] }
  | { type: "SET_EMPRESA"; payload: DanosFormData["empresa"] }
  | { type: "SET_CAPITALES"; payload: DanosFormData["capitales"] }
  | { type: "SET_CONSTRUCCION"; payload: DanosFormData["construccion"] }
  | {
      type: "SET_PROTECCION_INCENDIOS";
      payload: DanosFormData["proteccion_incendios"];
    }
  | { type: "SET_PROTECCION_ROBO"; payload: DanosFormData["proteccion_robo"] }
  | { type: "SET_SINIESTRALIDAD"; payload: DanosFormData["siniestralidad"] }
  | { type: "RESET_FORM" };

// Reducer para manejar acciones
function formReducer(state: DanosFormData, action: FormAction): DanosFormData {
  switch (action.type) {
    case "GO_TO_STEP":
      return {
        ...state,
        step: action.payload,
      };
    case "SET_CONTACTO":
      return {
        ...state,
        contacto: action.payload,
      };
    case "SET_EMPRESA":
      return {
        ...state,
        empresa: action.payload,
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
    case "RESET_FORM":
      return initialFormData;
    default:
      return state;
  }
}

// Contexto para compartir datos y métodos
interface DanosFormContextType {
  formData: DanosFormData;
  dispatch: React.Dispatch<FormAction>;
  goToStep: (step: number) => void;
  submitForm: () => Promise<void>;
}

const DanosFormContext = createContext<DanosFormContextType | undefined>(
  undefined
);

// Hook para acceder al contexto
export function useDanosFormContext() {
  const context = useContext(DanosFormContext);
  if (!context) {
    throw new Error(
      "useDanosFormContext debe usarse dentro de un DanosFormProvider"
    );
  }
  return context;
}

// Provider para envolver componentes
interface DanosFormProviderProps {
  children: ReactNode;
}

export function DanosFormProvider({ children }: DanosFormProviderProps) {
  const [formData, dispatch] = useReducer(formReducer, initialFormData);

  // Función para navegar entre pasos
  const goToStep = (step: number) => {
    dispatch({ type: "GO_TO_STEP", payload: step });
  };

  // Función para enviar el formulario
  const submitForm = async () => {
    try {
      // Convertir a la estructura que espera la API
      const apiFormData: DanosMaterialesFormData = {
        empresa: {
          actividad: formData.empresa.actividad,
          facturacion: formData.empresa.facturacion,
          num_trabajadores: formData.empresa.num_trabajadores,
          facturacion_online: formData.empresa.facturacion_online,
          instalaciones_tipo: formData.empresa.instalaciones_tipo,
          metros_cuadrados: formData.empresa.metros_cuadrados,
          almacena_bienes_terceros: formData.empresa.almacena_bienes_terceros,
          existencias_intemperie: formData.empresa.existencias_intemperie,
          vehiculos_terceros: formData.empresa.vehiculos_terceros,
          bienes_empleados: formData.empresa.bienes_empleados,
          dinero_caja_fuerte: formData.empresa.dinero_caja_fuerte,
          dinero_fuera_caja: formData.empresa.dinero_fuera_caja,
          clausula_todo_riesgo: formData.empresa.clausula_todo_riesgo,
        },
        capital: {
          valor_edificio: formData.capitales.valor_edificio,
          valor_ajuar: formData.capitales.valor_ajuar,
          valor_existencias: formData.capitales.valor_existencias,
          existencias_terceros: formData.capitales.existencias_terceros,
          existencias_propias_terceros:
            formData.capitales.existencias_propias_terceros,
          valor_equipo_electronico: formData.capitales.valor_equipo_electronico,
          margen_bruto_anual: formData.capitales.margen_bruto_anual,
        },
        construccion: {
          cubierta: formData.construccion.cubierta,
          cerramientos: formData.construccion.cerramientos,
          estructura: formData.construccion.estructura,
          camaras_frigorificas: formData.construccion.camaras_frigorificas,
          placas_solares: formData.construccion.placas_solares,
        },
        proteccion_incendios: {
          extintores: formData.proteccion_incendios.extintores,
          bocas_incendio: formData.proteccion_incendios.bocas_incendio,
          deposito_bombeo: formData.proteccion_incendios.deposito_bombeo,
          cobertura_total: formData.proteccion_incendios.cobertura_total,
          columnas_hidrantes: formData.proteccion_incendios.columnas_hidrantes,
          deteccion_automatica:
            formData.proteccion_incendios.deteccion_automatica,
          rociadores: formData.proteccion_incendios.rociadores,
          suministro_agua: formData.proteccion_incendios.suministro_agua,
        },
        proteccion_robo: {
          protecciones_fisicas: formData.proteccion_robo.protecciones_fisicas,
          vigilancia_propia: formData.proteccion_robo.vigilancia_propia,
          alarma_conectada: formData.proteccion_robo.alarma_conectada,
          camaras_circuito: formData.proteccion_robo.camaras_circuito,
        },
        siniestralidad: {
          siniestros_ultimos_3_anos:
            formData.siniestralidad.siniestros_ultimos_3_anos,
        },
      };

      // Obtener el session_id (ya sea del localStorage o crear uno nuevo)
      const sessionId = localStorage.getItem("session_id");
      if (!sessionId) {
        throw new Error("No se encontró session_id");
      }

      // Enviar el formulario
      const response = await fetch("/api/forms/danos-materiales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          ...apiFormData,
          form_data: formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar el formulario");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error enviando formulario:", error);
      throw error;
    }
  };

  return (
    <DanosFormContext.Provider
      value={{ formData, dispatch, goToStep, submitForm }}
    >
      {children}
    </DanosFormContext.Provider>
  );
}
