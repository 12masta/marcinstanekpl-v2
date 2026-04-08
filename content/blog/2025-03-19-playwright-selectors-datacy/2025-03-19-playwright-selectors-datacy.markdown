---
title:  Playwright i stabilne selektory - atrybut data-testid
date:   2025-03-19 10:00:00 +0200
slug: playwright-5
ogImage: https://marcinstanek.pl/images/blog/playwright-5/og.png
ogImageType: image/png
categories: [testautomation, playwright]
tags: [testautomation, playwright, pl]
language: pl
translationKey: playwright-5
description: Zastąpienie kruchych selektorów CSS atrybutem data-testid i lokatorem getByTestId w Playwright - ta sama filozofia co dedykowane data-* w best practices Cypressa, z atrybutem zalecanym przez Playwright.
---

## Wstęp

Selektory zbudowane na `:nth-child` i długich łańcuchach klas pękają przy pierwszym refaktorze UI. W [best practices Cypressa](https://docs.cypress.io/guides/references/best-practices#Selecting-Elements) zaleca się wybieranie elementów po dedykowanych atrybutach `data-*` (w przykładach Cypressa i w [równoległym wpisie](/cypress-5/) pojawia się m.in. `data-cy`). W przykładach Playwright poniżej używam wyłącznie `data-testid`: tak nazywa atrybut, którego szuka [`getByTestId`](https://playwright.dev/docs/locators#locate-by-test-id) - to ten sam pomysł co rekomendacja Cypressa, bez mieszania konwencji nazw w kodzie testów.

Poprzedni odcinek: [URL-e i konfiguracja](/playwright-4/).

## Atrybut `data-testid`

Playwright domyślnie mapuje `getByTestId(...)` na selektor `[data-testid=...]` - nie trzeba nic zmieniać w `playwright.config.ts`, żeby pisać zgodnie z dokumentacją narzędzia.

Przykład w `Login.js` (odpowiednik refaktoryzacji z serii o Cypressie, z atrybutem pod Playwright):

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

## Test

```typescript
import { test, expect } from "@playwright/test"

test("loguje użytkownika", async ({ page }) => {
  await page.goto("/login")
  await page.getByTestId("email-input").fill("test@test.com")
  await page.getByTestId("password-input").fill("test")
  await page.getByTestId("sign-in-button").click()
  await expect(page).toHaveURL(/localhost:4100\/$/)
})
```

`getByTestId` łączy się z innymi lokatorami (`filter`, `and`) i korzysta z tego samego auto-waitu co pozostałe API.

## Materiały wideo

Nagrania z tamtego wpisu nadal dobrze ilustrują dodawanie atrybutu w React:

[Selector playground (mp4)](https://s3.eu-north-1.amazonaws.com/marcinstanek.pl/2019-12-03-selectors-refactor/cypress-5-1-selector-playground-.mp4)

[Email input (mp4)](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-12-03-selectors-refactor%2Fcypress-5-2-data-cy-email-input.mp4?alt=media&token=adba3b05-3e4d-461f-9d1d-05f529b62dde.mp4)

## Kod na GitHubie

Zmiany w aplikacji i testach z oryginalnej serii:

    https://github.com/12masta/react-redux-realworld-example-app/tree/5-cypress

    https://github.com/12masta/react-redux-realworld-example-app/pull/6/files

Następny odcinek: [Wiele przeglądarek z Playwright](/playwright-6/).
