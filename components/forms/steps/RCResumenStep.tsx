"use client";

import FormSummaryStep from "./FormSummaryStep";
import { useFormContext } from "@/contexts/FormContext";

interface RCResumenStepProps {
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export default function RCResumenStep({
  onSubmit,
  onBack,
  isSubmitting,
}: RCResumenStepProps) {
  // Utilizamos el contexto de formulario para acceder a los datos
  const { formData } = useFormContext();

  // No necesitamos adaptación para RC, ya que FormSummaryStep ya espera este formato
  // Solo aseguramos que el formType sea "rc"
  return (
    <FormSummaryStep
      onSubmit={onSubmit}
      onBack={onBack}
      formData={formData}
      isSubmitting={isSubmitting}
      formType="rc"
    />
  );
}
