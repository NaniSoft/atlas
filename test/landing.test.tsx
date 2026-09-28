import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Landing from '@/app/page';
import {
  IN_HOUSE,
  STACK_PRODUCTS,
  STATUS_LABEL,
  TICKER,
  USE_CASES,
  WHAT_IT_IS,
} from '@/lib/content/landing';

/**
 * The landing is composed from the design system's catalogue, and the copy it was
 * given is still published.
 *
 * The test asserts two things that a screenshot shows neither of. First, that every
 * word the content module holds reaches the DOM: a Block that silently dropped the
 * copy it was handed renders a correct-looking section with nothing in it, and that
 * is the failure mode a composition is most prone to. Second, that the honesty
 * devices survived the move, because they are content rather than chrome and the
 * migration is forbidden from touching them.
 *
 * The statuses are asserted twice on purpose. The tier on the row is the design
 * system's four (`live`, `planned`) and the words beside it are this product's
 * (`Flagship · available today`, `Planned`), and the split is the whole reason the
 * Block takes both: four products in this family use eight words for four states, and
 * a Block that rendered a tier's own name would force one of them onto the other
 * three. So a reader who cannot see the dot still gets the same fact.
 */
function renderLanding() {
  return render(<Landing />);
}

describe('landing', () => {
  it('states the product frame and the flagship instance in order', () => {
    renderLanding();
    const eyebrow = screen.getByText(/Model the real world digitally/);
    expect(eyebrow.textContent).toContain('nanisoft · atlas');

    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.textContent).toContain('Digital ');
    expect(h1.textContent).toContain('twin');
    expect(h1.textContent).toContain(' of the IT estate.');
  });

  it('renders every word of the hero, the panel and the status strip', () => {
    renderLanding();
    expect(screen.getByText(/live view — the estate, as one graph/)).toBeTruthy();
    for (const item of TICKER) {
      expect(screen.getByText(item)).toBeTruthy();
    }
  });

  it('draws the pipeline as a server-rendered diagram, not a canvas', () => {
    renderLanding();
    const diagram = screen.getByRole('img', { name: /digital-twin pipeline/i });
    expect(diagram).toBeTruthy();
    // Every node name the deleted canvas drew is still drawn, and the drawing says
    // which relations it resolved: a line that silently did not draw is the failure
    // the design system made impossible.
    for (const name of ['AD', 'Workday', 'SQL Fleet', 'Blueprint', 'Trailhead', 'Bedrock', 'Forge', 'Overlook', 'Atlas', 'OPA', 'Compass', 'Watchtower']) {
      expect(diagram.textContent).toContain(name);
    }
    expect(diagram.getAttribute('data-unresolved-relations')).toBe('0');
    // Exactly one emphasised node: the diagram treats emphasis as "the one this
    // drawing is about" and says two of them is a caller's mistake.
    expect(diagram.querySelectorAll('[data-emphasis]')).toHaveLength(1);
  });

  it('preserves each use case status exactly', () => {
    // The migration law is user-locked: available, planned, planned, in order.
    expect(USE_CASES.map((useCase) => useCase.status)).toEqual(['live', 'planned', 'planned']);
    expect(STATUS_LABEL.live).toBe('Flagship · available today');
    expect(STATUS_LABEL.planned).toBe('Planned');

    renderLanding();
    const ledger = screen.getByRole('heading', { name: /Use cases/ }).closest('section');
    expect(ledger).toBeTruthy();
    if (!ledger) return;
    expect(within(ledger).getByText('Access traversal')).toBeTruthy();
    expect(within(ledger).getByText('Blast radius')).toBeTruthy();
    expect(within(ledger).getByText('Stale and unused access')).toBeTruthy();
    expect(within(ledger).getByText(STATUS_LABEL.live)).toBeTruthy();

    // The statuses are machine-readable on the row, not just prose.
    const rows = Array.from(ledger.querySelectorAll('[data-slot="status-ledger-row"]'));
    expect(rows.map((row) => row.getAttribute('data-status'))).toEqual(['live', 'planned', 'planned']);
  });

  it('renders sixteen composed products and four in-house ones', () => {
    expect(STACK_PRODUCTS).toHaveLength(16);
    expect(IN_HOUSE).toHaveLength(4);

    const { container } = renderLanding();
    expect(screen.getAllByText('built in-house')).toHaveLength(4);
    // Every composed part is present, in the survey grid the design system's item
    // draws. A Block that silently dropped the copy it was handed renders a
    // correct-looking section with nothing in it, which no screenshot shows.
    const parts = container.querySelectorAll('[data-slot="stack-grid"] > ul:first-child > li');
    expect(parts).toHaveLength(16);
    for (const part of parts) {
      expect(part.textContent?.trim().length ?? 0).toBeGreaterThan(0);
    }
    const own = container.querySelectorAll('[data-slot="stack-grid-own"] > li');
    expect(own).toHaveLength(4);
    for (const [index, component] of IN_HOUSE.entries()) {
      expect(own[index]?.textContent).toContain(component.name);
      expect(own[index]?.textContent).toContain(component.blurb);
    }
  });

  it('renders the platform story as three whole-row links in three packs', () => {
    renderLanding();
    const rows: ReadonlyArray<readonly [string, string]> = [
      ['Nexus', 'https://nexus.nanisoft.com'],
      ['AlphaLens', 'https://alphalens.nanisoft.com'],
      ['Prism', 'https://prism.nanisoft.com'],
    ];
    for (const [name, href] of rows) {
      const card = screen.getByText(name).closest('a');
      expect(card?.getAttribute('href')).toBe(href);
      // A pack that is not the one the page wears, on a mark, and nothing else.
      const mark = card?.querySelector('[data-slot="product-mark"]');
      expect(mark?.getAttribute('data-pack')).toBeTruthy();
      expect(mark?.getAttribute('data-pack')).not.toBe('mint');
    }
  });

  it('keeps the single honest ask — the playground — with its footnote', () => {
    renderLanding();
    const cta = screen.getByRole('heading', { name: 'See the twin think.' }).closest('section');
    expect(cta).toBeTruthy();
    if (!cta) return;
    const links = Array.from(cta.querySelectorAll('a')).map((a) => a.getAttribute('href'));
    expect(links).toContain('https://playground.nanisoft.com');
    expect(links).toContain('/docs');
    expect(cta.textContent).toContain('fully mocked');
  });

  it('links the docs at the real docs section, in the hero and in the closing band', () => {
    renderLanding();
    const docs = screen.getAllByRole('link', { name: 'Read the docs' });
    expect(docs.length).toBeGreaterThan(0);
    for (const link of docs) {
      expect(link.getAttribute('href')).toBe('/docs');
    }
  });

  it('publishes every word of the twin section, and a real heading for it', () => {
    renderLanding();
    // The three cards were three `h3`s over a hand-written rule. They are a
    // definition list now, and a definition list carries terms rather than headings.
    // The words are unchanged and each is announced with its explanation, which is
    // the pairing a heading and a paragraph did not give a screen reader.
    expect(screen.getByRole('heading', { level: 2, name: 'The twin — what it is' })).toBeTruthy();
    for (const card of WHAT_IT_IS) {
      expect(screen.getByText(card.title)).toBeTruthy();
      expect(screen.getByText(card.body)).toBeTruthy();
    }
  });

  it('renders every call to action as a real anchor, and the playground in a new tab', () => {
    // The one rendered-output change the whole migration exists to make: the retired
    // line's action component took a destination and rendered a button, so the page's
    // primary action was announced as a command that navigated nothing.
    renderLanding();
    for (const link of screen.getAllByRole('link')) {
      expect(link.tagName.toLowerCase()).toBe('a');
      expect(link.getAttribute('href')).toBeTruthy();
    }
    const playground = screen.getAllByRole('link', { name: 'Open the playground' });
    expect(playground.length).toBeGreaterThan(0);
    for (const link of playground) {
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    }
  });
});
