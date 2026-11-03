import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach } from 'vitest';
import { completeOnboarding } from '../utils/onboarding';

// Por defecto los tests de App parten de un usuario que ya vio la bienvenida;
// los tests de la bienvenida borran la bandera explícitamente.
beforeEach(() => {
  if (typeof window !== 'undefined') completeOnboarding('skipped');
});

afterEach(() => cleanup());
