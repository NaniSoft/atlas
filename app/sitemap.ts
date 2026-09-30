// The sitemap, and the one thing this site publishes that no gate checks.
//
// The `links` gate proves that every destination a reader can click resolves to
// something this site emits. It says nothing about discovery: a page nothing links to
// is reachable and unfound, and 19 documentation pages filed under four section
// folders are exactly that. There was no sitemap and no robots file, so a crawler
// arriving at a section folder and a crawler arriving at a leaf page had the same
// instructions and neither had a map.
//
// It is emitted from the same two sources the pages themselves are rendered from, so
// a post that is drafted, or a doc that is deleted, leaves the sitemap by being
// removed from the corpus rather than by being remembered here.

import type { MetadataRoute } from 'next';

import { blogSource, docsSource } from '@/lib/source';

const ORIGIN = 'https://atlas.nanisoft.com';

/** See `app/robots.ts`: a route handler is dynamic by default and this is a static export. */
export const dynamic = 'force-static';

/** A change frequency is a claim, so only the two this site can actually stand behind. */
const STATIC_ROUTES: ReadonlyArray<{ path: string; changeFrequency: 'weekly' | 'monthly' }> = [
  { path: '/', changeFrequency: 'weekly' },
  { path: '/docs', changeFrequency: 'weekly' },
  { path: '/blog', changeFrequency: 'weekly' },
  { path: '/about', changeFrequency: 'monthly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = blogSource
    .getPages()
    .filter((post) => !post.data.draft)
    .map((post) => ({
      url: `${ORIGIN}${post.url}`,
      // The post's own date is a real publication date and is the only one this site
      // has. The documentation corpus carries no date at all, so none is invented for
      // it: a `lastModified` nobody maintains is worse than none.
      lastModified: post.data.date,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  const docs = docsSource.getPages().map((page) => ({
    url: `${ORIGIN}${page.url}`,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const top = STATIC_ROUTES.map((route) => ({
    url: `${ORIGIN}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.path === '/' ? 1 : 0.9,
  }));

  return [...top, ...docs, ...posts];
}
