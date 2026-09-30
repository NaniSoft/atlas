// One traversal: the drawing behind the flagship use case.
//
// **It is a transcription, not an illustration.** The three paths it draws are the
// three the copy already publishes under `USE_CASES[0]` — group membership, a direct
// grant, and an inherited right — and the gate every one of them passes through is the
// policy check `DATA_PATH[3]` already states. The picture exists because that
// sentence is the product's flagship claim and, before this figure, nothing on the
// page showed it.
//
// **The three paths are different lengths on purpose.** A traversal that returns one
// answer per edge would be a lookup, and a lookup is not what traversal means: what
// traversal means is that the same question is answered from every direction at once
// and reconciled. Three routes of three different shapes into one resource is the
// smallest drawing that says that.
//
// **The frame is the design system's** and the colours are tokens, for the same two
// reasons as `estate-graph-figure.tsx`: `InstrumentPanel01` owns the frame, and every
// colour here is a class in `app/globals.css` so a pack boundary repaints the whole
// figure. No hex value appears in this file.
//
// It is a server component, and `test/server-only.test.ts` holds it to that.

import { InstrumentPanel01 } from '@nanisoft/prism-ui/blocks/instrument-panel-01';

import { TRAVERSAL_FIGURE } from '@/lib/content/landing';

/**
 * The three ways a person reaches a product.
 *
 * Each label is the copy's own phrase from the bullet under `USE_CASES[0]`, and there
 * is deliberately no second line under any of them. There was one, and it restated
 * each label in English — "Inherited right" over "through a nested group" — which is a
 * sentence saying the same thing twice, in a figure whose whole argument is that it
 * says each thing once.
 */
const PATHS = [
  { label: 'Membership', y: 44 },
  { label: 'Direct grant', y: 106 },
  { label: 'Inherited right', y: 168 },
] as const;

const PERSON = { x: 0, y: 90, w: 76, h: 32 } as const;
const RESOURCE = { x: 292, y: 90, w: 104, h: 32 } as const;
const STEP = { x: 140, w: 104, h: 28 } as const;
const GATE_X = 266;

/** A path as a cubic, so the three read as three routes rather than three spokes. */
function leg(x1: number, y1: number, x2: number, y2: number): string {
  const bend = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${bend} ${y1}, ${bend} ${y2}, ${x2} ${y2}`;
}

export function TraversalFigure() {
  return (
    <InstrumentPanel01
      label={TRAVERSAL_FIGURE.panel.label}
      footnote={TRAVERSAL_FIGURE.panel.footnote}
      caption={TRAVERSAL_FIGURE.caption}
    >
      <svg
        data-slot="traversal"
        viewBox="0 0 400 212"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={TRAVERSAL_FIGURE.caption}
        className="block h-auto w-full"
      >
        {/* The question's subject, and the thing it is about. */}
        <rect
          className="site-figure__source"
          x={PERSON.x}
          y={PERSON.y}
          width={PERSON.w}
          height={PERSON.h}
          rx={6}
          fill="none"
          stroke="currentColor"
        />
        <text
          className="site-figure__label"
          x={PERSON.x + PERSON.w / 2}
          y={PERSON.y + 20}
          fontSize={10}
          textAnchor="middle"
          fill="currentColor"
        >
          One person
        </text>

        {PATHS.map((path) => (
          <g key={path.label}>
            <path
              className="site-figure__edge--carried"
              d={leg(PERSON.x + PERSON.w, PERSON.y + PERSON.h / 2, STEP.x, path.y)}
              fill="none"
              stroke="currentColor"
              strokeWidth={1}
            />
            <path
              className="site-figure__edge--carried"
              d={leg(STEP.x + STEP.w, path.y, RESOURCE.x, RESOURCE.y + RESOURCE.h / 2)}
              fill="none"
              stroke="currentColor"
              strokeWidth={1}
            />
            <rect
              className="site-figure__node"
              x={STEP.x}
              y={path.y - STEP.h / 2}
              width={STEP.w}
              height={STEP.h}
              rx={6}
              fill="none"
              stroke="currentColor"
            />
            <text
              className="site-figure__label"
              x={STEP.x + STEP.w / 2}
              y={path.y + 4}
              fontSize={10}
              textAnchor="middle"
              fill="currentColor"
            >
              {path.label}
            </text>
          </g>
        ))}

        {/* The policy gate every answer passes through before it is returned, drawn
            across all three routes at once: it is in front of the graph, not beside it. */}
        <path
          className="site-figure__edge"
          d={`M ${GATE_X} 20 L ${GATE_X} 192`}
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          strokeDasharray="3 4"
        />
        <text
          className="site-figure__annotation"
          x={GATE_X}
          y={12}
          fontSize={9}
          textAnchor="middle"
          fill="currentColor"
        >
          policy
        </text>

        <rect
          className="site-figure__emphasis"
          x={RESOURCE.x}
          y={RESOURCE.y}
          width={RESOURCE.w}
          height={RESOURCE.h}
          rx={6}
          fill="none"
          stroke="currentColor"
        />
        <text
          className="site-figure__label site-figure__label--emphasis"
          x={RESOURCE.x + RESOURCE.w / 2}
          y={RESOURCE.y + 20}
          fontSize={10}
          textAnchor="middle"
          fill="currentColor"
        >
          Sensitive product
        </text>
      </svg>
    </InstrumentPanel01>
  );
}
