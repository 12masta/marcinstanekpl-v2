---
title:  Testy logowania z Playwright
date:   2025-02-05 10:00:00 +0200
slug: playwright-2
ogImage: https://marcinstanek.pl/images/blog/playwright-2/og.png
ogImageType: image/png
categories: [testautomation, playwright]
tags: [testautomation, playwright, pl]
language: pl
translationKey: playwright-2
description: "Cztery realistyczne scenariusze logowania: udane logowanie, złe hasło, nieistniejący użytkownik i puste pola, z przygotowaniem danych przez backend, żeby testy nie wpadały na siebie. Dobry zestaw obok analogicznego wpisu o Cypressie."
---

## Wstęp

Logowanie wygląda prosto, ale dobrze pokazuje izolację testów: zanim klikniesz „Sign in”, musisz mieć pewność, że użytkownik w bazie jest dokładnie w stanie, którego wymaga scenariusz.

Poprzedni odcinek serii: [Playwright - pierwsze testy E2E](/playwright-1/).

Poniższe przypadki są tymi samymi co w [Testy logowania z Cypress](/cypress-2/) - możesz porównać składnię i sposób wołania API.

## Przypadki testowe

Specyfikacja (jak wcześniej - po angielsku, żeby zgadzała się z kodem):

### Successful login

Preconditions: użytkownik istnieje; start z `/login`.

Steps: poprawny email → poprawne hasło → Sign in.

Expected: zalogowany użytkownik, przekierowanie na stronę główną.

### Incorrect password

Preconditions: użytkownik istnieje; `/login`.

Steps: poprawny email → błędne hasło → Sign in.

Expected: brak logowania, nadal `/login`, komunikat `Error Invalid email / password.`, pola nie są czyszczone.

### Not existing user

Preconditions: użytkownik nie istnieje; `/login`.

Steps: email + hasło → Sign in.

Expected: jak wyżej - ten sam komunikat błędu logowania.

### Empty fields

Preconditions: `/login`.

Steps: Sign in bez wypełniania pól.

Expected: walidacja pól wymaganych; użytkownik zostaje na `/login`.

## Konfiguracja

W `playwright.config.ts` ustaw `baseURL` frontu (jak w [playwright-1](/playwright-1/)). API backendu zostaje pod pełnym adresem `http://localhost:5000` - inny host i port niż `baseURL`.

Dokumentacja Swagger (lista endpointów):

    http://localhost:5000/swagger/index.html

Jeśli zastanawiasz się nad `localhost`, zobacz [Przygotowanie środowiska](/cypress-0/).

## API jako prerequisite

Cypress używa `cy.request`. W Playwright Test masz wbudowany fixture `request` - to osobny klient HTTP, idealny do setupu danych przed krokiem UI.

Usuwanie użytkownika przed utworzeniem (ten sam problem co w serii o Cypressie: `400` przy duplikacie):

```typescript
import { test, expect, APIRequestContext } from "@playwright/test"

const API = "http://localhost:5000"

const userBody = {
  user: {
    username: "test",
    email: "test@test.com",
    password: "test",
  },
}

async function ensureUserAbsent(request: APIRequestContext) {
  const res = await request.delete(`${API}/users`, { data: userBody })
  expect([200, 204, 404]).toContain(res.status())
}

async function createUser(request: APIRequestContext) {
  const res = await request.post(`${API}/users`, { data: userBody })
  expect(res.ok()).toBeTruthy()
}
```

Jeśli w Twoim backendzie nie ma jeszcze `DELETE /users`, sytuacja jest identyczna jak w poście o Cypressie: albo dogadanie endpointu z zespołem, albo - w szkoleniowym repozytorium - dodanie go samodzielnie. Gotowy backend z tym endpointem:

    https://github.com/12masta/aspnetcore-realworld-example-app/tree/cypress-2

Changeset (DELETE):

    https://github.com/12masta/aspnetcore-realworld-example-app/pull/1/files

Po zmianach w Dockerze pamiętaj o przebudowie obrazu (`make build` przed `make run`), tak jak w oryginale.

![Swagger - usuwanie użytkownika](/media-from-firebase/2019-10-18-login-tests-with-cypress/5-swagger-delete-exists.png)

## Pierwszy test - successful login

Plik np. `tests/login.spec.ts`. Selektory pól jak w pierwszych postach są świadomie proste (`.form-control`, `.btn`); docelowo warto przejść na dedykowane atrybuty `data-*` (Cypress w dokumentacji poleca ten wzorzec, często pod nazwą `data-cy`) - w Playwright naturalnym wyborem jest [`data-testid` + `getByTestId`](/playwright-5/), opisane w [równoległym wpisie o selektorach](/cypress-5/).

```typescript
import { test, expect, APIRequestContext } from "@playwright/test"

const API = "http://localhost:5000"
const userBody = {
  user: {
    username: "test",
    email: "test@test.com",
    password: "test",
  },
}

async function ensureUserAbsent(request: APIRequestContext) {
  const res = await request.delete(`${API}/users`, { data: userBody })
  expect([200, 204, 404]).toContain(res.status())
}

async function createUser(request: APIRequestContext) {
  const res = await request.post(`${API}/users`, { data: userBody })
  expect(res.ok()).toBeTruthy()
}

test("successful login", async ({ page, request }) => {
  await ensureUserAbsent(request)
  await createUser(request)

  await page.goto("/login")
  await page.locator(".form-control").nth(0).fill("test@test.com")
  await page.locator(".form-control").nth(1).fill("test")
  await page.locator(".btn").click()

  await expect(page).toHaveURL(/localhost:4100\/$/)
  await expect(page.locator(":nth-child(4) > .nav-link")).toHaveAttribute("href", "/@test")
  await expect(page.locator(":nth-child(3) > .nav-link")).toHaveAttribute("href", "/settings")
  await expect(
    page.locator(".container > .nav > :nth-child(2) > .nav-link")
  ).toHaveAttribute("href", "/editor")
})
```

Te same selektory co w wpisie o Cypressie są celowo „kruche” - docelowo warto je zastąpić atrybutami testowymi zgodnie z [best practices Cypressa](https://docs.cypress.io/guides/references/best-practices#Selecting-Elements); w Playwright wygodnie użyjesz [`data-testid`](/playwright-5/).

![Udane logowanie](/media-from-firebase/2019-10-18-login-tests-with-cypress/6-successfull-login-complete.png)

## Incorrect password

```typescript
test("incorrect password", async ({ page, request }) => {
  await ensureUserAbsent(request)
  await createUser(request)

  await page.goto("/login")
  await page.locator(".form-control").nth(0).fill("test@test.com")
  await page.locator(".form-control").nth(1).fill("wrong-password")
  await page.locator(".btn").click()

  await expect(page).toHaveURL(/\/login/)
  await expect(page.locator(".error-messages > li")).toHaveText(
    "Error Invalid email / password."
  )
})
```

![Błędne hasło](/media-from-firebase/2019-10-18-login-tests-with-cypress/7-incorrect-password.png)

## Not existing user

Bez `createUser` - tylko `ensureUserAbsent`, potem próba logowania:

```typescript
test("not existing user", async ({ page, request }) => {
  await ensureUserAbsent(request)

  await page.goto("/login")
  await page.locator(".form-control").nth(0).fill("test@test.com")
  await page.locator(".form-control").nth(1).fill("whatever")
  await page.locator(".btn").click()

  await expect(page).toHaveURL(/\/login/)
  await expect(page.locator(".error-messages > li")).toHaveText(
    "Error Invalid email / password."
  )
})
```

![Brak użytkownika](/media-from-firebase/2019-10-18-login-tests-with-cypress/8-not-existing-user.png)

## Empty fields

```typescript
test("empty fields", async ({ page }) => {
  await page.goto("/login")
  await page.locator(".btn").click()

  await expect(page).toHaveURL(/\/login/)
  await expect(page.locator(".error-messages > :nth-child(1)")).toHaveText(
    "'Email' must not be empty."
  )
  await expect(page.locator(".error-messages > :nth-child(2)")).toHaveText(
    "'Password' must not be empty."
  )
})
```

W oryginalnej aplikacji RealWorld z tej serii komunikaty były dłuższe (prefiks `User.Email` / `User.Password`) - wtedy asercja się wyłożyła i zgłosiła realny defekt w treści błędu. Jeśli u Ciebie tekst jest inny, dopasuj `toHaveText` albo użyj `toContainText` / regex - ważne, żeby asercja odzwierciedlała kontrakt, na który się umawiasz z produktem.

![Puste pola](/media-from-firebase/2019-10-18-login-tests-with-cypress/9-empty-fields.png)

## Podsumowanie

Pełny zestaw specyfikacji możesz trzymać w jednym pliku `login.spec.ts` z powyższymi testami. Zachowanie UI odpowiada gałęzi z Cypressa - możesz oprzeć się na tym samym stanie aplikacji:

    https://github.com/12masta/react-redux-realworld-example-app/tree/2-cypress

    https://github.com/12masta/react-redux-realworld-example-app/pull/2/files

Następny odcinek (Playwright): [Refaktoryzacja testów - akcje vs Page Object Model](/playwright-3/).

Równoległa seria Cypress (bez zmian w treści): [cypress-3](/cypress-3/) … [cypress-9](/cypress-9/).
