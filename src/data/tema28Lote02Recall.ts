/** Tema 28 recall cards — fase 2: generadas SOLO desde el texto oficial consolidado (BOE-A-2002-18099, BOE-A-2014-6084, BOE-A-2001-11881, INSST-NTP400). Calidad: data/tema28/tema28_lote02_calidad.md. */

export type Tema28RecallCard = {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
};

export const TEMA28_LOTE02_RECALL_META = {
  "tema": 28,
  "lote": "lote02",
  "title": "Tema 28 · lote 2: alumbrado público, puesta a tierra, contactos, alta tensión y efectos de la corriente (REBT, RD 337/2014, RD 614/2001 y NTP 400)",
  "count": 74,
  "source": "Huecos CEP 38 · REBT (ITC-BT-09, 18 y 24), RD 337/2014 (ITC-RAT 01, 14 y 15), RD 614/2001 y NTP 400 (INSST); boe.es e insst.es"
} as const;

export const TEMA28_LOTE02_RECALL_CARDS: Tema28RecallCard[] = [
  {
    "id": "CPEI-T28-OF-E339E84F",
    "orden": 10,
    "concepto": "Según la ITC-BT-09 del REBT, ¿qué instalaciones de iluminación se excluyen de su ámbito cuando son completamente autónomas?",
    "respuesta": "La instalación para la iluminación de fuentes y piscinas y las de los semáforos y las balizas",
    "fuente": "REBT (RD 842/2002), ITC-BT-09, apdo. 1. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#ib-9",
    "localizacion": "REBT (RD 842/2002), ITC-BT-09, apdo. 1",
    "apartado": "Alumbrado público (ITC-BT-09)"
  },
  {
    "id": "CPEI-T28-OF-A6C2A71A",
    "orden": 20,
    "concepto": "Según la ITC-BT-09 del REBT, ¿dónde finaliza la acometida del alumbrado exterior?",
    "respuesta": "En la caja general de protección",
    "fuente": "REBT (RD 842/2002), ITC-BT-09, apdo. 2. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#ib-9",
    "localizacion": "REBT (RD 842/2002), ITC-BT-09, apdo. 2",
    "apartado": "Alumbrado público (ITC-BT-09)"
  },
  {
    "id": "CPEI-T28-OF-6281F7FB",
    "orden": 30,
    "concepto": "Según la ITC-BT-09 del REBT, ¿cuál es la máxima caída de tensión admitida entre el origen y cualquier punto de la instalación?",
    "respuesta": "Menor o igual que 3%",
    "fuente": "REBT (RD 842/2002), ITC-BT-09, apdo. 3. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#ib-9",
    "localizacion": "REBT (RD 842/2002), ITC-BT-09, apdo. 3",
    "apartado": "Alumbrado público (ITC-BT-09)"
  },
  {
    "id": "CPEI-T28-OF-4B2D1704",
    "orden": 40,
    "concepto": "Según la ITC-BT-09 del REBT, ¿cuál es como máximo el umbral de desconexión de los interruptores diferenciales del cuadro de alumbrado?",
    "respuesta": "Como máximo de 300 mA",
    "fuente": "REBT (RD 842/2002), ITC-BT-09, apdo. 4. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#ib-9",
    "localizacion": "REBT (RD 842/2002), ITC-BT-09, apdo. 4",
    "apartado": "Alumbrado público (ITC-BT-09)"
  },
  {
    "id": "CPEI-T28-OF-89326964",
    "orden": 50,
    "concepto": "Según la ITC-BT-09 del REBT, con diferenciales de 300 mA, ¿qué resistencia de puesta a tierra máxima se admite en la puesta en servicio?",
    "respuesta": "Como máximo de 30 Ω",
    "fuente": "REBT (RD 842/2002), ITC-BT-09, apdo. 4. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#ib-9",
    "localizacion": "REBT (RD 842/2002), ITC-BT-09, apdo. 4",
    "apartado": "Alumbrado público (ITC-BT-09)"
  },
  {
    "id": "CPEI-T28-OF-685B023F",
    "orden": 60,
    "concepto": "Según la ITC-BT-09 del REBT, si el alumbrado se acciona con interruptores horarios o fotoeléctricos, ¿qué otro interruptor debe haber?",
    "respuesta": "Un interruptor manual que permita el accionamiento del sistema, con independencia de los dispositivos citados",
    "fuente": "REBT (RD 842/2002), ITC-BT-09, apdo. 4. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#ib-9",
    "localizacion": "REBT (RD 842/2002), ITC-BT-09, apdo. 4",
    "apartado": "Alumbrado público (ITC-BT-09)"
  },
  {
    "id": "CPEI-T28-OF-E7D8048A",
    "orden": 70,
    "concepto": "Según la ITC-BT-09 del REBT, ¿a qué altura debe estar la puerta de acceso del cuadro de protección, medida y control?",
    "respuesta": "A una altura comprendida entre 2m y 0,3 m",
    "fuente": "REBT (RD 842/2002), ITC-BT-09, apdo. 4. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#ib-9",
    "localizacion": "REBT (RD 842/2002), ITC-BT-09, apdo. 4",
    "apartado": "Alumbrado público (ITC-BT-09)"
  },
  {
    "id": "CPEI-T28-OF-32BA0D44",
    "orden": 80,
    "concepto": "Según la ITC-BT-09 del REBT, ¿qué tensión asignada deben tener los cables de las redes de alimentación?",
    "respuesta": "Tensión asignada de 0,6/1 kV",
    "fuente": "REBT (RD 842/2002), ITC-BT-09, apdo. 5.1. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#ib-9",
    "localizacion": "REBT (RD 842/2002), ITC-BT-09, apdo. 5.1",
    "apartado": "Alumbrado público (ITC-BT-09)"
  },
  {
    "id": "CPEI-T28-OF-A0BA9470",
    "orden": 90,
    "concepto": "Según la ITC-BT-09 del REBT, ¿a qué profundidad mínima van enterrados los tubos de las redes subterráneas?",
    "respuesta": "A una profundidad mínima de 0,4 m del nivel del suelo medidos desde la cota inferior del tubo",
    "fuente": "REBT (RD 842/2002), ITC-BT-09, apdo. 5.2.1. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#ib-9",
    "localizacion": "REBT (RD 842/2002), ITC-BT-09, apdo. 5.2.1",
    "apartado": "Alumbrado público (ITC-BT-09)"
  },
  {
    "id": "CPEI-T28-OF-D2F07A81",
    "orden": 100,
    "concepto": "Según la ITC-BT-09 del REBT, en los cruzamientos de calzadas, ¿cómo irá la canalización?",
    "respuesta": "Además de entubada, irá hormigonada y se instalará como mínimo un tubo de reserva",
    "fuente": "REBT (RD 842/2002), ITC-BT-09, apdo. 5.2.1. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#ib-9",
    "localizacion": "REBT (RD 842/2002), ITC-BT-09, apdo. 5.2.1",
    "apartado": "Alumbrado público (ITC-BT-09)"
  },
  {
    "id": "CPEI-T28-OF-765966B3",
    "orden": 110,
    "concepto": "Según la ITC-BT-09 del REBT, ¿con qué coeficiente de seguridad se dimensionan los soportes frente a las solicitaciones mecánicas?",
    "respuesta": "Con un coeficiente de seguridad no inferior a 2,5",
    "fuente": "REBT (RD 842/2002), ITC-BT-09, apdo. 6.1. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#ib-9",
    "localizacion": "REBT (RD 842/2002), ITC-BT-09, apdo. 6.1",
    "apartado": "Alumbrado público (ITC-BT-09)"
  },
  {
    "id": "CPEI-T28-OF-000CEF02",
    "orden": 120,
    "concepto": "Según la ITC-BT-09 del REBT, ¿cuál es la altura mínima de las luminarias suspendidas sobre el nivel del suelo?",
    "respuesta": "La altura mínima sobre el nivel del suelo será de 6 m",
    "fuente": "REBT (RD 842/2002), ITC-BT-09, apdo. 7.2. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#ib-9",
    "localizacion": "REBT (RD 842/2002), ITC-BT-09, apdo. 7.2",
    "apartado": "Alumbrado público (ITC-BT-09)"
  },
  {
    "id": "CPEI-T28-OF-F86B9051",
    "orden": 130,
    "concepto": "Según la ITC-BT-09 del REBT, ¿a qué altura mínima se montan los equipos eléctricos exteriores de los puntos de luz?",
    "respuesta": "A una altura mínima de 2,5 m sobre el nivel del suelo",
    "fuente": "REBT (RD 842/2002), ITC-BT-09, apdo. 8. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#ib-9",
    "localizacion": "REBT (RD 842/2002), ITC-BT-09, apdo. 8",
    "apartado": "Alumbrado público (ITC-BT-09)"
  },
  {
    "id": "CPEI-T28-OF-C14D15D5",
    "orden": 140,
    "concepto": "Según la ITC-BT-09 del REBT, ¿qué clase deben tener las luminarias?",
    "respuesta": "Las luminarias serán de Clase I o de Clase II",
    "fuente": "REBT (RD 842/2002), ITC-BT-09, apdo. 9. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#ib-9",
    "localizacion": "REBT (RD 842/2002), ITC-BT-09, apdo. 9",
    "apartado": "Alumbrado público (ITC-BT-09)"
  },
  {
    "id": "CPEI-T28-OF-FB98FBFD",
    "orden": 150,
    "concepto": "Según la ITC-BT-09 del REBT, ¿qué partes metálicas del mobiliario urbano próximo al alumbrado deben ponerse a tierra?",
    "respuesta": "Las que estén a una distancia inferior a 2 m de las partes metálicas de la instalación de alumbrado exterior y que sean susceptibles de ser tocadas simultáneamente",
    "fuente": "REBT (RD 842/2002), ITC-BT-09, apdo. 9. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#ib-9",
    "localizacion": "REBT (RD 842/2002), ITC-BT-09, apdo. 9",
    "apartado": "Alumbrado público (ITC-BT-09)"
  },
  {
    "id": "CPEI-T28-OF-E93CB6A2",
    "orden": 160,
    "concepto": "Según la ITC-BT-09 del REBT, ¿qué tensión de contacto no debe producirse en las partes metálicas accesibles del alumbrado exterior?",
    "respuesta": "Tensiones de contacto mayores de 24 V",
    "fuente": "REBT (RD 842/2002), ITC-BT-09, apdo. 10. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#ib-9",
    "localizacion": "REBT (RD 842/2002), ITC-BT-09, apdo. 10",
    "apartado": "Alumbrado público (ITC-BT-09)"
  },
  {
    "id": "CPEI-T28-OF-ED71CE26",
    "orden": 170,
    "concepto": "Según la ITC-BT-09 del REBT, ¿cada cuántos soportes de luminarias se instala como mínimo un electrodo de puesta a tierra?",
    "respuesta": "Cada 5 soportes de luminarias, y siempre en el primero y en el último soporte de cada línea",
    "fuente": "REBT (RD 842/2002), ITC-BT-09, apdo. 10. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#ib-9",
    "localizacion": "REBT (RD 842/2002), ITC-BT-09, apdo. 10",
    "apartado": "Alumbrado público (ITC-BT-09)"
  },
  {
    "id": "CPEI-T28-OF-397FE2F9",
    "orden": 180,
    "concepto": "Según la ITC-BT-18 del REBT, ¿con qué objeto se establecen principalmente las puestas a tierra?",
    "respuesta": "Con objeto de limitar la tensión que, con respecto a tierra, puedan presentar en un momento dado las masas metálicas, asegurar la actuación de las protecciones y eliminar o disminuir el riesgo que supone una avería en los materiales eléctricos utilizados",
    "fuente": "REBT (RD 842/2002), ITC-BT-18, apdo. 1. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#ib-18",
    "localizacion": "REBT (RD 842/2002), ITC-BT-18, apdo. 1",
    "apartado": "Puesta a tierra (ITC-BT-18)"
  },
  {
    "id": "CPEI-T28-OF-9DCFA9E6",
    "orden": 190,
    "concepto": "Según la ITC-BT-18 del REBT, ¿cómo se define la puesta o conexión a tierra?",
    "respuesta": "La unión eléctrica directa, sin fusibles ni protección alguna, de una parte del circuito eléctrico o de una parte conductora no perteneciente al mismo mediante una toma de tierra con un electrodo o grupos de electrodos enterrados en el suelo",
    "fuente": "REBT (RD 842/2002), ITC-BT-18, apdo. 2. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#ib-18",
    "localizacion": "REBT (RD 842/2002), ITC-BT-18, apdo. 2",
    "apartado": "Puesta a tierra (ITC-BT-18)"
  },
  {
    "id": "CPEI-T28-OF-1A9709A6",
    "orden": 200,
    "concepto": "Según la ITC-BT-18 del REBT, ¿a qué profundidad mínima se entierran las tomas de tierra?",
    "respuesta": "La profundidad nunca será inferior a 0,50 m",
    "fuente": "REBT (RD 842/2002), ITC-BT-18, apdo. 3.1. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#ib-18",
    "localizacion": "REBT (RD 842/2002), ITC-BT-18, apdo. 3.1",
    "apartado": "Puesta a tierra (ITC-BT-18)"
  },
  {
    "id": "CPEI-T28-OF-23856FDC",
    "orden": 210,
    "concepto": "Según la ITC-BT-18 del REBT, ¿qué canalizaciones no deben utilizarse como tomas de tierra por razones de seguridad?",
    "respuesta": "Las canalizaciones metálicas de otros servicios (agua, líquidos o gases inflamables, calefacción central, etc.)",
    "fuente": "REBT (RD 842/2002), ITC-BT-18, apdo. 3.1. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#ib-18",
    "localizacion": "REBT (RD 842/2002), ITC-BT-18, apdo. 3.1",
    "apartado": "Puesta a tierra (ITC-BT-18)"
  },
  {
    "id": "CPEI-T28-OF-08003AF4",
    "orden": 220,
    "concepto": "Según la ITC-BT-18 del REBT, ¿para qué sirven los conductores de protección?",
    "respuesta": "Para unir eléctricamente las masas de una instalación a ciertos elementos con el fin de asegurar la protección contra contactos indirectos",
    "fuente": "REBT (RD 842/2002), ITC-BT-18, apdo. 3.4. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#ib-18",
    "localizacion": "REBT (RD 842/2002), ITC-BT-18, apdo. 3.4",
    "apartado": "Puesta a tierra (ITC-BT-18)"
  },
  {
    "id": "CPEI-T28-OF-2F41C9AB",
    "orden": 230,
    "concepto": "Según la ITC-BT-18 del REBT, ¿qué tensión de contacto máxima puede dar lugar cualquier masa en local o emplazamiento conductor?",
    "respuesta": "24 V en local o emplazamiento conductor",
    "fuente": "REBT (RD 842/2002), ITC-BT-18, apdo. 9. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#ib-18",
    "localizacion": "REBT (RD 842/2002), ITC-BT-18, apdo. 9",
    "apartado": "Puesta a tierra (ITC-BT-18)"
  },
  {
    "id": "CPEI-T28-OF-9968FA8A",
    "orden": 240,
    "concepto": "Según la ITC-BT-18 del REBT, fuera de los locales conductores, ¿qué tensión de contacto máxima puede dar cualquier masa?",
    "respuesta": "50 V en los demás casos",
    "fuente": "REBT (RD 842/2002), ITC-BT-18, apdo. 9. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#ib-18",
    "localizacion": "REBT (RD 842/2002), ITC-BT-18, apdo. 9",
    "apartado": "Puesta a tierra (ITC-BT-18)"
  },
  {
    "id": "CPEI-T28-OF-EA85D22A",
    "orden": 250,
    "concepto": "Según la ITC-BT-18 del REBT, ¿de qué depende la resistencia de un electrodo?",
    "respuesta": "De sus dimensiones, de su forma y de la resistividad del terreno en el que se establece",
    "fuente": "REBT (RD 842/2002), ITC-BT-18, apdo. 9. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#ib-18",
    "localizacion": "REBT (RD 842/2002), ITC-BT-18, apdo. 9",
    "apartado": "Puesta a tierra (ITC-BT-18)"
  },
  {
    "id": "CPEI-T28-OF-36341CFA",
    "orden": 260,
    "concepto": "Según la ITC-BT-18 del REBT, ¿con qué frecuencia mínima se comprueba la instalación de puesta a tierra y en qué época?",
    "respuesta": "Al menos anualmente, en la época en la que el terreno esté mas seco",
    "fuente": "REBT (RD 842/2002), ITC-BT-18, apdo. 12. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#ib-18",
    "localizacion": "REBT (RD 842/2002), ITC-BT-18, apdo. 12",
    "apartado": "Puesta a tierra (ITC-BT-18)"
  },
  {
    "id": "CPEI-T28-OF-47A77DCE",
    "orden": 270,
    "concepto": "Según la ITC-BT-18 del REBT, donde el terreno no favorece la conservación de los electrodos, ¿cada cuánto se ponen al descubierto para examinarlos?",
    "respuesta": "Al menos una vez cada cinco años",
    "fuente": "REBT (RD 842/2002), ITC-BT-18, apdo. 12. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#ib-18",
    "localizacion": "REBT (RD 842/2002), ITC-BT-18, apdo. 12",
    "apartado": "Puesta a tierra (ITC-BT-18)"
  },
  {
    "id": "CPEI-T28-OF-49021570",
    "orden": 280,
    "concepto": "Según la ITC-BT-24 del REBT, ¿cómo se realiza la protección contra contactos directos e indirectos a la vez?",
    "respuesta": "Mediante la utilización de muy baja tensión de seguridad MBTS",
    "fuente": "REBT (RD 842/2002), ITC-BT-24, apdo. 2. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#ib-24",
    "localizacion": "REBT (RD 842/2002), ITC-BT-24, apdo. 2",
    "apartado": "Contactos directos e indirectos (ITC-BT-24)"
  },
  {
    "id": "CPEI-T28-OF-6647E784",
    "orden": 290,
    "concepto": "Según la ITC-BT-24 del REBT, ¿en qué consiste la protección contra contactos directos?",
    "respuesta": "En tomar las medidas destinadas a proteger las personas contra los peligros que pueden derivarse de un contacto con las partes activas de los materiales eléctricos",
    "fuente": "REBT (RD 842/2002), ITC-BT-24, apdo. 3. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#ib-24",
    "localizacion": "REBT (RD 842/2002), ITC-BT-24, apdo. 3",
    "apartado": "Contactos directos e indirectos (ITC-BT-24)"
  },
  {
    "id": "CPEI-T28-OF-5E0ADABC",
    "orden": 300,
    "concepto": "Según la ITC-BT-24 del REBT, ¿qué productos no se consideran aislamiento suficiente frente a contactos directos?",
    "respuesta": "Las pinturas, barnices, lacas y productos similares",
    "fuente": "REBT (RD 842/2002), ITC-BT-24, apdo. 3.1. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#ib-24",
    "localizacion": "REBT (RD 842/2002), ITC-BT-24, apdo. 3.1",
    "apartado": "Contactos directos e indirectos (ITC-BT-24)"
  },
  {
    "id": "CPEI-T28-OF-4EB4CB9A",
    "orden": 310,
    "concepto": "Según la ITC-BT-24 del REBT, por convenio, ¿qué altura limita el volumen de accesibilidad?",
    "respuesta": "La altura que limita el volumen es 2,5 m",
    "fuente": "REBT (RD 842/2002), ITC-BT-24, apdo. 3.4. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#ib-24",
    "localizacion": "REBT (RD 842/2002), ITC-BT-24, apdo. 3.4",
    "apartado": "Contactos directos e indirectos (ITC-BT-24)"
  },
  {
    "id": "CPEI-T28-OF-D9A8CFAB",
    "orden": 320,
    "concepto": "Según la ITC-BT-24 del REBT, ¿qué corriente diferencial asignada deben tener los diferenciales para reconocerse como protección complementaria frente a contactos directos?",
    "respuesta": "Inferior o igual a 30 mA",
    "fuente": "REBT (RD 842/2002), ITC-BT-24, apdo. 3.5. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#ib-24",
    "localizacion": "REBT (RD 842/2002), ITC-BT-24, apdo. 3.5",
    "apartado": "Contactos directos e indirectos (ITC-BT-24)"
  },
  {
    "id": "CPEI-T28-OF-BFF3BE45",
    "orden": 330,
    "concepto": "Según la ITC-BT-24 del REBT, ¿cuál es la tensión límite convencional en condiciones normales?",
    "respuesta": "Igual a 50 V, valor eficaz en corriente alterna",
    "fuente": "REBT (RD 842/2002), ITC-BT-24, apdo. 4.1. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#ib-24",
    "localizacion": "REBT (RD 842/2002), ITC-BT-24, apdo. 4.1",
    "apartado": "Contactos directos e indirectos (ITC-BT-24)"
  },
  {
    "id": "CPEI-T28-OF-4AC28F11",
    "orden": 340,
    "concepto": "Según la ITC-BT-24 del REBT, en los esquemas TN-C, ¿qué dispositivos de protección no pueden utilizarse?",
    "respuesta": "Dispositivos de protección de corriente diferencial-residual",
    "fuente": "REBT (RD 842/2002), ITC-BT-24, apdo. 4.1.1. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#ib-24",
    "localizacion": "REBT (RD 842/2002), ITC-BT-24, apdo. 4.1.1",
    "apartado": "Contactos directos e indirectos (ITC-BT-24)"
  },
  {
    "id": "CPEI-T28-OF-2EFF82F2",
    "orden": 350,
    "concepto": "Según el RD 337/2014 de alta tensión, ¿qué se considera alta tensión?",
    "respuesta": "Toda tensión nominal superior a 1 kV",
    "fuente": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 01, def. 1. BOE-A-2014-6084, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2014-6084#ir",
    "localizacion": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 01, def. 1",
    "apartado": "Alta tensión: centros de transformación y subestaciones (RD 337/2014)"
  },
  {
    "id": "CPEI-T28-OF-E8A62635",
    "orden": 360,
    "concepto": "Según el RD 337/2014 de alta tensión, ¿qué es una central eléctrica?",
    "respuesta": "Lugar y conjunto de instalaciones, incluidas las construcciones de obra civil y edificios necesarios, utilizadas directa e indirectamente para la producción de energía eléctrica",
    "fuente": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 01, def. 8. BOE-A-2014-6084, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2014-6084#ir",
    "localizacion": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 01, def. 8",
    "apartado": "Alta tensión: centros de transformación y subestaciones (RD 337/2014)"
  },
  {
    "id": "CPEI-T28-OF-BB03F902",
    "orden": 370,
    "concepto": "Según el RD 337/2014 de alta tensión, ¿qué es un centro de transformación?",
    "respuesta": "Instalación que comprende uno o varios transformadores, aparamenta de alta tensión y de baja tensión, conexiones y elementos auxiliares, para suministrar energía en BT a partir de una red de AT o viceversa",
    "fuente": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 01, def. 9. BOE-A-2014-6084, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2014-6084#ir",
    "localizacion": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 01, def. 9",
    "apartado": "Alta tensión: centros de transformación y subestaciones (RD 337/2014)"
  },
  {
    "id": "CPEI-T28-OF-2270C722",
    "orden": 380,
    "concepto": "Según el RD 337/2014 de alta tensión, ¿qué instalaciones quedan excluidas de la definición de subestación?",
    "respuesta": "Quedan excluidos de esta definición los centros de transformación",
    "fuente": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 01, def. 72. BOE-A-2014-6084, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2014-6084#ir",
    "localizacion": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 01, def. 72",
    "apartado": "Alta tensión: centros de transformación y subestaciones (RD 337/2014)"
  },
  {
    "id": "CPEI-T28-OF-8F6F609E",
    "orden": 390,
    "concepto": "Según el RD 337/2014 de alta tensión, ¿a qué se destina una subestación de maniobra?",
    "respuesta": "Es la destinada a la conexión entre dos o más circuitos y su maniobra",
    "fuente": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 01, def. 73. BOE-A-2014-6084, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2014-6084#ir",
    "localizacion": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 01, def. 73",
    "apartado": "Alta tensión: centros de transformación y subestaciones (RD 337/2014)"
  },
  {
    "id": "CPEI-T28-OF-4864CD5A",
    "orden": 400,
    "concepto": "Según el RD 337/2014 de alta tensión, ¿cuál es la finalidad principal de una subestación móvil?",
    "respuesta": "El socorro temporal de la red de alta tensión ante contingencias o situaciones especiales de servicio",
    "fuente": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 01, def. 75. BOE-A-2014-6084, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2014-6084#ir",
    "localizacion": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 01, def. 75",
    "apartado": "Alta tensión: centros de transformación y subestaciones (RD 337/2014)"
  },
  {
    "id": "CPEI-T28-OF-41329495",
    "orden": 410,
    "concepto": "Según el RD 337/2014 de alta tensión, ¿qué asegura un seccionador en posición abierto?",
    "respuesta": "Una distancia de seccionamiento que satisface unas condiciones especificas de aislamiento",
    "fuente": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 01, def. 67. BOE-A-2014-6084, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2014-6084#ir",
    "localizacion": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 01, def. 67",
    "apartado": "Alta tensión: centros de transformación y subestaciones (RD 337/2014)"
  },
  {
    "id": "CPEI-T28-OF-68531797",
    "orden": 420,
    "concepto": "Según el RD 337/2014 de alta tensión, ¿qué es capaz de interrumpir un interruptor automático además de lo que hace un interruptor?",
    "respuesta": "Corrientes en condiciones anormales especificadas del circuito, tales como las del cortocircuito",
    "fuente": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 01, def. 43. BOE-A-2014-6084, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2014-6084#ir",
    "localizacion": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 01, def. 43",
    "apartado": "Alta tensión: centros de transformación y subestaciones (RD 337/2014)"
  },
  {
    "id": "CPEI-T28-OF-D122D0CC",
    "orden": 430,
    "concepto": "Según el RD 337/2014 de alta tensión, ¿qué es la tensión de paso?",
    "respuesta": "Es la parte de la tensión a tierra que aparece en caso de un defecto a tierra entre dos puntos del terreno separados un metro",
    "fuente": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 01, def. 82. BOE-A-2014-6084, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2014-6084#ir",
    "localizacion": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 01, def. 82",
    "apartado": "Alta tensión: centros de transformación y subestaciones (RD 337/2014)"
  },
  {
    "id": "CPEI-T28-OF-4D6A8407",
    "orden": 440,
    "concepto": "Según el RD 337/2014 de alta tensión, ¿qué es la tensión de contacto?",
    "respuesta": "Es la fracción de la tensión de puesta a tierra que puede ser puenteada por una persona entre la mano y un punto del terreno situado a un metro de separación o entre ambas manos",
    "fuente": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 01, def. 79. BOE-A-2014-6084, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2014-6084#ir",
    "localizacion": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 01, def. 79",
    "apartado": "Alta tensión: centros de transformación y subestaciones (RD 337/2014)"
  },
  {
    "id": "CPEI-T28-OF-48507632",
    "orden": 450,
    "concepto": "Según el RD 337/2014 de alta tensión, al calcular la tensión de paso aplicada, ¿en cuánto se estima la resistencia del cuerpo humano?",
    "respuesta": "En 1000 ohmios",
    "fuente": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 01, def. 83. BOE-A-2014-6084, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2014-6084#ir",
    "localizacion": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 01, def. 83",
    "apartado": "Alta tensión: centros de transformación y subestaciones (RD 337/2014)"
  },
  {
    "id": "CPEI-T28-OF-F5FA018F",
    "orden": 460,
    "concepto": "Según el RD 337/2014 de alta tensión, ¿para qué se hace la puesta a tierra de protección?",
    "respuesta": "A fin de proteger a las personas contra contactos con tensiones peligrosas",
    "fuente": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 01, def. 55. BOE-A-2014-6084, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2014-6084#ir",
    "localizacion": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 01, def. 55",
    "apartado": "Alta tensión: centros de transformación y subestaciones (RD 337/2014)"
  },
  {
    "id": "CPEI-T28-OF-2B9C9569",
    "orden": 470,
    "concepto": "Según el RD 337/2014 de alta tensión, ¿qué es la zona de protección?",
    "respuesta": "Es el espacio comprendido entre los límites de los lugares accesibles, por un lado, y los elementos que se encuentran bajo tensión, por otro",
    "fuente": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 01, def. 97. BOE-A-2014-6084, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2014-6084#ir",
    "localizacion": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 01, def. 97",
    "apartado": "Alta tensión: centros de transformación y subestaciones (RD 337/2014)"
  },
  {
    "id": "CPEI-T28-OF-A2B97847",
    "orden": 480,
    "concepto": "Según el RD 337/2014 de alta tensión, ¿qué hace un transformador para distribución?",
    "respuesta": "Transforma un sistema de corrientes en Alta Tensión en otro en Baja Tensión",
    "fuente": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 01, def. 96. BOE-A-2014-6084, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2014-6084#ir",
    "localizacion": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 01, def. 96",
    "apartado": "Alta tensión: centros de transformación y subestaciones (RD 337/2014)"
  },
  {
    "id": "CPEI-T28-OF-EB85F87F",
    "orden": 490,
    "concepto": "Según el RD 337/2014 de alta tensión, en instalaciones de interior, ¿a partir de qué cantidad de dieléctrico líquido en un aparato o transformador hace falta foso de recogida?",
    "respuesta": "Más de 50 litros de dieléctrico líquido",
    "fuente": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 14, apdo. 5.1.a. BOE-A-2014-6084, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2014-6084#ir-14",
    "localizacion": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 14, apdo. 5.1.a",
    "apartado": "Alta tensión: centros de transformación y subestaciones (RD 337/2014)"
  },
  {
    "id": "CPEI-T28-OF-AD615E0C",
    "orden": 500,
    "concepto": "Según el RD 337/2014 de alta tensión, si no es obligatorio un sistema fijo, ¿qué extintor mínimo se coloca en una instalación de alta tensión de interior?",
    "respuesta": "Como mínimo un extintor de eficacia mínima 89B",
    "fuente": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 14, apdo. 5.1.b.1. BOE-A-2014-6084, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2014-6084#ir-14",
    "localizacion": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 14, apdo. 5.1.b.1",
    "apartado": "Alta tensión: centros de transformación y subestaciones (RD 337/2014)"
  },
  {
    "id": "CPEI-T28-OF-5EC67773",
    "orden": 510,
    "concepto": "Según el RD 337/2014 de alta tensión, ¿a qué distancia máxima de una instalación de alta tensión de interior debe colocarse el extintor móvil?",
    "respuesta": "A una distancia no superior a 15 metros de la misma",
    "fuente": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 14, apdo. 5.1.b.1. BOE-A-2014-6084, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2014-6084#ir-14",
    "localizacion": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 14, apdo. 5.1.b.1",
    "apartado": "Alta tensión: centros de transformación y subestaciones (RD 337/2014)"
  },
  {
    "id": "CPEI-T28-OF-7333E620",
    "orden": 520,
    "concepto": "Según el RD 337/2014 de alta tensión, si la instalación está en un edificio destinado a otros usos, ¿qué eficacia mínima debe tener el extintor?",
    "respuesta": "La eficacia será como mínimo 21A-113B",
    "fuente": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 14, apdo. 5.1.b.1. BOE-A-2014-6084, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2014-6084#ir-14",
    "localizacion": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 14, apdo. 5.1.b.1",
    "apartado": "Alta tensión: centros de transformación y subestaciones (RD 337/2014)"
  },
  {
    "id": "CPEI-T28-OF-12EB9C79",
    "orden": 530,
    "concepto": "Según el RD 337/2014 de alta tensión, ¿cuántos extintores debe llevar en sus vehículos el personal itinerante de mantenimiento?",
    "respuesta": "Dos extintores de eficacia mínima 89B",
    "fuente": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 14, apdo. 5.1.b.1. BOE-A-2014-6084, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2014-6084#ir-14",
    "localizacion": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 14, apdo. 5.1.b.1",
    "apartado": "Alta tensión: centros de transformación y subestaciones (RD 337/2014)"
  },
  {
    "id": "CPEI-T28-OF-12F03733",
    "orden": 540,
    "concepto": "Según el RD 337/2014 de alta tensión, al elegir los extintores de una instalación de alta tensión de exterior, ¿qué se tendrá en cuenta?",
    "respuesta": "Si van a ser usados en instalaciones en tensión o no",
    "fuente": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 15, apdo. 6.1. BOE-A-2014-6084, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2014-6084#ir-15",
    "localizacion": "RD 337/2014 (alta tensión), INSTRUCCIÓN TÉCNICA COMPLEMENTARIA ITC-RAT 15, apdo. 6.1",
    "apartado": "Alta tensión: centros de transformación y subestaciones (RD 337/2014)"
  },
  {
    "id": "CPEI-T28-OF-C9CF24A1",
    "orden": 550,
    "concepto": "Según el RD 614/2001, ¿qué operaciones pueden realizarse en tensión cuando su naturaleza así lo exija?",
    "respuesta": "Las maniobras, mediciones, ensayos y verificaciones",
    "fuente": "RD 614/2001, Artículo 4. Técnicas y procedimientos de trabajo, art. 4.4.a. BOE-A-2001-11881, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2001-11881#a4",
    "localizacion": "RD 614/2001, Artículo 4. Técnicas y procedimientos de trabajo, art. 4.4.a",
    "apartado": "Riesgo eléctrico en el trabajo (RD 614/2001)"
  },
  {
    "id": "CPEI-T28-OF-11A9C47E",
    "orden": 560,
    "concepto": "Según el RD 614/2001, ¿cuál es el último paso del proceso de reposición de la tensión?",
    "respuesta": "El cierre de los circuitos para reponer la tensión",
    "fuente": "RD 614/2001, anexo II.A.2. BOE-A-2001-11881, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2001-11881#anii",
    "localizacion": "RD 614/2001, anexo II.A.2",
    "apartado": "Riesgo eléctrico en el trabajo (RD 614/2001)"
  },
  {
    "id": "CPEI-T28-OF-25976E0E",
    "orden": 570,
    "concepto": "Según el RD 614/2001, durante un trabajo sin tensión, ¿desde cuándo se considera de nuevo en tensión la parte de la instalación afectada?",
    "respuesta": "Desde el momento en que se suprima una de las medidas inicialmente adoptadas para realizar el trabajo sin tensión en condiciones de seguridad",
    "fuente": "RD 614/2001, anexo II.A.2. BOE-A-2001-11881, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2001-11881#anii",
    "localizacion": "RD 614/2001, anexo II.A.2",
    "apartado": "Riesgo eléctrico en el trabajo (RD 614/2001)"
  },
  {
    "id": "CPEI-T28-OF-BE6C6497",
    "orden": 580,
    "concepto": "Según el RD 614/2001, antes de manipular en el interior de un motor eléctrico o generador, ¿qué debe comprobarse sobre la protección contra incendios?",
    "respuesta": "Que la protección contra incendios está bloqueada",
    "fuente": "RD 614/2001, anexo II.B.4. BOE-A-2001-11881, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2001-11881#anii",
    "localizacion": "RD 614/2001, anexo II.B.4",
    "apartado": "Riesgo eléctrico en el trabajo (RD 614/2001)"
  },
  {
    "id": "CPEI-T28-OF-96E0A808",
    "orden": 590,
    "concepto": "Según el RD 614/2001, en emplazamientos con atmósfera explosiva, ¿qué trabajos quedan prohibidos salvo con instalaciones y equipos concebidos para ello?",
    "respuesta": "La realización de trabajos u operaciones (cambio de lámparas, fusibles, etc.) en tensión",
    "fuente": "RD 614/2001, anexo VI.A.1. BOE-A-2001-11881, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2001-11881#anvi",
    "localizacion": "RD 614/2001, anexo VI.A.1",
    "apartado": "Riesgo eléctrico en el trabajo (RD 614/2001)"
  },
  {
    "id": "CPEI-T28-OF-E449508D",
    "orden": 600,
    "concepto": "Según el RD 614/2001, si se produce un incendio en un emplazamiento con riesgo de incendio o explosión, ¿en qué casos no se desconectan las partes afectadas de la instalación?",
    "respuesta": "Salvo que sea necesario dejarlas en tensión para actuar contra el incendio, o que la desconexión conlleve peligros potencialmente más graves que los que pueden derivarse del propio incendio",
    "fuente": "RD 614/2001, anexo VI.A.2. BOE-A-2001-11881, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2001-11881#anvi",
    "localizacion": "RD 614/2001, anexo VI.A.2",
    "apartado": "Riesgo eléctrico en el trabajo (RD 614/2001)"
  },
  {
    "id": "CPEI-T28-OF-F6786B11",
    "orden": 610,
    "concepto": "Según el RD 614/2001, ¿qué trabajadores realizan los trabajos que deban hacerse en una atmósfera explosiva?",
    "respuesta": "Trabajadores cualificados",
    "fuente": "RD 614/2001, anexo VI.A.3. BOE-A-2001-11881, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2001-11881#anvi",
    "localizacion": "RD 614/2001, anexo VI.A.3",
    "apartado": "Riesgo eléctrico en el trabajo (RD 614/2001)"
  },
  {
    "id": "CPEI-T28-OF-1EDCC219",
    "orden": 620,
    "concepto": "Según el RD 614/2001, ¿qué conexión se hace de los materiales susceptibles de adquirir carga electrostática?",
    "respuesta": "Conexión a tierra, y entre sí cuando sea necesario",
    "fuente": "RD 614/2001, anexo VI.B.2. BOE-A-2001-11881, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2001-11881#anvi",
    "localizacion": "RD 614/2001, anexo VI.B.2",
    "apartado": "Riesgo eléctrico en el trabajo (RD 614/2001)"
  },
  {
    "id": "CPEI-T28-OF-21518B3F",
    "orden": 630,
    "concepto": "Según la NTP 400 del INSST, ¿cuál es la causa esencial de los accidentes mortales debidos a la electricidad?",
    "respuesta": "La «fibrilación ventricular»",
    "fuente": "NTP 400 (INSST), Efectos de la corriente, pág. 1. INSST, NTP 400: Corriente eléctrica: efectos al atravesar el organismo humano (1996); texto íntegro oficial (1996): https://www.insst.es/documents/94886/7873632/ntp_400.pdf#page=1",
    "localizacion": "NTP 400 (INSST), Efectos de la corriente, pág. 1",
    "apartado": "Efectos de la corriente en el cuerpo humano (NTP 400)"
  },
  {
    "id": "CPEI-T28-OF-887BC3C3",
    "orden": 640,
    "concepto": "Según la NTP 400 del INSST, ¿cuándo se produce la electrocución?",
    "respuesta": "Cuando dicha persona fallece debido al paso de la corriente por su cuerpo",
    "fuente": "NTP 400 (INSST), Efectos de la corriente, pág. 1. INSST, NTP 400: Corriente eléctrica: efectos al atravesar el organismo humano (1996); texto íntegro oficial (1996): https://www.insst.es/documents/94886/7873632/ntp_400.pdf#page=1",
    "localizacion": "NTP 400 (INSST), Efectos de la corriente, pág. 1",
    "apartado": "Efectos de la corriente en el cuerpo humano (NTP 400)"
  },
  {
    "id": "CPEI-T28-OF-7916E057",
    "orden": 650,
    "concepto": "Según la NTP 400 del INSST, ¿qué se entiende por tetanización?",
    "respuesta": "El movimiento incontrolado de los músculos como consecuencia del paso de la energía eléctrica",
    "fuente": "NTP 400 (INSST), Efectos de la corriente, pág. 1. INSST, NTP 400: Corriente eléctrica: efectos al atravesar el organismo humano (1996); texto íntegro oficial (1996): https://www.insst.es/documents/94886/7873632/ntp_400.pdf#page=1",
    "localizacion": "NTP 400 (INSST), Efectos de la corriente, pág. 1",
    "apartado": "Efectos de la corriente en el cuerpo humano (NTP 400)"
  },
  {
    "id": "CPEI-T28-OF-D3CAD79A",
    "orden": 660,
    "concepto": "Según la NTP 400 del INSST, ¿cuándo se produce la asfixia por paso de corriente?",
    "respuesta": "Cuando el paso de la corriente afecta al centro nervioso que regula la función respiratoria",
    "fuente": "NTP 400 (INSST), Efectos de la corriente, pág. 1. INSST, NTP 400: Corriente eléctrica: efectos al atravesar el organismo humano (1996); texto íntegro oficial (1996): https://www.insst.es/documents/94886/7873632/ntp_400.pdf#page=1",
    "localizacion": "NTP 400 (INSST), Efectos de la corriente, pág. 1",
    "apartado": "Efectos de la corriente en el cuerpo humano (NTP 400)"
  },
  {
    "id": "CPEI-T28-OF-AAD97119",
    "orden": 670,
    "concepto": "Según la NTP 400 del INSST, ¿qué valor de umbral de percepción en corriente alterna considera la norma CEI 479-1?",
    "respuesta": "Un valor de 0,5 mA en corriente alterna",
    "fuente": "NTP 400 (INSST), Intensidad de la corriente, pág. 3. INSST, NTP 400: Corriente eléctrica: efectos al atravesar el organismo humano (1996); texto íntegro oficial (1996): https://www.insst.es/documents/94886/7873632/ntp_400.pdf#page=3",
    "localizacion": "NTP 400 (INSST), Intensidad de la corriente, pág. 3",
    "apartado": "Efectos de la corriente en el cuerpo humano (NTP 400)"
  },
  {
    "id": "CPEI-T28-OF-9BC8BC24",
    "orden": 680,
    "concepto": "Según la NTP 400 del INSST, ¿qué es el umbral de reacción?",
    "respuesta": "Es el valor mínimo de la corriente que provoca una contracción muscular",
    "fuente": "NTP 400 (INSST), Intensidad de la corriente, pág. 3. INSST, NTP 400: Corriente eléctrica: efectos al atravesar el organismo humano (1996); texto íntegro oficial (1996): https://www.insst.es/documents/94886/7873632/ntp_400.pdf#page=3",
    "localizacion": "NTP 400 (INSST), Intensidad de la corriente, pág. 3",
    "apartado": "Efectos de la corriente en el cuerpo humano (NTP 400)"
  },
  {
    "id": "CPEI-T28-OF-C1C27976",
    "orden": 690,
    "concepto": "Según la NTP 400 del INSST, ¿qué valor máximo se considera para el umbral de no soltar en corriente alterna?",
    "respuesta": "Un valor máximo de 10 mA",
    "fuente": "NTP 400 (INSST), Intensidad de la corriente, pág. 3. INSST, NTP 400: Corriente eléctrica: efectos al atravesar el organismo humano (1996); texto íntegro oficial (1996): https://www.insst.es/documents/94886/7873632/ntp_400.pdf#page=3",
    "localizacion": "NTP 400 (INSST), Intensidad de la corriente, pág. 3",
    "apartado": "Efectos de la corriente en el cuerpo humano (NTP 400)"
  },
  {
    "id": "CPEI-T28-OF-54CF5404",
    "orden": 700,
    "concepto": "Según la NTP 400 del INSST, ¿qué porcentaje del ciclo cardíaco supone el período vulnerable?",
    "respuesta": "Aproximadamente un 10% del ciclo cardíaco completo",
    "fuente": "NTP 400 (INSST), Período vulnerable, pág. 3. INSST, NTP 400: Corriente eléctrica: efectos al atravesar el organismo humano (1996); texto íntegro oficial (1996): https://www.insst.es/documents/94886/7873632/ntp_400.pdf#page=3",
    "localizacion": "NTP 400 (INSST), Período vulnerable, pág. 3",
    "apartado": "Efectos de la corriente en el cuerpo humano (NTP 400)"
  },
  {
    "id": "CPEI-T28-OF-3D6693BE",
    "orden": 710,
    "concepto": "Según la NTP 400 del INSST, en corriente alterna e intensidades inferiores a 100 mA, ¿a partir de qué tiempo de exposición puede producirse la fibrilación?",
    "respuesta": "Si el tiempo de exposición es superior a 500 ms",
    "fuente": "NTP 400 (INSST), Duración del contacto eléctrico, pág. 4. INSST, NTP 400: Corriente eléctrica: efectos al atravesar el organismo humano (1996); texto íntegro oficial (1996): https://www.insst.es/documents/94886/7873632/ntp_400.pdf#page=4",
    "localizacion": "NTP 400 (INSST), Duración del contacto eléctrico, pág. 4",
    "apartado": "Efectos de la corriente en el cuerpo humano (NTP 400)"
  },
  {
    "id": "CPEI-T28-OF-E6962F89",
    "orden": 720,
    "concepto": "Según la NTP 400 del INSST, ¿qué tres impedancias en serie forman la impedancia del cuerpo durante el paso de la electricidad?",
    "respuesta": "Impedancia de la piel en la zona de entrada. Impedancia interna del cuerpo. ● Impedancia de la piel en la zona de salida",
    "fuente": "NTP 400 (INSST), Impedancia del cuerpo humano, pág. 4. INSST, NTP 400: Corriente eléctrica: efectos al atravesar el organismo humano (1996); texto íntegro oficial (1996): https://www.insst.es/documents/94886/7873632/ntp_400.pdf#page=4",
    "localizacion": "NTP 400 (INSST), Impedancia del cuerpo humano, pág. 4",
    "apartado": "Efectos de la corriente en el cuerpo humano (NTP 400)"
  },
  {
    "id": "CPEI-T28-OF-A5F36376",
    "orden": 730,
    "concepto": "Según la NTP 400 del INSST, ¿por qué la corriente continua, en general, es menos peligrosa que la alterna?",
    "respuesta": "Es más fácil soltar los electrodos sujetos con la mano y que para duraciones de contacto superiores al período del ciclo cardiaco, el umbral de fibrilación ventricular es mucho más elevado que en corriente alterna",
    "fuente": "NTP 400 (INSST), Frecuencia de la corriente alterna, pág. 7. INSST, NTP 400: Corriente eléctrica: efectos al atravesar el organismo humano (1996); texto íntegro oficial (1996): https://www.insst.es/documents/94886/7873632/ntp_400.pdf#page=7",
    "localizacion": "NTP 400 (INSST), Frecuencia de la corriente alterna, pág. 7",
    "apartado": "Efectos de la corriente en el cuerpo humano (NTP 400)"
  },
  {
    "id": "CPEI-T28-OF-CA271CF9",
    "orden": 740,
    "concepto": "Según la NTP 400 del INSST, ¿qué recorridos de la corriente ocasionan los mayores daños?",
    "respuesta": "Aquellos recorridos que atraviesan el tórax o la cabeza",
    "fuente": "NTP 400 (INSST), Recorrido de la corriente, pág. 7. INSST, NTP 400: Corriente eléctrica: efectos al atravesar el organismo humano (1996); texto íntegro oficial (1996): https://www.insst.es/documents/94886/7873632/ntp_400.pdf#page=7",
    "localizacion": "NTP 400 (INSST), Recorrido de la corriente, pág. 7",
    "apartado": "Efectos de la corriente en el cuerpo humano (NTP 400)"
  }
];
