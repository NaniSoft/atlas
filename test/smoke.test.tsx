import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import NotFound from '@/app/not-found';
import { DEFAULT_MODE, DEFAULT_PACK, SITE_ID, themeBootScript } from '@/lib/theme';

describe('site identity', () => {
  it('is atlas, in green, beam-dark by default', () => {
    expect(SITE_ID).toBe('atlas');
    expect(DEFAULT_PACK).toBe('green');
    expect(DEFAULT_MODE).toBe('dark');
  });

  it('boots the theme with a blocking, pre-paint script', () => {
    // The class-swap recipe's flash-free half: the script must apply a
    // prism-<pack>-<mode> class before paint, not after hydration.
    expect(themeBootScript).toContain('prism-green');
    expect(themeBootScript).toContain('prism-theme-mode');
  });
});

describe('404', () => {
  it('offers the ways back into the site', () => {
    render(<NotFound />);
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy();
    expect(screen.getByRole('link', { name: /back to the landing/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /read the docs/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /read the blog/i })).toBeTruthy();
  });
});
