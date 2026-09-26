import type { ReactNode } from 'react';
import Link from 'next/link';

export default function NotFound(): ReactNode {
  return (
    <div className="site-404">
      <p className="al-eyebrow">atlas · 404</p>
      <h1 className="site-404__title">No node here.</h1>
      <p className="site-404__body">
        This page does not exist (yet). The estate is fully mapped — this URL just is not in the graph.
      </p>
      <div className="site-404__links">
        <Link href="/">Back to the landing</Link>
        <Link href="/docs">Read the docs</Link>
        <Link href="/blog">Read the blog</Link>
      </div>
    </div>
  );
}
