# QHPH-TASK-0008 Publicar OpenAPI inicial con health endpoints

- Tipo: `TASK`
- Prioridad: `P1`
- Estimacion (pts): `3`
- Responsable: `Codex`
- Estado: `Done`
- Fecha de cierre: `2026-02-24`

## Contexto

Se requiere contrato API inicial versionado para habilitar integracion cliente/backend desde el inicio.

## Alcance

1. Endpoint `GET /api/v1/health` en API.
2. Archivo OpenAPI inicial versionado.
3. Validacion basica de existencia de contrato en CI.

## Fuera de alcance

1. Documentacion completa de todos los endpoints.
2. Generacion automatica de OpenAPI desde decorators.

## Criterios de aceptacion

1. Endpoint health disponible en modulo API.
2. Existe archivo `apps/api/openapi/openapi.yaml`.
3. CI ejecuta chequeo de contrato OpenAPI.
4. El tablero refleja la tarea en `Done`.

## Riesgos

1. Contrato estatico puede quedar desalineado con codigo; mitigacion: fortalecer generacion automatica en tarea posterior.

## Dependencias

1. `QHPH-TASK-0004` completada.
2. `QHPH-TASK-0007` completada.

## Plan tecnico

1. Agregar controlador de health.
2. Definir prefijo global `/api/v1`.
3. Versionar OpenAPI inicial y agregar chequeo en CI.

## Pruebas requeridas

1. Verificacion estructural de endpoint y archivo OpenAPI.

## Evidencia de cierre

1. Link PR: `N/A (trabajo local en curso)`.
2. Captura o salida de tests: verificacion de archivos y workflow CI.
3. Documentos actualizados:
   - `apps/api/src/health/health.controller.ts`
   - `apps/api/src/app.module.ts`
   - `apps/api/src/main.ts`
   - `apps/api/openapi/openapi.yaml`
   - `apps/api/scripts/check-openapi.cjs`
   - `apps/api/package.json`
   - `.github/workflows/ci.yml`
   - `docs/27_tablero_maestro_tareas.md`
   - `docs/tasks/QHPH-TASK-0008.md`
