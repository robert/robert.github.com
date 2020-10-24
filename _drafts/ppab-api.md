For example, let's consider the API for Asana, a to-do list manager. The Asana API allows you to automate actions that you would usually perform in the Asana web or phone UIs. You can create a new to-do item by sending an HTTP `POST` request to `https://app.asana.com/api/1.0/tasks` with parameters like the name, assignee, and due date of the item. You can list all the users in your workspace by sending an HTTP `GET` request to `https://app.asana.com/api/1.0/users`.



========

# APIs for advanced beginners

To help understand what an API is, let's start by comparing APIs to UIs, or *user interfaces*. A system's user interface is the means through which an end user interacts with the system. Some UIs are very simple: you press `3 + 3` on your calculator and it displays the answer on its little screen. Others are very complex: you click on the Microsoft Excel icon and a spreadsheet appears, then you click on cell `C5`, then you type `=VLOOKUP(C:C, D12)`, then I forget exactly what happens but it's somewhere in the documentation.

In the same way, a system's "Application Programming Interface" (API) is the means through which *other systems* interact with it. A system's API is a standardized definition of how other systems can communicate with it, and what it will do in response. For example, the Facebook API tells programmers what kinds of requests they can send to Facebook, and how Facebook will respond to them. If a system doesn't have an API then programmers have no convenient way to automate interactions with it.

This idea of a system presenting a well-defined set of communication paths is so useful that tech companies tend to apply it to everything and anything, even things completely unrelated to code. A team might (slightly but not very pretentiously) describe itself as having an API. If you want to ask us a question, fill in this form. If you have a bug report, create a JIRA ticket. If you need urgent help, call this phone number. Yes you can also ignore all of our carefully documented processes and come and harrass us in Slack and we will probably still help you, but that's not part of our API and so we will be grumpy about it.

An "API" can describe many types of interactions between many types of systems. You might hear people talk about a library having an API, or a TODO, or even the Linux kernel. This is why my above definitions use such vague words like "system", "communicate", and "interact". However, if you're a programmer who works on or near the internet and are thinking "I should really learn more about APIs", you're probably most interested in *HTTP* APIs that allow you to interact with other companies' online products by writing code, instead of by clicking around a browser or mobile app.

For example, the Twitter API[LINK] allows you to write programs that read, write, search, and do all kinds of things with Tweets. The Instagram API does the same thing but for Instagram posts. Some companies' main product is an API. Twilio's[LINK] primary business is an API for making phone calls and sending text messages. Stripe's[LINK] business is an API for accepting online payments. If you read the marketing material then Stripe is actually "payments infrastructure for the internet", and I'm not saying it's not, but for our purposes today it's an API for accepting online payments.

In this post we're going to start with the fundamentals, but by the end we'll be deep in the weeds of nuanced best practices. What does an API request look like? What about an API response? What's an API client library? How can you write your own? What is REST? How do mobile apps use APIs? We'll look at examples of APIs. By the end you'll understand what APIs are and how to use them, and even how to build your own.

======

## Who uses APIs? How do they use them?

A system's API alows other systems to programatically communicate with it. APIs are primarily use by companies in order to integrate their products with each other. For example:

* Strava allows you to import your FitBit data[LINK]
* Travel websites like Kayak[LINK] use airline company APIs to retrieve data about their flights
* Tinder uses the Facebook API to pull users' profile pictures, and to tell potential matches when they have friends in common
* Online stores use the Stripe API to charge their customers
* Websites use Twilio to send SMS messages to their users for *two-factor authentication*
* Calendly uses the Google Calendar API to make sure you don't schedule meetings on top of each other
* If This Then That (IFTTT) and Zapier have built entire businesses around making it easy for users to plug APIs into each other

Companies also use other companies' APIs to streamline their internal workflows. This allows them to build private tools and intranet sites that plug the different third-party tools that they use into each other. For example:

* They use the JIRA API[LINK] to automatically create tickets when something goes wrong
* They use the Greenhouse API[LINK] to build tools for managing their recruiting pipelines
* They use the AWS API to build tools to manage their servers
* They use the Amazon.com API the build tools to automatically list their products

Even though most APIs are primarly used by companies, many of them are publicly available and can just as easily be used by private citizens in recreational projects.

## What happens when you make an API request?

When you make an API request, your code sends an *HTTP request* to a server. Your request probably contains an *API key* to identify yourself to the server, and probably also contains some parameters telling the server what you would like it to do. The server parses the request and checks your identity and permissions. Depending on the contents of your request it might either read some data and send it back to you (for example, send you a list of all the charges you have made recently), or write some new data and let you know it has done so (for example, creating a new charge for a new sale).

[TODO-PIC]

The process behind making an API request is almost identical to visiting a website in your web browser. When you visit a website, your browser sends HTTP requests to the server hosting the website, and the server sends back an HTTP response containing text, images, and whatever else is needed in order to display the site.

The details differ slightly. API requests use *API keys* to identify the sender to the server; web browsers normally use *cookies*. Responses to API requests usually contain structured data in a form such as *JSON*. Whilst responses to requests from a browser might also contain JSON, they can also contain HTML, an image, JavaScript code, or other types of media. But as we'll see, companies' mobile apps and websites are increasingly making use of the exact same API endpoints as other API clients. In this model a company's apps and websites are effectively no different to other API consumers; they just happen to have been written by the same company that wrote the API.

In this post, we're going to be talking about HTTP APIs. So let's start by asking and answering: what is HTTP?

### What is HTTP?

HTTP stands for *Hyper Text Transfer Protocol*. It was originally designed by Tim Berners-Lee, and is the protocol that underlies most of the web. Before we talk about HTTP any further, let's make it clear what we mean by a "protocol". Yes we can continue this recursive definition process forever and ever until we get to "what is truth, really?" But let's just go one more layer down then we'll stop, I prmoise.

A protocol is a formalized set of rules that allow systems to exchange information. Agreeing on a set of rules allows different systems to talk to each other, even those built by different, competing companies. For example, there are many companies who will provide you with email services. Many of these companies hate and are sueing each other. Fortunately, the internet has agreed on a common protocol for sending emails (called Simple Message Transfer Protocol, or SMTP). This means that when you send me an email, your email provider sends my email provider a message structured according to SMTP. Since my email provider knows and respects the rules of SMTP, it can parse this message out into subject, body, return address, attachments, and so on.

Similarly, an HTTP request is a message formatted according to the HTTP protocol. Here's an example HTTP request that your browser sends when it wants to request the page `robertheaton.com/about` from my server:

```
GET /about HTTP/1.1
Host: robertheaton.com
User-Agent: curl/7.54.0
Accept: */*
TODO
```

And here's a HTTP request that a server might send to the Stripe API in order to create a new charge:

```
TODO
```

It's important to realize that this isn't some human-readable summaries of an HTTP request; this is literally what an HTTP request looks like. The client opens a network connection to the server and sends this exact data. The network connection is opened using TCP/IP, another protocol, but the details very much don't matter here. All that matters is that the client and server are able to exchange data.

When a server receives an HTTP request it performs some action, then returns an HTTP response. If the request was asking for information (like retrieving a webpage or a Tweet), the response might include that information in the *response body*. If the request was asking to create a new record, the response body might say whether the creation was successful and the new record's database ID. If something goes wrong during processing then the server should send back a response indicating what went wrong. If something goes seriously wrong (eg. the server literally explodes half-way through processing the request, or the client loses its internet connection) then the client might not receive an HTTP response. However, in general the client should always expect to receive back a response.

We'll talk more about the different parts of HTTP requests and responses shortly. It's useful to understand HTTP at a high level, but you can get a long way without knowing much about the details. If you know about URL paths (like `/TODO`); HTTP verbs (like `GET` and `POST`); status codes (like `200 OK`, `404 Not Found`, and `500 Internal Error`); and a little about HTTP headers (like `TODO`), then you'll be able to get a long way. Let's talk briefly about some of these key concepts.

### What's the different between a protocol and an API?

Protocols and APIs sound very similar. They're both, broadly speaking, rules that allow systems to exchange information. The difference between the two is that a protocol is typically much more *generic* than an API. A protocol is the foundational rules of communication that can be used for a specific use case.

The postal service has a protocol for sending mail around the country. If you put a letter in an envelope, write a name and address on it, and attach enough stamps, the postal service will deliver it. If you don't put enough stamps on it then they will ask the recipient to pay instead. If you write your own address on the back then they will return it to you if they are unable to deliver it.

The postal service doesn't care how you use its protocol (beyond a few basic legality and safety checks). It's just a generic transport mechanism.

A somewhat subtle point: the postal service's rules are a protocol, but the postal service itself is an *implementation* of that protocol. The rules describe the contract that a user has with the postal service. The actual vans, postal workers, and post offices are what bring that contract to life.

Protocols can build on top of each other. A *networking-level* protocol like TCP/IP describes how computers can connect to and exchange data with each other over the internet. However, this isn't enough for two computers to have a productive conversation. If you want to request a particular website, you need to be able to say what information you want, send some authorization information to prove your identity

it's convenient



Protocols can build on top of each other. The postal service is analagous to a *networking-level* protocol like TCP/IP; it describes how to send messages, but says nothing about the contents of those messages. An *application-level* protocol like HTTP is analogous to the conventions on how formal-ish letters are usually laid out. The sender's address goes in the top-right, then the date, then "Dear So-And-So", then the body of the letter, then "Yours faithfully/Hugs and kisses/Best regards", then the sender's name.

[PIC]

This letter-structuring protocol is much less strict than a computer protocol like HTTP. No one's going to return a letter saying "ERROR COULD NOT PARSE DATE" if you mis-spell "Setpember". But it's still a set of rules for laying out a message, just like HTTP. Letters are written according to letter-writing conventions and sent from A to B using the postal service. Web requests are written according to HTTP and sent using TCP/IP.

In the same way that letter-writing conventions have no opinions about what you actually write in the body of your letter, HTTP has no opinions about what goes in an HTTP request. 

By contrast, APIs are *specific*. HTTP tells us where request paths and bodies and headers go; an API tells us what paths should go there and what the server will do and send back when it receives a particular type of API request.

Technically API providers don't have to use an existing generic protocol. An API provider could invent their own protocol. Send us a message with TODO. This would work, but it would be a pain to use. Systems all across the internet have already agreed what is meant by "an HTTP body" and "an HTTP response code". This allows APIs to say "to create an article, send a `POST` request to `/articles` with the following parameters in the body, formatted as JSON."

### What's actually going on? How is an HTTP request sent?

The client forms a block of text that makes up its HTTP request. It opens a TCP connection to a server (this is admittedly a long story, but essentially this means that the client and server establish a pipe through which they can exchange data). Then it sends the block of text to the server. The server does some processing, forms its own block of text that makes up its HTTP response, and sends it back down the pipe to the client.

[TODO-pic]

### HTTP verbs

You may have come across HTTP verbs before. The two most common are `GET` and `POST`, but there are 9 in total[TODO]. Every HTTP request has a verb. A request's verb gives some clue about its desired action. For example, a `GET` request is asking for information about a *resource* to be returned. By contrast, a `POST` request is typically a request to create a new resource, like a new tweet, to-do item, or article. A `DELETE` request is a request to delete data, `PUT` requests update data, and so on.

A `GET` request should not change data on a server; it should should only return existing data. These are only conventions, and there's nothing technically enforcing them. If you wanted to write an API `GET` endpoint that deleted data then nothing would stop you other than hopefully your colleagues' code review. 

HTTP verbs aren't technically essential, and HTTP could easily have been designed without them. Instead of creating a task with a `POST` request to `/api/1.0/tasks`, HTTP could have been designed so that you sent a generic type of HTTP request to `/api/1.0/tasks/create`. You list your tasks by sending a request to `/api/1.0/tasks/list`, and so on.

However, the conventions and expectations that HTTP verbs set can be very useful. For example, when you type a URL into your browser and press, your browser always sends an HTTP `GET` request. Since `GET` requests should only ever return data, not mutate it, this means that typing a URL into your browser is always "safe". You can be very confident that visiting `https://facebook.com/account/delete` in your browser isn't going to accidentally delete your account. If there was only one type of HTTP request, you would have no such guarantee.

More aesthetically, HTTP verbs allow programmers to separate out the specification of the "resource" that they want to act on and how they want to act on it. The URL path (eg. `/articles/123`) gives the resource that is being acted on, and the HTTP verb (eg. `GET`) gives the action that should be performed on it. `GET /articles/123` means "give me article 123. `PUT /articles/123` means "update article 123 with some new data". `DELETE /articles/123` means "delete article 123 entirely". `GET /articles` means "give me all articles". `POST /articles` means "create a new article". Once again, this isn't technically necessary, but splitting out concepts into their own buckets often makes for simpler code and systems. This way of laying out URL paths is often described as *RESTful*. We'll talk more about *REST* in a few sections time.

### HTTP request parameters

An HTTP request's verb and URL path usually tell the server what action the requestor is trying to perform. However, many actions also require parameters. Users don't just say "create an article"; they also need to provide the article title, body, tags, and so on. Even read-only operations like "list all articles" can also take filter parameters like author, date, and so on.

In a `GET` request parameters are passed in the URL *query string*, for example:

`GET /articles?author=Robert%20Heaton&year=2020`

The query string is the part of the URL after the path, and is separated from the path by a `?`. Parameters are usually specified using a syntax like `?key1=value1&key2=value2`, although clients can put - and servers can accept - whatever they want in the query string. Our above example would probably return all articles written by Robert Heaton in the year 2020. Filter parameters usually go in the URL because they help describe the resource that the requestor is requesting, which is the job of the URL.

By contrast, in a `POST` or `PUT` request parameters are usually passed in the HTTP *request body*. The request body is a blob of text that is attached to the end of an HTTP request. A body can take any format, but most modern APIs require parameters to be sent using JavaScript Object Notation, or JSON. JSON is a simple, human-readable *serialization format*. For example, the parameters to create an article might be:

```json
{
    "title": "An advanced beginners guide to APIs",
    "body": "TODO",
    "tags": ["programming", "advanced-beginners"],
    "author": {
        "first_name": "Robert",
        "last_name": "Heaton"
    }
}
```

Older APIs might require parameters to be sent using other serialization formats like XML.

Parameters that describe how a requestor wants their action to be performed are passed in the HTTP body because they describe the payload. It wouldn't make sense to pass these parameters in the query string as part of the URL, because they don't describe the resource that should be acted on; instead they describe *how* the resource specified in the URL should be acted on. Yet again, there's nothing technically enforcing this, and you could absolutely write an API endpoint that expected `POST` requests with the new resource's properties in the query string. I woudn't recommend it though.

HTTP requests are only half of the story. We also need to consider HTTP responses.

### HTTP responses

When a client sends an HTTP request to a server, the server parses the request, performs some sort of action, then returns an HTTP response back to the client. HTTP responses have several components, but the two that you'll usually pay the most attention to are the *HTTP response code* and the *HTTP response body*.

If the request was a request to retrieve some information, the response might include that information in the response body. If it was a request to create a new record, it might contain information about whether the creation was successful and the database ID of the new record. If something goes seriously wrong (eg. the server literally explodes half-way through processing the request, or the client loses its internet connection) then the client might not receive an HTTP response. In all other situations the client should expect to receive back a response. If something went wrong during processing then the server should send back a response with a status code and body indicating what went wrong.

Let's look in more detail at response bodies and status codes.

#### Example HTTP response

HTTP responses

```
GET / HTTP/1.1
Host: nonhttps.com
User-Agent: curl/7.54.0
Accept: */*
```

#### HTTP response body

The HTTP response body contains the blob of information that the client requested. It's the equivalent of the HTTP request body. In modern APIs it will usually also be structured as JSON. For example, the response to a request to `GET /articles` might be:

```json
{
    "data": [
        {
            "title": "TODO",
        }
    ]
}
```

The response body to a request to `GET /articles/123` might be:

```json
{
    "title": "TODO"
}
```

Requests to create or update resources will also usually return the created or updated resource in full to give the client full information about the operation that was just performed. A request to `POST /articles` might return:

```json
TODO
```

#### HTTP response codes

The Mozilla Developer Network says:

> HTTP response status codes indicate whether a specific HTTP request has been successfully completed. Responses are grouped into five classes:
>
> * Informational responses (100–199),
> * Successful responses (200–299),
> * Redirects (300–399),
> * Client errors (400–499),
> * and Server errors (500–599).

You can read the full list of response codes on MDN[LINK-https://developer.mozilla.org/en-US/docs/Web/HTTP/Status]. Some of the most common ones are:

* `200 OK`: The request has succeeded
* `400 Bad Request`: The server could not understand the request due to invalid syntax
* `403 Forbidden`: The client does not have access rights to the content 
* `404 Not Found`: The server can not find the requested resource. You've probably seen this in your browser many times over the years. See eg. https://robertheaton.com/THIS_PAGE_DOESNT_EXIST[TODO]
* `500 Internal Server Error`: The server has encountered a situation it doesn't know how to handle. Often suggests that the server's code threw an exception while processing the client's request.

----

We now have a good grasp on what is meant by the "HTTP" in "HTTP API". HTTP is TODO.

Now we're ready to look in more detail at APIs themselves.

----

## Authentication and authorization

Many APIs allow the user to read and write private data of one kind or another. The Twitter API allows the user to send a Direct Message; the Flexport API allows the user to read a list of all cargo shipments they have sent. This means that before these APIs process a request, they need to verify the identity of - or *authenticate* - the requestor.

UIs need to authenticate their users too. They traditionally do this via a username and password, although more complex but useful approaches like *single-sign-on* using Google or Facebook are increasingly common. APIs authenticate their users using an *API key*. An API key is a long, secret token, randomly generated by the API provider when the user requests one. There are several ways in which an API can use this token to authenticate a request. The simplest way is to require API users to include the API key with every request. A common and sensible way to ask users to send an API key is in an *HTTP header*:

```
Authorization: TODO
```

When the API receives a request, it can read off the API key included with it and check its database to find the corresponding user. If a hacker steals a user's API key then they can trivially use it to impersonate you. This is why you should not click on suspicious links in emails from senders who are not in your address book. More helpfully, in the advanced topics section of this post we'll talk about ways in which large companies keep their API keys ultra-secret. We'll also talk about incredibly common ways in which people accidentally expose their API keys to the world, and simple steps you can take to prevent them.

#### Free public APIs

Even free APIs that do nothing but return public, read-only information - such as TODO - are often well-advised to require developers to sign up for and provide an API key. This allows them to monitor usage and to see if anyone is over-using their API. If a user exceeds a pre-defined usage volume or speed, they can have a *rate-limit* applied to their account, where the API rejects their requests until they reduce their velocity.

#### Authorization

Once the API server has found the requestor in their database, the request is *authenticated*. Authentication means deciding who someone is. However, the server still needs to take care to *authorize* the request. Authorization means, given that we know who someone is, are they allowed to perform a particular action?

This might mean checking whether the requested private message belongs to the user. A more complex example, it might mean checking whether the user has been granted permission to withdraw money from a bank account, in addition to viewing its current balance.

#### Restricted API keys

It is good practice for API keys to allow users to generate API keys with restricted permissions. For example, the admin user on a Stripe merchant account might have permissions to take any action: create charges, refund charges, change bank account details, turn off the fraud shield, and so on. By default, you might expect API keys that they create to have all these same powers.

However, this is generally a bad idea, and users should instead be able to create API keys that are imbued with only those powers necessary for the program they want to write to do its job. This is for two reasons. First, if a hacker steals an API key, they implicitly steal all the powers associated with it. Any kind of security breach is bad and something to try to prevent, but since breaches happen, we should also put a lot of effort into mitigating their fallout when they do happen. Second, it reduces the consequences of programming errors in the user's code, and makes their overall system easier to reason about.

The *principle of least privilege* states that:

> Every program and every privileged user of the system should operate using the least amount of privilege necessary to complete the job.

Sometimes programs really do need to do powerful things, and require powerful API keys with lots of permissions in order to do them. This is fine; stripping away privileges from every other component of your system means that you can focus your security and testing efforts on those powerful programs.

### REST

You may have come across APIs that describe themselves as "RESTful". REST stands for REpresentational State Transfer. The original REST manifesto was written in 1998 [TODO] and lays out 6 principles for API design. As a pragmatic user of an API, you don't particularly need to care that it's RESTful or what that means. Knowing about REST will help you guess at how the API behaves, but you can also get that by reading the documentation.

Matters are complicated by the fact that, in my experience most of the original REST points are now either forgotten, ignored, or subsumed into other notions of best practice. Nowadays I think that the thing that most people think about when they think of REST is the way in which HTTP endpoints are laid out. I'd advise you to only worry about this.

Most APIs that self-identify as RESTful will lay out their endpoints as follows:

* `GET /articles`: return a list of all articles.

The caller may pass filter parameters in the query string (see next section for details) in order to restrict the articles that are returned. For example, `GET /articles?author=Robert%20Heaton` might return only articles written by Robert Heaton.

* `GET /articles/:id`: return the article with ID `:id`

* `POST /articles`: create a new article
* `PUT /articles/:id`: update the article with ID `:id`

Parameters to these two endpoints will generally be passed in the HTTP body (see next section for details).

* `DELETE /articles/:id`: delete the article with ID `:id`

You might also see endpoints that make it convenient to retrieve all sub-resources associated with a resource. For example, suppose that we want to retrieve all the comments associated with an article. We could do this using an endpoint at `GET /comments` with a `article=:id` filter. However, API designers might deem it more convenient to provide a special endpoint:

* `GET /articles/:id/comments`: return a list of all comments on the article with ID `:id`
* `POST /articles/:id/comments`: create a new comment on the article with ID `:id`

Some actions might not fit neatly into this standardized framework. For example, suppose you want to allow users to archive (and unarchive) their articles. This could plausibly be done by a `PUT /articles/:id` request to update the article and set `"archived": true` or `false`. However, it might be more convenient to create entirely new endpoints for these special actions:

* `POST /articles/:id/archive`: archive the article with ID `:id`.
* `POST /articles/:id/unarchive`: archive the article with ID `:id`.

Once again, none of the above guidelines are technical restrictions. API creators can lay things out in any way they choose. These are just sensible conventions.

For more real-world examples, see the Stripe API. I work at Stripe but I'm not just shilling. I don't get a referral bonus if you use Stripe and I've heard plenty of good things about Braintree too. Stripe is just frequently held up as an example of excellent API design (again, not shilling, no referral bonus).

## API client libraries

Many modern APIs are clean and logical. Take the API for Asana, a todo list app. To retrieve all tasks in a workspace, you send a `GET` request to `https://app.asana.com/api/1.0/tasks?workspace=$WORKSPACE_ID`. To create a new project you send a `POST` request to `https://app.asana.com/api/1.0/projects` with a simple JSON body containing all the parameters for the new project. Asana has extensive interactive documentation for every endpoint in its API.

[TODO-PIC-OF-DOCS]

However, remembering and piecing together these details is still annoying for users of the Asana API. Programmers don't want to have to form the URLs ("was that app.asana.com or api.asana.com?"), parse the responses (TODO), or worry about exactly how to include the API key.

This is why many API providers also write *API client libraries*. A client library is a piece of code that programmers can import and use in their own code in order to communicate with an API without having to worry about the details of how that API works. Programmers will often say that a client library *abstracts away* the complexity of the API, leaving only a simple method call. For example, in Python we can query the Asana API using the Python client library like so:

```python
import asana

# Don't worry where these values come from
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

This code isn't trivial. You need to read Asana's documentation to understand which methods to call and which parameters to pass into those methods ("should that be `workspace` or `workspace_id`?"). But it's still remarkable that these 10 lines of code (ignoring new lines and comments) allow your program to immediately start issuing commands to Asana.

Note that the API provider needs to write a separate library for every language that they want to support. This can be quite tedious, but the *Open API spec* (see below) goes some way to simplifying and automating the writing of client libraries.

## Writing your own API client

Companies will usually publish clients for their own APIs in all major languages. However, writing a client library doesn't require any proprietary knowledge. If a company hasn't published an API client for a language, other people often write their own. Sometimes they publish them as Open Source Software. If you want to use an API and a well-maintained first- or third-party client library already exists for it in your language, you should probably save yourself some time and use it. However, if such a library doesn't exist, don't be scared to write your own.

The code behind client libraries shouldn't generally be too complex. Writing a client library of your own can teach you a lot about how APIs and HTTP work, and how to structure your code so that other people can easily slot it into their own programs and use it. You don't have to bite off the whole API at once. You can start by only providing methods to access the API endpoints that you care about, while making it easy for you and other programmers to add methods for more endpoints in the future.

Here are some hints for writing your own API client library:

* Choose a generic HTTP library that you'll use to send your HTTP requests (for example, `requests`[LINK] for Python). Your API client's job will then be to take parameters from its caller and use this generic HTTP library to turn them into an HTTP request, hiding the details of this sometimes-fiddly transformation.
* Structure your code as an "API client class" that has methods for different API methods. Require the caller of your library to pass their API key in to the *constructor* of your class so that they don't have to pass it into every single method call. The code that calls your library might look something like:

```python
import my_fb

API_KEY = "API_KEY_GOES_HERE"
client = my_fb.FacebookAPIClient(api_key=API_KEY)
user = client.user_profile(user_id=12345)
print(user)
```

* Try to make your library *generic*. Your library shouldn't contain any logic specific to your particular program. For example, suppose that you want to use the Asana API to create a TODO task if a candidate in your recruiting tool passes your test. Don't write a method on your Asana API client [TODO-say using a different tool] called `create_task_if_candidate_passed`. Instead, write a method on the client called `create_task`, and push responsibility to another part of your code for deciding whether a candidate passed and what the parameters of the task (title, assignee, etc) should be. This *separation of concerns* will make your Asana API client more understandable and more reusable, both in other parts of your codebase and by other programmers if you ever open source it.

[PIC-of-separation-of-concerns-TODO]

* If an API request fails, raise an exception. The core HTTP library you are using may not do this automatically, and it makes for difficult debugging if you don't tell users of your library when something goes wrong.
* Read the code of other API clients written in your language for inspiration on how the code can look, both internally and externally. Don't feel like you need to add every bell and whistle that these other libraries have, though. It's fine to have a single class with a big pile of methods that all return a dictionary.

## Advanced topic: Authenticating on behalf of another user

So far we've been considering APIs in which the programmer calling the API is only ever manipulating their own data. For example, creating Asana tasks in their own workspace or creating Stripe charges on their own merchant account. In this situation all the programmer needs to do is include an API key that they copy into their program from their UI dashboard. This protocol is simple and works perfectly for this use case.

However, think about platforms, in which end users delegate control of their account to a third-party. For example, Buffer[LINK] is a product that Twitter users (such as marketers running corporate Twitter accounts) use to schedule automated Tweets at particular times. To do this, Buffer needs to send requests to the Twitter API *on the user's behalf*. Twitter needs to provide some way for its users to delegate control of their account to other platforms.

### OAuth

The industry standard protocol for allowing users to grant third-parties API access to an account is called OAuth[LINK]. We won't go into the details of how it works here. It is a standard flow that allows Buffer to request an API key from Twitter to access your account, and for Twitter to first confirm with you that you would like to grant them one.

Done well, OAuth allows users to safely delegate access to their account. When a third-party requests access to your account, the platform should require them to specify which permissions (sometimes called *scopes*) they would like to request. For example, Twitter allows platforms to request any of:

* Read-only access: allows the third-party to read information like the user's Tweets, timeline, and user profile
* Read and write access: also allows them to make changes such as post Tweets, follow new users, and update their profile. Does not allow Direct Message (DM) access.
* Read, write, and DM access: also allows access to read, write, and delete DMs

These levels of permissions allow users to delegate differing levels of access to their account based on what the third-party legitimately needs to do to their account, and how much they trust them. For example, in order to perform its job Buffer needs read and write access to your account. Buffer seems like a legit company, so if I wanted to schedule my whimsical Tweets I would feel comfortable giving them this access. However, even though they're a legit company, I wouldn't give them access to read my DMs, because they don't need to.

I would generally feel pretty comfortable giving any service on the internet read-only access to my account, since I have all my settings set to public.

When you delegate access to an account to a third-party, you don't just have to worry about the possibility that that company will go rogue and abuse it. You also have to worry about the possibility that they will get hacked. The only thing that Twitter can use to verify 


If a hacker steals the API keys that Twitter gave them on your behalf, 

Tweets from important people can move markets. Tweets from my account would struggle to move anything, but I still don't want to expose myself.



Twitter keeps track of which applications you have granted access to, and allows you to revoke that access if you change your mind.



Twitter labels the key as having been requested by that application, and adds it to a list of authorized applications in the user's dashboard. The user can revoke the API key at any time, cutting off the third-party's access to their account.

### Bad alternatives to OAuth

A quick, unwise, but technically viable approach would be for Twitter to provide users with an API key in the way we've seen so far, and for users to copy this API key over to every service to which they want to delegate control of their account. This is bad for several reasons:

1. It's a clunky user experience.
1. It's too coarse. Every app that the Twitter user wants to delegate control of their account to gets the same key. This means that Twitter can't tell the user who made a particular API call, and means that the user can't give different services different levels of access to their account. For example, I might want to give Buffer the power to create Tweets on my behalf, but only give a less trustworthy app the ability to access my followers list.
1. This also means that revoking permissions from apps that I no longer want to allow access to my account is too coarse. Since all apps have the same key I have to disable the key altogether, cutting off both trustworthy Buffer and untrustworthy Steal My Bitcoin[TODO].

The solution is to provide different applications with different API tokens. These tokens are tied to a specific application, and are imbued with a specific set of privileges chosen by the user or requested by the application (eg. create Tweets, read followers, but not read DMs). When Twitter receives a request with a particular API key, it can look the key up in their database and see "this is a key for @RobJHeaton's account, delegated to Buffer, with the permission to create Tweets." If a user wants to revoke an application's access to their Twitter account, they can cancel that application's API key from their Twitter dashboard.

A simple but clunky way to distribute different API tokens to different applications would be to stick with copy-pasting API keys from the Twitter dashboard into the application's dashboard. The only difference is that now the user creates a new API key for each new application, labels it with that application's name, and chooses the permissions that they want to give it.

This is certainly a better model than the single API key one, and once again it would technically work. However:

1. It's still clunky and difficult to explain, especially to users who aren't programmers themselves
1. It's error prone. The user might give the API key a misleading name, or give it more or fewer permissions than they intended.






In this context the key might more often be called something like a "user access token" than an API key but the principle is the same.

## Advanced topic: Retries and timeouts

When you send an API request, the server on the end will do its best to fulfil your request. However, no matter how reliable and well-written the service, sometimes something will go wrong. If someone says that their API never fails, they are wrong. If someone says that an API call they are making will never fail, they are also wrong.

Maybe the service is getting overwhelmed with user traffic, or with a malicious denial-of-service attack. Or maybe a new release of the service is deployed, with a subtle bug that causes your request to error out and that was not uncovered in testing.

It's wise to account for the possibility and inevitability of such errors in your own code. One way to start might be to add *retries* to your API calls. This means that if an API request fails, you try it again. You can technically retry a request as many times as you like until it succeeds, although it is prudent to limit the number before you give up. It's bad manners to keep hammering away with your retries forever and ever. If a request doesn't succeed after 3 or 4 attempts then there's a good chance that something is seriously wrong and it won't succeed after 50 more. You might even be exacerbating a problem of too much traffic. It's also advisable and further good manners to wait a little before retrying a failed request.

You shouldn't blindly retry every failed request. Requests can fail because of an error on the API server, but CONTINUE



Since API requests might fail completely, even with retries, you should still have code that deals with failure gracefully.




It's perfectly reasonable to decide that you're not going to bother making your program robust to API failures at this point. Just make sure that you understand what the consequences of a failure would be. If vital medicines won't get to where they need to be then you should spend the extra time to add retries and robustness, or at least loudly alert someone if something goes wrong. If a like won't get added to a Tweet then perhaps you can feel OK about cutting this corner for now.



Timeouts are awkward - you don't know whether the server has succeeded but just hasn't told you, has half succeeded (should be the API creator's job the make sure this never happens), or has completely failed. How you deal with it depends on the business context. If you're making an API request to transfer money, you should see whether it succeeded. If you're trying to follow a new user on behalf of a user on Twitter, you could simply try again. If the follow succeeded first time then you'll hear about it.

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




## Advanced (or normal?) topic: JSON vs XML vs ...




## Advanced: pagination



## Advanced: API keys and logging

Side note: an API provider could technically ask programmers to pass the API key in the *query string* of the URL, for example:

`TODO`

However, requiring an API key to be sent in this way would be frowned upon (at least by me, albeit in a friendly, supportive manner). It's best to keep secrets like API keys out of URLs where possible, because URLs are liable to be logged by the API provider's applications to help with monitoring and debugging. Including secret values in URLs makes previously benign log files into troves of secret information that is functionally equivalent to a password. This makes it much more valuable to hackers, and easier for malicious internal employees to abuse as well.


## More topics

Show Twitter using its own API under the hood
Rough structure of an HTTP request
Multiple API keys. If you work in a big company you might have a key for reading that you distribute fairly widely, and another for writing or admin that you keep locked down.
API key secrecy. Don't commit to git. Bad guys look for keys in GitHub. So some companies scrape GitHub looking for leaked keys to find them first.
Basic client server model - wtf is actually going on
Stripe API PCI cleverness

Call your external APIs in ways that can handle failure

Use telnet to prove that HTTP is just a text thing



https://developers.asana.com/docs/how-to-use-the-api this is really good
TODO: steal some of the careful intro text





https://openapi-generator.tech/

API client libaries make getting started with and using an API substantially easier, although the code inside them is not particularly complex. If you come across an API that you want to use that 




In the same way that clear UIs make it easy to interact with a tool and get it to do what you want, clear APIs make it easy to interact with a system and get it to do what you want. And in the same way that designing a clear UI is much harder than it looks, so is designing a clear API.




Library code runs as part of the same program that the programmer is working on, on the same computer. However, programmers also talk about completely separate systems (such as Asana) having APIs that other programs talk to over a network (such as the internet). Asana's API defines the ways in which other computers can communicate with Asana. If you send us an HTTP `POST` request to `https://app.asana.com/api/1.0/tasks` with these parameters, we'll create you a new task.




As we've seen, "API" is a general term that can be used to describe many different ways in which pieces of code communicate with each other. However, most of the time when you hear people ask questions like "does this product have an API?" or "have you worked with APIs before?" they are probably referring to a set of HTTP endpoints that programs can interact with over the internet in order to cause a system to do something.


I could choose a random article from the front page of Google, skim it, and tell you that this is a good explanation, but I think you'll be better off Googling yourself.


https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/


Software systems are extremely powerful and capable of doing many different things. However, they need some way of telling other parties how they can communicate with the system. There will almost certainly be many capabilities that they do *not* expose to other parties. A silly example: no product has an API endpoint for "send me your entire password database", even though it technically could. Clearly defining an API allows a system to tell its users and consumers what they can use it for, and what they can't. Programmers talk about a library having an API, which is the different methods that it allows other programmers to call.

https://www.airbnb.co.uk/partner
Some APIs want to be secret and restricted

https://developers.google.com/maps/documentation/javascript/get-api-key
Prob not from browser, but maybe

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

