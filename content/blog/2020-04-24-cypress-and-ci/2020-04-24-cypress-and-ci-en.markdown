---
title:  Cypress and CI with Azure Devops
date:   2020-04-24 08:00:00 +0200
categories: [testautomation, cypress]
tags: [testautomation, cypress, en]
language: en
slug: en/cypress-8
ogimage: https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2020-04-13-cypress-and-ci%2Fpost_cover.png?alt=media&token=582925ff-bf77-4edb-96f7-341c5a06668d
ogimagetype: image/png
description: Discusses the integration of Cypress testing into Azure DevOps for continuous integration. It provides a step-by-step guide on configuring the CI pipeline in Azure DevOps, making necessary script adjustments, handling environment variables, and highlights the importance of testing in the CI process. Additionally, it emphasizes the ease of integration and the significance of applying testing to CI for testers. You can find the code on GitHub for reference.
---

## Cypress and Continuous Integration

In my opinion, we require a modern tester to do something more than just the correct creation of automated tests. One of the distinguishing attributes of modern QA engineers is the ability to independently manage the continuous integration process. In this post, I touch on the issue of connecting tests to the CI process. I am going to use the Azure DevOps platform - I will only run tests, without the deploy backend and frontend step, I have listed these components as a separate process not described in this material.

## AI-Powered User Story Analysis for Smarter Testing

Unlock the full potential of your software development process with our AI-driven tool! You will find it [here](https://defectzero.com/).

[![Defect zero](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/defect%20zero%2Fdefect-zero-min.png?alt=media&token=6ca28446-47df-4391-a5a7-a5d8ca7bd0e5)](https://defectzero.com/)

## Azure DevOps

The account is free. So to start our adventure with CI, we create an account and we can start working. On page:

    https://dev.azure.com

I am creating a new project as in the screenshot.

I go to the pipeline tab and click Create Pipeline. I choose my code repository, in my situation it's GitHub. Repository: _react-redux-realworld-example-app_ I'm selecting it. I need to grant the appropriate permissions, agree. Then I have to choose how to configure my pipeline. I run the tests using the _npm_ tool, so the suggestion to use preconfiguration for NodeJS seems accurate. So I choose the suggested setting. In the next step, the wizard offers me a configuration in the .yml file:

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

At this point, you should consider how I run the tests to properly define the necessary steps. Starting from the top of the file, in my case running tests only on the master branch is insufficient. I would like to run tests on every branch. I will achieve this by changing the _trigger_ section, which should look like this:

```
trigger:
  paths:
    include:
      - '*'
```

The Node 10.x version is correct, definitely sufficient, I leave this section unchanged. Before running the tests, I need to run _npm install_. To install all the necessary dependencies to run the tests. I'm replacing the existing _script_ section with:
```
- script:
    npm install
  displayName: 'Install dependecies'  
```

The next step is to validate the installation of Cypress. This can be achieved by using the _cypress verify_ command. I don't have this script in my repository yet. However, I know that I will run it with the npm script: _npm run cy: verify_. They add this section to the project.

```
- script:
    npm run cy:verify
  displayName: 'Cypress verify'
```

The next step is to run the tests. I usually run them with the command: _npx cypress run_. Here I am going to slightly change the convention. For consistency, I'm also going to use the npm script: _npm run cy: verify_

```
- script:
    npm run cy:run
  displayName: 'Execute cypress tests'
```

These are all the changes I need from Azure DevOps. I press Save and Run and I have the first stage of my work ready. The azure-pipelines.yml file looks like this:

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

I suspect, however, that these will not be enough changes. I know the tests are communicating with the on-premises environment that is not available on the Azure DevOps agent. My prediction comes true after starting the first build, it ends with an error.

    Bash exited with code '1'.

However, the tests started on the host:

    http://localhost:4100

Is not available. I am definitely pleasantly surprised by the clear error communication. In case of an error with the URL, I got the output:

```
Cypress could not verify that this server is running:

  > http://localhost:4100

We are verifying this server because it has been configured as your `baseUrl`.

Cypress automatically waits until your server is accessible before running tests.

We will try connecting to it 3 more times...
```

And in case of an API URL error:

```

We received this error at the network level:

  > Error: connect ECONNREFUSED 127.0.0.1:5000

-----------------------------------------------------------

The request we sent was:

Method: DELETE
URL: http://localhost:5000/users
```

You know immediately where the problem lies. For these purposes, I have deployed the application that I am testing to make it available on the web. It is a kind of shortcut for the purposes of writing a post. It is possible to set up tests in the deployment process of the entire application, I mean frontend and backend Conduit. However, I start with plugging in the tests only. However, I still need to make changes to the test project to adapt the project to the new requirements and the runtime environment.

I'm going to store urls in variables stored in Azure DevOps. They are simply environment variables, wrapped in functions on the CI. I have to take this into account when making changes to the code. It also turns out that I can't modify the _config_ object in Cypress anywhere I can think of. This is only possible through the plugin functions. So I edit the file: _cypress / plugins / index.js_ to the form:

```

module.exports = (on, config) => {
  config.baseUrl = process.env.BASE_URL || config.baseUrl;
  config.env.apiUrl = process.env.API_URL || config.env.apiUrl;
  (...)
  return config
}
```

I get the value of an environment variable using the _process.env.BASE_URL_ command. If it does not exist, I leave the default value. It is very important to remember to return the config object from the function. Without this item, this change will not work.

Then I need to add variables in Azure DevOps. I go to the Pipelines section, choose my pipe. I click Edit. In the top right corner I choose Variables. It adds two Variables that will allow me to set an address available on the network. I add them and save them from then on my pipeline works fine.

![azure devops environment variables](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2020-04-13-cypress-and-ci%2Fcypress-8-1.png?alt=media&token=32482f6d-483d-4e3a-b6c9-d613a035be69)

Dzięki integracji AzureDevOps przy każdym PR zostanie uruchomiony nasz pipeline, który może być wymagany na przykład do możliwości zmergowania zmian. Nie jest to domyślna konfiguracja, jednak jest to możliwe. Oznacza to, że możemy wymusić uruchomienie testów dla każdego PR, a sam proces uruchomienia testów został przed chwilą przeprowadzony.

![azure devops and github integration](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2020-04-13-cypress-and-ci%2Fcypress-8-2.png?alt=media&token=8fe77ccd-55d3-4207-a2d9-00bcd9686f2c)

## Summary

Running tests on Azure DevOps turned out to be a relatively simple task. Integration went relatively smoothly. It's worth remembering to return the _config_ object in the Cypress plug-in, I forgot to do this and wasted a lot of time doing it. :) Besides, I am very happy with the effect. I think every tester should apply their tests to CI as soon as possible. The platform is of secondary importance in my opinion.

The code can be seen here:

    https://github.com/12masta/react-redux-realworld-example-app/tree/8-cypress

