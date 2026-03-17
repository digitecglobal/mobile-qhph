# Edge global baseline (CloudFront + WAF + Global Accelerator)

## Objetivo

Provisionar baseline de edge global para API mobile con:

1. CDN global (CloudFront)
2. WAF administrado
3. Aceleracion de red global (Global Accelerator)

## Variables requeridas

1. `origin_domain_name`
2. `alb_arn`

## Uso de referencia

```bash
terraform init
terraform plan \
  -var="origin_domain_name=api.example.com" \
  -var="alb_arn=arn:aws:elasticloadbalancing:..."
```
