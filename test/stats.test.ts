import { describe, expect, it } from 'vitest';

import { clamp } from '@/lib/stats';

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
