import { createClient } from '@supabase/supabase-js';
import { validateJSON, PipelineQuestion } from './validate-questions';
import path from 'path';

// Determinar el cliente de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Error: Faltan las variables de entorno de Supabase.");
  console.error("Asegúrate de ejecutar el script con --env-file=.env o exportando VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Reglas de mapeo (Pipeline -> App Schema)
const MAP_DIFICULTAD = {
  'facil': 'N1',
  'media': 'N2',
  'dificil': 'N3'
};

const MAP_ESTADO = {
  'borrador_ia': 'borrador',
  'validado_automatico': 'revision',
  'validado_humano': 'aprobada'
};

// Extrae el número y título del tema. Ej: "Tema 1: La Constitución Española" -> { numero: 1, titulo: "La Constitución Española" }
function parseTema(temaStr: string) {
  const match = temaStr.match(/Tema\s+(\d+)\s*[:\-]\s*(.+)/i);
  if (match) {
    return {
      numero: parseInt(match[1], 10),
      titulo: match[2].trim()
    };
  }
  return {
    numero: 0,
    titulo: temaStr
  };
}

export function transformQuestion(pq: PipelineQuestion) {
  return {
    id: pq.id,
    pregunta: pq.pregunta,
    opciones: pq.opciones,
    respuesta_correcta: pq.opciones[pq.respuesta_correcta], // El pipeline usa índice, el frontend espera el texto o el índice?
    // Wait, in src/types.ts, correct_answer is string!
    // "correct_answer: string"
    // So we must map index to the actual string option
    explicacion: pq.explicacion,
    nivel: pq.dificultad === 'facil' ? 1 : pq.dificultad === 'media' ? 2 : 3, // Numeric DB column
    level: MAP_DIFICULTAD[pq.dificultad], // String UI type
    microconcept_id: `MC-${pq.id}`, // Generado si no viene
    type: 'test_literal', // Por defecto para pipeline V1
    fuente: pq.fuente,
    version_convocatoria: pq.version_convocatoria,
    estado_qa: MAP_ESTADO[pq.estado_qa],
    reportes: pq.reportes,
    tema: parseTema(pq.tema)
  };
}

async function importData(filePath: string) {
  console.log(`Leyendo e importando datos desde ${filePath}...`);
  const result = validateJSON(filePath);
  
  if (!result.valid || !result.data) {
    console.error(`❌ Validación fallida. Repare el JSON exportado antes de importar:`);
    result.errors.forEach(e => console.error(`  - ${e}`));
    process.exit(1);
  }

  console.log(`✅ JSON validado. Transformando ${result.data.length} preguntas...`);
  const dbRecords = result.data.map(q => {
    const t = transformQuestion(q);
    // Supabase DB insert format:
    return {
      id: t.id,
      microconcept_id: t.microconcept_id,
      pregunta: t.pregunta,
      opciones: t.opciones, // Cliente Supabase lo serializa como jsonb automáticamente
      respuesta_correcta: t.respuesta_correcta,
      explicacion: t.explicacion,
      nivel: t.nivel,
      fuente: t.fuente,
      version_convocatoria: t.version_convocatoria,
      estado_qa: t.estado_qa,
      reportes: t.reportes,
      tema: t.tema // Cliente Supabase lo serializa como jsonb automáticamente
    };
  });

  console.log("Subiendo a Supabase...");
  
  const { data, error } = await supabase
    .from('questions')
    .upsert(dbRecords, { onConflict: 'id' });

  if (error) {
    console.error("❌ Error importando a Supabase:", error.message, error.details, error.hint);
    process.exit(1);
  }

  console.log(`🚀 Importación completada con éxito. Procesadas ${dbRecords.length} preguntas.`);
}

import { fileURLToPath } from 'url';

// Permitir ejecución desde CLI
const isMain = typeof process !== 'undefined' && process.argv && process.argv[1] && import.meta.url && process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Uso: node --env-file=.env --experimental-strip-types scripts/import-questions.ts <ruta-al-json>");
    process.exit(1);
  }
  
  importData(filePath);
}
