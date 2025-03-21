---
title: Retry policy for methods in terms of integration tests
date: 2021-07-01 08:00:00 +0200
categories: [testautomation, .net, polly]
tags: [testautomation, .net, polly, en]
slug: en/dotnet-polly
language: en
ogImage: https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2021-07-01-retry-policy-in-test-methods%2FRetry%20policy%20for%20methods%20in%20terms%20of%20integration%20tests.png?alt=media&token=e5a5db4b-7f5b-4ffb-94fa-9d22751f79f6
ogImageType: image/png
description: Using the Polly library for implementing a retry policy in integration tests within .NET projects to address race conditions and enhance test stability. The author provides an example of applying the retry logic to database interaction methods and highlights the importance of careful time frame definition for optimal test execution.
---

## Retry policy

During several integrations of tests implementation across the .NET-based projects, I was struggling very often race conditions across the methods which try to pull some state from the DB to make some assertion on it. Very often this is a point of failure which makes the integration tests flaky.

You can find the previous post here: [.NET Testcontainers library, infrastructure for the tests
](/2021-04-14-testcontainers/2021-04-14-testcontainers_en/)

## AI-Powered User Story Analysis for Smarter Testing

Unlock the full potential of your software development process with our AI-driven tool! You will find it [here](https://defectzero.com/).

[![Defect zero](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/defect%20zero%2Fdefect-zero-min.png?alt=media&token=6ca28446-47df-4391-a5a7-a5d8ca7bd0e5)](https://defectzero.com/)

 I saw some implementation of Polly library in the case where as a team we were trying to consume 3rd parties API’s to increase resilience. I decided to try the same in the tests in terms of methods that pull some data from the database. The solution looks promising it already fixes some issues in the project which I am currently working on.
 
This is how code can look like:

```
public string Id { get; set; }
public EntitiesDatabaseLoader Entities { get; set; }

(...) // some piece of code arround

return Policy.HandleResult<Entity>(r => r == null)
       .WaitAndRetry(new[]
       {
         TimeSpan.FromSeconds(1),
         TimeSpan.FromSeconds(2),
         TimeSpan.FromSeconds(3)
       })
       .Execute(() => Entities.Load(Id));
```

_HandleResult_ method is responsible for handling behaviour defined as argument passed to it.

_WaitAndRetry_ method defines a specified duration between each retry. 

_Execute_ method is a simply piece of code which we want to retry in case of failures which we just defined.

There is a such more possibilities defined in the library documentation.

## Summary

Thanks to such approach we can create much more stable tests. When creating Wait and Retry policy we should be wise in defining of time frames to fit also negative testing cases. Otherwise, it will take too long to execute such cases precisely because of the policy we have just created.

Link to the library: [https://github.com/App-vNext/Polly](https://github.com/App-vNext/Polly) 
