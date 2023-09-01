---
title: Polityka ponawiania dla metod w przypadku testów integracyjnych
date: 2021-07-01 08:00:00 +0200
categories: [testautomation, .net, polly]
tags: [testautomation, .net, polly, pl]
language: pl
slug: dotnet-polly
ogImage: https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2021-07-01-retry-policy-in-test-methods%2FRetry%20policy%20for%20methods%20in%20terms%20of%20integration%20tests.png?alt=media&token=e5a5db4b-7f5b-4ffb-94fa-9d22751f79f6
ogImageType: image/png
description: Wykorzystanie biblioteki Polly do implementacji polityki ponawiania prób w testach integracyjnych w projektach .NET w celu uwzględnienia warunków wyścigu i zwiększenia stabilności testów. Autor podaje przykład zastosowania logiki ponawiania prób do metod interakcji z bazą danych i podkreśla znaczenie dokładnego zdefiniowania ram czasowych dla optymalnego wykonania testu.
---

## Polityka ponawiania

Podczas kilku implementacji testów w projektach opartych na .NET, bardzo często zmagałem się ze zjawiskiem _race conditions_ między metodami, które próbują pobrać jakiś stan z bazy danych, aby dokonać na nim pewnych asercji. Bardzo często jest to punkt niepowodzenia, który sprawia, że ​​testy integracyjne są niepewne tzw. flaky tests.

Poprzedni post znajdziesz tutaj: [Biblioteka .NET Testcontainers, infrastruktura dla testów
](/2021-04-14-testcontainers/2021-04-14-testcontainers/)


Widziałem implementację biblioteki Polly w przypadku, gdy jako zespół próbowaliśmy wykorzystać API stron trzecich w celu zwiększenia odporności. Postanowiłem spróbować tego samego w testach pod kątem metod, które pobierają niektóre dane z bazy danych. Rozwiązanie wygląda obiecująco, naprawia już pewne problemy w projekcie, nad którym aktualnie pracuję.
 
Tak może wyglądać kod:

```
public string Id { get; set; }
public EntitiesDatabaseLoader Entities { get; set; }

(...) // some piece of code arround

return Policy.HandleResult<Entity>(r => r == null)
       .WaitAndRetry(new[]
       {
         TimeSpan.FromSeconds(1),
         TimeSpan.FromSeconds(2),
         TimeSpan.FromSeconds(3)
       })
       .Execute(() => Entities.Load(Id));
```

_HandleResult_ metoda odpowiada za obsługę zachowania zdefiniowanego jako przekazany do niej argument.

_WaitAndRetry_ metoda definiuje określony czas trwania między każdą ponowną próbą.

_Execute_ metoda to po prostu kawałek kodu, który chcemy powtórzyć w przypadku błędnego zachowania, który właśnie zdefiniowaliśmy.

Takich możliwości jest więcej zdefiniowanych w dokumentacji biblioteki.

## Podsumowanie

Dzięki takiemu podejściu możemy tworzyć znacznie stabilniejsze testy. Tworząc politykę Wait and Retry powinniśmy mądrze określić ramy czasowe, aby pasowały również do negatywnych przypadków testowych. W przeciwnym przypadku wykonanie takich przypadków będzie trwać za długo właśnie ze względu na politykę którą właśnie stworzyliśmy.

Link do biblioteki: [https://github.com/App-vNext/Polly](https://github.com/App-vNext/Polly) 

