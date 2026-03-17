# ADR-0005: Jobs asincronos con BullMQ

- Estado: `Aceptado`
- Fecha: `2026-02-24`

## Contexto

El MVP necesita recordatorios confiables, reintentos y procesamiento fuera del request principal.

## Decision

Usar `BullMQ` sobre Redis con worker dedicado.

## Consecuencias

- Positivo: control de reintentos, priorizacion y programacion.
- Positivo: desacople de tareas pesadas del API.
- Negativo: operacion adicional de cola y monitoreo.
- Negativo: riesgo de duplicados sin idempotencia.

## Alternativas descartadas

1. Cronjobs embebidos en API.
2. Servicios serverless por job sin cola central.
