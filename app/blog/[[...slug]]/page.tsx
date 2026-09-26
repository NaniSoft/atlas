import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactElement } from 'react';
import Link from 'next/link';
import { BlogLayout } from '@nanisoft/prism-ui/pages';

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

export default async function BlogPage({ params }: PageProps): Promise<ReactElement> {
  const { slug } = await params;

  if (!slug) {
    const posts = published();
    return (
      <div className="site-index site-index--blog">
        <BlogLayout header={<BlogIndexHeader />}>
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
        </BlogLayout>
      </div>
    );
  }

  const page = blogSource.getPage(slug);
  if (!page || page.data.draft) notFound();

  // Chronological prev/next across published posts.
  const chronological = [...published()].reverse();
  const index = chronological.findIndex((post) => post.url === page.url);
  const previous = index > 0 ? chronological[index - 1] : undefined;
  const next = index >= 0 && index < chronological.length - 1 ? chronological[index + 1] : undefined;

  const MDX = page.data.body;

  return (
    <div className="site-index site-index--blog">
      <BlogLayout frontmatter={page.data}>
        <div className="site-prose">
          <MDX components={getMdxComponents({ itemKey: page.url.replace(/^\//, '') })} />
        </div>
        <nav className="prism-docs-shell__neighbours">
          {previous && (
            <Link href={previous.url} rel="prev">
              ← {previous.data.title}
            </Link>
          )}
          {next && (
            <Link href={next.url} rel="next" style={{ marginLeft: 'auto' }}>
              {next.data.title} →
            </Link>
          )}
        </nav>
      </BlogLayout>
    </div>
  );
}

function BlogIndexHeader(): ReactElement {
  return (
    <header className="site-index__head">
      <p className="site-index__eyebrow">atlas · blog</p>
      <h1 className="site-index__title">Notes from the build</h1>
      <p className="site-index__lede">
        Why a produced twin beats assembled dashboards, how a graph earns trust, and what it costs to
        compose instead of fork.
      </p>
    </header>
  );
}
