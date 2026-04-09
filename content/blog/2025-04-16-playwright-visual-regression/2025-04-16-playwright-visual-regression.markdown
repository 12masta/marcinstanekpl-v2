---
title:  Wizualna regresja z Playwright
date:   2025-04-16 10:00:00 +0200
slug: playwright-7
ogImage: https://marcinstanek.pl/images/blog/playwright-7/og.png
ogImageType: image/png
categories: [testautomation, playwright]
tags: [testautomation, playwright, pl]
language: pl
translationKey: playwright-7
description: "Wykrywanie niechcianych zmian wyglądu dzięki zrzutom ekranu w Playwrightcie: obrazy referencyjne, aktualizacja po świadomych zmianach w UI oraz dobór tolerancji, żeby testy były wiarygodne, a nie serią fałszywych alarmów."
---

## Wstęp

[Wpis o Cypressie](/cypress-7/) opierał się na `cypress-image-snapshot`. W Playwright porównanie obrazów jest w rdzeniu: `expect(locator).toHaveScreenshot()` / `expect(page).toHaveScreenshot()`.

Poprzedni odcinek: [Wiele przeglądarek](/playwright-6/).

## Pierwszy baseline

```typescript
import { test, expect } from "@playwright/test"

test("ekran po zalogowaniu", async ({ page, request }) => {
  // ... seed + login jak w wcześniejszych częściach
  await page.goto("/login")
  // ...
  await expect(page).toHaveScreenshot({ fullPage: true })
})
```

Pierwsze uruchomienie zapisuje plik referencyjny obok spec (domyślnie `*-snapshots/`). Kolejne porównują piksel po pikselu; przy różnicy test pada i zostawia artefakty (`test-results/`).

## Element zamiast całej strony

```typescript
await expect(page.getByTestId("sign-in-button")).toHaveScreenshot()
```

Przydatne, gdy reszta layoutu jest zbyt dynamiczna (animacje, reklamy).

## Aktualizacja wzorców

Po zamierzonej zmianie UI:

    npx playwright test --update-snapshots

Odpowiednik `updateSnapshots` z Cypressa - commit nowych PNG świadomie, tak jak robiłeś z `cypress/snapshots`.

## Progi i stabilność

Często ustawisz:

```typescript
await expect(page).toHaveScreenshot({ maxDiffPixels: 100 })
```

albo globalnie w `expect` w `playwright.config.ts` (`toHaveScreenshot` threshold). To ogranicza flaky diffy od fontów antyaliasingu między agentami CI.

## Ilustracje z tamtej serii

Efekt „wyłapania” pojedynczej zmiany w tekście nadal dobrze pokazują zrzuty z [cypress-7](/cypress-7/) - mechanizm jest ten sam, tylko API inne.

![Przykładowy diff z epoki Cypress](/media-from-firebase/2020-03-29-cypress-visual-regression/cypress-7-3.png)

## Kod na GitHubie (Cypress / historyczny)

    https://github.com/12masta/react-redux-realworld-example-app/tree/7-cypress

    https://github.com/12masta/react-redux-realworld-example-app/pull/9/files

Następny odcinek: [Playwright w CI na Azure DevOps](/playwright-8/).
