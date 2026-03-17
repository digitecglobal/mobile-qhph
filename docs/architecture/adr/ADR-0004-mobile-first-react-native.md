# ADR-0004: Mobile-first con React Native y Expo

- Estado: `Aceptado`
- Fecha: `2026-02-24`

## Contexto

Se requiere lanzar primero en telefonos iOS y Android, con base comun para evolucionar funcionalidades de alto uso (mapa, notificaciones, personalizacion).

## Decision

Construir una sola app mobile con React Native + Expo, incluyendo vistas de usuario y modo organizador.  
La web publica se difiere para fase posterior.

## Consecuencias

- Positivo: salida rapida en canales de mayor uso (App Store y Google Play).
- Positivo: una base de codigo para iOS y Android.
- Negativo: pipeline de release mobile mas exigente (certificados, stores, revisiones).
- Negativo: paneles internos web quedan fuera del MVP.

## Alternativas descartadas

1. Web-first con Next.js.
2. Apps nativas separadas (Swift/Kotlin) desde dia 1.
