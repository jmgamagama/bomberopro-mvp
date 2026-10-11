/** Tema 8 recall cards — fase 2: generadas SOLO desde el texto oficial consolidado (INSST-T33, INSST-T12-EXPLOSIONES). Calidad: data/tema08/tema08_calidad.md. */

export type Tema8RecallCard = {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
};

export const TEMA8_RECALL_META = {
  "tema": 8,
  "title": "Tema 8 · Teoría del fuego y explosiones (documentos del INSST)",
  "count": 25,
  "source": "Fase 4 · INSST, temas oficiales del proceso selectivo: «El riesgo de incendio (I)» (v. abril 2025) y «Explosiones» (2026), insst.es"
} as const;

export const TEMA8_RECALL_CARDS: Tema8RecallCard[] = [
  {
    "id": "CPEI-T08-OF-16F2F066",
    "orden": 10,
    "concepto": "Según el INSST (tema «El riesgo de incendio»), ¿qué es la combustión?",
    "respuesta": "Una reacción química de oxidación-reducción fuertemente exotérmica",
    "fuente": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 1. INSST-T33, texto consolidado (últ. actualización 30/04/2025): https://www.insst.es/documents/d/portal-insst/tema-33-el-riesgo-de-incendio-i-#p01",
    "localizacion": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 1",
    "apartado": "Química del fuego y propagación"
  },
  {
    "id": "CPEI-T08-OF-91F289AD",
    "orden": 20,
    "concepto": "Según el INSST (tema «El riesgo de incendio»), ¿cuál es el material oxidante más frecuente en la combustión?",
    "respuesta": "El oxígeno",
    "fuente": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 1. INSST-T33, texto consolidado (últ. actualización 30/04/2025): https://www.insst.es/documents/d/portal-insst/tema-33-el-riesgo-de-incendio-i-#p01",
    "localizacion": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 1",
    "apartado": "Química del fuego y propagación"
  },
  {
    "id": "CPEI-T08-OF-5B548AE4",
    "orden": 30,
    "concepto": "Según el INSST (tema «El riesgo de incendio»), ¿cómo se llama la reacción cuya velocidad del frente de llamas es inferior a 1 m por segundo?",
    "respuesta": "Combustión",
    "fuente": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 2. INSST-T33, texto consolidado (últ. actualización 30/04/2025): https://www.insst.es/documents/d/portal-insst/tema-33-el-riesgo-de-incendio-i-#p02",
    "localizacion": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 2",
    "apartado": "Química del fuego y propagación"
  },
  {
    "id": "CPEI-T08-OF-56E9FF59",
    "orden": 40,
    "concepto": "Según el INSST (tema «El riesgo de incendio»), ¿cómo se llama la reacción cuya velocidad del frente de llamas es superior a 1 m por segundo?",
    "respuesta": "Deflagración",
    "fuente": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 2. INSST-T33, texto consolidado (últ. actualización 30/04/2025): https://www.insst.es/documents/d/portal-insst/tema-33-el-riesgo-de-incendio-i-#p02",
    "localizacion": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 2",
    "apartado": "Química del fuego y propagación"
  },
  {
    "id": "CPEI-T08-OF-E159B5F5",
    "orden": 50,
    "concepto": "Según el INSST (tema «El riesgo de incendio»), ¿cómo se llama la reacción cuya velocidad del frente de llamas es superior a la del sonido?",
    "respuesta": "Detonación",
    "fuente": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 2. INSST-T33, texto consolidado (últ. actualización 30/04/2025): https://www.insst.es/documents/d/portal-insst/tema-33-el-riesgo-de-incendio-i-#p02",
    "localizacion": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 2",
    "apartado": "Química del fuego y propagación"
  },
  {
    "id": "CPEI-T08-OF-FC925796",
    "orden": 60,
    "concepto": "Según el INSST (tema «El riesgo de incendio»), ¿qué forma de transmisión del calor se produce por ondas electromagnéticas sin ningún soporte material?",
    "respuesta": "Radiación",
    "fuente": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 2. INSST-T33, texto consolidado (últ. actualización 30/04/2025): https://www.insst.es/documents/d/portal-insst/tema-33-el-riesgo-de-incendio-i-#p02",
    "localizacion": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 2",
    "apartado": "Química del fuego y propagación"
  },
  {
    "id": "CPEI-T08-OF-A79F178A",
    "orden": 70,
    "concepto": "Según el INSST (tema «El riesgo de incendio»), ¿qué forma de transmisión del calor se produce por el movimiento de fluidos?",
    "respuesta": "Convección",
    "fuente": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 2. INSST-T33, texto consolidado (últ. actualización 30/04/2025): https://www.insst.es/documents/d/portal-insst/tema-33-el-riesgo-de-incendio-i-#p02",
    "localizacion": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 2",
    "apartado": "Química del fuego y propagación"
  },
  {
    "id": "CPEI-T08-OF-44E769FD",
    "orden": 80,
    "concepto": "Según el INSST (tema «El riesgo de incendio»), ¿en qué concentración está presente el oxígeno en la atmósfera?",
    "respuesta": "En un 21%",
    "fuente": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 2. INSST-T33, texto consolidado (últ. actualización 30/04/2025): https://www.insst.es/documents/d/portal-insst/tema-33-el-riesgo-de-incendio-i-#p02",
    "localizacion": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 2",
    "apartado": "Química del fuego y propagación"
  },
  {
    "id": "CPEI-T08-OF-103C15A5",
    "orden": 90,
    "concepto": "Según el INSST (tema «El riesgo de incendio»), ¿por debajo de qué contenido de oxígeno en el aire la combustión es imposible?",
    "respuesta": "Por debajo del 15%",
    "fuente": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 2. INSST-T33, texto consolidado (últ. actualización 30/04/2025): https://www.insst.es/documents/d/portal-insst/tema-33-el-riesgo-de-incendio-i-#p02",
    "localizacion": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 2",
    "apartado": "Química del fuego y propagación"
  },
  {
    "id": "CPEI-T08-OF-8BD47893",
    "orden": 100,
    "concepto": "Según el INSST (tema «El riesgo de incendio»), ¿qué orígenes pueden tener los focos de la energía de activación?",
    "respuesta": "De origen térmico, eléctrico, químico o mecánico",
    "fuente": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 2. INSST-T33, texto consolidado (últ. actualización 30/04/2025): https://www.insst.es/documents/d/portal-insst/tema-33-el-riesgo-de-incendio-i-#p02",
    "localizacion": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 2",
    "apartado": "Química del fuego y propagación"
  },
  {
    "id": "CPEI-T08-OF-B266B117",
    "orden": 110,
    "concepto": "Según el INSST (tema «El riesgo de incendio»), ¿qué cuarto elemento convierte el triángulo en «tetraedro del fuego»?",
    "respuesta": "La reacción en cadena",
    "fuente": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 3. INSST-T33, texto consolidado (últ. actualización 30/04/2025): https://www.insst.es/documents/d/portal-insst/tema-33-el-riesgo-de-incendio-i-#p03",
    "localizacion": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 3",
    "apartado": "Química del fuego y propagación"
  },
  {
    "id": "CPEI-T08-OF-6287D3B5",
    "orden": 120,
    "concepto": "Según el INSST (tema «El riesgo de incendio»), ¿cómo puede ser la propagación del incendio según su dirección?",
    "respuesta": "De forma horizontal o vertical",
    "fuente": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 3. INSST-T33, texto consolidado (últ. actualización 30/04/2025): https://www.insst.es/documents/d/portal-insst/tema-33-el-riesgo-de-incendio-i-#p03",
    "localizacion": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 3",
    "apartado": "Química del fuego y propagación"
  },
  {
    "id": "CPEI-T08-OF-852F8894",
    "orden": 130,
    "concepto": "Según el INSST (tema «El riesgo de incendio»), ¿a través de qué se produce la propagación vertical entre plantas?",
    "respuesta": "A través de ventanas, conducciones de aire o huecos de ascensores",
    "fuente": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 3. INSST-T33, texto consolidado (últ. actualización 30/04/2025): https://www.insst.es/documents/d/portal-insst/tema-33-el-riesgo-de-incendio-i-#p03",
    "localizacion": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 3",
    "apartado": "Química del fuego y propagación"
  },
  {
    "id": "CPEI-T08-OF-2EC01104",
    "orden": 140,
    "concepto": "Según el INSST (tema «El riesgo de incendio»), ¿qué norma se sigue para clasificar los fuegos según la naturaleza del combustible?",
    "respuesta": "UNE-EN 2:1994/A1:2005",
    "fuente": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 3. INSST-T33, texto consolidado (últ. actualización 30/04/2025): https://www.insst.es/documents/d/portal-insst/tema-33-el-riesgo-de-incendio-i-#p03",
    "localizacion": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 3",
    "apartado": "Clasificación de los fuegos"
  },
  {
    "id": "CPEI-T08-OF-8DBF8D55",
    "orden": 150,
    "concepto": "Según el INSST (tema «El riesgo de incendio»), ¿qué naturaleza de combustible corresponde a la clase D?",
    "respuesta": "Metales",
    "fuente": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 3. INSST-T33, texto consolidado (últ. actualización 30/04/2025): https://www.insst.es/documents/d/portal-insst/tema-33-el-riesgo-de-incendio-i-#p03",
    "localizacion": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 3",
    "apartado": "Clasificación de los fuegos"
  },
  {
    "id": "CPEI-T08-OF-26C9E93E",
    "orden": 160,
    "concepto": "Según el INSST (tema «El riesgo de incendio»), ¿qué naturaleza de combustible corresponde a la clase C?",
    "respuesta": "Gases",
    "fuente": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 3. INSST-T33, texto consolidado (últ. actualización 30/04/2025): https://www.insst.es/documents/d/portal-insst/tema-33-el-riesgo-de-incendio-i-#p03",
    "localizacion": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 3",
    "apartado": "Clasificación de los fuegos"
  },
  {
    "id": "CPEI-T08-OF-C02B24A7",
    "orden": 170,
    "concepto": "Según el INSST (tema «El riesgo de incendio»), ¿qué ejemplos de combustible se dan para la clase F?",
    "respuesta": "Grasas y aceites vegetales y animales",
    "fuente": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 3. INSST-T33, texto consolidado (últ. actualización 30/04/2025): https://www.insst.es/documents/d/portal-insst/tema-33-el-riesgo-de-incendio-i-#p03",
    "localizacion": "INSST, Tema 33 «El riesgo de incendio (I)», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. abril 2025, pág. 3",
    "apartado": "Clasificación de los fuegos"
  },
  {
    "id": "CPEI-T08-OF-AF362425",
    "orden": 180,
    "concepto": "Según el INSST (tema «Explosiones»), ¿qué sustancias tienen capacidad para formar atmósferas explosivas?",
    "respuesta": "Gases, líquidos inflamables y polvos combustibles",
    "fuente": "INSST, Tema 12 «Explosiones», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. enero 2026, pág. 1. INSST-T12-EXPLOSIONES, texto consolidado (últ. actualización 22/03/2026): https://www.insst.es/documents/d/portal-insst/tema-41-explosiones#p01",
    "localizacion": "INSST, Tema 12 «Explosiones», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. enero 2026, pág. 1",
    "apartado": "Explosiones e inflamabilidad"
  },
  {
    "id": "CPEI-T08-OF-CA82C01C",
    "orden": 190,
    "concepto": "Según el INSST (tema «Explosiones»), ¿cómo se clasifican las explosiones?",
    "respuesta": "En deflagraciones y detonaciones",
    "fuente": "INSST, Tema 12 «Explosiones», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. enero 2026, pág. 1. INSST-T12-EXPLOSIONES, texto consolidado (últ. actualización 22/03/2026): https://www.insst.es/documents/d/portal-insst/tema-41-explosiones#p01",
    "localizacion": "INSST, Tema 12 «Explosiones», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. enero 2026, pág. 1",
    "apartado": "Explosiones e inflamabilidad"
  },
  {
    "id": "CPEI-T08-OF-A9BCB495",
    "orden": 200,
    "concepto": "Según el INSST (tema «Explosiones»), ¿a qué velocidad se propaga una deflagración?",
    "respuesta": "A velocidad subsónica",
    "fuente": "INSST, Tema 12 «Explosiones», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. enero 2026, pág. 1. INSST-T12-EXPLOSIONES, texto consolidado (últ. actualización 22/03/2026): https://www.insst.es/documents/d/portal-insst/tema-41-explosiones#p01",
    "localizacion": "INSST, Tema 12 «Explosiones», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. enero 2026, pág. 1",
    "apartado": "Explosiones e inflamabilidad"
  },
  {
    "id": "CPEI-T08-OF-42858129",
    "orden": 210,
    "concepto": "Según el INSST (tema «Explosiones»), ¿a qué velocidad se propaga una detonación?",
    "respuesta": "A velocidad supersónica",
    "fuente": "INSST, Tema 12 «Explosiones», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. enero 2026, pág. 1. INSST-T12-EXPLOSIONES, texto consolidado (últ. actualización 22/03/2026): https://www.insst.es/documents/d/portal-insst/tema-41-explosiones#p01",
    "localizacion": "INSST, Tema 12 «Explosiones», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. enero 2026, pág. 1",
    "apartado": "Explosiones e inflamabilidad"
  },
  {
    "id": "CPEI-T08-OF-E3377122",
    "orden": 220,
    "concepto": "Según el INSST (tema «Explosiones»), ¿qué efecto de la explosión resulta del impacto de objetos y fragmentos en el cuerpo?",
    "respuesta": "Secundario",
    "fuente": "INSST, Tema 12 «Explosiones», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. enero 2026, pág. 2. INSST-T12-EXPLOSIONES, texto consolidado (últ. actualización 22/03/2026): https://www.insst.es/documents/d/portal-insst/tema-41-explosiones#p02",
    "localizacion": "INSST, Tema 12 «Explosiones», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. enero 2026, pág. 2",
    "apartado": "Explosiones e inflamabilidad"
  },
  {
    "id": "CPEI-T08-OF-E02CD674",
    "orden": 230,
    "concepto": "Según el INSST (tema «Explosiones»), ¿qué es el punto de inflamación?",
    "respuesta": "La temperatura mínima, en condiciones normales de presión, a la cual se desprende la suficiente cantidad de vapores del líquido para que se produzca la inflamación mediante la aportación de un foco de ignición",
    "fuente": "INSST, Tema 12 «Explosiones», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. enero 2026, pág. 5. INSST-T12-EXPLOSIONES, texto consolidado (últ. actualización 22/03/2026): https://www.insst.es/documents/d/portal-insst/tema-41-explosiones#p05",
    "localizacion": "INSST, Tema 12 «Explosiones», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. enero 2026, pág. 5",
    "apartado": "Explosiones e inflamabilidad"
  },
  {
    "id": "CPEI-T08-OF-E2B5A638",
    "orden": 240,
    "concepto": "Según el INSST (tema «Explosiones»), ¿qué es el Límite Inferior de Explosividad (LIE)?",
    "respuesta": "La concentración de sustancia en el aire por debajo de la cual la atmósfera no es explosiva",
    "fuente": "INSST, Tema 12 «Explosiones», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. enero 2026, pág. 5. INSST-T12-EXPLOSIONES, texto consolidado (últ. actualización 22/03/2026): https://www.insst.es/documents/d/portal-insst/tema-41-explosiones#p05",
    "localizacion": "INSST, Tema 12 «Explosiones», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. enero 2026, pág. 5",
    "apartado": "Explosiones e inflamabilidad"
  },
  {
    "id": "CPEI-T08-OF-E6EB4A37",
    "orden": 250,
    "concepto": "Según el INSST (tema «Explosiones»), ¿qué es el Límite Superior de Explosividad (LSE)?",
    "respuesta": "La concentración de sustancia en el aire por encima de la cual la atmósfera no es explosiva",
    "fuente": "INSST, Tema 12 «Explosiones», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. enero 2026, pág. 5. INSST-T12-EXPLOSIONES, texto consolidado (últ. actualización 22/03/2026): https://www.insst.es/documents/d/portal-insst/tema-41-explosiones#p05",
    "localizacion": "INSST, Tema 12 «Explosiones», Temas específicos del Proceso Selectivo para ingreso en la Escala de Titulados Superiores del Instituto Nacional de Seguridad e Higiene en el Trabajo, O.A., M.P. (INSST). Parte 2: “Seguridad en el trabajo”. V. enero 2026, pág. 5",
    "apartado": "Explosiones e inflamabilidad"
  }
];
