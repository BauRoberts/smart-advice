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
import { getOrCreateTempSession } from "@/lib/session";

function DanosMaterialesFormContent() {
  const router = useRouter();
  const { formData, dispatch, goToStep, submitForm } = useFormContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set the form type
    dispatch({
      type: "SET_FORM_TYPE",
      payload: "danos_materiales",
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
  const handleCompanyNext = (data: any, empresaTipo: any) => {
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

  // Step 2: Capitals to insure
  const handleCapitalesNext = (data: any) => {
    dispatch({ type: "SET_CAPITALES", payload: data });
    goToStep(3);
  };

  const handleCapitalesBack = () => {
    goToStep(1);
  };

  // Step 3: Construction characteristics
  const handleConstruccionNext = (data: any) => {
    dispatch({ type: "SET_CONSTRUCCION", payload: data });
    goToStep(4);
  };

  const handleConstruccionBack = () => {
    goToStep(2);
  };

  // Step 4: Fire protection
  const handleProteccionIncendiosNext = (data: any) => {
    dispatch({ type: "SET_PROTECCION_INCENDIOS", payload: data });
    goToStep(5);
  };

  const handleProteccionIncendiosBack = () => {
    goToStep(3);
  };

  // Step 5: Theft protection
  const handleProteccionRoboNext = (data: any) => {
    dispatch({ type: "SET_PROTECCION_ROBO", payload: data });
    goToStep(6);
  };

  const handleProteccionRoboBack = () => {
    goToStep(4);
  };

  // Step 6: Claims history
  const handleSiniestralidadNext = (data: any) => {
    dispatch({ type: "SET_SINIESTRALIDAD", payload: data });
    goToStep(7);
  };

  const handleSiniestralidadBack = () => {
    goToStep(5);
  };

  // Step 7: Contact Information (moved from step 1)
  const handleContactNext = (data: any) => {
    // Save to local context
    dispatch({ type: "SET_CONTACT", payload: data });

    // Advance to summary step
    goToStep(8);
  };

  const handleContactBack = () => {
    goToStep(6);
  };

  // Step 8: Summary and submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      console.log("Iniciando envío del formulario de daños materiales...");
      const result = await submitForm();
      console.log("Formulario enviado exitosamente:", result);

      toast({
        title: "Formulario enviado",
        description: "Redirigiendo a tus recomendaciones personalizadas...",
        duration: 2000,
      });

      // Redirect to recommendations page with the form type parameter
      setTimeout(() => {
        router.push(`/recomendaciones?tipo=danos_materiales`);
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
          <CompanyFormStep
            onNext={handleCompanyNext}
            onBack={() => router.push("/seguros")}
            defaultValues={formData.company}
          />
        );
      case 2:
        return (
          <CapitalesStep
            onNext={handleCapitalesNext}
            onBack={handleCapitalesBack}
            defaultValues={formData.capitales}
          />
        );
      case 3:
        return (
          <ConstruccionStep
            onNext={handleConstruccionNext}
            onBack={handleConstruccionBack}
            defaultValues={formData.construccion}
          />
        );
      case 4:
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
      case 5:
        return (
          <ProteccionRoboStep
            onNext={handleProteccionRoboNext}
            onBack={handleProteccionRoboBack}
            defaultValues={formData.proteccion_robo}
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
