/** Tema 30 recall cards — fase 2: generadas SOLO desde el texto oficial consolidado (Decreto 39/2025, Decreto 189/2019, Decreto 200/2019, Decreto 127/2009). Calidad: data/tema30/tema30_calidad.md. */

export type Tema30RecallCard = {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
};

export const TEMA30_RECALL_META = {
  "tema": 30,
  "title": "Tema 30 · Planes especiales de Extremadura: INUNCAEX, TRANSCAEX, RADIOCAEX y PLASISMEX",
  "count": 87,
  "source": "Fase 3 · textos íntegros oficiales en juntaex.es de INUNCAEX (Decreto 39/2025), TRANSCAEX (Decreto 189/2019), RADIOCAEX (Decreto 200/2019) y PLASISMEX (Decreto 127/2009)"
} as const;

export const TEMA30_RECALL_CARDS: Tema30RecallCard[] = [
  {
    "id": "CPEI-T30-OF-98172D42",
    "orden": 10,
    "concepto": "Según el INUNCAEX, ¿de acuerdo con qué apartado de la Directriz Básica de inundaciones se redacta el plan?",
    "respuesta": "El apartado 3.4 de la Directriz Básica de Planificación de Protección Civil ante riesgo de inundaciones",
    "fuente": "INUNCAEX, cap. I, 2.1, pág. 10. Decreto 39/2025, de 13 de mayo, por el que se actualiza el INUNCAEX (DOE nº 94, de 19/05/2025); texto íntegro oficial (versión PDF de 09/05/2025): https://www.juntaex.es/documents/77055/406857/INUNCAEX_2024.pdf#page=10",
    "localizacion": "INUNCAEX, cap. I, 2.1, pág. 10",
    "apartado": "INUNCAEX"
  },
  {
    "id": "CPEI-T30-OF-3AD70A7C",
    "orden": 20,
    "concepto": "Según el INUNCAEX, ¿con qué objeto establece el plan la organización y procedimientos de actuación de los recursos y servicios?",
    "respuesta": "Con el objeto de hacer frente a las emergencias por riesgo de inundaciones, dentro del ámbito territorial de Extremadura",
    "fuente": "INUNCAEX, cap. I, 2.2, pág. 10. Decreto 39/2025, de 13 de mayo, por el que se actualiza el INUNCAEX (DOE nº 94, de 19/05/2025); texto íntegro oficial (versión PDF de 09/05/2025): https://www.juntaex.es/documents/77055/406857/INUNCAEX_2024.pdf#page=10",
    "localizacion": "INUNCAEX, cap. I, 2.2, pág. 10",
    "apartado": "INUNCAEX"
  },
  {
    "id": "CPEI-T30-OF-4CACFF79",
    "orden": 30,
    "concepto": "Según el INUNCAEX, ¿con qué plan estatal prevé el plan mecanismos de coordinación?",
    "respuesta": "Con el Plan Estatal de Protección Civil ante el Riesgo de Inundaciones",
    "fuente": "INUNCAEX, cap. I, 2.3, pág. 11. Decreto 39/2025, de 13 de mayo, por el que se actualiza el INUNCAEX (DOE nº 94, de 19/05/2025); texto íntegro oficial (versión PDF de 09/05/2025): https://www.juntaex.es/documents/77055/406857/INUNCAEX_2024.pdf#page=11",
    "localizacion": "INUNCAEX, cap. I, 2.3, pág. 11",
    "apartado": "INUNCAEX"
  },
  {
    "id": "CPEI-T30-OF-4D0FBB55",
    "orden": 40,
    "concepto": "Según el INUNCAEX, ¿en función de qué precisa el plan la zonificación del territorio?",
    "respuesta": "En función del riesgo de inundaciones",
    "fuente": "INUNCAEX, cap. I, 2.3, pág. 11. Decreto 39/2025, de 13 de mayo, por el que se actualiza el INUNCAEX (DOE nº 94, de 19/05/2025); texto íntegro oficial (versión PDF de 09/05/2025): https://www.juntaex.es/documents/77055/406857/INUNCAEX_2024.pdf#page=11",
    "localizacion": "INUNCAEX, cap. I, 2.3, pág. 11",
    "apartado": "INUNCAEX"
  },
  {
    "id": "CPEI-T30-OF-DFE9620F",
    "orden": 50,
    "concepto": "Según el INUNCAEX, ¿quién es responsable de elaborar los Planes de Emergencia de Presas?",
    "respuesta": "Los titulares de las mismas",
    "fuente": "INUNCAEX, cap. I, 4, pág. 12. Decreto 39/2025, de 13 de mayo, por el que se actualiza el INUNCAEX (DOE nº 94, de 19/05/2025); texto íntegro oficial (versión PDF de 09/05/2025): https://www.juntaex.es/documents/77055/406857/INUNCAEX_2024.pdf#page=12",
    "localizacion": "INUNCAEX, cap. I, 4, pág. 12",
    "apartado": "INUNCAEX"
  },
  {
    "id": "CPEI-T30-OF-0D0B80AC",
    "orden": 60,
    "concepto": "Según el INUNCAEX, ¿qué comisión debe informar preceptivamente los Planes de Actuación Municipal frente a inundaciones?",
    "respuesta": "La Comisión de Protección Civil de Extremadura",
    "fuente": "INUNCAEX, cap. I, 4, pág. 12. Decreto 39/2025, de 13 de mayo, por el que se actualiza el INUNCAEX (DOE nº 94, de 19/05/2025); texto íntegro oficial (versión PDF de 09/05/2025): https://www.juntaex.es/documents/77055/406857/INUNCAEX_2024.pdf#page=12",
    "localizacion": "INUNCAEX, cap. I, 4, pág. 12",
    "apartado": "INUNCAEX"
  },
  {
    "id": "CPEI-T30-OF-9F075892",
    "orden": 70,
    "concepto": "Según el INUNCAEX, ¿quién ostenta la Dirección del Plan y la Dirección de la Emergencia?",
    "respuesta": "El/la Titular de la Consejería con competencias en materia de Protección Civil y Emergencias en Extremadura",
    "fuente": "INUNCAEX, cap. IV, 2.1, pág. 310. Decreto 39/2025, de 13 de mayo, por el que se actualiza el INUNCAEX (DOE nº 94, de 19/05/2025); texto íntegro oficial (versión PDF de 09/05/2025): https://www.juntaex.es/documents/77055/406857/INUNCAEX_2024.pdf#page=310",
    "localizacion": "INUNCAEX, cap. IV, 2.1, pág. 310",
    "apartado": "INUNCAEX"
  },
  {
    "id": "CPEI-T30-OF-04A5AF52",
    "orden": 80,
    "concepto": "Según el INUNCAEX, ¿qué funciones complementarias asume el director o directora del plan?",
    "respuesta": "Nombrar los distintos responsables del Comité Asesor. Asegurar la implantación, mantenimiento y revisión del Plan Especial",
    "fuente": "INUNCAEX, cap. IV, 2.1, pág. 312. Decreto 39/2025, de 13 de mayo, por el que se actualiza el INUNCAEX (DOE nº 94, de 19/05/2025); texto íntegro oficial (versión PDF de 09/05/2025): https://www.juntaex.es/documents/77055/406857/INUNCAEX_2024.pdf#page=312",
    "localizacion": "INUNCAEX, cap. IV, 2.1, pág. 312",
    "apartado": "INUNCAEX"
  },
  {
    "id": "CPEI-T30-OF-584BB96C",
    "orden": 90,
    "concepto": "Según el INUNCAEX, ¿qué personal técnico propio de un centro de alerta se integra además en el Grupo de Apoyo Técnico?",
    "respuesta": "Personal técnico de Alerta2",
    "fuente": "INUNCAEX, cap. IV, 3.4.2, pág. 321. Decreto 39/2025, de 13 de mayo, por el que se actualiza el INUNCAEX (DOE nº 94, de 19/05/2025); texto íntegro oficial (versión PDF de 09/05/2025): https://www.juntaex.es/documents/77055/406857/INUNCAEX_2024.pdf#page=321",
    "localizacion": "INUNCAEX, cap. IV, 3.4.2, pág. 321",
    "apartado": "INUNCAEX"
  },
  {
    "id": "CPEI-T30-OF-18DC8597",
    "orden": 100,
    "concepto": "Según el INUNCAEX, ¿qué plan de AEMET alimenta los sistemas de previsión y alerta de inundaciones?",
    "respuesta": "Plan Nacional de Predicción y Vigilancia de Fenómenos Meteorológicos Adversos (Meteoalerta) de AEMET",
    "fuente": "INUNCAEX, cap. V, 2, pág. 332. Decreto 39/2025, de 13 de mayo, por el que se actualiza el INUNCAEX (DOE nº 94, de 19/05/2025); texto íntegro oficial (versión PDF de 09/05/2025): https://www.juntaex.es/documents/77055/406857/INUNCAEX_2024.pdf#page=332",
    "localizacion": "INUNCAEX, cap. V, 2, pág. 332",
    "apartado": "INUNCAEX"
  },
  {
    "id": "CPEI-T30-OF-4E31A236",
    "orden": 110,
    "concepto": "Según el INUNCAEX, ¿con qué adelanto informa Meteoalerta sobre fenómenos meteorológicos adversos?",
    "respuesta": "Con un adelanto de hasta 72 horas",
    "fuente": "INUNCAEX, cap. V, 2.1, pág. 333. Decreto 39/2025, de 13 de mayo, por el que se actualiza el INUNCAEX (DOE nº 94, de 19/05/2025); texto íntegro oficial (versión PDF de 09/05/2025): https://www.juntaex.es/documents/77055/406857/INUNCAEX_2024.pdf#page=333",
    "localizacion": "INUNCAEX, cap. V, 2.1, pág. 333",
    "apartado": "INUNCAEX"
  },
  {
    "id": "CPEI-T30-OF-C8433DD5",
    "orden": 120,
    "concepto": "Según el INUNCAEX, ¿qué recomendación corresponde al aviso amarillo de Meteoalerta?",
    "respuesta": "ESTÉ ATENTO",
    "fuente": "INUNCAEX, cap. V, 2.1, pág. 333. Decreto 39/2025, de 13 de mayo, por el que se actualiza el INUNCAEX (DOE nº 94, de 19/05/2025); texto íntegro oficial (versión PDF de 09/05/2025): https://www.juntaex.es/documents/77055/406857/INUNCAEX_2024.pdf#page=333",
    "localizacion": "INUNCAEX, cap. V, 2.1, pág. 333",
    "apartado": "INUNCAEX"
  },
  {
    "id": "CPEI-T30-OF-04A89885",
    "orden": 130,
    "concepto": "Según el INUNCAEX, ¿qué recomendación corresponde al aviso naranja de Meteoalerta?",
    "respuesta": "ESTÉ PREPARADO",
    "fuente": "INUNCAEX, cap. V, 2.1, pág. 333. Decreto 39/2025, de 13 de mayo, por el que se actualiza el INUNCAEX (DOE nº 94, de 19/05/2025); texto íntegro oficial (versión PDF de 09/05/2025): https://www.juntaex.es/documents/77055/406857/INUNCAEX_2024.pdf#page=333",
    "localizacion": "INUNCAEX, cap. V, 2.1, pág. 333",
    "apartado": "INUNCAEX"
  },
  {
    "id": "CPEI-T30-OF-83C40CFD",
    "orden": 140,
    "concepto": "Según el INUNCAEX, ¿qué umbral de lluvia acumulada en medio día corresponde al aviso amarillo de AEMET en Extremadura?",
    "respuesta": "40mm en 12 horas",
    "fuente": "INUNCAEX, cap. V, 2.1, pág. 334. Decreto 39/2025, de 13 de mayo, por el que se actualiza el INUNCAEX (DOE nº 94, de 19/05/2025); texto íntegro oficial (versión PDF de 09/05/2025): https://www.juntaex.es/documents/77055/406857/INUNCAEX_2024.pdf#page=334",
    "localizacion": "INUNCAEX, cap. V, 2.1, pág. 334",
    "apartado": "INUNCAEX"
  },
  {
    "id": "CPEI-T30-OF-8207493E",
    "orden": 150,
    "concepto": "Según el INUNCAEX, ¿qué umbral de lluvia horaria corresponde al aviso rojo de AEMET en Extremadura?",
    "respuesta": "60mm en 1 hora",
    "fuente": "INUNCAEX, cap. V, 2.1, pág. 334. Decreto 39/2025, de 13 de mayo, por el que se actualiza el INUNCAEX (DOE nº 94, de 19/05/2025); texto íntegro oficial (versión PDF de 09/05/2025): https://www.juntaex.es/documents/77055/406857/INUNCAEX_2024.pdf#page=334",
    "localizacion": "INUNCAEX, cap. V, 2.1, pág. 334",
    "apartado": "INUNCAEX"
  },
  {
    "id": "CPEI-T30-OF-FF1DA036",
    "orden": 160,
    "concepto": "Según el INUNCAEX, ¿cuántas situaciones o escenarios establecen los Planes de Emergencia de presas?",
    "respuesta": "4 situaciones definidas como escenarios de seguridad y de peligro de rotura de presas",
    "fuente": "INUNCAEX, cap. V, 2.4, pág. 343. Decreto 39/2025, de 13 de mayo, por el que se actualiza el INUNCAEX (DOE nº 94, de 19/05/2025); texto íntegro oficial (versión PDF de 09/05/2025): https://www.juntaex.es/documents/77055/406857/INUNCAEX_2024.pdf#page=343",
    "localizacion": "INUNCAEX, cap. V, 2.4, pág. 343",
    "apartado": "INUNCAEX"
  },
  {
    "id": "CPEI-T30-OF-46C17A31",
    "orden": 170,
    "concepto": "Según el INUNCAEX, ante el escenario 1 de una presa, ¿qué fase del plan se declara?",
    "respuesta": "La Fase de Alerta y Seguimiento",
    "fuente": "INUNCAEX, cap. V, 2.4, pág. 343. Decreto 39/2025, de 13 de mayo, por el que se actualiza el INUNCAEX (DOE nº 94, de 19/05/2025); texto íntegro oficial (versión PDF de 09/05/2025): https://www.juntaex.es/documents/77055/406857/INUNCAEX_2024.pdf#page=343",
    "localizacion": "INUNCAEX, cap. V, 2.4, pág. 343",
    "apartado": "INUNCAEX"
  },
  {
    "id": "CPEI-T30-OF-CA0B3073",
    "orden": 180,
    "concepto": "Según el INUNCAEX, ¿cómo se denomina el escenario 3 de una presa?",
    "respuesta": "Escenario 3 «límite»",
    "fuente": "INUNCAEX, cap. V, 2.4, pág. 344. Decreto 39/2025, de 13 de mayo, por el que se actualiza el INUNCAEX (DOE nº 94, de 19/05/2025); texto íntegro oficial (versión PDF de 09/05/2025): https://www.juntaex.es/documents/77055/406857/INUNCAEX_2024.pdf#page=344",
    "localizacion": "INUNCAEX, cap. V, 2.4, pág. 344",
    "apartado": "INUNCAEX"
  },
  {
    "id": "CPEI-T30-OF-E35221C8",
    "orden": 190,
    "concepto": "Según el INUNCAEX, ante el escenario 2 «excepcional» de una presa, ¿qué se declara?",
    "respuesta": "La Situación 1 de la Fase de Emergencia del presente Plan Especial",
    "fuente": "INUNCAEX, cap. V, 2.4, pág. 344. Decreto 39/2025, de 13 de mayo, por el que se actualiza el INUNCAEX (DOE nº 94, de 19/05/2025); texto íntegro oficial (versión PDF de 09/05/2025): https://www.juntaex.es/documents/77055/406857/INUNCAEX_2024.pdf#page=344",
    "localizacion": "INUNCAEX, cap. V, 2.4, pág. 344",
    "apartado": "INUNCAEX"
  },
  {
    "id": "CPEI-T30-OF-525475DA",
    "orden": 200,
    "concepto": "Según el INUNCAEX, ¿qué tres fases contempla el plan?",
    "respuesta": "Fase de alerta y seguimiento. Fase de emergencia. Fase de recuperación",
    "fuente": "INUNCAEX, cap. V, 4, pág. 346. Decreto 39/2025, de 13 de mayo, por el que se actualiza el INUNCAEX (DOE nº 94, de 19/05/2025); texto íntegro oficial (versión PDF de 09/05/2025): https://www.juntaex.es/documents/77055/406857/INUNCAEX_2024.pdf#page=346",
    "localizacion": "INUNCAEX, cap. V, 4, pág. 346",
    "apartado": "INUNCAEX"
  },
  {
    "id": "CPEI-T30-OF-589D196D",
    "orden": 210,
    "concepto": "Según el INUNCAEX, ¿se activa el plan en la fase de alerta y seguimiento?",
    "respuesta": "En esta situación no se activa el INUNCAEX",
    "fuente": "INUNCAEX, cap. V, 4.1, pág. 346. Decreto 39/2025, de 13 de mayo, por el que se actualiza el INUNCAEX (DOE nº 94, de 19/05/2025); texto íntegro oficial (versión PDF de 09/05/2025): https://www.juntaex.es/documents/77055/406857/INUNCAEX_2024.pdf#page=346",
    "localizacion": "INUNCAEX, cap. V, 4.1, pág. 346",
    "apartado": "INUNCAEX"
  },
  {
    "id": "CPEI-T30-OF-5A3342DB",
    "orden": 220,
    "concepto": "Según el INUNCAEX, ¿qué aviso meteorológico de AEMET activa la fase de alerta y seguimiento?",
    "respuesta": "Siempre que se produzca un aviso meteorológico naranja por precipitaciones por parte de AEMET",
    "fuente": "INUNCAEX, cap. V, 4.1, pág. 347. Decreto 39/2025, de 13 de mayo, por el que se actualiza el INUNCAEX (DOE nº 94, de 19/05/2025); texto íntegro oficial (versión PDF de 09/05/2025): https://www.juntaex.es/documents/77055/406857/INUNCAEX_2024.pdf#page=347",
    "localizacion": "INUNCAEX, cap. V, 4.1, pág. 347",
    "apartado": "INUNCAEX"
  },
  {
    "id": "CPEI-T30-OF-D67089C2",
    "orden": 230,
    "concepto": "Según el INUNCAEX, ¿quién declara la fase de alerta y seguimiento?",
    "respuesta": "El/la Director/a del Plan",
    "fuente": "INUNCAEX, cap. V, 4.1, pág. 347. Decreto 39/2025, de 13 de mayo, por el que se actualiza el INUNCAEX (DOE nº 94, de 19/05/2025); texto íntegro oficial (versión PDF de 09/05/2025): https://www.juntaex.es/documents/77055/406857/INUNCAEX_2024.pdf#page=347",
    "localizacion": "INUNCAEX, cap. V, 4.1, pág. 347",
    "apartado": "INUNCAEX"
  },
  {
    "id": "CPEI-T30-OF-24F2B663",
    "orden": 240,
    "concepto": "Según el INUNCAEX, ¿cuántas situaciones operativas se establecen en la fase de emergencia?",
    "respuesta": "Tres situaciones operativas",
    "fuente": "INUNCAEX, cap. V, 4.2, pág. 348. Decreto 39/2025, de 13 de mayo, por el que se actualiza el INUNCAEX (DOE nº 94, de 19/05/2025); texto íntegro oficial (versión PDF de 09/05/2025): https://www.juntaex.es/documents/77055/406857/INUNCAEX_2024.pdf#page=348",
    "localizacion": "INUNCAEX, cap. V, 4.2, pág. 348",
    "apartado": "INUNCAEX"
  },
  {
    "id": "CPEI-T30-OF-66F3542A",
    "orden": 250,
    "concepto": "Según el INUNCAEX, ¿qué aviso meteorológico de AEMET activa la situación 1?",
    "respuesta": "Siempre que se produzca un aviso meteorológico rojo por precipitaciones por parte de AEMET",
    "fuente": "INUNCAEX, cap. V, 4.2, pág. 348. Decreto 39/2025, de 13 de mayo, por el que se actualiza el INUNCAEX (DOE nº 94, de 19/05/2025); texto íntegro oficial (versión PDF de 09/05/2025): https://www.juntaex.es/documents/77055/406857/INUNCAEX_2024.pdf#page=348",
    "localizacion": "INUNCAEX, cap. V, 4.2, pág. 348",
    "apartado": "INUNCAEX"
  },
  {
    "id": "CPEI-T30-OF-D5FD7F05",
    "orden": 260,
    "concepto": "Según el INUNCAEX, ¿qué probabilidad de desbordamiento notificada por el EFAS activa la situación 1?",
    "respuesta": "Probabilidad superior al 66% de desbordamiento de cauces sobre periodo de retorno de 20 años",
    "fuente": "INUNCAEX, cap. V, 4.2, pág. 348. Decreto 39/2025, de 13 de mayo, por el que se actualiza el INUNCAEX (DOE nº 94, de 19/05/2025); texto íntegro oficial (versión PDF de 09/05/2025): https://www.juntaex.es/documents/77055/406857/INUNCAEX_2024.pdf#page=348",
    "localizacion": "INUNCAEX, cap. V, 4.2, pág. 348",
    "apartado": "INUNCAEX"
  },
  {
    "id": "CPEI-T30-OF-6EE17EF8",
    "orden": 270,
    "concepto": "Según el INUNCAEX, ¿qué escenario de una presa activa en particular la situación 2?",
    "respuesta": "El escenario límite o «Escenario 3»",
    "fuente": "INUNCAEX, cap. V, 4.2, pág. 349. Decreto 39/2025, de 13 de mayo, por el que se actualiza el INUNCAEX (DOE nº 94, de 19/05/2025); texto íntegro oficial (versión PDF de 09/05/2025): https://www.juntaex.es/documents/77055/406857/INUNCAEX_2024.pdf#page=349",
    "localizacion": "INUNCAEX, cap. V, 4.2, pág. 349",
    "apartado": "INUNCAEX"
  },
  {
    "id": "CPEI-T30-OF-FBA5BFD5",
    "orden": 280,
    "concepto": "Según el INUNCAEX, ¿hasta cuándo se prolonga la fase de recuperación según su definición inicial?",
    "respuesta": "Hasta el restablecimiento de los servicios básicos en la zona afectada por la emergencia",
    "fuente": "INUNCAEX, cap. V, 4.3, pág. 350. Decreto 39/2025, de 13 de mayo, por el que se actualiza el INUNCAEX (DOE nº 94, de 19/05/2025); texto íntegro oficial (versión PDF de 09/05/2025): https://www.juntaex.es/documents/77055/406857/INUNCAEX_2024.pdf#page=350",
    "localizacion": "INUNCAEX, cap. V, 4.3, pág. 350",
    "apartado": "INUNCAEX"
  },
  {
    "id": "CPEI-T30-OF-4A0E15FD",
    "orden": 290,
    "concepto": "Según el INUNCAEX, en el nivel local, ¿a quién corresponde la activación y desactivación de la fase de respuesta municipal?",
    "respuesta": "Al Alcalde/sa (o Autoridad competente supramunicipal)",
    "fuente": "INUNCAEX, cap. V, 5, pág. 353. Decreto 39/2025, de 13 de mayo, por el que se actualiza el INUNCAEX (DOE nº 94, de 19/05/2025); texto íntegro oficial (versión PDF de 09/05/2025): https://www.juntaex.es/documents/77055/406857/INUNCAEX_2024.pdf#page=353",
    "localizacion": "INUNCAEX, cap. V, 5, pág. 353",
    "apartado": "INUNCAEX"
  },
  {
    "id": "CPEI-T30-OF-660668FE",
    "orden": 300,
    "concepto": "Según el INUNCAEX, ¿cuándo asume funciones la Comunidad Autónoma aunque no lo pida el municipio?",
    "respuesta": "Cuando no exista ningún plan de nivel inferior",
    "fuente": "INUNCAEX, cap. V, 5, pág. 353. Decreto 39/2025, de 13 de mayo, por el que se actualiza el INUNCAEX (DOE nº 94, de 19/05/2025); texto íntegro oficial (versión PDF de 09/05/2025): https://www.juntaex.es/documents/77055/406857/INUNCAEX_2024.pdf#page=353",
    "localizacion": "INUNCAEX, cap. V, 5, pág. 353",
    "apartado": "INUNCAEX"
  },
  {
    "id": "CPEI-T30-OF-C39EE8AD",
    "orden": 310,
    "concepto": "Según el INUNCAEX, ¿cuál es el único canal obligatorio de aviso inmediato ante una emergencia?",
    "respuesta": "Al Centro de Atención de Urgencias y Emergencias 112 de Extremadura",
    "fuente": "INUNCAEX, cap. V, 6, pág. 354. Decreto 39/2025, de 13 de mayo, por el que se actualiza el INUNCAEX (DOE nº 94, de 19/05/2025); texto íntegro oficial (versión PDF de 09/05/2025): https://www.juntaex.es/documents/77055/406857/INUNCAEX_2024.pdf#page=354",
    "localizacion": "INUNCAEX, cap. V, 6, pág. 354",
    "apartado": "INUNCAEX"
  },
  {
    "id": "CPEI-T30-OF-299AC3B2",
    "orden": 320,
    "concepto": "Según el TRANSCAEX, ¿qué real decreto aprueba la Directriz Básica de transportes de mercancías peligrosas?",
    "respuesta": "Real Decreto 387/1996, de 1 de marzo",
    "fuente": "TRANSCAEX, 1.1, pág. 8. Decreto 189/2019, de 15 de octubre, por el que se actualiza el TRANSCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF publicada en juntaex.es (fichero de 25/03/2019)): https://www.juntaex.es/documents/77055/406857/TRANSCAEX.pdf#page=8",
    "localizacion": "TRANSCAEX, 1.1, pág. 8",
    "apartado": "TRANSCAEX"
  },
  {
    "id": "CPEI-T30-OF-4D2C6E4A",
    "orden": 330,
    "concepto": "Según el TRANSCAEX, ¿qué sustancias se consideran mercancías peligrosas?",
    "respuesta": "Todas aquellas sustancias que en caso de accidente durante su transporte, por carretera o ferrocarril, pueden suponer riesgos para la población, los bienes y el medio ambiente",
    "fuente": "TRANSCAEX, 1.1, pág. 8. Decreto 189/2019, de 15 de octubre, por el que se actualiza el TRANSCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF publicada en juntaex.es (fichero de 25/03/2019)): https://www.juntaex.es/documents/77055/406857/TRANSCAEX.pdf#page=8",
    "localizacion": "TRANSCAEX, 1.1, pág. 8",
    "apartado": "TRANSCAEX"
  },
  {
    "id": "CPEI-T30-OF-E2F7D681",
    "orden": 340,
    "concepto": "Según el TRANSCAEX, ¿a qué plan se subordina el TRANSCAEX en el transporte de mercancías de clase 7?",
    "respuesta": "Al Plan Especial de Emergencias por Riesgos Radiológicos",
    "fuente": "TRANSCAEX, 1.1, pág. 9. Decreto 189/2019, de 15 de octubre, por el que se actualiza el TRANSCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF publicada en juntaex.es (fichero de 25/03/2019)): https://www.juntaex.es/documents/77055/406857/TRANSCAEX.pdf#page=9",
    "localizacion": "TRANSCAEX, 1.1, pág. 9",
    "apartado": "TRANSCAEX"
  },
  {
    "id": "CPEI-T30-OF-C52A29BB",
    "orden": 350,
    "concepto": "Según el TRANSCAEX, ¿con cuánta antelación deben comunicar las empresas los transportes a la Dirección General?",
    "respuesta": "Con al menos 72 horas anteriores a su realización",
    "fuente": "TRANSCAEX, 1.1, pág. 9. Decreto 189/2019, de 15 de octubre, por el que se actualiza el TRANSCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF publicada en juntaex.es (fichero de 25/03/2019)): https://www.juntaex.es/documents/77055/406857/TRANSCAEX.pdf#page=9",
    "localizacion": "TRANSCAEX, 1.1, pág. 9",
    "apartado": "TRANSCAEX"
  },
  {
    "id": "CPEI-T30-OF-D8F1C7EE",
    "orden": 360,
    "concepto": "Según el TRANSCAEX, ¿qué finalidad tiene el plan?",
    "respuesta": "Constituirse en un instrumento eficaz para hacer frente a los accidentes que puedan producirse como consecuencia del Transporte de Mercancías Peligrosas en el ámbito de la Comunidad Autónoma de Extremadura",
    "fuente": "TRANSCAEX, 1.2, pág. 9. Decreto 189/2019, de 15 de octubre, por el que se actualiza el TRANSCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF publicada en juntaex.es (fichero de 25/03/2019)): https://www.juntaex.es/documents/77055/406857/TRANSCAEX.pdf#page=9",
    "localizacion": "TRANSCAEX, 1.2, pág. 9",
    "apartado": "TRANSCAEX"
  },
  {
    "id": "CPEI-T30-OF-E91CF465",
    "orden": 370,
    "concepto": "Según el TRANSCAEX, ¿en quién recae la Dirección del Plan?",
    "respuesta": "En el/la Titular de la Consejería con competencias en materia de Protección Civil y Emergencias en Extremadura",
    "fuente": "TRANSCAEX, 4.3.1, pág. 129. Decreto 189/2019, de 15 de octubre, por el que se actualiza el TRANSCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF publicada en juntaex.es (fichero de 25/03/2019)): https://www.juntaex.es/documents/77055/406857/TRANSCAEX.pdf#page=129",
    "localizacion": "TRANSCAEX, 4.3.1, pág. 129",
    "apartado": "TRANSCAEX"
  },
  {
    "id": "CPEI-T30-OF-007F4BF8",
    "orden": 380,
    "concepto": "Según el TRANSCAEX, en caso de accidente de un vehículo con mercancías peligrosas, ¿a qué centro debe informar en un principio el conductor?",
    "respuesta": "Al Centro de Atención de Urgencias y Emergencias 112 de Extremadura",
    "fuente": "TRANSCAEX, 5.3.1, pág. 152. Decreto 189/2019, de 15 de octubre, por el que se actualiza el TRANSCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF publicada en juntaex.es (fichero de 25/03/2019)): https://www.juntaex.es/documents/77055/406857/TRANSCAEX.pdf#page=152",
    "localizacion": "TRANSCAEX, 5.3.1, pág. 152",
    "apartado": "TRANSCAEX"
  },
  {
    "id": "CPEI-T30-OF-9D2C983C",
    "orden": 390,
    "concepto": "Según el TRANSCAEX, ¿qué datos básicos se notifican de forma inmediata sobre un siniestro?",
    "respuesta": "Localización del suceso. Estado del vehículo o convoy ferroviario implicado y características del suceso. Datos sobre las mercancías peligrosas transportadas. Existencia de víctimas. Condiciones meteorológicas",
    "fuente": "TRANSCAEX, 5.3.2, pág. 152. Decreto 189/2019, de 15 de octubre, por el que se actualiza el TRANSCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF publicada en juntaex.es (fichero de 25/03/2019)): https://www.juntaex.es/documents/77055/406857/TRANSCAEX.pdf#page=152",
    "localizacion": "TRANSCAEX, 5.3.2, pág. 152",
    "apartado": "TRANSCAEX"
  },
  {
    "id": "CPEI-T30-OF-4B96FED4",
    "orden": 400,
    "concepto": "Según el TRANSCAEX, ¿en qué anexo se recoge el modelo de ficha de notificación de accidente?",
    "respuesta": "En el anexo nº 4 de este Plan Especial",
    "fuente": "TRANSCAEX, 5.3.2, pág. 152. Decreto 189/2019, de 15 de octubre, por el que se actualiza el TRANSCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF publicada en juntaex.es (fichero de 25/03/2019)): https://www.juntaex.es/documents/77055/406857/TRANSCAEX.pdf#page=152",
    "localizacion": "TRANSCAEX, 5.3.2, pág. 152",
    "apartado": "TRANSCAEX"
  },
  {
    "id": "CPEI-T30-OF-FFD0EA34",
    "orden": 410,
    "concepto": "Según el TRANSCAEX, si alerta al 112 una persona no especializada, ¿qué información se le solicita?",
    "respuesta": "Los números del panel naranja, los símbolos de la cisterna o contenedor y las etiquetas de peligrosidad",
    "fuente": "TRANSCAEX, 5.3.2, pág. 153. Decreto 189/2019, de 15 de octubre, por el que se actualiza el TRANSCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF publicada en juntaex.es (fichero de 25/03/2019)): https://www.juntaex.es/documents/77055/406857/TRANSCAEX.pdf#page=153",
    "localizacion": "TRANSCAEX, 5.3.2, pág. 153",
    "apartado": "TRANSCAEX"
  },
  {
    "id": "CPEI-T30-OF-F42902F9",
    "orden": 420,
    "concepto": "Según el TRANSCAEX, ¿en qué fases de activación se concreta la operatividad del plan?",
    "respuesta": "Alerta (en Situación 0) y Emergencia, en las Situaciones 1, 2 o 3",
    "fuente": "TRANSCAEX, 5.4, pág. 153. Decreto 189/2019, de 15 de octubre, por el que se actualiza el TRANSCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF publicada en juntaex.es (fichero de 25/03/2019)): https://www.juntaex.es/documents/77055/406857/TRANSCAEX.pdf#page=153",
    "localizacion": "TRANSCAEX, 5.4, pág. 153",
    "apartado": "TRANSCAEX"
  },
  {
    "id": "CPEI-T30-OF-D13554B3",
    "orden": 430,
    "concepto": "Según el TRANSCAEX, ¿a través de qué centro activa y desactiva el plan su Dirección?",
    "respuesta": "A través del CECOP",
    "fuente": "TRANSCAEX, 5.4, pág. 153. Decreto 189/2019, de 15 de octubre, por el que se actualiza el TRANSCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF publicada en juntaex.es (fichero de 25/03/2019)): https://www.juntaex.es/documents/77055/406857/TRANSCAEX.pdf#page=153",
    "localizacion": "TRANSCAEX, 5.4, pág. 153",
    "apartado": "TRANSCAEX"
  },
  {
    "id": "CPEI-T30-OF-0F6AA9B3",
    "orden": 440,
    "concepto": "Según el TRANSCAEX, ¿qué accidente es de tipo 1?",
    "respuesta": "Avería o accidente en el que el vehículo o convoy de transporte no puede continuar la marcha, pero el continente de las materias peligrosas transportadas está en perfecto estado y no se ha producido vuelco o descarrilamiento",
    "fuente": "TRANSCAEX, 5.4.1, pág. 153. Decreto 189/2019, de 15 de octubre, por el que se actualiza el TRANSCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF publicada en juntaex.es (fichero de 25/03/2019)): https://www.juntaex.es/documents/77055/406857/TRANSCAEX.pdf#page=153",
    "localizacion": "TRANSCAEX, 5.4.1, pág. 153",
    "apartado": "TRANSCAEX"
  },
  {
    "id": "CPEI-T30-OF-C998C27C",
    "orden": 450,
    "concepto": "Según el TRANSCAEX, ¿qué accidente es de tipo 2?",
    "respuesta": "Como consecuencia de un accidente el continente ha sufrido desperfectos o se ha producido vuelco o descarrilamiento, pero no existe fuga o derrame del contenido",
    "fuente": "TRANSCAEX, 5.4.1, pág. 153. Decreto 189/2019, de 15 de octubre, por el que se actualiza el TRANSCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF publicada en juntaex.es (fichero de 25/03/2019)): https://www.juntaex.es/documents/77055/406857/TRANSCAEX.pdf#page=153",
    "localizacion": "TRANSCAEX, 5.4.1, pág. 153",
    "apartado": "TRANSCAEX"
  },
  {
    "id": "CPEI-T30-OF-0703DFDC",
    "orden": 460,
    "concepto": "Según el TRANSCAEX, ¿qué accidente es de tipo 3?",
    "respuesta": "El continente ha sufrido desperfectos y existe fuga o derrame del contenido",
    "fuente": "TRANSCAEX, 5.4.1, pág. 153. Decreto 189/2019, de 15 de octubre, por el que se actualiza el TRANSCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF publicada en juntaex.es (fichero de 25/03/2019)): https://www.juntaex.es/documents/77055/406857/TRANSCAEX.pdf#page=153",
    "localizacion": "TRANSCAEX, 5.4.1, pág. 153",
    "apartado": "TRANSCAEX"
  },
  {
    "id": "CPEI-T30-OF-7915BA78",
    "orden": 470,
    "concepto": "Según el TRANSCAEX, ¿qué accidente es de tipo 4?",
    "respuesta": "Existen daños o incendio en el continente y fugas con llamas del contenido",
    "fuente": "TRANSCAEX, 5.4.1, pág. 154. Decreto 189/2019, de 15 de octubre, por el que se actualiza el TRANSCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF publicada en juntaex.es (fichero de 25/03/2019)): https://www.juntaex.es/documents/77055/406857/TRANSCAEX.pdf#page=154",
    "localizacion": "TRANSCAEX, 5.4.1, pág. 154",
    "apartado": "TRANSCAEX"
  },
  {
    "id": "CPEI-T30-OF-A48BF673",
    "orden": 480,
    "concepto": "Según el TRANSCAEX, ¿qué accidente es de tipo 5?",
    "respuesta": "Explosión del contenido destruyendo el continente",
    "fuente": "TRANSCAEX, 5.4.1, pág. 154. Decreto 189/2019, de 15 de octubre, por el que se actualiza el TRANSCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF publicada en juntaex.es (fichero de 25/03/2019)): https://www.juntaex.es/documents/77055/406857/TRANSCAEX.pdf#page=154",
    "localizacion": "TRANSCAEX, 5.4.1, pág. 154",
    "apartado": "TRANSCAEX"
  },
  {
    "id": "CPEI-T30-OF-E5EB7808",
    "orden": 490,
    "concepto": "Según el TRANSCAEX, ¿a qué accidentes se refiere la situación 0?",
    "respuesta": "Aquellos accidentes que pueden ser controlados por los medios disponibles y que aún en su evolución más desfavorable no suponen peligro para personas no relacionadas con las labores de intervención",
    "fuente": "TRANSCAEX, 5.4.1, pág. 154. Decreto 189/2019, de 15 de octubre, por el que se actualiza el TRANSCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF publicada en juntaex.es (fichero de 25/03/2019)): https://www.juntaex.es/documents/77055/406857/TRANSCAEX.pdf#page=154",
    "localizacion": "TRANSCAEX, 5.4.1, pág. 154",
    "apartado": "TRANSCAEX"
  },
  {
    "id": "CPEI-T30-OF-438760CA",
    "orden": 500,
    "concepto": "Según el TRANSCAEX, ¿quién declara los accidentes de situación 3 por estar implicado el interés nacional?",
    "respuesta": "El Ministerio del Interior",
    "fuente": "TRANSCAEX, 5.4.1, pág. 154. Decreto 189/2019, de 15 de octubre, por el que se actualiza el TRANSCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF publicada en juntaex.es (fichero de 25/03/2019)): https://www.juntaex.es/documents/77055/406857/TRANSCAEX.pdf#page=154",
    "localizacion": "TRANSCAEX, 5.4.1, pág. 154",
    "apartado": "TRANSCAEX"
  },
  {
    "id": "CPEI-T30-OF-77843681",
    "orden": 510,
    "concepto": "Según el TRANSCAEX, si el término municipal no dispone de plan de emergencia, ¿cómo se activa el plan?",
    "respuesta": "Se activará el TRANSCAEX en emergencia",
    "fuente": "TRANSCAEX, 5.4.2, pág. 155. Decreto 189/2019, de 15 de octubre, por el que se actualiza el TRANSCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF publicada en juntaex.es (fichero de 25/03/2019)): https://www.juntaex.es/documents/77055/406857/TRANSCAEX.pdf#page=155",
    "localizacion": "TRANSCAEX, 5.4.2, pág. 155",
    "apartado": "TRANSCAEX"
  },
  {
    "id": "CPEI-T30-OF-D71FE9F9",
    "orden": 520,
    "concepto": "Según el TRANSCAEX, ¿en qué consiste la activación en emergencia?",
    "respuesta": "En la activación de todo el organigrama del TRANSCAEX",
    "fuente": "TRANSCAEX, 5.4.3, pág. 155. Decreto 189/2019, de 15 de octubre, por el que se actualiza el TRANSCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF publicada en juntaex.es (fichero de 25/03/2019)): https://www.juntaex.es/documents/77055/406857/TRANSCAEX.pdf#page=155",
    "localizacion": "TRANSCAEX, 5.4.3, pág. 155",
    "apartado": "TRANSCAEX"
  },
  {
    "id": "CPEI-T30-OF-1DE582C2",
    "orden": 530,
    "concepto": "Según el TRANSCAEX, en situación 2, ¿en qué pasa a convertirse el CECOP?",
    "respuesta": "El CECOP pasará a ser CECOPI",
    "fuente": "TRANSCAEX, 5.4.3.2, pág. 156. Decreto 189/2019, de 15 de octubre, por el que se actualiza el TRANSCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF publicada en juntaex.es (fichero de 25/03/2019)): https://www.juntaex.es/documents/77055/406857/TRANSCAEX.pdf#page=156",
    "localizacion": "TRANSCAEX, 5.4.3.2, pág. 156",
    "apartado": "TRANSCAEX"
  },
  {
    "id": "CPEI-T30-OF-759F100B",
    "orden": 540,
    "concepto": "Según el TRANSCAEX, ¿a petición de quién declara el Ministro del Interior la situación 3?",
    "respuesta": "A petición del Director/a del TRANSCAEX o del Delegado/a del Gobierno en Extremadura",
    "fuente": "TRANSCAEX, 5.4.3.3, pág. 157. Decreto 189/2019, de 15 de octubre, por el que se actualiza el TRANSCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF publicada en juntaex.es (fichero de 25/03/2019)): https://www.juntaex.es/documents/77055/406857/TRANSCAEX.pdf#page=157",
    "localizacion": "TRANSCAEX, 5.4.3.3, pág. 157",
    "apartado": "TRANSCAEX"
  },
  {
    "id": "CPEI-T30-OF-7CA9A82D",
    "orden": 550,
    "concepto": "Según el RADIOCAEX, ¿de dónde deriva el riesgo de las emergencias a las que se aplica el plan?",
    "respuesta": "De la presencia de material radiactivo",
    "fuente": "RADIOCAEX, 1.3, pág. 14. Decreto 200/2019, de 22 de octubre, por el que se aprueba el RADIOCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF de 19/12/2019): https://www.juntaex.es/documents/77055/406857/RADIOCAEX-+%281%29.pdf#page=14",
    "localizacion": "RADIOCAEX, 1.3, pág. 14",
    "apartado": "RADIOCAEX"
  },
  {
    "id": "CPEI-T30-OF-C5EFD9F8",
    "orden": 560,
    "concepto": "Según el RADIOCAEX, ¿cuál es el objeto del plan?",
    "respuesta": "Proporcionar medidas, criterios y recomendaciones de carácter radiológico, aplicables a las actuaciones ante emergencias por riesgo radiológico",
    "fuente": "RADIOCAEX, 1.3, pág. 14. Decreto 200/2019, de 22 de octubre, por el que se aprueba el RADIOCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF de 19/12/2019): https://www.juntaex.es/documents/77055/406857/RADIOCAEX-+%281%29.pdf#page=14",
    "localizacion": "RADIOCAEX, 1.3, pág. 14",
    "apartado": "RADIOCAEX"
  },
  {
    "id": "CPEI-T30-OF-AAE6206A",
    "orden": 570,
    "concepto": "Según el RADIOCAEX, ¿qué planes de ámbito inferior permite integrar el plan?",
    "respuesta": "Planes de emergencia interior, así como Planes de autoprotección y los planes a elaborar por los municipios de la Comunidad Autónoma",
    "fuente": "RADIOCAEX, 1.3, pág. 14. Decreto 200/2019, de 22 de octubre, por el que se aprueba el RADIOCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF de 19/12/2019): https://www.juntaex.es/documents/77055/406857/RADIOCAEX-+%281%29.pdf#page=14",
    "localizacion": "RADIOCAEX, 1.3, pág. 14",
    "apartado": "RADIOCAEX"
  },
  {
    "id": "CPEI-T30-OF-8F3C8FBA",
    "orden": 580,
    "concepto": "Según el RADIOCAEX, ¿con qué plan especial sobre transporte prevé coordinación el plan radiológico?",
    "respuesta": "TRANSCAEX",
    "fuente": "RADIOCAEX, 1.3, pág. 15. Decreto 200/2019, de 22 de octubre, por el que se aprueba el RADIOCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF de 19/12/2019): https://www.juntaex.es/documents/77055/406857/RADIOCAEX-+%281%29.pdf#page=15",
    "localizacion": "RADIOCAEX, 1.3, pág. 15",
    "apartado": "RADIOCAEX"
  },
  {
    "id": "CPEI-T30-OF-B3137474",
    "orden": 590,
    "concepto": "Según el RADIOCAEX, ¿qué centro de alerta figura en su organigrama?",
    "respuesta": "Centro Hispano-Luso (ALERTA2)",
    "fuente": "RADIOCAEX, 3.1, pág. 61. Decreto 200/2019, de 22 de octubre, por el que se aprueba el RADIOCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF de 19/12/2019): https://www.juntaex.es/documents/77055/406857/RADIOCAEX-+%281%29.pdf#page=61",
    "localizacion": "RADIOCAEX, 3.1, pág. 61",
    "apartado": "RADIOCAEX"
  },
  {
    "id": "CPEI-T30-OF-B473278A",
    "orden": 600,
    "concepto": "Según el RADIOCAEX, ¿en quién puede delegar la Dirección del Plan sus funciones?",
    "respuesta": "En la persona titular de la Dirección General correspondiente, con funciones en Emergencias y Protección Civil",
    "fuente": "RADIOCAEX, 3.2.1, pág. 62. Decreto 200/2019, de 22 de octubre, por el que se aprueba el RADIOCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF de 19/12/2019): https://www.juntaex.es/documents/77055/406857/RADIOCAEX-+%281%29.pdf#page=62",
    "localizacion": "RADIOCAEX, 3.2.1, pág. 62",
    "apartado": "RADIOCAEX"
  },
  {
    "id": "CPEI-T30-OF-0A1FA1BA",
    "orden": 610,
    "concepto": "Según el RADIOCAEX, ¿cuántos grupos de acción ejecutan las actuaciones del plan?",
    "respuesta": "Seis grupos de acción",
    "fuente": "RADIOCAEX, 3.3, pág. 71. Decreto 200/2019, de 22 de octubre, por el que se aprueba el RADIOCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF de 19/12/2019): https://www.juntaex.es/documents/77055/406857/RADIOCAEX-+%281%29.pdf#page=71",
    "localizacion": "RADIOCAEX, 3.3, pág. 71",
    "apartado": "RADIOCAEX"
  },
  {
    "id": "CPEI-T30-OF-F4CE4D95",
    "orden": 620,
    "concepto": "Según el RADIOCAEX, ¿qué instrucción del CSN regula la notificación de sucesos en instalaciones radiactivas?",
    "respuesta": "La instrucción IS-18 del CSN",
    "fuente": "RADIOCAEX, 4.1.1, pág. 82. Decreto 200/2019, de 22 de octubre, por el que se aprueba el RADIOCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF de 19/12/2019): https://www.juntaex.es/documents/77055/406857/RADIOCAEX-+%281%29.pdf#page=82",
    "localizacion": "RADIOCAEX, 4.1.1, pág. 82",
    "apartado": "RADIOCAEX"
  },
  {
    "id": "CPEI-T30-OF-1F602A29",
    "orden": 630,
    "concepto": "Según el RADIOCAEX, ¿cuál es el número de fax del Centro 112 como canal alternativo de notificación?",
    "respuesta": "924311487",
    "fuente": "RADIOCAEX, 4.1, pág. 82. Decreto 200/2019, de 22 de octubre, por el que se aprueba el RADIOCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF de 19/12/2019): https://www.juntaex.es/documents/77055/406857/RADIOCAEX-+%281%29.pdf#page=82",
    "localizacion": "RADIOCAEX, 4.1, pág. 82",
    "apartado": "RADIOCAEX"
  },
  {
    "id": "CPEI-T30-OF-F32DC70A",
    "orden": 640,
    "concepto": "Según el RADIOCAEX, ¿quién opera la Red Automática de Alerta Radiológica de Extremadura?",
    "respuesta": "El Centro Hispano-Luso de Redes de Alerta Temprana",
    "fuente": "RADIOCAEX, 4.1.1, pág. 83. Decreto 200/2019, de 22 de octubre, por el que se aprueba el RADIOCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF de 19/12/2019): https://www.juntaex.es/documents/77055/406857/RADIOCAEX-+%281%29.pdf#page=83",
    "localizacion": "RADIOCAEX, 4.1.1, pág. 83",
    "apartado": "RADIOCAEX"
  },
  {
    "id": "CPEI-T30-OF-3B31D3C3",
    "orden": 650,
    "concepto": "Según el RADIOCAEX, ¿qué se inicia en el incidente de prealerta?",
    "respuesta": "La movilización de recursos necesarios para una eficaz verificación de la ocurrencia o no del suceso",
    "fuente": "RADIOCAEX, 4.3.1, pág. 88. Decreto 200/2019, de 22 de octubre, por el que se aprueba el RADIOCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF de 19/12/2019): https://www.juntaex.es/documents/77055/406857/RADIOCAEX-+%281%29.pdf#page=88",
    "localizacion": "RADIOCAEX, 4.3.1, pág. 88",
    "apartado": "RADIOCAEX"
  },
  {
    "id": "CPEI-T30-OF-18589D60",
    "orden": 660,
    "concepto": "Según el RADIOCAEX, ¿qué nombre recibe la situación en la que los riesgos se limitan a la propia instalación?",
    "respuesta": "SITUACIÓN 0: ALERTA",
    "fuente": "RADIOCAEX, 4.3.2, pág. 88. Decreto 200/2019, de 22 de octubre, por el que se aprueba el RADIOCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF de 19/12/2019): https://www.juntaex.es/documents/77055/406857/RADIOCAEX-+%281%29.pdf#page=88",
    "localizacion": "RADIOCAEX, 4.3.2, pág. 88",
    "apartado": "RADIOCAEX"
  },
  {
    "id": "CPEI-T30-OF-7F2121A7",
    "orden": 670,
    "concepto": "Según el RADIOCAEX, ¿dónde se limitan los riesgos en la situación 0?",
    "respuesta": "Los riesgos se limitan a la propia instalación",
    "fuente": "RADIOCAEX, 4.3.2, pág. 88. Decreto 200/2019, de 22 de octubre, por el que se aprueba el RADIOCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF de 19/12/2019): https://www.juntaex.es/documents/77055/406857/RADIOCAEX-+%281%29.pdf#page=88",
    "localizacion": "RADIOCAEX, 4.3.2, pág. 88",
    "apartado": "RADIOCAEX"
  },
  {
    "id": "CPEI-T30-OF-AF01247C",
    "orden": 680,
    "concepto": "Según el RADIOCAEX, ¿cuándo se establece por defecto la situación 0?",
    "respuesta": "Con la confirmación del aviso de suceso radiológico",
    "fuente": "RADIOCAEX, 4.3.2, pág. 88. Decreto 200/2019, de 22 de octubre, por el que se aprueba el RADIOCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF de 19/12/2019): https://www.juntaex.es/documents/77055/406857/RADIOCAEX-+%281%29.pdf#page=88",
    "localizacion": "RADIOCAEX, 4.3.2, pág. 88",
    "apartado": "RADIOCAEX"
  },
  {
    "id": "CPEI-T30-OF-4C5B24F0",
    "orden": 690,
    "concepto": "Según el RADIOCAEX, ¿quién declara la situación 1?",
    "respuesta": "Es declarada por la Dirección del RADIOCAEX",
    "fuente": "RADIOCAEX, 4.3.3, pág. 89. Decreto 200/2019, de 22 de octubre, por el que se aprueba el RADIOCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF de 19/12/2019): https://www.juntaex.es/documents/77055/406857/RADIOCAEX-+%281%29.pdf#page=89",
    "localizacion": "RADIOCAEX, 4.3.3, pág. 89",
    "apartado": "RADIOCAEX"
  },
  {
    "id": "CPEI-T30-OF-DAF141A5",
    "orden": 700,
    "concepto": "Según el RADIOCAEX, en situación 1, ¿a quién se informa de su establecimiento?",
    "respuesta": "A la Delegación del Gobierno en la CAEX",
    "fuente": "RADIOCAEX, 4.3.3, pág. 89. Decreto 200/2019, de 22 de octubre, por el que se aprueba el RADIOCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF de 19/12/2019): https://www.juntaex.es/documents/77055/406857/RADIOCAEX-+%281%29.pdf#page=89",
    "localizacion": "RADIOCAEX, 4.3.3, pág. 89",
    "apartado": "RADIOCAEX"
  },
  {
    "id": "CPEI-T30-OF-3C973FDE",
    "orden": 710,
    "concepto": "Según el RADIOCAEX, en la situación 2, ¿a quiénes pueden afectar los riesgos?",
    "respuesta": "A las personas tanto en el interior como en el exterior de la instalación",
    "fuente": "RADIOCAEX, 4.3.4, pág. 90. Decreto 200/2019, de 22 de octubre, por el que se aprueba el RADIOCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF de 19/12/2019): https://www.juntaex.es/documents/77055/406857/RADIOCAEX-+%281%29.pdf#page=90",
    "localizacion": "RADIOCAEX, 4.3.4, pág. 90",
    "apartado": "RADIOCAEX"
  },
  {
    "id": "CPEI-T30-OF-779E434B",
    "orden": 720,
    "concepto": "Según el RADIOCAEX, ¿quién declara la situación 3 por estar en juego el interés nacional?",
    "respuesta": "La persona titular del Ministerio del Interior",
    "fuente": "RADIOCAEX, 4.3.4, pág. 90. Decreto 200/2019, de 22 de octubre, por el que se aprueba el RADIOCAEX (DOE nº 247, de 26/12/2019); texto íntegro oficial (versión PDF de 19/12/2019): https://www.juntaex.es/documents/77055/406857/RADIOCAEX-+%281%29.pdf#page=90",
    "localizacion": "RADIOCAEX, 4.3.4, pág. 90",
    "apartado": "RADIOCAEX"
  },
  {
    "id": "CPEI-T30-OF-3FBAF2E0",
    "orden": 730,
    "concepto": "Según el PLASISMEX, ¿qué tipo de plan es el PLASISMEX?",
    "respuesta": "Un Plan Especial de Comunidad Autónoma",
    "fuente": "PLASISMEX, 1.2, pág. 14. Decreto 127/2009, de 5 de junio, por el que se aprueba el PLASISMEX (DOE nº 111, de 11/06/2009); texto íntegro oficial (versión PDF de 21/02/2013): https://www.juntaex.es/documents/77055/406857/01_PLASISMEX+%281%29.pdf#page=14",
    "localizacion": "PLASISMEX, 1.2, pág. 14",
    "apartado": "PLASISMEX"
  },
  {
    "id": "CPEI-T30-OF-99F7BD26",
    "orden": 740,
    "concepto": "Según el PLASISMEX, ¿cuál es el origen de la catástrofe a la que responde el marco orgánico-funcional del plan?",
    "respuesta": "De origen sísmico",
    "fuente": "PLASISMEX, 1.2, pág. 14. Decreto 127/2009, de 5 de junio, por el que se aprueba el PLASISMEX (DOE nº 111, de 11/06/2009); texto íntegro oficial (versión PDF de 21/02/2013): https://www.juntaex.es/documents/77055/406857/01_PLASISMEX+%281%29.pdf#page=14",
    "localizacion": "PLASISMEX, 1.2, pág. 14",
    "apartado": "PLASISMEX"
  },
  {
    "id": "CPEI-T30-OF-F34D3E4A",
    "orden": 750,
    "concepto": "Según el PLASISMEX, ¿cómo presta el plan su concurso ante terremotos en otras partes del territorio nacional?",
    "respuesta": "Formando parte de la organización del Plan Estatal",
    "fuente": "PLASISMEX, 1.2, pág. 14. Decreto 127/2009, de 5 de junio, por el que se aprueba el PLASISMEX (DOE nº 111, de 11/06/2009); texto íntegro oficial (versión PDF de 21/02/2013): https://www.juntaex.es/documents/77055/406857/01_PLASISMEX+%281%29.pdf#page=14",
    "localizacion": "PLASISMEX, 1.2, pág. 14",
    "apartado": "PLASISMEX"
  },
  {
    "id": "CPEI-T30-OF-877848F4",
    "orden": 760,
    "concepto": "Según el PLASISMEX, ¿con qué plan estatal prevé mecanismos de coordinación?",
    "respuesta": "Con el Plan Estatal de Protección Civil ante el Riesgo Sísmico",
    "fuente": "PLASISMEX, 1.2, pág. 15. Decreto 127/2009, de 5 de junio, por el que se aprueba el PLASISMEX (DOE nº 111, de 11/06/2009); texto íntegro oficial (versión PDF de 21/02/2013): https://www.juntaex.es/documents/77055/406857/01_PLASISMEX+%281%29.pdf#page=15",
    "localizacion": "PLASISMEX, 1.2, pág. 15",
    "apartado": "PLASISMEX"
  },
  {
    "id": "CPEI-T30-OF-170F9267",
    "orden": 770,
    "concepto": "Según el PLASISMEX, ¿cuál es su ámbito geográfico?",
    "respuesta": "La totalidad del territorio de la Comunidad Autónoma de Extremadura",
    "fuente": "PLASISMEX, 1.3, pág. 15. Decreto 127/2009, de 5 de junio, por el que se aprueba el PLASISMEX (DOE nº 111, de 11/06/2009); texto íntegro oficial (versión PDF de 21/02/2013): https://www.juntaex.es/documents/77055/406857/01_PLASISMEX+%281%29.pdf#page=15",
    "localizacion": "PLASISMEX, 1.3, pág. 15",
    "apartado": "PLASISMEX"
  },
  {
    "id": "CPEI-T30-OF-1B19F535",
    "orden": 780,
    "concepto": "Según el PLASISMEX, ¿cuál es el órgano gestor del plan?",
    "respuesta": "El Centro de Atención de Urgencias y Emergencias 1.1.2 Extremadura",
    "fuente": "PLASISMEX, 3.2.1, pág. 34. Decreto 127/2009, de 5 de junio, por el que se aprueba el PLASISMEX (DOE nº 111, de 11/06/2009); texto íntegro oficial (versión PDF de 21/02/2013): https://www.juntaex.es/documents/77055/406857/01_PLASISMEX+%281%29.pdf#page=34",
    "localizacion": "PLASISMEX, 3.2.1, pág. 34",
    "apartado": "PLASISMEX"
  },
  {
    "id": "CPEI-T30-OF-0DD6656A",
    "orden": 790,
    "concepto": "Según el PLASISMEX, ¿qué centro de coordinación activa el director del plan?",
    "respuesta": "Activar el CECOP de ámbito autonómico",
    "fuente": "PLASISMEX, 3.2.1, pág. 34. Decreto 127/2009, de 5 de junio, por el que se aprueba el PLASISMEX (DOE nº 111, de 11/06/2009); texto íntegro oficial (versión PDF de 21/02/2013): https://www.juntaex.es/documents/77055/406857/01_PLASISMEX+%281%29.pdf#page=34",
    "localizacion": "PLASISMEX, 3.2.1, pág. 34",
    "apartado": "PLASISMEX"
  },
  {
    "id": "CPEI-T30-OF-0540EF80",
    "orden": 800,
    "concepto": "Según el PLASISMEX, ¿qué fenómenos definen la situación 0?",
    "respuesta": "Ocurrencia de fenómenos sísmicos ampliamente sentidos por la población, sin ocasionar víctimas ni daños materiales relevantes",
    "fuente": "PLASISMEX, 4.1.1, pág. 45. Decreto 127/2009, de 5 de junio, por el que se aprueba el PLASISMEX (DOE nº 111, de 11/06/2009); texto íntegro oficial (versión PDF de 21/02/2013): https://www.juntaex.es/documents/77055/406857/01_PLASISMEX+%281%29.pdf#page=45",
    "localizacion": "PLASISMEX, 4.1.1, pág. 45",
    "apartado": "PLASISMEX"
  },
  {
    "id": "CPEI-T30-OF-4A5597C4",
    "orden": 810,
    "concepto": "Según el PLASISMEX, ¿qué fenómenos definen la situación 1?",
    "respuesta": "Ocurrencia de fenómenos sísmicos, cuya atención, en lo relativo a la protección de personas y bienes, puede quedar asegurada mediante el empleo de los medios y recursos disponibles en las zonas afectadas",
    "fuente": "PLASISMEX, 4.1.1, pág. 45. Decreto 127/2009, de 5 de junio, por el que se aprueba el PLASISMEX (DOE nº 111, de 11/06/2009); texto íntegro oficial (versión PDF de 21/02/2013): https://www.juntaex.es/documents/77055/406857/01_PLASISMEX+%281%29.pdf#page=45",
    "localizacion": "PLASISMEX, 4.1.1, pág. 45",
    "apartado": "PLASISMEX"
  },
  {
    "id": "CPEI-T30-OF-43BA958B",
    "orden": 820,
    "concepto": "Según el PLASISMEX, ¿quién declara las emergencias sísmicas de situación 3?",
    "respuesta": "El Ministro del Interior",
    "fuente": "PLASISMEX, 4.1.1, pág. 45. Decreto 127/2009, de 5 de junio, por el que se aprueba el PLASISMEX (DOE nº 111, de 11/06/2009); texto íntegro oficial (versión PDF de 21/02/2013): https://www.juntaex.es/documents/77055/406857/01_PLASISMEX+%281%29.pdf#page=45",
    "localizacion": "PLASISMEX, 4.1.1, pág. 45",
    "apartado": "PLASISMEX"
  },
  {
    "id": "CPEI-T30-OF-8F337DC6",
    "orden": 830,
    "concepto": "Según el PLASISMEX, ¿qué situación adicional contempla el plan una vez finalizada la fase de emergencia?",
    "respuesta": "La declaración de la situación 4",
    "fuente": "PLASISMEX, 4.1.1, pág. 45. Decreto 127/2009, de 5 de junio, por el que se aprueba el PLASISMEX (DOE nº 111, de 11/06/2009); texto íntegro oficial (versión PDF de 21/02/2013): https://www.juntaex.es/documents/77055/406857/01_PLASISMEX+%281%29.pdf#page=45",
    "localizacion": "PLASISMEX, 4.1.1, pág. 45",
    "apartado": "PLASISMEX"
  },
  {
    "id": "CPEI-T30-OF-9EEA11E1",
    "orden": 840,
    "concepto": "Según el PLASISMEX, ¿qué tareas se inician al declararse la situación 4?",
    "respuesta": "Las primeras tareas de rehabilitación en las zonas afectadas, así como el realojo provisional de las personas afectadas",
    "fuente": "PLASISMEX, 4.1.1, pág. 45. Decreto 127/2009, de 5 de junio, por el que se aprueba el PLASISMEX (DOE nº 111, de 11/06/2009); texto íntegro oficial (versión PDF de 21/02/2013): https://www.juntaex.es/documents/77055/406857/01_PLASISMEX+%281%29.pdf#page=45",
    "localizacion": "PLASISMEX, 4.1.1, pág. 45",
    "apartado": "PLASISMEX"
  },
  {
    "id": "CPEI-T30-OF-68FE2900",
    "orden": 850,
    "concepto": "Según el PLASISMEX, ¿con qué hecho se inicia la fase de emergencia?",
    "respuesta": "Con la ocurrencia de un terremoto que haya producido daños materiales o víctimas",
    "fuente": "PLASISMEX, 4.1.2, pág. 46. Decreto 127/2009, de 5 de junio, por el que se aprueba el PLASISMEX (DOE nº 111, de 11/06/2009); texto íntegro oficial (versión PDF de 21/02/2013): https://www.juntaex.es/documents/77055/406857/01_PLASISMEX+%281%29.pdf#page=46",
    "localizacion": "PLASISMEX, 4.1.2, pág. 46",
    "apartado": "PLASISMEX"
  },
  {
    "id": "CPEI-T30-OF-DE74FA03",
    "orden": 860,
    "concepto": "Según el PLASISMEX, ¿cómo se denomina la fase consecutiva a la de emergencia?",
    "respuesta": "Fase de normalización",
    "fuente": "PLASISMEX, 4.1.2, pág. 46. Decreto 127/2009, de 5 de junio, por el que se aprueba el PLASISMEX (DOE nº 111, de 11/06/2009); texto íntegro oficial (versión PDF de 21/02/2013): https://www.juntaex.es/documents/77055/406857/01_PLASISMEX+%281%29.pdf#page=46",
    "localizacion": "PLASISMEX, 4.1.2, pág. 46",
    "apartado": "PLASISMEX"
  },
  {
    "id": "CPEI-T30-OF-2F6CBA2C",
    "orden": 870,
    "concepto": "Según el PLASISMEX, ¿en qué consiste la activación en alerta?",
    "respuesta": "En el seguimiento específico de la situación y en la información a la población",
    "fuente": "PLASISMEX, 4.1.3.1, pág. 46. Decreto 127/2009, de 5 de junio, por el que se aprueba el PLASISMEX (DOE nº 111, de 11/06/2009); texto íntegro oficial (versión PDF de 21/02/2013): https://www.juntaex.es/documents/77055/406857/01_PLASISMEX+%281%29.pdf#page=46",
    "localizacion": "PLASISMEX, 4.1.3.1, pág. 46",
    "apartado": "PLASISMEX"
  }
];
