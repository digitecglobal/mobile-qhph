# QHPH-TASK-0205 Eventos de analitica para onboarding, feed y guardados

- Tipo: `TASK`
- Prioridad: `P0`
- Estimacion (pts): `3`
- Responsable: `Codex`
- Estado: `Done`
- Fecha de cierre: `2026-02-24`

## Contexto

El MVP necesita trazabilidad de embudo para decisiones de producto.

## Alcance

1. Endpoint `POST /api/v1/analytics/events`.
2. Lista controlada de eventos de producto.
3. Integracion mobile para `feed_loaded`, `event_bookmarked`, `organizer_event_published`.

## Fuera de alcance

1. Dashboard BI completo.

## Criterios de aceptacion

1. API registra eventos en `audit_logs`.
2. Mobile dispara tracking en acciones clave (cuando hay token).
3. OpenAPI incluye ruta de analytics.
4. Tablero en `Done`.

## Riesgos

1. Sin token no se persiste analitica en backend.

## Dependencias

1. `QHPH-TASK-0101` completada.

## Plan tecnico

1. Crear modulo `analytics`.
2. Validar whitelist de eventos.
3. Conectar tracking desde provider mobile.

## Pruebas requeridas

1. `tsc --noEmit` API y mobile.

## Evidencia de cierre

1. Link PR: `N/A (trabajo local en curso)`.
2. Captura o salida de tests: compilacion limpia.
3. Documentos actualizados:
   - `apps/api/src/analytics/*`
   - `apps/mobile/src/lib/api.ts`
   - `apps/mobile/src/lib/app-state.tsx`
   - `docs/27_tablero_maestro_tareas.md`
   - `docs/tasks/QHPH-TASK-0205.md`
