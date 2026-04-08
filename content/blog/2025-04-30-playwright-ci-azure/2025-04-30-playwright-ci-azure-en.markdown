---
title:  Playwright and CI with Azure DevOps
date:   2025-04-30 10:00:00 +0200
slug: en/playwright-8
ogImage: https://marcinstanek.pl/images/blog/playwright-8/og.png
ogImageType: image/png
categories: [testautomation, playwright]
tags: [testautomation, playwright, en]
language: en
translationKey: playwright-8
description: Azure pipeline with Node 20, playwright install --with-deps, and npx playwright test - BASE_URL and API_URL from pipeline variables like the Cypress article.
---

## Introduction

[Cypress on Azure DevOps](/en/cypress-8/) covered broad triggers, `npm install`, `cypress verify`, and running specs. Playwright drops one moving part: no Cypress plugin to merge env into config - read `process.env` straight inside `playwright.config.ts`.

Previous post: [Visual regression](/en/playwright-7/).

## Sample `azure-pipelines.yml`

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

`--with-deps` pulls the native libraries Chromium/Firefox/WebKit need on clean Ubuntu agents.

## Pipeline variables

Define `BASE_URL` and `API_URL` under Pipelines → Variables so tests target deployed environments instead of loopback.

![Pipeline variables (screenshot from the Cypress series)](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2020-04-13-cypress-and-ci%2Fcypress-8-1.png?alt=media&token=32482f6d-483d-4e3a-b6c9-d613a035be69)

## Config snippet

```typescript
import { defineConfig } from "@playwright/test"

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:4100",
  },
})
```

HTTP helpers read `process.env.API_URL` the same way as in [the URLs article](/en/playwright-4/).

## Running the stack on the agent

If you must boot Docker or `npm run start`, add background steps plus a wait-for-port health check - identical orchestration concern to full-stack Cypress jobs, just different test command.

## Reference repo (Cypress track)

    https://github.com/12masta/react-redux-realworld-example-app/tree/8-cypress

Next: [JUnit reporting + Publish Test Results](/en/playwright-9/).
