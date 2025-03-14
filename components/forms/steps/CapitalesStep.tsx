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
  valor_existencias_terceros: z.number().optional(),
  existencias_propias_terceros: z.boolean().default(false),
  valor_existencias_propias_terceros: z.number().optional(),
  existencias_intemperie: z.boolean().default(false),
  valor_existencias_intemperie: z.number().optional(),
  vehiculos_terceros_aparcados: z.boolean().default(false),
  valor_vehiculos_terceros: z.number().optional(),
  bienes_empleados: z.boolean().default(false),
  valor_bienes_empleados: z.number().optional(),
  bienes_camaras_frigorificas: z.boolean().default(false),
  valor_bienes_camaras_frigorificas: z.number().optional(),
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
      valor_existencias_terceros: 0,
      existencias_propias_terceros: false,
      valor_existencias_propias_terceros: 0,
      existencias_intemperie: false,
      valor_existencias_intemperie: 0,
      vehiculos_terceros_aparcados: false,
      valor_vehiculos_terceros: 0,
      bienes_empleados: false,
      valor_bienes_empleados: 0,
      bienes_camaras_frigorificas: false,
      valor_bienes_camaras_frigorificas: 0,
      valor_equipo_electronico: 0,
      margen_bruto_anual: 0,
      ...defaultValues,
    },
  });

  // Observar los campos que activan campos adicionales
  const existenciasTerceros = form.watch("existencias_terceros");
  const existenciasPropiasTerceros = form.watch("existencias_propias_terceros");
  const existenciasIntemperie = form.watch("existencias_intemperie");
  const vehiculosTerceros = form.watch("vehiculos_terceros_aparcados");
  const bienesEmpleados = form.watch("bienes_empleados");
  const bienesCamarasFrigorificas = form.watch("bienes_camaras_frigorificas");

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
          {/* Sección: Valores principales */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">
              Valores principales
            </h3>

            <FormField
              control={form.control}
              name="valor_edificio"
              render={({ field }) => (
                <FormItem className="mb-4">
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
                <FormItem className="mb-4">
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
                <FormItem className="mb-4">
                  <div className="flex items-center">
                    <FormLabel>Valor de existencias propias</FormLabel>
                    <InfoTooltip text="Mercancías, materias primas, productos en proceso o terminados" />
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
              name="valor_equipo_electronico"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel>Valor del equipo electrónico</FormLabel>
                    <InfoTooltip text="Ordenadores, servidores, equipos de comunicación, etc." />
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
          </div>

          {/* Sección: Bienes especiales */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">
              Bienes especiales y situaciones particulares
            </h3>

            {/* Existencias de terceros */}
            <div className="mb-5 border-b pb-4">
              <FormField
                control={form.control}
                name="existencias_terceros"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        ¿Almacenas o tienes depositados bienes (maquinaria o
                        existencias) de terceros en tus instalaciones?
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {existenciasTerceros && (
                <FormField
                  control={form.control}
                  name="valor_existencias_terceros"
                  render={({ field }) => (
                    <FormItem className="mt-3 ml-7">
                      <FormLabel>Valor de los bienes de terceros</FormLabel>
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
              )}
            </div>

            {/* Existencias propias en instalaciones de terceros */}
            <div className="mb-5 border-b pb-4">
              <FormField
                control={form.control}
                name="existencias_propias_terceros"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        ¿Tienes depositados o almacenas bienes propios
                        (maquinaria o existencias) en instalaciones de terceros?
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {existenciasPropiasTerceros && (
                <FormField
                  control={form.control}
                  name="valor_existencias_propias_terceros"
                  render={({ field }) => (
                    <FormItem className="mt-3 ml-7">
                      <FormLabel>
                        Valor de bienes propios en instalaciones de terceros
                      </FormLabel>
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
              )}
            </div>

            {/* Existencias a la intemperie */}
            <div className="mb-5 border-b pb-4">
              <FormField
                control={form.control}
                name="existencias_intemperie"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        ¿Almacenas o tienes depositados maquinaria o existencias
                        a la intemperie?
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {existenciasIntemperie && (
                <FormField
                  control={form.control}
                  name="valor_existencias_intemperie"
                  render={({ field }) => (
                    <FormItem className="mt-3 ml-7">
                      <FormLabel>Valor de bienes a la intemperie</FormLabel>
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
              )}
            </div>

            {/* Vehículos de terceros */}
            <div className="mb-5 border-b pb-4">
              <FormField
                control={form.control}
                name="vehiculos_terceros_aparcados"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        ¿Existen vehículos de terceros aparcados dentro de tus
                        instalaciones?
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {vehiculosTerceros && (
                <FormField
                  control={form.control}
                  name="valor_vehiculos_terceros"
                  render={({ field }) => (
                    <FormItem className="mt-3 ml-7">
                      <FormLabel>Valor estimado de los vehículos</FormLabel>
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
              )}
            </div>

            {/* Bienes de empleados */}
            <div className="mb-5 border-b pb-4">
              <FormField
                control={form.control}
                name="bienes_empleados"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        ¿Quieres cubrir los daños a los bienes de empleados
                        (ropa, enseres, bienes personales)?
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {bienesEmpleados && (
                <FormField
                  control={form.control}
                  name="valor_bienes_empleados"
                  render={({ field }) => (
                    <FormItem className="mt-3 ml-7">
                      <FormLabel>
                        Valor estimado de los bienes de empleados
                      </FormLabel>
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
              )}
            </div>

            {/* Bienes en cámaras frigoríficas - NUEVO */}
            <div className="mb-5 border-b pb-4">
              <FormField
                control={form.control}
                name="bienes_camaras_frigorificas"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        ¿Tienes bienes almacenados en cámaras frigoríficas?
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {bienesCamarasFrigorificas && (
                <FormField
                  control={form.control}
                  name="valor_bienes_camaras_frigorificas"
                  render={({ field }) => (
                    <FormItem className="mt-3 ml-7">
                      <FormLabel>
                        Valor de los bienes en cámaras frigoríficas
                      </FormLabel>
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
              )}
            </div>
          </div>

          {/* Sección: Pérdida de beneficios */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">
              Pérdida de beneficios
            </h3>

            <FormField
              control={form.control}
              name="margen_bruto_anual"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel>Margen bruto anual</FormLabel>
                    <InfoTooltip text="Se obtiene sumando los GASTOS FIJOS + BENEFICIO NETO ANTES DE IMPUESTOS. Este valor es importante para calcular la indemnización por interrupción de negocio en caso de siniestro." />
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
                  <FormDescription>
                    Este valor se usa para calcular la indemnización por
                    interrupción de negocio.
                  </FormDescription>
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
