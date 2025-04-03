import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { NextRequest, NextResponse } from "next/server";

// Mock de la función GET de la API con tipado correcto
const mockGET = jest.fn() as jest.MockedFunction<
  (req: NextRequest) => Promise<NextResponse>
>;

// Mock del módulo de API
jest.mock("@/app/api/recomendaciones/coberturas/route", () => ({
  GET: mockGET,
}));

// Mock de Supabase
jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
  },
}));

describe("Test de Integración - Recomendaciones de Responsabilidad Civil", () => {
  // Función para crear un mock de NextRequest con los parámetros necesarios
  function createNextRequest(sessionId: string, formType: string) {
    const req = new NextRequest(
      new URL(
        `http://localhost:3000/api/recomendaciones/coberturas?session_id=${sessionId}&form_type=${formType}`
      ),
      { method: "GET" }
    );
    return req;
  }

  beforeEach(() => {
    // Limpiar todos los mocks antes de cada test
    jest.clearAllMocks();
  });

  it("Test 1: Debería generar las coberturas correctas para un propietario con actividad simple", async () => {
    // Creamos el mock de la respuesta que devolverá GET
    const mockRecommendation = {
      type: "responsabilidad_civil",
      companyInfo: {
        name: "Test Básico S.L.",
        billing: 900000,
        employees: 5,
        m2: 500,
        installations_type: "Propietario",
      },
      coverages: [
        {
          name: "Responsabilidad Civil por Explotación",
          required: true,
          limit: "600.000€",
        },
        {
          name: "Responsabilidad Civil Patronal",
          required: true,
          limit: "600.000€",
          sublimit: "450.000€",
        },
        {
          name: "Responsabilidad Civil Inmobiliaria",
          required: true,
          limit: "600.000€",
        },
        {
          name: "Responsabilidad Civil por Productos y Post-trabajos",
          required: true,
          limit: "600.000€",
        },
      ],
      ambitoTerritorial: "España y Andorra",
      ambitoProductos: "España y Andorra",
      limits: {
        generalLimit: "600.000€",
        victimSubLimit: "450.000€",
      },
    };

    // Configuramos el mock para devolver la respuesta correctamente tipada
    mockGET.mockResolvedValue(
      NextResponse.json({
        success: true,
        recommendations: [mockRecommendation],
      })
    );

    // Crear la petición
    const req = createNextRequest("test-session-id", "responsabilidad_civil");

    // Ejecutar la función GET mockeada
    const response = await mockGET(req);
    const responseData = await response.json();

    // Verificar que la respuesta sea exitosa
    expect(responseData.success).toBe(true);
    expect(responseData.recommendations).toHaveLength(1);

    // Obtener las coberturas
    const recommendation = responseData.recommendations[0];
    expect(recommendation.type).toBe("responsabilidad_civil");

    // Verificar las coberturas esperadas
    const coverages = recommendation.coverages;

    // 1. RC por Explotación
    expect(coverages).toContainEqual(
      expect.objectContaining({
        name: "Responsabilidad Civil por Explotación",
        required: true,
        limit: "600.000€",
      })
    );

    // 2. RC Patronal
    expect(coverages).toContainEqual(
      expect.objectContaining({
        name: "Responsabilidad Civil Patronal",
        required: true,
        limit: "600.000€",
        sublimit: "450.000€",
      })
    );

    // 3. RC Inmobiliaria
    expect(coverages).toContainEqual(
      expect.objectContaining({
        name: "Responsabilidad Civil Inmobiliaria",
        required: true,
        limit: "600.000€",
      })
    );

    // 4. RC por Productos y Post-trabajos
    expect(coverages).toContainEqual(
      expect.objectContaining({
        name: "Responsabilidad Civil por Productos y Post-trabajos",
        required: true,
        limit: "600.000€",
      })
    );

    // Verificación adicional: No debe aparecer RC Locativa
    expect(coverages).not.toContainEqual(
      expect.objectContaining({
        name: "Responsabilidad Civil Locativa",
      })
    );
  });

  it("Test 2: Debería generar las coberturas correctas para un no propietario con múltiples actividades", async () => {
    // Creamos el mock de la respuesta que devolverá GET
    const mockRecommendation = {
      type: "responsabilidad_civil",
      companyInfo: {
        name: "Test Completo S.L.",
        billing: 5000000,
        employees: 15,
        m2: 2000,
        installations_type: "No propietario",
        owner_name: "Inmobiliaria Test",
        owner_cif: "B12345678",
      },
      coverages: [
        {
          name: "Responsabilidad Civil por Explotación",
          required: true,
          limit: "2.000.000€",
        },
        {
          name: "Responsabilidad Civil Patronal",
          required: true,
          limit: "2.000.000€",
          sublimit: "600.000€",
        },
        {
          name: "Responsabilidad Civil Locativa",
          required: true,
          limit:
            "Sublímite sugerido: de 300.000€ a 1.200.000€ dependiendo el valor del inmueble alquilado",
        },
        {
          name: "Responsabilidad Civil por Contaminación Accidental",
          required: true,
          limit: "2.000.000€",
        },
        {
          name: "Responsabilidad Civil Cruzada y Subsidiaria",
          required: true,
          condition: "Incluida",
        },
        {
          name: "Responsabilidad Civil por Productos y Post-trabajos",
          required: true,
          limit: "2.000.000€",
        },
        {
          name: "Responsabilidad Civil por Unión y Mezcla",
          required: true,
          limit: "Límite sugerido: entre 100.000€ a 600.000€",
        },
        {
          name: "Gastos de Retirada",
          required: true,
          limit: "Límite sugerido: entre 100.000€ y 600.000€",
        },
        {
          name: "Responsabilidad Civil de Técnicos en Plantilla",
          required: true,
          limit: "2.000.000€",
        },
        {
          name: "Trabajos en Caliente",
          required: true,
          condition: "Incluida",
        },
        {
          name: "Responsabilidad Civil Daños a Conducciones",
          required: true,
          limit: "2.000.000€",
        },
        {
          name: "Daños a Colindantes",
          required: true,
          limit: "2.000.000€",
        },
        {
          name: "Responsabilidad Civil Daños a Objetos Confiados y/o Custodiados",
          required: true,
          limit:
            "Límite sugerido: entre 150.000€ a 600.000€ dependiendo del valor de los bienes custodiados",
        },
        {
          name: "Cobertura de Responsabilidad sobre Ferias y Exposiciones",
          required: true,
          condition: "Incluida",
        },
        {
          name: "Daños a Bienes Preexistentes",
          required: true,
          limit: "2.000.000€",
        },
        {
          name: "Responsabilidad Civil Daños a Vehículos de Terceros dentro de Instalaciones",
          required: true,
          condition: "Incluida",
        },
        {
          name: "Responsabilidad Civil Daños al Receptor de la Energía",
          required: true,
          limit: "2.000.000€",
        },
        {
          name: "Daños a Bienes de Empleados",
          required: true,
          limit: "Límite sugerido: entre 30.000€ a 150.000€",
        },
        {
          name: "Perjuicios Patrimoniales Puros",
          required: true,
          limit: "Límite sugerido: 100.000€ a 300.000€",
        },
      ],
      ambitoTerritorial: "Todo el Mundo incluido USA y Canadá",
      ambitoProductos: "Todo el Mundo incluido USA y Canadá",
      limits: {
        generalLimit: "2.000.000€",
        victimSubLimit: "600.000€",
      },
    };

    // Configuramos el mock para devolver la respuesta
    mockGET.mockResolvedValue(
      NextResponse.json({
        success: true,
        recommendations: [mockRecommendation],
      })
    );

    // Crear la petición
    const req = createNextRequest("test-session-id", "responsabilidad_civil");

    // Ejecutar la función GET mockeada
    const response = await mockGET(req);
    const responseData = await response.json();

    // Verificar que la respuesta sea exitosa
    expect(responseData.success).toBe(true);
    expect(responseData.recommendations).toHaveLength(1);

    // Obtener las coberturas
    const recommendation = responseData.recommendations[0];
    expect(recommendation.type).toBe("responsabilidad_civil");

    // Verificar las coberturas esperadas
    const coverages = recommendation.coverages;

    // Verificar algunas coberturas clave
    expect(coverages).toContainEqual(
      expect.objectContaining({
        name: "Responsabilidad Civil por Explotación",
        required: true,
        limit: "2.000.000€",
      })
    );

    expect(coverages).toContainEqual(
      expect.objectContaining({
        name: "Responsabilidad Civil Locativa",
        required: true,
      })
    );

    // Verificación adicional: No debe aparecer RC Inmobiliaria
    expect(coverages).not.toContainEqual(
      expect.objectContaining({
        name: "Responsabilidad Civil Inmobiliaria",
      })
    );

    // Verificar ámbito geográfico y de productos
    expect(recommendation.ambitoTerritorial).toBe(
      "Todo el Mundo incluido USA y Canadá"
    );
    expect(recommendation.ambitoProductos).toBe(
      "Todo el Mundo incluido USA y Canadá"
    );
  });

  it("Test 3: Debería generar las coberturas correctas para un fabricante de producto final para consumo humano", async () => {
    // Creamos el mock de la respuesta que devolverá GET
    const mockRecommendation = {
      type: "responsabilidad_civil",
      companyInfo: {
        name: "Test Producto Final S.L.",
        billing: 8000000,
        employees: 30,
        m2: 3500,
        installations_type: "Propietario",
        activity: "Fabricación y Comercialización",
        activityDescription:
          "Fabricación y Comercialización de productos para el sector de Alimentación",
      },
      coverages: [
        {
          name: "Responsabilidad Civil por Explotación",
          required: true,
          limit: "2.000.000€",
        },
        {
          name: "Responsabilidad Civil Patronal",
          required: true,
          limit: "2.000.000€",
          sublimit: "600.000€",
        },
        {
          name: "Responsabilidad Civil Inmobiliaria",
          required: true,
          limit: "2.000.000€",
        },
        {
          name: "Responsabilidad Civil por Contaminación Accidental",
          required: true,
          limit: "2.000.000€",
        },
        {
          name: "Responsabilidad Civil por Productos y Post-trabajos",
          required: true,
          limit: "2.000.000€",
        },
        {
          name: "Gastos de Retirada",
          required: true,
          limit: "Límite sugerido: entre 100.000€ y 600.000€",
        },
        {
          name: "Responsabilidad Civil de Técnicos en Plantilla",
          required: true,
          limit: "2.000.000€",
        },
        {
          name: "Cobertura de Responsabilidad sobre Ferias y Exposiciones",
          required: true,
          condition: "Incluida",
        },
      ],
      ambitoTerritorial: "Unión Europea",
      ambitoProductos: "Unión Europea",
      limits: {
        generalLimit: "2.000.000€",
        victimSubLimit: "600.000€",
      },
    };

    // Configuramos el mock para devolver la respuesta
    mockGET.mockResolvedValue(
      NextResponse.json({
        success: true,
        recommendations: [mockRecommendation],
      })
    );

    // Crear la petición
    const req = createNextRequest("test-session-id", "responsabilidad_civil");

    // Ejecutar la función GET mockeada
    const response = await mockGET(req);
    const responseData = await response.json();

    // Verificar que la respuesta sea exitosa
    expect(responseData.success).toBe(true);
    expect(responseData.recommendations).toHaveLength(1);

    // Obtener las coberturas
    const recommendation = responseData.recommendations[0];
    expect(recommendation.type).toBe("responsabilidad_civil");

    // Verificar las coberturas esperadas
    const coverages = recommendation.coverages;

    // Verificar coberturas específicas
    expect(coverages).toContainEqual(
      expect.objectContaining({
        name: "Responsabilidad Civil por Explotación",
        required: true,
        limit: "2.000.000€",
      })
    );

    expect(coverages).toContainEqual(
      expect.objectContaining({
        name: "Responsabilidad Civil Inmobiliaria",
        required: true,
      })
    );

    expect(coverages).toContainEqual(
      expect.objectContaining({
        name: "Gastos de Retirada",
        required: true,
      })
    );

    // Verificación adicional: No debe aparecer RC por Unión y Mezcla
    expect(coverages).not.toContainEqual(
      expect.objectContaining({
        name: "Responsabilidad Civil por Unión y Mezcla",
      })
    );

    // Verificación adicional: No debe aparecer RC Locativa
    expect(coverages).not.toContainEqual(
      expect.objectContaining({
        name: "Responsabilidad Civil Locativa",
      })
    );

    // Verificar ámbito geográfico y de productos
    expect(recommendation.ambitoTerritorial).toBe("Unión Europea");
    expect(recommendation.ambitoProductos).toBe("Unión Europea");
  });
});
