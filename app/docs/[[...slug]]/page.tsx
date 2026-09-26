import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactElement } from 'react';
import { findNeighbour } from 'fumadocs-core/page-tree';

import { DocArticle } from '@/components/doc-article';
import { SectionIndex, type IndexGroup } from '@/components/section-index';
import { docsSource } from '@/lib/source';

// Optional catch-all: `/docs` renders the section index, `/docs/<section>/<slug>`
// the guide. The optional root keeps the static export satisfiable even while
// the corpus is empty (Next requires every dynamic route to emit at least one
// page under `output: export`).

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export function generateStaticParams(): Array<{ slug?: string[] }> {
  // The root entry (`/docs`) is required under `output: export` for an
  // optional catch-all — and it keeps the section buildable while empty.
  return [{ slug: undefined }, ...docsSource.generateParams()];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug) {
    return {
      title: 'Docs',
      description:
        'The Atlas docs — the twin, the lakehouse path behind it, traversal and policy, and the platform it is produced on.',
    };
  }
  const page = docsSource.getPage(slug);
  if (!page) return {};
  return { title: page.data.title, description: page.data.description };
}

/** The docs IA (ticket 07 §3), read off the content tree's own folders. */
const IA: ReadonlyArray<{ folder: string; group: string }> = [
  { folder: 'concepts', group: 'Concepts' },
  { folder: 'architecture', group: 'Architecture' },
  { folder: 'guides', group: 'Guides' },
  { folder: 'reference', group: 'Reference' },
];

function docGroups(): IndexGroup[] {
  const pages = docsSource.getPages();
  const groups: IndexGroup[] = [];
  for (const section of IA) {
    const items = pages
      .filter((page) => page.slugs[0] === section.folder)
      .map((page) => ({
        title: page.data.title ?? page.url,
        description: page.data.description,
        url: page.url,
      }));
    if (items.length > 0) groups.push({ group: section.group, items });
  }
  // Anything outside the declared IA still ships — never a dead page.
  const rest = pages
    .filter((page) => !IA.some((section) => section.folder === page.slugs[0]))
    .map((page) => ({ title: page.data.title ?? page.url, description: page.data.description, url: page.url }));
  if (rest.length > 0) groups.unshift({ group: 'Start here', items: rest });
  return groups;
}

export default async function DocsPage({ params }: PageProps): Promise<ReactElement> {
  const { slug } = await params;

  if (!slug) {
    return (
      <SectionIndex
        title="Atlas docs"
        description="Atlas models the real world digitally; its first proven domain is the IT estate. These docs cover the twin itself, the lakehouse path that produces it, and what you can ask of it today."
        groups={docGroups()}
        emptyMessage="No docs yet."
      />
    );
  }

  const page = docsSource.getPage(slug);
  if (!page) notFound();

  const tree = docsSource.getPageTree();
  const neighbour = findNeighbour(tree, page.url);

  return (
    <DocArticle
      page={page}
      tree={tree}
      neighbours={{
        previous: neighbour.previous && { title: String(neighbour.previous.name), url: neighbour.previous.url },
        next: neighbour.next && { title: String(neighbour.next.name), url: neighbour.next.url },
      }}
    />
  );
}
