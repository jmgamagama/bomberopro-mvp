/**
 * Contenido de los supuestos prácticos. ORIGINAL: casos escritos para BomberoPro.
 *
 * Cada dato y cada respuesta sale de una fuente oficial gratuita ya usada en las fichas
 * (mismas URL y mismo formato de cita). No se copia nada del CEP ni del material interno
 * del CPEI. Este módulo se carga con import() dinámico desde la pantalla de supuestos: no
 * entra en el chunk principal.
 */
import type { Supuesto } from './supuestosTypes';
import { SUPUESTOS_LOTE2 } from './supuestosLote2';

// ---------------------------------------------------------------------------
// Fuentes (idénticas a las de las fichas de recuerdo)
// ---------------------------------------------------------------------------

const DGT_URL =
  'https://www.dgt.es/export/sites/web-DGT/.galleries/downloads/muevete-con-seguridad/accidente-trafico/manual_basico_rescate.pdf';
const DGT_DESC =
  'Manual básico de rescate en accidentes de tráfico (Dirección General de Tráfico y APRAT, 2019; Procedimiento Unificado de Rescate en Accidentes de Tráfico); texto íntegro oficial (edición 2019, PDF publicado en dgt.es)';
function dgt(localizacion: string, pagina: number) {
  const loc = `Manual básico de rescate (DGT-APRAT), ${localizacion}, pág. ${pagina}`;
  return { localizacion: loc, fuente: `${loc}. ${DGT_DESC}: ${DGT_URL}#page=${pagina}` };
}

const DBSI_URL = 'https://www.codigotecnico.org/pdf/Documentos/SI/DBSI.pdf';
const DBSI_DESC =
  'DB SI del CTE (RD 314/2006, modificado por última vez por RD 164/2025); texto íntegro oficial (texto consolidado del Ministerio con modificaciones hasta RD 164/2025 (BOE 10/04/2025); PDF de 05/05/2025)';
function dbsi(apartado: string, pagina: number) {
  const loc = `CTE DB SI, SI 5, apdo. ${apartado}, pág. ${pagina}`;
  return { localizacion: loc, fuente: `${loc}. ${DBSI_DESC}: ${DBSI_URL}#page=${pagina}` };
}

const GUIA_EPI_URL =
  'https://www.insst.es/documents/94886/203536/Gu%C3%ADa+t%C3%A9cnica+para+la+utilizaci%C3%B3n+por+los+trabajadores+de+equipos+de+protecci%C3%B3n+individual.pdf';
const GUIA_EPI_DESC =
  'INSST, Guía técnica para la utilización por los trabajadores de equipos de protección individual (RD 773/1997), 2022; texto íntegro oficial (2022)';
function guiaEpi(apartado: string) {
  const loc = `Guía técnica de EPI (INSST), Apéndice 4.1, ${apartado}, pág. 49`;
  return { localizacion: loc, fuente: `${loc}. ${GUIA_EPI_DESC}: ${GUIA_EPI_URL}#page=49` };
}

const NTP787 = {
  localizacion: 'NTP 787 (INSST), 2. Aplicación de los filtros, pág. 1',
  fuente:
    'NTP 787 (INSST), 2. Aplicación de los filtros, pág. 1. INSST, NTP 787: Equipos de protección respiratoria: identificación de los filtros según sus tipos y clases (2008); texto íntegro oficial (2008): https://www.insst.es/documents/94886/7843381/787a.pdf#page=1',
};

const RIPCI_URL = 'https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2';
function ripci(apartado: string) {
  const loc = `RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, ${apartado}`;
  return {
    localizacion: loc,
    fuente: `${loc}. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): ${RIPCI_URL}`,
  };
}

// ---------------------------------------------------------------------------
// Supuestos
// ---------------------------------------------------------------------------

/** Lote 1: casos sobre normativa (DGT, CTE DB SI, RIPCI), con fuentes ya usadas en las fichas. */
export const SUPUESTOS_LOTE1: readonly Supuesto[] = [
  {
    id: 'supuesto-t21-ve-01',
    titulo: 'Colisión de un turismo eléctrico en una travesía',
    temas: [21],
    autoria: 'original',
    fuentes: ['Manual básico de rescate en accidentes de tráfico (DGT-APRAT, 2019), Anexo I'],
    enunciado:
      'Os activan de madrugada por una salida de vía en la travesía de un pueblo. Al llegar, un turismo ha ' +
      'chocado de frente contra la tapia de una nave. No tiene tubo de escape y el portón lleva el logotipo ' +
      'de vehículo eléctrico. La conductora está consciente, con las piernas atrapadas bajo el salpicadero. ' +
      'El coche no hace ningún ruido, pero el cuadro sigue encendido; la llave de proximidad está en un bolso ' +
      'sobre el asiento del acompañante. No hay humo ni llamas. Bajo el umbral de la puerta del conductor ' +
      'asoma un cable de color naranja con el recubrimiento rozado.',
    preguntas: [
      {
        id: 't21-ve-01-p1',
        tipo: 'test',
        enunciado:
          'Una vez asegurada la zona de intervención, ¿qué secuencia de pasos propone el manual de la DGT para conseguir un «vehículo seguro»?',
        opciones: [
          'Proteger, avisar y socorrer',
          'Identificación, Reconocimiento, Prohibición, Inmovilización y Aislamiento (IRPIA)',
          'Estabilización, creación de espacios y extracción',
          'Inspección, Rescate, Protección, Intervención y Asistencia',
        ],
        correcta: 1,
        explicacion:
          'Primero «zona segura» y después «vehículo seguro», siguiendo la secuencia IRPIA: Identificación, Reconocimiento, Prohibición, Inmovilización y Aislamiento.',
        ...dgt('Anexo I, 3.1 Medidas iniciales', 155),
      },
      {
        id: 't21-ve-01-p2',
        tipo: 'test',
        enunciado: 'El turismo está en silencio. ¿Qué advierte el manual sobre los VE y VH?',
        opciones: [
          'Que si no se oye el motor, el sistema de alto voltaje está desconectado',
          'Que basta con quitar el contacto para aislar todas las fuentes de energía',
          'Que aunque el motor no suene, puede estar encendido',
          'Que solo los híbridos pueden quedar encendidos sin ruido',
        ],
        correcta: 2,
        explicacion:
          'El manual lo destaca como aclaración: en un VE o un VH, aunque el motor no suene, puede estar encendido. Además, desconectar el encendido no garantiza el aislamiento total de las fuentes AV.',
        ...dgt('Anexo I, 3.1 Aclaraciones', 156),
      },
      {
        id: 't21-ve-01-p3',
        tipo: 'test',
        enunciado:
          '¿A qué distancia mínima hay que alejar la llave inteligente (control remoto) para garantizar la desconexión del encendido?',
        opciones: ['Al menos 1 metro', 'Al menos 2 metros', 'Al menos 5 metros', 'Al menos 50 metros'],
        correcta: 2,
        explicacion:
          'Las llaves con sistema inteligente deben alejarse al menos 5 metros para garantizar la desconexión del encendido. Aquí, el bolso con la llave se saca del vehículo y se aleja esa distancia.',
        ...dgt('Anexo I, 3.1 Aclaraciones', 156),
      },
      {
        id: 't21-ve-01-p4',
        tipo: 'test',
        enunciado:
          'Hay que acceder cuanto antes a la conductora atrapada. Dentro del aislamiento (A de IRPIA), ¿en qué consiste la fase rápida?',
        opciones: [
          'En la desconexión de la batería auxiliar de 12/24 V',
          'En el accionamiento del interruptor de alto voltaje (Plug Service)',
          'En el cierre manual de los depósitos',
          'En cortar el cable naranja más accesible',
        ],
        correcta: 0,
        explicacion:
          'La fase rápida es la desconexión de la batería auxiliar 12/24 V: aísla rápidamente las fuentes AV/gas (relés y electroválvulas) y permite intervenir con un alto porcentaje de seguridad, por ejemplo para un acceso urgente a ocupantes atrapados.',
        ...dgt('Anexo I, 3.1 Medidas iniciales', 155),
      },
      {
        id: 't21-ve-01-p5',
        tipo: 'test',
        enunciado: 'El cable que asoma bajo el umbral es de color naranja. ¿Qué indica ese color?',
        opciones: [
          'Que es un cable del circuito de 12/24 V',
          'Que es un cable de alto voltaje, diferenciado del circuito de baja tensión',
          'Que es la toma de carga externa',
          'Que es un conducto de gas',
        ],
        correcta: 1,
        explicacion:
          'Los cables de alto voltaje se identifican por una protección de color naranja normalizado para diferenciarlos de los de baja tensión 12/24 V; su tensión puede alcanzar los 750 V.',
        ...dgt('Anexo I, 1.2 Cables de alimentación', 140),
      },
      {
        id: 't21-ve-01-p6',
        tipo: 'test',
        enunciado: 'Al estabilizar el turismo, ¿con qué no deben coincidir los puntos de apoyo?',
        opciones: [
          'Con los neumáticos',
          'Con los pilares de las puertas',
          'Con los componentes de alto voltaje (cables naranja, batería AV…) o de gas',
          'Con los largueros del chasis',
        ],
        correcta: 2,
        explicacion:
          'En accidentes con estos vehículos, los puntos de apoyo de la estabilización no deben coincidir con componentes eléctricos de AV (cables naranja, batería AV…) o de gas (depósitos, tuberías…).',
        ...dgt('Anexo I, 3.3 Accidente', 159),
      },
      {
        id: 't21-ve-01-p7',
        tipo: 'test',
        enunciado:
          'Si después se acciona el interruptor de alto voltaje (Plug Service), ¿qué riesgo señala el manual y exige EPI adecuado?',
        opciones: [
          'Una fuga de electrolito inmediata',
          'Que se produzca un arco eléctrico',
          'Que el vehículo arranque solo',
          'Que se active el airbag del conductor',
        ],
        correcta: 1,
        explicacion:
          'El manual avisa: con EPI adecuado, porque en VE o VH, al accionar el interruptor AV (Plug Service), puede producirse un arco eléctrico.',
        ...dgt('Anexo I, 3.1 Aclaraciones', 156),
      },
    ],
  },
  {
    id: 'supuesto-t32-vivienda-01',
    titulo: 'Humo en la escalera de un edificio de viviendas',
    temas: [32, 13],
    autoria: 'original',
    fuentes: [
      'CTE DB SI, SI 5 Intervención de los bomberos (codigotecnico.org)',
      'INSST: Guía técnica de EPI (2022) y NTP 787',
    ],
    enunciado:
      'Aviso por humo en la caja de escalera de un bloque de viviendas de cinco plantas, con una altura de ' +
      'evacuación descendente de 13 m. Se llega por una calle con arbolado y coches aparcados a ambos lados. ' +
      'Un vecino que ha bajado a la calle dice que la escalera está llena de humo y que en la cuarta planta ' +
      'queda una persona mayor. El jefe de dotación ordena que un binomio suba por la escalera con protección ' +
      'respiratoria mientras se valora el emplazamiento de la autoescala frente a la fachada.',
    preguntas: [
      {
        id: 't32-viv-01-p1',
        tipo: 'test',
        enunciado:
          '¿Qué anchura mínima libre exige el DB SI a los viales de aproximación de los vehículos de bomberos?',
        opciones: ['3 m', '3,5 m', '4,5 m', '5 m'],
        correcta: 1,
        explicacion: 'Los viales de aproximación deben tener una anchura mínima libre de 3,5 m.',
        ...dbsi('1.1', 36),
      },
      {
        id: 't32-viv-01-p2',
        tipo: 'test',
        enunciado: '¿Y qué altura mínima libre o gálibo deben tener esos viales?',
        opciones: ['3,5 m', '4 m', '4,5 m', '5 m'],
        correcta: 2,
        explicacion: 'El DB SI fija para los viales de aproximación una altura mínima libre o gálibo de 4,5 m.',
        ...dbsi('1.1', 36),
      },
      {
        id: 't32-viv-01-p3',
        tipo: 'test',
        enunciado: '¿Debe disponer este edificio de un espacio de maniobra para los bomberos junto a la fachada?',
        opciones: [
          'No, solo se exige a edificios de más de 28 m',
          'Sí, porque su altura de evacuación descendente supera los 9 m',
          'No, solo se exige a edificios de uso no residencial',
          'Sí, pero solo si tiene columna seca',
        ],
        correcta: 1,
        explicacion:
          'El espacio de maniobra se exige a los edificios con una altura de evacuación descendente mayor que 9 m; este tiene 13 m.',
        ...dbsi('1.2', 36),
      },
      {
        id: 't32-viv-01-p4',
        tipo: 'test',
        enunciado:
          'Para este edificio (altura de evacuación hasta 15 m), ¿cuál es la separación máxima del vehículo de bomberos a la fachada?',
        opciones: ['10 m', '18 m', '23 m', '30 m'],
        correcta: 2,
        explicacion:
          'La separación máxima del vehículo a la fachada es de 23 m si la altura de evacuación del edificio es igual o menor que 15 m (18 m entre 15 y 20 m, y 10 m por encima de 20 m).',
        ...dbsi('1.2', 36),
      },
      {
        id: 't32-viv-01-p5',
        tipo: 'test',
        enunciado:
          'El espacio de maniobra frente a la fachada tiene árboles y mobiliario urbano. ¿Qué dice el DB SI?',
        opciones: [
          'Que puede tener arbolado si las copas están por encima de 4,5 m',
          'Que debe mantenerse libre de mobiliario urbano, arbolado, jardines, mojones u otros obstáculos',
          'Que solo debe quedar libre de vehículos aparcados',
          'Que los obstáculos se permiten si hay columna seca',
        ],
        correcta: 1,
        explicacion:
          'El espacio de maniobra debe mantenerse libre de mobiliario urbano, arbolado, jardines, mojones u otros obstáculos; y si se prevé acceso con escaleras o plataformas, se evitarán cables aéreos o ramas que interfieran.',
        ...dbsi('1.2', 37),
      },
      {
        id: 't32-viv-01-p6',
        tipo: 'test',
        enunciado:
          'La escalera está llena de humo y puede faltar oxígeno. Según el INSST, ¿qué tipo de equipo de protección respiratoria debe evitarse?',
        opciones: [
          'El equipo autónomo de circuito abierto',
          'El equipo aislante de aire comprimido',
          'El equipo filtrante',
          'Ninguno: todos son válidos con humo',
        ],
        correcta: 2,
        explicacion:
          'La Guía técnica de EPI indica que se debe evitar el uso de equipos filtrantes en atmósferas con posible deficiencia de oxígeno si no se garantiza aire respirable suficiente. Por eso el binomio sube con equipos aislantes autónomos.',
        ...guiaEpi('selección y uso'),
      },
      {
        id: 't32-viv-01-p7',
        tipo: 'test',
        enunciado: 'Según la NTP 787, ¿qué contenido mínimo de oxígeno debe tener el ambiente para usar equipos filtrantes?',
        opciones: ['Un 12 % en volumen', 'Un 15 % en volumen', 'Un 17 % en volumen', 'Un 21 % en volumen'],
        correcta: 2,
        explicacion: 'Los equipos filtrantes exigen un ambiente con, como mínimo, un 17 % en volumen de oxígeno.',
        ...NTP787,
      },
      {
        id: 't32-viv-01-p8',
        tipo: 'test',
        enunciado: '¿De dónde procede el aire que respira el binomio con un equipo autónomo?',
        opciones: [
          'Del ambiente, purificado por un filtro',
          'De una botella a presión portada por el propio usuario',
          'De una manguera conectada a una unidad móvil de aire',
          'De un compresor situado en la calle',
        ],
        correcta: 1,
        explicacion:
          'Los equipos aislantes suministran aire de una fuente no contaminada; en los autónomos, esa fuente es una botella a presión portada por el mismo usuario del equipo.',
        ...guiaEpi('tipos de EPR'),
      },
      {
        id: 't32-viv-01-p9',
        tipo: 'test',
        enunciado:
          'Uno de los bomberos lleva barba de varios días. Según el INSST, ¿qué puede afectar a la hermeticidad de la máscara con la cara?',
        opciones: [
          'La presencia de vello facial, cicatrices, etc.',
          'Solo el tamaño de la máscara',
          'La temperatura del humo',
          'La presión de la botella',
        ],
        correcta: 0,
        explicacion:
          'En los equipos que basan su eficacia en la hermeticidad con la cara, esta puede verse afectada por la presencia de vello facial, cicatrices, etc.',
        ...guiaEpi('selección y uso'),
      },
    ],
  },
  {
    id: 'supuesto-t33-agua-01',
    titulo: 'BIE e hidrante de una nave en un polígono urbano',
    temas: [33],
    autoria: 'original',
    fuentes: ['RD 513/2017, RIPCI, anexo I, sección 1.ª, apartados 2, 3 y 5 (BOE-A-2017-6606)'],
    enunciado:
      'En una visita de reconocimiento a una nave de almacén de un polígono dentro del casco urbano, revisáis ' +
      'sus medios de protección. La nave tiene una red de BIE con manguera plana de 45 mm y 20 m de longitud. ' +
      'Junto a la entrada hay un hidrante de columna cuyo único uso previsto es el llenado de camiones; se ' +
      'alimenta de un depósito propio. Trabajad con los valores mínimos del reglamento.',
    preguntas: [
      {
        id: 't33-agua-01-p1',
        tipo: 'calculo',
        enunciado: '¿Cuál es el radio de acción de cada BIE de esta nave?',
        formula: 'Radio de acción = longitud de la manguera + 5 m',
        pasos: [{ descripcion: 'Longitud de la manguera más 5 m', operacion: '20 + 5', resultado: 25, unidad: 'm' }],
        resultado: 25,
        unidad: 'm',
        tolerancia: 0,
        explicacion:
          'El RIPCI considera como radio de acción de una BIE la longitud de su manguera incrementada en 5 m, medido siguiendo recorridos de evacuación. Con 20 m de manguera plana (el máximo para este tipo), el radio es 25 m.',
        ...ripci('5.3'),
      },
      {
        id: 't33-agua-01-p2',
        tipo: 'test',
        enunciado: '¿Cuál es la separación máxima entre cada BIE y la más cercana?',
        opciones: ['25 m', '30 m', '40 m', '50 m'],
        correcta: 3,
        explicacion:
          'Para BIE con manguera semirrígida o plana, la separación máxima entre cada BIE y su más cercana es de 50 m, medida siguiendo recorridos de evacuación.',
        ...ripci('5.3'),
      },
      {
        id: 't33-agua-01-p3',
        tipo: 'test',
        enunciado: '¿A qué distancia máxima de cada salida de sector de incendio debe haber siempre una BIE?',
        opciones: ['5 m', '10 m', '15 m', '25 m'],
        correcta: 0,
        explicacion:
          'Se situará siempre una BIE a una distancia máxima de 5 m de cada salida de sector de incendio, medida sobre un recorrido de evacuación (salvo las excepciones del propio apartado).',
        ...ripci('5.3'),
      },
      {
        id: 't33-agua-01-p4',
        tipo: 'test',
        enunciado:
          '¿Qué presión mínima debe haber a la entrada de una BIE de manguera plana (45 mm, K=85) para dar su caudal mínimo?',
        opciones: ['2 bar', '3,5 bar', '4 bar', '9 bar'],
        correcta: 1,
        explicacion:
          'La BIE de manguera plana debe dar un caudal mínimo de 160 l/min, lo que con K=85 implica una presión mínima a la entrada de 3,5 bar (350 kPa). La de 25 mm (K=42) necesita 4 bar para 85 l/min, y ninguna debe superar 9 bar.',
        ...ripci('5.4'),
      },
      {
        id: 't33-agua-01-p5',
        tipo: 'calculo',
        enunciado:
          '¿Qué volumen mínimo de agua debe asegurar la red de BIE para cumplir el reglamento? (Resultado en litros.)',
        formula:
          'Volumen = n.º de BIE simultáneas (las 2 hidráulicamente más desfavorables) × caudal mínimo de cada BIE × tiempo mínimo',
        pasos: [
          {
            descripcion: 'Caudal de las dos BIE más desfavorables (160 l/min cada una)',
            operacion: '2 × 160',
            resultado: 320,
            unidad: 'l/min',
          },
          { descripcion: 'Durante una hora como mínimo (60 min)', operacion: '320 × 60', resultado: 19200, unidad: 'l' },
        ],
        resultado: 19200,
        unidad: 'l',
        tolerancia: 0,
        explicacion:
          'La red debe asegurar durante una hora como mínimo el caudal descargado por las dos BIE hidráulicamente más desfavorables, y cada BIE de 45 mm debe dar al menos 160 l/min: 2 × 160 l/min × 60 min = 19.200 l. El abastecimiento existe para asegurar ese caudal durante el tiempo de autonomía requerido (apartado 2).',
        ...ripci('5.4 y 2'),
      },
      {
        id: 't33-agua-01-p6',
        tipo: 'test',
        enunciado:
          'En zona urbana, ¿qué distancia de recorrido real, medida horizontalmente, debe haber como máximo hasta cualquier hidrante?',
        opciones: ['Inferior a 40 m', 'Inferior a 50 m', 'Inferior a 100 m', 'Inferior a 200 m'],
        correcta: 2,
        explicacion:
          'Para considerar una zona protegida por hidrantes, la distancia de recorrido real a cualquier hidrante debe ser inferior a 100 m en zonas urbanas y a 40 m en el resto.',
        ...ripci('3.3'),
      },
      {
        id: 't33-agua-01-p7',
        tipo: 'test',
        enunciado:
          'Como este hidrante urbano solo se usa para llenar camiones, ¿qué presión mínima se le exige en la boca de salida?',
        opciones: ['100 kPa (1 kg/cm²)', '350 kPa (3,5 kg/cm²)', '500 kPa (5 kg/cm²)', '900 kPa (9 kg/cm²)'],
        correcta: 0,
        explicacion:
          'En zonas urbanas, si el único uso previsto es el llenado de camiones, la presión mínima en la boca de salida es 100 kPa (1 kg/cm²). En el resto de zonas se exigen 500 kPa para la impulsión directa sobre el incendio.',
        ...ripci('3.3'),
      },
      {
        id: 't33-agua-01-p8',
        tipo: 'calculo',
        enunciado:
          'Si se usa una sola boca del hidrante, ¿qué capacidad mínima debe tener su depósito? (Resultado en litros.)',
        formula: 'Capacidad = caudal mínimo por boca × autonomía mínima',
        pasos: [
          {
            descripcion: '500 l/min por boca durante una autonomía de 60 min',
            operacion: '500 × 60',
            resultado: 30000,
            unidad: 'l',
          },
        ],
        resultado: 30000,
        unidad: 'l',
        tolerancia: 0,
        explicacion:
          'Cada boca debe dar un caudal ininterrumpido mínimo de 500 l/min y, si el hidrante de llenado se alimenta de depósitos, estos se dimensionan para una autonomía de, al menos, 60 minutos: 500 l/min × 60 min = 30.000 l.',
        ...ripci('3.3 y 3.4'),
      },
    ],
  },
];

/** Todos los supuestos de la app: lote 1 (normativa) y lote 2 (cálculo hidráulico y física, supuestosLote2.ts). */
export const SUPUESTOS: readonly Supuesto[] = [...SUPUESTOS_LOTE1, ...SUPUESTOS_LOTE2];
