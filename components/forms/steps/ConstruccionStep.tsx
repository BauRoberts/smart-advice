// components/forms/steps/ConstruccionStep.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
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

// Schema para validar los datos de información de instalaciones
const construccionSchema = z.object({
  cubierta: z.string().min(1, { message: "Selecciona un tipo de cubierta" }),
  cerramientos: z
    .string()
    .min(1, { message: "Selecciona un tipo de cerramiento" }),
  estructura: z
    .string()
    .min(1, { message: "Selecciona un tipo de estructura" }),
  camaras_frigorificas: z.boolean().default(false),
  placas_solares: z.boolean().default(false),
  // Mantener este campo en el esquema para compatibilidad, pero se moverá visualmente a coberturas
  valor_placas_solares: z.number().optional(),
});

// Tipo para los datos de construcción
export type ConstruccionFormData = z.infer<typeof construccionSchema>;

interface ConstruccionStepProps {
  onNext: (data: ConstruccionFormData) => void;
  onBack: () => void;
  defaultValues?: Partial<ConstruccionFormData>;
  currentStep?: number;
  totalSteps?: number;
}

export default function ConstruccionStep({
  onNext,
  onBack,
  defaultValues = {},
  currentStep = 2,
  totalSteps = 8,
}: ConstruccionStepProps) {
  const { dispatch } = useFormContext();

  // Inicializar el formulario con React Hook Form
  const form = useForm<ConstruccionFormData>({
    resolver: zodResolver(construccionSchema),
    defaultValues: {
      cubierta: "",
      cerramientos: "",
      estructura: "",
      camaras_frigorificas: false,
      placas_solares: false,
      valor_placas_solares: 0,
      ...defaultValues,
    },
  });

  // Manejar el envío del formulario
  function onSubmit(data: ConstruccionFormData) {
    dispatch({ type: "SET_CONSTRUCCION", payload: data });
    onNext(data);
  }

  return (
    <FormLayout
      title="Información de las Instalaciones"
      subtitle="Información sobre las características de la nave o edificio"
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={form.handleSubmit(onSubmit)}
      onBack={onBack}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              ¿Cuáles son los materiales utilizados en la construcción?
            </h3>

            <FormField
              control={form.control}
              name="cubierta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cubierta</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo de cubierta" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="hormigon">Hormigón</SelectItem>
                      <SelectItem value="chapa_metalica">
                        Chapa metálica simple
                      </SelectItem>
                      <SelectItem value="panel_sandwich_lana">
                        Panel sándwich con lana de roca o fibra de vidrio
                      </SelectItem>
                      <SelectItem value="panel_sandwich_pir">
                        Panel sándwich PIR/PUR
                      </SelectItem>
                      <SelectItem value="madera">Madera</SelectItem>
                      <SelectItem value="otros">Otros materiales</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cerramientos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cerramientos</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo de cerramientos" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ladrillo">Ladrillo</SelectItem>
                      <SelectItem value="hormigon">Hormigón</SelectItem>
                      <SelectItem value="metalico">Metálico</SelectItem>
                      <SelectItem value="panel_sandwich">
                        Panel Sandwich
                      </SelectItem>
                      <SelectItem value="panel_sandwich_pir">
                        Panel Sandwich PIR/PUR
                      </SelectItem>
                      <SelectItem value="madera">Madera</SelectItem>
                      <SelectItem value="otros">Otros materiales</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estructura"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estructura</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo de estructura" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="hormigon">Hormigón</SelectItem>
                      <SelectItem value="metalica">Metálica</SelectItem>
                      <SelectItem value="madera">Madera</SelectItem>
                      <SelectItem value="mixta">Mixta</SelectItem>
                      <SelectItem value="otros">Otros materiales</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="camaras_frigorificas"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>¿Tienes cámaras frigoríficas?</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="placas_solares"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>¿Tienes placas solares en cubierta?</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </FormLayout>
  );
}
