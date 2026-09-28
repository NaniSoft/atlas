// The doc-page template: prism-ui's DocsShell wearing the sidebar tree, TOC
// rail, and pager. Structural props only; fumadocs types stay at the app
// layer, mapped through lib/to-prism-tree before they reach prism-ui.
//
// The chrome is deliberately NOT passed as header/footer props — the root
// layout already renders SiteHeader/SiteFooter around `main`.
//
// The pager is **not** passed. The design system derives the two neighbours from
// the rail and the current address, because the rail already knows every page and
// the order a reader meets them in, and a caller who passes neighbours can pass a
// neighbour that is not in the tree. This repository used to derive them itself
// through fumadocs' `findNeighbour`, and a document that is in no tree then
// rendered a pager with two empty halves; deriving removes that derivation and
// that case together.

import type { ComponentType, ReactNode } from 'react';
import { DocsShell, type DocsNavEntry } from '@nanisoft/prism-ui/pages';
import type { Root } from 'fumadocs-core/page-tree';

import { getMdxComponents } from '@/lib/mdx-components';
import { toPrismToc, toPrismTree } from '@/lib/to-prism-tree';

export interface DocArticlePage {
  url: string;
  data: {
    title?: string;
    description?: string;
    /** fumadocs TOC entries: `{ title, url, depth }`, with a ReactNode title. */
    toc?: { title: unknown; url: string; depth: number }[];
    /** The compiled MDX body component. */
    body: ComponentType<{ components?: Record<string, ComponentType<Record<string, unknown>>> }>;
  };
}

export interface DocArticleProps {
  page: DocArticlePage;
  /** The section's page tree (sidebar). */
  tree: Root;
}

/**
 * The words this site uses for the four things a documentation screen names.
 *
 * Every one of them is a word a reader hears, which is why the design system makes
 * all four required rather than defaulting them: a Page that ships no copy ships no
 * reader-facing copy either. The nouns are this site's own, because a site that
 * files four sections of documentation wants those sections called what its
 * readers meet in the contents of the section index.
 */
export const DOCS_LABELS = {
  nav: 'Atlas documentation',
  toc: 'On this page',
  pager: 'Documentation pages',
} as const;

/** The two words the pager renders above its neighbours' titles. */
export const DOCS_PAGER_LABELS = { previous: 'Previous', next: 'Next' } as const;

export function DocArticle({ page, tree }: DocArticleProps): ReactNode {
  const MDX = page.data.body;

  return (
    <DocsShell
      title={page.data.title}
      description={page.data.description}
      nav={toPrismTree(tree.children)}
      toc={toPrismToc(page.data.toc) as DocsNavEntry[] | undefined}
      currentHref={page.url}
      navLabel={DOCS_LABELS.nav}
      tocLabel={DOCS_LABELS.toc}
      pagerLabel={DOCS_LABELS.pager}
      pagerLabels={DOCS_PAGER_LABELS}
    >
      <MDX components={getMdxComponents({ itemKey: page.url.replace(/^\//, '') })} />
    </DocsShell>
  );
}
