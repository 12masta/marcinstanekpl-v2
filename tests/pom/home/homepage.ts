// homepage.ts
import { Page } from "@playwright/test"
import { INavbarPagePart, NavbarPagePart } from "../common/navbarpagepart"

export class HomePage
  extends NavbarPagePart
  implements INavbarPagePart, IHomePlPage
{
  async goto(languageOverride = "") {
    await this.page.goto("http://localhost:8000" + languageOverride)
    await this.page.locator("data-test=navbar").waitFor()
  }
}

export interface IHomePlPage extends NavbarPagePart {
  goto(languageOverride: string): Promise<void>
}
