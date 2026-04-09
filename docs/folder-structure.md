# Estructura de Carpetas

```text
app/
  (auth)/
  (dashboard)/
  api/
components/
  ui/
  layout/
  shared/
features/
  auth/
  tenants/
  properties/
  leads/
  conversations/
  channels/
  faqs/
  dashboard/
integrations/
  channels/
    whatsapp/
  email/
  ai/
lib/
  env/
  utils/
  validations/
server/
  auth/
  db/
  repositories/
  services/
  policies/
  queries/
supabase/
  migrations/
  seed.sql
types/
tests/
```

## Criterio

- `app/`: routing, layouts, pages, route handlers y server actions cercanas a la UI.
- `components/`: componentes visuales reutilizables sin conocimiento fuerte de dominio.
- `features/`: cada dominio empaqueta vistas, forms, schemas y casos de uso de UI.
- `integrations/`: adapters hacia WhatsApp, email y AI.
- `server/`: acceso a datos, policies, queries y servicios de dominio ejecutados del lado servidor.
- `lib/`: utilidades compartidas, entorno, helpers y validaciones transversales.
- `supabase/`: infraestructura SQL reproducible.

## Regla de dependencia

- `app` puede usar `features`, `components`, `server`, `lib`.
- `features` puede usar `components`, `lib`, `server`.
- `server` no depende de `app`.
- `integrations` depende de `server` y `lib`, nunca de `app`.
- `components/ui` no conoce el dominio.
