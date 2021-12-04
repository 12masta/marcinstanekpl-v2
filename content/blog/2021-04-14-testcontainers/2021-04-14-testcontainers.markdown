---
layout: post
title:  "Biblioteka .NET Testcontainers, infrastruktura dla testów"
date:   2021-04-14 08:00:00 +0200
categories: [testautomation, testcontainers, docker]
tags: [testautomation, testcontainers, ci, docker, azuredevops, pl]
permalink: /testcontainers-1
ogimage:
  - https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2021-04-14-testcontainers%2Flogo.png?alt=media&token=e5c98b5b-5b66-4047-9ac9-e67130825b1a
ogimagetype:
  - image/png
ogdescription:
  - Zarządzania kontenerami w kontekście testów z poziomu kodu.
---

## Testcontainers

Od dawna zmierzam się z problemem zarządzania ciężkich zależności takich jak np. bazy danych podczas tworzenia testów integracyjnych. Gdzie je postawić? W Jaki sposób? Jak zapewnić odpowiedni flow, aby proces był odpowiednio lekki na środowisku lokalnym, jak i na CI. Nie ma łatwej odpowiedzi na to pytanie.

Zainteresowała mnie biblioteka [TestContainers](https://github.com/HofmeisterAn/dotnet-testcontainers)
Służy do zarządzania kontenerami w kontekście testów. Powinna ona nam umożliwić uruchomienie części infrastruktury, które są wymagane na potrzeby testów z poziomu kodu. Wydaję się, że może rozwiązać mój problem. Biblioteka umożliwia użycie predefiniowanych kontenerów lub innych, customowych obrazów.

W moim przypadku najczęściej potrzebuję bazy MSSQL, jeżeli chcę przeprowadzić testy z zapisem do bazy danych. Dlatego w tym poście spróbuję uruchomić taki kontener z sewerem MSSQL w kontekście testu. Obraz taki znajduję się w predefiniwoanej kolekcji, dlatego zadanie wydaję się proste.

Poprzedni post znajdziesz tutaj: [Wiadomość Slack z wynikami testów po zakończonym procesie budowania na CI
]({% post_url 2020-09-26-sending-slack-message-after-test-execution-on-ci %})

## Tworzenie nowego projektu .NET
Tworzę nowy projekt z testami Xunit

{% highlight javascript %}
$ mkdir TestContainersXUnitExample
$ cd TestContainersXUnitExample
$ dotnet new xunit
{% endhighlight %}

Następnie dodaję NuGet DotNet.Testcontainers:

{% highlight javascript %}
$ dotnet add package DotNet.Testcontainers
{% endhighlight %}

Oraz zależności związane z samą bazą danych:

{% highlight javascript %}
dotnet add package System.Data.SqlClient
{% endhighlight %}

W ten sposób mam gotowe środowisko, na którym mogę rozpocząć pracę.

Otwieram projekt i istniejącą już klasę testową. Rozkręcenie takiej instancji okazuję się niezwykle proste. Oto całość testu

{% highlight csharp %}
[Fact]
public async Task InitContainerTest()
{
    var testcontainersBuilder = new TestcontainersBuilder<MsSqlTestcontainer>()
        .WithDatabase(new MsSqlTestcontainerConfiguration
        {
            Password = "yourStrong(!)Password123",
        });

    await using (var testcontainer = testcontainersBuilder.Build())
    {
        await testcontainer.StartAsync();

        await using (var connection = new SqlConnection(testcontainer.ConnectionString))
        {
            connection.Open();

            await using (var cmd = new SqlCommand())
            {
                cmd.Connection = connection;
                cmd.CommandText = "SELECT 1";
                cmd.ExecuteReader();
            }
        }
    }
}
{% endhighlight %}

Changeset na githubie:

    https://github.com/12masta/TestContainersXUnitExample/pull/1/files

## Wnioski
Jak widać, uruchomienie takiej bazy danych jest bardzo prostym zadaniem. Pierwsze uruchomienie testu trwa dosyć długo. W moim przypadku około 3 minut. Na już rozgrzanym środowisku trwa to już 10 sekund, należy jednak wziąć pod uwagę, że możemy rozkręcić instancję, a potem jej reużyć dla więcej niż jednego testu. Dlatego też podejrzewam, że dla większego zestawu testów wynik ten nie będzie problemem.

Na horyzoncie pojawia się też problem utworzenia bardziej skomplikowanego setupu z odtworzeniem backupu lub predefiniowanego obrazu z gotowym backupem bazy danych do przeprowadzenia testu. Poruszę ten problem w następnym poście dotyczącego tego narzędzia.

{% include leadmagnet-selenium-homework.markdown %}
