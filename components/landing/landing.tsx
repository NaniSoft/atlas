'use client';

// The landing — the product-site template's variant A, "The Instrument Bench"
// (user-locked, nanisoft-web ticket 09), carrying Atlas's content (ticket 07).
//
// One beam-dark ground, mono section indices on hairline-topped sections, the
// twin in a bordered instrument panel, the data path as a conveyor rail, use
// cases as a status ledger, integrations as a survey grid with dashed in-house
// tiles, and the platform story as three pack-dot cards. Green — this site's
// own pack — is the only accent (packs-as-signal is site-local).
//
// Client component: the DAG canvas and the reveal observer both need effects.
// The markup is still prerendered, so the page is fully readable before
// hydration; <noscript> below keeps the reveal honest without JS.

import type { CSSProperties, ReactElement, ReactNode } from 'react';
import { Button } from '@nanisoft/prism-ui/components/button';
import { usePrismThemeMode } from '@nanisoft/prism-ui/provider';
import { prismBrandPacks, type PrismPackId } from '@nanisoft/prism-tokens';

import {
  BUILT_ON_NEXUS,
  DATA_PATH,
  DATA_PATH_LEDE,
  FINAL_CTA,
  HERO,
  HOW_BUILT_LEDE,
  IN_HOUSE,
  INTEGRATIONS_NOTE,
  PATH_FEATURES,
  STACK_PRODUCTS,
  STATUS_LABEL,
  TICKER,
  USE_CASES,
  USE_CASES_LEDE,
  USE_CASES_MORE,
  WHAT_IT_IS,
  WHAT_IT_IS_LEDE,
} from '@/lib/content/landing';
import { TwinDag } from '@/components/landing/twin-dag';
import { reveal, useRevealRoot } from '@/components/landing/reveal';

function Section({ index, label, children }: { index: string; label: string; children: ReactNode }): ReactElement {
  return (
    <section className="al-section">
      <div className="al-shell">
        <div className="al-section__head" {...reveal()}>
          <span className="al-section__index">{index}</span>
          <span className="al-section__label">{label}</span>
        </div>
        {children}
      </div>
    </section>
  );
}

export function Landing(): ReactElement {
  const root = useRevealRoot();
  // The instrument panel's tag names the mode it is actually in — the chrome's
  // toggle is built in, so a hardcoded "beam-dark" would read as a claim the
  // page cannot keep in light mode.
  const { mode } = usePrismThemeMode();

  return (
    <div ref={root} className="al">
      {/* Hero — copy left, the twin in its instrument panel right. */}
      <section className="al-hero">
        <div className="al-shell al-hero-grid">
          <div>
            <p className="al-eyebrow" {...reveal()}>
              {HERO.eyebrow} — {HERO.positioning}
            </p>
            <h1 className="al-display al-display--md" {...reveal(60)}>
              {HERO.h1Leading}
              <em>{HERO.h1Em}</em>
              {HERO.h1Trailing}
            </h1>
            <p className="al-lede" {...reveal(120)}>
              {HERO.sub}
            </p>
            <div className="al-cta-row" {...reveal(180)}>
              <Button type="primary" size="large" href={USE_CASES_MORE.cta.href} target="_blank" rel="noopener noreferrer">
                {USE_CASES_MORE.cta.label}
              </Button>
              <Button size="large" href={FINAL_CTA.secondary.href}>
                {FINAL_CTA.secondary.label}
              </Button>
            </div>
          </div>
          <div className="al-hero-panel" {...reveal(120)}>
            <div className="al-hero-panel__bar">
              <span className="al-live-dot" aria-hidden />
              <span>live view — the estate, as one graph</span>
              <span className="al-hero-panel__mode">{mode === 'dark' ? 'beam-dark' : 'light'} · green</span>
            </div>
            <TwinDag mode="panel" />
          </div>
        </div>
        <div className="al-shell">
          <div className="al-ticker" {...reveal(240)}>
            {TICKER.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 01 — what it is. Three instruments. */}
      <Section index="01" label="The twin — what it is">
        <p className="al-lede al-lede--section" {...reveal()}>
          {WHAT_IT_IS_LEDE}
        </p>
        <div className="al-cards">
          {WHAT_IT_IS.map((card, i) => (
            <div className="al-card" key={card.title} {...reveal(i * 60)}>
              <span className="al-card__no">{String(i + 1).padStart(2, '0')}</span>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 02 — the data path: conveyor rail, then the six features. */}
      <Section index="02" label="The data path — lakehouse to twin">
        <p className="al-lede al-lede--section" {...reveal()}>
          {DATA_PATH_LEDE}
        </p>
        <div className="al-rail" {...reveal()}>
          <div className="al-rail__packet" aria-hidden />
          {DATA_PATH.map((stage, i) => (
            <div className="al-stage" key={stage.title}>
              <span className="al-stage__no">{stage.step}</span>
              <span className="al-stage__name">{stage.title}</span>
              <span className="al-stage__caption">{stage.body}</span>
              {i === DATA_PATH.length - 1 && <span className="al-rail__serving">serving</span>}
            </div>
          ))}
        </div>
        <div className="al-feats">
          {PATH_FEATURES.map((feature, i) => (
            <div className="al-feat" key={feature.title} {...reveal(i * 40)}>
              <h4>{feature.title}</h4>
              <p>{feature.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 03 — use cases: a ledger with the statuses visible. */}
      <Section index="03" label="Use cases — one twin, many questions">
        <p className="al-lede al-lede--section" {...reveal()}>
          {USE_CASES_LEDE}
        </p>
        <div className="al-ledger">
          {USE_CASES.map((useCase, i) => (
            <div className="al-row" key={useCase.title} data-status={useCase.status} {...reveal(i * 60)}>
              <span className="al-row__dot" aria-hidden />
              <span className="al-row__name">{useCase.title}</span>
              <span className="al-row__status">{STATUS_LABEL[useCase.status]}</span>
              <ul className="al-row__bullets">
                {useCase.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="al-caption" {...reveal()}>
          {USE_CASES_MORE.line}{' '}
          <a href={USE_CASES_MORE.cta.href} target="_blank" rel="noopener noreferrer">
            {USE_CASES_MORE.cta.label} →
          </a>
        </p>
      </Section>

      {/* 04 — how it's built: the survey grid + the in-house four. */}
      <Section index="04" label="How it’s built — compose, don’t fork">
        <p className="al-lede al-lede--section" {...reveal()}>
          {HOW_BUILT_LEDE}
        </p>
        <div className="al-survey">
          {STACK_PRODUCTS.map((product, i) => {
            const codenamed = product.realName !== product.name;
            return (
              <div className="al-tile" key={product.name} {...reveal(Math.min(i, 8) * 30)}>
                <span className="al-tile__name">{product.name}</span>
                {codenamed && <span className="al-tile__real">{product.realName}</span>}
                <span className="al-tile__role">{product.role}</span>
              </div>
            );
          })}
        </div>
        <div className="al-survey al-survey--ours">
          {IN_HOUSE.map((component, i) => (
            <div className="al-tile al-tile--ours" key={component.name} {...reveal(i * 60)}>
              <span className="al-tile__mark">built in-house</span>
              <span className="al-tile__name">{component.name}</span>
              <span className="al-tile__blurb">{component.blurb}</span>
            </div>
          ))}
        </div>
        <p className="al-caption" {...reveal()}>
          {INTEGRATIONS_NOTE}
        </p>
      </Section>

      {/* 05 — built on Nexus: the platform story, packs as signal. */}
      <Section index="05" label="Built on Nexus — one platform, one factory">
        <p className="al-lede al-lede--section" {...reveal()}>
          {BUILT_ON_NEXUS.lede}
        </p>
        <div className="al-bon">
          {BUILT_ON_NEXUS.products.map((product, i) => {
            const ink = prismBrandPacks[product.pack as PrismPackId].ink.dark;
            return (
              <a
                className="al-bon__card"
                key={product.id}
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                {...reveal(i * 60)}
                style={{ '--al-product-ink': ink } as CSSProperties}
              >
                <span className="al-bon__dot" aria-hidden />
                <span className="al-bon__name">{product.name}</span>
                <span className="al-bon__tagline">{product.tagline}</span>
              </a>
            );
          })}
        </div>
        <p className="al-caption" {...reveal()}>
          {BUILT_ON_NEXUS.body}
        </p>
      </Section>

      {/* 06 — status + the single honest ask. */}
      <section className="al-cta">
        <div className="al-shell" {...reveal()}>
          <h2 className="al-display al-display--md">{FINAL_CTA.h2}</h2>
          <div className="al-cta-row al-cta-row--center">
            <Button type="primary" size="large" href={FINAL_CTA.primary.href} target="_blank" rel="noopener noreferrer">
              {FINAL_CTA.primary.label}
            </Button>
            <Button size="large" href={FINAL_CTA.secondary.href}>
              {FINAL_CTA.secondary.label}
            </Button>
          </div>
          <p className="al-caption al-caption--center">{FINAL_CTA.footnote}</p>
        </div>
      </section>
    </div>
  );
}
