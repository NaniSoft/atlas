// The estate as one graph: the drawing behind the first of the twin's three points.
//
// **It is a transcription, not an illustration.** The words it draws are the words
// `WHAT_IT_IS[0]` already publishes: four kinds of source become nodes, and three
// kinds of relationship become edges. Nothing here adds a claim the copy does not
// make, which is the same test the hero's running figure is held to, and it is why
// the source names and the edge kinds below are the copy's own words rather than
// invented ones.
//
// **The frame is the design system's.** `InstrumentPanel01` owns the border, the bar,
// the radius and the pack beneath it, so this file draws a drawing and nothing else.
// That is what the Block is for: an instrument is the one thing the design system
// cannot draw, because an instrument is a view of the consumer's data.
//
// **The colours are tokens and the drawing is authored in `currentColor`.** Every
// colour in it is a class in `app/globals.css`, so a pack boundary landing above
// repaints the whole figure, and no hex value appears in this file. A hand-written
// colour in an SVG attribute would be the one surface on the page that a pack could
// not reach.
//
// It is a server component: no hook, no state, no client code, and no `'use client'`
// line, so it costs the page no JavaScript. `test/server-only.test.ts` holds the whole
// tree to that.

import { InstrumentPanel01 } from '@nanisoft/prism-ui/blocks/instrument-panel-01';

import { ESTATE_FIGURE } from '@/lib/content/landing';

/**
 * The four kinds of source the copy names, and the node each one becomes.
 *
 * Drawn as four boxes on the left and one field on the right, because the claim being
 * drawn is that four systems stop being four systems. The convergence is the whole
 * sentence, so it is drawn as geometry rather than written as a caption.
 */
const SOURCES = ['Directory', 'HR system', 'Database', 'Application'] as const;

/** The vertical spread of those four boxes, and the band they converge into. */
const SOURCE_TOP = 6;
const SOURCE_PITCH = 44;
const SOURCE_HEIGHT = 28;
const CONVERGE_X = 108;
const BOUNDARY_X = 176;
const FIELD_X = 300;
const FIELD_Y = 86;
/**
 * Sized against the nodes rather than chosen: the emphasised node has a radius of 5,
 * and at 56 the two outermost sat on the ring's own stroke. A node drawn through the
 * boundary of the field it belongs to is a wrong statement about the graph, so the
 * ring is the larger number and the nodes sit inside it with room for their own edge.
 */
const FIELD_RADIUS = 64;

/**
 * Seven nodes in the field, and the edges among four of them.
 *
 * The positions are hand-placed rather than generated, because a drawing whose layout
 * is a function of an index is a drawing whose nodes can collide at any count, and a
 * collision in a figure is a wrong statement about the graph rather than a cosmetic
 * fault. Seven is the number the field holds at this radius with room to breathe.
 */
const NODES: ReadonlyArray<readonly [number, number]> = [
  [272, 64],
  [318, 58],
  [256, 112],
  [288, 104],
  [330, 110],
  [348, 78],
  [306, 140],
];

/** Which node pairs carry an edge. The field's edges are drawn faint on purpose. */
const FIELD_EDGES: ReadonlyArray<readonly [number, number]> = [
  [0, 3],
  [3, 4],
  [1, 5],
  [2, 3],
];

export function EstateGraphFigure() {
  return (
    <InstrumentPanel01
      label={ESTATE_FIGURE.panel.label}
      footnote={ESTATE_FIGURE.panel.footnote}
      caption={ESTATE_FIGURE.caption}
    >
      <svg
        data-slot="estate-graph"
        viewBox="0 0 400 212"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={ESTATE_FIGURE.caption}
        className="block h-auto w-full"
      >
        {/* The four source systems, and the four edges that resolve them into the field. */}
        {SOURCES.map((name, index) => {
          const top = SOURCE_TOP + index * SOURCE_PITCH;
          return (
            <g key={name}>
              <path
                className="site-figure__edge"
                d={`M ${CONVERGE_X} ${top + SOURCE_HEIGHT / 2} L ${BOUNDARY_X} ${FIELD_Y}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={1}
              />
              <rect
                className="site-figure__source"
                x={0}
                y={top}
                width={CONVERGE_X}
                height={SOURCE_HEIGHT}
                rx={6}
                fill="none"
                stroke="currentColor"
              />
              <text
                className="site-figure__label"
                x={10}
                y={top + 18}
                fontSize={10}
                fill="currentColor"
              >
                {name}
              </text>
            </g>
          );
        })}

        {/* The boundary the records cross to become one person, one node. */}
        <path
          className="site-figure__edge"
          d={`M ${BOUNDARY_X} 2 L ${BOUNDARY_X} 170`}
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          strokeDasharray="3 4"
        />
        <text className="site-figure__annotation" x={BOUNDARY_X + 8} y={12} fontSize={9} fill="currentColor">
          conform
        </text>

        {/* The field: one graph, its nodes, and the edges among them. */}
        <circle
          className="site-figure__edge"
          cx={FIELD_X}
          cy={FIELD_Y}
          r={FIELD_RADIUS}
          fill="none"
          stroke="currentColor"
        />
        {FIELD_EDGES.map(([from, to]) => {
          const a = NODES[from];
          const b = NODES[to];
          if (!a || !b) return null;
          return (
            <path
              key={`${from}-${to}`}
              className="site-figure__edge--carried"
              d={`M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={1}
            />
          );
        })}
        {NODES.map(([cx, cy], index) => (
          <circle
            key={`${cx}-${cy}`}
            className={index === 3 ? 'site-figure__emphasis' : 'site-figure__node'}
            cx={cx}
            cy={cy}
            r={index === 3 ? 5 : 3.5}
            fill="currentColor"
          />
        ))}

        {/* The three kinds of relationship, named once each rather than on every edge. */}
        {(['membership', 'grant', 'activity'] as const).map((kind, index) => (
          <g key={kind} transform={`translate(${index * 128} 186)`}>
            <path d="M 0 8 L 18 8" className="site-figure__edge--carried" fill="none" stroke="currentColor" strokeWidth={1} />
            <text className="site-figure__annotation" x={24} y={12} fontSize={9} fill="currentColor">
              {kind}
            </text>
          </g>
        ))}
      </svg>
    </InstrumentPanel01>
  );
}
