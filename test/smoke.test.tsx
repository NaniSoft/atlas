import { render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';

const ROOT = path.resolve(__dirname, '..');

/**
 * `next/font/google` is a build-time loader: the export it hands back is a function
 * the bundler replaces while it downloads and hashes the typeface, and under this
 * runner there is no bundler stage, so importing the layout without a stand-in throws
 * `Inter is not a function` before a single assertion runs. The stand-in returns the
 * same shape the real loader does, so the layout's own exports are still the ones
 * under test and only the font download is skipped.
 */
vi.mock('next/font/google', () => ({
  // The real loader returns a generated class name, not the variable's value, which is
  // why this stub names one: the assertion below is about the class reaching the
  // document element, not about the name the loader happens to pick.
  Inter: () => ({ variable: 'font-inter-stub', className: 'font-inter-stub' }),
}));

import NotFound from '@/app/not-found';
import HomePage, { metadata } from '@/app/page';
import RootLayout, { metadata as layoutMetadata } from '@/app/layout';
import { DEFAULT_MODE, GROUND_PACK, PRODUCTS, SITE_PRODUCT, THEME_ATTRIBUTES } from '@/lib/site';

/**
 * The site's identity, and the one published string that must not drift.
 *
 * **The absolute page title is pinned here because this is the only page in the
 * repository that publishes one.** `/` sets `title.absolute`, so the layout's
 * `%s · Atlas` template is not applied to it, and the string is a set of published
 * bytes rather than a rendering decision: it is what a browser tab, a bookmark, a
 * search result and a shared link all carry. A migration that rewrote it would be
 * invisible in every screenshot this family takes and would break every address
 * anybody ever pasted.
 *
 * So the assertion is a byte comparison against a literal, and it is a *separate* pin
 * from the content-parity ledger's: the ledger proves the built page still says it,
 * and this proves the declaration in the source still says it. Two readers, so a
 * change has to be made in both to go unnoticed, and either one alone is a
 * deliberate edit.
 */
const ABSOLUTE_TITLE = 'Atlas — Model the real world digitally';

describe('site identity', () => {
  it('is atlas, in the published mint pack, beam-dark by default', () => {
    expect(SITE_PRODUCT.id).toBe('atlas');
    expect(GROUND_PACK).toBe('mint');
    expect(DEFAULT_MODE).toBe('dark');
    // The two theme attributes, and nothing else. No provider, no client runtime.
    expect(THEME_ATTRIBUTES).toEqual({ 'data-pack': 'mint', className: 'dark' });
  });

  it('wears mint as the ground and every other published pack on a mark', () => {
    expect(PRODUCTS.map((product) => [product.id, product.pack])).toEqual([
      ['www', 'sky'],
      ['nexus', 'lavender'],
      ['atlas', 'mint'],
      ['alphalens', 'blush'],
      ['prism', 'peach'],
    ]);
    // Every one of those identifiers is a pack the token build emits. A name that
    // matches no emitted rule inherits the ground silently, which is how the retired
    // line's `green`, `rose` and `blue` all painted this page the same colour.
    expect(PRODUCTS.every((product) => typeof product.pack === 'string')).toBe(true);
  });
});

describe('the absolute page title', () => {
  it('is published as an absolute title, byte for byte', () => {
    expect(metadata.title).toEqual({ absolute: ABSOLUTE_TITLE });
  });

  it('is not the layout default and not the templated form', () => {
    // The two shapes it must not collapse into. `absolute` is what makes the template
    // inapplicable, and the default is what a page that forgot to declare one would
    // quietly inherit.
    expect(layoutMetadata.title).toEqual({
      default: ABSOLUTE_TITLE,
      template: '%s · Atlas',
    });
    expect(ABSOLUTE_TITLE.endsWith('· Atlas')).toBe(false);
  });

  it('keeps the em dash that is a published byte rather than punctuation', () => {
    // A normalising tool would rewrite this to a hyphen, and the rewrite would be
    // invisible in review and permanent in every reader's history.
    expect(ABSOLUTE_TITLE).toContain('\u2014');
    expect(ABSOLUTE_TITLE.split('\u2014')).toHaveLength(2);
  });
});

describe('the two document-element classes', () => {
  it('carries the font file and the mode together, not one over the other', () => {
    render(<RootLayout>{null}</RootLayout>);
    const root = document.documentElement;
    // The font loader and the theme both want a className, and only one prop exists.
    // Whichever is spread last wins, and the loser is silent: the page builds, the
    // stylesheet still resolves `--font-sans`, and every page renders in the
    // platform's UI face with nothing in the build saying so. So both are asserted.
    expect(root.classList.contains('dark')).toBe(true);
    expect(root.classList.contains('font-inter-stub')).toBe(true);
    expect(root.getAttribute('data-pack')).toBe('mint');
  });

  it('repeats the design system\'s own fallback list behind the loaded family', () => {
    // The list is prism's, verbatim, with the one entry that resolves first. A
    // shorter list is a different decision about what a reader sees when the
    // download fails, and that decision is not this site's to make. The match is
    // anchored on a line of its own so the sheet's own prose, which quotes prism's
    // declaration, is not the thing being read.
    const css = readFileSync(path.join(ROOT, 'app', 'globals.css'), 'utf8');
    const declaration = /^\s*--font-sans:\s*([^;]+);/ms.exec(css)?.[1] ?? '';
    for (const family of [
      'var(--font-inter)',
      'Inter',
      'ui-sans-serif',
      'system-ui',
      '-apple-system',
      "'Segoe UI'",
      'Roboto',
      "'Helvetica Neue'",
      'Arial',
      'sans-serif',
    ]) {
      expect(declaration, `${family} is missing from --font-sans`).toContain(family);
    }
    // And it is a token, not a declaration on a bare element: prism's base is
    // layered and this sheet is not.
    expect(css).not.toMatch(/^\s*(body|html)\s*\{[^}]*font-family/ms);
  });
});

describe('the landing renders from the catalogue', () => {
  it('is a server component with no client boundary in its own composition', () => {
    // The old landing needed a theme provider, a scroll-reveal observer and a canvas;
    // all three are gone, and the page still renders with nothing mounted above it.
    const { container } = render(<HomePage />);
    expect(container.querySelector('canvas')).toBeNull();
    expect(container.querySelector('[data-reveal]')).toBeNull();
    // The pipeline is drawn as the running figure rather than the static diagram,
    // and it is still server markup: the old landing needed a theme provider, a
    // scroll-reveal observer and a canvas, and the figure that replaced the canvas
    // needs none of the three because its motion is CSS in the design system's own
    // stylesheet rather than a loop in this page's JavaScript.
    expect(container.querySelector('svg[data-slot="pulse-graph"]')).toBeTruthy();
    expect(container.querySelector('.prism-ambient-travel')).toBeTruthy();
  });
});

describe('404', () => {
  it('offers the ways back into the site', () => {
    render(<NotFound />);
    // The design system's Page makes the code the page's heading and the sentence an
    // h2 under it, which is the reverse of the order a reader sees them in.
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('404');
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('No node here.');
    expect(screen.getByRole('link', { name: 'Back to the landing' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Read the docs' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Read the blog' })).toBeTruthy();
  });
});
