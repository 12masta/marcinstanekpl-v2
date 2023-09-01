---
title:  Przygotowanie środowiska
date:   2019-09-30 16:03:22 +0200
categories: [environment]
tags: [pl]
language: pl
slug: cypress-0
description: We wstępie do Cypress autor dzieli się swoją techniką tworzenia kompleksowych testów dla aplikacji internetowej zbudowanej na ASP.NET Core i React. Wyjaśniają proces instalacji, w tym instalację Cypress i pisanie podstawowych testów umożliwiających odwiedzanie stron internetowych, wyszukiwanie elementów, klikanie na nie i wykonywanie asercji. Podają także link do swojego repozytorium w celu uzyskania dalszych informacji i wspominają o zamiarze napisania większej liczby testów w przyszłych postach.
---

## Wstęp

Chciałbym Ci pokazać poniżej jak przygotować swoje lokalne srodowisko, które można wykorzystać do pracy nad automatyzacją testów.
Repozytoria które sforkowalem można znaleźć tutaj:

    https://github.com/gothinkster/realworld

## Backend

    https://github.com/12masta/aspnetcore-realworld-example-app

Aby przygotować środowiska potrzebujesz gita. Jak zainstalować gita?

    https://git-scm.com/book/en/v1/Getting-Started

Oprócz gita potrzebujesz Dockera: 

    https://docs.docker.com/get-started/

Kiedy mamy już gita, w naszym lokalnym katalogu musimy wykonać następujące polecenie w terminalu:

    git clone https://github.com/12masta/aspnetcore-realworld-example-app.git

Przejdź do katalogu poleceniem 

    cd aspnetcore-realworld-example-app

Kiedy masz już Dockera, przejdź do katalogu który został utworzony po wykonaniu polecenia git clone. Następnie w terminalu uruchom polecenie:

    make build

A następnie:

    make run

Po wykonaniu tych kroków pod adresem:

    http://localhost:5000/swagger

Powinieneś mieć dostęp do dokumentacji API - a więc gotowe, czas na front.

## Frontend

    https://github.com/12masta/react-redux-realworld-example-app

Aby móc zbudować front projektu potrzebujesz narzedzia npm ktore instaluje się razem z node.js. Jak go zainstalować?

    https://www.npmjs.com/get-npm

Kiedy będziesz miał już npm. Otwórz terminal i wykonaj polecenie w katalogu, w którym chcesz utworzyć projekt:

    git clone https://github.com/12masta/react-redux-realworld-example-app.git

Przejdź do katalogu poleceniem:

    cd react-redux-realworld-example-app

Teraz wykonujemy polecenie, aby zainstalować wszystkie wymagane zależności:

    npm install

Nastepenie, aby uruchomić nasz lokalny serwer:

    npm start

## Łączymy to w całość

Pamietaj, aby aplikacja działała prawidłowo po wykonaniu polecenia.

    npm start

Wymagane jest, aby działał również backend aplikacji, tj. z poziomu katalogu do którego poleceniem git clone skopiowaliśmy projekt backendu.
Należy wykonać polecenie:

    make run

Jeżeli z jakiegoś powodu potrzebujesz zmienić adres backendu, możesz to zrobić w pliku:

    src/agent.js

Należy zmienić wartość dla:

    API_ROOT

Na przykład:

    http://localhost:3000
