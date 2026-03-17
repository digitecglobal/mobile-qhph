# QHPH-TASK-0305 Reporte de evento por usuarios

- Tipo: `TASK`
- Prioridad: `P1`
- Estimacion (pts): `2`
- Responsable: `Codex`
- Estado: `Done`
- Fecha de cierre: `2026-02-24`

## Contexto

Se requiere capacidad minima de reporte ciudadano para calidad de catalogo.

## Alcance

1. Endpoint `POST /api/v1/events/:id/report`.
2. Dedupe de reportes abiertos por usuario/evento.
3. Integracion basica en detalle mobile.

## Fuera de alcance

1. Flujo de apelaciones.
2. Adjuntos multimedia de evidencia.

## Criterios de aceptacion

1. Usuario autenticado puede reportar evento.
2. Reportes duplicados activos se consolidan.
3. Pantalla detalle tiene accion `Reportar evento`.
4. Tablero en `Done`.

## Riesgos

1. Sin token API la accion en mobile no persiste en backend.

## Dependencias

1. `QHPH-TASK-0105` completada.

## Plan tecnico

1. Crear modulo `reports`.
2. Exponer endpoint de reporte y auditoria.
3. Integrar boton de reporte en detalle mobile.

## Pruebas requeridas

1. `tsc --noEmit` API y mobile.

## Evidencia de cierre

1. Link PR: `N/A (trabajo local en curso)`.
2. Captura o salida de tests: rutas reportes mapeadas + compilacion limpia.
3. Documentos actualizados:
   - `apps/api/src/reports/*`
   - `apps/mobile/app/event/[id].tsx`
   - `docs/27_tablero_maestro_tareas.md`
   - `docs/tasks/QHPH-TASK-0305.md`
