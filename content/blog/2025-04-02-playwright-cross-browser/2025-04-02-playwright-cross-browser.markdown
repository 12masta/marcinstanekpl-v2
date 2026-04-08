---
title:  Playwright i testy w wielu przeglądarkach
date:   2025-04-02 10:00:00 +0200
slug: playwright-6
ogImage: https://marcinstanek.pl/images/blog/playwright-6/og.png
ogImageType: image/png
categories: [testautomation, playwright]
tags: [testautomation, playwright, pl]
language: pl
translationKey: playwright-6
description: "Jedna paczka testów pod Chromium, Firefox i WebKit: wybór silników z konfiguracji i z linii poleceń oraz spojrzenie na to, jak dziś łatwiej myśleć o wielu przeglądarkach niż w czasach, gdy Cypress dopiero rozszerzał wsparcie dla Firefoxa i Edge."
---

## Wstęp

W [wpisie o Cypressie](/cypress-6/) śledziłeś moment, w którym runner dostał Firefox i Edge oraz aktualizację do wersji 4.x. Playwright od początku traktuje wiele silników jako coś oczywistego: jedna instalacja (`npx playwright install`), jeden plik spec, wiele projektów.

Poprzedni odcinek: [data-testid](/playwright-5/).

## Projekty w `playwright.config.ts`

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

Uruchomienie wszystkich:

    npx playwright test

Tylko Firefox:

    npx playwright test --project=firefox

Tylko Chromium:

    npx playwright test --project=chromium

Nie musisz przełączać przeglądarki w GUI jak w starym filmie z Cypressa - choć `npx playwright test --ui` nadal pozwala wybierać projekt z listy.

## Edge i Chrome kanałowe

Playwright potrafi uruchomić zainstalowany Edge (`channel: 'msedge'`) lub Chrome (`channel: 'chrome'`). To osobny wariant `use` w projekcie - przydatne, gdy chcesz zweryfikować coś bliżej „prawdziwej” instalacji użytkownika.

## Podsumowanie

| Cypress (2019-2020)     | Playwright (dziś)              |
|-------------------------|--------------------------------|
| Długo tylko Chromium    | Chromium + Firefox + WebKit out of the box |
| `cypress run --browser` | `playwright test --project=`   |

Kod z epoki Cypress pod Conduit:

    https://github.com/12masta/react-redux-realworld-example-app/tree/6-cypress

    https://github.com/12masta/react-redux-realworld-example-app/pull/7/files

Następny odcinek: [Wizualna regresja wbudowana w Playwright](/playwright-7/).
