/** Tema 21 recall cards — fase 2: generadas SOLO desde el texto oficial consolidado (Manual básico de rescate en accidentes de tráfico). Calidad: data/tema21/tema21_calidad.md. */

export type Tema21RecallCard = {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
};

export const TEMA21_RECALL_META = {
  "tema": 21,
  "title": "Tema 21 · Accidentes de tráfico: Procedimiento Unificado de Rescate (Manual básico DGT)",
  "count": 42,
  "source": "Fase 3 · Manual básico de rescate en accidentes de tráfico (DGT-APRAT, 2019), PDF oficial en dgt.es"
} as const;

export const TEMA21_RECALL_CARDS: Tema21RecallCard[] = [
  {
    "id": "CPEI-T21-OF-4CF15000",
    "orden": 10,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿qué significa la conducta PAS?",
    "respuesta": "Proteger, Alertar, Socorrer",
    "fuente": "Manual básico de rescate (DGT-APRAT), Respuesta ante un accidente, pág. 8. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=8",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Respuesta ante un accidente, pág. 8",
    "apartado": "Respuesta inicial y mando"
  },
  {
    "id": "CPEI-T21-OF-BE665CDE",
    "orden": 20,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿qué radio tiene, como norma general, la zona caliente del accidente?",
    "respuesta": "De 2 a 5 metros de radio",
    "fuente": "Manual básico de rescate (DGT-APRAT), Emplazamiento, pág. 20. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=20",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Emplazamiento, pág. 20",
    "apartado": "Emplazamiento y zonificación"
  },
  {
    "id": "CPEI-T21-OF-8BE33D70",
    "orden": 30,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿quién puede acceder a la zona caliente?",
    "respuesta": "Sólo puede acceder el personal con el EPI y la formación adecuada",
    "fuente": "Manual básico de rescate (DGT-APRAT), Emplazamiento, pág. 20. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=20",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Emplazamiento, pág. 20",
    "apartado": "Emplazamiento y zonificación"
  },
  {
    "id": "CPEI-T21-OF-5C033DFF",
    "orden": 40,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿a qué distancia se sitúa la zona templada, destinada a vehículos de bomberos, sanitarios y guardia civil?",
    "respuesta": "Área de acción entre 5 y 10 m.",
    "fuente": "Manual básico de rescate (DGT-APRAT), Zonificación, pág. 24. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=24",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Zonificación, pág. 24",
    "apartado": "Emplazamiento y zonificación"
  },
  {
    "id": "CPEI-T21-OF-E072CEB2",
    "orden": 50,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿cómo se denomina la zona de depósito de herramientas y materiales de rescate?",
    "respuesta": "Punto Base",
    "fuente": "Manual básico de rescate (DGT-APRAT), Zonificación, pág. 24. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=24",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Zonificación, pág. 24",
    "apartado": "Emplazamiento y zonificación"
  },
  {
    "id": "CPEI-T21-OF-813AE0D3",
    "orden": 60,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿cómo se denomina el área para los restos de los vehículos siniestrados?",
    "respuesta": "Punto de chatarra",
    "fuente": "Manual básico de rescate (DGT-APRAT), Zonificación, pág. 24. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=24",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Zonificación, pág. 24",
    "apartado": "Emplazamiento y zonificación"
  },
  {
    "id": "CPEI-T21-OF-50ED02C7",
    "orden": 70,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿qué personal se ubica en la zona fría?",
    "respuesta": "Todo el personal relacionado con la actividad de carreteras, mantenimiento de vías, grúas, etc.",
    "fuente": "Manual básico de rescate (DGT-APRAT), Zonificación, pág. 24. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=24",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Zonificación, pág. 24",
    "apartado": "Emplazamiento y zonificación"
  },
  {
    "id": "CPEI-T21-OF-48DE5B21",
    "orden": 80,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿a qué distancia mínima del accidente se coloca la primera señal de preseñalización en vías convencionales?",
    "respuesta": "100 metros",
    "fuente": "Manual básico de rescate (DGT-APRAT), Preseñalización, pág. 28. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=28",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Preseñalización, pág. 28",
    "apartado": "Emplazamiento y zonificación"
  },
  {
    "id": "CPEI-T21-OF-F27F968D",
    "orden": 90,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿durante cuánto tiempo se realiza el corte total de la circulación?",
    "respuesta": "Por el tiempo mínimo imprescindible",
    "fuente": "Manual básico de rescate (DGT-APRAT), Corte total, pág. 28. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=28",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Corte total, pág. 28",
    "apartado": "Emplazamiento y zonificación"
  },
  {
    "id": "CPEI-T21-OF-75E9FED6",
    "orden": 100,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿qué radio debe tener la zona despejada para el aterrizaje del helicóptero?",
    "respuesta": "30 mts. de radio",
    "fuente": "Manual básico de rescate (DGT-APRAT), Helicóptero, pág. 39. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=39",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Helicóptero, pág. 39",
    "apartado": "Emplazamiento y zonificación"
  },
  {
    "id": "CPEI-T21-OF-F8932F1D",
    "orden": 110,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿cómo debe colocarse el señalero respecto al viento?",
    "respuesta": "De espalda al viento",
    "fuente": "Manual básico de rescate (DGT-APRAT), Helicóptero, pág. 39. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=39",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Helicóptero, pág. 39",
    "apartado": "Emplazamiento y zonificación"
  },
  {
    "id": "CPEI-T21-OF-35A6DA67",
    "orden": 120,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), en estacionamientos del helicóptero en laderas, ¿cómo se entra y se sale?",
    "respuesta": "Siempre se debe entrar hacia arriba y salir hacia abajo",
    "fuente": "Manual básico de rescate (DGT-APRAT), Helicóptero, pág. 41. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=41",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Helicóptero, pág. 41",
    "apartado": "Emplazamiento y zonificación"
  },
  {
    "id": "CPEI-T21-OF-C95156DE",
    "orden": 130,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿en qué consiste fundamentalmente el reconocimiento del escenario?",
    "respuesta": "En dar una vuelta de 360º al escenario del accidente",
    "fuente": "Manual básico de rescate (DGT-APRAT), Reconocimiento, pág. 42. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=42",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Reconocimiento, pág. 42",
    "apartado": "Reconocimiento y control de riesgos"
  },
  {
    "id": "CPEI-T21-OF-1CB334D7",
    "orden": 140,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿a qué combustibles se da prioridad al identificar el combustible del vehículo?",
    "respuesta": "Gasolina y GLP",
    "fuente": "Manual básico de rescate (DGT-APRAT), Reconocimiento, pág. 42. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=42",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Reconocimiento, pág. 42",
    "apartado": "Reconocimiento y control de riesgos"
  },
  {
    "id": "CPEI-T21-OF-3DC6DB91",
    "orden": 150,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿cómo se considera a todo herido inconsciente hasta que se demuestre lo contrario?",
    "respuesta": "Será considerado un herido crítico",
    "fuente": "Manual básico de rescate (DGT-APRAT), Reconocimiento, pág. 45. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=45",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Reconocimiento, pág. 45",
    "apartado": "Reconocimiento y control de riesgos"
  },
  {
    "id": "CPEI-T21-OF-C33F349D",
    "orden": 160,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿en qué dirección se hace el contacto con los heridos desde fuera del vehículo?",
    "respuesta": "Siempre en la dirección hacia donde miran estos",
    "fuente": "Manual básico de rescate (DGT-APRAT), Reconocimiento, pág. 45. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=45",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Reconocimiento, pág. 45",
    "apartado": "Reconocimiento y control de riesgos"
  },
  {
    "id": "CPEI-T21-OF-640B3301",
    "orden": 170,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿qué lema resume la rapidez con que debe extraerse al herido?",
    "respuesta": "“tan rápido como se pueda y tan despacio como se deba”",
    "fuente": "Manual básico de rescate (DGT-APRAT), Prioridades iniciales, pág. 46. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=46",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Prioridades iniciales, pág. 46",
    "apartado": "Reconocimiento y control de riesgos"
  },
  {
    "id": "CPEI-T21-OF-C526E3E0",
    "orden": 180,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿qué significan las siglas SRS del airbag?",
    "respuesta": "Sistema de Retención Suplementado",
    "fuente": "Manual básico de rescate (DGT-APRAT), Control de riesgos: airbag, pág. 48. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=48",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Control de riesgos: airbag, pág. 48",
    "apartado": "Reconocimiento y control de riesgos"
  },
  {
    "id": "CPEI-T21-OF-BC00D2B3",
    "orden": 190,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿cuál es el elemento de protección principal que suplementa el airbag?",
    "respuesta": "El cinturón de seguridad",
    "fuente": "Manual básico de rescate (DGT-APRAT), Control de riesgos: airbag, pág. 48. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=48",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Control de riesgos: airbag, pág. 48",
    "apartado": "Reconocimiento y control de riesgos"
  },
  {
    "id": "CPEI-T21-OF-D109E23B",
    "orden": 200,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿cuánto dura aproximadamente la colisión durante la que debe garantizarse el disparo del airbag?",
    "respuesta": "Alrededor de 120 milésimas de segundo",
    "fuente": "Manual básico de rescate (DGT-APRAT), Control de riesgos: airbag, pág. 50. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=50",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Control de riesgos: airbag, pág. 50",
    "apartado": "Reconocimiento y control de riesgos"
  },
  {
    "id": "CPEI-T21-OF-E2E9861D",
    "orden": 210,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿de qué material son por lo general las pastillas del generador químico del airbag?",
    "respuesta": "Nitruro sódico",
    "fuente": "Manual básico de rescate (DGT-APRAT), Control de riesgos: airbag, pág. 52. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=52",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Control de riesgos: airbag, pág. 52",
    "apartado": "Reconocimiento y control de riesgos"
  },
  {
    "id": "CPEI-T21-OF-4EB6D914",
    "orden": 220,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿qué gas genera mayoritariamente la combustión del generador químico del airbag?",
    "respuesta": "Un 99% Nitrógeno",
    "fuente": "Manual básico de rescate (DGT-APRAT), Control de riesgos: airbag, pág. 52. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=52",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Control de riesgos: airbag, pág. 52",
    "apartado": "Reconocimiento y control de riesgos"
  },
  {
    "id": "CPEI-T21-OF-95FA6477",
    "orden": 230,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿qué indica la palabra SIPS en las pegatinas del vehículo?",
    "respuesta": "Airbag laterales",
    "fuente": "Manual básico de rescate (DGT-APRAT), Etiquetas de airbag, pág. 54. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=54",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Etiquetas de airbag, pág. 54",
    "apartado": "Reconocimiento y control de riesgos"
  },
  {
    "id": "CPEI-T21-OF-05C76C37",
    "orden": 240,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿cuánto se retrae aproximadamente la hebilla especial del pretensor mecánico?",
    "respuesta": "De 6 a 8 cm aproximadamente",
    "fuente": "Manual básico de rescate (DGT-APRAT), Pretensores, pág. 55. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=55",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Pretensores, pág. 55",
    "apartado": "Reconocimiento y control de riesgos"
  },
  {
    "id": "CPEI-T21-OF-2F7FA90B",
    "orden": 250,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿basta con desconectar la batería para anular un sistema de airbag?",
    "respuesta": "No vale solo con desconectar una batería, es necesaria la descarga de los condensadores de la unidad de control",
    "fuente": "Manual básico de rescate (DGT-APRAT), Precauciones, pág. 58. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=58",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Precauciones, pág. 58",
    "apartado": "Reconocimiento y control de riesgos"
  },
  {
    "id": "CPEI-T21-OF-43BCD9F8",
    "orden": 260,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿qué movimientos anula la estabilización del vehículo?",
    "respuesta": "Movimientos horizontales; movimientos verticales; movimientos de balanceo",
    "fuente": "Manual básico de rescate (DGT-APRAT), Estabilización, pág. 59. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=59",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Estabilización, pág. 59",
    "apartado": "Estabilización"
  },
  {
    "id": "CPEI-T21-OF-5BF7C9A9",
    "orden": 270,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿por qué parte del vehículo es aconsejable empezar a estabilizar?",
    "respuesta": "La parte del vehículo más insegura",
    "fuente": "Manual básico de rescate (DGT-APRAT), Estabilización, pág. 59. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=59",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Estabilización, pág. 59",
    "apartado": "Estabilización"
  },
  {
    "id": "CPEI-T21-OF-0DFEF176",
    "orden": 280,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿cuándo se puede mover un vehículo con víctimas en su interior?",
    "respuesta": "Ante la imposibilidad de controlar un gran riesgo: arroyamiento, incendio, etc.",
    "fuente": "Manual básico de rescate (DGT-APRAT), Estabilización, pág. 59. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=59",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Estabilización, pág. 59",
    "apartado": "Estabilización"
  },
  {
    "id": "CPEI-T21-OF-2F55C6C3",
    "orden": 290,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), en un vehículo sobre sus ruedas, ¿bajo qué pilares se colocan los cuatro puntos de calzado?",
    "respuesta": "Debajo de los pilares A y C",
    "fuente": "Manual básico de rescate (DGT-APRAT), Estabilización sobre ruedas, pág. 60. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=60",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Estabilización sobre ruedas, pág. 60",
    "apartado": "Estabilización"
  },
  {
    "id": "CPEI-T21-OF-A845784C",
    "orden": 300,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), en un vehículo sobre sus ruedas, ¿qué se coloca primero para evitar el movimiento longitudinal?",
    "respuesta": "Cuñas en ambos lados de una o dos ruedas",
    "fuente": "Manual básico de rescate (DGT-APRAT), Estabilización sobre ruedas, pág. 60. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=60",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Estabilización sobre ruedas, pág. 60",
    "apartado": "Estabilización"
  },
  {
    "id": "CPEI-T21-OF-029BC216",
    "orden": 310,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿cómo se define a la persona atrapada?",
    "respuesta": "Toda aquella persona que por motivo del accidente no puede salir del coche por su propio pie, debido a las condiciones finales del vehículo y/o por las lesiones sufridas en el impacto",
    "fuente": "Manual básico de rescate (DGT-APRAT), Definición de atrapamiento, pág. 75. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=75",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Definición de atrapamiento, pág. 75",
    "apartado": "Atrapamiento y víctima"
  },
  {
    "id": "CPEI-T21-OF-EEA23F4A",
    "orden": 320,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿cuántos niveles de atrapamiento se definen a nivel profesional técnico?",
    "respuesta": "3 Niveles de Atrapamiento",
    "fuente": "Manual básico de rescate (DGT-APRAT), Niveles de atrapamiento, pág. 75. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=75",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Niveles de atrapamiento, pág. 75",
    "apartado": "Atrapamiento y víctima"
  },
  {
    "id": "CPEI-T21-OF-55D0CE4B",
    "orden": 330,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿qué es el atrapamiento mecánico?",
    "respuesta": "La persona que ha sufrido el accidente no puede salir por motivos estructurales del vehículo (bloqueo de puertas y/o salidas naturales)",
    "fuente": "Manual básico de rescate (DGT-APRAT), Niveles de atrapamiento, pág. 75. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=75",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Niveles de atrapamiento, pág. 75",
    "apartado": "Atrapamiento y víctima"
  },
  {
    "id": "CPEI-T21-OF-43805D29",
    "orden": 340,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿qué es el atrapamiento físico 1?",
    "respuesta": "A consecuencia de las lesiones ocasionadas la persona que ha sufrido el accidente no puede salir del vehículo por su propio pie",
    "fuente": "Manual básico de rescate (DGT-APRAT), Niveles de atrapamiento, pág. 75. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=75",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Niveles de atrapamiento, pág. 75",
    "apartado": "Atrapamiento y víctima"
  },
  {
    "id": "CPEI-T21-OF-C3B89929",
    "orden": 350,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿qué es el atrapamiento físico 2?",
    "respuesta": "La deformidad estructural del vehículo tras el accidente ha atrapado a la persona en alguno de sus miembros (pies, piernas, brazos…) impidiendo su salida",
    "fuente": "Manual básico de rescate (DGT-APRAT), Niveles de atrapamiento, pág. 75. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=75",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Niveles de atrapamiento, pág. 75",
    "apartado": "Atrapamiento y víctima"
  },
  {
    "id": "CPEI-T21-OF-49EE8E5A",
    "orden": 360,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿a qué nivel corresponde el atrapamiento exterior?",
    "respuesta": "A la denominación de Físico 2",
    "fuente": "Manual básico de rescate (DGT-APRAT), Niveles de atrapamiento, pág. 75. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=75",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Niveles de atrapamiento, pág. 75",
    "apartado": "Atrapamiento y víctima"
  },
  {
    "id": "CPEI-T21-OF-9A48C943",
    "orden": 370,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿en qué tres situaciones se establece el estado de la víctima?",
    "respuesta": "Estable, inestable y riesgo vital inminente",
    "fuente": "Manual básico de rescate (DGT-APRAT), Situación de la víctima, pág. 83. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=83",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Situación de la víctima, pág. 83",
    "apartado": "Atrapamiento y víctima"
  },
  {
    "id": "CPEI-T21-OF-A0605766",
    "orden": 380,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿quién define qué plan o planes de excarcelación se desarrollan?",
    "respuesta": "El Mando de Bomberos",
    "fuente": "Manual básico de rescate (DGT-APRAT), Planes de excarcelación, pág. 82. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=82",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Planes de excarcelación, pág. 82",
    "apartado": "Planes y extracción"
  },
  {
    "id": "CPEI-T21-OF-41B32411",
    "orden": 390,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿en qué consiste el Plan de Emergencia?",
    "respuesta": "Espacio mínimo para extracción controlada por manipulación",
    "fuente": "Manual básico de rescate (DGT-APRAT), Planes de excarcelación, pág. 82. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=82",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Planes de excarcelación, pág. 82",
    "apartado": "Planes y extracción"
  },
  {
    "id": "CPEI-T21-OF-A268090A",
    "orden": 400,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿qué espacio busca el Plan B?",
    "respuesta": "Mínimo espacio exterior y gran espacio interior",
    "fuente": "Manual básico de rescate (DGT-APRAT), Planes de excarcelación, pág. 82. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=82",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Planes de excarcelación, pág. 82",
    "apartado": "Planes y extracción"
  },
  {
    "id": "CPEI-T21-OF-3E260B06",
    "orden": 410,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿quién dirige al equipo durante la extracción de la víctima?",
    "respuesta": "El mando sanitario",
    "fuente": "Manual básico de rescate (DGT-APRAT), Extracción, pág. 112. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=112",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Extracción, pág. 112",
    "apartado": "Planes y extracción"
  },
  {
    "id": "CPEI-T21-OF-BC20FDF2",
    "orden": 420,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿a qué posición debe pasar con carácter general la víctima durante la extracción?",
    "respuesta": "Decúbito supino alineado",
    "fuente": "Manual básico de rescate (DGT-APRAT), Extracción, pág. 112. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=112",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Extracción, pág. 112",
    "apartado": "Planes y extracción"
  }
];
