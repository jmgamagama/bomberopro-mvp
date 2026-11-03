# T38: fichas de ampliación no visibles (ITF Gestión de EPIs de uso colectivo)

**Decisión del propietario (31/10/2026):** las 30 fichas `CPEI-T38-GES-001` a `CPEI-T38-GES-030` salen de los mazos visibles y del simulacro.

**Motivo.** El temario (BOP de Badajoz nº 135, de 17/07/2026, anexo I) enuncia en el Tema 38 solo tres instrucciones: «ITF Horario de actividades. ITF EPIs y Vestuario de permanencia. ITF Limpieza de EPIs en el parque». La «ITF Gestión de equipos de protección de uso colectivo» (edición 1ª, 01/01/2026) no figura en el temario.

**Estado.** Las fichas son correctas según su fuente (auditadas el 31/10/2026 contra el PDF oficial) y se quedan en `src/data/tema38Recall.ts` y `data/tema38/fichas_198.json` como material de ampliación. Se ocultan al alumno con `OUT_OF_SYLLABUS_CARDS['tema38']` (`src/data/recallCardReview.ts`). El propietario y el admin de revisión siguen viéndolas.

**Simulacro.** Ninguna pregunta local del simulacro (`src/data/initialData.ts`) sale de una ficha GES. El banco del servidor (Supabase) no se ha tocado en este cambio.
