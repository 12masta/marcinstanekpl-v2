---
title: Jak zespoły piszą testy i co o tym myślę cz. 1 
date: 2022-09-15 08:00:00 +0200
categories: [testautomation, process, test-process]
tags: [testautomation, process, test-process, pl]
slug: who-should-write-the-tests-part-1 
language: pl 
ogImage: https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/who-should-write-the-tests-part-1%2Fbusiness-team-meeting-boardroom-min.jpg?alt=media&token=e1f0adbd-3583-4f68-ab96-19f2d278ee67 
ogImageType: image/jpg
---

## Awans testera na osobę odpowiedzialną za rozwój testów

Większość z nas ma już jakieś przeświadczenia lub wyrobione zdanie na te temat, również łącznie ze mną. Postanowiłem
jednak napisać ten post, aby podsumować swoją wiedzę i sprawdzić, czy moje założenia są jeszcze poprawne.

Czasami testerzy manualni lub inne osoby postanawiają wpłynąć na swoją przyszłość i przekonują swojego szefa, lidera lub
kogokolwiek odpowiedzialnego za tą część, że mogą zacząć automatyzować. Aby było jasne, nie ma nic złego w chęci zmiany,
jak najbardziej popieram takie inicjatywy. Uważam jednak, mając świadomość, że istnieją od tej zasady wyjątki, że
niektórzy z tych osób mogą być członkami zespołu automatyzującego, zazwyczaj jednak nie są to odpowiednie osoby do
budowania fundamentów testów w organizacji. Na początku taki zespół dokona znacznego progresu, jednak poziom
skomplikowania, problemy z utrzymaniem i konserwacją rosną z czasem. Następnie zaś narastające problemy prowadzą do
utraty miarodajności testów.

Niejednokrotnie podczas pisania testów automatycznych napotykamy się na problemy, które nie występują z jasnego powodu.
Mogą to być niedeterministyczne wyniki testów, problemy na serwerze CI, a co za tym idzie problemy z siecią,
uprawnieniami oraz wiele innych. W takiej sytuacji można najpierw obwinić narzędzie, sieć lub pomyśleć, że mamy gorszy
dzień i spróbować ponownie uruchomić test. Ewentualnie, może to być problem z timingiem operacji. W każdej takiej
sytuacji czas naprawy przedłuża się, a przyczyna nie jest do końca znana. Wkrótce, poza faktem, że testy będą powolne,
ich stabilność ulegnie pogorszeniu i trudno będzie określić pierwotną przyczynę niepowodzeń. W tym przypadku tracimy
wartość, jaką powinieneś zyskać dzięki automatyzacji testów, ponieważ ani QA, ani programiści nie mogą stwierdzić, czy
awaria jest błędem w produkcie, czy w automatyzacji. Prowadzi to do utraty zaufania w wyniki testów.

Kolejnym problemem, którego często dotyka tę grupę, jest dzielenie obowiązków pomiędzy automatyzację i testy manualne.
Poświęcanie określonego procentu swojej pracy na jedną czynność, a drugiej części na inną, prawie nigdy nie jest
praktyczne. Ponadto bardzo ciężko to zmierzyć, aby rzeczywiście mieć nad tym kontrolę. Automatyzacja to nie tylko
pisanie testów. Absolutne minimum to sprawdzanie ich wyników. A co jeżeli wynik testów jest negatywny? Musimy się nimi
zająć. W ten sposób działamy bardzo nie wydajnie, zmieniając co chwile kontekst wykonywanej pracy.

## Podsumowanie

Osoby z pewną wiedzą na temat programowania, czy bez doświadczenia w automatyzacji mogą stać się w tym skuteczni, ale
potrzebuję lidera w tym zakresie. Potrzeba czasu, pracy i poświęcenia, aby stać się w tym dobrym i dlatego nie można
tego zrobić na boku.