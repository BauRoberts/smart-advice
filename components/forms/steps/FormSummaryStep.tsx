"use client";

import { FormData } from "@/contexts/FormContext";
import FormLayout from "@/components/layout/FormLayout";

interface FormSummaryStepProps {
  onSubmit: () => void;
  onBack: () => void;
  formData: any;
  isSubmitting: boolean;
  formType: string;
  currentStep?: number; // Añadir esta propiedad
  totalSteps?: number; // Añadir esta propiedad
}
export default function FormSummaryStep({
  onSubmit,
  onBack,
  formData,
  isSubmitting,
  formType,
  currentStep = 5, // Valor por defecto
  totalSteps = 5, // Valor por defecto
}: FormSummaryStepProps) {
  // Crear una lista de regiones de distribución para mostrar
  const getDistribucionLabels = () => {
    const distribucion = formData.actividad.manufactura?.distribucion || [];
    const labels: Record<string, string> = {
      espana: "España + Andorra",
      ue: "Unión Europea",
      "mundial-sin-usa": "Todo el mundo excepto USA y Canadá",
      "mundial-con-usa": "Todo el mundo incluido USA y Canadá",
    };

    return distribucion.map((id: string) => labels[id] || id).join(", ");
  };

  // Crear una lista de filiales para mostrar
  const getFilialesLabels = () => {
    const filiales = formData.actividad.manufactura?.filiales || [];
    const labels: Record<string, string> = {
      ue: "Unión Europea",
      "resto-mundo": "Resto del mundo",
      "usa-canada": "USA y Canadá",
    };

    return filiales.length > 0
      ? filiales.map((id: string) => labels[id] || id).join(", ")
      : "No tiene filiales";
  };

  // Obtener las coberturas seleccionadas
  const getCoberturasSeleccionadas = () => {
    const coberturas = formData.coberturas_solicitadas;
    const labels: Record<string, string> = {
      exploitation: "RC Explotación",
      patronal: "RC Patronal",
      productos: "RC Productos",
      trabajos: "RC Trabajos",
      profesional: "RC Profesional",
    };

    return Object.entries(coberturas)
      .filter(([_, value]) => value)
      .map(([key, _]) => labels[key] || key);
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

  // Get the title based on form type
  const getTitle = () => {
    return formType === "danos" ? "Resumen Daños Materiales" : "Resumen RC";
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
        {/* Datos de contacto - común para ambos formularios */}
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

        {/* Información General - común para ambos formularios */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium mb-2">Información General</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Nombre de la empresa
              </dt>
              <dd>
                {formData.informacion_general?.name || formData.company.name}
              </dd>
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
                {formData.informacion_general?.cnae_code ||
                  formData.company.cnae_code}{" "}
                -{" "}
                {formData.informacion_general?.activity ||
                  formData.company.activity}
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
              <dd>
                {formData.informacion_general?.employees_number ||
                  formData.company.employees_number}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Facturación anual
              </dt>
              <dd>
                {formData.informacion_general?.billing
                  ? `${formData.informacion_general.billing.toLocaleString()} €`
                  : formData.company.billing
                  ? `${formData.company.billing.toLocaleString()} €`
                  : "No especificada"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Facturación online
              </dt>
              <dd>
                {formData.informacion_general?.online_invoice
                  ? `Sí (${formData.informacion_general.online_invoice_percentage}%)`
                  : formData.company.online_invoice
                  ? `Sí (${formData.company.online_invoice_percentage}%)`
                  : "No"}
              </dd>
            </div>
            {/* Solo mostrar para el formulario de daños materiales */}
            {formType === "danos" && (
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
            )}
            {/* Solo mostrar para el formulario de daños materiales */}
            {formType === "danos" && (
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  M² de instalaciones
                </dt>
                <dd>
                  {formData.informacion_general?.m2_installations
                    ? `${formData.informacion_general.m2_installations} m²`
                    : formData.company.m2_installations
                    ? `${formData.company.m2_installations} m²`
                    : "-"}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Información de instalaciones (antes Características constructivas) - Solo para Daños Materiales */}
        {formType === "danos" && formData.construccion && (
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium mb-2">
              Información de las Instalaciones
            </h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Tipo de construcción
                </dt>
                <dd>{formData.construccion.tipo_construccion || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Material de estructuras
                </dt>
                <dd>{formData.construccion.material_estructuras || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Material de cerramientos exteriores
                </dt>
                <dd>
                  {formData.construccion.material_cerramientos_ext || "-"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Material de cubierta
                </dt>
                <dd>{formData.construccion.material_cubierta || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Falsos techos
                </dt>
                <dd>{formData.construccion.falsos_techos ? "Sí" : "No"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Material de falsos techos
                </dt>
                <dd>
                  {formData.construccion.material_falsos_techos || "No aplica"}
                </dd>
              </div>
            </dl>
          </div>
        )}

        {/* Protecciones contra incendios - Solo para Daños Materiales */}
        {formType === "danos" && formData.proteccion_incendios && (
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
                      Cobertura total BIE
                    </dt>
                    <dd>
                      {formData.proteccion_incendios.cobertura_total
                        ? "Sí"
                        : "No"}
                    </dd>
                  </div>
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
                    {formData.proteccion_incendios.columnas_hidrantes_tipo ===
                    "publico"
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
                    {formData.proteccion_incendios.deteccion_zona?.includes(
                      "totalidad"
                    )
                      ? "Totalidad del riesgo"
                      : formData.proteccion_incendios.deteccion_zona?.length
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
                    {formData.proteccion_incendios.rociadores_zona?.includes(
                      "totalidad"
                    )
                      ? "Totalidad del riesgo"
                      : formData.proteccion_incendios.rociadores_zona?.length
                      ? formData.proteccion_incendios.rociadores_zona.join(", ")
                      : "-"}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Suministro de agua
                </dt>
                <dd>{formData.proteccion_incendios.suministro_agua || "-"}</dd>
              </div>
            </dl>
          </div>
        )}

        {/* Protecciones contra robo - Solo para Daños Materiales */}
        {formType === "danos" && formData.proteccion_robo && (
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

        {/* Capitales y Coberturas - Solo para Daños Materiales */}
        {formType === "danos" && formData.capitales_y_coberturas && (
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
                  {formData.capitales_y_coberturas.valor_edificio
                    ? `${formData.capitales_y_coberturas.valor_edificio.toLocaleString()} €`
                    : "0 €"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Valor del ajuar industrial
                </dt>
                <dd>
                  {formData.capitales_y_coberturas.valor_ajuar
                    ? `${formData.capitales_y_coberturas.valor_ajuar.toLocaleString()} €`
                    : "0 €"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Valor de existencias propias
                </dt>
                <dd>
                  {formData.capitales_y_coberturas.valor_existencias
                    ? `${formData.capitales_y_coberturas.valor_existencias.toLocaleString()} €`
                    : "0 €"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Valor del equipo electrónico
                </dt>
                <dd>
                  {formData.capitales_y_coberturas.valor_equipo_electronico
                    ? `${formData.capitales_y_coberturas.valor_equipo_electronico.toLocaleString()} €`
                    : "0 €"}
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
                        {formData.capitales_y_coberturas
                          .valor_existencias_terceros
                          ? `${formData.capitales_y_coberturas.valor_existencias_terceros.toLocaleString()} €`
                          : "0 €"}
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
                        {formData.capitales_y_coberturas
                          .valor_existencias_propias_terceros
                          ? `${formData.capitales_y_coberturas.valor_existencias_propias_terceros.toLocaleString()} €`
                          : "0 €"}
                      </dd>
                    </div>
                  )}
                  {formData.capitales_y_coberturas.existencias_intemperie && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Bienes a la intemperie
                      </dt>
                      <dd>
                        {formData.capitales_y_coberturas
                          .valor_existencias_intemperie
                          ? `${formData.capitales_y_coberturas.valor_existencias_intemperie.toLocaleString()} €`
                          : "0 €"}
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
                        {formData.capitales_y_coberturas
                          .valor_vehiculos_terceros
                          ? `${formData.capitales_y_coberturas.valor_vehiculos_terceros.toLocaleString()} €`
                          : "0 €"}
                      </dd>
                    </div>
                  )}
                  {formData.capitales_y_coberturas.bienes_empleados && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Bienes de empleados
                      </dt>
                      <dd>
                        {formData.capitales_y_coberturas.valor_bienes_empleados
                          ? `${formData.capitales_y_coberturas.valor_bienes_empleados.toLocaleString()} €`
                          : "0 €"}
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
                        {formData.capitales_y_coberturas
                          .valor_bienes_camaras_frigorificas
                          ? `${formData.capitales_y_coberturas.valor_bienes_camaras_frigorificas.toLocaleString()} €`
                          : "0 €"}
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
                      {formData.capitales_y_coberturas.margen_bruto_anual
                        ? `${formData.capitales_y_coberturas.margen_bruto_anual.toLocaleString()} €`
                        : "0 €"}
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
                    {formData.capitales_y_coberturas.valor_dinero_caja_fuerte
                      ? `${formData.capitales_y_coberturas.valor_dinero_caja_fuerte.toLocaleString()} €`
                      : "0 €"}
                  </dd>
                </div>
              )}
              {formData.capitales_y_coberturas.dinero_fuera_caja && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Dinero fuera de caja fuerte
                  </dt>
                  <dd>
                    {formData.capitales_y_coberturas.valor_dinero_fuera_caja
                      ? `${formData.capitales_y_coberturas.valor_dinero_fuera_caja.toLocaleString()} €`
                      : "0 €"}
                  </dd>
                </div>
              )}
              {formData.capitales_y_coberturas.averia_maquinaria && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Avería de maquinaria
                  </dt>
                  <dd>
                    {formData.capitales_y_coberturas.valor_averia_maquinaria
                      ? `${formData.capitales_y_coberturas.valor_averia_maquinaria.toLocaleString()} €`
                      : "0 €"}
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

        {/* Siniestralidad - Común para ambos formularios */}
        {formData.siniestralidad && (
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium mb-2">Siniestralidad</h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  ¿Has tenido siniestros en los últimos 5 años?
                </dt>
                <dd>{formData.siniestralidad.has_siniestros ? "Sí" : "No"}</dd>
              </div>
              {formData.siniestralidad.has_siniestros && (
                <>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Número de siniestros
                    </dt>
                    <dd>
                      {formData.siniestralidad.numero_siniestros ||
                        "No especificado"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Importe total
                    </dt>
                    <dd>
                      {formData.siniestralidad.importe_total
                        ? `${formData.siniestralidad.importe_total.toLocaleString()} €`
                        : "No especificado"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Causa de los siniestros
                    </dt>
                    <dd>
                      {formData.siniestralidad.causa_siniestros ||
                        "No especificada"}
                    </dd>
                  </div>
                </>
              )}
            </dl>
          </div>
        )}

        {/* Información específica de RC - Solo para formulario RC */}
        {formType === "rc" && formData.empresaTipo && (
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium mb-2">
              Información de{" "}
              {formData.empresaTipo === "manufactura"
                ? "manufactura"
                : "servicios"}
            </h3>

            {formData.empresaTipo === "manufactura" &&
              formData.actividad.manufactura && (
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Producto para consumo humano
                    </dt>
                    <dd>
                      {formData.actividad.manufactura.producto_consumo_humano
                        ? "Sí"
                        : "No"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Empleados técnicos en plantilla
                    </dt>
                    <dd>
                      {formData.actividad.manufactura.tiene_empleados_tecnicos
                        ? "Sí"
                        : "No"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Tipo de producto
                    </dt>
                    <dd>
                      {formData.actividad.manufactura
                        .producto_final_o_intermedio === "final"
                        ? "Producto Final"
                        : "Producto Intermedio"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Distribución
                    </dt>
                    <dd>{getDistribucionLabels()}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Matriz en España
                    </dt>
                    <dd>
                      {formData.actividad.manufactura.matriz_en_espana
                        ? "Sí"
                        : "No"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Filiales
                    </dt>
                    <dd>{getFilialesLabels()}</dd>
                  </div>
                </dl>
              )}

            {formData.empresaTipo === "servicios" &&
              formData.actividad.servicios && (
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Trabajos fuera de instalaciones
                    </dt>
                    <dd>
                      {formData.actividad.servicios.trabajos_fuera_instalaciones
                        ? "Sí"
                        : "No"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Trabajos de corte y soldadura
                    </dt>
                    <dd>
                      {formData.actividad.servicios.corte_soldadura
                        ? "Sí"
                        : "No"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Trabajo con equipos electrónicos
                    </dt>
                    <dd>
                      {formData.actividad.servicios.trabajo_equipos_electronicos
                        ? "Sí"
                        : "No"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Empleados técnicos/profesionales
                    </dt>
                    <dd>
                      {formData.actividad.servicios.empleados_tecnicos
                        ? "Sí"
                        : "No"}
                    </dd>
                  </div>
                </dl>
              )}
          </div>
        )}

        {/* Datos de coberturas para RC */}
        {formType === "rc" &&
          Object.keys(formData.coberturas_solicitadas || {}).length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">
                Ámbito territorial y coberturas
              </h3>
              <dl className="grid grid-cols-1 gap-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Ámbito territorial
                  </dt>
                  <dd>{formData.ambito_territorial}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Coberturas solicitadas
                  </dt>
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
