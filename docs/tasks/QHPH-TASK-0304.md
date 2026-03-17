# QHPH-TASK-0304 Push recordatorios para eventos guardados (24h/2h)

- Tipo: `TASK`
- Prioridad: `P0`
- Estimacion (pts): `5`
- Responsable: `Codex`
- Estado: `Done`
- Fecha de cierre: `2026-02-24`

## Contexto

El MVP requiere recordatorios base para reducir olvido de eventos guardados.

## Alcance

1. Worker con scanner periodico de ventanas 24h y 2h.
2. Registro de encolado/dispatch en `audit_logs`.
3. Idempotencia basica por `actor + event + action`.

## Fuera de alcance

1. Proveedor real de push notifications.

## Criterios de aceptacion

1. Worker arranca y ejecuta scan periodico.
2. Eventos en ventana generan log de reminder no duplicado.
3. Manejo resiliente si DB no esta disponible.
4. Tablero en `Done`.

## Riesgos

1. Sin proveedor push real solo se deja pipeline y trazabilidad de reminder.

## Dependencias

1. `QHPH-TASK-0204` completada.

## Plan tecnico

1. Implementar scanner en `apps/worker/src/main.ts`.
2. Conectar Prisma client en worker.
3. Registrar resultados de scan en logs/audit.

## Pruebas requeridas

1. `tsc --noEmit` worker.
2. Arranque de worker en modo dev.

## Evidencia de cierre

1. Link PR: `N/A (trabajo local en curso)`.
2. Captura o salida de tests: worker inicia y registra scanner activo.
3. Documentos actualizados:
   - `apps/worker/src/main.ts`
   - `apps/worker/package.json`
   - `docs/27_tablero_maestro_tareas.md`
   - `docs/tasks/QHPH-TASK-0304.md`
