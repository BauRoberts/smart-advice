// app/politica-privacidad/page.tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PoliticaPrivacidad() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-[#062A5A]">
          POLÍTICA DE PRIVACIDAD
        </h1>
        <div className="h-1 w-32 bg-[#FB2E25] mb-8"></div>

        <div className="space-y-8 bg-white p-8 rounded-lg shadow-sm">
          <section>
            <h2 className="text-xl font-bold mb-4">
              1. IDENTIFICACIÓN DEL RESPONSABLE DEL TRATAMIENTO
            </h2>
            <p className="mb-4">
              En cumplimiento con el Reglamento General de Protección de Datos
              (RGPD) y demás normativa aplicable, se informa a los usuarios que
              el responsable del tratamiento de los datos personales recogidos a
              través de esta web es:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Responsable:</strong> Rodrigo Suárez Montes
              </li>
              <li>
                <strong>DNI:</strong> 55626743-R
              </li>
              <li>
                <strong>Correo electrónico:</strong> info@smart-advice.com
              </li>
              <li>
                <strong>Finalidad:</strong> Ofrecer asesoramiento y productos a
                los usuarios de la web
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">
              2. DATOS PERSONALES RECOPILADOS
            </h2>
            <p className="mb-4">
              A través de la web, se podrán recopilar los siguientes datos
              personales:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Nombre y apellidos</strong>
              </li>
              <li>
                <strong>Teléfono de contacto</strong>
              </li>
              <li>
                <strong>Correo electrónico</strong>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">
              3. FINALIDAD DEL TRATAMIENTO
            </h2>
            <p className="mb-4">
              Los datos personales proporcionados serán utilizados con las
              siguientes finalidades:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Facilitar el acceso a los servicios y productos ofrecidos por la
                web.
              </li>
              <li>
                Gestionar consultas y solicitudes realizadas por los usuarios.
              </li>
              <li>
                Enviar comunicaciones comerciales sobre productos o servicios
                ofrecidos, siempre que el usuario no se haya opuesto a este
                tratamiento.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">
              4. BASE LEGAL DEL TRATAMIENTO
            </h2>
            <p className="mb-4">
              El tratamiento de los datos personales se realiza con las
              siguientes bases legales:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Ejecución contractual:</strong> Cuando el tratamiento es
                necesario para la prestación de los servicios solicitados por el
                usuario.
              </li>
              <li>
                <strong>Interés legítimo:</strong> Para el envío de
                comunicaciones comerciales sobre productos y servicios similares
                a los contratados.
              </li>
            </ul>
            <p className="mt-4">
              En cualquier momento, el usuario podrá oponerse al envío de
              comunicaciones comerciales enviando un correo electrónico a
              info@smart-advice.com.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">
              5. PLAZO DE CONSERVACIÓN DE LOS DATOS
            </h2>
            <p>
              Los datos personales serán conservados mientras exista una
              relación con el usuario y, posteriormente, durante el tiempo
              necesario para cumplir con las obligaciones legales aplicables.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">
              6. DESTINATARIOS DE LOS DATOS
            </h2>
            <p>
              Los datos personales no serán cedidos a terceros, salvo obligación
              legal o cuando sea necesario para la prestación de los servicios
              contratados.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">7. DERECHOS DEL USUARIO</h2>
            <p className="mb-4">El usuario tiene derecho a:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Acceder a sus datos personales.</li>
              <li>Solicitar la rectificación de datos inexactos.</li>
              <li>
                Solicitar la supresión de sus datos cuando ya no sean
                necesarios.
              </li>
              <li>
                Oponerse al tratamiento de sus datos con fines comerciales.
              </li>
              <li>Solicitar la portabilidad de sus datos a otro proveedor.</li>
            </ul>
            <p className="mt-4">
              Para ejercer estos derechos, el usuario puede enviar una solicitud
              por correo electrónico a info@smart-advice.com con el asunto
              "Protección de Datos".
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">8. MEDIDAS DE SEGURIDAD</h2>
            <p>
              Se han adoptado las medidas de seguridad necesarias para proteger
              los datos personales contra accesos no autorizados, pérdida o
              manipulación.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">
              9. MODIFICACIONES A LA POLÍTICA DE PRIVACIDAD
            </h2>
            <p>
              Smart Advice se reserva el derecho a modificar esta política para
              adaptarla a cambios normativos o mejoras en los servicios.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
