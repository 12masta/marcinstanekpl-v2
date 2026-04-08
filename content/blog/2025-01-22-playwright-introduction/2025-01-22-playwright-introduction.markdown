---
title:  Playwright - pierwsze testy E2E
date:   2025-01-22 10:00:00 +0200
categories: [testautomation, playwright]
tags: [testautomation, playwright, pl]
language: pl
translationKey: playwright-1
slug: playwright-1
ogImage: https://marcinstanek.pl/images/blog/playwright-1/og.png
ogImageType: image/png
description: "Praktyczny start z Playwrightem przy automatyzacji przeglądarki: instalacja oficjalnego runnera, nawigacja, stabilne wyszukiwanie elementów, praca z formularzami i sprawdzanie oczekiwań. Na tym samym przykładowym projekcie co seria o Cypressie, żeby wygodnie porównać oba narzędzia."
---

## Wstęp

[Playwright](https://playwright.dev) to biblioteka Microsoftu do automatyzacji przeglądarki (Chromium, Firefox, WebKit, Edge). W przeciwieństwie do Cypressa nie dostajesz jednego „zamkniętego” IDE - za to oficjalny runner testów [`@playwright/test`](https://playwright.dev/docs/intro) daje raporty, retry, projekty pod wiele przeglądarek i tryb UI bez konfigurowania Mochy ani Chai.

Ten wpis jest odpowiednikiem [pierwszego odcinka o Cypressie](/cypress-1/): ta sama aplikacja, ten sam cel (pierwszy sensowny test E2E). Zakładam, że masz już backend i frontend z [Przygotowanie środowiska](/cypress-0/).

Repozytoria:

    https://github.com/12masta/react-redux-realworld-example-app

    https://github.com/12masta/aspnetcore-realworld-example-app

## Instalacja

W katalogu frontendu (`react-redux-realworld-example-app`) wygodnie jest trzymać testy w osobnym folderze, żeby nie mieszać zależności z aplikacji. Najprościej:

    npm create playwright@latest

Kreator zapyta o folder (np. `playwright-tests`), język (TypeScript lub JavaScript) i przeglądarki. Na końcu:

    npx playwright install

To pobierze binaria przeglądarek (może to chwilę potrwać).

Alternatywa „ręczna”:

    npm i -D @playwright/test
    npx playwright install

## Konfiguracja `baseURL`

Żeby nie powtarzać `http://localhost:4100` w każdym teście, ustaw `baseURL` w `playwright.config.ts`:

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

Dzięki temu `page.goto("/")` prowadzi od razu na front aplikacji, a sekcja `projects` uruchamia ten sam zestaw testów na trzech silnikach - bez pętli w kodzie testu.

## Pierwszy test - wejście na stronę

Plik `tests/smoke.spec.ts` (lub `.js`):

```typescript
import { test, expect } from "@playwright/test"

test("odwiedza stronę główną", async ({ page }) => {
  await page.goto("/")
  await expect(page).toHaveTitle(/conduit/i)
})
```

Uruchomienie:

    npx playwright test

Tryb z podglądem kroków i nagrywaniem:

    npx playwright test --ui

## Szukanie elementu

Zamiast długich selektorów CSS typu `:nth-child(3) > .nav-link` warto od razu celować w dostępność i stabilne role - np. link „Sign up” w navbarze RealWorld:

```typescript
test("widzi markę w navbarze", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("link", { name: "conduit" })).toBeVisible()
})
```

Gdy potrzebujesz czystego CSS (jak w pierwszym poście o Cypressie), użyj `page.locator(".navbar-brand")`. Playwright automatycznie czeka na element zanim wykona akcję; jeśli selektor nic nie znajdzie w rozsądnym czasie, test się wyłoży - podobna idea jak „implicit” asercje w Cypressie, tylko explicite w API.

## Kliknięcie

`locator.click()` przewija element do widoku i klika w środek (domyślnie):

```typescript
test("klika Sign up i przechodzi na rejestrację", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("link", { name: "Sign up" }).click()
  await expect(page).toHaveURL(/\/register/)
})
```

To jest świadomy odpowiednik wcześniejszego przykładu z `.nav-link` - czytelniejszy i mniej kruchy przy drobnych zmianach w DOM.

## Asercja adresu URL

`expect(page).toHaveURL()` przyjmuje string, regex lub callback:

```typescript
await expect(page).toHaveURL("http://localhost:4100/register")
// albo
await expect(page).toHaveURL(/\/register/)
```

## Wypełnianie pola input

Zamiast przestarzałego `page.type()` używaj `fill()` (najpierw czyści pole, potem wpisuje tekst):

```typescript
test("wpisuje nazwę użytkownika na /register", async ({ page }) => {
  await page.goto("/register")
  const userField = page.locator(".form-control").first()
  await userField.fill("exampleusername")
  await expect(userField).toHaveValue("exampleusername")
})
```

## Podsumowanie

W jednym pliku spec możesz zebrać cały „pierwszy zestaw” jak w serii Cypress:

```typescript
import { test, expect } from "@playwright/test"

test.describe("Moje pierwsze testy", () => {
  test("odwiedza aplikację", async ({ page }) => {
    await page.goto("/")
  })

  test("znajduje markę", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator(".navbar-brand")).toBeVisible()
  })

  test("klika Sign up", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("link", { name: "Sign up" }).click()
  })

  test("asercja po kliknięciu", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("link", { name: "Sign up" }).click()
    await expect(page).toHaveURL(/\/register/)
  })

  test("wpisuje tekst w pole", async ({ page }) => {
    await page.goto("/register")
    const first = page.locator(".form-control").first()
    await first.fill("exampleusername")
    await expect(first).toHaveValue("exampleusername")
  })
})
```

Pełny przykład z wcześniejszej wersji tego wpisu (osobny katalog `playwrighttests`, Mocha itd.) nadal możesz prześledzić na GitHubie - obecna wersja artykułu celowo pokazuje zalecane dziś `@playwright/test`.

Kod referencyjny:

    https://github.com/12masta/react-redux-realworld-example-app/tree/1-Playwright

Changeset (historyczny):

    https://github.com/12masta/react-redux-realworld-example-app/pull/8/files

W następnym odcinku: [testy logowania z Playwright](/playwright-2/) - API jak w [Cypressie](/cypress-2/). Pełna równoległa seria: `/playwright-1/` … `/playwright-9/` (bez zmian w treści wpisów o Cypressie).
