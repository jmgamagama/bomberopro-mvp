/** Tema 17 recall cards — fase 2: generadas SOLO desde el texto oficial consolidado (BOE-A-2009-5490). Calidad: data/tema17/tema17_calidad.md. */

export type Tema17RecallCard = {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
};

export const TEMA17_RECALL_META = {
  "tema": 17,
  "title": "Tema 17 · Socorrismo: desfibriladores fuera del ámbito sanitario (RD 365/2009)",
  "count": 14,
  "source": "Fase 3 · RD 365/2009 (BOE-A-2009-5490, texto original sin modificaciones)"
} as const;

export const TEMA17_RECALL_CARDS: Tema17RecallCard[] = [
  {
    "id": "CPEI-T17-OF-E6FC22E5",
    "orden": 10,
    "concepto": "Según el RD 365/2009, ¿qué regula este real decreto?",
    "respuesta": "Las condiciones y requisitos mínimos para la utilización y mantenimiento de los desfibriladores semiautomáticos externos fuera del ámbito sanitario",
    "fuente": "RD 365/2009, Este real decreto tiene por objeto regular las condiciones y requisitos mínimos para la utilización y mantenimiento de los desfibriladores semiautomáticos externos fuera del ámbito sanitario, art. 1. BOE-A-2009-5490, texto consolidado (últ. actualización texto original BOE nº 80 de 02/04/2009, sin modificaciones): https://www.boe.es/buscar/doc.php?id=BOE-A-2009-5490#a1",
    "localizacion": "RD 365/2009, Este real decreto tiene por objeto regular las condiciones y requisitos mínimos para la utilización y mantenimiento de los desfibriladores semiautomáticos externos fuera del ámbito sanitario, art. 1",
    "apartado": "DESA fuera del ámbito sanitario"
  },
  {
    "id": "CPEI-T17-OF-3A5C48A1",
    "orden": 20,
    "concepto": "Según el RD 365/2009, ¿a qué otros aparatos se aplica también la regulación prevista para los DESA?",
    "respuesta": "Los desfibriladores automáticos externos",
    "fuente": "RD 365/2009, Este real decreto tiene por objeto regular las condiciones y requisitos mínimos para la utilización y mantenimiento de los desfibriladores semiautomáticos externos fuera del ámbito sanitario, art. 1. BOE-A-2009-5490, texto consolidado (últ. actualización texto original BOE nº 80 de 02/04/2009, sin modificaciones): https://www.boe.es/buscar/doc.php?id=BOE-A-2009-5490#a1",
    "localizacion": "RD 365/2009, Este real decreto tiene por objeto regular las condiciones y requisitos mínimos para la utilización y mantenimiento de los desfibriladores semiautomáticos externos fuera del ámbito sanitario, art. 1",
    "apartado": "DESA fuera del ámbito sanitario"
  },
  {
    "id": "CPEI-T17-OF-9A139DA4",
    "orden": 30,
    "concepto": "Según el RD 365/2009, ¿qué es un DESA?",
    "respuesta": "El producto sanitario destinado a analizar el ritmo cardiaco, identificar las arritmias mortales tributarias de desfibrilación y administrar una descarga eléctrica con la finalidad de restablecer el ritmo cardiaco viable con altos niveles de seguridad",
    "fuente": "RD 365/2009, A los efectos de este real decreto se entiende por desfibrilador semiautomático externo (DESA) el producto sanitario destinado a analizar el ritmo cardiaco, identificar las arritmias mortales tributarias de desfibrilación y administrar una descarga eléctrica con la finalidad de restablecer el ritmo cardiaco viable con altos niveles de seguridad. Esta definición incluye también a los denominados desfibriladores externos automáticos, art. 2. BOE-A-2009-5490, texto consolidado (últ. actualización texto original BOE nº 80 de 02/04/2009, sin modificaciones): https://www.boe.es/buscar/doc.php?id=BOE-A-2009-5490#a2",
    "localizacion": "RD 365/2009, A los efectos de este real decreto se entiende por desfibrilador semiautomático externo (DESA) el producto sanitario destinado a analizar el ritmo cardiaco, identificar las arritmias mortales tributarias de desfibrilación y administrar una descarga eléctrica con la finalidad de restablecer el ritmo cardiaco viable con altos niveles de seguridad. Esta definición incluye también a los denominados desfibriladores externos automáticos, art. 2",
    "apartado": "DESA fuera del ámbito sanitario"
  },
  {
    "id": "CPEI-T17-OF-911B1EEE",
    "orden": 40,
    "concepto": "Según el RD 365/2009, ¿qué marcado deben ostentar los DESA instalados?",
    "respuesta": "El marcado CE",
    "fuente": "RD 365/2009, 1. Los DESA que sean instalados según lo dispuesto en los artículos siguientes, deberán cumplir con lo establecido en el Real Decreto 414/1996, de 1 de marzo, por el que se regulan los productos sanitarios, ostentando el marcado CE que garantiza su conformidad con los requisitos esenciales que les resultan de aplicación, art. 3.1. BOE-A-2009-5490, texto consolidado (últ. actualización texto original BOE nº 80 de 02/04/2009, sin modificaciones): https://www.boe.es/buscar/doc.php?id=BOE-A-2009-5490#a3",
    "localizacion": "RD 365/2009, 1. Los DESA que sean instalados según lo dispuesto en los artículos siguientes, deberán cumplir con lo establecido en el Real Decreto 414/1996, de 1 de marzo, por el que se regulan los productos sanitarios, ostentando el marcado CE que garantiza su conformidad con los requisitos esenciales que les resultan de aplicación, art. 3.1",
    "apartado": "DESA fuera del ámbito sanitario"
  },
  {
    "id": "CPEI-T17-OF-F901F06C",
    "orden": 50,
    "concepto": "Según el RD 365/2009, ¿qué norma sobre productos sanitarios deben cumplir los DESA?",
    "respuesta": "Real Decreto 414/1996, de 1 de marzo",
    "fuente": "RD 365/2009, 1. Los DESA que sean instalados según lo dispuesto en los artículos siguientes, deberán cumplir con lo establecido en el Real Decreto 414/1996, de 1 de marzo, por el que se regulan los productos sanitarios, ostentando el marcado CE que garantiza su conformidad con los requisitos esenciales que les resultan de aplicación, art. 3.1. BOE-A-2009-5490, texto consolidado (últ. actualización texto original BOE nº 80 de 02/04/2009, sin modificaciones): https://www.boe.es/buscar/doc.php?id=BOE-A-2009-5490#a3",
    "localizacion": "RD 365/2009, 1. Los DESA que sean instalados según lo dispuesto en los artículos siguientes, deberán cumplir con lo establecido en el Real Decreto 414/1996, de 1 de marzo, por el que se regulan los productos sanitarios, ostentando el marcado CE que garantiza su conformidad con los requisitos esenciales que les resultan de aplicación, art. 3.1",
    "apartado": "DESA fuera del ámbito sanitario"
  },
  {
    "id": "CPEI-T17-OF-2305714E",
    "orden": 60,
    "concepto": "Según el RD 365/2009, ¿en qué condiciones deben utilizarse los DESA?",
    "respuesta": "En las condiciones especificadas por su fabricante",
    "fuente": "RD 365/2009, 1. Los DESA que sean instalados según lo dispuesto en los artículos siguientes, deberán cumplir con lo establecido en el Real Decreto 414/1996, de 1 de marzo, por el que se regulan los productos sanitarios, ostentando el marcado CE que garantiza su conformidad con los requisitos esenciales que les resultan de aplicación, art. 3.2. BOE-A-2009-5490, texto consolidado (últ. actualización texto original BOE nº 80 de 02/04/2009, sin modificaciones): https://www.boe.es/buscar/doc.php?id=BOE-A-2009-5490#a3",
    "localizacion": "RD 365/2009, 1. Los DESA que sean instalados según lo dispuesto en los artículos siguientes, deberán cumplir con lo establecido en el Real Decreto 414/1996, de 1 de marzo, por el que se regulan los productos sanitarios, ostentando el marcado CE que garantiza su conformidad con los requisitos esenciales que les resultan de aplicación, art. 3.2",
    "apartado": "DESA fuera del ámbito sanitario"
  },
  {
    "id": "CPEI-T17-OF-7AF86C7C",
    "orden": 70,
    "concepto": "Según el RD 365/2009, ¿a quién debe notificarse la instalación de un DESA?",
    "respuesta": "A la autoridad sanitaria de la comunidad autónoma del lugar o del establecimiento en el que se vaya a disponer",
    "fuente": "RD 365/2009, 1. Para su instalación, las entidades públicas o privadas así como los particulares que pretendan instalar un DESA, deberán notificarlo a la autoridad sanitaria de la comunidad autónoma del lugar o del establecimiento en el que se vaya a disponer, realizando una declaración responsable de que cumplen los requisitos previstos en el apartado 2 de este artículo, art. 4.1. BOE-A-2009-5490, texto consolidado (últ. actualización texto original BOE nº 80 de 02/04/2009, sin modificaciones): https://www.boe.es/buscar/doc.php?id=BOE-A-2009-5490#a4",
    "localizacion": "RD 365/2009, 1. Para su instalación, las entidades públicas o privadas así como los particulares que pretendan instalar un DESA, deberán notificarlo a la autoridad sanitaria de la comunidad autónoma del lugar o del establecimiento en el que se vaya a disponer, realizando una declaración responsable de que cumplen los requisitos previstos en el apartado 2 de este artículo, art. 4.1",
    "apartado": "DESA fuera del ámbito sanitario"
  },
  {
    "id": "CPEI-T17-OF-13559035",
    "orden": 80,
    "concepto": "Según el RD 365/2009, ¿qué declaración se realiza al notificar la instalación de un DESA?",
    "respuesta": "Una declaración responsable",
    "fuente": "RD 365/2009, 1. Para su instalación, las entidades públicas o privadas así como los particulares que pretendan instalar un DESA, deberán notificarlo a la autoridad sanitaria de la comunidad autónoma del lugar o del establecimiento en el que se vaya a disponer, realizando una declaración responsable de que cumplen los requisitos previstos en el apartado 2 de este artículo, art. 4.1. BOE-A-2009-5490, texto consolidado (últ. actualización texto original BOE nº 80 de 02/04/2009, sin modificaciones): https://www.boe.es/buscar/doc.php?id=BOE-A-2009-5490#a4",
    "localizacion": "RD 365/2009, 1. Para su instalación, las entidades públicas o privadas así como los particulares que pretendan instalar un DESA, deberán notificarlo a la autoridad sanitaria de la comunidad autónoma del lugar o del establecimiento en el que se vaya a disponer, realizando una declaración responsable de que cumplen los requisitos previstos en el apartado 2 de este artículo, art. 4.1",
    "apartado": "DESA fuera del ámbito sanitario"
  },
  {
    "id": "CPEI-T17-OF-787E4D88",
    "orden": 90,
    "concepto": "Según el RD 365/2009, ¿qué debe señalizarse en lugar visible respecto del DESA?",
    "respuesta": "Su instalación y las normas de utilización",
    "fuente": "RD 365/2009, 1. Para su instalación, las entidades públicas o privadas así como los particulares que pretendan instalar un DESA, deberán notificarlo a la autoridad sanitaria de la comunidad autónoma del lugar o del establecimiento en el que se vaya a disponer, realizando una declaración responsable de que cumplen los requisitos previstos en el apartado 2 de este artículo, art. 4.2.b). BOE-A-2009-5490, texto consolidado (últ. actualización texto original BOE nº 80 de 02/04/2009, sin modificaciones): https://www.boe.es/buscar/doc.php?id=BOE-A-2009-5490#a4",
    "localizacion": "RD 365/2009, 1. Para su instalación, las entidades públicas o privadas así como los particulares que pretendan instalar un DESA, deberán notificarlo a la autoridad sanitaria de la comunidad autónoma del lugar o del establecimiento en el que se vaya a disponer, realizando una declaración responsable de que cumplen los requisitos previstos en el apartado 2 de este artículo, art. 4.2.b)",
    "apartado": "DESA fuera del ámbito sanitario"
  },
  {
    "id": "CPEI-T17-OF-80F0C9E2",
    "orden": 100,
    "concepto": "Según el RD 365/2009, ¿en qué lugares se promoverá la instalación de los DESA?",
    "respuesta": "En aquellos lugares en que se concentre o transite un gran número de personas",
    "fuente": "RD 365/2009, Las administraciones sanitarias de las comunidades autónomas promoverán y recomendarán la instalación de los DESA, de acuerdo con las indicaciones o recomendaciones de los organismos internacionales, en aquellos lugares en que se concentre o transite un gran número de personas, art. 5. BOE-A-2009-5490, texto consolidado (últ. actualización texto original BOE nº 80 de 02/04/2009, sin modificaciones): https://www.boe.es/buscar/doc.php?id=BOE-A-2009-5490#a5",
    "localizacion": "RD 365/2009, Las administraciones sanitarias de las comunidades autónomas promoverán y recomendarán la instalación de los DESA, de acuerdo con las indicaciones o recomendaciones de los organismos internacionales, en aquellos lugares en que se concentre o transite un gran número de personas, art. 5",
    "apartado": "DESA fuera del ámbito sanitario"
  },
  {
    "id": "CPEI-T17-OF-F8140F1A",
    "orden": 110,
    "concepto": "Según el RD 365/2009, ¿con qué dispositivos promoverán las CCAA mecanismos de coordinación para extender el uso de los DESA?",
    "respuesta": "Protección civil, bomberos, policía local y otros que fuesen necesarios",
    "fuente": "RD 365/2009, Las administraciones sanitarias de las comunidades autónomas promoverán y recomendarán la instalación de los DESA, de acuerdo con las indicaciones o recomendaciones de los organismos internacionales, en aquellos lugares en que se concentre o transite un gran número de personas, art. 5. BOE-A-2009-5490, texto consolidado (últ. actualización texto original BOE nº 80 de 02/04/2009, sin modificaciones): https://www.boe.es/buscar/doc.php?id=BOE-A-2009-5490#a5",
    "localizacion": "RD 365/2009, Las administraciones sanitarias de las comunidades autónomas promoverán y recomendarán la instalación de los DESA, de acuerdo con las indicaciones o recomendaciones de los organismos internacionales, en aquellos lugares en que se concentre o transite un gran número de personas, art. 5",
    "apartado": "DESA fuera del ámbito sanitario"
  },
  {
    "id": "CPEI-T17-OF-F03CB3C5",
    "orden": 120,
    "concepto": "Según el RD 365/2009, ¿a quién se autoriza el uso de los DESA?",
    "respuesta": "A todas aquellas personas que estén en posesión de los conocimientos mínimos y básicos necesarios para ello",
    "fuente": "RD 365/2009, 1. Las comunidades autónomas establecerán los mecanismos necesarios para autorizar el uso de los DESA a todas aquellas personas que estén en posesión de los conocimientos mínimos y básicos necesarios para ello, art. 6.1. BOE-A-2009-5490, texto consolidado (últ. actualización texto original BOE nº 80 de 02/04/2009, sin modificaciones): https://www.boe.es/buscar/doc.php?id=BOE-A-2009-5490#a6",
    "localizacion": "RD 365/2009, 1. Las comunidades autónomas establecerán los mecanismos necesarios para autorizar el uso de los DESA a todas aquellas personas que estén en posesión de los conocimientos mínimos y básicos necesarios para ello, art. 6.1",
    "apartado": "DESA fuera del ámbito sanitario"
  },
  {
    "id": "CPEI-T17-OF-A6E35181",
    "orden": 130,
    "concepto": "Según el RD 365/2009, ¿quién es responsable del mantenimiento y conservación de un DESA instalado?",
    "respuesta": "Los organismos, empresas e instituciones públicas y privadas que instalen un DESA",
    "fuente": "RD 365/2009, 1. Los organismos, empresas e instituciones públicas y privadas que instalen un DESA serán responsables de garantizar su mantenimiento y conservación, de acuerdo con las instrucciones del fabricante, art. 7.1. BOE-A-2009-5490, texto consolidado (últ. actualización texto original BOE nº 80 de 02/04/2009, sin modificaciones): https://www.boe.es/buscar/doc.php?id=BOE-A-2009-5490#a7",
    "localizacion": "RD 365/2009, 1. Los organismos, empresas e instituciones públicas y privadas que instalen un DESA serán responsables de garantizar su mantenimiento y conservación, de acuerdo con las instrucciones del fabricante, art. 7.1",
    "apartado": "DESA fuera del ámbito sanitario"
  },
  {
    "id": "CPEI-T17-OF-307181E1",
    "orden": 140,
    "concepto": "Según el RD 365/2009, ¿qué consideración tienen las infracciones contra este real decreto?",
    "respuesta": "Infracción en materia de sanidad",
    "fuente": "RD 365/2009, 1. Los organismos, empresas e instituciones públicas y privadas que instalen un DESA serán responsables de garantizar su mantenimiento y conservación, de acuerdo con las instrucciones del fabricante, art. 7.2. BOE-A-2009-5490, texto consolidado (últ. actualización texto original BOE nº 80 de 02/04/2009, sin modificaciones): https://www.boe.es/buscar/doc.php?id=BOE-A-2009-5490#a7",
    "localizacion": "RD 365/2009, 1. Los organismos, empresas e instituciones públicas y privadas que instalen un DESA serán responsables de garantizar su mantenimiento y conservación, de acuerdo con las instrucciones del fabricante, art. 7.2",
    "apartado": "DESA fuera del ámbito sanitario"
  }
];
