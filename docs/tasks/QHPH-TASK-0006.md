# QHPH-TASK-0006 Levantar stack local con Docker Compose

- Tipo: `TASK`
- Prioridad: `P0`
- Estimacion (pts): `5`
- Responsable: `Codex`
- Estado: `Done`
- Fecha de cierre: `2026-02-24`

## Contexto

Se requiere un stack local base para desarrollo y pruebas de servicios core.

## Alcance

1. Compose local con PostgreSQL/PostGIS.
2. Compose local con Redis.
3. Observabilidad minima local con Prometheus, Loki y Grafana.
4. Variables de entorno de referencia.

## Fuera de alcance

1. Provisionamiento cloud.
2. Dashboards y alertas avanzadas.
3. Integracion con CI/CD.

## Criterios de aceptacion

1. Existe archivo `docker-compose.yml` versionado.
2. Existen configs minimas de Prometheus y Loki.
3. Existen scripts raiz para subir/bajar stack local.
4. El tablero refleja la tarea en `Done`.

## Riesgos

1. No se ejecuto `docker compose up` en esta tarea; mitigacion: validar runtime en tarea de runbook.

## Dependencias

1. `QHPH-TASK-0004` completada.
2. `QHPH-TASK-0005` completada.

## Plan tecnico

1. Definir servicios core en compose.
2. Crear configuraciones de observabilidad local.
3. Exponer comandos de uso en scripts raiz.

## Pruebas requeridas

1. Verificacion estructural de archivos docker.

## Evidencia de cierre

1. Link PR: `N/A (trabajo local en curso)`.
2. Captura o salida de tests: verificacion de archivos `infra/docker/*`.
3. Documentos actualizados:
   - `infra/docker/docker-compose.yml`
   - `infra/docker/prometheus.yml`
   - `infra/docker/loki-config.yml`
   - `infra/docker/.env.example`
   - `package.json`
   - `docs/27_tablero_maestro_tareas.md`
   - `docs/tasks/QHPH-TASK-0006.md`
