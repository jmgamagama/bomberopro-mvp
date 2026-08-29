import fs from 'fs';
import path from 'path';

export interface PipelineQuestion {
  id: string;
  pregunta: string;
  opciones: string[];
  respuesta_correcta: number;
  explicacion: string;
  tema: string;
  dificultad: 'facil' | 'media' | 'dificil';
  fuente: string;
  version_convocatoria: string;
  estado_qa: 'borrador_ia' | 'validado_automatico' | 'validado_humano';
  reportes: string[];
}

export function validateQuestion(q: any, index: number): string[] {
  const errors: string[] = [];
  const prefix = `Pregunta en índice ${index} (ID: ${q.id || 'desconocido'}):`;

  if (!q.id || typeof q.id !== 'string') errors.push(`${prefix} Faltan o formato inválido para 'id'`);
  if (!q.pregunta || typeof q.pregunta !== 'string') errors.push(`${prefix} Faltan o formato inválido para 'pregunta'`);
  
  if (!Array.isArray(q.opciones) || q.opciones.length !== 4) {
    errors.push(`${prefix} 'opciones' debe ser un array de exactamente 4 strings`);
  } else {
    if (q.opciones.some((opt: any) => typeof opt !== 'string')) {
      errors.push(`${prefix} Todos los elementos de 'opciones' deben ser strings`);
    }
  }

  if (typeof q.respuesta_correcta !== 'number' || q.respuesta_correcta < 0 || q.respuesta_correcta > 3) {
    errors.push(`${prefix} 'respuesta_correcta' debe ser un índice numérico entre 0 y 3`);
  }

  if (typeof q.explicacion !== 'string') errors.push(`${prefix} Faltan o formato inválido para 'explicacion'`);
  if (typeof q.tema !== 'string') errors.push(`${prefix} Faltan o formato inválido para 'tema'`);
  
  if (!['facil', 'media', 'dificil'].includes(q.dificultad)) {
    errors.push(`${prefix} 'dificultad' inválida. Debe ser facil, media o dificil`);
  }

  if (typeof q.fuente !== 'string') errors.push(`${prefix} Faltan o formato inválido para 'fuente'`);
  if (typeof q.version_convocatoria !== 'string') errors.push(`${prefix} Faltan o formato inválido para 'version_convocatoria'`);

  if (!['borrador_ia', 'validado_automatico', 'validado_humano'].includes(q.estado_qa)) {
    errors.push(`${prefix} 'estado_qa' inválido. Debe ser borrador_ia, validado_automatico o validado_humano`);
  }

  if (!Array.isArray(q.reportes)) {
    errors.push(`${prefix} 'reportes' debe ser un array`);
  }

  return errors;
}

export function validateJSON(filePath: string): { valid: boolean; errors: string[]; data: PipelineQuestion[] | null } {
  try {
    const content = fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf-8');
    const data = JSON.parse(content);

    if (!Array.isArray(data)) {
      return { valid: false, errors: ['El archivo raíz debe ser un array de objetos'], data: null };
    }

    const allErrors: string[] = [];
    data.forEach((item, index) => {
      const errors = validateQuestion(item, index);
      allErrors.push(...errors);
    });

    if (allErrors.length > 0) {
      return { valid: false, errors: allErrors, data: null };
    }

    return { valid: true, errors: [], data: data as PipelineQuestion[] };
  } catch (error: any) {
    return { valid: false, errors: [`Error parseando el archivo JSON: ${error.message}`], data: null };
  }
}

import { fileURLToPath } from 'url';

// Permitir su uso como script de consola standalone
const isMain = typeof process !== 'undefined' && process.argv && process.argv[1] && import.meta.url && process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Uso: node --experimental-strip-types scripts/validate-questions.ts <ruta-al-json>");
    process.exit(1);
  }

  console.log(`Validando ${filePath}...`);
  const result = validateJSON(filePath);
  
  if (result.valid) {
    console.log(`✅ JSON válido. Contiene ${result.data?.length} preguntas listas para importación.`);
    process.exit(0);
  } else {
    console.error(`❌ Validación fallida con ${result.errors.length} errores:`);
    result.errors.forEach(e => console.error(`  - ${e}`));
    process.exit(1);
  }
}
