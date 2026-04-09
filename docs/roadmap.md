# Hoja de Ruta del Proyecto

Estado general:

- `[x]` Hecho
- `[~]` Parcial / base implementada
- `[ ]` Pendiente

## Norte del producto

- `[x]` Definir el objetivo del SaaS: centralizar propiedades, leads, conversaciones y operación comercial por tenant.
- `[x]` Definir que cada inmobiliaria es un tenant aislado.
- `[x]` Definir que los canales son propiedad del cliente y la plataforma solo aporta la capa SaaS.
- `[x]` Definir foco inicial en WhatsApp con expansión futura a otros canales.
- `[x]` Definir principio de source of truth estructurado.
- `[x]` Definir que la IA no decide verdad de negocio.

## Fase 0 · Foundation / Setup

### Arquitectura y decisiones base

- `[x]` Definir arquitectura general del proyecto.
- `[x]` Definir bounded contexts principales.
- `[x]` Definir estrategia multitenant desde día 1.
- `[x]` Definir separación entre UI, dominio, acceso a datos e integraciones.
- `[x]` Definir estrategia de adapters para canales e IA.
- `[x]` Documentar estructura de carpetas.
- `[x]` Documentar modelo de datos refinado.

### Proyecto base

- `[x]` Inicializar proyecto Next.js con App Router.
- `[x]` Configurar TypeScript estricto.
- `[x]` Configurar Tailwind CSS.
- `[x]` Preparar base compatible con shadcn/ui.
- `[x]` Configurar ESLint.
- `[x]` Configurar Prettier.
- `[x]` Configurar testing base con Vitest.
- `[x]` Configurar scripts de desarrollo, build, lint y test.
- `[x]` Documentar variables de entorno.
- `[x]` Configurar puertos locales dedicados para Supabase en este repo.
- `[x]` Configurar captura local de emails de Supabase Auth para desarrollo.
- `[x]` Fijar el frontend local del repo en `127.0.0.1:3003`.
- `[x]` Reservar también puertos dedicados para analytics/vector del stack local de Supabase.

### Supabase y base de datos

- `[x]` Crear estructura `supabase/`.
- `[x]` Crear migración SQL inicial.
- `[x]` Crear enums base de dominio.
- `[x]` Crear tablas de identidad y acceso.
- `[x]` Crear tablas de tenants y membresías.
- `[x]` Crear tablas de propiedades.
- `[x]` Crear tablas de leads.
- `[x]` Crear tablas de conversaciones y mensajes.
- `[x]` Crear tablas de canales y WhatsApp.
- `[x]` Crear tablas de FAQs.
- `[x]` Crear tablas de pipeline y appointments.
- `[x]` Crear tablas de audit logs y channel events.
- `[x]` Crear índices principales.
- `[x]` Crear trigger genérico de `updated_at`.
- `[x]` Crear sync inicial de `auth.users` a `user_profiles`.
- `[x]` Crear seed de desarrollo.
- `[x]` Completar seed de Auth local con `auth.identities` para login email/password.
- `[x]` Alinear seed de `auth.users` con el shape esperado por GoTrue local actual.
- `[x]` Ajustar seed de Auth para columnas no insertables en el esquema local actual.
- `[x]` Crear configuración base de Supabase local.

### Seguridad y multi-tenancy

- `[x]` Definir `tenant_id` obligatorio en entidades de negocio.
- `[x]` Implementar RLS inicial.
- `[x]` Implementar helper SQL `is_platform_admin`.
- `[x]` Implementar helper SQL `is_tenant_member`.
- `[x]` Implementar helper SQL `has_tenant_role`.
- `[x]` Implementar helper SQL `shares_tenant_with_user`.
- `[x]` Forzar RLS en tablas críticas.
- `[~]` Endurecer permisos finos por caso de uso de aplicación.
- `[ ]` Revisar políticas para operaciones machine-to-machine de webhooks y jobs.

### Auth y contexto de tenant

- `[x]` Configurar Supabase SSR server client.
- `[x]` Configurar browser client.
- `[x]` Configurar admin client.
- `[x]` Implementar protección de rutas.
- `[x]` Implementar login.
- `[x]` Implementar logout.
- `[x]` Resolver usuario autenticado en servidor.
- `[x]` Resolver membresías activas del usuario.
- `[x]` Resolver tenant activo por cookie.
- `[x]` Permitir cambio de tenant activo en UI.
- `[~]` Preparar soporte robusto para usuarios con múltiples tenants y defaults persistentes por usuario.

### UI inicial

- `[x]` Crear layout autenticado.
- `[x]` Crear sidebar de navegación.
- `[x]` Crear header con tenant activo y logout.
- `[x]` Crear dashboard base autenticado.
- `[x]` Mostrar indicadores mínimos.
- `[x]` Crear componentes UI reutilizables base.
- `[x]` Resolver diseño desktop-first responsive básico.
- `[x]` Soportar dashboard para `platform_admin` sin tenant activo.
- `[~]` Mejorar estados vacíos, errores y feedback transaccional de forma más consistente.
  Ya existe un patrón compartido para feedback de formularios y vacíos más accionables en dashboard, leads, propiedades, conversaciones, agenda y tenants.
- `[~]` Elevar la calidad visual general del producto: tipografía, color, espaciado, jerarquía y consistencia.
  Shell, login, dashboard, propiedades, leads, conversaciones, settings, appointments y platform/tenants ya fueron refrescados; falta cerrar consistencia total y feedback transaccional.
- `[x]` Definir una dirección visual más intencional para el dashboard SaaS.
- `[~]` Revisar fuentes, tokens de color y estados de componentes base.
  La base visual nueva ya está aplicada y ya se alinearon `Button`, `Card`, `Input`, `Textarea`, `Badge`, `Table`, `Sheet` y `Select` del template; además el shell ya soporta `light/dark mode` con `next-themes` y ahora usa `defaultTheme="system"` como el template original. Resta extender mejor el dark mode a más detalles finos y a alerts, vacíos, estados de carga y detalles complejos.

### Documentación

- `[x]` Crear README inicial.
- `[x]` Documentar setup local.
- `[x]` Documentar credenciales seed.
- `[x]` Documentar arquitectura.
- `[x]` Documentar modelo.
- `[ ]` Documentar estrategia de despliegue Vercel + Supabase.
- `[ ]` Documentar convenciones de desarrollo y criterios de PR.

## Fase 1 · MVP comercial operativo

### UX / UI comercial

- `[~]` Rehacer la dirección visual tomando TailwindAdmin Next.js como referencia de shell y componentes.
  La adopción será parcial: tokens, layout, navegación, tablas y formularios; no se migra la arquitectura ni se injerta el template completo.
  Ya se migró la base a Tailwind 4 y ahora también se adoptó el shell real del template como nueva base: `Header`, `Sidebar` y `AppShell` quedaron rearmados sobre el patrón original, se incorporaron `tailwind-sidebar`, `simplebar-react` y `@iconify/react`, y se mantuvo `next-themes` con `defaultTheme="system"`. El selector de tenant se removió temporalmente para simplificar el header y más adelante se rediseñará si sigue haciendo falta. En esta etapa también se estabilizó el shell para evitar HTML inválido e hidratación rota, dejando `FullLogo` como componente visual puro y delegando el link al contenedor. Además, se corrigió un desvío importante de tokens respecto del template: `--dark` volvió a comportarse como color de shell y el header dejó de alternar entre `sticky` y `fixed`, eliminando el scroll jump y la franja blanca incorrecta. Después de eso, el header se volvió a simplificar para quedar más literal al template: sin shadow ni backdrop agregados, con fondo estable del sistema de tema, search visual, toggle y logout mínimos. El bloque actual ya empezó a reemplazar composición propia por piezas del template en vez de seguir refinando wrappers: se introdujeron `CardBox`, `ProfileWelcome` y `TopCards` adaptado al dominio, y el `dashboard` dejó de depender de `MetricCard` para pasar a una composición más fiel al grid y a las top cards del template. `PageHeader`, `FilterCard` y `MetricCard` quedaron fuera de las páginas principales de operación: `properties`, `leads`, `conversations`, `appointments`, `faqs` y `channels` ya pasaron al mismo patrón del dashboard, con introducción simple, `TopCards` del template adaptado, `CardBox` para contenido y `EmptyState` también montado sobre `CardBox`. También se corrigió el token dark de `lightsecondary` para que el panel de bienvenida del dashboard vuelva al azul grisáceo del template en vez del celeste lavado que teníamos por desvío de mezcla, se eliminó el override local que lo apagaba todavía más en dark, el banner se compactó y se quitaron sus íconos decorativos, el header pasó a usar el mismo fondo del shell para perderse mejor con el background, el borde inferior del header ahora aparece recién después de un pequeño umbral de scroll para que se note la superposición real y la paleta dark base (`background`, `card`, `popover`, `muted`, `border`, `sidebar` y light variants) se realineó a los valores del template. Las primitives centrales del template (`Button`, `Card`, `Input`, `Textarea`, `Badge`, `Table`, `Select`) ya están copiadas dentro del proyecto y `NativeSelect` sigue cubriendo formularios que todavía dependen de `<select>` nativo. `dashboard`, `properties`, `leads`, `conversations`, `appointments`, `settings`, `login`, `faqs`, `channels`, `platform/tenants` y los detalles principales ya fueron remaquetados sobre esa base. Además, por decisión de producto/UX, se eliminaron temporalmente los paneles de filtros visibles de los listados operativos principales (`properties`, `leads` y `appointments`) para simplificar la interfaz; por ahora se conserva la lectura de `searchParams` para no romper filtros por URL/manuales. Falta terminar de propagar ese lenguaje a pantallas secundarias residuales y wrappers/formularios que todavía conserven composición vieja.
- `[~]` Refinar look & feel del dashboard para una estética más profesional y distintiva.
- `[~]` Mejorar tablas, formularios y cards con mejor jerarquía visual.
- `[~]` Migrar formularios internos y pantallas secundarias al mismo sistema visual.
  FAQs, canales, tenants de plataforma, reglas de agenda, tenant forms, tenant users y pipeline stage forms ya fueron alineados; falta revisar residuales menores y después limpiar componentes/estilos viejos.
- `[~]` Terminar la sustitución de wrappers visuales propios por componentes copiados del template.
  La base ya fue copiada al proyecto y la carpeta temporal del template ya se eliminó; resta solo seguir refinando wrappers menores si hace falta.
- `[~]` Consolidar y limpiar residuales del sistema visual anterior.
  Ya se limpiaron la mayoría de colores/clases legacy y se remigraron pantallas secundarias; también se eliminaron las referencias de tooling y se borró la carpeta temporal del template. Falta una pasada final de refinamiento visual menor y cleanup de componentes/estilos residuales si aparecieran.
- `[~]` Alinear tipografía, cards, badges y headings con más fidelidad al template.
  Ya se activó `DM Sans` real vía paquete local, se quitó la sombra visible de `Card`, se bajó el protagonismo visual de `Badge` y se ajustaron `PageHeader` y el dashboard para reducir diferencias perceptibles con el original. Además se hizo un pass global de densidad: `Card`, `PageHeader`, `FilterCard`, `AppShell`, `Table`, `Input`, `Button` y `NativeSelect` quedaron más compactos, y se creó `MetricCard` como patrón reusable para las top cards de dashboard, propiedades, leads, conversaciones, agenda, settings, channels, FAQs y platform/tenants. Ese patrón ya fue realineado a una variante más fiel al template: fondo tonal, composición centrada con ícono opcional y visual más cercana al bloque de métricas ilustrado del original. Después se afinó el contraste del contenido usando tonos más enfáticos sin blanquear el fondo, se redujo su padding para bajar tamaño visual y el radio base de `Card` se alineó a `7px` para acercarse más al template.
- `[~]` Revisar navegación, densidad de información y legibilidad en desktop.
- `[~]` Resolver mejor responsive en vistas clave del CRM.
  Ya se trabajó específicamente sobre leads, conversaciones, propiedades, agenda, settings, login y tenants; todavía falta ajustar pantallas secundarias y algunos detalles finos en tablet/mobile.
- `[~]` Hacer que filtros, vacíos y acciones principales sean más claros y utilizables.
  Leads, propiedades y agenda ya usan formularios GET reales y estados vacíos accionables; falta extender el patrón a más pantallas secundarias.

### Tenant management

- `[~]` Modelo de tenants implementado.
- `[~]` Modelo de roles implementado.
- `[~]` CRUD de tenants desde UI para `platform_admin`.
- `[~]` Pantalla de detalle de tenant.
- `[x]` Cambio de estado de tenant.
- `[x]` Configuración general editable por tenant.
- `[ ]` Branding básico editable.
- `[~]` Selector más completo para usuarios multi-tenant.

### Usuarios y permisos

- `[~]` Tablas y roles implementados.
- `[~]` CRUD de usuarios internos del tenant.
- `[ ]` Invitar usuario por email.
- `[x]` Alta de membresía a tenant.
- `[x]` Cambio de rol por tenant.
- `[x]` Suspender o remover miembro.
- `[x]` Pantalla de gestión de accesos.
- `[~]` Guards de UI por rol.
- `[~]` Policies aplicadas desde acciones/servicios de aplicación.

### Propiedades

- `[x]` Listado de propiedades.
- `[x]` Creación de propiedad.
- `[x]` Edición de propiedad.
- `[x]` Detalle de propiedad.
- `[x]` Borrado de propiedad.
- `[x]` Filtros básicos.
- `[~]` Formularios estructurados para datos principales.
- `[ ]` Asignación de asesor en UI.
- `[ ]` Media real con Supabase Storage.
- `[ ]` Carga de features más rica.
- `[ ]` Paginación y filtros avanzados.
- `[ ]` Importación desde sistemas externos.

### Leads

- `[x]` Listado de leads.
- `[x]` Creación manual de lead.
- `[x]` Edición de lead.
- `[x]` Detalle de lead.
- `[x]` Borrado de lead.
- `[x]` Estado comercial básico.
- `[x]` Selección de etapa pipeline.
- `[x]` Asignación real a asesor desde UI.
- `[~]` Historial de cambios de etapa visible.
- `[ ]` Merge/deduplicación de leads.
- `[ ]` Búsqueda y filtros más completos.

### Conversaciones y mensajes

- `[x]` Modelo base de conversaciones.
- `[x]` Modelo base de mensajes.
- `[x]` Listado de conversaciones.
- `[x]` Detalle de conversación con timeline.
- `[~]` Asociación conceptual a lead y propiedad.
- `[~]` Asociación y edición real desde UI.
- `[x]` Derivación humana accionable desde UI.
- `[x]` Asignación de conversación a asesor.
- `[x]` Respuesta manual desde la plataforma.
- `[~]` Estados operativos más completos.

### FAQs

- `[x]` Listado de FAQs.
- `[x]` Alta de FAQ.
- `[x]` Edición de FAQ.
- `[x]` Borrado de FAQ.
- `[x]` Estado activo/inactivo.
- `[ ]` Búsqueda y categorías más completas.

### Canales

- `[x]` Modelo general de canales.
- `[x]` Modelo específico para cuentas de WhatsApp.
- `[x]` Página básica de canales.
- `[x]` Webhook base de WhatsApp.
- `[ ]` Alta de canal desde UI.
- `[ ]` Conexión funcional de cuenta Meta por tenant.
- `[ ]` Gestión de estados y validaciones de canal.
- `[ ]` Manejo seguro de credenciales por tenant.
- `[ ]` Plantillas por tenant.

### Reportes básicos

- `[x]` Métricas mínimas en dashboard.
- `[x]` Leads por fuente.
- `[x]` Propiedades activas.
- `[x]` Conversaciones abiertas.
- `[ ]` Reporte por asesor.
- `[ ]` Reporte por etapa.
- `[ ]` Reporte de tiempos de respuesta.

## Fase 2 · Automatización inicial

### Calificación y operación

- `[~]` Campo `score` modelado.
- `[~]` Campo `qualification_status` modelado.
- `[ ]` Reglas automáticas de score.
- `[ ]` Reglas automáticas de calificación.
- `[ ]` Etiquetas de leads.
- `[x]` Pipeline editable desde UI.
- `[ ]` Historial de pipeline consistente.

### Follow-up y plantillas

- `[~]` Modelo de `automation_rules` listo.
- `[ ]` Motor simple de reglas.
- `[ ]` Triggers iniciales por evento.
- `[ ]` Follow-up automático por inactividad.
- `[ ]` Plantillas de mensajes.
- `[ ]` Desactivación/pausa de automatizaciones.

### Agenda y visitas

- Decisión vigente:
  - la agenda interna del sistema es la source of truth de negocio para visitas
  - Google Calendar queda planificado como integración posterior para disponibilidad y sincronización, no como reemplazo de `appointments`
- `[x]` Modelo de `appointments` listo.
- `[x]` UI de agenda básica.
- `[~]` Crear visita desde lead o propiedad.
- `[x]` Confirmar/cancelar visita.
- `[x]` Vista simple por asesor.
- `[x]` Reglas de agenda interna por tenant: timezone, duración por defecto, buffers y horarios de atención.
- `[~]` Timeline y auditoría básica de cambios de visita.
- `[ ]` Integración Google Calendar modo `agenda interna + disponibilidad`.
- `[ ]` Conexión OAuth de Google Calendar por tenant o por usuario.
- `[ ]` Consulta de disponibilidad con `freeBusy`.
- `[ ]` Creación de evento externo al confirmar una visita interna.
- `[ ]` Estado de sincronización entre `appointments` y eventos externos.
- `[ ]` Reprogramación/cancelación con estrategia inicial `sistema -> Google`.

### Reportes iniciales

- `[ ]` Dashboard comercial expandido.
- `[ ]` Conversión por etapa.
- `[ ]` Visitas agendadas/completadas.
- `[ ]` Leads calificados vs no calificados.

## Fase 3 · IA más avanzada

### Capa AI

- `[x]` Contrato base de provider AI.
- `[x]` Separación conceptual entre retrieval, business rules y generation.
- `[ ]` Integrar provider AI real.
- `[ ]` Configuración por entorno para provider AI.
- `[ ]` Observabilidad específica de requests AI.

### Inteligencia conversacional

- `[ ]` Interpretación de intención.
- `[ ]` Extracción estructurada de datos desde mensajes.
- `[ ]` Resumen automático de conversaciones.
- `[ ]` Sugerencias para asesores.
- `[ ]` Matching con propiedades similares.
- `[ ]` Respuestas naturales basadas en facts reales.
- `[ ]` Fallback explícito cuando falta información.
- `[ ]` Reglas para evitar alucinaciones.

### Retrieval y grounding

- `[ ]` Servicio de retrieval de propiedades por tenant.
- `[ ]` Servicio de retrieval de FAQs por tenant.
- `[ ]` Construcción de contexto grounded para respuestas.
- `[ ]` Priorización de reglas de negocio sobre output del modelo.

## Fase 4 · Omnicanal y self-service

### Onboarding self-service

- `[ ]` Registro self-service de tenant.
- `[ ]` Wizard inicial de onboarding.
- `[ ]` Configuración inicial de branding y datos comerciales.
- `[ ]` Invitación de equipo durante onboarding.

### Canales adicionales

- `[ ]` Email provider real.
- `[ ]` Inbox de email.
- `[ ]` Web widget básico.
- `[ ]` Instagram.
- `[ ]` Facebook leads.
- `[ ]` Facebook Messenger si aplica.

### SaaS platform

- `[ ]` Billing.
- `[ ]` Planes y límites.
- `[ ]` Restricciones por suscripción.
- `[ ]` Observabilidad y métricas de plataforma.
- `[ ]` Centro de auditoría para platform admin.
- `[ ]` Backoffice de soporte.

## Integración WhatsApp · Hoja específica

### Base ya hecha

- `[x]` Definir que cada tenant conecta su propia cuenta.
- `[x]` Modelar cuenta WhatsApp por tenant.
- `[x]` Modelar canal por tenant.
- `[x]` Modelar eventos inbound/outbound.
- `[x]` Dejar webhook base.
- `[x]` Dejar adapter base.

### Pendiente para operación real

- `[~]` Validación real de webhook Meta.
- `[x]` Parsing del payload de mensajes.
- `[x]` Idempotencia por `external_event_id`.
- `[x]` Lookup de canal por cuenta o número.
- `[x]` Creación o vínculo de conversación.
- `[x]` Creación o vínculo de lead.
- `[x]` Persistencia de mensajes inbound.
- `[x]` Envío outbound real.
- `[~]` Persistencia de estados sent/delivered/read.
- `[ ]` Manejo de errores y retries.
- `[ ]` Templates y aprobaciones por tenant.

## Calidad técnica y operación

### Hecho

- `[x]` TypeScript estricto.
- `[x]` Validación con Zod en formularios principales.
- `[x]` Separación de queries del lado servidor.
- `[x]` Componentes pequeños reutilizables base.
- `[x]` Scripts de lint, test y build.
- `[x]` Verificación de lint.
- `[x]` Verificación de test.
- `[x]` Verificación de typecheck.
- `[x]` Verificación de build.

### Pendiente

- `[ ]` Tests de integración.
- `[ ]` Tests end-to-end.
- `[ ]` Logs estructurados centralizados.
- `[ ]` Error boundaries más completas.
- `[ ]` Trazabilidad de acciones desde servicios.
- `[ ]` Observabilidad de integraciones externas.
- `[ ]` Rate limiting o hardening de endpoints públicos.

## Backlog de cierre de base antes de escalar features

- `[ ]` CRUD de tenants desde UI.
- `[x]` CRUD de tenant users desde UI.
- `[x]` Asignación de asesores real.
- `[x]` Handoff humano accionable.
- `[x]` WhatsApp inbound funcional.
- `[x]` WhatsApp outbound funcional.
- `[~]` Vínculo operativo lead/conversation/property.
- `[x]` Pipeline editable.
- `[ ]` Appointments básicos.
- `[ ]` Storage de media.

## Estado resumido por etapa

- `Fase 0`: mayormente hecha.
- `Fase 1`: parcialmente hecha; base del dominio ya implementada, operación real todavía pendiente.
- `Fase 2`: casi toda pendiente, aunque el modelo base ya existe.
- `Fase 3`: solo la abstracción está hecha.
- `Fase 4`: pendiente.
