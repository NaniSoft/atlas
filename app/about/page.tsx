import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { CtaLink } from '@nanisoft/prism-ui/components/cta-link';
import { Prose } from '@nanisoft/prism-ui/components/prose';
import { Section, SectionHeading } from '@nanisoft/prism-ui/components/section';
import { NoteGrid01 } from '@nanisoft/prism-ui/blocks/note-grid-01';

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

/**
 * The one place on this page a link is not a whole-row anchor.
 *
 * The three ways on are real anchors with the destinations they name, and the
 * playground opens in a new tab because it is the one destination off this site
 * that a reader follows to come back.
 */
const KEEP_GOING: ReadonlyArray<{ label: string; href: string; newTab?: boolean }> = [
  { label: 'Read the docs', href: '/docs' },
  { label: 'Read the blog', href: '/blog' },
  { label: 'Open the playground', href: 'https://playground.nanisoft.com', newTab: true },
];

/**
 * About, composed from the design system's own pieces and this site's own words.
 *
 * The frame is the design system's: a `Section` with a `SectionHeading` for the
 * title, a `Prose` at the measure for the story, a `NoteGrid01` for the three
 * capabilities, and `CtaLink` for the ways on. What the design system does not ship
 * is the two-column reading column the old page had, and this page does not ask for
 * one: the design system's container is the measure, and a second measure inside it
 * is the thing the design system's own documentation calls out as the defect prose
 * exists to remove.
 */
export default function AboutPage(): ReactElement {
  return (
    <>
      <Section>
        <SectionHeading
          as="h1"
          align="left"
          eyebrow="atlas · about"
          title="A living map of the systems you already run."
          description="Atlas models the real world digitally — living representations of systems, assets, and operations. In practice, today, that means one thing done thoroughly: the IT estate, turned into a queryable graph."
        />
      </Section>

      <Section>
        <SectionHeading as="h2" align="left" title="From estates to a twin" />
        <Prose>
          {STORY.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </Prose>
      </Section>

      <NoteGrid01 headingLevel="h2" title="What Atlas does" notes={CAPABILITIES} />

      <Section>
        <SectionHeading as="h2" align="left" title="Where the honesty lives" />
        <Prose>
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
        </Prose>
      </Section>

      <Section>
        <SectionHeading as="h2" align="left" title="Keep going" />
        <div className="site-actions">
          {KEEP_GOING.map((link, index) => (
            <CtaLink
              key={link.href}
              href={link.href}
              variant={index === 0 ? 'default' : 'outline'}
              newTab={link.newTab}
            >
              {link.label}
            </CtaLink>
          ))}
        </div>
      </Section>
    </>
  );
}
