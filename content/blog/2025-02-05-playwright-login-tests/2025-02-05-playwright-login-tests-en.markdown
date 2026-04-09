---
title:  Login tests with Playwright
date:   2025-02-05 10:00:00 +0200
slug: en/playwright-2
ogImage: https://marcinstanek.pl/images/blog/playwright-2/og.png
ogImageType: image/png
categories: [testautomation, playwright]
tags: [testautomation, playwright, en]
language: en
translationKey: playwright-2
description: "Exercise a real login form end to end: success, bad password, unknown account, and empty fields, with test data prepared through the backend so each run stays isolated. Pairs with the Cypress login article for a direct comparison."
---

## Introduction

Login looks trivial, but it is a good place to practice test isolation: before you hit “Sign in”, you must know exactly which user rows exist in the database.

Previous post in this series: [Playwright - your first end-to-end tests](/en/playwright-1/).

The scenarios below match [Login tests with Cypress](/en/cypress-2/) so you can compare syntax and API usage side by side.

## Test cases

### Successful login

Preconditions: user exists; start on `/login`.

Steps: valid email → valid password → Sign in.

Expected: authenticated session, redirect to the home URL.

### Incorrect password

Preconditions: user exists; `/login`.

Steps: valid email → wrong password → Sign in.

Expected: still on `/login`, message `Error Invalid email / password.`, fields not cleared.

### Not existing user

Preconditions: user does not exist; `/login`.

Steps: email + password → Sign in.

Expected: same error message as invalid credentials.

### Empty fields

Preconditions: `/login`.

Steps: click Sign in with empty fields.

Expected: field validation; remain on `/login`.

## Configuration

Set the frontend `baseURL` in `playwright.config.ts` (see [playwright-1](/en/playwright-1/)). The ASP.NET API stays at `http://localhost:5000` - different origin than the UI `baseURL`.

Swagger UI:

    http://localhost:5000/swagger/index.html

If `localhost` surprises you, read [Environment preparation](/en/cypress-0/).

## API prerequisites

Cypress uses `cy.request`. Playwright Test exposes a dedicated `request` fixture - an HTTP client perfect for seeding data before browser steps.

Delete-before-create avoids the duplicate-user `400` you saw in the Cypress write-up:

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

If `DELETE /users` is missing, the situation matches the Cypress article: negotiate a test hook with the team, or add it yourself on a training fork. Backend branch with the endpoint:

    https://github.com/12masta/aspnetcore-realworld-example-app/tree/cypress-2

Pull request:

    https://github.com/12masta/aspnetcore-realworld-example-app/pull/1/files

After Docker changes, rebuild the image (`make build` before `make run`), exactly as in the original series.

![Swagger - delete user](/media-from-firebase/2019-10-18-login-tests-with-cypress/5-swagger-delete-exists.png)

## First test - successful login

File `tests/login.spec.ts`. Selectors mirror the early Cypress posts on purpose (`.form-control`, `.btn`). For production, move to dedicated `data-*` hooks (Cypress [best practices](https://docs.cypress.io/guides/references/best-practices#Selecting-Elements) describe that pattern, often with `data-cy` in their examples). In Playwright the straightforward choice is [`data-testid` with `getByTestId`](/en/playwright-5/), parallel to the [Cypress selectors article](/en/cypress-5/).

```typescript
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

These navbar selectors are intentionally brittle - replace them with test hooks when you refactor.

![Successful login](/media-from-firebase/2019-10-18-login-tests-with-cypress/6-successfull-login-complete.png)

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

![Wrong password](/media-from-firebase/2019-10-18-login-tests-with-cypress/7-incorrect-password.png)

## Not existing user

Skip `createUser`, only ensure the account is gone:

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

![Unknown user](/media-from-firebase/2019-10-18-login-tests-with-cypress/8-not-existing-user.png)

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

On the RealWorld build from this blog series the API actually returned longer strings (`User.Email …`, `User.Password …`), so the assertion failed and surfaced a real wording bug. Adjust `toHaveText`, `toContainText`, or a regex to match whatever contract your product guarantees.

![Empty fields](/media-from-firebase/2019-10-18-login-tests-with-cypress/9-empty-fields.png)

## Summary

Keep every scenario in `login.spec.ts` with the helpers at the top of the file (or in a shared fixture module). The UI behaviour lines up with the Cypress branch:

    https://github.com/12masta/react-redux-realworld-example-app/tree/2-cypress

    https://github.com/12masta/react-redux-realworld-example-app/pull/2/files

Next in the Playwright series: [Test refactoring - app actions vs Page Object Model](/en/playwright-3/).

The original Cypress track (unchanged): [cypress-3](/en/cypress-3/) through [cypress-9](/en/cypress-9/).
