# ADR-0007: Escalabilidad global por etapas

- Estado: `Aceptado`
- Fecha: `2026-02-24`

## Contexto

El producto nace en una ciudad, pero el objetivo es escalar globalmente sin reescribir la plataforma.

## Decision

Adoptar un modelo de escalabilidad por etapas:

1. MVP con region primaria `sa-east-1` y edge global.
2. Etapa de traccion con API multi-region active-active.
3. Etapa global con sharding por macro-region.

## Consecuencias

- Positivo: evita sobrecoste extremo al inicio.
- Positivo: deja camino claro para expansion mundial.
- Negativo: requiere disciplina en modelos de datos region-aware desde dia 1.
- Negativo: operacion mas compleja al pasar a etapa G2.

## Alternativas descartadas

1. Mantener mono-region indefinidamente.
2. Saltar a multi-region completo desde el dia 1.
