Contexto de la Aplicación de Seguros para PYMES/Startups - Smart Advice
- Desarrollamos una plataforma para gestionar la selección de seguros (Responsabilidad Civil y Daños Materiales) mediante formularios dinámicos. Los usuarios (PYMES) completan los formularios sin registro, y el sistema genera recomendaciones personalizadas de seguros.

Base de Datos Completa (Supabase)
sql
-- Tabla principal de sesiones temporales
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- Token único
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '24 hours'  -- Opcional para limpieza
);

-- Empresas asociadas a una sesión
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  cif TEXT,
  activity TEXT,                  -- Ej: "Manufactura", "Servicios"
  employees_number INTEGER,
  billing NUMERIC,               -- Facturación anual en euros
  online_invoice BOOLEAN,        -- SI/NO
  installations_type TEXT,       -- "Propietario", "Inquilino"
  m2_installations NUMERIC,
  almacena_bienes_terceros BOOLEAN,
  vehiculos_terceros_aparcados BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Registro de formularios enviados
CREATE TABLE forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  type TEXT NOT NULL,            -- "responsabilidad_civil", "danos_materiales", "riesgos_adicionales"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Formulario de Responsabilidad Civil (PPT 1)
CREATE TABLE form_responsabilidad_civil (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID REFERENCES forms(id) ON DELETE CASCADE,
  actividad_manufactura BOOLEAN,
  producto_consumo_humano BOOLEAN,
  distribucion TEXT[],           -- ["España", "UE", ...]
  tiene_empleados_tecnicos BOOLEAN,
  ambito_territorial TEXT,
  coberturas_solicitadas JSONB   -- Ej: {"exploitation": true, "patronal": true}
);

-- Formulario de Daños Materiales (PPT 2)
CREATE TABLE form_danos_materiales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID REFERENCES forms(id) ON DELETE CASCADE,
  valor_edificio NUMERIC,
  valor_ajuar NUMERIC,
  proteccion_incendios JSONB,   -- Ej: {"extintores": true, "bocas_incendio": false}
  proteccion_robo JSONB,        -- Ej: {"alarma": true, "camaras": true}
  siniestralidad JSONB,         -- Ej: {"ultimos_3_anios": true, "causa": "incendio"}
  almacena_existencias_terceros BOOLEAN,
  tiene_camaras_frigorificas BOOLEAN
);

-- Catálogo de seguros disponibles
CREATE TABLE insurances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,            -- Ej: "Responsabilidad Civil Básico"
  description TEXT,
  coberturas JSONB NOT NULL,     -- Coberturas específicas
  ambito_territorial TEXT[],     -- ["España", "UE", ...]
  tipo TEXT NOT NULL             -- "responsabilidad_civil", "danos_materiales"
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
│   ├── api
│   │   ├── companies
│   │   ├── forms
│   │   ├── recomendaciones
│   │   ├── session
│   │   └── test-data
│   ├── danos-materiales
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── recomendaciones
│   │   └── page.tsx
│   ├── responsabilidad-civil
│   │   └── page.tsx
│   ├── riesgos-adicionales
│   │   └── page.tsx
│   └── seguros
│       └── page.tsx
├── components
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   ├── forms
│   │   ├── DanosMaterialesForm.tsx
│   │   ├── MultiStepForm.tsx
│   │   └── ResponsabilidadCivilForm.tsx
│   └── ui
│       ├── button.tsx
│       ├── checkbox.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── radio-group.tsx
│       └── select.tsx
├── components.json
├── context.md
├── lib
│   ├── schemas.ts
│   ├── session.ts
│   ├── supabase.ts
│   └── utils.ts
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

Responde preguntas específicas → Guarda en form_* según el tipo.

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

Seguir refinando el formulario de responsabilidad civil! Hay varias cosas para mejorar. Ya armamos las actividades de CNAE y el slecetor! Ahora debemos seguir refinando el formulario de responsabilidad civil! 