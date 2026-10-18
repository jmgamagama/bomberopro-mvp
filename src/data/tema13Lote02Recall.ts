/** Tema 13 recall cards — fase 2: generadas SOLO desde el texto oficial consolidado (NTP 787 (INSST), Ficha de selección y uso: Equipos respiratorios aislantes (INSST), Ficha de selección y uso 05: Filtros (INSST), Guía técnica de EPI (INSST)). Calidad: data/tema13/tema13_lote02_calidad.md. */

export type Tema13RecallCard = {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
};

export const TEMA13_LOTE02_RECALL_META = {
  "tema": 13,
  "lote": "lote02",
  "title": "Tema 13 · lote 2: protección respiratoria y equipos autónomos (INSST: NTP 787, fichas de selección y uso y Guía técnica de EPI)",
  "count": 47,
  "source": "Huecos CEP · INSST (NTP 787, FSU Filtros, FSU Equipos respiratorios aislantes y Guía técnica de EPI), insst.es"
} as const;

export const TEMA13_LOTE02_RECALL_CARDS: Tema13RecallCard[] = [
  {
    "id": "CPEI-T13-OF-804BE724",
    "orden": 10,
    "concepto": "Según la NTP 787 del INSST, ¿cuál es el material filtrante de los filtros contra gases y vapores?",
    "respuesta": "Carbón activo",
    "fuente": "NTP 787 (INSST), Contra gases y vapores, pág. 1. INSST, NTP 787: Equipos de protección respiratoria: identificación de los filtros según sus tipos y clases (2008); texto íntegro oficial (2008): https://www.insst.es/documents/94886/7843381/787a.pdf#page=1",
    "localizacion": "NTP 787 (INSST), Contra gases y vapores, pág. 1",
    "apartado": "Filtros: tipos, clases y marcado"
  },
  {
    "id": "CPEI-T13-OF-A76048E9",
    "orden": 20,
    "concepto": "Según la NTP 787 del INSST, ¿contra qué protege el filtro tipo A?",
    "respuesta": "Contra gases y vapores orgánicos con P.E. > 65 ºC",
    "fuente": "NTP 787 (INSST), Contra gases y vapores, pág. 1. INSST, NTP 787: Equipos de protección respiratoria: identificación de los filtros según sus tipos y clases (2008); texto íntegro oficial (2008): https://www.insst.es/documents/94886/7843381/787a.pdf#page=1",
    "localizacion": "NTP 787 (INSST), Contra gases y vapores, pág. 1",
    "apartado": "Filtros: tipos, clases y marcado"
  },
  {
    "id": "CPEI-T13-OF-D1A18AF5",
    "orden": 30,
    "concepto": "Según la NTP 787 del INSST, ¿contra qué protege el filtro tipo AX?",
    "respuesta": "Contra gases y vapores orgánicos con P.E. < 65 ºC",
    "fuente": "NTP 787 (INSST), Contra gases y vapores, pág. 1. INSST, NTP 787: Equipos de protección respiratoria: identificación de los filtros según sus tipos y clases (2008); texto íntegro oficial (2008): https://www.insst.es/documents/94886/7843381/787a.pdf#page=1",
    "localizacion": "NTP 787 (INSST), Contra gases y vapores, pág. 1",
    "apartado": "Filtros: tipos, clases y marcado"
  },
  {
    "id": "CPEI-T13-OF-6AB5A4CF",
    "orden": 40,
    "concepto": "Según la NTP 787 del INSST, ¿contra qué protege el filtro tipo B?",
    "respuesta": "Contra gases y vapores inorgánicos",
    "fuente": "NTP 787 (INSST), Contra gases y vapores, pág. 1. INSST, NTP 787: Equipos de protección respiratoria: identificación de los filtros según sus tipos y clases (2008); texto íntegro oficial (2008): https://www.insst.es/documents/94886/7843381/787a.pdf#page=1",
    "localizacion": "NTP 787 (INSST), Contra gases y vapores, pág. 1",
    "apartado": "Filtros: tipos, clases y marcado"
  },
  {
    "id": "CPEI-T13-OF-C6B73CCB",
    "orden": 50,
    "concepto": "Según la NTP 787 del INSST, ¿contra qué protege el filtro tipo E?",
    "respuesta": "Contra dióxido de azufre y vapores ácidos",
    "fuente": "NTP 787 (INSST), Contra gases y vapores, pág. 1. INSST, NTP 787: Equipos de protección respiratoria: identificación de los filtros según sus tipos y clases (2008); texto íntegro oficial (2008): https://www.insst.es/documents/94886/7843381/787a.pdf#page=1",
    "localizacion": "NTP 787 (INSST), Contra gases y vapores, pág. 1",
    "apartado": "Filtros: tipos, clases y marcado"
  },
  {
    "id": "CPEI-T13-OF-9C9C2B90",
    "orden": 60,
    "concepto": "Según la NTP 787 del INSST, ¿contra qué protege el filtro tipo K?",
    "respuesta": "Contra amoniaco y derivados orgánicos del amoniaco",
    "fuente": "NTP 787 (INSST), Contra gases y vapores, pág. 1. INSST, NTP 787: Equipos de protección respiratoria: identificación de los filtros según sus tipos y clases (2008); texto íntegro oficial (2008): https://www.insst.es/documents/94886/7843381/787a.pdf#page=1",
    "localizacion": "NTP 787 (INSST), Contra gases y vapores, pág. 1",
    "apartado": "Filtros: tipos, clases y marcado"
  },
  {
    "id": "CPEI-T13-OF-C035BDF4",
    "orden": 70,
    "concepto": "Según la NTP 787 del INSST, ¿en cuántas clases según su capacidad se clasifican los filtros contra gases y vapores (salvo AX y SX)?",
    "respuesta": "En tres clases",
    "fuente": "NTP 787 (INSST), Contra gases y vapores, pág. 1. INSST, NTP 787: Equipos de protección respiratoria: identificación de los filtros según sus tipos y clases (2008); texto íntegro oficial (2008): https://www.insst.es/documents/94886/7843381/787a.pdf#page=1",
    "localizacion": "NTP 787 (INSST), Contra gases y vapores, pág. 1",
    "apartado": "Filtros: tipos, clases y marcado"
  },
  {
    "id": "CPEI-T13-OF-DD2765AB",
    "orden": 80,
    "concepto": "Según la NTP 787 del INSST, ¿qué contenido de oxígeno debe tener el ambiente para usar equipos filtrantes?",
    "respuesta": "Como mínimo, un 17% en volumen de oxígeno",
    "fuente": "NTP 787 (INSST), 2. Aplicación de los filtros, pág. 1. INSST, NTP 787: Equipos de protección respiratoria: identificación de los filtros según sus tipos y clases (2008); texto íntegro oficial (2008): https://www.insst.es/documents/94886/7843381/787a.pdf#page=1",
    "localizacion": "NTP 787 (INSST), 2. Aplicación de los filtros, pág. 1",
    "apartado": "Filtros: tipos, clases y marcado"
  },
  {
    "id": "CPEI-T13-OF-6D94AE06",
    "orden": 90,
    "concepto": "Según la NTP 787 del INSST, ¿de qué está constituido el material filtrante de los filtros contra partículas?",
    "respuesta": "Un entramado de fibras plásticas el cual retiene al contaminante",
    "fuente": "NTP 787 (INSST), Contra partículas y aerosoles, pág. 1. INSST, NTP 787: Equipos de protección respiratoria: identificación de los filtros según sus tipos y clases (2008); texto íntegro oficial (2008): https://www.insst.es/documents/94886/7843381/787a.pdf#page=1",
    "localizacion": "NTP 787 (INSST), Contra partículas y aerosoles, pág. 1",
    "apartado": "Filtros: tipos, clases y marcado"
  },
  {
    "id": "CPEI-T13-OF-EEB5CEC5",
    "orden": 100,
    "concepto": "Según la NTP 787 del INSST, ¿qué eficacia tiene un filtro P-3?",
    "respuesta": "Filtros de alta eficacia",
    "fuente": "NTP 787 (INSST), Contra partículas y aerosoles, pág. 1. INSST, NTP 787: Equipos de protección respiratoria: identificación de los filtros según sus tipos y clases (2008); texto íntegro oficial (2008): https://www.insst.es/documents/94886/7843381/787a.pdf#page=1",
    "localizacion": "NTP 787 (INSST), Contra partículas y aerosoles, pág. 1",
    "apartado": "Filtros: tipos, clases y marcado"
  },
  {
    "id": "CPEI-T13-OF-7D357C0E",
    "orden": 110,
    "concepto": "Según la NTP 787 del INSST, ¿cómo se denominan los filtros contra partículas, gases y vapores?",
    "respuesta": "Se les denominan combinados",
    "fuente": "NTP 787 (INSST), Contra partículas, gases y vapores, pág. 1. INSST, NTP 787: Equipos de protección respiratoria: identificación de los filtros según sus tipos y clases (2008); texto íntegro oficial (2008): https://www.insst.es/documents/94886/7843381/787a.pdf#page=1",
    "localizacion": "NTP 787 (INSST), Contra partículas, gases y vapores, pág. 1",
    "apartado": "Filtros: tipos, clases y marcado"
  },
  {
    "id": "CPEI-T13-OF-EF796766",
    "orden": 120,
    "concepto": "Según la NTP 787 del INSST, ¿contra qué protege el filtro especial tipo NO-P3?",
    "respuesta": "Contra óxidos de nitrógeno",
    "fuente": "NTP 787 (INSST), Contra partículas, gases y vapores, pág. 1. INSST, NTP 787: Equipos de protección respiratoria: identificación de los filtros según sus tipos y clases (2008); texto íntegro oficial (2008): https://www.insst.es/documents/94886/7843381/787a.pdf#page=1",
    "localizacion": "NTP 787 (INSST), Contra partículas, gases y vapores, pág. 1",
    "apartado": "Filtros: tipos, clases y marcado"
  },
  {
    "id": "CPEI-T13-OF-6CCB166D",
    "orden": 130,
    "concepto": "Según la NTP 787 del INSST, ¿contra qué protege el filtro especial tipo Hg-P3?",
    "respuesta": "Contra mercurio",
    "fuente": "NTP 787 (INSST), Contra partículas, gases y vapores, pág. 1. INSST, NTP 787: Equipos de protección respiratoria: identificación de los filtros según sus tipos y clases (2008); texto íntegro oficial (2008): https://www.insst.es/documents/94886/7843381/787a.pdf#page=1",
    "localizacion": "NTP 787 (INSST), Contra partículas, gases y vapores, pág. 1",
    "apartado": "Filtros: tipos, clases y marcado"
  },
  {
    "id": "CPEI-T13-OF-A2C5D297",
    "orden": 140,
    "concepto": "Según la NTP 787 del INSST, ¿cuál es el código de color de los filtros tipo A?",
    "respuesta": "Marrón",
    "fuente": "NTP 787 (INSST), 4. Marcado, tabla 1, pág. 2. INSST, NTP 787: Equipos de protección respiratoria: identificación de los filtros según sus tipos y clases (2008); texto íntegro oficial (2008): https://www.insst.es/documents/94886/7843381/787a.pdf#page=2",
    "localizacion": "NTP 787 (INSST), 4. Marcado, tabla 1, pág. 2",
    "apartado": "Filtros: tipos, clases y marcado"
  },
  {
    "id": "CPEI-T13-OF-5E2E281F",
    "orden": 150,
    "concepto": "Según la NTP 787 del INSST, ¿cuál es el código de color de los filtros tipo B?",
    "respuesta": "Gris",
    "fuente": "NTP 787 (INSST), 4. Marcado, tabla 1, pág. 2. INSST, NTP 787: Equipos de protección respiratoria: identificación de los filtros según sus tipos y clases (2008); texto íntegro oficial (2008): https://www.insst.es/documents/94886/7843381/787a.pdf#page=2",
    "localizacion": "NTP 787 (INSST), 4. Marcado, tabla 1, pág. 2",
    "apartado": "Filtros: tipos, clases y marcado"
  },
  {
    "id": "CPEI-T13-OF-823D1815",
    "orden": 160,
    "concepto": "Según la NTP 787 del INSST, ¿cuál es el código de color de los filtros tipo E?",
    "respuesta": "Amarillo",
    "fuente": "NTP 787 (INSST), 4. Marcado, tabla 1, pág. 2. INSST, NTP 787: Equipos de protección respiratoria: identificación de los filtros según sus tipos y clases (2008); texto íntegro oficial (2008): https://www.insst.es/documents/94886/7843381/787a.pdf#page=2",
    "localizacion": "NTP 787 (INSST), 4. Marcado, tabla 1, pág. 2",
    "apartado": "Filtros: tipos, clases y marcado"
  },
  {
    "id": "CPEI-T13-OF-0A7CCD76",
    "orden": 170,
    "concepto": "Según la NTP 787 del INSST, ¿cuál es el código de color de los filtros tipo K?",
    "respuesta": "Verde",
    "fuente": "NTP 787 (INSST), 4. Marcado, tabla 1, pág. 2. INSST, NTP 787: Equipos de protección respiratoria: identificación de los filtros según sus tipos y clases (2008); texto íntegro oficial (2008): https://www.insst.es/documents/94886/7843381/787a.pdf#page=2",
    "localizacion": "NTP 787 (INSST), 4. Marcado, tabla 1, pág. 2",
    "apartado": "Filtros: tipos, clases y marcado"
  },
  {
    "id": "CPEI-T13-OF-1DDEA2A2",
    "orden": 180,
    "concepto": "Según la NTP 787 del INSST, ¿qué particularidad tiene el filtro Hg-P3 en la tabla de marcado?",
    "respuesta": "Duración máxima 50 horas",
    "fuente": "NTP 787 (INSST), 4. Marcado, tabla 1, pág. 2. INSST, NTP 787: Equipos de protección respiratoria: identificación de los filtros según sus tipos y clases (2008); texto íntegro oficial (2008): https://www.insst.es/documents/94886/7843381/787a.pdf#page=2",
    "localizacion": "NTP 787 (INSST), 4. Marcado, tabla 1, pág. 2",
    "apartado": "Filtros: tipos, clases y marcado"
  },
  {
    "id": "CPEI-T13-OF-C36006EB",
    "orden": 190,
    "concepto": "Según la NTP 787 del INSST, ¿qué datos de caducidad deben figurar en el marcado de todos los filtros?",
    "respuesta": "Año y mes de caducidad",
    "fuente": "NTP 787 (INSST), 4. Marcado, pág. 2. INSST, NTP 787: Equipos de protección respiratoria: identificación de los filtros según sus tipos y clases (2008); texto íntegro oficial (2008): https://www.insst.es/documents/94886/7843381/787a.pdf#page=2",
    "localizacion": "NTP 787 (INSST), 4. Marcado, pág. 2",
    "apartado": "Filtros: tipos, clases y marcado"
  },
  {
    "id": "CPEI-T13-OF-00810BE1",
    "orden": 200,
    "concepto": "Según la ficha de selección y uso de filtros del INSST, ¿frente a qué riesgo se usan los filtros?",
    "respuesta": "Inhalación de agentes químicos peligrosos presentes en la atmósfera del lugar de trabajo",
    "fuente": "FSU 05 Filtros (INSST), 1. Riesgos, pág. 1. INSST, Ficha de selección y uso de EPI 05: Filtros (rev. 5, agosto 2025); texto íntegro oficial (rev. 5, agosto 2025): https://www.insst.es/documents/94886/8739740/FSU+05+Filtros+%28rev.5%29.pdf#page=1",
    "localizacion": "FSU 05 Filtros (INSST), 1. Riesgos, pág. 1",
    "apartado": "Filtros: tipos, clases y marcado"
  },
  {
    "id": "CPEI-T13-OF-45FB9848",
    "orden": 210,
    "concepto": "Según la ficha de selección y uso de filtros del INSST, ¿qué indicación adicional debe llevar el filtro NO-P3?",
    "respuesta": "“uso para una sola jornada” o el símbolo correspondiente",
    "fuente": "FSU 05 Filtros (INSST), 4.1 Marcado en el filtro, pág. 2. INSST, Ficha de selección y uso de EPI 05: Filtros (rev. 5, agosto 2025); texto íntegro oficial (rev. 5, agosto 2025): https://www.insst.es/documents/94886/8739740/FSU+05+Filtros+%28rev.5%29.pdf#page=2",
    "localizacion": "FSU 05 Filtros (INSST), 4.1 Marcado en el filtro, pág. 2",
    "apartado": "Filtros: tipos, clases y marcado"
  },
  {
    "id": "CPEI-T13-OF-FD2D568F",
    "orden": 220,
    "concepto": "Según la ficha de selección y uso de filtros del INSST, si el marcado no se imprime directamente en el filtro, ¿dónde debe figurar?",
    "respuesta": "En una etiqueta con el código de color apropiado, fijada al cuerpo del filtro",
    "fuente": "FSU 05 Filtros (INSST), 4.1 Marcado en el filtro, pág. 2. INSST, Ficha de selección y uso de EPI 05: Filtros (rev. 5, agosto 2025); texto íntegro oficial (rev. 5, agosto 2025): https://www.insst.es/documents/94886/8739740/FSU+05+Filtros+%28rev.5%29.pdf#page=2",
    "localizacion": "FSU 05 Filtros (INSST), 4.1 Marcado en el filtro, pág. 2",
    "apartado": "Filtros: tipos, clases y marcado"
  },
  {
    "id": "CPEI-T13-OF-D0A61208",
    "orden": 230,
    "concepto": "Según la ficha de selección y uso de filtros del INSST, ¿cómo no debe considerarse un color plateado o ligeramente metalizado?",
    "respuesta": "Como blanco o gris",
    "fuente": "FSU 05 Filtros (INSST), 4.1 Marcado en el filtro, pág. 2. INSST, Ficha de selección y uso de EPI 05: Filtros (rev. 5, agosto 2025); texto íntegro oficial (rev. 5, agosto 2025): https://www.insst.es/documents/94886/8739740/FSU+05+Filtros+%28rev.5%29.pdf#page=2",
    "localizacion": "FSU 05 Filtros (INSST), 4.1 Marcado en el filtro, pág. 2",
    "apartado": "Filtros: tipos, clases y marcado"
  },
  {
    "id": "CPEI-T13-OF-5B19F1C3",
    "orden": 240,
    "concepto": "Según la ficha de selección y uso de filtros del INSST, ¿qué marcado lleva el EPR que ha pasado todos los ensayos aplicables de resistencia mecánica?",
    "respuesta": "El marcado “MS”",
    "fuente": "FSU 05 Filtros (INSST), 4.2 Marcado en el conjunto motor-ventilador, pág. 3. INSST, Ficha de selección y uso de EPI 05: Filtros (rev. 5, agosto 2025); texto íntegro oficial (rev. 5, agosto 2025): https://www.insst.es/documents/94886/8739740/FSU+05+Filtros+%28rev.5%29.pdf#page=3",
    "localizacion": "FSU 05 Filtros (INSST), 4.2 Marcado en el conjunto motor-ventilador, pág. 3",
    "apartado": "Filtros: tipos, clases y marcado"
  },
  {
    "id": "CPEI-T13-OF-B1A7B7D9",
    "orden": 250,
    "concepto": "Según la ficha de selección y uso de equipos respiratorios aislantes del INSST, ¿frente a qué riesgo se usan?",
    "respuesta": "Inhalación de atmósferas peligrosas",
    "fuente": "FSU Equipos respiratorios aislantes (INSST), 1. Riesgo, pág. 1. INSST, Ficha de selección y uso de EPI: Equipos respiratorios aislantes (rev. 3, diciembre 2023); texto íntegro oficial (rev. 3, diciembre 2023): https://www.insst.es/documents/94886/8739740/Equipos+respiratorios+aislantes+%28rev.3%29.pdf#page=1",
    "localizacion": "FSU Equipos respiratorios aislantes (INSST), 1. Riesgo, pág. 1",
    "apartado": "Equipos aislantes y autónomos"
  },
  {
    "id": "CPEI-T13-OF-CA7C2605",
    "orden": 260,
    "concepto": "Según la ficha de selección y uso de equipos respiratorios aislantes del INSST, ¿qué disposición legal regula su diseño y fabricación?",
    "respuesta": "Reglamento (UE) 2016/425 (artículo 5.3 RD 773/1997)",
    "fuente": "FSU Equipos respiratorios aislantes (INSST), 2. Disposición legal, pág. 1. INSST, Ficha de selección y uso de EPI: Equipos respiratorios aislantes (rev. 3, diciembre 2023); texto íntegro oficial (rev. 3, diciembre 2023): https://www.insst.es/documents/94886/8739740/Equipos+respiratorios+aislantes+%28rev.3%29.pdf#page=1",
    "localizacion": "FSU Equipos respiratorios aislantes (INSST), 2. Disposición legal, pág. 1",
    "apartado": "Equipos aislantes y autónomos"
  },
  {
    "id": "CPEI-T13-OF-90F2A63F",
    "orden": 270,
    "concepto": "Según la ficha de selección y uso de equipos respiratorios aislantes del INSST, ¿con qué letra se indica que un equipo de aire comprimido puede usarse con alto riesgo de inflamabilidad?",
    "respuesta": "Indicado con la letra F",
    "fuente": "FSU Equipos respiratorios aislantes (INSST), 4.3 Equipos aislantes de aire comprimido, pág. 1. INSST, Ficha de selección y uso de EPI: Equipos respiratorios aislantes (rev. 3, diciembre 2023); texto íntegro oficial (rev. 3, diciembre 2023): https://www.insst.es/documents/94886/8739740/Equipos+respiratorios+aislantes+%28rev.3%29.pdf#page=1",
    "localizacion": "FSU Equipos respiratorios aislantes (INSST), 4.3 Equipos aislantes de aire comprimido, pág. 1",
    "apartado": "Equipos aislantes y autónomos"
  },
  {
    "id": "CPEI-T13-OF-062EC015",
    "orden": 280,
    "concepto": "Según la ficha de selección y uso de equipos respiratorios aislantes del INSST, ¿qué flujo deben llevar marcado los equipos de aire fresco?",
    "respuesta": "Flujo de aire mínimo",
    "fuente": "FSU Equipos respiratorios aislantes (INSST), 4.2 Equipos aislantes de aire fresco, pág. 1. INSST, Ficha de selección y uso de EPI: Equipos respiratorios aislantes (rev. 3, diciembre 2023); texto íntegro oficial (rev. 3, diciembre 2023): https://www.insst.es/documents/94886/8739740/Equipos+respiratorios+aislantes+%28rev.3%29.pdf#page=1",
    "localizacion": "FSU Equipos respiratorios aislantes (INSST), 4.2 Equipos aislantes de aire fresco, pág. 1",
    "apartado": "Equipos aislantes y autónomos"
  },
  {
    "id": "CPEI-T13-OF-59FDE9E4",
    "orden": 290,
    "concepto": "Según la ficha de selección y uso de equipos respiratorios aislantes del INSST, ¿en qué equipos debe advertir el fabricante del número máximo de usuarios conectados a una unidad móvil de aire?",
    "respuesta": "En los equipos de aire comprimido",
    "fuente": "FSU Equipos respiratorios aislantes (INSST), 5. Información del fabricante, pág. 2. INSST, Ficha de selección y uso de EPI: Equipos respiratorios aislantes (rev. 3, diciembre 2023); texto íntegro oficial (rev. 3, diciembre 2023): https://www.insst.es/documents/94886/8739740/Equipos+respiratorios+aislantes+%28rev.3%29.pdf#page=2",
    "localizacion": "FSU Equipos respiratorios aislantes (INSST), 5. Información del fabricante, pág. 2",
    "apartado": "Equipos aislantes y autónomos"
  },
  {
    "id": "CPEI-T13-OF-1488F884",
    "orden": 300,
    "concepto": "Según la ficha de selección y uso de equipos respiratorios aislantes del INSST, en los equipos de aire fresco o comprimido, ¿qué dato de la manguera debe dar el fabricante?",
    "respuesta": "Longitud máxima de la manguera o del tubo",
    "fuente": "FSU Equipos respiratorios aislantes (INSST), 5. Información del fabricante, pág. 2. INSST, Ficha de selección y uso de EPI: Equipos respiratorios aislantes (rev. 3, diciembre 2023); texto íntegro oficial (rev. 3, diciembre 2023): https://www.insst.es/documents/94886/8739740/Equipos+respiratorios+aislantes+%28rev.3%29.pdf#page=2",
    "localizacion": "FSU Equipos respiratorios aislantes (INSST), 5. Información del fabricante, pág. 2",
    "apartado": "Equipos aislantes y autónomos"
  },
  {
    "id": "CPEI-T13-OF-FA63D5D8",
    "orden": 310,
    "concepto": "Según la Guía técnica de EPI del INSST, ¿qué hacen los equipos filtrantes?",
    "respuesta": "Purifican el aire ambiental a través de filtros o material filtrante capaces de retener los contaminantes",
    "fuente": "Guía técnica de EPI (INSST), Apéndice 4.1, tipos de EPR, pág. 49. INSST, Guía técnica para la utilización por los trabajadores de equipos de protección individual (RD 773/1997), 2022; texto íntegro oficial (2022): https://www.insst.es/documents/94886/203536/Gu%C3%ADa+t%C3%A9cnica+para+la+utilizaci%C3%B3n+por+los+trabajadores+de+equipos+de+protecci%C3%B3n+individual.pdf#page=49",
    "localizacion": "Guía técnica de EPI (INSST), Apéndice 4.1, tipos de EPR, pág. 49",
    "apartado": "Equipos aislantes y autónomos"
  },
  {
    "id": "CPEI-T13-OF-1579C9EC",
    "orden": 320,
    "concepto": "Según la Guía técnica de EPI del INSST, ¿cuáles son los dos componentes principales de los equipos filtrantes?",
    "respuesta": "Filtro o material filtrante para purificar el aire y pieza facial para dirigir el aire purificado hacia la nariz y boca del usuario",
    "fuente": "Guía técnica de EPI (INSST), Apéndice 4.1, tipos de EPR, pág. 49. INSST, Guía técnica para la utilización por los trabajadores de equipos de protección individual (RD 773/1997), 2022; texto íntegro oficial (2022): https://www.insst.es/documents/94886/203536/Gu%C3%ADa+t%C3%A9cnica+para+la+utilizaci%C3%B3n+por+los+trabajadores+de+equipos+de+protecci%C3%B3n+individual.pdf#page=49",
    "localizacion": "Guía técnica de EPI (INSST), Apéndice 4.1, tipos de EPR, pág. 49",
    "apartado": "Equipos aislantes y autónomos"
  },
  {
    "id": "CPEI-T13-OF-2DC6DB3F",
    "orden": 330,
    "concepto": "Según la Guía técnica de EPI del INSST, ¿qué suministran los equipos aislantes?",
    "respuesta": "Aire respirable procedente de una fuente externa no contaminada e independiente del medio ambiente contaminado",
    "fuente": "Guía técnica de EPI (INSST), Apéndice 4.1, tipos de EPR, pág. 49. INSST, Guía técnica para la utilización por los trabajadores de equipos de protección individual (RD 773/1997), 2022; texto íntegro oficial (2022): https://www.insst.es/documents/94886/203536/Gu%C3%ADa+t%C3%A9cnica+para+la+utilizaci%C3%B3n+por+los+trabajadores+de+equipos+de+protecci%C3%B3n+individual.pdf#page=49",
    "localizacion": "Guía técnica de EPI (INSST), Apéndice 4.1, tipos de EPR, pág. 49",
    "apartado": "Equipos aislantes y autónomos"
  },
  {
    "id": "CPEI-T13-OF-ACD19ED9",
    "orden": 340,
    "concepto": "Según la Guía técnica de EPI del INSST, ¿dónde tienen los equipos de aire fresco el extremo de la manguera de suministro?",
    "respuesta": "Ubicado en el exterior de la atmósfera contaminada",
    "fuente": "Guía técnica de EPI (INSST), Apéndice 4.1, tipos de EPR, pág. 49. INSST, Guía técnica para la utilización por los trabajadores de equipos de protección individual (RD 773/1997), 2022; texto íntegro oficial (2022): https://www.insst.es/documents/94886/203536/Gu%C3%ADa+t%C3%A9cnica+para+la+utilizaci%C3%B3n+por+los+trabajadores+de+equipos+de+protecci%C3%B3n+individual.pdf#page=49",
    "localizacion": "Guía técnica de EPI (INSST), Apéndice 4.1, tipos de EPR, pág. 49",
    "apartado": "Equipos aislantes y autónomos"
  },
  {
    "id": "CPEI-T13-OF-8E528D2A",
    "orden": 350,
    "concepto": "Según la Guía técnica de EPI del INSST, ¿cómo se realiza el suministro de aire en los equipos de línea de aire comprimido?",
    "respuesta": "Mediante una fuente de aire comprimido limpio y respirable",
    "fuente": "Guía técnica de EPI (INSST), Apéndice 4.1, tipos de EPR, pág. 49. INSST, Guía técnica para la utilización por los trabajadores de equipos de protección individual (RD 773/1997), 2022; texto íntegro oficial (2022): https://www.insst.es/documents/94886/203536/Gu%C3%ADa+t%C3%A9cnica+para+la+utilizaci%C3%B3n+por+los+trabajadores+de+equipos+de+protecci%C3%B3n+individual.pdf#page=49",
    "localizacion": "Guía técnica de EPI (INSST), Apéndice 4.1, tipos de EPR, pág. 49",
    "apartado": "Equipos aislantes y autónomos"
  },
  {
    "id": "CPEI-T13-OF-905B9BA8",
    "orden": 360,
    "concepto": "Según la Guía técnica de EPI del INSST, ¿cuál es la fuente de aire de los equipos autónomos?",
    "respuesta": "Una botella a presión portada por el mismo usuario del equipo",
    "fuente": "Guía técnica de EPI (INSST), Apéndice 4.1, tipos de EPR, pág. 49. INSST, Guía técnica para la utilización por los trabajadores de equipos de protección individual (RD 773/1997), 2022; texto íntegro oficial (2022): https://www.insst.es/documents/94886/203536/Gu%C3%ADa+t%C3%A9cnica+para+la+utilizaci%C3%B3n+por+los+trabajadores+de+equipos+de+protecci%C3%B3n+individual.pdf#page=49",
    "localizacion": "Guía técnica de EPI (INSST), Apéndice 4.1, tipos de EPR, pág. 49",
    "apartado": "Equipos aislantes y autónomos"
  },
  {
    "id": "CPEI-T13-OF-6D65F277",
    "orden": 370,
    "concepto": "Según la Guía técnica de EPI del INSST, en equipos que basan su eficacia en la hermeticidad con la cara, ¿qué puede afectar a esa hermeticidad?",
    "respuesta": "La presencia de vello facial, cicatrices, etc.",
    "fuente": "Guía técnica de EPI (INSST), Apéndice 4.1, selección y uso, pág. 49. INSST, Guía técnica para la utilización por los trabajadores de equipos de protección individual (RD 773/1997), 2022; texto íntegro oficial (2022): https://www.insst.es/documents/94886/203536/Gu%C3%ADa+t%C3%A9cnica+para+la+utilizaci%C3%B3n+por+los+trabajadores+de+equipos+de+protecci%C3%B3n+individual.pdf#page=49",
    "localizacion": "Guía técnica de EPI (INSST), Apéndice 4.1, selección y uso, pág. 49",
    "apartado": "Selección y uso de los EPR"
  },
  {
    "id": "CPEI-T13-OF-08A5059A",
    "orden": 380,
    "concepto": "Según la Guía técnica de EPI del INSST, ¿en qué atmósferas se debe evitar el uso de equipos filtrantes si no se garantiza aire respirable suficiente?",
    "respuesta": "En atmósferas con posible deficiencia de oxígeno (por ejemplo, en espacios confinados)",
    "fuente": "Guía técnica de EPI (INSST), Apéndice 4.1, selección y uso, pág. 49. INSST, Guía técnica para la utilización por los trabajadores de equipos de protección individual (RD 773/1997), 2022; texto íntegro oficial (2022): https://www.insst.es/documents/94886/203536/Gu%C3%ADa+t%C3%A9cnica+para+la+utilizaci%C3%B3n+por+los+trabajadores+de+equipos+de+protecci%C3%B3n+individual.pdf#page=49",
    "localizacion": "Guía técnica de EPI (INSST), Apéndice 4.1, selección y uso, pág. 49",
    "apartado": "Selección y uso de los EPR"
  },
  {
    "id": "CPEI-T13-OF-CCD0A78C",
    "orden": 390,
    "concepto": "Según la Guía técnica de EPI del INSST, en adaptadores faciales de más de un filtro, ¿cómo se recambian los filtros?",
    "respuesta": "Deberán recambiarse los dos al mismo tiempo",
    "fuente": "Guía técnica de EPI (INSST), Apéndice 4.1, selección y uso, pág. 49. INSST, Guía técnica para la utilización por los trabajadores de equipos de protección individual (RD 773/1997), 2022; texto íntegro oficial (2022): https://www.insst.es/documents/94886/203536/Gu%C3%ADa+t%C3%A9cnica+para+la+utilizaci%C3%B3n+por+los+trabajadores+de+equipos+de+protecci%C3%B3n+individual.pdf#page=49",
    "localizacion": "Guía técnica de EPI (INSST), Apéndice 4.1, selección y uso, pág. 49",
    "apartado": "Selección y uso de los EPR"
  },
  {
    "id": "CPEI-T13-OF-469E1B12",
    "orden": 400,
    "concepto": "Según la Guía técnica de EPI del INSST, en equipos con manguera para el aporte de aire, ¿qué manguera debe usarse siempre?",
    "respuesta": "El tipo y longitudes de manguera con las que el equipo se haya puesto en el mercado",
    "fuente": "Guía técnica de EPI (INSST), Apéndice 4.1, selección y uso, pág. 49. INSST, Guía técnica para la utilización por los trabajadores de equipos de protección individual (RD 773/1997), 2022; texto íntegro oficial (2022): https://www.insst.es/documents/94886/203536/Gu%C3%ADa+t%C3%A9cnica+para+la+utilizaci%C3%B3n+por+los+trabajadores+de+equipos+de+protecci%C3%B3n+individual.pdf#page=49",
    "localizacion": "Guía técnica de EPI (INSST), Apéndice 4.1, selección y uso, pág. 49",
    "apartado": "Selección y uso de los EPR"
  },
  {
    "id": "CPEI-T13-OF-9EB606DC",
    "orden": 410,
    "concepto": "Según la Guía técnica de EPI del INSST, ¿quién establece el tiempo de uso de los EPR y su sustitución?",
    "respuesta": "El empresario en función de la evaluación de riesgos",
    "fuente": "Guía técnica de EPI (INSST), Apéndice 4.1, selección y uso, pág. 49. INSST, Guía técnica para la utilización por los trabajadores de equipos de protección individual (RD 773/1997), 2022; texto íntegro oficial (2022): https://www.insst.es/documents/94886/203536/Gu%C3%ADa+t%C3%A9cnica+para+la+utilizaci%C3%B3n+por+los+trabajadores+de+equipos+de+protecci%C3%B3n+individual.pdf#page=49",
    "localizacion": "Guía técnica de EPI (INSST), Apéndice 4.1, selección y uso, pág. 49",
    "apartado": "Selección y uso de los EPR"
  },
  {
    "id": "CPEI-T13-OF-435339EE",
    "orden": 420,
    "concepto": "Según la Guía técnica de EPI del INSST, si el uso continuado causa incomodidad, ¿cuándo no deberá quitarse nunca la protección respiratoria?",
    "respuesta": "Mientras exista riesgo de inhalación de una atmósfera peligrosa",
    "fuente": "Guía técnica de EPI (INSST), Apéndice 4.1, selección y uso, pág. 49. INSST, Guía técnica para la utilización por los trabajadores de equipos de protección individual (RD 773/1997), 2022; texto íntegro oficial (2022): https://www.insst.es/documents/94886/203536/Gu%C3%ADa+t%C3%A9cnica+para+la+utilizaci%C3%B3n+por+los+trabajadores+de+equipos+de+protecci%C3%B3n+individual.pdf#page=49",
    "localizacion": "Guía técnica de EPI (INSST), Apéndice 4.1, selección y uso, pág. 49",
    "apartado": "Selección y uso de los EPR"
  },
  {
    "id": "CPEI-T13-OF-1A910991",
    "orden": 430,
    "concepto": "Según la Guía técnica de EPI del INSST, en atmósferas potencialmente explosivas, ¿cómo hay que evaluar el EPR?",
    "respuesta": "Como posible fuente de ignición",
    "fuente": "Guía técnica de EPI (INSST), Apéndice 4.1, selección y uso, pág. 49. INSST, Guía técnica para la utilización por los trabajadores de equipos de protección individual (RD 773/1997), 2022; texto íntegro oficial (2022): https://www.insst.es/documents/94886/203536/Gu%C3%ADa+t%C3%A9cnica+para+la+utilizaci%C3%B3n+por+los+trabajadores+de+equipos+de+protecci%C3%B3n+individual.pdf#page=49",
    "localizacion": "Guía técnica de EPI (INSST), Apéndice 4.1, selección y uso, pág. 49",
    "apartado": "Selección y uso de los EPR"
  },
  {
    "id": "CPEI-T13-OF-7BF83330",
    "orden": 440,
    "concepto": "Según la Guía técnica de EPI del INSST, en trabajos con amianto, ¿qué tiempo diario de uso de EPR no puede superarse?",
    "respuesta": "Las 4 horas diarias",
    "fuente": "Guía técnica de EPI (INSST), Apéndice 4.1, selección y uso, pág. 50. INSST, Guía técnica para la utilización por los trabajadores de equipos de protección individual (RD 773/1997), 2022; texto íntegro oficial (2022): https://www.insst.es/documents/94886/203536/Gu%C3%ADa+t%C3%A9cnica+para+la+utilizaci%C3%B3n+por+los+trabajadores+de+equipos+de+protecci%C3%B3n+individual.pdf#page=50",
    "localizacion": "Guía técnica de EPI (INSST), Apéndice 4.1, selección y uso, pág. 50",
    "apartado": "Selección y uso de los EPR"
  },
  {
    "id": "CPEI-T13-OF-C02764D9",
    "orden": 450,
    "concepto": "Según la Guía técnica de EPI del INSST, ¿qué ejemplos de EPI complejos da para cuyo mantenimiento hay que atender a lo indicado por el fabricante?",
    "respuesta": "Ciertos EPI contra caídas de altura o un equipo autónomo",
    "fuente": "Guía técnica de EPI (INSST), Artículo 7, mantenimiento, pág. 22. INSST, Guía técnica para la utilización por los trabajadores de equipos de protección individual (RD 773/1997), 2022; texto íntegro oficial (2022): https://www.insst.es/documents/94886/203536/Gu%C3%ADa+t%C3%A9cnica+para+la+utilizaci%C3%B3n+por+los+trabajadores+de+equipos+de+protecci%C3%B3n+individual.pdf#page=22",
    "localizacion": "Guía técnica de EPI (INSST), Artículo 7, mantenimiento, pág. 22",
    "apartado": "Selección y uso de los EPR"
  },
  {
    "id": "CPEI-T13-OF-6CE49240",
    "orden": 460,
    "concepto": "Según la Guía técnica de EPI del INSST, ¿qué ejemplo da de sistema de conexión que se considera EPI?",
    "respuesta": "Una línea de aire que conecta un equipo de protección respiratoria a un compresor",
    "fuente": "Guía técnica de EPI (INSST), Artículo 2, definición, pág. 9. INSST, Guía técnica para la utilización por los trabajadores de equipos de protección individual (RD 773/1997), 2022; texto íntegro oficial (2022): https://www.insst.es/documents/94886/203536/Gu%C3%ADa+t%C3%A9cnica+para+la+utilizaci%C3%B3n+por+los+trabajadores+de+equipos+de+protecci%C3%B3n+individual.pdf#page=9",
    "localizacion": "Guía técnica de EPI (INSST), Artículo 2, definición, pág. 9",
    "apartado": "Selección y uso de los EPR"
  },
  {
    "id": "CPEI-T13-OF-CDDA93D4",
    "orden": 470,
    "concepto": "Según la Guía técnica de EPI del INSST, ¿qué puede suponer quitarse durante un corto periodo de tiempo un equipo de protección respiratoria?",
    "respuesta": "Puede dar lugar a un decrecimiento de la protección total resultante",
    "fuente": "Guía técnica de EPI (INSST), Artículo 7, utilización, pág. 20. INSST, Guía técnica para la utilización por los trabajadores de equipos de protección individual (RD 773/1997), 2022; texto íntegro oficial (2022): https://www.insst.es/documents/94886/203536/Gu%C3%ADa+t%C3%A9cnica+para+la+utilizaci%C3%B3n+por+los+trabajadores+de+equipos+de+protecci%C3%B3n+individual.pdf#page=20",
    "localizacion": "Guía técnica de EPI (INSST), Artículo 7, utilización, pág. 20",
    "apartado": "Selección y uso de los EPR"
  }
];
