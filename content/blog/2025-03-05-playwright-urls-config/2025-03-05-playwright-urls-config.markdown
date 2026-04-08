---
title:  Playwright - porządek z adresami URL i konfiguracją
date:   2025-03-05 10:00:00 +0200
slug: playwright-4
ogImage: https://marcinstanek.pl/images/blog/playwright-4/og.png
ogImageType: image/png
categories: [testautomation, playwright]
tags: [testautomation, playwright, pl]
language: pl
translationKey: playwright-4
description: "Domyślny adres aplikacji i wspólne przygotowanie przed każdym testem, potem przewidywalne sprawdzanie URL-i. Zmienne środowiskowe oddzielają front od API - odpowiednik wpisu o adresach w Cypressie, ale z konwencjami Playwrighta."
---

## Wstęp

Powtarzalne `page.goto('http://localhost:4100/login')` i asercje typu „URL zawiera `/`” to prośba o fałszywy zielony wynik. W [wpisie o Cypressie](/cypress-4/) poszedłeś przez hooki i `baseUrl`; tutaj ten sam porządek w Playwright Test.

Poprzedni odcinek: [Refaktoryzacja - akcje vs POM](/playwright-3/).

## Hooki - `test.beforeEach`

W Mocha / Playwright masz te same cztery haki (`before`, `after`, `beforeEach`, `afterEach`). Typowy wzorzec: przed każdym testem wejście na `/login`:

```typescript
import { test } from "@playwright/test"

test.describe("logowanie", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login")
  })

  test("successful login", async ({ page, request }) => {
    // ...
  })
})
```

W UI Playwrighta (tryb `--ui`) kroki `beforeEach` są wyraźnie widoczne - podobnie jak blok BEFORE EACH w runnerze Cypressa.

![beforeEach w runnerze (materiał z serii Cypress)](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-11-12-urls%2Fcypress-4-1.gif?alt=media&token=274b2530-c182-404c-9eb2-2f4da0719dd1)

## `baseURL`

W `playwright.config.ts`:

```typescript
import { defineConfig } from "@playwright/test"

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:4100",
  },
})
```

Wtedy `page.goto("/login")` rozwija się do pełnego adresu frontu - odpowiednik `baseUrl` w `cypress.json`.

## Asercja URL - `contain` vs pełna zgodność

Sprawdzenie tylko fragmentu (`/`) pozwala przejść na złą podstronę, jeśli nadal zawiera ten znak. Bezpieczniej:

```typescript
import { expect } from "@playwright/test"

const base = process.env.BASE_URL ?? "http://localhost:4100"

await expect(page).toHaveURL(`${base}/`)
await expect(page).toHaveURL(`${base}/login`)
```

Albo `toHaveURL(new RegExp(...))`, jeśli query string jest niestabilny.

![Pułapka „include /” (z serii o Cypressie)](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-11-12-urls%2F2-wrong-url-assertion.png?alt=media&token=6cb3750d-5a44-480a-9b42-75c7febcdec8)

## Osobny URL API

Backend zostaje na innym hoście (`http://localhost:5000`). Trzymaj go w zmiennej środowiskowej i używaj w helperach HTTP:

```typescript
// playwright.config.ts - opcjonalnie udostępnij testom
export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:4100",
  },
  env: {
    API_URL: process.env.API_URL ?? "http://localhost:5000",
  },
})
```

W teście: `const api = test.info().project.use.env?.API_URL` - prościej jednak czytać `process.env.API_URL` w module współdzielonym z helperami, tak jak w [poprzednim wpisie](/playwright-3/).

Ważne: przed `POST /users` usuń użytkownika `DELETE` - ten sam błąd logiczny co w [Cypressie](/cypress-2/) i [cypress-4](/cypress-4/), jeśli `create` nie czyści stanu.

Na CI ustawiasz `BASE_URL` i `API_URL` w zmiennych pipeline (por. [Azure + Cypress](/cypress-8/)); w Playwright nie potrzebujesz pluginu - wartości wchodzą do `process.env` przed startem Node.

## Podsumowanie

| Cypress              | Playwright Test              |
|----------------------|------------------------------|
| `cypress.json`       | `playwright.config.ts`       |
| `cy.visit('/x')`     | `page.goto('/x')` + `baseURL`|
| `Cypress.config()`   | `process.env` / `defineConfig` |

Kod referencyjny (gałąź z serii Cypress):

    https://github.com/12masta/react-redux-realworld-example-app/tree/4-cypress

    https://github.com/12masta/react-redux-realworld-example-app/pull/4/files

Następny odcinek: [Selektory `data-testid` w Playwright](/playwright-5/).
