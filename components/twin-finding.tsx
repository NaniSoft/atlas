/**
 * The flagship finding, drawn as the path it is.
 *
 * `j.harper` viewed `P-1042`, a sensitive product, and the membership edge that
 * should back the view is missing. The solid edge is the view the log recorded;
 * the dashed edge is the membership the graph does not have. The point of the
 * drawing is the gap: a table would omit the row and a list would omit the edge,
 * and the finding is the absence.
 *
 * It is the documented playground finding, not a live query: the site says so in
 * the panel's footnote and in the caption below the figure. Every stroke is a
 * semantic token, so the drawing follows the pack and the mode.
 */
export function TwinFinding() {
  return (
    <div className="flex flex-col gap-2">
      <svg
        viewBox="0 0 640 220"
        role="img"
        aria-label="The finding: j.harper viewed P-1042, a sensitive product, with no membership edge to G-SR backing the view."
        className="hidden h-auto w-full sm:block"
      >
        <defs>
          <marker id="finding-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-primary" />
          </marker>
        </defs>

        <g className="fill-card stroke-border" strokeWidth="1.5">
          <rect x="24" y="76" width="150" height="56" rx="8" />
          <rect x="466" y="76" width="150" height="56" rx="8" />
          <rect x="245" y="160" width="150" height="46" rx="8" />
        </g>

        <g className="stroke-primary" strokeWidth="2" fill="none">
          <path d="M 174 104 H 454" markerEnd="url(#finding-arrow)" />
        </g>

        <g className="stroke-warning" strokeWidth="2" fill="none" strokeDasharray="6 8">
          <path d="M 99 132 V 183 H 233" />
        </g>

        <g className="fill-foreground" fontSize="15" fontWeight="600">
          <text x="99" y="108" textAnchor="middle">j.harper</text>
          <text x="541" y="108" textAnchor="middle">P-1042</text>
          <text x="320" y="188" textAnchor="middle">G-SR</text>
        </g>

        <g className="fill-muted-foreground" fontSize="11">
          <text x="99" y="122" textAnchor="middle">a person</text>
          <text x="541" y="122" textAnchor="middle">Payroll-NG, sensitive</text>
          <text x="320" y="202" textAnchor="middle">the backing group</text>
          <text x="320" y="96" textAnchor="middle">viewed</text>
          <text x="122" y="168" textAnchor="middle">no memberof</text>
        </g>
      </svg>

      {/*
        A 640-unit drawing at phone width puts the labels under the readable
        floor. The mobile form states the same three facts as a list, in the
        order the graph reads them, rather than shrinking the picture.
      */}
      <ol className="flex flex-col gap-2 text-sm sm:hidden">
        <li className="border-border flex items-center justify-between gap-3 border-b pb-2">
          <span>j.harper</span>
          <span className="text-muted-foreground font-mono text-mono">a person</span>
        </li>
        <li className="border-border flex items-center justify-between gap-3 border-b pb-2">
          <span>viewed P-1042</span>
          <span className="text-muted-foreground font-mono text-mono">Payroll-NG, sensitive</span>
        </li>
        <li className="border-warning flex items-center justify-between gap-3 border-b pb-2">
          <span>no membership edge to G-SR</span>
          <span className="text-warning font-mono text-mono">the gap</span>
        </li>
        <li className="flex items-center justify-between gap-3">
          <span>Policy checked, audit written</span>
          <span className="text-muted-foreground font-mono text-mono">at answer time</span>
        </li>
      </ol>

      <p className="text-muted-foreground text-pretty text-[11px]">
        The finding is the gap: a view with no membership backing it. The same graph
        answers as edges, as a table row and as a chart.
      </p>
    </div>
  )
}
