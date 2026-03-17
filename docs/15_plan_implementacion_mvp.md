# Plan de implementacion del MVP

- Estado: `Aprobado`
- Version: `1.1`
- Ultima actualizacion: `2026-02-24`
- Producto: `Que hay pa' hacer`

## 1. Objetivo de implementacion

Construir y lanzar un MVP mobile funcional (iOS/Android) en Bogota que permita descubrir eventos, guardarlos, recibir alertas y habilitar publicacion por organizadores.

## 1.1 Regla operativa

La ejecucion completa del proyecto se gestiona por tareas bajo `23_modelo_operativo_por_tareas.md`.

## 2. Alcance tecnico del plan

1. App mobile con onboarding, feed, filtros, mapa, detalle y guardados.
2. Portal organizador para publicar y mantener eventos.
3. Capa de notificaciones para recordatorios basicos.
4. Capa de analitica para medir activacion, retencion y calidad.
5. Web publica fuera de alcance en esta fase.

## 3. Fases de trabajo (12 semanas)

## Fase A (Semanas 1-2): Base de plataforma

1. Setup de repositorio, entorno y CI minimo.
2. Modelo de datos inicial y autenticacion.
3. Onboarding con ciudad/intereses.

### Precondicion Fase A

Sprint 0 de arquitectura completado segun `24_mapa_inicial_de_tareas_arquitectura.md`.

## Fase B (Semanas 3-6): Discovery core

1. Feed de eventos y filtros principales.
2. Pagina de detalle y guardados.
3. Instrumentacion de analitica base.

## Fase C (Semanas 7-10): Publicacion y alertas

1. Portal de organizadores.
2. Validacion de calidad y manejo de duplicados.
3. Notificaciones de recordatorio.

## Fase D (Semanas 11-12): Beta y estabilizacion

1. Pruebas E2E en flujo de usuario y organizador.
2. Correcciones de rendimiento y errores criticos.
3. Preparacion de beta cerrada en TestFlight y Google Play Internal.

## 4. Hitos con criterio de paso

1. Hito 1: base de datos + auth + onboarding en produccion interna.
2. Hito 2: feed usable y medible con datos reales.
3. Hito 3: publicacion de eventos por terceros sin soporte manual.
4. Hito 4: beta cerrada con metricas activas y monitoreo diario.

## 5. Plan de QA minimo

1. Smoke tests en cada deploy.
2. Casos criticos automatizados: registro, guardar evento, publicar evento.
3. Regression check semanal sobre filtros, mapa y notificaciones.

## 6. Plan de datos y analitica

1. Definir eventos de tracking antes de construir pantallas finales.
2. Crear dashboard semanal con WAU, eventos activos, guardados y retencion.
3. Revisar calidad de catalogo diariamente (duplicados, incompletos, cancelados).

## 7. Plan de lanzamiento de 90 dias

1. Dia 1-30: beta cerrada con inventario minimo de eventos.
2. Dia 31-60: mejora de relevancia y crecimiento controlado.
3. Dia 61-90: lanzamiento publico local y primera monetizacion ligera.

## 8. Criterio de exito de ejecucion

1. Alcanzar `>= 600 WAU` en la ciudad piloto.
2. Alcanzar `>= 120 eventos activos/semana`.
3. Mantener `>= 85%` de eventos completos al publicar.
4. Mantener `<= 5%` de eventos duplicados detectados.
