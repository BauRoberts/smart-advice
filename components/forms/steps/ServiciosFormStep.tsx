// components/forms/steps/ServiciosFormStep.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import FormLayout from '@/components/layout/FormLayout';
import { useFormContext } from '@/contexts/FormContext';
import { useState } from 'react';

// Schema para validar los datos de actividad de servicios
const serviciosSchema = z.object({
  trabajos_fuera_instalaciones: z.boolean().default(false),
  corte_soldadura: z.boolean().default(false),
  trabajo_equipos_electronicos: z.boolean().default(false),
  empleados_tecnicos: z.boolean().default(false),
});

// Tipo para los datos de servicios
export type ServiciosFormData = z.infer<typeof serviciosSchema>;

interface ServiciosFormStepProps {
  onNext: () => void;
  onBack: () => void;
  defaultValues?: Partial<ServiciosFormData>;
}

export default function ServiciosFormStep({ 
  onNext, 
  onBack, 
  defaultValues = {} 
}: ServiciosFormStepProps) {
  const { dispatch } = useFormContext();

  // Inicializar el formulario con React Hook Form
  const form = useForm<ServiciosFormData>({
    resolver: zodResolver(serviciosSchema),
    defaultValues: {
      trabajos_fuera_instalaciones: false,
      corte_soldadura: false,
      trabajo_equipos_electronicos: false,
      empleados_tecnicos: false,
      ...defaultValues
    },
  });

  // Estado para manejar las selecciones
  const [selectedOptions, setSelectedOptions] = useState({
    trabajos_fuera_instalaciones: defaultValues.trabajos_fuera_instalaciones || false,
    corte_soldadura: defaultValues.corte_soldadura || false,
    trabajo_equipos_electronicos: defaultValues.trabajo_equipos_electronicos || false,
    empleados_tecnicos: defaultValues.empleados_tecnicos || false,
  });

  // Función para alternar la selección de una opción
  const toggleOption = (option: keyof ServiciosFormData) => {
    setSelectedOptions(prev => {
      const updated = {
        ...prev,
        [option]: !prev[option]
      };
      
      // Actualizar el formulario para mantener sincronia
      form.setValue(option, updated[option]);
      
      return updated;
    });
  };

  // Manejar el envío del formulario
  function onSubmit(data: ServiciosFormData) {
    dispatch({ type: 'SET_ACTIVIDAD_SERVICIOS', payload: data });
    onNext();
  }

  return (
    <FormLayout
      title="Información de servicios"
      subtitle="Detalles sobre el tipo de servicios que ofrece tu empresa"
      currentStep={3}
      totalSteps={5}
      onNext={form.handleSubmit(onSubmit)}
      onBack={onBack}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Título con instrucciones */}
          <div className="mb-4">
            <p className="text-base font-medium text-gray-700">Selecciona las opciones que correspondan:</p>
          </div>

          {/* Tarjetas seleccionables */}
          <div className="space-y-4">
            {/* Tarjeta 1: Trabajos fuera de instalaciones */}
            <div 
              className={`border rounded-md p-4 cursor-pointer transition-all ${
                selectedOptions.trabajos_fuera_instalaciones 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => toggleOption('trabajos_fuera_instalaciones')}
            >
              <div className="flex items-start">
                <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                  selectedOptions.trabajos_fuera_instalaciones 
                    ? "bg-blue-500 border-blue-500" 
                    : "border-gray-300"
                }`}>
                  {selectedOptions.trabajos_fuera_instalaciones && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-1">Trabajos fuera de las instalaciones o en casa de terceros o clientes</p>
                  <p className="text-sm text-gray-600">Tus empleados trabajan en lugares distintos a tus propias instalaciones</p>
                </div>
              </div>
            </div>

            {/* Tarjeta 2: Corte y soldadura */}
            <div 
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedOptions.corte_soldadura 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => toggleOption('corte_soldadura')}
            >
              <div className="flex items-start">
                <div className={`w-6 h-6 rounded-md border flex items-center justify-center mr-3 ${
                  selectedOptions.corte_soldadura 
                    ? "bg-blue-500 border-blue-500" 
                    : "border-gray-300"
                }`}>
                  {selectedOptions.corte_soldadura && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-1">Trabajos de corte y soldadura</p>
                  <p className="text-sm text-gray-600">Uso de herramientas o equipos para cortar o soldar materiales</p>
                </div>
              </div>
            </div>

            {/* Tarjeta 3: Equipos electrónicos */}
            <div 
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedOptions.trabajo_equipos_electronicos 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => toggleOption('trabajo_equipos_electronicos')}
            >
              <div className="flex items-start">
                <div className={`w-6 h-6 rounded-md border flex items-center justify-center mr-3 ${
                  selectedOptions.trabajo_equipos_electronicos 
                    ? "bg-blue-500 border-blue-500" 
                    : "border-gray-300"
                }`}>
                  {selectedOptions.trabajo_equipos_electronicos && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-1">Trabajo sobre aparatos o equipos electrónicos</p>
                  <p className="text-sm text-gray-600">Tu empresa repara, manipula o instala equipos electrónicos</p>
                </div>
              </div>
            </div>

            {/* Tarjeta 4: Empleados técnicos */}
            <div 
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedOptions.empleados_tecnicos 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => toggleOption('empleados_tecnicos')}
            >
              <div className="flex items-start">
                <div className={`w-6 h-6 rounded-md border flex items-center justify-center mr-3 ${
                  selectedOptions.empleados_tecnicos 
                    ? "bg-blue-500 border-blue-500" 
                    : "border-gray-300"
                }`}>
                  {selectedOptions.empleados_tecnicos && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-1">Empleados técnicos/profesionales en plantilla</p>
                  <p className="text-sm text-gray-600">Trabajadores con formación técnica especializada o títulos profesionales</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </FormLayout>
  );
}