# Auditor D — Alumno real (BomberoPro, rama audit/2026-10-26 @ 7007d99)

Fecha: 26/10/2026 (hora de Madrid). Solo se ha observado: no se ha cambiado código de la app, no se ha usado Supabase y no se ha hecho push.
Todo lo que aparece aquí sale de los scripts de `audit/checks/D_alumno/`, con resultados en `audit/D_alumno/resultado_*.json` y capturas en `audit/D_alumno/capturas/`.
Builds probados:
- producción `npm run build && npm run preview`, en :4173, sin VITE_FEATURE_PLANES;
- producción con `VITE_FEATURE_PLANES=true`, en :4174;
- dev `npm run dev`, en :3000 (perfiles 1 y 2, en `dev_resultado_*.json`).

## Cifras

| Perfil | Clics hasta la 1.ª pregunta | Tiempo hasta la 1.ª pregunta | Errores de consola |
|---|---|---|---|
| 1. Novato móvil 360x740 táctil, Slow 3G (prod) | **1** (Empezar sesión diaria) | 5,5 s (primer h1 en 4,3 s) | 0 |
| 1. Lo mismo en dev | 1 | **129 s** (Vite dev sin empaquetar; no representa producción) | 0 |
| 2. Repetidor escritorio, simulacro (prod) | **5** en la ruta real que siguió (Saltar → Por Temas [muro] → Recuerdo → Simulacro → Comenzar). La ruta mínima es de 2 a 3. | 2,3 s | 0 |
| 3. Gratis sin registro, sin planes | **2** (eligió T35 → Empezar) | 1,7 s | 0 |
| 3. Gratis sin registro, con planes | **1** (T35 bloqueado → Empezar) | 1,6 s | 0 |

**Mediana de los 3 perfiles (1, 5, 2): 2 clics.** Si se cuentan las 4 ejecuciones, incluida la de planes, la mediana es 1,5. No hubo errores de consola ni `pageerror` en ninguna ejecución, ni en prod ni en dev.

axe-core 4.x (WCAG 2.1 A/AA): pantallas de bienvenida, ficha, respuesta, dashboard y simulacro. Hay **1 violación serious**: `color-contrast` en el texto «· 804 fichas» de la opción «Todos los temas» (`text-slate-500` sobre el fondo índigo seleccionado). En el resto de pantallas no hay violaciones. Detalle en `axe.json`.

## Perfil 1 · Novato en el móvil
- Entiende qué hacer: el CTA «Empezar sesión diaria» es sticky y se ve sin hacer scroll (y=642 de 740). Un toque y ya tiene la pregunta. Esto está bien.
- No hay desborde horizontal ni texto cortado, y ningún control táctil baja de 44 px (descontado el skip-link sr-only).
- Atascos:
  - La línea de fuente tiene 193 caracteres y va pegada a la etiqueta («T39Fuente: Protocolo de movilización…»). Ocupa 4 líneas antes de que piense la respuesta (`p1_novato_movil_04_fuente_kilometrica.png`).
  - Los tres botones de autoevaluación («No la sabía / Dudosa / La sabía») dicen todos «mañana». La repetición espaciada no se ve: ¿para qué distingo entonces? (`p1_novato_movil_05_respuesta.png`).
  - La pestaña inferior «Más» aparece resaltada durante la sesión, que está en «Estudiar». Además, la cabecera dice «Repasar (5)» mientras la sesión cuenta «1 / 30».
  - En la cabecera hay un botón «Salir» aunque nunca inició sesión (ver perfil 3).
- Qué le haría irse: casi nada en el primer minuto. Después, ver que todo vuelve «mañana» y cifras que no cuadran (5 frente a 30).

## Perfil 2 · Repetidor exigente (escritorio 1366x768)
- **No hay buscador.** T25 (mercancías peligrosas) y T6 (PRL) **no existen**: solo hay 8 temas de recuerdo (T10, 16, 17, 24, 35, 38, 39 y 40) de los 40 del temario (`p2_repetidor_01_sin_t25_ni_t6.png`).
- **«Por Temas» del menú principal es un muro:** «requiere una cuenta. Crea una cuenta o inicia sesión», y el único botón es «Volver al inicio» (`p2_repetidor_02_por_temas_muro.png`).
- **Simulacro:** las reglas anuncian «55 preguntas (50 + 5 reserva)» y el dashboard «55 preguntas, 60 min». Arranca con «Simulacro de muestra», «Pregunta 1 de 10» y un cronómetro de 60:00, es decir, 6 min por pregunta: no hay presión real (`p2_repetidor_04_simulacro_10_preguntas_60min.png`). Además, «30 % de temas 35-40 garantizado», pero el resultado da «TEMAS 35-40: 0 / 0 / 0»: las 10 preguntas son de los temas 1 a 34 (`p2_repetidor_06_simulacro_resultado.png`).
- **Fuente:** 0 de 10 preguntas del simulacro muestran su fuente mientras se responde (`p2_repetidor_07_simulacro_sin_fuente.png`). Las fichas de Recuerdo sí la muestran.
- **Lo que sí hay:** nota con la fórmula +0,200/−0,066, aciertos/fallos/blancos, «Fallos con mucha seguridad» y Errores Críticos, que sí recoge el falso dominio («Reentrenar Error»), en `p2_repetidor_08_errores_tras_fallar.png`. El dashboard tiene racha y calibración. El resultado dice «Tiempo medio 1 segundos» (error de concordancia). La curva de olvido es una lección sobre Ebbinghaus con LaTeX sin renderizar («($R$)»), en `p2_repetidor_09_curva_olvido.png`.
- **Qué echa de menos:** buscador por tema o palabra; el temario completo (T1-T40); un simulacro real de 55 preguntas; la fuente en las preguntas del simulacro; un histórico de simulacros y la evolución de la nota; un filtro de fallos por tema.
- **Qué le haría irse:** buscar su tema débil (T25/T6) y no encontrarlo, y que «Por Temas» le cierre la puerta.

## Perfil 3 · Solo quiere probar gratis (sin registro)
- **«20 tests gratis» no existe.** El texto no aparece en ninguna pantalla recorrida (inicio, fin de sesión, Planes, después de Salir). Tampoco está en el código: `PLAN_LIMITS.free` es `{ deckIds: ['tema40'], dailySessionSize: 10 }`.
- **No se pide email nunca:** 0 `input[type=email]`, tampoco al pulsar «Salir».
- **Sin planes:** 30 fichas por sesión y todos los temas. Eligió T35 y **la primera ficha fue de T38**. De 30 fichas, 18 fueron de T35 y 12 de otros temas, sin aviso (`p3_gratis_sinplanes_03_tema_elegido_ignorado.png`).
- **Con planes:** los 7 temas que no son T40 aparecen deshabilitados con la etiqueta «Pro»; al tocarlos no pasa nada y no se explica (`p3_gratis_planes_02_t35_bloqueado.png`). La sesión es de 10 fichas de T40. La página Planes dice que Pro está «Próximamente», sin precio, y solo ofrece «Avísame», que guarda el interés en local (`p3_gratis_planes_09_planes.png`).
- **El límite gratis es decorativo:** después de las 10 fichas, el botón «Empezar a estudiar» de la portada abre otra sesión de 15 preguntas de Constitución, fuera de «solo tema 40». Además, la portada dice «5 preguntas» (`p3_gratis_planes_06_limite_gratis_decorativo.png`).
- **Dónde choca con un muro:** en «Temas» (sin botón para registrarse) y en el simulacro completo («requiere una cuenta»), pero no existe ningún flujo para crearla en la demo (`*_muro_sin_registro.png`). «Salir» de la cabecera no hace nada visible: la pantalla sigue igual (`p3_gratis_sinplanes_08_tras_salir.png`).
- **Qué le haría irse:** que le pidan una cuenta que no puede crear, y temas en gris sin explicación ni precio.

## Los 5 peores atascos
1. **Solo existen 8 de los 40 temas y no hay buscador.** El repetidor no encuentra T25 ni T6. `p2_repetidor_01_sin_t25_ni_t6.png`
2. **Muros que piden una cuenta sin dar forma de crearla** («Por Temas», simulacro completo). `p2_repetidor_02_por_temas_muro.png`, `p3_gratis_planes_08_muro_sin_registro.png`
3. **Simulacro engañoso:** anuncia 55 preguntas y un 30 % de T35-40; da 10 preguntas, 0 de T35-40 y 60 minutos. `p2_repetidor_04_simulacro_10_preguntas_60min.png`, `p2_repetidor_06_simulacro_resultado.png`
4. **Plan gratis incoherente:** el límite de 10 fichas se salta con «Empezar a estudiar», los temas en gris no se explican y el «20 tests gratis» no existe. `p3_gratis_planes_06_limite_gratis_decorativo.png`, `p3_gratis_planes_02_t35_bloqueado.png`
5. **Las preguntas del simulacro no muestran fuente** (0 de 10), cuando la fuente es la promesa de la app. `p2_repetidor_07_simulacro_sin_fuente.png`

Menores: la fuente de 193 caracteres en el móvil; las tres autoevaluaciones dicen «mañana»; «Salir» sin sesión; el contador 5/30/15 no cuadra; un contraste axe; «1 segundos»; LaTeX sin renderizar.

## Checks añadidos (`audit/checks/D_alumno/`)
- `lib.cjs`: arranque, contador de clics, capturas, auditoría de layout táctil y verificación final. **Falla** si la primera pregunta exige más de `MAX_CLICKS` clics (por defecto 3) o si hay errores de consola o `pageerror`.
- `perfil1_novato_movil.cjs`: 360x740, táctil y Slow 3G vía CDP. También falla si hay desborde horizontal.
- `perfil2_repetidor_escritorio.cjs`: temas, Por Temas, simulacro completo, errores, curva y dashboard. **Hoy FALLA** (5 clics > 3).
- `perfil3_gratis_sin_registro.cjs`: se ejecuta con `BASE` :4173 (sin planes) y :4174 (con planes).
- `accesibilidad_axe.cjs`: falla con violaciones serious o critical. **Hoy FALLA** (color-contrast).
- `run_all.sh`: ejecuta todo y devuelve un código distinto de 0 si algo falla.

Nota: la nota del simulacro del perfil 2 varía entre ejecuciones, porque las preguntas y las opciones se barajan (3 ejecuciones marcando siempre la A: 80 %, 40 %, 30 %). No es un hallazgo.
