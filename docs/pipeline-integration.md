# Integracion Pipeline Biblioteca Cognitiva -> bomberopro-mvp

## Contexto
El pipeline local (_BOMBEROPRO_PIPELINE/data_pipeline) ingiere test y temario desde Drive/PC y los estructura. Este documento es el contrato de datos para que esa salida entre en el repo sin romper nada.

## Salida esperada del pipeline (Fase Exportacion)

### 1. Preguntas: data/questions/questions.export.json
Array de objetos, un objeto por pregunta, campos obligatorios: id (string, hash o uuid estable), pregunta (string), opciones (array de 4 strings), respuesta_correcta (indice 0-3), explicacion (string), tema (string), dificultad (facil / media / dificil), fuente (documento u URL de origen), version_convocatoria (string), estado_qa (borrador_ia / validado_automatico / validado_humano), reportes (array, vacio al inicio).

### 2. Temario: data/temario/tema.md
Un archivo Markdown por tema, encabezado con fuente y fecha.

## Regla de commit
No se commitea nada del pipeline en si (scripts, venv, documentos originales), solo la salida ya procesada (questions.export.json y los .md de temario).

## Que falta implementar

| Paso | Descripcion |
| --- | --- |
| Validador | Rechaza el JSON si no cumple el esquema o si estado_qa no es un valor valido |
| Importador | Vuelca questions.export.json en el modelo de datos real de la app (types.ts pendiente de auditoria, issue 2) |
| Merge | Nunca directo a main: PR normal, dispara el workflow de review automatico |

## Bloqueado por
Cuota de Antigravity agotada hasta el 15/7/2026. El pipeline sigue en Fase 1 (Ingesta); faltan Fase 2 (Procesamiento con IA) y Fase 3 (Estructuracion).

Este documento es el contrato: el pipeline debe generar exactamente esto, el repo debe esperar exactamente esto. Cuando ambos lados existan, se conectan sin retrabajo.
