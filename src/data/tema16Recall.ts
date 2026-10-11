/** Tema 16 recall cards — solo el subconjunto OACI/UIT (48), revisado ficha a ficha (data/tema16/tema16_calidad.md). Do not load all 9392. */

export type Tema16RecallCard = {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
};

export const TEMA16_RECALL_META = {
  "tema": 16,
  "title": "Tema 16 · El código ICAO (alfabeto radiotelefónico) y códigos Q de la UIT",
  "count": 48,
  "source": "BASE MIRA tema 16, subconjunto OACI/UIT revisado ficha a ficha (RR UIT 2024 ap. 14 y art. 32/53, Rec. UIT-R M.1172, OACI Anexo 10 vol. II)"
} as const;

export const TEMA16_RECALL_CARDS: Tema16RecallCard[] = [
  {
    "id": "CPEI-T16-S04-6897FCDA30",
    "orden": 440,
    "concepto": "¿Cuándo usar el alfabeto radiotelefónico ICAO?",
    "respuesta": "Para nombres, matrículas, códigos o letras que puedan confundirse.",
    "fuente": "OACI, Anexo 10 / fraseología aeronáutica",
    "localizacion": "alfabeto radiotelefónico",
    "apartado": "Deletreo"
  },
  {
    "id": "CPEI-T16-S05-1E8A511BA6",
    "orden": 490,
    "concepto": "¿Qué tráfico prevalece en el orden de prioridad de las comunicaciones?",
    "respuesta": "Socorro/emergencia y seguridad sobre tráfico rutinario.",
    "fuente": "UIT, Reglamento de Radiocomunicaciones y Apéndice 14",
    "localizacion": "alfabeto y códigos operativos",
    "apartado": "Prioridad"
  },
  {
    "id": "CPEI-T16-S05-026BE7449D",
    "orden": 520,
    "concepto": "¿Cuándo se emplea MAYDAY?",
    "respuesta": "Solo conforme al procedimiento para peligro grave e inminente; no banalizar.",
    "fuente": "UIT, Reglamento de Radiocomunicaciones y Apéndice 14",
    "localizacion": "alfabeto y códigos operativos",
    "apartado": "Mayday"
  },
  {
    "id": "CPEI-T16-S07-EC1BA94DC8",
    "orden": 730,
    "concepto": "¿Cómo se deletrea la letra A en ICAO?",
    "respuesta": "Alfa",
    "fuente": "OACI, Anexo 10 / fraseología aeronáutica",
    "localizacion": "alfabeto radiotelefónico",
    "apartado": "A"
  },
  {
    "id": "CPEI-T16-S07-0626FA56F1",
    "orden": 740,
    "concepto": "¿Cómo se deletrea la letra B en ICAO?",
    "respuesta": "Bravo",
    "fuente": "OACI, Anexo 10 / fraseología aeronáutica",
    "localizacion": "alfabeto radiotelefónico",
    "apartado": "B"
  },
  {
    "id": "CPEI-T16-S07-3F28FA8E25",
    "orden": 750,
    "concepto": "¿Cómo se deletrea la letra C en ICAO?",
    "respuesta": "Charlie",
    "fuente": "OACI, Anexo 10 / fraseología aeronáutica",
    "localizacion": "alfabeto radiotelefónico",
    "apartado": "C"
  },
  {
    "id": "CPEI-T16-S07-D676BDE556",
    "orden": 760,
    "concepto": "¿Cómo se deletrea la letra D en ICAO?",
    "respuesta": "Delta",
    "fuente": "OACI, Anexo 10 / fraseología aeronáutica",
    "localizacion": "alfabeto radiotelefónico",
    "apartado": "D"
  },
  {
    "id": "CPEI-T16-S07-3FD3C61768",
    "orden": 770,
    "concepto": "¿Cómo se deletrea la letra E en ICAO?",
    "respuesta": "Echo",
    "fuente": "OACI, Anexo 10 / fraseología aeronáutica",
    "localizacion": "alfabeto radiotelefónico",
    "apartado": "E"
  },
  {
    "id": "CPEI-T16-S07-907E56D232",
    "orden": 780,
    "concepto": "¿Cómo se deletrea la letra F en ICAO?",
    "respuesta": "Foxtrot",
    "fuente": "OACI, Anexo 10 / fraseología aeronáutica",
    "localizacion": "alfabeto radiotelefónico",
    "apartado": "F"
  },
  {
    "id": "CPEI-T16-S07-569F5C5B0A",
    "orden": 790,
    "concepto": "¿Cómo se deletrea la letra G en ICAO?",
    "respuesta": "Golf",
    "fuente": "OACI, Anexo 10 / fraseología aeronáutica",
    "localizacion": "alfabeto radiotelefónico",
    "apartado": "G"
  },
  {
    "id": "CPEI-T16-S07-2428EB70E5",
    "orden": 800,
    "concepto": "¿Cómo se deletrea la letra H en ICAO?",
    "respuesta": "Hotel",
    "fuente": "OACI, Anexo 10 / fraseología aeronáutica",
    "localizacion": "alfabeto radiotelefónico",
    "apartado": "H"
  },
  {
    "id": "CPEI-T16-S07-3CD8A74119",
    "orden": 810,
    "concepto": "¿Cómo se deletrea la letra I en ICAO?",
    "respuesta": "India",
    "fuente": "OACI, Anexo 10 / fraseología aeronáutica",
    "localizacion": "alfabeto radiotelefónico",
    "apartado": "I"
  },
  {
    "id": "CPEI-T16-S07-579A212B84",
    "orden": 820,
    "concepto": "¿Cómo se deletrea la letra J en ICAO?",
    "respuesta": "Juliett",
    "fuente": "OACI, Anexo 10 / fraseología aeronáutica",
    "localizacion": "alfabeto radiotelefónico",
    "apartado": "J"
  },
  {
    "id": "CPEI-T16-S07-27659165E7",
    "orden": 830,
    "concepto": "¿Cómo se deletrea la letra K en ICAO?",
    "respuesta": "Kilo",
    "fuente": "OACI, Anexo 10 / fraseología aeronáutica",
    "localizacion": "alfabeto radiotelefónico",
    "apartado": "K"
  },
  {
    "id": "CPEI-T16-S07-3C21FEFF26",
    "orden": 840,
    "concepto": "¿Cómo se deletrea la letra L en ICAO?",
    "respuesta": "Lima",
    "fuente": "OACI, Anexo 10 / fraseología aeronáutica",
    "localizacion": "alfabeto radiotelefónico",
    "apartado": "L"
  },
  {
    "id": "CPEI-T16-S07-9521721B55",
    "orden": 850,
    "concepto": "¿Cómo se deletrea la letra M en ICAO?",
    "respuesta": "Mike",
    "fuente": "OACI, Anexo 10 / fraseología aeronáutica",
    "localizacion": "alfabeto radiotelefónico",
    "apartado": "M"
  },
  {
    "id": "CPEI-T16-S07-EF36A1D2D1",
    "orden": 860,
    "concepto": "¿Cómo se deletrea la letra N en ICAO?",
    "respuesta": "November",
    "fuente": "OACI, Anexo 10 / fraseología aeronáutica",
    "localizacion": "alfabeto radiotelefónico",
    "apartado": "N"
  },
  {
    "id": "CPEI-T16-S07-AF210B0CA4",
    "orden": 870,
    "concepto": "¿Cómo se deletrea la letra O en ICAO?",
    "respuesta": "Oscar",
    "fuente": "OACI, Anexo 10 / fraseología aeronáutica",
    "localizacion": "alfabeto radiotelefónico",
    "apartado": "O"
  },
  {
    "id": "CPEI-T16-S07-BBA9D422D2",
    "orden": 880,
    "concepto": "¿Cómo se deletrea la letra P en ICAO?",
    "respuesta": "Papa",
    "fuente": "OACI, Anexo 10 / fraseología aeronáutica",
    "localizacion": "alfabeto radiotelefónico",
    "apartado": "P"
  },
  {
    "id": "CPEI-T16-S07-FE90129FB7",
    "orden": 890,
    "concepto": "¿Cómo se deletrea la letra Q en ICAO?",
    "respuesta": "Quebec",
    "fuente": "OACI, Anexo 10 / fraseología aeronáutica",
    "localizacion": "alfabeto radiotelefónico",
    "apartado": "Q"
  },
  {
    "id": "CPEI-T16-S07-AA66442E6F",
    "orden": 900,
    "concepto": "¿Cómo se deletrea la letra R en ICAO?",
    "respuesta": "Romeo",
    "fuente": "OACI, Anexo 10 / fraseología aeronáutica",
    "localizacion": "alfabeto radiotelefónico",
    "apartado": "R"
  },
  {
    "id": "CPEI-T16-S07-A2B7B3E3D3",
    "orden": 910,
    "concepto": "¿Cómo se deletrea la letra S en ICAO?",
    "respuesta": "Sierra",
    "fuente": "OACI, Anexo 10 / fraseología aeronáutica",
    "localizacion": "alfabeto radiotelefónico",
    "apartado": "S"
  },
  {
    "id": "CPEI-T16-S07-EFD362F0EF",
    "orden": 920,
    "concepto": "¿Cómo se deletrea la letra T en ICAO?",
    "respuesta": "Tango",
    "fuente": "OACI, Anexo 10 / fraseología aeronáutica",
    "localizacion": "alfabeto radiotelefónico",
    "apartado": "T"
  },
  {
    "id": "CPEI-T16-S07-5B9E209894",
    "orden": 930,
    "concepto": "¿Cómo se deletrea la letra U en ICAO?",
    "respuesta": "Uniform",
    "fuente": "OACI, Anexo 10 / fraseología aeronáutica",
    "localizacion": "alfabeto radiotelefónico",
    "apartado": "U"
  },
  {
    "id": "CPEI-T16-S07-7027847091",
    "orden": 940,
    "concepto": "¿Cómo se deletrea la letra V en ICAO?",
    "respuesta": "Victor",
    "fuente": "OACI, Anexo 10 / fraseología aeronáutica",
    "localizacion": "alfabeto radiotelefónico",
    "apartado": "V"
  },
  {
    "id": "CPEI-T16-S07-11C7A95D55",
    "orden": 950,
    "concepto": "¿Cómo se deletrea la letra W en ICAO?",
    "respuesta": "Whiskey",
    "fuente": "OACI, Anexo 10 / fraseología aeronáutica",
    "localizacion": "alfabeto radiotelefónico",
    "apartado": "W"
  },
  {
    "id": "CPEI-T16-S07-A43E001993",
    "orden": 960,
    "concepto": "¿Cómo se deletrea la letra X en ICAO?",
    "respuesta": "X-ray",
    "fuente": "OACI, Anexo 10 / fraseología aeronáutica",
    "localizacion": "alfabeto radiotelefónico",
    "apartado": "X"
  },
  {
    "id": "CPEI-T16-S07-AE23CB0AF1",
    "orden": 970,
    "concepto": "¿Cómo se deletrea la letra Y en ICAO?",
    "respuesta": "Yankee",
    "fuente": "OACI, Anexo 10 / fraseología aeronáutica",
    "localizacion": "alfabeto radiotelefónico",
    "apartado": "Y"
  },
  {
    "id": "CPEI-T16-S07-A49E6C2E89",
    "orden": 980,
    "concepto": "¿Cómo se deletrea la letra Z en ICAO?",
    "respuesta": "Zulu",
    "fuente": "OACI, Anexo 10 / fraseología aeronáutica",
    "localizacion": "alfabeto radiotelefónico",
    "apartado": "Z"
  },
  {
    "id": "CPEI-T16-S08-C6C8AC5C8A",
    "orden": 990,
    "concepto": "¿Qué significa QRA?",
    "respuesta": "Nombre/indicativo de la estación",
    "fuente": "UIT, Reglamento de Radiocomunicaciones y Apéndice 14",
    "localizacion": "alfabeto y códigos operativos",
    "apartado": "QRA"
  },
  {
    "id": "CPEI-T16-S08-4CE632DE31",
    "orden": 1000,
    "concepto": "¿Qué significa QRM?",
    "respuesta": "Interferencia de otras estaciones",
    "fuente": "UIT, Reglamento de Radiocomunicaciones y Apéndice 14",
    "localizacion": "alfabeto y códigos operativos",
    "apartado": "QRM"
  },
  {
    "id": "CPEI-T16-S08-5424E0FDD6",
    "orden": 1010,
    "concepto": "¿Qué significa QRN?",
    "respuesta": "Interferencia atmosférica",
    "fuente": "UIT, Reglamento de Radiocomunicaciones y Apéndice 14",
    "localizacion": "alfabeto y códigos operativos",
    "apartado": "QRN"
  },
  {
    "id": "CPEI-T16-S08-FEB381450C",
    "orden": 1020,
    "concepto": "¿Qué significa QRO?",
    "respuesta": "Aumentar potencia",
    "fuente": "UIT, Reglamento de Radiocomunicaciones y Apéndice 14",
    "localizacion": "alfabeto y códigos operativos",
    "apartado": "QRO"
  },
  {
    "id": "CPEI-T16-S08-8E8A25F03E",
    "orden": 1030,
    "concepto": "¿Qué significa QRP?",
    "respuesta": "Disminuir potencia",
    "fuente": "UIT, Reglamento de Radiocomunicaciones y Apéndice 14",
    "localizacion": "alfabeto y códigos operativos",
    "apartado": "QRP"
  },
  {
    "id": "CPEI-T16-S08-755C061166",
    "orden": 1040,
    "concepto": "¿Qué significa QRT?",
    "respuesta": "Cesar transmisión",
    "fuente": "UIT, Reglamento de Radiocomunicaciones y Apéndice 14",
    "localizacion": "alfabeto y códigos operativos",
    "apartado": "QRT"
  },
  {
    "id": "CPEI-T16-S08-36F5C0E832",
    "orden": 1050,
    "concepto": "¿Qué significa QRV?",
    "respuesta": "Estar preparado/a la escucha",
    "fuente": "UIT, Reglamento de Radiocomunicaciones y Apéndice 14",
    "localizacion": "alfabeto y códigos operativos",
    "apartado": "QRV"
  },
  {
    "id": "CPEI-T16-S08-8391467E11",
    "orden": 1060,
    "concepto": "¿Qué significa QRX?",
    "respuesta": "Esperar / volver a llamar",
    "fuente": "UIT, Reglamento de Radiocomunicaciones y Apéndice 14",
    "localizacion": "alfabeto y códigos operativos",
    "apartado": "QRX"
  },
  {
    "id": "CPEI-T16-S08-074B06DFEE",
    "orden": 1070,
    "concepto": "¿Qué significa QRZ?",
    "respuesta": "Quién llama / identifíquese",
    "fuente": "UIT, Reglamento de Radiocomunicaciones y Apéndice 14",
    "localizacion": "alfabeto y códigos operativos",
    "apartado": "QRZ"
  },
  {
    "id": "CPEI-T16-S08-D858668D96",
    "orden": 1080,
    "concepto": "¿Qué significa QSB?",
    "respuesta": "Desvanecimiento de señal",
    "fuente": "UIT, Reglamento de Radiocomunicaciones y Apéndice 14",
    "localizacion": "alfabeto y códigos operativos",
    "apartado": "QSB"
  },
  {
    "id": "CPEI-T16-S08-DEFD823C58",
    "orden": 1090,
    "concepto": "¿Qué significa QSL?",
    "respuesta": "Acuse de recibo / recibido",
    "fuente": "UIT, Reglamento de Radiocomunicaciones y Apéndice 14",
    "localizacion": "alfabeto y códigos operativos",
    "apartado": "QSL"
  },
  {
    "id": "CPEI-T16-S08-575B6FB1CE",
    "orden": 1100,
    "concepto": "¿Qué significa QSO?",
    "respuesta": "Comunicación entre estaciones",
    "fuente": "UIT, Reglamento de Radiocomunicaciones y Apéndice 14",
    "localizacion": "alfabeto y códigos operativos",
    "apartado": "QSO"
  },
  {
    "id": "CPEI-T16-S08-EDB559E1FA",
    "orden": 1110,
    "concepto": "¿Qué significa QSP?",
    "respuesta": "Retransmitir / hacer de puente",
    "fuente": "UIT, Reglamento de Radiocomunicaciones y Apéndice 14",
    "localizacion": "alfabeto y códigos operativos",
    "apartado": "QSP"
  },
  {
    "id": "CPEI-T16-S08-3FA0AD756B",
    "orden": 1120,
    "concepto": "¿Qué significa QSY?",
    "respuesta": "Cambiar de frecuencia/canal",
    "fuente": "UIT, Reglamento de Radiocomunicaciones y Apéndice 14",
    "localizacion": "alfabeto y códigos operativos",
    "apartado": "QSY"
  },
  {
    "id": "CPEI-T16-S08-BCCDC0962F",
    "orden": 1130,
    "concepto": "¿Qué significa QTC?",
    "respuesta": "Mensaje o tráfico",
    "fuente": "UIT, Reglamento de Radiocomunicaciones y Apéndice 14",
    "localizacion": "alfabeto y códigos operativos",
    "apartado": "QTC"
  },
  {
    "id": "CPEI-T16-S08-9A3B7FD523",
    "orden": 1140,
    "concepto": "¿Qué significa QTH?",
    "respuesta": "Ubicación de estación",
    "fuente": "UIT, Reglamento de Radiocomunicaciones y Apéndice 14",
    "localizacion": "alfabeto y códigos operativos",
    "apartado": "QTH"
  },
  {
    "id": "CPEI-T16-S08-7F3C1EE85E",
    "orden": 1150,
    "concepto": "¿Qué significa QTR?",
    "respuesta": "Hora exacta",
    "fuente": "UIT, Reglamento de Radiocomunicaciones y Apéndice 14",
    "localizacion": "alfabeto y códigos operativos",
    "apartado": "QTR"
  },
  {
    "id": "CPEI-T16-S08-EA6218215D",
    "orden": 1160,
    "concepto": "¿Qué significa QUA?",
    "respuesta": "Noticias/novedades sobre",
    "fuente": "UIT, Reglamento de Radiocomunicaciones y Apéndice 14",
    "localizacion": "alfabeto y códigos operativos",
    "apartado": "QUA"
  },
  {
    "id": "CPEI-T16-S08-56EF595F15",
    "orden": 1170,
    "concepto": "¿Qué significa QUM?",
    "respuesta": "Fin de situación de socorro según contexto UIT",
    "fuente": "UIT, Reglamento de Radiocomunicaciones y Apéndice 14",
    "localizacion": "alfabeto y códigos operativos",
    "apartado": "QUM"
  }
];
