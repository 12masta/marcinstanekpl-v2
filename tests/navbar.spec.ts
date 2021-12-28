import { test, expect } from "@playwright/test"
import { HomePage } from "./pom/home/homepage"

test("Navbar home page pl", async ({ page }) => {
  const homePlPage = new HomePage(page)
  await homePlPage.goto()

  await expect(homePlPage.navbarBrand).toHaveAttribute("href", "/")
  await expect(homePlPage.navbarLanguageLink).toHaveAttribute("href", "/en/")
  await expect(homePlPage.blogLink).toHaveAttribute("href", "/blog/pl/")
})

test("Navbar home page en", async ({ page }) => {
  const homeEnPage = new HomePage(page)
  await homeEnPage.goto("/en/")

  await expect(homeEnPage.navbarBrand).toHaveAttribute("href", "/en/")
  await expect(homeEnPage.navbarLanguageLink).toHaveAttribute("href", "/")
  await expect(homeEnPage.blogLink).toHaveAttribute("href", "/blog/en/")
})
