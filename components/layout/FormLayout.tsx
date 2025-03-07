// components/layout/FormLayout.tsx
import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface FormLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  currentStep: number;
  totalSteps: number;
  onNext?: () => void;
  onBack?: () => void;
  isSubmitting?: boolean;
  isLastStep?: boolean;
  backLink?: string; // Si deseas volver a una página en lugar de al paso anterior
}

export default function FormLayout({
  children,
  title,
  subtitle,
  currentStep,
  totalSteps,
  onNext,
  onBack,
  isSubmitting = false,
  isLastStep = false,
  backLink,
}: FormLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress bar */}
      <div className="w-full bg-gray-100 h-2">
        <div
          className="bg-blue-600 h-2 transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-3xl">
          {/* Step indicator */}
          <div className="mb-6 text-sm font-medium text-gray-500">
            Paso {currentStep} de {totalSteps}
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {title}
            </h1>
            {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
          </div>

          {/* Form content */}
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-md mb-8">
            {children}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            {backLink ? (
              <Button variant="outline" asChild>
                <Link href={backLink}>Volver</Link>
              </Button>
            ) : onBack ? (
              <Button variant="outline" onClick={onBack}>
                Anterior
              </Button>
            ) : (
              <div />
            )}

            {onNext && (
              <Button
                onClick={onNext}
                disabled={isSubmitting}
                className="relative"
              >
                {isSubmitting ? (
                  <>
                    <span className="opacity-0">
                      {isLastStep ? "Enviar" : "Siguiente"}
                    </span>
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
                ) : isLastStep ? (
                  "Enviar"
                ) : (
                  "Siguiente"
                )}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
