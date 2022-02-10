---
title:  Cypress i CI z Azure Devops
date:   2020-04-24 08:00:00 +0200
categories: [testautomation, cypress]
tags: [testautomation, cypress, pl]
language: pl
slug: cypress-8
ogimage: https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2020-04-13-cypress-and-ci%2Fpost_cover.png?alt=media&token=582925ff-bf77-4edb-96f7-341c5a06668d
ogimagetype: image/png
---

## Cypress i Continous Integration

Moim zdaniem od współczesnego testera wymagamy czegoś więcej niż tylko samego poprawnego utworzenia testów automatycznych. Jednym z atrybutów wyróżniających nowoczesnych inżynierów QA jest umiejętność samodzielnego zarządzania procesem ciągłej integracji. W tym poście dotykam zagadnienia właśnie wpięcia testów w proces CI. Zamierzam wykorzystać platformę Azure DevOps - uruchomię jedynie testy, bez kroku deploy backendu i frontendu, te komponenty wystawiłem jako osobny proces nieopisany w tym materiale.

## Azure DevOps

Konto jest darmowe. Więc aby zacząć przygodę z CI zakładamy konto i możemy zaczynać pracę. Na stronie:

    https://dev.azure.com

Tworzę nowy projekt jak na screenshotcie.

Przechodzę do zakładki pipeline i klikam Create Pipeline. Wybieram moje repozytorium kodu, w mojej sytuacji jest to GitHub. Repozytorium: _react-redux-realworld-example-app_ wybieram je. Muszę nadać odpowiednie uprawnienia, zgadzam się. Następnie muszę wybrać sposób konfiguracji mojego pipeline. Testy uruchamiam przy pomocy narzędzia _npm_ więc sugestia użycia prekonfiguracji dla NodeJS wydaje się trafna. Wybieram więc zasugerowane ustawienie. W następnym kroku kreator proponuje mi konfiguracje w pliku .yml:

```
trigger:
- master

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: NodeTool@0
  inputs:
    versionSpec: '10.x'
  displayName: 'Install Node.js'

- script: |
    npm install
    npm run build
  displayName: 'npm install and build'
```

W tym momencie należy zastanowić się jak uruchamiam testy aby odpowiednio zdefiniować potrzebne kroki. Zaczynając od góry pliku, w moim przypadku na początek uruchomienie testów tylko na branchu master jest niewystarczające. Chciałbym uruchamiać testy na każdym branchu. Osiągnę to za pomocą zmiany sekcji _trigger_, która powinna wyglądać w ten sposób:

```
trigger:
  paths:
    include:
      - '*'
```

Wersja Node 10.x jest poprawna, na pewno wystarczająca, pozostawiam tę sekcję bez zmian. Przed wykonaniem testów muszę wykonać polecenie _npm install_. Aby zainstalować wszystkie potrzebne zależności do uruchomienia testów. Zamieniam istniejącą sekcję _script_ na:

```
- script:
    npm install
  displayName: 'Install dependecies'  
```

Następnym krokiem jest walidacja zainstalowania narzędzia Cypress. Można to osiągnąć używając polecenia _cypress verify_. Nie mam jeszcze tego skryptu w swoim repozytorium. Jednak wiem, że będę uruchamiał go za pomocą skryptu npm: _npm run cy:verify_. Dodają tę sekcję do projektu.

```
- script:
    npm run cy:verify
  displayName: 'Cypress verify'
```

Kolejnym etapem jest uruchomienie testów. Zazwyczaj uruchamiam je za pomocą polecenia: _npx cypress run_. Tu zamierzam zmienić delikatnie konwencję. Zamierzam dla spójności również użyć skryptu npm: _npm run cy:verify_

```
- script:
    npm run cy:run
  displayName: 'Execute cypress tests'
```

To wszystkie zmiany które potrzebuję od strony Azure DevOps. Naciskam Save and Run i mam gotowy pierwszy etap mojej pracy. Plik azure-pipelines.yml wygląda tak:

```
trigger:
  paths:
    include:
      - '*'

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: NodeTool@0
  inputs:
    versionSpec: '10.x'
  displayName: 'Install Node.js'

- script:
    npm install
  displayName: 'Install dependecies'  

- script:
    npm run cy:verify
  displayName: 'Cypress verify'

- script:
    npm run cy:run
  displayName: 'Execute cypress tests'
```

Podejrzewam, jednak że będą to nie wystarczające zmiany. Wiem, że testy komunikują się ze środowiskiem lokalnym, które jest niedostępne na agencie Azure DevOps. Moje przewidywania sprawdzają się po uruchomieniu pierwszego buildu kończy się błędem.

    Bash exited with code '1'.

Testy uruchomiły się jednak host:

    http://localhost:4100

Nie jest dostępny. Zdecydowanie jestem mile zaskoczony jasną komunikacją błędów. W przypadku błędu z URL otrzymałem output:

```
Cypress could not verify that this server is running:

  > http://localhost:4100

We are verifying this server because it has been configured as your `baseUrl`.

Cypress automatically waits until your server is accessible before running tests.

We will try connecting to it 3 more times...
```

A w przypadku błędu URL do API:

```

We received this error at the network level:

  > Error: connect ECONNREFUSED 127.0.0.1:5000

-----------------------------------------------------------

The request we sent was:

Method: DELETE
URL: http://localhost:5000/users
```

Od razu wiadomo gdzie leży problem. Na te potrzeby zdeployowałem aplikację, którą testuję, aby była dostępna w sieci. Jest to swego rodzaju skrót na potrzeby pisania postu. Jak najbardziej możliwe jest ustawienie testów w procesie deployu całej aplikacji, mam tu na myśli frontend i backend Conduit. Zaczynam jednak od wpięcia samych testów. Nadal jednak potrzebuję dokonać zmian w projekcie testowym, aby dostosować projekt do nowych wymagań i środowiska uruchomieniowego.

Zamierzam przechowywać adresy URL w zmiennych przechowywanych w Azure DevOps. Są to poprostu zmienne środowiskowe, opakowane w funkcje na CI. Muszę to wziąc pod uwagę podczas dokonywania zmian w kodzie. Okazuję się również że nie mogę modyfikować obiektu _config_ w Cypress gdziekolwiek tylko wymyślę. Jest to możliwe jedynie poprzez funkcje plugin. Edytuję więc plik: _cypress/plugins/index.js_ do postaci:

```

module.exports = (on, config) => {
  config.baseUrl = process.env.BASE_URL || config.baseUrl;
  config.env.apiUrl = process.env.API_URL || config.env.apiUrl;
  (...)
  return config
}
```

Pobieram wartość zmiennej środowiskowej za pomocą polecenia _process.env.BASE_URL_. Jeżeli taka nie istnieje pozostawiam wartość domyślną. Bardzo ważne jest, aby pamiętać o zwróceniu obiektu config z funkcji. Bez tego elementu ta zmiana nie zadziała.

Następnie muszę dodać zmienne w Azure DevOps. Przechodzę do sekcji Pipelines, wybieram mojego pipe'a. Klikam Edit. W prawym górnym rogu wybieram Variables. Dodaje dwa Variable, które pozwolą mi na ustawienie adresu dostępnego w sieci. Dodaje je i zapisuje od tego momentu mój pipeline działa poprawnie.

![zmienne środowiskowe azure devops](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2020-04-13-cypress-and-ci%2Fcypress-8-1.png?alt=media&token=32482f6d-483d-4e3a-b6c9-d613a035be69)

Dzięki integracji AzureDevOps przy każdym PR zostanie uruchomiony nasz pipeline, który może być wymagany na przykład do możliwości zmergowania zmian. Nie jest to domyślna konfiguracja, jednak jest to możliwe. Oznacza to, że możemy wymusić uruchomienie testów dla każdego PR, a sam proces uruchomienia testów został przed chwilą przeprowadzony.

![integracja azure devops i github](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2020-04-13-cypress-and-ci%2Fcypress-8-2.png?alt=media&token=8fe77ccd-55d3-4207-a2d9-00bcd9686f2c)

## Podsumowanie

Uruchomienie testów na Azure DevOps okazało się stosunkowo prostym zadaniem. Integracja przeszła w miarę bez problemowo. Warto pamiętać o zwróceniu obiektu _config_ w plug-inie do Cypressa, zapomniałem to zrobić i straciłem na to dużo czasu. :) Oprócz tego jestem bardzo zadowolony z efektu. Myslę, że każdy tester powinien zapiąć swoje testy do CI najszybciej jak to tylko możliwe. Platforma jest drugoplanowa moim zdaniem.

Kod można zobaczyć tutaj:

    https://github.com/12masta/react-redux-realworld-example-app/tree/8-cypress

