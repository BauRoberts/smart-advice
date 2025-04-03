import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PoliticaCookies() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-[#062A5A]">
          POLÍTICA DE COOKIES
        </h1>
        <div className="h-1 w-32 bg-[#FB2E25] mb-8"></div>

        <div className="space-y-8 bg-white p-8 rounded-lg shadow-sm">
          <section>
            <h2 className="text-xl font-bold mb-4">1. ¿QUÉ SON LAS COOKIES?</h2>
            <p className="mb-4">
              Las cookies son pequeños archivos que se descargan en su
              dispositivo (ordenador, smartphone, tablet…) cuando accede a un
              sitio web. Su función principal es almacenar o recuperar
              información sobre su navegación, hábitos o dispositivo. Algunas
              cookies son esenciales para el funcionamiento de la web, mientras
              que otras permiten personalizar la experiencia del usuario,
              analizar el tráfico o mostrar publicidad personalizada.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">
              2. TIPOS DE COOKIES UTILIZADAS EN ESTE SITIO WEB
            </h2>
            <p className="mb-4">
              En www.smartadvice.es utilizamos las siguientes categorías de
              cookies:
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">
                  a) Cookies técnicas o necesarias (exentas de consentimiento)
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Permiten la navegación por la página web y el uso de sus
                    funciones básicas.
                  </li>
                  <li>
                    Son necesarias para el funcionamiento del sitio, por lo que
                    no se pueden desactivar.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold">b) Cookies de análisis</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Nos permiten contar visitas y fuentes de tráfico, conocer
                    qué páginas son más o menos populares.
                  </li>
                  <li>
                    Estas cookies nos ayudan a mejorar el rendimiento de la web.
                  </li>
                  <li>
                    Utilizamos servicios como Google Analytics (proveedor:
                    Google LLC).
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold">c) Cookies de personalización</h3>
                <p>
                  Permiten recordar sus preferencias (idioma, configuración
                  regional, tipo de navegador).
                </p>
              </div>

              <div>
                <h3 className="font-semibold">
                  d) Cookies publicitarias o de marketing
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Nos permiten mostrarle anuncios relevantes y personalizados.
                  </li>
                  <li>
                    Ayudan a limitar la frecuencia con la que ve un anuncio y
                    medir su efectividad.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">
              3. ¿QUIÉN UTILIZA LA INFORMACIÓN DE LAS COOKIES?
            </h2>
            <p className="mb-4">
              Algunas cookies son gestionadas por terceros, como:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Google Analytics (Google LLC): análisis de comportamiento de
                navegación.
              </li>
              <li>
                Facebook Pixel (Meta Platforms): remarketing y medición de
                conversiones.
              </li>
              <li>
                LinkedIn Insight Tag: seguimiento de campañas publicitarias.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">
              4. ¿CÓMO PUEDE GESTIONAR SUS PREFERENCIAS?
            </h2>
            <p className="mb-4">
              Al acceder a www.smartadvice.es, se le mostrará un banner de
              cookies que le permite:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Aceptar todas las cookies.</li>
              <li>Rechazar todas salvo las necesarias.</li>
              <li>Configurar su uso por categoría.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">
              5. ¿CÓMO PUEDE ELIMINAR LAS COOKIES DESDE SU NAVEGADOR?
            </h2>
            <p className="mb-4">
              Puede configurar su navegador para bloquear o eliminar las
              cookies. A continuación, enlaces con instrucciones para los
              navegadores más comunes:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <a
                  href="https://support.google.com/chrome/answer/95647"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Chrome
                </a>
              </li>
              <li>
                <a
                  href="https://support.mozilla.org/es/kb/Borrar%20cookies"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a
                  href="https://support.apple.com/es-es/guide/safari/sfri11471/mac"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Safari
                </a>
              </li>
              <li>
                <a
                  href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Microsoft Edge
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">
              6. ACTUALIZACIÓN DE ESTA POLÍTICA DE COOKIES
            </h2>
            <p className="mb-4">
              Esta política puede actualizarse en función de cambios normativos
              o técnicos. Le recomendamos revisarla periódicamente.
            </p>
            <p className="text-sm text-gray-600">
              Última actualización: marzo 2025
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
