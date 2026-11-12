# Registro de cambios en producción y de su autorización

> Fuente de verdad de **qué se aplicó en producción, cuándo, con qué mensaje de JM y cómo se deshace**. Antes de cualquier migración nueva, cada agente consulta `supabase_migrations.schema_migrations` de producción (`yndoaprnpkjqiggeyefz`) y añade aquí su línea.
> Regla (`docs/AUTORIZACIONES.md`): todo cambio en producción necesita «sí» escrito de JM. **JM decide si estos mensajes de chat cuentan como «escrito»**; si no, debe decirlo aquí o en la PR y se revierte con el `_down` indicado.

## Aplicado por la sesión de Claude «Colores Variante A y tests» (12/11/2026)
Cada migración se aplicó con el SQL idéntico al del repo, se comprobó el hash del cuerpo contra el archivo y se probó con `begin … rollback`.

| Migración | Fecha (UTC) | Mensaje de JM que se tomó como «sí» | Efecto en el alumno | Cómo se deshace |
|---|---|---|---|---|
| 49 conceptos por niveles | 11/11 05:54 | «Sigue con la 49 y después sigues con la 50» | Los conceptos nuevos avanzan 1 → 2 → 3 dentro de cada bloque | `49_conceptos_por_niveles_down.sql` |
| 50 sesión por niveles | 11/11 05:55 | el mismo | Las preguntas nuevas respetan los niveles 1-2-3 por tema | `50_sesion_por_niveles_down.sql` |
| 47 límite de correcciones en conceptos | 12/11 08:24 | «Sigue» | Tope diario de correcciones: 600 (antes 1.500); el estudio por conceptos cuenta contra el límite | `47_limite_correcciones_conceptos_down.sql` |
| 43 auditoría de 200 preguntas | 12/11 08:25 | «Sigue» | 18 preguntas a borrador, 3 corregidas, 3 conceptos EX-100 a borrador y 2 corregidos | `43_auditoria_200_fase1_down.sql` |
| 46 auditoría temas 35-40 | 12/11 08:41 | «Si» (respuesta a «¿Sigo con la 46 … y luego la 37?») | 106 preguntas a borrador (96 duplicadas y 10), 11 corregidas, 4 conceptos de radio a borrador | `46_auditoria_temas_35_40_down.sql` |
| 37 eventos del embudo | 12/11 08:42 | el mismo | Ninguno (solo mide más eventos) | `37_eventos_embudo_ampliados_down.sql` |

Registro de lo anterior para poder restaurar valores: `qa_changes_20260923` (preguntas: 33 filas de la 43, 139 de la 46) y `qa_concept_changes` (conceptos: 7 de la 43, 4 de la 46).

## Aplicado por otras sesiones (no verificado por esta)
- 52, 55a-c y 56: constan en `schema_migrations` desde el 11/11 y el 12/11. Quién las aplicó y con qué mensaje lo debe añadir su sesión.
- 53 plan por usuario: aplicada el 12/11 08:40 UTC por la sesión «Bombero Pro navigation» tras «Si aplica» de JM.

## Pendiente
- 54 (mazo gratis a `tema1`) y el encendido de `VITE_PLAN_POR_USUARIO`: los lleva «Bombero Pro navigation», solo con «sí» escrito de JM.

## No verificado todavía
- Que el alumno no vea las 124 preguntas retiradas (43 y 46) en una sesión real de alumno.
- Que sigan existiendo preguntas suficientes en el tema 35 para el 30 % del simulacro.
