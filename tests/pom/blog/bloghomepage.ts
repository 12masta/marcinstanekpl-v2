// homepage.ts
import { Page } from "@playwright/test"
import { INavbarPagePart, NavbarPagePart } from "../common/navbarpagepart"

export class BlogHomePage
  extends NavbarPagePart
  implements INavbarPagePart, IHomePlPage
{
  async gotoPl() {
    await this.page.goto("http://localhost:8000" + "/blog/pl/")
    await this.navbar.waitFor()
  }

  async gotoEn() {
    await this.page.goto("http://localhost:8000" + "/blog/en/")
    await this.navbar.waitFor()
  }
}

export interface IHomePlPage extends NavbarPagePart {
  gotoPl(): Promise<void>
  gotoEn(): Promise<void>
}
