// lib/services/cnaeService.ts

// Interfaz para las opciones de CNAE
export interface CnaeOption {
  code: string;
  description: string;
  section?: string; // Sección a la que pertenece (A, B, C, etc.)
  tipo?: 'manufactura' | 'servicios'; // Clasificación para el formulario
}

// Add some example manufacturing CNAE codes
const CNAE_CODES: CnaeOption[] = [
  // Manufacturing (Manufactura)
  {
    code: "1071",
    description: "Fabricación de pan y de productos frescos de panadería y pastelería",
    section: "C",
    tipo: "manufactura"
  },
  {
    code: "1089",
    description: "Elaboración de otros productos alimenticios",
    section: "C",
    tipo: "manufactura"
  },
  {
    code: "2041",
    description: "Fabricación de jabones y detergentes",
    section: "C",
    tipo: "manufactura"
  },
  {
    code: "2042",
    description: "Fabricación de perfumes y cosméticos",
    section: "C",
    tipo: "manufactura"
  },
  {
    code: "2511",
    description: "Fabricación de estructuras metálicas",
    section: "C",
    tipo: "manufactura"
  },
  // Services (Servicios)
  {
    code: "6201",
    description: "Servicios de programación informática",
    section: "J",
    tipo: "servicios"
  },
  {
    code: "6202",
    description: "Consultoría informática",
    section: "J",
    tipo: "servicios"
  }
  // ... add more as needed
];

// Lista completa de códigos CNAE (puedes expandir esta lista según sea necesario)
const cnaeOptions: CnaeOption[] = [
  // SECCIÓN A: AGRICULTURA, GANADERÍA, SILVICULTURA Y PESCA
  { code: "0111", description: "Cultivo de cereales (excepto arroz), leguminosas y semillas oleaginosas", section: "A" },
  { code: "0112", description: "Cultivo de arroz", section: "A" },
  { code: "0113", description: "Cultivo de hortalizas, raíces y tubérculos", section: "A" },
  { code: "0114", description: "Cultivo de caña de azúcar", section: "A" },
  { code: "0115", description: "Cultivo de tabaco", section: "A" },
  { code: "0116", description: "Cultivo de plantas para fibras textiles", section: "A" },
  { code: "0119", description: "Otros cultivos no perennes", section: "A" },
  { code: "0121", description: "Cultivo de la vid", section: "A" },
  { code: "0122", description: "Cultivo de frutos tropicales y subtropicales", section: "A" },
  { code: "0123", description: "Cultivo de cítricos", section: "A" },
  
  // SECCIÓN C: INDUSTRIA MANUFACTURERA
  { code: "1011", description: "Procesado y conservación de carne", section: "C" },
  { code: "1012", description: "Procesado y conservación de volatería", section: "C" },
  { code: "1013", description: "Elaboración de productos cárnicos y de volatería", section: "C" },
  { code: "1021", description: "Procesado de pescados, crustáceos y moluscos", section: "C" },
  
  // SECCIÓN F: CONSTRUCCIÓN
  { code: "4110", description: "Promoción inmobiliaria", section: "F" },
  { code: "4121", description: "Construcción de edificios residenciales", section: "F" },
  { code: "4122", description: "Construcción de edificios no residenciales", section: "F" },
  { code: "4211", description: "Construcción de carreteras y autopistas", section: "F" },
  { code: "4212", description: "Construcción de vías férreas de superficie y subterráneas", section: "F" },
  
  // SECCIÓN G: COMERCIO AL POR MAYOR Y AL POR MENOR
  { code: "4511", description: "Venta de automóviles y vehículos de motor ligeros", section: "G" },
  { code: "4519", description: "Venta de otros vehículos de motor", section: "G" },
  { code: "4520", description: "Mantenimiento y reparación de vehículos de motor", section: "G" },
  
  // SECCIÓN J: INFORMACIÓN Y COMUNICACIONES
  { code: "5811", description: "Edición de libros", section: "J" },
  { code: "5812", description: "Edición de directorios y guías de direcciones postales", section: "J" },
  { code: "5813", description: "Edición de periódicos", section: "J" },
  { code: "5814", description: "Edición de revistas", section: "J" },
  { code: "5819", description: "Otras actividades editoriales", section: "J" },
  { code: "5821", description: "Edición de videojuegos", section: "J" },
  { code: "5829", description: "Edición de otros programas informáticos", section: "J" },
  { code: "6201", description: "Actividades de programación informática", section: "J" },
  { code: "6202", description: "Actividades de consultoría informática", section: "J" },
  { code: "6203", description: "Gestión de recursos informáticos", section: "J" },
  { code: "6209", description: "Otros servicios relacionados con las tecnologías de la información", section: "J" },
  
  // SECCIÓN M: ACTIVIDADES PROFESIONALES, CIENTÍFICAS Y TÉCNICAS
  { code: "6910", description: "Actividades jurídicas", section: "M" },
  { code: "6920", description: "Actividades de contabilidad, teneduría de libros, auditoría y asesoría fiscal", section: "M" },
  { code: "7010", description: "Actividades de las sedes centrales", section: "M" },
  { code: "7021", description: "Relaciones públicas y comunicación", section: "M" },
  { code: "7022", description: "Otras actividades de consultoría de gestión empresarial", section: "M" },
  { code: "7111", description: "Servicios técnicos de arquitectura", section: "M" },
  { code: "7112", description: "Servicios técnicos de ingeniería y otras actividades relacionadas", section: "M" },
  { code: "7120", description: "Ensayos y análisis técnicos", section: "M" },
  { code: "7311", description: "Agencias de publicidad", section: "M" },
  { code: "7312", description: "Servicios de representación de medios de comunicación", section: "M" },
  
  // SECCIÓN K: ACTIVIDADES FINANCIERAS Y DE SEGUROS
  { code: "6411", description: "Banco central", section: "K" },
  { code: "6419", description: "Otra intermediación monetaria", section: "K" },
  { code: "6420", description: "Actividades de las sociedades holding", section: "K" },
  { code: "6430", description: "Inversión colectiva, fondos y entidades financieras similares", section: "K" },
  { code: "6491", description: "Arrendamiento financiero", section: "K" },
  { code: "6492", description: "Otras actividades crediticias", section: "K" },
  { code: "6512", description: "Seguros distintos de los seguros de vida", section: "K" },
  { code: "6520", description: "Reaseguros", section: "K" },
  { code: "6622", description: "Actividades de agentes y corredores de seguros", section: "K" },
];

// Función para obtener todos los códigos CNAE
export function getAllCnaeCodes(): CnaeOption[] {
  return cnaeOptions;
}

// Función para buscar códigos CNAE que coincidan con un término de búsqueda
export function searchCnaeCodes(query: string): CnaeOption[] {
  const searchTerm = query.toLowerCase();
  return CNAE_CODES.filter(option => 
    option.code.includes(searchTerm) || 
    option.description.toLowerCase().includes(searchTerm)
  );
}

// Función para obtener un código CNAE por su código
export function getCnaeByCode(code: string): CnaeOption | null {
  return CNAE_CODES.find(option => option.code === code) || null;
}

// Función para obtener códigos CNAE por sección
export function getCnaeBySection(section: string): CnaeOption[] {
  return cnaeOptions.filter(option => option.section === section);
}

// Función para obtener códigos CNAE por tipo (manufactura o servicios)
export function getCnaeByTipo(tipo: 'manufactura' | 'servicios'): CnaeOption[] {
  return cnaeOptions.filter(option => option.tipo === tipo);
}

// Función para obtener todas las secciones disponibles
export function getAllSections(): string[] {
  const sections = new Set(cnaeOptions.map(option => option.section || ''));
  return Array.from(sections).filter(s => s !== '').sort();
}

export function determineEmpresaTipo(code: string): 'manufactura' | 'servicios' | null {
  const codeNum = parseInt(code.substring(0, 2));
  // Manufacturing codes are typically between 10-33
  return (codeNum >= 10 && codeNum <= 33) ? 'manufactura' : 'servicios';
}