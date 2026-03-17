# QHPH-TASK-0101 Autenticacion mobile de usuario (email/password)

- Tipo: `TASK`
- Prioridad: `P0`
- Estimacion (pts): `5`
- Responsable: `Codex`
- Estado: `Done`
- Fecha de cierre: `2026-02-24`

## Contexto

Se requiere base de autenticacion para habilitar onboarding y sesiones del MVP mobile.

## Alcance

1. Endpoints `register`, `login`, `refresh`, `me`.
2. JWT access/refresh tokens.
3. Hash de password con bcrypt.
4. Integracion inicial con Prisma.

## Fuera de alcance

1. OAuth social.
2. Revocacion avanzada de refresh tokens.
3. Recuperacion de password.

## Criterios de aceptacion

1. API expone rutas de autenticacion bajo `/api/v1/auth/*`.
2. Password nunca se guarda en texto plano.
3. Existe guard de acceso para endpoint protegido.
4. OpenAPI inicial incluye rutas auth.
5. El tablero refleja la tarea en `Done`.

## Riesgos

1. Sin `DATABASE_URL` no se validan flujos reales de DB; mitigacion: configurar entorno en task de infraestructura local operativa.

## Dependencias

1. `QHPH-TASK-0005` completada.
2. `QHPH-TASK-0008` completada.

## Plan tecnico

1. Crear modulo Auth en API.
2. Agregar PrismaModule y servicio Prisma.
3. Integrar JWT y bcrypt.
4. Actualizar contrato OpenAPI.

## Pruebas requeridas

1. Verificacion de rutas mapeadas en arranque de API.

## Evidencia de cierre

1. Link PR: `N/A (trabajo local en curso)`.
2. Captura o salida de tests: logs de rutas `/api/v1/auth/*` mapeadas en bootstrap.
3. Documentos actualizados:
   - `apps/api/src/auth/*`
   - `apps/api/src/prisma/*`
   - `apps/api/src/app.module.ts`
   - `apps/api/openapi/openapi.yaml`
   - `apps/api/package.json`
   - `docs/27_tablero_maestro_tareas.md`
   - `docs/tasks/QHPH-TASK-0101.md`
