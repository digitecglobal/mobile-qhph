# QHPH-TASK-0103 Modelo de datos eventos

- Tipo: `TASK`
- Prioridad: `P0`
- Estimacion (pts): `8`
- Responsable: `Codex`
- Estado: `Done`
- Fecha de cierre: `2026-02-24`

## Contexto

Se requiere fortalecer el modelo de eventos para discovery, detalle y validaciones basicas de consistencia.

## Alcance

1. Extender modelo `Event` con `slug` unico.
2. Agregar constraint de rango temporal (`end_at >= start_at`).
3. Versionar migracion de refuerzo del modelo.

## Fuera de alcance

1. Backfill de slugs para data historica.
2. Estrategia de slugging automatica en servicio API.

## Criterios de aceptacion

1. `Event` incluye `slug` unico en schema Prisma.
2. Existe migracion con constraints de consistencia temporal.
3. El tablero refleja la tarea en `Done`.

## Riesgos

1. Slug puede quedar nulo hasta implementar CRUD de eventos; mitigacion: setear slug obligatorio en `QHPH-TASK-0104`.

## Dependencias

1. `QHPH-TASK-0005` completada.

## Plan tecnico

1. Actualizar schema Prisma de eventos.
2. Versionar migracion SQL incremental.
3. Registrar cierre en tablero.

## Pruebas requeridas

1. Verificacion de schema y migracion versionada.

## Evidencia de cierre

1. Link PR: `N/A (trabajo local en curso)`.
2. Captura o salida de tests: verificacion de archivos de schema/migracion.
3. Documentos actualizados:
   - `apps/api/prisma/schema.prisma`
   - `apps/api/prisma/migrations/20260224_0004_event_model_refine/migration.sql`
   - `docs/27_tablero_maestro_tareas.md`
   - `docs/tasks/QHPH-TASK-0103.md`
