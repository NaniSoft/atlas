import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Atlas, the Digital Twin Platform — why it models the real world digitally, and why the IT estate came first.',
};

// The product's story (ticket 07: estates → twin → traversal) — not the team's.
// The old site's company-level about copy stays on www; the substance of what
// it said about the twin migrates here, re-framed from the product's side.
// Every honesty device carries over: statuses stated, the playground always
// "fully mocked".

const STORY: ReadonlyArray<string> = [
  'Estates were hard to reason about before they were mapped. Almost every team could answer a question about one system, and almost none could answer a question that crossed three.',
  'Atlas exists because assembling exports was never going to close that gap. So the twin is produced instead: a graph off a real data platform, with quality gates and versioned layers, that stays trustworthy as the estate changes.',
  'The first use case is access traversal, and it is available today. Blast radius and stale-access cleanup follow, off the same graph — designed, not yet built, and labelled that way everywhere they appear.',
];

const CAPABILITIES: ReadonlyArray<{ title: string; body: string }> = [
  {
    title: 'Produce the twin',
    body: 'Ingest, conform, and resolve source data into a versioned graph — Bronze to Gold — with quality gates at every boundary.',
  },
  {
    title: 'Serve traversals',
    body: 'Atlas answers questions by traversal, checks each one against policy, and writes an audit trail. Compass exposes the twin as an explorable graph.',
  },
  {
    title: 'Compose open source',
    body: 'Sixteen off-the-shelf products run unmodified behind codenames; four components are built in-house. No forks, no snowflake deployments.',
  },
];

export default function AboutPage(): ReactElement {
  return (
    <article className="site-about">
      <header className="site-about__head">
        <p className="al-eyebrow">atlas · about</p>
        <h1 className="site-about__title">A living map of the systems you already run.</h1>
        <p className="site-about__lede">
          Atlas models the real world digitally — living representations of systems, assets, and
          operations. In practice, today, that means one thing done thoroughly: the IT estate, turned
          into a queryable graph.
        </p>
      </header>

      <section className="site-about__section">
        <h2>From estates to a twin</h2>
        {STORY.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </section>

      <section className="site-about__section">
        <h2>What Atlas does</h2>
        <div className="site-about__caps">
          {CAPABILITIES.map((capability) => (
            <div className="site-about__cap" key={capability.title}>
              <h3>{capability.title}</h3>
              <p>{capability.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="site-about__section">
        <h2>Where the honesty lives</h2>
        <p>
          One use case is <strong>available today</strong>; two are <strong>planned</strong>. The{' '}
          <a href="https://playground.nanisoft.com" target="_blank" rel="noopener noreferrer">
            playground
          </a>{' '}
          is a fully mocked, in-browser tour of the twin — nothing to install and no real data in it.
          The platform&rsquo;s component model is a published package, so every codename can be
          unwrapped to the off-the-shelf product behind it.
        </p>
        <p>
          Nothing on this site claims a second domain before one exists. When Atlas models something
          other than an IT estate, this page will say so.
        </p>
      </section>

      <section className="site-about__section site-about__section--links">
        <h2>Keep going</h2>
        <div className="site-about__links">
          <Link href="/docs">Read the docs</Link>
          <Link href="/blog">Read the blog</Link>
          <a href="https://playground.nanisoft.com" target="_blank" rel="noopener noreferrer">
            Open the playground
          </a>
        </div>
      </section>
    </article>
  );
}
