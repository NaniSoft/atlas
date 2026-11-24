// The audit findings that reach this repository, held here so a later
// composition cannot quietly drop them again.
//
// Three of them are rendered facts (the docs index outline, the codename
// ledger's real names and the keyboard access to the figures). The fourth is a
// source fact: the blog route cannot be rendered under vitest because the
// fumadocs MDX macro is a bundler plugin, so its composition is read as source
// exactly as `test/post-date.test.ts` reads the date wiring.

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { render, screen } from '@testing-library/react';
import { createElement } from 'react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';

import Landing from '@/app/page';
import { SectionIndex, type IndexGroup } from '@/components/section-index';
import { STACK_PRODUCTS } from '@/lib/content/landing';
import { getMdxComponents } from '@/lib/mdx-components';

const ROOT = path.resolve(__dirname, '..');

const GROUPS: IndexGroup[] = [
  {
    group: 'Concepts',
    items: [
      { title: 'The twin', url: '/docs/concepts/the-twin', description: 'What the twin is.' },
    ],
  },
];

describe('the doc index outline', () => {
  it('names every section group with a real h2, not a plain span', () => {
    render(
      <SectionIndex
        title="Atlas docs"
        description="The documentation."
        groups={GROUPS}
        emptyMessage="Nothing published yet."
      />,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Atlas docs' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: 'Concepts' })).toBeTruthy();
  });
});

describe('the figures on the landing', () => {
  it('gives every horizontal scroll region a keyboard tab stop', () => {
    const { container } = render(<Landing />);
    const regions = [
      ...container.querySelectorAll(
        '[data-slot="diagram-container"], [data-slot="pulse-graph-container"]',
      ),
    ];
    // The finding's diagram, the running pipeline, the two figure-band drawings
    // and the decorative editorial network.
    expect(regions).toHaveLength(5);
    for (const region of regions) {
      expect(region.getAttribute('tabindex')).toBe('0');
    }
    // The four named drawings are landmarks; the decorative one is not.
    expect(container.querySelectorAll('[role="region"]')).toHaveLength(4);
  });

  it('introduces no duplicate landmark names', async () => {
    const { container } = render(<Landing />);
    const results = await axe.run(container, {
      rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
    });
    expect(results.violations.filter((violation) => violation.id === 'landmark-unique')).toEqual([]);
  });

  it('prints the real product under each codename', () => {
    const { container } = render(<Landing />);
    const parts = container.querySelectorAll('[data-slot="stack-grid"] > ul:first-child > li');
    const codenamed = STACK_PRODUCTS.filter((product) => product.realName !== product.name);
    expect(codenamed.length).toBeGreaterThanOrEqual(8);
    for (const product of codenamed) {
      const row = [...parts].find((part) => part.textContent?.includes(product.name));
      expect(row, `${product.name} is not on the ledger`).toBeTruthy();
      expect(row?.textContent).toContain(product.realName);
    }
  });
});

describe('MDX tables', () => {
  it('are keyboard-scrollable, because a wide ledger overflows on a phone', () => {
    const map = getMdxComponents({ itemKey: 'docs/reference/integration-ledger' });
    const Table = map.table;
    expect(Table).toBeTruthy();
    const { container } = render(createElement(Table!));
    expect(container.querySelector('table')?.getAttribute('tabindex')).toBe('0');
  });
});

describe('the blog route composition', () => {
  it('keeps the row meta compact and gives the post a way back to the archive', () => {
    const route = readFileSync(path.join(ROOT, 'app/blog/[[...slug]]/page.tsx'), 'utf8');
    // An unlabelled TagGroup in the shrink-0 meta column squeezed the title and
    // standfirst to a few words at 390px. Tags live on the post Page as Badges.
    expect(route).not.toContain('TagGroup');
    expect(route).toMatch(/meta:\s*\(\s*<Text as="span" size="sm" tone="muted">/);
    expect(route).toContain("indexLink={{ title: 'All posts', href: '/blog' }}");
  });
});
