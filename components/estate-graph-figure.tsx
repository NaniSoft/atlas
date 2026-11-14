// The estate as one graph: the drawing behind the first of the twin's three points.
//
// It is a transcription, not an illustration. The words it draws are the words
// `WHAT_IT_IS[0]` already publishes: four kinds of source become nodes, and three
// kinds of relationship become edges. Nothing here adds a claim the copy does not
// make, which is the same test the hero's running figure is held to, and it is why
// the source names below are the copy's own words rather than invented ones.
//
// The drawing is a Diagram: four sources converge on one emphasis node — the one
// graph — and every relation carries the word `conform`, the boundary the records
// cross. The three kinds of relationship live in the centre node's subtitle so
// no word the copy states is lost when the hand-drawn legend is gone. The frame
// is the design system's: `InstrumentPanel01` owns the border, the bar, the
// radius and the pack beneath it.
//
// It is a server component: no hook, no state, no client code, and no `'use client'`
// line, so it costs the page no JavaScript. `test/server-only.test.ts` holds the whole
// tree to that.

import { Diagram } from '@nanisoft/prism-ui/components/diagram';
import { InstrumentPanel01 } from '@nanisoft/prism-ui/blocks/instrument-panel-01';

import { ESTATE_FIGURE } from '@/lib/content/landing';

/** The four kinds of source the copy names, down one column. */
const SOURCES = ['Directory', 'HR system', 'Database', 'Application'] as const;

/** The convergence: one graph, carrying the three edge kinds in its subtitle. */
const TWIN = {
  id: 'twin',
  name: 'One graph',
  subtitle: 'membership · grant · activity',
  x: 100,
  y: 50,
  emphasis: true,
} as const;

export function EstateGraphFigure() {
  return (
    <InstrumentPanel01
      label={ESTATE_FIGURE.panel.label}
      footnote={ESTATE_FIGURE.panel.footnote}
      caption={ESTATE_FIGURE.caption}
    >
      <Diagram
        label={ESTATE_FIGURE.caption}
        nodes={[
          ...SOURCES.map((name, index) => ({
            id: name,
            name,
            x: 0,
            y: 15 + index * 23,
          })),
          { ...TWIN },
        ]}
        relations={SOURCES.map((name) => ({ from: name, to: TWIN.id, label: 'conform' }))}
      />
    </InstrumentPanel01>
  );
}
