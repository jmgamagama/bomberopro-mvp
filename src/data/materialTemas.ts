/**
 * Registro de material de estudio por tema (esquema → desarrollo → texto oficial y fuentes).
 *
 * Es la ÚNICA lista de material: la pantalla `MaterialTema` lee de aquí. Cada capa es un fichero
 * markdown en public/material/<carpeta>/ que se descarga bajo demanda. Una capa que no exista se
 * deja sin poner: la pantalla dice que falta, nunca la rellena.
 *
 * Origen del material:
 *  - Tema 1 (piloto): scripts/generar_material.py (texto BOE) + esquema y desarrollo revisados a mano.
 *  - Temas 2, 3, 6, 7, 10, 12, 13, 22, 25, 28, 31, 32, 33 y 34: scripts/generar_material_boe.py scripts/material/temaNN.json (solo texto
 *    literal del BOE, limitado al epígrafe del anexo I). Sin desarrollo.
 *  - Temas 20, 29 y 30 (normas del DOE): el mismo generador sobre el texto que scripts/fuente_doe.py saca del PDF oficial
 *    (docs/MATERIAL_DOE.md). Cada fuente lleva `doe` con la fecha de la comprobación manual y lo que se buscó.
 * Para añadir un tema: genera sus ficheros y añade UNA entrada a MATERIAL_TEMAS. Los tests comprueban
 * que cada fichero citado existe.
 */
import { boeUrl } from './fuentesOficiales';

export type CapaId = 'esquema' | 'desarrollo' | 'completo';

export interface MaterialBloque {
  id: string;
  titulo: string;
  /** Ficheros por capa (relativos a la carpeta del tema). Ausente = esa capa no existe todavía. */
  capas: Partial<Record<CapaId, string>>;
  /** Norma del bloque si no es la principal del tema (varias normas por tema; ver materialPreceptos.ts). */
  boe?: string;
}

export interface FuenteTema {
  titulo: string;
  url: string;
  /** Identificador BOE si lo hay. */
  boe?: string;
  /** Fecha de la última actualización publicada en el BOE (dd/mm/aaaa). */
  version?: string;
  /**
   * Norma del DOE (sin API de vigencia): de dónde sale el texto y qué se comprobó a mano. Si está, `boe` es un
   * identificador genérico («DOE-2019040203», el de data/fuentes/) y `url` el PDF del que sale el texto.
   */
  doe?: { publicacion: string; pdfDoe: string; version: string; comprobado: string; busqueda: string };
  /** Nombre con el que empiezan las citas de las fichas («PLATERCAEX»): así se reconoce la norma de una cita. */
  claves?: readonly string[];
}

export interface MaterialTema {
  tema: number;
  nombre: string;
  carpeta: string;
  /** Extracto del texto oficial limitado al epígrafe del tema (fichero de la carpeta). */
  textoOficial?: { file: string; titulo: string };
  fuentes: readonly FuenteTema[];
  /** Alcance respecto al epígrafe del temario. */
  alcance?: string;
  bloques: readonly MaterialBloque[];
  /** Etiqueta del piloto (solo T1). */
  piloto?: boolean;
}

export const CAPAS: readonly { id: CapaId; label: string; nota: string }[] = [
  { id: 'esquema', label: 'Esquema', nota: 'Lo esencial de un vistazo.' },
  { id: 'desarrollo', label: 'Desarrollo', nota: 'Cada idea con sus matices y las trampas del examen.' },
  { id: 'completo', label: 'Texto oficial', nota: 'Extracto literal de la fuente oficial, limitado al epígrafe.' },
];

const ce = (id: string, titulo: string): MaterialBloque => ({
  id, titulo,
  capas: { esquema: `${id}-1-esquema.md`, desarrollo: `${id}-2-desarrollo.md`, completo: `${id}-3-completo.md` },
});

/** Bloque generado con scripts/generar_material_boe.py: esquema y texto oficial literal, sin desarrollo. */
const boe = (id: string, titulo: string): MaterialBloque => ({
  id, titulo, capas: { esquema: `${id}-1-esquema.md`, completo: `${id}-3-completo.md` },
});
const lprl = (n: number, titulo: string): MaterialBloque => boe(`lprl-0${n}`, titulo);

export const MATERIAL_TEMAS: readonly MaterialTema[] = [
  {
    tema: 1,
    nombre: 'Constitución Española',
    carpeta: 'constitucion',
    piloto: true,
    textoOficial: { file: 'constitucion-espanola-texto-oficial.md', titulo: 'Constitución Española · Texto oficial (BOE)' },
    fuentes: [{ titulo: 'Constitución Española', boe: 'BOE-A-1978-31229', url: boeUrl('BOE-A-1978-31229'), version: '20/05/2026' }],
    bloques: [
      ce('titulo-preliminar', 'Título Preliminar (arts. 1–9)'),
      ce('dignidad-espanoles-extranjeros', 'Dignidad, españoles y extranjeros (arts. 10–13)'),
      ce('derechos-fundamentales', 'Igualdad y derechos fundamentales (arts. 14–29)'),
      ce('deberes-ciudadanos', 'Derechos y deberes de los ciudadanos (arts. 30–38)'),
      ce('principios-rectores', 'Principios rectores de la política social y económica (arts. 39–52)'),
      ce('garantias-suspension', 'Garantías y suspensión de los derechos (arts. 53–55)'),
    ],
  },
  {
    tema: 6,
    nombre: 'Ley 31/1995 de Prevención de Riesgos Laborales',
    carpeta: 'tema06',
    textoOficial: { file: 'lprl-texto-oficial.md', titulo: 'Ley 31/1995 · Texto consolidado (BOE)' },
    fuentes: [{ titulo: 'Ley 31/1995, de 8 de noviembre, de Prevención de Riesgos Laborales', boe: 'BOE-A-1995-24292', url: boeUrl('BOE-A-1995-24292'), version: '09/04/2026' }],
    alcance: 'El temario (anexo I) pide los capítulos I a IV: objeto, ámbito y definiciones; política de prevención; derechos y obligaciones; servicios de prevención.',
    bloques: [
      lprl(1, 'Capítulo I · Objeto, ámbito de aplicación y definiciones (arts. 1–4)'),
      lprl(2, 'Capítulo II · Política en materia de prevención (arts. 5–13)'),
      lprl(3, 'Capítulo III · Derechos y obligaciones (arts. 14–29)'),
      lprl(4, 'Capítulo IV · Servicios de prevención (arts. 30–32 bis)'),
    ],
  },
  {
    tema: 2,
    nombre: 'Estatuto de Autonomía de Extremadura',
    carpeta: 'tema02',
    textoOficial: { file: 'eaex-texto-oficial.md', titulo: "Estatuto de Autonomía de Extremadura · Texto consolidado (BOE)" },
    fuentes: [{ titulo: "Ley Orgánica 1/2011, de 28 de enero, de reforma del Estatuto de Autonomía de la Comunidad Autónoma de Extremadura", boe: 'BOE-A-2011-1638', url: boeUrl('BOE-A-2011-1638'), version: '29/01/2011' }],
    alcance: 'El temario (anexo I) pide: disposiciones generales; derechos, deberes y principios rectores; competencias; instituciones (Título Preliminar, Títulos I y II).',
    bloques: [
      boe('eaex-01', "Título Preliminar · Capítulo I · Disposiciones generales (arts. 1–5)"),
      boe('eaex-02', "Título Preliminar · Capítulo II · Derechos, deberes y principios rectores (arts. 6–7)"),
      boe('eaex-03', "Título I · Competencias de la Comunidad Autónoma (arts. 8–14)"),
      boe('eaex-04', "Título II · Instituciones: Asamblea y Presidente (arts. 15–30)"),
      boe('eaex-05', "Título II · Instituciones: Junta y Administración (arts. 31–39)"),
      boe('eaex-06', "Título II · Instituciones: control de los poderes y otras instituciones (arts. 40–48)"),
    ],
  },
  {
    tema: 3,
    nombre: 'Ley 7/1985 Reguladora de las Bases del Régimen Local',
    carpeta: 'tema03',
    textoOficial: { file: 'lbrl-texto-oficial.md', titulo: "Ley 7/1985 Reguladora de las Bases del Régimen Local · Texto consolidado (BOE)" },
    fuentes: [{ titulo: "Ley 7/1985, de 2 de abril, Reguladora de las Bases del Régimen Local", boe: 'BOE-A-1985-5392', url: boeUrl('BOE-A-1985-5392'), version: '03/10/2026' }],
    alcance: 'El temario (anexo I) pide la Provincia: organización y competencias (Título III, arts. 31–38).',
    bloques: [
      boe('lbrl-01', "Título III · La Provincia: Organización (arts. 31–35)"),
      boe('lbrl-02', "Título III · La Provincia: Competencias (arts. 36–38)"),
    ],
  },
  {
    tema: 7,
    nombre: 'Ley 8/2011 de Igualdad entre Mujeres y Hombres y contra la Violencia de Género en Extremadura',
    carpeta: 'tema07',
    textoOficial: { file: 'ligualdad-texto-oficial.md', titulo: "Ley 8/2011 de Igualdad entre Mujeres y Hombres y contra la Violencia de Género en Extremadura · Texto consolidado (BOE)" },
    fuentes: [{ titulo: "Ley 8/2011, de 23 de marzo, de Igualdad entre mujeres y hombres y contra la violencia de género en Extremadura", boe: 'BOE-A-2011-6651', url: boeUrl('BOE-A-2011-6651'), version: '25/03/2011' }],
    alcance: 'El temario (anexo I) pide: disposiciones generales (Título Preliminar), integración de la perspectiva de género en las políticas públicas (Título II) y derechos de las mujeres en situaciones de violencia de género (Título IV, capítulo II).',
    bloques: [
      boe('ligualdad-01', "Título Preliminar · Disposiciones generales (arts. 1–4)"),
      boe('ligualdad-02', "Título II · Integración de la perspectiva de género en las políticas públicas"),
      boe('ligualdad-03', "Título IV · Capítulo II · Derechos de las mujeres en situaciones de violencia de género"),
    ],
  },
  {
    tema: 31,
    nombre: 'Real Decreto 1215/1997 · Equipos de trabajo',
    carpeta: 'tema31',
    textoOficial: { file: 'rd1215-texto-oficial.md', titulo: "Real Decreto 1215/1997 · Equipos de trabajo · Texto consolidado (BOE)" },
    fuentes: [{ titulo: "Real Decreto 1215/1997, de 18 de julio, por el que se establecen las disposiciones mínimas de seguridad y salud para la utilización por los trabajadores de los equipos de trabajo", boe: 'BOE-A-1997-17824', url: boeUrl('BOE-A-1997-17824'), version: '13/11/2004' }],
    alcance: 'El temario (anexo I) pide el Real Decreto completo, con sus dos anexos.',
    bloques: [
      boe('rd1215-01', "Real Decreto 1215/1997 · Articulado y disposiciones"),
      boe('rd1215-02', "Anexo I · Disposiciones mínimas aplicables a los equipos de trabajo"),
      boe('rd1215-03', "Anexo II · Utilización de los equipos de trabajo"),
    ],
  },
  {
    tema: 34,
    nombre: 'Real Decreto 164/2025 · Seguridad contra incendios en establecimientos industriales',
    carpeta: 'tema34',
    textoOficial: { file: 'rsciei-texto-oficial.md', titulo: "Real Decreto 164/2025 · Seguridad contra incendios en establecimientos industriales · Texto consolidado (BOE)" },
    fuentes: [{ titulo: "Real Decreto 164/2025, de 4 de marzo, por el que se aprueba el Reglamento de seguridad contra incendios en los establecimientos industriales", boe: 'BOE-A-2025-7190', url: boeUrl('BOE-A-2025-7190'), version: '10/04/2025' }],
    alcance: 'El temario (anexo I) pide el Real Decreto completo: articulado, Reglamento y anexos.',
    bloques: [
      boe('rsciei-01', "Real Decreto 164/2025 · Artículo único y disposiciones"),
      boe('rsciei-02', "Reglamento · Capítulos I y II · Disposiciones generales y requisitos"),
      boe('rsciei-03', "Reglamento · Capítulos III a VI · Puesta en servicio, inspecciones, actuación y sanciones"),
      boe('rsciei-04', "Anexo I · Caracterización de los establecimientos industriales"),
      boe('rsciei-05', "Anexo II · Requisitos constructivos"),
      boe('rsciei-06', "Anexo III · Requisitos dotacionales de instalaciones de protección contra incendios"),
      boe('rsciei-07', "Anexo IV · Zonas con condiciones particulares"),
      boe('rsciei-08', "Anexo V · Normas UNE y otras reconocidas"),
    ],
  },
  {
    tema: 33,
    nombre: 'Real Decreto 513/2017 · Reglamento de instalaciones de protección contra incendios (RIPCI)',
    carpeta: 'tema33',
    textoOficial: { file: 'ripci-texto-oficial.md', titulo: 'RIPCI (RD 513/2017) · Texto consolidado (BOE)' },
    fuentes: [{ titulo: 'Real Decreto 513/2017, de 22 de mayo, por el que se aprueba el Reglamento de instalaciones de protección contra incendios', boe: 'BOE-A-2017-6606', url: boeUrl('BOE-A-2017-6606'), version: '03/09/2025' }],
    alcance: 'El temario (anexo I) pide: objeto y ámbito de aplicación (arts. 1–2 del Reglamento) y, del anexo I, abastecimiento de agua, hidrantes, bocas de incendio equipadas y columna seca (sección 1.ª, apartados 2, 3, 5 y 6).',
    bloques: [
      boe('ripci-01', 'Reglamento · Objeto y ámbito de aplicación (arts. 1–2)'),
      boe('ripci-02', 'Anexo I, sección 1.ª · Abastecimiento de agua, hidrantes, BIE y columna seca (apdos. 2, 3, 5 y 6)'),
    ],
  },
  {
    tema: 10,
    nombre: "El agua · abastecimiento, hidrantes, columnas secas y BIE (RIPCI)",
    carpeta: 'tema10',
    textoOficial: { file: 'ripci10-texto-oficial.md', titulo: "Real Decreto 513/2017 · Texto consolidado (BOE)" },
    fuentes: [{ titulo: "Real Decreto 513/2017, de 22 de mayo, por el que se aprueba el Reglamento de instalaciones de protección contra incendios", boe: 'BOE-A-2017-6606', url: boeUrl('BOE-A-2017-6606'), version: '03/09/2025' }],
    alcance: "El epígrafe pide sistema de abastecimiento de agua, hidrantes, columnas secas y bocas de incendio equipadas: RIPCI, anexo I, sección 1.ª, apartados 2, 3, 5 y 6. El resto del tema (agua, lanzas, mangueras, monitor) no se apoya en una norma consolidada del BOE.",
    bloques: [
      boe('ripci10-01', "RIPCI, anexo I, sección 1.ª · Abastecimiento de agua, hidrantes, BIE y columna seca (apdos. 2, 3, 5 y 6)"),
    ],
  },
  {
    tema: 12,
    nombre: "Extintores (RIPCI, anexo I)",
    carpeta: 'tema12',
    textoOficial: { file: 'ripci12-texto-oficial.md', titulo: "Real Decreto 513/2017 · Texto consolidado (BOE)" },
    fuentes: [{ titulo: "Real Decreto 513/2017, de 22 de mayo, por el que se aprueba el Reglamento de instalaciones de protección contra incendios", boe: 'BOE-A-2017-6606', url: boeUrl('BOE-A-2017-6606'), version: '03/09/2025' }],
    alcance: "El epígrafe pide extintores: identificación, emplazamiento y distribución, que regula el RIPCI, anexo I, sección 1.ª, apartado 4. Las normas UNE-EN 3-7 y UNE-EN 1866-1 no se publican en el BOE.",
    bloques: [
      boe('ripci12-01', "RIPCI, anexo I, sección 1.ª · Extintores de incendio (apdo. 4)"),
    ],
  },
  {
    tema: 13,
    nombre: "Equipos de protección individual (RD 773/1997)",
    carpeta: 'tema13',
    textoOficial: { file: 'rd773-texto-oficial.md', titulo: "Real Decreto 773/1997 · Texto consolidado (BOE)" },
    fuentes: [{ titulo: "Real Decreto 773/1997, de 30 de mayo, sobre disposiciones mínimas de seguridad y salud relativas a la utilización por los trabajadores de equipos de protección individual", boe: 'BOE-A-1997-12735', url: boeUrl('BOE-A-1997-12735'), version: '08/12/2021' }],
    alcance: "El epígrafe pide la normativa, clasificación, uso y mantenimiento de los EPI: Real Decreto 773/1997, articulado y anexos. El Reglamento (UE) 2016/425 y las normas UNE de los EPI de bomberos no están en el BOE consolidado.",
    bloques: [
      boe('rd773-01', "Real Decreto 773/1997 · Articulado (arts. 1–10)"),
      boe('rd773-02', "Real Decreto 773/1997 · Anexos I a IV (riesgos, tipos de EPI y actividades)"),
    ],
  },
  {
    tema: 22,
    nombre: "Trabajos temporales en altura (RD 1215/1997, anexo II.4)",
    carpeta: 'tema22',
    textoOficial: { file: 'rd1215altura-texto-oficial.md', titulo: "Real Decreto 1215/1997 · Texto consolidado (BOE)" },
    fuentes: [{ titulo: "Real Decreto 1215/1997, de 18 de julio, por el que se establecen las disposiciones mínimas de seguridad y salud para la utilización por los trabajadores de los equipos de trabajo", boe: 'BOE-A-1997-17824', url: boeUrl('BOE-A-1997-17824'), version: '13/11/2004' }],
    alcance: "El epígrafe pide la normativa y el marco legal de los trabajos en altura: RD 1215/1997, anexo II, apartado 4 (añadido por el RD 2177/2004). El resto (material, nudos, poleas) es técnico, sin norma consolidada.",
    bloques: [
      boe('rd1215altura-01', "RD 1215/1997, anexo II · Trabajos temporales en altura (apdo. 4, añadido por el RD 2177/2004)"),
    ],
  },
  {
    tema: 25,
    nombre: "Transporte de mercancías peligrosas por carretera (RD 97/2014)",
    carpeta: 'tema25',
    textoOficial: { file: 'rd97-texto-oficial.md', titulo: "Real Decreto 97/2014 · Texto consolidado (BOE)" },
    fuentes: [{ titulo: "Real Decreto 97/2014, de 14 de febrero, por el que se regulan las operaciones de transporte de mercancías peligrosas por carretera en territorio español", boe: 'BOE-A-2014-2110', url: boeUrl('BOE-A-2014-2110'), version: '04/12/2024' }],
    alcance: "El epígrafe pide la normativa y las normas de actuación en caso de siniestro: RD 97/2014, capítulos I y IV. La clasificación, etiquetas y códigos del ADR están en el propio ADR, que el BOE publica como acuerdo internacional sin texto consolidado.",
    bloques: [
      boe('rd97-01', "Capítulo I · Disposiciones generales y definiciones (arts. 1–3)"),
      boe('rd97-02', "Capítulo IV · Normas de actuación en caso de avería o accidente (arts. 20–23)"),
    ],
  },
  {
    tema: 28,
    nombre: "Riesgo eléctrico (RD 614/2001 y REBT)",
    carpeta: 'tema28',
    textoOficial: { file: 'rd614-texto-oficial.md', titulo: "Real Decreto 614/2001 · Texto consolidado (BOE)" },
    fuentes: [{ titulo: "Real Decreto 614/2001, de 8 de junio, sobre disposiciones mínimas para la protección de la salud y seguridad de los trabajadores frente al riesgo eléctrico", boe: 'BOE-A-2001-11881', url: boeUrl('BOE-A-2001-11881'), version: '21/06/2001' },
      { titulo: "Real Decreto 842/2002, de 2 de agosto, por el que se aprueba el Reglamento electrotécnico para baja tensión", boe: 'BOE-A-2002-18099', url: boeUrl('BOE-A-2002-18099'), version: '03/09/2025' }],
    alcance: "El epígrafe pide equipos, distancias de seguridad en función de la tensión y procedimientos de actuación con riesgo eléctrico (RD 614/2001, articulado y anexos I a VI), y redes de distribución en baja tensión, acometidas e instalaciones de enlace (REBT: arts. 4, 8 y 15 e ITC-BT-06, 07, 08 y 11 a 17). La alta tensión (RD 337/2014, RD 223/2008) y la parte de física no se han generado.",
    bloques: [
      boe('rd614-01', "Real Decreto 614/2001 · Articulado (arts. 1–6)"),
      boe('rd614-02', "Anexo I · Definiciones (zonas de peligro y de proximidad, distancias según la tensión)"),
      boe('rd614-03', "Anexos II a VI · Trabajos sin tensión, en tensión, maniobras, proximidad y emplazamientos con riesgo de incendio o explosión"),
      { ...boe('rd614-04', "REBT (RD 842/2002) · Reglamento: clasificación de las tensiones, redes de distribución y acometidas e instalaciones de enlace (arts. 4, 8 y 15)"), boe: 'BOE-A-2002-18099' },
      { ...boe('rd614-05', "REBT · Redes de distribución en baja tensión y acometidas (ITC-BT-06, 07, 08 y 11)"), boe: 'BOE-A-2002-18099' },
      { ...boe('rd614-06', "REBT · Instalaciones de enlace (ITC-BT-12 a 17)"), boe: 'BOE-A-2002-18099' },
    ],
  },
  {
    tema: 20,
    nombre: "Incendios forestales · Plan INFOEX (Decreto 132/2022)",
    carpeta: 'tema20',
    textoOficial: { file: 'infoex-texto-oficial.md', titulo: "Plan INFOEX · Decreto 132/2022, texto consolidado (DOE, PDF)" },
    fuentes: [{ titulo: "Decreto 132/2022, de 26 de octubre, por el que se aprueba el Plan de Lucha contra Incendios Forestales de Extremadura (Plan INFOEX)", boe: 'DOE-2022040193', url: "https://doe.juntaex.es/pdfs/doe/2022/2100o/22040193C.pdf", claves: ["Plan INFOEX", "Decreto 132/2022"],
        doe: { publicacion: "DOE n.º 210, de 02/11/2022; modificado por el Decreto 136/2024, de 29 de octubre (DOE n.º 215, de 05/11/2024)", pdfDoe: "https://doe.juntaex.es/pdfs/doe/2022/2100o/22040193.pdf", version: "texto consolidado del DOE (última modificación publicada el 05/11/2024)", comprobado: "01/11/2026",
          busqueda: "Ficha ELI del decreto en doe.juntaex.es: la versión consolidada vigente es la de 05/11/2024 (Decreto 136/2024) y no hay otra posterior. Búsqueda de decretos posteriores que modifiquen el Plan INFOEX: ninguno localizado." } }],
    alcance: "El epígrafe no cita norma; las fichas del tema se apoyan en el Plan INFOEX, Decreto 132/2022 (texto consolidado del DOE con el Decreto 136/2024). Se ha generado la parte operativa que citan: caps. II a VII (arts. 4–20: zonificación, épocas de peligro, clasificación de los incendios, dirección, estructura y organización de la extinción). El comportamiento del fuego, las técnicas, los vehículos y las herramientas son contenido técnico sin norma.",
    bloques: [
      boe('infoex-01', "Plan INFOEX (Decreto 132/2022) · Zonificación y épocas de peligro (caps. II y III, arts. 4–6)"),
      boe('infoex-02', "Plan INFOEX · Clasificación de los incendios y dirección del Plan (caps. IV y V, arts. 7–10)"),
      boe('infoex-03', "Plan INFOEX · Estructura organizativa (cap. VI, arts. 11–15)"),
      boe('infoex-04', "Plan INFOEX · Organización de la extinción (cap. VII, arts. 16–20)"),
    ],
  },
  {
    tema: 29,
    nombre: "PLATERCAEX (Decreto 187/2019)",
    carpeta: 'tema29',
    textoOficial: { file: 'platercaex-texto-oficial.md', titulo: "PLATERCAEX · Texto del plan (PDF oficial de la Junta), apartados del epígrafe" },
    fuentes: [{ titulo: "Plan Territorial de Protección Civil de la Comunidad Autónoma de Extremadura (PLATERCAEX)", boe: 'DOE-2019040203', url: "https://www.juntaex.es/documents/77055/406857/PLATERCAEX_2019_%2B%283%29.pdf", claves: ["PLATERCAEX"],
        doe: { publicacion: "Decreto 187/2019, de 15 de octubre (DOE n.º 247, de 26/12/2019)", pdfDoe: "https://doe.juntaex.es/pdfs/doe/2019/2470o/19040203.pdf", version: "PDF del plan de 31/01/2020", comprobado: "04/11/2026",
          busqueda: "El Decreto 187/2019 (art. único.2) remite el texto íntegro del Plan a la web oficial de Protección Civil; este material usa el PDF oficial del PLATERCAEX fechado el 31/01/2020. La ficha ELI consultada el 04/11/2026 enlaza únicamente la publicación original. El Decreto 39/2025 sobre INUNCAEX indica que actualizó cargos y operatividad de ese plan de acuerdo con la revisión del PLATERCAEX, pero no publica una versión revisada del PLATERCAEX. No se localizó en el DOE un decreto posterior que modifique o sustituya el Decreto 187/2019. La Resolución DOE n.º 201/2024 modifica el Protocolo del Grupo de Logística, no el decreto del Plan. Se mantiene el PDF oficial disponible como base y queda pendiente confirmar si refleja toda la estructura institucional vigente. PDF descargado y huella SHA-256 cotejada con la copia usada para generar las fichas." } }],
    alcance: "El epígrafe pide objetivo, alcance, estructura, estructura operativa y operatividad: caps. I (I.1–I.2), IV (IV.1–IV.3.5) y V (V.1–V.5) del plan. El Decreto 187/2019 (DOE) remite el texto íntegro a la web de la Junta, de donde sale. El organigrama y las tablas se remiten al PDF.",
    bloques: [
      boe('platercaex-01', "PLATERCAEX · Objetivo y alcance del plan (cap. I, I.1–I.2)"),
      boe('platercaex-02', "PLATERCAEX · Estructura organizativa: organigrama y estructura de dirección y coordinación (cap. IV, IV.1–IV.2)"),
      boe('platercaex-03', "PLATERCAEX · Estructura operativa (cap. IV, IV.3)"),
      boe('platercaex-04', "PLATERCAEX · Operatividad (cap. V, V.1–V.5)"),
    ],
  },
  {
    tema: 30,
    nombre: "Planes especiales de la CAEX (INUNCAEX, TRANSCAEX, RADIOCAEX y PLASISMEX)",
    carpeta: 'tema30',
    textoOficial: { file: 'planes-texto-oficial.md', titulo: "INUNCAEX · Texto del plan (PDF oficial de la Junta), apartados del epígrafe" },
    fuentes: [{ titulo: "Plan Especial de Protección Civil de Riesgo de Inundaciones de la Comunidad Autónoma de Extremadura (INUNCAEX)", boe: 'DOE-2025040069', url: "https://www.juntaex.es/documents/77055/406857/INUNCAEX_2024.pdf", claves: ["INUNCAEX"],
        doe: { publicacion: "Decreto 39/2025, de 13 de mayo (DOE n.º 94, de 19/05/2025)", pdfDoe: "https://doe.juntaex.es/pdfs/doe/2025/940o/25040069.pdf", version: "PDF del plan de 09/05/2025", comprobado: "01/11/2026",
          busqueda: "El decreto (art. único.2) remite el texto íntegro del plan a la web oficial de la Dirección General de Protección Civil y Emergencias; el texto sale de ese PDF. Ficha ELI del decreto en doe.juntaex.es: solo la versión original publicada, sin versiones consolidadas ni modificaciones. El Decreto 39/2025 deroga el Decreto 188/2019; no se ha localizado ninguna norma posterior. El PDF de juntaex.es es el mismo fichero (sha256) con el que se hicieron las fichas." } },
      { titulo: "Plan Especial de Protección Civil de la Comunidad Autónoma de Extremadura sobre transportes de mercancías peligrosas por carretera y ferrocarril (TRANSCAEX)", boe: 'DOE-2019040205', url: "https://www.juntaex.es/documents/77055/406857/TRANSCAEX.pdf", claves: ["TRANSCAEX"],
        doe: { publicacion: "Decreto 189/2019, de 15 de octubre (DOE n.º 247, de 26/12/2019)", pdfDoe: "https://doe.juntaex.es/pdfs/doe/2019/2470o/19040205.pdf", version: "PDF del plan de 25/03/2019", comprobado: "01/11/2026",
          busqueda: "El decreto (art. único.2) remite el texto íntegro del plan a la web oficial de la Dirección General de Protección Civil y Emergencias; el texto sale de ese PDF. Ficha ELI del decreto en doe.juntaex.es: solo la versión original publicada, sin versiones consolidadas ni modificaciones. Búsqueda de un decreto posterior que actualice o derogue el TRANSCAEX: ninguno localizado. El PDF de juntaex.es es el mismo fichero (sha256) con el que se hicieron las fichas." } },
      { titulo: "Plan Especial de Protección Civil de la Comunidad Autónoma de Extremadura sobre Riesgo Radiológico (RADIOCAEX)", boe: 'DOE-2019040206', url: "https://www.juntaex.es/documents/77055/406857/RADIOCAEX-+%281%29.pdf", claves: ["RADIOCAEX"],
        doe: { publicacion: "Decreto 200/2019, de 22 de octubre (DOE n.º 247, de 26/12/2019)", pdfDoe: "https://doe.juntaex.es/pdfs/doe/2019/2470o/19040206.pdf", version: "PDF del plan de 19/12/2019", comprobado: "01/11/2026",
          busqueda: "El decreto (art. único.2) remite el texto íntegro del plan a la web oficial de la Dirección General de Protección Civil y Emergencias; el texto sale de ese PDF. Ficha ELI del decreto en doe.juntaex.es: solo la versión original publicada, sin versiones consolidadas ni modificaciones. Búsqueda de un decreto posterior que actualice o derogue el RADIOCAEX: ninguno localizado. El PDF de juntaex.es es el mismo fichero (sha256) con el que se hicieron las fichas." } },
      { titulo: "Plan Especial de Protección Civil ante el Riesgo Sísmico de la Comunidad Autónoma de Extremadura (PLASISMEX)", boe: 'DOE-2009040140', url: "https://www.juntaex.es/documents/77055/406857/01_PLASISMEX+%281%29.pdf", claves: ["PLASISMEX"],
        doe: { publicacion: "Decreto 127/2009, de 5 de junio (DOE n.º 111, de 11/06/2009)", pdfDoe: "https://doe.juntaex.es/pdfs/doe/2009/1110o/09040140.pdf", version: "PDF del plan de 21/02/2013", comprobado: "01/11/2026",
          busqueda: "El DOE publica solo el decreto; el texto del plan sale del PDF publicado en juntaex.es. Ficha ELI del decreto en doe.juntaex.es: solo la versión original publicada, sin versiones consolidadas ni modificaciones. Búsqueda de un decreto posterior que actualice o derogue el PLASISMEX: ninguno localizado. La Directriz Básica de terremotos (Orden INT/1069/2026, BOE-A-2026-21145) da cuatro años para adaptar los planes; el PLASISMEX aún no se ha adaptado. El PDF de juntaex.es es el mismo fichero (sha256) con el que se hicieron las fichas." } }],
    alcance: "El epígrafe pide definición, objetivos, estructura y organización y operatividad de los cuatro planes: INUNCAEX (cap. I §2, cap. IV y cap. V), TRANSCAEX (1.1–1.2 y caps. 4 y 5), RADIOCAEX (1.3 y caps. 3 y 4) y PLASISMEX (1.2 y apdos. 3 y 4). Los decretos (DOE) remiten el texto íntegro de cada plan a la web de la Junta, de donde sale. Tablas, figuras y organigramas se remiten al PDF.",
    bloques: [
      boe('planes-01', "INUNCAEX (Decreto 39/2025) · Objetivo y funciones básicas (cap. I, 2)"),
      boe('planes-02', "INUNCAEX · Estructura y organización (cap. IV, 1–3.5)"),
      boe('planes-03', "INUNCAEX · Operatividad (cap. V, 1–8.3)"),
      { ...boe('planes-04', "TRANSCAEX (Decreto 189/2019) · Definición y objetivos (1.1–1.2)"), boe: 'DOE-2019040205' },
      { ...boe('planes-05', "TRANSCAEX · Estructura y organización (cap. 4)"), boe: 'DOE-2019040205' },
      { ...boe('planes-06', "TRANSCAEX · Operatividad (cap. 5)"), boe: 'DOE-2019040205' },
      { ...boe('planes-07', "RADIOCAEX (Decreto 200/2019) · Definición y objetivos (1.3)"), boe: 'DOE-2019040206' },
      { ...boe('planes-08', "RADIOCAEX · Estructura, organización y funciones (cap. 3)"), boe: 'DOE-2019040206' },
      { ...boe('planes-09', "RADIOCAEX · Operatividad (cap. 4)"), boe: 'DOE-2019040206' },
      { ...boe('planes-10', "PLASISMEX · Definición, objeto y funciones (1.2)"), boe: 'DOE-2009040140' },
      { ...boe('planes-11', "PLASISMEX · Estructura y organización (3)"), boe: 'DOE-2009040140' },
      { ...boe('planes-12', "PLASISMEX · Operatividad (4)"), boe: 'DOE-2009040140' },
    ],
  },
  {
    tema: 32,
    nombre: "Código Técnico de la Edificación (RD 314/2006)",
    carpeta: 'tema32',
    textoOficial: { file: 'cte-texto-oficial.md', titulo: "Real Decreto 314/2006 · Texto consolidado (BOE)" },
    fuentes: [{ titulo: "Real Decreto 314/2006, de 17 de marzo, por el que se aprueba el Código Técnico de la Edificación", boe: 'BOE-A-2006-5515', url: boeUrl('BOE-A-2006-5515'), version: '15/06/2022' }],
    alcance: "El epígrafe pide objeto y ámbito y las exigencias básicas SI y SUA: CTE, Parte I, arts. 1–2, 11 y 12. Los documentos básicos DB SI y DB SUA (Parte II) no están en el texto consolidado del BOE, que solo los cita.",
    bloques: [
      boe('cte-01', "CTE, Parte I · Objeto y ámbito de aplicación (arts. 1–2)"),
      boe('cte-02', "CTE, Parte I · Exigencias básicas de seguridad en caso de incendio, SI 1 a SI 6 (art. 11)"),
      boe('cte-03', "CTE, Parte I · Exigencias básicas de seguridad de utilización y accesibilidad, SUA 1 a SUA 9 (art. 12)"),
    ],
  },
];

/**
 * Fuentes oficiales verificadas de temas que aún no tienen material. Permiten enlazar el documento oficial
 * aunque no haya esquema. Se generan esquema y texto solo desde texto consolidado del BOE; estos no lo tienen
 * (detalle en docs/MATERIAL_POR_TEMA.md):
 *  - T35: el epígrafe no cita norma; el catálogo vigente es el Decreto 98/2008 (DOE n.º 103, 29/05/2008), solo en PDF.
 *  - T39: Protocolo de movilización (BOP de Badajoz n.º 224, anuncio 4899/2025), solo en PDF.
 *  - T40: PT01 y PT03 son documentos internos del CPEI sin publicación oficial localizada: sin enlace.
 */
export const FUENTES_SIN_MATERIAL: Readonly<Record<number, readonly FuenteTema[]>> = {
  35: [{ titulo: 'Decreto 98/2008, de 23 de mayo, por el que se aprueba el nuevo Catálogo de las Carreteras de titularidad de la Junta de Extremadura (DOE n.º 103, 29/05/2008)', url: 'https://doe.juntaex.es/pdfs/doe/2008/1030o/08040108.pdf' }],
  39: [{ titulo: 'Protocolo de movilización del CPEI-Badajoz (BOP de Badajoz n.º 224, anuncio 4899/2025, 24/11/2025)', url: 'https://www.dip-badajoz.es/ficheros/bop/bopedictos/2025-11-24000000_4899.pdf' }],
};

export function materialDeTema(tema: number): MaterialTema | undefined {
  return MATERIAL_TEMAS.find((m) => m.tema === tema);
}

export function materialUrl(m: MaterialTema, file: string): string {
  return `/material/${m.carpeta}/${file}`;
}

/** Qué capas tiene un tema (en algún bloque). */
export function capasDisponibles(m: MaterialTema): CapaId[] {
  return CAPAS.map((c) => c.id).filter((id) => m.bloques.some((b) => b.capas[id]));
}
