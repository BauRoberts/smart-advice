// components/forms/steps/ServiciosFormStep.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import FormLayout from "@/components/layout/FormLayout";
import { useFormContext } from "@/contexts/FormContext";
import { useState } from "react";

// Schema actualizado para servicios
const serviciosSchema = z.object({
  trabajos_fuera_instalaciones: z.boolean().default(false),
  corte_soldadura: z.boolean().default(false),
  trabajo_equipos_electronicos: z.boolean().default(false),
  empleados_tecnicos: z.boolean().default(false),
  trabajos_subcontratistas: z.boolean().default(false),
  afecta_edificios_vecinos: z.boolean().default(false),
  afecta_instalaciones_subterraneas: z.boolean().default(false),
  trabajos_bienes_preexistentes: z.boolean().default(false),
});

// Tipo para los datos de servicios
export type ServiciosFormData = z.infer<typeof serviciosSchema>;

interface ServiciosFormStepProps {
  onNext: () => void;
  onBack: () => void;
  defaultValues?: Partial<ServiciosFormData>;
}

export default function ServiciosFormStep({
  onNext,
  onBack,
  defaultValues = {},
}: ServiciosFormStepProps) {
  const { dispatch } = useFormContext();

  // Inicializar el formulario con React Hook Form
  const form = useForm<ServiciosFormData>({
    resolver: zodResolver(serviciosSchema),
    defaultValues: {
      trabajos_fuera_instalaciones: false,
      corte_soldadura: false,
      trabajo_equipos_electronicos: false,
      empleados_tecnicos: false,
      trabajos_subcontratistas: false,
      afecta_edificios_vecinos: false,
      afecta_instalaciones_subterraneas: false,
      trabajos_bienes_preexistentes: false,
      ...defaultValues,
    },
  });

  // Estado para manejar las selecciones
  const [selectedOptions, setSelectedOptions] = useState({
    trabajos_fuera_instalaciones:
      defaultValues.trabajos_fuera_instalaciones || false,
    corte_soldadura: defaultValues.corte_soldadura || false,
    trabajo_equipos_electronicos:
      defaultValues.trabajo_equipos_electronicos || false,
    empleados_tecnicos: defaultValues.empleados_tecnicos || false,
    trabajos_subcontratistas: defaultValues.trabajos_subcontratistas || false,
    afecta_edificios_vecinos: defaultValues.afecta_edificios_vecinos || false,
    afecta_instalaciones_subterraneas:
      defaultValues.afecta_instalaciones_subterraneas || false,
    trabajos_bienes_preexistentes:
      defaultValues.trabajos_bienes_preexistentes || false,
  });

  // Función para alternar la selección de una opción
  const toggleOption = (option: keyof ServiciosFormData) => {
    setSelectedOptions((prev) => {
      const updated = {
        ...prev,
        [option]: !prev[option],
      };

      // Actualizar el formulario para mantener sincronia
      form.setValue(option, updated[option]);

      return updated;
    });
  };

  // Manejar el envío del formulario
  function onSubmit(data: ServiciosFormData) {
    dispatch({ type: "SET_ACTIVIDAD_SERVICIOS", payload: data });
    onNext();
  }

  // Verificar si hay trabajos fuera de instalaciones
  const haceTrabajosExternos = selectedOptions.trabajos_fuera_instalaciones;

  return (
    <FormLayout
      title="Información de servicios"
      subtitle="Detalles sobre el tipo de servicios que ofrece tu empresa"
      currentStep={4}
      totalSteps={6}
      onNext={form.handleSubmit(onSubmit)}
      onBack={onBack}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Título con instrucciones */}
          <div className="mb-4">
            <p className="text-base font-medium text-gray-700">
              Selecciona las opciones que correspondan:
            </p>
          </div>

          {/* Tarjetas seleccionables */}
          <div className="space-y-4">
            {/* Tarjeta: Trabajos fuera de instalaciones */}
            <div
              className={`border rounded-md p-4 cursor-pointer transition-all ${
                selectedOptions.trabajos_fuera_instalaciones
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => toggleOption("trabajos_fuera_instalaciones")}
            >
              <div className="flex items-start">
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                    selectedOptions.trabajos_fuera_instalaciones
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedOptions.trabajos_fuera_instalaciones && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 text-white"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-1">
                    Trabajos fuera de las instalaciones o en casa de terceros o
                    clientes
                  </p>
                  <p className="text-sm text-gray-600">
                    Tus empleados trabajan en lugares distintos a tus propias
                    instalaciones
                  </p>
                </div>
              </div>
            </div>

            {/* Preguntas condicionales para trabajos externos */}
            {haceTrabajosExternos && (
              <div className="pl-6 border-l-2 border-gray-200 space-y-4">
                {/* Trabajos que afectan edificios vecinos */}
                <div
                  className={`border rounded-md p-4 cursor-pointer transition-all ${
                    selectedOptions.afecta_edificios_vecinos
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => toggleOption("afecta_edificios_vecinos")}
                >
                  <div className="flex items-start">
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                        selectedOptions.afecta_edificios_vecinos
                          ? "bg-blue-500 border-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedOptions.afecta_edificios_vecinos && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4 text-white"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-1">
                        ¿Realizas trabajos que puedan afectar edificios,
                        terrenos o estructuras vecinas?
                      </p>
                    </div>
                  </div>
                </div>

                {/* Instalaciones subterráneas */}
                <div
                  className={`border rounded-md p-4 cursor-pointer transition-all ${
                    selectedOptions.afecta_instalaciones_subterraneas
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() =>
                    toggleOption("afecta_instalaciones_subterraneas")
                  }
                >
                  <div className="flex items-start">
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                        selectedOptions.afecta_instalaciones_subterraneas
                          ? "bg-blue-500 border-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedOptions.afecta_instalaciones_subterraneas && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4 text-white"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-1">
                        ¿Realizas trabajos que puedan afectar tuberías, cables
                        eléctricos, gasoductos, alcantarillado u otras
                        infraestructuras subterráneas o aéreas ajenas?
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bienes preexistentes */}
                <div
                  className={`border rounded-md p-4 cursor-pointer transition-all ${
                    selectedOptions.trabajos_bienes_preexistentes
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => toggleOption("trabajos_bienes_preexistentes")}
                >
                  <div className="flex items-start">
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                        selectedOptions.trabajos_bienes_preexistentes
                          ? "bg-blue-500 border-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedOptions.trabajos_bienes_preexistentes && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4 text-white"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-1">
                        ¿Quieres cubrir los daños o perjuicios ocasionados a los
                        bienes inmuebles y/o instalaciones de terceros
                        existentes, antes de que comiences tu primera actuación
                        en la obra donde se ejecuten los trabajos?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tarjeta: Corte y soldadura */}
            <div
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedOptions.corte_soldadura
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => toggleOption("corte_soldadura")}
            >
              <div className="flex items-start">
                <div
                  className={`w-6 h-6 rounded-md border flex items-center justify-center mr-3 ${
                    selectedOptions.corte_soldadura
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedOptions.corte_soldadura && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 text-white"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-1">
                    Trabajos de corte y soldadura
                  </p>
                  <p className="text-sm text-gray-600">
                    Uso de herramientas o equipos para cortar o soldar
                    materiales
                  </p>
                </div>
              </div>
            </div>

            {/* Tarjeta: Equipos electrónicos */}
            <div
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedOptions.trabajo_equipos_electronicos
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => toggleOption("trabajo_equipos_electronicos")}
            >
              <div className="flex items-start">
                <div
                  className={`w-6 h-6 rounded-md border flex items-center justify-center mr-3 ${
                    selectedOptions.trabajo_equipos_electronicos
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedOptions.trabajo_equipos_electronicos && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 text-white"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-1">
                    Trabajo sobre aparatos o equipos electrónicos
                  </p>
                  <p className="text-sm text-gray-600">
                    Tu empresa repara, manipula o instala equipos electrónicos
                  </p>
                </div>
              </div>
            </div>

            {/* Tarjeta: Empleados técnicos */}
            <div
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedOptions.empleados_tecnicos
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => toggleOption("empleados_tecnicos")}
            >
              <div className="flex items-start">
                <div
                  className={`w-6 h-6 rounded-md border flex items-center justify-center mr-3 ${
                    selectedOptions.empleados_tecnicos
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedOptions.empleados_tecnicos && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 text-white"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-1">
                    Empleados técnicos/profesionales en plantilla
                  </p>
                  <p className="text-sm text-gray-600">
                    Trabajadores con formación técnica especializada o títulos
                    profesionales
                  </p>
                </div>
              </div>
            </div>

            {/* Tarjeta: Subcontratistas */}
            <div
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedOptions.trabajos_subcontratistas
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => toggleOption("trabajos_subcontratistas")}
            >
              <div className="flex items-start">
                <div
                  className={`w-6 h-6 rounded-md border flex items-center justify-center mr-3 ${
                    selectedOptions.trabajos_subcontratistas
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedOptions.trabajos_subcontratistas && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 text-white"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-1">
                    ¿Subcontratas a otras personas o empresas para realizar
                    trabajos?
                  </p>
                  <p className="text-sm text-gray-600">
                    Contratas a terceros para realizar parte de tus servicios o
                    proyectos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </FormLayout>
  );
}
