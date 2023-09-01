---
title: DI for testing purposes in .NET - WebApplicationFactory 
date: 2022-10-08 08:00:00 +0200
categories: [testautomation, .net, webapplicationfactory, di]
tags: [testautomation, .net, en, webapplicationfactory, di]
slug: en/integration-tests-dotnet 
language: en 
ogImage: https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2022-10-08-integration-tests-dotnet%2F2022-10-08-integration-tests-dotnet-ogimage.png?alt=media&token=4d80394c-a3f7-43af-86b8-951cddf944a9 
ogImageType: image/png
description: The material presents a DI-based approach to integration testing in .NET applications, utilizing the WebApplicationFactory for in-memory testing. It showcases how to implement and switch between different feature implementations using DI, enhancing test stability and dependency isolation.
---

## Take-off

We start by creating an API project and a project with tests. This is the simplest API created with the command:

    dotnet new webapi

Test project:

    dotnet new nunit

Link to the project, which will be used in the next
steps: [https://github.com/12masta/integration-tests-dotnet/tree/init-version](https://github.com/12masta/integration-tests-dotnet/tree/init-version)

## First integration test

We need to add the nuget package _Microsoft.AspNetCore.Mvc.Testing_. With this library we have access to the class
WebApplicationFactory. It is used to create an instance of the TestServer class, so we can run all elements of the
system in memory, which provides unique opportunities for debugging and control over the implementation of the system.
This approach dramatically increases the testability of the code, as I will have a chance to demonstrate in a moment.

The simplest test we can write according to this technique:

```
[Test]
public async Task InitialIntegrationTest()
{
    var url = "/WeatherForecast";
    var sut = new WebApplicationFactory<Program>();
    var client = sut.CreateClient();
    
    var response = await client.GetAsync(url);
    response.Invoking(r => r.EnsureSuccessStatusCode()).Should().NotThrow();
}
```

While the test is running, an http client is created, which will allow us to consume the Api we just launched. We then
make a GET request and check whether the status of the returned request can be interpreted as a success.

At this link you will find a commit with all
changes: [https://github.com/12masta/integration-tests-dotnet/commit/889567a8f4875674d65c740ff73845f4bc328bfd](https://github.com/12masta/integration-tests-dotnet/commit/889567a8f4875674d65c740ff73845f4bc328bfd)

## Code preparation

In order to be able to present an example of implementation swapping, it is necessary to first introduce a dependency
injection component to the API. The _WeatherForecast_ model is already ready, so you just need to add one class,
interface and modify the associated controller.

The controller after the changes made:

```
private readonly IWeatherForecast _forecast;

public WeatherForecastController(ILogger<WeatherForecastController> logger, IWeatherForecast forecast)
{
    _logger = logger;
    _forecast = forecast;
}

[HttpGet(Name = "GetWeatherForecast")]
public WeatherForecast Get()
{
    _logger.LogInformation("Using IWeatherForecast implementation: {0}", _forecast.ToString());
    return _forecast.GetPrediction();
}
```

New interface:

```
public interface IWeatherForecast
{
    WeatherForecast GetPrediction();
}
```

Uncomplicated, simplest implementation:

```
public class HotForecast : IWeatherForecast
{
    public WeatherForecast GetPrediction()
    {
        return new WeatherForecast()
        {
            Date = DateTime.UtcNow,
            TemperatureC = 30,
            Summary = "High temperature is expected."
        };
    }
}
```

For the changes to be applied, we need to register the interface and its implementation. In this case, in the Program
class a new line of code must be added:

    builder.Services.AddTransient<IWeatherForecast, HotForecast>();

A new test is also needed to verify the changes. It will check the content of the message, it should coincide with the
the newly added implementation. In this case, I used the method: _GetFromJsonAsync<T>(string arg)_ for API consumption.
It allows This automatically deserializes the object returned by the query, making the assertion more condensed.

```
[Test]
public async Task CheckIfProperValuesAreReturned()
{
    var sut = new WebApplicationFactory<Program>();
    var client = sut.CreateClient();

    var result = await client.GetFromJsonAsync<WeatherForecast>(_url);

    result.Should().NotBeNull();
    result!.Date.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
    result.Summary.Should().Be("High temperature is expected.");
    result.TemperatureC.Should().Be(30);
}
```

At this link you will find a commit with all
changes: [https://github.com/12masta/integration-tests-dotnet/commit/ef2d8d34fb54bbfc6ed0c8498ba5be1b5ecedf70](https://github.com/12masta/integration-tests-dotnet/commit/ef2d8d34fb54bbfc6ed0c8498ba5be1b5ecedf70)

## Replacing the implementation

We start by adding a class. It must implement the _IWeatherForecast_ interface.

```
public class ColdForecast : IWeatherForecast
{
    public WeatherForecast GetPrediction()
    {
        return new WeatherForecast()
        {
            Date = DateTime.UtcNow,
            TemperatureC = -20,
            Summary = "Low temperature is expected."
        };
    }
}
```

Then the test itself, which will consume the newly added class.

```
[Test]
public async Task CheckIfAlternativeImplementationWorksWell()
{
    var sut = new WebApplicationFactory<Program>()
        .WithWebHostBuilder(builder =>
            builder.ConfigureTestServices(testServices =>
                testServices.AddTransient<IWeatherForecast, ColdForecast>()));
    var client = sut.CreateClient();

    var result = await client.GetFromJsonAsync<WeatherForecast>(_url);

    result.Should().NotBeNull();
    result!.Date.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
    result.Summary.Should().Be("Low temperature is expected.");
    result.TemperatureC.Should().Be(-20);
}
```

Using the _ConfigureTestServices_ method, we register a new implementation of the interface. This code will be executed
after registering the dependencies of the application under test. With this, we overwrite the instance used in the
Program.cs class. By verifying the values returned by the API, we know that the application still works correctly. The
difference in data values indicates also, the correct injection of dependencies from the test level.

At this link you will find a commit with all
changes: [https://github.com/12masta/integration-tests-dotnet/commit/6931e64ec628e12ccee4bd206c957269fd2700d1](https://github.com/12masta/integration-tests-dotnet/commit/6931e64ec628e12ccee4bd206c957269fd2700d1)

## Summary

This method is very useful in testing, thanks to it we can very easily isolate ourselves, depending on the needs, for
example, from an API over which we have no control, a database or various elements of the infrastructure provided by
cloud service providers. Which makes our tests stable and deterministic, and often much cheaper to execution.

At this link you will find a link to PR, where you can check the entire
solution: [https://github.com/12masta/integration-tests-dotnet/pull/1](https://github.com/12masta/integration-tests-dotnet/pull/1)