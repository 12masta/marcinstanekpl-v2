---
title: One time instance of Blazor application for test automation with Playwirght
date: 2024-04-03 08:00:00 +0200
categories: [testautomation, playwright, blazor, dotnet]
tags: [testautomation, playwright, en, blazor, dotnet]
slug: en/playwright-tests-along-with-blazor-app 
language: en 
ogImage: https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2024-04-03-playwright-tests-along-with-blazor-app%2F2024-04-03-playwright-tests-along-with-blazor-app.png?alt=media&token=05809de2-bd2a-4fca-b73e-8b92995cca29
ogImageType: image/png
description: The article discusses the process of automating functional tests of Blazor applications using the Microsoft.AspNetCore.Mvc.Testing library and the Playwright tool. The author presents the implementation steps, from configuring the class that runs the application to writing tests to check the correct operation of the home page and the FAQ section. Thanks to this solution, a one-time test instance was obtained, significantly facilitating the testing process
---

## Context
When running functional tests in a browser, it is required that the system being verified is running and ready for operation.
We can of course run it manually. However, when designing good quality automatic tests, I aim to ensure that they are responsible for activating all components required for their proper operation.

Thanks to the _Microsoft.AspNetCore.Mvc.Testing_ library, we can achieve this effect for an application written in Blazor and tested using the Playwright tool.
However, compared to the example in the last [post](/en/integration-tests-dotnet), some changes need to be made.

## AI-Powered User Story Analysis for Smarter Testing

Unlock the full potential of your software development process with our AI-driven tool! You will find it [here](https://defectzero.com/).

[![Defect zero](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/defect%20zero%2Fdefect-zero-min.png?alt=media&token=6ca28446-47df-4391-a5a7-a5d8ca7bd0e5)](https://defectzero.com/)

## Implementation
We start by adding a class responsible for launching the application, it will inherit from the WebApplicationFactory class. You need to override the _CreateHost_ method and the Host startup logic. The change will launch the WebServer, i.e. Kestrel, enabling communication with the browser and will overwrite the BaseAddress property with an address that we can use later in the process.
```
        var testHost = builder.Build();  
        builder.ConfigureWebHost(webHostBuilder => webHostBuilder.UseKestrel());

        _host = builder.Build();
        _host.Start();

        var server = _host.Services.GetRequiredService<IServer>();
        var addresses = server.Features.Get<IServerAddressesFeature>();

        ClientOptions.BaseAddress = addresses!.Addresses
            .Select(x => new Uri(x))
            .Last();

        testHost.Start();
        return testHost;
```

One line is needed in the Program class of the application under test to be able to add a reference from the project containing the tests:

```
public partial class Program { }
```

The next step is to add tests and use the logic responsible for launching the application:

```
    [SetUp]
    public void SetUp()
    {
        var sut = new CustomWebApplicationFactory();
        _serverAddress = sut.ServerAddress;
    }
```

In the method that runs before executing the test, we create an object of the newly added class, then we get the URL of the website that will run when these lines of code are executed.


Consequently, we consume the URL in the tests:

```

    [Test]
    public async Task HomePageHasLoadedCorrectly()
    {
        await Page.GotoAsync(_serverAddress);

        // Expect a title "to contain" a substring.
        await Expect(Page).ToHaveTitleAsync(new Regex("Index"));
    }

    [Test]
    public async Task FaqHasLoadedCorrectly()
    {
        await Page.GotoAsync(_serverAddress + "faq-custom");

        // Expect a title "to contain" a substring.
        await Expect(Page).ToHaveTitleAsync(new Regex("FAQCompaniesChat"));
```

Thanks to the technology used to build this project, I obtained a one-time test instance that can be used in tests built using Playwirght.

PR can be found [here](https://github.com/12masta/FAQCompanies/pull/5/commits/438efde547a27049b4cef0a3c33c56c7e8df21e6).