import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactElement } from 'react';
import Link from 'next/link';
import { BlogPostPage } from '@nanisoft/prism-ui/pages/blog-post-page';

import { getMdxComponents } from '@/lib/mdx-components';
import { blogSource } from '@/lib/source';

// Optional catch-all: `/blog` renders the reverse-chronological index,
// `/blog/<slug>` the post. The optional root keeps the static export
// satisfiable while the blog is empty. Drafts are excluded from params, the
// index, and prev/next — they cannot be reached.

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

function published() {
  return blogSource
    .getPages()
    .filter((post) => !post.data.draft)
    .sort((a, b) => (a.data.date < b.data.date ? 1 : -1));
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
      description: 'Notes from the Atlas build — the twin, the lakehouse behind it, and what composing open source buys.',
    };
  }
  const page = blogSource.getPage(slug);
  if (!page) return {};
  return { title: page.data.title, description: page.data.description };
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
      <div className="site-index site-index--blog">
        <header className="site-index__head">
          <p className="site-index__eyebrow">atlas · blog</p>
          <h1 className="site-index__title">Notes from the build</h1>
          <p className="site-index__lede">
            Why a produced twin beats assembled dashboards, how a graph earns trust, and what it costs to
            compose instead of fork.
          </p>
        </header>
        {posts.length === 0 ? (
          <p className="site-empty">
            Nothing published yet. Posts land as <code>content/blog/&lt;slug&gt;/index.mdx</code> —
            folder-per-post, required date, display-only tags.
          </p>
        ) : (
          <ul className="site-blog-list">
            {posts.map((post) => (
              <li key={post.url}>
                <Link href={post.url} className="site-blog-list__title">
                  {post.data.title}
                </Link>
                <p className="site-blog-list__description">{post.data.description}</p>
                <p className="site-mono site-blog-list__meta">
                  <time dateTime={post.data.date}>{post.data.date}</time>
                  {post.data.tags.length > 0 && <span> · {post.data.tags.join(' · ')}</span>}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
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

  return (
    <BlogPostPage
      title={page.data.title}
      description={page.data.description}
      date={page.data.date}
      dateTime={page.data.date}
      tags={page.data.tags.map((tag) => ({ label: tag }))}
      previous={previous && { title: previous.data.title, href: previous.url }}
      next={next && { title: next.data.title, href: next.url }}
      trailLabels={TRAIL_LABELS}
      trailLabel="More posts"
    >
      <MDX components={getMdxComponents({ itemKey: page.url.replace(/^\//, '') })} />
    </BlogPostPage>
  );
}
