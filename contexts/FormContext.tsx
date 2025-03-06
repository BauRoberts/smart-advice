// contexts/FormContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ContactFormData } from '@/components/forms/steps/ContactFormStep';
import { CompanyFormData, EmpresaTipo } from '@/components/forms/steps/CompanyFormStep';

// Tipo para los datos del formulario de manufactura
interface ManufacturaFormData {
  producto_consumo_humano: boolean;
  tiene_empleados_tecnicos: boolean;
  producto_final_o_intermedio: string;
  distribucion: string[];
  matriz_en_espana: boolean;
  filiales: string[];
}

// Tipo para los datos del formulario de servicios
interface ServiciosFormData {
  trabajos_fuera_instalaciones: boolean;
  corte_soldadura: boolean;
  trabajo_equipos_electronicos: boolean;
  empleados_tecnicos: boolean;
}

// Unión de tipos según el tipo de empresa
type ActividadFormData = ManufacturaFormData | ServiciosFormData;

// Tipo para las coberturas solicitadas
interface CoberturasFormData {
  exploitation: boolean;
  patronal: boolean;
  productos: boolean;
  trabajos: boolean;
  profesional: boolean;
}

// Tipo para todos los datos del formulario
export interface FormData {
  contact: ContactFormData;
  company: CompanyFormData;
  empresaTipo: EmpresaTipo;
  actividad: {
    manufactura?: ManufacturaFormData;
    servicios?: ServiciosFormData;
  };
  ambito_territorial: string;
  coberturas_solicitadas: CoberturasFormData;
  step: number;
  formType: 'responsabilidad_civil' | 'danos_materiales';
}

// Valores por defecto
const defaultFormData: FormData = {
  contact: {
    name: '',
    email: '',
    phone: ''
  },
  company: {
    name: '',
    cnae_code: '',
    activity: '',
    employees_number: 0,
    billing: 0,
    online_invoice: false,
    online_invoice_percentage: 0,
    installations_type: '',
    m2_installations: 0,
    almacena_bienes_terceros: false,
    vehiculos_terceros_aparcados: false
  },
  empresaTipo: null,
  actividad: {
    manufactura: {
      producto_consumo_humano: false,
      tiene_empleados_tecnicos: false,
      producto_final_o_intermedio: '',
      distribucion: [],
      matriz_en_espana: true,
      filiales: []
    },
    servicios: {
      trabajos_fuera_instalaciones: false,
      corte_soldadura: false,
      trabajo_equipos_electronicos: false,
      empleados_tecnicos: false
    }
  },
  ambito_territorial: '',
  coberturas_solicitadas: {
    exploitation: false,
    patronal: false,
    productos: false,
    trabajos: false,
    profesional: false
  },
  step: 1,
  formType: 'responsabilidad_civil'
};

// Acciones posibles
type FormAction = 
  | { type: 'SET_CONTACT'; payload: ContactFormData }
  | { type: 'SET_COMPANY'; payload: CompanyFormData; empresaTipo: EmpresaTipo }
  | { type: 'SET_ACTIVIDAD_MANUFACTURA'; payload: ManufacturaFormData }
  | { type: 'SET_ACTIVIDAD_SERVICIOS'; payload: ServiciosFormData }
  | { type: 'SET_AMBITO_TERRITORIAL'; payload: string }
  | { type: 'SET_COBERTURAS'; payload: CoberturasFormData }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_FORM_TYPE'; payload: 'responsabilidad_civil' | 'danos_materiales' }
  | { type: 'RESET_FORM' };

// Contexto para el formulario
interface FormContextType {
  formData: FormData;
  dispatch: React.Dispatch<FormAction>;
  saveProgress: () => void;
  loadProgress: () => void;
  resetForm: () => void;
  goToStep: (step: number) => void;
  submitForm: () => Promise<void>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

// Reducer para manejar las acciones
function formReducer(state: FormData, action: FormAction): FormData {
  switch (action.type) {
    case 'SET_CONTACT':
      return { ...state, contact: action.payload };
    case 'SET_COMPANY':
      return { 
        ...state, 
        company: action.payload, 
        empresaTipo: action.empresaTipo 
      };
    case 'SET_ACTIVIDAD_MANUFACTURA':
      return { 
        ...state, 
        actividad: { 
          ...state.actividad, 
          manufactura: action.payload 
        } 
      };
    case 'SET_ACTIVIDAD_SERVICIOS':
      return { 
        ...state, 
        actividad: { 
          ...state.actividad, 
          servicios: action.payload 
        } 
      };
    case 'SET_AMBITO_TERRITORIAL':
      return { ...state, ambito_territorial: action.payload };
    case 'SET_COBERTURAS':
      return { ...state, coberturas_solicitadas: action.payload };
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_FORM_TYPE':
      return { ...state, formType: action.payload };
    case 'RESET_FORM':
      return {
        ...defaultFormData,
        step: 1
      };
    default:
      return state;
  }
}

// Proveedor del contexto
export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, dispatch] = React.useReducer(formReducer, defaultFormData);
  const [isFormLoaded, setIsFormLoaded] = useState(false);

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    loadProgress();
    setIsFormLoaded(true);
  }, []);

  // Guardar progreso en localStorage cuando cambia el formData
  useEffect(() => {
    if (isFormLoaded) {
      saveProgress();
    }
  }, [formData, isFormLoaded]);

  // Función para guardar el progreso
  const saveProgress = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('formData', JSON.stringify(formData));
    }
  };

  // Función para cargar el progreso
  const loadProgress = () => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('formData');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData) as FormData;
          // Reiniciar el reducer con los datos guardados
          dispatch({ type: 'RESET_FORM' });
          
          // Establecer cada sección por separado
          if (parsedData.contact) {
            dispatch({ type: 'SET_CONTACT', payload: parsedData.contact });
          }
          
          if (parsedData.company) {
            dispatch({ 
              type: 'SET_COMPANY', 
              payload: parsedData.company, 
              empresaTipo: parsedData.empresaTipo 
            });
          }
          
          if (parsedData.actividad.manufactura) {
            dispatch({ 
              type: 'SET_ACTIVIDAD_MANUFACTURA', 
              payload: parsedData.actividad.manufactura 
            });
          }
          
          if (parsedData.actividad.servicios) {
            dispatch({ 
              type: 'SET_ACTIVIDAD_SERVICIOS', 
              payload: parsedData.actividad.servicios 
            });
          }
          
          if (parsedData.ambito_territorial) {
            dispatch({ 
              type: 'SET_AMBITO_TERRITORIAL', 
              payload: parsedData.ambito_territorial 
            });
          }
          
          if (parsedData.coberturas_solicitadas) {
            dispatch({ 
              type: 'SET_COBERTURAS', 
              payload: parsedData.coberturas_solicitadas 
            });
          }
          
          dispatch({ type: 'SET_STEP', payload: parsedData.step });
          dispatch({ type: 'SET_FORM_TYPE', payload: parsedData.formType });
        } catch (error) {
          console.error('Error parsing saved form data:', error);
        }
      }
    }
  };

  // Función para reiniciar el formulario
  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('formData');
    }
  };

  // Función para ir a un paso específico
  const goToStep = (step: number) => {
    dispatch({ type: 'SET_STEP', payload: step });
  };

  // Función para enviar el formulario completo
  const submitForm = async () => {
    try {
      // 1. Guardar datos de contacto
      const contactResponse = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData.contact,
        }),
      });

      if (!contactResponse.ok) {
        throw new Error('Error al guardar datos de contacto');
      }

      const contactData = await contactResponse.json();
      const sessionId = contactData.session_id;

      // 2. Guardar datos de empresa
      const companyResponse = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          ...formData.company,
          tipo_empresa: formData.empresaTipo,
        }),
      });

      if (!companyResponse.ok) {
        throw new Error('Error al guardar datos de empresa');
      }

      // 3. Guardar el formulario completo
      const actividadData = formData.empresaTipo === 'manufactura' 
        ? formData.actividad.manufactura 
        : formData.actividad.servicios;

      const formResponse = await fetch(`/api/forms/${formData.formType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          actividad_manufactura: formData.empresaTipo === 'manufactura',
          form_data: {
            actividad: {
              [formData.empresaTipo as string]: actividadData
            },
            ambito_territorial: formData.ambito_territorial,
            coberturas_solicitadas: formData.coberturas_solicitadas,
          }
        }),
      });

      if (!formResponse.ok) {
        throw new Error('Error al guardar formulario');
      }

      const formResponseData = await formResponse.json();
      return formResponseData;
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      throw error;
    }
  };

  return (
    <FormContext.Provider value={{ 
      formData, 
      dispatch, 
      saveProgress, 
      loadProgress, 
      resetForm, 
      goToStep,
      submitForm
    }}>
      {children}
    </FormContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
}