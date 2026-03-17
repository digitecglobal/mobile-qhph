# Edge global baseline

- Estado: `Aprobado`
- Version: `1.0`
- Ultima actualizacion: `2026-02-24`

## Componentes

1. CloudFront para distribucion global.
2. AWS WAF para proteccion perimetral.
3. AWS Global Accelerator para menor latencia global.

## Infra asociada

Ruta Terraform:

- `infra/terraform/edge-global`

## Alcance de baseline

1. Distribucion edge versionada.
2. ACL basica administrada.
3. Endpoint group hacia ALB regional.

## Siguiente endurecimiento

1. Certificado propio ACM.
2. Reglas WAF adicionales por patrones de abuso.
3. Observabilidad de edge en dashboards.
