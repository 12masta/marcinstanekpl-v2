---
title:  Proces testowy, do którego dążę w projektach, nad którymi pracuję
date:   2019-12-08 08:00:00 +0200
categories: [testautomation, process, test-process]
tags: [testautomation, process, test-process, pl]
slug: test-process-1
ogimage: https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-12-08-how-tests-process-should-looks-liks%2Fblog_post-cover.png?alt=media&token=b090c220-e684-4cb3-96f9-99e2f374c1cb
ogimagetype: image/png
language: pl
---

## Wstęp

Miałem ostatnio okazję zastanowić się nad tym, jak wyobrażam sobie idealny proces testowy. Jak każdy mam swoje przemyślenia i opinie na ten temat, pewnie lepsze lub gorsze. Stwierdziłem, że muszę je usystematyzować. Zapraszam do czytania i komentowania. :)

Poprzedni post znajdziesz tutaj: [Cypress i poprawne użycie selektorów, atrybut data-cy](/cypress-5)

## Podstawa

Osobiście uważam, że:

_Głównym aspektem budowania jakości w projekcie jest szybki feedback dotyczący zmian w kodzie aplikacji_.

Tradycyjny model wytwarzania oprogramowania jest odwrotnością zdania, które napisałem powyżej. Zespoły kiedyś, a często nawet dzisiaj, korzystały z manualnych metod weryfikacji oprogramowania. Testy zaczynały się dopiero po fazie wytwarzania oprogramowania rozumianego poprzez programowania aplikacji przez programistów. To podejście ma kilka minusów:

* manualna regresja jest czasochłonna i kosztowna. W konsekwencji oznacza to, że ten krok staje się wąskim gardłem w procesie
* manualne testowanie nie jest wiarygodne z prostego powodu - ludzie są słabi w powtarzalnych zadaniach, takie jak wyżej wspomniane testy regresji
* ciężko jest przewidzieć zmiany w kompleksowym systemie, przez co wręcz niemożliwym jest odpowiednie wycelowanie testami manualnymi, które odbędą się w rozsądnym czasie, w obszary, które mogły ulec zmianie
* utrzymanie dokumentacji, które jest wymagane dla odpowiedniego przeprowadzenia testów manualnych jest ciężkie w wykonaniu w rozsądnym terminie, a praktycznie niemożliwe po pewnym czasie i po osiągnięciu pewnego rozmiaru wielkości projektu. Nawet jeśli uda Ci się to zrobić, czy nie lepiej w tym czasie testować lub dbać o jakość w innych obszarach?

## Jak automatyzować

Po przeczytaniu pierwszego akapitu można ulec wrażeniu, że jestem przeciwko testowaniu manualnemu. Nic z tych rzeczy, jestem zdania, że ludzie powinni się skupić na tym, w czym są najlepsi - kreatywną pracą. Powtarzalną pracę zostawmy dla robotów. Dlatego też, aby skutecznie wdrożyć automatyzację musimy rozwijać testy automatyczne, jak i również te manualne.

Testy automatyczne powinny zawierać:

* Testy jednostkowe - sprawdzają pojedyncze moduły kodu, metody, funkcje, klasy w izolacji. Zapewniają również wysoką testowalność kodu. Bez tego elementu testowanie na wyższych poziomach staję się niezwykle utrudnione i pozostawia nam jedynie scenariusze pełnego end to end.
* Testy akceptacyjne - weryfikują działanie aplikacji jako całość. Zapewniają, że funkcje na wyższym poziomie działają prawidłowo oraz że nie wprowadzono defektów w funkcje, które do tej pory działały prawidłowo. Dla przykładu tego typu testu sprawdzą, czy API działa poprawnie z perspektywy jego potencjalnego konsumenta. Powinny być również pisane jako część developmentu, to oznacza, że pracę deweloperskie nie zostały zakończone, dopóki testy akceptacyjne nie zostały zaliczone.

Poniższy diagram pokazuje jak wyobrażam sobie idealny rozkłąd testów automtycznych i manualnych. Diagram inspirowany: [autorem oryginalnego diagramu](http://www.exampler.com/old-blog/2003/08/22/#agile-testing-project-2)
 i [książką](https://books.google.pl/books/about/Agile_Testing.html?id=68_lhPvoKS8C&redir_esc=y).

![automation-diagram](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-12-08-how-tests-process-should-looks-liks%2Fwykres.png?alt=media&token=118b6508-5354-4602-af07-fa9f49911954){:alt="automation-diagram"}

Testy automatyczne z tego wykresu doskonale pasują również do procesów Continuous Delivery. Co to oznacza? Każda zmiana w kodzie powoduje uruchomienie procesu budowania aplikacji, tworzenia paczek, uruchomienie testów jednostkowych i uruchomienia procesów statycznej analizy. Po tej pierwszej fazie zostają odpalone testy, które potrzebują więcej czasu na ich wykonanie, tj. testy akceptacyjne. Tego typu build powinien być już gotowy na wykonanie testów eksploracyjnych czy też innej manualnej kontroli jakości, jeżeli przeszedł poprawnie wcześniejsze fazy oczywiście. Kiedy zakończono manualną kontrolę uznajemy tak utworzona paczkę jako gotową do wydania z technologicznego punktu widzenia.

Tego typu proces zapewnia szybki feedback dotyczący jakości kodu zespołowi deweloperskiemu, krótki czas od utworzenia kodu do możliwości jego wydania i niski poziom defektów na środowisku produkcyjnym. Zespół ma większość swojej pracy zwalidowanej w przeciągu minut, zamiast godzin lub też dni. Co umożliwia poprawiać defekty tak szybko, jak je wprowadzono.

Co z tego wynika? Każda zmiana tworzy software, potencjalnie gotowy do wydania, a pętla sprzężenia zwrotnego pozwala wychwycić problemy tak wcześnie, jak to tylko możliwe. Kiedy paczka dociera do końca procesu, a zespół nie czuję się komfortowo z jej wydaniem lub zostają odkryte defekty w środowisku produkcyjnym należy ulepszyć proces, np. poprzez rozszerzenie lub aktualizacje testów. Aktualizacja scenariuszy powinna odbyć się na tak niskim poziomie, jak to tylko możliwe.

## Jak usprawniać automatyzację

Jeżeli jeszcze nie masz testów zaimplementowanych w swoim procesie zacznij od MVP, szkieletu od którego rozpoczniesz budowę. Dla przykładu możesz utworzyć pojedynczy test jednostkowy, test akceptacyjny i zautomatyzowany skrypt, który spowoduje utworzenie gotowego środowiska dla testów eksploracyjnych. Następnie przyrostowo zwiększaj poziom pokrycia testami i rozwijaj proces CD.

Jako zespół musicie podążać podejściem TDD lub chociaż mieć pewność, że testy jednostkowe są pisane. Zapewnia to wysoką jakość kodu oraz ułatwia automatyzację na wyższych poziomach, np. pozwala zaślepiać komunikację z zewnętrznymi niezależnymi od nas serwisami na potrzeby przeprowadzenia kontroli jakości w środowisku, które zapewni powtarzalność wyników.

W przypadku kiedy zarządzasz zestawem testów, który jest ciężki do utrzymania i nie możesz ufać jego wynikom, nie bój się usuwać z niego przypadków testowych. Zestaw 10 świetnej jakości testów, na który wszyscy mogą liczyć, jest o wiele lepszy niż zestaw 200 czy 300 testów, którym rezultatom nikt nie ufa, a Ty musisz walczyć o niego z programistami.

W każdym z tych wypadków zapewnij wspólną pracę programistów i testerów od jak najwcześniejszego momentu w procesie wytwarzania oprogramowania jako część jednego całego zespołu deweloperskiego, zamiast zaczynać testowanie, dopiero kiedy praca programistów wygląda na wykonaną. Tyczy się to również zwinnych zespołów, gdzie kolumna _Ready for QA_ na _scrum boardzie_ jest doskonałą wymówką na odwlekanie testowania aż zadanie pojawi się właśnie w tym miejscu. Programiści i testerzy powinni również wspólnie rozbudowywać zestaw testów akceptacyjnych, nie zostawiaj tej pracy jednie dla testerów automatyzujących. Z drugiej zaś strony, kiedy test akceptacyjny z jakiegoś powodu nie zostanie, poprawnie, zaliczony, dopisz test jednostkowy, który pozwoli szybciej wykryć ten sam defekt w przyszłości.

## Podsumowanie

Tak właśnie rozpoczynam kolejną serię postów dotyczących procesu automatyzacji testów z wyższej perspektywy. Nie oznacza to też końca postów dotyczących narzędzi do automatyzacji testów.
W ten oto sposób wyobrażam sobie poprawne procesy dotyczących automatyzacji testów. Moje podejście jest mocno inspirowane tym, co opisuje Google w [tym dokumencie](https://cloud.google.com/solutions/devops/devops-tech-test-automation). Dodałem do tego moje przemyślenia i tak oto powstał ten post, który definiuję moją drogę Inżyniera kontroli jakości w kontekście automatyzacji testów.
