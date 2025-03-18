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
import { toast } from "@/components/ui/toast";
import { getOrCreateTempSession } from "@/lib/session";

function ResponsabilidadCivilFormContent() {
  const router = useRouter();
  const { formData, dispatch, goToStep, submitForm } = useFormContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

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

  // If loading, show loading screen
  if (loading) {
    return <LoadingScreen message="Cargando formulario..." />;
  }

  // Step 1: Company Info (moved from step 2)
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

  // Step 2: Activity-specific details based on company type
  const handleActividadNext = () => {
    goToStep(3);
  };

  const handleActividadBack = () => {
    goToStep(1);
  };

  // Step 3: Coverage and territorial scope
  const handleCoberturasNext = () => {
    goToStep(4);
  };

  const handleCoberturasBack = () => {
    goToStep(2);
  };

  // Step 4: Contact Information (moved from step 1)
  const handleContactNext = (data: ContactFormData) => {
    // Save to local context
    dispatch({ type: "SET_CONTACT", payload: data });

    // Advance to summary step
    goToStep(5);
  };

  const handleContactBack = () => {
    goToStep(3);
  };

  // Step 5: Summary and submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      console.log("Iniciando envío del formulario...");
      const result = await submitForm();
      console.log("Formulario enviado exitosamente:", result);

      toast({
        title: "Formulario enviado",
        description: "Redirigiendo a tus recomendaciones personalizadas...",
        duration: 2000,
      });

      // Redirect to recommendations page with the form type parameter
      setTimeout(() => {
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
      case 3:
        return (
          <CoberturasFormStep
            onNext={handleCoberturasNext}
            onBack={handleActividadBack}
            defaultValues={{
              ambito_territorial: formData.ambito_territorial,
              coberturas_solicitadas: formData.coberturas_solicitadas,
            }}
          />
        );
      case 4:
        return (
          <ContactFormStep
            onNext={handleContactNext}
            onBack={handleCoberturasBack}
            defaultValues={formData.contact}
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
export default function ResponsabilidadCivilForm() {
  return (
    <FormProvider>
      <ResponsabilidadCivilFormContent />
    </FormProvider>
  );
}
