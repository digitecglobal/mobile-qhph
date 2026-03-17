# Modelo operativo del proyecto por tareas

- Estado: `Aprobado`
- Version: `1.0`
- Ultima actualizacion: `2026-02-24`
- Regla: `Todo se ejecuta por tareas`

## 1. Tipos de items

1. `EPIC`: bloque funcional grande.
2. `STORY`: capacidad funcional para usuario.
3. `TASK`: trabajo tecnico ejecutable en 1-2 dias.
4. `BUG`: defecto con impacto funcional.
5. `CHORE`: trabajo tecnico sin valor funcional directo.

## 2. Formato de ID

- Formato: `QHPH-<TIPO>-<NUMERO>`.
- Ejemplos: `QHPH-STORY-0012`, `QHPH-TASK-0048`.

## 3. Estados oficiales de tarea

1. `Backlog`
2. `Ready`
3. `In Progress`
4. `In Review`
5. `QA`
6. `Done`
7. `Blocked`

## 4. Reglas de flujo

1. Ninguna tarea entra en `In Progress` sin criterios de aceptacion.
2. Ninguna tarea entra en `Done` sin evidencia de prueba.
3. Ningun PR puede mezclar multiples tareas no relacionadas.
4. Toda tarea debe enlazar documentacion impactada.

## 5. Definition of Ready (DoR)

1. Problema y objetivo claros.
2. Alcance delimitado (in/out).
3. Criterios de aceptacion medibles.
4. Dependencias identificadas.
5. Riesgos principales identificados.

## 6. Definition of Done (DoD)

1. Codigo implementado y revisado.
2. Tests requeridos pasando.
3. Documentacion actualizada.
4. Telemetria agregada para toda tarea que impacte flujo de usuario o proceso de negocio.
5. Validacion funcional hecha en staging.

## 7. Plantilla obligatoria de tarea

- `ID`
- `Titulo`
- `Tipo`
- `Contexto`
- `Alcance`
- `Fuera de alcance`
- `Criterios de aceptacion`
- `Riesgos`
- `Dependencias`
- `Estimacion`
- `Evidencia de cierre`

## 8. Estimacion estandar

- Escala: `1, 2, 3, 5, 8` puntos.
- Regla: si supera `8`, dividir tarea.
- Capacidad base sprint: `30 puntos`.

## 9. Politica de bloqueos

- Bloqueo > 24h: escalar en daily.
- Bloqueo > 48h: replanificacion obligatoria.
- Bloqueo > 72h: dividir alcance o mover de sprint.

## 10. Cadencia de gestion

1. Planificacion semanal por tareas `Ready`.
2. Daily de 15 minutos enfocado en bloqueos.
3. Demo semanal de tareas `Done`.
4. Retro quincenal con acciones concretas.
