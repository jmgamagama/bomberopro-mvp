import { describe, expect, it } from 'vitest';
import { isMemoryPilotPreview } from './memoryPilotBuild';
describe('activación de la preview MIRA', () => {
  it('solo activa la rama del piloto en preview', () => {
    expect(isMemoryPilotPreview({ VERCEL_ENV: 'preview', VERCEL_GIT_COMMIT_REF: 'codex/feat-memory-pilot' })).toBe(true);
    expect(isMemoryPilotPreview({ VERCEL_ENV: 'production', VERCEL_GIT_COMMIT_REF: 'codex/feat-memory-pilot' })).toBe(false);
    expect(isMemoryPilotPreview({ VERCEL_ENV: 'preview', VERCEL_GIT_COMMIT_REF: 'main' })).toBe(false);
    expect(isMemoryPilotPreview({})).toBe(false);
  });
});
