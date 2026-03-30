import { Page } from "@playwright/test"

/** Blog / language links sit inside the collapsible nav on narrow viewports. */
export async function expandNavbarIfCollapsed(page: Page) {
  const langLink = page.locator("[data-test=navbar-language-link]")
  const aboutLink = page.locator("data-test=about-link")
  const blogLink = page.locator("data-test=blog-link")
  const toggler = page.locator("data-test=navbar-toggler")

  if (!(await langLink.isVisible())) {
    await toggler.click()
  }
  await langLink.waitFor({ state: "visible" })
  await aboutLink.waitFor({ state: "visible" })
  await blogLink.waitFor({ state: "visible" })
}
