import { test, expect } from "@playwright/test"
import { HomePage } from "./../pom/home/homepage"
import { BlogHomePage } from "./../pom/blog/bloghomepage"

test("Seo tags - home page pl", async ({ page }) => {
  const homePlPage = new HomePage(page)
  await homePlPage.gotoPl()

  await expect(homePlPage.ogImage).toHaveAttribute(
    "content",
    "https://marcinstanek.pl/ogImage.jpg"
  )
  await expect(homePlPage.ogImageType).toHaveAttribute("content", "image/jpg")
})

test("Seo tags - home page en", async ({ page }) => {
  const homeEnPage = new HomePage(page)
  await homeEnPage.gotoEn()

  await expect(homeEnPage.ogImage).toHaveAttribute(
    "content",
    "https://marcinstanek.pl/ogImage.jpg"
  )
  await expect(homeEnPage.ogImageType).toHaveAttribute("content", "image/jpg")
})

test("Seo tags -  blog home page pl", async ({ page }) => {
  const blogHomePlPage = new BlogHomePage(page)
  await blogHomePlPage.gotoPl()

  await expect(blogHomePlPage.ogImage).toHaveAttribute(
    "content",
    "https://marcinstanek.pl/ogImage.jpg"
  )
  await expect(blogHomePlPage.ogImageType).toHaveAttribute("content", "image/jpg")
})

test("Seo tags -  blog home page en", async ({ page }) => {
  const blogHomeEnPage = new BlogHomePage(page)
  await blogHomeEnPage.gotoEn()

  await expect(blogHomeEnPage.ogImage).toHaveAttribute(
    "content",
    "https://marcinstanek.pl/ogImage.jpg"
  )
  await expect(blogHomeEnPage.ogImageType).toHaveAttribute("content", "image/jpg")
})

test("Seo tags -  post blog page pl", async ({ page }) => {
  const blogHomePage = new BlogHomePage(page)
  await blogHomePage.gotoPl()

  await expect(blogHomePage.ogImage).toHaveAttribute(
    "content",
    "https://marcinstanek.pl/ogImage.jpg"
  )
  await expect(blogHomePage.ogImageType).toHaveAttribute("content", "image/jpg")
})

test("Seo tags -  post blog page en", async ({ page }) => {
  const blogHomePage = new BlogHomePage(page)
  await blogHomePage.gotoEn()

  await expect(blogHomePage.ogImage).toHaveAttribute(
    "content",
    "https://marcinstanek.pl/ogImage.jpg"
  )
  await expect(blogHomePage.ogImageType).toHaveAttribute("content", "image/jpg")
})
