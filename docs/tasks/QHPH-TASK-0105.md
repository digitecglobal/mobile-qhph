# QHPH-TASK-0105 Admin minimo moderacion

- Tipo: `TASK`
- Prioridad: `P1`
- Estimacion (pts): `4`
- Responsable: `Codex`
- Estado: `Done`
- Fecha de cierre: `2026-02-24`

## Contexto

Se requiere capacidad minima de moderacion para revisar y resolver reportes de eventos.

## Alcance

1. Endpoint admin/moderator para listar reportes.
2. Endpoint admin/moderator para actualizar estado de reporte.
3. Control de acceso por rol.

## Fuera de alcance

1. UI de moderacion.
2. Workflow avanzado de evidencias y notas.

## Criterios de aceptacion

1. Existen rutas bajo `/api/v1/admin/reports`.
2. Rutas protegidas por token y rol (`admin|moderator`).
3. OpenAPI incluye rutas de moderacion.
4. El tablero refleja la tarea en `Done`.

## Riesgos

1. Sin data real de reportes la validacion es estructural; mitigacion: validar con seed/reportes en siguiente iteracion.

## Dependencias

1. `QHPH-TASK-0101` completada.
2. `QHPH-TASK-0104` completada.

## Plan tecnico

1. Crear modulo `moderation`.
2. Implementar list/update de reportes.
3. Agregar guard de roles.

## Pruebas requeridas

1. Verificacion de rutas moderacion mapeadas en bootstrap.

## Evidencia de cierre

1. Link PR: `N/A (trabajo local en curso)`.
2. Captura o salida de tests: logs de rutas `/api/v1/admin/reports*`.
3. Documentos actualizados:
   - `apps/api/src/moderation/*`
   - `apps/api/src/auth/roles.guard.ts`
   - `apps/api/src/app.module.ts`
   - `apps/api/openapi/openapi.yaml`
   - `docs/27_tablero_maestro_tareas.md`
   - `docs/tasks/QHPH-TASK-0105.md`
