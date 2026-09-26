'use client';

// The hero's visual slot: the living-map DAG (the old site's HeroDag motif)
// re-rendered fresh in the green pack — never copied. One canvas component,
// two renderings on this site:
//
//   panel — an instrument: labeled chips, hairline edges, a green wavefront
//           crossing the pipeline, subtle pointer drift.
//
// (`atmosphere` and `specimen` belonged to the landing prototype's other two
// variants; the platform's template law survives here as the rule that this
// host's height must be definite in every context — the canvas sizes itself
// from the host's clientHeight, so a content-sized host would feed back into
// itself through the ResizeObserver and grow forever.)
//
// Reduced motion renders the settled frame. Colors are read from the pre-baked
// prism-<pack>-<mode> CSS variables at mount (token-driven, no raw hex); one
// rAF loop, all per-frame writes imperative on the canvas.

import { useEffect, useRef } from 'react';

import { DAG_ARIA, DAG_STAGES } from '@/lib/content/landing';

export type TwinDagMode = 'panel';

interface DagNode {
  col: number;
  label: string;
  nx: number;
  ny: number;
  hub: boolean;
}

interface DagEdge {
  a: number;
  b: number;
  dash: boolean;
}

// Column x positions (normalized 0–1) — seven pipeline stages.
const COL_X = [0.09, 0.245, 0.395, 0.53, 0.665, 0.81, 0.94];

function buildGraph(): { nodes: DagNode[]; edges: DagEdge[] } {
  const nodes: DagNode[] = [];
  DAG_STAGES.forEach((labels, col) => {
    labels.forEach((label, i) => {
      const slots = labels.length;
      // Spread each column's nodes vertically around the band 0.22–0.82.
      const ny = slots === 1 ? 0.52 : 0.26 + (0.56 / (slots - 1)) * i;
      nodes.push({ col, label, nx: COL_X[col] ?? 0.5, ny, hub: label === 'Bedrock' || label === 'Atlas' || label === 'Compass' });
    });
  });
  // The observer floats above the lake/transform stages.
  nodes.push({ col: 3, label: 'Watchtower', nx: 0.46, ny: 0.08, hub: false });

  const find = (label: string): number => nodes.findIndex((n) => n.label === label);
  const pairs: Array<[string, string, boolean?]> = [
    ['AD', 'Blueprint'], ['AD', 'Trailhead'],
    ['Workday', 'Blueprint'], ['Workday', 'Trailhead'],
    ['SQL Fleet', 'Trailhead'],
    ['Blueprint', 'Bedrock'], ['Trailhead', 'Bedrock'],
    ['Bedrock', 'Forge'],
    ['Forge', 'Overlook'],
    ['Overlook', 'Atlas'], ['Overlook', 'OPA'],
    ['Atlas', 'Compass'], ['OPA', 'Compass'],
    ['Watchtower', 'Bedrock', true], ['Watchtower', 'Forge', true],
  ];
  const edges: DagEdge[] = [];
  for (const [from, to, dash] of pairs) {
    const a = find(from);
    const b = find(to);
    if (a >= 0 && b >= 0) edges.push({ a, b, dash: dash === true });
  }
  return { nodes, edges };
}

const GRAPH = buildGraph();
const CYCLE_S = 7.2;
const TRAVEL_S = 1.4;
const COL_DELAY_S = 0.5;

interface Palette {
  ink: string;
  text: string;
  bg: string;
}

function readPalette(host: HTMLElement): Palette {
  const css = getComputedStyle(host);
  return {
    ink: css.getPropertyValue('--prism-color-primary').trim() || '#22C55E',
    text: css.getPropertyValue('--prism-color-text').trim() || '#E8EEF9',
    bg: css.getPropertyValue('--prism-color-bg-layout').trim() || '#0C1812',
  };
}

/** hex (#RRGGBB) → rgba(..,a) so canvas draws stay token-driven. */
function rgba(hex: string, a: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  const n = parseInt(m[1]!, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export function TwinDag({ mode = 'panel' }: { mode?: TwinDagMode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Read once, then re-read whenever the theme class swaps: the chrome's
    // mode toggle flips prism-green-dark ⇄ prism-green-light at runtime, and a
    // palette captured only at mount would keep drawing dark-mode ink on a
    // light page. Mutated in place — the draw closure always reads `palette`.
    const palette = readPalette(wrap);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animated = !reduced;

    let width = 0;
    let height = 0;
    let raf = 0;
    let running = true;

    const resize = (): void => {
      // Guard the growth loop explicitly: a zero or shrinking host never
      // becomes its own input (the template's canvas law, enforced).
      const nextWidth = wrap.clientWidth;
      const nextHeight = wrap.clientHeight;
      if (nextWidth <= 0 || nextHeight <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = nextWidth;
      height = nextHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // Geometry — normalized graph → pixel space.
    const padX = width * 0.06;
    const padY = height * 0.12;
    const px = (n: DagNode): number => padX + n.nx * (width - padX * 2);
    const py = (n: DagNode): number => padY + n.ny * (height - padY * 2);

    const pointer = { x: 0.5, y: 0.5 };
    const onPointer = (event: PointerEvent): void => {
      const rect = wrap.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      pointer.x = (event.clientX - rect.left) / rect.width;
      pointer.y = (event.clientY - rect.top) / rect.height;
    };
    if (animated) wrap.addEventListener('pointermove', onPointer);

    const draw = (nowMs: number): void => {
      if (width === 0 || height === 0) return;
      const t = nowMs / 1000;
      const drift = animated ? 1 : 0;

      ctx.clearRect(0, 0, width, height);

      // Node pixel positions with breathing drift.
      const pos = GRAPH.nodes.map((n, i) => ({
        x: px(n) + Math.sin(t * 0.6 + i * 1.7) * 2.5 * drift,
        y: py(n) + Math.cos(t * 0.5 + i * 2.3) * 2.5 * drift,
      }));

      // Orthogonal edges: out of the source's right edge, elbow at mid-x,
      // into the target's left edge.
      const chipW = (label: string): number => Math.min(ctx.measureText(label).width + 18, width * 0.13);
      ctx.font = '10.5px "JetBrains Mono", ui-monospace, monospace';

      const edgePath = (edge: DagEdge): Array<[number, number]> => {
        const a = GRAPH.nodes[edge.a]!;
        const b = GRAPH.nodes[edge.b]!;
        const ax = pos[edge.a]!.x + chipW(a.label) / 2;
        const ay = pos[edge.a]!.y;
        const bx = pos[edge.b]!.x - chipW(b.label) / 2;
        const by = pos[edge.b]!.y;
        const midX = (ax + bx) / 2;
        return [[ax, ay], [midX, ay], [midX, by], [bx, by]];
      };

      const trace = (path: Array<[number, number]>): void => {
        ctx.beginPath();
        const first = path[0]!;
        ctx.moveTo(first[0], first[1]);
        for (let i = 1; i < path.length; i++) ctx.lineTo(path[i]![0], path[i]![1]);
      };

      const segLengths = (path: Array<[number, number]>): number[] =>
        path.slice(1).map((p, i) => Math.hypot(p[0] - path[i]![0], p[1] - path[i]![1]));

      for (const edge of GRAPH.edges) {
        const path = edgePath(edge);
        trace(path);
        ctx.strokeStyle = edge.dash ? rgba(palette.text, 0.22) : rgba(palette.text, 0.3);
        ctx.lineWidth = 1;
        ctx.setLineDash(edge.dash ? [3, 5] : []);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // The wavefront: one pulse per edge, staggered by column, traveling the
      // orthogonal path. In the settled frame it is replaced by one static
      // green cue on the Atlas hub.
      if (animated) {
        for (const edge of GRAPH.edges) {
          const path = edgePath(edge);
          const lens = segLengths(path);
          const total = lens.reduce((sum, l) => sum + l, 0);
          const start = GRAPH.nodes[edge.a]!.col * COL_DELAY_S;
          const local = ((t % CYCLE_S) - start) / TRAVEL_S;
          if (local < 0 || local > 1) continue;
          let remain = local * total;
          for (let i = 0; i < lens.length; i++) {
            if (remain <= lens[i]!) {
              const k = remain / lens[i]!;
              const cur = path[i]!;
              const next = path[i + 1]!;
              const x = cur[0] + (next[0] - cur[0]) * k;
              const y = cur[1] + (next[1] - cur[1]) * k;
              const glow = ctx.createRadialGradient(x, y, 0, x, y, 9);
              glow.addColorStop(0, rgba(palette.ink, 0.85));
              glow.addColorStop(1, rgba(palette.ink, 0));
              ctx.fillStyle = glow;
              ctx.beginPath();
              ctx.arc(x, y, 9, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = rgba(palette.ink, 1);
              ctx.beginPath();
              ctx.arc(x, y, 2.2, 0, Math.PI * 2);
              ctx.fill();
              break;
            }
            remain -= lens[i]!;
          }
        }
      }

      // Node chips.
      GRAPH.nodes.forEach((n, i) => {
        const { x, y } = pos[i]!;
        const w = chipW(n.label);
        const h = 22;
        ctx.fillStyle = rgba(palette.bg, 0.88);
        ctx.strokeStyle = n.hub ? rgba(palette.ink, animated ? 0.9 : 0.55) : rgba(palette.text, 0.28);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(x - w / 2, y - h / 2, w, h, 4);
        ctx.fill();
        ctx.stroke();
        if (n.hub && !animated) {
          // The settled frame's single live cue — Atlas's own hub.
          ctx.fillStyle = rgba(palette.ink, 1);
          ctx.beginPath();
          ctx.arc(x + w / 2 - 7, y - h / 2 + 7, 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = rgba(palette.text, n.hub ? 0.95 : 0.72);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(n.label, x, y + 0.5);
      });

      if (running) raf = requestAnimationFrame(drawFrame);
    };

    const drawFrame = (nowMs: number): void => draw(nowMs);

    // Re-read the palette whenever the theme class swaps on <html>.
    //
    // The re-read is deferred two frames. MutationObserver callbacks run in a
    // microtask, and Chromium has not recalculated style yet at that point: a
    // token read inside the callback still returns the OUTGOING theme
    // (#091b12 after the class had already flipped to light — measured), which
    // silently re-armed the old palette. Two frames land after the recalc.
    // The redraw covers reduced motion, whose settled frame has no loop to
    // pick the new palette up. (Ticket 17: this is the family's canonical
    // observer-based re-theme pattern — AlphaLens's instrument now matches.)
    let rethemeRaf = 0;
    const retheme = (): void => {
      cancelAnimationFrame(rethemeRaf);
      rethemeRaf = requestAnimationFrame(() => {
        rethemeRaf = requestAnimationFrame(() => {
          Object.assign(palette, readPalette(wrap));
          draw(performance.now());
        });
      });
    };
    const themeObserver = new MutationObserver(retheme);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Draw once (settled frame under reduced motion), then loop only when
    // animated. Pause the loop while the tab is hidden.
    if (animated && !document.hidden) {
      raf = requestAnimationFrame(drawFrame);
    } else {
      draw(performance.now());
    }
    const onVisibility = (): void => {
      if (!animated) return;
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(drawFrame);
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(rethemeRaf);
      ro.disconnect();
      themeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      if (animated) wrap.removeEventListener('pointermove', onPointer);
    };
  }, [mode]);

  return (
    <div
      ref={wrapRef}
      className={`al-dag al-dag--${mode}`}
      role="img"
      aria-label={DAG_ARIA}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
