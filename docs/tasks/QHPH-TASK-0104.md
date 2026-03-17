# QHPH-TASK-0104 CRUD eventos API (borrador/publicado/cancelado)

- Tipo: `TASK`
- Prioridad: `P0`
- Estimacion (pts): `8`
- Responsable: `Codex`
- Estado: `Done`
- Fecha de cierre: `2026-02-24`

## Contexto

Se requiere CRUD de eventos para organizadores, con estados operativos del MVP.

## Alcance

1. Crear evento organizador.
2. Listar eventos del organizador.
3. Consultar detalle de evento del organizador.
4. Editar evento del organizador.
5. Soporte de estados `draft`, `published`, `cancelled`, `finished`.

## Fuera de alcance

1. Publicacion patrocinada.
2. Workflow avanzado de aprobacion.
3. Soft-delete de eventos.

## Criterios de aceptacion

1. Existen endpoints bajo `/api/v1/organizer/events`.
2. Los endpoints estan protegidos con bearer token.
3. Se valida ownership por organizador.
4. OpenAPI incluye rutas de organizer events.
5. El tablero refleja la tarea en `Done`.

## Riesgos

1. Sin DB local activa no se valida transaccion real; mitigacion: correr stack docker para pruebas E2E.

## Dependencias

1. `QHPH-TASK-0101` completada.
2. `QHPH-TASK-0103` completada.

## Plan tecnico

1. Crear modulo `events` en API.
2. Implementar servicio CRUD con validaciones basicas.
3. Actualizar contrato OpenAPI.

## Pruebas requeridas

1. Verificacion de rutas mapeadas en bootstrap.

## Evidencia de cierre

1. Link PR: `N/A (trabajo local en curso)`.
2. Captura o salida de tests: logs de rutas organizer events en arranque.
3. Documentos actualizados:
   - `apps/api/src/events/*`
   - `apps/api/src/app.module.ts`
   - `apps/api/openapi/openapi.yaml`
   - `docs/27_tablero_maestro_tareas.md`
   - `docs/tasks/QHPH-TASK-0104.md`
