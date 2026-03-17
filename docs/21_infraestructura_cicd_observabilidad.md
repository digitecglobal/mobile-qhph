# Infraestructura, CI/CD y observabilidad

- Estado: `Aprobado`
- Version: `1.1`
- Ultima actualizacion: `2026-02-24`

## 1. Entornos oficiales

1. `local`
2. `staging`
3. `production`

## 2. Provisionamiento

- Infra como codigo: `Terraform`.
- Entornos aislados por variables y secretos.
- Base de datos gestionada con backups automaticos.

## 3. Topologia de despliegue (MVP)

- `mobile` distribuido por App Store y Google Play.
- `api` y `worker` como servicios separados.
- `postgres` en AWS RDS y `redis` en AWS ElastiCache.
- `object storage` en AWS S3 + CDN global.
- `edge` con CloudFront + AWS Global Accelerator + WAF.

## 4. CI obligatorio (por Pull Request)

1. Install y typecheck.
2. Lint.
3. Unit tests.
4. Integration tests API.
5. Build de `mobile`, `api`, `worker`.
6. Generacion y validacion OpenAPI.
7. Build de paquete mobile para canal `internal`.

## 5. CD obligatorio

- Backend `staging`: deploy automatico al merge en `main`.
- Backend `production`: deploy manual con aprobacion.
- Mobile `internal/beta/production`: pipelines separados con EAS Build/Submit.
- Estrategia backend: `rolling` con healthchecks.
- Estrategia mobile: rollout gradual por porcentaje en stores.

## 6. Observabilidad obligatoria

- Logs estructurados JSON con `traceId`.
- Trazas distribuidas con OpenTelemetry.
- Metricas de app en Prometheus.
- Dashboards en Grafana para API, jobs y DB.
- Crash y performance de app mobile en Sentry.

## 7. Alertas de operacion (MVP)

1. Error rate API > 2% por 5 minutos.
2. P95 API lectura > 500ms por 10 minutos.
3. Cola de recordatorios con atraso > 15 minutos.
4. Caida de job success rate < 95%.
5. Crash-free sessions mobile < 99.3%.

## 8. Backups y continuidad

- Backup DB diario + WAL.
- Retencion minima de 14 dias en MVP.
- Restauracion validada al menos 1 vez por mes.

## 9. Politica de rollback

- Toda release en prod debe tener rollback documentado.
- Rollback en menos de 15 minutos.
- Se bloquea nueva release hasta analisis postmortem.

## 10. Base de escalabilidad global

1. Region primaria MVP: `sa-east-1`.
2. Replicas de lectura iniciales: `us-east-1` y `eu-west-1`.
3. Topologia global detallada en `28_escalabilidad_global.md`.
