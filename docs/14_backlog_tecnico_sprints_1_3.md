# Backlog tecnico priorizado (Sprints 1-3)

- Estado: `Aprobado`
- Version: `1.1`
- Ultima actualizacion: `2026-02-24`
- Producto: `Que hay pa' hacer`
- Ciudad piloto: `Bogota, Colombia`
- Plataforma foco: `Mobile iOS/Android`

## 1. Objetivo de este backlog

Definir el trabajo tecnico minimo para entregar un MVP funcional en 3 sprints, con foco en descubrimiento de eventos, calidad de catalogo y publicacion por organizadores.

## 1.1 Regla de gestion

Todas las tareas de este backlog siguen el modelo definido en `23_modelo_operativo_por_tareas.md`.

## 2. Supuesto de capacidad

- Duracion por sprint: `2 semanas`.
- Capacidad de referencia: `30 puntos` por sprint.
- Total planificado: `90 puntos` en 6 semanas.

## 3. Sprint 1 (Fundaciones de producto) - 30 pts

## Objetivo

Tener base operativa de autenticacion, onboarding y estructura de eventos.

## Historias y tareas

1. `QHPH-TASK-0101` Autenticacion mobile de usuario (email/password) - `5 pts` - `P0`.
2. `QHPH-TASK-0102` Onboarding con ciudad e intereses - `5 pts` - `P0`.
3. `QHPH-TASK-0103` Modelo de datos de eventos, organizadores y venues - `8 pts` - `P0`.
4. `QHPH-TASK-0104` API CRUD de eventos (borrador/publicado/cancelado) - `8 pts` - `P0`.
5. `QHPH-TASK-0105` Admin minimo para revision manual de eventos - `4 pts` - `P1`.

## Criterio de salida

- Usuario nuevo puede registrarse y completar onboarding desde la app mobile.
- Existen endpoints estables para crear, editar y listar eventos.

## 4. Sprint 2 (Discovery principal) - 30 pts

## Objetivo

Entregar la experiencia core de descubrimiento para usuarios finales.

## Historias y tareas

1. `QHPH-TASK-0201` Feed de eventos por relevancia (fecha + distancia + intereses) - `10 pts` - `P0`.
2. `QHPH-TASK-0202` Filtros por fecha/categoria/distancia/precio - `8 pts` - `P0`.
3. `QHPH-TASK-0203` Vista detalle mobile del evento con CTA de entradas - `5 pts` - `P0`.
4. `QHPH-TASK-0204` Guardar/quitar evento de favoritos - `4 pts` - `P0`.
5. `QHPH-TASK-0205` Eventos de analitica para onboarding, feed y guardados - `3 pts` - `P0`.

## Criterio de salida

- Usuario puede descubrir y guardar eventos en menos de 2 minutos.
- Queda instrumentado el embudo base de activacion.

## 5. Sprint 3 (Mapa, organizadores y alertas) - 30 pts

## Objetivo

Cerrar MVP con mapa interactivo, publicacion por organizadores y notificaciones basicas.

## Historias y tareas

1. `QHPH-TASK-0301` Mapa interactivo con pines y apertura de detalle - `8 pts` - `P0`.
2. `QHPH-TASK-0302` Portal organizador para crear/editar/publicar evento - `10 pts` - `P0`.
3. `QHPH-TASK-0303` Validaciones de calidad y deteccion basica de duplicados - `5 pts` - `P0`.
4. `QHPH-TASK-0304` Push recordatorios para eventos guardados (24h/2h) - `5 pts` - `P0`.
5. `QHPH-TASK-0305` Reporte de evento por usuarios - `2 pts` - `P1`.

## Criterio de salida

- Organizador puede publicar sin soporte del equipo.
- Usuario recibe alertas de eventos guardados.

## 6. Backlog inmediato post Sprint 3 (no bloqueante)

1. Integraciones de fuentes externas de eventos.
2. Priorizacion de eventos patrocinados con reglas de calidad.
3. Iteraciones de ranking con comportamiento real.

## 7. Dependencias de negocio para el backlog tecnico

1. Onboarding de al menos 40 organizadores en paralelo al Sprint 2-3.
2. Politicas de moderacion operativas antes del lanzamiento publico.
3. Definicion legal minima (terminos y privacidad) antes de beta abierta.
