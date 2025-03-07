// components/forms/DanosMaterialesForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useFormContext } from "@/contexts/FormContext";
import ContactFormStep from "@/components/forms/steps/ContactFormStep";
import CompanyFormStep from "@/components/forms/steps/CompanyFormStep";
import CapitalesStep from "@/components/forms/steps/CapitalesStep";
import ConstruccionStep from "@/components/forms/steps/ConstruccionStep";
import ProteccionIncendiosStep from "@/components/forms/steps/ProteccionIncendiosStep";
import ProteccionRoboStep from "@/components/forms/steps/ProteccionRoboStep";
import SiniestralidadStep from "@/components/forms/steps/SiniestralidadStep";
import DanosResumenStep from "@/components/forms/steps/DanosResumenStep";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { toast } from "@/components/ui/toast";

function DanosMaterialesFormContent() {
  const router = useRouter();
  const { formData, dispatch, goToStep, submitForm } = useFormContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Establecer el tipo de formulario
    dispatch({
      type: "SET_FORM_TYPE",
      payload: "danos_materiales",
    });

    // Recuperar sessionId del localStorage si existe
    const storedSessionId = localStorage.getItem("session_id");
    if (storedSessionId) {
      setSessionId(storedSessionId);
    }

    // Simular tiempo de carga
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [dispatch]);

  // Si está cargando, mostrar pantalla de carga
  if (loading) {
    return <LoadingScreen message="Cargando formulario..." />;
  }

  // Paso 1: Datos de contacto - con guardado incremental
  const handleContactNext = async (data: any) => {
    try {
      // Guardar en el contexto local
      dispatch({ type: "SET_CONTACT", payload: data });

      // Mostrar indicador de carga
      const savingToast = toast({
        title: "Guardando datos...",
        description: "Estamos guardando tu información de contacto",
        duration: 2000,
      });

      // Guardar en la API
      const contactResponse = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!contactResponse.ok) {
        throw new Error("Error al guardar datos de contacto");
      }

      const contactData = await contactResponse.json();

      // Guardar el session_id
      if (contactData.session_id) {
        localStorage.setItem("session_id", contactData.session_id);
        setSessionId(contactData.session_id);
      }

      // Mostrar mensaje de éxito
      toast({
        title: "Información guardada",
        description: "Tus datos de contacto han sido guardados",
        duration: 2000,
      });

      // Avanzar al siguiente paso
      goToStep(2);
    } catch (error) {
      console.error("Error al guardar datos de contacto:", error);

      // Mostrar mensaje de error
      toast({
        title: "Error",
        description:
          "No pudimos guardar tus datos de contacto, pero puedes continuar",
        variant: "destructive",
        duration: 3000,
      });

      // Aún así, avanzar al siguiente paso
      goToStep(2);
    }
  };

  // Paso 2: Datos de empresa - con guardado incremental
  const handleCompanyNext = async (data: any, empresaTipo: any) => {
    try {
      // Guardar en el contexto local
      dispatch({
        type: "SET_COMPANY",
        payload: data,
        empresaTipo,
      });

      // Mostrar indicador de carga
      toast({
        title: "Guardando datos...",
        description: "Estamos guardando la información de tu empresa",
        duration: 2000,
      });

      // Si no hay session_id, significa que hubo un problema en el paso anterior
      if (!sessionId && !localStorage.getItem("session_id")) {
        throw new Error(
          "No se encontró ID de sesión para guardar los datos de empresa"
        );
      }

      // Usar el sessionId del estado o del localStorage
      const currentSessionId = sessionId || localStorage.getItem("session_id");

      // Guardar en la API
      const companyResponse = await fetch("/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: currentSessionId,
          ...data,
        }),
      });

      if (!companyResponse.ok) {
        throw new Error("Error al guardar datos de empresa");
      }

      // Mostrar mensaje de éxito
      toast({
        title: "Información guardada",
        description: "Los datos de tu empresa han sido guardados",
        duration: 2000,
      });

      // Avanzar al siguiente paso
      goToStep(3);
    } catch (error) {
      console.error("Error al guardar datos de empresa:", error);

      // Mostrar mensaje de error
      toast({
        title: "Error",
        description:
          "No pudimos guardar los datos de tu empresa, pero puedes continuar",
        variant: "destructive",
        duration: 3000,
      });

      // Aún así, avanzar al siguiente paso
      goToStep(3);
    }
  };

  // Paso 3: Capitales a asegurar
  const handleCapitalesNext = (data: any) => {
    dispatch({ type: "SET_CAPITALES", payload: data });
    goToStep(4);
  };

  const handleCapitalesBack = () => {
    goToStep(2);
  };

  // Paso 4: Características constructivas
  const handleConstruccionNext = (data: any) => {
    dispatch({ type: "SET_CONSTRUCCION", payload: data });
    goToStep(5);
  };

  const handleConstruccionBack = () => {
    goToStep(3);
  };

  // Paso 5: Protección contra incendios
  const handleProteccionIncendiosNext = (data: any) => {
    dispatch({ type: "SET_PROTECCION_INCENDIOS", payload: data });
    goToStep(6);
  };

  const handleProteccionIncendiosBack = () => {
    goToStep(4);
  };

  // Paso 6: Protección contra robo
  const handleProteccionRoboNext = (data: any) => {
    dispatch({ type: "SET_PROTECCION_ROBO", payload: data });
    goToStep(7);
  };

  const handleProteccionRoboBack = () => {
    goToStep(5);
  };

  // Paso 7: Siniestralidad
  const handleSiniestralidadNext = (data: any) => {
    dispatch({ type: "SET_SINIESTRALIDAD", payload: data });
    goToStep(8);
  };

  const handleSiniestralidadBack = () => {
    goToStep(6);
  };

  // Paso 8: Resumen y confirmación
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitForm();

      // Clear ALL data after successful submission
      localStorage.removeItem("session_data");
      localStorage.removeItem("session_id");
      localStorage.removeItem("formData");

      toast({
        title: "Formulario enviado",
        description: "Redirigiendo a tus recomendaciones personalizadas...",
        duration: 2000,
      });

      setTimeout(() => {
        router.push("/recomendaciones");
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

    // Reset session state
    setSessionId(null);

    // Force reload the page to ensure clean state
    window.location.href = "/danos-materiales";
  };

  // Renderizar el paso actual del formulario
  const renderStep = () => {
    switch (formData.step) {
      case 1:
        return (
          <ContactFormStep
            onNext={handleContactNext}
            defaultValues={formData.contact}
          />
        );
      case 2:
        return (
          <CompanyFormStep
            onNext={handleCompanyNext}
            onBack={() => goToStep(1)}
            defaultValues={formData.company}
          />
        );
      case 3:
        return (
          <CapitalesStep
            onNext={handleCapitalesNext}
            onBack={handleCapitalesBack}
            defaultValues={formData.capitales}
          />
        );
      case 4:
        return (
          <ConstruccionStep
            onNext={handleConstruccionNext}
            onBack={handleConstruccionBack}
            defaultValues={formData.construccion}
          />
        );
      case 5:
        return (
          <ProteccionIncendiosStep
            onNext={handleProteccionIncendiosNext}
            onBack={handleProteccionIncendiosBack}
            defaultValues={formData.proteccion_incendios}
          />
        );
      case 6:
        return (
          <ProteccionRoboStep
            onNext={handleProteccionRoboNext}
            onBack={handleProteccionRoboBack}
            defaultValues={formData.proteccion_robo}
          />
        );
      case 7:
        return (
          <SiniestralidadStep
            onNext={handleSiniestralidadNext}
            onBack={handleSiniestralidadBack}
            defaultValues={formData.siniestralidad}
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
      <button
        onClick={startNewForm}
        className="text-sm text-blue-600 hover:underline"
      >
        Comenzar nuevo formulario
      </button>
    </div>
  );
}

// Componente principal que envuelve con el contexto
export default function DanosMaterialesForm() {
  return (
    <FormProvider>
      <DanosMaterialesFormContent />
    </FormProvider>
  );
}
