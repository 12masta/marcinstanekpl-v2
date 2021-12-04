---
layout: post
title:  "Wiadomość Slack z wynikami testów po zakończonym procesie budowania na CI"
date:   2020-09-26 08:00:00 +0200
categories: [testautomation, cypress, ci, azuredevops]
tags: [testautomation, cypress, ci, azuredevops, pl]
permalink: /azure-devops-1
ogimage:
  - https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/azure-devops-1%2Fazure-devops-1.png?alt=media&token=794b4f9e-d113-4b78-a514-9f72082fd643
ogimagetype:
  - image/png
ogdescription:
  - Raport z testów na Slacku, automatycznie.
---

## Raport z testów na Slacku - automatycznie

Wysyłanie wiadomości na Slacka z rezultatem przeprowadzonych testów automatycznych po skończonym buildzie na serwerze CI dało mi bardzo dużo wartości. Mechanizm ten ułatwia dostęp do raportów z testów dla całego zespołu. Zachęca do głębszej analizy testów. Do tego, dodatkowa analityka jest bardzo pomocna w wykrywaniu niestabilnych testów, tj. flaky tests. Przeczytaj jak to osiągnąć.

Poprzedni post znajdziesz tutaj: [Raportowanie testów Cypress w Azure DevOps]({% post_url 2020-04-29-publishing-test-results-azure-devops %})

{% include_relative leadmagnet-selenium-homework.markdown %}

## Jak to osiągnąć?
   
   Szczegóły stworzenia takiego narzędzia zależą od infrastruktury, którą mamy zbudowaną wokół kodu tj. stosu technologicznego oraz narzędzi CI, z jakich korzystamy. W moim przypadku używam z Azure DevOps, ma on np. wbudowane wtyczki umożliwiające wysyłanie wiadomości poprzez wypełnienie pól w interfejsie graficznym. Ja wykorzystam bardziej uniwersalny sposób jednak wymagający odrobiny więcej umiejętności technicznych.

Rozwiązanie opiera się na API Slack, Webhooks i skryptu Powershell. Jest to bardzo dobrze opisane w dokumentacji Slacka: 

    https://api.slack.com/messaging/webhooks

Potrzebujemy webhook URL, aby móc kontynuować, sekcja "Create an Incoming Webhook". Następnym krokiem jest konsumpcja API również opisana w dokumentacji pod linkiem podanym powyżej. Aby połączyć te wszystkie elementy wykorzystam skrypt Powershell:

{% highlight powershell %}
function SendSlackTestReport {
    param (    
        [Parameter(Mandatory = $true, Position = 1)]$Url
    )
    $nl = [Environment]::NewLine
    $icon = $env:E2E_RESULTS_ICON
    $buildid = $env:BUILD_BUILDID
    $testresultslink = "https://dev.azure.com/marcinstanekpl/Conduit%20e2e%20tests/_build/results?buildId=$buildid&view=ms.vss-test-web.build-test-results-tab"
    $pipelinepassratelink = "https://dev.azure.com/marcinstanekpl/Conduit%20e2e%20tests/_pipeline/analytics/stageawareoutcome?definitionId=1&contextType=build"
    $testpassrate = "https://dev.azure.com/marcinstanekpl/Conduit%20e2e%20tests/_test/analytics?definitionId=1&contextType=build"
    $pipelineduration = "https://dev.azure.com/marcinstanekpl/Conduit%20e2e%20tests/_pipeline/analytics/duration?definitionId=1&contextType=build"

    $payload = @{
        "icon_emoji"  = "$icon"	
        "username"    = "Test reporter"
        "attachments" = @(
            @{
                "text"   = "*<$testresultslink|E2e test results $result>* $nl BuildId: $buildid $nl $nl Test results: $testresultslink $nl $nl Pipeline pass rate: $pipelinepassratelink $nl $nl Test pass rate: $testpassrate $nl $nl Pipeline duration: $pipelineduration"
                "footer" = "Message from Azure DevOps"
            }
        )
    }

    Write-Host "Payload:"
    Write-Host (ConvertTo-Json $payload)

    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-RestMethod -Uri $Url -Method Post -Body (ConvertTo-Json -Compress -InputObject $payload) ` -ContentType "application/json"
}

Write-Host "Sending slack message for BUILD: $($env:BUILD_BUILDID)"

SendSlackTestReport $($env:WEBHOOK_URL)
{% endhighlight %}

## Logika biznesowa
   
   Logika biznesowa skryptu jest bardzo prosta. Tworzymy funkcję SendSlackTestReport odpowiedzialną za wysłanie raportu. Następnie definiuję zmienną _nl_ która ułatwia tworzenie nowych linii. _icon_, pobiera emotikonę ze zmiennej środowiskowej E2E_RESULTS_ICON. _buildid_ pobiera wartość zmiennej środowiskowej BUILD_BUILDID która przechowuję buildId z infrastruktury Azure DevOps. _testresultslink_ link do raportów z testów, podmiana buildId w linku zapewnia, że zawsze trafiamy z wiadomości Slack do dobrego raportu. Ta sama sytuacja zachodzi dla zmiennych _pipelinepassratelink_, _testpassrate_ i _pipelineduration_.
   
   Zmienna _payload_ jak sama nazwa wskazuję przechowuję wiadomość, która zostanie wysłana do API. Musi ona zachować odpowiedni kontrakt, opisany w linku do API Slacka. Po tych operacjach wypisuję na ekran payload wiadomości w celach ewentualnej sesji debugowania na środowisku CI. Ostatecznie wysyłam zbudowaną w ten sposób wiadomość wykorzystująć payload oraz URL, który pobrałem ze zmiennej środowiskowej WEBHOOK_URL.

## Azure DevOps

Krok w azure-pipelines.yml wygląda następująco:

{% highlight powershell %}
- task: PowerShell@2
  inputs:
    filePath: 'devops/slack-message.ps1'
  displayName: 'Send Slack message with link to test report' 
  condition: always()
{% endhighlight %}

Jak widać skrypt powershell jest umieszczony w repozytorium projektu w katalogu devops. W ten sposób narzędzia CI wiedzą jaki skrypt uruchomić. Dodałem również sekcje condition, która spowoduję, że krok uruchomi się zawsze niezależnie od rezultatu testów.

## Podsumowanie

W ten właśnie sposób osiągnąłem efekt monitoringu testów automatycznych na platformie Slack. Sposób ten jest dość uniwersalny. Pozwala zastosować skrypt w każdym miejscu wspierającym Powershell. Znacznie zwiększa on jakość testów automatycznych oraz skłania zespół do częstszej analizy wyników testów wykonywanych na serwerze CI we wcześniejszych zaplanowanych porach czy też, kiedy wykonują się automatycznie po stworzeniu PR do kodu.

{% include_relative leadmagnet.markdown %}
