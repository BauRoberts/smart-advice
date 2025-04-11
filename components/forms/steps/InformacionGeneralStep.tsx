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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormLayout from "@/components/layout/FormLayout";
import CnaeSearch from "@/components/CnaeSearch";
import { useEffect, useState } from "react";
import { CnaeOption } from "@/lib/services/cnaeService";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { useFormContext } from "@/contexts/FormContext";
import { Textarea } from "@/components/ui/textarea";

// Schema para InformacionGeneralStep
const informacionGeneralSchema = z.object({
  // Datos básicos del negocio
  name: z.string().min(2, {
    message: "El nombre de la empresa debe tener al menos 2 caracteres",
  }),
  cif: z.string().min(5, {
    message: "El CIF debe tener al menos 5 caracteres",
  }),
  direccion: z.string().min(5, {
    message: "La dirección debe tener al menos 5 caracteres",
  }),
  cnae_code: z.string().min(1, {
    message: "Debes seleccionar un código CNAE",
  }),
  activity: z.string().min(1, {
    message: "La actividad es obligatoria",
  }),
  activity_description: z.string().min(1, {
    message: "La descripción de actividad es obligatoria",
  }),
  employees_number: z.number().int().positive({
    message: "El número de empleados debe ser un número positivo",
  }),
  billing: z.number().positive({
    message: "La facturación debe ser un número positivo",
  }),
  online_invoice: z.boolean().default(false),
  online_invoice_percentage: z.number().min(0).max(100).default(0),

  // Instalaciones
  es_propietario: z.enum(["si", "no"]),
  propietario_nombre: z.string().optional(),
  propietario_nif: z.string().optional(),
  m2_installations: z.number().positive({
    message: "Los metros cuadrados deben ser un número positivo",
  }),
});

// Tipo para los datos de información general
export type InformacionGeneralData = z.infer<typeof informacionGeneralSchema>;

interface InformacionGeneralStepProps {
  onNext: (data: InformacionGeneralData) => void;
  onBack: () => void;
  defaultValues?: Partial<InformacionGeneralData>;
  currentStep?: number;
  totalSteps?: number;
}

export default function InformacionGeneralStep({
  onNext,
  onBack,
  defaultValues = {},
  currentStep = 1,
  totalSteps = 8,
}: InformacionGeneralStepProps) {
  const { formData } = useFormContext();
  const [selectedCnaeActivity, setSelectedCnaeActivity] =
    useState<CnaeOption | null>(null);

  // Inicializar el formulario con React Hook Form
  const form = useForm<InformacionGeneralData>({
    resolver: zodResolver(informacionGeneralSchema),
    defaultValues: {
      name: "",
      cif: "",
      direccion: "",
      cnae_code: "",
      activity: "",
      activity_description: "",
      employees_number: undefined,
      billing: undefined,
      online_invoice: false,
      online_invoice_percentage: 0,
      es_propietario: "si",
      propietario_nombre: "",
      propietario_nif: "",
      m2_installations: undefined,
      ...defaultValues,
    },
  });

  // Observar si factura online para mostrar/ocultar el porcentaje
  const onlineInvoice = form.watch("online_invoice");

  // Observar si es propietario para mostrar/ocultar campos adicionales
  const esPropietario = form.watch("es_propietario");

  // Manejar el envío del formulario
  function onSubmit(data: InformacionGeneralData) {
    onNext(data);
  }

  return (
    <FormLayout
      title="Información General"
      subtitle="Completa los datos básicos de tu empresa para personalizar las recomendaciones"
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={form.handleSubmit(onSubmit)}
      onBack={onBack}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Sección: Datos Básicos del Negocio */}
          <div className="mb-6 border p-4 rounded-md shadow-sm">
            <h3 className="font-medium text-black-600 mb-3">
              Datos Básicos del Negocio
            </h3>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Nombre de la empresa</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre de la empresa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cif"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>CIF</FormLabel>
                  <FormControl>
                    <Input placeholder="CIF de la empresa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="direccion"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input placeholder="Dirección de la empresa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem className="mb-4">
              <div className="flex items-center">
                <FormLabel>Actividad (CNAE)</FormLabel>
                <InfoTooltip text="Selecciona el código CNAE que mejor represente la actividad de tu empresa" />
              </div>
              <FormControl>
                <CnaeSearch
                  onSelect={(option) => {
                    setSelectedCnaeActivity(option);
                    form.setValue("activity", option.description);
                    form.setValue("cnae_code", option.code);
                  }}
                  defaultValue={form.watch("cnae_code")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormField
              control={form.control}
              name="activity_description"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Describe tu actividad</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe brevemente la actividad principal de tu empresa..."
                      className="resize-none"
                      {...field}
                      maxLength={200}
                    />
                  </FormControl>
                  <FormDescription>
                    Máximo 200 caracteres. {field.value?.length || 0}/200
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Sección: Facturación */}
          <div className="mb-6 border p-4 rounded-md shadow-sm">
            <h3 className="font-medium text-black-600 mb-3">Facturación</h3>

            <FormField
              control={form.control}
              name="employees_number"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Número de Empleados</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Número de empleados"
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : ""
                        )
                      }
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormDescription>
                    Solo se consideran empleados en nómina
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billing"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <div className="flex items-center">
                    <FormLabel>Facturación Anual</FormLabel>
                    <InfoTooltip text="Incluir solo la facturación a terceros excluyendo la facturación a otras empresas del grupo" />
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number" // Será sobrescrito a "text" por formatNumber
                        formatNumber={true}
                        placeholder="Valor"
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : 0
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

            <div className="flex items-center justify-between space-x-4 mb-4">
              <FormField
                control={form.control}
                name="online_invoice"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>% Online</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {onlineInvoice && (
                <FormField
                  control={form.control}
                  name="online_invoice_percentage"
                  render={({ field }) => (
                    <FormItem className="flex-shrink-0 w-[200px]">
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            placeholder="Porcentaje"
                            value={field.value?.toString() || ""}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (isNaN(value)) {
                                field.onChange(0);
                              } else if (value > 100) {
                                field.onChange(100);
                              } else if (value < 0) {
                                field.onChange(0);
                              } else {
                                field.onChange(value);
                              }
                            }}
                            min={0}
                            max={100}
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            %
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>

          {/* Sección: Instalaciones */}
          <div className="mb-6 border p-4 rounded-md shadow-sm">
            <h3 className="font-medium text-black-600 mb-3">Instalaciones</h3>

            <FormField
              control={form.control}
              name="es_propietario"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Instalaciones</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="si">Soy Propietario</SelectItem>
                      <SelectItem value="no">No soy propietario</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campos condicionales para No propietario */}
            {esPropietario === "no" && (
              <div className="pl-4 border-l-2 border-gray-200 mb-4">
                <FormField
                  control={form.control}
                  name="propietario_nombre"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Nombre del propietario</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nombre del propietario"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="propietario_nif"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>NIF del propietario</FormLabel>
                      <FormControl>
                        <Input placeholder="NIF del propietario" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="m2_installations"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>M²</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="Metros cuadrados"
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseFloat(e.target.value) : ""
                          )
                        }
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        m²
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </FormLayout>
  );
}
