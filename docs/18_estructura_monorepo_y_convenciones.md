# Estructura de monorepo y convenciones

- Estado: `Aprobado`
- Version: `1.1`
- Ultima actualizacion: `2026-02-24`

## 1. Estructura oficial del repositorio

```text
/  
  apps/
    mobile/              # React Native/Expo (usuario + modo organizador)
    api/                 # NestJS/Fastify
    worker/              # Jobs asincronos (BullMQ)
  packages/
    config/              # tsconfig, eslint, prettier compartidos
    ui/                  # componentes UI compartidos
    types/               # tipos de dominio compartidos
    sdk/                 # cliente tipado API
    observability/       # logger, trazas, metricas
  infra/
    docker/              # compose y scripts locales
    terraform/           # IaC por entorno
    k8s/                 # manifests base (staging/prod)
  docs/
  scripts/
  .github/workflows/
```

## 2. Convenciones de nombres

- Carpetas y archivos TS: `kebab-case`.
- Componentes React: `PascalCase.tsx`.
- Variables y funciones TS: `camelCase`.
- Tablas SQL: `snake_case` plural.
- Columnas SQL: `snake_case`.
- IDs primarios: `UUIDv7` obligatorio.

## 3. Convenciones de ramas y commits

- Rama base: `main`.
- Rama por tarea: `task/<ID>-descripcion-corta`.
- Ejemplo: `task/QHPH-142-feed-ranking`.
- Commits: `tipo(scope): mensaje`.
- Tipos permitidos: `feat`, `fix`, `chore`, `refactor`, `test`, `docs`.

## 4. Reglas de dependencias internas

1. `apps` pueden consumir `packages`.
2. `packages` no pueden depender de `apps`.
3. `mobile` nunca accede directo a BD.
4. `worker` no expone HTTP publico.
5. Todo acceso externo pasa por `adaptadores` en cada modulo.

## 5. Convenciones de configuracion

- Variables de entorno por app: `.env.local`, `.env.staging`, `.env.production`.
- Nunca versionar secretos en git.
- Tipado de env obligatorio con esquema Zod.

## 6. Convenciones de API

- Base path: `/api/v1`.
- Paginacion: `cursor`.
- Fechas: ISO-8601 UTC.
- Errores: objeto estandar con `code`, `message`, `details`, `traceId`.

## 7. Convenciones de estilos y UI

- Design tokens centralizados en `packages/ui`.
- Sistema de espaciado: escala de 4px.
- Tipografia y paleta definidas en un solo archivo de tema.
- Accesibilidad: WCAG AA como minimo en pantallas core.

## 8. Convenciones de datos y migraciones

- Cualquier cambio de esquema solo via migracion Prisma versionada.
- No se permite editar tablas manualmente en produccion.
- Indices y constraints deben declararse en migracion y revisarse en PR.

## 9. Convenciones de pruebas

- Unit tests junto al modulo (`*.spec.ts`).
- Integration tests en `apps/api/test/integration`.
- E2E en `apps/mobile/e2e`.
- Cobertura minima global: `70%` lines en MVP.
