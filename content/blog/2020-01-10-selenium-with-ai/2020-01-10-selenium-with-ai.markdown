---
title:  AI dla Selenium WebDriver?!
date:   2020-01-10 08:00:00 +0200
categories: [testautomation, selenium, AI]
tags: [testautomation, selenium, AI, pl]
slug: selenium-ai-1
ogimage: https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2020-01-10-selenium-with-ai%2Fcover.png?alt=media&token=8e0ffe7a-9075-45dc-a0ab-a942981dbd18
ogimagetype: image/png
language: pl
---

## Wstęp

Przeczytałem ostatnio o sposobie użycia sztucznej inteligencji w celu zastąpienia zwykłych lokatorów w Selenium WebDriver. Nie mogę się doczekać, żeby przetestować to rozwiązanie dlatego zabieram się do pracy!

Poprzedni post znajdziesz tutaj: [Proces testowy, do którego dążę w projektach, nad którymi pracuję](/test-process-1)

## Setup aplikacji, która zostanie przetestowana

Zamierzam przetestować aplikację, którą już znasz z serii o Cypress. Jej setup opisałem w tym poście: [Przygotowanie środowiska]({% post_url 2019-09-30-environment-setup %})

## Ale jak?!

Rozwiązanie jest zbudowane na podstawie pluginu który, znajdziesz pod adresem:

    https://github.com/testdotai/appium-classifier-plugin

Jak widzisz wygląda na to że oryginalnym przeznaczeniem jest użycie go z Appium, czyli na urządzeniach mobilnych, jednak ja spróbuje podpiąć je do testów na Desktopie - ponoć jest to możliwe. Co prawda jest już trochę narzędzi, które reklamują się użyciem AI do automatyzacji testów, jednak większość to coś przypominającego Selenium IDE na sterydach. Nareszcie coś dla mnie!

## Setup pluginu

Setup masz opisany powyżej w linku do gita, wygląda na to, że nie ma wersji na Windows, oto jak ja poradziłem sobie z tym po kolei na Mac-u.

Zainstalowałem wszystkie wymagane zależności używając tej komendy w terminalu. Oczywiście trzeba mieć już zainstalowane narzędzie _brew_:

    brew install pkg-config cairo pango libpng jpeg giflib

Następnie zainstalowałem plugin przy pomocy narzędzia npm, również w terminalu:

    npm install -g test-ai-classifier

Okazało się, że instalacja zakończyła się niepowodzeniem z błędem:

    No receipt for 'com.apple.pkg.CLTools_Executables' found at '/'.

    No receipt for 'com.apple.pkg.DeveloperToolsCLILeo' found at '/'.

    No receipt for 'com.apple.pkg.DeveloperToolsCLI' found at '/'.

Rozwiązaniem okazała się reinstalcja narzędzia xcode - uwaga to polecenie **USUWA**  katalog xcode-select więc używasz na własną odpowiedzialność:

    sudo rm -rf $(xcode-select -print-path)
    xcode-select --install

Następnie próbuje jeszcze raz uruchomić:

    npm install -g test-ai-classifier

Zakończona sukcesem! Niestety byłoby za pięknie, żeby to tak sobie po prostu zadziałało, po uruchomieniu w terminalu polecenia:

    test-ai-classifier 

Otrzymuje następujący błąd:

    Error: ENOENT: no such file or directory, open '/Users/marcinstanek/.nvm/versions/node/v12.14.1/lib/node_modules/test-ai-classifier/classifier-proto/classifier.proto'

Nie wiem, dlaczego ale pod podaną ścieżką nie ma pliku. Pogrzebałem w repo twórcy i po prostu utworzyłem go ręcznie. Kopiując to z tego linku:

    https://github.com/testdotai/classifier-proto/blob/990d9861f0368d06375b623bddb6b9c457bea807/classifier.proto

Jest też issue na githubie założone przeze mnie pod tym linkiem. Jak można przeczytać problem z brakującym plikiem został naprawiony:

    https://github.com/testdotai/appium-classifier-plugin/issues/29

No i ostatecznie serwer do klasyfikacji działa poprawnie!

    node-pre-gyp info ai-rpc Classification RPC server started on 0.0.0.0:50051

## Setup testów

Korzystam ze swojego boilerplate do testów automatycznych z Selenium WebDriver Java i Groovy, których możesz pobrać tutaj: [Selenium WebDriver Java - Groovy BoilerPlate](/selenium-webdriver-java-boilerplate). W projekcie znajdziesz README opisujące jak go uruchomić. Jest to projekt, który stworzyłem jeszcze w 2018, także nie możesz oczekiwać bardzo wiele. Jednak jest na tyle dobry, że mogę się nim podzielić. Pozwoli Ci bardzo szybko testować plugin, o to właśnie nam chodzi, prawda?

Kiedy mam już działający serwer do klasyfikacji i projekt z Selenium. Potrzebujemy jeszcze dodać klient, który pozwoli nam skonsumować funkcjonalność wystawioną przez serwer z poziomu kodu. Aktualnie dostępne są implementacje dla 4 różnych języków - czyli bardzo dobrze:

* [Java - tego będziemy potrzebować](https://github.com/testdotai/classifier-client-java)
* [Python](https://github.com/testdotai/classifier-client-python)
* [Node + WebdriverIO](https://github.com/testdotai/classifier-client-node)
* [Ruby](https://github.com/testdotai/classifier-client-ruby)

Po wejściu w repo zauważysz, że paczka nie jest wystawiona w maven central. Widocznie twórcy nie zamierzają ułatwiać. Na szczęście jest na to łatwy sposób, wchodzimy pod adres:

    https://jitpack.io

W input na top strony wklejamy adres repo:

    https://github.com/testdotai/classifier-client-java

W ten sposób mamy gotową paczkę do użycia. Następnie w już w projekcie z testami dodajemy wpisy do pom.xml - chodzi mi o ten w katalogu root. Musimy tylko dokleić do węzła _repositories_ wpis:

    <repository>
        <id>jitpack.io</id>
        <url>https://jitpack.io</url>
    </repository>

I do węzła _dependcies_:

    <dependency>
        <groupId>com.github.testdotai</groupId>
        <artifactId>classifier-client-java</artifactId>
        <version>v1.0.0</version>
    </dependency>

Oraz już w module _testframework_:

    <dependency>
        <groupId>com.github.testdotai</groupId>
        <artifactId>classifier-client-java</artifactId>
    </dependency>

W ten sposób, wreszcie, mamy wszystkie zależności. Przejdźmy do implementacji testu.

## Pierwszy test

Zaczynam od utworzenia pola i jej inicjalizacji _classifier_ w klasie _BaseSpec_

```
    import ai.test.classifier_client.ClassifierClient
    (...)

    @RetryOnFailure(times = 3)
    class BaseSpec extends Specification {
        (...)
        protected ClassifierClient classifier;

        def setup() {
          (...)
            setupClassifier()
          (...)
        }

        def cleanup() {
            driver.quit()
            if (classifier != null) {
                classifier.shutdown()
            }
        }

        (...)

        def setupClassifier(){
            classifier = new ClassifierClient("127.0.0.1", 50051);
        }

        (...)
    }
```


Najważniejszy fragment:

```
classifier = new ClassifierClient("127.0.0.1", 50051);
```


Adres i port podczas tworzenia obiektu należy użyć oczywiście ten sam wskazywany przez output na terminalu:

    node-pre-gyp info ai-rpc Classification RPC server started on 0.0.0.0:50051

Dodaję nowy plik o nazwie LoginSpec.groovy w katalogu:

    selenium-ai/tests/src/test/groovy/com/marcinstanek/seleniumjavaspockboilerplate/login/LoginSpec.groovy

Tworzę też nowy test:

```
import com.marcinstanek.seleniumjavaspockboilerplate.BaseSpec
import io.qameta.allure.Epic
import io.qameta.allure.Feature

@Epic("LoginSpec")
@Feature("LoginSpec")
class LoginSpec extends BaseSpec {
  def 'Open login page from home page'(){
    when: 'user click Sign in button'
    def els = classifier.findElementsMatchingLabel(driver, "Sign in")
    els.first().click()

    then: 'is redirected to /login'
    driver.currentUrl == 'http://localhost:4100/login'
  }
}
```

Test ma za zadanie znaleźć przycisk Sign in na stronie i go nacisnąć. Biblioteka którą zainstalowaliśmy udostępnia obiekt klasy ClassifierClient które z kolei udostępnia nam metodę findElementsMatchingLabel(driver, "Sign in"), do której należy przekazać obiekt implementujący interfejs IWebDriver oraz ciąg znaków reprezentujący obiekt, którego poszukujemy.

Popatrzmy na ten fragment:
```

def els = classifier.findElementsMatchingLabel(driver, "Sign in")
els.first().click()
```


Metoda zwraca nam listę obiektów klasy WebElement, które powinny wyglądać jak przycisk SignIn. Z otrzymanymi WebElementami możemy robić wszystko co zechcemy z tego typu obiektami. Ja po prostu wybieram pierwszy obiekt w liście i próbuję go nacisnąć.

Oto jak wygląda uruchomienie testu:

[uruchomienie testu](https://player.vimeo.com/video/384327914)

Jak można zauważyć test zakończył się niepowodzeniem. Przeanalizujmy jednak jak biblioteka próbuje poradzić sobie z problemem. Więc według twórców działa to w taki sposób. Klient klasyfikatora, zależność, którą dodaliśmy do projektu, uruchamia zapytanie XPath, które próbują znaleźć elementy na stronie. Następnie robi screenshoty tym elementom na stronie. Potem klient przesyła te zrzuty do serwera, to ta część uruchomiona w terminalu, przeprowadza klasyfikację obrazów i przesyła do klienta siłę klasyfikacji dla każdego z elementu. W tym momencie klient ma wszystkie dane, aby zmapować zapytania XPath i zwrócić te pasujące nam, jako których elementy poszukujemy. Niestety jak widać na video z uruchomienia, znaleziono 9 elementów jednak żaden z nich nie został dopasowany jako ten prawidłowy.

Ten test spisuję na straty, spróbuje z czymś innym. :)

## Drugi test

Okazuje się, że nie można wpisać dosłownie wszystkiego jako element wyszukiwany - to byłoby za piękne. Listę dostępnych słów kluczowych można znaleźć [tutaj](https://github.com/testdotai/appium-classifier-plugin/blob/master/lib/labels.js). Nie jest ona zbyt okazała jak na razie. Będę musiał więc dostawać test, aby użyć którejś z nich.

```
def 'User click settings link at home page'(){
    given: 'user is on the login page'
    driver.get(getConfig().url + 'login'
    when: 'email field has been filled'
    driver.findElement(By.xpath("//*[@data-cy='email-input']"))
            .sendKeys('marcin@marcin.pl')
    and: 'password field has been filled'
    driver.findElement(By.xpath("//*[@data-cy='password-input']"))
            .sendKeys('marcin')
    and: 'button clicked'
    driver.findElement(By.xpath("//*[@data-cy='button-input']"))
             .click()
    and: 'settings link clicked'
    def button = classifier.findElementsMatchingLabel(driver, "settings")
    button.first().click()

    then: 'user should be redirected to /settings'
    driver.currentUrl == 'http://localhost:4100/settings'
}
```


Jak widać pomieszałem tu style wyszukiwania elementów aby z powodzeniem się zalogować. W kontekście tematu wpisu interesują Nas te linijki kodu:

```
def button = classifier.findElementsMatchingLabel(driver, "settings")
button.first().click()
```


Sprawdźmy to!

{% include_relative videoVimeo.html video="https://player.vimeo.com/video/384340011" %}

Jak widać, test zakończył się powodzeniem. Element którego wyszukiwaliśmy za pomocą nowo dodanej biblioteki został znaleziony, a interakcja zakończyła się powodzeniem. Doskonale!

## Podsumowanie

Nowy sposób na wyszukiwanie elementów na stronie działa poprawnie, jednak jest dość bardzo ograniczony na ten moment. Na tym etapie instalacja jest problematyczna, co zdecydowanie jest minusem. Jednak kiedy mam już wszystko skonfigurowane używanie tej biblioteki jest bardzo proste. Prawdopodobnie migracja istniejących już testów na ten sposób wyszukiwania elementów byłaby w miarę prosta. Wydaje mi się, że należy obserwować rozwój tego projektu. Być może długo wyczekiwana rewolucja w obszarze testowania właśnie nadchodzi? :)

Kod można zobaczyć tutaj:

    https://github.com/12masta/selenium-ai/tree/selenium-ai

Changeset:

    https://github.com/12masta/selenium-ai/pull/1/files

