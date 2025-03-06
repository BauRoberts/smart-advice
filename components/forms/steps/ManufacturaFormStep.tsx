// components/forms/steps/ManufacturaFormStep.tsx
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
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import FormLayout from '@/components/layout/FormLayout';
import { useFormContext } from '@/contexts/FormContext';

// Schema para validar los datos de actividad de manufactura
const manufacturaSchema = z.object({
  producto_consumo_humano: z.boolean().default(false),
  tiene_empleados_tecnicos: z.boolean().default(false),
  producto_final_o_intermedio: z.string().min(1, {
    message: "Debes seleccionar el tipo de producto",
  }),
  distribucion: z.array(z.string()).min(1, {
    message: "Selecciona al menos una opción de distribución",
  }),
  matriz_en_espana: z.boolean().default(true),
  filiales: z.array(z.string()).default([]),
});

// Tipo para los datos de manufactura
export type ManufacturaFormData = z.infer<typeof manufacturaSchema>;

interface ManufacturaFormStepProps {
  onNext: () => void;
  onBack: () => void;
  defaultValues?: Partial<ManufacturaFormData>;
}

export default function ManufacturaFormStep({ 
  onNext, 
  onBack, 
  defaultValues = {} 
}: ManufacturaFormStepProps) {
  const { dispatch } = useFormContext();

  // Inicializar el formulario con React Hook Form
  const form = useForm<ManufacturaFormData>({
    resolver: zodResolver(manufacturaSchema),
    defaultValues: {
      producto_consumo_humano: false,
      tiene_empleados_tecnicos: false,
      producto_final_o_intermedio: '',
      distribucion: [],
      matriz_en_espana: true,
      filiales: [],
      ...defaultValues
    },
  });

  // Manejar el envío del formulario
  function onSubmit(data: ManufacturaFormData) {
    dispatch({ type: 'SET_ACTIVIDAD_MANUFACTURA', payload: data });
    onNext();
  }

  return (
    <FormLayout
      title="Información de manufactura"
      subtitle="Detalles sobre tu producto y actividad de fabricación"
      currentStep={3}
      totalSteps={5}
      onNext={form.handleSubmit(onSubmit)}
      onBack={onBack}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="producto_consumo_humano"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>¿El producto está destinado al consumo/uso humano?</FormLabel>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tiene_empleados_tecnicos"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>¿Hay empleados técnicos en plantilla?</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="matriz_en_espana"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>¿La empresa matriz está en España?</FormLabel>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="producto_final_o_intermedio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fabricación</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo de producto" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="final">Producto Final</SelectItem>
                    <SelectItem value="intermedio">Producto Intermedio</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="distribucion"
            render={() => (
              <FormItem>
                <FormLabel>Comercialización/Distribución - Indica dónde se distribuyen los productos</FormLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'espana', label: 'España + Andorra' },
                    { id: 'ue', label: 'Unión Europea' },
                    { id: 'mundial-sin-usa', label: 'Todo el mundo excepto USA y Canadá' },
                    { id: 'mundial-con-usa', label: 'Todo el mundo incluido USA y Canadá' }
                  ].map((region) => (
                    <FormField
                      key={region.id}
                      control={form.control}
                      name="distribucion"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={region.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(region.id)}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...field.value || [], region.id]
                                    : field.value?.filter((value: string) => value !== region.id) || [];
                                  
                                  field.onChange(newValue);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {region.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          
          
          <FormField
            control={form.control}
            name="filiales"
            render={() => (
              <FormItem>
                <FormLabel>¿Tienes filiales en?</FormLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'ue', label: 'Unión Europea' },
                    { id: 'resto-mundo', label: 'Resto del mundo' },
                    { id: 'usa-canada', label: 'USA y Canadá' }
                  ].map((region) => (
                    <FormField
                      key={region.id}
                      control={form.control}
                      name="filiales"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={region.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(region.id)}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...field.value || [], region.id]
                                    : field.value?.filter((value: string) => value !== region.id) || [];
                                  
                                  field.onChange(newValue);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {region.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </FormLayout>
  );
}