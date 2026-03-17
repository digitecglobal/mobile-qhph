# Mapa inicial de tareas de arquitectura (Sprint 0)

- Estado: `Aprobado`
- Version: `1.1`
- Ultima actualizacion: `2026-02-24`

## 1. Objetivo

Ejecutar un Sprint 0 de arquitectura para dejar listo el proyecto antes de construir features del MVP.

## 2. EPIC de arquitectura

- `QHPH-EPIC-0001`: Plataforma base y gobernanza tecnica.

## 3. Tareas obligatorias Sprint 0

1. `QHPH-TASK-0001` Crear monorepo con estructura oficial (`apps`, `packages`, `infra`).
2. `QHPH-TASK-0002` Fijar runtime y gestores (`.nvmrc`, `pnpm`, lockfile).
3. `QHPH-TASK-0003` Configurar linters, formatter y hooks de commit.
4. `QHPH-TASK-0004` Crear esqueleto de `mobile`, `api` y `worker`.
5. `QHPH-TASK-0005` Definir esquema inicial Prisma y primera migracion.
6. `QHPH-TASK-0006` Levantar stack local con Docker Compose (postgres, redis, observabilidad minima).
7. `QHPH-TASK-0007` Configurar CI base para lint, test y build mobile/backend.
8. `QHPH-TASK-0008` Publicar OpenAPI inicial con health endpoints.
9. `QHPH-TASK-0009` Configurar observabilidad base (logs, traces, metricas).
10. `QHPH-TASK-0010` Documento de runbook local, staging y release mobile.
11. `QHPH-TASK-0011` Definir contratos region-aware en modelo de datos (`country_code`, `city_id`, `timezone`).
12. `QHPH-TASK-0012` Configurar baseline de edge global (CDN, WAF, aceleracion).

## 4. Criterios de salida de Sprint 0

1. Entorno local funcional en menos de 15 minutos.
2. Pipeline CI ejecutando checks obligatorios.
3. API y app mobile levantan con healthchecks.
4. Primera migracion ejecutable en local y staging.
5. Trazas y logs visibles en dashboard base.
6. Contratos y tablas core listos para crecimiento multi-region.

## 5. Riesgos y mitigacion

- Riesgo: sobreingenieria temprana.
- Mitigacion: limitar Sprint 0 a infraestructura reusable para MVP.
- Riesgo: deuda de versionado.
- Mitigacion: bloquear versiones oficiales desde dia 1.

## 6. Dependencias para arrancar Sprint 1 funcional

1. Sprint 0 en estado `Done`.
2. Checklist tecnico de seguridad minima verificado.
3. Responsable por modulo asignado (`mobile`, `api`, `worker`, `data`).
