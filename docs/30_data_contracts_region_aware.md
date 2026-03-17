# Contratos region-aware de datos

- Estado: `Aprobado`
- Version: `1.0`
- Ultima actualizacion: `2026-02-24`

## 1. Objetivo

Definir reglas de datos obligatorias para crecimiento multi-region sin rediseno.

## 2. Campos obligatorios

1. `country_code`: ISO 3166-1 alpha-2.
2. `city_id`: referencia a ciudad normalizada.
3. `timezone`: IANA timezone valida.

## 3. Entidades alcanzadas (MVP)

1. `cities`
2. `events`
3. `users` (timezone y ciudad principal opcional)

## 4. Reglas de validacion

1. `country_code` siempre en mayusculas y longitud 2.
2. `timezone` no vacia y tipo texto IANA.
3. `start_at` y `end_at` en UTC.
4. Render de fechas en cliente usando timezone del evento.

## 5. Reglas de indexacion minima

1. `events(country_code, city_id)`.
2. `events(city_id, start_at)`.
3. `cities(country_code)`.

## 6. Control de cambios

Todo cambio en estas reglas requiere:

1. ADR o actualizacion documental equivalente.
2. Migracion versionada.
3. Evidencia en tarea de tablero.
