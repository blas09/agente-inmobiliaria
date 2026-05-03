# AGENTS.md

## Objetivo del Proyecto

SaaS multitenant para inmobiliarias de Paraguay, enfocado en centralizar propiedades, leads, conversaciones, agenda, FAQs, canales y operacion comercial asistida por automatizacion e IA.

El foco actual es cerrar un MVP comercial testeable con una base seria de multitenancy, permisos, WhatsApp y workflows operativos.

## Reglas Globales

- Mantener aislamiento por tenant en toda entidad de negocio.
- No confiar en permisos de UI como unica barrera.
- Validar entradas con Zod en limites de entrada.
- Antes de implementar una feature nueva, clasificarla como `MVP`, `post-MVP`, `deuda tecnica`, `bug` o `exploracion`.
- No implementar features `post-MVP` o `exploracion` sin decision explicita.
- Preferir patrones existentes antes de crear nuevas abstracciones.
- Mantener cambios acotados al dominio de la tarea.
- No cambiar la direccion visual global sin una decision explicita.
- No tocar `.env.local`, secretos ni credenciales reales salvo pedido explicito.
- No revertir cambios ajenos.
- No documentar por reflejo; actualizar documentacion cuando cambien decisiones, estado del MVP, convenciones o comportamiento relevante.

## Gobierno del MVP

El proyecto debe avanzar sobre un MVP acotado. La prioridad es validar una operacion comercial completa para una inmobiliaria antes de expandir alcance.

### Alcance MVP

- Usuarios, roles y permisos suficientemente seguros para pruebas internas.
- Propiedades operativas como source of truth comercial.
- Leads operativos con asignacion, estado y pipeline basico.
- Conversaciones operativas con respuesta manual, handoff y vinculos a lead/propiedad.
- Agenda basica usable para visitas.
- WhatsApp suficientemente confiable para pruebas internas.
- Reportes minimos para entender actividad comercial.

### Fuera de Alcance Hasta Decision Explicita

- IA avanzada.
- Billing.
- Omnicanal completo.
- Google Calendar.
- Automatizaciones complejas.
- Reescritura visual global.
- Integraciones externas grandes que no bloqueen la validacion del MVP.

### Clasificacion de Trabajo

- `MVP`: necesario para probar o vender el MVP comercial inicial.
- `bug`: error reproducible o riesgo operativo actual.
- `deuda tecnica`: mejora necesaria para sostener seguridad, calidad o velocidad sin cambiar producto visible.
- `post-MVP`: valioso, pero no necesario para validar el MVP.
- `exploracion`: investigacion o prueba sin compromiso de implementacion.

Solo `MVP`, `bug` y deuda tecnica justificada deben entrar al flujo normal de implementacion.

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

### Product Owner

Define que vale la pena construir y que queda fuera. Mantiene el foco del MVP, prioriza por valor comercial y valida que cada feature ayude al flujo principal de operacion inmobiliaria: propiedad -> lead -> conversacion -> visita -> seguimiento.

Debe bloquear scope creep cuando una idea no ayuda a probar o vender el MVP comercial inicial.

### Project Manager

Convierte el roadmap en ejecucion ordenada. Crea tareas concretas, separa epicas, features, bugs y deuda tecnica, define dependencias, mantiene estado de avance y verifica que cada tarea tenga criterio de cierre.

Debe mantener actualizados `docs/roadmap.md`, `docs/mvp-status.md` y `docs/pending.md` cuando cambia el estado real del proyecto.

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

1. Product Owner define objetivo, valor comercial, alcance MVP y prioridad.
2. Project Manager convierte el objetivo en tareas concretas, dependencias y criterio de cierre.
3. Feature Lead define plan tecnico, riesgos, dominios afectados, orden de trabajo y verificacion minima.
4. Arquitectura y Multitenancy revisa impacto en estructura, tenant isolation, RLS y permisos.
5. Dominio Comercial valida el comportamiento esperado si la feature toca workflows de negocio.
6. Backend / Seguridad implementa o revisa modelo, queries, server actions, route handlers, policies y validaciones.
7. Integraciones / WhatsApp participa si hay canales, webhooks, templates, eventos o proveedores externos.
8. Frontend / UX Operativa implementa la interfaz usando patrones existentes.
9. QA / Verificacion ejecuta checks automatizados y pruebas manuales proporcionales al riesgo.
10. Project Manager actualiza estado de avance y bloqueos.
11. Documentacion / Roadmap actualiza documentos si corresponde.

## Orquestacion Para Roadmap

1. Product Owner define o ajusta el objetivo del MVP.
2. Project Manager revisa `docs/roadmap.md`, `docs/mvp-status.md` y `docs/pending.md`.
3. Product Owner y Project Manager clasifican items como `MVP`, `post-MVP`, `deuda tecnica`, `bug` o `exploracion`.
4. Project Manager ordena el backlog en `must have`, `should have`, `post-MVP`, `no tocar todavia` y `bugs / hardening`.
5. Feature Lead toma solo tareas listas para implementacion, con alcance y criterio de cierre claros.
6. Al cerrar una tarea, Project Manager actualiza el estado documental si corresponde.

## Flujo Para Bugs

1. Reproducir o aislar el bug.
2. Identificar dominio y owner principal.
3. Corregir la causa, no solo el sintoma visible.
4. Agregar o ajustar pruebas si el bug es facil de cubrir.
5. Ejecutar verificacion enfocada.
6. Documentar solo si cambia comportamiento esperado o estado del roadmap.

## Checklist Antes de Cerrar

- La tarea fue clasificada como `MVP`, `bug`, `deuda tecnica`, `post-MVP` o `exploracion`.
- Si no era `MVP` ni `bug`, hubo decision explicita para avanzar.
- El criterio de cierre esta cumplido.
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
