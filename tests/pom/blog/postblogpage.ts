// postblogpage.ts
import { Page } from "@playwright/test"
import { INavbarPagePart, NavbarPagePart } from "../common/navbarpagepart"

export class PostBlogPage
  extends NavbarPagePart
  implements INavbarPagePart, IHomePlPage
{
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
