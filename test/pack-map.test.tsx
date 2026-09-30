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

import Landing from '@/app/page';
import NotFound from '@/app/not-found';
import AboutPage from '@/app/about/page';
import { DEFAULT_MODE, GROUND_PACK, THEME_ATTRIBUTES } from '@/lib/site';
import { COPY, NAV, SITES } from '@/lib/bar';

const ROOT = path.resolve(__dirname, '..');
const MAP = JSON.parse(readFileSync(path.join(ROOT, 'scripts', 'pack-map.json'), 'utf8')) as {
  ground: string;
  secondPackRegions: string[];
  regions: Record<string, { packs: string[] }>;
};

/**
 * Which region a boundary belongs to, by the same rule `scripts/pack-regions.mjs`
 * declares for the built export.
 *
 * Two readers of one map is the point of this file, so the rule is written out rather
 * than imported: a copy is what makes a drift between the two a fact, and an import
 * would make them agree by construction and check nothing. The two are kept honest
 * against `scripts/pack-map.json`, which both of them read.
 *
 * The switcher's rule is gone from both, and not because the marks moved somewhere
 * harmless: the family's five sites are a menu now and a closed menu is not in the
 * static export. The landing is named by the Block that draws the rows rather than by
 * the ordinal the band prints, because a page that renumbers itself would then have
 * renamed a region this file was holding it to.
 */
function regionOf(element: Element): string | null {
  if (element.closest('header')) return 'header.brand';
  if (element.closest('footer')) return 'footer.brand';
  if (element.closest('main [data-slot="product-grid"]')) return 'landing.products';
  return null;
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

  it('lands every boundary the real page renders on a mark, in a region the map names', () => {
    // The real pages, not a hand-assembled header. A test that composes what it is
    // testing stops testing it the moment the composition is not what ships, and this
    // file used to compose a `SiteHeader` with a product switcher the page had stopped
    // publishing.
    const { container } = render(<Landing />);
    const found: Record<string, string[]> = {};

    for (const element of boundaries(container)) {
      const pack = element.getAttribute('data-pack') as string;
      expect(element.getAttribute('data-slot'), `${pack} boundary is not a mark`).toBe('product-mark');
      // A boundary belongs on a fully rounded element, on one carrying no radius
      // utility, or on a shape with no radius concept. A mark's disc is the first.
      expect(element.getAttribute('class')).not.toMatch(/\brounded-(?!full\b)/);
      const region = regionOf(element);
      expect(region, `a ${pack} boundary the map cannot name`).not.toBeNull();
      found[region as string] = [...(found[region as string] ?? []), pack];
    }

    expect(Object.keys(found).sort()).toEqual(Object.keys(MAP.regions).sort());
    for (const [region, packs] of Object.entries(found)) {
      expect([...packs].sort(), region).toEqual([...MAP.regions[region]!.packs].sort());
    }
  });

  it('carries the chrome boundaries on every page, at the ground, in both landmarks', () => {
    // The bar and the footer are on every route, so the two ground regions are read
    // from a page that is not the landing: a region that only the landing rendered would
    // be a region the other thirty-odd routes did not have.
    for (const Page of [Landing, AboutPage, NotFound]) {
      const { container } = render(<Page />);
      const regions = [...new Set(boundaries(container).map((element) => regionOf(element)))].sort();
      expect(regions, `${Page.name} publishes ${regions.join(', ')}`).toEqual(
        expect.arrayContaining(['header.brand', 'footer.brand']),
      );
      for (const element of boundaries(container)) {
        const region = regionOf(element);
        if (region === 'header.brand' || region === 'footer.brand') {
          expect(element.getAttribute('data-pack'), `${region} wears a second pack`).toBe(MAP.ground);
        }
      }
    }
  });

  it('allows exactly one region to carry a pack that is not the ground', () => {
    const { container } = render(<Landing />);
    const second = boundaries(container)
      .map((element) => ({ pack: element.getAttribute('data-pack'), region: regionOf(element) }))
      .filter((boundary) => boundary.pack !== MAP.ground);
    expect(second.length, 'the landing carries no second pack at all').toBeGreaterThan(0);
    // The declared set is asserted as well as derived: a page that grows a second
    // region carrying a second pack fails on the difference between the two.
    expect([...new Set(second.map((boundary) => boundary.region))].sort()).toEqual(
      [...MAP.secondPackRegions].sort(),
    );
    expect(MAP.secondPackRegions).toEqual(['landing.products']);
  });

  it('carries no boundary on a shape whose corner radius the pack would move', () => {
    const { container } = render(<Landing />);
    for (const element of boundaries(container)) {
      expect(['rect', 'path', 'circle', 'g', 'svg']).not.toContain(element.tagName.toLowerCase());
    }
  });
});

describe('the bar this site publishes', () => {
  it('carries this site own three destinations, in a navigation of its own', () => {
    // The Block renders a brand lockup and nothing else when `nav` is absent, so
    // dropping the three is a silent removal of the whole site's navigation.
    const { container } = render(<Landing />);
    const nav = container.querySelector(`nav[aria-label="${COPY.nav}"]`);
    expect(nav, 'the bar carries no site navigation').toBeTruthy();
    expect([...nav!.querySelectorAll('a')].map((a) => a.getAttribute('href'))).toEqual(
      NAV.map((link) => link.href),
    );
  });

  it('reaches the whole family from one control rather than five marks at first paint', () => {
    const { container } = render(<Landing />);
    const trigger = container.querySelector('[data-slot="site-navbar-sites-trigger"]');
    expect(trigger, 'the bar reaches no other site').toBeTruthy();
    expect(trigger!.getAttribute('aria-haspopup')).toBe('menu');
    // Five members, and every one of them a different origin: a relative href would
    // render as a working link and land on a 404.
    expect(SITES).toHaveLength(5);
    for (const site of SITES) {
      if (site.id === GROUND_PACK || site.id === 'atlas') continue;
      expect(site.href, `${site.id} does not leave this site`).toMatch(/^https:\/\//);
    }
  });

  it('has no colour chooser, because a ground is a property of the page', () => {
    const { container } = render(<Landing />);
    expect(container.querySelector('[data-slot="site-navbar-theme-trigger"]')).toBeNull();
  });

  it('keeps the playground, which is the one destination above the fold that leaves this site', () => {
    // It used to sit in the layout's `actions` slot, which is where it is still
    // published, and it is named five times in the landing's copy. A bar that dropped it
    // would leave the landing's single honest ask unreachable from every other page.
    const { container } = render(<Landing />);
    const bar = container.querySelector('[data-slot="site-navbar"]');
    const playground = [...bar!.querySelectorAll('a[href]')].find((a) =>
      a.getAttribute('href')?.includes('playground.nanisoft.com'),
    );
    expect(playground, 'the bar has no way to the playground').toBeTruthy();
    expect(playground!.getAttribute('target')).toBe('_blank');
  });

  it('offers search over a static index, because this site has no server', () => {
    const { container } = render(<Landing />);
    const trigger = container.querySelector('[data-slot="site-navbar-search-trigger"]');
    expect(trigger, 'the bar offers no way to search the docs').toBeTruthy();
    expect(trigger!.getAttribute('aria-haspopup')).toBe('dialog');
  });

  it('marks the page the reader is on, because the bar is composed per page', () => {
    // The mark used to be impossible here: the bar lived in the root layout, which is
    // handed no pathname, and the layout said so at length. It is composed per page now,
    // and this is the assertion that the arrangement is still the one it describes.
    const { container } = render(<AboutPage />);
    const current = [...container.querySelectorAll('a[aria-current="page"]')].map((a) =>
      a.getAttribute('href'),
    );
    expect(current).toEqual(['/about']);
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
