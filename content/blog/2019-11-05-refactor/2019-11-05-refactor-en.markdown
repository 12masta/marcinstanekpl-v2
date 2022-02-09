---
title:  Test refactoring - App Actions vs Page Object Model
date:   2019-11-05 08:00:00 +0200
categories: [testautomation, cypress]
tags: [testautomation, cypress, en]
slug: en/cypress-3
ogimage: https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-11-05-refactor%2Fblog_post_cover.png?alt=media&token=5dc8a4e0-cda0-4138-99d6-25cea5138a2d
ogimagetype: image/png
language: en
---

## Introduction

As some of you already have pointed in comments the quality of code tests is
low. So today I will try to improve it by doing process of refactoring. First
what comes in my mind in this situation is usage of Page Object Model pattern,
to make our tests more logical and to highlight business layer. However in
documentation I've found such entry: [Stop using Page Objects and Start using App
Actions](https://www.cypress.io/blog/2019/01/03/stop-using-page-objects-and-start-using-app-actions/)
It suggests to try tackle it in different way - so I will use both solutions
to compare.

Previous post about that topic you can find here: [Login tests with Cypress](/en/cypress-2)

## App Actions

As I am curious of this new approach, I will begin with App Actions. I am creating
new file named:

    LoginTests.AppActions.spec.js

Now I copy content of _LoginTests.spec.js_. It seems that authors have extended
API of Cypress tool:

    cy.<custom_command>

There is dedicated place for creating this type of functions - the file in the directory:

    cypress/support/index.js

I am adding here a part of code, which I use in process of login by form on website:

```
Cypress.Commands.add('login', (username, password) => {
    Cypress.log({
        name: 'login',
        message: `${username} | ${password}`,
    })
    cy.get(':nth-child(1) > .form-control')
        .type(username)
    cy.get(':nth-child(2) > .form-control')
        .type(password)
    cy.get('.btn')
           .click()
})
```

Then I switch to modify file _LoginTests.AppActions.spec_ changing way of
handling event of user login in test _Successfull login_:

```
it('Successfull login', function () {
    (...)
    cy.visit('http://localhost:4100/login')
    cy.login('test@test.com', 'test')
    cy.url()
    .should('contain', 'http://localhost:4100/')
    cy.get(':nth-child(4) > .nav-link')
    (...)
})
```

I am also wrapping to separate functions the API queries of others actions _cy.request_:

```
Cypress.Commands.add('createNewUserAPI', (username, email, password) => {
    Cypress.log({
        name: 'createNewUserAPI',
        message: `${username} | ${email}| ${password}`
    })
    cy.request('DELETE', 'http://localhost:5000/users', {
        user: {
        username: 'test',
        email: 'test@test.com',
        password: 'test'
        }
    })
    cy.request('POST', 'http://localhost:5000/users', {
        user: {
        username: 'test',
        email: 'test@test.com',
        password: 'test'
        }
    })
})
```

My test presents much simpler:

```
it('Successfull login', function () {
    cy.createNewUserAPI('test', 'test@test.com', 'test')
    cy.visit('http://localhost:4100/login')
    cy.login('test@test.com', 'test')
    cy.url()
        .should('contain', 'http://localhost:4100/')
    (...)
})
```

I follow this pattern during refactor and I update next cases. It turns out
that I can use in several places function _cy.login_ and _cy.createNewUserAPI_.
During my work I figure out that I need another function: _cy.deleteUser_:

```
Cypress.Commands.add('deleteUserAPI', (username, email, password) => {
    Cypress.log({
        name: 'deleteUserAPI',
        message: `${username} | ${email}| ${password}`
    })
    cy.request('DELETE', 'http://localhost:5000/users', {
        user: {
            username: 'test',
            email: 'test@test.com',
            password: 'test'
        }
    })
})
```

Furthermore use of this approach allows for [chaining](https://javascriptissexy.com/beautiful-javascript-easily-create-chainable-cascading-methods-for-expressiveness/)
of functions. A practical usage of App Actions causes that test _Successfull login_
looks much cleaner.

```
it('Successfull login', function () {
    cy.createNewUserAPI('test', 'test@test.com', 'test')
    .visit('http://localhost:4100/login')
    .login('test@test.com', 'test')
    .url()
        .should('contain', 'http://localhost:4100/')
    .get(':nth-child(4) > .nav-link')
        .should('have.attr', 'href', '/@test')
    .get(':nth-child(3) > .nav-link')
        .should('have.attr', 'href', '/settings')
    .get('.container > .nav > :nth-child(2) > .nav-link')
        .should('have.attr', 'href', '/editor')
})
```

I think we can also hide technical part of test assertion putting it in
Custom Command:

```
    Cypress.Commands.add('shouldBeLoggedIn', (username, email, password) => {
        Cypress.log({
            name: 'shouldBeLoggedIn',
            message: `${username} | ${email}| ${password}`
        })
        cy.get(':nth-child(4) > .nav-link')
            .should('have.attr', 'href', '/@test')
            .get(':nth-child(3) > .nav-link')
            .should('have.attr', 'href', '/settings')
            .get('.container > .nav > :nth-child(2) > .nav-link')
            .should('have.attr', 'href', '/editor')
    })
```

I can do same for validation of displayed error message and validation of URL:

```
Cypress.Commands.add('shouldErrorMessageBeValid', (text) => {
    Cypress.log({
        name: 'shouldErrorMessageBeValid',
        message: `${text}`
    })
    cy.get('.error-messages > li')
        .should('have.text', text)
})

Cypress.Commands.add('shouldErrorMessagesBeValid', (message, secondeMessgae) => {
    Cypress.log({
        name: 'shouldErrorMessagesBeValid',
        message: `${message} | ${secondeMessgae}`
    })
    cy.get('.error-messages > :nth-child(1)')
        .should('have.text', message)
        .get('.error-messages > :nth-child(2)')
        .should('have.text', secondeMessgae)
})

Cypress.Commands.add('shouldUrlContain', (url) => {
    Cypress.log({
        name: 'shouldUrlContain',
        message: `${url}`
    })
    cy.url()
        .should('contain', url)
})
```

After applying the above practices we end with tests as below:

```
describe('Login Tests App Actions', function () {
    it('Successfull login', function () {
        cy.createNewUserAPI('test', 'test@test.com', 'test')
            .visit('http://localhost:4100/login')
            .login('test@test.com', 'test')
            .shouldUrlContain('http://localhost:4100/')
            .shouldBeLoggedIn('test', 'test@test.com', 'test')
    })

    it('Incorrect password', function () {
        cy.createNewUserAPI('test', 'test@test.com', 'test')
            .visit('http://localhost:4100/login')
            .login('test@test.com', 'test2')
            .shouldUrlContain('http://localhost:4100/login')
            .shouldErrorMessageBeValid('Error Invalid email / password.')
    })

    it('Not existing user', function () {
        cy.deleteUserAPI('test', 'test@test.com', 'test')
            .visit('http://localhost:4100/login')
            .login('test@test.com', 'test')
            .shouldUrlContain('http://localhost:4100/login')
            .shouldErrorMessageBeValid('Error Invalid email / password.')
    })

    it('Empty fields', function () {
        cy.visit('http://localhost:4100/login')
            .login('', '')
            .shouldUrlContain('http://localhost:4100/login')
            .shouldErrorMessagesBeValid('\'Email\' must not be empty.', '\'Password\' must not be empty.')
    })
})
```


It turns out that _Empty fields_ have finished with failure because of error:
_CypressError: cy.type() cannot accept an empty String. You need to actually
type something._ It means that sending string with value _''_ to function
_cy.type_ is not allowed Personally I prefer Selenium approach, where it is not
a problem. However it seems that authors of Cypress have different opinion and
it is not a defect: [GitHub Issue - .type() will not accept an empty
string](https://github.com/cypress-io/cypress/issues/3587).  I prefer freely
parametrize function which I've created, so I modify code of function
_cy.login_ to be able skip interaction with login and password fields, allowing
passing empty string to function:

```
Cypress.Commands.add('login', (username, password) => {
    Cypress.log({
        name: 'login',
        message: `${username} | ${password}`,
    })
    if (username) {
        cy.get(':nth-child(1) > .form-control')
            .type(username)
    }
    if (password) {
        cy.get(':nth-child(2) > .form-control')
            .type(password)
    }
    cy.get('.btn')
        .click()
})
```

After above changes it turns out that tests are more readable, but quite a few
bad practices was moved to file commands.js. I will not improve most of them at
moment. I am going for now sort logically files and separate logical blocks.  I
am creating new directory named _login_ in path _cypress/support/_. In this
directory I am creating file named _loginCommands.js_ and copy from file
_commands.js_ implementation of function _cy.login_.  Subsequently I am
creating another file _loginAssertionsCommands.js_ and I am copy implementation
of functions _cy.shouldBeLoggedIn_, _cy.shouldErrorMessageBeValid(arg)_ and
_cy.shouldErrorMessagesBeValid(arg, arg)_.  I do similar operation for
functions _cy.createNewUserAPI_, _cy.deleteUserAPI_ and _cy.shouldUrlContain_.
Finally to have access to those functions, in newly created files I need to
modify file _index.js_ in directory cypress/support/ and add imports
accordingly:

```
import './commands'
import './api/apiCommands'
import './common/urlAssertionsCommands'
import './login/loginAssertionsCommands'
import './login/loginCommands'
```

After those changes it will be easier find function, because in my opinion they
are much better placed. Benefits of this refactor will be visible during
implementing a new test cases. Question is: why does it work? Those functions
should not be visible in tests. This mechanism works because all dependencies
from file: _cypress/support/index.js_ are automatically loaded before each
specification by Cypress.

### App Actions - commit

You can find all changes in code about App Actions
[here](https://github.com/12masta/react-redux-realworld-example-app/commit/11d965258e549f1de7cc003858aba7ee6e0baba4).

{% include_relative subForm-en.markdown %}

## Page Object Model

Applying Page Object Model patter is also possible. I am creating a new file:

    LoginTests.PageObjectModel.spec.js

Then I copy to it content of file _LoginTests.spec.js_. Next step is to create a
new class which will represent object of login page. I create it here: _cypress/pageobjects/LoginPage.js_
and I prototype usage of class in test code as below:

```
it('Successfull login', function () {
  (...)

  cy.visit('http://localhost:4100/login')

  const homePage = new LoginPage()
    .login('test@test.com', 'test')

  cy.url()
    .should('contain', 'http://localhost:4100/')
  (...)
})
```

I notice also that I will need HomePage class which will represent home page of
application. I am creating it in this place _cypress/pageobjects/HomePage.js_
and I proceed with implementation of _LoginPage.login_ function.

```
import HomePage from './HomePage'

class LoginPage {
    login(email, password) {
        cy.get(':nth-child(1) > .form-control')
            .type(email)
        cy.get(':nth-child(2) > .form-control')
        .type(password)
        cy.get('.btn')
            .click()

        return new HomePage()
    }
}

export default LoginPage;
```

After test execution I received error: _ReferenceError: LoginPage is not defined_
which remind me to import newly created class. I am doing it this manner:

```
    import LoginPage from '../pageobjects/LoginPage'
```

I am continuing prototyping the assertion

```
it('Successfull login', function () {
    (...)

    cy.visit('http://localhost:4100/login')

    const homePage = new LoginPage()
        .login('test@test.com', 'test')

    homePage.url()
        .should('contain', 'http://localhost:4100/')
    homePage.userProfile()
        .should('have.attr', 'href', '/@test')
    homePage.settings()
        .should('have.attr', 'href', '/settings')
    homePage.editor()
        .should('have.attr', 'href', '/editor')
})
```

Now I know how my interface should look like (for now it only a class, but I
already think about it as future interface), so I move to implementation:

```
class HomePage {
    url() {
        return cy.url()
    }

    userProfile() {
        return cy.get(':nth-child(4) > .nav-link')
    }

    settings() {
        return cy.get(':nth-child(3) > .nav-link')
    }

    editor() {
        return cy.get('.container > .nav > :nth-child(2) > .nav-link')
    }
}

export default HomePage;
```

Then I perform same operation for API requests. I am creating a new class
which responsibility will be manage state of users. I am prototyping the test:

```
it('Successfull login', function () {
    new User('test', 'test@test.com', 'test')
        .remove()
        .create()

    cy.visit('http://localhost:4100/login')
    const homePage = new LoginPage()
        .login('test@test.com', 'test')

    homePage.url()
        .should('contain', 'http://localhost:4100/')
    homePage.userProfile()
        .should('have.attr', 'href', '/@test')
    homePage.settings()
        .should('have.attr', 'href', '/settings')
    homePage.editor()
        .should('have.attr', 'href', '/editor')
})
```

Once I know what I want to achieve, I go to the implementation of the class:
_cypress / requests / User.js_:

```
class User {

    constructor(username, email, password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    create() {
        Cypress.log({
        name: 'Log.User.create()',
        message: `${this.username} | ${this.email} | ${this.password}`
        })

        cy.request('POST', 'http://localhost:5000/users', {
        user: {
            username: this.username,
            email: this.email,
            password: this.password
        }
        })
        return this;
    }

    remove() {
        Cypress.log({
        name: 'Log.User.remove()',
        message: `${this.username} | ${this.email} | ${this.password}`
        })
        cy.request('DELETE', 'http://localhost:5000/users', {
        user: {
            username: this.username,
            email: this.email,
            password: this.password
        }
        })
        return this;
    }
}

export default User;
```

Now that I have my first test that looks as expected, I continue refactoring the next scenarios.

It turns out that for the test: _Incorrect password_ the created _LoginPage.login (arg, arg)_ function is not
sufficient because it returns an object of the HomePage type, and we know that after
incorrect logging in, we should stay on PageObject of the LoginPage type.
Therefore, a change of this class is required.
LoginPage class after refactoringwill look like this:

```
import HomePage from './HomePage'

class LoginPage {
    login(email, password) {
        if (email) {
            cy.get(':nth-child(1) > .form-control')
                .type(email)
        }
        if (password) {
            cy.get(':nth-child(2) > .form-control')
                .type(password)
        }
        cy.get('.btn')
            .click()
    }

    loginIncorrectPass(email, password) {
        this.login(email, password)
        return new LoginPage()
    }

    loginCorrectPass(email, password) {
        this.login(email, password)
        return new HomePage()
    }

    url() {
        return cy.url()
    }

    errorMessage() {
        return cy.get('.error-messages > li')
    }
}

export default LoginPage;
```

After refactoring all the tests using the pattern, I get the following code:

```
import LoginPage from '../pageobjects/LoginPage'
import User from '../requests/User'

describe('Login Tests Page Objects', function () {
  it('Successfull login', function () {
    new User('test', 'test@test.com', 'test')
      .remove()
      .create()

    cy.visit('http://localhost:4100/login')
    const homePage = new LoginPage()
      .loginCorrectPass('test@test.com', 'test')

    homePage.url()
      .should('contain', 'http://localhost:4100/')
    homePage.userProfile()
      .should('have.attr', 'href', '/@test')
    homePage.settings()
      .should('have.attr', 'href', '/settings')
    homePage.editor()
      .should('have.attr', 'href', '/editor')
  })

  it('Incorrect password', function () {
    new User('test', 'test@test.com', 'test')
      .remove()
      .create()

    cy.visit('http://localhost:4100/login')

    const loginPage = new LoginPage()
      .loginIncorrectPass('test@test.com', 'test-incorrect')

    loginPage.url()
      .should('contain', 'http://localhost:4100/login')
    loginPage.errorMessage()
      .should('have.text', 'Error Invalid email / password.')
  })

  it('Not existing user', function () {
    new User('test', 'test@test.com', 'test')
      .remove()

    cy.visit('http://localhost:4100/login')

    const loginPage = new LoginPage()
      .loginIncorrectPass('test@test.com', 'test')

    loginPage.url()
      .should('contain', 'http://localhost:4100/login')
    loginPage.errorMessage()
      .should('have.text', 'Error Invalid email / password.')
  })

  it('Empty fields', function () {
    cy.visit('http://localhost:4100/login')

    const loginPage = new LoginPage()
      .loginIncorrectPass('', '')

    loginPage.url()
      .should('contain', 'http://localhost:4100/login')
    loginPage.errorMessage()
      .should('have.length', 2)
    loginPage.errorMessage().first()
      .should('have.text', '\'Email\' must not be empty.')
      .next()
      .should('have.text', '\'Password\' must not be empty.')
  })
})
```

I was able to successfully implement the Page Object Model pattern. Same,
for App Actions, there is still a lot of room for improvement, but for this one
I focused on the basic implementation of the pattern assumptions.

### Page Object Model - commit

You can find all the changes of the Page Object Model [here](https://github.com/12masta/react-redux-realworld-example-app/commit/c8408db5ec5d9dd23fc528bb692a2dff5cd91bae).

## Summary

What I liked was the possibility of deep integration with the tool, which
doesn't require, at least at this stage of test implementation, to create
another one framework, because we have it ready and we manage it freely,
extending it functions.  Moreover, tests written with this approach are very
legible.  I expected however something more, it seems to me that with the
development of test the managing these functions will become cumbersome and too
less organized.  At the same time I think that adding more scenarios will allow
me to analyze deeper the problem and it will force me to discover the potential
of it approach.  I am glad that we have a choice, we can easily implement the
Page Object pattern and stick to old habits, if we care about it.

You can find all the changes in my repo on the branch, here:

    https://github.com/12masta/react-redux-realworld-example-app/tree/3-cypress

Changeset:

    https://github.com/12masta/react-redux-realworld-example-app/pull/3/files
