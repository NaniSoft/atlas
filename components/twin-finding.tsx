// The flagship finding, drawn as the path it is.
//
// `j.harper` viewed `P-1042`, a sensitive product, and the membership edge that
// should back the view is missing. The solid relation is the view the log
// recorded; the dashed relation is the membership the graph does not have. The
// point of the drawing is the gap: a table would omit the row and a list would
// omit the edge, and the finding is the absence.
//
// The drawing is a Diagram: data in, vector markup out. The panel that frames it
// carries the caption for a screen reader; this component carries no styling of
// its own. On a phone the Diagram scrolls sideways at a legible size rather
// than shrinking the picture, which replaces the mobile list the hand drawing
// needed.
//
// It is the documented playground finding, not a live query: the site says so
// in the panel's footnote and in the caption below the figure. Every stroke is
// a semantic token, so the drawing follows the pack and the mode.

import { Diagram } from '@nanisoft/prism-ui/components/diagram';

const NODES = [
  { id: 'person', name: 'j.harper', subtitle: 'a person', x: 0, y: 50 },
  { id: 'product', name: 'P-1042', subtitle: 'Payroll-NG, sensitive', x: 100, y: 50, emphasis: true },
  { id: 'group', name: 'G-SR', subtitle: 'the backing group', x: 50, y: 92 },
] as const;

const RELATIONS = [
  { from: 'person', to: 'product', label: 'viewed' },
  { from: 'person', to: 'group', label: 'no memberof', indirect: true },
] as const;

export function TwinFinding() {
  return (
    <Diagram
      label="The finding: j.harper viewed P-1042, a sensitive product, with no membership edge to G-SR backing the view."
      nodes={NODES.map((n) => ({ ...n }))}
      relations={RELATIONS.map((r) => ({ ...r }))}
    />
  );
}
