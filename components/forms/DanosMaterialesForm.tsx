// components/forms/DanosMaterialesForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DanosMaterialesFormData, danosMaterialesSchema } from '@/lib/schemas';
import MultiStepForm from './MultiStepForm';
import { 
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { getOrCreateSession } from '@/lib/session';
import CnaeSearch from '@/components/CnaeSearch';
import type { CnaeOption } from '@/lib/services/cnaeService';

// Step 1: Datos de la Empresa
function DatosEmpresaStep({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="empresa.actividad"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Actividad (CNAE) *</FormLabel>
            <FormControl>
              <CnaeSearch 
                onSelect={(option: CnaeOption) => {
                  form.setValue('empresa.actividad', option.description);
                  form.setValue('empresa.cnae_code', option.code);
                }}
                defaultValue={form.watch('empresa.cnae_code')}
              />
            </FormControl>
            <FormDescription>
              Selecciona el código CNAE que mejor represente la actividad de tu empresa
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="empresa.facturacion"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Facturación</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type="number" 
                  placeholder="Facturación anual" 
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseFloat(e.target.value) : 0;
                    field.onChange(value);
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2">€</span>
              </div>
            </FormControl>
            <FormDescription>
              Incluir solo la facturación a terceros excluyendo la facturación a otras empresas del grupo
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="empresa.num_trabajadores"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nº de trabajadores</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="Número de trabajadores" 
                value={field.value || ''}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : 0;
                  field.onChange(value);
                }}
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
        name="empresa.facturacion_online"
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="empresa.instalaciones_tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instalaciones</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="propietario">Propietario</SelectItem>
                  <SelectItem value="inquilino">Inquilino</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="empresa.metros_cuadrados"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Metros cuadrados de las instalaciones</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type="number" 
                    placeholder="m²" 
                    value={field.value || ''}
                    onChange={(e) => {
                      const value = e.target.value ? parseFloat(e.target.value) : 0;
                      field.onChange(value);
                    }}
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
      
      <FormField
        control={form.control}
        name="empresa.almacena_bienes_terceros"
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
        name="empresa.existencias_intemperie"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>¿Almacenas o tienes depositados existencias o maquinaria a la intemperie?</FormLabel>
            </div>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="empresa.vehiculos_terceros"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>¿Almacenas o tienes depositados vehículos de terceros en tus instalaciones?</FormLabel>
            </div>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="empresa.bienes_empleados"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>¿Quieres cubrir los daños a bienes de empleados?</FormLabel>
            </div>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="empresa.dinero_caja_fuerte"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Indica la cantidad de dinero depositado en caja fuerte</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type="number" 
                  placeholder="Cantidad" 
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseFloat(e.target.value) : 0;
                    field.onChange(value);
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2">€</span>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="empresa.dinero_fuera_caja"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Indica la cantidad de dinero en casa pero fuera de la caja fuerte</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type="number" 
                  placeholder="Cantidad" 
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseFloat(e.target.value) : 0;
                    field.onChange(value);
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2">€</span>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="empresa.clausula_todo_riesgo"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>¿Quieres incluir cláusula de todo riesgo accidental?</FormLabel>
              <FormDescription>
                Esta cláusula otorga más cobertura a los capitales asegurados pero incrementa la prima de seguro
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}

// Step 2: Capital Asegurado
function CapitalAseguradoStep({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="capital.valor_edificio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Indica el valor del edificio</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type="number" 
                  placeholder="Valor" 
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseFloat(e.target.value) : 0;
                    field.onChange(value);
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2">€</span>
              </div>
            </FormControl>
            <FormDescription>
              Tiene que tener el valor asegurado como si fuera a nuevo
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="capital.valor_ajuar"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Indica el valor del ajuar</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type="number" 
                  placeholder="Valor" 
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseFloat(e.target.value) : 0;
                    field.onChange(value);
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2">€</span>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="capital.valor_existencias"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Indica el valor de las existencias almacenadas</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type="number" 
                  placeholder="Valor" 
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseFloat(e.target.value) : 0;
                    field.onChange(value);
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2">€</span>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="capital.existencias_terceros"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>¿Almacenas existencias de terceros en tus instalaciones?</FormLabel>
            </div>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="capital.existencias_propias_terceros"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>¿Almacenas existencias propias en instalaciones de terceros?</FormLabel>
            </div>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="capital.valor_equipo_electronico"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Indica el valor del equipo electrónico</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type="number" 
                  placeholder="Valor" 
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseFloat(e.target.value) : 0;
                    field.onChange(value);
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2">€</span>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="capital.margen_bruto_anual"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Indica el margen bruto anual</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type="number" 
                  placeholder="Valor" 
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseFloat(e.target.value) : 0;
                    field.onChange(value);
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2">€</span>
              </div>
            </FormControl>
            <FormDescription>
              Se obtiene sumando los GASTOS FIJOS + BENEFICIO NETO ANTES DE IMPUESTOS
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

// Step 3: Características Constructivas
function CaracteristicasConstructivasStep({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="construccion.cubierta"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cubierta</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo de cubierta" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="hormigon">Hormigón</SelectItem>
                <SelectItem value="metalica">Metálica</SelectItem>
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
        name="construccion.cerramientos"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cerramientos</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo de cerramientos" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="ladrillo">Ladrillo</SelectItem>
                <SelectItem value="hormigon">Hormigón</SelectItem>
                <SelectItem value="metalico">Metálico</SelectItem>
                <SelectItem value="sandwich">Panel Sandwich</SelectItem>
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
        name="construccion.estructura"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estructura</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
      
      <FormField
        control={form.control}
        name="construccion.camaras_frigorificas"
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
        name="construccion.placas_solares"
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
  );
}

// Step 4: Protección contra Incendios
function ProteccionIncendiosStep({ form }: { form: any }) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="proteccion_incendios.extintores"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>¿Tienes extintores?</FormLabel>
            </div>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="proteccion_incendios.bocas_incendio"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>¿Tienes bocas de incendio?</FormLabel>
            </div>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="proteccion_incendios.deposito_bombeo"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>¿Tienes depósito propio y grupo de bombeo?</FormLabel>
            </div>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="proteccion_incendios.cobertura_total"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>¿Cubren la totalidad del riesgo?</FormLabel>
            </div>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="proteccion_incendios.columnas_hidrantes"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>¿Tienes columnas de hidrantes exteriores?</FormLabel>
            </div>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="proteccion_incendios.deteccion_automatica"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>¿Tienes detección automática de incendios?</FormLabel>
            </div>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="proteccion_incendios.rociadores"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>¿Tienes rociadores?</FormLabel>
            </div>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="proteccion_incendios.suministro_agua"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>¿Tienes suministro de agua?</FormLabel>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}

// Step 5: Protección contra Robo
function ProteccionRoboStep({ form }: { form: any }) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="proteccion_robo.protecciones_fisicas"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Protecciones físicas (rejas, cerraduras...)</FormLabel>
            </div>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="proteccion_robo.vigilancia_propia"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Vigilancia propia</FormLabel>
            </div>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="proteccion_robo.alarma_conectada"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Alarma antirrobo conectada a central</FormLabel>
            </div>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="proteccion_robo.camaras_circuito"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Cámaras de circuito cerrado</FormLabel>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}

// Step 6: Siniestralidad
function SiniestralidadStep({ form }: { form: any }) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="siniestralidad.siniestros_ultimos_3_anos"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>¿Has tenido siniestros en los últimos 3 años?</FormLabel>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}

// Main form component
export default function DanosMaterialesForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<DanosMaterialesFormData>({
    resolver: zodResolver(danosMaterialesSchema),
    defaultValues: {
      empresa: {
        actividad: '',
        facturacion: 0,
        num_trabajadores: 0,
        facturacion_online: false,
        instalaciones_tipo: '',
        metros_cuadrados: 0,
        almacena_bienes_terceros: false,
        existencias_intemperie: false,
        vehiculos_terceros: false,
        bienes_empleados: false,
        dinero_caja_fuerte: 0,
        dinero_fuera_caja: 0,
        clausula_todo_riesgo: false,
      },
      capital: {
        valor_edificio: 0,
        valor_ajuar: 0,
        valor_existencias: 0,
        existencias_terceros: false,
        existencias_propias_terceros: false,
        valor_equipo_electronico: 0,
        margen_bruto_anual: 0,
      },
      construccion: {
        cubierta: '',
        cerramientos: '',
        estructura: '',
        camaras_frigorificas: false,
        placas_solares: false,
      },
      proteccion_incendios: {
        extintores: false,
        bocas_incendio: false,
        deposito_bombeo: false,
        cobertura_total: false,
        columnas_hidrantes: false,
        deteccion_automatica: false,
        rociadores: false,
        suministro_agua: false,
      },
      proteccion_robo: {
        protecciones_fisicas: false,
        vigilancia_propia: false,
        alarma_conectada: false,
        camaras_circuito: false,
      },
      siniestralidad: {
        siniestros_ultimos_3_anos: false,
      },
    },
  });

  async function onSubmit() {
    setIsSubmitting(true);
    try {
      const values = form.getValues();
      
      // Get or create session
      const sessionId = await getOrCreateSession();
      
      // Submit form data
      const formResponse = await fetch('/api/forms/danos-materiales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          ...values,
        }),
      });
      
      if (!formResponse.ok) {
        throw new Error('Error al guardar el formulario');
      }
      
      // Show success message before redirecting
      alert("¡Formulario enviado correctamente! Redirigiendo a tus recomendaciones personalizadas...");
      
      // Small delay to show the message
      setTimeout(() => {
        router.push('/recomendaciones');
      }, 1500);
      
    } catch (error) {
      console.error('Error submitting form:', error);
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
      title: "Datos relativos a tu empresa",
      content: <Form {...form}><DatosEmpresaStep form={form} /></Form>
    },
    {
      id: 2,
      title: "Capital asegurado",
      content: <Form {...form}><CapitalAseguradoStep form={form} /></Form>
    },
    {
      id: 3,
      title: "Características constructivas del riesgo",
      content: <Form {...form}><CaracteristicasConstructivasStep form={form} /></Form>
    },
    {
      id: 4,
      title: "Protección contra incendios",
      content: <Form {...form}><ProteccionIncendiosStep form={form} /></Form>
    },
    {
      id: 5,
      title: "Protección contra robo",
      content: <Form {...form}><ProteccionRoboStep form={form} /></Form>
    },
    {
      id: 6,
      title: "Siniestralidad",
      content: <Form {...form}><SiniestralidadStep form={form} /></Form>
    }
  ];

  return (
    <div className="w-full">
      <MultiStepForm 
        steps={steps} 
        onSubmit={() => {
          form.handleSubmit(onSubmit)();
        }}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}