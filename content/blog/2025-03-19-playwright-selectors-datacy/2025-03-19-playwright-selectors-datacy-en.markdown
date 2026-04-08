---
title:  Playwright and stable selectors - the data-testid attribute
date:   2025-03-19 10:00:00 +0200
slug: en/playwright-5
ogImage: https://marcinstanek.pl/images/blog/playwright-5/og.png
ogImageType: image/png
categories: [testautomation, playwright]
tags: [testautomation, playwright, en]
language: en
translationKey: playwright-5
description: "Write tests that survive UI refactors by giving important elements stable hooks instead of long, fragile CSS selectors. The post follows Playwright’s recommended test id style and relates it to the familiar Cypress idea of dedicated data attributes."
---

## Introduction

Long `:nth-child` selectors break the first time someone tweaks the layout. [Cypress best practices](https://docs.cypress.io/guides/references/best-practices#Selecting-Elements) tell you to target dedicated `data-*` attributes (their examples and the [parallel blog post](/en/cypress-5/) often use `data-cy`). In the Playwright snippets below I stick to `data-testid` only: that is the attribute [`getByTestId`](https://playwright.dev/docs/locators#locate-by-test-id) queries by default, so you stay aligned with Playwright docs while following the same stability idea Cypress recommends.

Previous post: [URLs and configuration](/en/playwright-4/).

## The `data-testid` attribute

`getByTestId` resolves to `[data-testid=...]` out of the box; you do not need extra config to match Playwright's documented style.

React example (same refactor as the Cypress series, with Playwright's attribute name):

```jsx
<input
  className="form-control form-control-lg"
  type="email"
  data-testid="email-input"
  ...
/>
<input
  type="password"
  data-testid="password-input"
  ...
/>
<button type="submit" data-testid="sign-in-button">
  Sign in
</button>
```

## Spec code

```typescript
import { test, expect } from "@playwright/test"

test("logs in", async ({ page }) => {
  await page.goto("/login")
  await page.getByTestId("email-input").fill("test@test.com")
  await page.getByTestId("password-input").fill("test")
  await page.getByTestId("sign-in-button").click()
  await expect(page).toHaveURL(/localhost:4100\/$/)
})
```

`getByTestId` participates in the same auto-waiting and composition rules as other locators.

## Reference videos

[Selector playground (mp4)](https://s3.eu-north-1.amazonaws.com/marcinstanek.pl/2019-12-03-selectors-refactor/cypress-5-1-selector-playground-.mp4)

[Email field (mp4)](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-12-03-selectors-refactor%2Fcypress-5-2-data-cy-email-input.mp4?alt=media&token=adba3b05-3e4d-461f-9d1d-05f529b62dde.mp4)

## Git references

    https://github.com/12masta/react-redux-realworld-example-app/tree/5-cypress

    https://github.com/12masta/react-redux-realworld-example-app/pull/6/files

Next: [Cross-browser runs with Playwright](/en/playwright-6/).
