// components/forms/MultiStepForm.tsx
"use client";

import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Step {
  id: number;
  title: string;
  content: ReactNode;
}

interface MultiStepFormProps {
  steps: Step[];
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export default function MultiStepForm({
  steps,
  onSubmit,
  isSubmitting = false,
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const goToNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps.find((step) => step.id === currentStep);

  return (
    <div className="flex flex-col md:flex-row w-full gap-8">
      {/* Steps sidebar */}
      <div className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow-sm">
        <div className="space-y-1">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center py-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  step.id === currentStep
                    ? "bg-[#062A5A] text-white"
                    : step.id < currentStep
                    ? "bg-[#FB2E25] text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step.id}
              </div>
              <span
                className={`text-sm ${
                  step.id === currentStep
                    ? "font-medium text-[#062A5A]"
                    : step.id < currentStep
                    ? "text-[#FB2E25]"
                    : "text-gray-600"
                }`}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Content area */}
      <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#062A5A]">
            {currentStepData?.title}
          </h2>
          <div className="h-1 w-16 bg-[#FB2E25] mt-2"></div>
        </div>

        <div className="mb-8">{currentStepData?.content}</div>

        <div className="flex justify-between">
          {currentStep > 1 ? (
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              className="border-[#062A5A] text-[#062A5A] hover:bg-[rgba(6,42,90,0.05)]"
            >
              Anterior
            </Button>
          ) : (
            <Button
              variant="outline"
              asChild
              className="border-[#062A5A] text-[#062A5A] hover:bg-[rgba(6,42,90,0.05)]"
            >
              <Link href="/seguros">Volver</Link>
            </Button>
          )}

          {currentStep < steps.length ? (
            <Button
              onClick={goToNextStep}
              className="bg-[#062A5A] hover:bg-[#051d3e] transition-colors"
            >
              Siguiente
            </Button>
          ) : (
            <Button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="relative bg-[#062A5A] hover:bg-[#051d3e] transition-colors"
            >
              {isSubmitting ? (
                <>
                  <span className="opacity-0">Enviar</span>
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </span>
                </>
              ) : (
                "Enviar"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
