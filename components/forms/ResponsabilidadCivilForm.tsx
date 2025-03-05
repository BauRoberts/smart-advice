// components/forms/ResponsabilidadCivilForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
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
import CnaeSearch from '@/components/CnaeSearch';
import type { CnaeOption } from '@/lib/services/cnaeService';
import { determineEmpresaTipo } from '@/lib/services/cnaeService';

// Add this type for empresaTipo
type EmpresaTipo = 'manufactura' | 'servicios' | null;

// Main form component
export default function ResponsabilidadCivilForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCnaeActivity, setSelectedCnaeActivity] = useState<CnaeOption | null>(null);
  const [empresaTipo, setEmpresaTipo] = useState<EmpresaTipo>(null);
  
  const form = useForm<ResponsabilidadCivilFormData>({
    resolver: zodResolver(responsabilidadCivilSchema),
    defaultValues: {
      company: {
        name: '',
        cif: '',
        cnae_code: '',
        activity: '',
        employees_number: undefined,
        billing: undefined,
        online_invoice: false,
        online_invoice_percentage: 0,
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
      // Para almacenar datos específicos de manufactura/servicios
      actividad: {
        manufactura: {
          producto_consumo_humano: false,
          tiene_empleados_tecnicos: false,
          producto_final_o_intermedio: '',
          distribucion: [],
          matriz_en_espana: true,
          filiales: [],
        },
        servicios: {
          trabajos_fuera_instalaciones: false,
          corte_soldadura: false,
          trabajo_equipos_electronicos: false,
          empleados_tecnicos: false,
        }
      }
    },
  });

  // Determinar si es una empresa de manufactura o servicios según el CNAE
  useEffect(() => {
    if (selectedCnaeActivity) {
      const tipo = determineEmpresaTipo(selectedCnaeActivity.code);
      setEmpresaTipo(tipo);
      form.setValue('actividad_manufactura', tipo === 'manufactura');
    }
  }, [selectedCnaeActivity, form]);

  // Step 1: Datos de la Empresa
  function DatosEmpresaStep({ form }: { form: any }) {
    const onlineInvoice = form.watch('company.online_invoice');

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
        
        {/* Campo para CNAE */}
        <FormItem>
          <FormLabel>Actividad (CNAE) *</FormLabel>
          <FormControl>
            <CnaeSearch 
              onSelect={(option) => {
                setSelectedCnaeActivity(option);
                form.setValue('company.activity', option.description);
                form.setValue('company.cnae_code', option.code);
              }}
              defaultValue={form.watch('company.cnae_code')}
            />
          </FormControl>
          <FormDescription>
            Selecciona el código CNAE que mejor represente la actividad de tu empresa
          </FormDescription>
          <FormMessage />
        </FormItem>
        
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
                <FormLabel>Nº de Empleados *</FormLabel>
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
                <FormLabel>Facturación Anual (€) *</FormLabel>
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
                <FormDescription>
                  Incluir solo la facturación a terceros excluyendo la facturación a otras empresas del grupo
                </FormDescription>
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
                <FormLabel>Facturación online</FormLabel>
              </div>
            </FormItem>
          )}
        />

        {onlineInvoice && (
          <FormField
            control={form.control}
            name="company.online_invoice_percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Porcentaje de facturación online</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type="number" 
                      placeholder="Porcentaje de facturación online" 
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                      min={0}
                      max={100}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2">%</span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="company.installations_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instalaciones *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Propietario">Actúo como Propietario</SelectItem>
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
            name="company.m2_installations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Metros Cuadrados *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type="number" 
                      placeholder="m² de instalaciones" 
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : '')}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2">m²</span>
                  </div>
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
                  <FormLabel>¿Almacenas o tienes depositados bienes de terceros, tanto maquinaria como existencias?</FormLabel>
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
                  <FormLabel>¿Hay vehículos de terceros aparcados en mis instalaciones?</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>
        
        {/* Si no se detectó automáticamente, el usuario puede seleccionar manualmente */}
        {!empresaTipo && (
          <FormField
            control={form.control}
            name="actividad_manufactura"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Actividad</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    const tipo = value === 'true' ? 'manufactura' : 'servicios';
                    setEmpresaTipo(tipo);
                    field.onChange(value === 'true');
                  }} 
                  defaultValue={field.value ? 'true' : 'false'}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo de actividad" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="true">Empresa de Manufactura</SelectItem>
                    <SelectItem value="false">Empresa de Servicios</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    );
  }

  // Step 2: Actividad según tipo de empresa
  function ActividadStep({ form }: { form: any }) {
    if (empresaTipo === 'manufactura') {
      return (
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Empresa de Manufactura</h3>
          
          <FormField
            control={form.control}
            name="actividad.manufactura.producto_consumo_humano"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      // También actualizar el campo tradicional para compatibilidad
                      form.setValue('producto_consumo_humano', !!checked);
                    }}
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
            name="actividad.manufactura.tiene_empleados_tecnicos"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      // También actualizar el campo tradicional para compatibilidad
                      form.setValue('tiene_empleados_tecnicos', !!checked);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Diseño (¿Hay empleados técnicos en plantilla?)</FormLabel>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="actividad.manufactura.producto_final_o_intermedio"
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
            name="actividad.manufactura.distribucion"
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
                      name="actividad.manufactura.distribucion"
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
                                  
                                  // También actualizar el campo tradicional para compatibilidad
                                  if (checked) {
                                    const currentDistribucion = form.getValues('distribucion') || [];
                                    form.setValue('distribucion', [...currentDistribucion, region.id]);
                                  } else {
                                    const currentDistribucion = form.getValues('distribucion') || [];
                                    form.setValue('distribucion', 
                                      currentDistribucion.filter((item: string) => item !== region.id)
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {region.label}
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
          
          <FormField
            control={form.control}
            name="actividad.manufactura.matriz_en_espana"
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
            name="actividad.manufactura.filiales"
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
                      name="actividad.manufactura.filiales"
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
    } else if (empresaTipo === 'servicios') {
      return (
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Empresa de Servicios</h3>
          
          <FormField
            control={form.control}
            name="actividad.servicios.trabajos_fuera_instalaciones"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>¿Realiza trabajos fuera de las instalaciones o en casa de terceros o clientes?</FormLabel>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="actividad.servicios.corte_soldadura"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>¿Hace trabajos de corte y soldadura?</FormLabel>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="actividad.servicios.trabajo_equipos_electronicos"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>¿Trabaja sobre aparatos o equipos electrónicos?</FormLabel>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="actividad.servicios.empleados_tecnicos"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      // También actualizar el campo tradicional para compatibilidad
                      form.setValue('tiene_empleados_tecnicos', !!checked);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>¿Tiene empleados técnicos/profesionales en plantilla?</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>
      );
    } else {
      return (
        <div className="p-4 border border-yellow-300 bg-yellow-50 rounded-md">
          <p className="text-yellow-800">
            Por favor, selecciona primero un código CNAE en el paso anterior para determinar el tipo de actividad de tu empresa.
          </p>
        </div>
      );
    }
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

  async function onSubmit() {
    setIsSubmitting(true);
    try {
      const values = form.getValues();
      console.log("Valores del formulario:", values);
      
      // Get or create session
      const sessionId = await getOrCreateSession();
      console.log("Session ID:", sessionId);
      
      // Submit company data
      console.log("Enviando datos de empresa...");
      const companyResponse = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          ...values.company,
          tipo_empresa: empresaTipo,
        }),
      });
      
      const companyData = await companyResponse.json();
      console.log("Respuesta de empresa:", companyData);
      
      if (!companyResponse.ok) {
        throw new Error(`Error al guardar los datos de la empresa: ${JSON.stringify(companyData)}`);
      }
      
      // Submit form data with empresa type-specific values
      console.log("Enviando datos del formulario...");
      
      // Preparar datos específicos de la actividad
      const actividadData = empresaTipo === 'manufactura' 
        ? values.actividad.manufactura 
        : values.actividad.servicios;
      
      const formResponse = await fetch('/api/forms/responsabilidad-civil', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          actividad_manufactura: empresaTipo === 'manufactura',
          producto_consumo_humano: values.actividad.manufactura.producto_consumo_humano,
          distribucion: values.actividad.manufactura.distribucion,
          tiene_empleados_tecnicos: empresaTipo === 'manufactura' 
            ? values.actividad.manufactura.tiene_empleados_tecnicos 
            : values.actividad.servicios.empleados_tecnicos,
          ambito_territorial: values.ambito_territorial,
          coberturas_solicitadas: values.coberturas_solicitadas,
          empresa_tipo: empresaTipo,
          actividad: {
            [empresaTipo as string]: actividadData
          },
          company_id: companyData.id,
        }),
      });
      
      const formData = await formResponse.json();
      console.log("Respuesta del formulario:", formData);
      
      if (!formResponse.ok) {
        throw new Error(`Error al guardar el formulario: ${JSON.stringify(formData)}`);
      }
      
      // Mostrar mensaje de éxito antes de redireccionar
      alert("¡Formulario enviado correctamente! Redirigiendo a tus recomendaciones personalizadas...");
      
      // Pequeña pausa para que el usuario vea el mensaje
      setTimeout(() => {
        // Redirect to recommendations
        router.push('/recomendaciones');
      }, 1500);
      
    } catch (error) {
      console.error('Error detallado al enviar formulario:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert(`Hubo un error al procesar tu solicitud: ${errorMessage}`);
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
      title: "Actividad y operaciones",
      content: <Form {...form}><ActividadStep form={form} /></Form>
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
  isSubmitting={isSubmitting} // Añadir esta prop
/>
    </div>
  );
}