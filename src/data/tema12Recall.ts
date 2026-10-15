/** Tema 12 recall cards — fase 2: generadas SOLO desde el texto oficial consolidado (BOE-A-2017-6606, INSST-T33). Calidad: data/tema12/tema12_calidad.md. */

export type Tema12RecallCard = {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
};

export const TEMA12_RECALL_META = {
  "tema": 12,
  "title": "Tema 12 · Mecanismos de extinción, agentes y extintores (RIPCI e INSST)",
  "count": 21,
  "source": "Fase 4 · RD 513/2017, RIPCI (BOE-A-2017-6606), últ. act. 19/12/2025; INSST, tema «El riesgo de incendio (I)» (v. abril 2025)"
} as const;

export const TEMA12_RECALL_CARDS: Tema12RecallCard[] = [
  {
    "id": "CPEI-T12-OF-01AA23CD",
    "orden": 10,
    "concepto": "Según el INSST (tema «El riesgo de incendio»), ¿qué ocurre si se introduce un elemento químico que interfiera en la reacción en cadena?",
    "respuesta": "Esta se parará",
    "fuente": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 3. INSST-T33, texto consolidado (últ. actualización 30/04/2025): https://www.insst.es/documents/d/portal-insst/tema-33-el-riesgo-de-incendio-i-#p03",
    "localizacion": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 3",
    "apartado": "Mecanismos de extinción"
  },
  {
    "id": "CPEI-T12-OF-A4DBE918",
    "orden": 20,
    "concepto": "Según el INSST (tema «El riesgo de incendio»), ¿qué hacen los gases halocarbonados con el calor sobre la reacción en cadena?",
    "respuesta": "Se descomponen en elementos que se combinan con los átomos de hidrógeno, oxígeno y los radicales OH liberados, inhibiendo la reacción en cadena",
    "fuente": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 3. INSST-T33, texto consolidado (últ. actualización 30/04/2025): https://www.insst.es/documents/d/portal-insst/tema-33-el-riesgo-de-incendio-i-#p03",
    "localizacion": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 3",
    "apartado": "Mecanismos de extinción"
  },
  {
    "id": "CPEI-T12-OF-591B1F12",
    "orden": 30,
    "concepto": "Según el INSST (tema «El riesgo de incendio»), ¿qué agentes extintores no son aceptables en presencia de tensión eléctrica?",
    "respuesta": "El agua a chorro ni la espuma",
    "fuente": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 4. INSST-T33, texto consolidado (últ. actualización 30/04/2025): https://www.insst.es/documents/d/portal-insst/tema-33-el-riesgo-de-incendio-i-#p04",
    "localizacion": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 4",
    "apartado": "Agentes extintores"
  },
  {
    "id": "CPEI-T12-OF-395A3760",
    "orden": 40,
    "concepto": "Según el INSST (tema «El riesgo de incendio»), según la UNE-EN 3-7, ¿qué extintores no se consideran adecuados para fuegos de clase F?",
    "respuesta": "Los extintores de polvo y dióxido",
    "fuente": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 4. INSST-T33, texto consolidado (últ. actualización 30/04/2025): https://www.insst.es/documents/d/portal-insst/tema-33-el-riesgo-de-incendio-i-#p04",
    "localizacion": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 4",
    "apartado": "Agentes extintores"
  },
  {
    "id": "CPEI-T12-OF-1464CEF3",
    "orden": 50,
    "concepto": "Según el INSST (tema «El riesgo de incendio»), ¿qué norma recoge el ensayo dieléctrico de los extintores?",
    "respuesta": "UNE-EN 3-7:2004+A1:2008",
    "fuente": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 4. INSST-T33, texto consolidado (últ. actualización 30/04/2025): https://www.insst.es/documents/d/portal-insst/tema-33-el-riesgo-de-incendio-i-#p04",
    "localizacion": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 4",
    "apartado": "Agentes extintores"
  },
  {
    "id": "CPEI-T12-OF-E9CB6455",
    "orden": 60,
    "concepto": "Según el RIPCI, ¿qué es un extintor de incendio?",
    "respuesta": "Un equipo que contiene un agente extintor, que puede proyectarse y dirigirse sobre un fuego, por la acción de una presión interna",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 4.1. BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 4.1",
    "apartado": "Extintores portátiles y móviles"
  },
  {
    "id": "CPEI-T12-OF-44DFF2E3",
    "orden": 70,
    "concepto": "Según el RIPCI, ¿cómo puede producirse la presión interna del extintor?",
    "respuesta": "Por una compresión previa permanente o mediante la liberación de un gas auxiliar",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 4.1. BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 4.1",
    "apartado": "Extintores portátiles y móviles"
  },
  {
    "id": "CPEI-T12-OF-209335C7",
    "orden": 80,
    "concepto": "Según el RIPCI, ¿qué masa máxima en condiciones de funcionamiento tiene un extintor portátil?",
    "respuesta": "Una masa igual o inferior a 20 kg",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 4.1.a). BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 4.1.a)",
    "apartado": "Extintores portátiles y móviles"
  },
  {
    "id": "CPEI-T12-OF-CA03FAFA",
    "orden": 90,
    "concepto": "Según el RIPCI, ¿qué es un extintor móvil?",
    "respuesta": "Diseñado para ser transportado y accionado a mano, está montado sobre ruedas y tiene una masa total de más de 20 kg",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 4.1.b). BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 4.1.b)",
    "apartado": "Extintores portátiles y móviles"
  },
  {
    "id": "CPEI-T12-OF-999CD458",
    "orden": 100,
    "concepto": "Según el RIPCI, ¿qué real decreto rige las características de los extintores como equipos a presión?",
    "respuesta": "Real Decreto 709/2015",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 4.2. BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 4.2",
    "apartado": "Extintores portátiles y móviles"
  },
  {
    "id": "CPEI-T12-OF-91E57829",
    "orden": 110,
    "concepto": "Según el RIPCI, ¿qué normas deben justificar los extintores portátiles mediante certificación?",
    "respuesta": "UNE-EN 3-7 y UNE-EN 3-10",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 4.3. BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 4.3",
    "apartado": "Extintores portátiles y móviles"
  },
  {
    "id": "CPEI-T12-OF-13CBB8FD",
    "orden": 120,
    "concepto": "Según el RIPCI, ¿qué norma deben cumplir los extintores móviles?",
    "respuesta": "UNE-EN 1866-1",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 4.3. BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 4.3",
    "apartado": "Extintores portátiles y móviles"
  },
  {
    "id": "CPEI-T12-OF-AA12AF8B",
    "orden": 130,
    "concepto": "Según el RIPCI, ¿entre qué alturas debe quedar la parte superior del extintor sobre el suelo?",
    "respuesta": "Entre 80 cm y 120 cm",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 4.4. BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 4.4",
    "apartado": "Extintores portátiles y móviles"
  },
  {
    "id": "CPEI-T12-OF-1BF10959",
    "orden": 140,
    "concepto": "Según el RIPCI, ¿qué recorrido máximo horizontal hasta un extintor no debe superarse desde un origen de evacuación?",
    "respuesta": "15 m",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 4.4. BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 4.4",
    "apartado": "Extintores portátiles y móviles"
  },
  {
    "id": "CPEI-T12-OF-7BF769F8",
    "orden": 150,
    "concepto": "Según el RIPCI, ¿dónde se situarán preferentemente los extintores?",
    "respuesta": "Sobre soportes fijados a paramentos verticales",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 4.4. BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 4.4",
    "apartado": "Extintores portátiles y móviles"
  },
  {
    "id": "CPEI-T12-OF-ED8D35EF",
    "orden": 160,
    "concepto": "Según el RIPCI, ¿qué norma establece las clases de fuego normalizadas?",
    "respuesta": "UNE-EN 2",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 4.5. BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 4.5",
    "apartado": "Agentes extintores"
  },
  {
    "id": "CPEI-T12-OF-9668B921",
    "orden": 170,
    "concepto": "Según el RIPCI, ¿qué fuegos son de clase A?",
    "respuesta": "Fuegos de materiales sólidos, generalmente de naturaleza orgánica, cuya combinación se realiza normalmente con la formación de brasas",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 4.5.a). BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 4.5.a)",
    "apartado": "Agentes extintores"
  },
  {
    "id": "CPEI-T12-OF-7141FC19",
    "orden": 180,
    "concepto": "Según el RIPCI, ¿qué fuegos son de clase B?",
    "respuesta": "Fuegos de líquidos o de sólidos licuables",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 4.5.b). BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 4.5.b)",
    "apartado": "Agentes extintores"
  },
  {
    "id": "CPEI-T12-OF-9B89AC74",
    "orden": 190,
    "concepto": "Según el RIPCI, ¿qué fuegos son de clase F?",
    "respuesta": "Fuegos derivados de la utilización de ingredientes para cocinar (aceites y grasas vegetales o animales) en los aparatos de cocina",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 4.5.e). BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 4.5.e)",
    "apartado": "Agentes extintores"
  },
  {
    "id": "CPEI-T12-OF-0A0D9A0A",
    "orden": 200,
    "concepto": "Según el RIPCI, ¿qué requieren los generadores de aerosoles para poder usarse como extintores, además de cumplir el RD 1381/2009?",
    "respuesta": "Una evaluación técnica favorable de la idoneidad para su uso previsto",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 4.6. BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 4.6",
    "apartado": "Extintores portátiles y móviles"
  },
  {
    "id": "CPEI-T12-OF-43D24ECA",
    "orden": 210,
    "concepto": "Según el RIPCI, si el extintor está dentro de un armario, ¿dónde se coloca su señalización?",
    "respuesta": "Inmediatamente junto al armario, y no sobre la superficie del mismo",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 4.7. BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 4.7",
    "apartado": "Extintores portátiles y móviles"
  }
];
