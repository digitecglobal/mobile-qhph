# Escalabilidad global y crecimiento de plataforma

- Estado: `Aprobado`
- Version: `1.0`
- Ultima actualizacion: `2026-02-24`
- Enfoque: `Global-ready desde el MVP`

## 1. Objetivo

Definir como crece `Que hay pa' hacer` de ciudad piloto a operacion mundial sin redisenos profundos.

## 2. Principios globales no negociables

1. API stateless y desacoplada de cliente.
2. Datos y caches region-aware desde el modelo inicial.
3. Feature flags para activar funciones por pais/ciudad.
4. Rollout gradual por region y por porcentaje de usuarios.
5. Observabilidad con corte por region, pais y ciudad.

## 3. Topologia regional por etapas

## Etapa G0 (MVP)

- Region primaria: `sa-east-1`.
- API/worker: despliegue principal en `sa-east-1`.
- DB: RDS multi-AZ en `sa-east-1` + replicas `us-east-1` y `eu-west-1`.
- Edge: CloudFront + Global Accelerator.

## Etapa G1 (traccion multi-pais)

- API active-active en `sa-east-1` y `us-east-1`.
- Redis por region con colas locales.
- Routeo por cercania y salud.

## Etapa G2 (escala global)

- API active-active en `sa-east-1`, `us-east-1`, `eu-west-1`.
- Sharding de escrituras por macro-region:
1. Americas: `us-east-1`.
2. EMEA: `eu-west-1`.
3. APAC: `ap-southeast-1`.
- Event router para escribir en shard regional correcto.

## 4. Estrategia de datos para escala

1. Claves obligatorias en entidades core: `country_code`, `city_id`, `timezone`.
2. Particionado de eventos por `city_id` y mes (`start_at`).
3. Indices geoespaciales PostGIS por particion activa.
4. Auditoria y metricas por region para detectar hotspots.

## 5. Estrategia de media y CDN

1. S3 con replication entre regiones.
2. Entrega de imagenes por CDN con cache keys por tamano/formato.
3. Politica de compresion y variantes de imagen para mobile.

## 6. Estrategia de colas y notificaciones

1. Colas por region para jobs de recordatorio.
2. Jobs idempotentes con reintentos y DLQ.
3. Envio de push por zona horaria local del evento.

## 7. Internacionalizacion y localizacion

1. Timezone por evento obligatoria.
2. Formato de fecha/hora local por configuracion del usuario.
3. Moneda y simbolo por pais.
4. Catalogo de categorias localizable por idioma.

## 8. Extensibilidad funcional (ejemplo avatar/skins)

1. Nuevo modulo `Personalization` desacoplado del core `Discovery`.
2. Tabla `avatar_skins` y relacion `user_avatar_config`.
3. Assets en S3 + CDN, sin impactar modelo de eventos.
4. Activacion por feature flags por region o cohorte.

## 9. Disparadores de escalado

1. p95 global > `500ms` por 14 dias -> activar nueva region de API.
2. CPU DB > `70%` sostenido -> particionado adicional o nuevo shard.
3. Cola de push > `5 min` atraso sostenido -> escalar workers regionales.
4. WAU > `250k` -> migrar a arquitectura G2.

## 10. Riesgos globales y mitigacion

1. Latencia interregional alta -> edge global + replicas de lectura.
2. Complejidad operativa por multi-region -> runbooks y automatizacion IaC.
3. Requisitos legales por pais -> politicas configurables por region.
