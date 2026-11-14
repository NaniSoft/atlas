import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const ROOT = path.resolve(dirname(fileURLToPath(import.meta.url)), '..');
const NEG = path.join(ROOT, 'test/fixtures/ui-negative');
const POS = path.join(ROOT, 'test/fixtures/ui-positive');

// ui-check gate module is untyped JS
import * as gate from '../scripts/ui-check.mjs';

const published = gate.dsPublishedClasses();

function codesFor(file: string): string[] {
  return gate.checkFile(file, published).map((f: { code: string }) => f.code);
}

function pngBuffer(width: number, height: number): Buffer {
  const w = Buffer.alloc(4);
  const h = Buffer.alloc(4);
  w.writeUInt32BE(width, 0);
  h.writeUInt32BE(height, 0);
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    Buffer.alloc(4),
    Buffer.from('IHDR'),
    w,
    h,
    Buffer.alloc(9),
  ]);
}

/** Run checkAssets with extra manifest entries + temp public files; restores both. */
function withFixtureAsset(
  entry: Record<string, unknown>,
  bytes: Buffer | string,
  fn: (codes: string[]) => void,
): void {
  const manifestPath = path.join(ROOT, 'assets/manifest.json');
  const original = readFileSync(manifestPath, 'utf8');
  const file = path.join(ROOT, String(entry.file));
  try {
    const manifest = JSON.parse(original);
    manifest.assets = [...(manifest.assets ?? []), entry];
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    writeFileSync(file, bytes);
    fn(gate.checkAssets().map((f: { code: string }) => f.code));
  } finally {
    writeFileSync(manifestPath, original);
    if (existsSync(file)) rmSync(file, { force: true });
  }
}

describe('ui:check negative fixtures are rejected', () => {
  it('rejects each prohibited pattern with its mission code', () => {
    const cases: Array<[string, string]> = [
      ['neg-ui001.tsx', 'UI001'],
      ['neg-ui002.tsx', 'UI002'],
      ['neg-ui002.tsx', 'UI003'],
      ['neg-ui004.tsx', 'UI004'],
      ['neg-ui005.tsx', 'UI005'],
      ['neg-ui006.tsx', 'UI006'],
      ['neg-ui007.tsx', 'UI007'],
      ['neg-ui008.tsx', 'UI008'],
      ['neg-ui009.tsx', 'UI009'],
      ['neg-ui010.tsx', 'UI010'],
      ['neg-ui011.tsx', 'UI011'],
      ['neg-ui012.tsx', 'UI012'],
      ['neg-asset-image.tsx', 'ASSET001'],
      ['neg-asset-image.tsx', 'ASSET008'],
      ['neg-asset-variant.tsx', 'ASSET002'],
      ['neg-asset-variant.tsx', 'ASSET012'],
      ['neg-asset-fit.tsx', 'ASSET014'],
      ['neg-asset-svg.tsx', 'ASSET008'],
    ];
    for (const [file, code] of cases) {
      expect(codesFor(path.join(NEG, file)), `${file} should report ${code}`).toContain(code);
    }
  });

  it('rejects unregistered public assets (ASSET004)', () => {
    const file = path.join(ROOT, 'public/__fixture-unregistered.png');
    try {
      writeFileSync(file, pngBuffer(1200, 630));
      const codes: string[] = gate.checkAssets().map((f: { code: string; file: string }) => f.code);
      expect(codes).toContain('ASSET004');
    } finally {
      if (existsSync(file)) rmSync(file, { force: true });
    }
  });

  it('rejects invalid asset formats (ASSET005)', () => {
    withFixtureAsset(
      { id: 'f-bmp', file: 'public/__fixture.bmp', format: 'bmp', category: 'logo', allowedVariants: ['logo'], budgetKiB: 50 },
      Buffer.alloc(8),
      (codes) => expect(codes).toContain('ASSET005'),
    );
  });

  it('rejects active SVG (ASSET007)', () => {
    withFixtureAsset(
      { id: 'f-svg', file: 'public/__fixture.svg', format: 'svg', category: 'logo', allowedVariants: ['logo'], budgetKiB: 50 },
      '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>',
      (codes) => expect(codes).toContain('ASSET007'),
    );
  });

  it('rejects over-budget assets (ASSET006)', () => {
    withFixtureAsset(
      { id: 'f-big', file: 'public/__fixture-big.png', format: 'png', category: 'logo', allowedVariants: ['logo'], budgetKiB: 50, intrinsicWidth: 1200, intrinsicHeight: 630, minSource: { widthPx: 1, heightPx: 1 } },
      Buffer.alloc(60 * 1024),
      (codes) => expect(codes).toContain('ASSET006'),
    );
  });

  it('rejects aspect mismatches (ASSET003)', () => {
    withFixtureAsset(
      { id: 'f-square', file: 'public/__fixture-sq.png', format: 'png', category: 'card', allowedVariants: ['card'], budgetKiB: 200 },
      pngBuffer(100, 100),
      (codes) => expect(codes).toContain('ASSET003'),
    );
  });

  it('rejects non-woff2 fonts (ASSET009)', () => {
    withFixtureAsset(
      { id: 'f-font', file: 'public/__fixture.ttf', format: 'ttf', category: 'font', allowedVariants: ['icon'], budgetKiB: 150 },
      Buffer.alloc(8),
      (codes) => expect(codes).toContain('ASSET009'),
    );
  });

  it('rejects undersized sources (ASSET013)', () => {
    withFixtureAsset(
      { id: 'f-small', file: 'public/__fixture-sm.png', format: 'png', category: 'card', allowedVariants: ['card'], budgetKiB: 200 },
      pngBuffer(800, 600),
      (codes) => expect(codes).toContain('ASSET013'),
    );
  });
});

describe('ui:check positive fixtures pass', () => {
  it('allows DS Diagram and layout composition', () => {
    if (!existsSync(POS)) mkdirSync(POS, { recursive: true });
    expect(codesFor(path.join(POS, 'pos-diagram.tsx'))).toEqual([]);
    expect(codesFor(path.join(POS, 'pos-layout.tsx'))).toEqual([]);
  });
});

describe('ui:check on the real source tree', () => {
  it('reports zero findings after the migration', () => {
    expect(gate.runUiCheck()).toEqual([]);
  });
});
