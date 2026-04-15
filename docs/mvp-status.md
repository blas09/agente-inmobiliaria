# Estado Actual del MVP

Fecha de corte: 2026-04-15

Este documento resume:

1. Qué ya está suficientemente sólido.
2. Qué falta para considerar el producto un primer MVP testeable.
3. Qué falta para un MVP comercial más serio.
4. Qué hace cada sección del sistema y cómo debería usarse.

## Estado actual

El proyecto ya tiene una base operativa real:

- multitenancy con RLS
- autenticación y membresías
- propiedades, leads y conversaciones
- agenda interna básica
- FAQs y canales
- shell visual consistente y usable
- WhatsApp bastante más endurecido que antes
- templates por tenant con base backend, UI y auditoría

Conclusión práctica:

- ya se puede empezar una ronda de pruebas funcionales internas
- todavía no está listo para clientes reales sin supervisión
- el mayor valor ahora está en probar flujo completo de operación y cerrar huecos de negocio, no en seguir puliendo foundation

## Qué falta para un primer MVP testeable

Esto es lo mínimo razonable para empezar a usar el sistema en pruebas internas con disciplina.

### 1. Invitaciones y gestión de usuarios

Falta:

- revisar guards de UI por rol
- cerrar mejor la gestión multi-tenant

Ya existe base usable:

- desde `Settings` ya se puede sumar un usuario existente o invitar uno nuevo por email
- si el email no existe, se envía invitación por Supabase y la membresía queda en `invited`

Impacto:

- hoy podés operar con usuarios seed o cargados manualmente
- para pruebas internas chicas alcanza
- para pruebas con un equipo real, empieza a faltar rápido

### 2. Pipeline y agenda operativa

Falta:

- historial de pipeline más consistente y auditable
- disponibilidad real por asesor
- agenda con ocupación real, no solo reglas estáticas por tenant

Impacto:

- hoy se pueden registrar visitas y reglas
- todavía no resuelve bien conflictos de disponibilidad

### 3. Leads más maduros

Falta:

- deduplicación / merge
- búsqueda y filtros más potentes
- mejor trazabilidad de evolución comercial

Impacto:

- para pruebas internas simples sirve
- para volumen real, se empiezan a duplicar contactos y ruido comercial

### 4. Reportes mínimos

Falta:

- por asesor
- por etapa
- tiempo de respuesta
- conversión

Impacto:

- hoy el dashboard muestra métricas muy básicas
- todavía no sirve para gestión comercial real

### 5. Cierre de WhatsApp operativo

Ya está bastante avanzada esta parte, pero todavía faltan piezas para darla por totalmente cerrada:

- sincronización/aprobación real con Meta para templates
- validación más fina de componentes por tipo de template si se quiere ir más allá
- eventualmente métricas más ricas por template y por canal

Impacto:

- para pruebas internas ya empieza a servir
- para operación seria todavía faltan controles y visibilidad

## Qué falta para un MVP comercial serio

Esto ya no es “para empezar a probar”, sino para venderlo con menos riesgo operativo.

### Tenants y branding

Falta:

- branding básico por tenant
- selector multi-tenant robusto
- mejores defaults por usuario

### Canales y credenciales

Falta:

- conexión funcional de cuenta Meta desde UI
- gestión segura y más completa de credenciales por tenant
- alta de canal más guiada

### Calidad técnica

Falta:

- tests de integración / e2e
- logs más útiles y operables
- rate limiting en endpoints sensibles

### Reportes y operación

Falta:

- tablero comercial útil para seguimiento
- métricas por asesor y por etapa
- visibilidad de conversión y tiempos

## Orden recomendado para seguir

Orden pragmático:

1. usuarios / invitaciones / permisos finos
2. pipeline + agenda operativa real
3. reportes básicos
4. cierre de WhatsApp con integración más real de templates

Si la prioridad es “empezar a probar cuanto antes”, entonces:

1. estabilizar usuarios/roles
2. probar flujo completo propiedad -> lead -> conversación -> visita
3. cerrar los gaps encontrados

## Guía funcional por sección

### Resumen

Qué hace:

- muestra el estado general del tenant
- sirve como tablero de entrada
- concentra métricas resumidas y actividad reciente

Cómo usarlo:

- entrar para entender volumen actual de propiedades, leads y conversaciones
- revisar actividad reciente
- usarlo como punto de partida, no como herramienta de operación detallada

### Propiedades

Qué hace:

- mantiene el inventario estructurado del tenant
- guarda datos comerciales clave de cada propiedad
- actúa como source of truth para respuestas y matching comercial

Cómo usarlo:

- crear propiedades nuevas
- completar datos relevantes para venta/alquiler
- editar y consultar fichas
- vincular después leads y conversaciones contra propiedades reales

Limitaciones actuales:

- media/storage todavía no está cerrada
- filtros avanzados todavía son básicos

### Leads

Qué hace:

- concentra consultas o interesados capturados por canales o carga manual
- permite asignar estado comercial, pipeline y asesor

Cómo usarlo:

- crear lead manual si entra fuera del flujo automático
- revisar detalle del lead
- asignar asesor
- mover por pipeline
- agendar visitas desde el lead cuando corresponda

Limitaciones actuales:

- sin deduplicación/merge
- filtros todavía limitados

### Conversaciones

Qué hace:

- centraliza la operación conversacional
- muestra timeline de mensajes
- permite respuesta manual
- permite handoff humano y vínculo con lead/propiedad

Cómo usarlo:

- revisar conversaciones abiertas
- responder manualmente
- derivar a humano
- asignar asesor
- vincular con un lead y una propiedad
- usar templates aprobados cuando corresponda

Limitaciones actuales:

- la UX del uso de templates todavía puede mejorar
- sigue siendo una operación de WhatsApp-first

### Agenda

Qué hace:

- registra visitas internas del sistema
- aplica reglas de agenda por tenant
- muestra citas y estado operativo básico

Cómo usarlo:

- crear visitas desde lead o conversación vinculada
- confirmar/cancelar
- revisar reglas activas

Limitaciones actuales:

- no hay disponibilidad real por asesor
- no hay Google Calendar todavía

### FAQs

Qué hace:

- permite guardar respuestas frecuentes estructuradas por tenant
- sirve como base de conocimiento comercial

Cómo usarlo:

- crear preguntas frecuentes
- mantener activas/inactivas
- reutilizarlas como base de respuestas del negocio

Limitaciones actuales:

- categorías y búsqueda todavía básicas

### Canales

Qué hace:

- concentra el estado operativo de canales
- hoy enfocado en WhatsApp
- muestra templates, auditoría y métricas operativas básicas

Cómo usarlo:

- revisar si el canal está conectado
- administrar templates del tenant
- aprobar/pausar/rechazar templates localmente
- revisar métricas e incidentes recientes

Limitaciones actuales:

- falta aprobación/sync real con Meta
- falta alta guiada de canal desde UI

### Configuración

Qué hace:

- concentra configuración operativa del tenant
- incluye miembros y reglas generales

Cómo usarlo:

- revisar y administrar usuarios internos del tenant
- ajustar parámetros globales
- revisar reglas de agenda interna

Limitaciones actuales:

- todavía faltan invitaciones por email
- roles/guards pueden endurecerse más

### Platform / Tenants

Qué hace:

- sección de administración global para platform admins
- permite crear y editar tenants

Cómo usarlo:

- crear tenants nuevos
- editar metadata general
- operar como administración de plataforma, no como usuario comercial del tenant

## Qué ya se puede probar hoy

Flujos recomendados para prueba interna:

### Flujo 1

- crear propiedad
- crear lead
- vincular conversación al lead
- responder manualmente
- mover estado/pipeline
- agendar visita

### Flujo 2

- crear FAQ
- crear template WhatsApp
- aprobarlo localmente
- usarlo desde conversación manual

### Flujo 3

- gestionar miembros del tenant
- verificar visibilidad por rol
- revisar dashboard y listados principales

## Criterio de salida para “primera ronda de pruebas”

Yo daría el sistema como listo para una primera ronda seria de pruebas internas cuando:

- el flujo propiedad -> lead -> conversación -> visita funcione sin fricción fuerte
- la gestión de usuarios no dependa de carga manual torpe
- no aparezcan errores runtime en páginas principales
- WhatsApp permita al menos operación manual y templates básicos sin romperse

## Recomendación final

El producto ya no está en etapa de “foundation”. Ya está en etapa de:

- probar flujo real
- detectar bloqueos de operación
- cerrar UX de negocio

La prioridad correcta ahora no es más diseño base ni más infraestructura, sino:

1. usuarios y permisos
2. pipeline y agenda
3. reportes básicos
4. cierre operativo de WhatsApp
