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

export const generateRCInsuranceReport = async (
  recommendation: any,
  downloadFile: boolean = false
) => {
  try {
    const doc = new jsPDF();
    let currentY = 20;
    const leftMargin = 14;
    const pageWidth = doc.internal.pageSize.width;

    // Determinar límites basados en facturación
    const { generalLimit, victimSubLimit } = determineLimitsRC(
      recommendation.companyInfo.billing
    );

    // Funciones helper
    const addTitle = (text: string, size = 16) => {
      // Añadir espacio extra antes de títulos principales
      if (size === 16) {
        currentY += 8; // Espacio adicional antes de títulos principales
      }

      checkPageBreak(15);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(size);
      doc.setTextColor(...COLORS.primary);
      doc.text(text, leftMargin, currentY);
      if (size === 16) {
        currentY += 3;
        doc.setDrawColor(...COLORS.secondary);
        doc.setLineWidth(0.5);
        doc.line(leftMargin, currentY, leftMargin + 24, currentY);
      }
      currentY += 10;
    };

    const addText = (text: string) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.text);
      const splitText = doc.splitTextToSize(text, pageWidth - 28);
      checkPageBreak(splitText.length * 6);
      doc.text(splitText, leftMargin, currentY);
      currentY += splitText.length * 6;
    };

    const addImportantNote = (text: string) => {
      const textWidth = pageWidth - 40; // Ancho del texto con margen
      const splitText = doc.splitTextToSize(text, textWidth);
      const boxHeight = splitText.length * 6 + 16; // Altura del cuadro

      checkPageBreak(boxHeight);

      // Dibujar el cuadro de fondo
      doc.setFillColor(...COLORS.warningBg);
      doc.setDrawColor(...COLORS.warningText);
      doc.setLineWidth(0.1);

      const boxWidth = pageWidth - 28;
      const boxX = leftMargin;
      const boxY = currentY;

      doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 2, 2, "FD");

      // Configurar el estilo del texto
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.warningText);

      // Calcular el centro del cuadro para posicionar el texto
      const textX = boxX + boxWidth / 2;
      const textY = boxY + 10; // Dejamos un margen superior de 10 unidades

      // Usar la opción align para centrar el texto
      doc.text(splitText, textX, textY, {
        align: "center",
      });

      // Actualizar la posición vertical para el siguiente elemento
      currentY += boxHeight + 5; // Añadimos 5 unidades de espacio adicional
    };
    const addBulletList = (items: string[]) => {
      checkPageBreak(items.length * 6 + 5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.text);

      items.forEach((item) => {
        const splitText = doc.splitTextToSize(`• ${item}`, pageWidth - 32);
        checkPageBreak(splitText.length * 6);
        doc.text(splitText, leftMargin, currentY);
        currentY += splitText.length * 6;
      });

      currentY += 4;
    };

    const checkPageBreak = (requiredSpace: number) => {
      if (currentY + requiredSpace > doc.internal.pageSize.height - 20) {
        doc.addPage();
        currentY = 20;
      }
    };

    // Título principal
    doc.setFontSize(24);
    doc.setTextColor(...COLORS.primary);
    doc.text("Responsabilidad Civil General", pageWidth / 2, currentY, {
      align: "center",
    });
    currentY += 25;

    // Línea separadora
    doc.setDrawColor(...COLORS.secondary);
    doc.setLineWidth(0.5);
    doc.line(leftMargin, currentY - 15, pageWidth - leftMargin, currentY - 15);

    // Sección: Introducción
    addText(
      "El Seguro de Responsabilidad Civil es un contrato suscrito con una compañía de Seguros que protege al asegurado frente a reclamaciones derivadas de daños personales, materiales o perjuicios económicos causados involuntariamente a terceros en el ejercicio de tu actividad empresarial."
    );
    currentY += 4;
    addText(
      "Su principal función es pagarle a estos terceros perjudicados el importe de indemnización que te reclamen y los gastos de defensa que tu tengas que asumir para defenderte, evitando que asumas estos costes con tu propio patrimonio."
    );
    currentY += 8;

    // Sección: ¿Para qué sirve?
    addTitle("¿Para qué sirve?", 14);
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
    currentY += 8;

    // Datos generales del seguro
    addTitle("Datos generales de tu seguro");

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
        "No especificada";
    }

    const infoTable = {
      head: [] as string[][],
      body: [
        ["Tomador:", recommendation.companyInfo.name || "No especificado"],
        ["CIF:", recommendation.companyInfo.cif || "No especificado"],
        ["Dirección:", recommendation.companyInfo.address || "No especificado"],
        ["CNAE:", recommendation.companyInfo.cnae_code || "No especificado"],
        ["Actividad cubierta:", actividadDescripcion],
        ["Facturación:", formatCurrency(recommendation.companyInfo.billing)],
      ] as string[][],
    };

    // Agregar asegurado adicional si no es propietario
    if (
      recommendation.companyInfo.installations_type === "No propietario" &&
      recommendation.companyInfo.owner_name
    ) {
      infoTable.body.push([
        "Asegurado adicional:",
        `Se hace constar como asegurado adicional en calidad de propietario de las instalaciones al Sr. y/o empresa ${
          recommendation.companyInfo.owner_name
        } con NIF/DNI ${
          recommendation.companyInfo.owner_cif || "No especificado"
        }.`,
      ]);
    }

    autoTable(doc, {
      startY: currentY,
      head: infoTable.head,
      body: infoTable.body,
      theme: "plain",
      styles: {
        fontSize: 11,
        cellPadding: { top: 4, right: 5, bottom: 4, left: 5 },
        textColor: COLORS.text as Color,
      },
      columnStyles: {
        0: {
          font: "helvetica",
          fontStyle: "bold" as FontStyle,
          textColor: COLORS.primary as Color,
          cellWidth: 40,
        },
        1: { cellWidth: 140 },
      },
      alternateRowStyles: {
        fillColor: COLORS.lightGray as Color,
      },
    });

    currentY = (doc.lastAutoTable?.finalY || currentY) + 15;

    addText(
      "La facturación es la base de cálculo de la prima. A mayor facturación, mayor prima. Al inicio del periodo de seguro, tendrás que informarle a la compañía la facturación que tienes prevista para esa anualidad. Al final del periodo de seguro, deberás informarle a la compañía la facturación real que has tenido en ese periodo de seguro (generalmente esto se debe informar dentro de los primeros 30 ó 60 días de producido el vencimiento de la anualidad de la póliza)."
    );
    currentY += 4;

    addImportantNote(
      "Es necesario que cumplas con este deber de información para evitar el infraseguro (Artículo 30 de la Ley 50/1980, de 8 de octubre, de Contrato de Seguro). A mayor facturación pagarás más prima, ya que la prima se calcula en un tanto pro mil de la facturación."
    );

    addText(
      "Actualización de prima: Al inicio del periodo de seguro, deberás indicarle a la compañía la cifra de facturación que estimas tener para el periodo de seguro que vas a comenzar. Si es mayor al que tuviste la anualidad anterior, pagarás probablemente más prima. Si es inferior, la prima probablemente se reduzca."
    );
    currentY += 4;

    addText(
      'Regularización de prima: La mayoría de compañías establecen en sus contratos que la prima es "regularizable". Esto significa que al final del periodo se comparan los valores reales con los estimados y:'
    );
    currentY += 4;

    addBulletList([
      "Si la facturación habida del periodo fue mayor a la informada, deberás pagar una cantidad adicional y proporcional.",
      "Si la facturación habida del periodo es menor a la informada, no hay devolución de prima porque la prima pagada es una prima mínima y en depósito.",
    ]);

    addImportantNote(
      "Si la póliza es regularizable, es mejor que la estimación de facturación al inicio de la anualidad la hagas a la baja y en su caso, que pagues el proporcional de prima si resulta estar por encima de lo previsto (ya que si facturas menos de lo previsto no se extornará prima)."
    );

    // Si no es propietario, agregar nota sobre asegurado adicional
    if (recommendation.companyInfo.installations_type === "No propietario") {
      addImportantNote(
        "Si no eres el propietario de las instalaciones es probable que éste te haya solicitado en el contrato de arrendamiento que lo incluyas como asegurado adicional (esto es, como beneficiario). Revisa bien el contrato de alquiler de tu nave y si el propietario te ha solicitado que lo incluyas como asegurado a los efecto de la responsabilidad civil, dile a la compañía que te lo haga constar. Esto no suele tener coste adicional de prima y puedes solicitar un certificado de seguro para entregarle al propietario y demostrar que has cumplido con tu obligación contractual."
      );
    }

    // Garantías a contratar
    addTitle("Garantías a contratar");

    // Preparar las garantías basadas en los datos del formulario
    const garantias = [] as Array<{
      name: string;
      limit?: string;
      sublimit?: string;
      condition?: string;
      description: string;
      example?: string;
      important?: string;
    }>;

    // Responsabilidad civil por explotación (siempre incluida)
    garantias.push({
      name: "Responsabilidad civil por explotación",
      limit: generalLimit,
      description:
        "Cubre los daños que puedas causar a terceros en el desarrollo y explotación de tu actividad empresarial.",
      example:
        "Ejemplo: un incendio en la nave daña a la propiedad de los colindantes.",
    });

    // Responsabilidad civil Patronal (si tiene empleados)
    if (recommendation.companyInfo.employees_number > 1) {
      garantias.push({
        name: "Responsabilidad civil Patronal",
        limit: generalLimit,
        sublimit: victimSubLimit,
        description:
          "Cubre la responsabilidad del asegurado frente a reclamaciones por accidentes laborales sufridos por sus empleados.",
        example:
          "Ejemplo: Un trabajador cae de una escalera en una obra y demanda a la empresa.",
        important:
          "Procura tener límites y sublímites altos de cobertura para accidentes de trabajo, ya que la jurisprudencia viene incrementando de manera muy significativa el importe de las indemnizaciones a pagar.",
      });
    }

    // Responsabilidad civil por contaminación Accidental
    if (
      recommendation.coberturas_solicitadas?.coberturas_adicionales
        ?.cover_accidental_contamination
    ) {
      garantias.push({
        name: "Responsabilidad civil por contaminación Accidental",
        limit: generalLimit,
        description:
          "Cubre daños a terceros por contaminación imprevista generada por la actividad asegurada.",
        example: "Ejemplo: Un derrame de productos químicos contamina un río.",
        important:
          "No se cubre la contaminación gradual y progresiva. Para ello, deberás contratar una póliza medioambiental. Debes tener en cuenta que en materia de daños ambientales existen numerosas leyes que exigen a las empresas constituir una Garantía Financiera Obligatoria (GFO) para poder responder ante los daños que se causen.",
      });
    }

    // Responsabilidad civil Inmobiliaria (si es propietario)
    if (recommendation.companyInfo.installations_type === "Propietario") {
      garantias.push({
        name: "Responsabilidad civil Inmobiliaria",
        limit: generalLimit,
        description:
          "Protege contra los daños causados a terceros debido a la propiedad o uso de inmuebles.",
        example:
          "Ejemplo: Un desprendimiento de fachada de un edificio asegurado daña un coche estacionado.",
      });
    }

    // Responsabilidad civil Locativa (si no es propietario)
    if (recommendation.companyInfo.installations_type === "No propietario") {
      garantias.push({
        name: "Responsabilidad civil Locativa",
        condition:
          "Sublímite sugerido: de 300.000€ a 1.200.000€ dependiendo el valor del inmueble alquilado",
        description:
          "Cubre los daños que el asegurado pueda causar al inmueble que ocupa en régimen de arrendamiento.",
        example:
          "Ejemplo: Un incendio en la oficina alquilada daña las instalaciones del propietario.",
      });
    }

    // Responsabilidad civil cruzada y subsidiaria (si subcontrata)
    if (recommendation.actividad?.servicios?.subcontrata_personal) {
      garantias.push({
        name: "Responsabilidad civil cruzada y subsidiaria",
        condition: "Incluida",
        description:
          "Subsidiaria: Protege al asegurado si un tercero (subcontratista, autónomo, etc.) causa daños y no puede responder por insolvencia o falta de seguro. Cruzada: Protege al asegurado en caso de daños personales entre empleados de diferentes contratistas o subcontratistas en una misma obra o proyecto.",
        example:
          "Ejemplo subsidiaria: Un subcontratista de limpieza causa daños en una oficina y no tiene seguro y no puede pagar el daño que ha causado. Ejemplo cruzada: Un empleado de una empresa eléctrica se lesiona debido a la negligencia de una empresa de andamios en la misma obra.",
      });
    }

    // Responsabilidad civil por productos (si fabrica, diseña, comercializa o almacena)
    if (
      recommendation.companyInfo.manufactures ||
      recommendation.companyInfo.markets ||
      recommendation.companyInfo.diseno ||
      recommendation.companyInfo.almacenamiento
    ) {
      garantias.push({
        name: "Responsabilidad civil por productos y post-trabajos",
        limit: generalLimit,
        description:
          "Cubre daños causados por productos defectuosos o trabajos ya finalizados.",
        example:
          "Ejemplo: Un electrodoméstico vendido por la empresa provoca un cortocircuito y quema una casa.",
      });
    }

    // Responsabilidad civil por unión y mezcla (si es producto intermedio)
    // Responsabilidad civil por unión y mezcla (si es producto intermedio)
    // Responsabilidad civil por unión y mezcla (si es producto intermedio)
    if (
      recommendation.actividad?.manufactura?.producto_intermedio_final ===
        "intermedio" ||
      (recommendation.actividad?.manufactura &&
        recommendation.actividad.manufactura.producto_intermedio_final ===
          "intermedio")
    ) {
      garantias.push({
        name: "Responsabilidad civil por unión y mezcla",
        condition: "Límite sugerido: entre 100.000€ a 600.000€",
        description:
          "La cobertura de Unión y Mezcla protege al asegurado frente a reclamaciones por daños ocasionados cuando su producto se incorpora, mezcla o transforma en otro bien, y posteriormente se detecta un defecto que afecta al producto final.",
      });
    }

    // Gastos de retirada (si es consumo humano)
    // Gastos de retirada (si es consumo humano)
    if (
      recommendation.actividad?.manufactura?.producto_consumo_humano === true ||
      (recommendation.actividad?.manufactura &&
        recommendation.actividad.manufactura.producto_consumo_humano === true)
    ) {
      garantias.push({
        name: "Gastos de retirada",
        condition: "Límite sugerido: entre 100.000€ y 600.000€",
        description:
          "Cubre al asegurado los costes de retirada de productos defectuosos del mercado.",
        example:
          "Ejemplo: Una empresa debe retirar del mercado una partida de alimentos contaminados.",
        important:
          "Muchas compañías exigen que para que la cobertura sea operativa, exista una orden de la autoridad de aplicación de retirada del producto por riesgo a la seguridad o sanidad. Sin embargo, otras compañías pagan estos costes sin que exista tal orden gubernamental, pero se debe probar que el producto era riesgoso para la salud o la seguridad de las personas. La cobertura no cubre los extra-costes de producción que tengas, sólo los costes de recogida del producto y en su caso, de destrucción.",
      });
    }

    // Responsabilidad civil de técnicos en plantilla
    if (
      recommendation.coberturas_solicitadas?.coberturas_adicionales
        ?.has_contracted_professionals
    ) {
      garantias.push({
        name: "Responsabilidad civil de técnicos en plantilla",
        limit: generalLimit,
        description:
          "Cubre la responsabilidad profesional de técnicos y profesionales empleados por la empresa.",
        example:
          "Ejemplo: Un ingeniero en plantilla comete un error en un cálculo estructural y causa daños.",
      });
    }

    // Responsabilidad Civil Daños a conducciones
    if (
      recommendation.actividad?.servicios?.trabajos_afectan_infraestructuras
    ) {
      garantias.push({
        name: "Responsabilidad Civil Daños a conducciones",
        limit: generalLimit,
        description:
          "Cubre daños accidentales a tuberías, cables o infraestructuras subterráneas/aéreas.",
        example: "Ejemplo: Una excavadora rompe una tubería de gas.",
      });
    }

    // Daños a Colindantes
    if (recommendation.actividad?.servicios?.trabajos_afectan_edificios) {
      garantias.push({
        name: "Daños a Colindantes",
        limit: generalLimit,
        description:
          "Cubre daños accidentales causados a propiedades vecinas por la actividad asegurada.",
        example:
          "Ejemplo: Un edificio vecino sufre grietas debido a excavaciones en una obra.",
      });
    }

    // Responsabilidad Civil Daños a Objetos Confiados
    if (
      recommendation.coberturas_solicitadas?.coberturas_adicionales
        ?.stores_third_party_goods
    ) {
      garantias.push({
        name: "Responsabilidad Civil Daños a Objetos Confiados y/o Custodiados",
        condition:
          "Límite sugerido: entre 150.000€ a 600.000€ dependiendo del valor de los bienes custodiados",
        description:
          "Cubre daños a bienes de terceros que el asegurado tiene en su poder para reparación o almacenamiento.",
        example:
          "Ejemplo: Un taller de reparación daña accidentalmente un ordenador de un cliente.",
      });
    }

    // Cobertura de ferias
    if (
      recommendation.coberturas_solicitadas?.coberturas_adicionales
        ?.participates_in_fairs
    ) {
      garantias.push({
        name: "Cobertura de responsabilidad sobre ferias y exposiciones",
        condition: "Incluida",
        description:
          "Cubre los daños a terceros durante la participación del asegurado en eventos y exposiciones.",
        example:
          "Ejemplo: Un stand de la empresa se derrumba y lesiona a un visitante en una feria comercial.",
        important:
          "Esta cobertura no cubre los bienes que llevas a la feria, ni el transporte ni el montaje y desmontaje de ellos. Si quieres cubrir estos bienes, debes recurrir a una o más pólizas específicas (ej. póliza de transportes, de montaje, etc.).",
      });
    }

    // Daños a bienes Preexistentes
    if (recommendation.actividad?.servicios?.cubre_preexistencias) {
      garantias.push({
        name: "Daños a bienes Preexistentes",
        limit: generalLimit,
        condition:
          "Excluyéndose en cualquier caso los daños a aquella parte específica dónde trabaja el asegurado",
        description:
          "La cobertura de Daños a Bienes Preexistentes protege al asegurado frente a reclamaciones por daños accidentales causados a estructuras, instalaciones o bienes que ya existían antes del inicio de su actividad en un proyecto o trabajo.",
        important:
          "No se cubren los daños ocasionados al propio bien trabajado o sobre el cual recaen los trabajos.",
      });
    }

    // Responsabilidad Civil Daños a vehículos
    if (
      recommendation.coberturas_solicitadas?.coberturas_adicionales
        ?.third_party_vehicles_parked
    ) {
      garantias.push({
        name: "Responsabilidad Civil Daños a vehículos de terceros dentro de instalaciones",
        condition: "Incluida",
        description:
          "Protege en caso de daños a coches de clientes o visitantes dentro del recinto asegurado.",
        example:
          "Ejemplo: Un portón automático de un parking daña un coche estacionado.",
      });
    }

    // Daños al receptor de energía
    if (recommendation.companyInfo.placas_venta_red) {
      garantias.push({
        name: "Daños al receptor de la energía",
        limit: generalLimit,
        description:
          "Esta cobertura protege al asegurado frente a reclamaciones por daños materiales y perjuicios consecuenciales sufridos por los clientes o usuarios que reciben energía suministrada por él. Si la energía suministrada por el asegurado (ya sea eléctrica, térmica, solar, etc.) falla, se altera o se interrumpe y esto causa daños en equipos, instalaciones o pérdidas económicas, la cobertura responde ante dichas reclamaciones.",
      });
    }

    // Daños a bienes de empleados
    if (
      recommendation.coberturas_solicitadas?.coberturas_adicionales
        ?.cover_employee_damages
    ) {
      garantias.push({
        name: "Daños a bienes de empleados",
        condition: "Límite sugerido: entre 30.000€ a 150.000€",
        description:
          "Cubre daños a pertenencias de los empleados dentro del lugar de trabajo.",
        example:
          "Ejemplo: Un incendio en la oficina destruye los ordenadores personales de los empleados.",
      });
    }

    // Perjuicios patrimoniales puros
    if (
      recommendation.coberturas_solicitadas?.coberturas_adicionales
        ?.cover_material_damages
    ) {
      garantias.push({
        name: "Perjuicios patrimoniales puros",
        condition: "Límite sugerido: 100.000€ a 300.000€",
        description:
          "Cubre pérdidas económicas directas sufridas por terceros sin que haya un daño material o personal previo.",
        example:
          "Ejemplo: Un fallo eléctrico en una fábrica impide su producción y genera pérdidas.",
      });
    }

    // Generar tabla compacta de garantías
    // Generar tabla compacta de garantías
    console.log(`Se encontraron ${garantias.length} garantías para mostrar`);
    console.log(
      "Garantías: ",
      garantias.map((g) => g.name)
    );

    // Ahora, crear datos para la tabla de garantías
    const garantiasTableData: [string, string][] = [];

    // Si hay coberturas en la recomendación original, usarlas directamente
    if (recommendation.coverages && recommendation.coverages.length > 0) {
      console.log(
        `Detectadas ${recommendation.coverages.length} coberturas en la API`
      );

      // Recorrer las coberturas y añadirlas a la tabla
      recommendation.coverages.forEach((coverage: any) => {
        // Construir la descripción
        let descripcion =
          "Proporciona cobertura para riesgos específicos relacionados con tu actividad empresarial";
        let limitesInfo = "";

        // Buscar información más detallada si está disponible
        const garantiaInfo = garantias.find((g) => g.name === coverage.name);
        if (garantiaInfo) {
          descripcion = garantiaInfo.description;

          // Añadir ejemplo si existe, pero evitando duplicación de "Ejemplo:"
          if (
            garantiaInfo.example &&
            !descripcion.includes(garantiaInfo.example)
          ) {
            const exampleText = garantiaInfo.example.startsWith("Ejemplo:")
              ? garantiaInfo.example
              : `Ejemplo: ${garantiaInfo.example}`;
            descripcion += ` ${exampleText}`;
          }
        }

        // Preparar información de límites
        if (coverage.limit) {
          limitesInfo = `Límite: ${coverage.limit}`;
        }
        if (coverage.sublimit) {
          limitesInfo += limitesInfo
            ? `, Sublímite: ${coverage.sublimit}`
            : `Sublímite: ${coverage.sublimit}`;
        }
        if (coverage.condition && !limitesInfo.includes(coverage.condition)) {
          limitesInfo += limitesInfo
            ? `. ${coverage.condition}`
            : `${coverage.condition}`;
        }

        // Añadir a la tabla con formato
        garantiasTableData.push([
          coverage.name,
          descripcion + (limitesInfo ? `\n\n${limitesInfo}` : ""),
        ]);
      });

      // Crear la tabla
      autoTable(doc, {
        startY: currentY,
        head: [["Garantía", "Descripción"]],
        body: garantiasTableData,
        theme: "striped",
        styles: {
          fontSize: 10,
          cellPadding: { top: 6, right: 5, bottom: 6, left: 5 },
        },
        headStyles: {
          fillColor: COLORS.primary as Color,
          textColor: [255, 255, 255] as Color,
          fontStyle: "bold" as FontStyle,
        },
        columnStyles: {
          0: {
            cellWidth: 80,
            fontStyle: "bold" as FontStyle,
            textColor: COLORS.primary as Color,
          },
          1: {
            cellWidth: "auto",
          },
        },
        alternateRowStyles: {
          fillColor: [245, 247, 250] as Color,
        },
        // Garantizar que la tabla entre bien en la página
        margin: { left: leftMargin, right: leftMargin },
      });

      // Actualizar posición vertical
      currentY = (doc.lastAutoTable?.finalY || currentY) + 15;
    } else {
      // Mostrar mensaje si no hay garantías
      addText("No se han identificado garantías específicas para tu perfil.");
    }

    // Ámbito geográfico
    addTitle("Ámbito geográfico de cobertura");

    addText(
      "Es importante que determines el ámbito geográfico que tienes de actuación para que el seguro te dé cobertura en los lugares donde tienes actividad y donde distribuyes tus productos."
    );
    currentY += 4;

    addText(
      "La reclamación debe provenir de un daño que se haya ocasionado dentro del ámbito geográfico que hayas contratado. Si por ejemplo, vendes productos a Marruecos y tu ámbito geográfico es Unión Europea, las reclamaciones que recibas de allí no tendrás cobertura."
    );

    addImportantNote(
      "Distingue entre ámbito geográfico donde debe producirse el daño o evento que ocasiona el daño, del ámbito jurisdiccional. El ámbito jurisdiccional es el lugar donde se llevará a cabo el juicio (litigio judicial). Por lo tanto, es aconsejable que tu ámbito jurisdiccional y geográfico coincidan."
    );

    addText(
      "En el caso de la cobertura de responsabilidad civil patronal, el ámbito jurisdiccional siempre será España ya que las compañías solo dan cobertura para los trabajadores que contratas en España."
    );

    // Ámbito geográfico general
    const ambitoTable = {
      head: [] as string[][],
      body: [
        [
          "Ámbito geográfico general de cobertura:",
          recommendation.ambitoTerritorial || "España y Andorra",
        ],
      ] as string[][],
    };

    // Añadir ámbito de productos si corresponde
    if (
      recommendation.ambitoProductos &&
      (recommendation.companyInfo.manufactures ||
        recommendation.companyInfo.markets ||
        recommendation.companyInfo.diseno)
    ) {
      ambitoTable.body.push([
        "Ámbito geográfico para productos:",
        recommendation.ambitoProductos || "España y Andorra",
      ]);
    }

    autoTable(doc, {
      startY: currentY,
      head: ambitoTable.head,
      body: ambitoTable.body,
      theme: "plain",
      styles: {
        fontSize: 11,
        cellPadding: { top: 4, right: 5, bottom: 4, left: 5 },
        textColor: COLORS.text as Color,
      },
      columnStyles: {
        0: {
          font: "helvetica",
          fontStyle: "bold" as FontStyle,
          textColor: COLORS.primary as Color,
          cellWidth: 80,
        },
        1: { cellWidth: 100 },
      },
      alternateRowStyles: {
        fillColor: COLORS.lightGray as Color,
      },
    });

    currentY = (doc.lastAutoTable?.finalY || currentY) + 20;

    // Información de contacto
    addText(
      "Contáctanos si necesitas que te ayudemos con tu seguro: correo@correo.com"
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
