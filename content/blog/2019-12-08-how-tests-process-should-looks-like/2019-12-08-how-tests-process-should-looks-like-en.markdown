---
title:  Test process that I am striving for in the projects I am working on
date:   2019-12-08 08:00:00 +0200
categories: [testautomation, process, test-process]
tags: [testautomation, process, test-process, pl]
slug: en/test-process-1
ogimage: https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-12-08-how-tests-process-should-looks-liks%2Fblog_post-cover.png?alt=media&token=b090c220-e684-4cb3-96f9-99e2f374c1cb
ogimagetype: image/png
language: en
description: In this blog post, the author reflects on the ideal test process they aim to achieve in their projects, emphasizing the importance of quick feedback on code changes and the drawbacks of manual testing. They advocate for a balanced approach, combining both automated tests (unit and acceptance tests) with manual tests, and stress the benefits of a Continuous Delivery process for rapid code validation and defect correction.
---

## Introduction

Recently, I had the opportunity to reflect on how I imagine an ideal test process. Like everyone else, I have my thoughts and opinions on this subject, probably for better or worse. I found that I needed to systematize them. Feel free to read and comment. :)

You can find the previous post here: [Cypress and correct use of selections, data-cy attribute](/en/cypress-5)

## Fundamentals

Personally, I think that:

The main aspect of building quality in the project is quick feedback on changes in the application code.

The traditional software development model is the reverse of the sentence I wrote above. Teams in the past, and often even today, used manual methods of software verification. Tests started only after the software development phase, understood by application programming by programmers. There are several downsides to this approach:

* manual regression is time consuming and expensive. Consequently, this means that this step becomes a bottleneck in the process
* manual testing is unreliable for a simple reason - people are weak at repetitive tasks, such as the regression testing mentioned above
* it is difficult to predict changes in a comprehensive system, which makes it almost impossible to properly target manual tests, which will take place in a reasonable time, at areas that may have changed
* maintenance of documentation, which is required for the proper conduct of manual tests, is difficult to perform within a reasonable time, and practically impossible after some time and after reaching a certain size of the project size. Even if you manage to do it, isn't it better to test or take care of quality in other areas during this time?

## How to automate

After reading the first paragraph, you get the impression that I am against manual testing. None of these things, I am of the opinion that people should focus on what they are best at - creative work. Let us leave the repetitive work for the robots. Therefore, in order to successfully implement automation, we must develop both automatic and manual tests.

Automated Tests should include:

* Unit tests - check individual code modules, methods, functions, classes in isolation. They also ensure high code testability. Without this element, testing at higher levels becomes extremely difficult and leaves us only full end to end scenarios.
* Acceptance tests - verify the operation of the application as a whole. They ensure that functions at a higher level are working properly and that no faults have been introduced into functions that have worked properly so far. For example, this type of test will check whether the API works correctly from the perspective of its potential consumer. They should also be written as part of development, meaning the development work is not complete until the acceptance testing has passed.

The diagram below shows how I imagine the ideal timing of automatic and manual tests. Diagram inspired by: [author of original diagram] (http://www.exampler.com/old-blog/2003/08/22/#agile-testing-project-2)
 and [book](https://books.google.pl/books/about/Agile_Testing.html?id=68_lhPvoKS8C&redir_esc=y).

![automation-diagram](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-12-08-how-tests-process-should-looks-liks%2Fwykres.png?alt=media&token=118b6508-5354-4602-af07-fa9f49911954)

The automated tests in this chart are also a perfect fit for Continuous Delivery processes. What does it mean? Each change in the code triggers the process of building the application, creating packages, running unit tests, and running static analysis processes. After this first phase, tests are launched that need more time to execute them, i.e. acceptance tests. This type of build should be ready to perform exploratory tests or other manual quality control, if it has passed the previous phases correctly, of course. When the manual control is completed, we consider the package thus created as ready for release from a technological point of view.

This type of process provides quick feedback on the quality of the code to the development team, a short time from code creation to release, and a low level of defects in the production environment. The team has most of their work validated in minutes, instead of hours or days. Which makes it possible to correct defects as soon as they are introduced.

What is the conclusion? Each change creates software, potentially ready for release, and a feedback loop allows you to catch problems as early as possible. When the package reaches the end of the process and the team is not comfortable with its release or defects are discovered in the production environment, the process should be improved, e.g. by extending or updating tests. Updating the scenarios should be as low as possible.

## How to improve automation

If you do not have the tests implemented in your process yet, start with the MVP, the framework from which you will start building. For example, you can create a single unit test, an acceptance test, and an automated script that will create an off-the-shelf environment for exploratory testing. Then incrementally increase the test coverage level and expand the CD process.

As a team, you need to follow the TDD approach or at least be sure that unit tests are written. This ensures high code quality and facilitates automation at higher levels, e.g. it allows you to blind communication with external services independent of us for the purpose of conducting quality control in an environment that will ensure repeatability of results.

In case you are managing a test suite that is difficult to maintain and you cannot trust its results, don't be afraid to remove the test cases from it. A suite of 10 great quality tests that everyone can count on is far better than a set of 200 or 300 tests that no one trusts, and you have to fight with the developers for it.

In either case, ensure that developers and testers work together as early as possible in the software development process as part of one entire development team, rather than starting testing when the developers' work looks done. This also applies to agile teams, where the _Ready for QA_ column on _scrum boardy_ is an excellent excuse to procrastinate until the task arrives at this point. Developers and testers should also develop the acceptance test suite together, don't leave this work just to the automation testers. On the other hand, when the acceptance test for some reason is not passed correctly, add a unit test that will allow you to detect the same defect faster in the future.

## Summary

This is how I start the next series of posts about the test automation process from a higher perspective. It also doesn't mean the end of posts about test automation tools.
