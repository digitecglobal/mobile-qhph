# Diseno backend, API y datos (MVP)

- Estado: `Aprobado`
- Version: `1.1`
- Ultima actualizacion: `2026-02-24`

## 1. Modulos backend oficiales

1. `auth`: login, refresh token, sesiones.
2. `users`: perfil, preferencias, ciudad base, intereses.
3. `organizers`: perfiles de organizador y permisos.
4. `events`: CRUD, estado, validacion, media.
5. `discovery`: feed, filtros, ranking, geosearch.
6. `bookmarks`: guardados y seguimiento.
7. `notifications`: reglas y programacion de alertas.
8. `moderation`: reportes y acciones.
9. `analytics`: tracking de eventos de producto.

## 2. Modelo de datos minimo (tablas)

1. `users`
2. `cities`
3. `user_interests`
4. `organizers`
5. `venues`
6. `events`
7. `event_dates`
8. `event_media`
9. `event_categories`
10. `event_bookmarks`
11. `notification_subscriptions`
12. `event_reports`
13. `audit_logs`

## 3. Campos obligatorios por evento

- `title`
- `category_id`
- `start_at`
- `end_at` (obligatorio cuando el evento tenga hora fin definida, de lo contrario `null`)
- `venue_id` y geolocalizacion valida
- `description_short`
- `cover_image_url`
- `organizer_id`
- `status`
- `country_code`
- `city_id`
- `timezone`

## 4. Estados oficiales de evento

- `draft`
- `published`
- `cancelled`
- `finished`

## 5. Contrato de API (v1)

- Estilo: `REST JSON`.
- Versionado: `URI versioning` con `/api/v1`.
- Esquema: validacion con `Zod`.
- Documentacion: `OpenAPI` generada por CI.

## 6. Endpoints MVP obligatorios

1. `POST /api/v1/auth/login`
2. `POST /api/v1/auth/refresh`
3. `GET /api/v1/events`
4. `GET /api/v1/events/:id`
5. `POST /api/v1/organizer/events`
6. `PATCH /api/v1/organizer/events/:id`
7. `POST /api/v1/events/:id/bookmark`
8. `DELETE /api/v1/events/:id/bookmark`
9. `GET /api/v1/me/bookmarks`
10. `POST /api/v1/events/:id/report`

## 7. Ranking inicial de discovery

- Score final: `0.35 proximidad temporal + 0.30 distancia + 0.20 interes + 0.10 calidad ficha + 0.05 verificacion`.
- Empates se resuelven por fecha de inicio mas cercana.
- Eventos cancelados o finalizados nunca aparecen en feed default.

## 8. Geodatos y busqueda

- Tipo espacial: `geography(Point, 4326)`.
- Distancia base discovery: `10km` configurable por usuario.
- Filtro extendido: hasta `50km`.
- Busqueda textual MVP: `PostgreSQL tsvector + trigram`.

## 9. Jobs asincronos obligatorios

1. `event_reminder_24h`
2. `event_reminder_2h`
3. `catalog_dedup_scan`
4. `cancelled_event_notify`

## 10. Politica de idempotencia y resiliencia

- Endpoints de escritura criticos aceptan `Idempotency-Key`.
- Reintentos de jobs con backoff exponencial.
- DLQ para jobs fallidos > 5 intentos.

## 11. Reglas de auditoria

- Toda accion de publicacion/edicion/cancelacion queda en `audit_logs`.
- Todo cambio de estado registra actor, timestamp y razon.
- Todo reporte/moderacion registra evidencia y resolucion.

## 12. Extensibilidad de dominio (futuro robusto)

1. Nuevas capacidades deben entrar como modulo separado (ejemplo: `personalization` para avatar/skins).
2. Ninguna feature nueva debe acoplarse directo al modulo `events`.
3. Feature flags obligatorias para nuevas funcionalidades de alto impacto.

## 13. Contrato global de datos

1. Entidades core deben guardar contexto geografico (`country_code`, `city_id`, `timezone`).
2. Fechas y horas se guardan en UTC y se renderizan en timezone local del evento.
3. IDs de dominio obligatoriamente en UUIDv7.
