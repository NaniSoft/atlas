// The landing renders ticket 07's migrated content with the honesty devices
// intact: use-case statuses preserved exactly, and the playground always
// described as "fully mocked".

import { render, screen, within } from '@testing-library/react';
import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { PrismThemeModeProvider } from '@nanisoft/prism-ui/provider';

import { Landing } from '@/components/landing/landing';
import { DEFAULT_MODE, DEFAULT_PACK } from '@/lib/theme';
import { FINAL_CTA, IN_HOUSE, STACK_PRODUCTS, STATUS_LABEL, TICKER, USE_CASES } from '@/lib/content/landing';

// The landing reads the chrome's one context (the instrument panel names the
// mode it is actually in), so it mounts inside the provider, as it does in the
// root layout.
function renderLanding(): ReactElement {
  return (
    <PrismThemeModeProvider pack={DEFAULT_PACK} defaultMode={DEFAULT_MODE}>
      <Landing />
    </PrismThemeModeProvider>
  );
}

describe('landing', () => {
  it('states the product frame and the flagship instance in order', () => {
    render(renderLanding());
    const eyebrow = screen.getByText(/Model the real world digitally/);
    expect(eyebrow.textContent).toContain('nanisoft · atlas');

    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.textContent).toContain('Digital ');
    expect(h1.textContent).toContain('twin');
    expect(h1.textContent).toContain(' of the IT estate.');
  });

  it('names the twin in the hero panel', () => {
    render(renderLanding());
    expect(screen.getByText(/live view — the estate, as one graph/)).toBeTruthy();
    expect(screen.getByRole('img', { name: /digital-twin pipeline/i })).toBeTruthy();
  });

  it('labels the instrument panel with the mode it is actually in', () => {
    // beam-dark is the site default, but the chrome's toggle makes mode
    // user-chosen — the panel must not claim a mode it is not in.
    render(renderLanding());
    expect(screen.getByText('beam-dark · green')).toBeTruthy();

    render(
      <PrismThemeModeProvider pack={DEFAULT_PACK} defaultMode="light">
        <Landing />
      </PrismThemeModeProvider>,
    );
    expect(screen.getByText('light · green')).toBeTruthy();
  });

  it('carries the status ticker with every honesty device', () => {
    render(renderLanding());
    for (const item of TICKER) {
      expect(screen.getByText(item)).toBeTruthy();
    }
  });

  it('preserves each use case status exactly', () => {
    // The migration law is user-locked: available, planned, planned — in order.
    expect(USE_CASES.map((useCase) => useCase.status)).toEqual(['available', 'planned', 'planned']);
    expect(STATUS_LABEL.available).toBe('Flagship · available today');
    expect(STATUS_LABEL.planned).toBe('Planned');

    render(renderLanding());
    const ledger = screen.getByText('Use cases — one twin, many questions').closest('section');
    expect(ledger).toBeTruthy();
    if (!ledger) return;
    expect(within(ledger).getByText('Access traversal')).toBeTruthy();
    expect(within(ledger).getByText('Blast radius')).toBeTruthy();
    expect(within(ledger).getByText('Stale and unused access')).toBeTruthy();
    expect(within(ledger).getByText(STATUS_LABEL.available)).toBeTruthy();

    // The statuses are machine-readable on the row, not just prose.
    const rows = Array.from(ledger.querySelectorAll('[data-status]'));
    expect(rows.map((row) => row.getAttribute('data-status'))).toEqual(['available', 'planned', 'planned']);
  });

  it('renders sixteen composed products and four in-house ones', () => {
    expect(STACK_PRODUCTS).toHaveLength(16);
    expect(IN_HOUSE).toHaveLength(4);

    render(renderLanding());
    expect(screen.getAllByText('built in-house')).toHaveLength(4);
    expect(screen.getByText('Trailhead')).toBeTruthy();
    expect(screen.getByText('Airflow')).toBeTruthy();
    expect(screen.getByText('Scout')).toBeTruthy();
  });

  it('keeps the single honest ask — the playground — with its footnote', () => {
    render(renderLanding());
    const cta = screen.getByText(FINAL_CTA.h2).closest('section');
    expect(cta).toBeTruthy();
    if (!cta) return;
    const links = Array.from(cta.querySelectorAll('a')).map((a) => a.getAttribute('href'));
    expect(links).toContain('https://playground.nanisoft.com');
    expect(cta.textContent).toContain('fully mocked');
  });

  it('renders the platform story as three pack-dot cards', () => {
    render(renderLanding());
    for (const name of ['Nexus', 'AlphaLens', 'Prism']) {
      const card = screen.getByText(name).closest('a');
      expect(card?.getAttribute('href') ?? '').toMatch(/^https:/);
    }
  });

  it('links the docs CTA at the real docs section', () => {
    render(renderLanding());
    const hero = screen.getByRole('heading', { level: 1 }).closest('section');
    expect(hero?.querySelector('a[href="/docs"]')).toBeTruthy();
  });
});
