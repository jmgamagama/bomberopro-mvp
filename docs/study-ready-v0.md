# Study-ready v0 — resumen técnico para PR

## Alcance del cambio

El checkout local añade una primera sesión finita, un panel de errores accesible y un recorrido de demostración para un tema piloto. El preview conecta lectura de cinco microconceptos, recuperación activa con la opción «No recuerdo» y las 15 preguntas existentes. El material sigue pendiente de revisión editorial humana y no se presenta como contenido aprobado.

MIRA incorpora evidencia explícita de aciertos de confianza alta separados en el tiempo. Hasta tres aciertos con separación mínima de 24 horas, la vista limita el dominio a 85, la estabilidad a 1 y el siguiente intervalo a un día. Las respuestas con confianza baja/media reinician esa evidencia. Un acierto inmediatamente después de un error mantiene el error pendiente. `normalizeSpacedEvidence` y el adaptador de lectura normalizan el estado mostrado sin reescribir el almacenamiento histórico ni `db.ts`.

## Validación registrada

- En Chrome local (`http://127.0.0.1:4173`) se revisó el recorrido de lectura, conceptos, recuerdo con «No recuerdo» y pregunta. Un fallo con confianza alta apareció en errores y mostró la fecha del siguiente repaso.
- Se verificó visualmente que no se muestra pista antes de confirmar; al confirmar, aparecen la explicación y la fecha de repaso. El contador permanece en la pregunta contestada durante el feedback. Este comportamiento queda verificado; la prueba de `TrainScreen` pasó.
- `npm run test` pasó: 19 archivos, 78 tests, exit 0 en 143,44 s. `npm run lint`, `npm run build` y `git diff --check` también pasaron (exit 0). Build: 1.733 módulos, bundle JS de 334,92 kB.
- **Validación final: PASADA en el checkout local actual.** No se ha hecho merge ni desplegado esta candidata; si cambia el diff, repetir los checks antes del PR.

## Contratos y límites

- No se modificaron migraciones ni el almacenamiento existente de `db.ts`. Los campos de evidencia MIRA son opcionales y requieren comprobarse contra un contrato remoto real antes de afirmar sincronización.
- No hay pruebas reales contra Supabase/staging: el panel redirige a signin. Esquema, RLS, RPC, idempotencia y persistencia entre dispositivos siguen sin verificar.
- No se hicieron escrituras en producción ni QA real de día 1/día 2 o E2E entre dispositivos. El resultado manual local no acredita esos flujos.
- Las preguntas y el material piloto necesitan revisión editorial humana antes de publicarse como contenido aprobado.

## Estado para revisión

El cambio ofrece una sesión de estudio local de alcance pequeño; **no declara el producto Study-ready**. Validación final pasada en este checkout. **Pendiente:** revisión del PR, revisión editorial del contenido y contrato remoto de sincronización. No se ha hecho merge ni despliegue; repetir checks solo si cambia el diff.



