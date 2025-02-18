---
title:  AI for Selenium WebDriver
date:   2020-01-10 08:00:00 +0200
categories: [testautomation, selenium, AI]
tags: [testautomation, selenium, AI, en]
slug: en/selenium-ai-1
ogimage: https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2020-01-10-selenium-with-ai%2Fcover.png?alt=media&token=8e0ffe7a-9075-45dc-a0ab-a942981dbd18
ogimagetype: image/png
language: en
description: The author discusses the implementation of artificial intelligence in Selenium WebDriver test automation, specifically utilizing the test-ai-classifier plugin. They encounter challenges during installation, ultimately achieving success. While the AI-based element recognition shows promise, it currently has limited functionality, and the project's development holds potential for the future of testing.
---

## Introduction

I recently read about a way to use artificial intelligence to replace regular placeholders in Selenium WebDriver. I can't wait to test this solution so I'm getting to work!

You can find the previous post here: [Proces testowy, do którego dążę w projektach, nad którymi pracuję](/en/test-process-1)

## AI-Powered User Story Analysis for Smarter Testing

Unlock the full potential of your software development process with our AI-driven tool! You will find it [here](https://defectzero.com/).

[![Defect zero](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/defect%20zero%2Fdefect-zero-min.png?alt=media&token=6ca28446-47df-4391-a5a7-a5d8ca7bd0e5)](https://defectzero.com/)

## Setup of the application to be tested

I'm going to test the app you already know from the series on Cypress. Its setup is described in this post: [Environment preparation](/en/cypress-0)

## But how!

The solution is built on a plugin which you can find at the following address:

    https://github.com/testdotai/appium-classifier-plugin

As you can see, it seems that the original purpose is to use it with Appium, ie on mobile devices, but I will try to hook it up to testing on the Desktop - supposedly it is possible. Admittedly, there are already some tools that advertise the use of AI for test automation, but most of them resemble Selenium IDE on steroids. Finally something for me!

## Plugin Setup

You have the setup described above in the git link, it looks like there is no Windows version, here is how I handled it one step at a time on a Mac.

I installed all the required dependencies using this command in the terminal. Of course you need to have the _brew_ tool already installed:

    brew install pkg-config cairo pango libpng jpeg giflib

I then installed the plugin using the npm tool, also in the terminal:

    npm install -g test-ai-classifier

It turned out that the installation failed with an error:

    No receipt for 'com.apple.pkg.CLTools_Executables' found at '/'.

    No receipt for 'com.apple.pkg.DeveloperToolsCLILeo' found at '/'.

    No receipt for 'com.apple.pkg.DeveloperToolsCLI' found at '/'.

The solution turned out to be reinstalling the xcode tool - note this command removes the xcode-select directory so you use at your own risk:

    sudo rm -rf $(xcode-select -print-path)
    xcode-select --install

It then tries to run again:

    npm install -g test-ai-classifier

Completed successfully! Unfortunately it would be too beautiful for this to just work, after running the command in the terminal:

    test-ai-classifier 

It receives the following error:

    Error: ENOENT: no such file or directory, open '/Users/marcinstanek/.nvm/versions/node/v12.14.1/lib/node_modules/test-ai-classifier/classifier-proto/classifier.proto'

I don't know why but there is no file under the given path. I poked around in the developer repo and just created it manually. By copying it from this link:

    https://github.com/testdotai/classifier-proto/blob/990d9861f0368d06375b623bddb6b9c457bea807/classifier.proto

There is also an issue on github set up by me at this link. As you can read the issue with the missing file has been fixed:

    https://github.com/testdotai/appium-classifier-plugin/issues/29

Well, and finally the grading server is working properly!

    node-pre-gyp info ai-rpc Classification RPC server started on 0.0.0.0:50051

## Test Setup

I use my boilerplate for automated testing with Selenium WebDriver Java and Groovy, which you can download here: [Selenium WebDriver Java - Groovy BoilerPlate](/selenium-webdriver-java-boilerplate). In the project you will find a README describing how to run it. This is a project I created back in 2018, also you can't expect very much. However, it is good enough for me to share it. It will allow you to test the plugin very quickly, which is what we want, right?

Once I have a working server for classification and a project with Selenium. We still need to add a client that allows us to consume the functionality exposed by the server from within the code. Currently there are implementations for 4 different languages - which is very good:

* [Java - that's what we're going to need](https://github.com/testdotai/classifier-client-java)
* [Python](https://github.com/testdotai/classifier-client-python)
* [Node + WebdriverIO](https://github.com/testdotai/classifier-client-node)
* [Ruby](https://github.com/testdotai/classifier-client-ruby)

Upon entering the repo, you will notice that the package is not exposed in maven central. Apparently, the developers are not going to make it easy. Fortunately there is an easy way to do this, go to the address:

    https://jitpack.io

In the input at the top of the page, paste the repo address:

    https://github.com/testdotai/classifier-client-java

This way we have a ready to use package. Next, in the project with tests we add entries to pom.xml - I mean the one in the root directory. We just have to add an entry to the _repositories_ node:

    <repository>
        <id>jitpack.io</id>
        <url>https://jitpack.io</url>
    </repository>

And to the _dependcies_ node:

    <dependency>
        <groupId>com.github.testdotai</groupId>
        <artifactId>classifier-client-java</artifactId>
        <version>v1.0.0</version>
    </dependency>

And already in the _testframework_ module:

    <dependency>
        <groupId>com.github.testdotai</groupId>
        <artifactId>classifier-client-java</artifactId>
    </dependency>

This way, finally, we have all the dependencies. Let's move on to the test implementation.

## First test

I start by creating a field and its initialization _classifier_ in class _BaseSpec_
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

The most important fragment:

```
classifier = new ClassifierClient("127.0.0.1", 50051);
```


When creating an object, the address and port should be used of course the same indicated by output on the terminal:

    node-pre-gyp info ai-rpc Classification RPC server started on 0.0.0.0:50051

I am adding a new file named LoginSpec.groovy in the directory:

    selenium-ai/tests/src/test/groovy/com/marcinstanek/seleniumjavaspockboilerplate/login/LoginSpec.groovy

I am also creating a new test:

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

The test is to find the Sign in button on the page and press it. The library that we have installed provides the ClassifierClient object which in turn provides us with the findElementsMatchingLabel (driver, "Sign in") method, to which we must pass the object implementing the IWebDriver interface and a string representing the object we are looking for.

Let's look at this

```

def els = classifier.findElementsMatchingLabel(driver, "Sign in")
els.first().click()
```


The method returns a list of WebElement class objects that should look like a SignIn button. With the received WebElements, we can do whatever we want with these types of objects. I just select the first item in the list and try to press it.

Here's how to run the test:

[ how to run the test](https://player.vimeo.com/video/384327914)

As you can see, the test failed. However, let's analyze how the library tries to deal with the problem. So, according to the developers, it works like this. The classifier client, a dependency we added to the project, runs an XPath query that tries to find items on the page. It then makes screenshots of these elements on the page. Then the client sends these snapshots to the server, this part running in the terminal performs image classification and sends the classification strength for each element to the client. At this point, the client has all the data to map the XPath queries and return those that match us as the items we are looking for. Unfortunately, as you can see in the launch video, 9 elements were found, but none of them were matched as the correct one.

I am writing this test at a loss, I will try with something else. :)

## Second test

It turns out you can't type literally anything as a search item - that would be too good. The list of available keywords can be found [here](https://github.com/testdotai/appium-classifier-plugin/blob/master/lib/labels.js). It is not very impressive so far. So I'll have to get a test to use one of them.

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


As you can see, I mixed up the search styles here to successfully log in. In the context of the topic of the post, we are interested in these lines of code:

```
def button = classifier.findElementsMatchingLabel(driver, "settings")
button.first().click()
```


Let's check it!

[click](https://player.vimeo.com/video/384340011)

As you can see, the test was successful. The item we searched for using the newly added library was found and the interaction was successful. Excellent!

## Summary

The new way to search for items on the page works fine, but it's pretty limited at the moment. Installation is problematic at this stage, which is definitely a downside. However, once I have everything set up, using this library is very simple. Probably the migration of the existing tests for this way of searching for items would be relatively easy. It seems to me that the development of this project should be watched. Perhaps the long-awaited revolution in the field of testing is just coming? :)

The code can be seen here:

    https://github.com/12masta/selenium-ai/tree/selenium-ai

Changeset:

    https://github.com/12masta/selenium-ai/pull/1/files

