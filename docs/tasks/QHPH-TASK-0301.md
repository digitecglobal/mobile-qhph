# QHPH-TASK-0301 Mapa interactivo con pines y apertura de detalle

- Tipo: `TASK`
- Prioridad: `P0`
- Estimacion (pts): `8`
- Responsable: `Codex`
- Estado: `Done`
- Fecha de cierre: `2026-02-24`

## Contexto

El MVP exige una visualizacion geografica de eventos para exploracion rapida.

## Alcance

1. Endpoint `GET /api/v1/events/map`.
2. Pantalla mobile `Mapa` con `react-native-maps`.
3. Apertura de detalle al tocar pin.

## Fuera de alcance

1. Clustering avanzado de pines.

## Criterios de aceptacion

1. API entrega pines con coordenadas.
2. Mapa mobile muestra pines en Bogota.
3. Click en pin navega a detalle.
4. Tablero en `Done`.

## Riesgos

1. Sin DB activa se usa fallback mock en mobile.

## Dependencias

1. `QHPH-TASK-0201` completada.

## Plan tecnico

1. Extender discovery con endpoint map.
2. Agregar dependencia `react-native-maps`.
3. Construir pantalla de mapa en tabs.

## Pruebas requeridas

1. `tsc --noEmit` API y mobile.
2. Arranque de `expo start` sin errores.

## Evidencia de cierre

1. Link PR: `N/A (trabajo local en curso)`.
2. Captura o salida de tests: Metro iniciado correctamente.
3. Documentos actualizados:
   - `apps/api/src/discovery/*`
   - `apps/mobile/app/(tabs)/mapa.tsx`
   - `apps/mobile/package.json`
   - `docs/27_tablero_maestro_tareas.md`
   - `docs/tasks/QHPH-TASK-0301.md`
