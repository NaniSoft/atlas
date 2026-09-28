import { readFileSync } from 'node:fs';
import path from 'node:path';
import { render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';
import type { Folder, Item, Root } from 'fumadocs-core/page-tree';
import { describe, expect, it } from 'vitest';

import { DocArticle, type DocArticlePage } from '@/components/doc-article';
import { toPrismTree } from '@/lib/to-prism-tree';

/**
 * The nine-page single-section group, rendered and looked at.
 *
 * **This is the group the migration was for.** Atlas files four sections, and one of
 * them is nine pages under a single heading: `content/docs/architecture` holds no
 * `index.mdx`, so it is a place in the tree and not a route. That is the shape the
 * retired line could not express: it had one navigation shape, every entry was an
 * anchor, and a section with no index of its own became an anchor with no `href`,
 * which this repository then repaired in its own stylesheet with a rule that styled
 * `a[href=""]` back into a label. A rule that exists only to repair a shape the type
 * can now prevent is a rule that dies with the type.
 *
 * So the group is a **label**: a `span` with no `href`, not focusable, and the nine
 * pages under it are nine real anchors. That is the design system's own rule and its
 * own words, and this test asserts the rendered result rather than the adapter's
 * intent, because the two can disagree and only the rendered one is what a reader
 * meets.
 *
 * **The tree is built here rather than loaded, and that is stated rather than
 * hidden.** fumadocs' `defineCollections` is a compile-time macro the bundler expands,
 * so the loader cannot run under this runner; `test/content.test.ts` reads the corpus
 * from disk for the same reason. So the nine page names and the group's own title are
 * read off the real content tree, and the shape around them is written out by hand in
 * the shape the loader emits. What is under test is the adapter and the Page, not the
 * loader, and the corpus is read from disk so a rename in `content/` fails here too.
 */
const ROOT = path.resolve(__dirname, '..');
const CONTENT = path.join(ROOT, 'content', 'docs');

function meta(folder: string): { title: string; pages: string[] } {
  return JSON.parse(readFileSync(path.join(CONTENT, folder, 'meta.json'), 'utf8'));
}

function frontmatterTitle(file: string): string {
  const source = readFileSync(file, 'utf8');
  const match = /^title: (.+)$/m.exec(source);
  if (!match?.[1]) throw new Error(`${file} has no title in its frontmatter`);
  return match[1].trim();
}

/** One page in the tree, in the shape the loader emits for a file with a title. */
function page(folder: string, slug: string): Item {
  return {
    type: 'page',
    name: frontmatterTitle(path.join(CONTENT, folder, `${slug}.mdx`)),
    url: `/docs/${folder}/${slug}`,
  };
}

/** A folder, with no index, which is the whole point of this tree. */
function folder(name: string, children: Item[]): Folder {
  return { type: 'folder', name, children };
}

const ARCHITECTURE = meta('architecture');
const ARCHITECTURE_PAGES = ARCHITECTURE.pages.map((slug) => page('architecture', slug));

/** The whole corpus, in the order the content tree's own folders give it. */
function corpus(): Root {
  return {
    name: 'Docs',
    children: [
      page('.', 'introduction'),
      folder(ARCHITECTURE.title, ARCHITECTURE_PAGES),
      folder(meta('concepts').title, meta('concepts').pages.map((slug) => page('concepts', slug))),
      folder(meta('guides').title, meta('guides').pages.map((slug) => page('guides', slug))),
      folder(meta('reference').title, meta('reference').pages.map((slug) => page('reference', slug))),
    ],
  };
}

const Body: ComponentType<{ components?: Record<string, ComponentType<Record<string, unknown>>> }> = () => (
  <p>The document body.</p>
);

function article(tree: Root, url: string, toc?: { title: unknown; url: string; depth: number }[]) {
  const page: DocArticlePage = {
    url,
    data: { title: 'Platform flow', description: 'The spine.', body: Body, toc },
  };
  return <DocArticle page={page} tree={tree} />;
}

describe('the nine-page single-section group', () => {
  it('is nine pages under one heading in the content tree', () => {
    // The premise, read off the corpus rather than restated: if this stops being nine
    // then the group below is no longer the shape the design system was asked for,
    // and a reviewer should be told that rather than shown a passing test.
    expect(ARCHITECTURE_PAGES).toHaveLength(9);
    expect(ARCHITECTURE.pages).toEqual([
      'platform-flow',
      'orchestration',
      'transform',
      'storage-and-catalog',
      'query',
      'in-house-components',
      'observability',
      'delivery',
      'authorization-and-secrets',
    ]);
    // No index page: that is what makes the group a label rather than a route.
    expect(() => readFileSync(path.join(CONTENT, 'architecture', 'index.mdx'), 'utf8')).toThrow();
  });

  it('is the deepest group in this corpus, and the deepest single-section tree in the family', () => {
    const tree = corpus();
    const sizes = tree.children
      .filter((node): node is Folder => node.type === 'folder')
      .map((node) => node.children.length);
    expect(Math.max(...sizes)).toBe(9);
    // One section, nine pages: no other group in this corpus is under a single
    // heading with a page count this high, which is why the group is worth a
    // reviewer of its own.
    expect(sizes.filter((size) => size === 9)).toHaveLength(1);
  });

  it('maps the group to a label with no href, and its nine pages to nine links', () => {
    const entries = toPrismTree(corpus().children);
    const architecture = entries.find((entry) => entry.type === 'group' && entry.title === 'Architecture');
    expect(architecture).toBeTruthy();
    if (architecture?.type !== 'group') return;
    // The absence is the assertion. An empty string here is the retired line's
    // spelling of the same fact and it is the reason this repository carried a
    // stylesheet rule for an anchor with no destination.
    expect(architecture.href).toBeUndefined();
    expect(Object.keys(architecture).sort()).toEqual(['items', 'title', 'type']);
    expect(architecture.items).toHaveLength(9);
    for (const entry of architecture.items) {
      expect(entry.type).toBe('page');
    }
  });

  it('renders the group as a label and every page under it as a real destination', () => {
    const { container } = render(article(corpus(), '/docs/architecture/platform-flow'));
    const label = [...container.querySelectorAll('[data-slot="docs-nav-label"]')].find(
      (node) => node.textContent === 'Architecture',
    );
    expect(label?.textContent).toBe('Architecture');
    // A label is a span: not an anchor, no href, nothing for Tab to reach.
    expect(label?.tagName.toLowerCase()).toBe('span');
    expect(label?.hasAttribute('href')).toBe(false);

    const group = label?.closest('[data-slot="docs-nav-group"]');
    const links = [...(group?.querySelectorAll('[data-slot="docs-nav-link"]') ?? [])];
    expect(links).toHaveLength(9);
    for (const link of links) {
      expect(link.getAttribute('href')).toMatch(/^\/docs\/architecture\//);
      expect(link.textContent?.trim().length ?? 0).toBeGreaterThan(0);
    }
  });

  it('renders no anchor anywhere in the rail without a destination', () => {
    // The defect this migration removes, asserted as an absence over the whole tree
    // rather than as one case: an anchor a reader can focus and not follow.
    const { container } = render(article(corpus(), '/docs/architecture/platform-flow'));
    const rail = container.querySelector('[data-slot="docs-rail"]');
    expect(rail).toBeTruthy();
    const anchors = [...(rail?.querySelectorAll('a') ?? [])];
    expect(anchors.length).toBeGreaterThan(0);
    for (const anchor of anchors) {
      expect(anchor.getAttribute('href'), anchor.textContent ?? '').toBeTruthy();
    }
  });

  it('gives every group a label, so a section is never a control', () => {
    const { container } = render(article(corpus(), '/docs/architecture/platform-flow'));
    const labels = [...container.querySelectorAll('[data-slot="docs-nav-label"]')].map(
      (node) => node.textContent,
    );
    expect(labels.sort()).toEqual(['Architecture', 'Concepts', 'Guides', 'Reference'].sort());
    // No count, no badge, no status beside a heading: a section is a sequence and
    // every structural affordance says the opposite.
    for (const group of container.querySelectorAll('[data-slot="docs-nav-group"]')) {
      expect(group.querySelector('[data-slot="badge"]')).toBeNull();
    }
  });

  it('derives the pager from the rail, and labels it with words rather than glyphs', () => {
    const { container } = render(article(corpus(), '/docs/architecture/platform-flow'));
    const pager = container.querySelector('[data-slot="docs-pager"]');
    expect(pager?.getAttribute('aria-label')).toBe('Documentation pages');
    expect(pager?.textContent).toContain('Previous');
    expect(pager?.textContent).toContain('Next');
    // The first page under Architecture has the introduction before it in the
    // flattened rail and the second page after it, and the Page renders only the
    // halves it is given. A neighbour that is not in the tree is the one arrangement
    // a reader would notice, which is why the pager is derived and not passed.
    expect(pager?.textContent).toContain('Introduction');
    expect(pager?.textContent).toContain('Orchestration');
    expect(pager?.querySelectorAll('a')).toHaveLength(2);
  });

  it('renders a contents rail whose links have names, from the document\'s own outline', () => {
    // The retired line shipped a contents rail of anchors with no accessible name,
    // because fumadocs flattens a heading into an array rather than a string and the
    // old adapter kept the value only when it was already a string. These two entries
    // are the shape that produced it.
    const toc = [
      { title: ['The twin'], url: '#the-twin', depth: 2 },
      { title: ['Built from ', { props: { children: ['code'] } }, ' and a data platform'], url: '#status', depth: 2 },
    ];
    const { container } = render(article(corpus(), '/docs/architecture/platform-flow', toc));
    const contents = container.querySelector('[data-slot="docs-contents"]');
    expect(contents?.querySelector('nav')?.getAttribute('aria-label')).toBe('On this page');
    const links = [...(contents?.querySelectorAll('a') ?? [])];
    expect(links.map((link) => link.textContent)).toEqual([
      'The twin',
      'Built from code and a data platform',
    ]);
    for (const link of links) {
      expect(link.getAttribute('href')).toMatch(/^#/);
      expect((link.textContent ?? '').trim().length).toBeGreaterThan(0);
    }
  });

  it('renders the document body inside the design system\'s prose, with no site prose class', () => {
    const { container } = render(article(corpus(), '/docs/architecture/platform-flow'));
    expect(screen.getByText('The document body.')).toBeTruthy();
    // `site-prose` was this repository's own restyling of every element a document can
    // contain. The design system now owns that, so a class that styled it is dead.
    expect(container.querySelector('.site-prose')).toBeNull();
  });
});
