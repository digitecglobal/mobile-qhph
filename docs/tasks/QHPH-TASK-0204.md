# QHPH-TASK-0204 Guardar/quitar evento de favoritos

- Tipo: `TASK`
- Prioridad: `P0`
- Estimacion (pts): `4`
- Responsable: `Codex`
- Estado: `Done`
- Fecha de cierre: `2026-02-24`

## Contexto

Guardar eventos es parte del embudo de activacion del MVP.

## Alcance

1. Endpoints `POST/DELETE /api/v1/events/:id/bookmark`.
2. Endpoint `GET /api/v1/me/bookmarks`.
3. Pantalla mobile `Guardados`.

## Fuera de alcance

1. Sincronizacion offline avanzada.

## Criterios de aceptacion

1. API soporta crear/eliminar/listar bookmarks.
2. Mobile permite guardar/quitar desde feed y detalle.
3. Pantalla dedicada de guardados disponible.
4. Tablero en `Done`.

## Riesgos

1. Sin token API se usa comportamiento local demo en mobile.

## Dependencias

1. `QHPH-TASK-0101` completada.

## Plan tecnico

1. Crear modulo `bookmarks`.
2. Exponer rutas requeridas.
3. Integrar estado local de guardados en provider mobile.

## Pruebas requeridas

1. `tsc --noEmit` API y mobile.

## Evidencia de cierre

1. Link PR: `N/A (trabajo local en curso)`.
2. Captura o salida de tests: compilacion limpia.
3. Documentos actualizados:
   - `apps/api/src/bookmarks/*`
   - `apps/mobile/app/(tabs)/guardados.tsx`
   - `apps/mobile/src/lib/app-state.tsx`
   - `docs/27_tablero_maestro_tareas.md`
   - `docs/tasks/QHPH-TASK-0204.md`
