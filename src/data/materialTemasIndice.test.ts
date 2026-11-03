import { describe, expect, it } from 'vitest';
import { MATERIAL_TEMAS } from './materialTemas';
import { TEMAS_CON_MATERIAL } from './materialTemasIndice';

describe('TEMAS_CON_MATERIAL (índice ligero del JS inicial)', () => {
  it('coincide exactamente con los temas de MATERIAL_TEMAS', () => {
    expect([...TEMAS_CON_MATERIAL].sort((a, b) => a - b)).toEqual(MATERIAL_TEMAS.map((m) => m.tema).sort((a, b) => a - b));
  });
});
