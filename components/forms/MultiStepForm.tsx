// components/forms/MultiStepForm.tsx
'use client';

import { useState, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Step {
  id: number;
  title: string;
  content: ReactNode;
}

interface MultiStepFormProps {
  steps: Step[];
  onSubmit: () => void;
}

export default function MultiStepForm({ steps, onSubmit }: MultiStepFormProps) {
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
  
  const currentStepData = steps.find(step => step.id === currentStep);
  
  return (
    <div className="flex flex-col md:flex-row w-full gap-8">
      {/* Steps sidebar */}
      <div className="w-full md:w-1/4 bg-white p-6 rounded-lg">
        <div className="space-y-1">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center py-2">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  step.id === currentStep 
                    ? 'bg-blue-600 text-white' 
                    : step.id < currentStep 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.id}
              </div>
              <span className={`text-sm ${
                step.id === currentStep 
                  ? 'font-medium' 
                  : 'text-gray-600'
              }`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Content area */}
      <div className="w-full md:w-3/4 bg-white p-6 rounded-lg">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">{currentStepData?.title}</h2>
        </div>
        
        <div className="mb-8">
          {currentStepData?.content}
        </div>
        
        <div className="flex justify-between">
          {currentStep > 1 ? (
            <Button variant="outline" onClick={goToPreviousStep}>
              Anterior
            </Button>
          ) : (
            <Button variant="outline" asChild>
              <Link href="/seguros">Volver</Link>
            </Button>
          )}
          
          {currentStep < steps.length ? (
            <Button onClick={goToNextStep}>
              Siguiente
            </Button>
          ) : (
            <Button onClick={onSubmit}>
              Enviar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}