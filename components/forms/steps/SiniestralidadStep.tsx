// components/forms/steps/SiniestralidadStep.tsx
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
import { Textarea } from "@/components/ui/textarea";
import FormLayout from "@/components/layout/FormLayout";
import { useFormContext } from "@/contexts/FormContext";
import { useState } from "react";

// Schema para validar los datos de siniestralidad
const siniestralidadSchema = z.object({
  siniestros_ultimos_3_anos: z.boolean().default(false),
  siniestros_detalles: z.string().optional(),
});

// Tipo para los datos de siniestralidad
export type SiniestralidadFormData = z.infer<typeof siniestralidadSchema>;

interface SiniestralidadStepProps {
  onNext: (data: SiniestralidadFormData) => void;
  onBack: () => void;
  defaultValues?: Partial<SiniestralidadFormData>;
}

export default function SiniestralidadStep({
  onNext,
  onBack,
  defaultValues = {},
}: SiniestralidadStepProps) {
  const { dispatch } = useFormContext();
  const [hasSiniestros, setHasSiniestros] = useState(
    defaultValues?.siniestros_ultimos_3_anos || false
  );

  // Inicializar el formulario con React Hook Form
  const form = useForm<SiniestralidadFormData>({
    resolver: zodResolver(siniestralidadSchema),
    defaultValues: {
      siniestros_ultimos_3_anos: false,
      siniestros_detalles: "",
      ...defaultValues,
    },
  });

  // Manejar el envío del formulario
  function onSubmit(data: SiniestralidadFormData) {
    dispatch({ type: "SET_SINIESTRALIDAD", payload: data });
    onNext(data);
  }

  return (
    <FormLayout
      title="Siniestralidad"
      subtitle="Información sobre los siniestros ocurridos en los últimos años"
      currentStep={7}
      totalSteps={7}
      onNext={form.handleSubmit(onSubmit)}
      onBack={onBack}
      isLastStep={true}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="siniestros_ultimos_3_anos"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      setHasSiniestros(checked === true);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    ¿Has tenido siniestros en los últimos 3 años?
                  </FormLabel>
                  <FormDescription>
                    Cualquier tipo de incidencia cubierta por un seguro:
                    incendio, robo, daños por agua, etc.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {hasSiniestros && (
            <FormField
              control={form.control}
              name="siniestros_detalles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detalles de los siniestros</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe brevemente los siniestros ocurridos, sus causas y las medidas tomadas para que no vuelvan a ocurrir."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Esta información nos ayudará a ajustar mejor las
                    recomendaciones de seguros.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="bg-blue-50 p-4 rounded-md mt-6">
            <p className="text-sm text-blue-800">
              La siniestralidad previa puede influir en las condiciones y el
              precio de tu seguro. Es importante proporcionar información veraz
              para obtener las mejores recomendaciones.
            </p>
          </div>
        </form>
      </Form>
    </FormLayout>
  );
}
