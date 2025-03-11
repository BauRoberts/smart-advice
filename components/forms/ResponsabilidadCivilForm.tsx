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
import ManufacturaFormStep from "@/components/forms/steps/ManufacturaFormStep";
import ServiciosFormStep from "@/components/forms/steps/ServiciosFormStep";
import CoberturasFormStep from "@/components/forms/steps/CoberturasFormStep";
import FormSummaryStep from "@/components/forms/steps/FormSummaryStep";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { toast } from "@/components/ui/toast"; // Asumiendo que tienes un componente de toast

function ResponsabilidadCivilFormContent() {
  const router = useRouter();
  const { formData, dispatch, goToStep, submitForm } = useFormContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Establecer el tipo de formulario
    dispatch({
      type: "SET_FORM_TYPE",
      payload: "responsabilidad_civil",
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
  const handleContactNext = async (data: ContactFormData) => {
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
  const handleCompanyNext = async (
    data: CompanyFormData,
    empresaTipo: EmpresaTipo
  ) => {
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
          tipo_empresa: empresaTipo,
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

  // Paso 3: Actividad específica según tipo de empresa
  const handleActividadNext = () => {
    goToStep(4);
  };

  const handleActividadBack = () => {
    goToStep(2);
  };

  // Paso 4: Coberturas y ámbito territorial
  const handleCoberturasNext = () => {
    goToStep(5);
  };

  const handleCoberturasBack = () => {
    goToStep(3);
  };

  // Paso 5: Resumen y confirmación
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitForm();

      // Clear ALL data after successful submission if needed
      // localStorage.removeItem("session_data");
      // localStorage.removeItem("session_id");
      // localStorage.removeItem("formData");

      toast({
        title: "Formulario enviado",
        description: "Redirigiendo a tus recomendaciones personalizadas...",
        duration: 2000,
      });

      // Modificar redirección para incluir el parámetro tipo basado en el formulario actual
      setTimeout(() => {
        const formType = formData.form_type; // O un valor fijo según el formulario
        router.push(`/recomendaciones?tipo=responsabilidad_civil`);
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
    goToStep(4);
  };

  const handleCompanyBack = () => {
    goToStep(1); // Go back to contact step
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
    window.location.href = "/responsabilidad-civil";
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
            onBack={handleCompanyBack}
            defaultValues={formData.company}
          />
        );
      case 3:
        return formData.empresaTipo === "manufactura" ? (
          <ManufacturaFormStep
            onNext={handleActividadNext}
            onBack={handleActividadBack}
            defaultValues={formData.actividad.manufactura}
          />
        ) : (
          <ServiciosFormStep
            onNext={handleActividadNext}
            onBack={handleActividadBack}
            defaultValues={formData.actividad.servicios}
          />
        );
      case 4:
        return (
          <CoberturasFormStep
            onNext={handleCoberturasNext}
            onBack={handleCoberturasBack}
            defaultValues={{
              ambito_territorial: formData.ambito_territorial,
              coberturas_solicitadas: formData.coberturas_solicitadas,
            }}
          />
        );
      case 5:
        return (
          <FormSummaryStep
            onSubmit={handleSubmit}
            onBack={handleSummaryBack}
            formData={formData}
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
export default function ResponsabilidadCivilForm() {
  return (
    <FormProvider>
      <ResponsabilidadCivilFormContent />
    </FormProvider>
  );
}
