# QHPH-TASK-0004 Crear esqueleto de mobile, api y worker

- Tipo: `TASK`
- Prioridad: `P0`
- Estimacion (pts): `5`
- Responsable: `Codex`
- Estado: `Done`
- Fecha de cierre: `2026-02-24`

## Contexto

Se necesita un punto de arranque funcional por modulo para poder ejecutar tareas de negocio sobre bases separadas.

## Alcance

1. Esqueleto de `apps/mobile` con Expo Router.
2. Esqueleto de `apps/api` con NestJS/Fastify.
3. Esqueleto de `apps/worker` con entrypoint de proceso.
4. Base compartida TypeScript en `packages/config`.

## Fuera de alcance

1. Instalacion y ejecucion de dependencias.
2. Features funcionales del producto.
3. Conexion real a DB/Redis.

## Criterios de aceptacion

1. Existen `package.json`, `tsconfig` y entrypoints en los tres modulos.
2. Existe base TS compartida para extender.
3. El tablero refleja la tarea en `Done`.

## Riesgos

1. Sin instalar dependencias no se valida ejecucion real; mitigacion: validar en `QHPH-TASK-0006/0007`.

## Dependencias

1. `QHPH-TASK-0002` completada.
2. `QHPH-TASK-0003` completada.

## Plan tecnico

1. Crear manifests y scripts por app.
2. Crear entrypoints y estructura de codigo minima.
3. Registrar cierre en tablero y docs/tasks.

## Pruebas requeridas

1. Verificacion de estructura y archivos por modulo.

## Evidencia de cierre

1. Link PR: `N/A (trabajo local en curso)`.
2. Captura o salida de tests: verificacion de estructura con `find/ls`.
3. Documentos actualizados:
   - `apps/mobile/*`
   - `apps/api/*`
   - `apps/worker/*`
   - `packages/config/tsconfig.base.json`
   - `docs/27_tablero_maestro_tareas.md`
   - `docs/tasks/QHPH-TASK-0004.md`
