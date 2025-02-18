---
title:  Zapoznanie się z Cypress
date:   2019-10-01 10:03:22 +0200
categories: [cypress, testautomation]
tags: [cypress, testautomation, pl]
slug: cypress-1
language: pl
description: Autor podzielił się swoją techniką tworzenia kompleksowych testów z wykorzystaniem narzędzia Cypress dla aplikacji zbudowanych na ASP.NET Core i React. Zawierają instrukcje krok po kroku dotyczące konfiguracji Cypress, tworzenia podstawowych testów umożliwiających odwiedzanie witryny internetowej, wyszukiwanie elementów, klikanie na nie, wprowadzanie asercji i interakcję z polami wejściowymi, podkreślając moc Cypress w testowaniu aplikacji internetowych.
---

## Wstęp

Cześć, chciałem się podzielić z Tobą moja droga tworzenia testów przy pomocy narzędzia Cypress. Będę tutaj opisywał proces tworzenia testów e2e dla aplikacji złożonej z backendu (ASP.NET Core) i frontendu (React).

Ten i następne posty zakładają ze jeżeli chcesz razem ze mną podążać krokami które tu pokazuje powinieneś z powodzeniem mieć u siebie skonfigurowane te dwa projekty:

    https://github.com/12masta/react-redux-realworld-example-app

    https://github.com/12masta/aspnetcore-realworld-example-app

Ich setup opisałem w tym poście: [Przygotowanie środowiska](/cypress-0)

## Analiza historii użytkownika oparta na AI

Odblokuj pełny potencjał swojego procesu rozwoju oprogramowania dzięki naszemu narzędziu opartemu na sztucznej inteligencji! Znajdziesz je [tutaj](https://defectzero.com/).

[![Defect zero](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/defect%20zero%2Fdefect-zero-min.png?alt=media&token=6ca28446-47df-4391-a5a7-a5d8ca7bd0e5)](https://defectzero.com/)

## Szybki setup

Aby moc używać tego narzędzia najpierw musimy go zainstalować w naszym projekcie. Najlepiej jest zastosować się do artykuły Getting Started na stronie twórców:

    https://docs.cypress.io/guides/getting-started/installing-cypress.html

Ja opisze to na swoim przykładzie. Przenoszę się przy pomocy terminala do katalogu w którym mam swój projekt dla którego chce zainstalować Cypressa, tj. react-redux-realworld-example-app

Przy pomocy narzędzia npm wykonuje następujące polecenie:

    npm install cypress --save-dev

Instaluje się ono lokalnie jako narzędzie deweloperskie.

Teraz po wykonaniu tego polecenia:

    npx cypress open

Otwiera nam się nowo zainstalowane narzędzie. Teraz kiedy mamy setup za sobą, jakie to proste, możemy zacząć pisać testy.

## Pierwszy test

Powyższe kroki spowodowały utworzenie się katalogu Cypress na poziomie root projektu. Są tam też przykłady użycia narzędzia. Nie będę ich opisywał, zaczynam od utworzenia pierwszych testów.

A więc w katalogu:

    ../cypress/integration/

Tworzę nowy plik, w moim przypadku o nazwie SmokeTests.spec.js. Powinien on zostać natychmiast rozpoznany i wyświetlony w oknie.:

![1-cypress-windows](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-10-01-first-tests-with-cypress%2F1-cypress-windows.png?alt=media&token=d833a67e-6977-40ad-8cd5-83c897b51ccd)

Następnym krokiem jest otworzenie nowo utworzonego pliku i napisane swojego pierwszego testu, który odwiedzi naszą aplikacje. Aby tego dokonać należy użyć polecenie:

    cy.visit() 

Musimy po prostu do tej funkcji przekazać adres URL.

    describe('My First Tests', function() {
        it('Visits app', function() {
        cy.visit('http://localhost:4100/')
        })   
    })

Po zapisaniu pliku i dwukrotnym kliknięciu na SmokeTests.spec.js w oknie Cypressa powinieneś zobaczyć następujący rezultat:

![2-first-test](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-10-01-first-tests-with-cypress%2F2-first-test.png?alt=media&token=6643978e-ba1f-4fcc-a319-3822d183adec)

W oknie Cypress możesz zauważyć operacje VISIT która właśnie oznacza odwiedzenie strony przez nasz test.

Świetnie, właśnie mamy nasz pierwszy test, który odwiedza naszą stronę. Nie robi on zbyt wiele, nie zawiera ani żadnej interakcji, ani żadnej asercji.

## Szukanie elementu

Aby móc wykonać jakąkolwiek interakcje musimy najpierw wyszukać element w drzewie HTML, możemy użyć do tego funkcji:

     cy.get()

Oraz przekazać do niej lokator, za którego pomocą znajdziemy element. W tym przypadku będzie to:

    '.navbar-brand'

Łącząc te dwa czynniki powstał taki oto test:

    it('My First Get', function() {
      cy.visit('http://localhost:4100/')
      cy.get('.navbar-brand')
    })

Po zapisaniu i uruchomieniu testu weryfikacja powinno zakończyć się powodzeniem. Nawet kiedy nie dodaliśmy asercji wiemy ze wszystko jest OK ponieważ część metod w Cypress jest zaprojektowana tak, aby zweryfikować czy wszystko jest w porządku nawet bez dodawania asercji, w tym przypadku, gdyby nie udało się znaleźć elementu na stronie przy pomocy wyżej podanego selektora test zakończyłby się niepowodzeniem.

Kiedy zamienimy selektor na naprzyklad:

    cy.get('.navbar-brand-fail-me')

Zobaczymy następujący rezultat:

![3-first-get](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-10-01-first-tests-with-cypress%2F3-first-get-v2.png?alt=media&token=aee6da24-3e1e-4fbe-9936-ad5d7ae36338)

## Klik!

Kiedy umiemy znaleźć element możemy zaimplementować jego kliknięcie. Służy do tego metoda:

    .click()

Możemy go jednak wykonać dopiero po znalezieniu interesującego elementu, wiec użycie będzie wyglądać mniej więcej tak:

    cy.get().click()

Tego typu budowanie interfejsów nazywamy Fluent Interfaces, twórcy Cypressa nazywają to "chaining".

Gotowy test będzie wyglądał tak:

    it('My First Click', function() {
      cy.visit('http://localhost:4100/')
      cy.get(':nth-child(3) > .nav-link').click()
    })

Okno aplikacji po utworzeniu tego testu powinno wyglądać w ten sposób:

![4-first-click](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-10-01-first-tests-with-cypress%2F4-first-click.png?alt=media&token=6848ffb6-57d6-457c-b115-294b1f81ee53)

## Asercja

Kiedy wiemy jak kliknąć element możemy dodać asercje która zweryfikuje czy po kliknięciu elementu zostajemy przekierowani na poprawny adres url. Do asercji użyjemy funkcji:

    .should()

Taki test będzie wyglądał w następujący sposób:

    it('My First Assertion', function() {
      cy.visit('http://localhost:4100/')
      cy.get(':nth-child(3) > .nav-link').click()
      cy.url().should('include', '/register')
    })

Test składa się z 3 kroków, przechodzimy na stronę aplikacji która właśnie testujemy. Potem klikamy w przycisk który powinien przenieść nas na stronę rejestracji. Następnie weryfikujemy czy rzeczywiście znajdujemy się pod właściwym adresem URL.

Okno aplikacji po utworzeniu tego testu powinno wyglądać w ten sposób:

![5-first-assertion](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-10-01-first-tests-with-cypress%2F5-first-assertion.png?alt=media&token=673b7b71-2bac-4dc6-be71-8f40f6619c91)

## Obługa inputu

Aby wpisać tekst do pola użyłem funkcji:

    .type()

Test z wykorzystaniem tej funkcji będzie wyglądał w ten sposób:

    it('My First type', function() {
      cy.visit('http://localhost:4100/register')

      cy.get(':nth-child(1) > .form-control')
      .type('exampleusername')
      .should('have.value', 'exampleusername')
    })

Test otwiera podstronę pod adresem /register. Znajduje pole do którego zostanie wpisany tekst, wpisuje tekst: 'exampleusername'. Następnie przy użyciu funkcji z odpowiednim argumentem:

    .should('have.value', 'exampleusername')

Zostaje wykonana asercja czy pole zawiera odpowiednia wartość po zakończeniu reszty operacji.

Okno aplikacji po utworzeniu tego testu powinno wyglądać w ten sposób:

![6-first-type](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-10-01-first-tests-with-cypress%2F6-first-type.png?alt=media&token=4a7866a6-bc0a-4115-a798-7271a20b33a5)

## Zakończenie

Po wykonaniu tych operacji specyfikacja testowa wygląda tak:

    describe('My First Tests', function() {
        it('Visits app', function() {
            cy.visit('http://localhost:4100/')
        })   

        it('My First Get', function() {
            cy.visit('http://localhost:4100/')
            cy.get('.navbar-brand')
        })

        it('My First Click', function() {
            cy.visit('http://localhost:4100/')
            cy.get(':nth-child(3) > .nav-link').click()
        })

        it('My First Assertion', function() {
            cy.visit('http://localhost:4100/')
            cy.get(':nth-child(3) > .nav-link').click()
            cy.url().should('include', '/register')
        })

        it('My First type', function() {
            cy.visit('http://localhost:4100/register')

            cy.get(':nth-child(1) > .form-control')
            .type('exampleusername')
            .should('have.value', 'exampleusername')
        })
    })

Całość zmian znajdziesz również na moim repo na branchu który znajdziesz tutaj:

    https://github.com/12masta/react-redux-realworld-example-app/tree/1-cypress

Cypress wygląda na obiecujące narzędzie i zamierzam kontynuować rozwój testów, dlatego wyczekuj następnego postu. ;)
