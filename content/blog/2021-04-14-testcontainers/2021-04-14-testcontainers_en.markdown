---
layout: post
title:  ".NET Testcontainers library, infrastructure for the tests"
date:   2021-05-18 08:00:00 +0200
categories: [testautomation, testcontainers, docker]
tags: [testautomation, testcontainers, ci, docker, azuredevops, en]
permalink: /en/testcontainers-1
ogimage:
  - https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2021-04-14-testcontainers%2Flogo.png?alt=media&token=e5c98b5b-5b66-4047-9ac9-e67130825b1a
ogimagetype:
  - image/png
ogdescription:
  - Managing containers for the test purposes from the code level
---

## Testcontainers

I have been dealing with the problem of managing heavy dependencies such as databases when creating integration tests for a long time. Where to put them? How? How to ensure the right flow so that the process is light enough for the local environment as well as for the CI. There is no easy answer to this question.

I am interested in [TestContainers](https://github.com/HofmeisterAn/dotnet-testcontainers)
It is used to manage containers in the context of test code. It should enable us to run some of the infrastructures that is required to run the tests. Seems to be able to solve my problem. The library allows you to use predefined containers or other custom images.

In my case, most often I need an MSSQL database if I want to run tests that interact with the database. Therefore, in this post, I will try to run such a container with MSSQL server in the context of the test. Such an image is included in a predefined collection, so the task seems simple.

## Creating new .NET project
I am creating a new project with Xunit tests

{% highlight javascript %}
$ mkdir TestContainersXUnitExample
$ cd TestContainersXUnitExample
$ dotnet new xunit
{% endhighlight %}

Then I add NuGet DotNet.Testcontainers:

{% highlight javascript %}
$ dotnet add package DotNet.Testcontainers
{% endhighlight %}

And dependencies related to the database itself:

{% highlight javascript %}
dotnet add package System.Data.SqlClient
{% endhighlight %}

This way I have a ready environment where I can start working.

I open a project and an existing test class. Setting up such an instance turns out to be extremely simple. Here is the complete test

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

Changeset on github:

    https://github.com/12masta/TestContainersXUnitExample/pull/1/files

## Conclusions
As you can see, running such a database is a very simple task. The first test run takes quite a long time. In my case, about 3 minutes. In an already warmed up environment, it takes 10 seconds, but it should be taken into account that we can start the instance and then re-use it for more than one test. Therefore, I suspect that for a larger set of tests, this result will not be a problem.

There is also the problem of creating a more complicated setup with a backup recovery or a predefined image with a database backup ready for testing. I will address this issue in the next post about this tool.
