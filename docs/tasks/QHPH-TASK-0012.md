# QHPH-TASK-0012 Configurar baseline de edge global (CDN, WAF, aceleracion)

- Tipo: `TASK`
- Prioridad: `P1`
- Estimacion (pts): `5`
- Responsable: `Codex`
- Estado: `Done`
- Fecha de cierre: `2026-02-24`

## Contexto

Se requiere baseline de edge global para soportar crecimiento internacional mobile-first.

## Alcance

1. IaC de CloudFront.
2. IaC de WAF.
3. IaC de Global Accelerator.
4. Documento tecnico de baseline.

## Fuera de alcance

1. Provisionamiento real en AWS.
2. Politicas WAF avanzadas.
3. Certificados personalizados ACM.

## Criterios de aceptacion

1. Existe modulo Terraform `infra/terraform/edge-global`.
2. Incluye recursos base CloudFront/WAF/Global Accelerator.
3. Existe documento de baseline en `docs/`.
4. El tablero refleja la tarea en `Done`.

## Riesgos

1. IaC sin apply en este paso; mitigacion: validar plan/apply en entorno de infraestructura.

## Dependencias

1. `QHPH-TASK-0006` completada.

## Plan tecnico

1. Crear modulo Terraform edge-global.
2. Definir variables, outputs y README tecnico.
3. Registrar cierre de tarea.

## Pruebas requeridas

1. Verificacion estructural de archivos Terraform.

## Evidencia de cierre

1. Link PR: `N/A (trabajo local en curso)`.
2. Captura o salida de tests: verificacion de archivos `infra/terraform/edge-global/*`.
3. Documentos actualizados:
   - `infra/terraform/edge-global/*`
   - `docs/31_edge_global_baseline.md`
   - `docs/27_tablero_maestro_tareas.md`
   - `docs/tasks/QHPH-TASK-0012.md`
