// components/forms/steps/PreguntasGeneralesStep.tsx
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormLayout from "@/components/layout/FormLayout";
import { useFormContext } from "@/contexts/FormContext";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

// Define una interfaz para los siniestros
interface Siniestro {
  causa: string;
  importe: number;
  fecha: string;
}

// Schema para validar las preguntas generales
const preguntasGeneralesSchema = z.object({
  filiales_extranjero: z.boolean().default(false),
  ubicacion_filiales: z.array(z.string()).default([]),
  contaminacion_accidental: z.boolean().default(false),
  responsabilidad_perjuicios_patrimoniales: z.boolean().default(false),
  participacion_ferias: z.boolean().default(false),
  cubre_bienes_empleados: z.boolean().default(false),
  siniestros_ultimos_3_anos: z.boolean().default(false),
  siniestros: z
    .array(
      z.object({
        causa: z.string(),
        importe: z.number(),
        fecha: z.string(),
      })
    )
    .default([]),
});

// Tipo para los datos de preguntas generales
export type PreguntasGeneralesFormData = z.infer<
  typeof preguntasGeneralesSchema
>;

interface PreguntasGeneralesStepProps {
  onNext: () => void;
  onBack: () => void;
  defaultValues?: Partial<PreguntasGeneralesFormData>;
}

export default function PreguntasGeneralesStep({
  onNext,
  onBack,
  defaultValues = {},
}: PreguntasGeneralesStepProps) {
  const { dispatch } = useFormContext();
  const [siniestros, setSiniestros] = useState<Siniestro[]>(
    defaultValues.siniestros || []
  );

  // Inicializar el formulario con React Hook Form
  const form = useForm<PreguntasGeneralesFormData>({
    resolver: zodResolver(preguntasGeneralesSchema),
    defaultValues: {
      filiales_extranjero: false,
      ubicacion_filiales: [],
      contaminacion_accidental: false,
      responsabilidad_perjuicios_patrimoniales: false,
      participacion_ferias: false,
      cubre_bienes_empleados: false,
      siniestros_ultimos_3_anos: false,
      siniestros: [],
      ...defaultValues,
    },
  });

  // Observar si tiene filiales extranjero
  const tieneFiliales = form.watch("filiales_extranjero");

  // Observar si tiene siniestros
  const tieneSiniestros = form.watch("siniestros_ultimos_3_anos");

  // Función para agregar un nuevo siniestro
  const addSiniestro = () => {
    const newSiniestros = [...siniestros, { causa: "", importe: 0, fecha: "" }];
    setSiniestros(newSiniestros);
    form.setValue("siniestros", newSiniestros);
  };

  // Función para eliminar un siniestro
  const removeSiniestro = (index: number) => {
    const newSiniestros = siniestros.filter((_, i) => i !== index);
    setSiniestros(newSiniestros);
    form.setValue("siniestros", newSiniestros);
  };

  // Función para actualizar un siniestro
  const updateSiniestro = (index: number, field: string, value: any) => {
    const newSiniestros = [...siniestros];
    newSiniestros[index] = {
      ...newSiniestros[index],
      [field]: value,
    };
    setSiniestros(newSiniestros);
    form.setValue("siniestros", newSiniestros);
  };

  // Manejar el envío del formulario
  function onSubmit(data: PreguntasGeneralesFormData) {
    dispatch({
      type: "SET_PREGUNTAS_GENERALES" as any, // Temporal fix, se corregirá con la actualización del contexto
      payload: data,
    });
    onNext();
  }

  return (
    <FormLayout
      title="Dinos más acerca de tu actividad"
      subtitle="Responde a las siguientes preguntas para mejorar nuestras recomendaciones"
      currentStep={3}
      totalSteps={6}
      onNext={form.handleSubmit(onSubmit)}
      onBack={onBack}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="filiales_extranjero"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>¿Tienes filiales fuera de España?</FormLabel>
                </div>
              </FormItem>
            )}
          />

          {tieneFiliales && (
            <FormField
              control={form.control}
              name="ubicacion_filiales"
              render={() => (
                <FormItem className="pl-6 border-l-2 border-gray-200">
                  <FormLabel>Indícanos dónde:</FormLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { id: "ue", label: "Unión Europea" },
                      { id: "ue_uk", label: "Unión Europea y Reino Unido" },
                      {
                        id: "mundial-sin-usa",
                        label: "Todo el Mundo excepto USA y Canadá",
                      },
                      {
                        id: "mundial-con-usa",
                        label: "Todo el mundo incluido USA y Canadá",
                      },
                    ].map((region) => (
                      <FormField
                        key={region.id}
                        control={form.control}
                        name="ubicacion_filiales"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={region.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(region.id)}
                                  onCheckedChange={(checked) => {
                                    const newValue = checked
                                      ? [...(field.value || []), region.id]
                                      : field.value?.filter(
                                          (value: string) => value !== region.id
                                        ) || [];

                                    field.onChange(newValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {region.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="contaminacion_accidental"
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
                    ¿Quieres cubrir la contaminación accidental y repentina que
                    causes al medio ambiente derivada del desarrollo de tu
                    actividad?
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="responsabilidad_perjuicios_patrimoniales"
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
                    ¿Quieres cubrir la responsabilidad civil legal que tengas
                    por los daños causados en el patrimonio de terceros que no
                    sean consecuencia de un daño personal y/o material y
                    resulten de un hecho accidental, súbito e imprevisto?
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="participacion_ferias"
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
                    ¿Participas en ferias, congresos y/o exposiciones,
                    incluyendo el uso de stands o casetas?
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cubre_bienes_empleados"
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
                    ¿Quieres cubrir los daños a los bienes de tus empleados?
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="siniestros_ultimos_3_anos"
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
                    ¿Has tenido reclamaciones en los últimos 3 años?
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          {tieneSiniestros && (
            <div className="pl-6 border-l-2 border-gray-200 mt-4">
              <h4 className="font-medium mb-2">
                Indícanos las reclamaciones que hayas recibido
              </h4>

              {siniestros.map((siniestro, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-md mb-4">
                  <div className="flex justify-between mb-2">
                    <h5 className="font-medium">Siniestro {index + 1}</h5>
                    <button
                      type="button"
                      onClick={() => removeSiniestro(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Causa
                        </label>
                        <Input
                          value={siniestro.causa}
                          onChange={(e) =>
                            updateSiniestro(index, "causa", e.target.value)
                          }
                          placeholder="Descripción de la causa"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Importe (€)
                        </label>
                        <Input
                          type="number"
                          value={siniestro.importe || ""}
                          onChange={(e) =>
                            updateSiniestro(
                              index,
                              "importe",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="Importe del siniestro"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Fecha
                        </label>
                        <Input
                          type="date"
                          value={siniestro.fecha}
                          onChange={(e) =>
                            updateSiniestro(index, "fecha", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addSiniestro}
                className="w-full mt-2"
              >
                <Plus className="h-4 w-4 mr-2" /> Añadir siniestro
              </Button>
            </div>
          )}
        </form>
      </Form>
    </FormLayout>
  );
}
