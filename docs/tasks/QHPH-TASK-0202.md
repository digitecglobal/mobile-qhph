# QHPH-TASK-0202 Filtros por fecha/categoria/distancia/precio

- Tipo: `TASK`
- Prioridad: `P0`
- Estimacion (pts): `8`
- Responsable: `Codex`
- Estado: `Done`
- Fecha de cierre: `2026-02-24`

## Contexto

El feed del MVP requiere filtros accionables para reducir tiempo de descubrimiento.

## Alcance

1. Query params de `categories`, `dateFrom`, `dateTo`, `minPrice`, `maxPrice`, `radiusKm`.
2. Filtros aplicados en backend discovery.
3. UI mobile con chips por categoria y rango de precio.

## Fuera de alcance

1. Filtros geoespaciales avanzados con polygons.
2. Historial guardado de filtros por usuario.

## Criterios de aceptacion

1. API permite filtrar feed por campos definidos.
2. Mobile puede aplicar/quitar filtros y refrescar listado.
3. Se instrumenta evento de analitica de filtro (cuando hay token).
4. Tablero en `Done`.

## Riesgos

1. Sin geolocalizacion de dispositivo, distancia usa parametros manuales.

## Dependencias

1. `QHPH-TASK-0201` completada.

## Plan tecnico

1. Extender query parsing en discovery controller.
2. Aplicar filtros en discovery service.
3. Construir controles de filtro en pantalla `Inicio`.

## Pruebas requeridas

1. `tsc --noEmit` API y mobile.

## Evidencia de cierre

1. Link PR: `N/A (trabajo local en curso)`.
2. Captura o salida de tests: compilacion limpia.
3. Documentos actualizados:
   - `apps/api/src/discovery/*`
   - `apps/mobile/app/(tabs)/index.tsx`
   - `docs/27_tablero_maestro_tareas.md`
   - `docs/tasks/QHPH-TASK-0202.md`
