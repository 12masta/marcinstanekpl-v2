---
title:  Playwright and cross-browser testing
date:   2025-04-02 10:00:00 +0200
slug: en/playwright-6
ogImage: https://marcinstanek.pl/images/blog/playwright-6/og.png
ogImageType: image/png
categories: [testautomation, playwright]
tags: [testautomation, playwright, en]
language: en
translationKey: playwright-6
description: "One test suite against Chromium, Firefox, and WebKit: how Playwright lets you pick engines from configuration and the command line, and why multi-browser coverage today feels easier than when Cypress was still catching up on Firefox and Edge."
---

## Introduction

The [Cypress cross-browser article](/en/cypress-6/) followed the release that added Firefox and Edge plus the v4 upgrade. Playwright treats multi-engine support as table stakes: install browsers once (`npx playwright install`), keep a single spec file, declare projects in config.

Previous post: [`data-testid` selectors](/en/playwright-5/).

## `projects` in `playwright.config.ts`

```typescript
import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
})
```

Run everything:

    npx playwright test

Firefox only:

    npx playwright test --project=firefox

You are not forced to pick a browser from a GUI runner (though `npx playwright test --ui` still lets you choose a project interactively).

## Edge / branded Chrome

Optional projects can target installed browsers via `channel: 'msedge'` or `channel: 'chrome'` when you need something closer to end-user installs.

## Summary

| Cypress (2019-2020) | Playwright today            |
|-----------------------|-----------------------------|
| Chromium-first story  | Chromium + Firefox + WebKit by default |
| `cypress run --browser` | `playwright test --project=` |

Historical Conduit branch:

    https://github.com/12masta/react-redux-realworld-example-app/tree/6-cypress

    https://github.com/12masta/react-redux-realworld-example-app/pull/7/files

Next: [Visual regression with built-in screenshots](/en/playwright-7/).
