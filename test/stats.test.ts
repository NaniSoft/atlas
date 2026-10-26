import { describe, expect, it } from 'vitest';

import { clamp, clampPercent } from '@/lib/stats';

describe('clamp', () => {
  it('returns min when value is below min', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('returns max when value is above max', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('returns value when in range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });
});

describe('clampPercent', () => {
  it('returns 0 when value is below 0', () => {
    expect(clampPercent(-5)).toBe(0);
  });

  it('returns 100 when value is above 100', () => {
    expect(clampPercent(150)).toBe(100);
  });

  it('returns value when in range', () => {
    expect(clampPercent(50)).toBe(50);
  });

  it('delegates to clamp over the inclusive percentage range', () => {
    for (const value of [-1, 0, 25, 50, 75, 100, 101]) {
      expect(clampPercent(value)).toBe(clamp(value, 0, 100));
    }
  });
});
