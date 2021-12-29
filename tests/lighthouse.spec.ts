import { test, expect, chromium, Browser } from "@playwright/test"
import { HomePage } from "./pom/home/homepage"
import { BlogHomePage } from "./pom/blog/bloghomepage"
import { playAudit } from "playwright-lighthouse"
import { test as base } from "@playwright/test"
import getPort from "get-port"

export const lighthouseTest = base.extend<
  {},
  { port: number; browser: Browser }
>({
  port: [
    async ({}, use) => {
      // Assign a unique port for each playwright worker to support parallel tests
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

const thresholdsConfig = {
  performance: 94,
  accessibility: 100,
  "best-practices": 100,
  seo: 100,
  pwa: 50,
}

const thresholdsConfigNavbarBlogHomePageEn = {
  performance: 94,
  accessibility: 100,
  "best-practices": 100,
  seo: 100,
  pwa: 50,
}

const thresholdsConfigNavbarPostBlogPagePl = {
  performance: 93,
  accessibility: 100,
  "best-practices": 100,
  seo: 100,
  pwa: 50,
}

lighthouseTest.describe("Lighthouse", () => {
  lighthouseTest("Lighthouse - Navbar home page pl", async ({ page, port }) => {
    lighthouseTest.setTimeout(900000)
    const homePlPage = new HomePage(page)
    await homePlPage.gotoPl()
    await playAudit({
      page,
      port,
      thresholds: thresholdsConfig,
    })
  })

  lighthouseTest("Lighthouse - Navbar home page en", async ({ page, port }) => {
    lighthouseTest.setTimeout(900000)
    const homeEnPage = new HomePage(page)
    await homeEnPage.gotoEn()

    await playAudit({
      page,
      port,
      thresholds: thresholdsConfig,
    })
  })

  lighthouseTest("Lighthouse - Navbar blog home page pl", async ({ page, port }) => {
    lighthouseTest.setTimeout(900000)
    const homePlPage = new BlogHomePage(page)
    await homePlPage.gotoPl()

    await playAudit({
      page,
      port,
      thresholds: thresholdsConfig,
    })
  })

  lighthouseTest("Lighthouse - Navbar blog home page en", async ({ page, port }) => {
    lighthouseTest.setTimeout(900000)
    const homeEnPage = new BlogHomePage(page)
    await homeEnPage.gotoEn()

    await playAudit({
      page,
      port,
      thresholds: thresholdsConfigNavbarBlogHomePageEn,
    })
  })

  lighthouseTest("Lighthouse - Navbar post blog page pl", async ({ page, port }) => {
    lighthouseTest.setTimeout(900000)
    const homePlPage = new BlogHomePage(page)
    await homePlPage.gotoPl()

    await playAudit({
      page,
      port,
      thresholds: thresholdsConfigNavbarPostBlogPagePl,
    })
  })

  lighthouseTest("Lighthouse - Navbar post blog page en", async ({ page, port }) => {
    lighthouseTest.setTimeout(900000)
    const homeEnPage = new BlogHomePage(page)
    await homeEnPage.gotoEn()

    await playAudit({
      page,
      port,
      thresholds: thresholdsConfig,
    })
  })
});