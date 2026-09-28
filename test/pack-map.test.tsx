import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * The pack map, read off the real composition in a real DOM.
 *
 * This is the second of two independent readers of `scripts/pack-map.json`. The
 * first is the pack-boundary gate in `@nanisoft/prism-ui/gates`, which reads the built export and resolves
 * every boundary against the published token contract in both modes. Two readers of
 * one declaration, so a drift in the file itself is a difference between them rather
 * than a difference each of them agrees on.
 *
 * A boundary re-points the pack's corner radius as well as its colour, so a
 * boundary on anything but a fully rounded mark changes that shape. That is the
 * whole law, and the reason it is checked here as well as in the built output is
 * that the two can fail for different reasons: this one fails when a component is
 * composed wrong, and the built-output one fails when the cascade resolves wrong.
 */
import { render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';

import Landing from '@/app/page';
import NotFound from '@/app/not-found';
import { DEFAULT_MODE, GROUND_PACK, PRODUCTS, SITE_PRODUCT, THEME_ATTRIBUTES } from '@/lib/site';
import { SiteHeader } from '@nanisoft/prism-ui/blocks/site-header';
import { SiteFooter } from '@nanisoft/prism-ui/blocks/site-footer';

const ROOT = path.resolve(__dirname, '..');
const MAP = JSON.parse(readFileSync(path.join(ROOT, 'scripts', 'pack-map.json'), 'utf8')) as {
  ground: string;
  secondPackRegions: string[];
  regions: Record<string, { packs: string[] }>;
};

function headerAndFooter(): ReactElement {
  return (
    <>
      <SiteHeader
        product={SITE_PRODUCT}
        products={PRODUCTS}
        nav={[
          { label: 'Docs', href: '/docs' },
          { label: 'Blog', href: '/blog' },
          { label: 'About', href: '/about' },
        ]}
        navLabel="Atlas"
        productsLabel="Products"
      />
      <SiteFooter product={SITE_PRODUCT} />
    </>
  );
}

function boundaries(root: Element): Element[] {
  return [...root.querySelectorAll('[data-pack]')];
}

describe('the pack map', () => {
  it('declares the ground the site actually wears', () => {
    // The map and the site's own facts are two files, and this is the assertion that
    // they are one fact: a map that says a ground the document element does not carry
    // is a map of a different site.
    expect(MAP.ground).toBe(GROUND_PACK);
    expect(THEME_ATTRIBUTES['data-pack']).toBe(GROUND_PACK);
    expect(DEFAULT_MODE).toBe('dark');
  });

  it('lands every chrome boundary on a mark, in the regions the map names', () => {
    const { container } = render(headerAndFooter());
    const found: Record<string, string[]> = {};

    for (const element of boundaries(container)) {
      const pack = element.getAttribute('data-pack') as string;
      expect(element.getAttribute('data-slot'), `${pack} boundary is not a mark`).toBe('product-mark');
      // A boundary belongs on a fully rounded element, on one carrying no radius
      // utility, or on a shape with no radius concept. A mark's disc is the first.
      expect(element.getAttribute('class')).not.toMatch(/\brounded-(?!full\b)/);
      const region = element.closest('[data-slot="product-switcher"]')
        ? 'header.switcher'
        : element.closest('header')
          ? 'header.brand'
          : element.closest('footer')
            ? 'footer.brand'
            : 'unnameable';
      found[region] = [...(found[region] ?? []), pack];
    }

    expect(Object.keys(found).sort()).toEqual(Object.keys(MAP.regions).filter((r) => !r.startsWith('landing')).sort());
    for (const [region, packs] of Object.entries(found)) {
      expect([...packs].sort(), region).toEqual([...MAP.regions[region]!.packs].sort());
    }
  });

  it('lands the landing\'s one second-pack region on marks, and nowhere else', () => {
    const { container } = render(<Landing />);
    const found: Record<string, string[]> = {};

    for (const element of boundaries(container)) {
      const pack = element.getAttribute('data-pack') as string;
      expect(element.getAttribute('data-slot'), `${pack} boundary is not a mark`).toBe('product-mark');
      const section = element.closest('main section, section');
      expect(section, 'a boundary outside any section cannot be named').toBeTruthy();
      const ordinal = [...(section?.querySelectorAll('span') ?? [])]
        .map((node) => (node.textContent ?? '').trim())
        .find((text) => /^\d{2}$/.test(text));
      expect(ordinal, 'every band on the landing publishes an ordinal').toBeTruthy();
      const region = `landing.${ordinal}`;
      found[region] = [...(found[region] ?? []), pack];
    }

    expect(Object.keys(found)).toEqual(['landing.05']);
    expect([...(found['landing.05'] ?? [])].sort()).toEqual([...MAP.regions['landing.05']!.packs].sort());
  });

  it('allows exactly the declared regions to carry a pack that is not the ground', () => {
    const { container: chrome } = render(headerAndFooter());
    const { container: page } = render(<Landing />);
    const second = [...boundaries(chrome), ...boundaries(page)]
      .map((element) => element.getAttribute('data-pack'))
      .filter((pack) => pack !== MAP.ground);
    expect(new Set(second).size).toBeGreaterThan(0);
    // The declared set is asserted as well as derived: a page that grows a third
    // region carrying a second pack fails on the difference between the two.
    expect([...MAP.secondPackRegions].sort()).toEqual(['header.switcher', 'landing.05']);
  });

  it('carries no boundary on a shape whose corner radius the pack would move', () => {
    const { container } = render(<Landing />);
    for (const element of boundaries(container)) {
      expect(['rect', 'path', 'circle', 'g', 'svg']).not.toContain(element.tagName.toLowerCase());
    }
  });
});

describe('the not-found page', () => {
  it('offers the ways back into the site as real anchors', () => {
    render(<NotFound />);
    expect(screen.getByRole('link', { name: 'Back to the landing' }).getAttribute('href')).toBe('/');
    expect(screen.getByRole('link', { name: 'Read the docs' }).getAttribute('href')).toBe('/docs');
    expect(screen.getByRole('link', { name: 'Read the blog' }).getAttribute('href')).toBe('/blog');
  });
});
