---
title:  Environment preparation
date:   2019-09-30 16:03:22 +0200
categories: [environment]
tags: [en]
slug: en/cypress-0
language: en
description: In this introduction to Cypress, the author shares their technique for creating end-to-end tests for a web application built on ASP.NET Core and React. They explain the setup process, including installing Cypress and writing basic tests to visit web pages, search for elements, click on them, and perform assertions. They also provide a link to their repository for further reference and mention their intention to write more tests in future posts.
---

## Introduction

I would like to show you how to prepare your local environment, which can be used to work with test automation.
Repository I forked can be found here:

    https://github.com/gothinkster/realworld

## Backend

    https://github.com/12masta/aspnetcore-realworld-example-app

To prepare environment you need a Git tool. How to install Git?

    https://git-scm.com/book/en/v1/Getting-Started

Besides Git you need the Docker:

    https://docs.docker.com/get-started/

When we have Git, we need to execute following command in terminal in our local directory:

    git clone https://github.com/12masta/aspnetcore-realworld-example-app.git

Switch to downloaded directory by:

    cd aspnetcore-realworld-example-app

When you have Docker, go to directory which was created after git clone command execution. Now in terminal execute command:

    make build

And then:

    make run

After those steps under URL

    http://localhost:5000/swagger

You should have access to API documentation. This part is finished, now it's time for front.

## Frontend

    https://github.com/12masta/react-redux-realworld-example-app

To be able to build project frontend, you need a nmp tool which can be installed along with node.js. How to install?

    https://www.npmjs.com/get-npm

When you will have npm, open a  terminal and execute command in directory in which you would like to create a project:

    git clone https://github.com/12masta/react-redux-realworld-example-app.git

Switch directory by typing:

    cd react-redux-realworld-example-app

Now execute to install all required dependencies

    npm install

And then run our local server

    npm start

## Assemble all together

Remember, to ensure the application works correctly, after command

    npm start

It is required also to start backend part. That means from level of directory cloned by git, we need to execute command:

    make run

For any reason you need to change backend URL address, here's a file which you need to edit:

    src/agent.js

And variable to adjust:

    API_ROOT

For example:

    http://localhost:3000

