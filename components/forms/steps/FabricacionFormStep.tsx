// components/fmors / steps / FabricacionFormStep.tsx;

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
import { Input } from "@/components/ui/input";

// Schema for Fabricación Step
const fabricacionSchema = z.object({
  // Detalles del producto
  producto_intermedio_final: z.enum(["intermedio", "final"]),
  producto_consumo_humano: z.boolean().default(false),

  // El resto del schema permanece igual
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
  currentStep?: number;
  totalSteps?: number;
  subStep?: number;
  totalSubSteps?: number;
}

export default function FabricacionFormStep({
  onNext,
  onBack,
  defaultValues = {},
  currentStep = 3,
  totalSteps = 6,
  subStep,
  totalSubSteps,
}: FabricacionStepProps) {
  console.log("DEBUG - FabricacionFormStep - defaultValues:", defaultValues);

  // Asegurar que siempre haya valores por defecto para los campos críticos
  // Modificación de mergedDefaultValues
  const mergedDefaultValues = {
    producto_intermedio_final:
      defaultValues.producto_intermedio_final &&
      (defaultValues.producto_intermedio_final === "intermedio" ||
        defaultValues.producto_intermedio_final === "final")
        ? defaultValues.producto_intermedio_final
        : ("intermedio" as "intermedio" | "final"),
    producto_consumo_humano: defaultValues.producto_consumo_humano === true,
    alcance_geografico:
      defaultValues.alcance_geografico &&
      [
        "espana_andorra",
        "union_europea",
        "europa_reino_unido",
        "mundial_excepto_usa_canada",
        "mundial_incluyendo_usa_canada",
      ].includes(defaultValues.alcance_geografico)
        ? defaultValues.alcance_geografico
        : "espana_andorra",
    // Los demás campos pueden continuar igual
    facturacion_espana_andorra: defaultValues.facturacion_espana_andorra,
    facturacion_union_europea: defaultValues.facturacion_union_europea,
    facturacion_reino_unido: defaultValues.facturacion_reino_unido,
    facturacion_resto_mundo: defaultValues.facturacion_resto_mundo,
    facturacion_usa_canada: defaultValues.facturacion_usa_canada,
  };

  console.log(
    "DEBUG - FabricacionFormStep - mergedDefaultValues:",
    mergedDefaultValues
  );

  const form = useForm<FabricacionData>({
    resolver: zodResolver(fabricacionSchema),
    defaultValues: {
      producto_intermedio_final: "intermedio" as const,
      producto_consumo_humano: false,
      alcance_geografico: "espana_andorra" as const,
      ...defaultValues,
    },
  });

  const alcanceGeografico = form.watch("alcance_geografico");
  const mostrarDetallesRegion = alcanceGeografico !== "espana_andorra";

  // Añadir logs para verificar los valores mientras el formulario está activo
  console.log("DEBUG - Form values:", form.getValues());

  function onSubmit(data: FabricacionData) {
    // Agregar log para verificar los datos antes de enviarlos
    console.log(
      "DEBUG - Datos del formulario de fabricación antes de procesar:",
      data
    );

    // Asegurarse de que siempre incluya producto_intermedio_final y producto_consumo_humano
    // con valores explícitos para evitar problemas de tipo
    const completedData: FabricacionData = {
      ...data,
      producto_intermedio_final:
        data.producto_intermedio_final === "intermedio"
          ? "intermedio"
          : "final",
      producto_consumo_humano: data.producto_consumo_humano === true,
      alcance_geografico: data.alcance_geografico,
      facturacion_espana_andorra: data.facturacion_espana_andorra,
      facturacion_union_europea: data.facturacion_union_europea,
      facturacion_reino_unido: data.facturacion_reino_unido,
      facturacion_resto_mundo: data.facturacion_resto_mundo,
      facturacion_usa_canada: data.facturacion_usa_canada,
    };

    console.log("DEBUG - Datos completos a enviar:", completedData);
    console.log("DEBUG - Valores críticos:", {
      producto_intermedio_final: completedData.producto_intermedio_final,
      producto_consumo_humano: completedData.producto_consumo_humano,
    });

    onNext(completedData);
  }

  return (
    <FormLayout
      title={
        subStep
          ? `Fabricación y Diseño (Paso ${subStep} de ${totalSubSteps})`
          : "Fabricación y Diseño"
      }
      subtitle="Información sobre tus productos y alcance geográfico"
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={form.handleSubmit(onSubmit)}
      onBack={onBack}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="mb-8 border p-6 rounded-md shadow-sm">
            <h3 className="text-xl text-gray-900 mb-6">
              Porque Diseñas, Fabricas o vendes productos
            </h3>

            {/* Tipo de producto - Simplificado */}
            <FormField
              control={form.control}
              name="producto_intermedio_final"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <div className="space-y-3">
                    <FormLabel className="text-base font-normal">
                      ¿Tu producto es intermedio o final?
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          console.log("Radio cambiado a:", value);
                          field.onChange(value);
                        }}
                        value={field.value}
                        className="flex space-x-8"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="intermedio" id="intermedio" />
                          <FormLabel
                            htmlFor="intermedio"
                            className="font-normal"
                          >
                            Intermedio
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="final" id="final" />
                          <FormLabel htmlFor="final" className="font-normal">
                            Final
                          </FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <FormDescription className="text-xs mt-1">
                    Producto intermedio: para uso en otros productos. Producto
                    final: para uso directo por el consumidor.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Consumo humano - Simplificado a un único checkbox */}
            <FormField
              control={form.control}
              name="producto_consumo_humano"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <div className="flex items-center space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          console.log("Checkbox cambiado a:", checked);
                          field.onChange(checked === true);
                        }}
                        id="consumo-humano"
                      />
                    </FormControl>
                    <FormLabel
                      htmlFor="consumo-humano"
                      className="font-normal cursor-pointer"
                    >
                      ¿Tu producto está destinado al consumo humano o contacto
                      directo con el cuerpo?
                    </FormLabel>
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
                          <Input
                            type="number"
                            formatNumber={true}
                            min="0"
                            className="w-32"
                            placeholder="0€"
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? Number(e.target.value) : 0
                              )
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
                            <Input
                              type="number"
                              formatNumber={true}
                              min="0"
                              className="w-32"
                              placeholder="0€"
                              value={field.value || ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? Number(e.target.value) : 0
                                )
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
                            <Input
                              type="number"
                              formatNumber={true}
                              min="0"
                              className="w-32"
                              placeholder="0€"
                              value={field.value || ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? Number(e.target.value) : 0
                                )
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
                            <Input
                              type="number"
                              formatNumber={true}
                              min="0"
                              className="w-32"
                              placeholder="0€"
                              value={field.value || ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? Number(e.target.value) : 0
                                )
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
                            <Input
                              type="number"
                              formatNumber={true}
                              min="0"
                              className="w-32"
                              placeholder="0€"
                              value={field.value || ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? Number(e.target.value) : 0
                                )
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
