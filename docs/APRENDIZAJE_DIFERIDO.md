# Estados de aprendizaje y recuerdo diferido (fichas de recuerdo)

Adaptado del plan ATLAS V2 (§6), sin cambiar el planificador SM-2 actual. Todo es local y no se envía nada.

## Qué se guarda
- Registro de repasos en `mira_recall_registro_v1:<userId|demo>`, con un máximo de 5000 entradas. Cada entrada guarda el día, el mazo, la ficha, la nota, el **hueco** (días desde el repaso anterior de esa ficha; -1 si es el primero) y la **versión del planificador** (`sm2-3notas-v1`).
- La programación de las fichas no cambia: el registro solo se añade después de `recordRecallGrade`.

## Estados por ficha (`src/utils/recallLearning.ts`)
| Estado | Regla |
|---|---|
| NO_EVALUADO | nunca autoevaluada |
| REFORZAR | la última nota fue «No la sabía» |
| EN_PROGRESO | la última fue «Dudosa» y aún no tiene 2 recuerdos espaciados |
| COMPROBAR | la recordó una vez; falta confirmarla otro día |
| CONSOLIDADO | 2 o más recuerdos espaciados seguidos (en días distintos) y el último no fallado |

Repasar antes de tiempo o repetir la ficha el mismo día **no suma** evidencia. «Consolidado» es un estado de trabajo, no una garantía: se vuelve a comprobar en cada repaso.

## Recuerdo diferido
Es el % de repasos recordados cuando habían pasado ≥ 1 día o ≥ 7 días desde el repaso anterior. Los reintentos del mismo día (hueco 0) no entran. Se muestra en «Tu progreso» y se calcula solo con los mazos visibles para el alumno.

## Para el futuro (no hecho)
- El experimento de 7 y 14 días y la comparación con FSRS deben usar este registro. Antes de decidir nada, hacen falta varias semanas de datos reales.
- Enviar el registro al servidor necesita una tabla nueva (una migración nueva sin aplicar), el consentimiento del alumno y la decisión de José.
