---
title: How do teams write tests and what do I think about it? Part 1.
date: 2022-09-15 08:00:00 +0200 
categories: [testautomation, process, test-process]
tags: [testautomation, process, test-process, en]
slug: en/who-should-write-the-tests-part-1 
language: en
ogImage: https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/who-should-write-the-tests-part-1%2Fbusiness-team-meeting-boardroom-min.jpg?alt=media&token=e1f0adbd-3583-4f68-ab96-19f2d278ee67
ogImageType: image/jpg
---

## Promotion of the tester to the person responsible for test development

Most of us already have some convictions or opinions about it, including me. I decided however, write this post to
summarize my knowledge and check if my assumptions are still correct.

Sometimes manual testers or others decide to influence their future and convince their boss, leader, or anyone
responsible for that part that they can start automating tests. To be clear, there's nothing wrong with willing to
change I absolutely support such initiatives. However, I believe, and also being aware that there are exceptions to this
rule, that some of these people may be members of the automation team, but usually they are not the right people for
building the test foundations in the organization. In the beginning, such a team will make significant progress,
however, the level of complications, maintenance, and maintenance problems increase with time. Then, increasing problems
lead to loss of test reliability.

Oftentimes, when writing automated tests, we encounter problems that do not occur for a clear reason. These can be
nondeterministic test results, problems on the CI server, and thus network problems, permissions, and many more. In such
a situation, you may first blame the tool, the network, or think we have a worse one day and try to run the test again.
Alternatively, there may be a problem with the timing of the operation. In every such the situation takes longer to
repair and the cause is not fully known. Soon, apart from the fact that the tests will be slow, their stability will
deteriorate and it will be difficult to determine the root cause of failure. In this case, we lose the value you should
gain from test automation as neither QA nor the developers can tell if the breakdown is a bug in the product or in
automation. This leads to a loss of confidence in the test results.

Another issue that this group often encounters is the division of responsibilities between automation and manual
testing. Devoting a certain percentage of your work to one activity and the other part to another is almost never
practical. Moreover, it is very hard to measure to actually have control over it. Automation is not just that writing
tests. The absolute minimum is to check their results. What if the test result is negative? We have to follow their
hare. In this way, we operate very inefficiently.

## Summary

People with some programming knowledge or no automation experience can become effective at it, but I need a leader in
this regard. It takes time, work, and dedication to become good at it, and therefore you cannot do this on the side.