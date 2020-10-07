

To help understand APIs, let's consider another acronym: UI, or user interface. A UI is the interface through which a user communicates with a system. Some UIs are very simple: you press `3 + 3` and your calculator displays the answer on its little screen. Others are very complex: you click on the Microsoft Excel icon and a spreadsheet appears, then you click on cell `C5`, they you type `=VLOOKUP()`, then I forget exactly what that does but it's somewhere in the documentation.

The acronym "API" stands for "Application Programming Interface". While a UI is the way in which a user interacts with a system, an API is the way in which *other systems* interact with a system. The same backend system can have multiple UIs and APIs that are all different ways of interacting with the same things.

[TODO-PIC][of lots of interfaces on the same system]

These words "system", "methods", "communicate" are all very vague. This is because the phrase "API" is applied to so many types of interactions between so many types of system.


If you're a programmer who works on or near the internet, the type of API you're probably most interested is in HTTP APIs that allow you to write programs to manipulate a system.

For example, the Twitter API[LINK] allows you to write programs that read, write, search, and do all kinds of things with Tweets. The Instagram API does the same thing but for Instagram posts. Some companies' main product is an API. Twilio's[LINK] primary business is an API for making phone calls and sending text messages. Stripe's[LINK] is an API for accepting online payments. If you read the marketing material then Stripe is actually "payments infrastructure for the internet", and I'm not saying it's not that, but for our purposes it's an API for accepting online payments.

In general, a system's API is a definition of how other parties can talk to it. 

Software systems are extremely powerful and capable of doing many different things. However, they need some way of telling other parties how they can communicate with the system. There will almost certainly be many capabilities that they do *not* expose to other parties. A silly example: no product has an API endpoint for "send me your entire password database", even though this is technically feasible. Clearly defining an API allows a system to describe what its users and consumers can use it for, and what they can't. Programmers talk about a library having an API, which is the different methods that it allows other programmers to call.

This idea of presenting a standard set of communication paths is so useful that inside tech companies it is often applied to non-software systems too. A team in a company might (slightly but not very pretentiously) describe itself as having an API. If you want to ask us a question, fill in this form. If you have a bug report, create a JIRA ticket here. If you need urgent help, call this phone number. Yes you can also ignore all of our carefully documented processes and come and harrass us in Slack and we will probably still help you, but that's not part of our API and so we will be grumpy about it.




Library code runs as part of the same program that the programmer is working on, on the same computer. However, programmers also talk about completely separate systems (such as Asana) having APIs that other programs talk to over a network (such as the internet). Asana's API defines the ways in which other computers can communicate with Asana. If you send us an HTTP `POST` request to `https://app.asana.com/api/1.0/tasks` with these parameters, we'll create you a new task.


In the same way that clear UIs make it easy to interact with a tool and get it to do what you want, clear APIs make it easy to interact with a system and get it to do what you want. And in the same way that designing a clear UI is much harder than it looks, so is designing a clear API.

======



As we've seen, "API" is a general term that can be used to describe many different ways in which pieces of code communicate with each other. However, most of the time when you hear people ask questions like "does this product have an API?" or "have you worked with APIs before?" they are probably referring to a set of HTTP endpoints that programs can interact with over the internet in order to cause a system to do something.

For example, let's consider the API for Asana, a to-do list manager. The Asana API allows you to automate actions that you would usually perform in the Asana web or phone UIs. You can create a new to-do item by sending an HTTP `POST` request to `https://app.asana.com/api/1.0/tasks` with parameters like the name, assignee, and due date of the item. You can list all the users in your workspace by sending an HTTP `GET` request to `https://app.asana.com/api/1.0/users`.

Like any API that manipulates confidential data, before Asana can process a request it needs to know and verify who you are. In a UI this authentication is usually done using a password or single-sign-on using something like Google or Facebook. In an API this is done by issuing a user with an *API key*. An API key is a long token, randomly generated by the API provider. Different APIs might use this for authentication in slightly different ways. The simplest way, which is the only one we will consider for now, is to require a programmer using the API to include the API key with every request. The API provider can choose the format that they require the API key to be included, but a common and sensible choice is for it to be included in an *HTTP header*.

```
Authorization: TODO
```

Side note: an API provider could technically ask programmers to pass the API key in the *query string* of the URL, for example:

`TODO`

However, requiring an API key to be sent in this way would be frowned upon (at least by me, albeit in a friendly, supportive manner). It's best to keep secrets like API keys out of URLs where possible, because URLs are liable to be logged by the API provider's applications to help with monitoring and debugging. Including secret values in URLs makes previously benign log files into troves of secret information that is functionally equivalent to a password. This makes it much more valuable to hackers, and easier for malicious internal employees to abuse as well.

Even free APIs that do nothing but return public, read-only information - such as TODO - are often well-advised to require developers to sign up for an API key that they provide with each request. This allows them to monitor usage and to see if anyone is over-using their API. If a user exceeds a pre-defined usage volume or speed, they can have a *rate-limit* applied to their account, where the API rejects their requests until they reduce their velocity.

====

Asana's HTTP API is clean and logical. However, a programmer who wants to use it would rather not have to manually make their own HTTP requests. They don't want to have to form the URLs ("was that app.asana.com or api.asana.com?"), parse the responses (TODO), or worry about exactly how to structure the API key header.

This is why many API providers also provide *API client libraries* for as many programming languages as they have time and patience for. An API client library is a library that allows programmers to write code that communicates with an API without having to worry about the details of how that APIs works. Programmers will often say that it *abstracts away* the complexity of the API, leaving only a simple method call. For example, in Python we can query the Asana API using the client library like so:

```python
import asana

# Don't worry where these values come from for now
ACCESS_TOKEN = "YOUR_SECRET_ACCESS_TOKEN_GOES_HERE"
WORKSPACE_ID = "YOUR_WORKSPACE_ID_GOES_HERE"

# Initialize an Asana API client object
client = asana.Client.access_token(ACCESS_TOKEN)

# Use the API client to get information about your user
me = client.users.me()
print(me)

# Use your user ID to create a new task that is assigned
# to you.
client.tasks.create({
    'workspace': WORKSPACE_ID,
    'name': 'Do more work TODO',
    'assignee': me['gid'],
})
```

This code isn't trivial; it takes a lot of looking through documentation to understand which methods to call and which parameters to pass them. But it's remarkable that these 10 lines of code (ignoring new lines and comments) allow your program to immediately start issuing commands to Asana.

## Advanced topic: Open API Spec

TODO - you don't need to know or use this.

This snippet uses the Asana API client library for Python, but this library can't be used from any other language. If Asana want to provide a client library for Ruby, they have to go away and write one.

Fortunately, with careful planning it is possible to automatically generate API client libraries for a huge range of languages. This is possible using the Open API Specification (TODO - swagger).

In a very real sense, REST APIs are all the same. The user of the API sends an HTTP request to a URL with some parameters, the server does something, then sends back an HTTP response. That "something" that the server does can be anything from send a text message to create a reprehensible Tweet, but from the perspective of the API client and the user, these details don't matter.

This means that if the creator of an API can write down in a structured format the paths, parameters, responses, and other information that their API deals in, another program can read this information and use it to automatically generate a client library. This is very useful for several reasons:

1. It saves the developers time writing the first version of a client library
1. It allows the developers to provide libraries for a broad range of languages, even those that are uncommon enough that they wouldn't bother manually writing a client library themselves
1. It makes it straightforward for them to keep the library up-to-date. If they update the API, they just have to update their Open API spec and re-generate the libraries
1. It reduces the number of bugs in the client libraries. The programs that take Open API specs and auto-generate code are open source and very well tested. If the developers can produce an accurate Open API spec for their API, they can be certain that the generated code will be correct. No typoing `self.parmas` when you meant to write `self.params` for the millionth time.

https://raw.githubusercontent.com/Asana/developer-docs/master/defs/asana_oas.yaml

## Writing your own API client

If a company provide an API client in your language, you should very likely use it unless you have a specific reason not to. However, if you want to use an API that does not have an API client that you can use, don't be scared to write your own. You can start by only providing methods to access the API endpoints that you care about, while making it easy for you and other programmers to add methods for more endpoints in the future.

* You'll need to choose a generic HTTP library to send your HTTP requests with. Your API client's job is to take parameters from the programmer and turn them into an HTTP request, hiding the details of this sometimes-fiddly transformation from the caller.
* Make sure to raise exceptions if a request fails. The HTTP library you are using may not do this automatically, and it makes for difficult debugging if you don't tell users of your library when something goes wrong
* Try to structure your library so that it is entirely generic and doesn't contain any logic specific to your particular program. For example, suppose that you want to use the Asana API to create a TODO task if a candidate in your recruiting tool passes your test. Don't write a method on your Asana API client [TODO-say using a different tool] called `create_task_if_candidate_passed`. Instead, write a method on the client called `create_task`, and push responsibility to another part of your code for deciding whether a candidate passed and what the parameters of the task (title, assignee, etc) should be. This *separation of concerns* will make your Asana API client more understandable and more reusable, both in other parts of your codebase and by other companies if you ever open source it.

## Advanced topic: Authenticating on behalf of another user

We have so far only considered APIs where the programmer calling the API is doing so in order to manipulate their own data. As we know, in this situation all the API provider needs to do is provide the programmer with an API key that they can copy into their program and include with every future API request.

This authentication protocol is not suitable for platforms, where end users delegate control of their account to a third-party. For example, Buffer[LINK] is a product that Twitter users (usually marketers) can use to schedule automated Tweets. The user wants to allow Buffer to create Tweets by calling the Twitter API *on their behalf*. This three-way authentication scenario can be quite complex. A quick, unwise, but technically viable approach would be for Twitter to provide users with an API key in the way we've seen so far, and for users to copy this API key over to every service to which they want to delegate control of their account. This is bad for several reasons:

1. It's a clunky user experience.
1. It's too coarse. Every app that the Twitter user wants to delegate control of their account to gets the same key. This means that Twitter can't tell the user who made a particular API call, and means that the user can't give different services different levels of access to their account. For example, I might want to give Buffer the power to create Tweets on my behalf, but only give a less trustworthy app the ability to access my followers list.
1. This also means that revoking permissions from apps that I no longer want to allow access to my account is too coarse. Since all apps have the same key I have to disable the key altogether, cutting off both trustworthy Buffer and untrustworthy Steal My Bitcoin[TODO].

The solution is to provide different applications with different API tokens. These tokens are tied to a specific application, and are imbued with a specific set of privileges chosen by the user or requested by the application (eg. create Tweets, read followers, but not read DMs). When Twitter receives a request with a particular API key, it can look the key up in their database and see "this is a key for @RobJHeaton's account, delegated to Buffer, with the permission to create Tweets." If a user wants to revoke an application's access to their Twitter account, they can cancel that application's API key from their Twitter dashboard.

A simple but clunky way to distribute different API tokens to different applications would be to stick with copy-pasting API keys from the Twitter dashboard into the application's dashboard. The only difference is that now the user creates a new API key for each new application, labels it with that application's name, and chooses the permissions that they want to give it.

This is certainly a better model than the single API key one, and once again it would technically work. However:

1. It's still clunky and difficult to explain, especially to users who aren't programmers themselves
1. It's error prone. The user might give the API key a misleading name, or give it more or fewer permissions than they intended.

The industry standard protocol for granting third-parties API access to an account is called OAuth[LINK]. The details aren't important to know off-hand (I would personally have to look them up in order to accurately explain them), but it is essentially Twitter providing a UI flow that allows a third-party application to request an API key from a user, and for that user to approve or deny that request. If the request is approved then Twitter generates an API key and sends it to the requesting application. Twitter labels the key as having been requested by that application, and adds it to a list of authorized applications in the user's dashboard. The user can revoke the API key at any time, cutting off the third-party's access to their account.

In this context the key might more often be called something like a "user access token" than an API key but the principle is the same.

## Advanced topic: Retries and timeouts

When you send an API request, the server on the end will do its best to fulfil your request. However, no matter how reliable and well-written the service, sometimes something will go wrong. If someone says that their API never fails, they are wrong. If someone says that an API call they are making will never fail, they are also wrong.

Maybe the service is getting overwhelmed with user traffic, or with a malicious denial-of-service attack. Or maybe a new release of the service is deployed, with a subtle bug that causes your request to error out and that was not uncovered in testing.

It's wise to account for the possibility and inevitability of such errors in your own code. One way to start might be to add *retries* to your API calls. This means that if an API request fails, you try it again. You can technically retry a request as many times as you like until it succeeds, although it is prudent to limit the number before you give up. It's bad manners to keep hammering away with your retries forever and ever. If a request doesn't succeed after 3 or 4 attempts then there's a good chance that something is seriously wrong and it won't succeed after 50 more. You might even be exacerbating a problem of too much traffic. It's also advisable and further good manners to wait a little before retrying a failed request.

You shouldn't blindly retry every failed request. Requests can fail because of an error on the API server, but CONTINUE



Since API requests might fail completely, even with retries, you should still have code that deals with failure gracefully.




It's perfectly reasonable to decide that you're not going to bother making your program robust to API failures at this point. Just make sure that you understand what the consequences of a failure would be. If vital medicines won't get to where they need to be then you should spend the extra time to add retries and robustness, or at least loudly alert someone if something goes wrong. If a like won't get added to a Tweet then perhaps you can feel OK about cutting this corner for now.



Timeouts are awkward - you don't know whether the server has succeeded but just hasn't told you, has half succeeded (should be the API creator's job the make sure this never happens), or has completely failed. How you deal with it depends on the business context. If you're making an API request to transfer money, you should see whether it succeeded. If you're trying to follow a new user on behalf of a user on Twitter, you could simply try again. If the follow succeeded first time then you'll hear about it.

## Advanced topic: mobile apps

Mobile apps often use non-public APIs
Mobile app is kind of just an API consumer, just a coincidence that it was written by the same company as the API
See eg. third-party Reddit clients

Don't want to allow other developers to automate
Example - Tinder
All the spambots use this
Easy for developers to be overconfident and return info they didn't expect anyone to see eg https://www.reddit.com/r/Tinder/comments/5pcxch/api_users_you_can_see_the_swipe_rates_on_you_and/

Can *reverse engineer* these APIs though
Can still write API clients around them
APIs may change though - harder than you might think because breaking old versions of the API will break mobile apps relying on that version. Users have to deliberately download updates
No particularly elegant solution - just have to badger and force users to upgrade, or just break their thing and say oh well
But it does mean that they can't just keep changing the API to try and foil people stealing it. I guess they don't care that much













A good API is 





https://openapi-generator.tech/

API client libaries make getting started with and using an API substantially easier, although the code inside them is not particularly complex. If you come across an API that you want to use that 












====

SPLIT API POST INTO IT'S OWN THING AND LINK TO IT



In this project we're going to write a command-line interface tool for Asana, a popular todo list app. Our tool will allow you to create, view, complete, and write snarky comments on tasks assigned to you and your colleagues.

This project will be fun and life-affirming in itself, but that's not the main point of it. We're going to use this project to learn about APIs and HTTP.

You may have heard of these important acronyms before. If you haven't then don't worry, we'll start from the beginning. If you have then that's great, and perhaps this project will be an opportunity for you to practice your skills, or maybe look at them from a new angle.

======



Asana API
Simple, easy to auth because not trying to do it on behalf of other people
Asana even say this - personal access token


Once you've done this for Asana you can do it for any API, principles are generally identical
Authentication might be slightly different, especially for apps where you're building a platform that acts on behalf of other people (eg. Buffer)
But once you've got that figured out you'll be away



Start by just derping around
Then create tasks to handle...something. Maybe this should be the next one
Create a task for every file in a dir. Or every image
Then sync them back to your computer
Maybe send emails using SendGrid or Mail or something

Explain when we might usually use webhooks and why we're not going to here (don't want to set up server, but you can if you want

Asana already has an API client for your language, and this is what you'd usually use if you were doing this for real
But we're going to do it all from scratch to learn things
This will help us learn 1. what's going on behind an API client, which will help us understand HTTP and APIs and 2. how to write an API client of our own for situations where we have an API but no pre-built client (which is very common)

Well not all from scratch - we'll use a client that makes HTTP requests for us
It's never "cheating" to use something someone else has made, at any level of the stack (unless it's copyright violation, but even then that's only cheating from a legal point of view, not learning to program). It all depends on what you want to learn and how. In this project we're not trying to learn how to use the HTTP stack so we will use someone else's thing. If this project was about learning lower-level networking then we wouldn't.

It's usually good professional practice to steal as much as you can

https://github.com/Asana/python-asana/blob/master/asana/resources/tasks.py



* Make a task from CLI
* List all tasks assigned to you
* List tasks assigned to you, choose one/s to close or close and comment
* Also have option to view details. Use colors for projects, lateness, etc
* Generate status report (use templates from PPAB 7)

Try to structure things so that you could plausibly reuse your client in other programs
For example if someone clicks "request a callback" in your app then you could create an Asana task. Or if something breaks. Or you could write another script 
Separate out client and CLI tool




Many official libs use patterns like query builder, return iterators, etc. These are good, but don't need to bother really
Maybe mention Open API spec

API returns helpful error messages - refer to them and the docs often
Don't have a top-level `data` param - this confused me



API cubical take on prrdammint os crud apps plus apis so might as well learn them. Hopefully crud apps that make the world Better

