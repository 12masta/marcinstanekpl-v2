---
layout: post
title:  "Slack message with test results after the CI build process is complete"
date:   2020-09-26 08:00:00 +0200
categories: [testautomation, cypress, ci, azuredevops]
tags: [testautomation, cypress, ci, azuredevops, en]
permalink: /en/azure-devops-1
ogimage:
  - https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/azure-devops-1%2Fazure-devops-1.png?alt=media&token=794b4f9e-d113-4b78-a514-9f72082fd643
ogimagetype:
  - image/png
ogdescription:
  - Report from the tests on Slack, automatically
---

## Context

Sending messages to Slack with the results of automated tests after the build on the CI server gave me a lot of value. This mechanism facilitates access to test reports for the entire team. It encourages a deeper analysis of the tests. Moreover, additional analytics are very helpful in detecting flaky tests. Read how to achieve it.

{% include_relative subForm-en.markdown %}


## How to achieve it?
   
The details of creating such a tool depend on the infrastructure we have built around the code, i.e. the technological stack and the CI tools we use. In my case, I use Azure DevOps, it has, for example, built-in plugins that allow you to send messages by filling in the fields in the graphical interface. I will use a more universal method, but requiring a bit more technical skills.

The solution is based on the Slack API, Webhooks and Powershell script. This is very well documented in the Slack documentation:

    https://api.slack.com/messaging/webhooks

We need a webhook URL to be able to continue with the "Create an Incoming Webhook" section. The next step is API consumption, also described in the documentation at the link provided above. To combine all these elements I will use a Powershell script:

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

## Busniess logic
   
The business logic of the script is very simple. We create the SendSlackTestReport function responsible for sending the report. Then I define a variable _nl_ which makes it easy to create new lines. _icon_, gets the emoticon from the E2E_RESULTS_ICON environment variable. _buildid_ gets the value of the BUILD_BUILDID environment variable that stores the buildId from the Azure DevOps infrastructure. _testresultslink_ link to test reports, replacing buildId in the link ensures that we always hit a good report from Slack news. The same is true for the _pipelinepassratelink_, _testpassrate_, and _pipelineduration_ variables.
   
The _payload_ variable, as the name suggests, stores the message that will be sent to the API. It must keep the appropriate contract, described in the link to Slack's API. After these operations, I write messages to the payload screen for the purpose of a possible debugging session in the CI environment. Finally, I send the message built this way using the payload and the URL that I downloaded from the WEBHOOK_URL environment variable.

## Azure DevOps

The step in azure-pipelines.yml looks like this:

{% highlight powershell %}
- task: PowerShell@2
  inputs:
    filePath: 'devops/slack-message.ps1'
  displayName: 'Send Slack message with link to test report' 
  condition: always()
{% endhighlight %}

As you can see, the powershell script is located in the project's repository in the devops directory. This way, CI tools know what script to run. I also added a condition section which will cause the step to run always regardless of the test result.

## Summary

This is how I achieved the effect of monitoring automated tests on the Slack platform. This method is quite universal. It allows you to apply the script in any place supporting Powershell. It significantly increases the quality of automated tests and prompts the team to more often analyze the results of tests performed on the CI server at earlier scheduled times or when they are performed automatically after creating a PR to the code.

{% include_relative leadmagnet-en.markdown %}
