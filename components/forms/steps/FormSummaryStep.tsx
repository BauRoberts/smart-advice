// components/forms/steps/FormSummaryStep.tsx
'use client';

import { FormData } from '@/contexts/FormContext';
import FormLayout from '@/components/layout/FormLayout';

interface FormSummaryStepProps {
  onSubmit: () => void;
  onBack: () => void;
  formData: FormData;
  isSubmitting: boolean;
}

export default function FormSummaryStep({ 
  onSubmit, 
  onBack, 
  formData,
  isSubmitting
}: FormSummaryStepProps) {
  // Crear una lista de regiones de distribución para mostrar
  const getDistribucionLabels = () => {
    const distribucion = formData.actividad.manufactura?.distribucion || [];
    const labels: Record<string, string> = {
      'espana': 'España + Andorra',
      'ue': 'Unión Europea',
      'mundial-sin-usa': 'Todo el mundo excepto USA y Canadá',
      'mundial-con-usa': 'Todo el mundo incluido USA y Canadá'
    };
    
    return distribucion.map(id => labels[id] || id).join(', ');
  };

  // Crear una lista de filiales para mostrar
  const getFilialesLabels = () => {
    const filiales = formData.actividad.manufactura?.filiales || [];
    const labels: Record<string, string> = {
      'ue': 'Unión Europea',
      'resto-mundo': 'Resto del mundo',
      'usa-canada': 'USA y Canadá'
    };
    
    return filiales.length > 0 
      ? filiales.map(id => labels[id] || id).join(', ') 
      : 'No tiene filiales';
  };

  // Obtener las coberturas seleccionadas
  const getCoberturasSeleccionadas = () => {
    const coberturas = formData.coberturas_solicitadas;
    const labels: Record<string, string> = {
      'exploitation': 'RC Explotación',
      'patronal': 'RC Patronal',
      'productos': 'RC Productos',
      'trabajos': 'RC Trabajos',
      'profesional': 'RC Profesional'
    };
    
    return Object.entries(coberturas)
      .filter(([_, value]) => value)
      .map(([key, _]) => labels[key] || key);
  };

  return (
    <FormLayout
      title="Resumen del formulario"
      subtitle="Revisa la información antes de enviar"
      currentStep={5}
      totalSteps={5}
      onNext={onSubmit}
      onBack={onBack}
      isSubmitting={isSubmitting}
      isLastStep={true}
    >
      <div className="space-y-6">
        {/* Datos de contacto */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium mb-2">Datos de contacto</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Nombre</dt>
              <dd>{formData.contact.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd>{formData.contact.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
              <dd>{formData.contact.phone}</dd>
            </div>
          </dl>
        </div>
        
        {/* Datos de empresa */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium mb-2">Datos de la empresa</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Nombre de la empresa</dt>
              <dd>{formData.company.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Actividad (CNAE)</dt>
              <dd>{formData.company.cnae_code} - {formData.company.activity}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Empleados</dt>
              <dd>{formData.company.employees_number}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Facturación anual</dt>
              <dd>{formData.company.billing.toLocaleString()} €</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Facturación online</dt>
              <dd>
                {formData.company.online_invoice 
                  ? `Sí (${formData.company.online_invoice_percentage}%)` 
                  : 'No'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Instalaciones</dt>
              <dd>{formData.company.installations_type} - {formData.company.m2_installations} m²</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Almacena bienes de terceros</dt>
              <dd>{formData.company.almacena_bienes_terceros ? 'Sí' : 'No'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Vehículos de terceros aparcados</dt>
              <dd>{formData.company.vehiculos_terceros_aparcados ? 'Sí' : 'No'}</dd>
            </div>
          </dl>
        </div>
        
        {/* Datos de actividad específica */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium mb-2">
            Información de {formData.empresaTipo === 'manufactura' ? 'manufactura' : 'servicios'}
          </h3>
          
          {formData.empresaTipo === 'manufactura' && formData.actividad.manufactura && (
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Producto para consumo humano</dt>
                <dd>{formData.actividad.manufactura.producto_consumo_humano ? 'Sí' : 'No'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Empleados técnicos en plantilla</dt>
                <dd>{formData.actividad.manufactura.tiene_empleados_tecnicos ? 'Sí' : 'No'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Tipo de producto</dt>
                <dd>
                  {formData.actividad.manufactura.producto_final_o_intermedio === 'final'
                    ? 'Producto Final'
                    : 'Producto Intermedio'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Distribución</dt>
                <dd>{getDistribucionLabels()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Matriz en España</dt>
                <dd>{formData.actividad.manufactura.matriz_en_espana ? 'Sí' : 'No'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Filiales</dt>
                <dd>{getFilialesLabels()}</dd>
              </div>
            </dl>
          )}
          
          {formData.empresaTipo === 'servicios' && formData.actividad.servicios && (
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Trabajos fuera de instalaciones</dt>
                <dd>{formData.actividad.servicios.trabajos_fuera_instalaciones ? 'Sí' : 'No'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Trabajos de corte y soldadura</dt>
                <dd>{formData.actividad.servicios.corte_soldadura ? 'Sí' : 'No'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Trabajo con equipos electrónicos</dt>
                <dd>{formData.actividad.servicios.trabajo_equipos_electronicos ? 'Sí' : 'No'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Empleados técnicos/profesionales</dt>
                <dd>{formData.actividad.servicios.empleados_tecnicos ? 'Sí' : 'No'}</dd>
              </div>
            </dl>
          )}
        </div>
        
        {/* Datos de coberturas */}
        <div>
          <h3 className="text-lg font-medium mb-2">Ámbito territorial y coberturas</h3>
          <dl className="grid grid-cols-1 gap-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Ámbito territorial</dt>
              <dd>{formData.ambito_territorial}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Coberturas solicitadas</dt>
              <dd>
                <ul className="list-disc list-inside">
                  {getCoberturasSeleccionadas().map((cobertura, index) => (
                    <li key={index}>{cobertura}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
        
        <div className="pt-4 bg-blue-50 p-4 rounded-md">
          <p className="text-sm text-blue-800">
            Al hacer clic en "Enviar", recibirás tus recomendaciones personalizadas de seguros basadas en la información proporcionada.
          </p>
        </div>
      </div>
    </FormLayout>
  );
}