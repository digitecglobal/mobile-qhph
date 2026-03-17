# QHPH-TASK-0302 Portal organizador para crear/editar/publicar evento

- Tipo: `TASK`
- Prioridad: `P0`
- Estimacion (pts): `10`
- Responsable: `Codex`
- Estado: `Done`
- Fecha de cierre: `2026-02-24`

## Contexto

El MVP debe permitir autogestion de oferta por organizadores.

## Alcance

1. Reforzar validaciones de CRUD organizador.
2. Pantalla mobile `Organizador` para crear eventos.
3. Soporte modo demo local sin token.

## Fuera de alcance

1. Portal web dedicado.
2. Workflow de aprobacion multinivel.

## Criterios de aceptacion

1. Organizador puede crear evento `draft` o `published` desde mobile.
2. API valida referencias core (city/category/venue).
3. Se listan eventos del organizador.
4. Tablero en `Done`.

## Riesgos

1. Sin token no se persiste en API y se usa lista local demo.

## Dependencias

1. `QHPH-TASK-0104` completada.

## Plan tecnico

1. Endurecer `events.service`.
2. Exponer opciones de catalogo (venues) en onboarding options.
3. Construir UI de portal organizador.

## Pruebas requeridas

1. `tsc --noEmit` API y mobile.

## Evidencia de cierre

1. Link PR: `N/A (trabajo local en curso)`.
2. Captura o salida de tests: rutas organizer mapeadas + compilacion limpia.
3. Documentos actualizados:
   - `apps/api/src/events/*`
   - `apps/api/src/onboarding/onboarding.service.ts`
   - `apps/mobile/app/(tabs)/organizador.tsx`
   - `docs/27_tablero_maestro_tareas.md`
   - `docs/tasks/QHPH-TASK-0302.md`
