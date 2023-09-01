---
title: DI na potrzeby testów w ASP.NET Core - WebApplicationFactory 
date: 2022-10-08 08:00:00 +0200 
categories: [testautomation, .net, webapplicationfactory, di]
tags: [testautomation, .net, pl, webapplicationfactory, di]
slug: integration-tests-dotnet 
language: pl 
ogImage: https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2022-10-08-integration-tests-dotnet%2F2022-10-08-integration-tests-dotnet-ogimage.png?alt=media&token=4d80394c-a3f7-43af-86b8-951cddf944a9 
ogImageType: image/png
description: Przedstawiono podejście oparte na DI do testowania integracji w aplikacjach .NET, wykorzystujące WebApplicationFactory do testowania w pamięci. Pokazuje, jak wdrażać i przełączać się między różnymi implementacjami funkcji przy użyciu DI, zwiększając stabilność testów i izolację zależności.
---

## Punkt startowy

Zaczynamy od utworzenia projektu API oraz projektu z testami. Jest to najprostsze API utworzone poleceniem:

    dotnet new webapi

Projekt testowy:

    dotnet new nunit

Link do gotowego projektu, który zostanie użyty w następnych krokach:
[https://github.com/12masta/integration-tests-dotnet/tree/init-version](https://github.com/12masta/integration-tests-dotnet/tree/init-version)
.

## Pierwszy integracyjny test

Musimy dodać paczkę nuget _Microsoft.AspNetCore.Mvc.Testing_. Dzięki tej bibliotece mamy dostęp do klasy
WebApplicationFactory. Służy ona do utworzenia instancji klasy TestServer, dzięki temu będziemy mogli uruchomić
wszystkie elementy systemu w pamięci, co daje unikalne możliwości debugowania i kontroli nad implementacją systemu.
Podejście to drastycznie zwiększa testowalność kodu, co za chwilę będę miał szansę pokazać.

Najprostszy test, który możemy napisać zgodnie z tą techniką:

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

Podczas wykonywania się testu zostaje utworzony klient http, który pozwoli nam skonsumować przed chwilą uruchomione Api.
Następnie wykonujemy żądanie typu GET i sprawdzamy, czy status zwróconego zapytania może zostać zinterpretowany jako
sukces.

Pod tym linkiem znajdziecie commit ze wszystkimi
zmianami: [https://github.com/12masta/integration-tests-dotnet/commit/889567a8f4875674d65c740ff73845f4bc328bfd](https://github.com/12masta/integration-tests-dotnet/commit/889567a8f4875674d65c740ff73845f4bc328bfd)

## Przygotowanie kodu

Aby móc zaprezentować przykład zamiany implementacji należy najpierw wprowadzić element wstrzykiwania zależności do API.
Model _WeatherForecast_ jest już gotowy, więc wystarczy dodać jedną klasę, interfejs i zmodyfikować powiązany kontroler.

Kontroler po wykonanych zmianach:

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

Nowy interfejs:

```
public interface IWeatherForecast
{
    WeatherForecast GetPrediction();
}
```

Oraz jego nieskomplikowana, najprostsza implementacja:

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

Aby zmiany zostały zastosowane, musimy zarejestrować interfejs oraz jego implementację. W tym przypadku w klasie Program
należy dodać nową linię kodu:

    builder.Services.AddTransient<IWeatherForecast, HotForecast>();

Aby móc zweryfikować zmiany potrzebny jest również nowy test. Sprawdzi on zawartość wiadomości, powinna pokrywać się z
nowo dodaną implementacją. W tym przypadku użyłem metody: _GetFromJsonAsync<T>(string arg)_ do konsumpcji API. Umożliwia
to automatyczną deserializację obiektu zwróconego przez zapytanie, dzięki czemu asercję są bardziej skondensowane.

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

Pod tym linkiem znajdziecie commit ze wszystkimi
zmianami: [https://github.com/12masta/integration-tests-dotnet/commit/ef2d8d34fb54bbfc6ed0c8498ba5be1b5ecedf70](https://github.com/12masta/integration-tests-dotnet/commit/ef2d8d34fb54bbfc6ed0c8498ba5be1b5ecedf70)

## Zamiana implementacji

Zaczynamy od dodania klasy. Musi ona zaimplementować interfejs _IWeatherForecast_.

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

Następnie sam test, który skonsumuje nowo dodaną klasę.

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

Za pomocą metody _ConfigureTestServices_ rejestrujemy nową implementację interfejsu. Kod ten zostanie wykonany po
rejestracji zależności testowanej aplikacji. Dzięki temu nadpisujemy instancję użytą w klasie Program.cs. Weryfikując
wartości zwrócone przez API, wiemy, że aplikacja w dalszym ciągu działa poprawnie. Różnica wartości danych wskazuję
również, na poprawne wstrzykniecie zależności z poziomu testów.

Pod tym linkiem znajdziecie commit ze wszystkimi
zmianami: [https://github.com/12masta/integration-tests-dotnet/commit/6931e64ec628e12ccee4bd206c957269fd2700d1](https://github.com/12masta/integration-tests-dotnet/commit/6931e64ec628e12ccee4bd206c957269fd2700d1)

## Podsumowanie

Metoda ta jest bardzo przydatna w testach, dzięki niej w bardzo łatwy sposób możemy się odizolować, w zależności od
potrzeb np. od API, nad którym nie mamy kontroli, bazy danych czy też różnych elementów infrastruktury dostarczanej
przez chmurowych usługodawców. Co czyni nasze testy stabilnymi i deterministycznymi oraz często dużo tańszymi w
egzekucji.

Pod tym linkiem znajdziecie link do PR, w którym można sprawdzić całe
rozwiązanie: [https://github.com/12masta/integration-tests-dotnet/pull/1](https://github.com/12masta/integration-tests-dotnet/pull/1)