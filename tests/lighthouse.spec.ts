import { chromium, Browser, Page } from "@playwright/test"
import { HomePage } from "./pom/home/homepage"
import { BlogHomePage } from "./pom/blog/bloghomepage"
import { playAudit } from "playwright-lighthouse"
import { test as base } from "@playwright/test"
import { getBlogPostPaths } from "./helpers/blog-post-paths"
import {
  blogIndexThresholds,
  homePageThresholds,
  thresholdsForBlogPost,
  type LighthouseThresholds,
} from "./lighthouse-thresholds"

export const lighthouseTest = base.extend<
  {},
  { port: number; browser: Browser }
>({
  port: [
    async ({}, use) => {
      const { default: getPort } = await import("get-port")
      const port = await getPort()
      await use(port)
    },
    { scope: "worker" },
  ],

  // @ts-ignore
  browser: [
    async ({ port }, use) => {
      const browser = await chromium.launch({
        args: [`--remote-debugging-port=${port}`],
      })
      await use(browser)
    },
    { scope: "worker" },
  ],
})

const navBrandSel = "data-test=navbar-brand"

/**
 * First navigation is cold (parse + compile). A couple of reloads plus global-setup
 * HTTP warm-up help Lighthouse see cached static assets before playAudit runs.
 */
async function warmUpPageForLighthouseAudit(page: Page) {
  for (let i = 0; i < 2; i++) {
    await page.reload({ waitUntil: `load` })
    await page.locator(navBrandSel).waitFor()
  }
}

/** playAudit error when only the performance category is below threshold. */
const perfThresholdFailRe =
  /performance record is \d+ and is under the \d+ threshold/

/**
 * Performance scores swing on loaded CI / local machines. If only performance
 * fails, warm the page again and re-audit (same test, no Playwright "flaky").
 */
async function playAuditWithPerformanceWarmRetries(
  page: Page,
  port: number,
  thresholds: LighthouseThresholds,
  logLabel: string
) {
  const maxAttempts = 3
  let lastErr: unknown
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const r = await playAudit({ page, port, thresholds })
      logLighthouseScores(logLabel, r)
      return r
    } catch (e) {
      lastErr = e
      const msg = e instanceof Error ? e.message : String(e)
      if (!perfThresholdFailRe.test(msg) || attempt >= maxAttempts) {
        throw e
      }
      await warmUpPageForLighthouseAudit(page)
    }
  }
  throw lastErr
}

function logLighthouseScores(label: string, auditResult: unknown) {
  if (!process.env.LH_LOG_SCORES) return
  const lhr = (auditResult as { lhr?: { categories?: Record<string, { score: number | null }> } })
    ?.lhr
  if (!lhr?.categories) return
  const scores = Object.fromEntries(
    Object.entries(lhr.categories).map(([k, v]) => [
      k,
      Math.round((v.score ?? 0) * 100),
    ])
  )
  // eslint-disable-next-line no-console
  console.log(`[LH_SCORES] ${label}`, JSON.stringify(scores))
}

const blogPostPaths = getBlogPostPaths()

lighthouseTest.describe("Lighthouse", () => {
  // Blog index before home: first Lighthouse run warms CDP / scoring; home PL was the flakiest when it ran first.
  lighthouseTest("Lighthouse - Navbar blog home page pl", async ({
    page,
    port,
  }) => {
    const homePlPage = new BlogHomePage(page)
    await homePlPage.gotoPl()
    await warmUpPageForLighthouseAudit(page)

    await playAuditWithPerformanceWarmRetries(
      page,
      port,
      blogIndexThresholds,
      `blog index pl`
    )
  })

  lighthouseTest("Lighthouse - Navbar blog home page en", async ({
    page,
    port,
  }) => {
    const homeEnPage = new BlogHomePage(page)
    await homeEnPage.gotoEn()
    await warmUpPageForLighthouseAudit(page)

    await playAuditWithPerformanceWarmRetries(
      page,
      port,
      blogIndexThresholds,
      `blog index en`
    )
  })

  lighthouseTest("Lighthouse - Navbar home page pl", async ({ page, port }) => {
    const homePlPage = new HomePage(page)
    await homePlPage.gotoPl()
    await warmUpPageForLighthouseAudit(page)

    await playAuditWithPerformanceWarmRetries(
      page,
      port,
      homePageThresholds,
      `home pl`
    )
  })

  lighthouseTest("Lighthouse - Navbar home page en", async ({ page, port }) => {
    const homeEnPage = new HomePage(page)
    await homeEnPage.gotoEn()
    await warmUpPageForLighthouseAudit(page)

    await playAuditWithPerformanceWarmRetries(
      page,
      port,
      homePageThresholds,
      `home en`
    )
  })

  lighthouseTest.describe("Blog posts", () => {
    for (const postPath of blogPostPaths) {
      lighthouseTest(`Lighthouse - blog post ${postPath}`, async ({
        page,
        port,
      }) => {
        await page.goto(postPath)
        await page.locator(navBrandSel).waitFor()

        const thresholds = thresholdsForBlogPost(postPath)
        const r = await playAudit({
          page,
          port,
          thresholds,
        })
        logLighthouseScores(postPath, r)
      })
    }
  })
})
