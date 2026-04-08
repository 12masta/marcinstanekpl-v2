---
title:  Playwright - your first end-to-end tests
date:   2025-01-22 10:00:00 +0200
categories: [testautomation, playwright]
tags: [testautomation, playwright, en]
language: en
slug: en/playwright-1
ogImage: https://marcinstanek.pl/images/blog/playwright-1/og.png
ogImageType: image/png
description: A practical introduction to Playwright using the official @playwright/test runner: install, config, navigation, locators, clicks, URL assertions, and form fields. Same React + ASP.NET sample app as the Cypress series, so you can compare both tools side by side.
---

## Introduction

[Playwright](https://playwright.dev) is Microsoft’s cross-browser automation library (Chromium, Firefox, WebKit, Edge). Unlike Cypress, you do not get a single bundled “test IDE” - but the official [`@playwright/test`](https://playwright.dev/docs/intro) runner gives you reports, retries, multi-browser projects, and UI mode without wiring up Mocha and Chai by hand.

This post mirrors [the first Cypress article](/en/cypress-1/): same application, same learning goal (a credible first E2E test). I assume the stack from [Environment preparation](/en/cypress-0/) is already running.

Repositories:

    https://github.com/12masta/react-redux-realworld-example-app

    https://github.com/12masta/aspnetcore-realworld-example-app

## Installation

Inside the frontend repo (`react-redux-realworld-example-app`), keep tests in their own folder so dependencies stay isolated. The quickest path:

    npm create playwright@latest

The wizard asks for a directory (for example `playwright-tests`), language (TypeScript or JavaScript), and browsers. Then:

    npx playwright install

downloads browser binaries (this can take a minute).

Manual equivalent:

    npm i -D @playwright/test
    npx playwright install

## `baseURL` configuration

Avoid repeating `http://localhost:4100` in every test by setting `baseURL` in `playwright.config.ts`:

```typescript
import { defineConfig } from "@playwright/test"

export default defineConfig({
  use: {
    baseURL: "http://localhost:4100",
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "firefox", use: { browserName: "firefox" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
})
```

Now `page.goto("/")` opens the app root, and `projects` runs the same specs on three engines - no `forEach` anti-pattern inside the tests themselves.

## First test - open the app

`tests/smoke.spec.ts` (or `.js`):

```typescript
import { test, expect } from "@playwright/test"

test("visits the home page", async ({ page }) => {
  await page.goto("/")
  await expect(page).toHaveTitle(/conduit/i)
})
```

Run:

    npx playwright test

Interactive trace and step-through:

    npx playwright test --ui

## Finding elements

Instead of brittle CSS such as `:nth-child(3) > .nav-link`, prefer accessibility-oriented locators - for example the “Sign up” link in the RealWorld navbar:

```typescript
test("sees the brand in the navbar", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("link", { name: "conduit" })).toBeVisible()
})
```

When you truly need raw CSS (as in the original Cypress walkthrough), `page.locator(".navbar-brand")` works. Playwright auto-waits before actions; if nothing matches within the timeout, the test fails - same comfort as Cypress’s command retries, expressed directly in the API.

## Clicking

`locator.click()` scrolls the element into view and clicks its center by default:

```typescript
test("clicks Sign up and lands on register", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("link", { name: "Sign up" }).click()
  await expect(page).toHaveURL(/\/register/)
})
```

This is the intentional, more stable counterpart to the old `.nav-link` example.

## Asserting the URL

`expect(page).toHaveURL()` accepts a string, regular expression, or predicate:

```typescript
await expect(page).toHaveURL("http://localhost:4100/register")
// or
await expect(page).toHaveURL(/\/register/)
```

## Filling inputs

Prefer `fill()` over legacy `page.type()` - it clears the field first, then types the value:

```typescript
test("types a username on /register", async ({ page }) => {
  await page.goto("/register")
  const userField = page.locator(".form-control").first()
  await userField.fill("exampleusername")
  await expect(userField).toHaveValue("exampleusername")
})
```

## Wrapping up

You can keep the entire “first steps” suite in one spec, just like the Cypress article:

```typescript
import { test, expect } from "@playwright/test"

test.describe("My first tests", () => {
  test("visits the app", async ({ page }) => {
    await page.goto("/")
  })

  test("finds the brand", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator(".navbar-brand")).toBeVisible()
  })

  test("clicks Sign up", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("link", { name: "Sign up" }).click()
  })

  test("asserts after click", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("link", { name: "Sign up" }).click()
    await expect(page).toHaveURL(/\/register/)
  })

  test("fills an input", async ({ page }) => {
    await page.goto("/register")
    const first = page.locator(".form-control").first()
    await first.fill("exampleusername")
    await expect(first).toHaveValue("exampleusername")
  })
})
```

An older revision of this article (separate `playwrighttests` folder with Mocha) still lives in the Git branch below for historical comparison. The text you are reading reflects the recommended `@playwright/test` workflow today.

Reference code:

    https://github.com/12masta/react-redux-realworld-example-app/tree/1-Playwright

Historical changeset:

    https://github.com/12masta/react-redux-realworld-example-app/pull/8/files

Next: [login tests with Playwright](/en/playwright-2/) - API setup like [Cypress](/en/cypress-2/). Full parallel track: `/en/playwright-1/` … `/en/playwright-9/` (Cypress posts stay unchanged).
