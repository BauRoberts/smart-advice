"use client";

import { FormData } from "@/contexts/FormContext";
import FormLayout from "@/components/layout/FormLayout";

interface FormSummaryStepProps {
  onSubmit: () => void;
  onBack: () => void;
  formData: any;
  isSubmitting: boolean;
  formType: string;
  currentStep?: number;
  totalSteps?: number;
}

export default function FormSummaryStep({
  onSubmit,
  onBack,
  formData,
  isSubmitting,
  formType,
  currentStep = 8,
  totalSteps = 8,
}: FormSummaryStepProps) {
  // Get the title
  const getTitle = () => {
    return "Resumen Daños Materiales";
  };

  // Función para obtener las coberturas RC de Daños Materiales
  const getCoberturasRCDanos = () => {
    const capitalesYCoberturas = formData.capitales_y_coberturas || {};
    const coberturas = capitalesYCoberturas.coberturas_rc || {};

    const labels: Record<string, string> = {
      explotacion: "RC Explotación",
      patronal: "RC Patronal",
      productos: "RC Productos",
      inmobiliaria: "RC Inmobiliaria",
      locativa: "RC Locativa",
    };

    return Object.entries(coberturas)
      .filter(([_, value]) => value)
      .map(([key, _]) => labels[key] || key);
  };

  // Función para formatear valores monetarios
  const formatCurrency = (value: number | undefined | null) => {
    if (value === undefined || value === null || value === 0) return "0 €";
    return `${value.toLocaleString()} €`;
  };

  // Función para formatear materiales de construcción
  const formatMaterial = (material: string | undefined) => {
    if (!material) return "-";

    // Mapping de códigos a nombres legibles
    const materialLabels: Record<string, string> = {
      // Materiales de cubierta
      hormigon: "Hormigón",
      chapa_metalica: "Chapa metálica simple",
      panel_sandwich_lana: "Panel sándwich con lana de roca o fibra de vidrio",
      panel_sandwich_pir: "Panel sándwich PIR/PUR",
      madera: "Madera",
      // Materiales de cerramientos
      ladrillo: "Ladrillo",
      metalico: "Metálico",
      panel_sandwich: "Panel Sandwich",
      // Materiales de estructura
      metalica: "Metálica",
      mixta: "Mixta",
      otros: "Otros materiales",
    };

    return materialLabels[material] || material.replace(/_/g, " ");
  };

  return (
    <FormLayout
      title={getTitle()}
      subtitle="Revisa la información antes de enviar"
      currentStep={currentStep}
      totalSteps={totalSteps}
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
              <dd>{formData.contact?.name || "-"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd>{formData.contact?.email || "-"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
              <dd>{formData.contact?.phone || "-"}</dd>
            </div>
          </dl>
        </div>

        {/* Información General */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium mb-2">Información General</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Nombre de la empresa
              </dt>
              <dd>{formData.informacion_general?.name || "-"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">CIF</dt>
              <dd>{formData.informacion_general?.cif || "-"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Dirección</dt>
              <dd>{formData.informacion_general?.direccion || "-"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Actividad (CNAE)
              </dt>
              <dd>
                {formData.informacion_general?.cnae_code
                  ? `${formData.informacion_general.cnae_code} - ${
                      formData.informacion_general.activity || "Sin descripción"
                    }`
                  : "-"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Descripción de actividad
              </dt>
              <dd>
                {formData.informacion_general?.activity_description || "-"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Empleados</dt>
              <dd>{formData.informacion_general?.employees_number || "-"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Facturación anual
              </dt>
              <dd>
                {formData.informacion_general?.billing
                  ? formatCurrency(formData.informacion_general.billing)
                  : "-"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Facturación online
              </dt>
              <dd>
                {formData.informacion_general?.online_invoice
                  ? `Sí (${formData.informacion_general.online_invoice_percentage}%)`
                  : "No"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Propiedad de instalaciones
              </dt>
              <dd>
                {formData.informacion_general?.es_propietario === "si"
                  ? "Propietario"
                  : formData.informacion_general?.es_propietario === "no"
                  ? `Arrendatario (Propietario: ${
                      formData.informacion_general?.propietario_nombre || "-"
                    })`
                  : "-"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                M² de instalaciones
              </dt>
              <dd>
                {formData.informacion_general?.m2_installations
                  ? `${formData.informacion_general.m2_installations.toLocaleString()} m²`
                  : "-"}
              </dd>
            </div>
          </dl>
        </div>

        {/* Información de instalaciones (Características constructivas) */}
        {formData.construccion && (
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium mb-2">
              Información de las Instalaciones
            </h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Material de cubierta
                </dt>
                <dd>{formatMaterial(formData.construccion.cubierta)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Material de cerramientos exteriores
                </dt>
                <dd>{formatMaterial(formData.construccion.cerramientos)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Material de estructura
                </dt>
                <dd>{formatMaterial(formData.construccion.estructura)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Cámaras frigoríficas
                </dt>
                <dd>
                  {formData.construccion.camaras_frigorificas ? "Sí" : "No"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Placas solares en cubierta
                </dt>
                <dd>{formData.construccion.placas_solares ? "Sí" : "No"}</dd>
              </div>
              {formData.construccion.placas_solares &&
                formData.construccion.valor_placas_solares > 0 && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Valor de las placas solares
                    </dt>
                    <dd>
                      {formatCurrency(
                        formData.construccion.valor_placas_solares
                      )}
                    </dd>
                  </div>
                )}
            </dl>
          </div>
        )}

        {/* Protecciones contra incendios */}
        {formData.proteccion_incendios && (
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium mb-2">
              Protecciones contra Incendio
            </h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Extintores
                </dt>
                <dd>
                  {formData.proteccion_incendios.extintores ? "Sí" : "No"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Bocas de incendio
                </dt>
                <dd>
                  {formData.proteccion_incendios.bocas_incendio ? "Sí" : "No"}
                </dd>
              </div>
              {formData.proteccion_incendios.bocas_incendio && (
                <>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Cobertura BIE
                    </dt>
                    <dd>
                      {formData.proteccion_incendios.cobertura_total
                        ? "Total"
                        : "Parcial"}
                    </dd>
                  </div>
                  {!formData.proteccion_incendios.cobertura_total &&
                    formData.proteccion_incendios.bocas_areas && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Áreas cubiertas
                        </dt>
                        <dd>{formData.proteccion_incendios.bocas_areas}</dd>
                      </div>
                    )}
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Depósito y bombeo propio
                    </dt>
                    <dd>
                      {formData.proteccion_incendios.deposito_bombeo
                        ? "Sí"
                        : "No"}
                    </dd>
                  </div>
                </>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Columnas hidrantes
                </dt>
                <dd>
                  {formData.proteccion_incendios.columnas_hidrantes
                    ? "Sí"
                    : "No"}
                </dd>
              </div>
              {formData.proteccion_incendios.columnas_hidrantes && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Tipo de hidrantes
                  </dt>
                  <dd>
                    {Array.isArray(
                      formData.proteccion_incendios.columnas_hidrantes_tipo
                    ) &&
                    formData.proteccion_incendios.columnas_hidrantes_tipo
                      .length > 0
                      ? formData.proteccion_incendios.columnas_hidrantes_tipo
                          .map((tipo: string) =>
                            tipo === "publico"
                              ? "Público"
                              : tipo === "privado"
                              ? "Privado"
                              : tipo
                          )
                          .join(", ")
                      : formData.proteccion_incendios
                          .columnas_hidrantes_tipo === "publico"
                      ? "Público"
                      : formData.proteccion_incendios
                          .columnas_hidrantes_tipo === "privado"
                      ? "Privado"
                      : "-"}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Detección automática
                </dt>
                <dd>
                  {formData.proteccion_incendios.deteccion_automatica
                    ? "Sí"
                    : "No"}
                </dd>
              </div>
              {formData.proteccion_incendios.deteccion_automatica && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Cobertura de detección
                  </dt>
                  <dd>
                    {Array.isArray(
                      formData.proteccion_incendios.deteccion_zona
                    ) &&
                    formData.proteccion_incendios.deteccion_zona.includes(
                      "totalidad"
                    )
                      ? "Totalidad del riesgo"
                      : Array.isArray(
                          formData.proteccion_incendios.deteccion_zona
                        ) &&
                        formData.proteccion_incendios.deteccion_zona.length > 0
                      ? formData.proteccion_incendios.deteccion_zona.join(", ")
                      : "-"}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Rociadores automáticos
                </dt>
                <dd>
                  {formData.proteccion_incendios.rociadores ? "Sí" : "No"}
                </dd>
              </div>
              {formData.proteccion_incendios.rociadores && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Cobertura de rociadores
                  </dt>
                  <dd>
                    {Array.isArray(
                      formData.proteccion_incendios.rociadores_zona
                    ) &&
                    formData.proteccion_incendios.rociadores_zona.includes(
                      "totalidad"
                    )
                      ? "Totalidad del riesgo"
                      : Array.isArray(
                          formData.proteccion_incendios.rociadores_zona
                        ) &&
                        formData.proteccion_incendios.rociadores_zona.length > 0
                      ? formData.proteccion_incendios.rociadores_zona.join(", ")
                      : "-"}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Suministro de agua
                </dt>
                <dd>
                  {formData.proteccion_incendios.suministro_agua ===
                  "red_publica"
                    ? "Red pública"
                    : formData.proteccion_incendios.suministro_agua ===
                      "sistema_privado"
                    ? "Sistema privado con grupo de bombeo y depósito propio"
                    : formData.proteccion_incendios.suministro_agua ===
                      "no_tiene"
                    ? "No tiene"
                    : "-"}
                </dd>
              </div>
            </dl>
          </div>
        )}

        {/* Protecciones contra robo */}
        {formData.proteccion_robo && (
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium mb-2">
              Protecciones contra Robo
            </h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Protecciones físicas
                </dt>
                <dd>
                  {formData.proteccion_robo.protecciones_fisicas ? "Sí" : "No"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Vigilancia en polígono
                </dt>
                <dd>
                  {formData.proteccion_robo.vigilancia_propia ? "Sí" : "No"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Alarma conectada a central
                </dt>
                <dd>
                  {formData.proteccion_robo.alarma_conectada ? "Sí" : "No"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Sistema CCTV/Cámaras
                </dt>
                <dd>
                  {formData.proteccion_robo.camaras_circuito ? "Sí" : "No"}
                </dd>
              </div>
            </dl>
          </div>
        )}

        {/* Capitales y Coberturas */}
        {formData.capitales_y_coberturas && (
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium mb-2">
              Capitales a asegurar y Coberturas
            </h3>

            {/* Capitales principales */}
            <h4 className="text-md font-medium mt-3 mb-2">
              Valores principales
            </h4>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Valor del edificio
                </dt>
                <dd>
                  {formatCurrency(
                    formData.capitales_y_coberturas.valor_edificio
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Valor del ajuar industrial
                </dt>
                <dd>
                  {formatCurrency(formData.capitales_y_coberturas.valor_ajuar)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Valor de existencias propias
                </dt>
                <dd>
                  {formatCurrency(
                    formData.capitales_y_coberturas.valor_existencias
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Valor del equipo electrónico
                </dt>
                <dd>
                  {formatCurrency(
                    formData.capitales_y_coberturas.valor_equipo_electronico
                  )}
                </dd>
              </div>
            </dl>

            {/* Bienes especiales */}
            {(formData.capitales_y_coberturas.existencias_terceros ||
              formData.capitales_y_coberturas.existencias_propias_terceros ||
              formData.capitales_y_coberturas.existencias_intemperie ||
              formData.capitales_y_coberturas.vehiculos_terceros_aparcados ||
              formData.capitales_y_coberturas.bienes_empleados ||
              formData.capitales_y_coberturas.bienes_camaras_frigorificas) && (
              <>
                <h4 className="text-md font-medium mt-4 mb-2">
                  Bienes especiales
                </h4>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                  {formData.capitales_y_coberturas.existencias_terceros && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Bienes de terceros
                      </dt>
                      <dd>
                        {formatCurrency(
                          formData.capitales_y_coberturas
                            .valor_existencias_terceros
                        )}
                      </dd>
                    </div>
                  )}
                  {formData.capitales_y_coberturas
                    .existencias_propias_terceros && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Bienes propios en instalaciones de terceros
                      </dt>
                      <dd>
                        {formatCurrency(
                          formData.capitales_y_coberturas
                            .valor_existencias_propias_terceros
                        )}
                      </dd>
                    </div>
                  )}
                  {formData.capitales_y_coberturas.existencias_intemperie && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Bienes a la intemperie
                      </dt>
                      <dd>
                        {formatCurrency(
                          formData.capitales_y_coberturas
                            .valor_existencias_intemperie
                        )}
                      </dd>
                    </div>
                  )}
                  {formData.capitales_y_coberturas
                    .vehiculos_terceros_aparcados && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Vehículos de terceros
                      </dt>
                      <dd>
                        {formatCurrency(
                          formData.capitales_y_coberturas
                            .valor_vehiculos_terceros
                        )}
                      </dd>
                    </div>
                  )}
                  {formData.capitales_y_coberturas.bienes_empleados && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Bienes de empleados
                      </dt>
                      <dd>
                        {formatCurrency(
                          formData.capitales_y_coberturas.valor_bienes_empleados
                        )}
                      </dd>
                    </div>
                  )}
                  {formData.capitales_y_coberturas
                    .bienes_camaras_frigorificas && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Bienes en cámaras frigoríficas
                      </dt>
                      <dd>
                        {formatCurrency(
                          formData.capitales_y_coberturas
                            .valor_bienes_camaras_frigorificas
                        )}
                      </dd>
                    </div>
                  )}
                </dl>
              </>
            )}

            {/* Pérdida de beneficios */}
            {(formData.capitales_y_coberturas?.margen_bruto_anual ?? 0) > 0 && (
              <>
                <h4 className="text-md font-medium mt-4 mb-2">
                  Pérdida de beneficios
                </h4>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Margen bruto anual
                    </dt>
                    <dd>
                      {formatCurrency(
                        formData.capitales_y_coberturas.margen_bruto_anual
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Periodo de indemnización
                    </dt>
                    <dd>
                      {formData.capitales_y_coberturas.periodo_indemnizacion
                        ? `${formData.capitales_y_coberturas.periodo_indemnizacion} meses`
                        : "-"}
                    </dd>
                  </div>
                </dl>
              </>
            )}

            {/* Coberturas adicionales */}
            <h4 className="text-md font-medium mt-4 mb-2">
              Coberturas adicionales
            </h4>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              {formData.capitales_y_coberturas.bienes_leasing && (
                <>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Bienes en leasing
                    </dt>
                    <dd>Sí</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Arrendador
                    </dt>
                    <dd>
                      {formData.capitales_y_coberturas.leasing_arrendador ||
                        "-"}
                    </dd>
                  </div>
                </>
              )}
              {formData.capitales_y_coberturas.dinero_caja_fuerte && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Dinero en caja fuerte
                  </dt>
                  <dd>
                    {formatCurrency(
                      formData.capitales_y_coberturas.valor_dinero_caja_fuerte
                    )}
                  </dd>
                </div>
              )}
              {formData.capitales_y_coberturas.dinero_fuera_caja && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Dinero fuera de caja fuerte
                  </dt>
                  <dd>
                    {formatCurrency(
                      formData.capitales_y_coberturas.valor_dinero_fuera_caja
                    )}
                  </dd>
                </div>
              )}
              {formData.capitales_y_coberturas.averia_maquinaria && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Avería de maquinaria
                  </dt>
                  <dd>
                    {formatCurrency(
                      formData.capitales_y_coberturas.valor_averia_maquinaria
                    )}
                  </dd>
                </div>
              )}
              {formData.capitales_y_coberturas.todo_riesgo_accidental && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Todo riesgo accidental
                  </dt>
                  <dd>Incluido</dd>
                </div>
              )}
            </dl>

            {/* Responsabilidad Civil */}
            {formData.capitales_y_coberturas.responsabilidad_civil && (
              <>
                <h4 className="text-md font-medium mt-4 mb-2">
                  Responsabilidad Civil
                </h4>
                <dl className="grid grid-cols-1 gap-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Coberturas solicitadas
                    </dt>
                    <dd>
                      <ul className="list-disc list-inside">
                        {getCoberturasRCDanos().map((cobertura, index) => (
                          <li key={index}>{cobertura}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                </dl>
              </>
            )}
          </div>
        )}

        {/* Siniestralidad */}
        {formData.siniestralidad && (
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium mb-2">Siniestralidad</h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  ¿Has tenido siniestros en los últimos 3 años?
                </dt>
                <dd>
                  {formData.siniestralidad.siniestros_ultimos_3_anos
                    ? "Sí"
                    : "No"}
                </dd>
              </div>
              {formData.siniestralidad.siniestros_ultimos_3_anos && (
                <div className="col-span-2">
                  <dt className="text-sm font-medium text-gray-500">
                    Detalles de los siniestros
                  </dt>
                  <dd className="whitespace-pre-line">
                    {formData.siniestralidad.siniestros_detalles ||
                      "No se proporcionaron detalles"}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}

        <div className="pt-4 bg-blue-50 p-4 rounded-md">
          <p className="text-sm text-blue-800">
            Al hacer clic en &quot;Enviar&quot;, recibirás tus recomendaciones
            personalizadas de seguros basadas en la información proporcionada.
          </p>
        </div>
      </div>
    </FormLayout>
  );
}
