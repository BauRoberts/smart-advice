// components/forms/steps/ProteccionRoboStep.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import FormLayout from "@/components/layout/FormLayout";
import { useFormContext } from "@/contexts/FormContext";

// Schema para validar los datos de protección contra robo
const proteccionRoboSchema = z.object({
  protecciones_fisicas: z.boolean().default(false),
  vigilancia_propia: z.boolean().default(false),
  alarma_conectada: z.boolean().default(false),
  camaras_circuito: z.boolean().default(false),
});

// Tipo para los datos de protección contra robo
export type ProteccionRoboFormData = z.infer<typeof proteccionRoboSchema>;

interface ProteccionRoboStepProps {
  onNext: (data: ProteccionRoboFormData) => void;
  onBack: () => void;
  defaultValues?: Partial<ProteccionRoboFormData>;
  currentStep?: number;
  totalSteps?: number;
}

export default function ProteccionRoboStep({
  onNext,
  onBack,
  defaultValues = {},
  currentStep = 4,
  totalSteps = 8,
}: ProteccionRoboStepProps) {
  const { dispatch } = useFormContext();

  // Inicializar el formulario con React Hook Form
  const form = useForm<ProteccionRoboFormData>({
    resolver: zodResolver(proteccionRoboSchema),
    defaultValues: {
      protecciones_fisicas: false,
      vigilancia_propia: false,
      alarma_conectada: false,
      camaras_circuito: false,
      ...defaultValues,
    },
  });

  // Manejar el envío del formulario
  function onSubmit(data: ProteccionRoboFormData) {
    dispatch({ type: "SET_PROTECCION_ROBO", payload: data });
    onNext(data);
  }

  return (
    <FormLayout
      title="Protecciones contra Robo"
      subtitle="Información sobre las medidas de protección contra robo"
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={form.handleSubmit(onSubmit)}
      onBack={onBack}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="protecciones_fisicas"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Protecciones físicas (rejas, cerraduras...)
                    </FormLabel>
                    <FormDescription>
                      Sistemas físicos para dificultar el acceso a las
                      instalaciones
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vigilancia_propia"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      El polígono cuenta con vigilancia propia
                    </FormLabel>
                    <FormDescription>
                      Servicio de vigilancia contratado para el polígono o zona
                      industrial
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="alarma_conectada"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      ¿Tienes alarma de robo conectada a central de alarma?
                    </FormLabel>
                    <FormDescription>
                      Sistema de alarma con monitorización remota por empresa de
                      seguridad
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="camaras_circuito"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      ¿Tienes Circuito Cerrado de Televisión/Cámaras?
                    </FormLabel>
                    <FormDescription>
                      Sistema de vigilancia mediante cámaras instaladas en el
                      recinto
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-md mt-6">
            <p className="text-sm text-blue-800">
              Las protecciones contra robo pueden suponer una reducción
              significativa en el precio de la prima de seguro.
            </p>
          </div>
        </form>
      </Form>
    </FormLayout>
  );
}
