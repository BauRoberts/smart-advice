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
import { determineEmpresaTipo } from "@/lib/services/cnaeService";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { useFormContext } from "@/contexts/FormContext";
import { Textarea } from "@/components/ui/textarea";

// Updated schema for CompanyFormStep.tsx
const companySchema = z.object({
  name: z.string().min(2, {
    message: "El nombre de la empresa debe tener al menos 2 caracteres",
  }),
  cnae_code: z.string().min(1, {
    message: "Debes seleccionar un código CNAE",
  }),
  activity: z.string().min(1, {
    message: "La actividad es obligatoria",
  }),
  activity_description: z.string().optional(),
  employees_number: z.number().int().positive({
    message: "El número de empleados debe ser un número positivo",
  }),
  billing: z.number().positive({
    message: "La facturación debe ser un número positivo",
  }),
  online_invoice: z.boolean().default(false),
  online_invoice_percentage: z.number().min(0).max(100).default(0),
  installations_type: z.string().min(1, {
    message: "Debes seleccionar un tipo de instalación",
  }),
  m2_installations: z.number().positive({
    message: "Los metros cuadrados deben ser un número positivo",
  }),
  // RC specific fields
  manufactures: z.boolean().default(false),
  markets: z.boolean().default(false),
  provides_services: z.boolean().default(false),
  product_service_types: z.string().optional(),
  industry_types: z.string().optional(),
  // Required fields for all forms
  almacena_bienes_terceros: z.boolean().default(false),
  vehiculos_terceros_aparcados: z.boolean().default(false),
  // Optional fields for DanosMateriales form
  existencias_intemperie: z.boolean().default(false).optional(),
  bienes_empleados: z.boolean().default(false).optional(),
  dinero_caja_fuerte: z.number().optional(),
  dinero_fuera_caja: z.number().optional(),
  clausula_todo_riesgo: z.boolean().default(false).optional(),
  // New fields
  localizacion_nave: z.string().optional(),
  propietario_nombre: z.string().optional(),
  propietario_cif: z.string().optional(),
  tiene_placas_solares: z.boolean().default(false),
  placas_autoconsumo: z.boolean().default(false),
  placas_venta_red: z.boolean().default(false),
  almacenamiento: z.boolean().default(false),
  diseno: z.boolean().default(false),
  instalacion: z.boolean().default(false),
  mantenimiento: z.boolean().default(false),
  montaje: z.boolean().default(false),
  reparacion: z.boolean().default(false),
});

// Tipo para los datos de la empresa
export type CompanyFormData = z.infer<typeof companySchema>;
export type EmpresaTipo = "manufactura" | "servicios" | null;

interface CompanyFormStepProps {
  onNext: (data: CompanyFormData, empresaTipo: EmpresaTipo) => void;
  onBack: () => void;
  defaultValues?: Partial<CompanyFormData>;
  currentStep?: number;
  totalSteps?: number;
}

export default function CompanyFormStep({
  onNext,
  onBack,
  defaultValues = {},
  currentStep = 1,
  totalSteps = 5,
}: CompanyFormStepProps) {
  const { formData, dispatch } = useFormContext();
  const [selectedCnaeActivity, setSelectedCnaeActivity] =
    useState<CnaeOption | null>(null);
  const [empresaTipo, setEmpresaTipo] = useState<EmpresaTipo>(null);
  const [tienePlacasSolares, setTienePlacasSolares] = useState(false);
  const [placasVentaRed, setPlacasVentaRed] = useState(false);

  // Verificar si estamos en el formulario de Daños Materiales
  const isDanosMateriales = formData.form_type === "danos_materiales";
  const isResponsabilidadCivil =
    formData.form_type === "responsabilidad_civil" || !isDanosMateriales;

  // Inicializar el formulario con React Hook Form
  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      cnae_code: "",
      activity: "",
      activity_description: "",
      employees_number: undefined,
      billing: undefined,
      online_invoice: false,
      online_invoice_percentage: 0,
      installations_type: "",
      m2_installations: undefined,
      manufactures: false,
      markets: false,
      provides_services: false,
      product_service_types: "",
      industry_types: "",
      dinero_caja_fuerte: 0,
      dinero_fuera_caja: 0,
      clausula_todo_riesgo: false,
      localizacion_nave: "",
      propietario_nombre: "",
      propietario_cif: "",
      tiene_placas_solares: false,
      placas_autoconsumo: false,
      placas_venta_red: false,
      almacenamiento: false,
      diseno: false,
      instalacion: false,
      mantenimiento: false,
      montaje: false,
      reparacion: false,
      ...defaultValues,
    },
  });

  // Observar si factura online para mostrar/ocultar el porcentaje
  const onlineInvoice = form.watch("online_invoice");

  // Observar selecciones de actividad para validación
  const manufactures = form.watch("manufactures");
  const markets = form.watch("markets");
  const providesServices = form.watch("provides_services");

  // Add watchers for conditional fields
  const installationsType = form.watch("installations_type");
  const tienePlacas = form.watch("tiene_placas_solares");
  const ventaRed = form.watch("placas_venta_red");

  useEffect(() => {
    setTienePlacasSolares(tienePlacas);
  }, [tienePlacas]);

  useEffect(() => {
    setPlacasVentaRed(ventaRed);
  }, [ventaRed]);

  // Determinar tipo de empresa basado en CNAE
  useEffect(() => {
    if (selectedCnaeActivity) {
      const tipo = determineEmpresaTipo(selectedCnaeActivity.code);
      setEmpresaTipo(tipo);
    }
  }, [selectedCnaeActivity]);

  useEffect(() => {
    // Establecer el tipo de formulario
    dispatch({
      type: "SET_FORM_TYPE",
      payload: isDanosMateriales ? "danos_materiales" : "responsabilidad_civil",
    });
  }, [dispatch, isDanosMateriales]);

  // Manejar el envío del formulario
  function onSubmit(data: CompanyFormData) {
    // Validación adicional para RC - al menos una de las tres opciones debe estar seleccionada
    if (
      isResponsabilidadCivil &&
      !data.manufactures &&
      !data.markets &&
      !data.provides_services
    ) {
      form.setError("manufactures", {
        type: "manual",
        message: "Debes seleccionar al menos una de las tres opciones",
      });
      return;
    }

    onNext(data, empresaTipo);
  }

  // Calcular el número de pasos según el tipo de formulario

  return (
    <FormLayout
      title="Datos de la empresa"
      subtitle="Información sobre tu negocio para personalizar las recomendaciones"
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
                  <FormLabel>Describe tu actividad (opcional)</FormLabel>
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

            {/* Detalles de actividad simplificados como en la imagen */}
            <div className="mb-4">
              <FormLabel className="block mb-2">
                Detalles de actividad (selecciona todas las que apliquen):
              </FormLabel>
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="manufactures"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Fabricación</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="provides_services"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Prestación de servicios</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="markets"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Comercialización</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="almacenamiento"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Almacenamiento</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="diseno"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Diseño</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="industry_types"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>¿Para qué tipo de industria o sector?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ej: automoción, alimentación, construcción, etc."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Sección: Ubicación y Propiedad */}
          <div className="mb-6 border p-4 rounded-md shadow-sm">
            <h3 className="font-medium text-black-600 mb-3">
              Ubicación y Propiedad
            </h3>

            <FormField
              control={form.control}
              name="localizacion_nave"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Localización de la nave</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Dirección de la nave/instalación"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="installations_type"
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
                      <SelectItem value="Propietario">
                        Soy propietario
                      </SelectItem>
                      <SelectItem value="No propietario">
                        No soy propietario
                      </SelectItem>
                      <SelectItem value="Otros">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Conditional owner fields */}
            {installationsType === "No propietario" && (
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
                  name="propietario_cif"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>CIF/DNI del propietario</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="CIF o DNI del propietario"
                          {...field}
                        />
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
                  <FormLabel>Metros Cuadrados</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        formatNumber={true}
                        placeholder="m² de instalaciones"
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

            {/* Solar panels section */}
            <FormField
              control={form.control}
              name="tiene_placas_solares"
              render={({ field }) => (
                <FormItem className="mb-2">
                  <div className="flex items-center space-x-2">
                    <FormLabel>¿Tienes placas solares?</FormLabel>
                    <div className="flex space-x-4">
                      <div className="flex items-center space-x-1">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked === true);
                              if (!checked) {
                                form.setValue("placas_autoconsumo", false);
                                form.setValue("placas_venta_red", false);
                              }
                            }}
                          />
                        </FormControl>
                        <span>Sí</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FormControl>
                          <Checkbox
                            checked={!field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked !== true);
                              if (checked) {
                                form.setValue("placas_autoconsumo", false);
                                form.setValue("placas_venta_red", false);
                              }
                            }}
                          />
                        </FormControl>
                        <span>No</span>
                      </div>
                    </div>
                  </div>
                </FormItem>
              )}
            />

            {tienePlacasSolares && (
              <div className="pl-6 border-l-2 border-gray-200 mb-4">
                <FormField
                  control={form.control}
                  name="placas_autoconsumo"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 mb-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Para autoconsumo</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="placas_venta_red"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Para venta a la red</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          {/* Sección: Facturación */}
          <div className="mb-6 border p-4 rounded-md shadow-sm">
            <h3 className="font-medium text-black-600 mb-3">Facturación</h3>

            <FormField
              control={form.control}
              name="billing"
              render={({ field }) => (
                <FormField
                  control={form.control}
                  name="billing"
                  render={({ field }) => (
                    <FormField
                      control={form.control}
                      name="billing"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <div className="flex items-center">
                            <FormLabel>Facturación Anual (€)</FormLabel>
                            <InfoTooltip text="Incluir solo la facturación a terceros excluyendo la facturación a otras empresas del grupo" />
                          </div>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number" // Sobrescrito a "text" por formatNumber
                                formatNumber={true}
                                placeholder="Facturación anual"
                                {...field}
                                value={field.value || ""}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value ? Number(e.target.value) : ""
                                  )
                                }
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
                />
              )}
            />

            <FormField
              control={form.control}
              name="employees_number"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Número de Empleados</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      formatNumber={true}
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
                      <FormLabel>Facturas online</FormLabel>
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

          {/* Campos específicos para Daños Materiales (mantener si es necesario) */}
          {isDanosMateriales && (
            <div className="mb-6 border p-4 rounded-md shadow-sm">
              <h3 className="font-medium text-red-600 mb-3">
                Dinero en efectivo
              </h3>

              <FormField
                control={form.control}
                name="dinero_caja_fuerte"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>
                      Indica la cantidad de dinero depositado en caja fuerte
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          formatNumber={true}
                          placeholder="Cantidad"
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
                name="dinero_fuera_caja"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>
                      Indica la cantidad de dinero guardado fuera de caja fuerte
                      pero dentro del inmueble
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="Cantidad"
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
                name="clausula_todo_riesgo"
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
                        ¿Quieres incluir cláusula de todo riesgo accidental?
                      </FormLabel>
                      <FormDescription>
                        La cláusula de todo riesgo accidental otorga más
                        cobertura a los capitales asegurados pero incrementa la
                        prima de seguro.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          )}

          {empresaTipo && !isDanosMateriales && (
            <div className="p-4 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                Tipo de empresa detectado:{" "}
                <strong>
                  {empresaTipo === "manufactura" ? "Manufactura" : "Servicios"}
                </strong>
              </p>
            </div>
          )}
        </form>
      </Form>
    </FormLayout>
  );
}
