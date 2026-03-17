# ADR-0002: Monolito modular para API

- Estado: `Aceptado`
- Fecha: `2026-02-24`

## Contexto

El MVP requiere velocidad de entrega y dominio aun cambiante, con equipo pequeno.

## Decision

Implementar backend como monolito modular con NestJS/Fastify.

## Consecuencias

- Positivo: desarrollo rapido, menor overhead operativo.
- Positivo: transacciones y consistencia mas simples.
- Negativo: riesgo de acoplamiento si no se respetan modulos.
- Negativo: escalado fino por dominio no disponible desde inicio.

## Alternativas descartadas

1. Microservicios desde dia 1.
2. Backend serverless fragmentado por funcion.
