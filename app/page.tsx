import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { CtaLink } from '@nanisoft/prism-ui/components/cta-link';
import { Section } from '@nanisoft/prism-ui/components/section';
import { Cta01 } from '@nanisoft/prism-ui/blocks/cta-01';
import { FeatureGrid01 } from '@nanisoft/prism-ui/blocks/feature-grid-01';
import { Hero01 } from '@nanisoft/prism-ui/blocks/hero-01';
import { InstrumentPanel01 } from '@nanisoft/prism-ui/blocks/instrument-panel-01';
import { LogoStrip01 } from '@nanisoft/prism-ui/blocks/logo-strip-01';
import { NoteGrid01 } from '@nanisoft/prism-ui/blocks/note-grid-01';
import {
  ProcessRail01,
  type ProcessRail01Steps,
} from '@nanisoft/prism-ui/blocks/process-rail-01';
import { ProductGrid01 } from '@nanisoft/prism-ui/blocks/product-grid-01';
import { StackGrid01 } from '@nanisoft/prism-ui/blocks/stack-grid-01';
import { StatusLedger01 } from '@nanisoft/prism-ui/blocks/status-ledger-01';
import { PulseGraph } from '@nanisoft/prism-ui/components/pulse-graph';

import {
  BUILT_ON_NEXUS,
  DAG_ARIA,
  DAG_PULSE,
  DATA_PATH,
  DATA_PATH_LEDE,
  FINAL_CTA,
  HERO,
  HOW_BUILT_LEDE,
  IN_HOUSE,
  INTEGRATIONS_NOTE,
  PATH_FEATURES,
  STACK_PRODUCTS,
  STATUS_LABEL,
  TICKER,
  TICKER_LABEL,
  USE_CASES,
  USE_CASES_LEDE,
  USE_CASES_MORE,
  WHAT_IT_IS,
  WHAT_IT_IS_LEDE,
} from '@/lib/content/landing';

export const metadata: Metadata = {
  /**
   * The product frame first (ticket 07's migration law), the flagship
   * instance second — the same order the hero reads in.
   *
   * **The title is absolute, and the port does not disturb it.** This is the one
   * page in this repository that publishes its title with `absolute`, so the
   * layout's `%s · Atlas` template is not applied to it, and the dash in the
   * middle is a published byte rather than punctuation. `test/smoke.test.tsx`
   * pins this string so that a later change has to be deliberate, and the
   * content-parity ledger records it as unchanged on this route.
   */
  description:
    'Atlas models the real world digitally — living representations of systems, assets, and operations. Its first proven domain: a digital twin of the IT estate.',
  title: {
    absolute: 'Atlas — Model the real world digitally',
  },
};

/**
 * The data path as a rail, and the one place on this page where a cast is load-bearing.
 *
 * The Block's `steps` is a union of tuples rather than an array, so a fifth stage is
 * a compile error and not a fifth column, and the four this page states are the
 * number the rail admits. `.map` cannot produce a tuple, so the length is checked at
 * runtime before the cast: a cast alone would let a fifth stage through and defeat
 * the one thing the type is there to say.
 */
function dataPathSteps(): ProcessRail01Steps {
  const steps = DATA_PATH.map((stage) => ({ name: stage.title, description: stage.body }));
  if (steps.length !== 4) {
    throw new Error(
      `app/page.tsx: the data path states ${steps.length} stages and ProcessRail01 admits four. A fifth ` +
        'stage is a different shape of section, not a fifth column.',
    );
  }
  return steps as unknown as ProcessRail01Steps;
}

/* ------------------------------------------------------------------ *
 * The landing
 * ------------------------------------------------------------------ */

/**
 * The landing, composed from the design system's catalogue and nothing else.
 *
 * This file is composition and nothing else: every word is in
 * `lib/content/landing.ts` and every claim about a pack is in `lib/site.json` or in
 * the Block that draws it. There is no local component here and no local landing
 * stylesheet, which is the point of the migration: the old page needed a client
 * boundary, a scroll-reveal observer, a canvas, a hand-written graph, a
 * hand-written conveyor, a hand-written ledger, a hand-written survey grid and a
 * hand-written product row, plus twenty-nine kilobytes of CSS, to draw what nine
 * catalogue items draw.
 *
 * It is a server component. It ships no client JavaScript, takes no hook, reads no
 * context and needs no provider mounted above it, because every item resolves its
 * colours through the cascade rather than by reading a value once at mount.
 *
 * **The order is the site's, and the section indices are published copy.** Sections
 * 01 to 05 render in the order they have always rendered in, each carrying its own
 * index and label. A Block that owns its own heading takes the index as that
 * heading's eyebrow, which is the one slot a Block offers for a machine annotation
 * above a title, so the string rendered is the same string either way.
 *
 * **Two regions carry a second pack, and both are in `scripts/pack-map.json`.** The
 * product section and the header's switcher. Every one of those boundaries lands on a
 * `ProductMark`, which is a fully rounded disc, and nowhere else, because a boundary
 * re-points `--radius` as well as the colour and anything that is not fully rounded
 * changes shape with its pack.
 */
export default function Landing(): ReactElement {
  return (
    <>
      {/* The thesis, the page's own h1, and the pipeline running beside it.

          The band is the design system's rather than this page's: the column split,
          the gap and the width at which the columns stack are one decision made
          once, in the place that owns the container contract. The old band was four
          site classes and a media query, hand-written here because no Block offered
          a hero with a figure in it.

          The figure is the same twelve nodes and fifteen edges the static drawing
          used, on the same geometry, with the pipeline's own columns marked as lanes
          so a rail runs under them and a marker travels it. Nothing in the picture is
          new: a reader who stops every animation is looking at the drawing this
          page shipped before, which is the test the second law of motion sets. */}
      <Hero01
        headingLevel="h1"
        eyebrow={`${HERO.eyebrow} — ${HERO.positioning}`}
        title={
          <>
            {HERO.h1Leading}
            <em>{HERO.h1Em}</em>
            {HERO.h1Trailing}
          </>
        }
        description={HERO.sub}
        actions={[
          { ...USE_CASES_MORE.cta, newTab: true },
          { ...FINAL_CTA.secondary, variant: 'outline' as const },
        ]}
        instrument={
          <InstrumentPanel01
            label={DAG_PULSE.panel.label}
            state="live"
            stateLabel={DAG_PULSE.panel.mode}
            caption={DAG_ARIA}
            footnote={DAG_PULSE.panel.footnote}
          >
            <PulseGraph
              nodes={DAG_PULSE.nodes}
              relations={DAG_PULSE.relations}
              label={DAG_ARIA}
            />
          </InstrumentPanel01>
        }
      />

      {/* The transition band between the thesis and the first numbered section: the
          page's honesty devices, up front, where a reader meets them before any
          claim. */}
      <LogoStrip01 items={[...TICKER]} label={TICKER_LABEL} />

      {/* 01, the twin itself. Three instruments. */}
      <NoteGrid01
        eyebrow="01"
        title="The twin — what it is"
        description={WHAT_IT_IS_LEDE}
        notes={WHAT_IT_IS.map((card) => ({ title: card.title, body: card.body }))}
      />

      {/* 02, the data path. The rail admits four steps and refuses five in the type,
          and this page states four, so it is the one section the rail is the right
          item for. The step numbers are the rail's own, drawn from each step's
          position in the sequence, and the last step carries the label the old
          conveyor printed on its far end. */}
      <ProcessRail01
        eyebrow="02"
        title="The data path — lakehouse to twin"
        description={DATA_PATH_LEDE}
        finalLabel="serving"
        steps={dataPathSteps()}
      />

      {/* The six things the lakehouse path is made of. They were six h4s under a
          hand-written rule before; a card's title is not a heading, which is a real
          loss for a reader navigating by heading and is the design system's decision
          rather than this site's. */}
      <FeatureGrid01
        variant="bare"
        features={PATH_FEATURES.map((feature) => ({ title: feature.title, body: feature.body }))}
      />

      {/* 03, the use cases, with the statuses visible. The tier is the design
          system's four and the words are this product's, which is the whole reason
          the Block takes both. The playground link has no slot on the item that
          draws this section, so it is a real anchor directly under the ledger
          rather than a sentence with a link welded into it. */}
      <StatusLedger01
        eyebrow="03"
        title="Use cases — one twin, many questions"
        description={USE_CASES_LEDE}
        rows={USE_CASES.map((useCase) => ({
          name: useCase.title,
          status: useCase.status,
          statusLabel: STATUS_LABEL[useCase.status],
          bullets: [...useCase.bullets],
        }))}
        caption={USE_CASES_MORE.line}
      />
      <Section className="site-band">
        <CtaLink href={USE_CASES_MORE.cta.href} variant="outline" newTab>
          {USE_CASES_MORE.cta.label}
        </CtaLink>
      </Section>

      {/* 04, how it is built: the survey of composed parts, then the four that are
          ours. The real product name under each codename has no slot on the item
          that draws this section, so it is a loss of published copy and it is
          reported rather than rewritten into the role line. Filed against the
          design system as a field on `StackPart`, counted per consumer. */}
      <StackGrid01
        eyebrow="04"
        title="How it’s built — compose, don’t fork"
        description={HOW_BUILT_LEDE}
        parts={STACK_PRODUCTS.map((product) => ({ name: product.name, role: product.role }))}
        own={IN_HOUSE.map((component) => ({ name: component.name, blurb: component.blurb }))}
        ownLabel="built in-house"
        caption={INTEGRATIONS_NOTE}
      />

      {/* 05, the platform story. One of the two bands that carry a second pack: each
          row's mark is its product's own boundary, and the mark is the only element
          in this section that carries one. */}
      <ProductGrid01
        eyebrow="05"
        title="Built on Nexus — one platform, one factory"
        description={BUILT_ON_NEXUS.lede}
        products={BUILT_ON_NEXUS.products.map((product) => ({
          id: product.id,
          name: product.name,
          pack: product.pack,
          tagline: product.tagline,
          href: product.url,
          newTab: true,
        }))}
        caption={BUILT_ON_NEXUS.body}
      />

      {/* The closing band. Both actions are anchors, and that is the one rendered
          change the whole migration exists to make: the old page passed a destination
          to a component that rendered a button, so the page's primary action was
          announced as a command that navigated nothing. */}
      <Cta01
        title={FINAL_CTA.h2}
        action={{ ...FINAL_CTA.primary, newTab: true }}
        secondaryAction={FINAL_CTA.secondary}
        note={FINAL_CTA.footnote}
      />
    </>
  );
}
