# QHPH-TASK-0002 Fijar runtime y lock de versiones

- Tipo: `TASK`
- Prioridad: `P0`
- Estimacion (pts): `3`
- Responsable: `Codex`
- Estado: `Done`
- Fecha de cierre: `2026-02-24`

## Contexto

Se requiere estandarizar runtime y gestor de paquetes para eliminar deriva de entorno entre maquinas y CI.

## Alcance

1. Fijar version Node oficial del repositorio.
2. Bloquear gestor de paquetes a pnpm.
3. Versionar metadata de workspace y lockfile.

## Fuera de alcance

1. Instalacion de dependencias de apps.
2. Configuracion de lint/test/build.
3. Inicializacion funcional de `mobile`, `api`, `worker`.

## Criterios de aceptacion

1. Existe `.nvmrc` con version oficial de Node.
2. Existe `package.json` raiz con `packageManager` y `engines`.
3. Existe `pnpm-workspace.yaml` y `pnpm-lock.yaml` versionados.
4. El tablero refleja la tarea en `Done`.

## Riesgos

1. Diferencia de Node en entorno local actual; mitigacion: ejecutar `nvm use` antes de instalar dependencias.

## Dependencias

1. `QHPH-TASK-0001` completada.

## Plan tecnico

1. Crear `.nvmrc` y `.npmrc`.
2. Crear `package.json` raiz con validaciones de runtime/gestor.
3. Crear `pnpm-workspace.yaml` y `pnpm-lock.yaml`.

## Pruebas requeridas

1. Verificacion de presencia y contenido de archivos de runtime.

## Evidencia de cierre

1. Link PR: `N/A (trabajo local en curso)`.
2. Captura o salida de tests: verificacion por `ls` y lectura de archivos.
3. Documentos actualizados:
   - `.nvmrc`
   - `.npmrc`
   - `package.json`
   - `pnpm-workspace.yaml`
   - `pnpm-lock.yaml`
   - `scripts/enforce-pnpm.cjs`
   - `scripts/check-runtime.cjs`
   - `docs/27_tablero_maestro_tareas.md`
   - `docs/tasks/QHPH-TASK-0002.md`
