# QHPH-TASK-0010 Documento de runbook local, staging y release mobile

- Tipo: `TASK`
- Prioridad: `P1`
- Estimacion (pts): `3`
- Responsable: `Codex`
- Estado: `Done`
- Fecha de cierre: `2026-02-24`

## Contexto

Se requiere guia operativa unica para ejecutar el ciclo local->staging->release mobile.

## Alcance

1. Runbook de arranque local.
2. Flujo de validacion en staging.
3. Flujo de release mobile y rollback.

## Fuera de alcance

1. Automatizaciones avanzadas de release.
2. Politicas de incidentes detalladas.

## Criterios de aceptacion

1. Existe documento runbook versionado.
2. Incluye pasos de local, staging, release y rollback.
3. El tablero refleja la tarea en `Done`.

## Riesgos

1. Procedimiento puede evolucionar con CI/CD; mitigacion: mantener versionado por cambios de pipeline.

## Dependencias

1. `QHPH-TASK-0006` completada.
2. `QHPH-TASK-0007` completada.

## Plan tecnico

1. Redactar runbook con comandos reales del repo.
2. Incluir checks operativos minimos.
3. Registrar cierre de tarea.

## Pruebas requeridas

1. Verificacion de presencia y consistencia del runbook.

## Evidencia de cierre

1. Link PR: `N/A (trabajo local en curso)`.
2. Captura o salida de tests: verificacion de archivo runbook creado.
3. Documentos actualizados:
   - `docs/29_runbook_local_staging_mobile.md`
   - `docs/27_tablero_maestro_tareas.md`
   - `docs/tasks/QHPH-TASK-0010.md`
