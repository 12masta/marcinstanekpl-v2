---
title:  Playwright test refactoring - app actions vs Page Object Model
date:   2025-02-19 10:00:00 +0200
slug: en/playwright-3
ogImage: https://marcinstanek.pl/images/blog/playwright-3/og.png
ogImageType: image/png
categories: [testautomation, playwright]
tags: [testautomation, playwright, en]
language: en
translationKey: playwright-3
description: Two ways to structure Playwright Test code - plain “app action” functions (the Cypress custom-command idea) versus classic Page Object classes wrapping Page.
---

## Introduction

After [login tests with Playwright](/en/playwright-2/), specs get noisy: repeated API setup, selectors, and assertions. Cypress solved that with [custom commands and app actions](/en/cypress-3/). Playwright has no `Cypress.Commands.add`, but you can express the same layering in TypeScript.

Previous post: [Login tests with Playwright](/en/playwright-2/). Cypress original: [Test refactoring - App Actions vs POM](/en/cypress-3/).

## App actions - functions + `Page`

Instead of `cy.login`, export functions that take `Page` or `APIRequestContext`:

```typescript
// helpers/auth.ts
import type { APIRequestContext, Page } from "@playwright/test"
import { expect } from "@playwright/test"

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

The test reads like a scenario:

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

Need Cypress-style chaining? Return objects with methods or use `test.extend` fixtures - the explicit import replaces magic globals, which many teams prefer.

## Page Object Model

Same flow with classes holding `Page`:

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

Add a `HomePage` class for navbar assertions exactly like the [Cypress POM article](/en/cypress-3/) - only the API changes from `cy` to `Page`. HTTP seeding uses Playwright’s `request` fixture instead of `cy.request`.

## Empty strings and `fill`

Cypress rejected `.type('')` and forced conditional logic ([issue](https://github.com/cypress-io/cypress/issues/3587)). In Playwright, `fill('')` is usually fine, and for “empty fields” you can simply skip `fill` and click submit - same trade-off as the patched `cy.login` in the original post.

## Which style?

- Modules / functions - little ceremony, great when the team already models the domain in TS.
- POM - familiar after Selenium; keeps a single map of the screen.

You can mix both (POM for UI, plain functions for API).

## Git references

Behaviour matches the Cypress series branch:

    https://github.com/12masta/react-redux-realworld-example-app/tree/3-cypress

    https://github.com/12masta/react-redux-realworld-example-app/pull/3/files

Original commits: [app actions](https://github.com/12masta/react-redux-realworld-example-app/commit/11d965258e549f1de7cc003858aba7ee6e0baba4), [POM](https://github.com/12masta/react-redux-realworld-example-app/commit/c8408db5ec5d9dd23fc528bb692a2dff5cd91bae).

Next: [URLs, `baseURL`, and config](/en/playwright-4/).
