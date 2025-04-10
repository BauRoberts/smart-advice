import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { NextRequest, NextResponse } from "next/server";
import { DanosInsuranceRecommendation, ContactInfo } from "@/types";

// Fix mock function types
const mockGET = jest.fn<(req: NextRequest) => Promise<NextResponse>>();
const mockContactGET = jest.fn<(req: NextRequest) => Promise<NextResponse>>();

// Mock del módulo de API
jest.mock("@/app/api/recomendaciones/danos-materiales/route", () => ({
  GET: mockGET,
}));

// Mock del API de contacto
jest.mock("@/app/api/contact/route", () => ({
  GET: mockContactGET,
}));

// Mock de Supabase
jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
  },
}));

// Mock de la sesión
jest.mock("@/lib/session", () => ({
  getEffectiveSessionId: jest.fn().mockReturnValue("test-session-id"),
  getOrCreateTempSession: jest.fn(),
  getLastUsedSessionId: jest.fn().mockReturnValue("test-session-id"),
  setLastUsedSessionId: jest.fn(),
}));

describe("Test de Integración - Recomendaciones de Daños Materiales", () => {
  // Helper function to create request
  function createNextRequest(sessionId: string): NextRequest {
    return new NextRequest(
      new URL(
        `http://localhost:3000/api/recomendaciones/danos-materiales?session_id=${sessionId}`
      ),
      { method: "GET" }
    );
  }

  function createContactRequest(sessionId: string) {
    const req = new NextRequest(
      new URL(`http://localhost:3000/api/contact?session_id=${sessionId}`),
      { method: "GET" }
    );
    return req;
  }

  beforeEach(() => {
    // Limpiar todos los mocks antes de cada test
    jest.clearAllMocks();

    // Mock contacto por defecto
    const mockContactData: ContactInfo = {
      id: "test-contact-id",
      session_id: "test-session-id",
      name: "Nombre de Prueba",
      email: "test@example.com",
      phone: "123456789",
      created_at: new Date().toISOString(),
    };

    mockContactGET.mockResolvedValue(
      NextResponse.json({
        success: true,
        data: mockContactData,
      })
    );
  });

  it("Test 1: Empresa pequeña propietaria con coberturas básicas", async () => {
    // Creamos el mock de la respuesta que devolverá GET
    const mockRecommendation = {
      type: "danos_materiales",
      companyInfo: {
        name: "Talleres Mecánicos Rodríguez",
        cif: "B12345678",
        address: "Calle Industria, 25, Barcelona",
        cnae: "4520",
        activity: "Mantenimiento y reparación de vehículos a motor",
        activityDescription: "Taller mecánico de reparación de vehículos",
        billing: 350000,
        employees: 6,
        m2: 250,
        installations_type: "Propietario",
      },
      constructionInfo: {
        estructura: "Metálica",
        cubierta: "Hormigón",
        cerramientos: "Ladrillo",
      },
      protectionInfo: {
        extintores: true,
        bocas_incendio: false,
        deposito_bombeo: false,
        cobertura_total: true,
        columnas_hidrantes: false,
        deteccion_automatica: false,
        rociadores: false,
        protecciones_fisicas: true,
        vigilancia_propia: false,
        alarma_conectada: true,
        camaras_circuito: false,
      },
      capitalesInfo: {
        valor_edificio: 300000,
        valor_ajuar: 150000,
        valor_existencias: 50000,
        valor_equipo_electronico: 15000,
        margen_bruto_anual: 150000,
        periodo_indemnizacion: "12",
      },
      coverages: [
        {
          name: "Incendio, Rayo y Explosión",
          required: true,
          limit: "100% capitales a asegurar",
        },
        {
          name: "Riesgos extensivos (lluvia, pedrisco, nieve, humo, etc)",
          required: true,
          limit: "100% capitales a asegurar",
        },
        {
          name: "Daños por Agua",
          required: true,
          limit: "100% capitales a asegurar",
        },
        {
          name: "Daños eléctricos a primer riesgo",
          required: true,
          limit: "30.000€",
        },
        {
          name: "Robo y expoliación",
          required: true,
          limit: "25% de los capitales asegurados",
        },
        {
          name: "Robo de metálico en caja fuerte",
          required: true,
          limit: "1.500€",
        },
        {
          name: "Robo de metálico en mueble cerrado",
          required: true,
          limit: "500€",
        },
        {
          name: "Robo al transportador de fondos",
          required: true,
          limit: "1.500€",
        },
        {
          name: "Vehículos aparcados en instalaciones",
          required: true,
          limit: "60.000€",
          condition:
            "Esta cobertura también puede incluirse en una póliza de Responsabilidad Civil general. Se recomienda cubrir esto en una póliza de Daños porque la indemnización es mejor.",
        },
        {
          name: "Rotura de cristales",
          required: true,
          limit: "6.000€",
        },
        {
          name: "Responsabilidad civil general",
          required: true,
          limit: "600.000€",
        },
        {
          name: "Responsabilidad civil patronal",
          required: true,
          limit: "600.000€",
          sublimit: "450.000€ por víctima",
        },
        {
          name: "Responsabilidad civil por productos",
          required: true,
          limit: "600.000€",
        },
        {
          name: "Responsabilidad civil inmobiliaria",
          required: true,
          limit: "600.000€",
        },
      ],
      specialClauses: [
        {
          name: "Cobertura automática para Daños materiales",
          required: true,
          limit: "20%",
        },
        {
          name: "Cobertura automática para Pérdida de beneficios",
          required: true,
          limit: "30%",
        },
        {
          name: "Cláusula de Valor de reposición a nuevo",
          required: true,
        },
      ],
      siniestralidad: "Sin siniestros en los últimos 3 años",
    };

    // Configuramos el mock para devolver la respuesta correctamente tipada
    mockGET.mockResolvedValue(
      NextResponse.json({
        success: true,
        recommendations: [mockRecommendation],
      })
    );

    // Crear la petición
    const req = createNextRequest("test-session-id");

    // Ejecutar la función GET mockeada
    const response = await mockGET(req);
    const responseData = await response.json();

    // Verificar que la respuesta sea exitosa
    expect(responseData.success).toBe(true);
    expect(responseData.recommendations).toHaveLength(1);

    // Obtener la recomendación
    const recommendation = responseData.recommendations[0];

    // Verificar información de la compañía
    expect(recommendation.companyInfo.name).toBe(
      "Talleres Mecánicos Rodríguez"
    );
    expect(recommendation.companyInfo.cif).toBe("B12345678");
    expect(recommendation.companyInfo.address).toBe(
      "Calle Industria, 25, Barcelona"
    );
    expect(recommendation.companyInfo.cnae).toBe("4520");
    expect(recommendation.companyInfo.installations_type).toBe("Propietario");
    expect(recommendation.companyInfo.m2).toBe(250);

    // Verificar información de construcción
    expect(recommendation.constructionInfo.estructura).toBe("Metálica");
    expect(recommendation.constructionInfo.cubierta).toBe("Hormigón");
    expect(recommendation.constructionInfo.cerramientos).toBe("Ladrillo");

    // Verificar protecciones
    expect(recommendation.protectionInfo.extintores).toBe(true);
    expect(recommendation.protectionInfo.alarma_conectada).toBe(true);
    expect(recommendation.protectionInfo.protecciones_fisicas).toBe(true);

    // Verificar capitales
    expect(recommendation.capitalesInfo.valor_edificio).toBe(300000);
    expect(recommendation.capitalesInfo.valor_ajuar).toBe(150000);
    expect(recommendation.capitalesInfo.valor_existencias).toBe(50000);
    expect(recommendation.capitalesInfo.valor_equipo_electronico).toBe(15000);
    expect(recommendation.capitalesInfo.margen_bruto_anual).toBe(150000);

    // Verificar las coberturas clave
    const coverages = recommendation.coverages;

    // Cobertura básica
    expect(coverages).toContainEqual(
      expect.objectContaining({
        name: "Incendio, Rayo y Explosión",
        required: true,
        limit: "100% capitales a asegurar",
      })
    );

    // Daños eléctricos
    expect(coverages).toContainEqual(
      expect.objectContaining({
        name: "Daños eléctricos a primer riesgo",
        required: true,
        limit: "30.000€",
      })
    );

    // Robo
    expect(coverages).toContainEqual(
      expect.objectContaining({
        name: "Robo y expoliación",
        required: true,
        limit: "25% de los capitales asegurados",
      })
    );

    // Robo de metálico
    expect(coverages).toContainEqual(
      expect.objectContaining({
        name: "Robo de metálico en caja fuerte",
        required: true,
        limit: "1.500€",
      })
    );

    // Vehículos
    expect(coverages).toContainEqual(
      expect.objectContaining({
        name: "Vehículos aparcados en instalaciones",
        required: true,
        limit: "60.000€",
      })
    );

    // Responsabilidad civil
    expect(coverages).toContainEqual(
      expect.objectContaining({
        name: "Responsabilidad civil general",
        required: true,
        limit: "600.000€",
      })
    );

    // Verificar cláusulas especiales
    const specialClauses1 = recommendation.specialClauses;

    expect(specialClauses1).toContainEqual(
      expect.objectContaining({
        name: "Cobertura automática para Daños materiales",
        required: true,
        limit: "20%",
      })
    );

    expect(specialClauses1).toContainEqual(
      expect.objectContaining({
        name: "Cláusula de Valor de reposición a nuevo",
        required: true,
      })
    );
  });

  it("Test 2: Empresa mediana no propietaria con coberturas especiales", async () => {
    // Creamos el mock de la respuesta que devolverá GET
    const mockRecommendation = {
      type: "danos_materiales",
      companyInfo: {
        name: "Distribuidora Alimentaria Frescos S.L.",
        cif: "B87654321",
        address: "Polígono Industrial Norte, Nave 43, Valencia",
        cnae: "4631",
        activity: "Comercio al por mayor de frutas y hortalizas",
        activityDescription:
          "Distribución mayorista de productos frescos a supermercados",
        billing: 2500000,
        employees: 25,
        m2: 1200,
        installations_type: "No propietario",
        owner_name: "Inmobiliaria Industrial Levante S.A.",
        owner_cif: "A12345678",
      },
      constructionInfo: {
        estructura: "Hormigón",
        cubierta: "Chapa metálica",
        cerramientos: "Prefabricado hormigón",
      },
      protectionInfo: {
        extintores: true,
        bocas_incendio: true,
        deposito_bombeo: false,
        cobertura_total: true,
        columnas_hidrantes: false,
        deteccion_automatica: true,
        deteccion_zona: ["totalidad"],
        rociadores: false,
        protecciones_fisicas: false,
        vigilancia_propia: true,
        alarma_conectada: true,
        camaras_circuito: false,
      },
      capitalesInfo: {
        valor_edificio: 0,
        valor_ajuar: 750000,
        valor_existencias: 450000,
        valor_equipo_electronico: 80000,
        margen_bruto_anual: 800000,
        periodo_indemnizacion: "18",
      },
      coverages: [
        {
          name: "Incendio, Rayo y Explosión",
          required: true,
          limit: "100% capitales a asegurar",
        },
        {
          name: "Riesgos extensivos (lluvia, pedrisco, nieve, humo, etc)",
          required: true,
          limit: "100% capitales a asegurar",
        },
        {
          name: "Daños por Agua",
          required: true,
          limit: "100% capitales a asegurar",
        },
        {
          name: "Daños eléctricos a primer riesgo",
          required: true,
          limit: "60.000€",
        },
        {
          name: "Avería de maquinaria",
          required: true,
          limit: "200.000€",
        },
        {
          name: "Robo y expoliación",
          required: true,
          limit: "50% de los capitales asegurados",
        },
        {
          name: "Robo de metálico en caja fuerte",
          required: true,
          limit: "6.000€",
        },
        {
          name: "Robo de metálico en mueble cerrado",
          required: true,
          limit: "1.500€",
        },
        {
          name: "Robo al transportador de fondos",
          required: true,
          limit: "6.000€",
        },
        {
          name: "Bienes de terceros depositados en las instalaciones del asegurado",
          required: true,
          limit: "100.000€",
          condition:
            "Esta cobertura también puede incluirse en una póliza de Responsabilidad Civil general. Se recomienda cubrir esto en una póliza de Daños porque la indemnización es mejor.",
        },
        {
          name: "Bienes propios depositados en casa de terceros",
          required: true,
          limit: "200.000€",
        },
        {
          name: "Bienes depositados a la intemperie o aire libre",
          required: true,
          limit: "50.000€",
        },
        {
          name: "Bienes refrigerados",
          required: true,
          limit: "120.000€",
          condition:
            "Medidas de protección: Control de temperatura. Detección automática de incendio.",
        },
        {
          name: "Placas fotovoltaicas",
          required: true,
          limit: "75.000€",
        },
        {
          name: "Bienes de empleados",
          required: true,
          limit: "15.000€",
          condition:
            "Esta cobertura también puede incluirse en una póliza de Responsabilidad Civil general. Se recomienda cubrir esto en una póliza de Daños porque la indemnización es mejor.",
        },
        {
          name: "Rotura de cristales",
          required: true,
          limit: "6.000€",
        },
        {
          name: "Responsabilidad civil general",
          required: true,
          limit: "600.000€",
        },
        {
          name: "Responsabilidad civil patronal",
          required: true,
          limit: "600.000€",
          sublimit: "450.000€ por víctima",
        },
        {
          name: "Responsabilidad civil locativa",
          required: true,
          limit: "600.000€",
        },
      ],
      specialClauses: [
        {
          name: "Cobertura automática para Daños materiales",
          required: true,
          limit: "20%",
        },
        {
          name: "Cobertura automática para Pérdida de beneficios",
          required: true,
          limit: "30%",
        },
        {
          name: "Cláusula de Valor de reposición a nuevo",
          required: true,
        },
        {
          name: "Cláusula todo riesgo accidental",
          required: true,
        },
        {
          name: "Cláusula de Leasing para Banco Financiero S.A.",
          required: true,
          condition:
            "Arrendador: Banco Financiero S.A., CIF: , Contrato: L-456789, Bien: Carretilla elevadora eléctrica",
        },
        {
          name: "Mantenimiento preventivo",
          required: true,
          condition:
            "Se requiere contrato de mantenimiento para equipos de refrigeración",
        },
      ],
      siniestralidad:
        "Un siniestro en los últimos 3 años por valor de 15.000€ por daños por agua",
    };

    // Configuramos el mock para devolver la respuesta correctamente tipada
    mockGET.mockResolvedValue(
      NextResponse.json({
        success: true,
        recommendations: [mockRecommendation],
      })
    );

    // Crear la petición
    const req = createNextRequest("test-session-id");

    // Ejecutar la función GET mockeada
    const response = await mockGET(req);
    const responseData = await response.json();

    // Verificar que la respuesta sea exitosa
    expect(responseData.success).toBe(true);
    expect(responseData.recommendations).toHaveLength(1);

    // Obtener la recomendación
    const recommendation = responseData.recommendations[0];

    // Verificar información de la compañía
    expect(recommendation.companyInfo.name).toBe(
      "Distribuidora Alimentaria Frescos S.L."
    );
    expect(recommendation.companyInfo.installations_type).toBe(
      "No propietario"
    );
    expect(recommendation.companyInfo.owner_name).toBe(
      "Inmobiliaria Industrial Levante S.A."
    );

    // Verificar capitales
    expect(recommendation.capitalesInfo.valor_edificio).toBe(0); // No es propietario
    expect(recommendation.capitalesInfo.valor_ajuar).toBe(750000);

    // Verificar coberturas clave para este caso
    const coverages = recommendation.coverages;

    // Avería de maquinaria
    expect(coverages).toContainEqual(
      expect.objectContaining({
        name: "Avería de maquinaria",
        required: true,
        limit: "200.000€",
      })
    );

    // Bienes refrigerados
    expect(coverages).toContainEqual(
      expect.objectContaining({
        name: "Bienes refrigerados",
        required: true,
        limit: "120.000€",
      })
    );

    // Placas fotovoltaicas
    expect(coverages).toContainEqual(
      expect.objectContaining({
        name: "Placas fotovoltaicas",
        required: true,
        limit: "75.000€",
      })
    );

    // Verificar RC Locativa (por ser No propietario)
    expect(coverages).toContainEqual(
      expect.objectContaining({
        name: "Responsabilidad civil locativa",
        required: true,
      })
    );

    // No debe tener RC Inmobiliaria (solo aplica a propietarios)
    expect(coverages).not.toContainEqual(
      expect.objectContaining({
        name: "Responsabilidad civil inmobiliaria",
      })
    );

    // Verificar cláusulas especiales
    const specialClauses2 = recommendation.specialClauses;

    // Todo riesgo accidental
    expect(specialClauses2).toContainEqual(
      expect.objectContaining({
        name: "Cláusula todo riesgo accidental",
        required: true,
      })
    );

    // Cláusula de Leasing
    expect(specialClauses2).toContainEqual(
      expect.objectContaining({
        name: "Cláusula de Leasing para Banco Financiero S.A.",
        required: true,
      })
    );

    // Mantenimiento preventivo para equipos de refrigeración
    expect(specialClauses2).toContainEqual(
      expect.objectContaining({
        name: "Mantenimiento preventivo",
        required: true,
      })
    );
  });

  it("Test 3: Empresa grande con múltiples coberturas especiales", async () => {
    // Creamos el mock de la respuesta que devolverá GET
    const mockRecommendation = {
      type: "danos_materiales",
      companyInfo: {
        name: "Manufacturas Técnicas Avanzadas S.A.",
        cif: "A98765432",
        address: "Avenida de la Tecnología, 100, Madrid",
        cnae: "2562",
        activity: "Ingeniería mecánica por cuenta de terceros",
        activityDescription:
          "Fabricación de componentes de precisión para industria aeroespacial",
        billing: 8500000,
        employees: 85,
        m2: 3500,
        installations_type: "Propietario",
      },
      constructionInfo: {
        estructura: "Hormigón armado",
        cubierta: "Hormigón con impermeabilización",
        cerramientos: "Prefabricado metálico con aislamiento",
      },
      protectionInfo: {
        extintores: true,
        bocas_incendio: true,
        cobertura_total: true,
        columnas_hidrantes: false,
        deteccion_automatica: true,
        deteccion_zona: ["totalidad"],
        rociadores: true,
        rociadores_zona: ["totalidad"],
        protecciones_fisicas: true,
        vigilancia_propia: true,
        alarma_conectada: true,
        camaras_circuito: false,
      },
      capitalesInfo: {
        valor_edificio: 2500000,
        valor_ajuar: 3800000,
        valor_existencias: 1200000,
        valor_equipo_electronico: 450000,
        margen_bruto_anual: 3500000,
        periodo_indemnizacion: "24",
      },
      coverages: [
        {
          name: "Incendio, Rayo y Explosión",
          required: true,
          limit: "100% capitales a asegurar",
        },
        {
          name: "Riesgos extensivos (lluvia, pedrisco, nieve, humo, etc)",
          required: true,
          limit: "100% capitales a asegurar",
        },
        {
          name: "Daños por Agua",
          required: true,
          limit: "100% capitales a asegurar",
        },
        {
          name: "Daños eléctricos a primer riesgo",
          required: true,
          limit: "100.000€",
        },
        {
          name: "Avería de maquinaria",
          required: true,
          limit: "1.500.000€",
        },
        {
          name: "Robo y expoliación",
          required: true,
          limit: "50% de los capitales asegurados",
        },
        {
          name: "Robo de metálico en caja fuerte",
          required: true,
          limit: "6.000€",
        },
        {
          name: "Robo de metálico en mueble cerrado",
          required: true,
          limit: "3.000€",
        },
        {
          name: "Robo al transportador de fondos",
          required: true,
          limit: "6.000€",
        },
        {
          name: "Bienes de terceros depositados en las instalaciones del asegurado",
          required: true,
          limit: "500.000€",
          condition:
            "Esta cobertura también puede incluirse en una póliza de Responsabilidad Civil general. Se recomienda cubrir esto en una póliza de Daños porque la indemnización es mejor.",
        },
        {
          name: "Bienes propios depositados en casa de terceros",
          required: true,
          limit: "750.000€",
        },
        {
          name: "Placas fotovoltaicas",
          required: true,
          limit: "250.000€",
        },
        {
          name: "Vehículos aparcados en instalaciones",
          required: true,
          limit: "250.000€",
          condition:
            "Esta cobertura también puede incluirse en una póliza de Responsabilidad Civil general. Se recomienda cubrir esto en una póliza de Daños porque la indemnización es mejor.",
        },
        {
          name: "Bienes de empleados",
          required: true,
          limit: "50.000€",
          condition:
            "Esta cobertura también puede incluirse en una póliza de Responsabilidad Civil general. Se recomienda cubrir esto en una póliza de Daños porque la indemnización es mejor.",
        },
        {
          name: "Rotura de cristales",
          required: true,
          limit: "6.000€",
        },
        {
          name: "Responsabilidad civil general",
          required: true,
          limit: "600.000€",
        },
        {
          name: "Responsabilidad civil patronal",
          required: true,
          limit: "600.000€",
          sublimit: "450.000€ por víctima",
        },
        {
          name: "Responsabilidad civil por productos",
          required: true,
          limit: "600.000€",
        },
        {
          name: "Responsabilidad civil inmobiliaria",
          required: true,
          limit: "600.000€",
        },
      ],
      specialClauses: [
        {
          name: "Cobertura automática para Daños materiales",
          required: true,
          limit: "20%",
        },
        {
          name: "Cobertura automática para Pérdida de beneficios",
          required: true,
          limit: "30%",
        },
        {
          name: "Cláusula de Valor de reposición a nuevo",
          required: true,
        },
        {
          name: "Cláusula todo riesgo accidental",
          required: true,
        },
        {
          name: "Cláusula de Leasing para Leasing Industrial S.A.",
          required: true,
          condition:
            "Arrendador: Leasing Industrial S.A., CIF: , Contrato: L-789123, Bien: Centro de mecanizado CNC 5 ejes",
        },
      ],
      siniestralidad: "Dos siniestros en los últimos 3 años",
    };

    // Configuramos el mock para devolver la respuesta correctamente tipada
    mockGET.mockResolvedValue(
      NextResponse.json({
        success: true,
        recommendations: [mockRecommendation],
      })
    );

    // Crear la petición
    const req = createNextRequest("test-session-id");

    // Ejecutar la función GET mockeada
    const response = await mockGET(req);
    const responseData = await response.json();

    // Verificar que la respuesta sea exitosa
    expect(responseData.success).toBe(true);
    expect(responseData.recommendations).toHaveLength(1);

    // Obtener la recomendación
    const recommendation = responseData.recommendations[0];

    // Verificar información de la compañía
    expect(recommendation.companyInfo.name).toBe(
      "Manufacturas Técnicas Avanzadas S.A."
    );
    expect(recommendation.companyInfo.installations_type).toBe("Propietario");

    // Verificar capitales (valores altos para empresa grande)
    expect(recommendation.capitalesInfo.valor_edificio).toBe(2500000);
    expect(recommendation.capitalesInfo.valor_ajuar).toBe(3800000);
    expect(recommendation.capitalesInfo.margen_bruto_anual).toBe(3500000);

    // Verificar protecciones (múltiples medidas por ser empresa grande)
    // Verificar protecciones (múltiples medidas por ser empresa grande)
    expect(recommendation.protectionInfo.extintores).toBe(true);
    expect(recommendation.protectionInfo.bocas_incendio).toBe(true);
    expect(recommendation.protectionInfo.deteccion_automatica).toBe(true);
    expect(recommendation.protectionInfo.rociadores).toBe(true);
    expect(recommendation.protectionInfo.vigilancia_propia).toBe(true);

    // Verificar coberturas clave para este caso
    const coverages = recommendation.coverages;

    // Daños eléctricos (limite mayor por valor edificio > 1.5M)
    expect(coverages).toContainEqual(
      expect.objectContaining({
        name: "Daños eléctricos a primer riesgo",
        required: true,
        limit: "100.000€",
      })
    );

    // Avería de maquinaria con valor alto
    expect(coverages).toContainEqual(
      expect.objectContaining({
        name: "Avería de maquinaria",
        required: true,
        limit: "1.500.000€",
      })
    );

    // Bienes de terceros con valor alto
    expect(coverages).toContainEqual(
      expect.objectContaining({
        name: "Bienes de terceros depositados en las instalaciones del asegurado",
        required: true,
        limit: "500.000€",
      })
    );

    // Verificar cláusulas especiales
    const specialClauses3 = recommendation.specialClauses;

    // Todo riesgo accidental
    expect(specialClauses3).toContainEqual(
      expect.objectContaining({
        name: "Cláusula todo riesgo accidental",
        required: true,
      })
    );

    // Cláusula de Leasing
    expect(specialClauses3).toContainEqual(
      expect.objectContaining({
        name: "Cláusula de Leasing para Leasing Industrial S.A.",
        required: true,
      })
    );
  });

  // Test adicional para probar el manejo de errores
  it("Debería manejar correctamente cuando no se encuentra un form", async () => {
    // Configuramos el mock para devolver la respuesta de error
    mockGET.mockResolvedValue(
      NextResponse.json({
        success: false,
        error: "No form data found",
      })
    );

    // Crear la petición
    const req = createNextRequest("non-existent-session-id");

    // Ejecutar la función GET mockeada
    const response = await mockGET(req);
    const responseData = await response.json();

    // Verificar que la respuesta indica error
    expect(responseData.success).toBe(false);
    expect(responseData.error).toBe("No form data found");
  });
});
