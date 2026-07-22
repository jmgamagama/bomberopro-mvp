const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const INPUT_JSON = path.join(__dirname, '../data/questions/questions.export.json');
const OUTPUT_CSV = path.join(__dirname, '../data/questions/import_ready.csv');
const VALIDATOR_SCRIPT = "C:\\Users\\visit\\OneDrive\\Desktop\\PREGUNTAS DE TEST BOMBEROS\\scripts\\validate_question_bank.js";

function mapDifficulty(dificultad) {
  if (dificultad === 'facil') return 'N1';
  if (dificultad === 'media') return 'N2';
  if (dificultad === 'dificil') return 'N3';
  return 'N1'; // Default
}

function mapCorrectLabel(index) {
  const labels = ['A', 'B', 'C', 'D'];
  return labels[index] || 'A';
}

function mapValidationStatus(estado_qa) {
  if (estado_qa === 'borrador_ia') return 'draft';
  if (estado_qa === 'validado_automatico') return 'needs_review'; // Always need human review for safety
  if (estado_qa === 'validado_humano') return 'validated';
  return 'draft';
}

function escapeCsv(str) {
  if (str == null) return '""';
  const stringified = String(str).replace(/"/g, '""');
  return `"${stringified}"`;
}

function transform() {
  console.log(`[1] Leyendo JSON de extracción: ${INPUT_JSON}`);
  if (!fs.existsSync(INPUT_JSON)) {
    console.error('No existe el archivo JSON. Ejecuta primero la extracción IA.');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(INPUT_JSON, 'utf8'));
  console.log(`[+] Encontradas ${data.length} preguntas en JSON.`);

  const headers = [
    'external_id', 'knowledge_unit_code', 'stem', 'option_a', 'option_b', 
    'option_c', 'option_d', 'correct_label', 'explanation', 'difficulty_level', 
    'cognitive_type', 'source_confidence', 'validation_status', 'visible_to_student'
  ];

  const csvRows = [headers.join(',')];

  data.forEach((q, i) => {
    // knowledge_unit_code requires mapping. We fallback to UNKNOWN for now.
    const row = [
      q.id || `gen-${i}`,
      `KU_${q.tema ? q.tema.substring(0,10).replace(/\s/g, '_').toUpperCase() : 'UNKNOWN'}`, // knowledge_unit_code
      q.pregunta,
      q.opciones[0] || '',
      q.opciones[1] || '',
      q.opciones[2] || '',
      q.opciones[3] || '',
      mapCorrectLabel(q.respuesta_correcta),
      q.explicacion || '',
      mapDifficulty(q.dificultad),
      'literal_memory', // cognitive_type default
      'unverified', // source_confidence default until reviewed
      mapValidationStatus(q.estado_qa),
      'false' // visible_to_student must be false until fully validated
    ];

    csvRows.push(row.map(escapeCsv).join(','));
  });

  fs.mkdirSync(path.dirname(OUTPUT_CSV), { recursive: true });
  fs.writeFileSync(OUTPUT_CSV, csvRows.join('\n'), 'utf8');
  console.log(`[2] Creado archivo CSV listo para validación: ${OUTPUT_CSV}`);

  console.log(`[3] Ejecutando Quality Trust Framework Validator...`);
  try {
    const stdout = execSync(`node "${VALIDATOR_SCRIPT}" "${OUTPUT_CSV}"`);
    console.log('\n--- RESULTADO VALIDACIÓN ---');
    console.log(stdout.toString());
    console.log('✅ Transformación y validación completada con éxito.');
  } catch (error) {
    console.error('\n❌ ERRORES DE VALIDACIÓN DETECTADOS:');
    if (error.stdout) console.log(error.stdout.toString());
    if (error.stderr) console.log(error.stderr.toString());
    process.exit(1);
  }
}

transform();
