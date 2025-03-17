// app/siniestro/page.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowLeft,
  AlertCircle,
  Shield,
  Download,
  ExternalLink,
  Info,
  Car,
  Zap,
  Flame,
  Cloud,
  Droplets,
  GlassWater,
  Wrench,
  Monitor,
  ShieldAlert,
  BarChart2,
  Package,
  Users,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SiniestroPage() {
  const [selectedDamage, setSelectedDamage] = useState<string | null>(null);

  // Función para renderizar las recomendaciones específicas según el tipo de daño
  const renderSpecificRecommendations = () => {
    if (!selectedDamage) return null;

    switch (selectedDamage) {
      case "impacto_vehiculo":
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="flex items-center text-lg font-semibold text-blue-800 mb-4">
              <Car className="h-5 w-5 mr-2" />
              Impacto de vehículo contra las instalaciones
            </h3>
            <p className="mb-4">
              Si hay impacto de vehículo, debes rellenar el parte de
              "Declaración amistosa de accidente".
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button asChild className="flex items-center" variant="outline">
                <a href="/documents/Declaracion-amistosa-de-parte.pdf" download>
                  <Download className="h-4 w-4 mr-2" />
                  Descargar PDF declaración amistosa
                </a>
              </Button>
              <p className="text-sm text-blue-700">
                Rellena cada uno de los apartados, explica concretamente cómo
                fueron los hechos y asegúrate que el conductor firma la
                declaración.
              </p>
            </div>
          </div>
        );

      case "danos_electricos":
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h3 className="flex items-center text-lg font-semibold text-yellow-800 mb-4">
              <Zap className="h-5 w-5 mr-2" />
              Daños eléctricos
            </h3>
            <p>
              Revisa que el equipo afectado esté cubierto en la póliza. Conserva
              los elementos dañados para la inspección del perito. Si es
              posible, obtén un presupuesto de reparación o reemplazo.
            </p>
          </div>
        );

      case "incendio":
        return (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h3 className="flex items-center text-lg font-semibold text-red-800 mb-4">
              <Flame className="h-5 w-5 mr-2" />
              Incendio, caída de rayo, explosión
            </h3>
            <p>
              No manipules la zona afectada hasta que la compañía de seguros
              realice la inspección. Toma fotografías del área dañada desde
              diferentes ángulos.
            </p>
          </div>
        );

      case "viento":
        return (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-8">
            <h3 className="flex items-center text-lg font-semibold text-indigo-800 mb-4">
              <Cloud className="h-5 w-5 mr-2" />
              Lluvia, pedrisco, nieve, viento
            </h3>
            <p className="mb-4">
              Si es viento, revisar si tu póliza establece una limitación de la
              velocidad (80 o 90 Km/h). Si es lluvia, revisar si tu póliza tiene
              una limitación (40 l o m²).
            </p>
            <div className="bg-white rounded p-4 border border-indigo-100">
              <h4 className="flex items-center font-medium text-indigo-800 mb-2">
                <Info className="h-4 w-4 mr-2" />
                Consulta de umbrales de fenómenos meteorológicos
              </h4>
              <p className="text-sm mb-3">
                Puedes consultar si en tu zona se han superado los umbrales de
                fenómenos meteorológicos:
              </p>
              <Button
                asChild
                variant="outline"
                className="text-indigo-700 border-indigo-300 hover:bg-indigo-50"
              >
                <a
                  href="https://www.aemet.es/es/serviciosclimaticos/datosclimatologicos/superacion_umbrales"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  Consultar AEMET
                  <ExternalLink className="h-3 w-3 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        );

      case "agua":
        return (
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6 mb-8">
            <h3 className="flex items-center text-lg font-semibold text-cyan-800 mb-4">
              <Droplets className="h-5 w-5 mr-2" />
              Daños por agua
            </h3>
            <p>
              Localiza el origen de la fuga y toma medidas para detenerla.
              Documenta todos los bienes afectados. Si la fuga proviene de una
              instalación comunitaria, comunícalo a la comunidad.
            </p>
          </div>
        );

      case "cristales":
        return (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
            <h3 className="flex items-center text-lg font-semibold text-purple-800 mb-4">
              <GlassWater className="h-5 w-5 mr-2" />
              Rotura de cristales, lunas o rótulos
            </h3>
            <p>
              Toma fotografías de los daños. Solicita un presupuesto de
              sustitución a un profesional. No retires los restos hasta que la
              compañía lo autorice.
            </p>
          </div>
        );

      case "maquinaria":
        return (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
            <h3 className="flex items-center text-lg font-semibold text-orange-800 mb-4">
              <Wrench className="h-5 w-5 mr-2" />
              Rotura de maquinaria
            </h3>
            <p>
              Mantén la máquina en el estado en que quedó tras la avería.
              Prepara el historial de mantenimiento y la documentación de la
              máquina para el perito.
            </p>
          </div>
        );

      case "informaticos":
        return (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-8">
            <h3 className="flex items-center text-lg font-semibold text-emerald-800 mb-4">
              <Monitor className="h-5 w-5 mr-2" />
              Rotura de equipos informáticos
            </h3>
            <p>
              Si es posible, haz una copia de seguridad de los datos antes de
              cualquier reparación. Conserva las facturas originales de compra
              de los equipos.
            </p>
          </div>
        );

      case "robo":
        return (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h3 className="flex items-center text-lg font-semibold text-red-800 mb-4">
              <ShieldAlert className="h-5 w-5 mr-2" />
              Robo
            </h3>
            <p className="mb-4">
              Si es robo, deberás presentar a la compañía la denuncia penal con
              los elementos sustraídos y los daños donde está la huella o
              explicación. Deberás hacer en la denuncia una relación detallada
              de los objetos sustraídos y daños causados.
            </p>
            <div className="bg-white p-4 rounded border border-red-100">
              <h4 className="font-medium text-red-800 mb-2">Importante:</h4>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>
                  Presenta la denuncia en las 24 horas siguientes al
                  descubrimiento del robo
                </li>
                <li>No toques nada hasta que acuda la policía</li>
                <li>Fotografía los daños en cerraduras, puertas o ventanas</li>
                <li>
                  Prepara un inventario de los bienes sustraídos con su valor
                  aproximado
                </li>
              </ul>
            </div>
          </div>
        );

      case "interrupcion":
        return (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
            <h3 className="flex items-center text-lg font-semibold text-amber-800 mb-4">
              <BarChart2 className="h-5 w-5 mr-2" />
              Interrupción del negocio
            </h3>
            <p>
              Documenta todas las pérdidas económicas causadas por la
              interrupción. Mantén registros detallados de gastos adicionales e
              ingresos perdidos durante el período de inactividad.
            </p>
          </div>
        );

      case "otros":
        return (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
              <Package className="h-5 w-5 mr-2" />
              Otros daños materiales
            </h3>
            <p>
              Documenta detalladamente los daños. Mantén los elementos dañados
              para la inspección. Contacta con la compañía de seguros lo antes
              posible para recibir instrucciones específicas.
            </p>
          </div>
        );

      case "terceros":
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="flex items-center text-lg font-semibold text-blue-800 mb-4">
              <Users className="h-5 w-5 mr-2" />
              Si hay terceros involucrados
            </h3>
            <p>
              Informa a la compañía de seguros inmediatamente si hay terceros
              implicados. No admitas responsabilidad sin consultar primero con
              tu aseguradora. Recoge los datos de contacto de los terceros y
              testigos.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero section */}
      <section className="py-12 px-6 bg-[#F5F2FB]">
        <div className="container mx-auto max-w-4xl">
          <Link
            href="/siniestros"
            className="inline-flex items-center text-[#062A5A] mb-6 hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a tipos de siniestros
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Siniestro en mi empresa
          </h1>

          <div className="h-1 w-24 bg-[#FB2E25] mb-6"></div>

          <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-8">
            <div className="flex">
              <AlertCircle className="h-6 w-6 text-orange-400 mr-3 flex-shrink-0" />
              <p className="text-orange-700">
                Si has tenido un siniestro en tu empresa, selecciona la causa
                del daño para obtener recomendaciones específicas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Selector de tipo de daño */}
      <section className="py-8 px-6 bg-white border-b">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-bold mb-4 text-[#062A5A]">
              Indica la causa de los daños
            </h2>

            <Select onValueChange={(value) => setSelectedDamage(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona el tipo de daño" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="impacto_vehiculo">
                  Impacto de vehículo contra las instalaciones
                </SelectItem>
                <SelectItem value="danos_electricos">
                  Daños eléctricos
                </SelectItem>
                <SelectItem value="incendio">
                  Incendio, caída de rayo, explosión
                </SelectItem>
                <SelectItem value="viento">
                  Lluvia, pedrisco, nieve, viento
                </SelectItem>
                <SelectItem value="agua">Daños por agua</SelectItem>
                <SelectItem value="cristales">
                  Rotura de cristales, lunas o rótulos
                </SelectItem>
                <SelectItem value="maquinaria">Rotura de maquinaria</SelectItem>
                <SelectItem value="informaticos">
                  Rotura de equipos informáticos
                </SelectItem>
                <SelectItem value="robo">Robo</SelectItem>
                <SelectItem value="interrupcion">
                  Interrupción del negocio
                </SelectItem>
                <SelectItem value="otros">Otros daños materiales</SelectItem>
                <SelectItem value="terceros">
                  Si hay terceros involucrados
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Recomendaciones sección */}
      <section className="py-12 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          {selectedDamage ? (
            <>
              <h2 className="text-2xl font-bold mb-8 text-[#062A5A]">
                Recomendaciones para tu siniestro
              </h2>

              {/* Recomendaciones específicas (según selección) */}
              {renderSpecificRecommendations()}

              {/* Recomendaciones generales (siempre visibles cuando hay selección) */}
              <div className="bg-white border rounded-lg shadow-sm p-6 mb-8">
                <h3 className="text-xl font-semibold mb-6 text-[#062A5A]">
                  Cómo proceder en caso de un siniestro
                </h3>

                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h4 className="font-medium mb-3 flex items-center">
                      <span className="bg-[#062A5A] text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
                        1
                      </span>
                      Prueba de los hechos
                    </h4>
                    <ul className="ml-8 space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-[#FB2E25] mr-2">•</span>
                        Haz fotografías de los daños que has tenido
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FB2E25] mr-2">•</span>
                        Conserva las piezas dañadas (siempre que puedas) para
                        que le enseñes el perito de la compañía
                      </li>
                    </ul>
                  </div>

                  <div className="border-b pb-4">
                    <h4 className="font-medium mb-3 flex items-center">
                      <span className="bg-[#062A5A] text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
                        2
                      </span>
                      Valoración de daños
                    </h4>
                    <ul className="ml-8 space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-[#FB2E25] mr-2">•</span>
                        Solicita siempre un presupuesto de reparación
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FB2E25] mr-2">•</span>
                        Es imprescindible tener desglosado el importe de
                        reposición de materiales y piezas y la mano de obra
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FB2E25] mr-2">•</span>
                        En la medida de lo posible, que el reparador indique en
                        su presupuesto la causa del daño
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FB2E25] mr-2">•</span>
                        Si no es urgente, no reparar hasta que no se acepte el
                        siniestro (a veces compañía valora el importe de daños)
                      </li>
                    </ul>
                  </div>

                  <div className="border-b pb-4">
                    <h4 className="font-medium mb-3 flex items-center">
                      <span className="bg-[#062A5A] text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
                        3
                      </span>
                      Reparaciones urgentes
                    </h4>
                    <ul className="ml-8 space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-[#FB2E25] mr-2">•</span>
                        Si debes hacer reparaciones urgentes para evitar mayores
                        daños, deja prueba de los daños con fotografías
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FB2E25] mr-2">•</span>
                        Conserva las facturas con el desglose de materiales y
                        mano de obra
                      </li>
                    </ul>
                  </div>

                  <div className="border-b pb-4">
                    <h4 className="font-medium mb-3 flex items-center">
                      <span className="bg-[#062A5A] text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
                        4
                      </span>
                      Revisa si tienes cobertura en la póliza
                    </h4>
                    <p className="ml-8 text-gray-700">
                      Una vez que has identificado la causa del daño, revisa la
                      póliza para ver si tienes contratada la cobertura que
                      necesitas
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h4 className="font-medium mb-3 flex items-center">
                      <span className="bg-[#062A5A] text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
                        5
                      </span>
                      Revisa la franquicia aplicable para la cobertura
                    </h4>
                    <ul className="ml-8 space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-[#FB2E25] mr-2">•</span>
                        Si tu daño está amparado por una garantía de la póliza,
                        revisa la franquicia que se le aplica
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FB2E25] mr-2">•</span>
                        Si la póliza no tiene garantía específica, significa que
                        no hay franquicia
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FB2E25] mr-2">•</span>
                        Si tu daño está por debajo de franquicia pero tienes
                        dudas, comunica de igual modo el siniestro
                      </li>
                    </ul>
                  </div>

                  <div className="border-b pb-4">
                    <h4 className="font-medium mb-3 flex items-center">
                      <span className="bg-[#062A5A] text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
                        6
                      </span>
                      Comunicación del siniestro
                    </h4>
                    <ul className="ml-8 space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-[#FB2E25] mr-2">•</span>
                        Te contactas con tu mediador o directamente con la
                        compañía para comunicar el siniestro. Tienes 7 días para
                        hacerlo, tu contrato puede hacer después, pero es
                        conveniente hacerlo en plazo (art. 16 de la Ley de
                        Contrato de Seguro)
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FB2E25] mr-2">•</span>
                        Si no lo haces la consecuencia de comunicar el
                        siniestro. La siniestralidad acumulada puede incrementar
                        el coste de tu prima para la siguiente anualidad
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FB2E25] mr-2">•</span>
                        Si te has olvidado renovar la póliza o conseguir una
                        compañía que asegure tu riesgo, es mejor contactar con
                        un asesor para analizar tu caso
                      </li>
                    </ul>
                  </div>

                  <div className="border-b pb-4">
                    <h4 className="font-medium mb-3 flex items-center">
                      <span className="bg-[#062A5A] text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
                        7
                      </span>
                      Contacto con el perito
                    </h4>
                    <ul className="ml-8 space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-[#FB2E25] mr-2">•</span>
                        Espera que el perito contacte contigo para ver la causa
                        de los daños y hacer una valoración
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FB2E25] mr-2">•</span>
                        Facilita toda la documentación que el perito te solicite
                        (fotos, presupuestos, facturas, etc.)
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FB2E25] mr-2">•</span>
                        Si el siniestro es sencillo y de poco importe, la
                        compañía puede no enviar perito
                      </li>
                    </ul>
                  </div>

                  <div className="border-b pb-4">
                    <h4 className="font-medium mb-3 flex items-center">
                      <span className="bg-[#062A5A] text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
                        8
                      </span>
                      Resolución del siniestro
                    </h4>
                    <ul className="ml-8 space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-[#FB2E25] mr-2">•</span>
                        Luego que el perito ha valorado los daños, emitirá un
                        informe y se lo enviará a la compañía para que decida si
                        paga o no
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FB2E25] mr-2">•</span>
                        Recuerda que es la compañía la que decide si paga o no.
                        No el perito. El perito solo emite un informe dando su
                        opinión
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3 flex items-center">
                      <span className="bg-[#062A5A] text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
                        9
                      </span>
                      Resolución del siniestro
                    </h4>
                    <ul className="ml-8 space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-[#FB2E25] mr-2">•</span>
                        Si la compañía estima que lo informado por el perito es
                        correcto, pagará los daños
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FB2E25] mr-2">•</span>
                        Si hay desacuerdo con la compañía, contacta con tu
                        mediador o asesor
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FB2E25] mr-2">•</span>
                        Si entiende que el siniestro no tiene cobertura o está
                        excluido, rehusará el siniestro. Aquí puedes solicitar
                        los fundamentos a la compañía para rebatirlos
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FB2E25] mr-2">•</span>
                        Si la compañía paga un importe menor al que corresponde,
                        puedes (según las circunstancias) iniciar un perito de
                        la contraria, asumir los daños y proceder como la indica
                        el art. 38 de la Ley de Contrato de Seguro
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-blue-50 rounded-full p-6 mb-4">
                <Info className="h-12 w-12 text-blue-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                Selecciona un tipo de daño
              </h3>
              <p className="text-gray-500 text-center max-w-md">
                Para ver recomendaciones específicas, por favor selecciona la
                causa del daño en el menú desplegable superior.
              </p>
            </div>
          )}

          <div className="mt-10 text-center">
            <p className="text-gray-500 mb-3 italic">
              Si tienes cualquier duda o necesitas asistencia adicional
            </p>
            <Button asChild className="bg-[#062A5A] hover:bg-[#051d3e]">
              <Link href="/contacto">
                Contactar con nuestro equipo de expertos
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
