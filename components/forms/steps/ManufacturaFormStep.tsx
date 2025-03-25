// components/forms/steps/ManufacturaFormStep.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormLayout from "@/components/layout/FormLayout";
import { useFormContext } from "@/contexts/FormContext";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

// Schema actualizado para validar los datos de manufactura
const manufacturaSchema = z.object({
  producto_consumo_humano: z.boolean().default(false),
  producto_contacto_humano: z.boolean().default(false),
  tiene_empleados_tecnicos: z.boolean().default(false),
  producto_final_o_intermedio: z.string().min(1, {
    message: "Debes seleccionar el tipo de producto",
  }),
  distribucion: z.array(z.string()).min(1, {
    message: "Selecciona al menos una opción de distribución",
  }),
  facturacion_por_region: z.record(z.string(), z.number()).optional(),
  matriz_en_espana: z.boolean().default(true),
  filiales: z.array(z.string()).default([]),
  considerar_gastos_retirada: z.boolean().default(false),
});

// Tipo para los datos de manufactura
export type ManufacturaFormData = z.infer<typeof manufacturaSchema>;

interface ManufacturaFormStepProps {
  onNext: () => void;
  onBack: () => void;
  defaultValues?: Partial<ManufacturaFormData>;
}

export default function ManufacturaFormStep({
  onNext,
  onBack,
  defaultValues = {},
}: ManufacturaFormStepProps) {
  const { dispatch } = useFormContext();
  const [showFacturacionPorRegion, setShowFacturacionPorRegion] =
    useState(false);
  const [facturacionPorRegion, setFacturacionPorRegion] = useState<
    Record<string, number>
  >({});

  // Inicializar el formulario con React Hook Form
  const form = useForm<ManufacturaFormData>({
    resolver: zodResolver(manufacturaSchema),
    defaultValues: {
      producto_consumo_humano: false,
      producto_contacto_humano: false,
      tiene_empleados_tecnicos: false,
      producto_final_o_intermedio: "",
      distribucion: [],
      facturacion_por_region: {},
      matriz_en_espana: true,
      filiales: [],
      considerar_gastos_retirada: false,
      ...defaultValues,
    },
  });

  // Observar si el producto es de consumo humano
  const esConsumoHumano = form.watch("producto_consumo_humano");

  // Observar las regiones de distribución
  const distribucion = form.watch("distribucion");

  // Actualizar la visibilidad de facturación por región
  useEffect(() => {
    if (distribucion && distribucion.length > 1) {
      setShowFacturacionPorRegion(true);

      // Inicializar objeto de facturación por región
      const newFacturacion: Record<string, number> = {};
      distribucion.forEach((region) => {
        newFacturacion[region] = facturacionPorRegion[region] || 0;
      });

      setFacturacionPorRegion(newFacturacion);
      form.setValue("facturacion_por_region", newFacturacion);
    } else {
      setShowFacturacionPorRegion(false);
    }
  }, [distribucion]);

  // Actualizar facturación por región
  const handleFacturacionChange = (region: string, value: number) => {
    const newFacturacion = {
      ...facturacionPorRegion,
      [region]: value,
    };

    setFacturacionPorRegion(newFacturacion);
    form.setValue("facturacion_por_region", newFacturacion);
  };

  // Manejar el envío del formulario
  function onSubmit(data: ManufacturaFormData) {
    dispatch({ type: "SET_ACTIVIDAD_MANUFACTURA", payload: data });
    onNext();
  }

  // Mapeo de IDs de región a etiquetas
  const regionLabels: Record<string, string> = {
    espana: "España + Andorra",
    ue: "Unión Europea",
    ue_uk: "Unión Europea y Reino Unido",
    "mundial-sin-usa": "Todo el mundo excepto USA y Canadá",
    "mundial-con-usa": "Todo el mundo incluido USA y Canadá",
  };

  return (
    <FormLayout
      title="Información de manufactura"
      subtitle="Detalles sobre tu producto y actividad de fabricación"
      currentStep={4}
      totalSteps={6}
      onNext={form.handleSubmit(onSubmit)}
      onBack={onBack}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="producto_consumo_humano"
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
                    ¿El producto está destinado al consumo humano?
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="producto_contacto_humano"
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
                    ¿El producto está destinado a estar en contacto directo con
                    el cuerpo humano?
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          {!esConsumoHumano && (
            <FormField
              control={form.control}
              name="considerar_gastos_retirada"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 pl-6 border-l-2 border-gray-200">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      ¿Deseas analizar la contratación de gastos de retirada
                      aunque tu producto no sea de consumo humano?
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="tiene_empleados_tecnicos"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>¿Hay empleados técnicos en plantilla?</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="matriz_en_espana"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>¿La empresa matriz está en España?</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="producto_final_o_intermedio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tu producto es:</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo de producto" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="final">Producto Final</SelectItem>
                    <SelectItem value="intermedio">
                      Producto Intermedio
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Si tu producto se incorpora a otros productos o procesos, es
                  intermedio.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="distribucion"
            render={() => (
              <FormItem>
                <FormLabel>
                  Indícanos el alcance geográfico de tus productos:
                </FormLabel>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: "espana", label: "España + Andorra" },
                    { id: "ue", label: "Unión Europea" },
                    { id: "ue_uk", label: "Unión Europea y Reino Unido" },
                    {
                      id: "mundial-sin-usa",
                      label: "Todo el mundo excepto USA y Canadá",
                    },
                    {
                      id: "mundial-con-usa",
                      label: "Todo el mundo incluido USA y Canadá",
                    },
                  ].map((region) => (
                    <FormField
                      key={region.id}
                      control={form.control}
                      name="distribucion"
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

          {/* Facturación por región */}
          {showFacturacionPorRegion && (
            <div className="border p-4 rounded-md bg-gray-50">
              <h4 className="font-medium mb-3">Facturación por región</h4>
              <p className="text-sm text-gray-600 mb-4">
                Indícanos cuánto facturas en cada una de las regiones
                seleccionadas
              </p>

              <div className="space-y-3">
                {distribucion.map((region) => (
                  <div key={region} className="flex items-center space-x-4">
                    <label className="w-1/2 text-sm font-medium">
                      {regionLabels[region] || region}:
                    </label>
                    <div className="w-1/2 relative">
                      <Input
                        type="number"
                        value={facturacionPorRegion[region] || ""}
                        onChange={(e) =>
                          handleFacturacionChange(
                            region,
                            parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="Facturación anual"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        €
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </Form>
    </FormLayout>
  );
}
