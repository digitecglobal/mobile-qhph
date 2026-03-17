# Runbook local, staging y release mobile

- Estado: `Aprobado`
- Version: `1.0`
- Ultima actualizacion: `2026-02-24`

## 1. Objetivo

Estandarizar arranque local, validacion en staging y salida a tiendas mobile.

## 2. Prerrequisitos

1. Node `22.14.0`.
2. pnpm `10.6.0`.
3. Docker + Docker Compose.
4. Cuenta en App Store Connect y Google Play Console.

## 3. Arranque local rapido

1. `nvm use`
2. `pnpm install`
3. `pnpm docker:up`
4. `pnpm --filter @qhph/api start:dev`
5. `pnpm --filter @qhph/worker start:dev`
6. `pnpm --filter @qhph/mobile start`

## 4. Verificaciones locales

1. API health: `GET http://localhost:3000/api/v1/health`
2. Grafana: `http://localhost:3001`
3. Prometheus: `http://localhost:9090`

## 5. Flujo de staging

1. Merge a `main`.
2. CI valida lint/test/build.
3. Deploy backend a staging.
4. Build mobile canal `preview`.
5. Smoke tests funcionales.

## 6. Flujo de release mobile

1. Freeze de cambios.
2. Tag de version (`vX.Y.Z`).
3. Build `production` con EAS.
4. Submit a App Store/Play Console.
5. Rollout gradual.
6. Monitorear crash-free y errores API.

## 7. Rollback

1. Backend: rollback a release previa.
2. Mobile: detener rollout y revertir version activa.
3. Registrar incidente y postmortem.

## 8. Comandos utiles

1. `pnpm check:runtime`
2. `pnpm lint`
3. `pnpm test`
4. `pnpm build`
5. `pnpm docker:down`
