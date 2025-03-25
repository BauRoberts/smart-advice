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
import { InfoTooltip } from "@/components/ui/InfoTooltip";

// Schema for ServiciosStep
const serviciosSchema = z.object({
  // Servicios preguntas
  subcontrata_personal: z.boolean().default(false),
  trabajos_corte_soldadura: z.boolean().default(false),
  trabajos_afectan_edificios: z.boolean().default(false),
  trabajos_afectan_infraestructuras: z.boolean().default(false),
  trabajos_instalaciones_terceros: z.boolean().default(false),
  cubre_preexistencias: z.boolean().default(false),
});

export type ServiciosData = z.infer<typeof serviciosSchema>;

interface ServiciosStepProps {
  onNext: (data: ServiciosData) => void;
  onBack: () => void;
  defaultValues?: Partial<ServiciosData>;
  formType?: string;
}

export default function ServiciosFormStep({
  onNext,
  onBack,
  defaultValues = {},
  formType = "responsabilidad_civil",
}: ServiciosStepProps) {
  const totalSteps = formType === "danos_materiales" ? 7 : 5;

  const form = useForm<ServiciosData>({
    resolver: zodResolver(serviciosSchema),
    defaultValues: {
      subcontrata_personal: false,
      trabajos_corte_soldadura: false,
      trabajos_afectan_edificios: false,
      trabajos_afectan_infraestructuras: false,
      trabajos_instalaciones_terceros: false,
      cubre_preexistencias: false,
      ...defaultValues,
    },
  });

  function onSubmit(data: ServiciosData) {
    onNext(data);
  }

  return (
    <FormLayout
      title="Sección de Prestación de Servicios"
      subtitle="Información sobre los servicios que ofreces"
      currentStep={3}
      totalSteps={totalSteps}
      onNext={form.handleSubmit(onSubmit)}
      onBack={onBack}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="mb-8 border p-6 rounded-md shadow-sm">
            <h3 className="text-xl text-gray-900 mb-6">
              Porque prestas Servicios
            </h3>

            {/* Subcontratación */}
            <FormField
              control={form.control}
              name="subcontrata_personal"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base font-normal">
                      ¿Subcontratas a otras personas o empresas para realizar
                      trabajos?
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

            {/* Trabajos de corte y soldadura */}
            <FormField
              control={form.control}
              name="trabajos_corte_soldadura"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base font-normal">
                      ¿Realizas trabajos de corte y soldadura?
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

            {/* Trabajos que afecten a edificios */}
            <FormField
              control={form.control}
              name="trabajos_afectan_edificios"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base font-normal">
                      ¿Realizas trabajos que puedan afectar edificios, terrenos
                      o estructuras vecinas?
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

            {/* Trabajos que afecten a infraestructuras */}
            <FormField
              control={form.control}
              name="trabajos_afectan_infraestructuras"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base font-normal">
                      ¿Realizas trabajos que puedan afectar tuberías, cables,
                      gasoductos, alcantarillado u otras infraestructuras?
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

            {/* Trabajos en instalaciones de terceros */}
            <FormField
              control={form.control}
              name="trabajos_instalaciones_terceros"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base font-normal">
                      ¿Realizas trabajos en instalaciones/bienes de terceros?
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

            {/* Cobertura de preexistencias */}
            <FormField
              control={form.control}
              name="cubre_preexistencias"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base font-normal">
                      ¿Quieres cubrir daños a bienes preexistentes antes de
                      comenzar trabajos?
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
