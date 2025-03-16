---
title: Jednorazowa instacja aplikacji Blazor dla testów w Playwirght
date: 2024-04-03 08:00:00 +0200
categories: [testautomation, playwright, blazor, dotnet]
tags: [testautomation, playwright, en, blazor, dotnet]
slug: pl/playwright-tests-along-with-blazor-app 
language: pl 
ogImage: https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2024-04-03-playwright-tests-along-with-blazor-app%2F2024-04-03-playwright-tests-along-with-blazor-app.png?alt=media&token=05809de2-bd2a-4fca-b73e-8b92995cca29
ogImageType: image/png
description: W artykule omówiono proces automatyzacji testów funkcjonalnych aplikacji Blazor z wykorzystaniem biblioteki Microsoft.AspNetCore.Mvc.Testing oraz narzędzia Playwright. Autor przedstawia kroki implementacji, począwszy od konfiguracji klasy uruchamiającej aplikację, aż po napisanie testów sprawdzających poprawność działania strony głównej i sekcji FAQ.
---

## Wstęp
Uruchamiając testy funkcjonalne w przeglądarce wymagane jest, aby weryfikowany system był uruchomiony i gotowy do działania. 
Możemy go oczywiście uruchomić ręcznie. Jednak projektując dobrej jakości testy automatyczne dążę do tego, aby były one odpowiedzialne za uruchomienie wszystkich komponentów wymagany do ich poprawnego działania.

Dzięki bibliotece _Microsoft.AspNetCore.Mvc.Testing_ możemy uzyskać taki efekt dla aplikacji na pisanej w Blazor i testowanej przy użyciu narzedzia Playwright. 
Jednak w porównaniu do przykładu z ostatniego [posta](/integration-tests-dotnet) należy dokonać pewnych zmian.

## Analiza historii użytkownika oparta na AI

Odblokuj pełny potencjał swojego procesu rozwoju oprogramowania dzięki naszemu narzędziu opartemu na sztucznej inteligencji! Znajdziesz je [tutaj](https://defectzero.com/).

[![Defect zero](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/defect%20zero%2Fdefect-zero-min.png?alt=media&token=6ca28446-47df-4391-a5a7-a5d8ca7bd0e5)](https://defectzero.com/)

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

PR można znaleźć [tutaj](https://github.com/12masta/FAQCompanies/pull/5/commits/438efde547a27049b4cef0a3c33c56c7e8df21e6).