// components/forms/ResponsabilidadCivilForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ResponsabilidadCivilFormData, responsabilidadCivilSchema } from '@/lib/schemas';
import MultiStepForm from './MultiStepForm';
import { 
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { getOrCreateSession } from '@/lib/session';

// Step 1: Datos de la Empresa
function DatosEmpresaStep({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="company.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre de la Empresa *</FormLabel>
            <FormControl>
              <Input placeholder="Nombre de la empresa" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="company.cif"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CIF</FormLabel>
              <FormControl>
                <Input placeholder="CIF de la empresa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="company.activity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Actividad</FormLabel>
              <FormControl>
                <Input placeholder="Actividad de la empresa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="company.employees_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Empleados</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Número de empleados" 
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : '')}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="company.billing"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facturación Anual (€)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Facturación anual" 
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : '')}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="company.online_invoice"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>¿Realiza facturación online?</FormLabel>
            </div>
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="company.installations_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Instalaciones</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Propietario">Propietario</SelectItem>
                  <SelectItem value="Inquilino">Inquilino</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="company.m2_installations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Metros Cuadrados</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="m² de instalaciones" 
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : '')}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <FormField
          control={form.control}
          name="company.almacena_bienes_terceros"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>¿Almacena bienes de terceros?</FormLabel>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="company.vehiculos_terceros_aparcados"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>¿Tiene vehículos de terceros aparcados?</FormLabel>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

// Step 2: Actividad y Ámbito
function ActividadAmbitoStep({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="actividad_manufactura"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>¿Su actividad incluye manufactura?</FormLabel>
            </div>
          </FormItem>
        )}
      />
      
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
              <FormLabel>¿Su producto es para consumo humano?</FormLabel>
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
              <FormLabel>¿Tiene empleados técnicos?</FormLabel>
            </div>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="distribucion"
        render={() => (
          <FormItem>
            <FormLabel>Distribución</FormLabel>
            <div className="grid grid-cols-2 gap-2">
              {['España', 'UE', 'América del Norte', 'América del Sur', 'Asia', 'África', 'Oceanía'].map((region) => (
                <FormField
                  key={region}
                  control={form.control}
                  name="distribucion"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={region}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(region)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value || [], region])
                                : field.onChange(
                                    field.value?.filter(
                                      (value: string) => value !== region
                                    ) || []
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {region}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

// Step 3: Coberturas y Ámbito Territorial
function CoberturasStep({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="ambito_territorial"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ámbito Territorial *</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="España" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    España
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="Unión Europea" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Unión Europea
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="Mundial" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Mundial
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="coberturas_solicitadas"
        render={() => (
          <FormItem>
            <FormLabel>Coberturas Solicitadas</FormLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                { id: 'exploitation', label: 'RC Explotación' },
                { id: 'patronal', label: 'RC Patronal' },
                { id: 'productos', label: 'RC Productos' },
                { id: 'trabajos', label: 'RC Trabajos' },
                { id: 'profesional', label: 'RC Profesional' },
              ].map((coverage) => (
                <div key={coverage.id} className="flex items-center space-x-3">
                  <Checkbox 
                    id={`coverage-${coverage.id}`} 
                    checked={form.watch(`coberturas_solicitadas.${coverage.id}`)}
                    onCheckedChange={(checked) => {
                      form.setValue(
                        `coberturas_solicitadas.${coverage.id}` as any, 
                        checked === true, 
                        { shouldValidate: true }
                      );
                    }}
                  />
                  <label 
                    htmlFor={`coverage-${coverage.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {coverage.label}
                  </label>
                </div>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

// Main form component
export default function ResponsabilidadCivilForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ResponsabilidadCivilFormData>({
    resolver: zodResolver(responsabilidadCivilSchema),
    defaultValues: {
      company: {
        name: '',
        cif: '',
        activity: '',
        employees_number: undefined,
        billing: undefined,
        online_invoice: false,
        installations_type: '',
        m2_installations: undefined,
        almacena_bienes_terceros: false,
        vehiculos_terceros_aparcados: false,
      },
      actividad_manufactura: false,
      producto_consumo_humano: false,
      distribucion: [],
      tiene_empleados_tecnicos: false,
      ambito_territorial: '',
      coberturas_solicitadas: {
        exploitation: false,
        patronal: false,
        productos: false,
        trabajos: false,
        profesional: false,
      },
    },
  });

  async function onSubmit() {
    setIsSubmitting(true);
    try {
      const values = form.getValues();
      
      // Get or create session
      const sessionId = await getOrCreateSession();
      
      // Submit company data
      const companyResponse = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          ...values.company,
        }),
      });
      
      if (!companyResponse.ok) {
        throw new Error('Error al guardar los datos de la empresa');
      }
      
      const companyData = await companyResponse.json();
      
      // Submit form data
      const formResponse = await fetch('/api/forms/responsabilidad-civil', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          ...values,
          company_id: companyData.id,
        }),
      });
      
      if (!formResponse.ok) {
        throw new Error('Error al guardar el formulario');
      }
      
      // Redirect to recommendations
      router.push('/recomendaciones');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Define the steps for the multi-step form
  const steps = [
    {
      id: 1,
      title: "Datos de la empresa",
      content: <Form {...form}><DatosEmpresaStep form={form} /></Form>
    },
    {
      id: 2,
      title: "Actividad y distribución",
      content: <Form {...form}><ActividadAmbitoStep form={form} /></Form>
    },
    {
      id: 3,
      title: "Coberturas solicitadas",
      content: <Form {...form}><CoberturasStep form={form} /></Form>
    }
  ];

  return (
    <div className="w-full">
      <MultiStepForm 
        steps={steps} 
        onSubmit={() => {
          form.handleSubmit(onSubmit)();
        }} 
      />
    </div>
  );
}