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

// Función para obtener la descripción de una cobertura
function getCoverageDescription(coverageName: string): {
  description: string;
  example?: string;
  additionalInfo?: string;
} {
  const descriptions: Record<
    string,
    { description: string; example?: string; additionalInfo?: string }
  > = {
    "Responsabilidad Civil por Explotación": {
      description:
        "Cubre los daños que puedas causar a terceros en el desarrollo y explotación de tu actividad empresarial.",
      example: "Un incendio en la nave daña a la propiedad de los colindantes.",
    },
    "Responsabilidad Civil Patronal": {
      description:
        "Cubre la responsabilidad del asegurado frente a reclamaciones por accidentes laborales sufridos por sus empleados.",
      example:
        "Un trabajador cae de una escalera en una obra y demanda a la empresa.",
    },
    "Responsabilidad Civil por Contaminación Accidental": {
      description:
        "Cubre daños a terceros por contaminación imprevista generada por la actividad asegurada.",
      example: "Un derrame de productos químicos contamina un río.",
      additionalInfo:
        "No se cubre la contaminación gradual y progresiva. Para ello, deberás contratar una póliza medioambiental.",
    },
    "Responsabilidad Civil Inmobiliaria": {
      description:
        "Protege contra los daños causados a terceros debido a la propiedad o uso de inmuebles.",
      example:
        "Un desprendimiento de fachada de un edificio asegurado daña un coche estacionado.",
    },
    "Responsabilidad Civil Locativa": {
      description:
        "Cubre los daños que el asegurado pueda causar al inmueble que ocupa en régimen de arrendamiento.",
      example:
        "Un incendio en la oficina alquilada daña las instalaciones del propietario.",
    },
    "Responsabilidad Civil Cruzada y Subsidiaria": {
      description:
        "Subsidiaria: Protege al asegurado si un tercero (subcontratista, autónomo, etc.) causa daños y no puede responder por insolvencia o falta de seguro.\nCruzada: Protege al asegurado en caso de daños personales entre empleados de diferentes contratistas o subcontratistas en una misma obra o proyecto.",
      example:
        "Un subcontratista de limpieza causa daños en una oficina y no tiene seguro y no puede pagar el daño que ha causado.",
    },
    "Responsabilidad Civil por Productos y Post-trabajos": {
      description:
        "Cubre daños causados por productos defectuosos o trabajos ya finalizados.",
      example:
        "Un electrodoméstico vendido por la empresa provoca un cortocircuito y quema una casa.",
    },
    "Responsabilidad Civil por Unión y Mezcla": {
      description:
        "La cobertura de Unión y Mezcla protege al asegurado frente a reclamaciones por daños ocasionados cuando su producto se incorpora, mezcla o transforma en otro bien, y posteriormente se detecta un defecto que afecta al producto final.",
    },
    "Gastos de Retirada": {
      description:
        "Cubre al asegurado los costes de retirada de productos defectuosos del mercado.",
      example:
        "Una empresa debe retirar del mercado una partida de alimentos contaminados.",
      additionalInfo:
        "Muchas compañías exigen que para que la cobertura sea operativa, exista una orden de la autoridad de aplicación de retirada del producto por riesgo a la seguridad o sanidad. Sin embargo, otras compañías pagan estos costes sin que exista tal orden gubernamental, pero se debe probar que el producto era riesgoso para la salud o la seguridad de las personas.\nLa cobertura no cubre los extra-costes de producción que tengas, sólo los costes de recogida del producto y en su caso, de destrucción.",
    },
    "Responsabilidad Civil de Técnicos en Plantilla": {
      description:
        "Cubre la responsabilidad profesional de técnicos y profesionales empleados por la empresa.",
      example:
        "Un ingeniero en plantilla comete un error en un cálculo estructural y causa daños.",
    },
    "Responsabilidad Civil Daños a Conducciones": {
      description:
        "Cubre daños accidentales a tuberías, cables o infraestructuras subterráneas/aéreas.",
      example: "Una excavadora rompe una tubería de gas.",
    },
    "Daños a Colindantes": {
      description:
        "Cubre daños accidentales causados a propiedades vecinas por la actividad asegurada.",
      example:
        "Un edificio vecino sufre grietas debido a excavaciones en una obra.",
    },
    "Responsabilidad Civil Daños a Objetos Confiados y/o Custodiados": {
      description:
        "Cubre daños a bienes de terceros que el asegurado tiene en su poder para reparación o almacenamiento.",
      example:
        "Un taller de reparación daña accidentalmente un ordenador de un cliente.",
    },
    "Cobertura de Responsabilidad sobre Ferias y Exposiciones": {
      description:
        "Cubre los daños a terceros durante la participación del asegurado en eventos y exposiciones.",
      example:
        "Un stand de la empresa se derrumba y lesiona a un visitante en una feria comercial.",
      additionalInfo:
        "Esta cobertura no cubre los bienes que llevas a la feria, ni el transporte ni el montaje y desmontaje de ellos. Si quieres cubrir estos bienes, debes recurrir a una o más pólizas específicas (ej. póliza de transportes, de montaje, etc.).",
    },
    "Daños a Bienes Preexistentes": {
      description:
        "La cobertura de Daños a Bienes Preexistentes protege al asegurado frente a reclamaciones por daños accidentales causados a estructuras, instalaciones o bienes que ya existían antes del inicio de su actividad en un proyecto o trabajo.",
      additionalInfo:
        "No se cubren los daños ocasionados al propio bien trabajado o sobre el cual recaen los trabajos.",
    },
    "Responsabilidad Civil Daños a Vehículos de Terceros dentro de Instalaciones":
      {
        description:
          "Protege en caso de daños a coches de clientes o visitantes dentro del recinto asegurado.",
        example:
          "Un portón automático de un parking daña un coche estacionado.",
      },
    "Responsabilidad Civil Daños al Receptor de la Energía": {
      description:
        "Esta cobertura protege al asegurado frente a reclamaciones por daños materiales y perjuicios consecuenciales sufridos por los clientes o usuarios que reciben energía suministrada por él.",
      additionalInfo:
        "Si la energía suministrada por el asegurado (ya sea eléctrica, térmica, solar, etc.) falla, se altera o se interrumpe y esto causa daños en equipos, instalaciones o pérdidas económicas, la cobertura responde ante dichas reclamaciones.",
    },
    "Daños a Bienes de Empleados": {
      description:
        "Cubre daños a pertenencias de los empleados dentro del lugar de trabajo.",
      example:
        "Un incendio en la oficina destruye los ordenadores personales de los empleados.",
    },
    "Perjuicios Patrimoniales Puros": {
      description:
        "Cubre pérdidas económicas directas sufridas por terceros sin que haya un daño material o personal previo.",
      example:
        "Un fallo eléctrico en una fábrica impide su producción y genera pérdidas.",
    },
  };

  // Buscar la cobertura de forma más flexible
  const coverageKey = Object.keys(descriptions).find(
    (key) =>
      coverageName.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(coverageName.toLowerCase())
  );

  return coverageKey
    ? descriptions[coverageKey]
    : {
        description:
          "Cubre los daños relacionados con esta responsabilidad específica.",
      };
}

// Función para determinar si una cobertura está incluida basada en el nombre
function hasCoverage(
  coverage: string,
  recommendationCoverages: any[]
): boolean {
  return recommendationCoverages.some(
    (cov) =>
      cov.name.toLowerCase().includes(coverage.toLowerCase()) ||
      coverage.toLowerCase().includes(cov.name.toLowerCase())
  );
}

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

    const addText = (text: string, fontSize = 10, bold = false) => {
      doc.setFont("helvetica", bold ? "bold" : "normal");
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
      doc.text("•", leftMargin, currentY);

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
      checkPageBreak(25);

      // Calcular dimensiones del recuadro
      const maxWidth = pageWidth - 40;
      // Reducir el ancho disponible para el texto para aumentar márgenes internos
      const textWidth = maxWidth - 30; // 30 unidades totales de margen (15 a cada lado)
      const splitText = doc.splitTextToSize(`Importante: ${text}`, textWidth);
      const boxHeight = splitText.length * 6 + 16; // Aumentamos aún más el margen vertical

      // Dibujar el recuadro amarillo
      doc.setFillColor(...COLORS.warningBg);
      doc.setDrawColor(...COLORS.warningText);
      doc.setLineWidth(0.5);
      doc.roundedRect(
        leftMargin,
        currentY - 4,
        maxWidth,
        boxHeight,
        3,
        3,
        "FD"
      );

      // Configurar el estilo del texto
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.warningText);

      // Añadir el texto con mayor margen a la izquierda
      currentY += 6; // Más espacio para centrar verticalmente
      doc.text(splitText, leftMargin + 15, currentY); // 15 unidades de margen izquierdo

      // Actualizar la posición Y después del recuadro
      currentY += splitText.length * 6 + 12; // Más espacio después del recuadro
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

    // Usar directamente los datos de la recomendación
    const companyName = recommendation.companyInfo.name || "";
    const companyAddress = recommendation.companyInfo.address || "";
    const actividadDescripcion =
      recommendation.companyInfo.activityDescription ||
      recommendation.companyInfo.activity ||
      "";

    // Añadir datos de la empresa
    addText(`Tomador: ${companyName}`);
    addText(`Dirección: ${companyAddress}`);
    // Añadir el código CNAE aquí
    addText(
      `Actividad cubierta: ${
        recommendation.companyInfo.cnae_code
          ? `${recommendation.companyInfo.cnae_code} - ${actividadDescripcion}`
          : actividadDescripcion
      }`
    );

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

    // Procesar cada cobertura recomendada
    for (const coverage of recommendation.coverages) {
      if (!coverage.required) continue; // Saltarse las coberturas no requeridas

      // Obtener el nombre de la cobertura y su información adicional
      const coverageName = coverage.name;
      const { description, example, additionalInfo } =
        getCoverageDescription(coverageName);

      // Añadir el título con el límite o condición si está disponible
      let coverageTitle = coverageName;
      if (coverage.limit) {
        coverageTitle += ` con límite de ${coverage.limit}`;
      } else if (coverage.condition) {
        coverageTitle += `. ${coverage.condition}`;
      } else if (coverage.sublimit) {
        coverageTitle += ` con sublímite de ${coverage.sublimit}`;
      }

      addText(coverageTitle, 10, true); // Añadir el título en negrita

      // Añadir la descripción
      if (description) {
        addText(description);
      }

      // Añadir el ejemplo si existe
      if (example) {
        addText(`Ejemplo: ${example}`);
      }

      // Añadir información adicional si existe
      if (additionalInfo) {
        addText(additionalInfo);
      }

      // Si la cobertura es RC Patronal, añadir una nota importante específica
      if (coverageName.toLowerCase().includes("patronal")) {
        addImportantNote(
          "procura tener límites y sublímites altos de cobertura para accidentes de trabajo, ya que la jurisprudencia viene incrementando de manera muy significativa el importe de las indemnizaciones a pagar."
        );
      }

      // Si la cobertura es de contaminación, añadir una nota importante específica
      if (coverageName.toLowerCase().includes("contaminación")) {
        addImportantNote(
          "debes tener en cuenta que en materia de daños ambientales existen numerosas leyes que exigen a las empresas constituir una Garantía Financiera Obligatoria (GFO) para poder responder ante los daños que se causen. Una de las formas de dar cumplimiento a esta obligación legal es a través de la contratación de un seguro."
        );
      }

      // Si la cobertura es de Gastos de Retirada, añadir una nota importante específica
      if (coverageName.toLowerCase().includes("gastos de retirada")) {
        addImportantNote(
          "revisa esta cobertura en tu póliza y presta atención a estos dos puntos indicados."
        );
      }

      // Añadir espacio después de cada cobertura
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
    if (recommendation.ambitoProductos) {
      addText(
        `Ámbito geográfico para productos: ${recommendation.ambitoProductos}`
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
      "Contáctanos si necesitas que te ayudemos con tu seguro rodrigo@smartadvice.es",
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
