---
title:  First tests with Playwright
date:   2020-03-16 08:00:00 +0200
categories: [testautomation, playwright]
tags: [testautomation, playwright, en]
language: en
slug: en/playwright-1
ogimage: https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2020-03-08-playwright-introduction%2Fpost_cover.png?alt=media&token=2a44c1c7-46ac-49b2-a737-984998cdbd6f
ogimagetype: image/png
---

## A new platform designed to automate operations performed in the browser

Recently, Microsoft announced its release. It is created by the authors of the Puppeter tool. Playwright has multi-browser support, Chromium, WebKit, Firefox and Edge are supported. It is not a test automation tool in itself. All information about the project can be found on [github CLICK](https://github.com/microsoft/playwright).

After adding a few libraries, we will achieve the expected effect. I will rely on the Mocha and Chai libraries, the choice is of course much wider.

If you want to follow my solution step by step you will need locally, do a bit of work and go through the project setup, which I already described in the post: [Environment preparation](/en/cypress-0) Playground is the same as the Cypress test series. Both solutions are based on JS, so there will be an interesting opportunity to compare the two tools.

## Setup

In the _react-redux-realworld-example-app_ project, I create a new directory called _playwrighttests_ in the terminal, I run the command:

    npm init

I go through the setup answering the questions. I create a project in a separate directory and project to isolate myself from dependencies already existing in the project. Then:

    npm i playwright

This will install Playwright along with its dependencies and browser binaries. The files are about 50-100 MB each, so it may take a while.

After a successful installation, I am going to verify the operation.

I am creating my first script which:

1. It will launch the browser in 3 variants. Chromium, Firefox, WebKit.
2. Navigate to the website: http://localhost:4100/
3. Will take a screenshot

```
const playwright = require('playwright');

(async () => {
  for (const browserType of ['chromium', 'firefox', 'webkit']) {
    const browser = await playwright[browserType].launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('http://localhost:4100/');
    await page.screenshot({ path: `example-${browserType}.png` });
    await browser.close();
  }
})();
```

I run the script with the command:

    node example.js

It runs smoothly. Runs in headless mode. I produce 3 screenshots for each browser.

## First test

Unlike Cypress, we don't have the entire environment for creating out of the box tests. Fortunately, this is not a big problem. I start with the Mocha tool. This is a test platform that will allow me to run tests. I install a dependency with the command:

    npm i mocha

The next step is to install the Chai library. I will use it to make an assertion.

    npm i chai

Edit package.json replacing the test_ script to use mocha as a test runner:

```
  "scripts": {
    "test": "mocha"
  },
```

I'm creating a new file:

    playwrighttests/test/SmokeTest.js

Wraps the previous one in an example in the simplest test using _Mocha_:

```
const playwright = require('playwright');

describe('Smoke tests', function smoketests() {
  this.timeout(60000);
  this.slow(20000);

  beforeEach(async () => {
  });

  it('First test', async () => {
    for (const browserType of ['chromium', 'firefox', 'webkit']) {
        const browser = await playwright[browserType].launch();
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto('http://localhost:4100/');
        await page.screenshot({ path: `example-${browserType}.png` });
        await browser.close();
      }
  });
});
```

By calling the command:

    npm t

I'm running the test. The operation is the same as the script above, but we have already used the described tool in the context that allows us to write tests.

I don't like this loop in the test. Definitely anti-pattern. I get rid of it in the easiest way I can think of - a little better, although I don't know if that's the only way to do it in Mocha .:

```
    ['chromium', 'firefox', 'webkit'].forEach((browserType) => {
        it("First test - " + browserType, async () => {
            const browser = await playwright[browserType].launch();
            const context = await browser.newContext();
            const page = await context.newPage();
            await page.goto('http://localhost:4100/');
            await page.screenshot({
                path: `example-${browserType}.png`
            });
            await browser.close();
        });
    });
```

## Search for an item

To search for an item on the page, we need to use the function:

    page.$(selector)

Underneath, this function simply calls out:

    document.querySelector

Which means we need to use the css selector. Because that's what the feature I mentioned above does. The _ $ _ function returns null when it cannot find an item. So the test that will show us how it works will look like this:

```
it("Find element - " + browserType, async () => {
  const browser = await playwright[browserType].launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('http://localhost:4100/');
  const element = await page.$("a[href$='login']");

  expect(element).to.not.be.null;
  await page.screenshot({
      path: `example-${browserType}.png`
  });
  await browser.close();
});
```

The test simply verifies that the element that expects to exist on the page has been found by making an assertion that checks that the variable to which the element is assigned is not null. 

It is also easy to see the urgent need for refactoring. After shifting the code to the _beforeEach_ and _afterEach_ functions, the code looks like this:

```
const playwright = require('playwright');
const chai = require('chai')
const expect = chai.expect

describe('Smoke tests', function smoketests() {
    this.timeout(60000);
    this.slow(20000);

    let browser;
    let page;

    afterEach(async () => {
        await page.screenshot({
            path: `./screenshots/test-${this.ctx.currentTest.fullTitle()}-${Math.random().toString(36).substr(2, 5)}.png`
        });
        await browser.close();
    });

    ['chromium', 'firefox', 'webkit'].forEach((browserType) => {
        beforeEach(async () => {
            browser = await playwright[browserType].launch();
            const context = await browser.newContext();
            page = await context.newPage();
        });

        it("First test - " + browserType, async () => {
            await page.goto('http://localhost:4100/');
        });

        it("Find element - " + browserType, async () => {
            await page.goto('http://localhost:4100/');
            const element = await page.$("a[href$='login']");

            expect(element).to.not.be.null;
        });
    });
});
```

## Click

We can make it using the function:

    page.click(selector[, options])

This method takes the item through a selector, scrolls it into view if necessary, and then clicks in the center of the item. If there is no selector matching the element, the method will throw an error.

The test will look like this:

```
it("Click - " + browserType, async () => {
    await page.goto('http://localhost:4100/');
    await page.click("a[href$='login']");

    expect(await page.url()).to.be.string('http://localhost:4100/login');
});
```

We make assertions using the function:

    page.url()

It just returns the current URL. I used it because I expect the button I press to redirect to another page.

We can also click in the context of an element that we found using another function:

    elementHandle.click([options])

It will behave like the _page.click(selector[, options])_ function. The test with its use looks like this:

```
it("Click element - " + browserType, async () => {
    await page.goto('http://localhost:4100/');
    const element = await page.$("a[href$='login']");
    await element.click();

    expect(await page.url()).to.be.string('http://localhost:4100/login');
});
```

## Input handling

Text to an element can be sent using the function:

    page.type(selector, text[, options])

The function searches for an element on the page using a selector, then I enter text into the element. Text using this function:

```
it("Type - " + browserType, async () => {
    await page.goto('http://localhost:4100/login');
    await page.type("input[type$='email']", 'example@example.com');

    expect(await page.$eval("input[type$='email']", el => el.value)).to.be.string('example@example.com');
});
```

The most striking part of the code used in the assertion is:

    await page.$eval("input[type$='email']", el => el.value)

It uses the functions:

    page.$eval(selector, pageFunction[, ...args])

This function runs _document.querySelector_ on the page and passes it as the first argument to pageFunction. If there is no selector matching the element, the method throws an error.

If pageFunction returns Promise, then this function waits for Promise to be resolved and returns its value.

I used this approach to get the value of the email field in order to verify the _type_ function. That it is youkonać pobieram po prostu wartość atrybutu value, tam przechowywana jest wartość przekazanego inputu, na obiekcie, którego selektor przekazałem jako pierwszy argument funkcji. Następnie wykonuje asercje przy pomocy biblioteki chai.

He can perform the same operation in the context of the element that we previously found on the page.

    elementHandle.type(text[, options])

The function focuses on the element and then outputs the string. So it will behave the same as the same function in the context of _page_. The test with its use looks like this:

```
it("Type - element" + browserType, async () => {
    await page.goto('http://localhost:4100/login');
    const element = await page.$("input[type$='email']");
    await element.type('example@example.com')

    expect(await element.evaluate(el => el.value)).to.be.string('example@example.com');
});
```

An interesting fact is that there is another way to create an assertion. We can't use the _ $ eval_ function this time. When we want to make an assertion on an attribute of an element that we already have, we need to use the function:

    jsHandle.evaluate(pageFunction[, ...args])

This method passes an element as the first argument to pageFunction. If pageFunction returns Promise, it waits for Promise to resolve and returns the value.

## Summary

This is how we got to the last test in this post. In my opinion, the platform is very friendly to the person implementing the tests. I was concerned that the documentation would not be enough, I am very pleasantly surprised, it provides everything you need to get going. All functions are exhaustively described, along with the arguments we can pass to them. After analyzing it, I can say that the platform offers many interesting features, easily accessible without major complications. I am going to test them, so I will definitely discuss topics related to Playwright in the next posts.

The code can be seen here:

    https://github.com/12masta/react-redux-realworld-example-app/tree/1-Playwright

Changeset:

    https://github.com/12masta/react-redux-realworld-example-app/pull/8/files

