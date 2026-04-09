# Arquitectura Base

## Objetivo

Construir un SaaS multitenant para inmobiliarias de Paraguay con foco en operacion comercial asistida por automatizacion e IA sobre canales propios del tenant, especialmente WhatsApp.

## Decisiones Base

### 1. Modelo multitenant

- Un `tenant` representa una inmobiliaria.
- Todas las entidades de negocio llevan `tenant_id`.
- El aislamiento se aplica en dos capas:
  - Aplicacion: el dashboard siempre opera dentro de un tenant activo.
  - Base de datos: RLS en Postgres valida que el usuario autenticado pertenezca al tenant.
- Un usuario puede pertenecer a varios tenants en el futuro. Para el MVP, la UI trabaja con un tenant activo por request, pero RLS permite acceso solo a tenants donde exista membresia activa.

### 2. Auth y autorizacion

- La identidad vive en `auth.users` de Supabase.
- `user_profiles` contiene el perfil funcional.
- `platform_users` modela roles globales de plataforma como `platform_admin`.
- `tenant_users` modela membresias y roles por tenant.
- Las decisiones de permisos se resuelven con helpers SQL (`is_platform_admin`, `has_tenant_role`) y con guards de servidor en Next.js.

### 3. Source of truth

- Las propiedades, configuracion comercial, FAQs y estados comerciales viven en tablas propias.
- La IA no define precios, disponibilidad ni reglas.
- La capa AI se diseña como un adapter para:
  - interpretar intenciones
  - extraer datos estructurados
  - redactar respuestas naturales
  - resumir conversaciones

### 4. Integraciones

- `integrations/channels` encapsula proveedores externos.
- `channels` define el contrato comun.
- `channel_whatsapp_accounts` cubre detalles de WhatsApp Cloud API.
- Los secretos no se exponen en tablas operativas; el modelo deja `credentials_ref` para integracion posterior con Vault o secreto externo.
- Los webhooks entran por route handlers y se transforman en eventos y mensajes internos.

### 5. Dominio

El MVP se organiza en estos bounded contexts pragmaticos:

- Identity & Access: usuarios, perfiles, roles, tenant context.
- Tenant Operations: configuracion general, branding, canales, FAQs.
- Inventory: propiedades y atributos.
- Commercial CRM: leads, pipeline, appointments.
- Conversation Hub: conversaciones, mensajes, handoff humano.
- Automation: reglas simples, templates, eventos.
- Intelligence: servicios abstractos para retrieval, rules y language generation.

### 6. Criterio de implementacion

- Foundation primero: auth, multitenancy, RLS, esquema, dashboard, CRUD base.
- No sobreconstruir eventos complejos ni jobs distribuidos en Fase 0.
- Server components + server actions para CRUD interno.
- Route handlers para webhooks, callbacks y endpoints externos.
- Validacion con Zod en limites de entrada.

## Flujo Base del MVP

1. Un usuario inicia sesion con Supabase Auth.
2. La app resuelve sus membresias activas y define tenant activo.
3. El dashboard filtra todos los datos por ese tenant.
4. Propiedades, FAQs y configuracion comercial alimentan respuestas automatizadas.
5. Un mensaje entrante por WhatsApp se vincula a `channel`, `conversation`, `lead` y eventualmente `property`.
6. La automatizacion responde con datos estructurados o deriva a humano.
7. Cada evento importante queda trazado en `audit_logs` y `channel_events`.

## Riesgos y decisiones explicitas

- `RLS + tenant membership` es suficiente para un MVP serio en un unico proyecto Supabase. Si el producto exige aislamiento mas duro por compliance, luego puede evolucionar a un modelo hybrid o database-per-tenant para cuentas enterprise.
- El tenant activo no se persiste aun en claims JWT para evitar complejidad prematura. Se resuelve en aplicacion y RLS valida membresias reales.
- La primera iteracion de conversaciones privilegia trazabilidad y asociacion correcta sobre automatizacion inteligente avanzada.
