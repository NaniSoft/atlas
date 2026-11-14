/**
 * The Atlas editorial figure: the estate as a network seen from above.
 *
 * It is a placeholder for a real photograph of an estate, and it is a drawing
 * rather than a screenshot: nodes and edges, one path highlighted, and the
 * policy gate at the end of it. As a Diagram it is decorative: the band's title
 * and description carry the meaning, so nothing here is named for a screen
 * reader. The highlighted path has no Diagram form — emphasis is one node — so
 * the drawing is the network itself; the caption under the band says which path
 * is highlighted.
 */

import { Diagram } from '@nanisoft/prism-ui/components/diagram';

const NODES = [
  [170, 190], [280, 360], [400, 230], [510, 410], [620, 180], [700, 330],
  [820, 470], [900, 240], [1000, 380], [1080, 170], [330, 540], [560, 560],
  [760, 120], [1040, 540],
] as const;

const EDGES = [
  [0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 5], [4, 5], [4, 12], [5, 6],
  [5, 7], [6, 8], [7, 8], [7, 9], [8, 9], [8, 13], [1, 10], [3, 11], [6, 11],
] as const;

export function EstateEditorial() {
  return (
    <Diagram
      decorative
      nodes={NODES.map(([x, y], index) => ({ id: `n${index}`, name: '', x, y }))}
      relations={EDGES.map(([from, to]) => ({ from: `n${from}`, to: `n${to}`, label: '' }))}
    />
  );
}
