---
title:  Pierwsze testy z Playwright
date:   2020-03-16 08:00:00 +0200
categories: [testautomation, playwright]
tags: [testautomation, playwright, pl]
language: pl
slug: playwright-1
ogimage: https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2020-03-08-playwright-introduction%2Fpost_cover.png?alt=media&token=2a44c1c7-46ac-49b2-a737-984998cdbd6f
ogimagetype: image/png
description: Firma Microsoft ogłosiła niedawno Playwright, platformę zaprojektowaną do automatyzacji operacji w przeglądarkach, oferującą obsługę wielu przeglądarek dla Chromium, WebKit, Firefox i Edge. Chociaż nie jest to samodzielne narzędzie do automatyzacji testów, można je zintegrować z bibliotekami takimi jak Mocha i Chai w celu wykonywania zadań, takich jak uruchamianie przeglądarek, robienie zrzutów ekranu, znajdowanie elementów, klikanie i obsługa danych wejściowych, co czyni go przyjaznym dla użytkownika wyborem dla entuzjastów automatyzacji testów. Obszerna dokumentacja platformy i dostępne funkcje dobrze wróżą jej potencjałowi w automatyzacji testów.
---

## Nowa platforma przeznaczona do automatyzacji operacji wykonywanych w przeglądarce

Niedawno Microsoft ogłosił jej wydanie. Tworzą ją autorzy narzędzia Puppeter. Playwright wspiera wiele przeglądarek, obsługuję Chromium, WebKit, Firefox i Edge. Samo w sobie nie jest to narzędzie do automatyzacji testów. Wszystkie informacje dotyczące projektu znajdziesz na [githubie KLIK](https://github.com/microsoft/playwright).

Po dodaniu paru bibliotek osiągniemy oczekiwany efekt. Będę się opierał na bibliotekach Mocha i Chai, wybór oczywiście jest dużo szerszy.

Jeżeli chcesz podążać krok za krokiem mojego rozwiązania u siebie lokalnie będziesz potrzebować, wykonać odrobinę pracy i przejść przez setup projektu, który opisałem już w poście: [Przygotowanie środowiska](/cypress-0) Playground jest ten sam co w przypadku serii testów o Cypress. Oba rozwiązania są stworzone na podstawie JS także będzie ciekawa okazja do porównania tych dwóch narzędzi.

## Analiza historii użytkownika oparta na AI

Odblokuj pełny potencjał swojego procesu rozwoju oprogramowania dzięki naszemu narzędziu opartemu na sztucznej inteligencji! Znajdziesz je [tutaj](https://defectzero.com/).

[![Defect zero](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/defect%20zero%2Fdefect-zero-min.png?alt=media&token=6ca28446-47df-4391-a5a7-a5d8ca7bd0e5)](https://defectzero.com/)

## Setup

W projekcie _react-redux-realworld-example-app_ tworzę nowy katalog o nazwie _playwrighttests_ w terminalu uruchamiam komendę:

    npm init

Prechodzę przez setup odpowiadając na pytania. Tworzę projekt w osobnym katalogu i projekcie, żeby odizolować się od zależności już istniejących w projekcie. Następnie:

    npm i playwright

Spowoduje to zainstalowanie Playwright wraz z jego zależnościami i plikami binarnymi przeglądarki. Pliki mają około 50-100 MB każdy, więc troszkę może to zająć.

Po udanej instalacji zamierzam zweryfikować działanie.

Tworzę pierwszy skrypt który:

1. Uruchomi przeglądarkę w 3 wariantach. Chromium, Firefox, WebKit.
2. Przejdzie na stronę: http://localhost:4100/
3. Wykona screenshot

```
const playwright = require('playwright');

(async () => {
  for (const browserType of ['chromium', 'firefox', 'webkit']) {
    const browser = await playwright[browserType].launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('http://localhost:4100/');
    await page.screenshot({ path: `example-${browserType}.png` });
    await browser.close();
  }
})();
```

Skrypt uruchamiam poleceniem:

    node example.js

Wykonuję się on bez problemów. Uruchamia się w trybie headless. Produkuję 3 screenshoty dla każdej z przeglądarek.

## Pierwszy test

W przeciwieństwie do Cypressa nie mamy całego środowiska do tworzenia testów out of the box. Nie jest to na szczęście dużym problemem. Zaczynam od narzędzia Mocha. To platforma testowa, która pozwoli mi na uruchomienie testów. Instaluję zależność przy pomocy polecenia:

    npm i mocha

Następnym krokiem będzie instalacja biblioteki Chai. Będę używał jej do tworzenia asercji.

    npm i chai

Edytuję plik _package.json_ zamieniając skrypt _test_ aby używał mocha jako test runnera:

```
  "scripts": {
    "test": "mocha"
  },
```

Tworzę nowy plik:

    playwrighttests/test/SmokeTest.js

Opakowuje poprzedni w przykład w najprostszy test przy użyciu _Mocha_:

```
const playwright = require('playwright');

describe('Smoke tests', function smoketests() {
  this.timeout(60000);
  this.slow(20000);

  beforeEach(async () => {
  });

  it('First test', async () => {
    for (const browserType of ['chromium', 'firefox', 'webkit']) {
        const browser = await playwright[browserType].launch();
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto('http://localhost:4100/');
        await page.screenshot({ path: `example-${browserType}.png` });
        await browser.close();
      }
  });
});
```

Wywołując polecenie:

    npm t

Uruchamiam test. Działanie jest to samo co skryptu powyżej jednak użyliśmy już opoiisywanego narzędzia w kontekście które pozwala nam pisać testy.

Nie podoba mi się ta pętla w teście. Definitywnie anty-pattern. Pozbywam się go w najprostszy sposób, jaki mi przychodzi go głowy - odrobinę lepiej, chociaż nie wiem, czy to jest jedyny sposób, żeby zrobić to w Mocha.:

```
    ['chromium', 'firefox', 'webkit'].forEach((browserType) => {
        it("First test - " + browserType, async () => {
            const browser = await playwright[browserType].launch();
            const context = await browser.newContext();
            const page = await context.newPage();
            await page.goto('http://localhost:4100/');
            await page.screenshot({
                path: `example-${browserType}.png`
            });
            await browser.close();
        });
    });
```

## Szukanie elementu

Aby wyszukać element na stronie musimy użyć funkcji:

    page.$(selector)

Pod spodem funkcja ta woła po prostu:

    document.querySelector

Co oznacza, że musimy użyć css selectora. Ponieważ tak właśnie działa funkcja, którą wymieniłem powyżej. Funkcja _$_ kiedy nie znajdzie elementu zwraca wartośc null. Więc test, który pokażę nam jej działanie będzie wyglądał w ten sposób:

```
it("Find element - " + browserType, async () => {
  const browser = await playwright[browserType].launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('http://localhost:4100/');
  const element = await page.$("a[href$='login']");

  expect(element).to.not.be.null;
  await page.screenshot({
      path: `example-${browserType}.png`
  });
  await browser.close();
});
```

Test po prostu weryfikuje czy element, który oczekuje, że istnieje na stronie został odnaleziony poprzez wykonanie asercji która sprawdza czy zmienna, do której zostanie przypisany element nie jest nullem. 

Łatwo zauważyć też pilną potrzebę refactoringu. Po odpowiednim przesunięciu kodu do funkcji _beforeEach_ i _afterEach_ kod wygląda w ten sposób:

```
const playwright = require('playwright');
const chai = require('chai')
const expect = chai.expect

describe('Smoke tests', function smoketests() {
    this.timeout(60000);
    this.slow(20000);

    let browser;
    let page;

    afterEach(async () => {
        await page.screenshot({
            path: `./screenshots/test-${this.ctx.currentTest.fullTitle()}-${Math.random().toString(36).substr(2, 5)}.png`
        });
        await browser.close();
    });

    ['chromium', 'firefox', 'webkit'].forEach((browserType) => {
        beforeEach(async () => {
            browser = await playwright[browserType].launch();
            const context = await browser.newContext();
            page = await context.newPage();
        });

        it("First test - " + browserType, async () => {
            await page.goto('http://localhost:4100/');
        });

        it("Find element - " + browserType, async () => {
            await page.goto('http://localhost:4100/');
            const element = await page.$("a[href$='login']");

            expect(element).to.not.be.null;
        });
    });
});
```

## Klik

Możemy wykonać go za pomocą funkcji:

    page.click(selector[, options])

Ta metoda pobiera element za pomocą selektora, w razie potrzeby przewija go do widoku, a następnie klika na środku elementu. Jeśli nie ma selektora pasującego do elementu, metoda wyrzuci błąd.

Test będzie wyglądał w ten sposób:

```
it("Click - " + browserType, async () => {
    await page.goto('http://localhost:4100/');
    await page.click("a[href$='login']");

    expect(await page.url()).to.be.string('http://localhost:4100/login');
});
```

Asercje wykonujemy przy pomocy funkcji:

    page.url()

Zwraca ona po prostu aktualny URL. Użyłem jej, ponieważ oczekuję że przycisk, którego naciskam wywoła przekierowania do innej podstrony.

Możemy wykonać również kliknięcie w kontekście elementu, którego znaleźliśmy przy pomocy innej funkcji:

    elementHandle.click([options])

Zachowa się ona tak samo, jak funkcja _page.click(selector[, options])_. Test z jej użyciem wygląda tak:

```
it("Click element - " + browserType, async () => {
    await page.goto('http://localhost:4100/');
    const element = await page.$("a[href$='login']");
    await element.click();

    expect(await page.url()).to.be.string('http://localhost:4100/login');
});
```

## Obsługa inputu

Tekst do elementu możemy wysłać przy pomocy funkcji:

    page.type(selector, text[, options])

Funkcja wyszukuje element na stronie przy pomocy selektora, następnie wpisuję tekst do elementu. Tekst z wykorzystaniem tej funkcji:

```
it("Type - " + browserType, async () => {
    await page.goto('http://localhost:4100/login');
    await page.type("input[type$='email']", 'example@example.com');

    expect(await page.$eval("input[type$='email']", el => el.value)).to.be.string('example@example.com');
});
```

W oczy rzuca się fragment kodu użytego w asercji:

    await page.$eval("input[type$='email']", el => el.value)

Używa on funkcji:

    page.$eval(selector, pageFunction[, ...args])

Ta funkcja uruchamia _document.querySelector_ na stronie i przekazuje go jako pierwszy argument funkcji pageFunction. Jeśli nie ma selektora pasującego do elementu, metoda wyrzuca błąd.

Jeśli funkcja pageFunction zwróci Promise, wówczas funkcja ta poczeka na rozwiązanie Promise i zwróci jej wartość.

Użyłem tego podejścia, aby pobrać wartość pola email w celu weryfikacji działania funkcji _type_. Aby to wykonać pobieram po prostu wartość atrybutu value, tam przechowywana jest wartość przekazanego inputu, na obiekcie, którego selektor przekazałem jako pierwszy argument funkcji. Następnie wykonuje asercje przy pomocy biblioteki chai.

Tę samą operację może wykonać w kontekście elementu, którego wcześniej znaleźliśmy na stronie.

    elementHandle.type(text[, options])

Funkcja focusuje się na elemencie, a następnie wysyła ciąg znaków. Czyli zachowa się tak samo, jak ta sama funkcja w kontekście _page_. Test z jej użyciem wygląda tak:

```
it("Type - element" + browserType, async () => {
    await page.goto('http://localhost:4100/login');
    const element = await page.$("input[type$='email']");
    await element.type('example@example.com')

    expect(await element.evaluate(el => el.value)).to.be.string('example@example.com');
});
```

Ciekawym faktem jest inny sposób utworzenia asercji. Nie możemy tym razem użyć funkcji _$eval_. Kiedy chcemy wykonać asercję na atrybucie elementu, którego już mamy musimy użyć funkcji:

    jsHandle.evaluate(pageFunction[, ...args])

Ta metoda przekazuje element jako pierwszy argument funkcji pageFunction. Jeśli funkcja pageFunction zwróci Promise, wówczas poczeka na rozwiązanie Promise i zwróci jej wartość.

## Podsumowanie

W ten sposób dotarliśmy do ostatniego testu w tym poście. Platforma w mojej opinii jest bardzo przyjazna osobie implementującej testy. Obawiałem się, że dokumentacja nie będzie wystarczająca, jestem bardzo mile zaskoczony, zapewnia ona wszystko, co potrzebne, aby ruszyć z miejsca. Wszystkie funkcje są wyczerpująco opisane, wraz z argumentami, które możemy do nich przekazać. Po jej analizie mogę powiedzieć, że platforma oferuję wiele ciekawych funkcji łatwo dostępnych bez większych komplikacji. Zamierzam je przetestować dlatego napewno poruszę tematy związane z Playwright w następnych postach.

Kod można zobaczyć tutaj:

    https://github.com/12masta/react-redux-realworld-example-app/tree/1-Playwright

Changeset:

    https://github.com/12masta/react-redux-realworld-example-app/pull/8/files

