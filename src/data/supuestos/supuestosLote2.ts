/**
 * Supuestos prácticos ORIGINALES, lote 2: cálculo hidráulico y física aplicada (temas 9 y 22).
 *
 * Redactados desde cero para BomberoPro. Solo se ha tomado del material privado de un usuario la
 * LISTA DE TIPOS de ejercicio (presión hidrostática, Pascal, Arquímedes, caudal, Bernoulli,
 * pérdidas de carga, descarga, chorro, reacción, energía y potencia de bombeo, poleas): ningún
 * escenario, frase, nombre ni cifra. Un test (supuestosAntiCopia.test.ts) lo comprueba contra el
 * archivo privado cuando está disponible fuera del repo.
 *
 * Fórmulas: física e hidráulica estándar. Cada pregunta cita su fuente con localización exacta:
 * oficial cuando existe (BOE, guía del IDAE/MITECO) y, si no, material educativo público y
 * gratuito (OpenStax, Universitat Politècnica de València, Xunta de Galicia). Todas las URL se
 * comprobaron con curl el 18/10/2026 (FUENTES_LOTE2_VERIFICADAS).
 *
 * Todos quedan «pendiente de revisión» (no están en REVIEWED_DECKS): el alumno no los ve hasta la
 * revisión humana. Los resultados se recalculan de forma independiente en supuestosLote2.test.ts.
 *
 * Convenios comunes: g = 9,81 m/s²; densidad del agua 1000 kg/m³; fluidos ideales salvo que el
 * enunciado dé pérdidas de carga.
 */
import type { Supuesto } from './supuestosTypes';

// ---------------------------------------------------------------------------
// Fuentes
// ---------------------------------------------------------------------------

const OS_BASE = 'https://openstax.org/books/f%C3%ADsica-universitaria-volumen-1/pages/';
const OS_DESC =
  'OpenStax, Física universitaria, volumen 1 (Rice University; edición en español; licencia CC BY 4.0); material educativo abierto y gratuito';
function openstax(apartado: string, pagina: string, detalle: string) {
  const loc = `Física universitaria, vol. 1 (OpenStax), apdo. ${apartado}, ${detalle}`;
  return { localizacion: loc, fuente: `${loc}. ${OS_DESC}: ${OS_BASE}${pagina}` };
}

const UPV_URL = 'https://riunet.upv.es/bitstreams/3b47d3c3-9c55-487a-a103-edbc0f9d41b3/download';
const UPV_DESC =
  'R. del Teso March, «Aplicación de la ecuación de Bernoulli en flujo a presión», artículo docente, Universitat Politècnica de València (repositorio RiuNet), 2025; material educativo gratuito';
function upv(apartado: string, pagina: number) {
  const loc = `«Aplicación de la ecuación de Bernoulli en flujo a presión» (UPV), ${apartado}, pág. ${pagina}`;
  return { localizacion: loc, fuente: `${loc}. ${UPV_DESC}: ${UPV_URL}#page=${pagina}` };
}

const IDAE_URL =
  'https://www.miteco.gob.es/content/dam/miteco/es/energia/files-1/Eficiencia/RITE/documentosreconocidosrite/Gu%C3%ADas%20t%C3%A9cnicas/Guia_Bombas_Ventiladores.pdf';
const IDAE_DESC =
  'IDAE, Guía técnica de selección de equipos de transporte de fluidos (documento reconocido del RITE, 2012), publicada por el Ministerio para la Transición Ecológica; documento oficial gratuito';
function idae(apartado: string, paginaImpresa: number) {
  const loc = `Guía técnica de selección de equipos de transporte de fluidos (IDAE), ${apartado}, pág. ${paginaImpresa}`;
  // La numeración impresa va 2 páginas por detrás de la del PDF.
  return { localizacion: loc, fuente: `${loc}. ${IDAE_DESC}: ${IDAE_URL}#page=${paginaImpresa + 2}` };
}

const XUNTA_URL = 'https://recursos.edu.xunta.gal/sites/default/files/recurso/1639064661/33_mecanismos_para_reducir_la_carga.html';
const XUNTA_DESC =
  'Xunta de Galicia, Consellería de Educación, recurso educativo «Pasear sin barreras», 3.3 Mecanismos para reducir la carga; material educativo público y gratuito';
function xunta(apartado: string) {
  const loc = `«Pasear sin barreras» (Xunta de Galicia), 3.3 Mecanismos para reducir la carga, ${apartado}`;
  return { localizacion: loc, fuente: `${loc}. ${XUNTA_DESC}: ${XUNTA_URL}` };
}

const BOE_UNIDADES_URL = 'https://www.boe.es/buscar/act.php?id=BOE-A-2010-927#an';
const BOE_UNIDADES_LOC = 'RD 2032/2009 (unidades legales de medida), anexo, capítulo IV, tabla 8';
const BOE_UNIDADES = `${BOE_UNIDADES_LOC}: 1 bar = 0,1 MPa = 100 kPa = 10⁵ Pa. BOE-A-2010-927, texto consolidado: ${BOE_UNIDADES_URL}`;

/** URL citadas en el lote, comprobadas con curl (HTTP 200) el 18/10/2026. */
export const FUENTES_LOTE2_VERIFICADAS: readonly string[] = [
  `${OS_BASE}3-5-caida-libre`,
  `${OS_BASE}7-4-potencia`,
  `${OS_BASE}8-1-energia-potencial-de-un-sistema`,
  `${OS_BASE}9-2-impulso-y-colisiones`,
  `${OS_BASE}14-1-fluidos-densidad-y-presion`,
  `${OS_BASE}14-2-medir-la-presion`,
  `${OS_BASE}14-3-principio-de-pascal-y-la-hidraulica`,
  `${OS_BASE}14-4-principio-de-arquimedes-y-flotabilidad`,
  `${OS_BASE}14-5-dinamicas-de-fluidos`,
  `${OS_BASE}14-6-ecuacion-de-bernoulli`,
  UPV_URL,
  IDAE_URL,
  XUNTA_URL,
  BOE_UNIDADES_URL,
];

// ---------------------------------------------------------------------------
// Supuestos
// ---------------------------------------------------------------------------

export const SUPUESTOS_LOTE2: readonly Supuesto[] = [
  // 1 ─ Hidrostática: presión con la profundidad, columna equivalente y tubo en U con dos líquidos
  {
    id: 'supuesto-t9-hidrostatica-01',
    titulo: 'Aljibe enterrado de una finca y tubo en U del aula del parque',
    temas: [9],
    autoria: 'original',
    fuentes: [
      'OpenStax, Física universitaria vol. 1, apdos. 14.1 y 14.2',
      'RD 2032/2009, unidades legales de medida (BOE-A-2010-927)',
    ],
    enunciado:
      'Una finca de olivar ofrece al servicio su aljibe enterrado como punto de toma de agua. El aljibe es ' +
      'irregular, con planta en forma de L, y el nivel del agua está a 3,6 m sobre su fondo. En la parte baja de ' +
      'la finca hay una boca de riego con manómetro. De vuelta en el parque, la sesión de formación repasa ' +
      'presiones con un tubo en U transparente abierto por los dos extremos. Toma g = 9,81 m/s² y 1000 kg/m³ ' +
      'como densidad del agua; las presiones son manométricas (sobre la atmosférica).',
    preguntas: [
      {
        id: 't9-hidrostatica-01-p1',
        tipo: 'test',
        enunciado: 'Como el aljibe tiene forma de L, ¿de qué depende la presión del agua sobre su fondo?',
        opciones: [
          'Del volumen total de agua que contiene el aljibe',
          'De la superficie del fondo',
          'Solo de la profundidad bajo la superficie libre (y de la densidad del líquido)',
          'De la inclinación y la forma de las paredes',
        ],
        correcta: 2,
        explicacion:
          'En un líquido en reposo de densidad constante, p = p₀ + ρ·g·h: la presión solo depende de la profundidad h ' +
          'bajo la superficie libre, no de la forma del recipiente ni de la cantidad de agua. La fuerza total sobre el ' +
          'fondo sí depende de su superficie, pero aquí se pregunta por la presión.',
        ...openstax('14.1', '14-1-fluidos-densidad-y-presion', '«Presión en un fluido con densidad constante», ecuación 14.9'),
      },
      {
        id: 't9-hidrostatica-01-p2',
        tipo: 'calculo',
        enunciado: '¿Qué presión manométrica soporta el fondo del aljibe? (Resultado en kPa.)',
        formula: 'p = ρ · g · h (presión manométrica: p − p₀)',
        pasos: [
          { descripcion: 'ρ · g · h = 1000 kg/m³ × 9,81 m/s² × 3,6 m', operacion: '1000 × 9.81 × 3.6', resultado: 35316, unidad: 'Pa' },
          { descripcion: 'Paso a kPa (1 kPa = 1000 Pa)', operacion: '35316 / 1000', resultado: 35.316, unidad: 'kPa' },
        ],
        resultado: 35.316,
        unidad: 'kPa',
        tolerancia: 0.05,
        explicacion:
          'De p = p₀ + ρ·g·h, la presión manométrica es ρ·g·h = 1000 × 9,81 × 3,6 = 35 316 Pa ≈ 35,3 kPa (unos 0,35 bar).',
        ...openstax('14.1', '14-1-fluidos-densidad-y-presion', '«Presión en un fluido con densidad constante», ecuación 14.9'),
      },
      {
        id: 't9-hidrostatica-01-p3',
        tipo: 'calculo',
        enunciado:
          'Con el agua en reposo, el manómetro de la boca de riego marca 2,4 bar. ¿A cuántos metros de columna de agua ' +
          'sobre la boca equivale esa presión? (Resultado en m.)',
        formula: 'p_m = h · ρ · g  →  h = p_m / (ρ · g); 1 bar = 100 000 Pa',
        pasos: [
          { descripcion: 'Paso a pascales (1 bar = 10⁵ Pa)', operacion: '2.4 × 100000', resultado: 240000, unidad: 'Pa' },
          { descripcion: 'Peso específico del agua ρ · g', operacion: '1000 × 9.81', resultado: 9810, unidad: 'N/m³' },
          { descripcion: 'Altura de la columna h = p / (ρ · g)', operacion: '240000 / 9810', resultado: 24.464831804281346, unidad: 'm' },
        ],
        resultado: 24.464831804281346,
        unidad: 'm',
        tolerancia: 0.05,
        explicacion:
          'La presión manométrica de una columna de líquido es p = h·ρ·g, así que h = p/(ρ·g). Con 2,4 bar = 240 000 Pa ' +
          '(RD 2032/2009: 1 bar = 10⁵ Pa), h = 240 000 / 9810 ≈ 24,46 m de columna de agua.',
        ...openstax('14.2', '14-2-medir-la-presion', '«Medir la presión», «Manómetros» (p_g = hρg)'),
        fuente:
          `Física universitaria, vol. 1 (OpenStax), apdo. 14.2, «Medir la presión», «Manómetros» (p_g = hρg). ${OS_DESC}: ${OS_BASE}14-2-medir-la-presion — ` +
          `Conversión de unidades: ${BOE_UNIDADES}`,
      },
      {
        id: 't9-hidrostatica-01-p4',
        tipo: 'calculo',
        enunciado:
          'En una rama del tubo en U, que contenía solo agua, se vierte aceite de densidad 870 kg/m³ hasta formar una ' +
          'capa de 34 cm encima del agua. Medida desde el nivel de la superficie de separación aceite-agua, ¿qué altura ' +
          'alcanza el agua en la otra rama? (Resultado en cm.)',
        formula: 'ρ₁ · h₁ = ρ₂ · h₂  →  h_agua = ρ_aceite · h_aceite / ρ_agua',
        pasos: [
          { descripcion: 'h_agua = 870 × 34 / 1000', operacion: '870 × 34 / 1000', resultado: 29.58, unidad: 'cm' },
        ],
        resultado: 29.58,
        unidad: 'cm',
        tolerancia: 0.05,
        explicacion:
          'Dos puntos a la misma altura dentro del mismo líquido (el agua) tienen la misma presión. Tomando el nivel de la ' +
          'superficie de separación: p₀ + ρ_agua·g·h_agua = p₀ + ρ_aceite·g·h_aceite, luego ρ_agua·h_agua = ρ_aceite·h_aceite ' +
          'y h_agua = 870 × 34 / 1000 = 29,58 cm.',
        ...openstax('14.2', '14-2-medir-la-presion', 'Ejemplo 14.2 «Alturas de los fluidos en un tubo en U abierto»'),
      },
      {
        id: 't9-hidrostatica-01-p5',
        tipo: 'test',
        enunciado: 'En ese tubo en U con aceite y agua, ¿qué rama tiene su superficie libre más alta?',
        opciones: [
          'La del agua, porque es el líquido más denso',
          'La del aceite, porque al ser menos denso necesita más altura para equilibrar la misma presión',
          'Las dos quedan a la misma altura, como en unos vasos comunicantes con un solo líquido',
          'Depende del diámetro de cada rama',
        ],
        correcta: 1,
        explicacion:
          'Como ρ_aceite·h_aceite = ρ_agua·h_agua y el aceite es menos denso, su columna es más alta (34 cm frente a 29,58 cm ' +
          'sobre la superficie de separación). Solo con densidades iguales quedarían al mismo nivel; el diámetro no influye.',
        ...openstax('14.2', '14-2-medir-la-presion', 'Ejemplo 14.2 «Alturas de los fluidos en un tubo en U abierto»'),
      },
      {
        id: 't9-hidrostatica-01-p6',
        tipo: 'calculo',
        enunciado:
          'Al final de la sesión, una línea con la lanza cerrada (agua en reposo) sube por la fachada hasta 14 m por encima ' +
          'de la salida de la bomba, cuyo manómetro marca 7,5 bar. ¿Qué presión manométrica hay en la lanza? (Resultado en bar.)',
        formula: 'Fluido en reposo: p_lanza = p_bomba − ρ · g · Δh;  1 bar = 100 000 Pa',
        pasos: [
          { descripcion: 'Presión en la bomba en pascales', operacion: '7.5 × 100000', resultado: 750000, unidad: 'Pa' },
          { descripcion: 'Presión de la columna de 14 m, ρ · g · Δh', operacion: '1000 × 9.81 × 14', resultado: 137340, unidad: 'Pa' },
          { descripcion: 'Presión en la lanza', operacion: '750000 − 137340', resultado: 612660, unidad: 'Pa' },
          { descripcion: 'Paso a bar', operacion: '612660 / 100000', resultado: 6.1266, unidad: 'bar' },
        ],
        resultado: 6.1266,
        unidad: 'bar',
        tolerancia: 0.01,
        explicacion:
          'Con el agua en reposo no hay pérdidas de carga ni influye la longitud de la manguera: entre dos puntos de un líquido ' +
          'en reposo la presión cambia en ρ·g·Δh (p = p₀ + ρ·g·h). Subir 14 m resta 1000 × 9,81 × 14 = 137 340 Pa: ' +
          '750 000 − 137 340 = 612 660 Pa ≈ 6,13 bar (1 bar = 10⁵ Pa, RD 2032/2009).',
        ...openstax('14.1', '14-1-fluidos-densidad-y-presion', '«Presión en un fluido con densidad constante», ecuación 14.9'),
        fuente:
          `Física universitaria, vol. 1 (OpenStax), apdo. 14.1, «Presión en un fluido con densidad constante», ecuación 14.9. ${OS_DESC}: ${OS_BASE}14-1-fluidos-densidad-y-presion — ` +
          `Conversión de unidades: ${BOE_UNIDADES}`,
      },
    ],
  },

  // 2 ─ Principio de Pascal (gato hidráulico) y principio de Arquímedes (empuje y peso aparente)
  {
    id: 'supuesto-t9-pascal-arquimedes-01',
    titulo: 'Gato hidráulico en una excarcelación y bidón hundido en una balsa de riego',
    temas: [9],
    autoria: 'original',
    fuentes: ['OpenStax, Física universitaria vol. 1, apdos. 14.3 y 14.4'],
    enunciado:
      'Tras la salida de vía de una furgoneta de reparto, el equipo usa un gato hidráulico manual cuyo pistón de ' +
      'bombeo tiene 3 cm² de sección y cuyo pistón de elevación tiene 120 cm². Horas después, en una balsa de riego ' +
      'de agua dulce, hay que recuperar un bidón metálico cerrado de 0,22 m³ y un lastre macizo de hierro de 0,035 m³ ' +
      'y 270 kg. Considera el gato ideal (sin rozamientos y con los dos pistones a la misma altura), g = 9,81 m/s² y ' +
      '1000 kg/m³ como densidad del agua.',
    preguntas: [
      {
        id: 't9-pascal-arquimedes-01-p1',
        tipo: 'calculo',
        enunciado: 'Si se empuja el pistón de bombeo con 220 N, ¿qué fuerza ejerce el pistón de elevación? (Resultado en N.)',
        formula: 'F₁ / A₁ = F₂ / A₂  →  F₂ = F₁ · A₂ / A₁',
        pasos: [
          { descripcion: 'Relación de secciones A₂ / A₁', operacion: '120 / 3', resultado: 40, unidad: '' },
          { descripcion: 'F₂ = 220 N × 40', operacion: '220 × 40', resultado: 8800, unidad: 'N' },
        ],
        resultado: 8800,
        unidad: 'N',
        tolerancia: 1,
        explicacion:
          'Por el principio de Pascal la presión se transmite igual a todo el fluido: F₁/A₁ = F₂/A₂. La fuerza se multiplica ' +
          'por la relación de secciones, 120/3 = 40: 220 N × 40 = 8800 N.',
        ...openstax('14.3', '14-3-principio-de-pascal-y-la-hidraulica', '«Aplicaciones del principio de Pascal y sistemas hidráulicos», ecuación 14.12'),
      },
      {
        id: 't9-pascal-arquimedes-01-p2',
        tipo: 'test',
        enunciado:
          'Si se cambiara el gato por otro con el mismo pistón de bombeo pero con un pistón de elevación del doble de ' +
          'diámetro, con la misma fuerza en el pistón de bombeo, la fuerza de elevación…',
        opciones: ['se duplicaría', 'se multiplicaría por 4', 'se multiplicaría por 8', 'no cambiaría'],
        correcta: 1,
        explicacion:
          'F₂ = F₁·A₂/A₁ y la sección de un pistón circular es proporcional al cuadrado del diámetro (π·r²): con el doble ' +
          'de diámetro, A₂ es 4 veces mayor y también F₂.',
        ...openstax('14.3', '14-3-principio-de-pascal-y-la-hidraulica', '«Aplicaciones del principio de Pascal y sistemas hidráulicos», ecuación 14.12 (y A = πr² del ejemplo)'),
      },
      {
        id: 't9-pascal-arquimedes-01-p3',
        tipo: 'calculo',
        enunciado: '¿Qué fuerza mínima hay que aplicar al pistón de bombeo para sostener una carga de 13 500 N? (Resultado en N.)',
        formula: 'F₁ = F₂ · A₁ / A₂',
        pasos: [{ descripcion: 'F₁ = 13 500 N × 3 / 120', operacion: '13500 × 3 / 120', resultado: 337.5, unidad: 'N' }],
        resultado: 337.5,
        unidad: 'N',
        tolerancia: 0.5,
        explicacion: 'Despejando de F₁/A₁ = F₂/A₂: F₁ = 13 500 × 3 / 120 = 337,5 N, la cuadragésima parte de la carga.',
        ...openstax('14.3', '14-3-principio-de-pascal-y-la-hidraulica', '«Aplicaciones del principio de Pascal y sistemas hidráulicos», ecuación 14.12'),
      },
      {
        id: 't9-pascal-arquimedes-01-p4',
        tipo: 'calculo',
        enunciado: 'Con el bidón totalmente sumergido, ¿qué empuje recibe del agua? (Resultado en N.)',
        formula: 'F_E = peso del fluido desalojado = ρ · V · g',
        pasos: [
          { descripcion: 'Masa de agua desalojada ρ · V', operacion: '1000 × 0.22', resultado: 220, unidad: 'kg' },
          { descripcion: 'Su peso m · g', operacion: '220 × 9.81', resultado: 2158.2, unidad: 'N' },
        ],
        resultado: 2158.2,
        unidad: 'N',
        tolerancia: 1,
        explicacion:
          'Principio de Arquímedes: el empuje es igual al peso del fluido desalojado. Sumergido del todo, el bidón desaloja ' +
          '0,22 m³ de agua (220 kg): 220 × 9,81 = 2158,2 N.',
        ...openstax('14.4', '14-4-principio-de-arquimedes-y-flotabilidad', '«Principio de Arquímedes» (F_B = w_fl)'),
      },
      {
        id: 't9-pascal-arquimedes-01-p5',
        tipo: 'test',
        enunciado: 'El bidón, con su contenido, tiene una masa total de 75 kg. Si se suelta totalmente sumergido, ¿qué hará?',
        opciones: [
          'Se hundirá, porque es metálico',
          'Quedará quieto a media profundidad',
          'Subirá y flotará, porque su peso (unos 736 N) es menor que el empuje que recibiría sumergido del todo',
          'Se hundirá o flotará según la profundidad de la balsa',
        ],
        correcta: 2,
        explicacion:
          'Su peso es 75 × 9,81 = 735,75 N, menor que el empuje con el bidón sumergido (2158,2 N): la fuerza neta es hacia ' +
          'arriba y flota, sumergido solo en parte. Dicho de otro modo, su densidad media (75 / 0,22 ≈ 341 kg/m³) es menor ' +
          'que la del agua. Para un líquido incompresible el empuje no cambia con la profundidad.',
        ...openstax('14.4', '14-4-principio-de-arquimedes-y-flotabilidad', '«Principio de Arquímedes» y «Densidad y principio de Arquímedes»'),
      },
      {
        id: 't9-pascal-arquimedes-01-p6',
        tipo: 'calculo',
        enunciado:
          '¿Qué fuerza vertical hay que hacer para sostener el lastre de hierro dentro del agua, sin que toque el fondo ' +
          '(su peso aparente)? (Resultado en N.)',
        formula: 'Peso aparente = m · g − ρ_agua · V · g',
        pasos: [
          { descripcion: 'Peso del lastre m · g', operacion: '270 × 9.81', resultado: 2648.7, unidad: 'N' },
          { descripcion: 'Empuje ρ · V · g', operacion: '1000 × 0.035 × 9.81', resultado: 343.35, unidad: 'N' },
          { descripcion: 'Peso aparente', operacion: '2648.7 − 343.35', resultado: 2305.35, unidad: 'N' },
        ],
        resultado: 2305.35,
        unidad: 'N',
        tolerancia: 1,
        explicacion:
          'Un cuerpo sumergido sufre una pérdida de peso aparente igual al peso del fluido desalojado: 2648,7 N − 343,35 N ' +
          '= 2305,35 N.',
        ...openstax('14.4', '14-4-principio-de-arquimedes-y-flotabilidad', '«Medición de densidad» (peso aparente)'),
      },
    ],
  },

  // 3 ─ Caudal Q = A·v, tiempo de vaciado y ecuación de continuidad
  {
    id: 'supuesto-t9-caudal-01',
    titulo: 'Cisterna nodriza en un incendio de pastos',
    temas: [9],
    autoria: 'original',
    fuentes: ['OpenStax, Física universitaria vol. 1, apdo. 14.5'],
    enunciado:
      'En un incendio de pastos, una cisterna nodriza de 7560 litros abastece una línea de ataque. En un tramo de la ' +
      'línea, la sección interior es de 0,0012 m² y el agua circula a una velocidad media de 3,5 m/s. La boquilla de ' +
      'la lanza tiene una sección de salida de 0,0003 m². Supón el caudal constante y el agua incompresible.',
    preguntas: [
      {
        id: 't9-caudal-01-p1',
        tipo: 'calculo',
        enunciado: '¿Qué caudal circula por la línea? (Resultado en l/min.)',
        formula: 'Q = A · v',
        pasos: [
          { descripcion: 'Q = 0,0012 m² × 3,5 m/s', operacion: '0.0012 × 3.5', resultado: 0.0042, unidad: 'm³/s' },
          { descripcion: 'A litros por segundo (1 m³ = 1000 l)', operacion: '0.0042 × 1000', resultado: 4.2, unidad: 'l/s' },
          { descripcion: 'A litros por minuto', operacion: '4.2 × 60', resultado: 252, unidad: 'l/min' },
        ],
        resultado: 252,
        unidad: 'l/min',
        tolerancia: 1,
        explicacion: 'El caudal es el producto de la sección por la velocidad media: 0,0012 × 3,5 = 0,0042 m³/s = 4,2 l/s = 252 l/min.',
        ...openstax('14.5', '14-5-dinamicas-de-fluidos', '«La tasa de flujo y su relación con la velocidad» (Q = Av)'),
      },
      {
        id: 't9-caudal-01-p2',
        tipo: 'test',
        enunciado: 'Ese caudal de 252 l/min, expresado en m³/h, es:',
        opciones: ['4,2 m³/h', '15,12 m³/h', '1,512 m³/h', '151,2 m³/h'],
        correcta: 1,
        explicacion: '252 l/min × 60 min/h = 15 120 l/h = 15,12 m³/h (1 m³ = 1000 l). 4,2 es el valor en l/s.',
        ...openstax('14.5', '14-5-dinamicas-de-fluidos', '«La tasa de flujo y su relación con la velocidad», ecuación 14.13 (Q = dV/dt)'),
      },
      {
        id: 't9-caudal-01-p3',
        tipo: 'calculo',
        enunciado: 'Con ese caudal, ¿cuánto tarda en vaciarse la cisterna nodriza llena? (Resultado en minutos.)',
        formula: 't = V / Q',
        pasos: [{ descripcion: '7560 l / 252 l/min', operacion: '7560 / 252', resultado: 30, unidad: 'min' }],
        resultado: 30,
        unidad: 'min',
        tolerancia: 0.1,
        explicacion: 'El caudal es volumen por unidad de tiempo (Q = V/t), así que t = V/Q = 7560 / 252 = 30 min.',
        ...openstax('14.5', '14-5-dinamicas-de-fluidos', '«La tasa de flujo y su relación con la velocidad», ecuación 14.13 (Q = dV/dt)'),
      },
      {
        id: 't9-caudal-01-p4',
        tipo: 'calculo',
        enunciado: '¿A qué velocidad sale el agua por la boquilla de la lanza? (Resultado en m/s.)',
        formula: 'A₁ · v₁ = A₂ · v₂  →  v₂ = A₁ · v₁ / A₂',
        pasos: [{ descripcion: 'v₂ = 0,0012 × 3,5 / 0,0003', operacion: '0.0012 × 3.5 / 0.0003', resultado: 14, unidad: 'm/s' }],
        resultado: 14,
        unidad: 'm/s',
        tolerancia: 0.1,
        explicacion:
          'Por la ecuación de continuidad el caudal es el mismo en toda la línea: v₂ = A₁·v₁/A₂ = 0,0042 / 0,0003 = 14 m/s. ' +
          'La sección es 4 veces menor y la velocidad, 4 veces mayor.',
        ...openstax('14.5', '14-5-dinamicas-de-fluidos', '«La tasa de flujo y su relación con la velocidad», ecuación 14.14 (continuidad)'),
      },
      {
        id: 't9-caudal-01-p5',
        tipo: 'test',
        enunciado:
          'Con el mismo caudal, si en otro tramo el diámetro interior fuera la mitad, la velocidad media del agua en ese tramo…',
        opciones: ['se duplicaría', 'se reduciría a la mitad', 'se multiplicaría por 4', 'no cambiaría'],
        correcta: 2,
        explicacion:
          'Con Q constante, v = Q/A, y la sección circular es proporcional al cuadrado del diámetro: con la mitad de ' +
          'diámetro la sección es la cuarta parte y la velocidad, 4 veces mayor.',
        ...openstax('14.5', '14-5-dinamicas-de-fluidos', '«La tasa de flujo y su relación con la velocidad», ecuación 14.14 (continuidad)'),
      },
    ],
  },

  // 4 ─ Bernoulli ideal y real (con pérdidas de carga); Darcy-Weisbach solo en proporciones
  {
    id: 'supuesto-t9-bernoulli-perdidas-01',
    titulo: 'Red de agua de un edificio de oficinas: estrechamiento, subida y pérdidas',
    temas: [9],
    autoria: 'original',
    fuentes: [
      'OpenStax, Física universitaria vol. 1, apdo. 14.6',
      'R. del Teso March, «Aplicación de la ecuación de Bernoulli en flujo a presión», UPV',
    ],
    enunciado:
      'Revisáis con el técnico de mantenimiento la red de agua de un edificio de oficinas. Hay un tramo horizontal ' +
      'con un estrechamiento, una montante de sección constante que sube a una planta superior y un tramo recto ' +
      'con dos tubos piezométricos instalados. Toma 1000 kg/m³ como densidad del agua. Expresa las energías en ' +
      'metros de columna de agua (mca) cuando se indique.',
    preguntas: [
      {
        id: 't9-bernoulli-perdidas-01-p1',
        tipo: 'test',
        enunciado: 'Al pasar el agua por el estrechamiento del tramo horizontal, con el mismo caudal:',
        opciones: [
          'la velocidad aumenta y la presión disminuye',
          'la velocidad y la presión aumentan',
          'la velocidad y la presión disminuyen',
          'la velocidad disminuye y la presión aumenta',
        ],
        correcta: 0,
        explicacion:
          'Por continuidad, a menor sección mayor velocidad; y por Bernoulli, si sube la altura cinética baja la de presión ' +
          'para mantener la energía total. Al ensancharse de nuevo, la presión se recupera.',
        ...upv('3. La ecuación de Bernoulli', 3),
      },
      {
        id: 't9-bernoulli-perdidas-01-p2',
        tipo: 'calculo',
        enunciado:
          'Antes del estrechamiento la presión es de 310 kPa y la velocidad 1,6 m/s; en el estrechamiento la velocidad es ' +
          '4,8 m/s. Sin pérdidas y a la misma cota, ¿qué presión hay en el estrechamiento? (Resultado en kPa.)',
        formula: 'p₁ + ½ ρ v₁² = p₂ + ½ ρ v₂²  →  p₂ = p₁ − ½ ρ (v₂² − v₁²)',
        pasos: [
          { descripcion: 'v₂² − v₁² = 4,8² − 1,6²', operacion: '4.8 × 4.8 − 1.6 × 1.6', resultado: 20.48, unidad: 'm²/s²' },
          { descripcion: '½ ρ (v₂² − v₁²)', operacion: '0.5 × 1000 × 20.48', resultado: 10240, unidad: 'Pa' },
          { descripcion: 'p₂ = 310 000 Pa − 10 240 Pa', operacion: '310000 − 10240', resultado: 299760, unidad: 'Pa' },
          { descripcion: 'Paso a kPa', operacion: '299760 / 1000', resultado: 299.76, unidad: 'kPa' },
        ],
        resultado: 299.76,
        unidad: 'kPa',
        tolerancia: 0.1,
        explicacion:
          'Con la misma altura, Bernoulli queda p₁ + ½ρv₁² = p₂ + ½ρv₂². La caída de presión es ½ × 1000 × (23,04 − 2,56) ' +
          '= 10 240 Pa, y p₂ = 310 000 − 10 240 = 299 760 Pa ≈ 299,8 kPa.',
        ...openstax('14.6', '14-6-ecuacion-de-bernoulli', '«Ecuación de Bernoulli», ecuación 14.16'),
      },
      {
        id: 't9-bernoulli-perdidas-01-p3',
        tipo: 'calculo',
        enunciado:
          'La montante tiene sección constante. En su base la altura de presión es de 46 mca. Su extremo superior está 11 m ' +
          'más alto y las pérdidas de carga del tramo suman 2,8 mca. ¿Qué altura de presión queda arriba? (Resultado en mca.)',
        formula: 'P₁/γ + z₁ + v₁²/2g = P₂/γ + z₂ + v₂²/2g + Σh  (con v₁ = v₂)',
        pasos: [
          { descripcion: 'P₂/γ = 46 − 11 − 2,8 (la altura cinética se anula al ser igual)', operacion: '46 − 11 − 2.8', resultado: 32.2, unidad: 'mca' },
        ],
        resultado: 32.2,
        unidad: 'mca',
        tolerancia: 0.05,
        explicacion:
          'Con la ecuación de Bernoulli para sistemas reales y la misma velocidad en los dos puntos: P₂/γ = P₁/γ − (z₂ − z₁) ' +
          '− Σh = 46 − 11 − 2,8 = 32,2 mca.',
        ...upv('3. La ecuación de Bernoulli para sistemas reales', 4),
      },
      {
        id: 't9-bernoulli-perdidas-01-p4',
        tipo: 'calculo',
        enunciado:
          'En el tramo recto, horizontal y de sección constante, los dos tubos piezométricos marcan 3,15 m (aguas arriba) y ' +
          '2,72 m (aguas abajo). ¿Qué pérdida de carga hay entre ellos? (Resultado en m.)',
        formula: 'Σh = (P₁/γ + z₁ + v₁²/2g) − (P₂/γ + z₂ + v₂²/2g), con z₁ = z₂ y v₁ = v₂',
        pasos: [{ descripcion: 'Diferencia de alturas piezométricas', operacion: '3.15 − 2.72', resultado: 0.43, unidad: 'm' }],
        resultado: 0.43,
        unidad: 'm',
        tolerancia: 0.01,
        explicacion:
          'Con la misma cota y la misma velocidad, la diferencia de energía entre los dos puntos es solo la de alturas de ' +
          'presión, que es lo que marcan los piezómetros: 3,15 − 2,72 = 0,43 m de pérdida de carga.',
        ...upv('3. La ecuación de Bernoulli para sistemas reales', 4),
      },
      {
        id: 't9-bernoulli-perdidas-01-p5',
        tipo: 'calculo',
        enunciado:
          'Con cierto caudal, 40 m de una tubería de la red pierden 1,9 mca por fricción. Con el mismo caudal y la misma ' +
          'tubería (mismo diámetro y mismo factor de fricción), ¿cuánto perderán 130 m? (Resultado en mca.)',
        formula: 'h_f = 8 f L Q² / (π² g D⁵)  →  h_f proporcional a L',
        pasos: [{ descripcion: '1,9 mca × 130 / 40', operacion: '1.9 × 130 / 40', resultado: 6.175, unidad: 'mca' }],
        resultado: 6.175,
        unidad: 'mca',
        tolerancia: 0.01,
        explicacion:
          'En la fórmula de Darcy-Weisbach, con f, Q y D iguales, las pérdidas continuas son proporcionales a la longitud: ' +
          '1,9 × 130/40 = 6,175 mca.',
        ...upv('4. Cálculo de pérdidas por fricción: fórmula de Darcy-Weisbach', 5),
      },
      {
        id: 't9-bernoulli-perdidas-01-p6',
        tipo: 'test',
        enunciado:
          'En una misma tubería (misma longitud y mismo diámetro), si el caudal se duplica y se supone el mismo factor de ' +
          'fricción, las pérdidas continuas…',
        opciones: ['se duplican', 'se multiplican por 4', 'se multiplican por 8', 'no cambian'],
        correcta: 1,
        explicacion: 'Según Darcy-Weisbach, h_f = 8fLQ²/(π²gD⁵): con f constante son proporcionales a Q²; con el doble de caudal, 2² = 4 veces más.',
        ...upv('4. Cálculo de pérdidas por fricción: fórmula de Darcy-Weisbach', 5),
      },
      {
        id: 't9-bernoulli-perdidas-01-p7',
        tipo: 'test',
        enunciado:
          'Con el mismo caudal, la misma longitud y el mismo factor de fricción, si se cambia un tramo por otro del doble de ' +
          'diámetro interior, las pérdidas continuas…',
        opciones: ['se dividen entre 2', 'se dividen entre 4', 'se dividen entre 16', 'se dividen entre 32'],
        correcta: 3,
        explicacion: 'En h_f = 8fLQ²/(π²gD⁵) el diámetro está elevado a la quinta en el denominador: con el doble de diámetro, 2⁵ = 32 veces menos.',
        ...upv('4. Cálculo de pérdidas por fricción: fórmula de Darcy-Weisbach', 5),
      },
    ],
  },

  // 5 ─ Descarga por un orificio (Torricelli, deducido de Bernoulli), reacción del chorro y chorro vertical
  {
    id: 'supuesto-t9-descarga-chorro-01',
    titulo: 'Fuga en una cuba de riego y prueba de alcance vertical de una lanza',
    temas: [9],
    autoria: 'original',
    fuentes: ['OpenStax, Física universitaria vol. 1, apdos. 3.5, 9.2 y 14.6'],
    enunciado:
      'Una cuba de riego abierta por arriba, aparcada junto a una nave, pierde agua por un pequeño agujero lateral de ' +
      '0,0008 m² de sección. El chorro sale horizontal a 6 m/s. Más tarde, en el patio del parque, se prueba una lanza ' +
      'apuntada en vertical hacia arriba con el agua saliendo a 17 m/s. Toma g = 9,81 m/s² y 1000 kg/m³ como densidad ' +
      'del agua; desprecia el rozamiento del aire y las pérdidas en el agujero, y supón que el agua de la cuba está ' +
      'prácticamente en reposo.',
    preguntas: [
      {
        id: 't9-descarga-chorro-01-p1',
        tipo: 'test',
        enunciado: 'En el caso ideal, ¿de qué depende la velocidad de salida del agua por el agujero de la cuba?',
        opciones: [
          'Del tamaño del agujero',
          'De la altura de la superficie libre del agua sobre el agujero',
          'Del volumen total de agua de la cuba',
          'De la forma de la cuba',
        ],
        correcta: 1,
        explicacion:
          'Aplicando Bernoulli entre la superficie libre y el agujero (las dos a presión atmosférica y con el agua de la cuba ' +
          'casi en reposo): ρ·g·h = ½·ρ·v², luego v² = 2·g·h (teorema de Torricelli). Solo depende de la altura h.',
        ...openstax('14.6', '14-6-ecuacion-de-bernoulli', '«Ecuación de Bernoulli», ecuación 14.16'),
      },
      {
        id: 't9-descarga-chorro-01-p2',
        tipo: 'calculo',
        enunciado: '¿A qué altura sobre el agujero está la superficie del agua de la cuba? (Resultado en m.)',
        formula: 'ρ g h = ½ ρ v²  →  h = v² / (2 g)',
        pasos: [
          { descripcion: 'v² = 6 × 6', operacion: '6 × 6', resultado: 36, unidad: 'm²/s²' },
          { descripcion: '2 g', operacion: '2 × 9.81', resultado: 19.62, unidad: 'm/s²' },
          { descripcion: 'h = 36 / 19,62', operacion: '36 / 19.62', resultado: 1.8348623853211008, unidad: 'm' },
        ],
        resultado: 1.8348623853211008,
        unidad: 'm',
        tolerancia: 0.01,
        explicacion:
          'De Bernoulli con p₁ = p₂ (atmosférica) y v₁ ≈ 0: h = v²/(2g) = 36 / 19,62 ≈ 1,83 m de agua sobre el agujero.',
        ...openstax('14.6', '14-6-ecuacion-de-bernoulli', '«Ecuación de Bernoulli», ecuación 14.16'),
      },
      {
        id: 't9-descarga-chorro-01-p3',
        tipo: 'calculo',
        enunciado: '¿Qué fuerza de reacción horizontal ejerce el chorro sobre la cuba? (Resultado en N.)',
        formula: 'F = dp/dt = (ρ · Q) · v, con Q = A · v',
        pasos: [
          { descripcion: 'Caudal Q = A · v', operacion: '0.0008 × 6', resultado: 0.0048, unidad: 'm³/s' },
          { descripcion: 'Masa que sale por segundo ρ · Q', operacion: '1000 × 0.0048', resultado: 4.8, unidad: 'kg/s' },
          { descripcion: 'F = 4,8 kg/s × 6 m/s', operacion: '4.8 × 6', resultado: 28.8, unidad: 'N' },
        ],
        resultado: 28.8,
        unidad: 'N',
        tolerancia: 0.1,
        explicacion:
          'La fuerza es igual a la variación del momento lineal por unidad de tiempo (F = dp/dt, con p = m·v). Cada segundo ' +
          'salen 4,8 kg de agua que pasan del reposo a 6 m/s: F = 4,8 × 6 = 28,8 N, en sentido contrario al chorro.',
        ...openstax('9.2', '9-2-impulso-y-colisiones', '«Momento y fuerza», ecuación 9.9 (F = dp/dt)'),
      },
      {
        id: 't9-descarga-chorro-01-p4',
        tipo: 'calculo',
        enunciado: '¿Qué altura máxima teórica alcanza el chorro de la lanza vertical? (Resultado en m.)',
        formula: 'v² = v₀² − 2 g (y − y₀); en el punto más alto v = 0  →  h = v₀² / (2 g)',
        pasos: [
          { descripcion: 'v₀² = 17 × 17', operacion: '17 × 17', resultado: 289, unidad: 'm²/s²' },
          { descripcion: 'h = 289 / (2 × 9,81)', operacion: '289 / (2 × 9.81)', resultado: 14.72986748216106, unidad: 'm' },
        ],
        resultado: 14.72986748216106,
        unidad: 'm',
        tolerancia: 0.05,
        explicacion:
          'Sin rozamiento, el agua sube como un cuerpo en caída libre lanzado hacia arriba. En el punto más alto v = 0, así ' +
          'que h = v₀²/(2g) = 289 / 19,62 ≈ 14,73 m. El rozamiento con el aire lo reduce en la práctica.',
        ...openstax('3.5', '3-5-caida-libre', '«Ecuaciones cinemáticas para objetos en caída libre», ecuación 3.17'),
      },
      {
        id: 't9-descarga-chorro-01-p5',
        tipo: 'test',
        enunciado: 'Para que el chorro vertical alcanzara en teoría el cuádruple de altura, la velocidad de salida tendría que…',
        opciones: ['multiplicarse por 2', 'multiplicarse por 4', 'multiplicarse por 16', 'multiplicarse por 1,41 (raíz de 2)'],
        correcta: 0,
        explicacion: 'Como h = v₀²/(2g), la altura es proporcional al cuadrado de la velocidad: para 4 veces la altura basta el doble de velocidad (2² = 4).',
        ...openstax('3.5', '3-5-caida-libre', '«Ecuaciones cinemáticas para objetos en caída libre», ecuación 3.17'),
      },
    ],
  },

  // 6 ─ Energía potencial y potencia de bombeo; potencia hidráulica y rendimiento; bombas en serie y en paralelo
  {
    id: 'supuesto-t9-bombeo-01',
    titulo: 'Llenado del depósito elevado de un parque y grupo de bombeo',
    temas: [9],
    autoria: 'original',
    fuentes: [
      'OpenStax, Física universitaria vol. 1, apdos. 7.4 y 8.1',
      'IDAE, Guía técnica de selección de equipos de transporte de fluidos (RITE)',
    ],
    enunciado:
      'El parque tiene un depósito elevado de 24 m³ que se llena desde un aljibe; el agua se sube hasta la entrada del ' +
      'depósito, 9 m por encima del nivel del aljibe (toma ese desnivel para toda el agua). ' +
      'Para el llenado se usa una bomba que comunica al agua una potencia útil de 2,5 kW. Aparte, el grupo de presión ' +
      'del edificio impulsa 18 l/s con una altura manométrica de 32 m c.a. y un rendimiento total del 64 %. Toma ' +
      'g = 9,81 m/s² y 1000 kg/m³ como densidad del agua.',
    preguntas: [
      {
        id: 't9-bombeo-01-p1',
        tipo: 'calculo',
        enunciado: '¿Qué energía potencial hay que comunicar a los 24 m³ de agua para subirlos esos 9 m? (Resultado en kJ.)',
        formula: 'ΔU = m · g · Δy',
        pasos: [
          { descripcion: 'Masa del agua m = ρ · V', operacion: '1000 × 24', resultado: 24000, unidad: 'kg' },
          { descripcion: 'ΔU = 24 000 kg × 9,81 m/s² × 9 m', operacion: '24000 × 9.81 × 9', resultado: 2118960, unidad: 'J' },
          { descripcion: 'Paso a kJ', operacion: '2118960 / 1000', resultado: 2118.96, unidad: 'kJ' },
        ],
        resultado: 2118.96,
        unidad: 'kJ',
        tolerancia: 1,
        explicacion: 'La energía potencial gravitatoria cerca de la superficie es U = m·g·y, así que subir 24 000 kg de agua 9 m supone ΔU = 24 000 × 9,81 × 9 = 2 118 960 J ≈ 2119 kJ.',
        ...openstax('8.1', '8-1-energia-potencial-de-un-sistema', '«Energía potencial gravitacional cerca de la superficie de la Tierra», ecuación 8.5'),
      },
      {
        id: 't9-bombeo-01-p2',
        tipo: 'calculo',
        enunciado:
          'Si toda la potencia útil de la bomba se emplea en subir el agua (sin pérdidas y despreciando la energía cinética), ' +
          '¿cuánto tarda el llenado? (Resultado en minutos.)',
        formula: 'P = ΔW / Δt  →  Δt = ΔW / P',
        pasos: [
          { descripcion: 'Δt = 2 118 960 J / 2500 W', operacion: '2118960 / 2500', resultado: 847.584, unidad: 's' },
          { descripcion: 'Paso a minutos', operacion: '847.584 / 60', resultado: 14.1264, unidad: 'min' },
        ],
        resultado: 14.1264,
        unidad: 'min',
        tolerancia: 0.05,
        explicacion:
          'La potencia media es el trabajo dividido entre el tiempo. El trabajo es la energía potencial ganada: ' +
          'Δt = 2 118 960 / 2500 = 847,584 s ≈ 14,13 min.',
        ...openstax('7.4', '7-4-potencia', '«Potencia», ecuación 7.10'),
      },
      {
        id: 't9-bombeo-01-p3',
        tipo: 'test',
        enunciado:
          'Si la misma bomba, con la misma potencia útil, tuviera que subir el mismo volumen de agua con el doble de desnivel, ' +
          'en las mismas condiciones ideales, el tiempo de llenado…',
        opciones: ['sería el mismo', 'se duplicaría', 'se multiplicaría por 4', 'se reduciría a la mitad'],
        correcta: 1,
        explicacion: 'La energía necesaria m·g·h es proporcional a la altura y Δt = ΔW/P: con el doble de altura y la misma potencia, el doble de tiempo.',
        ...openstax('7.4', '7-4-potencia', '«Potencia», ecuación 7.10'),
      },
      {
        id: 't9-bombeo-01-p4',
        tipo: 'calculo',
        enunciado: '¿Qué potencia hay que dar en el eje de la bomba del grupo de presión? (Resultado en kW.)',
        formula: 'P_f = ρ · g · Q · H_m;  η_t = P_f / P_eje  →  P_eje = P_f / η_t',
        pasos: [
          { descripcion: 'Caudal en m³/s', operacion: '18 / 1000', resultado: 0.018, unidad: 'm³/s' },
          { descripcion: 'Potencia útil P_f = 1000 × 9,81 × 0,018 × 32', operacion: '1000 × 9.81 × 0.018 × 32', resultado: 5650.56, unidad: 'W' },
          { descripcion: 'P_eje = P_f / 0,64', operacion: '5650.56 / 0.64', resultado: 8829, unidad: 'W' },
          { descripcion: 'Paso a kW', operacion: '8829 / 1000', resultado: 8.829, unidad: 'kW' },
        ],
        resultado: 8.829,
        unidad: 'kW',
        tolerancia: 0.01,
        explicacion:
          'La potencia mecánica útil que recibe el fluido es P_f = ρ·g·Q·H_m = 5650,56 W. El rendimiento total es el cociente ' +
          'entre esa potencia y la del eje, así que P_eje = 5650,56 / 0,64 = 8829 W ≈ 8,83 kW.',
        ...idae('2.2 Balance de energía mecánica y rendimientos en bombas', 14),
      },
      {
        id: 't9-bombeo-01-p5',
        tipo: 'test',
        enunciado:
          'Se acoplan en serie dos bombas iguales. Para un caudal en el que cada una da 30 m c.a., ¿qué altura manométrica da ' +
          'el conjunto según su curva característica?',
        opciones: ['30 m c.a.', '45 m c.a.', '60 m c.a.', '90 m c.a.'],
        correcta: 2,
        explicacion:
          'En el acoplamiento en serie el caudal es el mismo en las dos bombas y la curva del conjunto se forma sumando las ' +
          'alturas manométricas para un mismo caudal: 30 + 30 = 60 m c.a.',
        ...idae('4.2 Acoplamientos serie y paralelo, «Acoplamiento en serie»', 24),
      },
      {
        id: 't9-bombeo-01-p6',
        tipo: 'test',
        enunciado:
          'Si en cambio se unen en paralelo dos bombas idénticas cuyo punto nominal es Q* = 7 l/s a H* = 40 m c.a., ¿cuál es ' +
          'el punto nominal del conjunto?',
        opciones: ['7 l/s a 80 m c.a.', '14 l/s a 40 m c.a.', '14 l/s a 80 m c.a.', '7 l/s a 40 m c.a.'],
        correcta: 1,
        explicacion:
          'En paralelo las curvas se suman en caudal para cada altura manométrica: el punto nominal del conjunto de dos ' +
          'bombas idénticas es (2Q*, H*) = 14 l/s a 40 m c.a. El punto real de trabajo dependerá después de la curva del circuito.',
        ...idae('4.2 Acoplamientos serie y paralelo, «Acoplamiento en paralelo»', 25),
      },
    ],
  },

  // 7 ─ Poleas (fija, móvil, polipasto simple) y trabajo y potencia al izar una carga
  {
    id: 'supuesto-t22-poleas-01',
    titulo: 'Izado de material a una terraza con poleas',
    temas: [22],
    autoria: 'original',
    fuentes: [
      'Xunta de Galicia, recurso educativo «Pasear sin barreras», 3.3 Mecanismos para reducir la carga',
      'OpenStax, Física universitaria vol. 1, apdos. 7.4 y 8.1',
    ],
    enunciado:
      'Para subir material de excarcelación a la terraza de un bloque de viviendas, el equipo monta un sistema de izado. ' +
      'La carga, con su bolsa, tiene una masa de 64 kg y debe subir 8,5 m. Considera poleas y cuerdas ideales (sin ' +
      'rozamiento y de masa despreciable), la subida a velocidad constante y g = 9,81 m/s².',
    preguntas: [
      {
        id: 't22-poleas-01-p1',
        tipo: 'test',
        enunciado: 'Si se iza la carga con una sola polea fija anclada arriba, la fuerza que hay que hacer en la cuerda es…',
        opciones: [
          'igual al peso de la carga; la polea solo cambia la dirección de la fuerza',
          'la mitad del peso de la carga',
          'la cuarta parte del peso de la carga',
          'el doble del peso de la carga',
        ],
        correcta: 0,
        explicacion: 'La polea fija no reduce la fuerza necesaria (F = P): solo cambia la dirección en la que se tira, lo que resulta más cómodo.',
        ...xunta('«Polea fija»'),
      },
      {
        id: 't22-poleas-01-p2',
        tipo: 'calculo',
        enunciado:
          'Si la carga cuelga de una polea móvil, con un extremo de la cuerda anclado arriba, ¿qué fuerza hay que hacer en el ' +
          'otro extremo, tirando en vertical hacia arriba, para subirla? (Resultado en N.)',
        formula: 'P = m · g;  F = P / 2',
        pasos: [
          { descripcion: 'Peso de la carga P = m · g', operacion: '64 × 9.81', resultado: 627.84, unidad: 'N' },
          { descripcion: 'F = P / 2', operacion: '627.84 / 2', resultado: 313.92, unidad: 'N' },
        ],
        resultado: 313.92,
        unidad: 'N',
        tolerancia: 1,
        explicacion:
          'En la polea móvil la carga se reparte entre los dos ramales de la cuerda y cada uno soporta la mitad: ' +
          'F = 627,84 / 2 = 313,92 N.',
        ...xunta('«Polea móvil»'),
      },
      {
        id: 't22-poleas-01-p3',
        tipo: 'test',
        enunciado:
          'Se añade una polea fija arriba: la cuerda anclada pasa primero por la polea móvil de la carga y luego por la fija ' +
          '(polipasto sencillo). Respecto a la polea móvil sola…',
        opciones: [
          'la fuerza sigue siendo la mitad del peso, pero se tira hacia abajo, que es más cómodo',
          'la fuerza pasa a ser la cuarta parte del peso',
          'la fuerza vuelve a ser igual al peso',
          'la fuerza pasa a ser el doble del peso',
        ],
        correcta: 0,
        explicacion:
          'En el polipasto sencillo (una polea fija y una móvil) la polea móvil divide la fuerza entre dos y la fija solo ' +
          'cambia su dirección: F = P/2, tirando hacia abajo.',
        ...xunta('«Polipasto»'),
      },
      {
        id: 't22-poleas-01-p4',
        tipo: 'calculo',
        enunciado: '¿Qué trabajo hay que hacer sobre la carga para subirla los 8,5 m? (Resultado en J.)',
        formula: 'W = ΔU = m · g · Δy (a velocidad constante y sin rozamiento)',
        pasos: [{ descripcion: 'W = 64 kg × 9,81 m/s² × 8,5 m', operacion: '64 × 9.81 × 8.5', resultado: 5336.64, unidad: 'J' }],
        resultado: 5336.64,
        unidad: 'J',
        tolerancia: 1,
        explicacion:
          'Subiendo a velocidad constante la energía cinética no cambia, y el trabajo hecho sobre la carga es el aumento de su ' +
          'energía potencial gravitatoria: m·g·Δy = 64 × 9,81 × 8,5 = 5336,64 J.',
        ...openstax('8.1', '8-1-energia-potencial-de-un-sistema', '«Energía potencial gravitacional cerca de la superficie de la Tierra», ecuación 8.5'),
      },
      {
        id: 't22-poleas-01-p5',
        tipo: 'calculo',
        enunciado: 'Si la subida dura 40 s, ¿qué potencia media se comunica a la carga? (Resultado en W.)',
        formula: 'P = ΔW / Δt',
        pasos: [{ descripcion: 'P = 5336,64 J / 40 s', operacion: '5336.64 / 40', resultado: 133.416, unidad: 'W' }],
        resultado: 133.416,
        unidad: 'W',
        tolerancia: 0.5,
        explicacion: 'La potencia media es el trabajo dividido entre el tiempo empleado: 5336,64 / 40 ≈ 133,4 W.',
        ...openstax('7.4', '7-4-potencia', '«Potencia», ecuación 7.10'),
      },
      {
        id: 't22-poleas-01-p6',
        tipo: 'test',
        enunciado: 'Con poleas ideales, al usar la polea móvil en lugar de la fija, el trabajo total para subir la carga los 8,5 m…',
        opciones: [
          'es el mismo, m·g·h: la polea reduce la fuerza, no el trabajo',
          'se reduce a la mitad',
          'se reduce a la cuarta parte',
          'se duplica',
        ],
        correcta: 0,
        explicacion:
          'El trabajo sobre la carga es el aumento de su energía potencial, m·g·Δy, que solo depende de la altura subida y no ' +
          'del sistema de poleas. Sin rozamiento, la polea móvil reduce la fuerza a la mitad pero no el trabajo.',
        ...openstax('8.1', '8-1-energia-potencial-de-un-sistema', '«Energía potencial gravitacional cerca de la superficie de la Tierra», ecuación 8.5'),
      },
    ],
  },
];
