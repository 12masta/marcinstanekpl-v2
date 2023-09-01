---
title:  Cypress i poprawne użycie selektorów, atrybut data-cy
date:   2019-12-03 08:00:00 +0200
categories: [testautomation, cypress]
tags: [testautomation, cypress, pl]
slug: cypress-5
ogimage: https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-12-03-selectors-refactor%2Fblog_post-cover.png?alt=media&token=6a825ffc-639e-42d8-a4fc-628c983dbfaa
ogimagetype: image/png
language: pl
description: Autor podkreśla znaczenie stosowania w testach automatycznych stabilnych i wysokiej jakości selektorów oraz opowiada się za wykorzystaniem w tym celu atrybutu „data-cy” w Cypress. Pokazują, jak dodawać i wykorzystywać te atrybuty w projekcie React, upraszczając złożoność selektora i zwiększając odporność testów, udostępniając łącza do odpowiednich zmian w kodzie w GitHub.
---

## Wstęp

Selektory i sposób ich budowania to bardzo istotny temat w kontekście stabilności, a co za tym idzie jakości, testów automatycznych. Do tej pory w moim projekcie były potraktowane po najmniejszej linii oporu. Najwyższa pora to zmienić.

Poprzedni post w tej tematyce znajdziesz tutaj: [Porządki, usystematyzowanie adresów URL](/cypress-4)

## Dlaczego do tej pory używałem tak niskiej jakości selektorów

Najpierw trochę kontekstu. Cypress posiada wbudowane narzędzie, które umożliwia szybkie pobranie selektora dla elementu na stronie. Możesz już znać podobne narzędzie np. z narzędzi deweloperskich wbudowanych w przeglądarkę. Jest ono dostępne po uruchomieniu testów, po najechaniu kursorem na ikonę celownika. Klikamy w nią, najeżdżamy na interesujący nas element na stronie, klikamy jeszcze raz i gotowe, mamy selektor gotowy do użycia.

[Selector playground](https://s3.eu-north-1.amazonaws.com/marcinstanek.pl/2019-12-03-selectors-refactor/cypress-5-1-selector-playground-.mp4)
<!--
{% include_relative video.html id="vid1" webm="https://s3.eu-north-1.amazonaws.com/marcinstanek.pl/2019-12-03-selectors-refactor/cypress-5-1-selector-playground-.webm" mp4="https://s3.eu-north-1.amazonaws.com/marcinstanek.pl/2019-12-03-selectors-refactor/cypress-5-1-selector-playground-.mp4" img="https://s3.eu-north-1.amazonaws.com/marcinstanek.pl/2019-12-03-selectors-refactor/cypress-5-1-selectors-playground.png" ogv="https://s3.eu-north-1.amazonaws.com/marcinstanek.pl/2019-12-03-selectors-refactor/cypress-5-1-selector-playground-.ogv" imgalt="cypress-5-1-selectors-playground"%}
 -->

Bardzo dobre narzędzie do prototypowania w kontekście tego projektu. Może się wydawać, że generuje słabej jakości selektory. Nic bardziej mylnego, napiszę jedynie, że po konfiguracji jest taka możliwość lub po podążaniu wytycznych twórców może ono generować dobrej jakości dane. Jednak zasługuje ono na osobny wpis i ucinam temat w tej chwili.

## Jakich selektorów użyć

Aby uniknąć problemów podczas tworzenia selektorów powinieneś pisać je w taki sposób, aby były odporne na zmiany. Jak to osiągnąć? Moim zdaniem wyjście jest jedno, użyć atrybutów przeznaczonych specjalnie do testów automatycznych. Twórcy narzędzia Cypress zalecają, aby taki atrybut miał nazwę:

    data-cy

Tego typu podejście rozwiązuje wiele przeciwności, a z pewnością ten czy musisz uczyć się ich składni, ponieważ w tym przypadku będzie banalnie prosta. Co jak wiadomo bywa skomplikowane.

Nie biorą się one jednak znikąd. Wymagają od testera otworzenia projektu testowego i dodania ich do odpowiednich miejsc w plikach .html. Jeżeli pracujesz nad projektem komercyjnym możesz oczywiście poprosić o to deweloperów, jednak nie będzie to wydajne podejście. Moim zdaniem jest to obowiązek testera automatyzującego.

## Dodawanie atrybutów na ekranie logowania

Mamy do czynienia z projektem utworzonym przy pomocy biblioteki React. A więc spodziewamy się, że w projekcie znajdziemy komponenty. Co to są komponenty? [Tutaj](https://pl.reactjs.org/docs/components-and-props.html) jest to dość fajnie wyjaśnione na przykładzie. Ja rozumiem je jako reużywalne kawałki html'a do którego możemy przekazywać argumenty w celu sprecyzowania ich działania, wyglądu i przeznaczenia. Nie musisz ich teraz zrozumieć. Wystarczy, że będziesz umiał przekazać do nich atrybut w celu jego przetestowania.

W zależności od specyfiki projektu poprawny sposób dodawania atrybutu będzie się różnił. Myśle, jednak że ostatecznie zawsze musimy zmodyfikować HTML - oprócz jakichś ekstremalnych przypadków brzegowych. ;)

Aby dodać taki atrybut do ekranu logowania należy zlokalizować w projekcie:

    react-redux-realworld-example-app

Plik:

    src/components/Login.js

Po otworzeniu go znajdujemy kod JavaScript, zwracający kod JSX. To JavaScript rozszerzony o możliwość zwracania znaczników HTML. Więcej [tutaj](https://pl.reactjs.org/docs/introducing-jsx.html). Po analizie kodu widzę, że za wyświetlenie pól tekstowych odpowiedzialny jest po prostu tag _input_. W nazewnictwie Reacta nazywamy go komponentem kontrolowanym_:

```
<input
  className="form-control form-control-lg"
  type="email"
  placeholder="Email"
  value={email}
  onChange={this.changeEmail} />
```

Na pierwszy rzut oka widać, że muszę znaleźć sposób na przekazanie atrybutu właśnie w tym miejscu i chcę, żeby wyglądało to tak:

```
<input
  className="form-control form-control-lg"
  type="email"
  placeholder="Email"
  value={email}
  onChange={this.changeEmail}
  data-cy="email-input" />
```

Zapisuję plik, odświeżam stronę. Wchodzę do narzędzi deweloperskich i widzę, że zmiana została zastosowana. Oczywiście projekt frontendu działa cały czas w tle.

<!--
{% include_relative video.html id="vid2" webm="https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-12-03-selectors-refactor%2Fcypress-5-2-data-cy-email-input.webm?alt=media&token=48cbe7e1-b1e8-4d47-8a62-54cb18d13fa2" mp4="https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-12-03-selectors-refactor%2Fcypress-5-2-data-cy-email-input.mp4?alt=media&token=adba3b05-3e4d-461f-9d1d-05f529b62dde.mp4" img="https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-12-03-selectors-refactor%2Fcypress-5-2-data-cy-email-input.png?alt=media&token=7351c7e2-46a6-4c3c-a758-8302fc60a3aa" ogv="https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-12-03-selectors-refactor%2Fcypress-5-2-data-cy-email-input.ogv?alt=media&token=5a865b5d-4f10-4392-b56a-a40b73e41e2b" imgalt="cypress-5-2-data-cy-email-input" %}
 -->
 
[Email input video](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-12-03-selectors-refactor%2Fcypress-5-2-data-cy-email-input.mp4?alt=media&token=adba3b05-3e4d-461f-9d1d-05f529b62dde.mp4)

To samo stosuje dla pola z hasłem:

```
<input
  className="form-control form-control-lg"
  type="password"
  placeholder="Password"
  value={password}
  onChange={this.changePassword} 
  data-cy="password-input" />
```

Jak i przycisku logowania:

```
<button
  className="btn btn-lg btn-primary pull-xs-right"
  type="submit"
  disabled={this.props.inProgress}
  data-cy="button-input" >
  Sign in
</button>
```

W tym momencie mogę przejść do refaktoryzacji funkcji, które korzystają z tych elementów. Otwieram plik:

    cypress/support/login/loginCommands.js

Zmieniam kod funkcji _login_ na korzystający z nowych atrybutów:

```
Cypress.Commands.add('login', (username, password) => {
    Cypress.log({
        name: 'login',
        message: `${username} | ${password}`,
    })
    if (username) {
        cy.get('[data-cy=email-input]')
            .type(username)
    }
    if (password) {
        cy.get('[data-cy=password-input]')
            .type(password)
    }
    cy.get('[data-cy=button-input]')
        .click()
})
```

Można zauważyć, że poziom skomplikowania selektorów zmalał. Zaszła również zależność, o której pisałem wyżej. Zunifikowany został sposób zapisu selektorów, od tego momentu wszystko, co musisz wiedzieć to to, że element na stronie można znaleźć przy pomocy ciągu znaków:

    [data-cy=]

Proste i ekstremalnie skuteczne.

## Dodawanie atrybutów do komponentów dodanych przez twórców aplikacji

Dodanie atrybutu do komunikatów o błędzie na stronie logowania okazuje się odrobinę bardziej skomplikowane. Komponentem odpowiedzialnym za ich wyświetlenie jest _ListErrors_, to komponent utworzony przez twórcę projektu frontendu aplikacji. Do tej pory dodawałem atrybut jedynie do komponentów wbudowanych w bibliotekę React, dlatego też proste doklejenie jednego argumentu było wystarczające. W tym przypadku ten kod nie jest wystarczający:

```
<ListErrors errors={this.props.errors} data-cy="error-message" />
```

Aby zmiany zostały zastosowane zgodnie z założeniem należy otworzyć plik:

    src/components/ListErrors.js

Następnie zmodyfikować jego zawartość do stanu:

```
import React from 'react';

class ListErrors extends React.Component {
  render() {
    const errors = this.props.errors;
    const datacy = this.props.datacy;
    if (errors) {
      return (
        <ul className="error-messages" data-cy="error-messages">
          {
            Object.keys(errors).map(key => {
              return (
                <li key={key} data-cy={datacy}>
                  {key} {errors[key]}
                </li>
(...)
```

Mamy tu połączenie dwóch technik. Pierwszą już nam znaną widzimy w tagu _ul_, tam po prostu przypisałem do niego atrybut z wartością, którą oczekiwałem. Drugą techniką jest przekazanie wartości dla atrybutu z zewnątrz komponentu. Polega ona na tym, że w kroku pierwszym nadaję wartość zmiennej, jest to właśnie:

```
<ListErrors (...) data-cy="error-message" />
```

Następnie przypisuję wartość argumentu z zewnątrz do zmiennej wewnątrz komponentu:
```
const datacy = this.props.datacy;
```

Na końcu przypisuję wartość zmiennej do każdego atrybutu elementu na liście błedów - tag _li_:
```
<li (...) data-cy={datacy}>
```

W ten oto sposób w drzewie DOM wyświetla się to, czego oczekiwałem:

![cypres-5-3-selectors-error-messages](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-12-03-selectors-refactor%2Fcypres-5-3-selectors-error-messages.png?alt=media&token=38e28971-9e03-476e-9d93-10272ad97483)

Przechodząc do refaktoryzacji walidacji komunikatów o błędzie, modyfikuje funkcje _shouldErrorMessageBeValid_ w pliku:

    cypress/support/login/loginAssertionsCommands.js

```
Cypress.Commands.add('shouldErrorMessagesBeValid', (message, secondeMessgae) => {
    Cypress.log({
        name: 'shouldErrorMessagesBeValid',
        message: `${message} | ${secondeMessgae}`
    })
    cy.get('[data-cy=error-message]')
        .first()
        .should('have.text', message)
        .next()
        .should('have.text', secondeMessgae)
})
```

Reszta zmian jest analogiczna do opisanych powyżej. Całość zmian znajdziesz w poniższej sekcji jako link do githuba.

## Podsumowanie

Dodanie atrybutów testowych znacząco uprościło budowę selektorów oraz uodporniło testy na zmiany w kodzie. Od teraz nie musisz uczyć się skomplikowanej składni selektorów.

Całość zmian znajdziesz w moim repo na branchu, tutaj:

    https://github.com/12masta/react-redux-realworld-example-app/tree/5-cypress

Changeset:

    https://github.com/12masta/react-redux-realworld-example-app/pull/6/files

Commit dodający selektory do kodu aplikacji:

    https://github.com/12masta/react-redux-realworld-example-app/pull/6/commits/e25ef9d091e354455924ede14db9e2038577b292

Commit dostosowywujący użyte selektory w testach:

    https://github.com/12masta/react-redux-realworld-example-app/pull/6/commits/00e1812fb4ee039c434763aeeaaf800ca0c4b2f8
