# QHPH-TASK-0005 Definir esquema inicial Prisma y primera migracion

- Tipo: `TASK`
- Prioridad: `P0`
- Estimacion (pts): `5`
- Responsable: `Codex`
- Estado: `Done`
- Fecha de cierre: `2026-02-24`

## Contexto

Se necesita una base de datos inicial alineada al dominio del producto para desbloquear API, discovery, organizadores y moderacion.

## Alcance

1. Crear schema Prisma inicial en `apps/api/prisma/schema.prisma`.
2. Versionar primera migracion SQL.
3. Agregar scripts Prisma en `apps/api/package.json`.

## Fuera de alcance

1. Ejecutar migracion contra base real.
2. Seed de datos inicial.
3. Ajustes de performance avanzados.

## Criterios de aceptacion

1. Existen modelos base para entidades core definidas en documentacion.
2. Existe primera migracion versionada.
3. Existen scripts Prisma en modulo API.
4. El tablero refleja la tarea en `Done`.

## Riesgos

1. Sin ejecutar `prisma migrate`, la validacion queda estructural; mitigacion: ejecutar en `QHPH-TASK-0006`.

## Dependencias

1. `QHPH-TASK-0004` completada.

## Plan tecnico

1. Definir enums, modelos y relaciones principales.
2. Crear migration SQL inicial.
3. Registrar cambios y cierre de tarea.

## Pruebas requeridas

1. Verificacion de presencia y consistencia basica de schema/migration.

## Evidencia de cierre

1. Link PR: `N/A (trabajo local en curso)`.
2. Captura o salida de tests: verificacion de archivos Prisma creados.
3. Documentos actualizados:
   - `apps/api/package.json`
   - `apps/api/prisma/schema.prisma`
   - `apps/api/prisma/migrations/migration_lock.toml`
   - `apps/api/prisma/migrations/20260224_0001_init/migration.sql`
   - `docs/27_tablero_maestro_tareas.md`
   - `docs/tasks/QHPH-TASK-0005.md`
