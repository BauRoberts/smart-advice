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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import FormLayout from "@/components/layout/FormLayout";
import { InfoTooltip } from "@/components/ui/InfoTooltip";

// Schema for Fabricación Step
const fabricacionSchema = z.object({
  // Detalles del producto
  producto_intermedio_final: z.boolean().default(false),
  producto_consumo_humano: z.boolean().default(false),

  // Alcance geográfico
  alcance_geografico: z.enum([
    "espana_andorra",
    "union_europea",
    "europa_reino_unido",
    "mundial_excepto_usa_canada",
    "mundial_incluyendo_usa_canada",
  ]),

  // Facturación por región (condicional)
  facturacion_espana_andorra: z.number().min(0).optional(),
  facturacion_union_europea: z.number().min(0).optional(),
  facturacion_reino_unido: z.number().min(0).optional(),
  facturacion_resto_mundo: z.number().min(0).optional(),
  facturacion_usa_canada: z.number().min(0).optional(),
});

export type FabricacionData = z.infer<typeof fabricacionSchema>;

interface FabricacionStepProps {
  onNext: (data: FabricacionData) => void;
  onBack: () => void;
  defaultValues?: Partial<FabricacionData>;
  formType?: string;
}

export default function FabricacionFormStep({
  onNext,
  onBack,
  defaultValues = {},
}: FabricacionStepProps) {
  const form = useForm<FabricacionData>({
    resolver: zodResolver(fabricacionSchema),
    defaultValues: {
      producto_intermedio_final: false,
      producto_consumo_humano: false,
      alcance_geografico: "espana_andorra",
      ...defaultValues,
    },
  });

  const alcanceGeografico = form.watch("alcance_geografico");
  const mostrarDetallesRegion = alcanceGeografico !== "espana_andorra";

  function onSubmit(data: FabricacionData) {
    onNext(data);
  }

  return (
    <FormLayout
      title="Fabricación y Diseño"
      subtitle="Información sobre tus productos y alcance geográfico"
      currentStep={3} // This is step 3 of 6 total steps
      totalSteps={6} // Total steps is 6 (including summary)
      onNext={form.handleSubmit(onSubmit)}
      onBack={onBack}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="mb-8 border p-6 rounded-md shadow-sm">
            <h3 className="text-xl text-gray-900 mb-6">
              Porque Diseñas, Fabricas o vendes productos
            </h3>

            {/* Tipo de producto */}
            <FormField
              control={form.control}
              name="producto_intermedio_final"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base font-normal">
                      ¿Tu producto es intermedio o final?
                    </FormLabel>
                    <div className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked === true)
                            }
                          />
                        </FormControl>
                        <span className="text-base">Sí</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={!field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked !== true)
                            }
                          />
                        </FormControl>
                        <span className="text-base">No</span>
                      </div>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Consumo humano */}
            <FormField
              control={form.control}
              name="producto_consumo_humano"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base font-normal">
                      ¿Tu producto está destinado al consumo humano o contacto
                      directo con el cuerpo?
                    </FormLabel>
                    <div className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked === true)
                            }
                          />
                        </FormControl>
                        <span className="text-base">Sí</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={!field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked !== true)
                            }
                          />
                        </FormControl>
                        <span className="text-base">No</span>
                      </div>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Alcance geográfico */}
            <FormField
              control={form.control}
              name="alcance_geografico"
              render={({ field }) => (
                <FormItem className="space-y-3 mb-4">
                  <FormLabel>Alcance geográfico de tus productos:</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="espana_andorra"
                          id="espana_andorra"
                        />
                        <FormLabel
                          htmlFor="espana_andorra"
                          className="font-normal"
                        >
                          España y Andorra
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="union_europea"
                          id="union_europea"
                        />
                        <FormLabel
                          htmlFor="union_europea"
                          className="font-normal"
                        >
                          Unión Europea
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="europa_reino_unido"
                          id="europa_reino_unido"
                        />
                        <FormLabel
                          htmlFor="europa_reino_unido"
                          className="font-normal"
                        >
                          Unión Europea y Reino Unido
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="mundial_excepto_usa_canada"
                          id="mundial_excepto_usa_canada"
                        />
                        <FormLabel
                          htmlFor="mundial_excepto_usa_canada"
                          className="font-normal"
                        >
                          Todo el mundo excepto USA y Canadá
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="mundial_incluyendo_usa_canada"
                          id="mundial_incluyendo_usa_canada"
                        />
                        <FormLabel
                          htmlFor="mundial_incluyendo_usa_canada"
                          className="font-normal"
                        >
                          Todo el mundo incluido USA y Canadá
                        </FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campos condicionales para detallar facturación por región */}
            {mostrarDetallesRegion && (
              <div className="pl-4 border-l-2 border-blue-200 space-y-4 mt-4">
                <FormLabel className="block text-sm font-medium">
                  Por favor, detalla facturación por región (en euros):
                </FormLabel>

                <FormField
                  control={form.control}
                  name="facturacion_espana_andorra"
                  render={({ field }) => (
                    <FormItem className="mb-2">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm font-normal">
                          España y Andorra
                        </FormLabel>
                        <FormControl>
                          <input
                            type="number"
                            min="0"
                            className="w-32 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                            placeholder="0€"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber || 0)
                            }
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {(alcanceGeografico === "union_europea" ||
                  alcanceGeografico === "europa_reino_unido" ||
                  alcanceGeografico === "mundial_excepto_usa_canada" ||
                  alcanceGeografico === "mundial_incluyendo_usa_canada") && (
                  <FormField
                    control={form.control}
                    name="facturacion_union_europea"
                    render={({ field }) => (
                      <FormItem className="mb-2">
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-sm font-normal">
                            Unión Europea
                          </FormLabel>
                          <FormControl>
                            <input
                              type="number"
                              min="0"
                              className="w-32 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                              placeholder="0€"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber || 0)
                              }
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {(alcanceGeografico === "europa_reino_unido" ||
                  alcanceGeografico === "mundial_excepto_usa_canada" ||
                  alcanceGeografico === "mundial_incluyendo_usa_canada") && (
                  <FormField
                    control={form.control}
                    name="facturacion_reino_unido"
                    render={({ field }) => (
                      <FormItem className="mb-2">
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-sm font-normal">
                            Reino Unido
                          </FormLabel>
                          <FormControl>
                            <input
                              type="number"
                              min="0"
                              className="w-32 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                              placeholder="0€"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber || 0)
                              }
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {(alcanceGeografico === "mundial_excepto_usa_canada" ||
                  alcanceGeografico === "mundial_incluyendo_usa_canada") && (
                  <FormField
                    control={form.control}
                    name="facturacion_resto_mundo"
                    render={({ field }) => (
                      <FormItem className="mb-2">
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-sm font-normal">
                            Resto del mundo (excepto USA y Canadá)
                          </FormLabel>
                          <FormControl>
                            <input
                              type="number"
                              min="0"
                              className="w-32 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                              placeholder="0€"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber || 0)
                              }
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {alcanceGeografico === "mundial_incluyendo_usa_canada" && (
                  <FormField
                    control={form.control}
                    name="facturacion_usa_canada"
                    render={({ field }) => (
                      <FormItem className="mb-2">
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-sm font-normal">
                            USA y Canadá
                          </FormLabel>
                          <FormControl>
                            <input
                              type="number"
                              min="0"
                              className="w-32 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                              placeholder="0€"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber || 0)
                              }
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}
          </div>
        </form>
      </Form>
    </FormLayout>
  );
}
