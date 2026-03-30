import { test, expect } from "@playwright/test"
import { HomePage } from "./pom/home/homepage"
import { BlogHomePage } from "./pom/blog/bloghomepage"
import { PostBlogPage } from "./pom/blog/postblogpage"

test("Navbar home page pl", async ({ page }) => {
  const homePlPage = new HomePage(page)
  await homePlPage.gotoPl()

  await expect(homePlPage.navbarBrand).toHaveAttribute("href", "/")
  await expect(homePlPage.navbarLanguageLink).toHaveAttribute("href", "/en/")
  await expect(homePlPage.aboutLink).toHaveAttribute("href", "/o-mnie/")
  await expect(homePlPage.blogLink).toHaveAttribute("href", "/blog/pl/")
})

test("Navbar home page en", async ({ page }) => {
  const homeEnPage = new HomePage(page)
  await homeEnPage.gotoEn()

  await expect(homeEnPage.navbarBrand).toHaveAttribute("href", "/en/")
  await expect(homeEnPage.navbarLanguageLink).toHaveAttribute("href", "/")
  await expect(homeEnPage.aboutLink).toHaveAttribute("href", "/en/about/")
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
  await expect(homePlPage.aboutLink).toHaveAttribute("href", "/o-mnie/")
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
  await expect(homeEnPage.aboutLink).toHaveAttribute("href", "/en/about/")
  await expect(homeEnPage.blogLink).toHaveAttribute("href", "/blog/en/")
})

test("Navbar single post page pl", async ({ page }) => {
  const postPl = new PostBlogPage(page)
  await postPl.gotoPl()

  await expect(postPl.navbarBrand).toHaveAttribute("href", "/")
  await expect(postPl.navbarLanguageLink).toHaveAttribute(
    "href",
    "/en/dotnet-polly/"
  )
  await expect(postPl.aboutLink).toHaveAttribute("href", "/o-mnie/")
  await expect(postPl.blogLink).toHaveAttribute("href", "/blog/pl/")
})

test("Navbar single post page en", async ({ page }) => {
  const postEn = new PostBlogPage(page)
  await postEn.gotoEn()

  await expect(postEn.navbarBrand).toHaveAttribute("href", "/en/")
  await expect(postEn.navbarLanguageLink).toHaveAttribute(
    "href",
    "/dotnet-polly/"
  )
  await expect(postEn.aboutLink).toHaveAttribute("href", "/en/about/")
  await expect(postEn.blogLink).toHaveAttribute("href", "/blog/en/")
})

