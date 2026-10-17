/** Tema 21 recall cards — fase 2: generadas SOLO desde el texto oficial consolidado (Manual básico de rescate en accidentes de tráfico). Calidad: data/tema21/tema21_lote02_calidad.md. */

export type Tema21RecallCard = {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
};

export const TEMA21_LOTE02_RECALL_META = {
  "tema": 21,
  "lote": "lote02",
  "title": "Tema 21 · lote 2: técnicas de corte y vehículos eléctricos, híbridos y a gas (Manual básico de rescate, DGT)",
  "count": 73,
  "source": "Huecos CEP · Manual básico de rescate en accidentes de tráfico (DGT-APRAT, 2019), dgt.es"
} as const;

export const TEMA21_LOTE02_RECALL_CARDS: Tema21RecallCard[] = [
  {
    "id": "CPEI-T21-OF-7580F3B7",
    "orden": 10,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿qué protección se pone a la víctima para crear una burbuja de trabajo seguro?",
    "respuesta": "Una protección blanda (plástico)",
    "fuente": "Manual básico de rescate (DGT-APRAT), Maniobras básicas de excarcelación, pág. 88. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=88",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Maniobras básicas de excarcelación, pág. 88",
    "apartado": "Técnicas de corte y creación de espacios"
  },
  {
    "id": "CPEI-T21-OF-D9CD83BD",
    "orden": 20,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), antes de usar herramientas para abrir una puerta, ¿qué se comprueba?",
    "respuesta": "Si las puertas se abren de forma manual",
    "fuente": "Manual básico de rescate (DGT-APRAT), Apertura de puerta, pág. 88. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=88",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Apertura de puerta, pág. 88",
    "apartado": "Técnicas de corte y creación de espacios"
  },
  {
    "id": "CPEI-T21-OF-185ACDA3",
    "orden": 30,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿para qué se crea el espacio de ataque en la apertura de puerta?",
    "respuesta": "Para la introducción de las puntas del separador",
    "fuente": "Manual básico de rescate (DGT-APRAT), Apertura de puerta, pág. 88. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=88",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Apertura de puerta, pág. 88",
    "apartado": "Técnicas de corte y creación de espacios"
  },
  {
    "id": "CPEI-T21-OF-70B3CC4D",
    "orden": 40,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿qué no se hará nunca para meter las puntas del separador?",
    "respuesta": "Nunca se darán golpes",
    "fuente": "Manual básico de rescate (DGT-APRAT), Apertura de puerta, pág. 88. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=88",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Apertura de puerta, pág. 88",
    "apartado": "Técnicas de corte y creación de espacios"
  },
  {
    "id": "CPEI-T21-OF-70EFFC89",
    "orden": 50,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), al separar el marco, ¿a qué distancia del pilar B se apoya el separador en el marco de la ventanilla?",
    "respuesta": "A unos 10 cm",
    "fuente": "Manual básico de rescate (DGT-APRAT), Separar marco, pág. 89. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=89",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Separar marco, pág. 89",
    "apartado": "Técnicas de corte y creación de espacios"
  },
  {
    "id": "CPEI-T21-OF-0314D564",
    "orden": 60,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿en qué consiste la técnica del pellizco?",
    "respuesta": "Con el Separador pinzamos los bordes de las puertas para posteriormente moverlo para crear espacio",
    "fuente": "Manual básico de rescate (DGT-APRAT), Técnica del pellizco, pág. 90. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=90",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Técnica del pellizco, pág. 90",
    "apartado": "Técnicas de corte y creación de espacios"
  },
  {
    "id": "CPEI-T21-OF-89D1D3CB",
    "orden": 70,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), al abrir una puerta por la cerradura, ¿cuántos puntos de resistencia hay?",
    "respuesta": "Sólo hay un punto de resistencia",
    "fuente": "Manual básico de rescate (DGT-APRAT), Apertura de puerta por cerradura, pág. 91. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=91",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Apertura de puerta por cerradura, pág. 91",
    "apartado": "Técnicas de corte y creación de espacios"
  },
  {
    "id": "CPEI-T21-OF-816E4CEF",
    "orden": 80,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), al abrir una puerta por las bisagras, ¿qué resistencias hay?",
    "respuesta": "Existen dos puntos de resistencia y el tope de apertura",
    "fuente": "Manual básico de rescate (DGT-APRAT), Apertura de puerta por bisagras, pág. 92. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=92",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Apertura de puerta por bisagras, pág. 92",
    "apartado": "Técnicas de corte y creación de espacios"
  },
  {
    "id": "CPEI-T21-OF-9087EA58",
    "orden": 90,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), al abrir por bisagras, ¿sobre qué bisagra se actúa primero y para qué?",
    "respuesta": "En la bisagra inferior para evitar el enclavamiento de puerta en el suelo",
    "fuente": "Manual básico de rescate (DGT-APRAT), Apertura de puerta por bisagras, pág. 92. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=92",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Apertura de puerta por bisagras, pág. 92",
    "apartado": "Técnicas de corte y creación de espacios"
  },
  {
    "id": "CPEI-T21-OF-CFDCA790",
    "orden": 100,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), al abrir una puerta con sierra de sable, ¿qué debe abarcar el corte?",
    "respuesta": "Toda la anchura de la puerta",
    "fuente": "Manual básico de rescate (DGT-APRAT), Apertura de puerta con sierra de sable, pág. 92. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=92",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Apertura de puerta con sierra de sable, pág. 92",
    "apartado": "Técnicas de corte y creación de espacios"
  },
  {
    "id": "CPEI-T21-OF-44895C4D",
    "orden": 110,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), antes de cortar los pilares, ¿qué elementos hay que buscar al explorarlos?",
    "respuesta": "Airbag, refuerzos, etc.",
    "fuente": "Manual básico de rescate (DGT-APRAT), Retirada simple de lateral, pág. 93. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=93",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Retirada simple de lateral, pág. 93",
    "apartado": "Techo, lateral y salpicadero"
  },
  {
    "id": "CPEI-T21-OF-B3D1A2CF",
    "orden": 120,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), en la retirada simple de lateral, ¿qué pilar se corta por su parte inferior y superior?",
    "respuesta": "El pilar B",
    "fuente": "Manual básico de rescate (DGT-APRAT), Retirada simple de lateral, pág. 93. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=93",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Retirada simple de lateral, pág. 93",
    "apartado": "Techo, lateral y salpicadero"
  },
  {
    "id": "CPEI-T21-OF-7557B4FE",
    "orden": 130,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), al retirar el lateral abatiendo la puerta trasera, ¿cómo se corta el pilar B en su parte inferior?",
    "respuesta": "Realizando dos cortes en forma de V",
    "fuente": "Manual básico de rescate (DGT-APRAT), Retirada de lateral con abatimiento de puerta trasera, pág. 94. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=94",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Retirada de lateral con abatimiento de puerta trasera, pág. 94",
    "apartado": "Techo, lateral y salpicadero"
  },
  {
    "id": "CPEI-T21-OF-D76CE397",
    "orden": 140,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿qué se consigue con la maniobra de tercera puerta?",
    "respuesta": "Crear una abertura lateral en un vehículo de una puerta en su lateral",
    "fuente": "Manual básico de rescate (DGT-APRAT), Tercera puerta, pág. 94. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=94",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Tercera puerta, pág. 94",
    "apartado": "Techo, lateral y salpicadero"
  },
  {
    "id": "CPEI-T21-OF-B6D989C7",
    "orden": 150,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), en la tercera puerta con herramientas hidráulicas, ¿hasta dónde se abate la zona desplazada?",
    "respuesta": "Hasta llegar a la horizontal",
    "fuente": "Manual básico de rescate (DGT-APRAT), Tercera puerta con herramientas hidráulicas, pág. 94. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=94",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Tercera puerta con herramientas hidráulicas, pág. 94",
    "apartado": "Techo, lateral y salpicadero"
  },
  {
    "id": "CPEI-T21-OF-C4E0B9E5",
    "orden": 160,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), en la tercera puerta con sierra de sable, ¿dónde se empieza el corte?",
    "respuesta": "En la zona de ventanilla trasera lo más cerca posible del pilar C",
    "fuente": "Manual básico de rescate (DGT-APRAT), Tercera puerta con sierra de sable, pág. 95. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=95",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Tercera puerta con sierra de sable, pág. 95",
    "apartado": "Techo, lateral y salpicadero"
  },
  {
    "id": "CPEI-T21-OF-9AC7EED7",
    "orden": 170,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿qué facilita la retirada del techo?",
    "respuesta": "Facilita acceso al herido y su posterior extracción",
    "fuente": "Manual básico de rescate (DGT-APRAT), Retirada del techo, pág. 96. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=96",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Retirada del techo, pág. 96",
    "apartado": "Techo, lateral y salpicadero"
  },
  {
    "id": "CPEI-T21-OF-A832B95C",
    "orden": 180,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), al retirar el techo de un vehículo de cinco puertas, ¿cómo se corta el portón?",
    "respuesta": "En su parte superior salvando los pistones",
    "fuente": "Manual básico de rescate (DGT-APRAT), Retirada del techo, pág. 96. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=96",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Retirada del techo, pág. 96",
    "apartado": "Techo, lateral y salpicadero"
  },
  {
    "id": "CPEI-T21-OF-09CB4A4A",
    "orden": 190,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), al retirar el techo, ¿por qué zona se cortan los pilares C, B y A?",
    "respuesta": "En la zona intermedia (cerca de la puerta)",
    "fuente": "Manual básico de rescate (DGT-APRAT), Retirada del techo, pág. 96. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=96",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Retirada del techo, pág. 96",
    "apartado": "Techo, lateral y salpicadero"
  },
  {
    "id": "CPEI-T21-OF-BA408909",
    "orden": 200,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), al retirar el techo, ¿con qué herramienta se corta la luna delantera?",
    "respuesta": "Con sierra de sable",
    "fuente": "Manual básico de rescate (DGT-APRAT), Retirada del techo, pág. 96. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=96",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Retirada del techo, pág. 96",
    "apartado": "Techo, lateral y salpicadero"
  },
  {
    "id": "CPEI-T21-OF-A7714D3D",
    "orden": 210,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), en el abatimiento de techo hacia delante, ¿qué corte se hace en ambos lados del techo detrás del parabrisas?",
    "respuesta": "Corte de alivio",
    "fuente": "Manual básico de rescate (DGT-APRAT), Abatimiento de techo hacia delante, pág. 97. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=97",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Abatimiento de techo hacia delante, pág. 97",
    "apartado": "Techo, lateral y salpicadero"
  },
  {
    "id": "CPEI-T21-OF-324A55EA",
    "orden": 220,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), en el abatimiento de techo hacia delante, ¿qué medios ayudan al doblado y a la tracción?",
    "respuesta": "Una barra para ayudar en el proceso de doblado, además se utilizará una cincha para la tracción",
    "fuente": "Manual básico de rescate (DGT-APRAT), Abatimiento de techo hacia delante, pág. 97. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=97",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Abatimiento de techo hacia delante, pág. 97",
    "apartado": "Techo, lateral y salpicadero"
  },
  {
    "id": "CPEI-T21-OF-F65FACC5",
    "orden": 230,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), si el techo está muy deformado, ¿qué puede hacer falta para abatirlo?",
    "respuesta": "Usar el separador o gato hidráulico",
    "fuente": "Manual básico de rescate (DGT-APRAT), Abatimiento parcial de techo, pág. 97. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=97",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Abatimiento parcial de techo, pág. 97",
    "apartado": "Techo, lateral y salpicadero"
  },
  {
    "id": "CPEI-T21-OF-B899E304",
    "orden": 240,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), tras abatir el techo de un vehículo volcado sobre su lateral, ¿qué se crea con él?",
    "respuesta": "Plataforma horizontal con el techo, colocando bajo este, bloques de estabilización",
    "fuente": "Manual básico de rescate (DGT-APRAT), Vehículo sobre lateral, pág. 99. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=99",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Vehículo sobre lateral, pág. 99",
    "apartado": "Techo, lateral y salpicadero"
  },
  {
    "id": "CPEI-T21-OF-1D09985D",
    "orden": 250,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), en el abatimiento de techo y elevación de un vehículo sobre el techo, ¿dónde se colocan los puntales?",
    "respuesta": "En la parte posterior",
    "fuente": "Manual básico de rescate (DGT-APRAT), Vehículo sobre techo, pág. 102. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=102",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Vehículo sobre techo, pág. 102",
    "apartado": "Techo, lateral y salpicadero"
  },
  {
    "id": "CPEI-T21-OF-5D0492D2",
    "orden": 260,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), en un vehículo sobre el techo, ¿qué se coloca entre el techo y un elemento estable para elevar la parte trasera?",
    "respuesta": "Gato hidráulico",
    "fuente": "Manual básico de rescate (DGT-APRAT), Vehículo sobre techo, pág. 102. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=102",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Vehículo sobre techo, pág. 102",
    "apartado": "Techo, lateral y salpicadero"
  },
  {
    "id": "CPEI-T21-OF-15F096EC",
    "orden": 270,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), al abatir la puerta junto con el pilar B, ¿dónde se hacen los cortes perpendiculares en el travesaño?",
    "respuesta": "A los dos lados de la base del pilar B",
    "fuente": "Manual básico de rescate (DGT-APRAT), Abatimiento de puerta y pilar B, pág. 104. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=104",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Abatimiento de puerta y pilar B, pág. 104",
    "apartado": "Techo, lateral y salpicadero"
  },
  {
    "id": "CPEI-T21-OF-9116FFE3",
    "orden": 280,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), en el levantamiento de salpicadero, ¿qué distancia debe haber entre los dos cortes del pilar A?",
    "respuesta": "15 cm",
    "fuente": "Manual básico de rescate (DGT-APRAT), Levantamiento de salpicadero, pág. 107. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=107",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Levantamiento de salpicadero, pág. 107",
    "apartado": "Techo, lateral y salpicadero"
  },
  {
    "id": "CPEI-T21-OF-B11F8CC5",
    "orden": 290,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), en el levantamiento de salpicadero, ¿cómo se colocan las pinzas del separador en el hueco del pilar A?",
    "respuesta": "En ángulo de 90º ligeramente inclinado hacia arriba",
    "fuente": "Manual básico de rescate (DGT-APRAT), Levantamiento de salpicadero, pág. 107. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=107",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Levantamiento de salpicadero, pág. 107",
    "apartado": "Techo, lateral y salpicadero"
  },
  {
    "id": "CPEI-T21-OF-AC351665",
    "orden": 300,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), antes de cortar el montante A, ¿qué protección se usa por cortar vidrio?",
    "respuesta": "Mascarilla buco-nasal",
    "fuente": "Manual básico de rescate (DGT-APRAT), Levantamiento de salpicadero, pág. 108. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=108",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Levantamiento de salpicadero, pág. 108",
    "apartado": "Techo, lateral y salpicadero"
  },
  {
    "id": "CPEI-T21-OF-83D18199",
    "orden": 310,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), en el levantamiento de salpicadero, ¿dónde se da el corte del chasis?",
    "respuesta": "Justo por detrás del amortiguador",
    "fuente": "Manual básico de rescate (DGT-APRAT), Levantamiento de salpicadero, pág. 108. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=108",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Levantamiento de salpicadero, pág. 108",
    "apartado": "Techo, lateral y salpicadero"
  },
  {
    "id": "CPEI-T21-OF-0454C8A7",
    "orden": 320,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), al desplazar el volante con el separador, ¿dónde se colocan sus puntas?",
    "respuesta": "Una punta en el pilar A y la otra punta en el interior del radio del volante",
    "fuente": "Manual básico de rescate (DGT-APRAT), Desplazamiento del volante, pág. 109. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=109",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Desplazamiento del volante, pág. 109",
    "apartado": "Techo, lateral y salpicadero"
  },
  {
    "id": "CPEI-T21-OF-5EFE8085",
    "orden": 330,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿con qué se aconseja acompañar el desplazamiento del volante para mayor seguridad?",
    "respuesta": "Con una polea de amarre rápido",
    "fuente": "Manual básico de rescate (DGT-APRAT), Desplazamiento del volante, pág. 109. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=109",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Desplazamiento del volante, pág. 109",
    "apartado": "Techo, lateral y salpicadero"
  },
  {
    "id": "CPEI-T21-OF-E666B3F0",
    "orden": 340,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿cuál es la regla de oro ante vehículos de nuevas tecnologías?",
    "respuesta": "Conocer los riesgos implica estar alerta e intervenir con seguridad",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, introducción, pág. 134. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=134",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, introducción, pág. 134",
    "apartado": "Intervención en vehículos de nuevas tecnologías"
  },
  {
    "id": "CPEI-T21-OF-5D2AB161",
    "orden": 350,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿cómo son propulsados los vehículos eléctricos?",
    "respuesta": "Únicamente por un motor eléctrico",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 1.1 Principio de funcionamiento, pág. 135. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=135",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 1.1 Principio de funcionamiento, pág. 135",
    "apartado": "Vehículos eléctricos e híbridos"
  },
  {
    "id": "CPEI-T21-OF-CD9E2DFB",
    "orden": 360,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿qué combinan los vehículos híbridos?",
    "respuesta": "Un motor térmico (gasolina o diésel) y un motor eléctrico",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 1.1 Principio de funcionamiento, pág. 135. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=135",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 1.1 Principio de funcionamiento, pág. 135",
    "apartado": "Vehículos eléctricos e híbridos"
  },
  {
    "id": "CPEI-T21-OF-9A92A5C5",
    "orden": 370,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿con qué tipo de corriente funciona el motor eléctrico de un VE o VH?",
    "respuesta": "Con corriente alterna",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 1.2 Componentes específicos, pág. 137. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=137",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 1.2 Componentes específicos, pág. 137",
    "apartado": "Vehículos eléctricos e híbridos"
  },
  {
    "id": "CPEI-T21-OF-7192E17A",
    "orden": 380,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿qué hace el inversor/convertidor con la corriente de la batería de alto voltaje?",
    "respuesta": "Cambia la corriente continua de la batería de alto voltaje (AV) en corriente alterna para mover el motor eléctrico",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 1.2 Componentes específicos, pág. 137. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=137",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 1.2 Componentes específicos, pág. 137",
    "apartado": "Vehículos eléctricos e híbridos"
  },
  {
    "id": "CPEI-T21-OF-1B15DC2B",
    "orden": 390,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿qué se considera batería auxiliar o de servicio?",
    "respuesta": "La batería de 12 o 24 voltios",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 1.2 Componentes específicos, pág. 137. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=137",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 1.2 Componentes específicos, pág. 137",
    "apartado": "Vehículos eléctricos e híbridos"
  },
  {
    "id": "CPEI-T21-OF-D4B8B41B",
    "orden": 400,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿qué electrolitos son los más habituales en las baterías de alto voltaje?",
    "respuesta": "Níquel Metal Hidruro (NiMH), Níquel Cadmio (NiCd), Litio-Ión (Li-Ion) y Litio Metal Polímero (LMP)",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 1.2 Batería de alto voltaje, pág. 138. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=138",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 1.2 Batería de alto voltaje, pág. 138",
    "apartado": "Vehículos eléctricos e híbridos"
  },
  {
    "id": "CPEI-T21-OF-4EFF2721",
    "orden": 410,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿dónde suelen ir las baterías de alto voltaje en los autobuses?",
    "respuesta": "En el techo bajo una carcasa de protección",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 1.2 Batería de alto voltaje, pág. 138. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=138",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 1.2 Batería de alto voltaje, pág. 138",
    "apartado": "Vehículos eléctricos e híbridos"
  },
  {
    "id": "CPEI-T21-OF-059DA7C3",
    "orden": 420,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿qué anula el interruptor manual de servicio o «Plug Service»?",
    "respuesta": "El intercambio de energía de la batería de alto voltaje hacia el resto del vehículo",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 1.2 Batería de alto voltaje, pág. 139. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=139",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 1.2 Batería de alto voltaje, pág. 139",
    "apartado": "Vehículos eléctricos e híbridos"
  },
  {
    "id": "CPEI-T21-OF-ECEE34B4",
    "orden": 430,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿cómo se identifican los cables de alto voltaje?",
    "respuesta": "Por una protección de color naranja normalizado",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 1.2 Cables de alimentación, pág. 140. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=140",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 1.2 Cables de alimentación, pág. 140",
    "apartado": "Vehículos eléctricos e híbridos"
  },
  {
    "id": "CPEI-T21-OF-712C9968",
    "orden": 440,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿qué vehículos híbridos tienen toma de carga externa?",
    "respuesta": "Solo los modelos enchufables o Plug-In",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 1.2 Toma de corriente externa, pág. 140. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=140",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 1.2 Toma de corriente externa, pág. 140",
    "apartado": "Vehículos eléctricos e híbridos"
  },
  {
    "id": "CPEI-T21-OF-8C4804BB",
    "orden": 450,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿cuánto tiempo mantienen su tensión los condensadores en el ejemplo del Toyota Prius III híbrido de 2010?",
    "respuesta": "10 minutos",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 1.4 Sistemas de seguridad, pág. 142. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=142",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 1.4 Sistemas de seguridad, pág. 142",
    "apartado": "Vehículos eléctricos e híbridos"
  },
  {
    "id": "CPEI-T21-OF-EF78C163",
    "orden": 460,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿en qué consiste la aceleración térmica de una batería de alto voltaje?",
    "respuesta": "La emisión de vapores muy inflamables, a baja presión, que aumenta la potencia del fuego",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 1.5 Riesgos asociados, pág. 143. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=143",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 1.5 Riesgos asociados, pág. 143",
    "apartado": "Vehículos eléctricos e híbridos"
  },
  {
    "id": "CPEI-T21-OF-CBF2E225",
    "orden": 470,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿cuánto puede prolongarse el incendio de una batería de alto voltaje?",
    "respuesta": "Hasta una hora",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 1.5 Riesgos asociados, pág. 143. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=143",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 1.5 Riesgos asociados, pág. 143",
    "apartado": "Vehículos eléctricos e híbridos"
  },
  {
    "id": "CPEI-T21-OF-7AF68788",
    "orden": 480,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿qué componentes de un VE o VH son los más importantes para la intervención?",
    "respuesta": "La batería de AV, los cables naranja y la batería auxiliar",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 1.6 Resumen VE/VH, pág. 144. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=144",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 1.6 Resumen VE/VH, pág. 144",
    "apartado": "Vehículos eléctricos e híbridos"
  },
  {
    "id": "CPEI-T21-OF-25F27646",
    "orden": 490,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿con qué otro nombre se conoce el GLP?",
    "respuesta": "“Autogas”",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 2.1 Tipos de gas vehicular, pág. 145. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=145",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 2.1 Tipos de gas vehicular, pág. 145",
    "apartado": "Vehículos a gas e hidrógeno"
  },
  {
    "id": "CPEI-T21-OF-8ABDA3A2",
    "orden": 500,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿cómo describe la comercialización de los vehículos de hidrógeno?",
    "respuesta": "Hoy en día está muy poco comercializado, suelen ser vehículos prototipo",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 2.1 Tipos de gas vehicular, pág. 145. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=145",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 2.1 Tipos de gas vehicular, pág. 145",
    "apartado": "Vehículos a gas e hidrógeno"
  },
  {
    "id": "CPEI-T21-OF-16876B5D",
    "orden": 510,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿a qué presión se almacena el GNC?",
    "respuesta": "Comprimido a 200 bares",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 2.2 Características de los gases, pág. 146. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=146",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 2.2 Características de los gases, pág. 146",
    "apartado": "Vehículos a gas e hidrógeno"
  },
  {
    "id": "CPEI-T21-OF-C49A190D",
    "orden": 520,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿a qué temperatura se licúa el GNL?",
    "respuesta": "A -161ºC",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 2.2 Características de los gases, pág. 146. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=146",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 2.2 Características de los gases, pág. 146",
    "apartado": "Vehículos a gas e hidrógeno"
  },
  {
    "id": "CPEI-T21-OF-59A7FFA9",
    "orden": 530,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿qué son mayoritariamente los vehículos Bi-Fuel?",
    "respuesta": "Turismos de gasolina convertidos a gas (GLP o GNC)",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 2.3 Tipos de sistemas de gas, pág. 146. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=146",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 2.3 Tipos de sistemas de gas, pág. 146",
    "apartado": "Vehículos a gas e hidrógeno"
  },
  {
    "id": "CPEI-T21-OF-5658DE5C",
    "orden": 540,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿qué combustible usan los vehículos Dual Fuel?",
    "respuesta": "Una mezcla de gas y diésel en distintas proporciones",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 2.3 Tipos de sistemas de gas, pág. 147. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=147",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 2.3 Tipos de sistemas de gas, pág. 147",
    "apartado": "Vehículos a gas e hidrógeno"
  },
  {
    "id": "CPEI-T21-OF-D2114A26",
    "orden": 550,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿qué hace el reductor-vaporizador con el GLP?",
    "respuesta": "Reducir la presión del GLP y transformarlo en estado gaseoso",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 2.4 Funcionamiento y componentes, pág. 150. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=150",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 2.4 Funcionamiento y componentes, pág. 150",
    "apartado": "Vehículos a gas e hidrógeno"
  },
  {
    "id": "CPEI-T21-OF-30DFD9F6",
    "orden": 560,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿qué es el conmutador de un vehículo a gas?",
    "respuesta": "El dispositivo ubicado en el salpicadero que permite el cambio de gas a gasolina o al contrario",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 2.4 Funcionamiento y componentes, pág. 150. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=150",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 2.4 Funcionamiento y componentes, pág. 150",
    "apartado": "Vehículos a gas e hidrógeno"
  },
  {
    "id": "CPEI-T21-OF-D7073CD4",
    "orden": 570,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿a qué presión actúa la válvula de sobrepresión del depósito de GLP?",
    "respuesta": "Al alcanzar los 27 bares",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 2.7 Riesgos asociados, pág. 153. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=153",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 2.7 Riesgos asociados, pág. 153",
    "apartado": "Vehículos a gas e hidrógeno"
  },
  {
    "id": "CPEI-T21-OF-EAFB925D",
    "orden": 580,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿a qué temperatura aproximada actúa la válvula termofusible de los depósitos de GNC?",
    "respuesta": "110º aproximadamente",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 2.7 Riesgos asociados, pág. 153. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=153",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 2.7 Riesgos asociados, pág. 153",
    "apartado": "Vehículos a gas e hidrógeno"
  },
  {
    "id": "CPEI-T21-OF-2070672E",
    "orden": 590,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿dónde se deposita el GLP en caso de fuga?",
    "respuesta": "En la parte más baja",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 2.8 Resumen vehículos a gas, pág. 154. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=154",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 2.8 Resumen vehículos a gas, pág. 154",
    "apartado": "Vehículos a gas e hidrógeno"
  },
  {
    "id": "CPEI-T21-OF-1AC10942",
    "orden": 600,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿qué significan las siglas IRPIA?",
    "respuesta": "Identificación, Reconocimiento, Prohibición, Inmovilización y Aislamiento",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 3.1 Medidas iniciales, pág. 155. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=155",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 3.1 Medidas iniciales, pág. 155",
    "apartado": "Intervención en vehículos de nuevas tecnologías"
  },
  {
    "id": "CPEI-T21-OF-028FB48C",
    "orden": 610,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿en qué consiste la fase rápida de aislamiento?",
    "respuesta": "Desconexión de la batería auxiliar 12/24v",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 3.1 Medidas iniciales, pág. 155. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=155",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 3.1 Medidas iniciales, pág. 155",
    "apartado": "Intervención en vehículos de nuevas tecnologías"
  },
  {
    "id": "CPEI-T21-OF-CA72FF36",
    "orden": 620,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿en qué consiste la fase lenta de aislamiento?",
    "respuesta": "Desconexión del interruptor AV (Plug Service) Cierre manual de los depósitos de Gas",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 3.1 Medidas iniciales, pág. 155. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=155",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 3.1 Medidas iniciales, pág. 155",
    "apartado": "Intervención en vehículos de nuevas tecnologías"
  },
  {
    "id": "CPEI-T21-OF-63D1E730",
    "orden": 630,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), ¿a qué distancia deben alejarse las llaves con sistema inteligente para garantizar la desconexión del encendido?",
    "respuesta": "Al menos 5 metros",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 3.1 Aclaraciones, pág. 156. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=156",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 3.1 Aclaraciones, pág. 156",
    "apartado": "Intervención en vehículos de nuevas tecnologías"
  },
  {
    "id": "CPEI-T21-OF-7C2C0B9D",
    "orden": 640,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), en un VE o VH, ¿qué puede producirse al accionar el interruptor AV (Plug Service)?",
    "respuesta": "Un arco eléctrico",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 3.1 Aclaraciones, pág. 156. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=156",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 3.1 Aclaraciones, pág. 156",
    "apartado": "Intervención en vehículos de nuevas tecnologías"
  },
  {
    "id": "CPEI-T21-OF-45B67DFE",
    "orden": 650,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), en un incendio de estos vehículos, ¿qué perímetro de seguridad se aconseja en el puesto base?",
    "respuesta": "Aconsejable 50 m",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 3.2 Incendio, pág. 157. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=157",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 3.2 Incendio, pág. 157",
    "apartado": "Intervención en vehículos de nuevas tecnologías"
  },
  {
    "id": "CPEI-T21-OF-BFEBD93E",
    "orden": 660,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), en un incendio de estos vehículos, ¿con qué instalación se monta el puesto base?",
    "respuesta": "Con dos líneas de 45",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 3.2 Incendio, pág. 157. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=157",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 3.2 Incendio, pág. 157",
    "apartado": "Intervención en vehículos de nuevas tecnologías"
  },
  {
    "id": "CPEI-T21-OF-F5049DF2",
    "orden": 670,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), en un incendio de estos vehículos, ¿con qué caudal y forma de chorro se hace la progresión?",
    "respuesta": "Q=250L/min y a chorro",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 3.2 Incendio, pág. 157. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=157",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 3.2 Incendio, pág. 157",
    "apartado": "Intervención en vehículos de nuevas tecnologías"
  },
  {
    "id": "CPEI-T21-OF-28BA657B",
    "orden": 680,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), en un incendio de vehículos ligeros, ¿qué trayectoria sigue el ataque?",
    "respuesta": "La trayectoria del eje frontal ¾ desde los intermitentes delanteros del vehículo",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 3.2 Incendio, pág. 158. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=158",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 3.2 Incendio, pág. 158",
    "apartado": "Intervención en vehículos de nuevas tecnologías"
  },
  {
    "id": "CPEI-T21-OF-C7A7E51D",
    "orden": 690,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), en un incendio de autobuses y camiones, ¿en qué se centran inicialmente ambos equipos?",
    "respuesta": "En enfriar la zona de los depósitos/baterías AV",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 3.2 Incendio, pág. 158. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=158",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 3.2 Incendio, pág. 158",
    "apartado": "Intervención en vehículos de nuevas tecnologías"
  },
  {
    "id": "CPEI-T21-OF-C478B554",
    "orden": 700,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), en un vehículo a gas natural en recinto confinado, una vez actúa la válvula y aparece la antorcha de fuego, ¿qué no se debe hacer?",
    "respuesta": "No extinguir la antorcha",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 3.2 Incendio, pág. 158. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=158",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 3.2 Incendio, pág. 158",
    "apartado": "Intervención en vehículos de nuevas tecnologías"
  },
  {
    "id": "CPEI-T21-OF-0872478D",
    "orden": 710,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), al estabilizar estos vehículos, ¿con qué no deben coincidir los puntos de apoyo?",
    "respuesta": "Con componentes eléctricos de AV (cables naranja, batería AV…) o gas (depósitos, tuberías…)",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 3.3 Accidente, pág. 159. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=159",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 3.3 Accidente, pág. 159",
    "apartado": "Intervención en vehículos de nuevas tecnologías"
  },
  {
    "id": "CPEI-T21-OF-09092369",
    "orden": 720,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), si un VH o VE se sumerge, ¿qué ocurre con sus baterías?",
    "respuesta": "Entrarán rápidamente en derivación con el agua",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 3.5 Inmersión, pág. 161. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=161",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 3.5 Inmersión, pág. 161",
    "apartado": "Intervención en vehículos de nuevas tecnologías"
  },
  {
    "id": "CPEI-T21-OF-9408BE5F",
    "orden": 730,
    "concepto": "Según el Manual básico de rescate en accidentes de tráfico (DGT), si hay fuga de gas, ¿qué se prioriza en la fase de aislamiento?",
    "respuesta": "El cierre de las válvulas de los depósitos de gas",
    "fuente": "Manual básico de rescate (DGT-APRAT), Anexo I, 3.6 Resumen métodos de intervención, pág. 162. Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es): https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf#page=162",
    "localizacion": "Manual básico de rescate (DGT-APRAT), Anexo I, 3.6 Resumen métodos de intervención, pág. 162",
    "apartado": "Intervención en vehículos de nuevas tecnologías"
  }
];
