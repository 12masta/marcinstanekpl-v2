---
title:  Cypress i Cross Browser Testing teraz już dostępne
date:   2020-02-13 08:00:00 +0200
categories: [testautomation, cypress]
tags: [testautomation, cypress, pl]
slug: cypress-6
ogimage: https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/cypress-6%2Fblog-post-cover.png?alt=media&token=937f5e7b-8ef9-480f-ab8a-27193ce2f86f
ogimagetype: image/png
language: pl
---

## Wstęp

Otrzymałem wczoraj mail z doskonałą wiadomością. Cypres właśnie wprowadził wsparcie dla nowych przeglądarek: Firefox i Microsoft Edge. Z tego co wiem wsparcie dla Firefox było jedną z najczęściej zgłaszanych ticketów przez społeczność dlatego fajnie że twórcy dowieźli tą funkcję.

Poprzedni post znajdziesz tutaj: [Cypress i poprawne użycie selektorów, atrybut data-cy](/cypress-5)

## Aktualizacja wersji Cypress

Przede wszystkim sprawdzam czy testy które stworzyłem do tej pory działają poprawnie. Uruchamiam Cypress'a poleceniem:

    npx cypress open

Następnie uruchamiam wszystkie testy - weryfikuje output. Wszystko działa jak należy. Więc zamykam narzędzie i przechodzę do aktualizacji. Używam polecenia w terminalu:

    npm update cypress

Wykonanie tego polecenia spowodowało jedynie aktualizacje do wersji: _3.8.3_. Dopiero polecenie:

    npm install cypress@4.0.1

Spowodowało instalacji narzędzia w wersji której oczekiwałem. Sprawdzam instalację:

    npx cypress open

Wszystkie testy uruchamiają się w sposób, który oczekiwałem na Google Chrome.

W razie problemów po aktualizacji twórcy przygotowali konkretne przykłady jak sobie z nimi poradzić. Niektóre biblioteki, na których zbudowany jest Cypres zostały zaktauzlizowane, takie jak Mocha i Chai co może spodowować, że niektóre testy, które napisałeś do tej pory będą niekompatybilne:

    https://docs.cypress.io/guides/references/migration-guide.html?utm_campaign=Cross%20Browser%20Support&utm_source=hs_email&utm_medium=email&utm_content=83268675&_hsenc=p2ANqtz-80_JWNpbFIL4OXM3x84hJ9YXyUaS_wp6TN571LTimGEl6OgPOrc9Bocc340mjTtyPUjZI-RpEOzxLI-lXhQcju8_hmYg&_hsmi=83268675#Mocha-upgrade

## Uruchomianie testów na innych przeglądarkach

Zmiana przeglądarki z poziomu Test Runnera jest dostępna w prawym górnym rogu.

![jak-wybrac-przegladarke-cypress](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/cypress-6%2Fcypress-6-1.png?alt=media&token=938fd6c1-3de8-486a-88ad-b847badcd214){:alt="jak-wybrac-przegladarke-cypress"}

Jak widać Firefox i Edge nie jest dostępny z prozaicznego sposobu. Nie mam tych przeglądarek zainstalowanych na dysku. Naprawiam ten problem i uruchamiam ponownie Test Runner'a. Po instalacji przeglądarek spotkałem się z problemem. Polecenie:

    npx cypress open

Nie powodowało otwarcia Test Runnera. Polecenie zawieszało się i musiałem anulować je w terminalu. Naprawiłem to w dość prosty sposób. Uruchomiłem testy w terminalu poleceniem:

    npx cypress run

Następnie:

    npx cypress open

Działał już poprawnie. Po wykonaniu tych operacji mam już dostępne nowe przeglądarki!

![nowe-przegladarki-cypres](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/cypress-6%2Fcypress-6-2.png?alt=media&token=ea14dafe-df17-4a19-b626-ebf15526f63f)

Uruchomienie testów przebiegło już bez żadnych problemów. Ich wyniki zbiegają się z tymi z Google Chrome. Oto nagrania z przebiegu testów.

Firefox:

[firefox video](https://player.vimeo.com/video/391214922)

Edge:

[Edge video](https://player.vimeo.com/video/391215002)

Testy można uruchomić również z poziomu terminalu:

    npx cypress run --browser firefox

    npx cypress run --browser edge

## Podsumowanie

Aktualizacja narzędzia nie przebiegła do końca bez problemów. Udało się jednak rozwiązać je w miarę prostymi sposobami bez kontaktu z supportem. Ostatecznie testy na Firefox i Edge uruchamiają się poprawnie. Korzystanie z nowych funkcji jest fajny.

Kod na github dostępny na branchu:

    https://github.com/12masta/react-redux-realworld-example-app/tree/6-cypress

Changeset:

    https://github.com/12masta/react-redux-realworld-example-app/pull/7/files
