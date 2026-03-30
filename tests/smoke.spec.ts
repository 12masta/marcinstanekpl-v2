import { test, expect } from "@playwright/test"
import { HomePage } from "./pom/home/homepage"
import { BlogHomePage } from "./pom/blog/bloghomepage"
import { PostBlogPage } from "./pom/blog/postblogpage"
import { expandNavbarIfCollapsed } from "./helpers/navigation"

test("home PL loads with expected title", async ({ page }) => {
  await page.goto("/")
  await page.locator("data-test=navbar").waitFor()
  await expect(page).toHaveTitle("Strona główna | marcinstanek.pl")
})

test("home EN loads with expected title", async ({ page }) => {
  await page.goto("/en/")
  await page.locator("data-test=navbar").waitFor()
  await expect(page).toHaveTitle("Home page | marcinstanek.pl")
})

test("about PL loads with expected title", async ({ page }) => {
  await page.goto("/o-mnie/")
  await page.locator("data-test=navbar").waitFor()
  await expect(page).toHaveTitle("O mnie | marcinstanek.pl")
})

test("about EN loads with expected title", async ({ page }) => {
  await page.goto("/en/about/")
  await page.locator("data-test=navbar").waitFor()
  await expect(page).toHaveTitle("About | marcinstanek.pl")
})

test("unknown route shows 404 content", async ({ page }) => {
  await page.goto("/__playwright_missing_route__/")
  await expect(page.getByRole("heading", { name: "404: Not Found" })).toBeVisible()
  await expect(page).toHaveTitle("404: Not Found | marcinstanek.pl")
})

test("blog index PL lists posts", async ({ page }) => {
  const blog = new BlogHomePage(page)
  await blog.gotoPl()
  await expect(
    page.locator("h1.display-5, article.post-list-item").first()
  ).toBeVisible()
})

test("fixture blog post renders title", async ({ page }) => {
  const post = new PostBlogPage(page)
  await post.gotoPl()
  await expect(post.postHeading).toContainText("Polityka ponawiania")
})

test("from home PL, Blog link goes to Polish blog index", async ({ page }) => {
  const home = new HomePage(page)
  await home.gotoPl()
  await expandNavbarIfCollapsed(page)
  await home.blogLink.click()
  await expect(page).toHaveURL(/\/blog\/pl\/?$/)
})

test("from home PL, language link goes to EN home", async ({ page }) => {
  const home = new HomePage(page)
  await home.gotoPl()
  await expandNavbarIfCollapsed(page)
  await home.navbarLanguageLink.click()
  await expect(page).toHaveURL(/\/en\/?$/)
})
