# QHPH-TASK-0203 Vista detalle mobile del evento con CTA de entradas

- Tipo: `TASK`
- Prioridad: `P0`
- Estimacion (pts): `5`
- Responsable: `Codex`
- Estado: `Done`
- Fecha de cierre: `2026-02-24`

## Contexto

La decision de asistencia requiere una vista detalle clara con CTA de ticket.

## Alcance

1. Endpoint `GET /api/v1/events/:id`.
2. Pantalla mobile `event/[id]`.
3. CTA para abrir `ticketUrl` externo.
4. Acciones de guardar/reportar desde detalle.

## Fuera de alcance

1. Checkout interno de entradas.

## Criterios de aceptacion

1. Detalle muestra informacion clave del evento.
2. CTA de entradas abre navegador del dispositivo.
3. Detalle integra guardado y reporte.
4. Tablero en `Done`.

## Riesgos

1. Si `ticketUrl` no es valido, CTA no abre; mitigacion: validacion simple de URL.

## Dependencias

1. `QHPH-TASK-0201` completada.

## Plan tecnico

1. Exponer detalle en discovery service/controller.
2. Crear ruta mobile de detalle.
3. Integrar acciones de dominio.

## Pruebas requeridas

1. `tsc --noEmit` API y mobile.

## Evidencia de cierre

1. Link PR: `N/A (trabajo local en curso)`.
2. Captura o salida de tests: compilacion limpia.
3. Documentos actualizados:
   - `apps/api/src/discovery/*`
   - `apps/mobile/app/event/[id].tsx`
   - `docs/27_tablero_maestro_tareas.md`
   - `docs/tasks/QHPH-TASK-0203.md`
