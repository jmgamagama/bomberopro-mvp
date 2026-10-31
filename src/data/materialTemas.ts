/**
 * Registro de material de estudio por tema (esquema → desarrollo → texto oficial y fuentes).
 *
 * Es la ÚNICA lista de material: la pantalla `MaterialTema` lee de aquí. Cada capa es un fichero
 * markdown en public/material/<carpeta>/ que se descarga bajo demanda. Una capa que no exista se
 * deja sin poner: la pantalla dice que falta, nunca la rellena.
 *
 * Origen del material:
 *  - Tema 1 (piloto): scripts/generar_material.py (texto BOE) + esquema y desarrollo revisados a mano.
 *  - Temas 2, 3, 6, 7, 31 y 34: scripts/generar_material_boe.py scripts/material/temaNN.json (solo texto
 *    literal del BOE, limitado al epígrafe del anexo I). Sin desarrollo.
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
}

export interface FuenteTema {
  titulo: string;
  url: string;
  /** Identificador BOE si lo hay. */
  boe?: string;
  /** Fecha de la versión consolidada descargada (dd/mm/aaaa). */
  version?: string;
}

export interface MaterialTema {
  tema: number;
  nombre: string;
  carpeta: string;
  /** Texto oficial completo descargable (fichero de la carpeta). */
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
  { id: 'completo', label: 'Texto oficial', nota: 'Texto literal del BOE, artículo por artículo.' },
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
    fuentes: [{ titulo: 'Ley 31/1995, de 8 de noviembre, de Prevención de Riesgos Laborales', boe: 'BOE-A-1995-24292', url: boeUrl('BOE-A-1995-24292'), version: '23/10/2026' }],
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
    fuentes: [{ titulo: "Ley Orgánica 1/2011, de 28 de enero, de reforma del Estatuto de Autonomía de la Comunidad Autónoma de Extremadura", boe: 'BOE-A-2011-1638', url: boeUrl('BOE-A-2011-1638'), version: '30/10/2026' }],
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
    fuentes: [{ titulo: "Ley 7/1985, de 2 de abril, Reguladora de las Bases del Régimen Local", boe: 'BOE-A-1985-5392', url: boeUrl('BOE-A-1985-5392'), version: '05/10/2026' }],
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
    fuentes: [{ titulo: "Ley 8/2011, de 23 de marzo, de Igualdad entre mujeres y hombres y contra la violencia de género en Extremadura", boe: 'BOE-A-2011-6651', url: boeUrl('BOE-A-2011-6651'), version: '19/12/2025' }],
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
    fuentes: [{ titulo: "Real Decreto 1215/1997, de 18 de julio, por el que se establecen las disposiciones mínimas de seguridad y salud para la utilización por los trabajadores de los equipos de trabajo", boe: 'BOE-A-1997-17824', url: boeUrl('BOE-A-1997-17824'), version: '18/12/2025' }],
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
    fuentes: [{ titulo: "Real Decreto 164/2025, de 4 de marzo, por el que se aprueba el Reglamento de seguridad contra incendios en los establecimientos industriales", boe: 'BOE-A-2025-7190', url: boeUrl('BOE-A-2025-7190'), version: '20/12/2025' }],
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
];

/**
 * Fuentes oficiales verificadas de temas que aún no tienen material (texto consolidado descargado en
 * data/fuentes/<BOE-A-…>/meta.json). Permiten enlazar la norma aunque no haya esquema.
 */
export const FUENTES_SIN_MATERIAL: Readonly<Record<number, readonly FuenteTema[]>> = {
  33: [{ titulo: 'Real Decreto 513/2017 · Reglamento de instalaciones de protección contra incendios', boe: 'BOE-A-2017-6606', url: boeUrl('BOE-A-2017-6606') }],
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
