---
title:  Refaktoryzacja testów Playwright - akcje aplikacji vs Page Object Model
date:   2025-02-19 10:00:00 +0200
slug: playwright-3
ogImage: https://marcinstanek.pl/images/blog/playwright-3/og.png
ogImageType: image/png
categories: [testautomation, playwright]
tags: [testautomation, playwright, pl]
language: pl
translationKey: playwright-3
description: Porównanie dwóch stylów organizacji kodu w Playwright Test - czytelne funkcje „akcji” (jak App Actions w Cypressie) oraz klasyczny Page Object Model z klasami i konstruktorem Page.
---

## Wstęp

Po [logowaniu z Playwright](/playwright-2/) specyfikacja robi się długa: ten sam setup API, te same selektory, powtarzalne asercje. W Cypressie rozwiązywałeś to [custom commands i App Actions](/cypress-3/); w Playwrightcie nie ma `Cypress.Commands.add`, ale ten sam podział odpowiedzialności da się zrobić czysto w TypeScriptzie.

Poprzedni wpis serii: [Testy logowania z Playwright](/playwright-2/). Oryginał przy Cypressie: [Refaktoryzacja testów - App Actions vs POM](/cypress-3/).

## „App Actions” - zwykłe funkcje + `Page`

Zamiast magicznego `cy.login` tworzysz moduł z funkcjami, które przyjmują `Page` lub `APIRequestContext`:

```typescript
// helpers/auth.ts
import { expect, type APIRequestContext, type Page } from "@playwright/test"

const API = process.env.API_URL ?? "http://localhost:5000"

export async function seedUser(request: APIRequestContext) {
  const body = { user: { username: "test", email: "test@test.com", password: "test" } }
  const del = await request.delete(`${API}/users`, { data: body })
  expect([200, 204, 404]).toContain(del.status())
  const post = await request.post(`${API}/users`, { data: body })
  expect(post.ok()).toBeTruthy()
}

export async function loginViaForm(page: Page, email: string, password: string) {
  if (email) await page.locator(".form-control").nth(0).fill(email)
  if (password) await page.locator(".form-control").nth(1).fill(password)
  await page.locator(".btn").click()
}

export async function expectLoggedInNavbar(page: Page) {
  await expect(page.locator(":nth-child(4) > .nav-link")).toHaveAttribute("href", "/@test")
  await expect(page.locator(":nth-child(3) > .nav-link")).toHaveAttribute("href", "/settings")
}
```

Test staje się listą kroków biznesowych:

```typescript
import { test, expect } from "@playwright/test"
import { seedUser, loginViaForm, expectLoggedInNavbar } from "../helpers/auth"

test("successful login", async ({ page, request }) => {
  await seedUser(request)
  await page.goto("/login")
  await loginViaForm(page, "test@test.com", "test")
  await expect(page).toHaveURL(/localhost:4100\/$/)
  await expectLoggedInNavbar(page)
})
```

Chcesz „łańcuch” jak w Cypressie? Zwracaj obiekt z metodami albo użyj `test.extend` i fixture z metodami - to odpowiednik centralnego `support/index.js`, tylko jawny import w pliku testu.

## Page Object Model

Ten sam scenariusz w POM: klasa trzyma referencję do `Page` i enkapsuluje lokatory.

```typescript
// page-objects/LoginPage.ts
import type { Page } from "@playwright/test"

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/login")
  }

  private email() {
    return this.page.locator(".form-control").nth(0)
  }
  private password() {
    return this.page.locator(".form-control").nth(1)
  }

  async submitCredentials(email: string, password: string) {
    if (email) await this.email().fill(email)
    if (password) await this.password().fill(password)
    await this.page.locator(".btn").click()
  }

  async loginExpectingError() {
    await this.submitCredentials("test@test.com", "wrong")
    return this
  }
}
```

Osobna klasa `HomePage` z metodami na linki w navbarze (jak w [POM z Cypressa](/cypress-3/)) zwracasz po udanym logowaniu - ten sam podział plików, tylko z `Page` zamiast `cy`. API użytkownika (`User` z `remove`/`create`) wołasz przez `request.post` / `request.delete`.

## Puste stringi a `fill`

W Cypressie `.type('')` było problemem i wymagało warunków w custom command ([issue](https://github.com/cypress-io/cypress/issues/3587)). W Playwright `fill('')` na pustym polu zwykle wystarczy, a jeśli chcesz tylko kliknąć „Sign in”, po prostu nie wywołujesz `fill` - dokładnie ten sam kompromis co w poprawionej wersji `cy.login` z oryginalnego wpisu.

## Co wybrać?

- Funkcje / małe moduły - mniej ceremonii, świetne przy zespole, który i tak trzyma warstwę domenową w TS.
- POM - znajomy układ dla ludzi po Selenium, łatwo trzymać „mapę” ekranu w jednym miejscu.

Oba style mogą współistnieć (np. POM dla UI, czyste funkcje dla API).

## Kod na GitHubie

Logika odpowiada gałęzi z serii Cypress:

    https://github.com/12masta/react-redux-realworld-example-app/tree/3-cypress

    https://github.com/12masta/react-redux-realworld-example-app/pull/3/files

Commity z artykułu o Cypressie: [App Actions](https://github.com/12masta/react-redux-realworld-example-app/commit/11d965258e549f1de7cc003858aba7ee6e0baba4), [POM](https://github.com/12masta/react-redux-realworld-example-app/commit/c8408db5ec5d9dd23fc528bb692a2dff5cd91bae).

Następny odcinek: [URL-e, `baseURL` i konfiguracja](/playwright-4/).
