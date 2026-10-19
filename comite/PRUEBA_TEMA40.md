# Protocolo de aceptación — Tema 40 (borrador de Codex)

**Base:** `main` en `01713894d423aaebfd4cf8c63e2d2d399779d082` (3-oct-2026). Contrastar con el plan vigente del comité antes de ejecutar. **Ámbito:** staging. Producción solo después de aprobar y desplegar cambios; la sesión real de JM es una comprobación adicional. No usar la clave `service_role` en el navegador ni incluir identificadores personales en capturas.

## Preparación

1. Anotar URL, commit desplegado, proyecto Supabase, migraciones aplicadas, hora UTC y versión del navegador. Deben corresponder al mismo candidato de entrega.
2. Crear o usar dos cuentas de prueba autorizadas en staging, A y B, y dos perfiles de navegador. Guardar sus UUID en un registro privado de prueba, nunca en este documento.
3. Seleccionar una pregunta **publicada y revisada** del Tema 40 y anotar su `question_id`. Evitar preguntas reales de usuarios en el ensayo.
4. Antes de empezar, contar intentos y estado de esa pregunta por cuenta. Usar consultas de solo lectura y guardar el resultado con hora UTC.

## Casos obligatorios

| Caso | Acción | Resultado exigido | Evidencia |
|---|---|---|---|
| T40-01 | A inicia sesión, abre Tema 40 y responde una pregunta. | La interfaz confirma el guardado solo después de recibir confirmación remota. Existe **una** fila nueva en `attempts` con A, pregunta y tema correctos; `user_question_state` cambia para A. | Captura, hora UTC, consulta de filas antes/después y registro de red sin secretos. |
| T40-02 | Repetir el envío de T40-01 con la misma clave de intento. | Sigue habiendo una sola fila y los contadores no aumentan dos veces. | Clave de prueba, recuentos antes/después. |
| T40-03 | Cortar la red antes de enviar otra respuesta; restablecerla y reintentar. | La respuesta no se muestra como guardada mientras falte confirmación; permanece recuperable y el reintento crea una sola fila. | Captura del aviso, registro de red y consulta. |
| T40-04 | Caducar la sesión antes de enviar. | Aviso visible que pide recuperar la sesión; no se afirma éxito ni se atribuye el intento a otra cuenta. Tras iniciar sesión y reintentar se crea una sola fila de A. | Captura y consultas por usuario. |
| T40-05 | Cerrar el navegador de A y entrar con A en otro perfil/dispositivo. | Progreso, errores y próxima revisión coinciden con el estado remoto; no dependen del primer `localStorage`. | Capturas de ambos perfiles y filas de estado. |
| T40-06 | Salir de A y entrar con B en el primer navegador. | B no ve el historial ni el estado de A. | Captura y consulta de ambos usuarios. |
| T40-07 | Responder mal, entrar en búnker, repasar y volver a acertar. | Error y repaso aparecen en la secuencia prevista; `attempts` conserva cada respuesta y el estado remoto coincide con la interfaz. | Secuencia de capturas, horas y consultas. |
| T40-08 | Comprobar dominio con tres aciertos de confianza alta separados al menos 24 h; después fallar. | Cliente y servidor aplican la **misma** transición de dominio y recaída. No se concede dominio con tres aciertos inmediatos. | Prueba con reloj controlado en staging, trazas de estados y consultas. |
| T40-09 | Intentar acceder al piloto del artículo 1 desde la demo. | Las 15 preguntas pendientes de revisión humana no son accesibles. | Recorrido y captura. |
| T40-10 | Consultar `questions.correcta` y `questions.explicacion` por REST con `anon` y con sesión; probar las RPC con y sin sesión. | El resultado coincide con los permisos aprobados para la entrega. La retirada de `SELECT` directo no rompe el Tema 40 ni integraciones identificadas. | Respuesta HTTP, consulta de privilegios y smoke test; ocultar claves y respuestas en el informe público. |

## Consultas de comprobación

Sustituir los parámetros por valores de staging en un cliente seguro. Estas consultas solo leen datos; los identificadores se registran fuera del informe compartido.

```sql
select id, user_id, question_id, created_at
from public.attempts
where user_id = :test_user_id and question_id = :test_question_id
order by created_at desc;

select *
from public.user_question_state
where user_id = :test_user_id and question_id = :test_question_id;
```

Antes de ejecutarlas, confirmar los nombres reales de columnas de staging: La auditoría inicial no adjunta el esquema completo de estas dos tablas. Si difieren, adaptar las consultas y dejar constancia.

## Decisión del 17 de octubre

- **Apto como entrega limitada:** T40-01 a T40-09 pasan, el acceso al banco cumple el alcance aprobado, y JM completa y retoma una sesión real con la fila de `attempts` comprobada.
- **Bloqueado:** falta una fila, hay duplicados, se mezclan cuentas, la interfaz afirma éxito sin guardado, cliente y servidor discrepan en dominio o aparece contenido pendiente de revisión.
- **No acreditado todavía:** retención R7/R30. La prueba con reloj controlado verifica la lógica, pero la medición real a 7/30 días exige esperar esos plazos y no debe declararse completa el día 17.

El informe de QA debe incluir para cada caso `PASS`, `FAIL` o `BLOCKED`, fecha, entorno, commit y enlace a la evidencia. No convertir un caso bloqueado por falta de acceso en un resultado positivo.
