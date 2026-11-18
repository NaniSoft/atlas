import { defineConfig, devices } from '@playwright/test';

/**
 * Runtime + visual gates (mission §12). The suite runs against a local static
 * server over the production export (`pnpm build` first). Baselines live under
 * `test/visual/__snapshots__/`; the first run creates them. In CI the step is
 * non-blocking until the DS enhancement requests in UI-GOVERNANCE.md §4 land,
 * while `ui:check` is mandatory.
 */
export default defineConfig({
  testDir: './test/visual',
  timeout: 2 * 60 * 1000,
  snapshotDir: './test/visual/__snapshots__',
  expect: {
    toHaveScreenshot: {
      // WebKit's screenshot pass over the fixed ground and the backdrop-filter
      // panes does not hold the five-second default on the runner. The budget
      // is headroom, not patience: the pages are still, fonts loaded, one shot.
      timeout: 30 * 1000,
    },
  },
  use: {
    baseURL: 'http://127.0.0.1:3100',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'mobile', use: { ...devices['iPhone 14'] } },
    { name: 'tablet', use: { ...devices['iPad Mini'] } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'wide-desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 } } },
  ],
  webServer: {
    // No `-s`: single-page mode rewrote every route without a directory index
    // (that is, every route under `trailingSlash: false`) to the landing, so
    // each project's docs/blog/about captures were four screenshots of `/`.
    // Plain static mode resolves the export's `.html` files by clean URL, the
    // same resolution the Worker's html_handling does at the host.
    command: 'pnpm exec serve -l 3100 out',
    url: 'http://127.0.0.1:3100',
    reuseExistingServer: !process.env.CI,
    timeout: 2 * 60 * 1000,
  },
});
