Contexto de la Aplicación de Seguros para PYMES/Startups - Smart Advice

- Desarrollamos una plataforma para gestionar la selección de seguros (Responsabilidad Civil y Daños Materiales) mediante formularios dinámicos. Los usuarios (PYMES) completan los formularios sin registro, y el sistema genera recomendaciones personalizadas de seguros.

Base de Datos Completa (Supabase)
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

-- Add privacy_policy_accepted column to the contact_info table
ALTER TABLE contact_info
ADD COLUMN privacy_policy_accepted BOOLEAN DEFAULT FALSE;

-- Create index for the new column for better query performance
CREATE INDEX IF NOT EXISTS idx_contact_info_privacy_policy ON contact_info(privacy_policy_accepted);

Estructura del Proyecto

autistaroberts@Bautistas-MacBook-Air smart-advice % tree -I "node_modules|.next|.git|package-lock.json|yarn.lock"
── README.md
├── app
│ ├── api
│ │ ├── companies
│ │ │ └── route.ts
│ │ ├── contact
│ │ │ └── route.ts
│ │ ├── forms
│ │ │ ├── danos-materiales
│ │ │ │ └── route.ts
│ │ │ └── responsabilidad_civil
│ │ │ └── route.ts
│ │ ├── recomendaciones
│ │ │ ├── coberturas
│ │ │ │ └── route.ts
│ │ │ └── route.ts
│ │ ├── session
│ │ │ └── route.ts
│ │ └── test-data
│ │ └── route.ts
│ ├── danos-materiales
│ │ └── page.tsx
│ ├── favicon.png
│ ├── globals.css
│ ├── layout.tsx
│ ├── page.tsx
│ ├── politica-privacidad
│ │ └── page.tsx
│ ├── recomendaciones
│ │ └── page.tsx
│ ├── responsabilidad-civil
│ │ └── page.tsx
│ ├── riesgos-adicionales
│ │ └── page.tsx
│ ├── seguros
│ │ └── page.tsx
│ └── servicios
│ └── page.tsx
├── components
│ ├── CnaeSearch.tsx
│ ├── CombinedCoverageRecommendations.tsx
│ ├── Footer.tsx
│ ├── Navbar.tsx
│ ├── forms
│ │ ├── DanosMaterialesForm.tsx
│ │ ├── MultiStepForm.tsx
│ │ ├── ResponsabilidadCivilForm.tsx
│ │ └── steps
│ │ ├── CapitalesStep.tsx
│ │ ├── CoberturasFormStep.tsx
│ │ ├── CompanyFormStep.tsx
│ │ ├── ConstruccionStep.tsx
│ │ ├── ContactFormStep.tsx
│ │ ├── DanosResumenStep.tsx
│ │ ├── FormSummaryStep.tsx
│ │ ├── ManufacturaFormStep.tsx
│ │ ├── ProteccionIncendiosStep.tsx
│ │ ├── ProteccionRoboStep.tsx
│ │ ├── ServiciosFormStep.tsx
│ │ └── SiniestralidadStep.tsx
│ ├── layout
│ │ └── FormLayout.tsx
│ ├── providers
│ │ └── ToastProvider.tsx
│ └── ui
│ ├── InfoTooltip.tsx
│ ├── LoadingScreen.tsx
│ ├── button.tsx
│ ├── checkbox.tsx
│ ├── command.tsx
│ ├── dialog.tsx
│ ├── form.tsx
│ ├── input.tsx
│ ├── label.tsx
│ ├── popover.tsx
│ ├── radio-group.tsx
│ ├── select.tsx
│ ├── textarea.tsx
│ ├── toast.tsx
│ └── tooltip.tsx
├── components.json
├── context.md
├── contexts
│ ├── DanosFormContext.tsx
│ └── FormContext.tsx
├── lib
│ ├── schemas.ts
│ ├── services
│ │ └── cnaeService.ts
│ ├── session.ts
│ ├── supabase.ts
│ └── utils.ts
├── next-env.d.ts
├── next.config.js
├── package.json
├── postcss.config.js
├── postcss.config.mjs
├── public
│ ├── favicon.png
│ ├── favicons
│ │ └── smart-advice-logo.png
│ ├── file.svg
│ ├── globe.svg
│ ├── images
│ │ ├── legal-pattern.png
│ │ └── smart-advice-logo.png
│ ├── next.svg
│ ├── vercel.svg
│ └── window.svg
├── tailwind.config.js
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

Vamos a hacer cambios que el cliente nos solicita en el form de Danos! Para eso primero tenemos que analizar los cambios que tenemos que hacer.

Basado en los documentos proporcionados, voy a analizar los cambios solicitados para el formulario de Daños Materiales y enfocarme en los cambios del primer paso.

## Análisis de los cambios requeridos

El cliente quiere reorganizar completamente el formulario de Daños Materiales. Actualmente tenemos un flujo de 8 pasos:

1. Información de empresa (CompanyFormStep)
2. Capitales a asegurar (CapitalesStep)
3. Características constructivas (ConstruccionStep)
4. Protección contra incendios (ProteccionIncendiosStep)
5. Protección contra robo (ProteccionRoboStep)
6. Siniestralidad (SiniestralidadStep)
7. Información de contacto (ContactFormStep)
8. Resumen (DanosResumenStep)

Según la solicitud del cliente, el nuevo flujo debe ser:

1. Información General (combinando información de empresa y detalles adicionales)
2. Información de las Instalaciones (anteriormente Características constructivas)
3. Protecciones contra Incendio (con pequeñas modificaciones)
4. Protecciones contra Robo (sin cambios)
5. Capitales a asegurar y Coberturas (combinando capitales con nuevas preguntas sobre coberturas)
6. Siniestralidad (sin cambios)
7. Contacto (permanece igual)
8. Resumen (permanece igual)

Hicimos todos los cambios de arriba ademas de armar una nueva api de recomendaciones pero estamos teniendo problemas! Llegamos a la pagina de recomendaciones pero no nos da ningun recomendacion! Entonces quiero empezar a debbuggear esto! Te voy a pasar el archivo del formualario, con los que yo creo que son importante para debbuggear!
