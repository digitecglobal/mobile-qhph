# PRD del MVP

- Estado: `Aprobado`
- Version: `0.3`
- Ultima actualizacion: `2026-02-24`

## 0. Parametros cerrados del MVP

- Producto: `Que hay pa' hacer`.
- Ciudad piloto: `Bogota, Colombia`.
- Categorias iniciales: `musica`, `teatro`, `ferias`, `gastronomia`, `nightlife`.
- Meta 90 dias: `600 WAU` y `120 eventos activos/semana`.
- Plataforma de lanzamiento: `App mobile iOS y Android`.
- Plataforma web publica: `Fuera de alcance MVP`.

## 1. Objetivo del MVP

Validar que una app centralizada de eventos mejora el descubrimiento oportuno y aumenta la intencion de asistencia para usuarios en una ciudad piloto.

## 2. Alcance del MVP

### Incluye

- App mobile para iOS y Android.
- Onboarding con ciudad e intereses.
- Feed de eventos por relevancia.
- Filtros por fecha, categoria, distancia y precio.
- Mapa de eventos.
- Detalle del evento con informacion clave.
- Guardar eventos.
- Alertas basicas por intereses y eventos guardados.
- Portal basico para organizadores (crear/editar/publicar evento).

### No incluye

- Compra de entradas dentro de la app (solo enlace externo).
- Chat social interno.
- Recomendacion avanzada por IA.
- Multi idioma avanzado.
- Web publica para usuarios finales.

## 3. Historias de usuario principales

1. Como usuario, quiero ver eventos cercanos hoy y esta semana para elegir rapido.
2. Como usuario, quiero filtrar por categoria y precio para encontrar planes acordes.
3. Como usuario, quiero guardar eventos y recibir recordatorios.
4. Como organizador, quiero publicar eventos en pocos pasos para ganar visibilidad.
5. Como organizador, quiero editar rapidamente si cambian horarios o ubicacion.

## 4. Flujos criticos

1. Onboarding -> seleccionar ciudad/intereses -> feed personalizado.
2. Feed -> filtro -> detalle de evento -> guardar o abrir enlace de entradas.
3. Mapa -> seleccionar pin -> detalle -> accion.
4. Portal organizador -> crear evento -> revisar -> publicar.

## 5. Definicion de "evento completo"

Para mostrarse publicamente, un evento debe tener:

- Titulo.
- Categoria.
- Fecha y hora.
- Lugar con ubicacion valida.
- Descripcion corta.
- Imagen principal (poster u oficial).
- Organizador identificado.

## 6. Reglas de priorizacion de eventos en feed (v1)

1. Fecha proxima.
2. Cercania geografica.
3. Coincidencia con intereses.
4. Calidad de ficha (completitud).
5. Estado de verificacion.

## 7. Criterios de aceptacion del MVP

- Usuario nuevo obtiene feed relevante en menos de 2 minutos desde instalacion.
- Existe masa minima de `120` eventos activos por semana en Bogota.
- Tasa de guardado por usuario activo semanal alcanza el objetivo definido en `10_metricas_kpis_y_analitica.md`.
- Organizadores pueden publicar eventos sin asistencia del equipo.

## 8. Dependencias

- Captura continua de oferta de eventos (manual o integraciones).
- Politicas de calidad y moderacion activas.
- Sistema de notificaciones confiable.

## 9. Riesgos operativos del MVP

- Contenido insuficiente en fases tempranas.
- Eventos duplicados o desactualizados.
- Baja calidad de publicaciones de terceros.
