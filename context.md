Contexto de la Aplicación de Seguros para PYMES/Startups - Smart Advice

- Desarrollamos una plataforma para gestionar la selección de seguros (Responsabilidad Civil y Daños Materiales) mediante formularios dinámicos. Los usuarios (PYMES) completan los formularios sin registro, y el sistema genera recomendaciones personalizadas de seguros.

Base de Datos Completa (Supabase)
sql
-- Tabla principal de sesiones temporales
CREATE TABLE sessions (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Token único
created_at TIMESTAMPTZ DEFAULT NOW(),
expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '24 hours' -- Opcional para limpieza
);

-- Empresas asociadas a una sesión
CREATE TABLE companies (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
name TEXT NOT NULL,
cif TEXT,
activity TEXT, -- Ej: "Manufactura", "Servicios"
employees_number INTEGER,
billing NUMERIC, -- Facturación anual en euros
online_invoice BOOLEAN, -- SI/NO
installations_type TEXT, -- "Propietario", "Inquilino"
m2_installations NUMERIC,
almacena_bienes_terceros BOOLEAN,
vehiculos_terceros_aparcados BOOLEAN,
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Registro de formularios enviados
CREATE TABLE forms (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
type TEXT NOT NULL, -- "responsabilidad_civil", "danos_materiales", "riesgos_adicionales"
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Formulario de Responsabilidad Civil (PPT 1)
CREATE TABLE form_responsabilidad_civil (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
form_id UUID REFERENCES forms(id) ON DELETE CASCADE,
actividad_manufactura BOOLEAN,
producto_consumo_humano BOOLEAN,
distribucion TEXT[], -- ["España", "UE", ...]
tiene_empleados_tecnicos BOOLEAN,
ambito_territorial TEXT,
coberturas_solicitadas JSONB -- Ej: {"exploitation": true, "patronal": true}
);

-- Formulario de Daños Materiales (PPT 2)
CREATE TABLE form_danos_materiales (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
form_id UUID REFERENCES forms(id) ON DELETE CASCADE,
valor_edificio NUMERIC,
valor_ajuar NUMERIC,
proteccion_incendios JSONB, -- Ej: {"extintores": true, "bocas_incendio": false}
proteccion_robo JSONB, -- Ej: {"alarma": true, "camaras": true}
siniestralidad JSONB, -- Ej: {"ultimos_3_anios": true, "causa": "incendio"}
almacena_existencias_terceros BOOLEAN,
tiene_camaras_frigorificas BOOLEAN
);

-- Catálogo de seguros disponibles
CREATE TABLE insurances (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
name TEXT NOT NULL, -- Ej: "Responsabilidad Civil Básico"
description TEXT,
coberturas JSONB NOT NULL, -- Coberturas específicas
ambito_territorial TEXT[], -- ["España", "UE", ...]
tipo TEXT NOT NULL -- "responsabilidad_civil", "danos_materiales"
);

-- Recomendaciones generadas
CREATE TABLE recommendations (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
form_id UUID REFERENCES forms(id) ON DELETE CASCADE,
insurance_id UUID REFERENCES insurances(id) ON DELETE CASCADE,
created_at TIMESTAMPTZ DEFAULT NOW()
);

Estructura del Proyecto

smart-advice
├── README.md
├── app
│ ├── api
│ │ ├── companies
│ │ ├── forms
│ │ ├── recomendaciones
│ │ ├── session
│ │ └── test-data
│ ├── danos-materiales
│ │ └── page.tsx
│ ├── favicon.ico
│ ├── globals.css
│ ├── layout.tsx
│ ├── page.tsx
│ ├── recomendaciones
│ │ └── page.tsx
│ ├── responsabilidad-civil
│ │ └── page.tsx
│ ├── riesgos-adicionales
│ │ └── page.tsx
│ └── seguros
│ └── page.tsx
├── components
│ ├── Footer.tsx
│ ├── Navbar.tsx
│ ├── forms
│ │ ├── DanosMaterialesForm.tsx
│ │ ├── MultiStepForm.tsx
│ │ └── ResponsabilidadCivilForm.tsx
│ └── ui
│ ├── button.tsx
│ ├── checkbox.tsx
│ ├── form.tsx
│ ├── input.tsx
│ ├── label.tsx
│ ├── radio-group.tsx
│ └── select.tsx
├── components.json
├── context.md
├── lib
│ ├── schemas.ts
│ ├── session.ts
│ ├── supabase.ts
│ └── utils.ts
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── types
└── index.ts
Flujo de Datos
Inicio:

El usuario abre la landing page → Se genera un token en localStorage.

Formulario:

Completa los datos de empresa → Guarda en companies.

Responde preguntas específicas → Guarda en form\_\* según el tipo.

Recomendación:

El backend compara respuestas con insurances → Genera recommendations.

Resultado:

Muestra seguros sugeridos y envía email con detalles.

Landing Page

1. Encabezado (Header)
   Logo: Nombre de la app (ej: "SegurosPYME") + ícono relacionado con seguros.

Menú de navegación: Enlaces simples ("Inicio", "Cómo funciona", "Preguntas frecuentes").

Botón de CTA: "Comenzar ahora" (redirige al primer formulario).

2. Sección Hero
   Titular principal: "Encuentra el seguro perfecto para tu PYME en minutos".

Subtítulo: "Simplificamos la elección de seguros para tu negocio".

Botón de CTA: "Comenzar ahora".

3. Beneficios principales
   Rápido y sencillo: Completa el formulario en minutos.

Personalizado: Seguros adaptados a tu negocio.

Sin compromiso: No necesitas registrarte.

Expertos en PYMES: Diseñado para pequeñas y medianas empresas.

4. Explicación del producto/servicio
   Título: "Cómo funciona".

Pasos:

Completa el formulario.

Recibe recomendaciones.

Compara y elige.

5. Preguntas frecuentes (FAQ)
   Preguntas:

¿Necesito registrarme?

¿Cómo se generan las recomendaciones?

¿Puedo contratar directamente?

¿Es seguro compartir mi información?

6. Llamada a la acción final
   Título: "¿Listo para proteger tu negocio?".

Botón de CTA: "Comenzar ahora".

7. Pie de página (Footer)
   Enlaces: Política de privacidad, Términos y condiciones.

Contacto: Email, teléfono.

Redes sociales: LinkedIn, Twitter, Instagram.

Copyright: "© 2023 SegurosPYME".

Consideraciones Técnicas
Frontend:

Usar localStorage para persistir el token entre recargas.

Formularios con validación en tiempo real (Zod + React Hook Form).

Backend:

API routes en Next.js para manejar submissions.

Usar RLS en Supabase para restringir acceso por session_id.

Seguridad:

Limpiar sesiones antiguas con expires_at (cron job).

No almacenar datos sensibles sin cifrar.

Que vamos a hacer ahora?

Vamos a hacer cambios en los formularios de danos! Entonces la cuestion es esta, los formularios son largos y debemos seccionarlos en partes. No solo a nivel experiencia sino que tambien a nivel de codigo. Por otro lado las bases de datos deberian ser mas faciles de manejar.
Entonces me imagino algo como:

Datos de Contacto / Usuarios
-Session ID
-Nombre
-Email
-Telefono

Empresas
-Session ID
-Nombre
-CNAE
-Actividad

Formularios
-Session ID
-Tipo de formulario
-Fecha de envio
-TODAS LAS PREGUNTAS DEL FORMULARIO

Ahora esto lo hariamos para sea mas facil de manejar y mas facil de entender. Peroooo vamos a tener que hacer cambios tambien en los formularios y como lo vemos. La idea seria que sean pantallas que se vayan pasando como tenemos en el multi step form. La primera en los formularios de responsabilidad civil seria:
Datos de contacto
-Nombre (A datos de contacto)
-Email (A datos de contacto)
-Telefono (A datos de contacto)

Segunda pantalla:(Ya tenemos armada esta pantalla nada mas que sin dos campos que faltan, te dejo el archivo)
-ACTIVIDAD: (Nº CENAE)
FACTURACIÓN: _Incluir solo la facturación a terceros excluyendo la facturación a otras empresas del grupo (Importe en Euros)
Nº DE EMPLEADOS: (INDICAR)
FACTURA ON-LINE: SI/NO: % DE FACTURACION
INSTALACIONES:ACTUO COMO PROPIETARIO/SOY INQUILINO (U OTROS)
M2 DE LAS INSTALACIONES:
ALMACENAS O TIENES DEPOSITADOS BIENES DE TERCEROS (SEA MAQUINARIA O EXISTENCIAS): SI/NO
ALMACENAS O TIENES DEPOSITADOS EXISTENCIAS O MAQUINARIA A LA INTERPERIE: SI/NO
HAY VEHÍCULOS DE TERCEROS APARCADOS EN MIS INSTALACIONES: SI/NO
¿QUIERES CUBRIR LOS DAÑOS A BIENES DE EMPELADOS (_) INDICAR EJEMPLOS: SI/NO
INDICA LA CANTIDAD DE DINERO DEPOSITADO EN CAJA FUERTE:
INDICA LA CANTIDAD DE DINERO GUARDADO FUERA DE CAJA FUERTE PERO DENTRO DEL INMUEBLE:
¿quieres incluir cláusula de todo riesgo accidental (\*): la cláusula de todo riesgo accidental otorga más cobertura a los capitales asegurados pero incrementa la prima de seguro.

Tercera pantalla CAPITALES A ASEGURAR

- [ ] Indica el valor del edificio (\* tiene que tener el valor asegurado como si fuera a nuevo):
- [ ] Indica el valor del ajuar (\* el ajuar incluye…):
- [ ] Indica el valor de existencias almacenadas (_)_
- [ ] _¿Almacenas existencias de terceros en tus instalaciones? SI/NO🡪 Importe_
- [ ] _¿Almacenas existencias propias en instalaciones de terceros? SI/NO🡪 Importe_
- [ ] _Indica el valor de los equipos electrónicos:_
- [ ] _Indica el valor del margen bruto anual (_ se obtiene sumando los GASTOS FIJOS + BENEFICIO NETO ANTES DE IMPUESTOS)

Tercera pantalla ### CARACTERISTICAS CONSTRUCTIVAS DE LA NAVE/EDIFICIO

- [ ] Cubierta: Chapa metálica simple; panel sándwich con lana de roca o fibra de vidrio; panel sándwich PIR/PUR.
- [ ] Cerramientos: hormigón/ladrillo; panel sándwich Pir/Pur;
- [ ] Estructura: Metálica; hormigón
- [ ] Tienes cámaras frigoríficas?: SI/NO
- [ ] Tienes paneles solares en cubierta: SI/NO. Indica su valor.

### 4 Pantalla PROTECCIONES CONTRA INCENDIO

- [ ] EXTINTORES: SI/NO
- [ ] BOCAS DE INCENDIO EQUIPADAS: SI/NO
- [ ] CUENTAS CON DE`PÓISTO PROPIO Y GRUPO DE BOMBEO? (BIE´S): SI/NO
- [ ] CUBREN LA TOTALIDAD DEL RIESGO: SI/NO
- [ ] COLUMNAS HIDRANTES EXTORIORES (CHE´S): SI/NO: Público o privado.
- [ ] DETECCIÓN ATUOMÁTICA DE INCENDIOS: SI/NO
- [ ] SOLO EN ZONA DE OFICINAS:
- [ ] SOLO EN SALAS TÉCNICAS:
- [ ] SOLO EN ALMACÉN:
- [ ] EN LA TOTALIDAD DE LA INSTALACIÓN
- [ ] ROCIADORES: SI/NO
- [ ] SOLO EN ZONA DE OFICINAS:
- [ ] SOLO EN SALAS TÉCNICAS:
- [ ] SOLO EN ZONAS DE ALMACÉN:
- [ ] EN LA TOTALIDAD DE LA INSTALACIÓN
- [ ] SUMINISTRO DE AGUA: red pública/sistema privado con grupo de bombeo y depósito propio.

### 5 Pantalla PROTECCIONES COTRA ROBO

- [ ] PROTECCIONES FÍSICAS COMO REJAS, CERRADURAS: SI/NO
- [ ] EL POLÍGONO CUENTA CON VIGILANCIA PROPIA: SI/NO
- [ ] ¿TIENES ALARMA DE ROBO CONECTADA A CENTRAL DE ALARMA? SI/NO
- [ ] ¿tienes Circuito Cerrado de Televisión/Cámaras?

6 Pantalla:

Resumen de todo lo cargado.

7 Pantalla:

Recomendaciones de seguros.

Ya ayer hicimos los cambios para Responsabilidad y hacerlo de esta forma! Te dejo la querie que ejecutamos para hacer los cambios en la base de datos.
-- 1. Tabla para información de contacto
CREATE TABLE contact_info (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
name TEXT,
email TEXT,
phone TEXT,
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Añadir campo JSONB a la tabla de formularios
ALTER TABLE forms ADD COLUMN form_data JSONB;
ALTER TABLE forms ADD COLUMN step INTEGER DEFAULT 1;
ALTER TABLE forms ADD COLUMN is_completed BOOLEAN DEFAULT FALSE;

-- 3. Tabla para versiones de formularios (opcional)
CREATE TABLE form_versions (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
form_id UUID REFERENCES forms(id) ON DELETE CASCADE,
data JSONB NOT NULL,
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabla para adjuntos (opcional)
CREATE TABLE attachments (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
form_id UUID REFERENCES forms(id) ON DELETE CASCADE,
file_path TEXT NOT NULL,
file_name TEXT NOT NULL,
file_type TEXT,
file_size INTEGER,
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Asegurar que existan los campos necesarios en la tabla companies
ALTER TABLE companies ADD COLUMN IF NOT EXISTS tipo_empresa TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS cnae_code TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS online_invoice_percentage NUMERIC DEFAULT 0;

-- 6. Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_forms_session_id ON forms(session_id);
CREATE INDEX IF NOT EXISTS idx_forms_type ON forms(type);
CREATE INDEX IF NOT EXISTS idx_contact_info_session_id ON contact_info(session_id);
CREATE INDEX IF NOT EXISTS idx_companies_session_id ON companies(session_id);
CREATE INDEX IF NOT EXISTS idx_companies_cnae_code ON companies(cnae_code);

-- 7. Configuración de políticas RLS (opcional, adaptar según necesidades)
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acceso a información de contacto por session_id" ON contact_info
USING (session_id::text = auth.uid()::text);

-- 8. Actualizar la tabla form_responsabilidad_civil (mantener compatibilidad)
ALTER TABLE form_responsabilidad_civil ADD COLUMN IF NOT EXISTS actividad JSONB;
ALTER TABLE form_responsabilidad_civil ADD COLUMN IF NOT EXISTS empresa_tipo TEXT;

-- Permitir insertar nuevas filas a cualquier usuario
CREATE POLICY "Allow insert for all users" ON contact_info
FOR INSERT WITH CHECK (true);

-- Permitir seleccionar filas por session_id
CREATE POLICY "Allow select by session_id" ON contact_info
FOR SELECT USING (true);

Que deberiamos hacer para hacer estos cambios? Tenes todo el codigo de githubg actualizado para guiarte! Antes de escribir codigo porfavor informame como vamos a hacer para seguir! Importante que sigamos la misma metodologia de trabajar de tener diferentes partes de codigo para cada pantalla!
