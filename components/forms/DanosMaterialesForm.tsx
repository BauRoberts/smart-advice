"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useFormContext } from "@/contexts/FormContext";
import ContactFormStep from "@/components/forms/steps/ContactFormStep";
import InformacionGeneralStep from "@/components/forms/steps/InformacionGeneralStep";
import { InformacionGeneralData } from "@/components/forms/steps/InformacionGeneralStep";
import CapitalesYCoberturasStep from "@/components/forms/steps/CapitalesYCoberturasStep"; // Importar nuevo componente
import { CapitalesYCoberturasData } from "@/components/forms/steps/CapitalesYCoberturasStep"; // Importar el tipo
import ConstruccionStep from "@/components/forms/steps/ConstruccionStep";
import ProteccionIncendiosStep from "@/components/forms/steps/ProteccionIncendiosStep";
import ProteccionRoboStep from "@/components/forms/steps/ProteccionRoboStep";
import SiniestralidadStep from "@/components/forms/steps/SiniestralidadStep";
import DanosResumenStep from "@/components/forms/steps/DanosResumenStep";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useToast } from "@/components/ui/use-toast";

import { getOrCreateTempSession, getEffectiveSessionId } from "@/lib/session";

function DanosMaterialesFormContent() {
  const router = useRouter();
  const { formData, dispatch, goToStep, submitForm } = useFormContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set the form type
    dispatch({
      type: "SET_FORM_TYPE",
      payload: "danos-materiales", // Cambiado de "danos_materiales" a "danos-materiales"
    });

    // Create temporary session ID
    getOrCreateTempSession();

    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [dispatch]);

  // If loading, show loading screen
  if (loading) {
    return <LoadingScreen message="Cargando formulario..." />;
  }

  // Step 1: Información General (nuevo primer paso)
  const handleInformacionGeneralNext = (data: InformacionGeneralData) => {
    // Save to local context
    dispatch({
      type: "SET_INFORMACION_GENERAL",
      payload: data,
    });

    // Show success message
    toast({
      title: "Información guardada",
      description: "La información general ha sido guardada",
      duration: 2000,
    });

    // Advance to next step
    goToStep(2);
  };

  // Step 2: Información de las Instalaciones (anterior Construcción)
  const handleConstruccionNext = (data: any) => {
    dispatch({ type: "SET_CONSTRUCCION", payload: data });
    goToStep(3);
  };

  const handleConstruccionBack = () => {
    goToStep(1);
  };

  // Step 3: Protecciones contra Incendio
  const handleProteccionIncendiosNext = (data: any) => {
    dispatch({ type: "SET_PROTECCION_INCENDIOS", payload: data });
    goToStep(4);
  };

  const handleProteccionIncendiosBack = () => {
    goToStep(2);
  };

  // Step 4: Protecciones contra Robo
  const handleProteccionRoboNext = (data: any) => {
    dispatch({ type: "SET_PROTECCION_ROBO", payload: data });
    goToStep(5);
  };

  const handleProteccionRoboBack = () => {
    goToStep(3);
  };

  // Step 5: Capitales a asegurar y Coberturas (combinando capitales con coberturas)
  const handleCapitalesYCoberturasNext = (data: CapitalesYCoberturasData) => {
    dispatch({ type: "SET_CAPITALES_Y_COBERTURAS", payload: data });
    goToStep(6);
  };

  const handleCapitalesYCoberturasBack = () => {
    goToStep(4);
  };

  // Step 6: Siniestralidad
  const handleSiniestralidadNext = (data: any) => {
    dispatch({ type: "SET_SINIESTRALIDAD", payload: data });
    goToStep(7);
  };

  const handleSiniestralidadBack = () => {
    goToStep(5);
  };

  // Step 7: Información de Contacto
  const handleContactNext = (data: any) => {
    // Save to local context
    dispatch({ type: "SET_CONTACT", payload: data });

    // Advance to summary step
    goToStep(8);
  };

  const handleContactBack = () => {
    goToStep(6);
  };

  // Actualización para asegurar la consistencia del session_id

  // Modificar la función handleSubmit en DanosMaterialesForm.tsx para redirigir a la API específica

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      console.log("Iniciando envío del formulario de daños materiales...");

      // Obtener session_id
      const sessionId = getEffectiveSessionId();
      if (!sessionId) {
        throw new Error("No session ID available");
      }

      console.log("Session ID para envío:", sessionId);

      // Asegurarnos de que form_type esté presente y sea correcto
      formData.form_type = "danos-materiales";

      // Enviamos directamente a la API específica de daños materiales
      const response = await fetch("/api/forms/danos-materiales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          form_type: "danos-materiales",
          form_data: formData,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Formulario enviado exitosamente:", result);

      toast({
        title: "Formulario enviado",
        description: "Redirigiendo a tus recomendaciones personalizadas...",
        duration: 2000,
      });

      // Guardamos explícitamente el sessionId en localStorage para asegurar consistencia
      localStorage.setItem("current_session_id", sessionId);

      // IMPORTANTE: Redirigir directamente a nuestra API específica en lugar de la general
      // Usar window.location.href para garantizar una recarga completa
      setTimeout(() => {
        // Use the specific danos-materiales page instead of the general recommendations page
        window.location.href = `/recomendaciones/danos-materiales?session_id=${sessionId}`;
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

  const handleResumenBack = () => {
    goToStep(7);
  };

  const startNewForm = () => {
    // Clear ALL localStorage data
    localStorage.removeItem("session_data");
    localStorage.removeItem("session_id");
    localStorage.removeItem("formData");

    // Reset form context
    dispatch({ type: "RESET_FORM" });

    // Force reload the page to ensure clean state
    window.location.href = "/danos-materiales";
  };

  // Render the current form step
  const renderStep = () => {
    switch (formData.step) {
      case 1:
        return (
          <InformacionGeneralStep
            onNext={handleInformacionGeneralNext}
            onBack={() => router.push("/seguros")}
            defaultValues={formData.informacion_general}
          />
        );
      case 2:
        return (
          <ConstruccionStep
            onNext={handleConstruccionNext}
            onBack={handleConstruccionBack}
            defaultValues={formData.construccion}
          />
        );
      case 3:
        return (
          <ProteccionIncendiosStep
            onNext={handleProteccionIncendiosNext}
            onBack={handleProteccionIncendiosBack}
            defaultValues={{
              ...formData.proteccion_incendios,
              columnas_hidrantes_tipo: formData.proteccion_incendios
                ?.columnas_hidrantes_tipo as "publico" | "privado" | undefined,
            }}
          />
        );
      case 4:
        return (
          <ProteccionRoboStep
            onNext={handleProteccionRoboNext}
            onBack={handleProteccionRoboBack}
            defaultValues={formData.proteccion_robo}
          />
        );
      case 5:
        return (
          <CapitalesYCoberturasStep
            onNext={handleCapitalesYCoberturasNext}
            onBack={handleCapitalesYCoberturasBack}
            defaultValues={formData.capitales_y_coberturas}
          />
        );
      case 6:
        return (
          <SiniestralidadStep
            onNext={handleSiniestralidadNext}
            onBack={handleSiniestralidadBack}
            defaultValues={formData.siniestralidad}
          />
        );
      case 7:
        return (
          <ContactFormStep
            onNext={handleContactNext}
            onBack={handleContactBack}
            defaultValues={formData.contact}
          />
        );
      case 8:
        return (
          <DanosResumenStep
            onSubmit={handleSubmit}
            onBack={handleResumenBack}
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

// Main component that wraps with context
export default function DanosMaterialesForm() {
  return (
    <FormProvider>
      <DanosMaterialesFormContent />
    </FormProvider>
  );
}
