# Arquitectura mobile y UX tecnica (MVP)

- Estado: `Aprobado`
- Version: `1.1`
- Ultima actualizacion: `2026-02-24`

## 1. Alcance mobile

Una sola app mobile (iOS y Android) para:

1. Usuario final (descubrimiento).
2. Modo organizador (publicacion y gestion).

## 2. Estructura de navegacion (Expo Router)

1. `(auth)` login y sesiones.
2. `(tabs)/inicio` feed principal.
3. `(tabs)/explorar` listado con filtros.
4. `(tabs)/mapa` mapa interactivo.
5. `(tabs)/guardados` eventos guardados.
6. `evento/[id]` detalle del evento.
7. `organizador/eventos` dashboard organizador.
8. `organizador/eventos/nuevo` crear evento.
9. `organizador/eventos/[id]/editar` editar evento.
10. `ajustes` preferencias, notificaciones y privacidad.

## 3. Patron de estado

- Estado servidor: `TanStack Query`.
- Estado UI efimero: `React state`.
- Estado global minimo: `Zustand` (sesion, preferencias, feature flags).
- Cache de queries con invalidacion por dominio.
- Persistencia local de datos de sesion con almacenamiento seguro.

## 4. Composicion de interfaz

- Shell mobile con tabs inferiores y header contextual.
- Componentes reutilizables en `packages/ui`.
- Filtros como bottom sheet desacoplado del feed.
- Cards de evento uniformes para feed y mapa.
- Mapa con cluster de pines para densidad alta.

## 5. Reglas UX obligatorias

1. Tiempo a primer contenido visible `<= 2s` en red 4G.
2. Maximo 3 pasos para guardar un evento desde inicio.
3. CTA principal visible en primer viewport de detalle.
4. Estados vacios con accion clara y recomendacion de contenido.
5. Flujo de permisos (ubicacion/notificaciones) pedido en momento de valor.

## 6. Accesibilidad minima

- Soporte de lectores de pantalla en pantallas core.
- Contraste WCAG AA.
- Labels y mensajes accesibles para formularios.
- Objetivos tactiles minimos de `44x44`.
- Respeto de tamano de fuente dinamico del sistema.

## 7. Estrategia de rendimiento mobile

- Pantallas de lista con virtualizacion.
- Carga incremental de feed por cursor.
- Precarga de detalle al tocar card.
- Cache de imagenes con politicas TTL.
- Inicio en frio objetivo: `<= 2.5s` en dispositivos de gama media.

## 8. Error handling mobile

- Error boundary por stack de navegacion.
- Estados de fallo con reintento.
- Mensajes de error mapeados desde `code` de API.
- Captura de errores en runtime con Sentry.

## 9. Instrumentacion obligatoria mobile

1. `onboarding_completed`
2. `feed_loaded`
3. `filter_applied`
4. `event_opened`
5. `event_bookmarked`
6. `ticket_link_clicked`
7. `organizer_event_published`
8. `push_permission_result`
9. `location_permission_result`

## 10. Estrategia de releases mobile

1. Canal `internal`: pruebas internas.
2. Canal `beta`: testers cerrados.
3. Canal `production`: usuarios finales.
4. Rollout gradual por porcentaje en stores.
