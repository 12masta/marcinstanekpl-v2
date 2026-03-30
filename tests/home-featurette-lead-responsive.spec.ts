import { test, expect } from "@playwright/test"
import { HomePage } from "./pom/home/homepage"

/** Below Bootstrap `md` (768px): mobile lead visible. */
const VIEWPORT_MOBILE = { width: 390, height: 844 }
/** At/above `md`: desktop lead visible. */
const VIEWPORT_DESKTOP = { width: 1280, height: 800 }

test.describe("Home marketing featurettes — responsive lead copy", () => {
  test("PL: mobile viewport shows short lead only", async ({ page }) => {
    await page.setViewportSize(VIEWPORT_MOBILE)
    const home = new HomePage(page)
    await home.gotoPl()

    const section = page.locator("#featurette-want-to-know")
    const mobileLead = section.getByTestId("featurette-want-to-know-lead-mobile")
    const desktopLead = section.getByTestId("featurette-want-to-know-lead-desktop")
    await expect(mobileLead).toBeVisible()
    await expect(desktopLead).toBeHidden()
    await expect(mobileLead).not.toContainText("Doprecyzowujemy")

    await expect(page.locator('[data-testid$="-lead-mobile"]')).toHaveCount(5)
  })

  test("PL: desktop viewport shows extended lead only", async ({ page }) => {
    await page.setViewportSize(VIEWPORT_DESKTOP)
    const home = new HomePage(page)
    await home.gotoPl()

    const section = page.locator("#featurette-want-to-know")
    const mobileLead = section.getByTestId("featurette-want-to-know-lead-mobile")
    const desktopLead = section.getByTestId("featurette-want-to-know-lead-desktop")
    await expect(desktopLead).toBeVisible()
    await expect(mobileLead).toBeHidden()
    await expect(desktopLead).toContainText("Doprecyzowujemy")

    await expect(page.locator('[data-testid$="-lead-desktop"]')).toHaveCount(5)
  })

  test("EN: mobile viewport shows short lead only", async ({ page }) => {
    await page.setViewportSize(VIEWPORT_MOBILE)
    const home = new HomePage(page)
    await home.gotoEn()

    const section = page.locator("#featurette-want-to-know")
    const mobileLead = section.getByTestId("featurette-want-to-know-lead-mobile")
    const desktopLead = section.getByTestId("featurette-want-to-know-lead-desktop")
    await expect(mobileLead).toBeVisible()
    await expect(desktopLead).toBeHidden()
    await expect(mobileLead).not.toContainText("Together we pin down")
  })

  test("EN: desktop viewport shows extended lead only", async ({ page }) => {
    await page.setViewportSize(VIEWPORT_DESKTOP)
    const home = new HomePage(page)
    await home.gotoEn()

    const section = page.locator("#featurette-want-to-know")
    const mobileLead = section.getByTestId("featurette-want-to-know-lead-mobile")
    const desktopLead = section.getByTestId("featurette-want-to-know-lead-desktop")
    await expect(desktopLead).toBeVisible()
    await expect(mobileLead).toBeHidden()
    await expect(desktopLead).toContainText("Together we pin down")
  })
})
