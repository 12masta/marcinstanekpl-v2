import { test, expect } from "@playwright/test"
import { HomePage } from "./../pom/home/homepage"
import { BlogHomePage } from "./../pom/blog/bloghomepage"
import { PostBlogPage } from "./../pom/blog/postblogpage"

/** Stable fixture post with per-post Open Graph metadata (not site default). */
const POST_DOTNET_POLLY_OG_IMAGE =
  "https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2021-07-01-retry-policy-in-test-methods%2FRetry%20policy%20for%20methods%20in%20terms%20of%20integration%20tests.png?alt=media&token=e5a5db4b-7f5b-4ffb-94fa-9d22751f79f6"
const POST_DOTNET_POLLY_OG_TYPE = "image/png"

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

test("Seo tags - single post pl", async ({ page }) => {
  const postPage = new PostBlogPage(page)
  await postPage.gotoPl()

  await expect(postPage.ogImage).toHaveAttribute(
    "content",
    POST_DOTNET_POLLY_OG_IMAGE
  )
  await expect(postPage.ogImageType).toHaveAttribute(
    "content",
    POST_DOTNET_POLLY_OG_TYPE
  )
})

test("Seo tags - single post en", async ({ page }) => {
  const postPage = new PostBlogPage(page)
  await postPage.gotoEn()

  await expect(postPage.ogImage).toHaveAttribute(
    "content",
    POST_DOTNET_POLLY_OG_IMAGE
  )
  await expect(postPage.ogImageType).toHaveAttribute(
    "content",
    POST_DOTNET_POLLY_OG_TYPE
  )
})
