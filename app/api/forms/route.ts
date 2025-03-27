import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Clonamos la solicitud para poder leer el cuerpo varias veces
    const clonedRequest = request.clone();
    const body = await clonedRequest.json();

    console.log(
      "[API Router] Cuerpo completo de la solicitud:",
      JSON.stringify(body, null, 2)
    );

    // Extraer el tipo de formulario del cuerpo
    // Revisamos múltiples rutas posibles para encontrar el tipo de formulario
    let formType = "unknown";

    if (body.form_data?.form_type) {
      formType = body.form_data.form_type;
      console.log(
        "[API Router] Tipo encontrado en form_data.form_type:",
        formType
      );
    } else if (body.form_type) {
      formType = body.form_type;
      console.log("[API Router] Tipo encontrado en body.form_type:", formType);
    } else if (body.type) {
      formType = body.type;
      console.log("[API Router] Tipo encontrado en body.type:", formType);
    }

    const sessionId = body.session_id;
    console.log(`[API Router] Session ID: ${sessionId}`);

    // Normalizar el tipo de formulario para la URL
    let urlFormType;
    if (formType === "danos_materiales" || formType === "danos-materiales") {
      urlFormType = "danos-materiales";
    } else if (
      formType === "responsabilidad_civil" ||
      formType === "responsabilidad-civil"
    ) {
      urlFormType = "responsabilidad-civil";
    } else {
      urlFormType = formType;
    }

    console.log(`[API Router] Tipo de formulario normalizado: ${urlFormType}`);

    // Si seguimos con unknown, comprobar si hay información específica
    if (urlFormType === "unknown") {
      // Intentar deducir el tipo por el contenido
      if (body.form_data?.capitales_y_coberturas) {
        urlFormType = "danos-materiales";
        console.log(
          "[API Router] Tipo deducido por contenido: danos-materiales"
        );
      } else if (body.form_data?.coberturas_solicitadas) {
        urlFormType = "responsabilidad-civil";
        console.log(
          "[API Router] Tipo deducido por contenido: responsabilidad-civil"
        );
      }
    }

    // Crear la URL de redirección
    const targetUrl = new URL(`/api/forms/${urlFormType}`, request.url);
    console.log(`[API Router] Redirigiendo a: ${targetUrl.toString()}`);

    // Reenviar la solicitud al endpoint específico
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: request.headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error(
        `[API Router] Error en respuesta del endpoint específico: ${response.status} ${response.statusText}`
      );
      return NextResponse.json(
        {
          success: false,
          error: `Error del endpoint específico: ${response.status} ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    // Devolver la respuesta del endpoint específico
    const responseData = await response.json();
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("[API Router] Error procesando la solicitud:", error);
    return NextResponse.json(
      { success: false, error: "Error procesando la solicitud" },
      { status: 500 }
    );
  }
}
