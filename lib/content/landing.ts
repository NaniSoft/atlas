// The landing's content, fixed once:
// copy migrates from the old site's landing near-verbatim, with the broader
// "Model the real world digitally" frame added as positioning and every
// use-case status preserved exactly (access traversal = available; blast
// radius and stale & unused access = planned).
//
// Content is the constant; structure lives in app/page.tsx.

export const HERO = {
  h1Leading: 'Digital ',
  h1Em: 'twin',
  h1Trailing: ' of the IT estate.',
  sub: 'See how your systems connect and actually work. Start with access traversal, then ask the twin anything.',
} as const;

export const WHAT_IT_IS = [
  {
    title: 'Everything in one graph',
    body: 'Directories, HR systems, databases, and applications become nodes. Memberships, grants, and activity become edges. The estate finally agrees with itself.',
  },
  {
    title: 'Produced, not assembled',
    body: 'The twin comes off a real data platform — ingestion, transformation, quality gates, versioned layers — so it stays trustworthy as the estate changes.',
  },
  {
    title: 'Built for questions',
    body: 'Who can reach this system? What did access look like last quarter? The twin answers by traversal, not stitched exports. Access is the first use-case; more are coming.',
  },
] as const;

export const WHAT_IT_IS_LEDE =
  'Atlas builds a living representation of a real system — and its first proven domain is the IT estate.';

export const DATA_PATH = [
  {
    step: '01',
    title: 'Land',
    body: 'Raw source data lands untouched in Bronze. Nothing is interpreted at the door.',
  },
  {
    step: '02',
    title: 'Conform',
    body: 'Records are cleaned, joined, and resolved until identities are stable. One person, one node — that’s Silver.',
  },
  {
    step: '03',
    title: 'Graph',
    body: 'Conformed facts resolve into Gold: nodes and edges. This graph is the twin.',
  },
  {
    step: '04',
    title: 'Serve',
    body: 'Atlas serves traversals, checks every question against policy, and writes an audit trail.',
  },
] as const;

export const DATA_PATH_LEDE =
  'Built like a lakehouse — because it is one. Every fact lands raw, gets conformed, and is promoted layer by layer until it becomes part of the twin.';

export const PATH_FEATURES = [
  { title: 'Orchestrated end to end', body: 'Trailhead sequences every move — ingestion, promotion, maintenance — as reviewable DAGs.' },
  { title: 'Versioned at every layer', body: 'The lakehouse catalog keeps history, so last quarter’s twin can be reproduced exactly.' },
  { title: 'Promoted only when clean', body: 'Quality gates decide what advances. Bad input stops at the boundary and never reaches the twin.' },
  { title: 'Watched continuously', body: 'Watchtower observes every component — pipelines, queries, engine — from one place.' },
  { title: 'Governed by default', body: 'Policy checks sit in front of the graph, and every answer is logged.' },
  { title: 'Declared as code', body: 'Anchor declares the infrastructure; Conveyor delivers it. No snowflake deployments.' },
] as const;

export type UseCaseStatus = 'live' | 'planned';

export const USE_CASES: ReadonlyArray<{
  title: string;
  status: UseCaseStatus;
  bullets: ReadonlyArray<string>;
}> = [
  {
    title: 'Access traversal',
    status: 'live',
    bullets: [
      'Trace every path between a person and a sensitive product: group memberships, direct grants, inherited rights.',
      'The audit surfaces views of sensitive products with no membership backing them. Each one is a finding.',
      'Read the same finding three ways — as graph edges, as a table row, as a dashboard chart.',
    ],
  },
  {
    title: 'Blast radius',
    status: 'planned',
    bullets: [
      'Ask what an account, a key, or a host can actually reach from where it sits.',
      'Rehearse containment before you need it, against the graph you already have.',
      'Next on the roadmap — designed on the twin, no new connectors.',
    ],
  },
  {
    title: 'Stale and unused access',
    status: 'planned',
    bullets: [
      'Find memberships nobody remembers granting and privileges nobody has exercised.',
      'Feed clean-up work with evidence instead of anecdotes.',
      'Planned alongside blast radius; both fall out of the same graph.',
    ],
  },
];

/**
 * The words for each state, in this product's own vocabulary.
 *
 * The tier is Prism's and the words are the caller's: the design system's ledger
 * refuses to render a tier's own name because four products in this family use eight
 * words for four states, and a Block that picked one would force a vocabulary on
 * every consumer. So `STATUS_LABEL` is the only place a status word is written, and
 * the tier beside it is the colour the dot is drawn from.
 */
export const STATUS_LABEL: Record<UseCaseStatus, string> = {
  live: 'Flagship · available today',
  planned: 'Planned',
};

export const USE_CASES_LEDE = 'One twin, many questions. Today, the flagship is access.';

export const USE_CASES_MORE = {
  line: 'More use-cases are coming — small utilities, composed largely from open-source parts.',
  cta: { label: 'Open the playground', href: 'https://playground.nanisoft.com' },
} as const;

export const STACK_PRODUCTS: ReadonlyArray<{ name: string; role: string; realName: string }> = [
  { name: 'Trailhead', role: 'Orchestration', realName: 'Airflow' },
  { name: 'Forge', role: 'Transform', realName: 'Spark + dbt' },
  { name: 'Bedrock', role: 'Lakehouse', realName: 'Nessie (Iceberg catalog, Postgres, S3)' },
  { name: 'Overlook', role: 'Query', realName: 'Trino' },
  { name: 'Blueprint', role: 'Schema', realName: 'DataGerry' },
  { name: 'Watchtower', role: 'Observability', realName: 'Prometheus + Grafana + Loki' },
  { name: 'Anchor', role: 'Infrastructure as code', realName: 'OpenTofu / Terraform' },
  { name: 'Conveyor', role: 'GitOps', realName: 'ArgoCD' },
  { name: 'Airbyte', role: 'Ingestion', realName: 'Airbyte' },
  { name: 'Zingg', role: 'Entity resolution', realName: 'Zingg' },
  { name: 'Great Expectations', role: 'Quality gates', realName: 'Great Expectations' },
  { name: 'Superset', role: 'Dashboards', realName: 'Apache Superset' },
  { name: 'OPA', role: 'Authorization', realName: 'Open Policy Agent' },
  { name: 'OpenBao', role: 'Secrets', realName: 'OpenBao' },
  { name: 'CloudNativePG', role: 'Databases', realName: 'CloudNativePG' },
  { name: 'Valkey', role: 'Cache', realName: 'Valkey' },
];

export const IN_HOUSE = [
  { name: 'Atlas', blurb: 'The core engine: traversal API, policy enforcement, audit log.' },
  { name: 'Compass', blurb: 'The traversal UI: explore the twin as a graph.' },
  { name: 'DataGerry Bridge', blurb: 'Glue that syncs authored schema into the lakehouse and the engine.' },
  { name: 'Scout', blurb: 'Connectors for internal systems no catalog covers.' },
] as const;

export const HOW_BUILT_LEDE =
  'Sixteen proven open-source products carry the platform — eight under their real names, eight wrapped under codenames with the real product shown beneath. We build four things ourselves.';

export const INTEGRATIONS_NOTE =
  'Every off-the-shelf product runs unmodified — integrated through its APIs, configured, never forked. Codenamed entries are the real product shown beneath the codename, not a fork.';

// The platform story (ticket 07: a section the old site never had). Honesty
// law from ticket 06 applies here too: Nexus is the engine that makes building
// products repeatable — in active development; never claim it built this site.
//
// The three packs are the published ones for those three products, read from the
// family map rather than from the retired line's names: `rose` and `blue` are not
// packs any rule emits, so a mark carrying one painted the page's own ground and
// the three products looked identical. `lavender`, `blush` and `peach` are the
// identifiers the design system publishes, and each mark is now the only element on
// the page carrying a boundary besides the header's switcher.
export const BUILT_ON_NEXUS = {
  lede: 'Atlas is one of three Nanisoft products on one platform — and the platform has a factory behind it.',
  body: 'Nexus is Nanisoft’s agent factory: it turns an issue into a reviewed, merged change, so building each product becomes repeatable. It is in active development and building in the open — the same honesty this page applies to the twin.',
  products: [
    { id: 'nexus', name: 'Nexus', tagline: 'The Agent Factory', pack: 'lavender', url: 'https://nexus.nanisoft.com' },
    { id: 'alphalens', name: 'AlphaLens', tagline: 'Market research, quantified', pack: 'blush', url: 'https://alphalens.nanisoft.com' },
    { id: 'prism', name: 'Prism', tagline: 'The design system this site wears', pack: 'peach', url: 'https://prism.nanisoft.com' },
  ],
} as const;

export const FINAL_CTA = {
  h2: 'See the twin think.',
  primary: { label: 'Open the playground', href: 'https://playground.nanisoft.com' },
  secondary: { label: 'Read the docs', href: '/docs' },
  footnote:
    'In-browser, guided, and fully mocked — nothing to install. Watch a query traverse the twin end to end.',
} as const;

/* ------------------------------------------------------------------ *
 * The figures
 * ------------------------------------------------------------------ */

/*
 * Two drawings, and why the page now has any.
 *
 * Before these the landing carried exactly one visual: the hero's running pipeline.
 * Everything below the fold was a heading over a grid of words, which is why the page
 * read as a document wearing a landing page's clothes. These two are here to be
 * looked at rather than read, and neither invents anything: each one draws the
 * sentence it sits next to, so a reader who never sees the drawing loses the sentence
 * and a reader who sees it loses nothing.
 *
 * `caption` is the accessible name and is never printed. The panel prints `label` and
 * `footnote`; `caption` is what a screen reader hears and what a figure is when its
 * annotation layer is hidden on a phone.
 */

/** The band they share, and the one line that says what the two are. */
export const FIGURES_LEDE =
  'What the estate turns into, and what one question walks through to answer itself.';

export const FIGURES_TITLE = 'The graph, and one walk through it';

export const ESTATE_FIGURE = {
  panel: {
    label: 'what the twin is made of',
    footnote: 'Four source systems become nodes. Memberships, grants and activity become edges.',
  },
  caption:
    'Four source systems (a directory, an HR system, a database and an application) are conformed across one boundary into a single graph, whose nodes are people and products and whose edges are memberships, grants and activity.',
} as const;

export const TRAVERSAL_FIGURE = {
  panel: {
    label: 'what a traversal returns',
    footnote: 'One person, three routes to one sensitive product, each checked against policy.',
  },
  caption:
    'One person reaches one sensitive product by three routes at once: a group membership, a direct grant, and a right inherited through a nested group. Every route is checked against policy before the answer is returned.',
} as const;

/** The six capabilities, named as the four stages above rather than as a second inventory. */
export const PATH_FEATURES_TITLE = 'What each stage is made of';
export const PATH_FEATURES_LEDE = 'The capabilities behind the four stages above.';

/* ------------------------------------------------------------------ *
 * The hero's drawing: the pipeline, as data
 * ------------------------------------------------------------------ */

// The pipeline as the old site drew it (sources → schema/ingest → lakehouse →
// transform → query → core+authz → UI), re-rendered in the published pack and never
// copied. These were the deleted canvas's own graph; they move to the content module
// because a drawing is content and the mechanism that painted it is gone.
//
// The names are grouped by pipeline column, left to right, and the columns are laid
// out on the same normalised geometry the canvas used, so the picture a reader has
// seen is the picture they get. The one name the canvas added rather than took from
// this list is the observer, which floats above the lake and transform stages.
export const DAG_STAGES: ReadonlyArray<ReadonlyArray<string>> = [
  ['AD', 'Workday', 'SQL Fleet'],
  ['Blueprint', 'Trailhead'],
  ['Bedrock'],
  ['Forge'],
  ['Overlook'],
  ['Atlas', 'OPA'],
  ['Compass'],
];

/** The observer, and the column it floats over. The canvas drew it; the list did not. */
export const DAG_OBSERVER = { name: 'Watchtower', column: 3, row: 0.08 };

/**
 * Where each column sits across the drawing, and how far down each of its names.
 *
 * The canvas used the same seven column positions and the same vertical spread, and
 * both numbers are handed to the design system's diagram as a caller's coordinate
 * space rather than as pixels, so the Component fits them to its own canvas and the
 * drawing is a function of the shape rather than of the scale.
 */
export const DAG_COLUMNS = [0.09, 0.245, 0.395, 0.53, 0.665, 0.81, 0.94] as const;

/** The band the names are spread through, as the canvas spread them. */
export const DAG_ROWS = { first: 0.26, last: 0.82, single: 0.52 } as const;

/**
 * The verbs the drawing labels its relations with, keyed by the stage the relation
 * belongs to.
 *
 * The design system's diagram requires a word on every relation, and there was no
 * vocabulary to draw one from, so the words are the verbs of `DAG_ARIA` below: the
 * sentence that already names the pipeline in full, and the one string a screen
 * reader hears for the drawing. Each word is the third-person form of a verb already
 * in that sentence, so the drawing adds no claim the sentence does not make. The
 * observer's edges are drawn dashed and say what the canvas's dashed edges said.
 */
export const DAG_VERBS = {
  flows: 'flow through',
  transforms: 'transformed by',
  queries: 'queried by',
  governs: 'governed by',
  delivers: 'delivered to',
  observes: 'observes',
} as const;

/**
 * The relations, as the canvas drew them: the fifteen edges of the pipeline and the
 * observer's two dashed ones.
 *
 * Each pair is the canvas's own list, moved rather than rewritten, and the verb is
 * the stage's own. The canvas drew these edges without one word on any of them, so
 * the words are the only new visible text in the drawing and they are accounted for
 * one for one in the content-parity ledger.
 */
export const DAG_RELATIONS: ReadonlyArray<{
  from: string;
  to: string;
  verb: keyof typeof DAG_VERBS;
  indirect?: boolean;
}> = [
  { from: 'AD', to: 'Blueprint', verb: 'flows' },
  { from: 'AD', to: 'Trailhead', verb: 'flows' },
  { from: 'Workday', to: 'Blueprint', verb: 'flows' },
  { from: 'Workday', to: 'Trailhead', verb: 'flows' },
  { from: 'SQL Fleet', to: 'Trailhead', verb: 'flows' },
  { from: 'Blueprint', to: 'Bedrock', verb: 'flows' },
  { from: 'Trailhead', to: 'Bedrock', verb: 'flows' },
  { from: 'Bedrock', to: 'Forge', verb: 'transforms' },
  { from: 'Forge', to: 'Overlook', verb: 'queries' },
  { from: 'Overlook', to: 'Atlas', verb: 'governs' },
  { from: 'Overlook', to: 'OPA', verb: 'governs' },
  { from: 'Atlas', to: 'Compass', verb: 'delivers' },
  { from: 'OPA', to: 'Compass', verb: 'governs' },
  { from: 'Watchtower', to: 'Bedrock', verb: 'observes', indirect: true },
  { from: 'Watchtower', to: 'Forge', verb: 'observes', indirect: true },
];

export const DAG_ARIA =
  'The digital-twin pipeline: directory, HR, and database sources flow through schema and ingest into the Bedrock lakehouse, are transformed by Forge, queried by Overlook, governed by Atlas with OPA policy, and delivered to the Compass UI. Watchtower observes.';

/**
 * The pipeline as a running figure, which is the shape the hero draws.
 *
 * The same nodes, the same edges and the same observer the static drawing above
 * already used, with two things added and nothing removed. Each column of the
 * pipeline is a `lane`, so the drawing grows a rail with a marker travelling it and
 * the left-to-right order reads as an order rather than as spacing. Each edge that
 * moves something is `carries`, so it grows a head at its far end.
 *
 * Both additions are claims the static drawing was already making in a weaker
 * form, which is the test this system's second law of motion sets: stop the
 * animation and the figure is unchanged in what it says. The observer's two edges
 * carry nothing and stay dashed, because Watchtower watches the twin rather than
 * moving anything through it, and that is the one distinction in the drawing a
 * reader should be able to see with every animation stopped.
 *
 * The layout numbers are the canvas's own, moved here rather than rewritten: a
 * column sits at its normalised x, its names spread through the band the deleted
 * canvas spread them through, and the observer floats over the transform stage.
 * The pulse graph fits a caller's coordinates the way the static diagram does, so
 * the picture a reader has seen is the picture they get.
 */
export const DAG_PULSE: {
  nodes: ReadonlyArray<{
    id: string;
    name: string;
    x: number;
    y: number;
    lane?: number;
    emphasis?: boolean;
  }>;
  relations: ReadonlyArray<{ from: string; to: string; carries: boolean; indirect?: boolean }>;
  panel: { label: string; footnote: string };
} = {
  nodes: [
    ...DAG_STAGES.flatMap((names, column) =>
      names.map((name, index) => ({
        id: name,
        name,
        x: DAG_COLUMNS[column] ?? 0.5,
        // A column of one sits on the centre line; a column of several spreads
        // through the band, which is the geometry the deleted canvas used and the
        // reason a three-name column and a one-name column do not sit at the same
        // height.
        y:
          names.length === 1
            ? DAG_ROWS.single
            : DAG_ROWS.first +
              ((DAG_ROWS.last - DAG_ROWS.first) * index) / (names.length - 1),
        lane: column,
        emphasis: name === 'Atlas',
      })),
    ),
    // The observer floats over the transform stage, and carries no lane: it is not
    // a stage of the pipeline, and a drawing that put it on the rail would claim it
    // was one.
    {
      id: DAG_OBSERVER.name,
      name: DAG_OBSERVER.name,
      x: DAG_COLUMNS[DAG_OBSERVER.column] ?? 0.5,
      y: DAG_OBSERVER.row,
    },
  ],
  relations: DAG_RELATIONS.map((relation) => ({
    from: relation.from,
    to: relation.to,
    // The observer's edges are the only ones that move nothing, and the reason is
    // the only reason: it watches. Every other edge in the pipeline is a thing
    // arriving somewhere.
    carries: relation.verb !== 'observes',
    indirect: relation.indirect,
  })),
  panel: {
    label: 'the estate, as one graph',
    footnote:
      'Sources, schema, the lakehouse, transform and query, then the two that govern and deliver it. The rail is the order a finding travels.',
  },
};