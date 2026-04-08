---
title:  Visual regression testing with Playwright
date:   2025-04-16 10:00:00 +0200
slug: en/playwright-7
ogImage: https://marcinstanek.pl/images/blog/playwright-7/og.png
ogImageType: image/png
categories: [testautomation, playwright]
tags: [testautomation, playwright, en]
language: en
translationKey: playwright-7
description: Image comparisons via expect().toHaveScreenshot() - no extra plugin, with baseline updates and pixel diff thresholds.
---

## Introduction

The [Cypress visual post](/en/cypress-7/) wired up `cypress-image-snapshot`. Playwright ships first-party screenshot assertions: `expect(page).toHaveScreenshot()` and `expect(locator).toHaveScreenshot()`.

Previous post: [Cross-browser testing](/en/playwright-6/).

## First baseline

```typescript
import { test, expect } from "@playwright/test"

test("home after login", async ({ page }) => {
  // seed + login steps from earlier articles
  await page.goto("/login")
  // ...
  await expect(page).toHaveScreenshot({ fullPage: true })
})
```

The first run stores golden images next to your tests (`*-snapshots/` by default). Later runs diff pixels; failures drop artifacts under `test-results/`.

## Component-level shots

```typescript
await expect(page.getByTestId("sign-in-button")).toHaveScreenshot()
```

Use this when the full page is too noisy (animations, third-party widgets).

## Refreshing baselines

After an intentional UI change:

    npx playwright test --update-snapshots

Same workflow as Cypress’s `updateSnapshots` - review and commit PNGs deliberately.

## Thresholds

Tune flakiness from fonts or GPU differences:

```typescript
await expect(page).toHaveScreenshot({ maxDiffPixels: 100 })
```

Or set defaults through `expect` in `playwright.config.ts`.

## Reference imagery

The Cypress article’s diff screenshots still illustrate the idea; only the API differs.

![Historical Cypress diff example](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2020-03-29-cypress-visual-regression%2Fcypress-7-3.png?alt=media&token=7150c4ad-2b58-4077-8ed0-6827d5c6ae79)

## Git (Cypress era)

    https://github.com/12masta/react-redux-realworld-example-app/tree/7-cypress

    https://github.com/12masta/react-redux-realworld-example-app/pull/9/files

Next: [Playwright on Azure DevOps CI](/en/playwright-8/).
