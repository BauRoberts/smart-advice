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

// Schema for AdditionalCoverageStep
const additionalCoverageSchema = z.object({
  // Ámbito territorial
  has_subsidiaries_outside_spain: z.boolean().default(false),
  territorial_scope: z
    .enum([
      "europe",
      "europe_uk",
      "worldwide_except_usa_canada",
      "worldwide_including_usa_canada",
    ])
    .optional(),

  // Coberturas adicionales
  cover_accidental_contamination: z.boolean().default(false),
  cover_material_damages: z.boolean().default(false),

  // Características del negocio
  has_contracted_professionals: z.boolean().default(false),
  participates_in_fairs: z.boolean().default(false),
  cover_employee_damages: z.boolean().default(false),
  stores_third_party_goods: z.boolean().default(false),
  third_party_vehicles_parked: z.boolean().default(false),
});

export type AdditionalCoverageData = z.infer<typeof additionalCoverageSchema>;

interface AdditionalCoverageStepProps {
  onNext: (data: AdditionalCoverageData) => void;
  onBack: () => void;
  defaultValues?: Partial<AdditionalCoverageData>;
  formType?: string;
}

export default function AdditionalCoverageStep({
  onNext,
  onBack,
  defaultValues = {},
  formType = "responsabilidad_civil",
}: AdditionalCoverageStepProps) {
  const isDanosMateriales = formType === "danos_materiales";
  const totalSteps = isDanosMateriales ? 7 : 5;

  const form = useForm<AdditionalCoverageData>({
    resolver: zodResolver(additionalCoverageSchema),
    defaultValues: {
      has_subsidiaries_outside_spain: false,
      territorial_scope: undefined,
      cover_accidental_contamination: false,
      cover_material_damages: false,
      has_contracted_professionals: false,
      participates_in_fairs: false,
      cover_employee_damages: false,
      stores_third_party_goods: false,
      third_party_vehicles_parked: false,
      ...defaultValues,
    },
  });

  const hasSubsidiariesOutsideSpain = form.watch(
    "has_subsidiaries_outside_spain"
  );

  function onSubmit(data: AdditionalCoverageData) {
    onNext(data);
  }

  return (
    <FormLayout
      title="Coberturas adicionales"
      subtitle="Información adicional para personalizar tu seguro"
      currentStep={2}
      totalSteps={totalSteps}
      onNext={form.handleSubmit(onSubmit)}
      onBack={onBack}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="mb-8 border p-6 rounded-md shadow-sm">
            <h3 className="text-xl text-gray-900 mb-6">
              Coberturas adicionales
            </h3>
            {/* Filiales fuera de España */}
            <FormField
              control={form.control}
              name="has_subsidiaries_outside_spain"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base font-normal">
                      ¿Tienes filiales fuera de España?
                    </FormLabel>
                    <div className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked === true);
                              if (!checked) {
                                form.setValue("territorial_scope", undefined);
                              }
                            }}
                          />
                        </FormControl>
                        <span className="text-base">Sí</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={!field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked !== true);
                              if (checked) {
                                form.setValue("territorial_scope", undefined);
                              }
                            }}
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

            {/* Ámbito territorial (condicional) */}
            {hasSubsidiariesOutsideSpain && (
              <div className="mb-4 pl-4 border-l-2 border-gray-200">
                <FormField
                  control={form.control}
                  name="territorial_scope"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Selecciona el ámbito territorial:</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="europe" id="europe" />
                            <FormLabel htmlFor="europe" className="font-normal">
                              Unión Europea
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="europe_uk" id="europe_uk" />
                            <FormLabel
                              htmlFor="europe_uk"
                              className="font-normal"
                            >
                              Unión Europea y Reino Unido
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="worldwide_except_usa_canada"
                              id="worldwide_except_usa_canada"
                            />
                            <FormLabel
                              htmlFor="worldwide_except_usa_canada"
                              className="font-normal"
                            >
                              Todo el Mundo excepto USA y Canadá
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="worldwide_including_usa_canada"
                              id="worldwide_including_usa_canada"
                            />
                            <FormLabel
                              htmlFor="worldwide_including_usa_canada"
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
              </div>
            )}

            {/* Contaminación accidental */}
            <FormField
              control={form.control}
              name="cover_accidental_contamination"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base font-normal">
                      ¿Quieres cubrir la contaminación accidental y repentina
                      derivada de tu actividad?
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

            {/* Vehículos de terceros */}
            <FormField
              control={form.control}
              name="third_party_vehicles_parked"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base font-normal">
                      ¿Se aparcan vehículos de terceros dentro de tus
                      instalaciones?
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

            {/* RC por daños patrimoniales */}
            <FormField
              control={form.control}
              name="cover_material_damages"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base font-normal">
                      ¿Quieres cubrir la RC por daños patrimoniales puros (no
                      consecuencia de daño personal/material)?
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

            {/* Profesionales contratados */}
            <FormField
              control={form.control}
              name="has_contracted_professionals"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base font-normal">
                      ¿Tienes contratado a profesionales o técnicos en tu
                      plantilla?
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

            {/* Participación en ferias */}
            <FormField
              control={form.control}
              name="participates_in_fairs"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base font-normal">
                      ¿Participas en ferias, congresos o exposiciones
                      (incluyendo stands)?
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

            {/* Cobertura a bienes de empleados */}
            <FormField
              control={form.control}
              name="cover_employee_damages"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base font-normal">
                      ¿Quieres cubrir los daños a bienes de tus empleados?
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

            {/* Bienes de terceros */}
            <FormField
              control={form.control}
              name="stores_third_party_goods"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base font-normal">
                      ¿Almacenas o custodias bienes de terceros en tus
                      instalaciones?
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
          </div>
        </form>
      </Form>
    </FormLayout>
  );
}
