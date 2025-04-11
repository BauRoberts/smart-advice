"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import FormLayout from "@/components/layout/FormLayout";
import { useFormContext } from "@/contexts/FormContext";
import { InfoTooltip } from "@/components/ui/InfoTooltip";

// Schema para validar los datos combinados de capitales y coberturas
const capitalesYCoberturasSchema = z.object({
  // Capitales a asegurar
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
  periodo_indemnizacion: z.string().optional(),

  // Nuevos campos para coberturas
  bienes_leasing: z.boolean().default(false),
  leasing_arrendador: z.string().optional(),
  leasing_cif: z.string().optional(),
  leasing_contrato: z.string().optional(),
  leasing_identificacion: z.string().optional(),

  dinero_caja_fuerte: z.boolean().default(false),
  valor_dinero_caja_fuerte: z.number().optional(),

  dinero_fuera_caja: z.boolean().default(false),
  valor_dinero_fuera_caja: z.number().optional(),

  averia_maquinaria: z.boolean().default(false),
  valor_averia_maquinaria: z.number().optional(),

  todo_riesgo_accidental: z.boolean().default(false),

  // Coberturas de Responsabilidad Civil
  responsabilidad_civil: z.boolean().default(false),
  coberturas_rc: z
    .object({
      explotacion: z.boolean().default(false),
      patronal: z.boolean().default(false),
      productos: z.boolean().default(false),
      inmobiliaria: z.boolean().default(false),
      locativa: z.boolean().default(false),
    })
    .optional(),

  // Protecciones para cámaras frigoríficas
  proteccion_camaras: z
    .object({
      control_temperatura: z.boolean().default(false),
      deteccion_incendio: z.boolean().default(false),
    })
    .optional(),
});

// Tipo para los datos del formulario
export type CapitalesYCoberturasData = z.infer<
  typeof capitalesYCoberturasSchema
>;

interface CapitalesYCoberturasStepProps {
  onNext: (data: CapitalesYCoberturasData) => void;
  onBack: () => void;
  defaultValues?: Partial<CapitalesYCoberturasData>;
  currentStep?: number;
  totalSteps?: number;
}

export default function CapitalesYCoberturasStep({
  onNext,
  onBack,
  defaultValues = {},
  currentStep = 5,
  totalSteps = 8,
}: CapitalesYCoberturasStepProps) {
  const { dispatch } = useFormContext();

  // Inicializar el formulario con React Hook Form
  const form = useForm<CapitalesYCoberturasData>({
    resolver: zodResolver(capitalesYCoberturasSchema),
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
      periodo_indemnizacion: "",
      bienes_leasing: false,
      leasing_arrendador: "",
      leasing_cif: "",
      leasing_contrato: "",
      leasing_identificacion: "",
      dinero_caja_fuerte: false,
      valor_dinero_caja_fuerte: 0,
      dinero_fuera_caja: false,
      valor_dinero_fuera_caja: 0,
      averia_maquinaria: false,
      valor_averia_maquinaria: 0,
      todo_riesgo_accidental: false,
      responsabilidad_civil: false,
      coberturas_rc: {
        explotacion: false,
        patronal: false,
        productos: false,
        inmobiliaria: false,
        locativa: false,
      },
      proteccion_camaras: {
        control_temperatura: false,
        deteccion_incendio: false,
      },
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
  const margenBrutoAnual = form.watch("margen_bruto_anual");
  const bienesLeasing = form.watch("bienes_leasing");
  const dineroCajaFuerte = form.watch("dinero_caja_fuerte");
  const dineroFueraCaja = form.watch("dinero_fuera_caja");
  const averiaMaquinaria = form.watch("averia_maquinaria");
  const responsabilidadCivil = form.watch("responsabilidad_civil");

  // Estado para manejar las selecciones de coberturas RC
  const [selectedCoberturasRC, setSelectedCoberturasRC] = useState({
    explotacion: defaultValues.coberturas_rc?.explotacion || false,
    patronal: defaultValues.coberturas_rc?.patronal || false,
    productos: defaultValues.coberturas_rc?.productos || false,
    inmobiliaria: defaultValues.coberturas_rc?.inmobiliaria || false,
    locativa: defaultValues.coberturas_rc?.locativa || false,
  });

  // Función para alternar la selección de una cobertura RC
  const toggleCoberturaRC = (cobertura: keyof typeof selectedCoberturasRC) => {
    setSelectedCoberturasRC((prev) => {
      const updated = {
        ...prev,
        [cobertura]: !prev[cobertura],
      };

      // Actualizar el formulario para mantener sincronía
      form.setValue(`coberturas_rc.${cobertura}` as any, updated[cobertura]);

      return updated;
    });
  };

  // Manejar el envío del formulario
  function onSubmit(data: CapitalesYCoberturasData) {
    // Guardar los datos en el contexto del formulario
    dispatch({ type: "SET_CAPITALES_Y_COBERTURAS", payload: data });
    onNext(data);
  }

  return (
    <FormLayout
      title="Capitales a asegurar y coberturas"
      subtitle="Información sobre los valores a asegurar y las coberturas que necesitas"
      currentStep={currentStep}
      totalSteps={totalSteps}
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
                    <FormLabel>Valor del ajuar industrial</FormLabel>
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
                      <FormDescription>
                        Esta cobertura también puede incluirse en una póliza de
                        Responsabilidad Civil general. Se recomienda cubrir esto
                        en una póliza de Daños porque la indemnización es mejor.
                      </FormDescription>
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
                        ¿Almacenas maquinaria o existencias a la intemperie?
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
                        ¿Existen vehículos aparcados dentro de tus
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
                      <FormDescription>
                        Esta cobertura también puede incluirse en una póliza de
                        Responsabilidad Civil general. Se recomienda cubrir esto
                        en una póliza de Daños porque la indemnización es mejor.
                      </FormDescription>
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
                        ¿Quieres cubrir los daños a los bienes de empleados?
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
                      <FormDescription>
                        Esta cobertura también puede incluirse en una póliza de
                        Responsabilidad Civil general. Se recomienda cubrir esto
                        en una póliza de Daños porque la indemnización es mejor.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Bienes en cámaras frigoríficas */}
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
                <>
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
                                  e.target.value
                                    ? parseFloat(e.target.value)
                                    : 0
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
                  <div className="mt-3 ml-7 space-y-3">
                    <FormLabel>Medidas de protección</FormLabel>
                    <FormField
                      control={form.control}
                      name="proteccion_camaras.control_temperatura"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Control de temperatura</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="proteccion_camaras.deteccion_incendio"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>
                            Detección automática de incendio
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Bienes en leasing */}
            <div className="mb-5 border-b pb-4">
              <FormField
                control={form.control}
                name="bienes_leasing"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>¿Tienes bienes en leasing?</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {bienesLeasing && (
                <div className="mt-3 ml-7 space-y-4">
                  <FormField
                    control={form.control}
                    name="leasing_arrendador"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del arrendador financiero</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nombre del arrendador"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="leasing_cif"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CIF del arrendador</FormLabel>
                        <FormControl>
                          <Input placeholder="CIF del arrendador" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="leasing_contrato"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de contrato</FormLabel>
                        <FormControl>
                          <Input placeholder="Número de contrato" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="leasing_identificacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Identificación del bien</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Identificación del bien"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            {/* Dinero en caja fuerte */}
            <div className="mb-5 border-b pb-4">
              <FormField
                control={form.control}
                name="dinero_caja_fuerte"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>¿Tienes dinero en caja fuerte?</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {dineroCajaFuerte && (
                <FormField
                  control={form.control}
                  name="valor_dinero_caja_fuerte"
                  render={({ field }) => (
                    <FormItem className="mt-3 ml-7">
                      <FormLabel>Valor del dinero en caja fuerte</FormLabel>
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

            {/* Dinero fuera de caja fuerte */}
            <div className="mb-5 border-b pb-4">
              <FormField
                control={form.control}
                name="dinero_fuera_caja"
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
                        ¿Tienes dinero fuera de caja fuerte?
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {dineroFueraCaja && (
                <FormField
                  control={form.control}
                  name="valor_dinero_fuera_caja"
                  render={({ field }) => (
                    <FormItem className="mt-3 ml-7">
                      <FormLabel>
                        Valor del dinero fuera de caja fuerte
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
                <FormItem className="mb-4">
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

            {margenBrutoAnual !== undefined && margenBrutoAnual > 0 && (
              <FormField
                control={form.control}
                name="periodo_indemnizacion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Periodo de indemnización</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un periodo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="6">6 meses</SelectItem>
                        <SelectItem value="12">12 meses</SelectItem>
                        <SelectItem value="18">18 meses</SelectItem>
                        <SelectItem value="24">24 meses</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Tiempo durante el cual quieres estar cubierto en caso de
                      interrupción del negocio.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Sección: Coberturas adicionales */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">
              Coberturas adicionales
            </h3>

            {/* Avería de maquinaria */}
            <div className="mb-5 border-b pb-4">
              <FormField
                control={form.control}
                name="averia_maquinaria"
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
                        ¿Quieres cubrir la avería de la maquinaria?
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {averiaMaquinaria && (
                <FormField
                  control={form.control}
                  name="valor_averia_maquinaria"
                  render={({ field }) => (
                    <FormItem className="mt-3 ml-7">
                      <FormLabel>
                        Valor de cobertura para avería de maquinaria
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
                      <FormDescription className="text-amber-600">
                        Esta garantía incrementa significativamente el coste de
                        la prima y es posible que las compañías no ofrezcan el
                        importe solicitado.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Todo riesgo accidental */}
            <div className="mb-5 border-b pb-4">
              <FormField
                control={form.control}
                name="todo_riesgo_accidental"
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
                        ¿Quieres agregar la cláusula de todo riesgo accidental?
                      </FormLabel>
                      <FormDescription>
                        Proporciona cobertura para daños materiales directos
                        causados por cualquier riesgo no específicamente
                        excluido en la póliza.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Responsabilidad civil */}
            {/* Responsabilidad civil */}
            <div className="mb-5">
              <FormField
                control={form.control}
                name="responsabilidad_civil"
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
                        ¿Quieres agregar cobertura de Responsabilidad Civil
                        general?
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {responsabilidadCivil && (
                <div className="mt-3 ml-7 space-y-4">
                  <FormDescription className="text-amber-600">
                    Puedes cubrir tu responsabilidad civil en un seguro de
                    daños, pero ten en cuenta que las coberturas siempre serán
                    más limitadas que contratar una póliza específica.
                  </FormDescription>

                  <div className="space-y-3">
                    <p className="font-medium">
                      Selecciona las coberturas de Responsabilidad Civil que
                      necesitas:
                    </p>

                    {/* RC Explotación */}
                    <FormField
                      control={form.control}
                      name="coberturas_rc.explotacion"
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
                              Responsabilidad Civil por Explotación
                            </FormLabel>
                            <FormDescription>
                              Cubre los daños causados a terceros durante el
                              desarrollo de la actividad. Límite: 600.000€
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* RC Patronal */}
                    <FormField
                      control={form.control}
                      name="coberturas_rc.patronal"
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
                              Responsabilidad Civil Patronal
                            </FormLabel>
                            <FormDescription>
                              Cubre los daños personales sufridos por empleados
                              por accidentes laborales. Límite: 600.000€.
                              Sublímite por víctima: 450.000€
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* RC Productos */}
                    <FormField
                      control={form.control}
                      name="coberturas_rc.productos"
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
                              Responsabilidad Civil por Productos
                            </FormLabel>
                            <FormDescription>
                              Cubre los daños causados por los productos
                              fabricados o suministrados. Límite: 600.000€
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </Form>
    </FormLayout>
  );
}
