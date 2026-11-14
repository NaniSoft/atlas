// One traversal: the drawing behind the flagship use case.
//
// The three paths it draws are the three the copy already publishes under
// `USE_CASES[0]` — group membership, a direct grant, and an inherited right —
// and the gate every one of them passes through is the policy check
// `DATA_PATH[3]` already states. The picture exists because that sentence is
// the product's flagship claim.
//
// The drawing is a Diagram: one person, three step nodes down the middle
// carrying the three routes' names, one sensitive product under emphasis. The
// relations into the steps say `viewed`; the relations out to the product say
// `checked`, the policy check the copy states. The frame is the design
// system's `InstrumentPanel01`.
//
// It is a server component, and `test/server-only.test.ts` holds it to that.

import { Diagram } from '@nanisoft/prism-ui/components/diagram';
import { InstrumentPanel01 } from '@nanisoft/prism-ui/blocks/instrument-panel-01';

import { TRAVERSAL_FIGURE } from '@/lib/content/landing';

/** The three ways a person reaches a product — the copy's own phrases. */
const STEPS = ['Membership', 'Direct grant', 'Inherited right'] as const;

export function TraversalFigure() {
  return (
    <InstrumentPanel01
      label={TRAVERSAL_FIGURE.panel.label}
      footnote={TRAVERSAL_FIGURE.panel.footnote}
      caption={TRAVERSAL_FIGURE.caption}
    >
      <Diagram
        label={TRAVERSAL_FIGURE.caption}
        nodes={[
          { id: 'person', name: 'One person', x: 0, y: 50 },
          ...STEPS.map((name, index) => ({ id: name, name, x: 50, y: 12 + index * 38 })),
          { id: 'product', name: 'Sensitive product', subtitle: 'checked against policy', x: 100, y: 50, emphasis: true },
        ]}
        relations={[
          ...STEPS.map((name) => ({ from: 'person', to: name, label: 'viewed' })),
          ...STEPS.map((name) => ({ from: name, to: 'product', label: 'checked' })),
        ]}
      />
    </InstrumentPanel01>
  );
}
