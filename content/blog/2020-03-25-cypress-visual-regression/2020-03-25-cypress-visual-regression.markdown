---
title:  Wizualna regresja z Cypress
date:   2020-03-25 08:00:00 +0200
categories: [testautomation, cypress]
tags: [testautomation, cypress, pl]
language: pl
slug: cypress-7
ogimage: https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2020-03-29-cypress-visual-regression%2Fpost_cover.png?alt=media&token=0c3c0db2-1c8c-48c7-8b3c-c4a49eaf3dda
ogimagetype: image/png
---

## Czym jest wizualna regresja?

Koncepcja jest bardzo prosta. Mając obraz tego, jak powinien wyglądać interfejs, który testujesz urchamiając testy porównujesz ten obraz ze stanem faktycznym. W ten sposób dowiadujesz się, czy zaszły jakieś zmiany. Umożliwia to wykrycie defektów, które nie zostałyby wychwycone ani przez klasyczne testy automatyczne regresji, ani najprawdopodobniej, przez sprawne oko testera wykonującego testy eksploracyjne.

Cypress nie udostępnia nam tej funkcji. Koniec. :) Na szczęście są zewnętrzne pluginy, te płatne i te darmowe. Postanowiłem wybrać darmowy, z największą liczbą gwiazdek na githubie - _cypress-image-snapshot_. Narzędzie to wrapper na narzędzie _jest-image-snapshot_ 2,3k gwiazdek na githubie daje wysoką pewność, że narzędzie dostarczy to, czego oczekujemy i nie zawiedziemy się w połowie implementacji.

## Setup pluginu

Instalacja jest prosta w projekcie root projektu _react-redux-realworld-example-app_ uruchamiam polecenie: 

    npm install --save-dev cypress-image-snapshot

Ponadto w pliku:

    <rootDir>/cypress/plugins/index.js

Musimy dodać taki blok kodu:

```
const {
  addMatchImageSnapshotPlugin,
} = require('cypress-image-snapshot/plugin');

module.exports = (on, config) => {
  addMatchImageSnapshotPlugin(on, config);
};
```

Oraz w pliku:

    <rootDir>/cypress/support/commands

Musimy dodać taki custom command:

```
import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command';

addMatchImageSnapshotCommand();
```

Po tym procesie mamy gotowy projekt do przeprowadzania testów wizualnych!

## Testy

W katalogu _cypress/integration_ dodaje plik: VisualTest.spec.js. Tworzę test, który sprawdzi ekran wyświetlony użytkownikowi po zalogowaniu się do aplikacji:

```
    it('Successfull login', function () {
        cy.visit('/login')
            .createNewUserAPI('test', 'test@test.com', 'test')
            .login('test@test.com', 'test');
        cy.matchImageSnapshot();
    })
```

W kontekście opisywanego tematu kluczowa jest linijka:

    cy.matchImageSnapshot();

Pierwsze uruchomienie testu spowoduje utworzenie obrazu, który od tej pory będzie wzorcem dla następnych testów.

![wizualna regresja wzorzec](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2020-03-29-cypress-visual-regression%2Fcypress-7-1.png?alt=media&token=d1d32cff-efec-4220-8b7c-b58dbd5beb32)

Dokładna logika funkcji _cy.matchImageSnapshot()_ wygląda w następujący sposób:

1. Zrzut ekranu przy pomocy funkcji: o nazwie zgodnej z bieżącym testem
1. Sprawdź, czy zrzut ekranu istnieje w katalogu: <rootDir>/cypress/snapshots, jeżeli tak wykonaj diff obrazów
1. Jeżeli istnieje różnica pomiędzy obrazami, zapisz screenshot pokazujący różnicę w katalogu: <rootDir>/cypress/snapshots/__diff_output__

Pora na weryfikację dokładności działania biblioteki. Na stronie po zalogowaniu wyświetla się tekst: "No articles are here... yet."
Usuwam jedną kropkę - zmiana ciężka do zweryfikowania podczas regresji. Po zmianie string wygląda w następujący sposób: "No articles are here... yet".

Po uruchomieniu testu okazuję się, że biblioteka zachowała się doskonale. Tak mała zmiana została wyłapana i zakomunikowana poprzez niezaliczenie testu.

Sfailowany test jest komunikowany w szczegółowy sposób. Możemy się z niego dowiedzieć jak duża jest różnica, w procentach i w pikselach:

![cypress nie zaliczony test](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2020-03-29-cypress-visual-regression%2Fcypress-7-2.png?alt=media&token=96fdbe41-8730-4a28-ae39-6418451ee5ee)

Oprócz wyżej wymienionych informacji biblioteka produkuje również diffa, gdzie możemy zobaczyć wizualnie różnicę. Zmiany podkreślone czerwonym kolorem. Różnica jest tylko na 8 pikselach także trzeba przybliżyć żeby zobaczyć efekt.

![Diff](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2020-03-29-cypress-visual-regression%2Fcypress-7-3.png?alt=media&token=7150c4ad-2b58-4077-8ed0-6827d5c6ae79)

Oprócz wizualnej regresji całego ekranu możemy wykonać również regresję konkretnego elementu na stronie. Umożliwia nam to składnia:

    cy.get(selector).matchImageSnapshot();

Implementuję tego typu test weryfikując przycisk logowania:

```
    it('Login button check', function () {
        cy.visit('/login');
        cy.get('.btn').matchImageSnapshot();
    })
```

Działanie jest analogiczne tak, jak dla całego ekranu. Jedyną różnicą jest jedynie kontekst weryfikacji. W tym przypadku zamierzam tak samo zweryfikować działanie funkcji. Zmieniłem dla przycisku jedną klasę, z "btn-primary" na "btn-secondary", co powoduje zmianę koloru przycisku. Biblioteka oczywiście z tym sobie radzi. A zmiany są znacznie bardziej widoczne.

![rezultat testu](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2020-03-29-cypress-visual-regression%2Fcypress-7-4.png?alt=media&token=16378f70-751c-4306-ad50-3f3a458bbfb9)

![wizualna regresja diff](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2020-03-29-cypress-visual-regression%2Fcypress-7-5.png?alt=media&token=c0951868-9eb3-4266-9b4c-ce11424a6970)

## Przydatne polecenia

    --env failOnSnapshotDiff=false

Jeżeli tymczasowo chcemy zignorować wyniki testów wizualnych, to polecenie nam to umożliwi. Co istotne, ignorujemy tylko wyniki, testy zostaną wykonane. Przykład użycia:

    npx cypress run --env failOnSnapshotDiff=false

Kolejne ciekawe polecenie:

    --reporter cypress-image-snapshot/reporter

Pozwala na użycie specjalnego reportera, który umożliwi nam szybkie porównanie zrzutów ekranów wykonanego przez narzędzie. Na macu, np. jeżeli używasz terminalu iTerm2 narzędzie wyświetla screenshot w oknie terminalu. Niestety nie działa to super dokładnie. Jak widać na załączonym zrzucie ekranu. Przykład użycia razem z ignorowaniem wyników testu:

    npx cypress run --reporter cypress-image-snapshot/reporter --env failOnSnapshotDiff=false

![raportowanie](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2020-03-29-cypress-visual-regression%2Fcypress-7-6.png?alt=media&token=0d9f2937-7778-4393-914f-f2fc6d594e78){:alt="raportowanie"}

    --env updateSnapshots=true

Polecenie to spowoduje aktualizacje zrzutów ekranów, które są użyte jako wzorzec. Po wykonaniu polecenia commit dla nowych zrzutów niejako aktualizujemy nasze przypadki testowe. Przykład użycia:

    npx cypress run --env updateSnapshots=true

## Podsumowanie

Jestem bardzo pozytywnie zaskoczony łatwością implementacji testów wizualnych, kiedy mamy już gotowe fundamenty testów funkcjonalnych. Wszystkie funkcje są dobrze udokumentowane. Zaimplementowałem wszystko, czego potrzebowałem w prosty i czytelny sposób. Ich wyniki również są przejrzyste. Jedyną niewiadomą dla mnie jest użycie testów wizualnych w CI. Teoretycznie mamy wszystkie narzędzia, które pozwolą skonfigurować testy. Jednak w tym poście nie rozwiewam moich wątpliwości.

Kod można zobaczyć tutaj:

    https://github.com/12masta/react-redux-realworld-example-app/tree/7-cypress

Changeset:

    https://github.com/12masta/react-redux-realworld-example-app/pull/9/files
