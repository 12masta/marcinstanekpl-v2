/**
 * Minimum Lighthouse category scores (0–100) for playwright-lighthouse.
 *
 * Calibrated from a full `npm run test-ci-li` run (JUnit in results-lighthouse.xml,
 * 2026-03-28): EN article routes consistently scored SEO ~92 (hreflang / meta
 * variance in LH 8.x); `/defect-zero/` scored accessibility ~98.
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
  seo: 100,
  pwa: 50,
}

/** /blog/pl/, /blog/en/ index (list + hero blocks). */
export const blogIndexThresholds: LighthouseThresholds = {
  performance: 93,
  accessibility: 100,
  "best-practices": 100,
  seo: 98,
  pwa: 50,
}

const blogPostPl: LighthouseThresholds = {
  performance: 93,
  accessibility: 96,
  "best-practices": 100,
  seo: 98,
  pwa: 50,
}

const blogPostEn: LighthouseThresholds = {
  ...blogPostPl,
  seo: 90,
}

/**
 * English markdown routes use slug prefix `en/…` → path `/en/foo/`.
 * Those pages observed ~92 SEO in Lighthouse 8.6 vs 98+ on PL slugs.
 */
export function thresholdsForBlogPost(postPath: string): LighthouseThresholds {
  return postPath.startsWith(`/en/`) ? blogPostEn : blogPostPl
}
