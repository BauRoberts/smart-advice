// components/forms/steps/CapitalesStep.tsx
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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import FormLayout from "@/components/layout/FormLayout";
import { useFormContext } from "@/contexts/FormContext";
import { InfoTooltip } from "@/components/ui/InfoTooltip";

// Schema para validar los datos de capitales a asegurar
const capitalesSchema = z.object({
  valor_edificio: z.number().optional(),
  valor_ajuar: z.number().optional(),
  valor_existencias: z.number().optional(),
  existencias_terceros: z.boolean().default(false),
  existencias_propias_terceros: z.boolean().default(false),
  valor_equipo_electronico: z.number().optional(),
  margen_bruto_anual: z.number().optional(),
});

// Tipo para los datos de capitales
export type CapitalesFormData = z.infer<typeof capitalesSchema>;

interface CapitalesStepProps {
  onNext: (data: CapitalesFormData) => void;
  onBack: () => void;
  defaultValues?: Partial<CapitalesFormData>;
}

export default function CapitalesStep({
  onNext,
  onBack,
  defaultValues = {},
}: CapitalesStepProps) {
  const { dispatch } = useFormContext();

  // Inicializar el formulario con React Hook Form
  const form = useForm<CapitalesFormData>({
    resolver: zodResolver(capitalesSchema),
    defaultValues: {
      valor_edificio: 0,
      valor_ajuar: 0,
      valor_existencias: 0,
      existencias_terceros: false,
      existencias_propias_terceros: false,
      valor_equipo_electronico: 0,
      margen_bruto_anual: 0,
      ...defaultValues,
    },
  });

  // Manejar el envío del formulario
  function onSubmit(data: CapitalesFormData) {
    dispatch({ type: "SET_CAPITALES", payload: data });
    onNext(data);
  }

  return (
    <FormLayout
      title="Capitales a asegurar"
      subtitle="Información sobre los valores a asegurar"
      currentStep={3}
      totalSteps={7}
      onNext={form.handleSubmit(onSubmit)}
      onBack={onBack}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="valor_edificio"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <FormLabel>Valor del edificio</FormLabel>
                  <InfoTooltip text="Tiene que tener el valor asegurado como si fuera a nuevo" />
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="Valor"
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseFloat(e.target.value) : 0
                        )
                      }
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      €
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="valor_ajuar"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <FormLabel>Valor del ajuar</FormLabel>
                  <InfoTooltip text="Incluye mobiliario, maquinaria, instalaciones, equipos y todo el contenido excepto existencias" />
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="Valor"
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseFloat(e.target.value) : 0
                        )
                      }
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      €
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="valor_existencias"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor de existencias almacenadas</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="Valor"
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseFloat(e.target.value) : 0
                        )
                      }
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      €
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="existencias_terceros"
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
                    ¿Almacenas existencias de terceros en tus instalaciones?
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="existencias_propias_terceros"
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
                    ¿Almacenas existencias propias en instalaciones de terceros?
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="valor_equipo_electronico"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor del equipo electrónico</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="Valor"
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseFloat(e.target.value) : 0
                        )
                      }
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      €
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="margen_bruto_anual"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <FormLabel>Margen bruto anual</FormLabel>
                  <InfoTooltip text="Se obtiene sumando los GASTOS FIJOS + BENEFICIO NETO ANTES DE IMPUESTOS" />
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="Valor"
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseFloat(e.target.value) : 0
                        )
                      }
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      €
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </FormLayout>
  );
}
