import { test, expect } from "@playwright/test"
import { getBlogTranslationPairs } from "./helpers/blog-translation-pairs"
import { expandNavbarIfCollapsed } from "./helpers/navigation"

const langLinkSel = "[data-test=navbar-language-link]"

test.describe("Blog post language switch (navbar)", () => {
  for (const { pl, en } of getBlogTranslationPairs()) {
    test(`EN ${en} → Polski links to ${pl}`, async ({ page }) => {
      await page.goto(en)
      await expandNavbarIfCollapsed(page)
      const langLink = page.locator(langLinkSel)
      await expect(langLink).toHaveText("Polski")
      await expect(langLink).toHaveAttribute("href", pl)
      await langLink.click()
      await expect(page).toHaveURL(pathnameMatches(pl))
    })

    test(`PL ${pl} → English links to ${en}`, async ({ page }) => {
      await page.goto(pl)
      await expandNavbarIfCollapsed(page)
      const langLink = page.locator(langLinkSel)
      await expect(langLink).toHaveText("English")
      await expect(langLink).toHaveAttribute("href", en)
      await langLink.click()
      await expect(page).toHaveURL(pathnameMatches(en))
    })
  }
})

function pathnameNorm(p: string): string {
  const x = p.endsWith("/") && p.length > 1 ? p.slice(0, -1) : p
  return x || "/"
}

function pathnameMatches(expectedPathWithSlash: string) {
  const want = pathnameNorm(expectedPathWithSlash)
  return (url: URL) => pathnameNorm(url.pathname) === want
}
