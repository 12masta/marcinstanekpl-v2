import { Page } from "@playwright/test"

/** Blog / language links sit inside the collapsible nav on narrow viewports. */
export async function expandNavbarIfCollapsed(page: Page) {
  const blogLink = page.locator("data-test=blog-link")
  if (!(await blogLink.isVisible())) {
    await page.locator("data-test=navbar-toggler").click()
  }
  await blogLink.waitFor({ state: "visible" })
}
