"use client";

import { useFormContext } from "@/contexts/FormContext";
import FormLayout from "@/components/layout/FormLayout";

interface RCResumenStepProps {
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  currentStep?: number;
  totalSteps?: number;
}

// Definir interfaces para las estructuras de datos
interface ServiciosData {
  subcontrata_personal?: boolean;
  trabajos_corte_soldadura?: boolean;
  trabajos_afectan_edificios?: boolean;
  trabajos_afectan_infraestructuras?: boolean;
  trabajos_instalaciones_terceros?: boolean;
  cubre_preexistencias?: boolean;
}

interface ManufacturaData {
  producto_consumo_humano?: boolean;
  producto_contacto_humano?: boolean;
  tiene_empleados_tecnicos?: boolean;
  producto_final_o_intermedio?: string;
  distribucion?: string[];
  matriz_en_espana?: boolean;
  filiales?: string[];
  considerar_gastos_retirada?: boolean;
  facturacion_por_region?: Record<string, number>;
}

interface ActividadData {
  servicios?: ServiciosData;
  manufactura?: ManufacturaData;
}

export default function RCResumenStep({
  onSubmit,
  onBack,
  isSubmitting,
  currentStep = 6,
  totalSteps = 6,
}: RCResumenStepProps) {
  // Obtener los datos del formulario desde el contexto
  const { formData } = useFormContext();
  return (
    <FormLayout
      title="Resumen de Responsabilidad Civil"
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
        <div className="border rounded-md p-4 shadow-sm">
          <h3 className="text-lg font-medium mb-3 text-blue-700">
            Datos de contacto
          </h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Nombre</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.contact?.name || "-"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.contact?.email || "-"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.contact?.phone || "-"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Política de privacidad
              </dt>
              <dd className="mt-1 text-sm text-gray-900">Aceptada</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Comunicaciones comerciales
              </dt>
              <dd className="mt-1 text-sm text-gray-900">No aceptadas</dd>
            </div>
          </dl>
        </div>

        {/* Datos básicos de la empresa */}
        <div className="border rounded-md p-4 shadow-sm">
          <h3 className="text-lg font-medium mb-3 text-blue-700">
            Datos básicos de la empresa
          </h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Nombre de la empresa
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.company?.name || "-"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">CNAE</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.company?.cnae_code || "-"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Actividad</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.company?.activity || "-"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Descripción de actividad
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.company?.industry_types || "-"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Tipo de industria/sector
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.company?.industry_types || "-"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Número de empleados
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.company?.employees_number?.toLocaleString() || "-"}
              </dd>
            </div>
          </dl>

          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500 mb-2">
              Actividades de la empresa:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 list-inside">
              <li className="text-sm text-gray-900">
                <span className="font-medium mr-2">Fabricación:</span>
                {formData.company?.manufactures ? "Sí" : "No"}
              </li>
              <li className="text-sm text-gray-900">
                <span className="font-medium mr-2">Comercialización:</span>
                {formData.company?.markets ? "Sí" : "No"}
              </li>
              <li className="text-sm text-gray-900">
                <span className="font-medium mr-2">
                  Prestación de servicios:
                </span>
                {formData.company?.provides_services ? "Sí" : "No"}
              </li>
              <li className="text-sm text-gray-900">
                <span className="font-medium mr-2">Almacenamiento:</span>
                {formData.company?.almacenamiento ? "Sí" : "No"}
              </li>
              <li className="text-sm text-gray-900">
                <span className="font-medium mr-2">Diseño:</span>
                {formData.company?.diseno ? "Sí" : "No"}
              </li>
            </ul>
          </div>
        </div>

        {/* Ubicación y propiedad */}
        <div className="border rounded-md p-4 shadow-sm">
          <h3 className="text-lg font-medium mb-3 text-blue-700">
            Ubicación y propiedad
          </h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Localización de la nave
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.company?.localizacion_nave || "-"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Tipo de instalaciones
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.company?.installations_type || "-"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Metros cuadrados
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.company?.m2_installations
                  ? `${formData.company.m2_installations.toLocaleString()} m²`
                  : "-"}
              </dd>
            </div>

            {formData.company?.installations_type === "No propietario" && (
              <>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Nombre del propietario
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formData.company?.propietario_nombre || "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    CIF/DNI del propietario
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formData.company?.propietario_cif || "-"}
                  </dd>
                </div>
              </>
            )}

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Placas solares
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.company?.tiene_placas_solares ? "Sí" : "No"}
              </dd>
            </div>

            {formData.company?.tiene_placas_solares && (
              <>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Placas para autoconsumo
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formData.company?.placas_autoconsumo ? "Sí" : "No"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Placas para venta a la red
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formData.company?.placas_venta_red ? "Sí" : "No"}
                  </dd>
                </div>
              </>
            )}
          </dl>
        </div>

        {/* Facturación */}
        <div className="border rounded-md p-4 shadow-sm">
          <h3 className="text-lg font-medium mb-3 text-blue-700">
            Facturación
          </h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Facturación anual
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.company?.billing
                  ? `${formData.company.billing.toLocaleString()} €`
                  : "-"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Facturación online
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.company?.online_invoice
                  ? `Sí (${formData.company.online_invoice_percentage}%)`
                  : "No"}
              </dd>
            </div>

            {/* Facturación por región geográfica (si aplica) */}
            {formData.actividad?.manufactura?.facturacion_por_region && (
              <>
                <div className="col-span-2 mt-2">
                  <dt className="text-sm font-medium text-gray-500">
                    Facturación por región geográfica:
                  </dt>
                </div>

                {formData.actividad.manufactura.facturacion_por_region
                  .espana_andorra && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      España y Andorra
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formData.actividad.manufactura.facturacion_por_region.espana_andorra.toLocaleString()}{" "}
                      €
                    </dd>
                  </div>
                )}

                {formData.actividad.manufactura.facturacion_por_region
                  .union_europea && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Unión Europea
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formData.actividad.manufactura.facturacion_por_region.union_europea.toLocaleString()}{" "}
                      €
                    </dd>
                  </div>
                )}

                {formData.actividad.manufactura.facturacion_por_region
                  .reino_unido && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Reino Unido
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formData.actividad.manufactura.facturacion_por_region.reino_unido.toLocaleString()}{" "}
                      €
                    </dd>
                  </div>
                )}

                {formData.actividad.manufactura.facturacion_por_region
                  .resto_mundo && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Resto del mundo (excepto USA y Canadá)
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formData.actividad.manufactura.facturacion_por_region.resto_mundo.toLocaleString()}{" "}
                      €
                    </dd>
                  </div>
                )}

                {formData.actividad.manufactura.facturacion_por_region
                  .usa_canada && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      USA y Canadá
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formData.actividad.manufactura.facturacion_por_region.usa_canada.toLocaleString()}{" "}
                      €
                    </dd>
                  </div>
                )}
              </>
            )}
          </dl>
        </div>

        {/* Coberturas adicionales */}
        <div className="border rounded-md p-4 shadow-sm">
          <h3 className="text-lg font-medium mb-3 text-blue-700">
            Coberturas adicionales
          </h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Filiales fuera de España
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.coberturas_solicitadas?.coberturas_adicionales
                  ?.has_subsidiaries_outside_spain
                  ? "Sí"
                  : "No"}
              </dd>
            </div>

            {formData.coberturas_solicitadas?.coberturas_adicionales
              ?.has_subsidiaries_outside_spain && (
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Ámbito territorial
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {getAmbitoTerritorialLabel(
                    formData.coberturas_solicitadas?.coberturas_adicionales
                      ?.territorial_scope
                  )}
                </dd>
              </div>
            )}

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Contaminación accidental
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.coberturas_solicitadas?.coberturas_adicionales
                  ?.cover_accidental_contamination
                  ? "Cubierto"
                  : "No cubierto"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Daños patrimoniales puros
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.coberturas_solicitadas?.coberturas_adicionales
                  ?.cover_material_damages
                  ? "Cubierto"
                  : "No cubierto"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Profesionales/técnicos en plantilla
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.coberturas_solicitadas?.coberturas_adicionales
                  ?.has_contracted_professionals
                  ? "Sí"
                  : "No"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Participación en ferias/congresos
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.coberturas_solicitadas?.coberturas_adicionales
                  ?.participates_in_fairs
                  ? "Sí"
                  : "No"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Cobertura a bienes de empleados
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.coberturas_solicitadas?.coberturas_adicionales
                  ?.cover_employee_damages
                  ? "Cubierto"
                  : "No cubierto"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Almacenamiento de bienes de terceros
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.coberturas_solicitadas?.coberturas_adicionales
                  ?.stores_third_party_goods
                  ? "Sí"
                  : "No"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Vehículos de terceros aparcados
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.coberturas_solicitadas?.coberturas_adicionales
                  ?.third_party_vehicles_parked
                  ? "Sí"
                  : "No"}
              </dd>
            </div>
          </dl>
        </div>

        {/* Detalles de fabricación (si aplica) */}
        {(formData.company?.manufactures ||
          formData.company?.markets ||
          formData.company?.diseno) &&
          formData.actividad?.manufactura && (
            <div className="border rounded-md p-4 shadow-sm">
              <h3 className="text-lg font-medium mb-3 text-blue-700">
                Detalles de fabricación/diseño
              </h3>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Tipo de producto
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formData.actividad.manufactura
                      .producto_final_o_intermedio === "intermedio"
                      ? "Intermedio (para uso en otros productos)"
                      : "Final (para uso directo por el consumidor)"}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Consumo humano/contacto con el cuerpo
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formData.actividad.manufactura.producto_consumo_humano
                      ? "Sí"
                      : "No"}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Distribución
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {(() => {
                      // Solo intentar usar distribucion ya que es la única propiedad que existe en el tipo
                      const distribArray =
                        formData.actividad?.manufactura?.distribucion;
                      if (
                        distribArray &&
                        Array.isArray(distribArray) &&
                        distribArray.length > 0
                      ) {
                        return distribArray
                          .map((region) => getDistribucionLabel(region))
                          .join(", ");
                      }

                      // Si distribucion no funciona, podemos acceder a la propiedad usando notación indexada
                      // que evita el checking de tipos de TypeScript
                      const manufactura = formData.actividad
                        ?.manufactura as any;
                      if (manufactura && manufactura["alcance_geografico"]) {
                        return getDistribucionLabel(
                          manufactura["alcance_geografico"]
                        );
                      }

                      return "-";
                    })()}
                  </dd>
                </div>
              </dl>
            </div>
          )}

        {/* Detalles de servicios (si aplica) */}
        {formData.company?.provides_services &&
          formData.actividad?.servicios && (
            <div className="border rounded-md p-4 shadow-sm">
              <h3 className="text-lg font-medium mb-3 text-blue-700">
                Detalles de prestación de servicios
              </h3>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Subcontrata personal
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {(formData.actividad.servicios as ServiciosData)
                      .subcontrata_personal
                      ? "Sí"
                      : "No"}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Trabajos de corte y soldadura
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {(formData.actividad.servicios as ServiciosData)
                      .trabajos_corte_soldadura
                      ? "Sí"
                      : "No"}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Trabajos que afectan a edificios
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {(formData.actividad.servicios as ServiciosData)
                      .trabajos_afectan_edificios
                      ? "Sí"
                      : "No"}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Trabajos que afectan a infraestructuras
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {(formData.actividad.servicios as ServiciosData)
                      .trabajos_afectan_infraestructuras
                      ? "Sí"
                      : "No"}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Trabajos en instalaciones de terceros
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {(formData.actividad.servicios as ServiciosData)
                      .trabajos_instalaciones_terceros
                      ? "Sí"
                      : "No"}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Cubre bienes preexistentes
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {(formData.actividad.servicios as ServiciosData)
                      .cubre_preexistencias
                      ? "Sí"
                      : "No"}
                  </dd>
                </div>
              </dl>
            </div>
          )}

        {/* Siniestralidad */}
        <div className="border rounded-md p-4 shadow-sm">
          <h3 className="text-lg font-medium mb-3 text-blue-700">
            Siniestralidad
          </h3>
          <dl className="grid grid-cols-1 gap-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Siniestros en los últimos 3 años
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.siniestralidad?.siniestros_ultimos_3_anos
                  ? "Sí"
                  : "No"}
              </dd>
            </div>

            {formData.siniestralidad?.siniestros_ultimos_3_anos && (
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Detalles de los siniestros
                </dt>
                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {formData.siniestralidad.siniestros_detalles || "-"}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="pt-4 bg-blue-50 p-4 rounded-md">
          <p className="text-sm text-blue-800">
            Al hacer clic en "Enviar", recibirás tus recomendaciones
            personalizadas de seguros de Responsabilidad Civil basadas en la
            información proporcionada.
          </p>
        </div>
      </div>
    </FormLayout>
  );
}

// Funciones auxiliares para formatear etiquetas
function getAmbitoTerritorialLabel(scope?: string): string {
  if (!scope) return "-";

  const labels: Record<string, string> = {
    europe: "Unión Europea",
    europe_uk: "Unión Europea y Reino Unido",
    worldwide_except_usa_canada: "Todo el mundo excepto USA y Canadá",
    worldwide_including_usa_canada: "Todo el mundo incluido USA y Canadá",
  };

  return labels[scope] || scope;
}

function getDistribucionLabel(region: string): string {
  const labels: Record<string, string> = {
    espana_andorra: "España + Andorra",
    union_europea: "Unión Europea",
    europa_reino_unido: "Unión Europea y Reino Unido",
    mundial_excepto_usa_canada: "Todo el mundo excepto USA y Canadá",
    mundial_incluyendo_usa_canada: "Todo el mundo incluido USA y Canadá",
  };

  return labels[region] || region;
}
