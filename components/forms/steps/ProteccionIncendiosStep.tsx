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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormLayout from "@/components/layout/FormLayout";
import { useFormContext } from "@/contexts/FormContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

// Schema actualizado para validar los datos de protección contra incendios
const proteccionIncendiosSchema = z.object({
  // Extintores
  extintores: z.boolean().default(false),

  // Bocas de incendio
  bocas_incendio: z.boolean().default(false),
  bocas_cobertura_total: z.boolean().optional(),
  bocas_deposito_propio: z.boolean().optional(),

  // Columnas hidrantes
  columnas_hidrantes: z.boolean().default(false),
  columnas_hidrantes_numero: z.number().optional(),
  columnas_hidrantes_tipo: z
    .array(z.enum(["publico", "privado"]))
    .optional()
    .default([]),

  // Detección automática
  deteccion_automatica: z.boolean().default(false),
  deteccion_cobertura: z.enum(["total", "parcial"]).optional(),
  deteccion_areas: z.string().optional(),

  // Rociadores
  rociadores: z.boolean().default(false),
  rociadores_cobertura: z.enum(["total", "parcial"]).optional(),
  rociadores_areas: z.string().optional(),

  // Suministro de agua
  suministro_agua: z.string().optional(),
});

// Tipo para los datos de protección contra incendios
export type ProteccionIncendiosFormData = z.infer<
  typeof proteccionIncendiosSchema
>;

interface ProteccionIncendiosStepProps {
  onNext: (data: ProteccionIncendiosFormData) => void;
  onBack: () => void;
  defaultValues?: Partial<ProteccionIncendiosFormData>;
  currentStep?: number;
  totalSteps?: number;
}

export default function ProteccionIncendiosStep({
  onNext,
  onBack,
  defaultValues = {},
  currentStep = 3,
  totalSteps = 8,
}: ProteccionIncendiosStepProps) {
  const { dispatch } = useFormContext();

  // Inicializar el formulario con React Hook Form
  const form = useForm<ProteccionIncendiosFormData>({
    resolver: zodResolver(proteccionIncendiosSchema),
    defaultValues: {
      extintores: false,
      bocas_incendio: false,
      columnas_hidrantes: false,
      columnas_hidrantes_tipo: [], // Inicializar como array vacío
      deteccion_automatica: false,
      rociadores: false,
      suministro_agua: "",
      ...defaultValues,
    },
  });

  // Observar campos para lógica condicional
  const bocasIncendio = form.watch("bocas_incendio");
  const columnasHidrantes = form.watch("columnas_hidrantes");
  const deteccionAutomatica = form.watch("deteccion_automatica");
  const deteccionCobertura = form.watch("deteccion_cobertura");
  const rociadores = form.watch("rociadores");
  const rociadoresCobertura = form.watch("rociadores_cobertura");

  // Manejar el envío del formulario
  function onSubmit(data: ProteccionIncendiosFormData) {
    // Mapear los datos nuevos al formato esperado por el contexto
    const formattedData = {
      extintores: data.extintores,
      bocas_incendio: data.bocas_incendio,
      deposito_bombeo: data.bocas_deposito_propio || false,
      cobertura_total: data.bocas_cobertura_total || false,
      columnas_hidrantes: data.columnas_hidrantes,
      columnas_hidrantes_tipo: data.columnas_hidrantes_tipo || [],
      deteccion_automatica: data.deteccion_automatica,
      deteccion_zona:
        data.deteccion_cobertura === "parcial"
          ? [data.deteccion_areas || ""]
          : data.deteccion_cobertura === "total"
          ? ["totalidad"]
          : [],
      rociadores: data.rociadores,
      rociadores_zona:
        data.rociadores_cobertura === "parcial"
          ? [data.rociadores_areas || ""]
          : data.rociadores_cobertura === "total"
          ? ["totalidad"]
          : [],
      suministro_agua: data.suministro_agua || "",
    };

    dispatch({
      type: "SET_PROTECCION_INCENDIOS",
      payload: formattedData,
    });
    onNext(data);
  }

  return (
    <FormLayout
      title="Protecciones contra Incendio"
      subtitle="Información sobre las medidas de protección contra incendios"
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={form.handleSubmit(onSubmit)}
      onBack={onBack}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Extintores */}
          <FormField
            control={form.control}
            name="extintores"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Extintores</FormLabel>
                </div>
              </FormItem>
            )}
          />

          {/* Bocas de incendio (BIE's) */}
          <div className="space-y-3 border-b pb-4">
            <FormField
              control={form.control}
              name="bocas_incendio"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Bocas de incendio equipadas (BIE)</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {bocasIncendio && (
              <div className="ml-7 space-y-3">
                <FormField
                  control={form.control}
                  name="bocas_cobertura_total"
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
                          ¿Cubren la totalidad de la Instalación?
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bocas_deposito_propio"
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
                          ¿Cuentas con depósito propio y grupo de bombeo?
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          {/* Columnas hidrantes exteriores */}
          <div className="space-y-3 border-b pb-4">
            <FormField
              control={form.control}
              name="columnas_hidrantes"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Columnas hidrantes exteriores</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {columnasHidrantes && (
              <div className="ml-7 space-y-3">
                <FormField
                  control={form.control}
                  name="columnas_hidrantes_numero"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de columnas hidrantes</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ej: 2"
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="columnas_hidrantes_tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de sistema</FormLabel>
                      <div className="space-y-2">
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes("publico")}
                              onCheckedChange={(checked) => {
                                // Actualizar el array según la selección
                                const updatedValue = checked
                                  ? [...(field.value || []), "publico"]
                                  : (field.value || []).filter(
                                      (value) => value !== "publico"
                                    );
                                field.onChange(updatedValue);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Público</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes("privado")}
                              onCheckedChange={(checked) => {
                                // Actualizar el array según la selección
                                const updatedValue = checked
                                  ? [...(field.value || []), "privado"]
                                  : (field.value || []).filter(
                                      (value) => value !== "privado"
                                    );
                                field.onChange(updatedValue);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Privado</FormLabel>
                        </FormItem>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          {/* Detección automática de incendios */}
          <div className="space-y-3 border-b pb-4">
            <FormField
              control={form.control}
              name="deteccion_automatica"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Detección automática de incendios</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {deteccionAutomatica && (
              <div className="ml-7 space-y-3">
                <FormField
                  control={form.control}
                  name="deteccion_cobertura"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cobertura</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="total" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Totalidad del riesgo
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="parcial" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Cobertura parcial
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {deteccionCobertura === "parcial" && (
                  <FormField
                    control={form.control}
                    name="deteccion_areas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Especificar áreas cubiertas</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ej: zona de almacén, oficinas, etc."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}
          </div>

          {/* Rociadores */}
          <div className="space-y-3 border-b pb-4">
            <FormField
              control={form.control}
              name="rociadores"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Rociadores automáticos</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {rociadores && (
              <div className="ml-7 space-y-3">
                <FormField
                  control={form.control}
                  name="rociadores_cobertura"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cobertura</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="total" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Totalidad del riesgo
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="parcial" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Cobertura parcial
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {rociadoresCobertura === "parcial" && (
                  <FormField
                    control={form.control}
                    name="rociadores_areas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Especificar áreas cubiertas</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ej: zona de almacén, oficinas, etc."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}
          </div>

          {/* Suministro de agua */}
          <FormField
            control={form.control}
            name="suministro_agua"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Suministro de agua</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo de suministro" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="red_publica">Red pública</SelectItem>
                    <SelectItem value="sistema_privado">
                      Sistema privado con grupo de bombeo y depósito propio
                    </SelectItem>
                    <SelectItem value="no_tiene">No tiene</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </FormLayout>
  );
}
