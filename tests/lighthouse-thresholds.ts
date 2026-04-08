/**
 * Minimum Lighthouse category scores (0–100) for playwright-lighthouse.
 *
 * Calibrated from a full `npm run test-ci-li` run (JUnit in results-lighthouse.xml,
 * 2026-03-28): EN article routes scored lower SEO before hreflang in head;
 * re-check after SEO template changes: `LH_LOG_SCORES=1 npm run lighthouse:smoke`.
 * `/defect-zero/` scored accessibility ~98.
 *
 * Re-check after major content or template changes:
 *   LH_LOG_SCORES=1 npm run lighthouse:smoke
 */

export type LighthouseThresholds = {
  performance: number
  accessibility: number
  "best-practices": number
  seo: number
  pwa: number
}

/**
 * Home PL/EN: buffers CI / machine variance (samples often mid‑90s).
 * Navbar Lighthouse tests also use in-test performance-only warm retries (see lighthouse.spec.ts).
 */
export const homePageThresholds: LighthouseThresholds = {
  performance: 85,
  accessibility: 100,
  "best-practices": 100,
  seo: 90,
  pwa: 50,
}

/** /blog/pl/, /blog/en/ index (list + hero blocks). */
export const blogIndexThresholds: LighthouseThresholds = {
  performance: 93,
  accessibility: 100,
  "best-practices": 100,
  seo: 90,
  pwa: 50,
}

/** Blog articles (LH 8.x SEO often low‑90s with hreflang + article meta variance). */
const blogPostThresholds: LighthouseThresholds = {
  performance: 93,
  accessibility: 96,
  "best-practices": 100,
  seo: 90,
  pwa: 50,
}

export function thresholdsForBlogPost(_postPath: string): LighthouseThresholds {
  return blogPostThresholds
}
