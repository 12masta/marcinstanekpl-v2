---
title: Jednorazowa instacja aplikacji Blazor dla testów w Playwirght
date:   2025-01-08 10:00:00 +0200
categories: [testautomation, playwright, blazor, dotnet]
tags: [testautomation, playwright, en, blazor, dotnet]
slug: pl/playwright-tests-along-with-blazor-app 
ogImage: https://marcinstanek.pl/images/blog/pl/playwright-tests-along-with-blazor-app/og.png
ogImageType: image/png
language: pl 
description: W artykule omówiono proces automatyzacji testów funkcjonalnych aplikacji Blazor z wykorzystaniem biblioteki Microsoft.AspNetCore.Mvc.Testing oraz narzędzia Playwright. Autor przedstawia kroki implementacji, począwszy od konfiguracji klasy uruchamiającej aplikację, aż po napisanie testów sprawdzających poprawność działania strony głównej i sekcji FAQ.
---

## Wstęp
Uruchamiając testy funkcjonalne w przeglądarce wymagane jest, aby weryfikowany system był uruchomiony i gotowy do działania. 
Możemy go oczywiście uruchomić ręcznie. Jednak projektując dobrej jakości testy automatyczne dążę do tego, aby były one odpowiedzialne za uruchomienie wszystkich komponentów wymagany do ich poprawnego działania.

Dzięki bibliotece _Microsoft.AspNetCore.Mvc.Testing_ możemy uzyskać taki efekt dla aplikacji na pisanej w Blazor i testowanej przy użyciu narzedzia Playwright. 
Jednak w porównaniu do przykładu z ostatniego [posta](/integration-tests-dotnet) należy dokonać pewnych zmian.

## Implementacja
Zaczynamy od dodania klasy odpowiedzialnej za uruchomienie aplikacji będzie ona dziedziczyć po klasie WebApplicationFactory. Należy nadpisać metodę _CreateHost_ i logikę uruchomienia Hosta. Zmiana spowoduje uruchomienie WebServera, tj. Kestrel, umożliwiający komunikacje z przeglądarką oraz nadpisze właściwość BaseAddress adresem, który możemy użyć później w procesie.

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

Potrzebna jest jedna linii w klasie Program testowanej aplikacji, aby móc dodać referencję z projektu zawierającym testy:

```
public partial class Program { }
```

Następnym krokiem jest dodanie testów oraz użycia logiki odpowiedzialnej za uruchomienie aplikacji:


```
    [SetUp]
    public void SetUp()
    {
        var sut = new CustomWebApplicationFactory();
        _serverAddress = sut.ServerAddress;
    }
```

W metodzie która uruchamia się przed wykonaniem testu tworzymy obiekt nowo dodanej klasy, następnie pobieramy adres URL serwisu, który uruchomi się podczas wykonywania tych linijek kodu.


W konsekwencji konsumujemy adres URL w testach:


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

## Zakończenie

Dzięki technologi użytej przy budowaniu tego projektu uzyskałem jednorazowa instancje testowa, która może zostać wykorzystana w testach zbudowanych przy użyciu Playwirght.

Zobacz [pull request z tymi zmianami na GitHubie](https://github.com/12masta/FAQCompanies/pull/5/commits/438efde547a27049b4cef0a3c33c56c7e8df21e6).