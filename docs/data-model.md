# Modelo de Datos Refinado

## Entidades principales

### Identidad y acceso

- `user_profiles`
  - Perfil aplicativo por usuario autenticado.
- `platform_users`
  - Roles globales como `platform_admin`.
- `tenants`
  - Inmobiliarias.
- `tenant_users`
  - Membresias por tenant y rol.

### Operacion comercial

- `properties`
- `property_media`
- `property_features`
- `leads`
- `lead_property_interests`
- `pipeline_stages`
- `lead_stage_history`
- `appointments`

### Conversaciones y canales

- `channels`
- `channel_whatsapp_accounts`
- `conversations`
- `messages`
- `channel_events`

### Configuracion y automatizacion

- `faqs`
- `automation_rules`
- `audit_logs`

## Ajustes importantes respecto al modelo inicial

### `platform_users`

Agrego esta tabla para no depender de `auth.users.raw_user_meta_data` para permisos globales.

### `tenant_users`

Uso una PK tecnica `id` mas una unique `(tenant_id, user_id)` para permitir auditoria y cambios de estado.

### `tenants`

Agrego:

- `settings jsonb`
- `branding jsonb`

Esto evita una explosion de tablas temprana para configuracion general del tenant.

### `channels`

Agrego:

- `credentials_ref`
- `last_synced_at`

La app necesita modelar la conexion del tenant sin exponer secretos en tablas operativas.

### `conversations`

Agrego:

- `contact_identifier`
- `contact_display_name`
- `handoff_reason`
- `closed_at`

Permite rastrear conversaciones entrantes aunque el lead aun no este consolidado.

### `messages`

Agrego:

- `message_status`
- `error_message`

Esto sirve para outbound por WhatsApp y troubleshooting.

### `channel_events`

La agrego para:

- idempotencia de webhooks
- trazabilidad de integraciones
- re-procesamiento futuro

## Relaciones clave

- `tenant_users.user_id -> auth.users.id`
- `tenant_users.tenant_id -> tenants.id`
- `channels.tenant_id -> tenants.id`
- `properties.advisor_id -> user_profiles.id`
- `leads.assigned_to -> user_profiles.id`
- `leads.pipeline_stage_id -> pipeline_stages.id`
- `conversations.lead_id -> leads.id`
- `conversations.property_id -> properties.id`
- `messages.conversation_id -> conversations.id`
- `channel_whatsapp_accounts.channel_id -> channels.id`

## Convenciones

- Todas las tablas de negocio usan UUID.
- Todas las tablas multitenant tienen indice por `tenant_id`.
- Campos `status` y `type` usan enums donde el conjunto es estable y relevante para negocio.
- `metadata`, `settings`, `payload` y `source_details` usan `jsonb` solo donde la variabilidad lo justifica.
