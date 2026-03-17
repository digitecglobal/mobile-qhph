# Requerimientos del MVP

- Estado: `Aprobado`
- Version: `0.3`
- Ultima actualizacion: `2026-02-24`

## 1. Requerimientos funcionales (FR)

- `FR-001`: El usuario debe poder seleccionar ciudad principal.
- `FR-002`: El usuario debe poder configurar intereses por categoria.
- `FR-003`: El sistema debe mostrar feed de eventos ordenado por relevancia.
- `FR-004`: El usuario debe poder filtrar por fecha, categoria, distancia y precio.
- `FR-005`: El usuario debe poder ver eventos en mapa interactivo.
- `FR-006`: Cada evento debe mostrar titulo, fecha/hora, lugar, descripcion e imagen.
- `FR-007`: El usuario debe poder guardar y quitar de guardados un evento.
- `FR-008`: El usuario debe poder abrir enlace externo para compra de entradas.
- `FR-009`: El sistema debe enviar recordatorios de eventos guardados.
- `FR-010`: El organizador debe poder crear, editar y publicar eventos.
- `FR-011`: El organizador debe poder guardar borradores.
- `FR-012`: El sistema debe detectar potenciales duplicados de evento.
- `FR-013`: El sistema debe permitir reporte de contenido por parte de usuarios.
- `FR-014`: El sistema debe iniciar en Bogota como ciudad piloto configurable por el usuario.
- `FR-015`: El sistema debe exponer las categorias iniciales del MVP: musica, teatro, ferias, gastronomia y nightlife.
- `FR-016`: El sistema debe operar en app mobile nativa para iOS y Android.
- `FR-017`: El sistema debe soportar notificaciones push en iOS y Android.
- `FR-018`: El sistema debe almacenar timezone por evento y por usuario para soporte global futuro.

## 2. Requerimientos no funcionales (NFR)

- `NFR-001`: Tiempo de carga de feed inicial menor a 3 segundos en condicion normal.
- `NFR-002`: Disponibilidad mensual objetivo mayor o igual a 99.5%.
- `NFR-003`: Aplicacion usable en dispositivos moviles de gama media.
- `NFR-004`: Cumplimiento de privacidad por consentimiento de ubicacion.
- `NFR-005`: Trazabilidad de cambios de eventos (auditoria basica).
- `NFR-006`: Proteccion minima contra spam y abuso en publicaciones.
- `NFR-007`: Crash-free sessions mobile mayor o igual a 99.3%.
- `NFR-008`: La arquitectura debe permitir despliegue multi-region sin redisenar contratos API.

## 3. Requerimientos de datos

- Cada evento debe incluir zona horaria correcta.
- Soporte de multiples fechas para eventos recurrentes (alcance parcial MVP).
- Soporte de estado del evento: borrador, publicado, cancelado, finalizado.
- Soporte de metadatos de verificacion: no verificado, verificado manual, fuente confiable.

## 4. Requerimientos de seguridad y privacidad

- Consentimiento explicito para geolocalizacion.
- Opcion de uso por ciudad sin geolocalizacion precisa.
- Almacenamiento de datos personales minimos.
- Mecanismo para eliminacion de cuenta y datos asociados.

## 5. Requerimientos de calidad de contenido

- Minimo de campos obligatorios para publicar.
- Rechazo de eventos sin fecha u ubicacion valida.
- Deteccion basica de palabras o patrones de fraude.

## 6. Criterios de salida de requerimientos

Este documento pasa a `Aprobado` cuando:

1. Cada FR tiene dueno funcional.
2. Cada NFR tiene metrica y umbral.
3. Producto y negocio validan que el alcance representa el MVP real.
