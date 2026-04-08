---
title:  Playwright i CI z Azure DevOps
date:   2025-04-30 10:00:00 +0200
slug: playwright-8
ogImage: https://marcinstanek.pl/images/blog/playwright-8/og.png
ogImageType: image/png
categories: [testautomation, playwright]
tags: [testautomation, playwright, pl]
language: pl
translationKey: playwright-8
description: "Jak uruchomić testy Playwrighta w Azure DevOps: przygotowanie potoku i środowiska pod przeglądarki, trzymanie adresów aplikacji i API w zmiennych oraz ten sam ogólny przepływ co w artykule o Cypressie, przy prostszej konfiguracji po stronie Playwrighta."
---

## Wstęp

[Cypress na Azure DevOps](/cypress-8/) pokazał trigger na wiele ścieżek, `npm install`, weryfikację narzędzia i uruchomienie testów. Ten sam scenariusz z Playwrightem jest prostszy w jednym miejscu: nie musisz pluginu do podmiany `config` - `process.env` czytasz bezpośrednio w `playwright.config.ts`.

Poprzedni odcinek: [Wizualna regresja](/playwright-7/).

## Przykładowy `azure-pipelines.yml`

```yaml
trigger:
  paths:
    include:
      - "*"

pool:
  vmImage: ubuntu-latest

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: "20.x"
    displayName: Install Node.js

  - script: npm ci
    displayName: Install dependencies

  - script: npx playwright install --with-deps
    displayName: Install Playwright browsers

  - script: npx playwright test
    displayName: Run Playwright tests
    env:
      BASE_URL: $(BASE_URL)
      API_URL: $(API_URL)
```

`--with-deps` instaluje biblioteki systemowe potrzebne Chromium/Firefox/WebKit na czystym Ubuntu - odpowiednik „zadbaj o przeglądarki na agencie”, o którym była mowa przy Cypressie.

## Zmienne w Azure

Ustaw `BASE_URL` i `API_URL` w Pipelines → Variables (tak jak na zrzucie z serii Cypress) - wtedy testy trafiają w wdrożony front/API zamiast w `localhost`.

![Zmienne pipeline (materiał z wpisu o Cypressie)](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2020-04-13-cypress-and-ci%2Fcypress-8-1.png?alt=media&token=32482f6d-483d-4e3a-b6c9-d613a035be69)

## `playwright.config.ts`

```typescript
import { defineConfig } from "@playwright/test"

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:4100",
  },
})
```

Helpery HTTP czytają `process.env.API_URL ?? "http://localhost:5000"` tak jak w [części o URL-ach](/playwright-4/).

## Co jeśli aplikacja musi działać lokalnie na agencie?

Wtedy dodajesz kroki startu dockera / `npm run start` w tle i czekasz na port (healthcheck lub `npx wait-on`), dokładnie jak przy pełnym stacku - poza zakresem skrótu z oryginalnego wpisu, ale mechanizm jest ten sam.

## Kod referencyjny (Cypress)

    https://github.com/12masta/react-redux-realworld-example-app/tree/8-cypress

Następny odcinek: [JUnit i Publish Test Results w Azure](/playwright-9/).
