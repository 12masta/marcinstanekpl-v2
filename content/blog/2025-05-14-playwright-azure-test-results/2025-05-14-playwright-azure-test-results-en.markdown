---
title:  Publishing Playwright test results in Azure DevOps
date:   2025-05-14 10:00:00 +0200
slug: en/playwright-9
ogImage: https://marcinstanek.pl/images/blog/playwright-9/og.png
ogImageType: image/png
categories: [testautomation, playwright, azuredevops]
tags: [testautomation, playwright, ci, azuredevops, en]
language: en
translationKey: playwright-9
description: Playwright’s JUnit reporter, Publish TestResults@2 in Azure YAML, and moving the failing signal from the test step to the publish step - parallel to the Cypress article.
---

## Introduction

The [Cypress Azure reporting post](/en/cypress-9/) wired Mocha’s `junit` reporter into Publish Test Results. Playwright ships the same capability natively - configure `reporter` once and point Azure at the XML file.

Previous post: [Playwright CI on Azure](/en/playwright-8/).

## Reporter in `playwright.config.ts`

```typescript
import { defineConfig } from "@playwright/test"

export default defineConfig({
  reporter: [
    ["list"],
    ["junit", { outputFile: "results/e2e-junit.xml" }],
  ],
})
```

One-off CLI runs are possible, but checking the reporters into config keeps local and CI behaviour aligned.

## Azure: run + publish

Same pattern as Cypress: mark the test step with `continueOnError: true` so the pipeline reaches publishing, then let Publish Test Results fail the job when `failTaskOnFailedTests` sees red tests.

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

![Publish Test Results (asset from the Cypress series)](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2020-04-29-publishing-test-results-azure-devops%2Fcypress-9-1.png?alt=media&token=0f130546-deea-4528-8653-2af58fdaa32d)

## Why bother

Azure aggregates JUnit-compatible output regardless of whether Cypress or Playwright produced it - only the runner command changes.

## Cypress reference

    https://github.com/12masta/react-redux-realworld-example-app/tree/8-cypress

Full Cypress + JUnit walkthrough: [cypress-9](/en/cypress-9/).

That finishes the parallel Playwright track (`playwright-1` … `playwright-9`) alongside the original Cypress posts.
