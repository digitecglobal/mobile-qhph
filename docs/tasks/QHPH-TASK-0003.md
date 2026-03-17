# QHPH-TASK-0003 Configurar linters, formatter y hooks de commit

- Tipo: `TASK`
- Prioridad: `P0`
- Estimacion (pts): `3`
- Responsable: `Codex`
- Estado: `Done`
- Fecha de cierre: `2026-02-24`

## Contexto

Se requiere establecer controles de calidad base en el repositorio para evitar deriva de estilo y errores basicos antes de CI avanzada.

## Alcance

1. Configurar ESLint base.
2. Configurar Prettier base.
3. Configurar hook de pre-commit con lint-staged.

## Fuera de alcance

1. Reglas especificas por framework (React Native/Nest).
2. Integracion de testing en CI.
3. Hardening de reglas por dominio.

## Criterios de aceptacion

1. Existen archivos de configuracion de lint y format en raiz.
2. Existe hook `pre-commit` versionado.
3. `package.json` contiene scripts de lint/format y dependencias de soporte.
4. El tablero refleja la tarea en `Done`.

## Riesgos

1. Hasta instalar dependencias, la ejecucion de scripts queda pendiente; mitigacion: resolver en `QHPH-TASK-0004/0007`.

## Dependencias

1. `QHPH-TASK-0002` completada.

## Plan tecnico

1. Agregar `eslint.config.mjs` y `prettier.config.cjs`.
2. Agregar `.editorconfig`, `.prettierignore` y `.lintstagedrc.cjs`.
3. Agregar hook `.husky/pre-commit` y scripts en `package.json`.

## Pruebas requeridas

1. Verificacion de presencia y permisos del hook.

## Evidencia de cierre

1. Link PR: `N/A (trabajo local en curso)`.
2. Captura o salida de tests: verificacion de archivos creados.
3. Documentos actualizados:
   - `package.json`
   - `.editorconfig`
   - `.prettierignore`
   - `prettier.config.cjs`
   - `eslint.config.mjs`
   - `.lintstagedrc.cjs`
   - `.husky/pre-commit`
   - `docs/27_tablero_maestro_tareas.md`
   - `docs/tasks/QHPH-TASK-0003.md`
