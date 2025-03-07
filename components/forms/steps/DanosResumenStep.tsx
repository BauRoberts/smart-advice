// components/forms/steps/DanosResumenStep.tsx
"use client";

import FormLayout from "@/components/layout/FormLayout";
import { useFormContext } from "@/contexts/FormContext";

interface DanosResumenStepProps {
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export default function DanosResumenStep({
  onSubmit,
  onBack,
  isSubmitting,
}: DanosResumenStepProps) {
  const { formData } = useFormContext();

  // Función para formatear valores monetarios
  const formatCurrency = (value?: number) => {
    if (value === undefined || value === 0) return "No especificado";
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  };

  // Función para dar formato de texto a valores booleanos
  const formatBoolean = (value?: boolean) => (value ? "Sí" : "No");

  // Obtener tipo de suministro de agua como texto
  const getSuministroAgua = () => {
    const suministro = formData.proteccion_incendios?.suministro_agua;
    if (!suministro) return "No especificado";

    const labels: Record<string, string> = {
      red_publica: "Red pública",
      sistema_privado: "Sistema privado con grupo de bombeo y depósito propio",
      no_tiene: "No tiene",
    };

    return labels[suministro] || suministro;
  };

  return (
    <FormLayout
      title="Resumen del formulario"
      subtitle="Revisa la información antes de enviar"
      currentStep={7}
      totalSteps={7}
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
              <dd>{formData.contact?.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd>{formData.contact?.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
              <dd>{formData.contact?.phone}</dd>
            </div>
          </dl>
        </div>

        {/* Datos de empresa */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium mb-2">Datos de la empresa</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Actividad (CNAE)
              </dt>
              <dd>
                {formData.company?.cnae_code} - {formData.company?.activity}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Facturación anual
              </dt>
              <dd>{formatCurrency(formData.company?.billing)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Número de empleados
              </dt>
              <dd>{formData.company?.employees_number}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Facturación online
              </dt>
              <dd>
                {formData.company?.online_invoice
                  ? `Sí (${formData.company.online_invoice_percentage}%)`
                  : "No"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Tipo de instalaciones
              </dt>
              <dd>{formData.company?.installations_type}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Metros cuadrados
              </dt>
              <dd>{formData.company?.m2_installations} m²</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Almacena bienes de terceros
              </dt>
              <dd>
                {formatBoolean(formData.company?.almacena_bienes_terceros)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Vehículos de terceros aparcados
              </dt>
              <dd>
                {formatBoolean(formData.company?.vehiculos_terceros_aparcados)}
              </dd>
            </div>
          </dl>
        </div>

        {/* Capitales a asegurar */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium mb-2">Capitales a asegurar</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Valor del edificio
              </dt>
              <dd>{formatCurrency(formData.capitales?.valor_edificio)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Valor del ajuar
              </dt>
              <dd>{formatCurrency(formData.capitales?.valor_ajuar)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Valor de existencias
              </dt>
              <dd>{formatCurrency(formData.capitales?.valor_existencias)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Existencias de terceros
              </dt>
              <dd>{formatBoolean(formData.capitales?.existencias_terceros)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Existencias propias en instalaciones de terceros
              </dt>
              <dd>
                {formatBoolean(
                  formData.capitales?.existencias_propias_terceros
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Valor equipo electrónico
              </dt>
              <dd>
                {formatCurrency(formData.capitales?.valor_equipo_electronico)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Margen bruto anual
              </dt>
              <dd>{formatCurrency(formData.capitales?.margen_bruto_anual)}</dd>
            </div>
          </dl>
        </div>

        {/* Características constructivas */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium mb-2">
            Características constructivas
          </h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Cubierta</dt>
              <dd>{formData.construccion?.cubierta}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Cerramientos
              </dt>
              <dd>{formData.construccion?.cerramientos}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Estructura</dt>
              <dd>{formData.construccion?.estructura}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Cámaras frigoríficas
              </dt>
              <dd>
                {formatBoolean(formData.construccion?.camaras_frigorificas)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Placas solares
              </dt>
              <dd>{formatBoolean(formData.construccion?.placas_solares)}</dd>
            </div>
            {formData.construccion?.placas_solares && (
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Valor placas solares
                </dt>
                <dd>
                  {formatCurrency(formData.construccion?.valor_placas_solares)}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Protección contra incendios */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium mb-2">
            Protección contra incendios
          </h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Extintores</dt>
              <dd>
                {formatBoolean(formData.proteccion_incendios?.extintores)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Bocas de incendio
              </dt>
              <dd>
                {formatBoolean(formData.proteccion_incendios?.bocas_incendio)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Depósito propio y grupo de bombeo
              </dt>
              <dd>
                {formatBoolean(formData.proteccion_incendios?.deposito_bombeo)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Cobertura total
              </dt>
              <dd>
                {formatBoolean(formData.proteccion_incendios?.cobertura_total)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Columnas hidrantes
              </dt>
              <dd>
                {formatBoolean(
                  formData.proteccion_incendios?.columnas_hidrantes
                )}
              </dd>
            </div>
            {formData.proteccion_incendios?.columnas_hidrantes && (
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Tipo de columnas hidrantes
                </dt>
                <dd>
                  {formData.proteccion_incendios?.columnas_hidrantes_tipo ===
                  "publico"
                    ? "Público"
                    : "Privado"}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Detección automática
              </dt>
              <dd>
                {formatBoolean(
                  formData.proteccion_incendios?.deteccion_automatica
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Rociadores</dt>
              <dd>
                {formatBoolean(formData.proteccion_incendios?.rociadores)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Suministro de agua
              </dt>
              <dd>{getSuministroAgua()}</dd>
            </div>
          </dl>
        </div>

        {/* Protección contra robo */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium mb-2">Protección contra robo</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Protecciones físicas
              </dt>
              <dd>
                {formatBoolean(formData.proteccion_robo?.protecciones_fisicas)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Vigilancia propia
              </dt>
              <dd>
                {formatBoolean(formData.proteccion_robo?.vigilancia_propia)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Alarma conectada
              </dt>
              <dd>
                {formatBoolean(formData.proteccion_robo?.alarma_conectada)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Cámaras de circuito cerrado
              </dt>
              <dd>
                {formatBoolean(formData.proteccion_robo?.camaras_circuito)}
              </dd>
            </div>
          </dl>
        </div>

        {/* Siniestralidad */}
        <div>
          <h3 className="text-lg font-medium mb-2">Siniestralidad</h3>
          <dl className="grid grid-cols-1 gap-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Siniestros en los últimos 3 años
              </dt>
              <dd>
                {formatBoolean(
                  formData.siniestralidad?.siniestros_ultimos_3_anos
                )}
              </dd>
            </div>
            {formData.siniestralidad?.siniestros_ultimos_3_anos &&
              formData.siniestralidad?.siniestros_detalles && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Detalles de siniestros
                  </dt>
                  <dd className="whitespace-pre-line">
                    {formData.siniestralidad.siniestros_detalles}
                  </dd>
                </div>
              )}
          </dl>
        </div>

        <div className="pt-4 bg-blue-50 p-4 rounded-md">
          <p className="text-sm text-blue-800">
            Al hacer clic en "Enviar", recibirás tus recomendaciones
            personalizadas de seguros basadas en la información proporcionada.
          </p>
        </div>
      </div>
    </FormLayout>
  );
}
