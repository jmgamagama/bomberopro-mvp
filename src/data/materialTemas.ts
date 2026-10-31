/**
 * Registro de material de estudio por tema (esquema → desarrollo → texto oficial y fuentes).
 *
 * Es la ÚNICA lista de material: la pantalla `MaterialTema` lee de aquí. Cada capa es un fichero
 * markdown en public/material/<carpeta>/ que se descarga bajo demanda. Una capa que no exista se
 * deja sin poner: la pantalla dice que falta, nunca la rellena.
 *
 * Origen del material:
 *  - Tema 1 (piloto): scripts/generar_material.py (texto BOE) + esquema y desarrollo revisados a mano.
 *  - Tema 6: scripts/generar_material_boe.py BOE-A-1995-24292 tema06 lprl 1,2,3,4 (solo texto literal
 *    del BOE: rúbricas y artículos de los capítulos I-IV, que son los que pide el anexo I). Sin desarrollo.
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

const lprl = (n: number, titulo: string): MaterialBloque => {
  const id = `lprl-0${n}`;
  return { id, titulo, capas: { esquema: `${id}-1-esquema.md`, completo: `${id}-3-completo.md` } };
};

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
];

/**
 * Fuentes oficiales verificadas de temas que aún no tienen material (texto consolidado descargado en
 * data/fuentes/<BOE-A-…>/meta.json). Permiten enlazar la norma aunque no haya esquema.
 */
export const FUENTES_SIN_MATERIAL: Readonly<Record<number, readonly FuenteTema[]>> = {
  2: [{ titulo: 'Ley Orgánica 1/2011, de reforma del Estatuto de Autonomía de Extremadura', boe: 'BOE-A-2011-1638', url: boeUrl('BOE-A-2011-1638') }],
  3: [{ titulo: 'Ley 7/1985, Reguladora de las Bases del Régimen Local', boe: 'BOE-A-1985-5392', url: boeUrl('BOE-A-1985-5392') }],
  7: [{ titulo: 'Ley 8/2011, de Igualdad entre mujeres y hombres y contra la violencia de género en Extremadura', boe: 'BOE-A-2011-6651', url: boeUrl('BOE-A-2011-6651') }],
  31: [{ titulo: 'Real Decreto 1215/1997 · Equipos de trabajo', boe: 'BOE-A-1997-17824', url: boeUrl('BOE-A-1997-17824') }],
  33: [{ titulo: 'Real Decreto 513/2017 · Reglamento de instalaciones de protección contra incendios', boe: 'BOE-A-2017-6606', url: boeUrl('BOE-A-2017-6606') }],
  34: [{ titulo: 'Real Decreto 164/2025 · Reglamento de seguridad contra incendios en los establecimientos industriales', boe: 'BOE-A-2025-7190', url: boeUrl('BOE-A-2025-7190') }],
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
