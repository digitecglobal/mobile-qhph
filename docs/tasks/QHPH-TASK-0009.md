# QHPH-TASK-0009 Configurar observabilidad base (logs, traces, metricas)

- Tipo: `TASK`
- Prioridad: `P1`
- Estimacion (pts): `5`
- Responsable: `Codex`
- Estado: `Done`
- Fecha de cierre: `2026-02-24`

## Contexto

Se requiere baseline de observabilidad para backend y worker desde Sprint 0.

## Alcance

1. Paquete compartido `@qhph/observability`.
2. Logger estructurado en API y worker.
3. Collector OTEL local en Docker.
4. Scrape de metricas OTEL en Prometheus.

## Fuera de alcance

1. Dashboards de Grafana definidos.
2. Alertas productivas.
3. Trazas distribuidas completas por endpoint.

## Criterios de aceptacion

1. Existe paquete compartido de observabilidad.
2. API y worker inicializan observabilidad en bootstrap.
3. Compose incluye collector OTEL.
4. El tablero refleja la tarea en `Done`.

## Riesgos

1. Baseline sin instrumentacion profunda; mitigacion: ampliar en tareas funcionales.

## Dependencias

1. `QHPH-TASK-0006` completada.

## Plan tecnico

1. Crear libreria de observabilidad compartida.
2. Integrar logs estructurados en arranque de servicios.
3. Agregar OTEL collector y scrape config.

## Pruebas requeridas

1. Verificacion estructural de archivos de observabilidad.

## Evidencia de cierre

1. Link PR: `N/A (trabajo local en curso)`.
2. Captura o salida de tests: verificacion de paquete y compose actualizados.
3. Documentos actualizados:
   - `packages/observability/*`
   - `apps/api/src/main.ts`
   - `apps/worker/src/main.ts`
   - `infra/docker/docker-compose.yml`
   - `infra/docker/prometheus.yml`
   - `infra/docker/otel-collector-config.yml`
   - `infra/docker/.env.example`
   - `docs/27_tablero_maestro_tareas.md`
   - `docs/tasks/QHPH-TASK-0009.md`
