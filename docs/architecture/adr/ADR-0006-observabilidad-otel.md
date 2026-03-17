# ADR-0006: Observabilidad con OpenTelemetry

- Estado: `Aceptado`
- Fecha: `2026-02-24`

## Contexto

El producto depende de tiempos de respuesta y jobs asincronos. Se necesita trazabilidad operativa desde el inicio.

## Decision

Adoptar OpenTelemetry para trazas y metricas, con dashboards en Grafana.

## Consecuencias

- Positivo: deteccion temprana de cuellos de botella.
- Positivo: correlacion entre frontend, API y worker.
- Negativo: costo inicial de instrumentacion.
- Negativo: disciplina para mantener naming consistente.

## Alternativas descartadas

1. Solo logs sin trazas distribuidas.
2. Observabilidad solo en fase post-MVP.
