// components/forms/steps/ContactFormStep.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
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

// Schema para validar los datos de contacto
const contactSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres",
  }),
  email: z.string().email({
    message: "Por favor introduce un email válido",
  }),
  phone: z.string().regex(/^[0-9]{9}$/, {
    message: "El teléfono debe tener 9 dígitos",
  }),
  privacyPolicy: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar la política de privacidad para continuar",
  }),
  marketingConsent: z.boolean().default(false),
});
// Tipo para los datos de contacto
export type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormStepProps {
  onNext: (data: ContactFormData) => void;
  onBack: () => void;
  defaultValues?: Partial<ContactFormData>;
  currentStep?: number;
  totalSteps?: number;
}

export default function ContactFormStep({
  onNext,
  onBack,
  defaultValues = {
    name: "",
    email: "",
    phone: "",
    privacyPolicy: false,
    marketingConsent: false,
  },
  currentStep,
  totalSteps,
}: ContactFormStepProps) {
  const formContext = useFormContext();
  const { formData } = formContext;

  // Usar los valores de props si se proporcionan, de lo contrario calcularlos del contexto
  const calculatedCurrentStep =
    currentStep || (formData.form_type === "responsabilidad_civil" ? 4 : 7);
  const calculatedTotalSteps =
    totalSteps || (formData.form_type === "responsabilidad_civil" ? 5 : 8);

  // Inicializar el formulario con React Hook Form
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues,
  });

  // Manejar el envío del formulario
  function onSubmit(data: ContactFormData) {
    onNext(data);
  }

  return (
    <FormLayout
      title="Datos de contacto"
      subtitle="Para poder enviarte las recomendaciones y ofrecerte el mejor servicio"
      currentStep={calculatedCurrentStep}
      totalSteps={calculatedTotalSteps}
      onNext={form.handleSubmit(onSubmit)}
      onBack={onBack}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre completo</FormLabel>
                <FormControl>
                  <Input placeholder="Rodrigo Ramos" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="rodrigo@email.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono de contacto</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="612345678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="privacyPolicy"
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
                    Acepto la{" "}
                    <Link
                      href="/politica-privacidad"
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      política de privacidad
                    </Link>
                  </FormLabel>
                  <FormDescription>
                    Tus datos serán tratados según nuestra política de
                    privacidad para ofrecerte asesoramiento personalizado.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="marketingConsent"
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
                    Acepto recibir comunicaciones comerciales de Smart Advice
                  </FormLabel>
                  <FormDescription>
                    Podrás recibir ofertas, promociones y novedades relacionadas
                    con nuestros servicios. Puedes darte de baja en cualquier
                    momento.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <div className="pt-4 bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-blue-800">
              Tus datos de contacto serán utilizados únicamente para enviarte
              las recomendaciones de seguros y, si lo deseas, para que nuestro
              equipo pueda contactarte y ayudarte a elegir la mejor opción.
            </p>
          </div>
        </form>
      </Form>
    </FormLayout>
  );
}
