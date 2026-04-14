# Agente Inmobiliaria

SaaS multitenant para inmobiliarias de Paraguay orientado a automatizar la atención comercial de propiedades con foco en WhatsApp, redes sociales y email.

## Estado actual

Esta primera base cubre Fase 0 y parte del MVP:

- arquitectura multitenant documentada
- esquema inicial de Supabase/Postgres con RLS
- seeds de desarrollo
- autenticación con Supabase Auth
- dashboard protegido por tenant
- CRUD de propiedades
- CRUD de leads
- base de conversaciones y mensajes
- ABM básico de FAQs
- modelo, webhook inbound y outbound manual para WhatsApp

## Decisiones clave

- `tenant_id` obligatorio en entidades de negocio.
- RLS como enforcement principal de aislamiento.
- `tenant_users` para roles por inmobiliaria.
- `platform_users` para roles globales como `platform_admin`.
- datos estructurados como source of truth.
- adapters separados para canales, email e IA.
- Next.js App Router + Supabase SSR para auth y queries de servidor.

## Documentación de arquitectura

- [Arquitectura](./docs/architecture.md)
- [Estructura de carpetas](./docs/folder-structure.md)
- [Modelo de datos](./docs/data-model.md)

## Stack

- Next.js 16
- React 19
- TypeScript estricto
- Tailwind CSS
- Supabase
- PostgreSQL
- Zod
- ESLint + Prettier
- Vitest

## Requisitos

- Node.js 20+
- pnpm 10+
- proyecto Supabase listo

## Variables de entorno

Copiar `.env.example` a `.env.local` y completar:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
WHATSAPP_WEBHOOK_VERIFY_TOKEN=
WHATSAPP_APP_SECRET=
WHATSAPP_CLOUD_API_VERSION=
WHATSAPP_CREDENTIALS_JSON=
RESEND_API_KEY=
AI_PROVIDER=
AI_API_KEY=
```

Ejemplo de `WHATSAPP_CREDENTIALS_JSON`:

```json
{
  "vault://tenants/demo-paraguay/whatsapp": {
    "accessToken": "EAAG...",
    "phoneNumberId": "phone-001"
  }
}
```

La clave del objeto puede ser `credentials_ref` o directamente `phone_number_id`.

## Setup local

1. Instalar dependencias:

```bash
pnpm install
```

2. Aplicar migraciones y seed en Supabase.

Si usás Supabase CLI:

```bash
supabase start
supabase db reset
```

La configuración base está en [supabase/config.toml](./supabase/config.toml).

Puertos locales reservados para este proyecto:

- API Supabase: `55421`
- Postgres: `55422`
- Studio: `55423`
- Inbucket web: `55424`
- Inbucket SMTP: `55425`
- Inbucket POP3: `55426`
- Analytics: `55427`
- Analytics vector/syslog: `55428`

Esto evita choques con otras instancias locales de Supabase usando los puertos default.

3. Crear `.env.local` con los valores de la instancia local.

Después de `supabase start`, corré:

```bash
supabase status
```

Y copiá al menos:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:55421
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Para navegar la app no necesitás completar todavía `RESEND_API_KEY` ni `AI_API_KEY`.

4. Levantar la app:

```bash
pnpm dev
```

5. Abrir `http://127.0.0.1:3003`.

## Emails locales de Supabase

La instancia local queda configurada para capturar emails internos de Supabase Auth en Inbucket.

- UI web de emails: `http://127.0.0.1:55424`
- SMTP local: `127.0.0.1:55425`

Esto sirve para inspeccionar correos de autenticación y pruebas locales sin usar un proveedor externo.

## Usuarios seed

- `owner@demo.py` / `Password123!`
- `advisor@demo.py` / `Password123!`
- `admin@platform.local` / `Password123!`

Tenant seed:

- `demo-paraguay`

## Scripts

```bash
pnpm dev
pnpm lint
pnpm test
pnpm build
```

`pnpm dev` y `pnpm start` quedan fijados en `127.0.0.1:3003` para este repo.

## Estructura

```text
app/
components/
features/
integrations/
lib/
server/
supabase/
tests/
types/
```

## Modelo multitenant

- Un tenant = una inmobiliaria.
- Un usuario puede pertenecer a varios tenants.
- El dashboard opera sobre un tenant activo.
- RLS permite acceso solo a tenants con membresía activa.
- `platform_admin` queda fuera de la lógica tenant-scoped.

## Módulos incluidos

- Login y logout.
- Resumen del tenant.
- Propiedades.
- Leads.
- Conversaciones.
- FAQs.
- Canales.
- Configuración base.

## WhatsApp

La integración todavía no completa onboarding con Meta, pero la base ya contempla:

- `channels`
- `channel_whatsapp_accounts`
- `channel_events`
- webhook `GET/POST` en `/api/webhooks/whatsapp`
- ingestión inbound con idempotencia
- creación o vínculo automático de lead y conversación
- respuesta manual outbound desde la vista de conversación
- adapter `WhatsAppCloudProvider`

## Calidad

Verificado en esta iteración con:

- `pnpm lint`
- `pnpm test`
- `pnpm exec tsc --noEmit`
- `pnpm build`

## Siguiente etapa recomendada

1. CRUD real de usuarios por tenant y gestión de invitaciones.
2. endurecimiento de credenciales y retries de WhatsApp.
3. asociación operativa más rica lead <-> conversación <-> propiedad.
4. pipeline editable y appointments.
5. automatizaciones simples y templates.
6. onboarding guiado de canales.
