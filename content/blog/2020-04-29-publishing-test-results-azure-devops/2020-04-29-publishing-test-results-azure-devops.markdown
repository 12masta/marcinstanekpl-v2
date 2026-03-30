---
title:  Raportowanie testów Cypress w Azure DevOps
date:   2020-04-29 08:00:00 +0200
categories: [testautomation, cypress, ci, azuredevops]
tags: [testautomation, cypress, ci, azuredevops, pl]
language: pl
slug: cypress-9
ogimage: https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2020-04-29-publishing-test-results-azure-devops%2Fpost_cover.png?alt=media&token=9800ca92-ef08-4b5a-beee-7b20ace97430
ogimagetype: image/png
description: Wyjaśniono, jak skonfigurować raportowanie testów Cypress w potokach Azure DevOps. Opisuje kroki konfiguracji raportowania testów przy użyciu formatu JUnit, zapewniając, że awarie testów nie zakłócą potoku, a także zawiera przegląd wynikowych funkcji raportu z testów w Azure DevOps, podkreślając łatwość integracji i potencjał dodatkowych funkcjonalności w przyszłości posty.
---

## Azure DevOps, Cypress i raport z testów

Kiedy mamy gotowy piepline z testami Cypress relatywnie łatwo możemy utworzyć raport z przeprowadzonych testów. Służy do tego krok Publish Test Results, który umożliwia nam transformację wyników testów w czytelny raport.

Raporty z testów zapewniają skuteczny i spójny sposób przeglądania wyników testów wykonanych przy użyciu różnych platform testowych, ponadto służą w celu pomiaru jakości pipeline'u, ułatwiają identyfikowanie i rozwiązywanie problemów.

## Publikowanie wyników testów w Azure DevOps

Aby osiągnąć wyżej wymieniony efekt musimy dodać nowy task do naszego pipeline o nazwie _Publish Test Results._ Znajdziemy go w sekcji _Tasks_ podczas edycji naszego pipeline.

![Publikacja wyników testów](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2020-04-29-publishing-test-results-azure-devops%2Fcypress-9-1.png?alt=media&token=0f130546-deea-4528-8653-2af58fdaa32d)

Krok ten wspiera kilka formatów plików, w których przechowywane są wyniki testów. Są to:

- JUnit
- NUnit
- VSTest
- XUnit
- CTest

Okazuję się, że Cypress domyślnie wspiera _reportery_ wbudowane w bibliotekę Mocha oraz dwa dodatkowe _teamcity_ i _junit_. Jak widać jest tutaj punkt wspólny, _junit_. Pozwala to na sprawną adaptację Cypressa. Należdy dodać jedynie dodatkowy skrypt w npm:

```
  "scripts": {
    (...)
    "cy:run-junit-reporter": "cypress run --reporter junit --reporter-options 'mochaFile=results/TEST-[hash].xml,toConsole=true'",
    (...)
  }
```

Argument:

    --reporter junit_ 

Oznacza, że używam reportera _junit_ do przedstawienia wyników testów. Bardzo ważną część jest argument:

    --reporter junit --reporter-options 'mochaFile=results/TEST-[hash].xml,toConsole=true'

Każdy plik testowy tj. specyfikacja jest przetwarzany całkowicie osobno podczas każdego uruchomienia testów. Zatem każde uruchomienie specyfikacji zastępuje poprzedni plik raportu. Aby zachować unikalne raporty dla każdego pliku specyfikacji, należy użyć [hash] w nazwie pliku raportu. Ta konfiguracja utworzy osobne pliki XML w folderze wyników dla każdego pliku testowego. Następnie należy scalić raportowane dane wyjściowe w oddzielnym kroku. W naszym przypadku zrobimy to już w Azure DevOps, opiszę to za chwilę. Po zmergowaniu pliku package.json z nowym skryptem możemy wrócić do edycji pipeline w Azure DevOps. Edytuję krok: _Execute cypress tests_ który wygląda następująco:

```
- script:
    npm run cy:run-junit-reporter
  continueOnError: true
  displayName: 'Execute cypress tests'
```

Zmieniłem dwie rzeczy. Skrypt npm, który uruchamiam: _npm run cy:run-junit-reporter_, to opisałem powyżej. Oprócz tego dodałem jeden parametr: _continueOnError: true_. Powoduje to żę błedy testów w tym kroku nie powodują przerwania wykonywania się Pipeline. Jest to wymagane, aby krok, który za chwilę opiszę miał okazję się wykonać. W przeciwnym wypadku w przypadku kiedy jeden z testów nie zakończyły się sukcesem build zakończyłby się niepowodzeniem, a krok publikacji testów nie wykonałby się, tego powodu nie mielibyśmy możliwości wyświetlenia się raportu.

Następnym krokiem jest publikacja wyników testów. Definicja tego kroku wygląda następująco:

```
- task: PublishTestResults@2
  inputs:
    testResultsFormat: 'JUnit'
    testResultsFiles: '**/TEST-*.xml'
    failTaskOnFailedTests: true
    testRunTitle: 'Cypress tests'
```

Potrzebujemy dodać parę parametrów, aby odpowiednio skonfigurować ten krok. Pierwszym jest:

    testResultsFormat: 'JUnit'

Jak opisałem powyżej krok ten wspiera kilka typów plików zawierających dane z przeprowadzonych testów. Typ ten musi pasować do danych przekazanych przez nasz runner, w tym wypadku _JUnit_.

    testResultsFiles: '**/TEST-*.xml'

Służy do ustalenia konwencji nazewnictwa plików, w których przechowywane są dane testowe.

    failTaskOnFailedTests: true

Kiedy pole ma wartość _true_ zadanie zakończy się niepowodzeniem, jeśli którykolwiek z testów w pliku wyników zostanie oznaczony jako zakończony niepowodzeniem. To ustawienie jest potrzebne, aby przesunąć fail pipeline'u z kroku _Execute cypress tests_ właśnie do publikacji rezultatu testów. Bez tego ustawienia byłoby to niemożliwe.

    testRunTitle: 'Cypress tests'

Nazwa, która pojawi w się w wygenerowanym raporcie.

To już wszystkie kroki potrzebne do podłączenia raportowania w Azure DevOps, plik .yml, który to umożliwia całościowo wygląda tak:

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
    npm run cy:run-junit-reporter
  continueOnError: true
  displayName: 'Execute cypress tests'

- task: PublishTestResults@2
  inputs:
    testResultsFormat: 'JUnit'
    testResultsFiles: '**/TEST-*.xml'
    failTaskOnFailedTests: true
    testRunTitle: 'Cypress tests'
```

Po zapisaniu zmian, kiedy nasz pipeline się wykona pojawia się zakładka _Tests_ w której możemy zobaczyć nasz raport. Ta strona ma następujące sekcje:

![Podsumowanie wyników testów](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2020-04-29-publishing-test-results-azure-devops%2Fcypress-9-3.png?alt=media&token=c1eccd8a-836e-4089-9e39-fd6b87411bc4)

- Summary: zapewnia kluczowe miary ilościowe do wykonania testu, takie jak całkowita liczba testów, testy zakończone niepowodzeniem, procent zaliczenia i inne. Zapewnia również różnicowe wskaźniki zmian w porównaniu do poprzedniego wykonania.

![Wyniki testów](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2020-04-29-publishing-test-results-azure-devops%2Fcypress-9-4.png?alt=media&token=fd9c574f-db49-432a-9b8a-57ac586b2f41)

- Results: zawiera listę wszystkich testów wykonanych i zgłoszonych jako część bieżącej wersji lub wydania. Widok domyślny pokazuje tylko testy zakończone niepowodzeniem i przerwane, aby skupić się na testach wymagających uwagi. Możesz jednak wybrać inne wyniki za pomocą dostarczonych filtrów.

![Szczegóły testów](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2020-04-29-publishing-test-results-azure-devops%2Fcypress-9-5.png?alt=media&token=5b86e9cf-8986-4235-acc3-8058c3f478be)

- Details: lista testów, które można sortować, grupować, wyszukiwać i filtrować w celu znalezienia potrzebnych wyników testów.

![Trendy historyczne testu](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2020-04-29-publishing-test-results-azure-devops%2Fcypress-9-6.png?alt=media&token=67d1f720-6132-4c8e-8fb7-9de4341c49b2)

- Trendy historyczne testu
Historia wykonywania testów może dać wiele potrzebnych informacji inżynierowi testów. Podczas rozwiązywania problemów warto wiedzieć, jak test zachowywał się w przeszłości. Karta ta zawiera historię testów w kontekście wyników testów. Informacje o historii testów są ujawniane w sposób progresywny, zaczynając od bieżącego potoku kompilacji do innych gałęzi, lub bieżącego etapu do innych etapów, odpowiednio dla kompilacji i wydania.

## Podsumowanie

Integracja testów z funkcjami raportowania w Azure DevOps okazała się bardzo łatwa. Dostarczone raporty są bardzo czytelne i dają nam wiele interesujących funkcji. Dodam jedynie, że to nie koniec możliwości. Przedstawię je w następnym poście.
