---
title:  Raportowanie wyników Playwright w Azure DevOps
date:   2025-05-14 10:00:00 +0200
slug: playwright-9
ogImage: https://marcinstanek.pl/images/blog/playwright-9/og.png
ogImageType: image/png
categories: [testautomation, playwright, azuredevops]
tags: [testautomation, playwright, ci, azuredevops, pl]
language: pl
translationKey: playwright-9
description: Reporter JUnit z Playwright, krok Publish Test Results w YAML i przeniesienie „faila” z kroku testów na publikację - analogia do wpisu o Cypressie.
---

## Wstęp

[Wpis o Cypressie](/cypress-9/) łączył Mocha reporter `junit` z zadaniem Publish Test Results. Playwright ma wbudowany reporter JUnit - wystarczy dopisać go w konfiguracji lub CLI.

Poprzedni odcinek: [CI z Azure](/playwright-8/).

## Reporter w `playwright.config.ts`

```typescript
import { defineConfig } from "@playwright/test"

export default defineConfig({
  reporter: [
    ["list"],
    ["junit", { outputFile: "results/e2e-junit.xml" }],
  ],
})
```

Możesz też nadpisać reporter z CLI (`npx playwright test --reporter=junit`), ale stała konfiguracja w pliku utrzymuje spójność z CI.

## Azure: testy + publikacja

Ten sam trick co przy Cypressie: krok z testami z `continueOnError: true`, żeby pipeline doszedł do publikacji; prawdziwy fail ustawia Publish Test Results przez `failTaskOnFailedTests`.

```yaml
  - script: npx playwright test
    continueOnError: true
    displayName: Run Playwright tests

  - task: PublishTestResults@2
    inputs:
      testResultsFormat: JUnit
      testResultsFiles: "**/e2e-junit.xml"
      failTaskOnFailedTests: true
      testRunTitle: Playwright tests
```

![Publish Test Results (z serii Cypress)](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2020-04-29-publishing-test-results-azure-devops%2Fcypress-9-1.png?alt=media&token=0f130546-deea-4528-8653-2af58fdaa32d)

## Dlaczego to ma sens

W Azure dostajesz jeden widok wyników z wielu frameworków (JUnit, NUnit, …). Playwright generuje XML zgodne z tym samym krokiem co Cypress/Mocha - zmienia się tylko sposób uruchomienia runnera.

## Oryginał (Cypress)

    https://github.com/12masta/react-redux-realworld-example-app/tree/8-cypress

Pełny opis scenariusza Cypress + JUnit: [cypress-9](/cypress-9/).

To zamyka równoległą serię Playwright (playwright-1 … playwright-9) przy nienaruszonych wpisach o Cypressie.
