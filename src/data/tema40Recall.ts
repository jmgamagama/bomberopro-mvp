/** Tema 40 recall cards — local subset (213 = 26 PT01 + 187 PT03 oficial). Do not load all 9392. */

export type Tema40RecallCard = {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
};

export const TEMA40_RECALL_META = {
  "tema": 40,
  "title": "Tema 40 · Procedimientos de trabajo CPEI-Badajoz",
  "count": 213,
  "source": "PT01 conducción (26) + PT03 amianto oficial (187)"
} as const;

export const TEMA40_RECALL_CARDS: Tema40RecallCard[] = [
  {
    "id": "CPEI-T40-S02-73E3A31F9F",
    "orden": 10,
    "concepto": "¿Qué debe hacer el conductor al inicio de la guardia?",
    "respuesta": "Revisar el vehículo conforme a fabricante/procedimiento y ajustar puesto, espejos y condiciones de cabina; comprobar puertas, cinturones, iluminación y ubicación del personal.",
    "fuente": "PT01 Procedimiento de trabajo: conducción de vehículos CPEI, edición 1",
    "localizacion": "página 8",
    "apartado": "PT01 conducción"
  },
  {
    "id": "CPEI-T40-S02-5B22DBBEAD",
    "orden": 20,
    "concepto": "¿Qué debe hacer inmediatamente quien pierde la habilitación para conducir?",
    "respuesta": "Informar al superior jerárquico y al CPEI y abstenerse de conducir.",
    "fuente": "PT01 Procedimiento de trabajo: conducción de vehículos CPEI, edición 1",
    "localizacion": "página 8",
    "apartado": "PT01 conducción"
  },
  {
    "id": "CPEI-T40-S02-65D31869B5",
    "orden": 30,
    "concepto": "¿Qué comprobación física precede a todo trayecto?",
    "respuesta": "Rodear a pie el perímetro del vehículo para comprobar que todo está dispuesto para salir.",
    "fuente": "PT01 Procedimiento de trabajo: conducción de vehículos CPEI, edición 1",
    "localizacion": "página 9",
    "apartado": "PT01 conducción"
  },
  {
    "id": "CPEI-T40-S02-F53EDDF202",
    "orden": 40,
    "concepto": "¿Qué elementos deben quedar cerrados o recogidos antes de la marcha?",
    "respuesta": "Armarios, persianas, cofres, portones, estribos, mástil telescópico y cierres de escalas; también deben desconectarse escape de gases y conexiones de arranque rápido.",
    "fuente": "PT01 Procedimiento de trabajo: conducción de vehículos CPEI, edición 1",
    "localizacion": "página 9",
    "apartado": "PT01 conducción"
  },
  {
    "id": "CPEI-T40-S02-038F212FDA",
    "orden": 50,
    "concepto": "¿Qué información mínima se recaba antes de salir?",
    "respuesta": "Localización precisa, tipo y magnitud, personas afectadas/posibles víctimas y ruta confirmada.",
    "fuente": "PT01 Procedimiento de trabajo: conducción de vehículos CPEI, edición 1",
    "localizacion": "páginas 9–10",
    "apartado": "PT01 conducción"
  },
  {
    "id": "CPEI-T40-S02-B70727E8F1",
    "orden": 60,
    "concepto": "¿Cómo se ordena un convoy?",
    "respuesta": "Los vehículos más ligeros y menos voluminosos delante; los demás según volumen, maniobrabilidad y velocidad, manteniendo distancia de seguridad.",
    "fuente": "PT01 Procedimiento de trabajo: conducción de vehículos CPEI, edición 1",
    "localizacion": "página 10",
    "apartado": "PT01 conducción"
  },
  {
    "id": "CPEI-T40-S03-AC6F43A8FE",
    "orden": 70,
    "concepto": "¿Puede el conductor usar casco o guantes de intervención durante el desplazamiento?",
    "respuesta": "Como norma general no: el casco añade riesgos y los guantes de intervención no deben usarse para conducir.",
    "fuente": "PT01 Procedimiento de trabajo: conducción de vehículos CPEI, edición 1",
    "localizacion": "página 11",
    "apartado": "PT01 conducción"
  },
  {
    "id": "CPEI-T40-S03-73133217A0",
    "orden": 80,
    "concepto": "¿Cómo se usan comunicaciones durante la marcha?",
    "respuesta": "Solo sistemas manos libres; radio o walkie los maneja el copiloto o, si no existe, se detiene el vehículo.",
    "fuente": "PT01 Procedimiento de trabajo: conducción de vehículos CPEI, edición 1",
    "localizacion": "página 11",
    "apartado": "PT01 conducción"
  },
  {
    "id": "CPEI-T40-S03-4C70FFDCA2",
    "orden": 90,
    "concepto": "¿De qué factores depende la velocidad adecuada?",
    "respuesta": "Estado de la vía, meteorología, diseño/estado del vehículo y destreza/conocimiento del conductor.",
    "fuente": "PT01 Procedimiento de trabajo: conducción de vehículos CPEI, edición 1",
    "localizacion": "página 12",
    "apartado": "PT01 conducción"
  },
  {
    "id": "CPEI-T40-S03-3E7CC2E438",
    "orden": 100,
    "concepto": "¿Qué precaución se adopta con ERA?",
    "respuesta": "Colocarlos preferentemente cuando el vehículo esté detenido.",
    "fuente": "PT01 Procedimiento de trabajo: conducción de vehículos CPEI, edición 1",
    "localizacion": "página 12",
    "apartado": "PT01 conducción"
  },
  {
    "id": "CPEI-T40-S03-13176DA172",
    "orden": 110,
    "concepto": "¿Qué señal óptica identifica al vehículo prioritario en servicio urgente?",
    "respuesta": "La señal V1, usada simultáneamente con el emisor de señales acústicas especiales cuando proceda.",
    "fuente": "PT01 Procedimiento de trabajo: conducción de vehículos CPEI, edición 1",
    "localizacion": "página 12",
    "apartado": "PT01 conducción"
  },
  {
    "id": "CPEI-T40-S03-2BF63AA0A6",
    "orden": 120,
    "concepto": "¿Quién decide usar la sirena?",
    "respuesta": "El conductor, valorando distancia, importancia, hora y zonas sensibles como hospitales.",
    "fuente": "PT01 Procedimiento de trabajo: conducción de vehículos CPEI, edición 1",
    "localizacion": "página 13",
    "apartado": "PT01 conducción"
  },
  {
    "id": "CPEI-T40-S03-2EA7B9D8C2",
    "orden": 130,
    "concepto": "¿Qué condición limita el derecho de prioridad?",
    "respuesta": "Solo se ejerce cuando es compatible con la seguridad propia y de terceros, bajo responsabilidad del conductor y sin poner en peligro a usuarios.",
    "fuente": "PT01 Procedimiento de trabajo: conducción de vehículos CPEI, edición 1",
    "localizacion": "páginas 13–14",
    "apartado": "PT01 conducción"
  },
  {
    "id": "CPEI-T40-S03-0511FD4414",
    "orden": 140,
    "concepto": "¿Cómo circular en vía de varios carriles con tráfico denso?",
    "respuesta": "Preferentemente por carriles centrales, evitando cambios reiterados; se desaconseja el arcén.",
    "fuente": "PT01 Procedimiento de trabajo: conducción de vehículos CPEI, edición 1",
    "localizacion": "página 14",
    "apartado": "PT01 conducción"
  },
  {
    "id": "CPEI-T40-S04-B03E471AE7",
    "orden": 150,
    "concepto": "¿Qué criterio general rige el estacionamiento?",
    "respuesta": "Ser visible/previsible, seguro, dinámico y ajustado a la evolución, evitando crear un nuevo peligro u obstáculo innecesario.",
    "fuente": "PT01 Procedimiento de trabajo: conducción de vehículos CPEI, edición 1",
    "localizacion": "página 15",
    "apartado": "PT01 conducción"
  },
  {
    "id": "CPEI-T40-S04-3CCAAFEF58",
    "orden": 160,
    "concepto": "¿Cómo se desciende con circulación en movimiento?",
    "respuesta": "Con el vehículo detenido, por el lado derecho cuando sea posible, y aplicando siempre el freno de estacionamiento antes de abandonar el puesto.",
    "fuente": "PT01 Procedimiento de trabajo: conducción de vehículos CPEI, edición 1",
    "localizacion": "página 16",
    "apartado": "PT01 conducción"
  },
  {
    "id": "CPEI-T40-S04-81B76DEFE0",
    "orden": 170,
    "concepto": "¿Cómo se colocan los conos?",
    "respuesta": "Desde el cono más alejado, por el interior de la línea entre conos y arcén, controlando visualmente el tráfico que se aproxima.",
    "fuente": "PT01 Procedimiento de trabajo: conducción de vehículos CPEI, edición 1",
    "localizacion": "página 16",
    "apartado": "PT01 conducción"
  },
  {
    "id": "CPEI-T40-S04-DC6E66312E",
    "orden": 180,
    "concepto": "¿Quién debe señalizar una carretera y qué se hace si no está?",
    "respuesta": "La responsabilidad corresponde a Fuerzas y Cuerpos de Seguridad; si no están, se solicita su presencia al 112 y el mando fija provisionalmente la posición segura.",
    "fuente": "PT01 Procedimiento de trabajo: conducción de vehículos CPEI, edición 1",
    "localizacion": "página 17",
    "apartado": "PT01 conducción"
  },
  {
    "id": "CPEI-T40-S04-6B18CFA4FF",
    "orden": 190,
    "concepto": "¿Qué regla rige estacionar en pendiente?",
    "respuesta": "Evitar quedar aguas abajo en la dirección de la pendiente; si es necesario, parar motor, bloquear transmisión, freno de estacionamiento y calzos.",
    "fuente": "PT01 Procedimiento de trabajo: conducción de vehículos CPEI, edición 1",
    "localizacion": "página 17",
    "apartado": "PT01 conducción"
  },
  {
    "id": "CPEI-T40-S04-02AAF1C65E",
    "orden": 200,
    "concepto": "¿Qué apoyo exige una marcha atrás con puntos muertos u obstáculos?",
    "respuesta": "Un miembro de la dotación guía desde el exterior y el conductor verifica que no haya nadie alrededor antes de maniobrar.",
    "fuente": "PT01 Procedimiento de trabajo: conducción de vehículos CPEI, edición 1",
    "localizacion": "página 17",
    "apartado": "PT01 conducción"
  },
  {
    "id": "CPEI-T40-S04-6D0F5ED7DE",
    "orden": 210,
    "concepto": "¿Qué confirmación verbal precede a la maniobra?",
    "respuesta": "El receptor responde «RECIBIDO»; en zonas estrechas añade que el bombero está fuera del radio de acción. Sin comunicación no se cambia de dirección.",
    "fuente": "PT01 Procedimiento de trabajo: conducción de vehículos CPEI, edición 1",
    "localizacion": "página 18",
    "apartado": "PT01 conducción"
  },
  {
    "id": "CPEI-T40-S04-BF2DA60BBD",
    "orden": 220,
    "concepto": "¿Cómo se posiciona el vehículo en incendio?",
    "respuesta": "Valorando el viento, activando recirculación si funciona el aire acondicionado, cerrando rejillas si no funciona y manteniendo cofres cerrados.",
    "fuente": "PT01 Procedimiento de trabajo: conducción de vehículos CPEI, edición 1",
    "localizacion": "página 18",
    "apartado": "PT01 conducción"
  },
  {
    "id": "CPEI-T40-S04-3D7F341B54",
    "orden": 230,
    "concepto": "¿Dónde no se posiciona un vehículo?",
    "respuesta": "En lugares expuestos a escape de gas, nube tóxica, derrumbe, llamas, alta carga térmica u otros daños directos previsibles.",
    "fuente": "PT01 Procedimiento de trabajo: conducción de vehículos CPEI, edición 1",
    "localizacion": "página 19",
    "apartado": "PT01 conducción"
  },
  {
    "id": "CPEI-T40-S05-4952D3AC3A",
    "orden": 240,
    "concepto": "¿Qué se evalúa antes de transitar terreno no consistente?",
    "respuesta": "Tracción disponible, riesgo de atrapamiento, características del vehículo y técnicas/relaciones de marcha adecuadas.",
    "fuente": "PT01 Procedimiento de trabajo: conducción de vehículos CPEI, edición 1",
    "localizacion": "página 19",
    "apartado": "PT01 conducción"
  },
  {
    "id": "CPEI-T40-S05-A109624737",
    "orden": 250,
    "concepto": "¿Cuándo se cruza un cauce desconocido?",
    "respuesta": "Solo por necesidad manifiesta, tras adaptar conducción, comprobar obstáculos y evitar corrientes fuertes; al salir se prueban frenos.",
    "fuente": "PT01 Procedimiento de trabajo: conducción de vehículos CPEI, edición 1",
    "localizacion": "página 20",
    "apartado": "PT01 conducción"
  },
  {
    "id": "CPEI-T40-S05-3C92382DA4",
    "orden": 260,
    "concepto": "¿Qué regla rige el enganche de remolques?",
    "respuesta": "Formación y compatibilidad previas; visibilidad, inmovilización con freno/calzos/apuntalamiento, conexiones en orden del fabricante, sistemas de seguridad y prueba lenta del acople.",
    "fuente": "PT01 Procedimiento de trabajo: conducción de vehículos CPEI, edición 1",
    "localizacion": "página 20",
    "apartado": "PT01 conducción"
  },
  {
    "id": "CPEI-T40-PT03-001",
    "orden": 270,
    "concepto": "¿En aplicación de qué real decreto se elabora el PT03 y qué regula esa norma?",
    "respuesta": "El RD 396/2006, por el que se establecen las disposiciones mínimas de seguridad y salud aplicables a los trabajos con riesgo de exposición al amianto.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 9 (Hoja 2)",
    "apartado": "PT03 amianto · 1. Antecedente y objeto"
  },
  {
    "id": "CPEI-T40-PT03-002",
    "orden": 280,
    "concepto": "¿Qué significa la abreviatura MCA en el PT03?",
    "respuesta": "Materiales con contenido en amianto.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 9 (Hoja 2)",
    "apartado": "PT03 amianto · 1. Antecedente y objeto"
  },
  {
    "id": "CPEI-T40-PT03-003",
    "orden": 290,
    "concepto": "Además de los incendios, ¿en qué otras intervenciones de bomberos puede darse exposición al amianto?",
    "respuesta": "En los rescates por derrumbamientos o en las asistencias técnicas, por ejemplo.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 9 (Hoja 2)",
    "apartado": "PT03 amianto · 1. Antecedente y objeto"
  },
  {
    "id": "CPEI-T40-PT03-004",
    "orden": 300,
    "concepto": "¿Qué artículo del RD 396/2006 recoge la necesidad de elaborar un plan de trabajo específico y qué se describe en él?",
    "respuesta": "El artículo 11. En el plan se describen las actividades a realizar, las medidas que se van a seguir, los procedimientos para la evaluación y el control del ambiente de trabajo, y la fecha de inicio y de duración de los trabajos, entre otros aspectos.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 9 (Hoja 2)",
    "apartado": "PT03 amianto · 1. Antecedente y objeto"
  },
  {
    "id": "CPEI-T40-PT03-005",
    "orden": 310,
    "concepto": "¿Qué artículo del RD 396/2006 recoge la tramitación de los planes de trabajo, ante quién se presentan y cuánto puede durar ese trámite?",
    "respuesta": "El artículo 12. Se presentan ante la Autoridad Laboral para que los apruebe; el procedimiento puede durar hasta 45 días.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 9 (Hoja 2)",
    "apartado": "PT03 amianto · 1. Antecedente y objeto"
  },
  {
    "id": "CPEI-T40-PT03-006",
    "orden": 320,
    "concepto": "¿Por qué es inviable realizar los trámites de plan de trabajo en los servicios de extinción de incendios y salvamento?",
    "respuesta": "Debido a la imprevisibilidad de las intervenciones que deben realizar los bomberos y a la necesidad de actuar en situaciones de emergencia vital.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 10 (Hoja 3)",
    "apartado": "PT03 amianto · 1. Antecedente y objeto"
  },
  {
    "id": "CPEI-T40-PT03-007",
    "orden": 330,
    "concepto": "¿Qué establece el artículo 5 del RD 396/2006 y por qué no se aplica en las intervenciones de bomberos?",
    "respuesta": "La necesidad de realizar una medición de la concentración de fibras de amianto en el lugar de trabajo a la hora de evaluar los riesgos, y su comparación con el valor límite de exposición recogido en el artículo 4. No es viable realizar estas mediciones previas en las intervenciones que realizan los bomberos.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 10 (Hoja 3)",
    "apartado": "PT03 amianto · 1. Antecedente y objeto"
  },
  {
    "id": "CPEI-T40-PT03-008",
    "orden": 340,
    "concepto": "¿Cuál es el objeto del documento PT03?",
    "respuesta": "Establecer las situaciones más frecuentes en las que se pueden presentar operaciones que pueden generar fibras de amianto respirables y las normas de trabajo básicas y seguras para los efectivos del Consorcio que intervengan en la extinción de un incendio o durante tareas de rescate y/o asistencia técnica, formando parte del Plan de trabajo único según el Real Decreto 396/2006.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 10 (Hoja 3)",
    "apartado": "PT03 amianto · 1. Antecedente y objeto"
  },
  {
    "id": "CPEI-T40-PT03-009",
    "orden": 350,
    "concepto": "¿Cuándo se entiende que existe exposición a amianto durante una intervención?",
    "respuesta": "Cuando durante la actuación se requiera la manipulación (rotura) de materiales que lo contengan, bien para facilitar el acceso a zona de extinción o rescate, o porque se genere la demolición/derrumbe de construcciones donde existan estructuras/aislamientos con contenido de amianto.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 10 (Hoja 3)",
    "apartado": "PT03 amianto · 1. Antecedente y objeto"
  },
  {
    "id": "CPEI-T40-PT03-010",
    "orden": 360,
    "concepto": "¿Qué ejemplos de material con amianto friable y no friable cita el PT03?",
    "respuesta": "Friable: amianto proyectado, calorifugados, paneles aislantes, etc. No friable: fibrocemento, amianto-vinilo, etc.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 10 (Hoja 3)",
    "apartado": "PT03 amianto · 1. Antecedente y objeto"
  },
  {
    "id": "CPEI-T40-PT03-011",
    "orden": 370,
    "concepto": "¿Qué dos circunstancias tiene en cuenta el CPEI para optar por normas de actuación precisas ante posible exposición a amianto?",
    "respuesta": "1) La escasa frecuencia. 2) La imposibilidad de ejecutar acciones previas de programación de planes de trabajo, mediciones, etc., debido a los requerimientos de actuación inmediata y no programada con antelación de cualquier intervención del CPEI.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF págs. 10–11 (Hojas 3–4)",
    "apartado": "PT03 amianto · 1. Antecedente y objeto"
  },
  {
    "id": "CPEI-T40-PT03-012",
    "orden": 380,
    "concepto": "¿Qué datos de los partes de intervención SOS cita el PT03 para justificar la escasa frecuencia?",
    "respuesta": "En los 3 últimos años (el PDF escribe «2019-2021-2021»), 133 intervenciones con derrumbe o retirada de material: 1 intervención en la que se especifica retirar uralitas desprendidas y 2 en las que se retiran canalones, sin especificar el material.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 11 (Hoja 4)",
    "apartado": "PT03 amianto · 1. Antecedente y objeto"
  },
  {
    "id": "CPEI-T40-PT03-013",
    "orden": 390,
    "concepto": "¿Cuál es la frecuencia estimada de posible intervención con material friable en todo el CPEI?",
    "respuesta": "Menor de 1 actuación al año en todo el CPEI.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 11 (Hoja 4)",
    "apartado": "PT03 amianto · 1. Antecedente y objeto"
  },
  {
    "id": "CPEI-T40-PT03-014",
    "orden": 400,
    "concepto": "¿A qué personal afecta el alcance del PT03?",
    "respuesta": "A todo el personal operativo del Consorcio: Oficial, Suboficial, Sargentos, Jefes de Parque, Cabos y Bomberos, que prestan sus servicios en los distintos centros de trabajo del Consorcio.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 11 (Hoja 4)",
    "apartado": "PT03 amianto · 2. Alcance"
  },
  {
    "id": "CPEI-T40-PT03-015",
    "orden": 410,
    "concepto": "¿En qué intervenciones es de aplicación el PT03?",
    "respuesta": "En aquellas donde se realicen trabajos que requieran manipulación de material con contenido de amianto, en las que el integrante del CPEI deba realizar alguna modificación de su estructura (rotura), o en intervenciones donde se genere desplome o derrumbamiento de estructuras/elementos que contengan material con contenido de amianto.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 11 (Hoja 4)",
    "apartado": "PT03 amianto · 2. Alcance"
  },
  {
    "id": "CPEI-T40-PT03-016",
    "orden": 420,
    "concepto": "¿Con la revisión de quién y tras informar a qué órgano se implantan las normas de actuación del PT03, y quién debe darles publicidad?",
    "respuesta": "Con la revisión y visto bueno del Servicio de Prevención del CPEI e informado el Comité de Seguridad y Salud. El Consorcio deberá darle publicidad por los medios oficiales disponibles.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 11 (Hoja 4)",
    "apartado": "PT03 amianto · 2. Alcance"
  },
  {
    "id": "CPEI-T40-PT03-017",
    "orden": 430,
    "concepto": "¿Quiénes velarán por el cumplimiento del PT03 y de qué deben asegurarse?",
    "respuesta": "Los responsables de las diversas áreas funcionales del CPEI; deben asegurarse de que todo el personal afectado lo conoce perfectamente, y del seguimiento y análisis de los casos que se originen, con el fin de mejorar las normas de actuación en caso de ser necesario.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 11 (Hoja 4)",
    "apartado": "PT03 amianto · 3. Responsabilidades"
  },
  {
    "id": "CPEI-T40-PT03-018",
    "orden": 440,
    "concepto": "¿Qué funciones y responsabilidades en prevención de riesgos laborales se asumen en el PT03?",
    "respuesta": "Las marcadas en el Plan de Prevención vigente del CPEI, apartado 2.9. Organigrama preventivo.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 12 (Hoja 5)",
    "apartado": "PT03 amianto · 3. Responsabilidades"
  },
  {
    "id": "CPEI-T40-PT03-019",
    "orden": 450,
    "concepto": "¿En qué norma se enmarca el PT03 y con qué documentos del CPEI debe ser coherente?",
    "respuesta": "Se enmarca en la aplicación del RD 396/2006 y será coherente con el Protocolo de movilización vigente del CPEI-Badajoz, sus normas de trabajo y todos aquellos que le fueran de aplicación, así como con el Plan de Prevención vigente del CPEI-Badajoz.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 12 (Hoja 5)",
    "apartado": "PT03 amianto · 4. Normativa"
  },
  {
    "id": "CPEI-T40-PT03-020",
    "orden": 460,
    "concepto": "¿Cómo define el PT03 el amianto?",
    "respuesta": "Un conjunto de minerales (silicatos de composición variable) de naturaleza fibrosa cuyas excepcionales propiedades químicas (resistencia, aislamiento térmico, acústico y eléctrico…) han determinado su uso en infinidad de aplicaciones industriales y domésticas.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 12 (Hoja 5)",
    "apartado": "PT03 amianto · 5. Riesgos"
  },
  {
    "id": "CPEI-T40-PT03-021",
    "orden": 470,
    "concepto": "¿Qué son las fibras y por qué las de amianto pueden alcanzar los alvéolos pulmonares?",
    "respuesta": "Las fibras son partículas elongadas cuya longitud es varias veces superior al diámetro. Las de amianto pueden presentar tamaño microscópico (invisibles): son fibras respirables, con posibilidad de alcanzar hasta los alvéolos pulmonares.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 12 (Hoja 5)",
    "apartado": "PT03 amianto · 5. Riesgos"
  },
  {
    "id": "CPEI-T40-PT03-022",
    "orden": 480,
    "concepto": "¿De qué dos formas puede encontrarse el amianto en las instalaciones?",
    "respuesta": "En estado puro (sin mezclar, como calorifugados, flocages…) o formando parte de productos (fibrocemento, amianto-vinilo…).",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 12 (Hoja 5)",
    "apartado": "PT03 amianto · 5. Riesgos"
  },
  {
    "id": "CPEI-T40-PT03-023",
    "orden": 490,
    "concepto": "¿Qué instalaciones y equipos pueden contener amianto según el PT03? (10 elementos)",
    "respuesta": "1) Paneles de aislamiento en tabiques. 2) Baldosas y suelos de linóleo. 3) Aislamiento térmico (calorifugado en calderas, conducciones, etc.). 4) Aislamiento de estructuras metálicas (flocages). 5) Placas de falsos techos. 6) Instalaciones eléctricas. 7) Calderas, hornos y demás equipos que trabajan a altas temperaturas. 8) Tejados, tabiques pluviales, bajantes, jardineras, depósitos y otros elementos de fibrocemento. 9) Conducciones de agua corriente y aguas residuales. 10) Válvulas y juntas.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF págs. 12–13 (Hojas 5–6)",
    "apartado": "PT03 amianto · 5. Riesgos"
  },
  {
    "id": "CPEI-T40-PT03-024",
    "orden": 500,
    "concepto": "¿Qué nombre recibe en el PT03 el aislamiento de estructuras metálicas con amianto?",
    "respuesta": "Flocages.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 12 (Hoja 5)",
    "apartado": "PT03 amianto · 5. Riesgos"
  },
  {
    "id": "CPEI-T40-PT03-025",
    "orden": 510,
    "concepto": "¿Cuándo resulta peligroso el amianto?",
    "respuesta": "Si las fibras de amianto se liberan, pueden ser inhaladas, depositándose en los pulmones y causando enfermedades, incluso tras un largo periodo de latencia.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 13 (Hoja 6)",
    "apartado": "PT03 amianto · 5. Riesgos › ¿Cuándo resulta peligroso?"
  },
  {
    "id": "CPEI-T40-PT03-026",
    "orden": 520,
    "concepto": "¿De qué depende, entre otros factores, la liberación de fibras de amianto?",
    "respuesta": "Del tipo de material trabajado y de las operaciones efectuadas sobre el mismo.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 13 (Hoja 6)",
    "apartado": "PT03 amianto · 5. Riesgos › ¿Cuándo resulta peligroso?"
  },
  {
    "id": "CPEI-T40-PT03-027",
    "orden": 530,
    "concepto": "¿Por qué las operaciones con calorifugados o flocage son más peligrosas que las realizadas con fibrocemento o amianto-vinilo?",
    "respuesta": "Porque calorifugados y flocage son materiales friables, con gran capacidad de emitir fibras al ambiente. En el fibrocemento o el amianto-vinilo las fibras están ligadas a otros componentes (no friables) y difícilmente emiten fibras, salvo cuando se someten a corte, pulido, rotura u otras operaciones que faciliten la dispersión de polvo.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 13 (Hoja 6)",
    "apartado": "PT03 amianto · 5. Riesgos › ¿Cuándo resulta peligroso?"
  },
  {
    "id": "CPEI-T40-PT03-028",
    "orden": 540,
    "concepto": "¿En qué categoría de carcinógenos están todas las variedades de amianto y qué implica?",
    "respuesta": "Carcinógenas de categoría 1A: se ha constatado que provocan cáncer en el ser humano (de pulmón o pleura). Por ello cualquier exposición, por corta y reducida que sea, conlleva un riesgo para la salud.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 13 (Hoja 6)",
    "apartado": "PT03 amianto · 5. Riesgos › Riesgos potenciales para la salud"
  },
  {
    "id": "CPEI-T40-PT03-029",
    "orden": 550,
    "concepto": "¿Cuál es el tiempo de latencia del mesotelioma pleural según el PT03?",
    "respuesta": "Largo: entre 35 y 40 años.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 13 (Hoja 6)",
    "apartado": "PT03 amianto · 5. Riesgos › Riesgos potenciales para la salud"
  },
  {
    "id": "CPEI-T40-PT03-030",
    "orden": 560,
    "concepto": "¿Qué enfermedad pueden desarrollar los trabajadores con exposiciones elevadas y prolongadas al amianto y en qué consiste?",
    "respuesta": "Una neumoconiosis específica, la asbestosis, que se traduce en una cicatrización del tejido pulmonar y en consecuencia en una pérdida de la capacidad respiratoria.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 13 (Hoja 6)",
    "apartado": "PT03 amianto · 5. Riesgos › Riesgos potenciales para la salud"
  },
  {
    "id": "CPEI-T40-PT03-031",
    "orden": 570,
    "concepto": "Si el amianto es muy resistente al calor y al fuego, ¿por qué un incendio puede liberar sus fibras?",
    "respuesta": "Porque en un incendio se alcanzan temperaturas muy altas que pueden propiciar la desintegración de los MCA. Además, por incendios, terremotos o deterioro, las estructuras colapsan y los derrumbamientos conllevan desprendimiento de fibras por la rotura de los MCA.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF págs. 13–14 (Hojas 6–7)",
    "apartado": "PT03 amianto · 5. Riesgos › Riesgos potenciales para la salud"
  },
  {
    "id": "CPEI-T40-PT03-032",
    "orden": 580,
    "concepto": "¿Qué puede ocurrir con las fibras de amianto liberadas a la atmósfera durante una intervención?",
    "respuesta": "Pueden ser inhaladas por los bomberos o quedar suspendidas en los trajes de intervención, y posteriormente desprenderse de nuevo a la atmósfera, vehículos, etc.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 14 (Hoja 7)",
    "apartado": "PT03 amianto · 5. Riesgos"
  },
  {
    "id": "CPEI-T40-PT03-033",
    "orden": 590,
    "concepto": "En rescates de víctimas sepultadas o acorraladas por escombros, ¿en qué consiste el riesgo de amianto?",
    "respuesta": "En que, si la edificación o instalación contenía MCA, estos han podido fragmentarse y estar esparcidos entre los escombros: peligro de inhalación de las fibras que han pasado a la atmósfera, o de manipulación directa del amianto como parte de los escombros a retirar, o por impregnación de los trajes de intervención y demás equipos.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 14 (Hoja 7)",
    "apartado": "PT03 amianto · 5. Riesgos"
  },
  {
    "id": "CPEI-T40-PT03-034",
    "orden": 600,
    "concepto": "¿Qué retiradas quedan excluidas en las tareas de intervención/rescate y qué no forma parte de la actividad del CPEI?",
    "respuesta": "Queda excluida cualquier retirada de elementos no imprescindibles para el acceso a la víctima o el desplazamiento durante la intervención. No está incluida en la actividad del CPEI la retirada y gestión de residuos procedentes de la instalación donde se intervenga.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 14 (Hoja 7)",
    "apartado": "PT03 amianto · 5. Riesgos"
  },
  {
    "id": "CPEI-T40-PT03-035",
    "orden": 610,
    "concepto": "¿Qué cinco riesgos específicos recoge la evaluación previa del PT03?",
    "respuesta": "1) Exposición a materiales friables a causa del incendio cuando en su estado inicial son no friables (material que pueda sufrir roturas, voluntarias o fortuitas por derrumbamiento). 2) Posible exposición a agentes químicos en el entorno, en trabajos en presencia de materiales con amianto, polvo de estructuras dañadas. 3) Posible manipulación de material con amianto en trabajos en presencia de materiales con amianto, polvo de derribo y otras causas. 4) Posible utilización de EPI inadecuados al tipo de intervención (presencia de fibra de amianto). 5) Posible manipulación de equipos de trabajo, EPI y vestuario contaminado con fibras de amianto de forma inadecuada.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF págs. 14–15 (Hojas 7–8)",
    "apartado": "PT03 amianto · 5. Riesgos › Tabla de riesgos"
  },
  {
    "id": "CPEI-T40-PT03-036",
    "orden": 620,
    "concepto": "¿Qué grado y qué consecuencia asigna la evaluación de riesgos del PT03 a todos sus riesgos específicos?",
    "respuesta": "Grado: riesgo notable. Consecuencia: inhalación/absorción de fibras de amianto.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF págs. 14–15 (Hojas 7–8)",
    "apartado": "PT03 amianto · 5. Riesgos › Tabla de riesgos"
  },
  {
    "id": "CPEI-T40-PT03-037",
    "orden": 630,
    "concepto": "¿Cuáles son las cuatro pautas de seguridad de la evaluación de riesgos para trabajos con material con amianto?",
    "respuesta": "1) Evite la exposición innecesaria (permanezca en la zona únicamente durante las tareas que lo precisen). 2) Está prohibido comer, beber y fumar en lugares con exposición a amianto. 3) En lo posible, manipule los materiales enteros o intactos (ojo con los afectados por el incendio, pueden haber perdido su solidez) y adopte medidas para contener la dispersión en la retirada. 4) Use los EPI indicados por el Servicio, como mínimo mascarillas con filtros contra partículas P3 o ERA.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 15 (Hoja 8)",
    "apartado": "PT03 amianto · 5. Riesgos › Medidas preventivas propuestas en la evaluación de riesgos"
  },
  {
    "id": "CPEI-T40-PT03-038",
    "orden": 640,
    "concepto": "¿Qué está prohibido hacer en lugares con exposición a amianto?",
    "respuesta": "Comer, beber y fumar.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 15 (Hoja 8)",
    "apartado": "PT03 amianto · 5. Riesgos › Medidas preventivas propuestas en la evaluación de riesgos"
  },
  {
    "id": "CPEI-T40-PT03-039",
    "orden": 650,
    "concepto": "¿Por qué hay que tener especial cuidado al manipular materiales con amianto afectados por el incendio?",
    "respuesta": "Porque es posible que hayan perdido su solidez.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 15 (Hoja 8)",
    "apartado": "PT03 amianto · 5. Riesgos › Medidas preventivas propuestas en la evaluación de riesgos"
  },
  {
    "id": "CPEI-T40-PT03-040",
    "orden": 660,
    "concepto": "¿Qué protección respiratoria mínima establece la evaluación de riesgos y por qué aunque no haya exposición a humos o gases?",
    "respuesta": "Mascarillas con filtros contra partículas P3 o ERA, porque es posible que haya suspensión de fibras de amianto por exposición a materiales friables a causa del incendio/rescate cuando en su estado inicial no son friables.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 15 (Hoja 8)",
    "apartado": "PT03 amianto · 5. Riesgos › Medidas preventivas propuestas en la evaluación de riesgos"
  },
  {
    "id": "CPEI-T40-PT03-041",
    "orden": 670,
    "concepto": "¿Qué dos EPI establece el Servicio para trabajos en presencia de amianto (apartado 5)?",
    "respuesta": "1) Mascarilla autofiltrante FFP3, o mascarillas con filtro contra partículas tipo 3. 2) Traje NBQ de resistencia a la penetración de partículas o fibras de tamaño superior a 3 micras, provisto de capucha y cerrado en tobillos y puños.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 16 (Hoja 9)",
    "apartado": "PT03 amianto · 5. Riesgos › Medidas preventivas propuestas en la evaluación de riesgos"
  },
  {
    "id": "CPEI-T40-PT03-042",
    "orden": 680,
    "concepto": "¿Frente a fibras de qué tamaño debe resistir el traje NBQ y cómo debe ir provisto y cerrado?",
    "respuesta": "Partículas o fibras de tamaño superior a 3 micras; provisto de capucha y cerrado en tobillos y puños.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 16 (Hoja 9)",
    "apartado": "PT03 amianto · 5. Riesgos › Medidas preventivas propuestas en la evaluación de riesgos"
  },
  {
    "id": "CPEI-T40-PT03-043",
    "orden": 690,
    "concepto": "¿Qué medios humanos deben designarse previamente a la implantación del PT03?",
    "respuesta": "Emisorista (E), Mando Responsable de Movilización (MRM), Mando Responsable de Intervención (MRI), Bombero (B) y Conductor (BC).",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF págs. 16–17 (Hojas 9–10)",
    "apartado": "PT03 amianto · 6. Medios humanos"
  },
  {
    "id": "CPEI-T40-PT03-044",
    "orden": 700,
    "concepto": "¿Qué funciones tiene el emisorista (E) en el PT03?",
    "respuesta": "Transmitir la información de la intervención a las dotaciones de los parques, recabando si es posible en la primera solicitud de información la existencia en el lugar de estructuras con fibrocemento; generar con el programa informático la ruta de acceso; y facilitar a las dotaciones toda la información que se genere y se transmita a la Central, específicamente si se conoce la existencia de estructuras con amianto.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 16 (Hoja 9)",
    "apartado": "PT03 amianto · 6. Medios humanos › Emisorista"
  },
  {
    "id": "CPEI-T40-PT03-045",
    "orden": 710,
    "concepto": "¿Según qué protocolo actúa el emisorista y bajo la supervisión de quién?",
    "respuesta": "Según el Protocolo de movilización y comunicación del CPEI y bajo la supervisión del Mando Responsable de la Movilización (MRM).",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 16 (Hoja 9)",
    "apartado": "PT03 amianto · 6. Medios humanos › Emisorista"
  },
  {
    "id": "CPEI-T40-PT03-046",
    "orden": 720,
    "concepto": "¿Quiénes pueden ser Mando Responsable de la Movilización (MRM)?",
    "respuesta": "Jefe de Guardia, Suboficial, Oficial.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 16 (Hoja 9)",
    "apartado": "PT03 amianto · 6. Medios humanos › Mando Responsable de Movilización"
  },
  {
    "id": "CPEI-T40-PT03-047",
    "orden": 730,
    "concepto": "¿Qué funciones tiene el Mando Responsable de la Movilización (MRM)?",
    "respuesta": "Validar la movilización inicial de las dotaciones al lugar de la intervención, valorando en todo momento el apoyo y desmovilización según la información que le vaya transmitiendo el MRI. Siempre actuará según el Protocolo de movilización y comunicación del CPEI.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 16 (Hoja 9)",
    "apartado": "PT03 amianto · 6. Medios humanos › Mando Responsable de Movilización"
  },
  {
    "id": "CPEI-T40-PT03-048",
    "orden": 740,
    "concepto": "¿Quiénes pueden ser Mando Responsable de la Intervención (MRI)?",
    "respuesta": "Oficial, Suboficial, Sargento, Cabo, Bombero.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 16 (Hoja 9)",
    "apartado": "PT03 amianto · 6. Medios humanos › Mando Responsable de Intervención"
  },
  {
    "id": "CPEI-T40-PT03-049",
    "orden": 750,
    "concepto": "¿Quién asume la función de MRI en una intervención?",
    "respuesta": "El efectivo de mayor rango de los presentes, según el Protocolo de Movilización vigente del CPEI-Badajoz; debe estar presente en el lugar de la intervención.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF págs. 16–17 (Hojas 9–10)",
    "apartado": "PT03 amianto · 6. Medios humanos › Mando Responsable de Intervención"
  },
  {
    "id": "CPEI-T40-PT03-050",
    "orden": 760,
    "concepto": "¿Qué funciones tiene el MRI según el apartado de medios humanos?",
    "respuesta": "Valorar inicialmente la situación (si existe posible presencia de elementos con amianto y si las operaciones pueden generar partículas de material friable); ordenar la aplicación de las normas si procede; supervisar antes de iniciar la actividad la correcta colocación de los equipos de protección y la planificación del trabajo con la herramienta adecuada; y actuar, si es el caso, en todo el proceso como recurso preventivo. Siempre según el Protocolo de movilización y comunicación del CPEI.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 17 (Hoja 10)",
    "apartado": "PT03 amianto · 6. Medios humanos › Mando Responsable de Intervención"
  },
  {
    "id": "CPEI-T40-PT03-051",
    "orden": 770,
    "concepto": "¿Qué funciones tienen el Bombero (B) y el Conductor (BC) en el PT03?",
    "respuesta": "Bombero: llevar a cabo las labores requeridas según el tipo de intervención (rescate o extinción), teniendo en cuenta las normas del procedimiento. Conductor: conducción de los vehículos movilizados (circulación durante el itinerario, señalización, estacionamiento, conexión de bomba si es necesario), teniendo en cuenta las normas del procedimiento.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 17 (Hoja 10)",
    "apartado": "PT03 amianto · 6. Medios humanos › Bombero y Conductor"
  },
  {
    "id": "CPEI-T40-PT03-052",
    "orden": 780,
    "concepto": "Si se determina que la intervención está afectada por posible amianto friable, ¿quién se suma siempre a la dotación y qué funciones asume?",
    "respuesta": "El Sargento de Guardia, haciendo especial seguimiento al cumplimiento del protocolo y asumiendo las funciones de Recurso preventivo.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 17 (Hoja 10)",
    "apartado": "PT03 amianto · 6. Medios humanos"
  },
  {
    "id": "CPEI-T40-PT03-053",
    "orden": 790,
    "concepto": "¿Cuál es la dotación mínima en una intervención afectada por posible amianto friable?",
    "respuesta": "2 binomios.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 17 (Hoja 10)",
    "apartado": "PT03 amianto · 6. Medios humanos"
  },
  {
    "id": "CPEI-T40-PT03-054",
    "orden": 800,
    "concepto": "Según la guía técnica del RD 396/2006, ¿qué EPI deben emplearse en actividades con riesgo de exposición al amianto?",
    "respuesta": "1) Trajes de tipo 5, herméticos a la penetración de partículas sólidas (de un único uso, con capucha y cubrebotas del mismo tipo de protección). 2) Guantes de nitrilo desechables. 3) Máscara facial con adaptador de filtros del tipo P3 / mascarillas P3 (FP3).",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF págs. 17–18 (Hojas 10–11)",
    "apartado": "PT03 amianto · 7.1. Equipo de protección individual"
  },
  {
    "id": "CPEI-T40-PT03-055",
    "orden": 810,
    "concepto": "¿Qué características tiene el traje de tipo 5 y qué debe incorporar para proteger toda la superficie corporal?",
    "respuesta": "Es de un único uso y por tanto desechable; para proteger toda la superficie corporal ante la deposición de fibras de amianto debe incorporar capucha y estar acompañado por un cubrebotas del mismo tipo de protección.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 18 (Hoja 11)",
    "apartado": "PT03 amianto · 7.1. Equipo de protección individual"
  },
  {
    "id": "CPEI-T40-PT03-056",
    "orden": 820,
    "concepto": "¿Por qué la utilización por los bomberos del conjunto de EPI de la guía técnica está considerablemente limitada?",
    "respuesta": "Debido al resto de riesgos directos presentes en las intervenciones de los bomberos (acción de las llamas, riesgos mecánicos, etc.), siendo en ocasiones difícilmente compatibles.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 18 (Hoja 11)",
    "apartado": "PT03 amianto · 7.1. Equipo de protección individual"
  },
  {
    "id": "CPEI-T40-PT03-057",
    "orden": 830,
    "concepto": "¿De qué materiales se fabrican fundamentalmente los monos de tipo 5 y qué caracteriza a los de polietileno?",
    "respuesta": "Fundamentalmente polietileno y polipropileno. Los de polietileno suelen incorporar una lámina de polipropileno y se caracterizan por su baja transpirabilidad y su bajo desprendimiento de fibras.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 18 (Hoja 11)",
    "apartado": "PT03 amianto · 7.1. Equipo de protección individual"
  },
  {
    "id": "CPEI-T40-PT03-058",
    "orden": 840,
    "concepto": "¿Qué inconveniente tiene usar el mono tipo 5 bajo el traje de intervención o de rescate técnico?",
    "respuesta": "Puede suponer un factor añadido de cansancio y sudoración durante una intervención en la que el trabajador ya está expuesto a un alto desgaste físico.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 18 (Hoja 11)",
    "apartado": "PT03 amianto · 7.1. Equipo de protección individual"
  },
  {
    "id": "CPEI-T40-PT03-059",
    "orden": 850,
    "concepto": "¿Qué equipos forman parte del equipo básico de todos los integrantes del CPEI y deben llevarse en todas las salidas (dotación de EPI)?",
    "respuesta": "1) Buzo de protección/termo capuz tipo 5 impermeable a partículas (UNE-EN ISO 13982-1:2005). 2) Guantes de nitrilo desechables. 3) Media máscara (3M) con filtros contra partículas tipo P3, desechables. 4) Gafas de protección contra proyecciones de partículas de montura universal. 5) ERA de circuito abierto (ERACA) de aire comprimido con máscara completa (UNE-EN 137). 6) Trajes de nivel de intervención o rescate técnico (según intervención). 7) Bota de intervención (UNE-EN 15090, Tipo 2), suela y puntera reforzada. 8) Guantes de intervención de protección para bomberos (UNE-EN 659) o de rescate técnico según proceda.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF págs. 18–19 (Hojas 11–12)",
    "apartado": "PT03 amianto · 7.1 › Dotación de EPI´s"
  },
  {
    "id": "CPEI-T40-PT03-060",
    "orden": 860,
    "concepto": "¿Qué normas cita el PT03 para el buzo tipo 5, el ERACA con máscara completa, la bota de intervención y los guantes de intervención de bombero?",
    "respuesta": "Buzo tipo 5: UNE-EN ISO 13982-1:2005 (ropa de protección contra partículas sólidas, categoría III). ERACA con máscara completa: UNE-EN 137. Bota de intervención: UNE-EN 15090, Tipo 2. Guantes de intervención: UNE-EN 659.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF págs. 18–19 (Hojas 11–12)",
    "apartado": "PT03 amianto · 7.1 › Dotación de EPI´s"
  },
  {
    "id": "CPEI-T40-PT03-061",
    "orden": 870,
    "concepto": "¿Qué se hace con los filtros P3 desechables de la media máscara tras su uso?",
    "respuesta": "Posteriormente se retirarán y serán gestionados como residuos de amianto.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 18 (Hoja 11)",
    "apartado": "PT03 amianto · 7.1 › Dotación de EPI´s"
  },
  {
    "id": "CPEI-T40-PT03-062",
    "orden": 880,
    "concepto": "¿Quién revisa los EPI y el material de desinfección, y con qué periodicidad?",
    "respuesta": "Diariamente, cada bombero es responsable de revisar el correcto estado de sus EPI (revisión diaria). El Jefe de Turno revisa diariamente la existencia en todos los vehículos del material de desinfección indicado en el procedimiento, junto con una caja de guantes de vinilo.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 19 (Hoja 12)",
    "apartado": "PT03 amianto · 7.1 › Revisión de EPI´s"
  },
  {
    "id": "CPEI-T40-PT03-063",
    "orden": 890,
    "concepto": "¿Qué equipamiento debe usar el personal de apoyo cuyo cometido no implique la permanencia en atmósfera (segunda actividad)?",
    "respuesta": "El mismo equipamiento indicado anteriormente, principalmente protección respiratoria, buzo tipo 5, guantes de protección y gafas; deben tenerlo a su alcance en todo momento por si son movilizados por el Jefe de Guardia tras la activación del procedimiento de amianto.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 19 (Hoja 12)",
    "apartado": "PT03 amianto · 7.1 › Dotación de EPI´s personal apoyo intervención"
  },
  {
    "id": "CPEI-T40-PT03-064",
    "orden": 900,
    "concepto": "¿Qué es la «dotación equipos amianto» y cuándo debe llevarse?",
    "respuesta": "Se dispone en el parque y contiene los elementos indicados de material en vehículo (fase limpieza gruesa en intervención); debe introducirse siempre en todas las salidas de vehículo.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 19 (Hoja 12)",
    "apartado": "PT03 amianto · 7.2.1. Materiales e instalaciones necesarios (revisión diaria)"
  },
  {
    "id": "CPEI-T40-PT03-065",
    "orden": 910,
    "concepto": "¿Qué material debe llevar el vehículo para la fase de limpieza gruesa en intervención?",
    "respuesta": "1) Guantes de nitrilo. 2) Mascarillas con filtros contra partículas tipo P3 (filtros desechables, gestionados como residuos de amianto). 3) Mascarillas P3 (FP3). 4) Lona de zona sucia. 5) Bolsas de plástico. 6) Identificación de material con amianto. 7) Bayeta. 8) Tijeras.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF págs. 19–20 (Hojas 12–13)",
    "apartado": "PT03 amianto · 7.2.1. Materiales e instalaciones necesarios (revisión diaria) › Material en vehículo"
  },
  {
    "id": "CPEI-T40-PT03-066",
    "orden": 920,
    "concepto": "¿Qué material debe haber en las duchas-vestuarios del parque para la fase de descontaminación?",
    "respuesta": "Duchas de agua caliente y fría; contenedor de residuos con bolsa identificada con amianto; material fungible para la descontaminación (gel de ducha, cepillos de uñas, artículos de aseo, etc.); cinta adhesiva; ropa de muda limpia; bolsas de plástico.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 20 (Hoja 13)",
    "apartado": "PT03 amianto · 7.2.1. Materiales e instalaciones necesarios (revisión diaria) › Material en parque"
  },
  {
    "id": "CPEI-T40-PT03-067",
    "orden": 930,
    "concepto": "¿Cuántas taquillas tiene cada trabajador y cómo se distribuyen?",
    "respuesta": "Dos: una para la ropa de calle y otra para la de trabajo, convenientemente separadas entre sí por la zona de duchas. La ropa de calle se deja en el «vestuario limpio» y la de trabajo en el «vestuario sucio».",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 20 (Hoja 13)",
    "apartado": "PT03 amianto · 7.2.1. Materiales e instalaciones necesarios (revisión diaria) › Material en parque"
  },
  {
    "id": "CPEI-T40-PT03-068",
    "orden": 940,
    "concepto": "¿Qué material debe haber en la zona lavadero?",
    "respuesta": "Aspirador portátil de alta eficacia (AS 30-PRO), que se trasladará desde base por segunda actividad o personal designado por el Jefe de Guardia; bayeta microfibra; jabón neutro; bolsas de plástico; flight-case con identificador de amianto.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 20 (Hoja 13)",
    "apartado": "PT03 amianto · 7.2.1. Materiales e instalaciones necesarios (revisión diaria) › Zona lavadero"
  },
  {
    "id": "CPEI-T40-PT03-069",
    "orden": 950,
    "concepto": "¿Qué material está disponible para trasladar al emplazamiento de la intervención y al parque?",
    "respuesta": "Aspirador portátil de alta eficacia AS 30-PRO y flight-case para traslado de material contaminado y desechos, con identificador de amianto.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 21 (Hoja 14)",
    "apartado": "PT03 amianto · 7.2.1. Materiales e instalaciones necesarios (revisión diaria) › Material para traslado"
  },
  {
    "id": "CPEI-T40-PT03-070",
    "orden": 960,
    "concepto": "¿De qué sistema dispone la lavandería central para las aguas de lavado y cómo se trata su filtro?",
    "respuesta": "Sistema de desagüe adaptado para que todas las aguas de limpieza y lavado de los equipos utilizados en la intervención pasen por el sistema de filtrado instalado, para captar las posibles fibras. El filtro de captación se tratará posteriormente como residuo con contenido de amianto.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 21 (Hoja 14)",
    "apartado": "PT03 amianto · 7.2.1. Materiales e instalaciones necesarios (revisión diaria) › Lavandería central"
  },
  {
    "id": "CPEI-T40-PT03-071",
    "orden": 970,
    "concepto": "¿Cómo se tratan los equipos desechables tras la actuación?",
    "respuesta": "Los residuos generados (EPI desechables, plásticos, filtros, etc.) serán encapsulados y etiquetados, para posteriormente ser tratados por un gestor autorizado de residuos.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 21 (Hoja 14)",
    "apartado": "PT03 amianto · 7.2.2. Tratamiento de equipos"
  },
  {
    "id": "CPEI-T40-PT03-072",
    "orden": 980,
    "concepto": "¿Cómo se tratan los equipos no desechables y auxiliares?",
    "respuesta": "Tratamiento de descontaminación en la propia intervención, encapsulado y etiquetado para su posterior tratamiento en parque o lavandería central (todos los EPI).",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 21 (Hoja 14)",
    "apartado": "PT03 amianto · 7.2.2. Tratamiento de equipos"
  },
  {
    "id": "CPEI-T40-PT03-073",
    "orden": 990,
    "concepto": "Antes de la intervención, ¿qué debe garantizarse como mínimo respecto a vehículos, EPI, materiales y herramientas?",
    "respuesta": "Que hayan sido revisados según la Revisión de material del CPEI y registrados en el Parte de revisión diaria.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 22 (Hoja 15)",
    "apartado": "PT03 amianto · 8. Tareas a realizar previas a la intervención"
  },
  {
    "id": "CPEI-T40-PT03-074",
    "orden": 1000,
    "concepto": "Antes de la intervención, ¿en qué estado físico debe encontrarse el personal?",
    "respuesta": "En perfecto estado, hidratados, habiendo tomado alimentos nutritivos sin comidas copiosas, sin haber ingerido alcohol y descansados.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 22 (Hoja 15)",
    "apartado": "PT03 amianto · 8. Tareas a realizar previas a la intervención"
  },
  {
    "id": "CPEI-T40-PT03-075",
    "orden": 1010,
    "concepto": "¿Qué debe conocer el personal y haberse definido al inicio de la guardia?",
    "respuesta": "Las funciones a realizar en la intervención por el personal del turno de guardia (dirección, abastecimiento de agua, binomio de extinción, binomio de rescate, binomio de SOS-Apoyo y logística…).",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 22 (Hoja 15)",
    "apartado": "PT03 amianto · 8. Tareas a realizar previas a la intervención"
  },
  {
    "id": "CPEI-T40-PT03-076",
    "orden": 1020,
    "concepto": "¿Qué dos tipos de intervenciones define el PT03 en las que pueden generarse operaciones con material con amianto friable?",
    "respuesta": "1) Intervenciones con presencia de incendio. 2) Intervenciones sin presencia de incendio que requieran manipulación de material friable o rotura de material no friable que pueda transformarse en friable.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 22 (Hoja 15)",
    "apartado": "PT03 amianto · 9. Procedimiento de trabajo con posible presencia de fibras de amianto friable"
  },
  {
    "id": "CPEI-T40-PT03-077",
    "orden": 1030,
    "concepto": "¿Puede modificarse el PT03 durante la intervención?",
    "respuesta": "De forma general queda prohibido. Solo de manera excepcional el MRI, basándose en su formación y experiencia, puede introducir modificaciones, sin dejar de cumplir las medidas de seguridad exigidas, disponiendo siempre del número imprescindible de efectivos y sin que en ningún caso supongan un aumento del riesgo para los intervinientes.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 22 (Hoja 15)",
    "apartado": "PT03 amianto · 9. Procedimiento de trabajo con posible presencia de fibras de amianto friable"
  },
  {
    "id": "CPEI-T40-PT03-078",
    "orden": 1040,
    "concepto": "Si el MRI introduce modificaciones al procedimiento, ¿dónde deben reflejarse y con qué objeto?",
    "respuesta": "Finalizada la intervención, las circunstancias que han llevado a tomar nuevas decisiones y su resolución se reflejan en el Parte de intervención correspondiente, para determinar su adecuación o la posible necesidad de modificar el procedimiento.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 22 (Hoja 15)",
    "apartado": "PT03 amianto · 9. Procedimiento de trabajo con posible presencia de fibras de amianto friable"
  },
  {
    "id": "CPEI-T40-PT03-079",
    "orden": 1050,
    "concepto": "¿Cuáles son las fases de la intervención en que se estructura el procedimiento del apartado 9?",
    "respuesta": "Fase cero: aviso y activación de los servicios de emergencia. Fase 1: aproximación, valoración inicial y ubicación de vehículos. Fase 2: intervención. Fase 3: fin de la intervención, limpieza gruesa in situ. Fase 4: llegada al parque. Fase 5: restitución de la normalidad.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF págs. 23, 25, 31, 32, 37, 41 (Hojas 16, 18, 24, 25, 30, 34)",
    "apartado": "PT03 amianto · 9. Procedimiento de trabajo con posible presencia de fibras de amianto friable"
  },
  {
    "id": "CPEI-T40-PT03-080",
    "orden": 1060,
    "concepto": "¿Por qué vías tiene entrada generalmente el aviso a la CECOB?",
    "respuesta": "1) Desde el Centro de Atención de Urgencias y Emergencias 1-1-2 Extremadura, a través de la llamada telefónica del Técnico Sectorial de Incendios. 2) Desde la línea telefónica propia del CPEI (emergencias 085), en la que un particular o empresa llama a la Central. 3) Desde un parque de bomberos del CPEI vía radio o teléfono. 4) Desde una central o personal operativo de un Cuerpo y Fuerza de Seguridad del Estado (Policía Local, Policía Nacional y/o Guardia Civil). 5) Desde la aplicación SOS Emergencias a través de un móvil o tablet.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 23 (Hoja 16)",
    "apartado": "PT03 amianto · 9.1. Fase cero. Aviso y activación de los servicios de emergencia"
  },
  {
    "id": "CPEI-T40-PT03-081",
    "orden": 1070,
    "concepto": "¿Cuál es el número de emergencias de la línea telefónica propia del CPEI?",
    "respuesta": "085.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 23 (Hoja 16)",
    "apartado": "PT03 amianto · 9.1. Fase cero. Aviso y activación de los servicios de emergencia"
  },
  {
    "id": "CPEI-T40-PT03-082",
    "orden": 1080,
    "concepto": "¿Por qué medios hace llegar la CECOB el aviso a la dotación de los parques?",
    "respuesta": "Vía radio (preferentemente) o vía telefónica.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 23 (Hoja 16)",
    "apartado": "PT03 amianto · 9.1. Fase cero. Aviso y activación de los servicios de emergencia"
  },
  {
    "id": "CPEI-T40-PT03-083",
    "orden": 1090,
    "concepto": "¿Cómo pueden recibir los parques el aviso directamente y quién debe pasar la información a la CECOB?",
    "respuesta": "Vía telefónica (de un particular o de cualquier empresa u organismo público o privado) o presencial (el alertante se persona en el parque). La información la pasa a la CECOB el Jefe de turno, según el Protocolo de Movilización del CPEI vigente.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 24 (Hoja 17)",
    "apartado": "PT03 amianto · 9.1. Fase cero. Aviso y activación de los servicios de emergencia"
  },
  {
    "id": "CPEI-T40-PT03-084",
    "orden": 1100,
    "concepto": "Cuando el aviso llega al CPEI, ¿con qué dos cuestiones se debe ampliar la información inicial básica?",
    "respuesta": "1) ¿Se conoce si existe en el lugar de la intervención material con posibilidad de contenido en amianto? (tejados, bajantes y otros elementos de fibrocemento, aislamiento térmico, paneles, linóleo, flocages, falsos techos, calderas, conducciones…). 2) ¿Existe riesgo de desplome de alguna estructura? (¿se ha generado derrumbe de tejados, cubiertas o zonas con aislante térmico —fibrocemento, amianto-vinilo— o existe riesgo de desplome de dichos elementos?).",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 24 (Hoja 17)",
    "apartado": "PT03 amianto · 9.1. Fase cero. Aviso y activación de los servicios de emergencia"
  },
  {
    "id": "CPEI-T40-PT03-085",
    "orden": 1110,
    "concepto": "Además de la información habitual, ¿qué datos sobre amianto se trasladan al MRI?",
    "respuesta": "1) Posible existencia de material con contenido en amianto en el lugar de la intervención. 2) Existencia de derrumbes de estructuras o cubiertas que hayan generado material friable (escombros).",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 25 (Hoja 18)",
    "apartado": "PT03 amianto · 9.1. Fase cero. Aviso y activación de los servicios de emergencia"
  },
  {
    "id": "CPEI-T40-PT03-086",
    "orden": 1120,
    "concepto": "¿Dónde debe quedar reflejada la información obtenida en el aviso y qué se hace después con el alertante?",
    "respuesta": "En el Parte de la intervención desde la CECOB. Se mantendrá la comunicación con el alertante para ampliar la información posteriormente.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 25 (Hoja 18)",
    "apartado": "PT03 amianto · 9.1. Fase cero. Aviso y activación de los servicios de emergencia"
  },
  {
    "id": "CPEI-T40-PT03-087",
    "orden": 1130,
    "concepto": "¿Cómo se realizan en el PT03 la activación de los servicios de emergencia (fase cero-2) y la aproximación (fase 1-A)?",
    "respuesta": "Activación: según está establecido para cada tipo de intervención. Aproximación: se activará según el tipo de intervención.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 25 (Hoja 18)",
    "apartado": "PT03 amianto · 9.1 / 9.2"
  },
  {
    "id": "CPEI-T40-PT03-088",
    "orden": 1140,
    "concepto": "¿Qué tres actuaciones comprende la fase 1?",
    "respuesta": "A. Aproximación. B. Valoración inicial. C. Ubicación de vehículos.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 25 (Hoja 18)",
    "apartado": "PT03 amianto · 9.2. Fase 1: aproximación, valoración inicial y ubicación de vehículos"
  },
  {
    "id": "CPEI-T40-PT03-089",
    "orden": 1150,
    "concepto": "¿Qué análisis añade el MRI al llegar al lugar del siniestro?",
    "respuesta": "El análisis de la posible existencia de material con contenido en amianto y del riesgo de que este requiera o pueda transformarse en material friable (rotura de estructura, posibilidad de derrumbe, manipulación de escombros con restos de MCA, etc.) durante la intervención.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 26 (Hoja 19)",
    "apartado": "PT03 amianto · 9.2. Fase 1: aproximación, valoración inicial y ubicación de vehículos › B. Valoración inicial › Actuaciones del MRI"
  },
  {
    "id": "CPEI-T40-PT03-090",
    "orden": 1160,
    "concepto": "Si el MRI decide NO aplicar el procedimiento de amianto, ¿qué debe hacer?",
    "respuesta": "Indicarlo al terminar la intervención en el parte de intervención SOS.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 26 (Hoja 19)",
    "apartado": "PT03 amianto · 9.2. Fase 1: aproximación, valoración inicial y ubicación de vehículos › B. Valoración inicial › Actuaciones del MRI"
  },
  {
    "id": "CPEI-T40-PT03-091",
    "orden": 1170,
    "concepto": "Si el MRI decide aplicar el procedimiento de amianto, ¿qué dos cosas debe hacer?",
    "respuesta": "1) Comunicar al Jefe de Guardia la necesidad de ACTIVAR el PROCEDIMIENTO DE AMIANTO. 2) Definir la estrategia de actuación, eligiendo siempre que sea posible la opción que no requiera manipular, romper, etc., material con contenido en amianto.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 26 (Hoja 19)",
    "apartado": "PT03 amianto · 9.2. Fase 1: aproximación, valoración inicial y ubicación de vehículos › B. Valoración inicial › Actuaciones del MRI"
  },
  {
    "id": "CPEI-T40-PT03-092",
    "orden": 1180,
    "concepto": "¿Qué debe hacer el Jefe de Guardia al recibir del MRI la activación del procedimiento de amianto?",
    "respuesta": "1) Gestionar el traslado de los medios que determine necesarios (personal, aspirador con filtro Hepa, flight-case para traslado de equipos, etc.). 2) Personarse en la intervención, asumiendo la función de Recurso Preventivo. 3) Informar al Jefe de Parque de la puesta en marcha del procedimiento.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 26 (Hoja 19)",
    "apartado": "PT03 amianto · 9.2. Fase 1: aproximación, valoración inicial y ubicación de vehículos › B. Valoración inicial › Actuaciones del Jefe de Guardia"
  },
  {
    "id": "CPEI-T40-PT03-093",
    "orden": 1190,
    "concepto": "Definida la estrategia, ¿qué tres pasos se ejecutan en la ubicación de vehículos (F.1.C)?",
    "respuesta": "F.1.C.1 Operación de acercamiento. F.1.C.2 Definir zona de descontaminación. F.1.C.3 Colocación de EPI.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF págs. 27–28 (Hojas 20–21)",
    "apartado": "PT03 amianto · 9.2. Fase 1: aproximación, valoración inicial y ubicación de vehículos › C. Ubicación de vehículos"
  },
  {
    "id": "CPEI-T40-PT03-094",
    "orden": 1200,
    "concepto": "¿Cómo se ejecutan las operaciones de acercamiento y preparación de material en el procedimiento de amianto?",
    "respuesta": "Como en cualquier intervención.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 27 (Hoja 20)",
    "apartado": "PT03 amianto · 9.2. Fase 1: aproximación, valoración inicial y ubicación de vehículos › C. Ubicación de vehículos › F.1.C.1 Operación de acercamiento"
  },
  {
    "id": "CPEI-T40-PT03-095",
    "orden": 1210,
    "concepto": "¿Quién determina la zona de descontaminación y dónde debe situarse?",
    "respuesta": "El MRI; en una zona alejada de la posible atmósfera contaminada y del camión, y prepara el material necesario para la posterior descontaminación.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 27 (Hoja 20)",
    "apartado": "PT03 amianto · 9.2. Fase 1: aproximación, valoración inicial y ubicación de vehículos › C. Ubicación de vehículos › F.1.C.2 Definir zona de descontaminación"
  },
  {
    "id": "CPEI-T40-PT03-096",
    "orden": 1220,
    "concepto": "¿Qué se ubica en la zona de descontaminación?",
    "respuesta": "1) Lona de material plástico extendida en el suelo («lona de zona sucia») con dos zonas: Lona 1 (zona de limpieza) y Lona 2 (zona de retirada de equipos). 2) Bolsas de plástico con indicativo «contiene material con amianto». 3) Bayetas. 4) EPI necesarios para la posterior descontaminación, ubicados por personal de apoyo junto a la Lona 2.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 28 (Hoja 21)",
    "apartado": "PT03 amianto · 9.2. Fase 1: aproximación, valoración inicial y ubicación de vehículos › C. Ubicación de vehículos › F.1.C.2 Definir zona de descontaminación"
  },
  {
    "id": "CPEI-T40-PT03-097",
    "orden": 1230,
    "concepto": "En la zona de descontaminación, ¿qué función tiene la LONA 1 y cuál la LONA 2?",
    "respuesta": "LONA 1: zona de limpieza. LONA 2: zona de retirada de equipos.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 28 (Hoja 21)",
    "apartado": "PT03 amianto · 9.2. Fase 1: aproximación, valoración inicial y ubicación de vehículos › C. Ubicación de vehículos › F.1.C.2 Definir zona de descontaminación"
  },
  {
    "id": "CPEI-T40-PT03-098",
    "orden": 1240,
    "concepto": "¿Qué EPI para la posterior descontaminación coloca el personal de apoyo junto a la LONA 2?",
    "respuesta": "1) Buzo de protección/termo capuz tipo 5 impermeable a partículas (si no se colocó antes de la intervención). 2) Mascarillas con filtros contra partículas tipo P3 (en el caso de que la intervención requiera uso de ERA). 3) Botas de intervención de sustitución.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 28 (Hoja 21)",
    "apartado": "PT03 amianto · 9.2. Fase 1: aproximación, valoración inicial y ubicación de vehículos › C. Ubicación de vehículos › F.1.C.2 Definir zona de descontaminación"
  },
  {
    "id": "CPEI-T40-PT03-099",
    "orden": 1250,
    "concepto": "¿Cómo se realiza la colocación de los EPI y quién hace la supervisión final?",
    "respuesta": "Por parejas, para asegurar el correcto precintado y colocación de los equipos, con supervisión final por parte del MRI.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 28 (Hoja 21)",
    "apartado": "PT03 amianto · 9.2. Fase 1: aproximación, valoración inicial y ubicación de vehículos › C. Ubicación de vehículos › F.1.C.3 Colocación de EPI´s"
  },
  {
    "id": "CPEI-T40-PT03-100",
    "orden": 1260,
    "concepto": "¿De qué depende qué EPI se colocan y cuáles son los dos momentos posibles de activación del procedimiento?",
    "respuesta": "Del momento en que se active el procedimiento: 1) desde la información recibida del alertante, antes de la salida del parque; 2) una vez ubicados en el lugar de la intervención.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 28 (Hoja 21)",
    "apartado": "PT03 amianto · 9.2. Fase 1: aproximación, valoración inicial y ubicación de vehículos › C. Ubicación de vehículos › F.1.C.3 Colocación de EPI´s"
  },
  {
    "id": "CPEI-T40-PT03-101",
    "orden": 1270,
    "concepto": "¿Cuándo se aplica la activación del procedimiento desde el parque (C.3.A)?",
    "respuesta": "Cuando la información aportada por el alertante sea suficiente para decidir que es necesaria la activación, por indicar derrumbe con material de amianto en el punto de intervención, escombros con restos de material con amianto en la zona, etc., siempre que sea intervención de rescate SIN FUEGO.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 29 (Hoja 22)",
    "apartado": "PT03 amianto · 9.2. Fase 1: aproximación, valoración inicial y ubicación de vehículos › C. Ubicación de vehículos › F.1.C.3 Colocación de EPI´s › C.3.A Activación del procedimiento desde el parque"
  },
  {
    "id": "CPEI-T40-PT03-102",
    "orden": 1280,
    "concepto": "En la activación desde el parque (C.3.A), ¿dónde se colocan el buzo tipo 5 y los guantes de nitrilo respecto al traje de intervención?",
    "respuesta": "Debajo del traje de intervención.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 29 (Hoja 22)",
    "apartado": "PT03 amianto · 9.2. Fase 1: aproximación, valoración inicial y ubicación de vehículos › C. Ubicación de vehículos › F.1.C.3 Colocación de EPI´s › C.3.A Activación del procedimiento desde el parque"
  },
  {
    "id": "CPEI-T40-PT03-103",
    "orden": 1290,
    "concepto": "¿Cuál es el orden completo de colocación de EPI en la activación desde el parque (C.3.A, rescate sin fuego)? (8 pasos)",
    "respuesta": "1º Buzo de protección/termo capuz tipo 5 impermeable a partículas, precintado tobillos, con caperuza colocada. 2º Doble guante de nitrilo, precintando las mangas del buzo con los guantes. 3º Traje de rescate técnico. 4º Media máscara con filtros contra partículas tipo P3. 5º Gafas de seguridad herméticas (UNE-EN 166). 6º Casco de rescate técnico (según tipo de intervención de origen). 7º Guantes de excarcelación o trabajo (según proceda) encima de los guantes de nitrilo. 8º Botas de intervención.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF págs. 29–30 (Hojas 22–23)",
    "apartado": "PT03 amianto · 9.2. Fase 1: aproximación, valoración inicial y ubicación de vehículos › C. Ubicación de vehículos › F.1.C.3 Colocación de EPI´s › C.3.A Activación del procedimiento desde el parque"
  },
  {
    "id": "CPEI-T40-PT03-104",
    "orden": 1300,
    "concepto": "En C.3.A, ¿cómo debe colocarse el buzo (paso 1º)?",
    "respuesta": "Buzo de protección/termo capuz tipo 5 impermeable a partículas, precintado en tobillos, con caperuza colocada.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 29 (Hoja 22)",
    "apartado": "PT03 amianto · 9.2. Fase 1: aproximación, valoración inicial y ubicación de vehículos › C. Ubicación de vehículos › F.1.C.3 Colocación de EPI´s › C.3.A Activación del procedimiento desde el parque"
  },
  {
    "id": "CPEI-T40-PT03-105",
    "orden": 1310,
    "concepto": "En C.3.A, ¿qué se coloca en el paso 2º y cómo se une al buzo?",
    "respuesta": "Doble guante de nitrilo, precintando las mangas del buzo con los guantes.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 29 (Hoja 22)",
    "apartado": "PT03 amianto · 9.2. Fase 1: aproximación, valoración inicial y ubicación de vehículos › C. Ubicación de vehículos › F.1.C.3 Colocación de EPI´s › C.3.A Activación del procedimiento desde el parque"
  },
  {
    "id": "CPEI-T40-PT03-106",
    "orden": 1320,
    "concepto": "En C.3.A, ¿qué EPI se coloca justo después del traje de rescate técnico (paso 4º) y cuál después (paso 5º)?",
    "respuesta": "4º Media máscara con filtros contra partículas tipo P3. 5º Gafas de seguridad herméticas (UNE-EN 166).",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 29 (Hoja 22)",
    "apartado": "PT03 amianto · 9.2. Fase 1: aproximación, valoración inicial y ubicación de vehículos › C. Ubicación de vehículos › F.1.C.3 Colocación de EPI´s › C.3.A Activación del procedimiento desde el parque"
  },
  {
    "id": "CPEI-T40-PT03-107",
    "orden": 1330,
    "concepto": "¿Cómo deben colocarse el buzo y los guantes de nitrilo para evitar vías de penetración de las fibras de amianto?",
    "respuesta": "De manera que no queden huecos entre ellos: el guante se coloca encima de la manga del mono y se precinta la unión, sellando estas coberturas con cinta adhesiva.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 30 (Hoja 23)",
    "apartado": "PT03 amianto · 9.2. Fase 1: aproximación, valoración inicial y ubicación de vehículos › C. Ubicación de vehículos › F.1.C.3 Colocación de EPI´s › C.3.A Activación del procedimiento desde el parque › Nota"
  },
  {
    "id": "CPEI-T40-PT03-108",
    "orden": 1340,
    "concepto": "En la activación en el lugar de la intervención (C.3.B), ¿con qué EPI deben completar los intervinientes los propios de su tipo de intervención?",
    "respuesta": "Con doble guante de nitrilo y protección respiratoria P3, en el caso de que la intervención no requiera el uso de ERA.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 30 (Hoja 23)",
    "apartado": "PT03 amianto · 9.2. Fase 1: aproximación, valoración inicial y ubicación de vehículos › C. Ubicación de vehículos › F.1.C.3 Colocación de EPI´s › C.3.B Activación del procedimiento en el lugar de la intervención"
  },
  {
    "id": "CPEI-T40-PT03-109",
    "orden": 1350,
    "concepto": "¿Cuál es el orden completo de colocación de los EPI «encima» en C.3.B (activación en el lugar)? (6 pasos)",
    "respuesta": "1º Cubre pantalón y botas colocadas. 2º Doble guante de nitrilo. 3º Chaquetón, colocando el adaptador de las mangas encima del guante de nitrilo. 4º Protección respiratoria (con fuego: ERA; sin fuego: media máscara P3 o mascarilla P3/FP3). 5º Casco de intervención. 6º Guantes de intervención/técnicos encima de los guantes de vinilo.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 30 (Hoja 23)",
    "apartado": "PT03 amianto · 9.2. Fase 1: aproximación, valoración inicial y ubicación de vehículos › C. Ubicación de vehículos › F.1.C.3 Colocación de EPI´s › C.3.B Activación del procedimiento en el lugar de la intervención"
  },
  {
    "id": "CPEI-T40-PT03-110",
    "orden": 1360,
    "concepto": "En C.3.B (paso 4º), ¿qué protección respiratoria se usa en intervención CON fuego y cuál SIN fuego?",
    "respuesta": "Con fuego: equipo autónomo de circuito abierto (ERA) de aire comprimido con máscara completa (UNE-EN 137), previamente filtrado con filtros tipo P3. Sin fuego: media máscara con filtros contra partículas tipo P3 o mascarilla P3/FP3.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 30 (Hoja 23)",
    "apartado": "PT03 amianto · 9.2. Fase 1: aproximación, valoración inicial y ubicación de vehículos › C. Ubicación de vehículos › F.1.C.3 Colocación de EPI´s › C.3.B Activación del procedimiento en el lugar de la intervención"
  },
  {
    "id": "CPEI-T40-PT03-111",
    "orden": 1370,
    "concepto": "En C.3.B (paso 3º), ¿cómo se coloca el chaquetón respecto a los guantes de nitrilo?",
    "respuesta": "Colocando el adaptador de las mangas encima del guante de nitrilo.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 30 (Hoja 23)",
    "apartado": "PT03 amianto · 9.2. Fase 1: aproximación, valoración inicial y ubicación de vehículos › C. Ubicación de vehículos › F.1.C.3 Colocación de EPI´s › C.3.B Activación del procedimiento en el lugar de la intervención"
  },
  {
    "id": "CPEI-T40-PT03-112",
    "orden": 1380,
    "concepto": "¿Hasta cuándo deben mantener los intervinientes todos los EPI colocados?",
    "respuesta": "Durante toda la intervención, incluida la protección respiratoria, estén dentro o fuera de la zona de acción, incluidos los descansos de uso de ERACA o cambios de botella (se sustituirá por P3/FP3). Solo podrán retirarse en la fase final del procedimiento: aseo personal.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 31 (Hoja 24)",
    "apartado": "PT03 amianto · 9.2. Fase 1: aproximación, valoración inicial y ubicación de vehículos › C. Ubicación de vehículos › F.1.C.3 Colocación de EPI´s › C.3.B Activación del procedimiento en el lugar de la intervención"
  },
  {
    "id": "CPEI-T40-PT03-113",
    "orden": 1390,
    "concepto": "¿Cuánto tiempo máximo seguido se pueden mantener los EPI de respiración y qué descanso se establece?",
    "respuesta": "No más de 60 minutos seguidos o dos botellas como máximo; se realizarán relevos y descansos de 30 minutos.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 31 (Hoja 24)",
    "apartado": "PT03 amianto · 9.2. Fase 1: aproximación, valoración inicial y ubicación de vehículos › C. Ubicación de vehículos › F.1.C.3 Colocación de EPI´s › C.3.B Activación del procedimiento en el lugar de la intervención › Nota"
  },
  {
    "id": "CPEI-T40-PT03-114",
    "orden": 1400,
    "concepto": "Si son necesarios relevos, ¿quién moviliza otro equipo de intervención y previa comunicación de quién?",
    "respuesta": "El Jefe de Guardia, previa comunicación del MRI.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 31 (Hoja 24)",
    "apartado": "PT03 amianto · 9.2. Fase 1: aproximación, valoración inicial y ubicación de vehículos › C. Ubicación de vehículos › F.1.C.3 Colocación de EPI´s › C.3.B Activación del procedimiento en el lugar de la intervención › Nota"
  },
  {
    "id": "CPEI-T40-PT03-115",
    "orden": 1410,
    "concepto": "¿Cómo se desarrolla la intervención (fase 2) cuando hay amianto?",
    "respuesta": "Como cualquier intervención donde no haya amianto, excepto que se deben tener en cuenta las indicaciones específicas del procedimiento.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 31 (Hoja 24)",
    "apartado": "PT03 amianto · 9.3. Fase 2: intervención"
  },
  {
    "id": "CPEI-T40-PT03-116",
    "orden": 1420,
    "concepto": "Siempre que sea posible, ¿qué debe hacerse antes de cualquier actuación que pueda generar material friable con amianto y con qué objeto?",
    "respuesta": "Determinar la zona de actuación donde se haya identificado el material con amianto y mojar la zona de actuación (la estructura, paramento), con objeto de disminuir la posible emisión de fibras al ambiente.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 31 (Hoja 24)",
    "apartado": "PT03 amianto · 9.3. Fase 2: intervención"
  },
  {
    "id": "CPEI-T40-PT03-117",
    "orden": 1430,
    "concepto": "Si se requiere romper estructuras o elementos con amianto, ¿qué herramientas deben usarse y cuáles evitarse?",
    "respuesta": "Las que generen una mínima cantidad de polvo, preferiblemente herramientas manuales o de baja velocidad de giro, evitando máquinas rotativas por la elevada emisión de polvo que pueden generar (si es posible, mojarlas previamente).",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 32 (Hoja 25)",
    "apartado": "PT03 amianto · 9.3. Fase 2: intervención"
  },
  {
    "id": "CPEI-T40-PT03-118",
    "orden": 1440,
    "concepto": "¿Qué queda terminantemente prohibido durante la intervención con amianto?",
    "respuesta": "Realizar cualquier operación de rotura o traslado de material con contenido de amianto si no es totalmente imprescindible para el desarrollo de la intervención.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 32 (Hoja 25)",
    "apartado": "PT03 amianto · 9.3. Fase 2: intervención"
  },
  {
    "id": "CPEI-T40-PT03-119",
    "orden": 1450,
    "concepto": "¿Cómo deben permanecer los intervinientes durante la fase 3 (limpieza gruesa in situ)?",
    "respuesta": "Con el EPI completo perfectamente colocado durante TODA LA FASE, incluida la protección respiratoria.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 32 (Hoja 25)",
    "apartado": "PT03 amianto · 9.4. Fase 3: fin de la intervención. Limpieza gruesa in situ"
  },
  {
    "id": "CPEI-T40-PT03-120",
    "orden": 1460,
    "concepto": "¿Qué subfases componen la fase 3 (fin de la intervención)?",
    "respuesta": "F.3.1 Limpieza in situ con agua. F.3.2 Retirada de EPI (Lona 2). F.3.3 Almacenamiento de material contaminado. F.3.4 Subida de bomberos al vehículo. F.3.5 Subida del conductor al vehículo. F.3.6 Traslado del flight-case de EPI.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF págs. 33, 34, 36, 37 (Hojas 26, 27, 29, 30)",
    "apartado": "PT03 amianto · 9.4. Fase 3: fin de la intervención. Limpieza gruesa in situ"
  },
  {
    "id": "CPEI-T40-PT03-121",
    "orden": 1470,
    "concepto": "¿Con qué objeto se hace la limpieza in situ con agua y qué dos zonas se definen?",
    "respuesta": "Para eliminar posibles restos de polvo acumulados tanto en los equipos utilizados como en los EPI. Zonas: 1º zona junto al vehículo; 2º lona zona sucia: Lona 1, zona de descontaminación.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 33 (Hoja 26)",
    "apartado": "PT03 amianto · 9.4. Fase 3: fin de la intervención. Limpieza gruesa in situ › F.3.1 Limpieza in situ con agua"
  },
  {
    "id": "CPEI-T40-PT03-122",
    "orden": 1480,
    "concepto": "Junto al vehículo, ¿cuál es la secuencia de limpieza del material que puede mojarse (mangueras, herramienta…)?",
    "respuesta": "1º Limpieza in situ con agua a presión que no dañe el material. 2º Encapsulado de los equipos en bolsa de plástico y precintar. 3º Introducir la bolsa en una segunda bolsa con indicativo de amianto, cerrándola herméticamente.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 33 (Hoja 26)",
    "apartado": "PT03 amianto · 9.4. Fase 3: fin de la intervención. Limpieza gruesa in situ › F.3.1 Limpieza in situ con agua"
  },
  {
    "id": "CPEI-T40-PT03-123",
    "orden": 1490,
    "concepto": "En la Lona 1, ¿cuál es la secuencia de limpieza de los equipos que no pueden manguearse (cámaras térmicas, walkis, linternas…)?",
    "respuesta": "1º Aspirar con la aspiradora AS 30-PRO (siempre que su tecnología lo permita). 2º Limpiar con bayeta húmeda. 3º Encapsular en bolsa de plástico y precintar. 4º Introducir la bolsa en una segunda bolsa con indicativo de amianto, cerrándola herméticamente.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 33 (Hoja 26)",
    "apartado": "PT03 amianto · 9.4. Fase 3: fin de la intervención. Limpieza gruesa in situ › F.3.1 Limpieza in situ con agua"
  },
  {
    "id": "CPEI-T40-PT03-124",
    "orden": 1500,
    "concepto": "¿Quién tiene prohibida la permanencia en la zona de Lona 1 y a qué se limita si está en la zona?",
    "respuesta": "El personal que no ha participado en la intervención; si existe, se limitará a preparar material limpio a los participantes en la zona de retirada de equipos (Lona 2).",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 33 (Hoja 26)",
    "apartado": "PT03 amianto · 9.4. Fase 3: fin de la intervención. Limpieza gruesa in situ › F.3.1 Limpieza in situ con agua"
  },
  {
    "id": "CPEI-T40-PT03-125",
    "orden": 1510,
    "concepto": "¿Cuál es la secuencia de limpieza de EPI con agua por pareja? (4 pasos)",
    "respuesta": "1º Los operarios en pareja manguean al compañero con todo el equipo puesto (incluido ERACA) para hacer la primera eliminación de polvo; una vez limpiado el traje del binomio, se repite con el MRI. 2º Limpieza exterior del casco con bayeta mojada. 3º Limpieza del equipo de respiración: espaldera, botella, media máscara. 4º Botas de intervención.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF págs. 33–34 (Hojas 26–27)",
    "apartado": "PT03 amianto · 9.4. Fase 3: fin de la intervención. Limpieza gruesa in situ › F.3.1 Limpieza in situ con agua"
  },
  {
    "id": "CPEI-T40-PT03-126",
    "orden": 1520,
    "concepto": "En la limpieza de EPI por pareja, una vez limpiado el traje del binomio, ¿con quién se repite el mangueo?",
    "respuesta": "Con el MRI.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 33 (Hoja 26)",
    "apartado": "PT03 amianto · 9.4. Fase 3: fin de la intervención. Limpieza gruesa in situ › F.3.1 Limpieza in situ con agua"
  },
  {
    "id": "CPEI-T40-PT03-127",
    "orden": 1530,
    "concepto": "¿Cuál es el orden completo de retirada de EPI en la Lona 2? (7 pasos)",
    "respuesta": "1º Guantes de intervención (a bolsa de EPI INDIVIDUAL, manteniendo los guantes de nitrilo). 2º Equipo de respiración: desabrochar espaldera y desconectar. 3º Retirar la máscara de presión positiva y colocar de inmediato protección respiratoria frente a partículas (media máscara P3 o mascarilla P3/FP3). 4º Casco: desmontar el atalaje y embolsar (INDIVIDUAL). 5º Traje de intervención (situación A con buzo debajo o B sin buzo). 6º Botas: se retiran junto con el cubre pantalón, se limpian con agua y a bolsa INDIVIDUAL; se colocan botas de sustitución. 7º Gafas: se retiran, se limpian con agua y a bolsa INDIVIDUAL.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF págs. 34–36 (Hojas 27–29)",
    "apartado": "PT03 amianto · 9.4. Fase 3: fin de la intervención. Limpieza gruesa in situ › F.3.2 Retirada de EPI´s (Lona 2)"
  },
  {
    "id": "CPEI-T40-PT03-128",
    "orden": 1540,
    "concepto": "Al retirar los guantes de intervención (paso 1º), ¿qué guantes se mantienen puestos y dónde van los de intervención?",
    "respuesta": "Se mantienen los guantes de nitrilo; los de intervención se introducen en la bolsa de plástico de EPI INDIVIDUAL.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 34 (Hoja 27)",
    "apartado": "PT03 amianto · 9.4. Fase 3: fin de la intervención. Limpieza gruesa in situ › F.3.2 Retirada de EPI´s (Lona 2)"
  },
  {
    "id": "CPEI-T40-PT03-129",
    "orden": 1550,
    "concepto": "Al retirar la máscara de presión positiva (paso 3º), ¿qué hay que colocarse de inmediato?",
    "respuesta": "Protección respiratoria frente a partículas (media máscara con filtro P3 o mascarilla P3/FP3). Si se llevaba puesta media máscara, se permanece con ella colocada.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF págs. 34–35 (Hojas 27–28)",
    "apartado": "PT03 amianto · 9.4. Fase 3: fin de la intervención. Limpieza gruesa in situ › F.3.2 Retirada de EPI´s (Lona 2)"
  },
  {
    "id": "CPEI-T40-PT03-130",
    "orden": 1560,
    "concepto": "En la retirada de EPI, ¿en qué bolsa van la espaldera y las botellas, y en cuál la máscara de presión positiva?",
    "respuesta": "Espaldera y botellas de aire: bolsa de plástico de EPI COLECTIVOS. Máscara Presión+: bolsa de plástico de EPI INDIVIDUAL.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 35 (Hoja 28)",
    "apartado": "PT03 amianto · 9.4. Fase 3: fin de la intervención. Limpieza gruesa in situ › F.3.2 Retirada de EPI´s (Lona 2)"
  },
  {
    "id": "CPEI-T40-PT03-131",
    "orden": 1570,
    "concepto": "En la retirada del traje (paso 5º), situación A (buzo nivel 5 debajo del traje de rescate técnico), ¿cómo se procede?",
    "respuesta": "En pareja: 1º retirar el traje de intervención/técnico con ayuda de la pareja, sin movimientos bruscos, para evitar posibles desperfectos en el buzo interior; 2º introducir los equipos en la bolsa de EPI INDIVIDUAL de cada interviniente.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 35 (Hoja 28)",
    "apartado": "PT03 amianto · 9.4. Fase 3: fin de la intervención. Limpieza gruesa in situ › F.3.2 Retirada de EPI´s (Lona 2)"
  },
  {
    "id": "CPEI-T40-PT03-132",
    "orden": 1580,
    "concepto": "En la retirada del traje (paso 5º), situación B (sin buzo nivel 5), ¿cuál es la secuencia?",
    "respuesta": "1º Retirar el traje técnico o de intervención con ayuda de la pareja, sin movimientos bruscos, metiéndolo en bolsa de EPI INDIVIDUAL y esta en otra bolsa señalizada con contenido de amianto. 2º El operario se coloca el buzo tipo 5, con la capucha. 3º Introducir los equipos en bolsa de EPI INDIVIDUAL de cada interviniente.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 35 (Hoja 28)",
    "apartado": "PT03 amianto · 9.4. Fase 3: fin de la intervención. Limpieza gruesa in situ › F.3.2 Retirada de EPI´s (Lona 2)"
  },
  {
    "id": "CPEI-T40-PT03-133",
    "orden": 1590,
    "concepto": "En la retirada de EPI (paso 6º), ¿qué se hace con las botas de intervención y qué se calzan después los integrantes?",
    "respuesta": "Se retiran junto con el cubre pantalón, se limpian con agua y se introducen en la bolsa de EPI INDIVIDUAL, cerrándola herméticamente. Los integrantes se colocan botas de intervención de sustitución.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 36 (Hoja 29)",
    "apartado": "PT03 amianto · 9.4. Fase 3: fin de la intervención. Limpieza gruesa in situ › F.3.2 Retirada de EPI´s (Lona 2)"
  },
  {
    "id": "CPEI-T40-PT03-134",
    "orden": 1600,
    "concepto": "¿Qué supervisa el MRI, como recurso preventivo, durante la retirada de EPI?",
    "respuesta": "La correcta colocación y mantenimiento de los EPI de los integrantes y la ubicación de las bolsas herméticas de herramientas en el vehículo.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 36 (Hoja 29)",
    "apartado": "PT03 amianto · 9.4. Fase 3: fin de la intervención. Limpieza gruesa in situ › F.3.2 Retirada de EPI´s (Lona 2)"
  },
  {
    "id": "CPEI-T40-PT03-135",
    "orden": 1610,
    "concepto": "¿Con qué EPI se permanece durante todo el proceso de retirada de EPI?",
    "respuesta": "Con el buzo tipo 5 colocado con capucha, guantes de vinilo, gafas de protección y protección respiratoria P3.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 36 (Hoja 29)",
    "apartado": "PT03 amianto · 9.4. Fase 3: fin de la intervención. Limpieza gruesa in situ › F.3.2 Retirada de EPI´s (Lona 2)"
  },
  {
    "id": "CPEI-T40-PT03-136",
    "orden": 1620,
    "concepto": "¿Dónde se introducen las bolsas con los equipos para su traslado y qué señalización se coloca?",
    "respuesta": "Dentro del flight-case ubicado en el vehículo, para su traslado a lavandería o al parque. Señalización: bomberos participantes y señal de riesgo de amianto.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 36 (Hoja 29)",
    "apartado": "PT03 amianto · 9.4. Fase 3: fin de la intervención. Limpieza gruesa in situ › F.3.3 Almacenamiento de material contaminado"
  },
  {
    "id": "CPEI-T40-PT03-137",
    "orden": 1630,
    "concepto": "¿Qué cuatro tipos de sacas herméticas se generan en la descontaminación inicial in situ?",
    "respuesta": "1) EPI de cada profesional (EPI INDIVIDUAL). 2) EPI de protección respiratoria colectivos (EPI COLECTIVOS). 3) Herramientas. 4) Bolsa de material de desecho contaminado.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 36 (Hoja 29)",
    "apartado": "PT03 amianto · 9.4. Fase 3: fin de la intervención. Limpieza gruesa in situ › F.3.3 Almacenamiento de material contaminado"
  },
  {
    "id": "CPEI-T40-PT03-138",
    "orden": 1640,
    "concepto": "Si las circunstancias permiten llevar directamente a la lavandería central las sacas de EPI INDIVIDUAL y COLECTIVOS, ¿quién gestiona ese traslado y qué se evita?",
    "respuesta": "El Jefe de Guardia gestionará dicho traslado directo, evitando fases intermedias de almacenamiento en parque.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF págs. 36–37 (Hojas 29–30)",
    "apartado": "PT03 amianto · 9.4. Fase 3: fin de la intervención. Limpieza gruesa in situ › F.3.3 Almacenamiento de material contaminado › Nota"
  },
  {
    "id": "CPEI-T40-PT03-139",
    "orden": 1650,
    "concepto": "¿Qué hace el conductor antes de subir al vehículo (F.3.5)?",
    "respuesta": "Cierra la bolsa herméticamente, la mete en la saca verde, cierra e introduce en el flight-case. Deposita el flight-case de EPI INDIVIDUAL y COLECTIVO junto a la lona de sucio. Retira la lona de sucio y la introduce en bolsa con cierre hermético junto con cualquier material/desecho usado para la limpieza. Se inicia el regreso al parque.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 37 (Hoja 30)",
    "apartado": "PT03 amianto · 9.4. Fase 3: fin de la intervención. Limpieza gruesa in situ › F.3.5 Subida conductor vehículo"
  },
  {
    "id": "CPEI-T40-PT03-140",
    "orden": 1660,
    "concepto": "¿Quién retirará la lona de sucio y los desechos de limpieza (material con posible resto de amianto) y cuándo?",
    "respuesta": "Una empresa especializada, a la llegada al parque.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 37 (Hoja 30)",
    "apartado": "PT03 amianto · 9.4. Fase 3: fin de la intervención. Limpieza gruesa in situ › F.3.5 Subida conductor vehículo"
  },
  {
    "id": "CPEI-T40-PT03-141",
    "orden": 1670,
    "concepto": "¿Quién traslada el flight-case de EPI a la lavandería central y cómo debe hacerlo?",
    "respuesta": "El conductor de 2ª actividad o personal movilizado por el Jefe de Guardia: coloca los identificativos de los bomberos participantes y la identificación de riesgo por amianto, y lo traslada a la lavandería central, depositándolo sin abrirlo en la zona de sucio.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 37 (Hoja 30)",
    "apartado": "PT03 amianto · 9.4. Fase 3: fin de la intervención. Limpieza gruesa in situ › F.3.6 Traslado de flight-case de EPIs"
  },
  {
    "id": "CPEI-T40-PT03-142",
    "orden": 1680,
    "concepto": "Antes de la entrada del vehículo en el parque, ¿qué debe preparar el personal de apoyo?",
    "respuesta": "1) Equipo de limpieza de vehículo. 2) Sacas de envío de equipos a lavandería de base, señalizadas con material con amianto, junto a la zona de limpieza de vehículos. 3) Ropa de permanencia de cada bombero junto a la salida de la ducha. 4) Bolsas en el contenedor de las duchas: una para EPI desechables y otra para ropa, con identificativo de amianto. 5) Bolsa de plástico junto a cada ducha (tantas duchas como integrantes). 6) Supervisar la zona de lavadero (jabón, cepillo, elemento textil para secado).",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF págs. 37–38 (Hojas 30–31)",
    "apartado": "PT03 amianto · 9.5. Fase 4: llegada al parque"
  },
  {
    "id": "CPEI-T40-PT03-143",
    "orden": 1690,
    "concepto": "Al entrar en el parque, ¿dónde se ubica el vehículo y qué ocurre antes de que baje nadie?",
    "respuesta": "Se ubica en la zona de limpieza de vehículos. Los operarios permanecen dentro con los EPI colocados (guantes, buzo, equipos de respiración P3) y el bombero de apoyo manguea el exterior del vehículo antes de que baje ningún integrante.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 38 (Hoja 31)",
    "apartado": "PT03 amianto · 9.5. Fase 4: llegada al parque › F.4.1 Entrada del vehículo al parque"
  },
  {
    "id": "CPEI-T40-PT03-144",
    "orden": 1700,
    "concepto": "¿Adónde se dirigen los intervinientes al bajar del vehículo y cómo limpia el bombero de apoyo el interior?",
    "respuesta": "Se dirigen a la zona de sucio para el aseo personal. El bombero de apoyo: 1º aspira el interior con aspiradora con filtro Hepa (AS 30-PRO); 2º limpia el interior con bayeta húmeda. Los desechos van en bolsa con identificativo de amianto.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 38 (Hoja 31)",
    "apartado": "PT03 amianto · 9.5. Fase 4: llegada al parque › F.4.1 Entrada del vehículo al parque"
  },
  {
    "id": "CPEI-T40-PT03-145",
    "orden": 1710,
    "concepto": "¿Qué modelo de aspirador con filtro Hepa cita el PT03 para limpiar equipos y vehículos?",
    "respuesta": "AS 30-PRO (aspirador portátil de alta eficacia).",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 38 (Hoja 31)",
    "apartado": "PT03 amianto · 9.5. Fase 4: llegada al parque › F.4.1 Entrada del vehículo al parque"
  },
  {
    "id": "CPEI-T40-PT03-146",
    "orden": 1720,
    "concepto": "¿Cómo debe quedar la puerta del lavadero del parque mientras contiene material con amianto?",
    "respuesta": "Cerrada herméticamente y correctamente advertido que en su interior hay material con amianto, impidiendo la entrada a personal no autorizado.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF págs. 38–39 (Hojas 31–32)",
    "apartado": "PT03 amianto · 9.5. Fase 4: llegada al parque › F.4.2 Limpieza de equipos"
  },
  {
    "id": "CPEI-T40-PT03-147",
    "orden": 1730,
    "concepto": "¿Cómo se agrupan las herramientas para descontaminarlas en el lavadero del parque?",
    "respuesta": "Por lotes que pueden descontaminarse conjuntamente: mangueras y equipos sumergibles; equipos no sumergibles (cámaras térmicas, linternas, walkis…).",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 39 (Hoja 32)",
    "apartado": "PT03 amianto · 9.5. Fase 4: llegada al parque › F.4.2 Limpieza de equipos"
  },
  {
    "id": "CPEI-T40-PT03-148",
    "orden": 1740,
    "concepto": "¿Cómo se limpian en el parque las mangueras, los equipos sumergibles y los no sumergibles?",
    "respuesta": "Mangueras: sumergir en agua. Sumergibles: agua a 40 °C y detergente neutro (si el equipo lo permite), frotando con cepillo, y aclarado con agua a 40 °C. No sumergibles: bayeta húmeda.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 39 (Hoja 32)",
    "apartado": "PT03 amianto · 9.5. Fase 4: llegada al parque › F.4.2 Limpieza de equipos"
  },
  {
    "id": "CPEI-T40-PT03-149",
    "orden": 1750,
    "concepto": "¿Qué se hace con el lavadero del parque al terminar la limpieza de herramientas?",
    "respuesta": "Se llena por completo con agua a 40 °C y detergente, sumergiendo el cepillo y todo el material auxiliar, removiendo el agua para eliminar las fibras residuales; finalizado, se enjuaga con agua.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 39 (Hoja 32)",
    "apartado": "PT03 amianto · 9.5. Fase 4: llegada al parque › F.4.2 Limpieza de equipos"
  },
  {
    "id": "CPEI-T40-PT03-150",
    "orden": 1760,
    "concepto": "¿Cuál es la secuencia de aseo personal de bomberos y conductor en la zona sucia del parque?",
    "respuesta": "1) Retirada por pareja de los buzos tipo 5, a la bolsa de MATERIAL DESECHABLE. 2) Ducharse con guantes y mascarilla puestos. 3) Lavados cuerpo y cabeza, retirar los guantes desechables (bolsa de MATERIAL DESECHABLE). 4) Antes de vestirse, retirar la protección respiratoria: máscara facial en bolsa de EPI y filtros en bolsa de material desechable; enjuagarse después la cara. 5) Toda la ropa utilizada, en bolsa para lavado inmediato en la lavadora del parque. 6) En la zona limpia, ponerse ropa limpia y seca.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF págs. 39–40 (Hojas 32–33)",
    "apartado": "PT03 amianto · 9.5. Fase 4: llegada al parque › F.4.3 Aseo personal"
  },
  {
    "id": "CPEI-T40-PT03-151",
    "orden": 1770,
    "concepto": "¿Con qué EPI puestos comienzan a ducharse los bomberos y cuándo se quitan los guantes?",
    "respuesta": "Con guantes y mascarilla puestos. Los guantes desechables se retiran una vez lavados el cuerpo y la cabeza.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 39 (Hoja 32)",
    "apartado": "PT03 amianto · 9.5. Fase 4: llegada al parque › F.4.3 Aseo personal"
  },
  {
    "id": "CPEI-T40-PT03-152",
    "orden": 1780,
    "concepto": "En el aseo personal, ¿cuándo se retira la protección respiratoria y adónde van la máscara y los filtros?",
    "respuesta": "Antes de colocarse la ropa. La máscara facial con adaptador se encapsula en bolsa de EPI y los filtros de cartucho en la bolsa de material desechable; después el trabajador se enjuaga la cara.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 39 (Hoja 32)",
    "apartado": "PT03 amianto · 9.5. Fase 4: llegada al parque › F.4.3 Aseo personal"
  },
  {
    "id": "CPEI-T40-PT03-153",
    "orden": 1790,
    "concepto": "¿Con qué EPI va equipado el operario de apoyo en el parque?",
    "respuesta": "Guantes de vinilo y mascarilla P3.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 40 (Hoja 33)",
    "apartado": "PT03 amianto · 9.5. Fase 4: llegada al parque › Tareas operario de apoyo"
  },
  {
    "id": "CPEI-T40-PT03-154",
    "orden": 1800,
    "concepto": "¿Qué bolsas debe trasladar el operario de apoyo y adónde?",
    "respuesta": "La bolsa de material desechable, al contenedor destinado a tal fin (residuo de amianto, con posterior tratamiento por gestor autorizado); la bolsa de EPI con porta mascarilla, a la saca destinada a lavandería de base. Ambas perfectamente identificadas con el contenido y composición de los equipos.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 40 (Hoja 33)",
    "apartado": "PT03 amianto · 9.5. Fase 4: llegada al parque › Tareas operario de apoyo"
  },
  {
    "id": "CPEI-T40-PT03-155",
    "orden": 1810,
    "concepto": "¿A qué temperatura se lava la ropa en el parque y qué prendas se introducen en primer lugar?",
    "respuesta": "A 50º; en primer lugar los verdugos y otras prendas interiores utilizadas durante la intervención.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 40 (Hoja 33)",
    "apartado": "PT03 amianto · 9.5. Fase 4: llegada al parque › Tareas operario de apoyo"
  },
  {
    "id": "CPEI-T40-PT03-156",
    "orden": 1820,
    "concepto": "Al terminar sus tareas, ¿dónde deposita el bombero de apoyo sus EPI?",
    "respuesta": "Procede a su aseo personal, ubicando sus EPI (buzo, guantes, mascarilla) en la bolsa de material de desecho.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 40 (Hoja 33)",
    "apartado": "PT03 amianto · 9.5. Fase 4: llegada al parque › Tareas operario de apoyo"
  },
  {
    "id": "CPEI-T40-PT03-157",
    "orden": 1830,
    "concepto": "¿De qué tiempo mínimo de higiene personal disponen los trabajadores y quién lo organiza durante la intervención?",
    "respuesta": "Un tiempo mínimo continuado de 10 minutos antes de la comida y otros diez minutos antes de abandonar el trabajo; el MRI organiza dicho descanso, si procede, durante la intervención.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 41 (Hoja 34)",
    "apartado": "PT03 amianto · 9.5. Fase 4: llegada al parque › Medidas de higiene personal"
  },
  {
    "id": "CPEI-T40-PT03-158",
    "orden": 1840,
    "concepto": "¿Qué deben hacer los trabajadores potencialmente expuestos antes de comer, beber o fumar?",
    "respuesta": "Lavarse la cara, boca y manos.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 41 (Hoja 34)",
    "apartado": "PT03 amianto · 9.5. Fase 4: llegada al parque › Medidas de higiene personal"
  },
  {
    "id": "CPEI-T40-PT03-159",
    "orden": 1850,
    "concepto": "¿Qué prohíbe el PT03 respecto a llevar al domicilio equipos o ropa de la intervención y qué es obligatorio?",
    "respuesta": "Queda prohibido llevar a su domicilio cualquier equipo, EPI o vestuario utilizado en la intervención; es obligatoria la aplicación del sistema de limpieza y descontaminación interno implantado por el CPEI.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 41 (Hoja 34)",
    "apartado": "PT03 amianto · 9.5. Fase 4: llegada al parque › Medidas de higiene personal"
  },
  {
    "id": "CPEI-T40-PT03-160",
    "orden": 1860,
    "concepto": "Una vez aseado, ¿qué datos debe recabar el MRI para el Parte de Intervención en SOS?",
    "respuesta": "1) Procedencia del material friable con amianto generado: por derrumbes fortuitos; por rotura de elementos estructurales realizada por los actuantes (especificando si se usó medio húmedo o mojado previo de la superficie); por traslado de escombros o material de desecho. 2) Personal que ha podido estar expuesto. 3) Material utilizado. 4) Incidencias con la colocación o retirada de EPI.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF págs. 41–42 (Hojas 34–35)",
    "apartado": "PT03 amianto · 9.6.1. Funciones del MRI (fase 5: restitución de la normalidad)"
  },
  {
    "id": "CPEI-T40-PT03-161",
    "orden": 1870,
    "concepto": "¿En qué datos se basa el MRI para redactar el Parte de Intervención?",
    "respuesta": "En los datos recabados y anotados en el lugar del siniestro y en los registrados en el programa SOS EMERGENCIAS por el emisorista.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 42 (Hoja 35)",
    "apartado": "PT03 amianto · 9.6.1. Funciones del MRI (fase 5: restitución de la normalidad)"
  },
  {
    "id": "CPEI-T40-PT03-162",
    "orden": 1880,
    "concepto": "¿Qué se analiza en la reunión de los participantes tras la intervención?",
    "respuesta": "1) Desarrollo de la intervención, para poner en valor las operaciones realizadas correctamente e identificar las que se deben mejorar. 2) Nivel de cumplimiento del procedimiento. 3) Acciones propuestas de mejora.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 42 (Hoja 35)",
    "apartado": "PT03 amianto · 9.6.1. Funciones del MRI (fase 5: restitución de la normalidad)"
  },
  {
    "id": "CPEI-T40-PT03-163",
    "orden": 1890,
    "concepto": "En la restitución de la normalidad, ¿qué funciones tiene el Jefe de Guardia?",
    "respuesta": "Analizar, con ayuda del operario de apoyo del parque, la existencia de EPI de sustitución para los participantes, ubicándolos en la taquilla de cada interviniente; y tomar las decisiones para disponer de los equipos de repuesto, gestionando su traslado desde los Almacenes de Equipos de repuesto de urgencia, base, etc.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 42 (Hoja 35)",
    "apartado": "PT03 amianto · 9.6.2. Funciones del Jefe de Guardia (fase 5)"
  },
  {
    "id": "CPEI-T40-PT03-164",
    "orden": 1900,
    "concepto": "¿Qué equipos de repuesto hay en el almacén del parque?",
    "respuesta": "Chaquetón y cubre de intervención; ERAS.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 42 (Hoja 35)",
    "apartado": "PT03 amianto · 9.6.2. Funciones del Jefe de Guardia (fase 5)"
  },
  {
    "id": "CPEI-T40-PT03-165",
    "orden": 1910,
    "concepto": "¿Qué compone el equipo de sustitución de los Almacenes de Equipos de repuesto de urgencia?",
    "respuesta": "Botas de intervención; verdugos; guantes de intervención; media máscara; guantes de vinilo; gafas de protección; casco F1 y F2; trajes de rescate técnico.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF págs. 42–43 (Hojas 35–36)",
    "apartado": "PT03 amianto · 9.6.2. Funciones del Jefe de Guardia (fase 5)"
  },
  {
    "id": "CPEI-T40-PT03-166",
    "orden": 1920,
    "concepto": "¿Dónde están los Almacenes de repuesto de urgencia y a qué parques atiende cada uno?",
    "respuesta": "Puebla de la Calzada: Mérida y Alburquerque. Almendralejo: Villafranca y Hornachos. Don Benito: Castuera y Herrera del Duque. Jerez de los Caballeros: Fregenal de la Sierra y Olivenza. Llerena: Azuaga y Zafra.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 43 (Hoja 36)",
    "apartado": "PT03 amianto · 9.6.2. Funciones del Jefe de Guardia (fase 5) › Tabla de almacenes"
  },
  {
    "id": "CPEI-T40-PT03-167",
    "orden": 1930,
    "concepto": "¿Qué almacén de repuesto de urgencia atiende a los parques de Mérida y Alburquerque?",
    "respuesta": "Puebla de la Calzada.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 43 (Hoja 36)",
    "apartado": "PT03 amianto · 9.6.2. Funciones del Jefe de Guardia (fase 5) › Tabla de almacenes"
  },
  {
    "id": "CPEI-T40-PT03-168",
    "orden": 1940,
    "concepto": "¿Qué almacén de repuesto de urgencia atiende a los parques de Villafranca y Hornachos?",
    "respuesta": "Almendralejo.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 43 (Hoja 36)",
    "apartado": "PT03 amianto · 9.6.2. Funciones del Jefe de Guardia (fase 5) › Tabla de almacenes"
  },
  {
    "id": "CPEI-T40-PT03-169",
    "orden": 1950,
    "concepto": "¿Qué almacén de repuesto de urgencia atiende a los parques de Castuera y Herrera del Duque?",
    "respuesta": "Don Benito.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 43 (Hoja 36)",
    "apartado": "PT03 amianto · 9.6.2. Funciones del Jefe de Guardia (fase 5) › Tabla de almacenes"
  },
  {
    "id": "CPEI-T40-PT03-170",
    "orden": 1960,
    "concepto": "¿Qué almacén de repuesto de urgencia atiende a los parques de Fregenal de la Sierra y Olivenza?",
    "respuesta": "Jerez de los Caballeros.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 43 (Hoja 36)",
    "apartado": "PT03 amianto · 9.6.2. Funciones del Jefe de Guardia (fase 5) › Tabla de almacenes"
  },
  {
    "id": "CPEI-T40-PT03-171",
    "orden": 1970,
    "concepto": "¿Qué almacén de repuesto de urgencia atiende a los parques de Azuaga y Zafra?",
    "respuesta": "Llerena.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 43 (Hoja 36)",
    "apartado": "PT03 amianto · 9.6.2. Funciones del Jefe de Guardia (fase 5) › Tabla de almacenes"
  },
  {
    "id": "CPEI-T40-PT03-172",
    "orden": 1980,
    "concepto": "¿Qué EPI se colocan los operarios de lavandería antes de entrar en la sala de sucio y en qué orden?",
    "respuesta": "1º Guantes de vinilo (UNE-EN 374). 2º Buzo de protección/termo capuz tipo 5 impermeable a partículas, precintado mangas y tobillos, con caperuza colocada (EN 13982-1). 3º Mascarillas con filtros contra partículas tipo P3 (UNE-EN 149). 4º Gafas de seguridad herméticas (UNE-EN 166). Queda completamente prohibida su retirada durante la descontaminación.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 43 (Hoja 36)",
    "apartado": "PT03 amianto · 10. Lavado en lavandería central › 10.1 Procedimiento de lavado en lavandería de base"
  },
  {
    "id": "CPEI-T40-PT03-173",
    "orden": 1990,
    "concepto": "Una vez protegidos en la sala de sucio de lavandería, ¿qué se hace con el desagüe y qué equipo de filtrado se usa?",
    "respuesta": "Se modifica el sentido del desagüe accionando la llave habilitada, para que toda el agua de la descontaminación pase por el sistema de filtrado instalado: equipo modelo AS300 M, con manguera con sensor capacitivo de agua.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF págs. 43–44 (Hojas 36–37)",
    "apartado": "PT03 amianto · 10. Lavado en lavandería central › 10.1 Procedimiento de lavado en lavandería de base"
  },
  {
    "id": "CPEI-T40-PT03-174",
    "orden": 2000,
    "concepto": "¿Qué etapas de filtrado tiene el equipo AS300 M de la lavandería y qué caudal tiene su bomba?",
    "respuesta": "Tres etapas: 200 micras, 50 micras y la etapa de vertido de 1 micra. Bomba de 30 litros de caudal.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 44 (Hoja 37)",
    "apartado": "PT03 amianto · 10. Lavado en lavandería central › 10.1 Procedimiento de lavado en lavandería de base"
  },
  {
    "id": "CPEI-T40-PT03-175",
    "orden": 2010,
    "concepto": "¿En qué lotes se agrupan los EPI para descontaminarlos en la lavandería?",
    "respuesta": "1) Conjuntos de vestimenta: chaqueta, cubre pantalón, guantes. 2) Equipos de respiración autónoma, máscaras portafiltros P3. 3) Verdugos junto con otras prendas de vestimenta interior. 4) Cascos. 5) Calzado.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 44 (Hoja 37)",
    "apartado": "PT03 amianto · 10. Lavado en lavandería central › 10.2 Clasificación y agrupación de los equipos a descontaminar"
  },
  {
    "id": "CPEI-T40-PT03-176",
    "orden": 2020,
    "concepto": "¿Cuándo y cómo se hace una descontaminación gruesa inicial en el lavadero de la lavandería?",
    "respuesta": "Antes de las lavadoras, si se observa una alta contaminación de los EPI y herramientas. Con agua a 40 °C, detergente y cepillo: se impregnan con agua y detergente, se frotan y se aclaran únicamente con agua a 40 °C. Al final, el lavadero se llena por completo con agua a 40 °C y detergente, se sumerge el cepillo y se remueve el agua.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 44 (Hoja 37)",
    "apartado": "PT03 amianto · 10. Lavado en lavandería central › 10.2 Clasificación y agrupación de los equipos a descontaminar"
  },
  {
    "id": "CPEI-T40-PT03-177",
    "orden": 2030,
    "concepto": "En la lavadora industrial, ¿qué temperatura y qué detergente se utilizan, y en qué cantidad?",
    "respuesta": "40 °C; el detergente recomendado por el fabricante o, en caso contrario, uno que no contenga cloro, en cantidades del orden de 30 g o 3 ml de producto por kg de ropa seca (según sea sólido o líquido).",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 44 (Hoja 37)",
    "apartado": "PT03 amianto · 10. Lavado en lavandería central › 10.2 Clasificación y agrupación de los equipos a descontaminar"
  },
  {
    "id": "CPEI-T40-PT03-178",
    "orden": 2040,
    "concepto": "Sin recomendaciones del fabricante, ¿qué programa de lavado debe elegirse en la lavadora industrial?",
    "respuesta": "El que menos revoluciones utilice (para evitar el desgaste por acción mecánica), con prelavado, lavado central y al menos tres ciclos de aclarado; el proceso no debe durar más de 30 minutos y el lavado central debe ocupar un mínimo del 40 % del ciclo completo.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF págs. 44–45 (Hojas 37–38)",
    "apartado": "PT03 amianto · 10. Lavado en lavandería central › 10.2 Clasificación y agrupación de los equipos a descontaminar"
  },
  {
    "id": "CPEI-T40-PT03-179",
    "orden": 2050,
    "concepto": "¿Cómo se lavan las chaquetas y los pantalones y qué se recomienda con los mosquetones?",
    "respuesta": "Primero, conjuntamente en la lavadora industrial, dados la vuelta y con cremalleras y velcros cerrados. Se recomienda meter los mosquetones de los arneses y de sujeción de los ERA en los bolsillos de pantalones y chaquetas, cerrándolos, para lavarlos en el mismo ciclo.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 45 (Hoja 38)",
    "apartado": "PT03 amianto · 10. Lavado en lavandería central › 10.2 Clasificación y agrupación de los equipos a descontaminar"
  },
  {
    "id": "CPEI-T40-PT03-180",
    "orden": 2060,
    "concepto": "¿Qué equipos se descontaminan en la lavadora tipo lavavajillas?",
    "respuesta": "1) Los ERA al completo, incluyendo la máscara, los reductores y la botella de aire. 2) Los cascos junto con los guantes. 3) Media máscara portante filtro P3. 4) El calzado, siempre tras un lavado previo en el lavadero.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 45 (Hoja 38)",
    "apartado": "PT03 amianto · 10. Lavado en lavandería central › 10.2 Clasificación y agrupación de los equipos a descontaminar"
  },
  {
    "id": "CPEI-T40-PT03-181",
    "orden": 2070,
    "concepto": "Terminada la limpieza en las máquinas, ¿dónde se depositan los EPI?",
    "respuesta": "En un armario de secado hasta que estén completamente listos para ser reutilizados, con el programa de secado recomendado por el fabricante.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 45 (Hoja 38)",
    "apartado": "PT03 amianto · 10. Lavado en lavandería central › 10.2 Clasificación y agrupación de los equipos a descontaminar"
  },
  {
    "id": "CPEI-T40-PT03-182",
    "orden": 2080,
    "concepto": "Al terminar la descontaminación de los equipos, ¿qué se hace con la lavadora antes de usarla para otros EPI?",
    "respuesta": "Un lavado rápido en vacío con detergente y agua a 50 °C, para eliminar la posible contaminación remanente.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 45 (Hoja 38)",
    "apartado": "PT03 amianto · 10. Lavado en lavandería central › 10.2 Clasificación y agrupación de los equipos a descontaminar"
  },
  {
    "id": "CPEI-T40-PT03-183",
    "orden": 2090,
    "concepto": "¿Cuántos profesionales se recomienda destinar a las tareas de lavandería y cómo se reparten?",
    "respuesta": "Al menos dos. Uno traslada los sacos a la sala de descontaminación, extrae y clasifica los equipos, los mete en las lavadoras y hace la limpieza previa en el lavadero (las tareas de mayor exposición). El otro configura los equipos de limpieza, comprueba la descontaminación (por si hace falta un segundo lavado), los mete en la secadora, los lleva a la sala de secado y comprueba periódicamente el secado.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 45 (Hoja 38)",
    "apartado": "PT03 amianto · 10. Lavado en lavandería central › 10.2 Clasificación y agrupación de los equipos a descontaminar"
  },
  {
    "id": "CPEI-T40-PT03-184",
    "orden": 2100,
    "concepto": "¿Qué deben hacer los operarios de lavandería al finalizar su tarea?",
    "respuesta": "Quitarse dentro de la sala de lavado todos los EPI desechables, ensacarlos herméticamente e identificarlos con la etiqueta de residuo de amianto (excepto la protección respiratoria). Después ducharse en Base con la protección respiratoria puesta, metiendo la ropa que lleven bajo el mono en bolsa identificada con restos de amianto. Al terminar la ducha, quitarse la protección respiratoria, desechar los filtros como residuo de amianto y lavar la máscara.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 46 (Hoja 39)",
    "apartado": "PT03 amianto · 10. Lavado en lavandería central › 10.3"
  },
  {
    "id": "CPEI-T40-PT03-185",
    "orden": 2110,
    "concepto": "¿Qué se aconseja hacer con la ropa que se ponen los trabajadores al final de la descontaminación y por qué?",
    "respuesta": "Depositarla en los contenedores correspondientes para limpiarla en lavadora, porque al manejar los sacos herméticos con los EPI o por contacto con superficies de la zona afectada se ha podido contaminar con fibras de amianto, con riesgo para el propio bombero y para terceros.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 46 (Hoja 39)",
    "apartado": "PT03 amianto · 10. Lavado en lavandería central › 10.3"
  },
  {
    "id": "CPEI-T40-PT03-186",
    "orden": 2120,
    "concepto": "¿Por qué no se considera necesaria una instalación de ventilación en la sala de descontaminación?",
    "respuesta": "Por la escasa frecuencia de esta operación (no más de 1/2 veces por año) y por haberse realizado una descontaminación previa de los equipos.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 46 (Hoja 39)",
    "apartado": "PT03 amianto · 10. Lavado en lavandería central › Nota: sala de descontaminación"
  },
  {
    "id": "CPEI-T40-PT03-187",
    "orden": 2130,
    "concepto": "¿Qué formación necesita el personal que intervenga según el PT03?",
    "respuesta": "1) Curso básico de prevención de riesgos laborales. 2) Curso de riesgos y medidas preventivas en trabajos con exposición a amianto.",
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)",
    "localizacion": "PDF p. 46 (Hoja 39)",
    "apartado": "PT03 amianto · 11. Formación"
  }
];

if (TEMA40_RECALL_CARDS.length !== TEMA40_RECALL_META.count) {
  throw new Error(
    `Expected ${TEMA40_RECALL_META.count} tema-40 cards, got ${TEMA40_RECALL_CARDS.length}`,
  );
}
