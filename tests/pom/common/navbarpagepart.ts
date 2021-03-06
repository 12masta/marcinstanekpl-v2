// navbarpagepart.ts
import { Locator, Page } from "@playwright/test"

export class NavbarPagePart implements INavbarPagePart {
  readonly page: Page
  readonly navbar: Locator
  readonly navbarBrand: Locator
  readonly navbarLanguageLink: Locator
  readonly blogLink: Locator
  readonly ogImage: Locator
  readonly ogImageType: Locator

  constructor(page: Page) {
    this.page = page
    this.navbar = page.locator("data-test=navbar-brand")
    this.navbarBrand = page.locator("data-test=navbar-brand")
    this.navbarLanguageLink = page.locator("data-test=navbar-language-link")
    this.blogLink = page.locator("data-test=blog-link")
    this.ogImage = page.locator("id=og:image")
    this.ogImageType = page.locator("id=og:image:type")
  }
}

export interface INavbarPagePart {
  readonly navbar: Locator
  readonly page: Page
  readonly navbarBrand: Locator
  readonly navbarLanguageLink: Locator
  readonly blogLink: Locator
  readonly ogImage: Locator
  readonly ogImageType: Locator
}
