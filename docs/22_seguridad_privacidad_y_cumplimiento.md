# Seguridad, privacidad y cumplimiento

- Estado: `Aprobado`
- Version: `1.0`
- Ultima actualizacion: `2026-02-24`

## 1. Principios

1. Minimo privilegio.
2. Privacidad por defecto.
3. Trazabilidad completa de acciones sensibles.
4. Seguridad como requisito de salida, no de entrada.

## 2. Autenticacion y sesiones

- Login MVP: email/password.
- Login social: fuera de alcance del MVP.
- Access token corto: `15 minutos`.
- Refresh token rotativo: `30 dias`.
- Revocacion de sesiones activa en cierre de sesion y cambio de password.

## 3. Autorizacion (RBAC)

- Roles oficiales: `user`, `organizer`, `moderator`, `admin`.
- Permisos por endpoint definidos en guardas backend.
- Operaciones de moderacion solo para `moderator/admin`.

## 4. Proteccion de API

- Rate limit por IP y por usuario autenticado.
- Validacion estricta de payload con Zod.
- Sanitizacion de entradas para campos de texto libre.
- CORS restringido a dominios aprobados.

## 5. Proteccion de datos

- PII cifrada en reposo con KMS.
- TLS obligatorio en transito.
- Geolocalizacion guardada solo para funciones de discovery.
- Politica de retencion y borrado de cuenta.

## 6. Seguridad de archivos multimedia

- Subidas firmadas y validadas por tipo/tamano.
- Bloqueo de ejecutables y contenido sospechoso.
- URLs temporales firmadas para acceso a archivos privados.

## 7. Monitoreo de seguridad

- Registro de intentos de acceso fallido.
- Alerta por patrones anormales de publicacion masiva.
- Auditoria de acciones administrativas.

## 8. Cumplimiento documental minimo pre-lanzamiento

1. Terminos y condiciones vigentes.
2. Politica de privacidad vigente.
3. Politica de contenido y moderacion publicada.
4. Canal de contacto para solicitudes de datos y reclamos.

## 9. Checklist tecnico de seguridad por release

1. Dependencias sin CVEs criticas abiertas.
2. Variables de entorno auditadas.
3. Secretos rotados segun calendario.
4. Pruebas de autorizacion en endpoints sensibles.
