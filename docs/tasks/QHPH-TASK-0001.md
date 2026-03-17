# QHPH-TASK-0001 Crear monorepo con estructura oficial

- Tipo: `TASK`
- Prioridad: `P0`
- Estimacion (pts): `3`
- Responsable: `Codex`
- Estado: `Done`
- Fecha de cierre: `2026-02-24`

## Contexto

Se requiere establecer el armazon base del monorepo para habilitar la ejecucion del Sprint 0 con estructura y limites de modulos claros.

## Alcance

1. Crear estructura de carpetas oficial en raiz.
2. Crear directorios base de apps, packages e infra.
3. Dejar rutas listas para las siguientes tareas del Sprint 0.

## Fuera de alcance

1. Inicializacion de proyectos internos (`mobile`, `api`, `worker`).
2. Configuracion de runtime/versionado (`QHPH-TASK-0002`).
3. Configuracion CI/CD (`QHPH-TASK-0007`).

## Criterios de aceptacion

1. Existen las carpetas definidas en `18_estructura_monorepo_y_convenciones.md`.
2. Existe documentacion minima de estructura en la raiz.
3. El tablero refleja el estado `Done` de la tarea.

## Riesgos

1. Riesgo de desviacion de estructura al iniciar apps reales; mitigacion: usar esta base como fuente de verdad y no crear rutas fuera del estandar.

## Dependencias

1. Ninguna dependencia tecnica bloqueante.

## Plan tecnico

1. Crear directorios base con `mkdir -p`.
2. Agregar placeholders `.gitkeep` en carpetas vacias.
3. Agregar `README.md` en raiz y registrar evidencia de cierre.

## Pruebas requeridas

1. Verificacion de estructura por listado de directorios.

## Evidencia de cierre

1. Link PR: `N/A (trabajo local en curso)`.
2. Captura o salida de tests: `ls` y `find` de estructura creados.
3. Documentos actualizados:
   - `README.md`
   - `docs/27_tablero_maestro_tareas.md`
   - `docs/tasks/QHPH-TASK-0001.md`
