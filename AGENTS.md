# AGENTS.md

## Objetivo del Proyecto

SaaS multitenant para inmobiliarias de Paraguay, enfocado en centralizar propiedades, leads, conversaciones, agenda, FAQs, canales y operacion comercial asistida por automatizacion e IA.

El foco actual es cerrar un MVP comercial testeable con una base seria de multitenancy, permisos, WhatsApp y workflows operativos.

## Reglas Globales

- Mantener aislamiento por tenant en toda entidad de negocio.
- No confiar en permisos de UI como unica barrera.
- Validar entradas con Zod en limites de entrada.
- Preferir patrones existentes antes de crear nuevas abstracciones.
- Mantener cambios acotados al dominio de la tarea.
- No cambiar la direccion visual global sin una decision explicita.
- No tocar `.env.local`, secretos ni credenciales reales salvo pedido explicito.
- No revertir cambios ajenos.
- No documentar por reflejo; actualizar documentacion cuando cambien decisiones, estado del MVP, convenciones o comportamiento relevante.

## Arquitectura

- `app/`: routing, layouts, pages, route handlers y server actions cercanas a la UI.
- `features/`: vistas, forms, schemas y casos de uso de UI por dominio.
- `server/`: queries, repositories, services, policies y logica backend del lado servidor.
- `integrations/`: adapters externos como WhatsApp, email e IA.
- `components/`: componentes visuales reutilizables sin conocimiento fuerte de dominio.
- `lib/`: utilidades compartidas, entorno, helpers y validaciones transversales.
- `supabase/`: migraciones, seed y SQL reproducible.
- `tests/`: pruebas automatizadas.
- `types/`: tipos compartidos.

## Reglas de Dependencia

- `app` puede usar `features`, `components`, `server` y `lib`.
- `features` puede usar `components`, `lib` y `server`.
- `server` no depende de `app`.
- `integrations` puede depender de `server` y `lib`, nunca de `app`.
- `components/ui` no conoce el dominio.

## Multitenancy y Seguridad

- Toda tabla de negocio debe tener `tenant_id`, salvo justificacion explicita.
- Toda query tenant-scoped debe filtrar por tenant activo o apoyarse en RLS de forma controlada.
- Las mutaciones deben validar usuario, tenant y rol en servidor.
- `platform_admin` debe tratarse como rol global separado de la logica tenant-scoped.
- Los webhooks, jobs y operaciones machine-to-machine deben tener reglas separadas, auditables y con uso controlado del service role.
- Los secretos no deben guardarse ni exponerse en tablas operativas; usar referencias como `credentials_ref` cuando aplique.
- La IA no decide verdad de negocio: precios, disponibilidad, reglas comerciales y estado operativo salen de datos estructurados.

## Roles de Agentes

### Feature Lead / Orquestador

Convierte una necesidad de producto en un plan de implementacion concreto. Define alcance, riesgos, dominios afectados, orden de trabajo, verificacion minima y documentacion necesaria.

### Arquitectura y Multitenancy

Valida estructura, boundaries, dependencias, tenant isolation, RLS, roles globales y consistencia con las decisiones base del proyecto.

### Dominio Comercial

Valida el comportamiento funcional de propiedades, leads, conversaciones, agenda, pipeline, FAQs, canales, tenants y operacion inmobiliaria.

### Backend / Seguridad

Implementa y revisa server actions, route handlers, queries, repositories, services, policies, validaciones, permisos y errores.

### Integraciones / WhatsApp

Implementa y revisa webhooks, inbound, outbound, templates, channel events, idempotencia, firma de requests, credenciales por tenant y manejo de errores externos.

### Frontend / UX Operativa

Implementa UI consistente con el sistema visual actual. Prioriza interfaces densas, claras y operativas sobre composiciones de marketing.

### QA / Verificacion

Define y ejecuta la verificacion minima segun el riesgo del cambio. Revisa regresiones, permisos, tenant isolation y flujos manuales criticos.

### Documentacion / Roadmap

Actualiza `README.md`, `docs/roadmap.md`, `docs/mvp-status.md`, `docs/pending.md` u otros documentos cuando cambian decisiones, convenciones, estado del MVP o comportamiento relevante.

## Orquestacion Para Features Nuevas

1. Feature Lead define objetivo, alcance y riesgo.
2. Arquitectura y Multitenancy revisa impacto en estructura, tenant isolation, RLS y permisos.
3. Dominio Comercial valida el comportamiento esperado si la feature toca workflows de negocio.
4. Backend / Seguridad implementa o revisa modelo, queries, server actions, route handlers, policies y validaciones.
5. Integraciones / WhatsApp participa si hay canales, webhooks, templates, eventos o proveedores externos.
6. Frontend / UX Operativa implementa la interfaz usando patrones existentes.
7. QA / Verificacion ejecuta checks automatizados y pruebas manuales proporcionales al riesgo.
8. Documentacion / Roadmap actualiza documentos si corresponde.

## Flujo Para Bugs

1. Reproducir o aislar el bug.
2. Identificar dominio y owner principal.
3. Corregir la causa, no solo el sintoma visible.
4. Agregar o ajustar pruebas si el bug es facil de cubrir.
5. Ejecutar verificacion enfocada.
6. Documentar solo si cambia comportamiento esperado o estado del roadmap.

## Checklist Antes de Cerrar

- El cambio respeta tenant isolation.
- Las mutaciones validan usuario, tenant y rol en servidor.
- Las entradas estan validadas con schemas o validaciones equivalentes.
- La UI usa componentes y patrones existentes.
- Los estados vacios, errores y feedback transaccional son claros cuando aplican.
- Las migraciones y seeds estan incluidos si cambio el modelo de datos.
- Los webhooks o integraciones tienen idempotencia y trazabilidad cuando aplica.
- Se ejecuto la verificacion minima razonable.
- La documentacion se actualizo si cambio el estado del MVP, una decision o una convencion.

## Comandos Habituales

```bash
pnpm dev
pnpm lint
pnpm test
pnpm build
```

`pnpm dev` y `pnpm start` usan `127.0.0.1:3003` en este repo.

## No Tocar Todavia Sin Decision Explicita

- IA avanzada.
- Billing.
- Omnicanal completo.
- Google Calendar.
- Reescritura visual global.
- Cambios amplios de arquitectura.

