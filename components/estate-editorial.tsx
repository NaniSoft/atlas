/**
 * The Atlas editorial figure: the estate as a network seen from above.
 *
 * It is a placeholder for a real photograph of an estate, and it is a drawing
 * rather than a screenshot: nodes and edges, one path highlighted, and the
 * policy gate at the end of it. Every stroke is a token, so the drawing follows
 * the pack and the mode, and the highlighted path is the same traversal the
 * page's flagship walk-through describes.
 *
 * It is decorative: the band's title and description carry the meaning.
 */
const NODES: ReadonlyArray<readonly [number, number, number]> = [
  [170, 190, 5],
  [280, 360, 7],
  [400, 230, 5],
  [510, 410, 6],
  [620, 180, 5],
  [700, 330, 8],
  [820, 470, 5],
  [900, 240, 6],
  [1000, 380, 5],
  [1080, 170, 4],
  [330, 540, 4],
  [560, 560, 4],
  [760, 120, 4],
  [1040, 540, 4],
]

const EDGES: ReadonlyArray<readonly [number, number]> = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [2, 4],
  [3, 5],
  [4, 5],
  [4, 12],
  [5, 6],
  [5, 7],
  [6, 8],
  [7, 8],
  [7, 9],
  [8, 9],
  [8, 13],
  [1, 10],
  [3, 11],
  [6, 11],
]

const PATH: ReadonlyArray<readonly [number, number]> = [
  [0, 1],
  [1, 3],
  [3, 5],
  [5, 7],
  [7, 8],
]

const key = (edge: readonly [number, number]) => `${edge[0]}-${edge[1]}`

export function EstateEditorial() {
  return (
    <svg
      viewBox="0 0 1200 675"
      role="presentation"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
    >
      <rect width="1200" height="675" className="fill-muted" />

      <g className="stroke-border" strokeWidth="1.5" fill="none" opacity="0.7">
        {EDGES.map((edge) => {
          const from = NODES[edge[0]]!
          const to = NODES[edge[1]]!
          return <path key={key(edge)} d={`M ${from[0]} ${from[1]} L ${to[0]} ${to[1]}`} />
        })}
      </g>

      <g className="stroke-primary" strokeWidth="2.5" fill="none">
        {PATH.map((edge) => {
          const from = NODES[edge[0]]!
          const to = NODES[edge[1]]!
          return <path key={`path-${key(edge)}`} d={`M ${from[0]} ${from[1]} L ${to[0]} ${to[1]}`} />
        })}
      </g>

      <g className="fill-foreground/35">
        {NODES.map(([cx, cy, r], index) => (
          <circle key={index} cx={cx} cy={cy} r={r} />
        ))}
      </g>

      <g className="fill-primary">
        {[0, 1, 3, 5, 7, 8].map((index) => {
          const node = NODES[index]!
          return <circle key={`em-${index}`} cx={node[0]} cy={node[1]} r={node[2] + 2} />
        })}
      </g>

      <g className="stroke-primary" strokeWidth="1.5" fill="none">
        <circle cx="1000" cy="380" r="48" strokeDasharray="4 8" />
        <circle cx="1000" cy="380" r="76" strokeDasharray="2 10" />
        <path d="M 1000 322 V 438 M 952 380 H 1048" strokeDasharray="2 8" />
      </g>

      <g className="fill-primary" fill="currentColor">
        <rect x="986" y="366" width="28" height="28" rx="4" transform="rotate(45 1000 380)" />
      </g>

      <g className="text-foreground/15" stroke="currentColor" strokeWidth="1" fill="none">
        <path d="M 0 337 H 1200" strokeDasharray="2 10" />
        <path d="M 600 0 V 675" strokeDasharray="2 10" />
      </g>
    </svg>
  )
}
