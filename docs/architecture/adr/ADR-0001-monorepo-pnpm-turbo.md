# ADR-0001: Monorepo con pnpm y Turborepo

- Estado: `Aceptado`
- Fecha: `2026-02-24`

## Contexto

El producto necesita evolucionar mobile, API y worker con librerias compartidas y pipeline unico.

## Decision

Usar monorepo con `pnpm` y `Turborepo`.

## Consecuencias

- Positivo: cache de builds, shared packages y versionado consistente.
- Positivo: menor duplicidad de configuracion.
- Negativo: curva inicial de setup.
- Negativo: disciplina alta para boundaries entre paquetes.

## Alternativas descartadas

1. Multi-repo por servicio.
2. Monorepo sin orquestador de tareas.
