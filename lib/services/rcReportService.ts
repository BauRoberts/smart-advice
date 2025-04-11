// lib/services/rcReportService.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Color, FontStyle } from "jspdf-autotable";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    } | null;
  }
}

// Definir tipos para colores como tuplas
type RGB = [number, number, number];

// Colores corporativos como tuplas RGB
const COLORS = {
  primary: [6, 42, 90] as RGB, // #062A5A
  secondary: [251, 46, 37] as RGB, // #FB2E25
  text: [55, 65, 81] as RGB, // text-gray-700
  lightGray: [243, 244, 246] as RGB, // bg-gray-100
  warningBg: [255, 243, 205] as RGB, // Fondo para notas importantes
  warningText: [133, 100, 4] as RGB, // Texto para notas importantes
};

// Formatea un número como moneda
function formatCurrency(value?: number): string {
  if (value === undefined || value === null) return "N/A";
  return (
    new Intl.NumberFormat("es-ES", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value) + "€"
  );
}

// Determinar límites de RC según facturación
function determineLimitsRC(billingAmount?: number): {
  generalLimit: string;
  victimSubLimit: string;
} {
  if (!billingAmount) {
    return { generalLimit: "600.000€", victimSubLimit: "450.000€" };
  }

  if (billingAmount < 1000000) {
    return { generalLimit: "600.000€", victimSubLimit: "450.000€" };
  } else if (billingAmount <= 3000000) {
    return { generalLimit: "1.000.000€", victimSubLimit: "600.000€" };
  } else if (billingAmount <= 10000000) {
    return { generalLimit: "2.000.000€", victimSubLimit: "600.000€" };
  } else {
    return { generalLimit: "3.000.000€", victimSubLimit: "900.000€" };
  }
}

// Función para cargar la imagen del logo
// Función para añadir el logo a cada página

export const generateRCInsuranceReport = async (
  recommendation: any,
  downloadFile: boolean = false
) => {
  try {
    // Crear documento PDF
    const doc = new jsPDF();
    let currentY = 30; // Iniciar más abajo para dejar espacio al logo
    const leftMargin = 20;
    const pageWidth = doc.internal.pageSize.width;
    const rightMargin = pageWidth - leftMargin;

    // Función para añadir el logo a cada página
    // Función para añadir el logo a cada página (dentro de generateRCInsuranceReport)
    const addLogoToPage = () => {
      try {
        // En Next.js, las rutas públicas se acceden sin el prefijo "/public"
        const logoUrl = "/images/smart-advice-logo.png";

        // Crear una imagen para obtener las dimensiones reales
        const img = new Image();
        img.src = logoUrl;

        // Esperar a que la imagen se cargue para obtener sus dimensiones
        return new Promise<void>((resolve) => {
          img.onload = () => {
            const imgWidth = img.naturalWidth;
            const imgHeight = img.naturalHeight;

            // Definir el ancho máximo deseado para el logo (reducido de 30 a 20)
            const maxWidth = 10; // Reducimos el tamaño del logo
            const aspectRatio = imgWidth / imgHeight;

            // Calcular el alto proporcional para mantener la relación de aspecto
            const calculatedHeight = maxWidth / aspectRatio;

            // Posicionar el logo en la esquina superior izquierda con las dimensiones ajustadas
            doc.addImage(
              logoUrl,
              "PNG",
              leftMargin,
              10,
              maxWidth,
              calculatedHeight
            );
            resolve();
          };

          img.onerror = () => {
            console.error("Error al cargar el logo");
            // Plan B: usar texto si la imagen falla
            doc.setFontSize(10);
            doc.setTextColor(...COLORS.primary);
            doc.text("SMART ADVICE", leftMargin, 15);
            resolve();
          };
        });
      } catch (error) {
        console.error("Error al añadir logo:", error);
        // Plan B: usar texto si la imagen falla
        doc.setFontSize(10);
        doc.setTextColor(...COLORS.primary);
        doc.text("SMART ADVICE", leftMargin, 15);
      }
    };

    // Añadir logo a la primera página
    // Añadir logo a la primera página
    await addLogoToPage();

    // Funciones helper
    const addTitle = (text: string, size = 16, bold = true) => {
      checkPageBreak(15);
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(size);
      doc.setTextColor(...COLORS.primary);
      doc.text(text, leftMargin, currentY);
      currentY += 8;
    };

    const addText = (text: string, fontSize = 10) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(fontSize);
      doc.setTextColor(...COLORS.text);
      const splitText = doc.splitTextToSize(text, pageWidth - 40);
      checkPageBreak(splitText.length * 6);
      doc.text(splitText, leftMargin, currentY);
      currentY += splitText.length * 6;
    };

    const addBulletPoint = (text: string) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.text);

      // Crear el punto de la lista
      doc.text("●", leftMargin, currentY);

      // Texto con un poco de sangría
      const bulletIndent = 5;
      const splitText = doc.splitTextToSize(
        text,
        pageWidth - 40 - bulletIndent
      );
      doc.text(splitText, leftMargin + bulletIndent, currentY);

      currentY += splitText.length * 6;
    };

    const addImportantNote = (text: string) => {
      checkPageBreak(20);

      // Configurar el estilo del texto
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.primary);

      // Crear un pequeño círculo amarillo en lugar del emoji de bombilla
      doc.setFillColor(255, 204, 0); // Color amarillo para el círculo
      doc.circle(leftMargin + 2, currentY - 2, 2, "F");

      // Añadir el texto importante con sangría
      const noteIndent = 7;
      const maxWidth = pageWidth - 40 - noteIndent;
      doc.text("Importante:", leftMargin + noteIndent, currentY);

      // Cambiar a texto normal para el contenido
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...COLORS.text);

      const splitText = doc.splitTextToSize(text, maxWidth);
      currentY += 6; // Espacio después de "Importante:"
      doc.text(splitText, leftMargin + noteIndent, currentY);
      currentY += splitText.length * 6 + 4; // Añadir espacio después de la nota
    };

    const checkPageBreak = async (requiredSpace: number) => {
      if (currentY + requiredSpace > doc.internal.pageSize.height - 20) {
        doc.addPage();
        currentY = 30; // Ajustar para dejar espacio al logo
        await addLogoToPage(); // Añadir logo a la nueva página
      }
    };

    // TÍTULO PRINCIPAL
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.primary);
    doc.text(
      "INFORME DE SEGURO DE RESPONSABILIDAD CIVIL GENERAL",
      pageWidth / 2,
      currentY,
      { align: "center" }
    );
    currentY += 15;

    // INTRODUCCIÓN
    addText(
      "El Seguro de Responsabilidad Civil es un contrato suscrito con una compañía de Seguros que protege al asegurado frente a reclamaciones derivadas de daños personales, materiales o perjuicios económicos causados involuntariamente a terceros en el ejercicio de tu actividad empresarial."
    );
    currentY += 4;

    addText(
      "Su principal función es pagarle a estos terceros perjudicados el importe de indemnización que te reclamen y los gastos de defensa que tu tengas que asumir para defenderte, evitando que asumas estos costes con tu propio patrimonio."
    );
    currentY += 6;

    // PARA QUÉ SIRVE
    addTitle("¿Para qué sirve?", 12);

    addText(
      "Este seguro actúa como un respaldo financiero y jurídico ante situaciones en las que el asegurado sea declarado responsable de un daño a terceros, ya sea por una acción directa, omisión o negligencia en el desarrollo de su actividad."
    );
    currentY += 4;

    addText(
      "Puedes ser responsable tanto de los daños que tu cometas de manera indirecta, como los que comentan tus dependientes (responsabilidad indirecta) o el inmueble de tu propiedad (responsabilidad por la propiedad de bienes)."
    );
    currentY += 4;

    addText(
      "Además, en muchos sectores es un requisito obligatorio para operar dentro del marco legal vigente."
    );
    currentY += 6;

    // DATOS GENERALES DEL SEGURO
    addTitle("Datos generales de tu seguro", 12);

    // Preparar los datos de la empresa
    const companyName = recommendation.companyInfo.name || "";
    const companyAddress = recommendation.companyInfo.address || "";
    const companyCIF = recommendation.companyInfo.cif || "";

    // Preparar actividad
    let actividadDescripcion = "";
    if (recommendation.companyInfo.manufactures)
      actividadDescripcion += "Fabricación";
    if (recommendation.companyInfo.markets) {
      if (actividadDescripcion) actividadDescripcion += " y/o ";
      actividadDescripcion += "Comercialización";
    }
    if (recommendation.companyInfo.diseno) {
      if (actividadDescripcion) actividadDescripcion += " y/o ";
      actividadDescripcion += "Diseño";
    }
    if (recommendation.companyInfo.almacenamiento) {
      if (actividadDescripcion) actividadDescripcion += " y/o ";
      actividadDescripcion += "Almacenamiento";
    }
    if (recommendation.companyInfo.provides_services) {
      if (actividadDescripcion) actividadDescripcion += " y/o ";
      actividadDescripcion += "Prestación de servicios";
    }

    if (
      actividadDescripcion &&
      recommendation.companyInfo.product_service_types
    ) {
      actividadDescripcion += ` de ${recommendation.companyInfo.product_service_types}`;
    }

    if (actividadDescripcion && recommendation.companyInfo.industry_types) {
      actividadDescripcion += ` para el sector de ${recommendation.companyInfo.industry_types}`;
    }

    // Si no se ha construido una descripción específica, usar la descripción general
    if (!actividadDescripcion) {
      actividadDescripcion =
        recommendation.companyInfo.activityDescription ||
        recommendation.companyInfo.activity ||
        "";
    }

    // Añadir datos de la empresa
    addText(`Tomador: ${companyName}`);
    addText(`Dirección: ${companyAddress}`);
    addText(`Actividad cubierta: ${actividadDescripcion}`);

    // Añadir nota importante sobre actividad
    addImportantNote(
      "tu actividad debe estar bien definida y constar en póliza. Todo lo que haces debe quedar reflejado en el seguro. Si realizas una actividad que no has dejado constancia en el seguro, no tendrás cobertura en caso de siniestro."
    );
    currentY += 4;

    // Añadir facturación
    const facturacion = formatCurrency(recommendation.companyInfo.billing);
    addText(`Facturación ${facturacion}`);

    addText(
      "La facturación es la base de cálculo de la prima. A mayor facturación, mayor prima. Al inicio del periodo de seguro, tendrás que informarle a la compañía la facturación que tienes prevista para esa anualidad. Al final del periodo de seguro, deberás informarle a la compañía la facturación real que has tenido en ese periodo de seguro (generalmente esto se debe informar dentro de los primeros 30 ó 60 días de producido el vencimiento de la anualidad de la póliza)."
    );
    currentY += 6;

    // Añadir nota importante sobre infraseguro
    addImportantNote(
      "Es necesario que cumplas con este deber de información para evitar el infraseguro (Artículo 30 de la Ley 50/1980, de 8 de octubre, de Contrato de Seguro). A mayor facturación pagarás más prima, ya que la prima se calcula en un tanto pro mil de la facturación."
    );
    currentY += 4;

    addText(
      "Actualización de prima: Al inicio del periodo de seguro, deberás indicarle a la compañía la cifra de facturación que estimas tener para el periodo de seguro que vas a comenzar. Si es mayor al que tuviste la anualidad anterior, pagarás probablemente más prima. Si es inferior, la prima probablemente se reduzca."
    );
    currentY += 4;

    addText(
      'Regularización de prima: La mayoría de compañías establecen en sus contratos que la prima es "regularizable". Esto significa que al final del periodo se comparan los valores reales con los estimados y:'
    );
    currentY += 4;

    // Añadir bullet points para la regularización
    addBulletPoint(
      "Si la facturación habida del periodo fue mayor a la informada, deberás pagar una cantidad adicional y proporcional."
    );
    addBulletPoint(
      "Si la facturación habida del periodo es menor a la informada, no hay devolución de prima porque la prima pagada es una prima mínima y en depósito."
    );
    currentY += 2;

    // Añadir nota importante sobre la póliza regularizable
    addImportantNote(
      "si la póliza es regularizable, es mejor que la estimación de facturación al inicio de la anualidad la hagas a la baja y en su caso, que pagues el proporcional de prima si resulta estar por encima de lo previsto (ya que si facturas menos de lo previsto no se extornará prima)."
    );
    currentY += 4;

    // Información de asegurado adicional (si no es propietario)
    if (
      recommendation.companyInfo.installations_type === "No propietario" &&
      recommendation.companyInfo.owner_name
    ) {
      addText(
        `Asegurado adicional: Se hace constar como asegurado adicional en calidad de propietario de las instalaciones al Sr. y/o empresa ${
          recommendation.companyInfo.owner_name
        } con NIF/DNI ${
          recommendation.companyInfo.owner_cif || "No especificado"
        }.`
      );
      addText(
        "Es importante que hagas constar al propietario del inmueble como asegurado adicional si quieres que la compañía le cubra a éste cuando el inmueble ocasione un daño a un tercero. Muchas veces, esta necesidad de asegurarlo consta en el contrato de alquiler de la nave."
      );

      addImportantNote(
        "revisa bien el contrato de alquiler de tu nave y si el propietario te ha solicitado que lo incluyas como asegurado a los efecto de la responsabilidad civil, dile a la compañía que te lo haga constar. Esto no suele tener coste adicional de prima y puedes solicitar un certificado de seguro para entregarle al propietario y demostrar que has cumplido con tu obligación contractual."
      );
      currentY += 4;
    }

    // GARANTÍAS A CONTRATAR
    addTitle("Garantías a contratar", 12);

    // Determinar límites basados en facturación
    const { generalLimit, victimSubLimit } = determineLimitsRC(
      recommendation.companyInfo.billing
    );

    // Responsabilidad civil por explotación (siempre incluida)
    addText(
      `Responsabilidad civil por explotación con límite de ${generalLimit}`
    );
    addText(
      "Cubre los daños que puedas causar a terceros en el desarrollo y explotación de tu actividad empresarial."
    );
    addText(
      "Ejemplo: un incendio en la nave daña a la propiedad de los colindantes."
    );
    currentY += 4;

    // Responsabilidad civil Patronal (si tiene empleados)
    if (recommendation.companyInfo.employees_number > 1) {
      addText(
        `Responsabilidad civil Patronal con límite de ${generalLimit} y sublímite de víctima patronal por ${victimSubLimit}`
      );
      addText(
        "Cubre la responsabilidad del asegurado frente a reclamaciones por accidentes laborales sufridos por sus empleados."
      );
      addImportantNote(
        "procura tener límites y sublímites altos de cobertura para accidentes de trabajo, ya que la jurisprudencia viene incrementando de manera muy significativa el importe de las indemnizaciones a pagar."
      );
      addText(
        "Ejemplo: Un trabajador cae de una escalera en una obra y demanda a la empresa."
      );
      currentY += 4;
    }

    // Responsabilidad civil por contaminación Accidental
    if (
      recommendation.coberturas_solicitadas?.coberturas_adicionales
        ?.cover_accidental_contamination
    ) {
      addText(
        `Responsabilidad civil por contaminación Accidental con límite de ${generalLimit}`
      );
      addText(
        "Cubre daños a terceros por contaminación imprevista generada por la actividad asegurada."
      );
      addText("Ejemplo: Un derrame de productos químicos contamina un río.");
      addText(
        "No se cubre la contaminación gradual y progresiva. Para ello, deberás contratar una póliza medioambiental."
      );
      addImportantNote(
        "debes tener en cuenta que en materia de daños ambientales existen numerosas leyes que exigen a las empresas constituir una Garantía Financiera Obligatoria (GFO) para poder responder ante los daños que se causen. Una de las formas de dar cumplimiento a esta obligación legal es a través de la contratación de un seguro."
      );
      currentY += 4;
    }

    // Responsabilidad civil Inmobiliaria (si es propietario)
    if (recommendation.companyInfo.installations_type === "Propietario") {
      addText(
        `Responsabilidad civil Inmobiliaria con límite de ${generalLimit}`
      );
      addText(
        "Protege contra los daños causados a terceros debido a la propiedad o uso de inmuebles."
      );
      addText(
        "Ejemplo: Un desprendimiento de fachada de un edificio asegurado daña un coche estacionado."
      );
      currentY += 4;
    }

    // Responsabilidad civil Locativa (si no es propietario)
    if (recommendation.companyInfo.installations_type === "No propietario") {
      addText(
        "Responsabilidad civil Locativa. Sublimite sugerido: de 300.000€ a 1.200.000€ dependiendo el valor del inmueble alquilado."
      );
      addText(
        "Cubre los daños que el asegurado pueda causar al inmueble que ocupa en régimen de arrendamiento."
      );
      addText(
        "Ejemplo: Un incendio en la oficina alquilada daña las instalaciones del propietario."
      );
      currentY += 4;
    }

    // Responsabilidad civil cruzada y subsidiaria (si subcontrata)
    if (recommendation.actividad?.servicios?.subcontrata_personal) {
      addText("Responsabilidad civil cruzada y subsidiaria. Incluida.");
      addText(
        "Subsidiaria: Protege al asegurado si un tercero (subcontratista, autónomo, etc.) causa daños y no puede responder por insolvencia o falta de seguro."
      );
      addText(
        "Ejemplo: Un subcontratista de limpieza causa daños en una oficina y no tiene seguro y no puede pagar el daño que ha causado."
      );
      addText(
        "Cruzada: Protege al asegurado en caso de daños personales entre empleados de diferentes contratistas o subcontratistas en una misma obra o proyecto."
      );
      addText(
        "Ejemplo: Un empleado de una empresa eléctrica se lesiona debido a la negligencia de una empresa de andamios en la misma obra."
      );
      currentY += 4;
    }

    // Responsabilidad civil por productos (si fabrica, diseña, comercializa o almacena)
    if (
      recommendation.companyInfo.manufactures ||
      recommendation.companyInfo.markets ||
      recommendation.companyInfo.diseno ||
      recommendation.companyInfo.almacenamiento
    ) {
      addText(
        `Responsabilidad civil por productos y post-trabajos con límite de ${generalLimit}`
      );
      addText(
        "Cubre daños causados por productos defectuosos o trabajos ya finalizados."
      );
      addText(
        "Ejemplo: Un electrodoméstico vendido por la empresa provoca un cortocircuito y quema una casa."
      );
      currentY += 4;
    }

    // Responsabilidad civil por unión y mezcla (si es producto intermedio)
    if (
      recommendation.actividad?.manufactura?.producto_intermedio_final ===
        "intermedio" ||
      (recommendation.actividad?.manufactura &&
        recommendation.actividad.manufactura.producto_intermedio_final ===
          "intermedio")
    ) {
      addText(
        "Responsabilidad civil por unión y mezcla. Limite Sugerido: entre 100.000€ a 600.000€."
      );
      addText(
        "La cobertura de Unión y Mezcla protege al asegurado frente a reclamaciones por daños ocasionados cuando su producto se incorpora, mezcla o transforma en otro bien, y posteriormente se detecta un defecto que afecta al producto final."
      );
      currentY += 4;
    }

    // Gastos de retirada (si es consumo humano)
    if (
      recommendation.actividad?.manufactura?.producto_consumo_humano === true ||
      (recommendation.actividad?.manufactura &&
        recommendation.actividad.manufactura.producto_consumo_humano === true)
    ) {
      addText("Gastos de retirada. Límite sugerido entre 100.000€ y 600.000€");
      addText(
        "Cubre al asegurado los costes de retirada de productos defectuosos del mercado."
      );
      addText(
        "Ejemplo: Una empresa debe retirar del mercado una partida de alimentos contaminados."
      );
      addText(
        "Muchas compañías exigen que para que la cobertura sea operativa, exista una orden de la autoridad de aplicación de retirada del producto por riesgo a la seguridad o sanidad. Sin embargo, otras compañías pagan estos costes sin que exista tal orden gubernamental, pero se debe probar que el producto era riesgoso para la salud o la seguridad de las personas."
      );
      addText(
        "La cobertura no cubre los extra-costes de producción que tengas, sólo los costes de recogida del producto y en su caso, de destrucción."
      );
      addImportantNote(
        "revisa esta cobertura en tu póliza y presta atención a estos dos puntos indicados."
      );
      currentY += 4;
    }

    // Responsabilidad civil de técnicos en plantilla
    if (
      recommendation.coberturas_solicitadas?.coberturas_adicionales
        ?.has_contracted_professionals
    ) {
      addText(
        `Responsabilidad civil de técnicos en plantilla con límite de ${generalLimit}`
      );
      addText(
        "Cubre la responsabilidad profesional de técnicos y profesionales empleados por la empresa."
      );
      addText(
        "Ejemplo: Un ingeniero en plantilla comete un error en un cálculo estructural y causa daños."
      );
      currentY += 4;
    }

    // Responsabilidad Civil Daños a conducciones
    if (
      recommendation.actividad?.servicios?.trabajos_afectan_infraestructuras
    ) {
      addText(
        `Responsabilidad Civil Daños a conducciones con límite de ${generalLimit}`
      );
      addText(
        "Cubre daños accidentales a tuberías, cables o infraestructuras subterráneas/aéreas."
      );
      addText("Ejemplo: Una excavadora rompe una tubería de gas.");
      currentY += 4;
    }

    // Daños a Colindantes
    if (recommendation.actividad?.servicios?.trabajos_afectan_edificios) {
      addText(`Daños a Colindantes con límite de ${generalLimit}`);
      addText(
        "Cubre daños accidentales causados a propiedades vecinas por la actividad asegurada."
      );
      addText(
        "Ejemplo: Un edificio vecino sufre grietas debido a excavaciones en una obra."
      );
      currentY += 4;
    }

    // Responsabilidad Civil Daños a Objetos Confiados
    if (
      recommendation.coberturas_solicitadas?.coberturas_adicionales
        ?.stores_third_party_goods
    ) {
      addText(
        "Responsabilidad Civil Daños a Objetos Confiados y/o Custodiados. Limite sugerido: entre 150.000€ a 600.000€ dependiendo del valor de los bienes custodiados"
      );
      addText(
        "Cubre daños a bienes de terceros que el asegurado tiene en su poder para reparación o almacenamiento."
      );
      addText(
        "Ejemplo: Un taller de reparación daña accidentalmente un ordenador de un cliente."
      );
      currentY += 4;
    }

    // Cobertura de ferias
    if (
      recommendation.coberturas_solicitadas?.coberturas_adicionales
        ?.participates_in_fairs
    ) {
      addText(
        "Cobertura de responsabilidad sobre ferias y exposiciones. Incluida."
      );
      addText(
        "Cubre los daños a terceros durante la participación del asegurado en eventos y exposiciones."
      );
      addText(
        "Ejemplo: Un stand de la empresa se derrumba y lesiona a un visitante en una feria comercial."
      );
      addImportantNote(
        "esta cobertura no cubre los bienes que llevas a la feria, ni el transporte ni el montaje y desmontaje de ellos. Si quieres cubrir estos bienes, debes recurrir a una o más pólizas específicas (ej. póliza de transportes, de montaje, etc.)."
      );
      currentY += 4;
    }

    // Daños a bienes Preexistentes
    if (recommendation.actividad?.servicios?.cubre_preexistencias) {
      addText(
        `Daños a bienes Preexistentes con límite de ${generalLimit}. Excluyéndose en cualquier caso los daños a aquella parte específica dónde trabaja el asegurado`
      );
      addText(
        "La cobertura de Daños a Bienes Preexistentes protege al asegurado frente a reclamaciones por daños accidentales causados a estructuras, instalaciones o bienes que ya existían antes del inicio de su actividad en un proyecto o trabajo."
      );
      addText(
        "No se cubren los daños ocasionados al propio bien trabajado o sobre el cual recaen los trabajos."
      );
      currentY += 4;
    }

    // Responsabilidad Civil Daños a vehículos
    if (
      recommendation.coberturas_solicitadas?.coberturas_adicionales
        ?.third_party_vehicles_parked
    ) {
      addText(
        "Responsabilidad Civil Daños a vehículos de terceros dentro de instalaciones. Incluida."
      );
      addText(
        "Protege en caso de daños a coches de clientes o visitantes dentro del recinto asegurado."
      );
      addText(
        "Ejemplo: Un portón automático de un parking daña un coche estacionado."
      );
      currentY += 4;
    }

    // Daños al receptor de energía
    if (recommendation.companyInfo.placas_venta_red) {
      addText(`Daños al receptor de la energía con límite de ${generalLimit}`);
      addText(
        "Esta cobertura protege al asegurado frente a reclamaciones por daños materiales y perjuicios consecuenciales sufridos por los clientes o usuarios que reciben energía suministrada por él."
      );
      addText(
        "Si la energía suministrada por el asegurado (ya sea eléctrica, térmica, solar, etc.) falla, se altera o se interrumpe y esto causa daños en equipos, instalaciones o pérdidas económicas, la cobertura responde ante dichas reclamaciones."
      );
      currentY += 4;
    }

    // Daños a bienes de empleados
    if (
      recommendation.coberturas_solicitadas?.coberturas_adicionales
        ?.cover_employee_damages
    ) {
      addText(
        "Daños a bienes de empleados. Limite sugerido: entre 30.000€ a 150.000€."
      );
      addText(
        "Cubre daños a pertenencias de los empleados dentro del lugar de trabajo."
      );
      addText(
        "Ejemplo: Un incendio en la oficina destruye los ordenadores personales de los empleados."
      );
      currentY += 4;
    }

    // Perjuicios patrimoniales puros
    if (
      recommendation.coberturas_solicitadas?.coberturas_adicionales
        ?.cover_material_damages
    ) {
      addText(
        "Perjuicios patrimoniales puros. Límite sugerido 100.000€ a 300.000€"
      );
      addText(
        "Cubre pérdidas económicas directas sufridas por terceros sin que haya un daño material o personal previo."
      );
      addText(
        "Ejemplo: Un fallo eléctrico en una fábrica impide su producción y genera pérdidas."
      );
      currentY += 4;
    }

    // ÁMBITO GEOGRÁFICO DE COBERTURA
    addTitle("Ámbito geográfico de cobertura", 12);

    addText(
      "Es importante que determines el ámbito geográfico que tienes de actuación para que el seguro te dé cobertura en los lugares donde tienes actividad y donde distribuyes tus productos."
    );
    currentY += 4;

    addText(
      "La reclamación debe provenir de un daño que se haya ocasionado dentro del ámbito geográfico que hayas contratado. Si por ejemplo, vendes productos a Marruecos y tu ámbito geográfico es Unión Europea, las reclamaciones que recibas de allí no tendrás cobertura."
    );
    currentY += 4;

    addImportantNote(
      "Distingue entre ámbito geográfico donde debe producirse el daño o evento que ocasiona el daño, del ámbito jurisdiccional. El ámbito jurisdiccional es el lugar donde se llevará a cabo el juicio (litigio judicial). Por lo tanto, es aconsejable que tu ámbito jurisdiccional y geográfico coincidan."
    );
    currentY += 4;

    addText(
      "En el caso de la cobertura de responsabilidad civil patronal, el ámbito jurisdiccional siempre será España ya que las compañías solo dan cobertura para los trabajadores que contratas en España."
    );
    currentY += 6;

    // Ámbito territorial y de productos
    addText(
      `Ámbito geográfico general de cobertura: ${
        recommendation.ambitoTerritorial || "España y Andorra"
      }`
    );

    // Añadir ámbito de productos si corresponde
    if (
      recommendation.companyInfo.manufactures ||
      recommendation.companyInfo.markets ||
      recommendation.companyInfo.diseno
    ) {
      addText(
        `Ámbito geográfico para productos: ${
          recommendation.ambitoProductos || "España y Andorra"
        }`
      );
    }
    currentY += 10;

    // Información de contacto al final
    doc.setDrawColor(...COLORS.primary);
    doc.setFillColor(...COLORS.primary);
    doc.setLineWidth(0.5);

    // Crear un rectángulo coloreado para el contacto
    const contactBoxY = currentY - 4;
    doc.rect(leftMargin, contactBoxY, pageWidth - 40, 10, "F");

    // Añadir texto de contacto en color blanco
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255); // Texto en blanco
    doc.text(
      "Contáctanos si necesitas que te ayudemos con tu seguro correo@correo.com",
      pageWidth / 2,
      contactBoxY + 6,
      { align: "center" }
    );

    // Guardar el PDF
    const pdfBlob = doc.output("blob");

    // Guardar localmente el PDF si es necesario
    if (downloadFile) {
      const fileName = `Informe_Seguro_RC_${
        recommendation.companyInfo.name || "Cliente"
      }.pdf`;
      const safeFileName = fileName.replace(/\s+/g, "_");
      doc.save(safeFileName);
    }

    return pdfBlob;
  } catch (error) {
    console.error("Error durante la generación del PDF:", error);
    throw error;
  }
};
