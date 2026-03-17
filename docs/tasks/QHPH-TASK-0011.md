# QHPH-TASK-0011 Definir contratos region-aware en modelo de datos

- Tipo: `TASK`
- Prioridad: `P0`
- Estimacion (pts): `3`
- Responsable: `Codex`
- Estado: `Done`
- Fecha de cierre: `2026-02-24`

## Contexto

Se requiere endurecer reglas de datos globales para evitar deuda al escalar por pais/region.

## Alcance

1. Documento formal de contratos region-aware.
2. Constraints SQL en tablas core.
3. Trazabilidad de cierre en tablero.

## Fuera de alcance

1. Validacion automatizada de timezone IANA en DB.
2. Migracion de datos historicos.

## Criterios de aceptacion

1. Existe documento de contratos en `docs/`.
2. Existe migracion de constraints region-aware.
3. El tablero refleja la tarea en `Done`.

## Riesgos

1. Validaciones parciales a nivel DB; mitigacion: complementar en capa API en tareas funcionales.

## Dependencias

1. `QHPH-TASK-0005` completada.

## Plan tecnico

1. Definir reglas formales de contrato de datos.
2. Versionar migracion con checks de consistencia.
3. Registrar cierre de tarea.

## Pruebas requeridas

1. Verificacion de archivos de contrato y migracion.

## Evidencia de cierre

1. Link PR: `N/A (trabajo local en curso)`.
2. Captura o salida de tests: verificacion de archivos creados.
3. Documentos actualizados:
   - `docs/30_data_contracts_region_aware.md`
   - `apps/api/prisma/migrations/20260224_0002_region_contracts/migration.sql`
   - `docs/27_tablero_maestro_tareas.md`
   - `docs/tasks/QHPH-TASK-0011.md`
