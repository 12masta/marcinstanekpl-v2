import { test, expect } from "@playwright/test"
import { HomePage } from "./pom/home/homepage"
import { BlogHomePage } from "./pom/blog/bloghomepage"

test("Navbar home page pl", async ({ page }) => {
  const homePlPage = new HomePage(page)
  await homePlPage.gotoPl()

  await expect(homePlPage.navbarBrand).toHaveAttribute("href", "/")
  await expect(homePlPage.navbarLanguageLink).toHaveAttribute("href", "/en/")
  await expect(homePlPage.blogLink).toHaveAttribute("href", "/blog/pl/")
})

test("Navbar home page en", async ({ page }) => {
  const homeEnPage = new HomePage(page)
  await homeEnPage.gotoEn()

  await expect(homeEnPage.navbarBrand).toHaveAttribute("href", "/en/")
  await expect(homeEnPage.navbarLanguageLink).toHaveAttribute("href", "/")
  await expect(homeEnPage.blogLink).toHaveAttribute("href", "/blog/en/")
})

test("Navbar blog home page pl", async ({ page }) => {
  const homePlPage = new BlogHomePage(page)
  await homePlPage.gotoPl()

  await expect(homePlPage.navbarBrand).toHaveAttribute("href", "/")
  await expect(homePlPage.navbarLanguageLink).toHaveAttribute(
    "href",
    "/blog/en/"
  )
  await expect(homePlPage.blogLink).toHaveAttribute("href", "/blog/pl/")
})

test("Navbar blog home page en", async ({ page }) => {
  const homeEnPage = new BlogHomePage(page)
  await homeEnPage.gotoEn()

  await expect(homeEnPage.navbarBrand).toHaveAttribute("href", "/en/")
  await expect(homeEnPage.navbarLanguageLink).toHaveAttribute(
    "href",
    "/blog/pl/"
  )
  await expect(homeEnPage.blogLink).toHaveAttribute("href", "/blog/en/")
})
