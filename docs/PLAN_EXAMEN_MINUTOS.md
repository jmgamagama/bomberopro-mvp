# Fecha de examen prevista y sesión por minutos

Es el punto 4 del top 5 de ATLAS (`/workspace/analisis_atlas.md`). Todo funciona en local y por cuenta, con claves `<clave>:<userId|demo>` (`src/utils/localOwner.ts`). No se usa Supabase ni se envía nada.

## Fecha de examen prevista (`src/utils/studyPlan.ts`)
- **La pone el alumno, y es opcional.** Se puede poner en la bienvenida (se guarda al pulsar «Empezar sesión diaria»; «Saltar» no la guarda) y en la Sesión diaria (se guarda al momento y se puede quitar).
- Clave: `mira_fecha_examen_v1:<cuenta>`, con formato `YYYY-MM-DD`. Si la fecha no es válida, se ignora.
- **La fecha oficial no está publicada.** Es la de la convocatoria CPEI Badajoz 2026 (38 plazas, BOP n.º 135, 17/07/2026, anuncio 2843/2026), y `convocatoria.fechaExamen` sigue en `null`. La interfaz lo dice así: «La pones tú: la fecha oficial del examen aún no se ha publicado».
- **Ritmo:** fichas por consolidar ÷ días que faltan (redondeado hacia arriba).
  - «Fichas por consolidar» son las de los mazos revisados y accesibles en tu plan que todavía no están en estado CONSOLIDADO (`src/utils/recallLearning.ts`).
  - Ejemplo del texto: «Faltan 10 días para tu fecha prevista (27/10/2026). Te quedan 95 fichas por consolidar: unas 10 al día.»
  - Hay mensajes propios para cuando no hay fecha, cuando es hoy, cuando ya ha pasado y cuando todo está consolidado.

### Consejo cuando el ritmo es alto (`describePaceAdvice`)
- Aparece cuando el ritmo necesario supera lo que cabe en el tiempo elegido (las fichas de la sesión con esos minutos) o, sin minutos elegidos, unas **40 fichas al día** (`HEAVY_PACE_CARDS`).
- El mensaje es honesto pero motivador: «Es un ritmo alto… No hace falta llegar a todo para avanzar.» Siempre lleva una alternativa concreta:
  1. Con tema prioritario: «Céntrate primero en el tema N: te quedan X fichas, unas Y al día».
  2. Sin tema prioritario: los **temas 35 a 40**, citando el único dato oficial de peso que hay. Las bases (BOP n.º 135, 17/07/2026) dicen que son el 30 % de las preguntas del test (`convocatoria.pesoTemasLocales`). Solo se cuentan las fichas de esos temas que el alumno tiene disponibles. No se inventa el peso de ningún otro tema.
  3. Si no hay nada de eso, «Elige un tema prioritario para avanzar por partes».
  4. Además, con 10 o 20 min, se le propone subir a 30 min (con las fichas que cabrían).

## Sesión por minutos
- **Opciones:** el alumno elige entre «30 fichas» (la sesión de siempre, por defecto), 10 min, 20 min y 30 min.
  - Clave: `mira_minutos_dia_v1:<cuenta>`.
  - Sin elegir nada, la sesión se comporta exactamente como antes: 30 fichas, o 10 en el plan Gratis.
- **Tiempo por ficha:** es la **mediana** de los últimos 100 repasos cronometrados del registro local (`mira_recall_registro_v1`, campo opcional `ms`).
  - La Sesión diaria mide el tiempo desde que se muestra la ficha hasta que se autoevalúa.
  - No cuentan los tiempos de menos de 3 s (toques sin leer) ni los de más de 5 min (pausas). El resultado se limita a entre 10 y 120 s.
  - Hacen falta al menos 10 repasos cronometrados. Las entradas antiguas del registro, sin tiempo, se siguen leyendo.
- **Valor inicial sin datos: 40 s por ficha.** Cubre leer la pregunta, intentar recordar, mostrar la respuesta, compararla con la fuente y autoevaluarse.
  - Es prudente a propósito: mejor acabar antes que pasarse del tiempo.
  - Equivale a 10 min ≈ 15 fichas, 20 min ≈ 30 fichas (la sesión de siempre) y 30 min ≈ 45 fichas.
- **Límites de tamaño:** la sesión por minutos tiene entre 5 y 90 fichas. En el plan Gratis nunca pasa de su límite de 10.
- **Selección sin cambios:** se mantienen el orden vencidas → falladas → nuevas, la cuota del 60 % del tema prioritario y el filtro de mazos revisados. Solo cambia el número de fichas.

## Tramo final (≤ 14 días hasta la fecha prevista, incluido el mismo día)
- **Orden de la sesión** (`pickDailyRecallSession` con `finalStretch`):
  1. vencidas y falladas, como siempre;
  2. nuevas, pero **como mucho 1 de cada 4** fichas de la sesión (`FINAL_STRETCH_NEW_SHARE = 0.25`);
  3. el hueco que queda se llena con **repaso adelantado** de lo ya visto: primero lo no consolidado y después lo que vence antes, con el 60 % del tema prioritario;
  4. si aún sobra sitio, más nuevas. La sesión nunca se queda corta por esta regla.
- **Por qué:** una ficha necesita dos recuerdos en días distintos para consolidarse. Cerca del examen rinde más afianzar lo visto que abrir muchas fichas nuevas.
  - El repaso adelantado no alarga el intervalo SM-2 (`scheduleReview` ignora el repaso hecho antes de tiempo), así que no falsea el estado.
- **Aviso:** la Sesión diaria lo explica con un aviso: «Queda poco para tu fecha…».

## Pendiente
- Si algún día se publica la fecha oficial, se puede ofrecer como sugerencia citando su fuente, pero nunca se debe sobrescribir la fecha del alumno sin que lo pida.
