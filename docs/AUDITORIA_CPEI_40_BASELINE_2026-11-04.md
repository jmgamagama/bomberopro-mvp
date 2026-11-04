# Línea base de inventario editorial CPEI-40 (04/11/2026)

**Alcance:** análisis estático **en lectura** de la rama `main` del repositorio. Este documento NO certifica cobertura editorial, vigencia de todas las fuentes, correspondencia con el contenido persistido en Supabase, permisos efectivos de acceso, estado de publicación ni la calidad del aprendizaje. Es el paso 1 del inventario acordado en #217.

## Fuentes internas examinadas
- [Taxonomía de 40 temas / transcripción del anexo I](../data/temario/cpei-badajoz-2026-anexo1.md) (referencia al BOP Badajoz nº 135, anuncio 2843/2026; contraste pendiente con publicación oficial original).
- [Registro de mazos y metadatos](../src/data/recallRegistry.ts): `DECK_SOURCES` tiene entradas `meta` con tema, lote y conteo declarados.
- [Lista de mazos con revisión completa declarada](../src/data/recallReview.ts): permiso editorial en registro; revisar la evidencia de cada mazo, no inferir QA a nivel tarjeta.
- [Índice generado de material por tema](../src/data/materialTemasIndice.ts): existencia de módulo; no implica desarrollo humano revisado.

## Resultados verificables solo de archivos
- **40/40** temas aparecen en el temario de referencia.
- **57** mazos de recuerdo registrados distribuidos en **37/40** temas. Faltan entradas de mazo para **T11, T18, T19**.
- **42/57** mazos tienen estado `revisado` en `MAZOS_REVISADOS`; **15** constan pendientes.
- **3442** fichas son la **suma de los conteos declarados en el registro**, de las cuales **2477** pertenecen a mazos declarados revisados; **no son fichas verificadas en tiempo real ni pruebas de cobertura**.
- **18/40** temas figuran en `TEMAS_CON_MATERIAL`. El resto puede tener otros recursos, pero no ese módulo.
- En T17 hay **14 fichas en un único mazo DEA** según `recallRegistry.ts`: es un subapartado, no todo el tema de Socorrismo.
- La UI `Temas` no es universal: invitado → `RecallHub`, autenticado → `StudyByTopic` (en `src/App.tsx`). No confundir ambos registros ni sumar fichas React con conceptos/preguntas de BD.

**Atención:** el total y la distribución pueden diferir de informes de octubre y noviembre porque estos son los metadatos de `main` leídos hoy. No trasladarlos a la landing ni afirmar «curso completo».

## Matriz por tema (evidencia de código, NO porcentaje de cobertura)

| Tema | Epígrafe (extracto del anexo) | Mazos registrados | Revisados (mazos) | Fichas declaradas | Índice material | Observación |
|---:|---|---:|---:|---:|---|---|
| 1 | La Constitucion Espanola de 1978: Titulo Preliminar. De los derechos y deberes fundamentales: d… | 1 | 1/1 | 129 | Sí | Solo existencia de recursos, no cobertura verificada |
| 2 | El Estatuto de Autonomia de Extremadura: Disposiciones generales. Derechos, deberes y principio… | 1 | 1/1 | 121 | Sí | Solo existencia de recursos, no cobertura verificada |
| 3 | Ley 7/1985, de 2 de abril, Reguladora de las Bases del Regimen Local: La Provincia; Organizacio… | 1 | 1/1 | 66 | Sí | Solo existencia de recursos, no cobertura verificada |
| 4 | La estructura organica de la Excma. Diputacion Provincial de Badajoz: Areas; Servicios; Patrona… | 1 | 1/1 | 28 | No | Solo existencia de recursos, no cobertura verificada |
| 5 | El organigrama del CPEI de Badajoz. El Reglamento de Regimen Interno del CPEI de Badajoz. | 1 | 0/1 | 28 | No | Mazos sin revisión completa registrada |
| 6 | Ley 31/1995, de 8 de noviembre, de Prevencion de Riesgos Laborales: Objeto, ambito de aplicacio… | 1 | 1/1 | 94 | Sí | Solo existencia de recursos, no cobertura verificada |
| 7 | Ley 8/2011, de 23 de marzo, de Igualdad entre Mujeres y Hombres y contra la Violencia de Género… | 1 | 1/1 | 64 | Sí | Solo existencia de recursos, no cobertura verificada |
| 8 | Teoria del fuego. Condiciones para que se produzca y se propague un fuego. Elementos del fuego.… | 1 | 1/1 | 25 | No | Solo existencia de recursos, no cobertura verificada |
| 9 | Hidraulica: concepto de fluido, densidad, caudal, presion estatica y presion dinamica. Hidrosta… | 1 | 0/1 | 84 | No | Mazos sin revisión completa registrada |
| 10 | El agua. Caracteristicas termicas del agua. Procedimientos de actuacion con agua. Potencia del … | 2 | 2/2 | 47 | Sí | Solo existencia de recursos, no cobertura verificada |
| 11 | Instalaciones de extincion con espuma. Caracteristicas de las espumas. Clases de espumogenos. E… | 0 | 0/0 | 0 | No | Sin mazo registrado (no implica ausencia de test en BD) |
| 12 | Mecanismos de extincion. Agentes Extintores. Extintores portatiles norma UNE-EN 3.7. Clasificac… | 2 | 2/2 | 44 | Sí | Solo existencia de recursos, no cobertura verificada |
| 13 | Equipos de proteccion individual para bomberos: normativa, caracteristicas, recomendaciones de … | 2 | 2/2 | 72 | Sí | Solo existencia de recursos, no cobertura verificada |
| 14 | Vehiculos contra incendios y de servicios auxiliares. Normativa de aplicacion y terminologia ge… | 1 | 1/1 | 24 | No | Solo existencia de recursos, no cobertura verificada |
| 15 | Material especifico de rescate. Escalera manual y telescopica. Equipos de deteccion y medicion:… | 1 | 0/1 | 92 | No | Mazos sin revisión completa registrada |
| 16 | Material de comunicaciones: walkie, emisora, tablet, movil rugerizado. Comunicaciones. Fundamen… | 2 | 2/2 | 69 | No | Solo existencia de recursos, no cobertura verificada |
| 17 | Socorrismo: Definicion. Normas generales de actuacion ante un accidente. Anatomia y fisiologia … | 1 | 1/1 | 14 | No | Solo DEA: NO tema completo |
| 18 | Incendios estructurales. Inicio, desarrollo y propagacion de un incendio. Riesgos para las pers… | 0 | 0/0 | 0 | No | Sin mazo registrado (no implica ausencia de test en BD) |
| 19 | Incendios industriales. Caracteristicas y tipologia de incendios industriales. Riesgos en los d… | 0 | 0/0 | 0 | No | Sin mazo registrado (no implica ausencia de test en BD) |
| 20 | Incendios forestales. Comportamiento del incendio forestal. Seguridad y prevencion de riesgos e… | 1 | 1/1 | 24 | Sí | Solo existencia de recursos, no cobertura verificada |
| 21 | Accidentes de trafico. Equipos y herramientas de excarcelacion. Actuacion del bombero en el lug… | 2 | 0/2 | 115 | No | Mazos sin revisión completa registrada |
| 22 | Tecnicas de rescate en altura y espacios confinados: normativa y marco legal de trabajos en alt… | 2 | 2/2 | 60 | Sí | Solo existencia de recursos, no cobertura verificada |
| 23 | Intervencion en inundaciones, rios y riadas: Definicion de crecida y los factores del proceso, … | 2 | 2/2 | 44 | No | Solo existencia de recursos, no cobertura verificada |
| 24 | Intervenciones con himenopteros: enjambre de abejas, enjambrazon, enjambres establecidos, la av… | 1 | 1/1 | 19 | No | Solo existencia de recursos, no cobertura verificada |
| 25 | Mercancias peligrosas. Conceptos. Normativa y clasificacion segun ADR. Identificacion y partes … | 2 | 0/2 | 115 | Sí | Mazos sin revisión completa registrada |
| 26 | Guias de INSARAG Volumen II: Preparacion y Respuesta Manual B: Operaciones. Maniobras de salvam… | 1 | 1/1 | 60 | No | Solo existencia de recursos, no cobertura verificada |
| 27 | Conceptos generales sobre edificios y construcciones. Elementos estructurales y no estructurale… | 2 | 2/2 | 52 | No | Solo existencia de recursos, no cobertura verificada |
| 28 | Electricidad: definiciones. Intensidad. Diferencia de potencial. Resistencia y conductividad el… | 2 | 2/2 | 103 | Sí | Solo existencia de recursos, no cobertura verificada |
| 29 | Plan Territorial de Proteccion civil en la CAEX. PLATERCAEX: Objetivo del plan. Alcance del pla… | 1 | 1/1 | 81 | Sí | Solo existencia de recursos, no cobertura verificada |
| 30 | Planes Especiales de Proteccion civil en la CAEX. INUNCAEX, TRANSCAEX, RADIOCAEX y PLASISMEX: D… | 1 | 1/1 | 87 | Sí | Solo existencia de recursos, no cobertura verificada |
| 31 | Real Decreto 1215/1997, de 18 de julio, por el que se establecen las disposiciones minimas de s… | 1 | 1/1 | 83 | Sí | Solo existencia de recursos, no cobertura verificada |
| 32 | Real Decreto 314/2006, de 17 de marzo, por el que se aprueba el Codigo Tecnico de la Edificacio… | 1 | 1/1 | 91 | Sí | Solo existencia de recursos, no cobertura verificada |
| 33 | Real Decreto 513/2017, de 22 de mayo, por el que se aprueba el Reglamento de instalaciones de p… | 2 | 2/2 | 97 | Sí | Solo existencia de recursos, no cobertura verificada |
| 34 | Real Decreto 164/2025, de 4 de marzo, por el que se aprueba el Reglamento de seguridad contra i… | 3 | 3/3 | 132 | Sí | Solo existencia de recursos, no cobertura verificada |
| 35 | Red de carreteras de la region de Extremadura (carreteras de la provincia de Badajoz). Fuente: … | 1 | 1/1 | 150 | No | Solo existencia de recursos, no cobertura verificada |
| 36 | El territorio de la provincia de Badajoz: municipios: denominacion, ubicacion y limites adminis… | 8 | 0/8 | 531 | No | Mazos sin revisión completa registrada |
| 37 | Plan de prevencion del CPEI-Badajoz. Mapa descargable. — peso alto en el examen (incluido en el… | 1 | 1/1 | 37 | No | Solo existencia de recursos, no cobertura verificada |
| 38 | Instrucciones Tecnicas de Funcionamiento del CPEI-Badajoz (ITF). ITF Horario de actividades. IT… | 1 | 1/1 | 198 | No | Solo existencia de recursos, no cobertura verificada |
| 39 | Sistematicas y Protocolos. Protocolo de movilizacion del CPEI. Protocolo de Radiocomunicaciones… | 1 | 1/1 | 149 | No | Solo existencia de recursos, no cobertura verificada |
| 40 | Procedimientos de trabajo CPEI-Badajoz. Procedimiento de conduccion del CPEI-Badajoz. Procedimi… | 1 | 1/1 | 213 | No | Solo existencia de recursos, no cobertura verificada |

## Prioridad operativa propuesta
**P0 Seguridad/piloto:** aislar Preview→staging (#118), completar correo/recuperación y flujos de guardado, probar control de respuestas (#111) y visibilidad de fichas pendientes (#112). Sin estos gates no utilizar la beta para experimentar.

**P1 Inventario real de la base de datos:** consultar por tema y epígrafe, en modo lectura y con permiso restringido, `topics`, desarrollo, conceptos, preguntas, estados editoriales, vínculos y procedencia; reconciliar con este listado, con consultas RLS y claves correctas. No deducir números ni inventar tablas desde este archivo. **Requiere auditoría del esquema real.**

**P1 Epígrafes y cobertura:** descomponer el anexo I en epígrafes verificables, cotejar con versión de texto oficial, asociar evidencia por epígrafe, revisión humana y decisión; agregar cobertura con denominador conocido y separar `pendiente`, `parcial`, `completo validado` y `no aplica`.

**P1 Normalizar experiencia del tema:** una sola entrada de navegación para invitado y usuario, misma taxonomía y títulos, acceso condicionado por permisos, vínculo directo a explicación, test, tarjetas y fuentes aprobadas; sin afectar el progreso.

**P2 Producción editorial:** cerrar primero los vacíos absolutos de evidencia (T11, T18, T19 en registro de fichas, sin inferir inexistencia en BD), concentraciones parciales (T17), luego pendientes de revisión y materiales sin desarrollo. Los temas 35–40 exigen atención por ponderación del examen y contenido interno; no publicar sin fuente primaria permitida.

## Definición de terminado del inventario completo
- Cada uno de los 40 temas tiene epígrafes referenciados exactamente a las bases originales y confirmados.
- Cada epígrafe tiene registros de contenido, estado QA, fuente/versiones, preguntas, tarjetas y vínculos obtenidos de fuentes auténticas (BD/repositorio).
- Los recuentos de pruebas/test, conceptos y vínculos se han reconciliado con Supabase, sin mezclar recursos de distinta naturaleza.
- Un revisor humano valida discrepancias y cobertura. Solo entonces se publican porcentajes y prioridades definitivas.
- La matriz se puede regenerar tras cambios, con fecha, commit, y evidencia; cero contenido pendiente expuesto a usuarios.

**Control:** este fichero es un inventario preliminar, no habilita despliegues, migraciones, publicación de temario ni incorporación de nuevas convocatorias.
