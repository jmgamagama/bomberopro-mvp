# Opiniones de probabilidad y nivel (migración 44)

Desde «Reportar pregunta» el alumno puede marcar, además de errores:

| Opción en la app | `tipo` | ¿Oculta la pregunta? |
|---|---|---|
| Poco probable en el examen | `poco_probable` | No |
| Es de un nivel más fácil | `nivel_facil` | No |
| Es de un nivel más difícil | `nivel_dificil` | No |

Se guardan en `question_feedback` (una fila por alumno, pregunta y tipo; «más fácil» y «más difícil»
se excluyen entre sí). No retiran nada: son señales para la calibración de niveles
(1: aprobar con 5-6, 2: de 5 a 8, 3: para 9-10). La opción antigua «No cae en el examen» ya no se
ofrece porque ocultaba la pregunta y, con 3 reportes, la retiraba para todos.

## Cómo verlas (editor SQL de Supabase)

```sql
-- Preguntas con más opiniones
SELECT * FROM v_opiniones_por_pregunta ORDER BY alumnos DESC, ultima_opinion DESC LIMIT 50;

-- Conceptos de un tema
SELECT * FROM v_opiniones_por_concepto WHERE tema = 1 ORDER BY alumnos DESC;

-- Candidatas a cambiar de nivel (balance_nivel = más difícil − más fácil)
SELECT question_id, tema, nivel_actual, balance_nivel, notas
  FROM v_opiniones_por_pregunta WHERE abs(balance_nivel) >= 2 ORDER BY abs(balance_nivel) DESC;
```

Las vistas no son accesibles para alumnos ni anónimos. Marcha atrás: `44_opinion_probabilidad_nivel_down.sql`.
