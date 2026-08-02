import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateQuestion, PipelineQuestion } from './validate-questions';
import { transformQuestion } from './import-questions';

describe('validateQuestion', () => {
  const validQuestion: PipelineQuestion = {
    id: "TEST-001",
    pregunta: "¿Test?",
    opciones: ["A", "B", "C", "D"],
    respuesta_correcta: 0,
    explicacion: "Porque A",
    tema: "Tema 1: Intro",
    dificultad: "media",
    fuente: "Libro",
    version_convocatoria: "2026-v1",
    estado_qa: "validado_humano",
    reportes: []
  };

  it('debe aceptar una pregunta válida', () => {
    const errors = validateQuestion(validQuestion, 0);
    expect(errors).toHaveLength(0);
  });

  it('debe rechazar opciones menores a 4', () => {
    const q = { ...validQuestion, opciones: ["A", "B"] };
    const errors = validateQuestion(q, 0);
    expect(errors).toContain("Pregunta en índice 0 (ID: TEST-001): 'opciones' debe ser un array de exactamente 4 strings");
  });

  it('debe rechazar dificultad inválida', () => {
    const q = { ...validQuestion, dificultad: "imposible" as any };
    const errors = validateQuestion(q, 0);
    expect(errors).toContain("Pregunta en índice 0 (ID: TEST-001): 'dificultad' inválida. Debe ser facil, media o dificil");
  });
});

describe('transformQuestion', () => {
  const input: PipelineQuestion = {
    id: "TEST-001",
    pregunta: "¿Test?",
    opciones: ["A", "B", "C", "D"],
    respuesta_correcta: 2,
    explicacion: "Porque C",
    tema: "Tema 38: Hidráulica",
    dificultad: "dificil",
    fuente: "Manual",
    version_convocatoria: "2026-v1",
    estado_qa: "borrador_ia",
    reportes: []
  };

  it('debe mapear correctamente la dificultad y el estado', () => {
    const output = transformQuestion(input);
    expect(output.nivel).toBe(3);
    expect(output.level).toBe('N3');
    expect(output.estado_qa).toBe('borrador');
    expect(output.microconcept_id).toBe('MC-TEST-001');
    expect(output.respuesta_correcta).toBe("C");
  });

  it('debe extraer el número de tema', () => {
    const output = transformQuestion(input);
    expect(output.tema.numero).toBe(38);
    expect(output.tema.titulo).toBe('Hidráulica');
  });

  it('debe fallar graciosamente si el tema no tiene número', () => {
    const noNumber = { ...input, tema: "Constitución Española" };
    const output = transformQuestion(noNumber);
    expect(output.tema.numero).toBe(0);
    expect(output.tema.titulo).toBe('Constitución Española');
  });
});
