import { describe, expect, it } from 'vitest';
import {
  ActiveTimer,
  MAX_VALID_RESPONSE_MS,
  describeTimer,
  validResponseMs,
  validResponseSeconds,
} from './activeTimer';

function fakeClock(start = 0) {
  let now = start;
  return { now: () => now, advance: (ms: number) => { now += ms; } };
}

describe('ActiveTimer', () => {
  it('acumula solo mientras está en marcha y conserva lo acumulado al pausar', () => {
    const c = fakeClock();
    const t = new ActiveTimer(c.now);
    t.start();
    c.advance(5_000);
    t.pause();
    c.advance(60 * 60 * 1000); // una hora con la pestaña oculta
    expect(t.elapsedMs()).toBe(5_000);
    t.start();
    c.advance(3_000);
    expect(t.elapsedMs()).toBe(8_000);
  });

  it('start y pause son idempotentes y reset pone a cero', () => {
    const c = fakeClock();
    const t = new ActiveTimer(c.now);
    t.start(); t.start();
    c.advance(1_000);
    t.pause(); t.pause();
    expect(t.elapsedMs()).toBe(1_000);
    t.reset(false);
    expect(t.elapsedMs()).toBe(0);
    expect(t.running).toBe(false);
    c.advance(5_000);
    expect(t.elapsedMs()).toBe(0);
    t.reset();
    expect(t.running).toBe(true);
  });

  it('no retrocede si el reloj va hacia atrás', () => {
    const c = fakeClock(10_000);
    const t = new ActiveTimer(c.now);
    t.start();
    c.advance(-5_000);
    expect(t.elapsedMs()).toBe(0);
  });
});

describe('validResponseMs / validResponseSeconds', () => {
  it('acepta de 0 a 120 s y descarta el resto como «sin dato»', () => {
    expect(validResponseMs(0)).toBe(0);
    expect(validResponseMs(14_600)).toBe(14_600);
    expect(validResponseMs(MAX_VALID_RESPONSE_MS)).toBe(MAX_VALID_RESPONSE_MS);
    expect(validResponseMs(MAX_VALID_RESPONSE_MS + 1)).toBeNull();
    // El caso real: 2740 minutos con la pestaña olvidada.
    expect(validResponseMs(2740 * 60 * 1000)).toBeNull();
    expect(validResponseMs(-1)).toBeNull();
    expect(validResponseMs(NaN)).toBeNull();
    expect(validResponseMs(Infinity)).toBeNull();
    expect(validResponseMs(null)).toBeNull();
    expect(validResponseMs(undefined)).toBeNull();
  });

  it('en segundos redondea y propaga null', () => {
    expect(validResponseSeconds(14_600)).toBe(15);
    expect(validResponseSeconds(120_000)).toBe(120);
    expect(validResponseSeconds(120_001)).toBeNull();
    expect(validResponseSeconds(null)).toBeNull();
  });
});

describe('describeTimer', () => {
  it('nunca enseña cifras enormes y marca el objetivo de 15 s', () => {
    expect(describeTimer(5_000)).toEqual({ text: '5 s', state: 'en-objetivo' });
    expect(describeTimer(14_999).state).toBe('en-objetivo');
    expect(describeTimer(15_000)).toEqual({ text: '15 s', state: 'fuera-de-objetivo' });
    expect(describeTimer(59_000)).toEqual({ text: '59 s', state: 'fuera-de-objetivo' });
    expect(describeTimer(61_000)).toEqual({ text: '+1 min', state: 'fuera-de-objetivo' });
    expect(describeTimer(121_000)).toEqual({ text: '+2 min', state: 'sin-medir' });
    expect(describeTimer(2740 * 60 * 1000)).toEqual({ text: '+2 min', state: 'sin-medir' });
  });
});
