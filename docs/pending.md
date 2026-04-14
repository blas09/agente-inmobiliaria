# Pendientes Globales (Estado Actual)

Este archivo resume lo que **falta** para cerrar el MVP comercial y lo que **no conviene** abordar todavía.

## Pendientes para cerrar MVP comercial

### Tenants y usuarios
- Invitaciones por email.
- Roles/guards más finos en UI.
- Selector multi‑tenant robusto.
- Branding básico por tenant (logo, color, nombre comercial).

### WhatsApp operativo real
- Firma robusta del webhook + logging de firmas inválidas.
- Mapeo completo de estados de entrega y idempotencia refinada.
- Retries outbound con backoff.
- Templates por tenant.
- Gestión segura de credenciales por tenant.
- Validación de estados de canal y errores operativos.

### Leads
- Deduplicación/merge.
- Filtros y búsqueda más potentes.
- Historial de pipeline consistente.

### Pipeline y agenda
- Historial de pipeline auditable.
- Disponibilidad real por asesor (antes de Google Calendar).
- Appointments con visibilidad operativa más clara.

### Reportes mínimos
- Por asesor.
- Por etapa.
- Tiempo de respuesta.
- Conversión.

### Calidad / operatividad
- Logs estructurados más útiles.
- Tests de integración/e2e.
- Rate limiting en endpoints sensibles.

## No tocar todavía (post‑MVP)
- IA avanzada.
- Google Calendar.
- Billing.
- Omnicanal completo.

## Orden recomendado
1. WhatsApp hardening.
2. Invitaciones y gestión de usuarios.
3. Pipeline + agenda operativa.
4. Reportes básicos.
