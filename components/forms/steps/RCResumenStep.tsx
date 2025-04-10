"use client";

import FormSummaryStep from "./FormSummaryStep";
import { useFormContext } from "@/contexts/FormContext";

interface RCResumenStepProps {
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  currentStep?: number;
  totalSteps?: number;
}

export default function RCResumenStep({
  onSubmit,
  onBack,
  isSubmitting,
  currentStep = 5,
  totalSteps = 5,
}: RCResumenStepProps) {
  // Utilizamos el contexto de formulario para acceder a los datos
  const { formData } = useFormContext();

  return (
    <FormSummaryStep
      onSubmit={onSubmit}
      onBack={onBack}
      formData={formData}
      isSubmitting={isSubmitting}
      formType="rc"
      currentStep={currentStep}
      totalSteps={totalSteps}
    />
  );
}
