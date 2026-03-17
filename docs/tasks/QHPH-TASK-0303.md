# QHPH-TASK-0303 Validaciones de calidad y deteccion basica de duplicados

- Tipo: `TASK`
- Prioridad: `P0`
- Estimacion (pts): `5`
- Responsable: `Codex`
- Estado: `Done`
- Fecha de cierre: `2026-02-24`

## Contexto

El catalogo del MVP necesita reglas minimas de calidad y control de duplicados.

## Alcance

1. Validacion de URL, rangos de precio y rango temporal.
2. Validacion de referencias (city/category/venue).
3. Deteccion de potencial duplicado por `title + venue + ventana de tiempo`.

## Fuera de alcance

1. Motor semantico de deduplicacion avanzada.

## Criterios de aceptacion

1. Creacion/edicion rechaza payloads fuera de politica.
2. API bloquea duplicados obvios con `ConflictException`.
3. Cambios auditados en `audit_logs`.
4. Tablero en `Done`.

## Riesgos

1. Deteccion exacta puede generar falsos positivos en eventos recurrentes.

## Dependencias

1. `QHPH-TASK-0302` completada.

## Plan tecnico

1. Extender `events.service` con validadores dedicados.
2. Agregar check de deduplicacion previo a persistencia.
3. Auditar cambios de estado del evento.

## Pruebas requeridas

1. `tsc --noEmit` API.

## Evidencia de cierre

1. Link PR: `N/A (trabajo local en curso)`.
2. Captura o salida de tests: compilacion API limpia.
3. Documentos actualizados:
   - `apps/api/src/events/events.service.ts`
   - `docs/27_tablero_maestro_tareas.md`
   - `docs/tasks/QHPH-TASK-0303.md`
