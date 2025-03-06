// components/forms/steps/ContactFormStep.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import FormLayout from '@/components/layout/FormLayout';

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
});

// Tipo para los datos de contacto
export type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormStepProps {
  onNext: (data: ContactFormData) => void;
  defaultValues?: ContactFormData;
  backLink?: string;
}

export default function ContactFormStep({ 
  onNext, 
  defaultValues = { name: '', email: '', phone: '' },
  backLink = '/seguros'
}: ContactFormStepProps) {
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
      subtitle="Para poder contactarte y ofrecerte las mejores opciones"
      currentStep={1}
      totalSteps={5}
      onNext={form.handleSubmit(onSubmit)}
      backLink={backLink}
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
                  <Input type="email" placeholder="rodrigo@email.com" {...field} />
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
        </form>
      </Form>
    </FormLayout>
  );
}