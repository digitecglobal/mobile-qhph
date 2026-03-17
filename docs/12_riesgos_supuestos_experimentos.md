# Riesgos, supuestos y experimentos

- Estado: `Borrador`
- Version: `0.1`
- Ultima actualizacion: `2026-02-23`

## 1. Supuestos criticos

1. Los usuarios quieren una solucion centralizada para enterarse de eventos.
2. Los organizadores estan dispuestos a publicar en una nueva plataforma.
3. La oferta de eventos en una ciudad es suficiente para generar habito semanal.
4. Las alertas personalizadas aumentaran asistencia e intencion de compra.

## 2. Riesgos principales

## Riesgo R1: Oferta insuficiente

Sin eventos de calidad, cae retencion.

## Riesgo R2: Calidad baja de datos

Eventos incompletos o desactualizados reducen confianza.

## Riesgo R3: Adquisicion costosa

Si CAC es alto y retencion baja, no cierra el modelo.

## Riesgo R4: Dependencia de pocos organizadores

Vulnerabilidad en inventario de eventos.

## 3. Matriz de priorizacion de riesgos

- Alto impacto / alta probabilidad: R1, R2.
- Alto impacto / media probabilidad: R3.
- Medio impacto / media probabilidad: R4.

## 4. Experimentos de validacion

## E1: Test de descubrimiento rapido

- Hipotesis: usuarios encuentran un evento relevante en menos de 2 minutos.
- Metrica: tiempo a primer guardado.
- Umbral: mediana <= 120 segundos.

## E2: Test de utilidad de alertas

- Hipotesis: alertas incrementan regreso semanal.
- Metrica: retencion semana 1 y 4 en cohortes con vs sin alertas.
- Umbral: uplift >= 15%.

## E3: Test de publicacion organizadores

- Hipotesis: flujo simple aumenta tasa de publicacion repetida.
- Metrica: porcentaje de organizadores que publica 2+ eventos en 30 dias.
- Umbral: >= 30%.

## E4: Test de oferta minima

- Hipotesis: con catalogo base adecuado mejora retencion.
- Metrica: retencion semana 4 en usuarios con 20+ eventos semanales visibles.
- Umbral: >= 20%.

## 5. Reglas de decision

1. Si no se cumple E1 o E4, no escalar adquisicion.
2. Si no se cumple E3, reforzar propuesta a organizadores antes de monetizar.
3. Si R2 crece, priorizar calidad sobre nuevas features.

## 6. Registro de aprendizaje

Por cada experimento documentar:

- Fecha.
- Cohorte.
- Resultado.
- Decision tomada.
- Cambio implementado.
