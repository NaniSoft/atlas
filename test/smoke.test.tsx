import { render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import NotFound from '@/app/not-found';
import HomePage, { metadata } from '@/app/page';
import RootLayout, { metadata as layoutMetadata } from '@/app/layout';
import { DEFAULT_MODE, GROUND_PACK, PRODUCTS, SITE_PRODUCT, THEME_ATTRIBUTES } from '@/lib/site';

const ROOT = path.resolve(__dirname, '..');

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

describe('the document element', () => {
  it('carries the mode, and the ground, and nothing else', () => {
    render(<RootLayout>{null}</RootLayout>);
    const root = document.documentElement;
    // Two attributes and no class. There is no font variable here any more, so there
    // is no second `className` for the theme to be spread over: prism 0.10.2 ships
    // the typeface in its own stylesheet, so this site loads no font file and has no
    // class to lose.
    expect(root.className).toBe('dark');
    expect(root.getAttribute('data-pack')).toBe('mint');
  });

  it('leaves the typeface to the design system', () => {
    // The sheet must not repoint `--font-sans`. It used to, at a cost of a second
    // declaration of a family prism already declares and a build-time download from
    // Google, and the only reason was a version that predates prism shipping a font
    // file. Asserting the absence is the cheap half of keeping it that way.
    const css = readFileSync(path.join(ROOT, 'app', 'globals.css'), 'utf8');
    expect(css).not.toMatch(/--font-sans\s*:/);
    expect(css).not.toMatch(/--font-inter/);
  });

  it('repeats no utility class the design system may not emit', () => {
    // A consumer cannot write a Prism utility class: the emitted sheet is compiled
    // from the design system's own source, so a utility exists in it only if a Prism
    // component uses it. A class named here that prism never uses would do nothing and
    // say nothing, so the two figures' classes are asserted to be site classes rather
    // than invented utilities.
    const css = readFileSync(path.join(ROOT, 'app', 'globals.css'), 'utf8');
    for (const name of ['site-figure__node', 'site-figure__edge', 'site-figures', 'site-actions']) {
      expect(css, `${name} is used in markup and must be declared in the sheet`).toContain(`.${name}`);
    }
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
