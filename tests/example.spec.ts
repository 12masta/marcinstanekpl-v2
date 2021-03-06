import { test, expect } from "@playwright/test"

test("basic test", async ({ page }) => {
  await page.goto("/")
  await page.locator('data-test=navbar').waitFor()

  const title = await page.title()
  await expect(title).toBe("Strona główna | marcinstanek.pl")
})
