"use client";

import FormSummaryStep from "./FormSummaryStep";
import { useFormContext } from "@/contexts/FormContext";

interface DanosResumenStepProps {
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  currentStep?: number;
  totalSteps?: number;
}

export default function DanosResumenStep({
  onSubmit,
  onBack,
  isSubmitting,
  currentStep = 8,
  totalSteps = 8,
}: DanosResumenStepProps) {
  // Utilizamos el contexto de formulario común para acceder a los datos
  const { formData } = useFormContext();

  // Ya no necesitamos adaptar los datos, usamos directamente formData
  return (
    <FormSummaryStep
      onSubmit={onSubmit}
      onBack={onBack}
      formData={formData}
      isSubmitting={isSubmitting}
      formType="danos"
      currentStep={currentStep}
      totalSteps={totalSteps}
    />
  );
}
