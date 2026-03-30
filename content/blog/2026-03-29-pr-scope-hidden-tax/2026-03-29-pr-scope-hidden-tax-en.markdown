---
title: "The hidden tax on every pull request: issue context, diff reading, and test scope"
date: 2026-03-29 12:00:00 +0200
categories: [qa, delivery, process]
tags: [qa, pull request, scope, jira, code review, test planning, delivery risk, team]
slug: en/pr-scope-hidden-tax
ogImage: https://marcinstanek.pl/images/blog/pr-scope-hidden-tax/og.png
ogImageType: image/png
language: en
description: Someone reads the ticket and diff and decides what to verify before any suite runs. That time rarely shows in dashboards, but across many PRs it becomes a real weekly cost - often before anyone blames coverage or tooling.
---

Most teams can quote pipeline duration or regression suite size. Far fewer can say how many minutes per week vanish before anyone runs a meaningful test against a specific change. This post names that cost in plain language - no vendor story, no magic fix.

## Why this piece exists

You already measure automation, coverage, and build time. You should also care about decision latency, the gap between "the change is ready to review" and "we agree what is risky here and what is worth checking first." In that gap there is no green or red from CI yet - only reading, guessing, and Slack threads.

That is where edge cases usually slip in. Later, in production, it is easy to say "QA missed it." More often the truth is closer to nobody sharing a short, common picture of scope before execution started under time pressure.

## Decompose a single PR

The pattern holds whether your tracker is Jira, Azure DevOps, Linear, or a sticky on a wall:

1. The work item - what should change, for whom, under what assumptions. Usually missing what the author already knows: "just a refactor," "the endpoint already existed, we only added a field," "the flag is off everywhere anyway."
2. The diff - what actually changed in code and config. Here you discover what the ticket never mentioned: a migration, a contract tweak, a new dependency, a branch nobody described in requirements.
3. Impact mapping - which modules, integrations, permissions, and user paths matter. This is no longer line-by-line reading - it is "what breaks if assumption X is wrong."
4. Scope choice - only now does it make sense to pick scenarios, a checklist, or questions for the author. If steps 1-3 were rushed, step 4 becomes either "test everything" or "I will ping you if I see something."

None of those steps is wasted work - it is normal engineering. The problem starts when you do not count it as cost and treat it as something QA "just does along the way."

## A concrete story without names or stacks

Imagine a backend change to how some amount is rounded. The ticket says it fixes one country. The diff also touches a cache condition and a shared library used when sending notifications. Someone in QA reads the ticket for five minutes, the diff and related files for fifteen, then spends five minutes writing notes and asking in a channel: "Are notifications in scope?" The answer arrives an hour later because the author is in another meeting.

Before anyone says "kick off regression," half an hour of focused attention has gone only into understanding boundaries - and that is the optimistic path. With ten similar PRs a week, that is five hours that never show up on a test report or a pipeline dashboard. With twenty PRs and two people doing the same kind of analysis, conversations about "QA efficiency" rarely include that line item.

## Why it breaks down under load

The more parallel changes you have, the more queueing on the same heads that "know the system." A new QA hire often needs twice as long on steps 1-3 until the mental map exists - fair, but the plan rarely budgets for it.

On top of that:

- Tribal knowledge - "everyone knows service A calls service B" - until the person reviewing this PR does not.
- Sprint pressure - thin ticket text, fast merge, "we will test on staging later."
- Context switching - five tabs, three threads, one urgent hotfix next door.

The outcome matches a narrow bottleneck in code: queues grow, decision quality drops, and "nobody thought of that" incidents increase.

## What "good" looks like - still no product pitch

This is not a ten-page spec. It is a short, repeatable brief before heavy execution - the same skeleton every time so nobody reinvents the format:

- Intent - one sentence: why this change matters for the user or the business.
- Touched areas - modules, services, contracts - at the level your team actually uses.
- Risk zones - where regressions are likely, where integrations and data assumptions live.
- Open questions - what must be confirmed with the author before you can close scope.

That brief can be written at a desk, in stand-up, or as part of your "ready for test" definition. What matters is that it exists before long suite runs, not as a comment added after something breaks in production.

## A back-of-the-envelope check

Take numbers from a normal recent week (not a holiday week):


| Question | Your estimate |
|----------|----------------|
| How many meaningful changes (PRs / branches / releases) flow through QA? | … |
| How many minutes does one person spend on context alone (ticket + diff + clarification) before test scope is chosen? | … |


Weekly tax (people × minutes × changes) gives an order of magnitude you rarely see next to "automation cost" in a leadership deck. If you land around 4-8 hours per week of pure context work with a busy PR volume, that is already a reason to standardize how scope is handed over before you add another two hours of suite time.

## Closing - and how this ties to CI

This cost does not live in a vacuum. When the pipeline often cries wolf, the attention that could go into understanding the change spends time on noise triage. I wrote about that side in [Noisy CI: when the pipeline adds doubt instead of signal](/en/noisy-ci-signal/) - the two posts together sketch where QA time goes before anyone says "pilot."

If this sounds like your Monday, the next sensible move is to align on scope earlier and on a shared brief template - not immediately add more suites hoping coverage alone fixes unclear intent.
