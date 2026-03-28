// postblogpage.ts
import { Locator, Page } from "@playwright/test"
import { INavbarPagePart, NavbarPagePart } from "../common/navbarpagepart"

export class PostBlogPage
  extends NavbarPagePart
  implements INavbarPagePart, IHomePlPage
{
  readonly postHeading: Locator

  constructor(page: Page) {
    super(page)
    this.postHeading = page.locator("article.blog-post h1")
  }

  async gotoPl() {
    await this.page.goto("/dotnet-polly")
    await this.navbar.waitFor()
  }

  async gotoEn() {
    await this.page.goto("/en/dotnet-polly")
    await this.navbar.waitFor()
  }
}

export interface IHomePlPage extends NavbarPagePart {
  gotoPl(): Promise<void>
  gotoEn(): Promise<void>
}
