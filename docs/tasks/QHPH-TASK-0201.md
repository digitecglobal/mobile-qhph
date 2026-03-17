# QHPH-TASK-0201 Feed de eventos por relevancia

- Tipo: `TASK`
- Prioridad: `P0`
- Estimacion (pts): `10`
- Responsable: `Codex`
- Estado: `Done`
- Fecha de cierre: `2026-02-24`

## Contexto

Se requiere discovery central del MVP con ranking por fecha, distancia, intereses y calidad.

## Alcance

1. Endpoint `GET /api/v1/events` con ranking base.
2. Ranking ponderado con fecha/distancia/interes/calidad/verificacion.
3. Cursor/limit para paginacion basica.

## Fuera de alcance

1. Ranking ML avanzado.
2. Personalizacion por comportamiento historico.

## Criterios de aceptacion

1. Feed devuelve eventos `published` ordenados por score.
2. Soporta contexto de usuario opcional para intereses/bookmarks.
3. OpenAPI actualizado.
4. Tablero actualizado a `Done`.

## Riesgos

1. Sin DB activa se usa fallback vacio en API; mitigacion: mobile demo con fallback mock.

## Dependencias

1. `QHPH-TASK-0103` completada.
2. `QHPH-TASK-0104` completada.

## Plan tecnico

1. Crear modulo `discovery`.
2. Implementar servicio de score y filtros base.
3. Publicar rutas de feed/detalle/map.

## Pruebas requeridas

1. Verificacion de rutas en bootstrap API.
2. `tsc --noEmit` para API.

## Evidencia de cierre

1. Link PR: `N/A (trabajo local en curso)`.
2. Captura o salida de tests: rutas `/api/v1/events*` mapeadas en arranque.
3. Documentos actualizados:
   - `apps/api/src/discovery/*`
   - `apps/api/src/app.module.ts`
   - `apps/api/openapi/openapi.yaml`
   - `docs/27_tablero_maestro_tareas.md`
   - `docs/tasks/QHPH-TASK-0201.md`
