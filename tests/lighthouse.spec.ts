import { chromium, Browser } from "@playwright/test"
import { HomePage } from "./pom/home/homepage"
import { BlogHomePage } from "./pom/blog/bloghomepage"
import { playAudit } from "playwright-lighthouse"
import { test as base } from "@playwright/test"
import { getBlogPostPaths } from "./helpers/blog-post-paths"

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

/** Blog index + posts: performance after global CSS/JS trim; SEO 98 buffers LH variance on long-title pages. */
const blogPostThresholds = {
  performance: 93,
  accessibility: 100,
  "best-practices": 100,
  seo: 98,
  pwa: 50,
}

/** Home PL/EN: lazy featurettes, PurgeCSS, smaller bundles; performance 85 buffers CI/LH variance (samples often mid‑90s). */
const homePageConfig = {
  performance: 85,
  accessibility: 100,
  "best-practices": 100,
  seo: 100,
  pwa: 50,
}

const blogPostPaths = getBlogPostPaths()

lighthouseTest.describe("Lighthouse", () => {
  lighthouseTest("Lighthouse - Navbar home page pl", async ({ page, port }) => {
    const homePlPage = new HomePage(page)
    await homePlPage.gotoPl()

    await playAudit({
      page,
      port,
      thresholds: homePageConfig,
    })
  })

  lighthouseTest("Lighthouse - Navbar home page en", async ({ page, port }) => {
    const homeEnPage = new HomePage(page)
    await homeEnPage.gotoEn()

    await playAudit({
      page,
      port,
      thresholds: homePageConfig,
    })
  })

  lighthouseTest("Lighthouse - Navbar blog home page pl", async ({
    page,
    port,
  }) => {
    const homePlPage = new BlogHomePage(page)
    await homePlPage.gotoPl()

    await playAudit({
      page,
      port,
      thresholds: blogPostThresholds,
    })
  })

  lighthouseTest("Lighthouse - Navbar blog home page en", async ({
    page,
    port,
  }) => {
    const homeEnPage = new BlogHomePage(page)
    await homeEnPage.gotoEn()

    await playAudit({
      page,
      port,
      thresholds: blogPostThresholds,
    })
  })

  lighthouseTest.describe("Blog posts", () => {
    for (const postPath of blogPostPaths) {
      lighthouseTest(`Lighthouse - blog post ${postPath}`, async ({
        page,
        port,
      }) => {
        await page.goto(postPath)
        await page.locator("data-test=navbar-brand").waitFor()

        await playAudit({
          page,
          port,
          thresholds: blogPostThresholds,
        })
      })
    }
  })
})
