# Stack tecnologico y versiones oficiales

- Estado: `Aprobado`
- Version: `1.1`
- Ultima actualizacion: `2026-02-24`
- Politica: `No upgrade automatico en MVP`

## 1. Principio

Estas son las versiones oficiales del proyecto para iniciar.  
Si una version cambia, se registra ADR y se actualiza este documento antes de implementar.

## 2. Runtime y lenguaje

- `Node.js`: `22.14.0` (LTS).
- `pnpm`: `10.6.0`.
- `Turborepo`: `2.4.2`.
- `TypeScript`: `5.8.2`.

## 3. Mobile App (iOS/Android)

- `React Native`: `0.76.7`.
- `Expo`: `52.0.30`.
- `Expo Router`: `4.0.17`.
- `React`: `18.3.1`.
- `TanStack Query`: `5.66.9`.
- `Zustand`: `5.0.3`.
- `Zod`: `3.24.2`.
- `@rnmapbox/maps`: `10.1.36`.
- `react-native-reanimated`: `3.16.7`.
- `onesignal-react-native`: `5.2.12`.
- `@sentry/react-native`: `6.13.0`.

## 4. Backend (API Service)

- `NestJS`: `11.0.5`.
- `@nestjs/platform-fastify`: `11.0.5`.
- `Fastify`: `5.2.1`.
- `Prisma`: `6.5.0`.
- `BullMQ`: `5.41.2`.
- `ioredis`: `5.4.2`.
- `OpenAPI (Swagger)`: `8.1.0` (plugin Nest).

## 5. Datos e infraestructura base

- `PostgreSQL`: `16.6`.
- `PostGIS`: `3.4`.
- `Redis`: `7.4.2`.
- `Docker Engine`: `27.5.1`.
- `Docker Compose`: `2.33.1`.

## 6. Calidad y testing

- `Vitest`: `2.1.8`.
- `Jest`: `29.7.0`.
- `@testing-library/react-native`: `13.0.1`.
- `Maestro CLI`: `1.39.13`.
- `ESLint`: `9.21.0`.
- `Prettier`: `3.5.3`.
- `Husky`: `9.1.7`.
- `lint-staged`: `15.4.3`.

## 7. Observabilidad

- `OpenTelemetry JS`: `1.30.1`.
- `Prometheus`: `2.55.1`.
- `Grafana`: `11.5.2`.
- `Loki`: `3.2.1`.

## 8. Proveedores externos (MVP)

- Mapas: `Mapbox`.
- Email transaccional: `Resend`.
- Push mobile: `OneSignal`.
- Object storage: `AWS S3`.
- Distribucion mobile: `App Store Connect` y `Google Play Console`.
- Edge global: `CloudFront + AWS Global Accelerator`.

## 9. Politica de cambios de version

1. Parche: permitido solo si corrige bug critico o CVE relevante.
2. Minor: permitido una vez por sprint y con pruebas de regresion.
3. Major: prohibido durante MVP salvo riesgo de seguridad alto.
4. Toda actualizacion requiere: tarea + ADR + changelog interno.

## 10. Archivos de control obligatorios en repo

- `.nvmrc` con `22.14.0`.
- `.npmrc` bloqueando gestor a pnpm.
- `packageManager` en raiz con `pnpm@10.6.0`.
- `pnpm-lock.yaml` versionado.
- `eas.json` versionado para perfiles `development`, `preview`, `production`.
