// lib/services/cnaeService.ts

// Interfaz para las opciones de CNAE
export interface CnaeOption {
  code: string;
  description: string;
  section?: string; // Sección a la que pertenece (A, B, C, etc.)
  tipo?: "manufactura" | "servicios"; // Clasificación para el formulario
}

// Expanded CNAE codes array for searching
const CNAE_CODES: CnaeOption[] = [
  // SECCIÓN A: AGRICULTURA, GANADERÍA, SILVICULTURA Y PESCA
  {
    code: "0111",
    description:
      "Cultivo de cereales (excepto arroz), leguminosas y semillas oleaginosas",
    section: "A",
    tipo: "servicios",
  },
  {
    code: "0112",
    description: "Cultivo de arroz",
    section: "A",
    tipo: "servicios",
  },
  {
    code: "0113",
    description: "Cultivo de hortalizas, raíces y tubérculos",
    section: "A",
    tipo: "servicios",
  },
  {
    code: "0121",
    description: "Cultivo de la vid",
    section: "A",
    tipo: "servicios",
  },
  {
    code: "0123",
    description: "Cultivo de cítricos",
    section: "A",
    tipo: "servicios",
  },
  {
    code: "0161",
    description: "Actividades de apoyo a la agricultura",
    section: "A",
    tipo: "servicios",
  },
  {
    code: "0210",
    description: "Silvicultura y otras actividades forestales",
    section: "A",
    tipo: "servicios",
  },

  // SECCIÓN C: INDUSTRIA MANUFACTURERA
  {
    code: "1011",
    description: "Procesado y conservación de carne",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "1013",
    description: "Elaboración de productos cárnicos y de volatería",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "1021",
    description: "Procesado de pescados, crustáceos y moluscos",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "1031",
    description: "Procesado y conservación de patatas",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "1032",
    description: "Elaboración de zumos de frutas y hortalizas",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "1039",
    description: "Otro procesado y conservación de frutas y hortalizas",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "1042",
    description: "Fabricación de margarina y grasas comestibles similares",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "1052",
    description: "Elaboración de helados",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "1071",
    description:
      "Fabricación de pan y de productos frescos de panadería y pastelería",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "1072",
    description:
      "Fabricación de galletas y productos de panadería y pastelería de larga duración",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "1073",
    description:
      "Fabricación de pastas alimenticias, cuscús y productos similares",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "1082",
    description: "Fabricación de cacao, chocolate y productos de confitería",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "1083",
    description: "Elaboración de café, té e infusiones",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "1084",
    description: "Elaboración de especias, salsas y condimentos",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "1085",
    description: "Elaboración de platos y comidas preparados",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "1086",
    description:
      "Elaboración de preparados alimenticios homogeneizados y alimentos dietéticos",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "1089",
    description: "Elaboración de otros productos alimenticios",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "1101",
    description: "Destilación, rectificación y mezcla de bebidas alcohólicas",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "1102",
    description: "Elaboración de vinos",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "1107",
    description:
      "Fabricación de bebidas no alcohólicas; producción de aguas minerales y otras aguas embotelladas",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "1310",
    description: "Preparación e hilado de fibras textiles",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "1320",
    description: "Fabricación de tejidos textiles",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "1330",
    description: "Acabado de textiles",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "1392",
    description:
      "Fabricación de artículos confeccionados con textiles, excepto prendas de vestir",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "1393",
    description: "Fabricación de alfombras y moquetas",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "1413",
    description: "Confección de otras prendas de vestir exteriores",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "1414",
    description: "Confección de ropa interior",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "1511",
    description:
      "Preparación, curtido y acabado del cuero; preparación y teñido de pieles",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "1512",
    description:
      "Fabricación de artículos de marroquinería, viaje y de guarnicionería y talabartería",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "1520",
    description: "Fabricación de calzado",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "1629",
    description:
      "Fabricación de otros productos de madera; artículos de corcho, cestería y espartería",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "1721",
    description:
      "Fabricación de papel y cartón ondulados; fabricación de envases y embalajes de papel y cartón",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "1812",
    description: "Otras actividades de impresión y artes gráficas",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2041",
    description: "Fabricación de jabones y detergentes",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2042",
    description: "Fabricación de perfumes y cosméticos",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2222",
    description: "Fabricación de envases y embalajes de plástico",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2223",
    description: "Fabricación de productos de plástico para la construcción",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2511",
    description: "Fabricación de estructuras metálicas",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2512",
    description: "Fabricación de carpintería metálica",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2550",
    description:
      "Forja, estampación y embutición de metales; metalurgia de polvos",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2561",
    description: "Tratamiento y revestimiento de metales",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2562",
    description: "Ingeniería mecánica por cuenta de terceros",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2573",
    description: "Fabricación de herramientas",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2593",
    description: "Fabricación de productos de alambre, cadenas y muelles",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2611",
    description: "Fabricación de componentes electrónicos",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2620",
    description: "Fabricación de ordenadores y equipos periféricos",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2630",
    description: "Fabricación de equipos de telecomunicaciones",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2651",
    description:
      "Fabricación de instrumentos y aparatos de medida, verificación y navegación",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2711",
    description:
      "Fabricación de motores, generadores y transformadores eléctricos",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2751",
    description: "Fabricación de electrodomésticos",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2920",
    description:
      "Fabricación de carrocerías para vehículos de motor; fabricación de remolques",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "3101",
    description:
      "Fabricación de muebles de oficina y de establecimientos comerciales",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "3102",
    description: "Fabricación de muebles de cocina",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "3103",
    description: "Fabricación de colchones",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "3109",
    description: "Fabricación de otros muebles",
    section: "C",
    tipo: "manufactura",
  },

  // SECCIÓN D: SUMINISTRO DE ENERGÍA
  {
    code: "3512",
    description: "Transporte de energía eléctrica",
    section: "D",
    tipo: "servicios",
  },
  {
    code: "3513",
    description: "Distribución de energía eléctrica",
    section: "D",
    tipo: "servicios",
  },
  {
    code: "3514",
    description: "Comercio de energía eléctrica",
    section: "D",
    tipo: "servicios",
  },
  {
    code: "3522",
    description: "Distribución por tubería de combustibles gaseosos",
    section: "D",
    tipo: "servicios",
  },

  // SECCIÓN E: SUMINISTRO DE AGUA, SANEAMIENTO
  {
    code: "3600",
    description: "Captación, depuración y distribución de agua",
    section: "E",
    tipo: "servicios",
  },
  {
    code: "3811",
    description: "Recogida de residuos no peligrosos",
    section: "E",
    tipo: "servicios",
  },
  {
    code: "3821",
    description: "Tratamiento y eliminación de residuos no peligrosos",
    section: "E",
    tipo: "servicios",
  },
  {
    code: "3900",
    description:
      "Actividades de descontaminación y otros servicios de gestión de residuos",
    section: "E",
    tipo: "servicios",
  },

  // SECCIÓN F: CONSTRUCCIÓN
  {
    code: "4110",
    description: "Promoción inmobiliaria",
    section: "F",
    tipo: "servicios",
  },
  {
    code: "4121",
    description: "Construcción de edificios residenciales",
    section: "F",
    tipo: "servicios",
  },
  {
    code: "4122",
    description: "Construcción de edificios no residenciales",
    section: "F",
    tipo: "servicios",
  },
  {
    code: "4211",
    description: "Construcción de carreteras y autopistas",
    section: "F",
    tipo: "servicios",
  },
  {
    code: "4213",
    description: "Construcción de puentes y túneles",
    section: "F",
    tipo: "servicios",
  },
  {
    code: "4221",
    description: "Construcción de redes para fluidos",
    section: "F",
    tipo: "servicios",
  },
  {
    code: "4222",
    description: "Construcción de redes eléctricas y de telecomunicaciones",
    section: "F",
    tipo: "servicios",
  },
  {
    code: "4312",
    description: "Preparación de terrenos",
    section: "F",
    tipo: "servicios",
  },
  {
    code: "4321",
    description: "Instalaciones eléctricas",
    section: "F",
    tipo: "servicios",
  },
  {
    code: "4322",
    description:
      "Fontanería, instalaciones de sistemas de calefacción y aire acondicionado",
    section: "F",
    tipo: "servicios",
  },
  {
    code: "4329",
    description: "Otras instalaciones en obras de construcción",
    section: "F",
    tipo: "servicios",
  },
  {
    code: "4331",
    description: "Revocamiento",
    section: "F",
    tipo: "servicios",
  },
  {
    code: "4332",
    description: "Instalación de carpintería",
    section: "F",
    tipo: "servicios",
  },
  {
    code: "4333",
    description: "Revestimiento de suelos y paredes",
    section: "F",
    tipo: "servicios",
  },
  {
    code: "4334",
    description: "Pintura y acristalamiento",
    section: "F",
    tipo: "servicios",
  },
  {
    code: "4339",
    description: "Otro acabado de edificios",
    section: "F",
    tipo: "servicios",
  },
  {
    code: "4391",
    description: "Construcción de cubiertas",
    section: "F",
    tipo: "servicios",
  },
  {
    code: "4399",
    description: "Otras actividades de construcción especializada",
    section: "F",
    tipo: "servicios",
  },

  // SECCIÓN G: COMERCIO AL POR MAYOR Y AL POR MENOR
  {
    code: "4511",
    description: "Venta de automóviles y vehículos de motor ligeros",
    section: "G",
    tipo: "servicios",
  },
  {
    code: "4519",
    description: "Venta de otros vehículos de motor",
    section: "G",
    tipo: "servicios",
  },
  {
    code: "4520",
    description: "Mantenimiento y reparación de vehículos de motor",
    section: "G",
    tipo: "servicios",
  },
  {
    code: "4531",
    description:
      "Comercio al por mayor de repuestos y accesorios de vehículos de motor",
    section: "G",
    tipo: "servicios",
  },
  {
    code: "4532",
    description:
      "Comercio al por menor de repuestos y accesorios de vehículos de motor",
    section: "G",
    tipo: "servicios",
  },
  {
    code: "4611",
    description:
      "Intermediarios del comercio de materias primas agrarias, animales vivos, etc.",
    section: "G",
    tipo: "servicios",
  },
  {
    code: "4617",
    description:
      "Intermediarios del comercio de productos alimenticios, bebidas y tabaco",
    section: "G",
    tipo: "servicios",
  },
  {
    code: "4619",
    description: "Intermediarios del comercio de productos diversos",
    section: "G",
    tipo: "servicios",
  },
  {
    code: "4621",
    description:
      "Comercio al por mayor de cereales, tabaco en rama, simientes y alimentos para animales",
    section: "G",
    tipo: "servicios",
  },
  {
    code: "4631",
    description: "Comercio al por mayor de frutas y hortalizas",
    section: "G",
    tipo: "servicios",
  },
  {
    code: "4634",
    description: "Comercio al por mayor de bebidas",
    section: "G",
    tipo: "servicios",
  },
  {
    code: "4639",
    description:
      "Comercio al por mayor, no especializado, de productos alimenticios, bebidas y tabaco",
    section: "G",
    tipo: "servicios",
  },
  {
    code: "4641",
    description: "Comercio al por mayor de textiles",
    section: "G",
    tipo: "servicios",
  },
  {
    code: "4642",
    description: "Comercio al por mayor de prendas de vestir y calzado",
    section: "G",
    tipo: "servicios",
  },
  {
    code: "4647",
    description:
      "Comercio al por mayor de muebles, alfombras y aparatos de iluminación",
    section: "G",
    tipo: "servicios",
  },
  {
    code: "4648",
    description: "Comercio al por mayor de artículos de relojería y joyería",
    section: "G",
    tipo: "servicios",
  },
  {
    code: "4649",
    description: "Comercio al por mayor de otros artículos de uso doméstico",
    section: "G",
    tipo: "servicios",
  },
  {
    code: "4673",
    description:
      "Comercio al por mayor de madera, materiales de construcción y aparatos sanitarios",
    section: "G",
    tipo: "servicios",
  },
  {
    code: "4690",
    description: "Comercio al por mayor no especializado",
    section: "G",
    tipo: "servicios",
  },
  {
    code: "4711",
    description:
      "Comercio al por menor con predominio de productos alimenticios, bebidas y tabaco en establecimientos no especializados",
    section: "G",
    tipo: "servicios",
  },
  {
    code: "4719",
    description:
      "Otro comercio al por menor en establecimientos no especializados",
    section: "G",
    tipo: "servicios",
  },
  {
    code: "4721",
    description:
      "Comercio al por menor de frutas y hortalizas en establecimientos especializados",
    section: "G",
    tipo: "servicios",
  },
  {
    code: "4722",
    description:
      "Comercio al por menor de carne y productos cárnicos en establecimientos especializados",
    section: "G",
    tipo: "servicios",
  },
  {
    code: "4724",
    description:
      "Comercio al por menor de pan y productos de panadería, confitería y pastelería",
    section: "G",
    tipo: "servicios",
  },
  {
    code: "4729",
    description:
      "Otro comercio al por menor de productos alimenticios en establecimientos especializados",
    section: "G",
    tipo: "servicios",
  },
  {
    code: "4751",
    description:
      "Comercio al por menor de textiles en establecimientos especializados",
    section: "G",
    tipo: "servicios",
  },
  {
    code: "4752",
    description: "Comercio al por menor de ferretería, pintura y vidrio",
    section: "G",
    tipo: "servicios",
  },
  {
    code: "4759",
    description: "Comercio al por menor de muebles, aparatos de iluminación",
    section: "G",
    tipo: "servicios",
  },
  {
    code: "4764",
    description: "Comercio al por menor de artículos deportivos",
    section: "G",
    tipo: "servicios",
  },
  {
    code: "4771",
    description: "Comercio al por menor de prendas de vestir",
    section: "G",
    tipo: "servicios",
  },
  {
    code: "4772",
    description: "Comercio al por menor de calzado y artículos de cuero",
    section: "G",
    tipo: "servicios",
  },
  {
    code: "4776",
    description:
      "Comercio al por menor de flores, plantas, semillas, fertilizantes",
    section: "G",
    tipo: "servicios",
  },
  {
    code: "4791",
    description: "Comercio al por menor por correspondencia o Internet",
    section: "G",
    tipo: "servicios",
  },

  // SECCIÓN H: TRANSPORTE Y ALMACENAMIENTO
  {
    code: "4910",
    description: "Transporte interurbano de pasajeros por ferrocarril",
    section: "H",
    tipo: "servicios",
  },
  {
    code: "4931",
    description: "Transporte terrestre urbano y suburbano de pasajeros",
    section: "H",
    tipo: "servicios",
  },
  {
    code: "4932",
    description: "Transporte por taxi",
    section: "H",
    tipo: "servicios",
  },
  {
    code: "4939",
    description: "tipos de transporte terrestre de pasajeros n.c.o.p.",
    section: "H",
    tipo: "servicios",
  },
  {
    code: "4941",
    description: "Transporte de mercancías por carretera",
    section: "H",
    tipo: "servicios",
  },
  {
    code: "5010",
    description: "Transporte marítimo de pasajeros",
    section: "H",
    tipo: "servicios",
  },
  {
    code: "5110",
    description: "Transporte aéreo de pasajeros",
    section: "H",
    tipo: "servicios",
  },
  {
    code: "5210",
    description: "Depósito y almacenamiento",
    section: "H",
    tipo: "servicios",
  },
  {
    code: "5221",
    description: "Actividades anexas al transporte terrestre",
    section: "H",
    tipo: "servicios",
  },
  {
    code: "5229",
    description: "Otras actividades anexas al transporte",
    section: "H",
    tipo: "servicios",
  },
  {
    code: "5310",
    description:
      "Actividades postales sometidas a la obligación del servicio universal",
    section: "H",
    tipo: "servicios",
  },
  {
    code: "5320",
    description: "Otras actividades postales y de correos",
    section: "H",
    tipo: "servicios",
  },

  // SECCIÓN I: HOSTELERÍA
  {
    code: "5510",
    description: "Hoteles y alojamientos similares",
    section: "I",
    tipo: "servicios",
  },
  {
    code: "5520",
    description:
      "Alojamientos turísticos y otros alojamientos de corta estancia",
    section: "I",
    tipo: "servicios",
  },
  {
    code: "5530",
    description: "Campings y aparcamientos para caravanas",
    section: "I",
    tipo: "servicios",
  },
  {
    code: "5610",
    description: "Restaurantes y puestos de comidas",
    section: "I",
    tipo: "servicios",
  },
  {
    code: "5621",
    description: "Provisión de comidas preparadas para eventos",
    section: "I",
    tipo: "servicios",
  },
  {
    code: "5629",
    description: "Otros servicios de comidas",
    section: "I",
    tipo: "servicios",
  },
  {
    code: "5630",
    description: "Establecimientos de bebidas",
    section: "I",
    tipo: "servicios",
  },

  // SECCIÓN J: INFORMACIÓN Y COMUNICACIONES
  {
    code: "5811",
    description: "Edición de libros",
    section: "J",
    tipo: "servicios",
  },
  {
    code: "5812",
    description: "Edición de directorios y guías de direcciones postales",
    section: "J",
    tipo: "servicios",
  },
  {
    code: "5813",
    description: "Edición de periódicos",
    section: "J",
    tipo: "servicios",
  },
  {
    code: "5814",
    description: "Edición de revistas",
    section: "J",
    tipo: "servicios",
  },
  {
    code: "5819",
    description: "Otras actividades editoriales",
    section: "J",
    tipo: "servicios",
  },
  {
    code: "5821",
    description: "Edición de videojuegos",
    section: "J",
    tipo: "servicios",
  },
  {
    code: "5829",
    description: "Edición de otros programas informáticos",
    section: "J",
    tipo: "servicios",
  },
  {
    code: "5911",
    description:
      "Actividades de producción cinematográfica, de vídeo y de programas de televisión",
    section: "J",
    tipo: "servicios",
  },
  {
    code: "5912",
    description:
      "Actividades de postproducción cinematográfica, de vídeo y de programas de televisión",
    section: "J",
    tipo: "servicios",
  },
  {
    code: "5914",
    description: "Actividades de exhibición cinematográfica",
    section: "J",
    tipo: "servicios",
  },
  {
    code: "5920",
    description: "Actividades de grabación de sonido y edición musical",
    section: "J",
    tipo: "servicios",
  },
  {
    code: "6010",
    description: "Actividades de radiodifusión",
    section: "J",
    tipo: "servicios",
  },
  {
    code: "6020",
    description: "Actividades de programación y emisión de televisión",
    section: "J",
    tipo: "servicios",
  },
  {
    code: "6110",
    description: "Telecomunicaciones por cable",
    section: "J",
    tipo: "servicios",
  },
  {
    code: "6120",
    description: "Telecomunicaciones inalámbricas",
    section: "J",
    tipo: "servicios",
  },
  {
    code: "6190",
    description: "Otras actividades de telecomunicaciones",
    section: "J",
    tipo: "servicios",
  },
  {
    code: "6201",
    description: "Actividades de programación informática",
    section: "J",
    tipo: "servicios",
  },
  {
    code: "6202",
    description: "Actividades de consultoría informática",
    section: "J",
    tipo: "servicios",
  },
  {
    code: "6203",
    description: "Gestión de recursos informáticos",
    section: "J",
    tipo: "servicios",
  },
  {
    code: "6209",
    description:
      "Otros servicios relacionados con las tecnologías de la información",
    section: "J",
    tipo: "servicios",
  },
  {
    code: "6311",
    description: "Proceso de datos, hosting y actividades relacionadas",
    section: "J",
    tipo: "servicios",
  },
  {
    code: "6312",
    description: "Portales web",
    section: "J",
    tipo: "servicios",
  },
  {
    code: "6391",
    description: "Actividades de las agencias de noticias",
    section: "J",
    tipo: "servicios",
  },
  {
    code: "6399",
    description: "Otros servicios de información n.c.o.p.",
    section: "J",
    tipo: "servicios",
  },

  // SECCIÓN K: ACTIVIDADES FINANCIERAS Y DE SEGUROS
  {
    code: "6411",
    description: "Banco central",
    section: "K",
    tipo: "servicios",
  },
  {
    code: "6419",
    description: "Otra intermediación monetaria",
    section: "K",
    tipo: "servicios",
  },
  {
    code: "6420",
    description: "Actividades de las sociedades holding",
    section: "K",
    tipo: "servicios",
  },
  {
    code: "6430",
    description:
      "Inversión colectiva, fondos y entidades financieras similares",
    section: "K",
    tipo: "servicios",
  },
  {
    code: "6491",
    description: "Arrendamiento financiero",
    section: "K",
    tipo: "servicios",
  },
  {
    code: "6492",
    description: "Otras actividades crediticias",
    section: "K",
    tipo: "servicios",
  },
  {
    code: "6499",
    description:
      "Otros servicios financieros, excepto seguros y fondos de pensiones",
    section: "K",
    tipo: "servicios",
  },
  {
    code: "6511",
    description: "Seguros de vida",
    section: "K",
    tipo: "servicios",
  },
  {
    code: "6512",
    description: "Seguros distintos de los seguros de vida",
    section: "K",
    tipo: "servicios",
  },
  { code: "6520", description: "Reaseguros", section: "K", tipo: "servicios" },
  {
    code: "6530",
    description: "Fondos de pensiones",
    section: "K",
    tipo: "servicios",
  },
  {
    code: "6611",
    description: "Administración de mercados financieros",
    section: "K",
    tipo: "servicios",
  },
  {
    code: "6612",
    description:
      "Actividades de intermediación en operaciones con valores y otros activos",
    section: "K",
    tipo: "servicios",
  },
  {
    code: "6619",
    description: "Otras actividades auxiliares a los servicios financieros",
    section: "K",
    tipo: "servicios",
  },
  {
    code: "6621",
    description: "Evaluación de riesgos y daños",
    section: "K",
    tipo: "servicios",
  },
  {
    code: "6622",
    description: "Actividades de agentes y corredores de seguros",
    section: "K",
    tipo: "servicios",
  },
  {
    code: "6629",
    description: "Otras actividades auxiliares a seguros y fondos de pensiones",
    section: "K",
    tipo: "servicios",
  },
  {
    code: "6630",
    description: "Actividades de gestión de fondos",
    section: "K",
    tipo: "servicios",
  },

  // SECCIÓN L: ACTIVIDADES INMOBILIARIAS
  {
    code: "6810",
    description: "Compraventa de bienes inmobiliarios por cuenta propia",
    section: "L",
    tipo: "servicios",
  },
  {
    code: "6820",
    description: "Alquiler de bienes inmobiliarios por cuenta propia",
    section: "L",
    tipo: "servicios",
  },
  {
    code: "6831",
    description: "Agentes de la propiedad inmobiliaria",
    section: "L",
    tipo: "servicios",
  },
  {
    code: "6832",
    description: "Gestión y administración de la propiedad inmobiliaria",
    section: "L",
    tipo: "servicios",
  },

  // SECCIÓN M: ACTIVIDADES PROFESIONALES, CIENTÍFICAS Y TÉCNICAS
  {
    code: "6910",
    description: "Actividades jurídicas",
    section: "M",
    tipo: "servicios",
  },
  {
    code: "6920",
    description:
      "Actividades de contabilidad, teneduría de libros, auditoría y asesoría fiscal",
    section: "M",
    tipo: "servicios",
  },
  {
    code: "7010",
    description: "Actividades de las sedes centrales",
    section: "M",
    tipo: "servicios",
  },
  {
    code: "7021",
    description: "Relaciones públicas y comunicación",
    section: "M",
    tipo: "servicios",
  },
  {
    code: "7022",
    description: "Otras actividades de consultoría de gestión empresarial",
    section: "M",
    tipo: "servicios",
  },
  {
    code: "7111",
    description: "Servicios técnicos de arquitectura",
    section: "M",
    tipo: "servicios",
  },
  {
    code: "7112",
    description:
      "Servicios técnicos de ingeniería y otras actividades relacionadas",
    section: "M",
    tipo: "servicios",
  },
  {
    code: "7120",
    description: "Ensayos y análisis técnicos",
    section: "M",
    tipo: "servicios",
  },
  {
    code: "7211",
    description: "Investigación y desarrollo experimental en biotecnología",
    section: "M",
    tipo: "servicios",
  },
  {
    code: "7219",
    description:
      "Otra investigación y desarrollo experimental en ciencias naturales y técnicas",
    section: "M",
    tipo: "servicios",
  },
  {
    code: "7220",
    description:
      "Investigación y desarrollo experimental en ciencias sociales y humanidades",
    section: "M",
    tipo: "servicios",
  },
  {
    code: "7311",
    description: "Agencias de publicidad",
    section: "M",
    tipo: "servicios",
  },
  {
    code: "7312",
    description: "Servicios de representación de medios de comunicación",
    section: "M",
    tipo: "servicios",
  },
  {
    code: "7320",
    description:
      "Estudios de mercado y realización de encuestas de opinión pública",
    section: "M",
    tipo: "servicios",
  },
  {
    code: "7410",
    description: "Actividades de diseño especializado",
    section: "M",
    tipo: "servicios",
  },
  {
    code: "7420",
    description: "Actividades de fotografía",
    section: "M",
    tipo: "servicios",
  },
  {
    code: "7430",
    description: "Actividades de traducción e interpretación",
    section: "M",
    tipo: "servicios",
  },
  {
    code: "7490",
    description:
      "Otras actividades profesionales, científicas y técnicas n.c.o.p.",
    section: "M",
    tipo: "servicios",
  },
  {
    code: "7500",
    description: "Actividades veterinarias",
    section: "M",
    tipo: "servicios",
  },

  // SECCIÓN N: ACTIVIDADES ADMINISTRATIVAS Y SERVICIOS AUXILIARES
  // SECCIÓN N: ACTIVIDADES ADMINISTRATIVAS Y SERVICIOS AUXILIARES
  {
    code: "7711",
    description: "Alquiler de automóviles y vehículos de motor ligeros",
    section: "N",
    tipo: "servicios",
  },
  {
    code: "7712",
    description: "Alquiler de camiones",
    section: "N",
    tipo: "servicios",
  },
  {
    code: "7721",
    description: "Alquiler de artículos de ocio y deportivos",
    section: "N",
    tipo: "servicios",
  },
  {
    code: "7722",
    description: "Alquiler de cintas de vídeo y discos",
    section: "N",
    tipo: "servicios",
  },
  {
    code: "7732",
    description:
      "Alquiler de maquinaria y equipo para la construcción e ingeniería civil",
    section: "N",
    tipo: "servicios",
  },
  {
    code: "7733",
    description: "Alquiler de maquinaria y equipo de oficina",
    section: "N",
    tipo: "servicios",
  },
  {
    code: "7810",
    description: "Actividades de las agencias de colocación",
    section: "N",
    tipo: "servicios",
  },
  {
    code: "7820",
    description: "Actividades de las empresas de trabajo temporal",
    section: "N",
    tipo: "servicios",
  },
  {
    code: "7830",
    description: "Otra provisión de recursos humanos",
    section: "N",
    tipo: "servicios",
  },
  {
    code: "8010",
    description: "Actividades de seguridad privada",
    section: "N",
    tipo: "servicios",
  },
  {
    code: "8020",
    description: "Servicios de sistemas de seguridad",
    section: "N",
    tipo: "servicios",
  },
  {
    code: "8110",
    description: "Servicios integrales a edificios e instalaciones",
    section: "N",
    tipo: "servicios",
  },
  {
    code: "8121",
    description: "Limpieza general de edificios",
    section: "N",
    tipo: "servicios",
  },
  {
    code: "8122",
    description: "Otras actividades de limpieza industrial y de edificios",
    section: "N",
    tipo: "servicios",
  },
  {
    code: "8129",
    description: "Otras actividades de limpieza",
    section: "N",
    tipo: "servicios",
  },
  {
    code: "8211",
    description: "Servicios administrativos combinados",
    section: "N",
    tipo: "servicios",
  },
  {
    code: "8219",
    description:
      "Actividades de fotocopiado, preparación de documentos y otras actividades de apoyo a oficinas",
    section: "N",
    tipo: "servicios",
  },
  {
    code: "8220",
    description: "Actividades de los centros de llamadas",
    section: "N",
    tipo: "servicios",
  },
  {
    code: "8230",
    description: "Organización de convenciones y ferias de muestras",
    section: "N",
    tipo: "servicios",
  },
  {
    code: "8291",
    description:
      "Actividades de las agencias de cobros y de información comercial",
    section: "N",
    tipo: "servicios",
  },
  {
    code: "8299",
    description: "Otras actividades de apoyo a las empresas n.c.o.p.",
    section: "N",
    tipo: "servicios",
  },

  // SECCIÓN P: EDUCACIÓN
  {
    code: "8510",
    description: "Educación preprimaria",
    section: "P",
    tipo: "servicios",
  },
  {
    code: "8520",
    description: "Educación primaria",
    section: "P",
    tipo: "servicios",
  },
  {
    code: "8531",
    description: "Educación secundaria general",
    section: "P",
    tipo: "servicios",
  },
  {
    code: "8532",
    description: "Educación secundaria técnica y profesional",
    section: "P",
    tipo: "servicios",
  },
  {
    code: "8541",
    description: "Educación postsecundaria no terciaria",
    section: "P",
    tipo: "servicios",
  },
  {
    code: "8543",
    description: "Educación universitaria",
    section: "P",
    tipo: "servicios",
  },
  {
    code: "8551",
    description: "Educación deportiva y recreativa",
    section: "P",
    tipo: "servicios",
  },
  {
    code: "8552",
    description: "Educación cultural",
    section: "P",
    tipo: "servicios",
  },
  {
    code: "8559",
    description: "Otra educación n.c.o.p.",
    section: "P",
    tipo: "servicios",
  },
  {
    code: "8560",
    description: "Actividades auxiliares a la educación",
    section: "P",
    tipo: "servicios",
  },

  // SECCIÓN Q: ACTIVIDADES SANITARIAS Y DE SERVICIOS SOCIALES
  {
    code: "8610",
    description: "Actividades hospitalarias",
    section: "Q",
    tipo: "servicios",
  },
  {
    code: "8621",
    description: "Actividades de medicina general",
    section: "Q",
    tipo: "servicios",
  },
  {
    code: "8622",
    description: "Actividades de medicina especializada",
    section: "Q",
    tipo: "servicios",
  },
  {
    code: "8623",
    description: "Actividades odontológicas",
    section: "Q",
    tipo: "servicios",
  },
  {
    code: "8690",
    description: "Otras actividades sanitarias",
    section: "Q",
    tipo: "servicios",
  },
  {
    code: "8710",
    description:
      "Asistencia en establecimientos residenciales con cuidados sanitarios",
    section: "Q",
    tipo: "servicios",
  },
  {
    code: "8731",
    description:
      "Asistencia en establecimientos residenciales para personas mayores",
    section: "Q",
    tipo: "servicios",
  },
  {
    code: "8812",
    description:
      "Actividades de servicios sociales sin alojamiento para personas con discapacidad",
    section: "Q",
    tipo: "servicios",
  },
  {
    code: "8891",
    description: "Actividades de cuidado diurno de niños",
    section: "Q",
    tipo: "servicios",
  },

  // SECCIÓN R: ACTIVIDADES ARTÍSTICAS, RECREATIVAS Y DE ENTRETENIMIENTO
  {
    code: "9001",
    description: "Artes escénicas",
    section: "R",
    tipo: "servicios",
  },
  {
    code: "9002",
    description: "Actividades auxiliares a las artes escénicas",
    section: "R",
    tipo: "servicios",
  },
  {
    code: "9003",
    description: "Creación artística y literaria",
    section: "R",
    tipo: "servicios",
  },
  {
    code: "9004",
    description: "Gestión de salas de espectáculos",
    section: "R",
    tipo: "servicios",
  },
  {
    code: "9102",
    description: "Actividades de museos",
    section: "R",
    tipo: "servicios",
  },
  {
    code: "9103",
    description: "Gestión de lugares y edificios históricos",
    section: "R",
    tipo: "servicios",
  },
  {
    code: "9104",
    description:
      "Actividades de los jardines botánicos, parques zoológicos y reservas naturales",
    section: "R",
    tipo: "servicios",
  },
  {
    code: "9200",
    description: "Actividades de juegos de azar y apuestas",
    section: "R",
    tipo: "servicios",
  },
  {
    code: "9311",
    description: "Gestión de instalaciones deportivas",
    section: "R",
    tipo: "servicios",
  },
  {
    code: "9312",
    description: "Actividades de los clubes deportivos",
    section: "R",
    tipo: "servicios",
  },
  {
    code: "9313",
    description: "Actividades de los gimnasios",
    section: "R",
    tipo: "servicios",
  },
  {
    code: "9319",
    description: "Otras actividades deportivas",
    section: "R",
    tipo: "servicios",
  },
  {
    code: "9321",
    description:
      "Actividades de los parques de atracciones y los parques temáticos",
    section: "R",
    tipo: "servicios",
  },
  {
    code: "9329",
    description: "Otras actividades recreativas y de entretenimiento",
    section: "R",
    tipo: "servicios",
  },

  // SECCIÓN S: OTROS SERVICIOS
  {
    code: "9411",
    description: "Actividades de organizaciones empresariales y patronales",
    section: "S",
    tipo: "servicios",
  },
  {
    code: "9412",
    description: "Actividades de organizaciones profesionales",
    section: "S",
    tipo: "servicios",
  },
  {
    code: "9420",
    description: "Actividades sindicales",
    section: "S",
    tipo: "servicios",
  },
  {
    code: "9491",
    description: "Actividades de organizaciones religiosas",
    section: "S",
    tipo: "servicios",
  },
  {
    code: "9499",
    description: "Otras actividades asociativas n.c.o.p.",
    section: "S",
    tipo: "servicios",
  },
  {
    code: "9511",
    description: "Reparación de ordenadores y equipos periféricos",
    section: "S",
    tipo: "servicios",
  },
  {
    code: "9512",
    description: "Reparación de equipos de comunicación",
    section: "S",
    tipo: "servicios",
  },
  {
    code: "9521",
    description:
      "Reparación de aparatos electrónicos de audio y vídeo de uso doméstico",
    section: "S",
    tipo: "servicios",
  },
  {
    code: "9522",
    description:
      "Reparación de aparatos electrodomésticos y de equipos para el hogar y el jardín",
    section: "S",
    tipo: "servicios",
  },
  {
    code: "9523",
    description: "Reparación de calzado y artículos de cuero",
    section: "S",
    tipo: "servicios",
  },
  {
    code: "9524",
    description: "Reparación de muebles y artículos de menaje",
    section: "S",
    tipo: "servicios",
  },
  {
    code: "9525",
    description: "Reparación de relojes y joyería",
    section: "S",
    tipo: "servicios",
  },
  {
    code: "9529",
    description:
      "Reparación de otros efectos personales y artículos de uso doméstico",
    section: "S",
    tipo: "servicios",
  },
  {
    code: "9601",
    description: "Lavado y limpieza de prendas textiles y de piel",
    section: "S",
    tipo: "servicios",
  },
  {
    code: "9602",
    description: "Peluquería y otros tratamientos de belleza",
    section: "S",
    tipo: "servicios",
  },
  {
    code: "9603",
    description: "Pompas fúnebres y actividades relacionadas",
    section: "S",
    tipo: "servicios",
  },
  {
    code: "9604",
    description: "Actividades de mantenimiento físico",
    section: "S",
    tipo: "servicios",
  },
  {
    code: "9609",
    description: "Otros servicios personales n.c.o.p.",
    section: "S",
    tipo: "servicios",
  },
];

const CNAE_CODES_FALTANTES: CnaeOption[] = [
  // SECCIÓN A - AGRICULTURA, GANADERÍA, SILVICULTURA Y PESCA
  // División 03: Pesca y acuicultura
  {
    code: "0311",
    description: "Pesca marina",
    section: "A",
    tipo: "servicios",
  },
  {
    code: "0312",
    description: "Pesca en agua dulce",
    section: "A",
    tipo: "servicios",
  },
  {
    code: "0321",
    description: "Acuicultura marina",
    section: "A",
    tipo: "servicios",
  },
  {
    code: "0322",
    description: "Acuicultura en agua dulce",
    section: "A",
    tipo: "servicios",
  },

  // SECCIÓN B - INDUSTRIAS EXTRACTIVAS
  // División 05: Extracción de antracita, hulla y lignito
  {
    code: "0510",
    description: "Extracción de antracita y hulla",
    section: "B",
    tipo: "servicios",
  },
  {
    code: "0520",
    description: "Extracción de lignito",
    section: "B",
    tipo: "servicios",
  },

  // División 06: Extracción de crudo de petróleo y gas natural
  {
    code: "0610",
    description: "Extracción de crudo de petróleo",
    section: "B",
    tipo: "servicios",
  },
  {
    code: "0620",
    description: "Extracción de gas natural",
    section: "B",
    tipo: "servicios",
  },

  // División 07: Extracción de minerales metálicos
  {
    code: "0710",
    description: "Extracción de minerales de hierro",
    section: "B",
    tipo: "servicios",
  },
  {
    code: "0721",
    description: "Extracción de minerales de uranio y torio",
    section: "B",
    tipo: "servicios",
  },
  {
    code: "0729",
    description: "Extracción de otros minerales metálicos no férreos",
    section: "B",
    tipo: "servicios",
  },

  // División 08: Otras industrias extractivas
  {
    code: "0811",
    description:
      "Extracción de piedra ornamental y para la construcción, piedra caliza, yeso, creta y pizarra",
    section: "B",
    tipo: "servicios",
  },
  {
    code: "0812",
    description:
      "Extracción de gravas y arenas; extracción de arcilla y caolín",
    section: "B",
    tipo: "servicios",
  },
  {
    code: "0891",
    description:
      "Extracción de minerales para productos químicos y fertilizantes",
    section: "B",
    tipo: "servicios",
  },
  {
    code: "0892",
    description: "Extracción de turba",
    section: "B",
    tipo: "servicios",
  },
  {
    code: "0893",
    description: "Extracción de sal",
    section: "B",
    tipo: "servicios",
  },
  {
    code: "0899",
    description: "Otras industrias extractivas n.c.o.p.",
    section: "B",
    tipo: "servicios",
  },

  // División 09: Actividades de apoyo a las industrias extractivas
  {
    code: "0910",
    description:
      "Actividades de apoyo a la extracción de petróleo y gas natural",
    section: "B",
    tipo: "servicios",
  },
  {
    code: "0990",
    description: "Actividades de apoyo a otras industrias extractivas",
    section: "B",
    tipo: "servicios",
  },

  // SECCIÓN C - INDUSTRIA MANUFACTURERA
  // División 12: Industria del tabaco
  {
    code: "1200",
    description: "Industria del tabaco",
    section: "C",
    tipo: "manufactura",
  },

  // División 19: Coquerías y refino de petróleo
  {
    code: "1910",
    description: "Coquerías",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "1920",
    description: "Refino de petróleo",
    section: "C",
    tipo: "manufactura",
  },

  // División 21: Fabricación de productos farmacéuticos
  {
    code: "2110",
    description: "Fabricación de productos farmacéuticos de base",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2120",
    description: "Fabricación de especialidades farmacéuticas",
    section: "C",
    tipo: "manufactura",
  },

  // División 23: Fabricación de otros productos minerales no metálicos
  {
    code: "2311",
    description: "Fabricación de vidrio plano",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2312",
    description: "Manipulado y transformación de vidrio plano",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2313",
    description: "Fabricación de vidrio hueco",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2314",
    description: "Fabricación de fibra de vidrio",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2319",
    description:
      "Fabricación y manipulado de otro vidrio, incluido el vidrio técnico",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2320",
    description: "Fabricación de productos cerámicos refractarios",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2331",
    description: "Fabricación de azulejos y baldosas de cerámica",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2332",
    description:
      "Fabricación de ladrillos, tejas y productos de tierras cocidas para la construcción",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2341",
    description:
      "Fabricación de artículos cerámicos de uso doméstico y ornamental",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2342",
    description: "Fabricación de aparatos sanitarios cerámicos",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2343",
    description:
      "Fabricación de aisladores y piezas aislantes de material cerámico",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2344",
    description: "Fabricación de otros productos cerámicos de uso técnico",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2349",
    description: "Fabricación de otros productos cerámicos",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2351",
    description: "Fabricación de cemento",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2352",
    description: "Fabricación de cal y yeso",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2361",
    description: "Fabricación de elementos de hormigón para la construcción",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2362",
    description: "Fabricación de elementos de yeso para la construcción",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2363",
    description: "Fabricación de hormigón fresco",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2364",
    description: "Fabricación de mortero",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2365",
    description: "Fabricación de fibrocemento",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2369",
    description: "Fabricación de otros productos de hormigón, yeso y cemento",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2370",
    description: "Corte, tallado y acabado de la piedra",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2391",
    description: "Fabricación de productos abrasivos",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2399",
    description:
      "Fabricación de otros productos minerales no metálicos n.c.o.p.",
    section: "C",
    tipo: "manufactura",
  },

  // División 24: Metalurgia; fabricación de productos de hierro, acero y ferroaleaciones
  {
    code: "2410",
    description:
      "Fabricación de productos básicos de hierro, acero y ferroaleaciones",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2420",
    description:
      "Fabricación de tubos, tuberías, perfiles huecos y sus accesorios, de acero",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2431",
    description: "Estirado en frío",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2432",
    description: "Laminación en frío",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2433",
    description: "Producción de perfiles en frío por conformación con plegado",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2434",
    description: "Trefilado en frío",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2441",
    description: "Producción de metales preciosos",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2442",
    description: "Producción de aluminio",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2443",
    description: "Producción de plomo, zinc y estaño",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2444",
    description: "Producción de cobre",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2445",
    description: "Producción de otros metales no férreos",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2446",
    description: "Procesamiento de combustibles nucleares",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2451",
    description: "Fundición de hierro",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2452",
    description: "Fundición de acero",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2453",
    description: "Fundición de metales ligeros",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2454",
    description: "Fundición de otros metales no férreos",
    section: "C",
    tipo: "manufactura",
  },

  // División 28: Fabricación de maquinaria y equipo n.c.o.p.
  {
    code: "2811",
    description:
      "Fabricación de motores y turbinas, excepto los destinados a aeronaves, vehículos y ciclomotores",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2812",
    description: "Fabricación de equipos de transmisión hidráulica y neumática",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2813",
    description: "Fabricación de otras bombas y compresores",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2814",
    description: "Fabricación de otra grifería y válvulas",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2815",
    description:
      "Fabricación de cojinetes, engranajes y órganos mecánicos de transmisión",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2821",
    description: "Fabricación de hornos y quemadores",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2822",
    description: "Fabricación de maquinaria de elevación y manipulación",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2823",
    description:
      "Fabricación de máquinas y equipos de oficina, excepto equipos informáticos",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2824",
    description: "Fabricación de herramientas eléctricas manuales",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2825",
    description:
      "Fabricación de maquinaria de ventilación y refrigeración no doméstica",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2829",
    description: "Fabricación de otra maquinaria de uso general n.c.o.p.",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2830",
    description: "Fabricación de maquinaria agraria y forestal",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2841",
    description: "Fabricación de máquinas herramienta para trabajar el metal",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2849",
    description: "Fabricación de otras máquinas herramienta",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2891",
    description: "Fabricación de maquinaria para la industria metalúrgica",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2892",
    description:
      "Fabricación de maquinaria para las industrias extractivas y de la construcción",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2893",
    description:
      "Fabricación de maquinaria para la industria de la alimentación, bebidas y tabaco",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2894",
    description:
      "Fabricación de maquinaria para las industrias textil, de la confección y del cuero",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2895",
    description:
      "Fabricación de maquinaria para la industria del papel y del cartón",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2896",
    description:
      "Fabricación de maquinaria para la industria del plástico y el caucho",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "2899",
    description:
      "Fabricación de otra maquinaria para usos específicos n.c.o.p.",
    section: "C",
    tipo: "manufactura",
  },

  // División 30: Fabricación de otro material de transporte
  {
    code: "3011",
    description: "Construcción de barcos y estructuras flotantes",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "3012",
    description: "Construcción de embarcaciones de recreo y deporte",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "3020",
    description: "Fabricación de locomotoras y material ferroviario",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "3030",
    description: "Construcción aeronáutica y espacial y su maquinaria",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "3040",
    description: "Fabricación de vehículos militares de combate",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "3091",
    description: "Fabricación de motocicletas",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "3092",
    description:
      "Fabricación de bicicletas y de vehículos para personas con discapacidad",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "3099",
    description: "Fabricación de otro material de transporte n.c.o.p.",
    section: "C",
    tipo: "manufactura",
  },

  // División 32: Otras industrias manufactureras
  {
    code: "3211",
    description: "Fabricación de monedas",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "3212",
    description: "Fabricación de artículos de joyería y artículos similares",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "3213",
    description: "Fabricación de artículos de bisutería y artículos similares",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "3220",
    description: "Fabricación de instrumentos musicales",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "3230",
    description: "Fabricación de artículos de deporte",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "3240",
    description: "Fabricación de juegos y juguetes",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "3250",
    description:
      "Fabricación de instrumentos y suministros médicos y odontológicos",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "3291",
    description: "Fabricación de escobas, brochas y cepillos",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "3299",
    description: "Otras industrias manufactureras n.c.o.p.",
    section: "C",
    tipo: "manufactura",
  },

  // División 33: Reparación e instalación de maquinaria y equipo
  {
    code: "3311",
    description: "Reparación de productos metálicos",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "3312",
    description: "Reparación de maquinaria",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "3313",
    description: "Reparación de equipos electrónicos y ópticos",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "3314",
    description: "Reparación de equipos eléctricos",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "3315",
    description: "Reparación y mantenimiento naval",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "3316",
    description: "Reparación y mantenimiento aeronáutico y espacial",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "3317",
    description: "Reparación y mantenimiento de otro material de transporte",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "3319",
    description: "Reparación de otros equipos",
    section: "C",
    tipo: "manufactura",
  },
  {
    code: "3320",
    description: "Instalación de máquinas y equipos industriales",
    section: "C",
    tipo: "manufactura",
  },

  // SECCIÓN E - SUMINISTRO DE AGUA, ACTIVIDADES DE SANEAMIENTO, GESTIÓN DE RESIDUOS Y DESCONTAMINACIÓN
  // División 37: Recogida y tratamiento de aguas residuales
  {
    code: "3700",
    description: "Recogida y tratamiento de aguas residuales",
    section: "E",
    tipo: "servicios",
  },

  // SECCIÓN N - ACTIVIDADES ADMINISTRATIVAS Y SERVICIOS AUXILIARES
  // División 79: Actividades de agencias de viajes, operadores turísticos, servicios de reservas
  {
    code: "7911",
    description: "Actividades de las agencias de viajes",
    section: "N",
    tipo: "servicios",
  },
  {
    code: "7912",
    description: "Actividades de los operadores turísticos",
    section: "N",
    tipo: "servicios",
  },
  {
    code: "7990",
    description:
      "Otros servicios de reservas y actividades relacionadas con los mismos",
    section: "N",
    tipo: "servicios",
  },

  // SECCIÓN O - ADMINISTRACIÓN PÚBLICA Y DEFENSA; SEGURIDAD SOCIAL OBLIGATORIA
  {
    code: "8411",
    description: "Actividades generales de la Administración Pública",
    section: "O",
    tipo: "servicios",
  },
  {
    code: "8412",
    description:
      "Regulación de las actividades sanitarias, educativas y culturales y otros servicios sociales, excepto Seguridad Social",
    section: "O",
    tipo: "servicios",
  },
  {
    code: "8413",
    description:
      "Regulación de la actividad económica y contribución a su mayor eficiencia",
    section: "O",
    tipo: "servicios",
  },
  {
    code: "8421",
    description: "Asuntos exteriores",
    section: "O",
    tipo: "servicios",
  },
  {
    code: "8422",
    description: "Defensa",
    section: "O",
    tipo: "servicios",
  },
  {
    code: "8423",
    description: "Justicia",
    section: "O",
    tipo: "servicios",
  },
  {
    code: "8424",
    description: "Orden público y seguridad",
    section: "O",
    tipo: "servicios",
  },
  {
    code: "8425",
    description: "Protección civil",
    section: "O",
    tipo: "servicios",
  },
  {
    code: "8430",
    description: "Seguridad Social obligatoria",
    section: "O",
    tipo: "servicios",
  },

  // SECCIÓN T - ACTIVIDADES DE LOS HOGARES COMO EMPLEADORES DE PERSONAL DOMÉSTICO
  {
    code: "9700",
    description:
      "Actividades de los hogares como empleadores de personal doméstico",
    section: "T",
    tipo: "servicios",
  },
  {
    code: "9810",
    description:
      "Actividades no diferenciadas de producción de bienes por los hogares para uso propio",
    section: "T",
    tipo: "servicios",
  },
  {
    code: "9820",
    description:
      "Actividades no diferenciadas de producción de servicios por los hogares para uso propio",
    section: "T",
    tipo: "servicios",
  },

  // SECCIÓN U - ACTIVIDADES DE ORGANIZACIONES Y ORGANISMOS EXTRATERRITORIALES
  {
    code: "9900",
    description:
      "Actividades de organizaciones y organismos extraterritoriales",
    section: "U",
    tipo: "servicios",
  },
];

// Lista completa de códigos CNAE (puedes expandir esta lista según sea necesario)
const cnaeOptions = [...CNAE_CODES, ...CNAE_CODES_FALTANTES];

// Función para obtener todos los códigos CNAE
export function getAllCnaeCodes(): CnaeOption[] {
  return cnaeOptions;
}

// Función para buscar códigos CNAE que coincidan con un término de búsqueda
export function searchCnaeCodes(query: string): CnaeOption[] {
  const searchTerm = query.toLowerCase();
  return cnaeOptions.filter(
    (option) =>
      option.code.includes(searchTerm) ||
      option.description.toLowerCase().includes(searchTerm)
  );
}

// Función para obtener un código CNAE por su código
export function getCnaeByCode(code: string): CnaeOption | null {
  return CNAE_CODES.find((option) => option.code === code) || null;
}

// Función para obtener códigos CNAE por sección
export function getCnaeBySection(section: string): CnaeOption[] {
  return cnaeOptions.filter((option) => option.section === section);
}

// Función para obtener códigos CNAE por tipo (manufactura o servicios)
export function getCnaeByTipo(tipo: "manufactura" | "servicios"): CnaeOption[] {
  return cnaeOptions.filter((option) => option.tipo === tipo);
}

// Función para obtener todas las secciones disponibles
export function getAllSections(): string[] {
  const sections = new Set(cnaeOptions.map((option) => option.section || ""));
  return Array.from(sections)
    .filter((s) => s !== "")
    .sort();
}

export function determineEmpresaTipo(
  code: string
): "manufactura" | "servicios" | null {
  const codeNum = parseInt(code.substring(0, 2));
  // Manufacturing codes are typically between 10-33
  return codeNum >= 10 && codeNum <= 33 ? "manufactura" : "servicios";
}
