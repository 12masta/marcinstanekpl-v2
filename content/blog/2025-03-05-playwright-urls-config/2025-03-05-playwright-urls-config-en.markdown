---
title:  Playwright - cleaning up URLs and configuration
date:   2025-03-05 10:00:00 +0200
slug: en/playwright-4
ogImage: https://marcinstanek.pl/images/blog/playwright-4/og.png
ogImageType: image/png
categories: [testautomation, playwright]
tags: [testautomation, playwright, en]
language: en
translationKey: playwright-4
description: "Set a default site address and shared preconditions once, then keep URL checks explicit and predictable. Environment variables split the web app from the API, mirroring the Cypress URLs article with Playwright configuration habits."
---

## Introduction

Repeating full `page.goto('http://localhost:4100/login')` and asserting that the URL merely “contains `/`” invites false greens. The [Cypress cleanup article](/en/cypress-4/) walked through hooks and `baseUrl`; here is the same discipline with Playwright Test.

Previous post: [Playwright refactoring - app actions vs POM](/en/playwright-3/).

## Hooks - `test.beforeEach`

Playwright reuses Mocha-style hooks. A common pattern: open `/login` before each test:

```typescript
import { test } from "@playwright/test"

test.describe("login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login")
  })

  test("successful login", async ({ page, request }) => {
    // ...
  })
})
```

In UI mode (`npx playwright test --ui`) the `beforeEach` steps are clearly grouped, similar to Cypress’s BEFORE EACH block.

![beforeEach in the runner (asset from the Cypress series)](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-11-12-urls%2Fcypress-4-1.gif?alt=media&token=274b2530-c182-404c-9eb2-2f4da0719dd1)

## `baseURL`

In `playwright.config.ts`:

```typescript
import { defineConfig } from "@playwright/test"

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:4100",
  },
})
```

Now `page.goto("/login")` resolves against the frontend origin - the same idea as `baseUrl` in `cypress.json`.

## URL assertions - substring traps

Checking only `/` still passes if the app navigates to `/you_should_not_be_here`. Prefer equality (or a tight regex):

```typescript
import { expect } from "@playwright/test"

const base = process.env.BASE_URL ?? "http://localhost:4100"

await expect(page).toHaveURL(`${base}/`)
await expect(page).toHaveURL(`${base}/login`)
```

![Wrong “include /” assertion (from the Cypress article)](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-11-12-urls%2F2-wrong-url-assertion.png?alt=media&token=6cb3750d-5a44-480a-9b42-75c7febcdec8)

## API base URL

Keep the ASP.NET host (`http://localhost:5000`) in `process.env.API_URL` and reuse it inside HTTP helpers. Optionally mirror values into `defineConfig({ env: { ... } })` if you prefer reading from `test.info()`, but shared modules reading `process.env` are usually enough.

Remember: issue `DELETE` before `POST` when seeding users - the same logical bug described in [login tests](/en/cypress-2/) and the URL refactor post if `create` skips cleanup.

On CI, define `BASE_URL` and `API_URL` as pipeline variables ([Cypress on Azure](/en/cypress-8/) shows the idea). Playwright needs no Cypress plugin: Node already sees `process.env` before tests start.

## Summary

| Cypress            | Playwright Test               |
|--------------------|-------------------------------|
| `cypress.json`     | `playwright.config.ts`        |
| `cy.visit('/x')`   | `page.goto('/x')` + `baseURL` |
| `Cypress.config()` | `process.env` / `defineConfig`|

Reference branch from the Cypress series:

    https://github.com/12masta/react-redux-realworld-example-app/tree/4-cypress

    https://github.com/12masta/react-redux-realworld-example-app/pull/4/files

Next: [`data-testid` selectors in Playwright](/en/playwright-5/).
