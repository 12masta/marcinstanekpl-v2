---
title:  Cypress and correct use of selections, data-cy attribute
date:   2019-12-03 08:00:00 +0200
categories: [testautomation, cypress]
tags: [testautomation, cypress, en]
slug: en/cypress-5
ogimage: https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-12-03-selectors-refactor%2Fblog_post-cover.png?alt=media&token=6a825ffc-639e-42d8-a4fc-628c983dbfaa
ogimagetype: image/png
language: en
---

## Introduction

Selectors and the way they are built is a very important topic in terms of
stability, and thus the quality of automated tests. So far, in my project they
have been treated on the least line of resistance. It's high time to change
that.

You can find the previous post on this topic here [Cleanup, systematization of URLs](/en/cypress-4)

## Reason why have I used such low quality selectors so far

First, some context. Cypress has a built-in tool that allows you to quickly
download a selector for an item on a page. You may already know a similar tool,
e.g. from the developer tools built into the browser. It is available after
running the tests, by hovering the cursor over the crosshair icon.  Click on
it, point to the element of interest on the page, click again and it's ready,
we have a selector ready to use.

[Selector playground](https://s3.eu-north-1.amazonaws.com/marcinstanek.pl/2019-12-03-selectors-refactor/cypress-5-1-selector-playground-.mp4)
<!--
{% include_relative video.html id="vid1" webm="https://s3.eu-north-1.amazonaws.com/marcinstanek.pl/2019-12-03-selectors-refactor/cypress-5-1-selector-playground-.webm" mp4="https://s3.eu-north-1.amazonaws.com/marcinstanek.pl/2019-12-03-selectors-refactor/cypress-5-1-selector-playground-.mp4" img="https://s3.eu-north-1.amazonaws.com/marcinstanek.pl/2019-12-03-selectors-refactor/cypress-5-1-selectors-playground.png" ogv="https://s3.eu-north-1.amazonaws.com/marcinstanek.pl/2019-12-03-selectors-refactor/cypress-5-1-selector-playground-.ogv" imgalt="cypress-5-1-selectors-playground"%}
 -->
 
A very good prototyping tool for this project. You may have impression it
generates poor quality selectors. Nothing could be more wrong. I will only
write that after the correct configuration it is possible or after following
the developers' guidelines, it can generate good quality data. However, it
deserves a separate one post and cut the topic at the moment.

## What selectors to use

To avoid problems when creating selectors, you should write them in such a way
that they are resistant to changes. How can this be achieved? In my opinion,
there is only one solution, to use the attributes specifically designed for
automated testing. The developers of Cypress recommend that this attribute be
named:

    data-cy

This type of approach solves many problems, and certainly requirements to learn
their syntax, because in this case it will be very simple. As you know, it can
be complicated.

However, they do not come out of nowhere. They require the tester to create a
test project and add them to the appropriate places in the .html files. If you
are working on a commercial project you can of course ask the developers to do
so, but it will not be an efficient approach. In my opinion, this is the
responsibility of the automation tester.

## Adding attributes on the login screen

We are dealing with a project created with the React library. So we expect to
find components in the design. What are components?
[Here](https://pl.reactjs.org/docs/components-and-props.html) is explained
quite nicely with an example. I understand them as reusable pieces of html to
which we can pass arguments in order to specify their operation, appearance and
purpose. You don't need to understand them now. You just need to be able to
pass an attribute to them in order to test it.

Depending on the specifics of the project, the correct way of adding an
attribute will differ. However, I think mostly we always have to modify HTML -
except for some extreme edge cases. ;)

To add such an attribute to the login screen, we need to locate in the project:

    react-redux-realworld-example-app

File:

    src/components/Login.js

After opening it, we find the JavaScript code that returns JSX code. It's a
JavaScript extended with the ability to return HTML tags. More
[here](https://pl.reactjs.org/docs/introducing-jsx.html). After analyzing the
code, I can see that the _input_ tag is responsible for displaying the text
fields. In React's nomenclature, we call it a controlled component:

```
<input
  className="form-control form-control-lg"
  type="email"
  placeholder="Email"
  value={email}
  onChange={this.changeEmail} />
```

At first glance, you can see that I need to find a way to pass the attribute
here, and I want it to look like this:

```
<input
  className="form-control form-control-lg"
  type="email"
  placeholder="Email"
  value={email}
  onChange={this.changeEmail}
  data-cy="email-input" />
```

I save the file, refresh the page. I go into the developer tools and see that
the change has been applied. Of course, the frontend project runs in the
background all the time.

<!--
{% include_relative video.html id="vid2" webm="https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-12-03-selectors-refactor%2Fcypress-5-2-data-cy-email-input.webm?alt=media&token=48cbe7e1-b1e8-4d47-8a62-54cb18d13fa2" mp4="https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-12-03-selectors-refactor%2Fcypress-5-2-data-cy-email-input.mp4?alt=media&token=adba3b05-3e4d-461f-9d1d-05f529b62dde.mp4" img="https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-12-03-selectors-refactor%2Fcypress-5-2-data-cy-email-input.png?alt=media&token=7351c7e2-46a6-4c3c-a758-8302fc60a3aa" ogv="https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-12-03-selectors-refactor%2Fcypress-5-2-data-cy-email-input.ogv?alt=media&token=5a865b5d-4f10-4392-b56a-a40b73e41e2b" imgalt="cypress-5-2-data-cy-email-input" %}
-->

[Email input video](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-12-03-selectors-refactor%2Fcypress-5-2-data-cy-email-input.mp4?alt=media&token=adba3b05-3e4d-461f-9d1d-05f529b62dde.mp4) 
 
The same applies to the password field:

```
<input
  className="form-control form-control-lg"
  type="password"
  placeholder="Password"
  value={password}
  onChange={this.changePassword}
  data-cy="password-input" />
```

As well as the login button:

```
<button
  className="btn btn-lg btn-primary pull-xs-right"
  type="submit"
  disabled={this.props.inProgress}
  data-cy="button-input" >
  Sign in
</button>
```

At this point, I can move on to refactoring functions that use these elements.
I open the file:

    cypress/support/login/loginCommands.js

I am changing the code for the _login_ function to use the new attributes:

```
Cypress.Commands.add('login', (username, password) => {
    Cypress.log({
        name: 'login',
        message: `${username} | ${password}`,
    })
    if (username) {
        cy.get('[data-cy=email-input]')
            .type(username)
    }
    if (password) {
        cy.get('[data-cy=password-input]')
            .type(password)
    }
    cy.get('[data-cy=button-input]')
        .click()
})
```

It can be seen that the level of complexity of the selectors has decreased.
There is also a dependence that I wrote about above. The way of writing
selectors has been unified, from now on all you need to know is that an element
on the page can be found using a string:

    [data-cy=]

Simple and extremely effective.

## Adding attributes to components added by application developers

Adding the attribute to error messages on the login page turns out to be a bit
more complicated. The component responsible for displaying them is
_ListErrors_. This is a component created by the creator of the application
frontend project. Until now, I only added the attribute to components built
into the React library, so simply sticking one argument was enough. In this
case, this code is not enough:

```
<ListErrors errors={this.props.errors} data-cy="error-message" />
```

For the changes to be applied as planned, open the file:

    src/components/ListErrors.js

Then modify its contents to state:

```
import React from 'react';

class ListErrors extends React.Component {
  render() {
    const errors = this.props.errors;
    const datacy = this.props.datacy;
    if (errors) {
      return (
        <ul className="error-messages" data-cy="error-messages">
          {
            Object.keys(errors).map(key => {
              return (
                <li key={key} data-cy={datacy}>
                  {key} {errors[key]}
                </li>
(...)
```

We have a combination of two techniques here. The first, already known to us,
can be seen in the tag _ul_. There, I just assigned an attribute to it with the
value I expected. The second technique is to pass a value for an attribute from
outside the component. It consists in the fact that in the first step I assign
a value to a variable, this is exactly:

```
<ListErrors (...) data-cy="error-message" />
```

Then I assign the argument value from the outside to the variable inside the
component:

```
const datacy = this.props.datacy;
```

Finally, I assign a variable value to each attribute of the item on the bug list - tag _li_:

```
<li (...) data-cy={datacy}>
```

This is how the DOM displays what I expected:

![cypres-5-3-selectors-error-messages](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-12-03-selectors-refactor%2Fcypres-5-3-selectors-error-messages.png?alt=media&token=38e28971-9e03-476e-9d93-10272ad97483)

Moving on to refactoring error validation I modify the
_shouldErrorMessageBeValid_ function in the file:

    cypress/support/login/loginAssertionsCommands.js

```
Cypress.Commands.add('shouldErrorMessagesBeValid', (message, secondeMessgae) => {
    Cypress.log({
        name: 'shouldErrorMessagesBeValid',
        message: `${message} | ${secondeMessgae}`
    })
    cy.get('[data-cy=error-message]')
        .first()
        .should('have.text', message)
        .next()
        .should('have.text', secondeMessgae)
})
```

The rest of the changes are analogous to those described above. You can find
all the changes in the section below as a link to github.

## Summary

The addition of test attributes significantly simplified the structure of
selectors and made the tests more resistant to changes in the code. From now
on, you don't have to learn complicated selector syntax.

You can find all the changes in my repo on the branch, here:

    https://github.com/12masta/react-redux-realworld-example-app/tree/5-cypress

Changeset:

    https://github.com/12masta/react-redux-realworld-example-app/pull/6/files

Commit that adds selectors to the application code:

    https://github.com/12masta/react-redux-realworld-example-app/pull/6/commits/e25ef9d091e354455924ede14db9e2038577b292

A commit that adjusts the selectors used in the tests:

    https://github.com/12masta/react-redux-realworld-example-app/pull/6/commits/00e1812fb4ee039c434763aeeaaf800ca0c4b2f8
