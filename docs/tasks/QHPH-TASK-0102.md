# QHPH-TASK-0102 Onboarding ciudad/intereses

- Tipo: `TASK`
- Prioridad: `P0`
- Estimacion (pts): `5`
- Responsable: `Codex`
- Estado: `Done`
- Fecha de cierre: `2026-02-24`

## Contexto

Se requiere flujo base de onboarding para que el usuario defina ciudad e intereses desde inicio.

## Alcance

1. API para obtener opciones de onboarding.
2. API protegida para guardar ciudad e intereses del usuario.
3. Seed inicial de ciudad/categorias base.
4. Pantalla mobile de onboarding inicial.

## Fuera de alcance

1. Persistencia real en app mobile conectada a API.
2. UX final de onboarding.

## Criterios de aceptacion

1. Existe endpoint `GET /api/v1/onboarding/options`.
2. Existe endpoint `POST /api/v1/me/onboarding`.
3. Existe endpoint `GET /api/v1/me`.
4. Mobile tiene pantalla de onboarding accesible desde home.
5. El tablero refleja la tarea en `Done`.

## Riesgos

1. Sin DB local activa no se validan queries de onboarding; mitigacion: habilitar Docker para pruebas end-to-end.

## Dependencias

1. `QHPH-TASK-0101` completada.

## Plan tecnico

1. Crear modulos `onboarding` y `users` en API.
2. Agregar migracion de seed para ciudad/categorias.
3. Crear pantalla mobile de onboarding inicial.

## Pruebas requeridas

1. Verificacion de rutas mapeadas y pantalla mobile accesible.

## Evidencia de cierre

1. Link PR: `N/A (trabajo local en curso)`.
2. Captura o salida de tests: logs de rutas onboarding/me en bootstrap.
3. Documentos actualizados:
   - `apps/api/src/onboarding/*`
   - `apps/api/src/users/*`
   - `apps/api/prisma/migrations/20260224_0003_seed_onboarding/migration.sql`
   - `apps/mobile/app/onboarding.tsx`
   - `apps/mobile/app/index.tsx`
   - `apps/api/openapi/openapi.yaml`
   - `docs/27_tablero_maestro_tareas.md`
   - `docs/tasks/QHPH-TASK-0102.md`
