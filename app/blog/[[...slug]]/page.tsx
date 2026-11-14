import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactElement } from 'react';
import { BlogPostPage } from '@nanisoft/prism-ui/pages/blog-post-page';
import { Section, SectionHeading } from '@nanisoft/prism-ui/components/section';
import { DSStack } from '@nanisoft/prism-ui/components/ds-stack';
import { ListPanel } from '@nanisoft/prism-ui/components/list-panel';
import { Item } from '@nanisoft/prism-ui/components/item';
import { Text } from '@nanisoft/prism-ui/components/typography';
import { TagGroup } from '@nanisoft/prism-ui/components/tag-group';

import { getMdxComponents } from '@/lib/mdx-components';
import { JsonLd } from '@/components/json-ld';
import { SiteChrome } from '@/components/site-chrome';
import { blogSource } from '@/lib/source';
import { displayDate, isoDate } from '@/lib/post-date';

// Optional catch-all: `/blog` renders the reverse-chronological index,
// `/blog/<slug>` the post. The optional root keeps the static export
// satisfiable while the blog is empty. Drafts are excluded from params, the
// index, and prev/next — they cannot be reached.

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

/**
 * Published posts, newest first.
 *
 * **The second key is not decoration.** All four launch posts carry the same date, and
 * the one-key comparator this used to sort by (`a < b ? 1 : -1`) returns `-1` in both
 * directions for a tie, which is not a consistent ordering: the sort falls back to the
 * order `getPages()` happens to return, and that is directory order. So the index and
 * the whole previous/next trail were a property of the checkout rather than a
 * property of the corpus, and could reorder between a maintainer's machine and CI's
 * without a single byte of the repository changing.
 *
 * The tie is broken on the URL, which is stable, derived from the folder name, and
 * cannot change without a post changing its address. The result is a defined order for
 * a set of posts that is not otherwise ordered by time.
 */
function published() {
  return blogSource
    .getPages()
    .filter((post) => !post.data.draft)
    .sort((a, b) =>
      a.data.date === b.data.date ? a.url.localeCompare(b.url) : a.data.date < b.data.date ? 1 : -1,
    );
}

export function generateStaticParams(): Array<{ slug?: string[] }> {
  // The root entry (`/blog`) is required under `output: export` for an
  // optional catch-all — and it keeps the section buildable while empty.
  return [{ slug: undefined }, ...published().map((post) => ({ slug: post.slugs }))];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug) {
    return {
      title: 'Blog',
      alternates: { canonical: '/blog' },
      description: 'Notes from the Atlas build: the twin, the lakehouse behind it, and what composing open source buys.',
    };
  }
  const page = blogSource.getPage(slug);
  if (!page) return {};
  return {
    title: page.data.title,
    description: page.data.description,
    alternates: { canonical: page.url },
  };
}

/**
 * The words this site uses for the two things a post screen names.
 *
 * Both are the caller's, because both are words a reader hears and the design
 * system makes no choice between them: this site files its posts newest-last, so
 * "Previous" is the older post and "Next" is the newer one, and a site that filed
 * them the other way round would want the opposite pair.
 */
const TRAIL_LABELS = { previous: 'Previous', next: 'Next' } as const;

export default async function BlogPage({ params }: PageProps): Promise<ReactElement> {
  const { slug } = await params;

  // The index is this site's own list, for the reason the design system gives
  // for shipping none: four blog lists in this family are four deliberate
  // designs, and an index the design system owned would be a design three of
  // them had to argue with. The frame below is the design system's.
  if (!slug) {
    const posts = published();
    return (
      <SiteChrome current="/blog">
        <Section>
          <DSStack gap="lg">
            <SectionHeading
              as="h1"
              align="left"
              title="Notes from the build"
              description="Why a produced twin beats assembled dashboards, how a graph earns trust, and what it costs to compose instead of fork."
            />
            {posts.length === 0 ? (
              <Text tone="muted">Nothing published yet. The first post is being written.</Text>
            ) : (
              <ListPanel label="Blog posts" scroll={false}>
                <ul>
                  {posts.map((post) => (
                    <li key={post.url}>
                      <Item
                        entry={{
                          id: post.url,
                          title: post.data.title,
                          description: post.data.description,
                          meta: (
                            <DSStack gap="xs">
                              <Text as="span" size="sm" tone="muted">
                                <time dateTime={isoDate(post.data.date)}>{displayDate(post.data.date)}</time>
                              </Text>
                              {post.data.tags.length > 0 && (
                                <TagGroup tags={post.data.tags.map((tag) => ({ id: tag, label: tag }))} />
                              )}
                            </DSStack>
                          ),
                          href: post.url,
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </ListPanel>
            )}
          </DSStack>
        </Section>
      </SiteChrome>
    );
  }

  const page = blogSource.getPage(slug);
  if (!page || page.data.draft) notFound();

  // Chronological previous/next across published posts: the oldest post has
  // nothing before it and the newest has nothing after, and the Page renders
  // only the halves it is given, so neither promise is one the site cannot keep.
  const chronological = [...published()].reverse();
  const at = chronological.findIndex((post) => post.url === page.url);
  const previous = at > 0 ? chronological[at - 1] : undefined;
  const next = at >= 0 && at < chronological.length - 1 ? chronological[at + 1] : undefined;

  const MDX = page.data.body;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: page.data.title,
    description: page.data.description,
    datePublished: isoDate(page.data.date),
    inLanguage: 'en',
    url: `https://atlas.nanisoft.com${page.url}`,
    mainEntityOfPage: `https://atlas.nanisoft.com${page.url}`,
    author: { '@type': 'Organization', name: 'NaniSoft', url: 'https://nanisoft.com' },
    publisher: { '@type': 'Organization', name: 'NaniSoft', url: 'https://nanisoft.com' },
  };

  return (
    <SiteChrome current="/blog">
      <JsonLd data={jsonLd} />
      <BlogPostPage
        title={page.data.title}
        description={page.data.description}
        date={displayDate(page.data.date)}
        dateTime={isoDate(page.data.date)}
        tags={page.data.tags.map((tag) => ({ label: tag }))}
        previous={previous && { title: previous.data.title, href: previous.url }}
        next={next && { title: next.data.title, href: next.url }}
        trailLabels={TRAIL_LABELS}
        trailLabel="More posts"
      >
        <MDX components={getMdxComponents({ itemKey: page.url.replace(/^\//, '') })} />
      </BlogPostPage>
    </SiteChrome>
  );
}
