// homepage.ts
import { Page } from "@playwright/test"
import { INavbarPagePart, NavbarPagePart } from "../common/navbarpagepart"

export class HomePage
  extends NavbarPagePart
  implements INavbarPagePart, IHomePlPage
{
  async gotoPl() {
    await this.page.goto("/")
    await this.navbar.waitFor()
  }

  async gotoEn() {
    await this.page.goto("/en/")
    await this.navbar.waitFor()
  }
}

export interface IHomePlPage extends NavbarPagePart {
  gotoPl(): Promise<void>
  gotoEn(): Promise<void>
}
