// components/forms/steps/CoberturasFormStep.tsx
'use client';

import { useState } from 'react';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import FormLayout from '@/components/layout/FormLayout';
import { useFormContext } from '@/contexts/FormContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Schema para validar el ámbito territorial y las coberturas
const coberturasSchema = z.object({
  ambito_territorial: z.string().min(1, {
    message: "Debes seleccionar un ámbito territorial",
  }),
  coberturas_solicitadas: z.object({
    exploitation: z.boolean().default(false),
    patronal: z.boolean().default(false),
    productos: z.boolean().default(false),
    trabajos: z.boolean().default(false),
    profesional: z.boolean().default(false),
  }).refine((data) => {
    // Al menos una cobertura debe estar seleccionada
    return Object.values(data).some(value => value === true);
  }, {
    message: "Debes seleccionar al menos una cobertura",
    path: ["root"],
  }),
});

// Tipo para los datos de ámbito territorial y coberturas
export type CoberturasFormData = z.infer<typeof coberturasSchema>;

interface CoberturasFormStepProps {
  onNext: () => void;
  onBack: () => void;
  defaultValues?: Partial<CoberturasFormData>;
}

export default function CoberturasFormStep({ 
  onNext, 
  onBack, 
  defaultValues = {} 
}: CoberturasFormStepProps) {
  const { dispatch } = useFormContext();

  // Inicializar el formulario con React Hook Form
  const form = useForm<CoberturasFormData>({
    resolver: zodResolver(coberturasSchema),
    defaultValues: {
      ambito_territorial: '',
      coberturas_solicitadas: {
        exploitation: false,
        patronal: false,
        productos: false,
        trabajos: false,
        profesional: false,
      },
      ...defaultValues
    },
  });

  // Estado para manejar las selecciones de coberturas
  const [selectedCoberturas, setSelectedCoberturas] = useState({
    exploitation: defaultValues.coberturas_solicitadas?.exploitation || false,
    patronal: defaultValues.coberturas_solicitadas?.patronal || false,
    productos: defaultValues.coberturas_solicitadas?.productos || false,
    trabajos: defaultValues.coberturas_solicitadas?.trabajos || false,
    profesional: defaultValues.coberturas_solicitadas?.profesional || false,
  });

  // Función para alternar la selección de una cobertura
  const toggleCobertura = (cobertura: keyof typeof selectedCoberturas) => {
    setSelectedCoberturas(prev => {
      const updated = {
        ...prev,
        [cobertura]: !prev[cobertura]
      };
      
      // Actualizar el formulario para mantener sincronia
      form.setValue(`coberturas_solicitadas.${cobertura}` as any, updated[cobertura]);
      
      return updated;
    });
  };

  // Manejar el envío del formulario
  function onSubmit(data: CoberturasFormData) {
    dispatch({ 
      type: 'SET_AMBITO_TERRITORIAL', 
      payload: data.ambito_territorial 
    });
    
    dispatch({ 
      type: 'SET_COBERTURAS', 
      payload: data.coberturas_solicitadas
    });
    
    onNext();
  }

  return (
    <FormLayout
      title="Ámbito territorial y coberturas"
      subtitle="Selecciona dónde operará tu empresa y qué coberturas necesitas"
      currentStep={4}
      totalSteps={5}
      onNext={form.handleSubmit(onSubmit)}
      onBack={onBack}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="ambito_territorial"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Ámbito Territorial</FormLabel>
                <div className="flex items-center mb-1">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un ámbito territorial" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="España">España</SelectItem>
                      <SelectItem value="Unión Europea">Unión Europea</SelectItem>
                      <SelectItem value="Mundial">Mundial</SelectItem>
                    </SelectContent>
                  </Select>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-2 h-4 w-4 text-gray-500">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 16v-4M12 8h.01" />
                        </svg>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">El ámbito geográfico determina dónde tendrás cobertura. A mayor ámbito, mayor será generalmente el costo de la póliza.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <FormDescription>
                  Selecciona el ámbito geográfico donde operará tu empresa.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="border-t pt-4">
            <p className="font-medium mb-2">Coberturas Solicitadas</p>
            <p className="text-sm text-gray-600 mb-4">
              Selecciona las coberturas que necesitas para tu actividad.
            </p>
            
            {/* Coberturas Seleccionables */}
            <div className="space-y-4">
              {/* RC Explotación */}
              <div 
                className={`border rounded-md p-4 cursor-pointer transition-all ${
                  selectedCoberturas.exploitation 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => toggleCobertura('exploitation')}
              >
                <div className="flex items-start">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                    selectedCoberturas.exploitation 
                      ? "bg-blue-500 border-blue-500" 
                      : "border-gray-300"
                  }`}>
                    {selectedCoberturas.exploitation && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <p className="font-medium">RC Explotación</p>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1.5 h-4 w-4 text-gray-500">
                              <circle cx="12" cy="12" r="10" />
                              <path d="M12 16v-4M12 8h.01" />
                            </svg>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Cubre los daños causados a terceros durante el desarrollo de la actividad en tus instalaciones.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-sm text-gray-600">
                      Cubre los daños causados a terceros durante el desarrollo de la actividad.
                    </p>
                  </div>
                </div>
              </div>

              {/* RC Patronal */}
              <div 
                className={`border rounded-md p-4 cursor-pointer transition-all ${
                  selectedCoberturas.patronal 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => toggleCobertura('patronal')}
              >
                <div className="flex items-start">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                    selectedCoberturas.patronal 
                      ? "bg-blue-500 border-blue-500" 
                      : "border-gray-300"
                  }`}>
                    {selectedCoberturas.patronal && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <p className="font-medium">RC Patronal</p>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1.5 h-4 w-4 text-gray-500">
                              <circle cx="12" cy="12" r="10" />
                              <path d="M12 16v-4M12 8h.01" />
                            </svg>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Protección específica para las reclamaciones derivadas de accidentes laborales de tus empleados.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-sm text-gray-600">
                      Cubre los daños personales sufridos por empleados por accidentes laborales.
                    </p>
                  </div>
                </div>
              </div>

              {/* RC Productos */}
              <div 
                className={`border rounded-md p-4 cursor-pointer transition-all ${
                  selectedCoberturas.productos 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => toggleCobertura('productos')}
              >
                <div className="flex items-start">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                    selectedCoberturas.productos 
                      ? "bg-blue-500 border-blue-500" 
                      : "border-gray-300"
                  }`}>
                    {selectedCoberturas.productos && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <p className="font-medium">RC Productos</p>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1.5 h-4 w-4 text-gray-500">
                              <circle cx="12" cy="12" r="10" />
                              <path d="M12 16v-4M12 8h.01" />
                            </svg>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Esencial para empresas que fabrican o distribuyen productos. Cubre reclamaciones por defectos o daños causados por los productos.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-sm text-gray-600">
                      Cubre los daños causados por los productos fabricados o suministrados.
                    </p>
                  </div>
                </div>
              </div>

              {/* RC Trabajos */}
              <div 
                className={`border rounded-md p-4 cursor-pointer transition-all ${
                  selectedCoberturas.trabajos 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => toggleCobertura('trabajos')}
              >
                <div className="flex items-start">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                    selectedCoberturas.trabajos 
                      ? "bg-blue-500 border-blue-500" 
                      : "border-gray-300"
                  }`}>
                    {selectedCoberturas.trabajos && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <p className="font-medium">RC Trabajos</p>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1.5 h-4 w-4 text-gray-500">
                              <circle cx="12" cy="12" r="10" />
                              <path d="M12 16v-4M12 8h.01" />
                            </svg>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Protege frente a reclamaciones que surgen después de haber finalizado un servicio o entregado un trabajo.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-sm text-gray-600">
                      Cubre los daños causados después de la entrega de trabajos o prestación de servicios.
                    </p>
                  </div>
                </div>
              </div>

              {/* RC Profesional */}
              <div 
                className={`border rounded-md p-4 cursor-pointer transition-all ${
                  selectedCoberturas.profesional 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => toggleCobertura('profesional')}
              >
                <div className="flex items-start">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                    selectedCoberturas.profesional 
                      ? "bg-blue-500 border-blue-500" 
                      : "border-gray-300"
                  }`}>
                    {selectedCoberturas.profesional && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <p className="font-medium">RC Profesional</p>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1.5 h-4 w-4 text-gray-500">
                              <circle cx="12" cy="12" r="10" />
                              <path d="M12 16v-4M12 8h.01" />
                            </svg>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Indispensable para servicios de asesoría, consultoría o profesiones liberales. Cubre reclamaciones por errores u omisiones en el servicio profesional.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-sm text-gray-600">
                      Cubre errores u omisiones profesionales en la prestación de servicios.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {form.formState.errors.coberturas_solicitadas?.root && (
              <p className="text-sm font-medium text-destructive mt-4">
                {form.formState.errors.coberturas_solicitadas.root.message}
              </p>
            )}
          </div>
        </form>
      </Form>
    </FormLayout>
  );
}