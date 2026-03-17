# ADR-0003: PostgreSQL PostGIS y Redis

- Estado: `Aceptado`
- Fecha: `2026-02-24`

## Contexto

Discovery de eventos requiere datos relacionales, filtros por distancia y jobs asincronos.

## Decision

Usar `PostgreSQL 16 + PostGIS` para datos principales y `Redis` para cache/colas.

## Consecuencias

- Positivo: soporte geoespacial nativo y robustez transaccional.
- Positivo: simplifica arquitectura al evitar motor de busqueda extra en MVP.
- Negativo: tuning de indices requerido para mantener p95.
- Negativo: dependencia de buen modelado para ranking eficiente.

## Alternativas descartadas

1. MongoDB geoespacial.
2. Elasticsearch como dependencia obligatoria desde MVP.
