import { chromium, Browser } from "@playwright/test"
import { HomePage } from "./pom/home/homepage"
import { BlogHomePage } from "./pom/blog/bloghomepage"
import { playAudit } from "playwright-lighthouse"
import { test as base } from "@playwright/test"
import { getBlogPostPaths } from "./helpers/blog-post-paths"
import {
  blogIndexThresholds,
  homePageThresholds,
  thresholdsForBlogPost,
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
  lighthouseTest("Lighthouse - Navbar home page pl", async ({ page, port }) => {
    const homePlPage = new HomePage(page)
    await homePlPage.gotoPl()

    const r = await playAudit({
      page,
      port,
      thresholds: homePageThresholds,
    })
    logLighthouseScores(`home pl`, r)
  })

  lighthouseTest("Lighthouse - Navbar home page en", async ({ page, port }) => {
    const homeEnPage = new HomePage(page)
    await homeEnPage.gotoEn()

    const r = await playAudit({
      page,
      port,
      thresholds: homePageThresholds,
    })
    logLighthouseScores(`home en`, r)
  })

  lighthouseTest("Lighthouse - Navbar blog home page pl", async ({
    page,
    port,
  }) => {
    const homePlPage = new BlogHomePage(page)
    await homePlPage.gotoPl()

    const r = await playAudit({
      page,
      port,
      thresholds: blogIndexThresholds,
    })
    logLighthouseScores(`blog index pl`, r)
  })

  lighthouseTest("Lighthouse - Navbar blog home page en", async ({
    page,
    port,
  }) => {
    const homeEnPage = new BlogHomePage(page)
    await homeEnPage.gotoEn()

    const r = await playAudit({
      page,
      port,
      thresholds: blogIndexThresholds,
    })
    logLighthouseScores(`blog index en`, r)
  })

  lighthouseTest.describe("Blog posts", () => {
    for (const postPath of blogPostPaths) {
      lighthouseTest(`Lighthouse - blog post ${postPath}`, async ({
        page,
        port,
      }) => {
        await page.goto(postPath)
        await page.locator("data-test=navbar-brand").waitFor()

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
