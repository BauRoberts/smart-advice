// components/forms/ResponsabilidadCivilForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useFormContext } from "@/contexts/FormContext";
import ContactFormStep, {
  ContactFormData,
} from "@/components/forms/steps/ContactFormStep";
import CompanyFormStep, {
  CompanyFormData,
  EmpresaTipo,
} from "@/components/forms/steps/CompanyFormStep";
import AdditionalCoverageStep, {
  AdditionalCoverageData,
} from "@/components/forms/steps/AdditionalCoverageStep";
import ServicesFormStep from "@/components/forms/steps/ServicesFormStep";
import PreguntasGeneralesStep from "@/components/forms/steps/PreguntasGeneralesStep";
import CoberturasFormStep from "@/components/forms/steps/CoberturasFormStep";
import RCResumenStep from "@/components/forms/steps/RCResumenStep";

import LoadingScreen from "@/components/ui/LoadingScreen";
import { useToast } from "@/components/ui/use-toast";
import { getOrCreateTempSession, getEffectiveSessionId } from "@/lib/session";
import FabricacionFormStep from "@/components/forms/steps/FabricacionFormStep";
import SiniestralidadStep from "@/components/forms/steps/SiniestralidadStep";

// Definir los tipos de datos para los formularios de servicios
interface ServiciosData {
  subcontrata_personal?: boolean;
  trabajos_corte_soldadura?: boolean;
  trabajos_afectan_edificios?: boolean;
  trabajos_afectan_infraestructuras?: boolean;
  trabajos_instalaciones_terceros?: boolean;
  cubre_preexistencias?: boolean;
}

// Definir los tipos de datos para los formularios de fabricación/manufacturación
interface ManufacturaData {
  trabajos_fuera_instalaciones?: boolean;
  corte_soldadura?: boolean;
  trabajo_equipos_electronicos?: boolean;
  empleados_tecnicos?: boolean;
  trabajos_subcontratistas?: boolean;
  afecta_edificios_vecinos?: boolean;
  afecta_instalaciones_subterraneas?: boolean;
  trabajos_bienes_preexistentes?: boolean;
}

function ResponsabilidadCivilFormContent() {
  const router = useRouter();
  const { toast } = useToast();
  const { formData, dispatch, goToStep, submitForm } = useFormContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  // Estado para controlar los subpasos cuando hay múltiples opciones seleccionadas
  const [subStep, setSubStep] = useState(1);

  useEffect(() => {
    // Set the form type
    dispatch({
      type: "SET_FORM_TYPE",
      payload: "responsabilidad_civil",
    });

    // Create temporary session ID
    getOrCreateTempSession();

    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [dispatch]);

  // Efecto para manejar la navegación condicional en el paso 3
  useEffect(() => {
    // Verificar si estamos en el paso 3 y necesitamos determinar qué componente mostrar
    if (formData.step === 3) {
      const hasAnyOption =
        formData.company?.manufactures ||
        formData.company?.markets ||
        formData.company?.diseno ||
        formData.company?.almacenamiento ||
        formData.company?.provides_services;

      // Si no hay ninguna opción seleccionada, saltar al paso 4
      if (!hasAnyOption) {
        goToStep(4);
      }
    }
  }, [formData.step, formData.company, goToStep]);

  // Efecto para reiniciar el subStep cuando se navega a otros pasos
  useEffect(() => {
    if (formData.step !== 3) {
      setSubStep(1);
    }
  }, [formData.step]);

  // If loading, show loading screen
  if (loading) {
    return <LoadingScreen message="Cargando formulario..." />;
  }

  // Step 3: Activity-specific details based on company type
  const handleActividadNext = (data: any) => {
    // Log para depuración
    console.log("DEBUG - handleActividadNext:", data, formData);

    // Guardar datos según el tipo de actividad
    const providesServices = formData.company?.provides_services || false;
    const hasOtherOptions =
      formData.company?.manufactures ||
      formData.company?.markets ||
      formData.company?.diseno ||
      formData.company?.almacenamiento;

    if (providesServices && !hasOtherOptions) {
      // Si solo tiene servicios, guardar en el contexto de servicios
      dispatch({
        type: "SET_ACTIVIDAD_SERVICIOS",
        payload: data,
      });
    } else {
      // Si tiene manufactura u otras opciones, guardar en el contexto de manufactura
      // Asegurarse de preservar todos los datos de manufactura existentes
      const currentManufacturaData = formData.actividad?.manufactura || {};
      const updatedManufacturaData = {
        ...currentManufacturaData,
        ...data,
      };

      console.log(
        "DEBUG - Datos actualizados de manufactura:",
        updatedManufacturaData
      );

      dispatch({
        type: "SET_ACTIVIDAD_MANUFACTURA",
        payload: updatedManufacturaData,
      });
    }

    toast({
      title: "Información guardada",
      description: "Los detalles de actividad han sido guardados",
      duration: 2000,
    });

    goToStep(4);
  };

  const handleActividadBack = () => {
    goToStep(2);
  };

  // Función para manejar la navegación entre subpasos
  const handleSubStepNext = (data: any, isManufactura: boolean) => {
    if (isManufactura) {
      // Log detallado de los datos recibidos
      console.log(
        "DEBUG - handleSubStepNext (manufactura) - DATOS RECIBIDOS:",
        data
      );

      // Log más explícito para ver exactamente la estructura JSON
      console.log(
        "DEBUG - DATOS CRUDOS RECIBIDOS DE FABRICACIÓN:",
        JSON.stringify(data)
      );

      // Verificar si los campos necesarios están presentes
      console.log(
        "DEBUG - handleSubStepNext - ¿producto_intermedio_final existe?",
        "producto_intermedio_final" in data
      );
      console.log(
        "DEBUG - handleSubStepNext - ¿producto_consumo_humano existe?",
        "producto_consumo_humano" in data
      );

      // Verificación más detallada de los campos críticos
      console.log("CAMPOS CRÍTICOS:", {
        "producto_intermedio_final existe": "producto_intermedio_final" in data,
        "valor de producto_intermedio_final": data.producto_intermedio_final,
        "tipo de producto_intermedio_final":
          typeof data.producto_intermedio_final,

        "producto_consumo_humano existe": "producto_consumo_humano" in data,
        "valor de producto_consumo_humano": data.producto_consumo_humano,
        "tipo de producto_consumo_humano": typeof data.producto_consumo_humano,
      });

      // Asegurarse de que los campos específicos se preserven con valores explícitos
      const manufacturaData = {
        ...data,
        // Asegurar que estos campos siempre estén presentes
        producto_intermedio_final:
          data.producto_intermedio_final === "intermedio"
            ? "intermedio"
            : "final",
        producto_consumo_humano: data.producto_consumo_humano === true,
      };

      console.log(
        "DEBUG - handleSubStepNext - Datos procesados de manufactura:",
        manufacturaData
      );
      console.log("DEBUG - handleSubStepNext - Valores críticos finales:", {
        producto_intermedio_final: manufacturaData.producto_intermedio_final,
        producto_consumo_humano: manufacturaData.producto_consumo_humano,
      });

      // Log final de los datos que se enviarán al reducer
      console.log(
        "DATOS FINALES QUE SE ENVÍAN AL REDUCER:",
        JSON.stringify(manufacturaData)
      );

      // Guardar datos de fabricación con los campos garantizados
      dispatch({
        type: "SET_ACTIVIDAD_MANUFACTURA",
        payload: manufacturaData,
      });

      // Si hay servicios también, ir al segundo subpaso
      if (formData.company?.provides_services) {
        setSubStep(2);
      } else {
        // Si no hay servicios, seguir al siguiente paso principal
        handleActividadNext(manufacturaData);
      }
    } else {
      // Log para depuración
      console.log("DEBUG - handleSubStepNext (servicios):", data);

      // Guardar datos de servicios
      dispatch({
        type: "SET_ACTIVIDAD_SERVICIOS",
        payload: data,
      });

      // Siempre avanzar al siguiente paso principal después de servicios
      handleActividadNext(data);
    }
  };

  // Step 1: Company Info
  const handleCompanyNext = (
    data: CompanyFormData,
    empresaTipo: EmpresaTipo
  ) => {
    // Save to local context
    dispatch({
      type: "SET_COMPANY",
      payload: data,
      empresaTipo,
    });

    // Show success message
    toast({
      title: "Información guardada",
      description: "Los datos de tu empresa han sido guardados",
      duration: 2000,
    });

    // Advance to next step
    goToStep(2);
  };

  // Step 2: Additional Coverage
  const handleAdditionalCoverageNext = (data: AdditionalCoverageData) => {
    // Save to local context - using SET_COBERTURAS since we need to use an existing action type
    dispatch({
      type: "SET_COBERTURAS",
      payload: {
        coberturas_adicionales: data,
      },
    });

    // Show success message
    toast({
      title: "Coberturas adicionales guardadas",
      description: "La información de coberturas adicionales ha sido guardada",
      duration: 2000,
    });

    // Advance to next step
    goToStep(3);
  };

  const handleAdditionalCoverageBack = () => {
    goToStep(1);
  };

  // Step 4: Siniestralidad
  const handleSiniestralidadNext = (data: any) => {
    dispatch({
      type: "SET_SINIESTRALIDAD",
      payload: data,
    });

    toast({
      title: "Información guardada",
      description: "Los datos de siniestralidad han sido guardados",
      duration: 2000,
    });

    goToStep(5);
  };

  const handleSiniestralidadBack = () => {
    // Lógica para determinar a qué paso volver
    const providesServices = formData.company?.provides_services || false;
    const hasOtherOptions =
      formData.company?.manufactures ||
      formData.company?.markets ||
      formData.company?.diseno ||
      formData.company?.almacenamiento;

    // Si hay alguna opción que debería mostrar el paso 3, volver a él
    if (providesServices || hasOtherOptions) {
      goToStep(3);
    } else {
      // Si no, volver al paso 2
      goToStep(2);
    }
  };

  // Step 5: Contact Information
  const handleContactNext = (data: ContactFormData) => {
    // Save to local context
    dispatch({ type: "SET_CONTACT", payload: data });

    // Advance to summary step
    goToStep(6);
  };

  const handleContactBack = () => {
    goToStep(4);
  };

  // En ResponsabilidadCivilForm.tsx, modifica la función handleSubmit
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Forzar el uso de sessionId desde localStorage si está disponible
      // o crear uno nuevo si es necesario
      const tempSessionId =
        localStorage.getItem("smart_advice_temp_session_id") || "";
      const permanentSessionId =
        localStorage.getItem("smart_advice_session_id") || "";
      const sessionId =
        permanentSessionId || tempSessionId || crypto.randomUUID();

      console.log("Usando session_id para enviar formulario:", sessionId);
      console.log("===== DEBUG LOCALSTORAGE =====");
      console.log(
        "smart_advice_session_id:",
        localStorage.getItem("smart_advice_session_id")
      );
      console.log(
        "smart_advice_temp_session_id:",
        localStorage.getItem("smart_advice_temp_session_id")
      );
      console.log(
        "last_used_session_id:",
        localStorage.getItem("last_used_session_id")
      );
      console.log(
        "last_used_form_session_id:",
        localStorage.getItem("last_used_form_session_id")
      );
      console.log("session_id:", localStorage.getItem("session_id"));
      console.log("formData:", localStorage.getItem("formData"));
      console.log("===== END DEBUG LOCALSTORAGE =====");
      console.log("Iniciando envío del formulario...");
      const result = await submitForm();
      console.log("Formulario enviado exitosamente:", result);

      // Forzar el uso del mismo session_id para la redirección
      console.log("Usando session_id para redirección:", sessionId);

      // Guardar este session_id en localStorage con una clave específica para este propósito
      localStorage.setItem("last_used_form_session_id", sessionId);

      toast({
        title: "Formulario enviado",
        description: "Redirigiendo a tus recomendaciones personalizadas...",
        duration: 2000,
      });

      // Redirect to recommendations page with EXPLICIT session_id
      setTimeout(() => {
        // Forzar el uso del mismo session_id en la redirección
        const redirectUrl = `/recomendaciones?tipo=responsabilidad_civil&session_id=${sessionId}`;
        console.log("Redirigiendo a:", redirectUrl);
        router.push(redirectUrl);
      }, 2000);
    } catch (error) {
      console.error("Error al enviar formulario:", error);

      toast({
        title: "Error",
        description:
          "Ha ocurrido un error al procesar tu solicitud. Por favor, inténtalo de nuevo.",
        variant: "destructive",
        duration: 5000,
      });

      setIsSubmitting(false);
    }
  };

  const handleSummaryBack = () => {
    goToStep(5);
  };

  const startNewForm = () => {
    // Clear ALL localStorage data
    localStorage.removeItem("session_data");
    localStorage.removeItem("session_id");
    localStorage.removeItem("formData");

    // Reset form context
    dispatch({ type: "RESET_FORM" });

    // Force reload the page to ensure clean state
    window.location.href = "/responsabilidad-civil";
  };

  // Función para determinar qué componente mostrar en el paso 3
  const getStep3Component = () => {
    const providesServices = formData.company?.provides_services || false;
    const hasOtherOptions =
      formData.company?.manufactures ||
      formData.company?.markets ||
      formData.company?.diseno ||
      formData.company?.almacenamiento;

    // Si SOLO tiene Prestación de servicios (sin otras opciones)
    if (providesServices && !hasOtherOptions) {
      // Crear un objeto nuevo con los valores por defecto
      // En lugar de intentar acceder directamente a las propiedades
      const defaultServiciosValues: ServiciosData = {
        subcontrata_personal: false,
        trabajos_corte_soldadura: false,
        trabajos_afectan_edificios: false,
        trabajos_afectan_infraestructuras: false,
        trabajos_instalaciones_terceros: false,
        cubre_preexistencias: false,
      };

      // Si hay datos guardados y son del tipo correcto, intentar usarlos
      if (formData.actividad?.servicios) {
        try {
          const servicios = formData.actividad
            .servicios as unknown as ServiciosData;
          if (typeof servicios.subcontrata_personal === "boolean") {
            defaultServiciosValues.subcontrata_personal =
              servicios.subcontrata_personal;
          }
          if (typeof servicios.trabajos_corte_soldadura === "boolean") {
            defaultServiciosValues.trabajos_corte_soldadura =
              servicios.trabajos_corte_soldadura;
          }
          if (typeof servicios.trabajos_afectan_edificios === "boolean") {
            defaultServiciosValues.trabajos_afectan_edificios =
              servicios.trabajos_afectan_edificios;
          }
          if (
            typeof servicios.trabajos_afectan_infraestructuras === "boolean"
          ) {
            defaultServiciosValues.trabajos_afectan_infraestructuras =
              servicios.trabajos_afectan_infraestructuras;
          }
          if (typeof servicios.trabajos_instalaciones_terceros === "boolean") {
            defaultServiciosValues.trabajos_instalaciones_terceros =
              servicios.trabajos_instalaciones_terceros;
          }
          if (typeof servicios.cubre_preexistencias === "boolean") {
            defaultServiciosValues.cubre_preexistencias =
              servicios.cubre_preexistencias;
          }
        } catch (error) {
          console.error("Error al convertir datos de servicios:", error);
        }
      }

      return (
        <ServicesFormStep
          onNext={(data: any) => handleActividadNext(data)}
          onBack={handleActividadBack}
          defaultValues={defaultServiciosValues}
        />
      );
    } else if (hasOtherOptions && providesServices) {
      // Si tiene Prestación de servicios Y otras opciones, mostrar ambos formularios
      // En este caso, implementamos una secuencia de pasos dentro del paso 3

      // Crear un objeto nuevo con los valores por defecto para servicios
      const defaultServiciosValues: ServiciosData = {
        subcontrata_personal: false,
        trabajos_corte_soldadura: false,
        trabajos_afectan_edificios: false,
        trabajos_afectan_infraestructuras: false,
        trabajos_instalaciones_terceros: false,
        cubre_preexistencias: false,
      };

      // Si hay datos guardados para servicios, intentar usarlos
      if (formData.actividad?.servicios) {
        try {
          const servicios = formData.actividad
            .servicios as unknown as ServiciosData;
          if (typeof servicios.subcontrata_personal === "boolean") {
            defaultServiciosValues.subcontrata_personal =
              servicios.subcontrata_personal;
          }
          if (typeof servicios.trabajos_corte_soldadura === "boolean") {
            defaultServiciosValues.trabajos_corte_soldadura =
              servicios.trabajos_corte_soldadura;
          }
          if (typeof servicios.trabajos_afectan_edificios === "boolean") {
            defaultServiciosValues.trabajos_afectan_edificios =
              servicios.trabajos_afectan_edificios;
          }
          if (
            typeof servicios.trabajos_afectan_infraestructuras === "boolean"
          ) {
            defaultServiciosValues.trabajos_afectan_infraestructuras =
              servicios.trabajos_afectan_infraestructuras;
          }
          if (typeof servicios.trabajos_instalaciones_terceros === "boolean") {
            defaultServiciosValues.trabajos_instalaciones_terceros =
              servicios.trabajos_instalaciones_terceros;
          }
          if (typeof servicios.cubre_preexistencias === "boolean") {
            defaultServiciosValues.cubre_preexistencias =
              servicios.cubre_preexistencias;
          }
        } catch (error) {
          console.error("Error al convertir datos de servicios:", error);
        }
      }

      if (subStep === 1) {
        // Mostrar FabricacionFormStep primero
        return (
          <div>
            <h2 className="text-center text-xl font-semibold mb-4">
              Preguntas sobre Fabricación/Diseño/Comercialización (Paso 1 de 2)
            </h2>
            <FabricacionFormStep
              onNext={(data: any) => handleSubStepNext(data, true)}
              onBack={handleActividadBack}
              defaultValues={formData.actividad?.manufactura}
            />
          </div>
        );
      } else {
        // Mostrar ServicesFormStep en segundo lugar
        return (
          <div>
            <h2 className="text-center text-xl font-semibold mb-4">
              Preguntas sobre Prestación de Servicios (Paso 2 de 2)
            </h2>
            <ServicesFormStep
              onNext={(data: any) => handleSubStepNext(data, false)}
              onBack={() => setSubStep(1)} // Volver al subpaso anterior
              defaultValues={defaultServiciosValues}
            />
          </div>
        );
      }
    } else if (hasOtherOptions) {
      // Si solo tiene otras opciones (sin Prestación de servicios)
      return (
        <FabricacionFormStep
          onNext={(data: any) => handleActividadNext(data)}
          onBack={handleActividadBack}
          defaultValues={formData.actividad?.manufactura}
        />
      );
    } else {
      // Si no seleccionó ninguna opción (debería ser manejado por el useEffect)
      return <LoadingScreen message="Procesando información..." />;
    }
  };

  // Render the current form step
  const renderStep = () => {
    switch (formData.step) {
      case 1:
        return (
          <CompanyFormStep
            onNext={handleCompanyNext}
            onBack={() => router.push("/seguros")}
            defaultValues={formData.company}
          />
        );
      case 2:
        return (
          <AdditionalCoverageStep
            onNext={handleAdditionalCoverageNext}
            onBack={handleAdditionalCoverageBack}
            defaultValues={
              formData.coberturas_solicitadas?.coberturas_adicionales
            }
            formType={formData.form_type}
          />
        );
      case 3:
        return getStep3Component();
      case 4:
        return (
          <SiniestralidadStep
            onNext={handleSiniestralidadNext}
            onBack={handleSiniestralidadBack}
            defaultValues={formData.siniestralidad}
          />
        );
      case 5:
        return (
          <ContactFormStep
            onNext={handleContactNext}
            onBack={handleContactBack}
            defaultValues={formData.contact}
          />
        );
      case 6:
        return (
          <RCResumenStep
            onSubmit={handleSubmit}
            onBack={handleSummaryBack}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return <div>Paso no válido</div>;
    }
  };

  return (
    <div className="min-h-screen">
      {renderStep()}
      <div className="text-center mt-4 mb-8">
        <button
          onClick={startNewForm}
          className="text-sm text-blue-600 hover:underline"
        >
          Comenzar nuevo formulario
        </button>
      </div>
    </div>
  );
}

export default function ResponsabilidadCivilForm() {
  return (
    <FormProvider>
      <ResponsabilidadCivilFormContent />
    </FormProvider>
  );
}
