// components/forms/steps/CompanyFormStep.tsx
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

// Schema para validar los datos de la empresa
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
  activity_description: z
    .string()
    .max(200, {
      message: "La descripción no puede exceder los 200 caracteres",
    })
    .optional(),
  employees_number: z.number().int().positive({
    message: "Solo se cubren empleados en nómina",
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
  dinero_caja_fuerte: z.number().optional(),
  dinero_fuera_caja: z.number().optional(),
  clausula_todo_riesgo: z.boolean().default(false),
});

// Tipo para los datos de la empresa
export type CompanyFormData = z.infer<typeof companySchema>;
export type EmpresaTipo = "manufactura" | "servicios" | null;

interface CompanyFormStepProps {
  onNext: (data: CompanyFormData, empresaTipo: EmpresaTipo) => void;
  onBack: () => void;
  defaultValues?: Partial<CompanyFormData>;
}

export default function CompanyFormStep({
  onNext,
  onBack,
  defaultValues = {},
}: CompanyFormStepProps) {
  const { formData, dispatch } = useFormContext();
  const [selectedCnaeActivity, setSelectedCnaeActivity] =
    useState<CnaeOption | null>(null);
  const [empresaTipo, setEmpresaTipo] = useState<EmpresaTipo>(null);

  // Verificar si estamos en el formulario de Daños Materiales
  const isDanosMateriales = formData.form_type === "danos_materiales";

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
      dinero_caja_fuerte: 0,
      dinero_fuera_caja: 0,
      clausula_todo_riesgo: false,
      ...defaultValues,
    },
  });

  // Observar si factura online para mostrar/ocultar el porcentaje
  const onlineInvoice = form.watch("online_invoice");

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
      payload: "danos_materiales",
    });
  }, [dispatch]);

  // Manejar el envío del formulario
  function onSubmit(data: CompanyFormData) {
    onNext(data, empresaTipo);
  }

  // Calcular el número de pasos según el tipo de formulario
  const totalSteps = isDanosMateriales ? 7 : 5;

  return (
    <FormLayout
      title="Datos de la empresa"
      subtitle="Información sobre tu negocio para personalizar las recomendaciones"
      currentStep={2}
      totalSteps={totalSteps}
      onNext={form.handleSubmit(onSubmit)}
      onBack={onBack}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Sección: Información básica de la empresa */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">
              Información básica
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
          </div>

          {/* Sección: Datos comerciales */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">
              Datos comerciales
            </h3>

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
                    <FormLabel>Facturación Anual (€)</FormLabel>
                    <InfoTooltip text="Incluir solo la facturación a terceros excluyendo la facturación a otras empresas del grupo" />
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="Facturación anual"
                        value={field.value?.toString() || ""}
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
                      <FormLabel>Facturación online</FormLabel>
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
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">Instalaciones</h3>

            <FormField
              control={form.control}
              name="installations_type"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Tipo de instalaciones</FormLabel>
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
                        Actúo como Propietario
                      </SelectItem>
                      <SelectItem value="Inquilino">Soy Inquilino</SelectItem>
                      <SelectItem value="Otros">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="m2_installations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metros Cuadrados</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
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
          </div>

          {/* Campos específicos para Daños Materiales */}
          {isDanosMateriales && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3">
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
