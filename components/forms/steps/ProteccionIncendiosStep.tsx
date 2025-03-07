// components/forms/steps/ProteccionIncendiosStep.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
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

// Schema para validar los datos de protección contra incendios
const proteccionIncendiosSchema = z.object({
  extintores: z.boolean().default(false),
  bocas_incendio: z.boolean().default(false),
  deposito_bombeo: z.boolean().default(false),
  cobertura_total: z.boolean().default(false),
  columnas_hidrantes: z.boolean().default(false),
  columnas_hidrantes_tipo: z.enum(["publico", "privado"]).optional(),
  deteccion_automatica: z.boolean().default(false),
  deteccion_zona: z.array(z.string()).optional(),
  rociadores: z.boolean().default(false),
  rociadores_zona: z.array(z.string()).optional(),
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
}

export default function ProteccionIncendiosStep({
  onNext,
  onBack,
  defaultValues = {},
}: ProteccionIncendiosStepProps) {
  const { dispatch } = useFormContext();

  // Estados locales para manejar zonas de detección y rociadores
  const [deteccionZonas, setDeteccionZonas] = useState<Record<string, boolean>>(
    {
      oficinas: false,
      tecnicas: false,
      almacen: false,
      totalidad: false,
    }
  );

  const [rociadoresZonas, setRociadoresZonas] = useState<
    Record<string, boolean>
  >({
    oficinas: false,
    tecnicas: false,
    almacen: false,
    totalidad: false,
  });

  // Inicializar el formulario con React Hook Form
  const form = useForm<ProteccionIncendiosFormData>({
    resolver: zodResolver(proteccionIncendiosSchema),
    defaultValues: {
      extintores: false,
      bocas_incendio: false,
      deposito_bombeo: false,
      cobertura_total: false,
      columnas_hidrantes: false,
      deteccion_automatica: false,
      rociadores: false,
      suministro_agua: "",
      ...defaultValues,
    },
  });

  // Observar campos para lógica condicional
  const columnasHidrantes = form.watch("columnas_hidrantes");
  const deteccionAutomatica = form.watch("deteccion_automatica");
  const rociadores = form.watch("rociadores");

  // Actualizar arrays de zonas en el formulario
  const updateDeteccionZonas = (zona: string, value: boolean) => {
    const newZonas = { ...deteccionZonas, [zona]: value };
    setDeteccionZonas(newZonas);

    const zonasSeleccionadas = Object.entries(newZonas)
      .filter(([_, isSelected]) => isSelected)
      .map(([key]) => key);

    form.setValue("deteccion_zona", zonasSeleccionadas);
  };

  const updateRociadoresZonas = (zona: string, value: boolean) => {
    const newZonas = { ...rociadoresZonas, [zona]: value };
    setRociadoresZonas(newZonas);

    const zonasSeleccionadas = Object.entries(newZonas)
      .filter(([_, isSelected]) => isSelected)
      .map(([key]) => key);

    form.setValue("rociadores_zona", zonasSeleccionadas);
  };

  // Manejar el envío del formulario
  function onSubmit(data: ProteccionIncendiosFormData) {
    dispatch({
      type: "SET_PROTECCION_INCENDIOS",
      payload: { ...data, suministro_agua: data.suministro_agua || "" },
    });
    onNext(data);
  }

  return (
    <FormLayout
      title="Protección contra incendios"
      subtitle="Información sobre los sistemas de protección contra incendios"
      currentStep={5}
      totalSteps={7}
      onNext={form.handleSubmit(onSubmit)}
      onBack={onBack}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  <FormLabel>¿Tienes extintores?</FormLabel>
                </div>
              </FormItem>
            )}
          />

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
                  <FormLabel>¿Tienes bocas de incendio equipadas?</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deposito_bombeo"
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

          <FormField
            control={form.control}
            name="cobertura_total"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>¿Cubren la totalidad del riesgo?</FormLabel>
                </div>
              </FormItem>
            )}
          />

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
                  <FormLabel>¿Tienes columnas hidrantes exteriores?</FormLabel>
                </div>
              </FormItem>
            )}
          />

          {columnasHidrantes && (
            <FormField
              control={form.control}
              name="columnas_hidrantes_tipo"
              render={({ field }) => (
                <FormItem className="ml-7">
                  <FormLabel>Tipo de sistema</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="publico" />
                        </FormControl>
                        <FormLabel className="font-normal">Público</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="privado" />
                        </FormControl>
                        <FormLabel className="font-normal">Privado</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

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
                  <FormLabel>
                    ¿Tienes detección automática de incendios?
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          {deteccionAutomatica && (
            <FormItem className="ml-7">
              <FormLabel>Zonas con detección automática</FormLabel>
              <div className="space-y-2 mt-1">
                {[
                  { id: "oficinas", label: "Solo en zona de oficinas" },
                  { id: "tecnicas", label: "Solo en salas técnicas" },
                  { id: "almacen", label: "Solo en almacén" },
                  {
                    id: "totalidad",
                    label: "En la totalidad de la instalación",
                  },
                ].map((zona) => (
                  <div key={zona.id} className="flex items-center">
                    <Checkbox
                      id={`deteccion-${zona.id}`}
                      checked={deteccionZonas[zona.id]}
                      onCheckedChange={(checked) =>
                        updateDeteccionZonas(zona.id, checked === true)
                      }
                      className="mr-2"
                    />
                    <label
                      htmlFor={`deteccion-${zona.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {zona.label}
                    </label>
                  </div>
                ))}
              </div>
            </FormItem>
          )}

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
                  <FormLabel>¿Tienes rociadores?</FormLabel>
                </div>
              </FormItem>
            )}
          />

          {rociadores && (
            <FormItem className="ml-7">
              <FormLabel>Zonas con rociadores</FormLabel>
              <div className="space-y-2 mt-1">
                {[
                  { id: "oficinas", label: "Solo en zona de oficinas" },
                  { id: "tecnicas", label: "Solo en salas técnicas" },
                  { id: "almacen", label: "Solo en zonas de almacén" },
                  {
                    id: "totalidad",
                    label: "En la totalidad de la instalación",
                  },
                ].map((zona) => (
                  <div key={zona.id} className="flex items-center">
                    <Checkbox
                      id={`rociadores-${zona.id}`}
                      checked={rociadoresZonas[zona.id]}
                      onCheckedChange={(checked) =>
                        updateRociadoresZonas(zona.id, checked === true)
                      }
                      className="mr-2"
                    />
                    <label
                      htmlFor={`rociadores-${zona.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {zona.label}
                    </label>
                  </div>
                ))}
              </div>
            </FormItem>
          )}

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
