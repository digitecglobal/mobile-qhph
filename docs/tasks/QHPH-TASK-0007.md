# QHPH-TASK-0007 Configurar CI base para lint, test y build

- Tipo: `TASK`
- Prioridad: `P0`
- Estimacion (pts): `5`
- Responsable: `Codex`
- Estado: `Done`
- Fecha de cierre: `2026-02-24`

## Contexto

Se requiere pipeline base automatizado para validar cambios en PR y en `main`.

## Alcance

1. Workflow CI en GitHub Actions.
2. Pasos base: install, lint, test y build.
3. Scripts base por modulo para test/build placeholder.

## Fuera de alcance

1. Deploy continuo.
2. Matrices avanzadas por OS.
3. Cobertura y quality gates avanzados.

## Criterios de aceptacion

1. Existe workflow versionado en `.github/workflows/ci.yml`.
2. El pipeline ejecuta install, lint, test y build.
3. El tablero refleja la tarea en `Done`.

## Riesgos

1. Scripts de build/test estan en modo placeholder; mitigacion: endurecer en siguientes tareas funcionales.

## Dependencias

1. `QHPH-TASK-0003` completada.
2. `QHPH-TASK-0004` completada.

## Plan tecnico

1. Crear workflow CI con Node y pnpm fijados.
2. Ajustar scripts de package raiz y apps.
3. Registrar cierre y evidencias.

## Pruebas requeridas

1. Verificacion estructural del workflow y scripts.

## Evidencia de cierre

1. Link PR: `N/A (trabajo local en curso)`.
2. Captura o salida de tests: verificacion de archivos/scrips CI creados.
3. Documentos actualizados:
   - `.github/workflows/ci.yml`
   - `package.json`
   - `apps/mobile/package.json`
   - `apps/api/package.json`
   - `apps/worker/package.json`
   - `docs/27_tablero_maestro_tareas.md`
   - `docs/tasks/QHPH-TASK-0007.md`
