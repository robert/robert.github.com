https://news.ycombinator.com/item?id=26225373



You’ve started yet another company with your good friend, Steve Steveington. It’s an online marketplace where people can buy and sell things and where no one asks too many questions. It’s basically a rip-off of Craigslist, but with Steve’s name instead of Craig’s.

You're responsible for building the entire Steveslist platform. However, while you do know how to build small web apps, you have no idea how to build a system capable of scaling to millions of users before your investors notice all the accounting fraud that CEO Steve Steveington is no doubt commiting behind your back. You've therefore enlisted your less-good-but-still-mostly-reliable friend, Kate Kateberry, to help fill in some gaps in your knowledge. She's already given you an excellent primer on systems design[LINK], the transcript of which picked up a cool 945 points on Hacker News[LINK]. You don't like to boast, but since internet points can't buy sandwiches or make your alimony payments or fill the yawning void inside of you where your hopes and dreams and principles used to be, boasting seems to be the only use left for them. You think that the marketers call this "social proof".

You found Kate's systems design primer very insightful, well-structured, and empathetic. Now you want to ask her to explain HTTP to you [TODO: gentler intro to HTTP]. You've realized that even though you use HTTP all day every day and sort of get what it is and how it works, the details are a little fuzzy. You know that it's the protocol that underlies a large portion of the web. You've used the Chrome Developer Tools to debug simple HTTP-related problems, and you know what a 404 page is. You can usually muddle through the tasks in front of you, using libraries and hand-waving to get the job done, after a fashion. However, as the Steveslist platform has become more complex, you've started to think that it might be useful to understand HTTP in more depth. This will help with fixing more complex problems, structuring your systems to be more reliable and efficient, and might even be a little interesting.

You especially want to know:

* How HTTP works
* How HTTP is used in the real world
* The most important features of HTTP
* Why these features exist and how they relate to the real world
* How to work with HTTP in your own programs
* How HTTPS keeps HTTP messages private
* Case studies of interesting uses and side-effects of HTTP, such as how to snoop on HTTP requests made by applications on your computer or phone

You know just the person who is contractually obliged to help.

----

Kate Kateberry trudges into the Steveslist office in the 19th century literature section of the San Francisco Public Library, ready for yet another day of changing the world and making Peter Thiel richer. Before she has a chance to start her morning ritual of scrolling through Twitter until 3pm, you ask her if she can give you a concise, yet detailed, yet real-world-relevant overview of the HTTP protocol. 

She is surprisingly enthusiastic. You wonder if she's seen a scam that you've missed, or if maybe you're just paying her too much. She bounces over to the whiteboard. Before she can start, you ask if you can skip all the basics about `GET` and `POST` and so on, since you already know all that stuff. I'm sure you know that `GET` and `POST` exist, Kate replies, but do you know *why* they exist? Why does HTTP bother with them? Why doesn't HTTP keep things simple and just have a single type of request?

[TODO: don't mention GET/POST etc]

You aren't sure. This, says Kate, is just one of the many nuances that we will learn about today.

You start taking notes.

----

### What is HTTP?

HTTP stands for *Hyper Text Transfer Protocol*. HTTP was originally designed by Tim Berners-Lee at the dawn of the internet, and is the protocol that underlies most of the web. Whenever you use a web browser or an app to load a website, image, or any other kind of data, there's a very good chance that you're doing so using HTTP.

[TODO: what is a protocol? Gentler]

HTTP is a client-server protocol. This means that software running on servers sits around waiting for incoming requests, and an HTTP conversation only happen when a client (like your phone or computer) initiates one. For example, when you click on a profile in the Facebook app, the app requests the different pieces of data necessary to populate the profile page. It does this by sending HTTP requests to the Facebook server. It probably sends one HTTP request for the profile data, one for each image, and maybe one for the user's latest timeline posts. When the Facebook server receives one of these requests it retrieves the requested data and sends it back to your phone in an HTTP response.

[TODO-PIC] of sitting around waiting

Your phone doesn't act as an HTTP server, and it doesn't listen for incoming requests in the same way that Facebook servers do. This means that Facebook can't pro-actively contact your phone directly. Even though Facebook is famous for smuggling data out from your devices, they can only do this by writing code in their app that sends it to them.

[TODO-PIC] of phone ignoring incoming requests

### Where is HTTP used?

The most prominent usage of HTTP is when a browser retrieves a web page from a web server. Browsers use HTTP to retrieve HTML, JavaScript, images, videos, or any other kind of data.

HTTP is also often used to query APIs. "API" stands for Application Programming Interface, although no one ever calls them that. An API is a intermediary that allows two programs to talk to each other. For example, the Facebook API allows programmers to write programs that talk to Facebook, instead of requiring a human to click around a browser or app. APIs can allow programmers to retrieve data (like a list of a user's friends) or write new data (like creating a new status update).

Companies can use any protocol they like in their APIs, but HTTP is a sensible default. To use an HTTP-based API a client sends the server an HTTP request describing the action that it wants the server to perform. The request usually includes an authorization key that verifies the client's identity. The server performs the action, and sends back an HTTP response.

There's no difference in HTTP when it used by a browser, an app, or a custom program that queries an API. HTTP requests are structured the same, irrespective of the client that sent them. The data in the HTTP responses might be different; browsers will often get back HTML webpages, whereas apps and custom programs might get back structured data in a format like *JSON*. Even this is a poor dividing line, since webpages increasingly query the same API endpoints as other API clients. In all cases the protocol is still fundamentally HTTP, and it hardly matters what the devices on either end of the exchange are.

An HTTP client can be any device that needs to retrieve data from a remote server: a web browser, a phone, a PlayStation, or a smart-fridge. An HTTP server can also technically be anything that is capable of listening for and responding to incoming HTTP requests. In practice servers are almost always big computers sitting in a data center. But if you were determined enough you could probably hook up a website that was powered by your smart-thermostat, and it is genuinely possible (if hard work) to run a web server from a laptop in your front room. HTTP is a common and sensible choice for any devices that need to exchange data over a network.

### Abstraction

There's a lot that goes on behind the glib statement "the client sends an HTTP request to the server". How does the client know where to send its data? How does the server know where the data came from? How is it possible that an entire movie can be transmitted across oceans and under cities within seconds without losing any of its fidelity or emotional power?

The rules of HTTP are responsible for specifying the structure of the messages that clients and servers exchange with each other. HTTP works at the level of an application, and so is often described as an *application-level protocol*. However, HTTP doesn't say anything about *how* HTTP messages should travel between clients and servers. That's the job of a *network-level protocol*. In practice almost all HTTP requests are exchanged using the TCP and IP protocols. The responsibilities of the different layers are well-separated. TCP/IP is responsible for moving data between computers; HTTP is responsible for how that data is structured.

As a user of HTTP you rarely have to worry about the details of TCP/IP and other lower-level protocols if you don't want to. The same kind of separation applies when sending a letter. The postal service is responsible for getting letters from A to B; you are responsible for the contents of those letters. You don't have to care how the postal service works after you drop off your letter; the postal service doesn't have to care what's in your letter.

[TODO-PIC] of differen layers

If you're interested then you can learn about the myriad layers that reside underneath and alongside HTTP - TCP, IP, Ethernet, DNS, SSL/TLS, and many more. This will be useful and interesting. However, if you don't have time or these technologies aren't where your interests lie then you can also focus on the things that you do care about. You can leave things at "the client sends an HTTP request to the server" and trust that the pieces of software that other people have built will do their jobs without you. This hiding of details is known as *abstraction*.

-----

Nonetheless, says Kate, understanding the lower-levels of any system should always help your understanding of the higher-levels too. That's why the goal of today's lecture isn't to give a comprehensive overview of every flag and option of HTTP. Instead it's to give a flavor of the protocol, including seasonings that you won't find in core documentation or brief primers.

I'm already here, you think, you can cut the sales pitch.

-----

### Life and death of an HTTP conversation

When an HTTP client communicates with a server:

1. The client opens a *TCP connection* with the server. You can think of a TCP connection as a pipe that the client and server use to send information to each other. To open a new connection, a client sends a message to a server that is listening for incoming TCP connections. The server sends back a message to the client, the client and server exchange a few more introductory formalities, and by the end they have a reliable connection that they can use to exchange data. The full details of TCP are a whole new story on their own, but thanks to abstraction, you don't need to know about them if you don't want to.
2. Shortly before or after opening a TCP connection, the client builds an HTTP request containing the data that it wants to send to the server. An HTTP request is nothing more than a carefully structured block of text (we'll talk much more about this structure shortly), so this step is like the client writing a letter to the server before sending it in the next.
3. The client sends the HTTP request it built in step 2 to the server via the TCP connection that it established in step 1.
4. The server receives the client's HTTP request. Because the server knows about the HTTP protocol and how HTTP requests are structured, it can parse the request and understand what it means. Depending on the contents of the request the server might perform an action and/or retrieve some data.
5. Once the server has finished its work, it sends an HTTP response back to the client over the same TCP connection from step 1. This response should contain either the data that the client requested, or an explanation of the work that the server did (eg. "I successfully created a new message").
6. The client receives the HTTP response. It parses it and uses the data. For a web browser this might be displaying a web page; for a travel website this might be saving flight details to its database.

HTTP is almost entirely concerned with requests and responses. Let's see what these messages look like.

### HTTP requests

HTTP requests are made up of 5 components:

* HTTP method - a parameter that usually describes the type of action to be performed (examples include `GET`, `POST`)
* Request target - the resource that the request will act on (eg. `/about`, `https://google.com/search`)
* HTTP protocol version - the version of the HTTP protocol that the request uses. Most commonly 1.0, 1.1, or 2.
* Headers - metadata about the request (eg. cookies, the type of response expected, data about caching)
* Body - the main block of data (if any) that the client wants to send to the server (eg. the body of a message to be created, or the details of an item to be purchased)

[TODO-PIC] - example HTTP request

Here's an example HTTP request that your browser sends when it wants to request the page `robertheaton.com/about` from my server:

```
GET /about HTTP/1.1
Host: robertheaton.com
User-Agent: curl/7.54.0
Accept: */*
TODO
```

Here's another HTTP request that a merchant might send to the Stripe API in order to charge a customer's credit card:

```
TODO
```

If you have a working understanding of each of the above components then you'll be able to understand most uses of HTTP. If you encounter any nuances or edge-ecases ("how exactly does *CORS*[LINK] work again?") then you can research them on-the-fly. Very few people have, and no one should expect, an encyclopedic knowledge of any protocol. When you do need to sweat the details the Mozilla Developer Network (MDN) docs[LINK] are very thorough yet approachable.

Let's go through each component of a request and get you that working knowledge.

### Request target

The *request target* of an HTTP request is usually a URL path, such as `/articles/123`. The request target typically describes the resource that the HTTP request wants to act on. For example, an HTTP request with a target of `/articles/123` is probably going to act on the article with ID 123. An HTTP request with a target of `/posts/456/comments` is probably going to act on the comments of the post with ID 456. Note that the request target doesn't fully define *how* the request will act on the resource, for example whether it will create, read, update, or destroy it. This is defined by the combination of the target and the *HTTP method* (see below).

Sometimes a request target refers directly to an actual file on the server. One way of running a website is with a simple server program like the Apache HTTP server[LINK]. You can tell Apache to respond to HTTP requests by looking up the URL path of the request relative to a root directory on the server's hard disk. For example, suppose that you configure the root directory to be `/var/www/html`. Then, if your server receives an HTTP request for `/images/pineapple.jpg`, the server looks to see if it has a file saved on its disk at `/var/www/html/images/pineapple.jpg`. If it does, it reads and returns the file's contents; if not, it returns a 404 error.

[TODO-pic] how apache works

Note that servers using this approach have to be careful to reject malicious requests for sneaky paths. For example, a request to `GET /../../../etc/passwd`, if treated naively, could end up returning the file at `/var/www/html/../../../etc/passwd`. Since `..` means "go up a directory", this path resolves to `/etc/passwd`, the file containing a Linux system's passwords.

This simple approach of mapping paths directly to a file system used to be more common at the dawn of the internet, when a website was nothing more than a collection of static files. Nowadays most websites are much more complicated and contain mostly dynamic content. These websites run more complicated server software that dynamically generates webpages and other responses instead of reading and serving pre-generated files from a server's hard disk. [TODO: FB doesn't have your profile saved on disk]

### HTTP methods

Every HTTP request has an *HTTP request method*. The request method usually dictates *what* the request will do to the resource in the request target. There are many conventions around which method should be used for which type of action. As we will see, these conventions provide useful hints to clients about how they should treat requests and responses. [TODO: common methods are GET/POST/etc]

For example, responses to `GET` requests usually contain a representation of the target resource in their *response body*. The form of this representation depends on the context. `GET` requests for webpages that will be displayed in a browser should usually return HTML; requests to an API should usually return data in a more structured format such as *JSON* (more on which later). Both are valid ways to respond to a `GET` request, and it's up to the programmers writing the server software to return data in the most appropriate form.

There are 9 HTTP methods in total[LINK]. Other common ones include:

* `POST` - typically used to create new resources. A `POST` request to `/articles` should create a new article.
* `PUT` - typically used to update existing resources. A `PUT` request to `/articles/987` should update article 987
* `DELETE` - typically used to delete existing resources. A `DELETE` request to `/articles/333` should delete article 333. 

You may have noticed that I've been using a lot of weasel-words like "should" and "likely". This is because all of these "rules" about what different HTTP methods should do are only conventions and best-practices. There's nothing stopping a programmer from having a `GET` request to `/home` delete a user's account, other than hopefully their colleagues' code review.

Indeed, HTTP request method conventions are routinely broken in situations where the payoff is deemed worth it. For example, consider "magic login links". Some websites don't login their users using a username/password form. Instead they ask a user to submit just their email address. The website then generates a long, secret, random token, and saves it to a database alongside the user's ID. The website then sends the user an email containing a "magic login link", the URL of which contains the random login token:

`https://socialnetwork.com/login?token=3873278132h181432hs12d178924nc17982t1dgj9jg89`

When the user clicks on the link, the website reads the token from the HTTP request path and looks up the user associated with the token in its database. Because the token is long, secret, and random, the website concludes that the only way that the sender of this HTTP request could have known about it is from the email containing the magic login link. The website therefore concludes that the requestor is also the owner of the email account associated with one of its users, and so logs the requestor in automatically, without the need for a password.

[TODO-PIC]

Username/password forms are usually submitted using `POST` requests. This is because `POST` requests are conventionally used to create new resources, and logging in creates a new *session* on the website. However, when a user clicks on a vanilla link, such as one in an email, their browser requests it as a `GET`. It is possible for a website designer to have links on their site trigger HTTP requests that use other HTTP methods (including `POST`), but this requires JavaScript or HTML forms, neither of which are allowed in emails. This means that magic login links have to send `GET` requests that cause the user to become logged in. This is a violation of the convention that `GET` requests should only ever return information, and should not "do" anything or cause anything to change on the server. But rules were made to be broken, and magic login links are generally seen as a convenient and reasonably secure way to authenticate users.

HTTP could have been designed without any concept of HTTP methods, with instead only a single "type" of HTTP request. In actual, real HTTP, you would expect to use the HTTP path `/articles` in order to both create and list articles. The thing that differentiates these requests from each other is the HTTP method:

* Retrieve a list of all articles: `GET /articles`
* Create a new article: `POST /articles`

However, one can easily imagine a world without HTTP methods. In this world, all the information about the intent of a request would be contained in the URL path:

* Retrieve a list of all articles: `/articles/list`
* Create a new article: `/articles/create`

This approach would work. However, the conventions around HTTP methods give clients standardized hints about the behavior of a HTTP endpoint. These hints can be very useful, and would not be available in the world without HTTP methods. Two such hints that HTTP methods give are about a request's *safety* and *idempotency*.

#### Safety

It is useful for a client to know whether an HTTP request will be *safe*. A safe request is one that doesn't change any state on the server. It doesn't write any new data, and it doesn't update any existing data. All it does is read and return data. When a client makes a safe request, it can be confident that it won't cause anything to change on the server. 

Convention says that all `GET` requests should be safe (as should much rarer `HEAD`, `OPTIONS`, and `TRACE` requests), but that `POST`, `PUT`, and `DELETE` requests may not be. This is a useful property because it means that web crawlers can safely automatically click on links, and browsers can safely pre-load data like the top Google result for a search. So long as all the requests they send are `GET`s, the crawlers and browsers can be confident that they won't change the state of the server, and so won't cause any problems for website operators.

The fact that `GET` requests are safe is useful in other situations too. When you type a URL into your browser address bar and press enter, your browser always requests this URL using an HTTP `GET` request. Since `GET` requests should only ever return data, not mutate it, this means that typing a URL into your browser is always "safe". You can be very confident that visiting `https://facebook.com/account/delete` in your browser isn't going to accidentally delete your account. If there was only one type of HTTP request, you would have no such guarantee.

#### Idempotency

A request's HTTP method also indicates whether the request is *idempotent*. An idempotent request is one for which the effect on the server of sending it multiple times is the same as sending it once. This means that you can happily send the request as many times as you like without worrying about how many of these requests are actually received and actioned. If you are not sure whether an idempotent request was received and actioned, you can keep sending it until the server acknowledges it.

Requests that create a new resource of some kind will often not be idempotent. Consider a request that asks your online bank to transfer £100 to your friend. If you re-send the exact same HTTP request twice in succession then, unless the server has mitigations in place (see below), it has no way to know whether this was an accident or whether you really do want to make a second transfer. The server has no good options: either it sends the second transfer and risks sending too much money if the request was a mistake, or it ignores the second request and risks sending not enough money if the request was deliberate.

This is why your browser will sometimes warn you when you refresh a webpage that was returned from a `POST` request.

[TODO-screenshot]

In order to refresh the page, your browser knows that it will have to re-send the `POST` request that generated it. Your browser doesn't know how the server will process this re-sent request. But, thanks to the hints afforded by HTTP request methods, it knows that `POST` requests may not be idempotent. It can therefore still warn you that you might be about to cause an action to re-trigger. Without HTTP request methods, it would not be able to make this inference.

Applications can and should be structured so as to make more of their actions idempotent, reducing the opportunity for error. Where possible online shops shouldn't simply send themselves HTTP requests saying "customer ABC wants us to charge them £250". Instead their requests should say something like "customer ABC wants us to charge them for order number 123". If order number 123 has already been paid for then the application knows that they should ignore any subsequent duplicate requests. The first form of this operation is not idempotent, but the second one is.

Some APIs turn non-idempotent requests into idempotent ones by using *idempotency keys*. When a client makes an API request, they also generate and include a long, random string called an idempotency key:

```
TODO example HTTP req includeing idem key
```

If the client isn't sure whether a request succeeded (perhaps because of a bug in their program, or a problem with their network), the client should send the same request again *with the same idempotency key*. When the server receives an API request that includes an idempotency key, the server checks to see whether it has already processed a request from the user with that key. If it has not, it processes the request as normal and saves a record of the idempotency key that was used, along with the HTTP response that it returned. On the other hand, if the server has already seen the key, it knows that it should not process the identical request again. Instead, it returns the response that it returned previously and has saved in its database. By using this approach a client can make sure that it does not accidentally use an API to make the same non-idempotent request twice.

[TODO-pic] flowchart of idempotence key

For a real-world example of idempotency keys, see the Stripe API documentation for them[LINK].

Since `GET` requests are safe and don't change the state of the server, they should always be idempotent by default. Your browser will never warn you that you are refreshing a page that was returned from a `GET` request. Other types of requests may be idempotent by default too, for example, `DELETE` requests that delete a resource. If the resource hasn't been deleted, the server should delete it. If it has already been deleted, then it can sensibly ignore the request. The effect of sending the request multiple times is therefore the same as sending it once, which is the definition of idempotency.

[[[TODO: why are we moving onto this section? What's going on?]]]

### HTTP request parameters

An HTTP request's HTTP method and path describe the action that a request should perform. However, many actions also require additional parameters in order to be carried out. Clients can't just say "create a new article"; they also need to provide information about the article's title, body, tags, and so on. Even read-only operations like "list all articles" may requrie filter parameters like a specific author, date, and so on. There are two main ways of passing parameters in an HTTP request: the *query string*, and the *request body*.

#### [TODO - Option 1?] Query string

The query string is an optional section of a URL path, separated from the base URL by a `?`. For example, consider the following URL:

`https://newspaper.com/articles?author=Robert%20Heaton&year=2020`

The base of this URL is `https://newspaper.com/articles`, and the query string is `author=Robert%20Heaton&year=2020`. Query strings usually encode multiple parameters using a `key=value` syntax that looks like `?key1=value1&key2=value2` (although this is just s useful convention, and clients can put whatever data they like there). We can expect that a `GET` request to `https://newspaper.com/articles?author=Robert%20Heaton&year=2020` will return all articles written by Robert Heaton in the year 2020.

`GET` requests should provide all their parameters in the query string. By contrast, `POST` or `PUT` requests usually pass their parameters in the HTTP *request body*.

#### Request body

A request body is a blob of arbitrary text that is attached to the end of an HTTP request.

[TODO-PIC]

Just as for query strings, the HTTP protocol does not make any requirements for how a request body is structured. Clients are free to send whatever data in whatever form they like. As always, however, there are conventions and standards that most applications adhere to. For example, many modern APIs require parameters to be sent using *JavaScript Object Notation*, more commonly known as JSON.

#### JSON

JSON is a *serialization format*, which roughly means that it's a standardized way to represent data in a form that can be easily shared. JSON is by no means the only serialization format available. Older APIs might use *XML*; newer ones might use *protobuf*. You could even invent your own, although I wouldn't recommend that you use it in production.

JSON looks very much like the maps, dictionaries, lists, and arrays that you might use when you're writing a program. For example, suppose that you want to send an API request to create a new article. In order for the server to be able to create your new article, it will need to know several extra parameters, such as `title`, `body`, `tags`, and `author`. The API's documentation will tell you how to structure the JSON that you send it. One reasonable specification might look something like this:

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

All JSON is also valid JavaScript code - you can copy and paste a blob of JSON into a JavaScript program and it will immediately understand it. However, almost every language has standard libraries for parsing JSON and converting it into that language's own internal data structures. For more information on JSON standards, see json.org[LINK].

#### HTTP headers

TODO




HTTP requests are only half of the story. We also need to consider HTTP responses.

### HTTP responses

When a client sends an HTTP request to a server, the server parses the request, performs an action, then sends back an *HTTP response* to the client. This response should tell the client whether their request succeeded and return any data that the client requested. HTTP responses are different to HTTP requests, but they look similar and share some features. They are made up of 3 main components:

* Status line - a description of whether the request succeeded. Uses HTTP status codes to indicate the broad category of outcome (eg. OK, Not Found, Internal Server Error).
* Headers - metadata about the response. Response headers use the same structure as request headers, but their contents will typically be different (eg. new cookies that the client should set, the filetype of the response)
* Body - the main block of data that the server returns to the client. Might be a webpage, an image, some JSON data, a JavaScript file, or something else entirely.

It's possible that if something goes seriously wrong (eg. the server literally explodes half-way through processing the request, or the client loses its internet connection) then the client might not receive an HTTP response. However, this should be rare, and in all other situations every request should receive exactly one response.

#### Example HTTP response

Here's an HTTP request to `example.com`:

```
GET / HTTP/1.1
Host: example.com
Accept: */*
```

And here's an HTTP response to that request. You can see the status line (`HTTP/1.1 200 OK`) indicating that the request succeeded, then the headers (some of which I've snipped out for brevity), then a newline, and finally the HTTP body containing the HTML for example.com that is displayed by your browser:

```
HTTP/1.1 200 OK
Age: 601062
Cache-Control: max-age=604800
Content-Type: text/html; charset=UTF-8
Date: Fri, 13 Nov 2020 08:59:45 GMT
Etag: "3147526947+ident"
Expires: Fri, 20 Nov 2020 08:59:45 GMT
Last-Modified: Thu, 17 Oct 2019 07:18:26 GMT
Content-Length: 1256

<!doctype html>
<html>
<head>
    <title>Example Domain</title>

<...snip...>
```

Let's look at some of the components of HTTP responses in more detail.

#### HTTP response codes

A response's HTTP response code (also often called its *status code*) is a number that tells the client what happened to their request. When written out, numeric response codes are often followed by a string describing the code to make them easier for humans to read (eg. `404 Not Found`). If a request failed, the response's status code describes the broad category of what went wrong. Some of the most common codes are are:

* `200 OK`: The request has succeeded
* `400 Bad Request`: The server could not understand the request due to invalid syntax or parameters
* `403 Forbidden`: The client is not allowed to access the content 
* `404 Not Found`: The server can not find the requested resource. You've probably seen this in your browser many times. For an example, see eg. https://robertheaton.com/THIS_PAGE_DOESNT_EXIST[TODO]
* `500 Internal Server Error`: The server has encountered a situation it doesn't know how to handle. Often suggests that the server's code threw an exception while processing the client's request.

Response codes come in five groups:

* Informational responses (those that begin with a 1, also written as 1xx): an interim response sent while a request is being sent. For example, `100 Continue` indicates that the server has received part of the client's request and nothing has gone wrong yet. You will rarely have to deal with `1xx` responses.
* Successful responses (2xx): the request succeeded. The exact response code may give some extra color.
* Redirects (3xx): a redirect status code means that "further action needs to be taken by the user agent in order to fulfill the request" (taken from the HTTP spec[LINK]). A redirect usually tells the client that the resource has moved to a new URL, and that the client should make a new request to that URL. For example, I've set up `https://robertheaton.com/redirect-example` to return a `3TODO` response that tells the client to retrieve its requested resource by making a new request to `https://robertheaton.com/about`. Web browsers usually follow redirects automatically - try visiting the above link to test this out[LINK].
* Client errors (4xx): there is a problem with the request because the client did done something wrong (eg. invalid parameters, non-existent resource)
* Server errors (5xx): the server has done something wrong (for example, there was a bug in the server code that threw an exception) and the server is unable to complete the request.

You can read the full list of response codes on MDN[LINK-https://developer.mozilla.org/en-US/docs/Web/HTTP/Status].

#### HTTP response body

The HTTP response body contains a blob of information that answers the client's request. Just like with request bodies, the HTTP protocol places no restrictions on how a response body should be structured. The body might contain a webpage, an image, an Excel spreadsheet, or something else.

A sensible structure for a response body may depend on the context of the request. A `GET` request to the path `/articles/123` should return some sort of representation of article number `123`. If `/articles/123` is a website that is intended to be viewed in a browser then the represenation should likely be formatted as HTML:

```html
<html>
    <head>
        <title>Article #123 - BIG NEWS</title>

...etc...
```

On the other hand, suppose that `/articles/123` is actually an API endpoint used by programmers inside data analysis companies to retrieve news articles for linguistic analysis. In this case, the response should likely contain a representation of the article formatted using a serialization format like JSON:

```json
{
    TODO
}
```

A company might want to allow its users to view their data through both a webpage and an API. To achieve this they might have two sets of HTTP endpoints; one for browsers to view articles as HTML (eg. `/articles/123`), and another for programs using the API to view articles as structured data (eg. `/api/articles/123`). 

### HTTP 1.x vs HTTP 2

TODO

### Sending HTTP requests from your own code

We all send hundreds, possibly thousands of HTTP requests from our web browsers and other applications every day. But how can you harness the power of the internet in your own programs? How can you write code that contacts an API, scrapes a webpage, or downloads an image? How can you write code that makes HTTP requests?

Almost all mature, high-level programming languages have libraries that help construct and send HTTP requests. This means that you don't have to remember whether the HTTP method goes before or after the URL, and you don't have to remember whether headers should be sent in any particular order. You certainly don't have to remember or even know about how TCP networking works. This is *abstraction* at work again, reducing the surface area of what you need to think about.

For example, the Python `requests` library allows you to make HTTP requests by writing code that looks like this:

```python
import requests

requests.get("TODO")
```

Libraries like `requests` provide functions and arguments for every part of the HTTP specification: adding parameters, using different HTTP request methods, reading headers, following redirects, using cookies, uploading files, and all the rest. 

```python
import requests

# Send parameters in a POST request body
r = requests.post(
    'https://httpbin.org/post',
    data={'key':'value'},
)
# Set HTTP request headers
r = requests.get(
    'https://api.github.com/some/endpoint',
    headers={'user-agent': 'my-app/0.0.1'},
)
# Upload a file
r = requests.post
    'https://api.github.com/some/endpoint',
    files={
        'file': open('report.xls', 'rb'),
    },
)

# Raise an exception if the request failed
# (status codes 400 and up indicate an error)
if r.status_code >= 400:
    raise Exception(f"Error sending request: {r.status_code} {r.text}")
```

`requests` has extensive documentation[LINK] that shows many more example uses.

Practice writing programs that makes HTTP requests. Search `http client library $YOUR_LANGUAGE`, and read the documenation. Try writing a program that sends and retrieves data to and from an API, or a web scraper that politely scrapes information from your favorite websites (search `how to write a web scraper` for inspiration).

HTTP client libraries are powerful, but sometimes you just want to fire off a quick HTTP request without having to write a whole program. In these situations you may want to turn to a command line tool like *`curl`*.

#### Sending HTTP requests from the command line: `curl`

Suppose that you want to get a quick and dirty idea of what data a request returns. Maybe you want to see whether passing a particular header changes the response you get back from a server, or see whether you're even able to connect to a particular URL. You don't want to setup and write a whole program, but you might find `curl` useful instead.

`curl`[LINK] is a command line tool available on most operating systems, including Linux, macOS, and Windows. It allows you to send HTTP (and other protocol) requests from the command line by running commands like this:

```
$ curl https://robertheaton.com
```

This command will send an HTTP request to `https://robertheaton.com` (as a `GET` request by default) and print the response. `https://robertheaton.com` is a webpage, so a request to it returns HTML:

```
$ curl https://robertheaton.com
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Robert Heaton</title>
<...snip...>
```

You can add the `-v`, or `--verbose`, flag in order to tell `curl` to print information about the low-level actions it is performing. This can be particularly helpful for learning about the details of HTTP and networking, or for debugging when something goes wrong. You can apply `-v` up to three times for maximum detail:

```
$ curl https://robertheaton.com -vvv
* Rebuilt URL to: https://robertheaton.com/
*   Trying 104.18.33.191...
* TCP_NODELAY set
* Connected to robertheaton.com (104.18.33.191) port 443 (#0)
* ALPN, offering h2
* ALPN, offering http/1.1
<...snip...>
```

Try running `curl https://robertheaton.com -vvv` from your command-line now. If your shell tells you that you don't have `curl` installed, look up how to install it for your operating system. Use `curl` to query other URLs, see what you get back, and keep `curl` in mind for when you want to have an experimental poke at an HTTP server.

### Sending artisanal HTTP requests by hand

HTTP libraries, `curl`, and web browsers all take care of assembling and sending HTTP requests for you. You will almost certainly go through your entire life without ever needing to construct an HTTP request yourself. This is not cheating; it frees you up to focus on the parts of your systems that matter.

That said, it can still be instructive to hand-roll your own requests once or twice. The HTTP requests and responses that we've been looking at aren't just human-readable summaries of more complex structures; they are literally the data that a client sends and a server parses. There are complications to this tidy model; the client may use SSL/TLS to encrypt the data before sending it (see the section on HTTPS below), and the newer HTTP/2 protocol compresses data before sending it. But it is still straightforward, if laborious, to fashion and send your own unencrypted HTTP 1.x requests by hand.

To give this a go you'll need a tool like *netcat*[LINK]. Netcat is a command line tool that you can use to make a raw TCP connection to a server. Making a TCP connection between a client and a server is like constructing a drainpipe between the two machines that they can send messages through. However, TCP doesn't say anything about what the form of those messages should be - that's the job of application-level protocols like HTTP.

This means that you can use a tool like netcat to open a raw TCP connection to a server, then send your own hand-rolled but well-formed HTTP requests down your TCP pipe. Try this out now. First, install netcat[LINK]. Then use netcat to open a TCP connection to `example.com` - which is a real domain - by running:

```
$ nc example.com 80
```

The `80` tells `netcat` to connect to `example.com` on *port 80*. Ports are a networking-level concept that the HTTP protocol doesn't have to care about, meaning that right now we don't either. This command will open a TCP connection with `example.com` and then pause. Once the connection is established, whatever you type into your command prompt will be sent to the target server over TCP.

Since you have complete control over the data that is sent and are not constrained by the HTTP protocol, you could pass the server non-HTTP nonsense. However, the server will respond politely saying that it has no idea what you are talking about:

```
$ nc example.com 80
how now brown cow

HTTP/1.0 501 Not Implemented
Content-Type: text/html
<...snip...>
```

On the other hand, if you send the server a valid HTTP request, it will receive and process it just as if it had been generated by a program:

```
$ nc example.com 80
GET / HTTP/1.1
Host: example.com

HTTP/1.1 200 OK
Accept-Ranges: bytes
Age: 275740
Cache-Control: max-age=604800
<...snip...>
```

The first two lines, beginning with `GET` and `Host` respectively, are typed in manually by you. All following lines (from `HTTP/1.1...` onwards) are returned by the server. You will never, never need to do this in real life, but trying it out once or twice can be illuminating and can help demystify computer networking.

We've now seen several tools that you can use to make HTTP requests of your own. However, whilst making HTTP requests is perfectly interesting and productive, in my opinion the real fun is in snooping on HTTP requests sent by other programs running on your computer.

### How to see inside HTTP requests

I have three common reasons that I find myself wanting to spy on a program's HTTP requests. First is because I want to see whether the program is smuggling out any of my personal data (see my posts "Stylish browser extension steals all your internet history"[LINK] and "Wacom drawing tablets track the name of every application that you open"[LINK]). Second is because I want to reverse-engineer private APIs and write my own programs that interact with servers in ways that the original developers may have never intended (see my post "How Tinder keeps your exact location (sort of) private"[LINK]). Third is because I want to - if the owner allows it - probe a service for security vulnerabilities (see my posts "Remote code execution vulnerability in KensingtonWorks mouse manager"[LINK] and "Another RCE vulnerability in KensingtonWorks"[LINK]).

Many applications communicate with a central server in order to load, backup, retrieve, and exchange data. Zoom makes video calls. Evernote, a note-taking app, saves your data to the cloud. The Apple App Store loads lists of the latest releases from the Apple servers. These applications are free to talk to their central server using any application-level protocol that they want, or even to invent their own. Nonetheless, many applications choose HTTP because it's simple; lots of libraries already exist to support it; and lots of programmers are already familiar with it.

Two common tools for nosing around in other applications' traffic are an *HTTP proxy* and a *network packet analyzer*. Both are powerful yet accessible ways to find out what your computer is doing behind the scenes.

#### HTTP Proxy: Burp Suite

Suppose that you've identified an application that you suspect might be funneling your personal data back to a central server. You want to inspect the HTTP traffic that it is sending in order to see what data it contains. The first tool to try is a *man-in-the-middle HTTP proxy* (hereafter shortened to HTTP proxy), like *Burp Suite*[LINK].

An HTTP proxy is itself an HTTP server, usually (but not necessarily) running on the same machine as the target application. Once you've set up your proxy, you ask the target application to send its HTTP requests to your proxy server, instead of directly to the intended destination. Some applications provide their own configuration to help with this; some rely on you configuring a proxy at the operating system level. However, as we'll see, applications aren't obliged to offer any proxy configuration options, and they aren't even obliged to obey the operating system configuration.

Nonetheless, most well-behaved applications should be willing to send their HTTP requests via your proxy. When your proxy receives a request it first logs its contents, and then forwards the reuqest on to the server to which it is really meant to go. The server sends its HTTP response back to the proxy. The proxy logs the response and forwards it back to the originating application.

[TODO-PIC]

The proxy's logs show you the HTTP requests that your applications are sending and what data they include. When I discovered that the popular browser extension "Stylish" was exfiltrating the URL of every single website[LINK] that I visited, it was because I noticed it smuggling this data out in my HTTP proxy logs.

Proxy logs also show you how your applications structure their requests to their central servers. You may be able to determine what URL paths the application sends data to, what serialization format it uses for its parameters, and what keys and values these parameters contain. Your proxy may provide power features to help with your investigation, like allowing you to edit parameters in the request or response before forwarding it, or saving a request and repeatedly re-sending it. The information that you discover may allow you to reverse-engineer the APIs for these central servers, which in turn may allow you to write programs to send your own requests to the servers in order to automate tedious and repetitive tasks like texting your family.

HTTP proxies aren't just useful for snooping on programs running on your computer. You can also use them to investigate apps running on your smartphone. To do this, you configure your smartphone to send its HTTP traffic via a proxy running on your laptop.

[TODO-pic] of sending phone data via laptop

This allows you to see what data your mobile apps are sending back home (almost always a *lot*), and reverse-engineer the APIs that they use. You may have chatted with someone on Tinder who seemed real and attractive enough, until it slowly became apparent that they were a robot. The robot's controller almost certainly used an HTTP proxy to reverse-engineer the Tinder API, and now uses this knowledge to write programs that make automated matches and send automated messages.

[TODO-pic] of a robotic Tinder account

I would strongly recommend setting up an HTTP proxy and playing around, especially since the community edition of Burp Suite is free[LINK]. Setting up an HTTP proxy teaches you a lot about HTTP and networking, and even about SSL/TLS encryption (more on which below). It can lead you to some newsworthy discoveries about data privacy, and maybe allow you to cause some light-hearted automated mischief. For inspiration and examples of how I've used HTTP proxies to unmask malfeasance and mess with my mates, see "Stylish browser extension steals all your internet history"[LINK], "Wacom drawing tablets track the name of every application that you open"[LINK], and "Fun with your friend's Facebook and Tinder sessions"[LINK].

However, you can't force an application to send its HTTP requests via your HTTP proxy. Some applications ignore all attempts to cajole them into sending their requests via your proxy. You may still be able to trick them into contacting your proxy using a technique called *DNS spoofing*, but even this might not work.

It may seem like a good idea for a company to have their product ignore proxy settings. Even if they don't have any sneaky data exfiltration to hide, surely it makes their lives easier if no one can reverse-engineer their private APIs or probe their application for vulnerabilities? However, proxies are not only used by nosy programmers. For example, large, security-conscious companies may force all traffic from their employees' laptops to travel through in proxy in order to detect and block malware. If an application ignores the operating system's proxy settings then it may find itself unable to contact the outside world at all.

[TODO-PIC] of proxy blocking egress

If you do find yourself trying to probe an application that isn't respecting your HTTP proxy, or you just want to see a lot more detail about what's happening on your network, you could turn to a *network packet analyzer*.

#### Network Packet Analyzer: Wireshark

HTTP proxies work at the HTTP layer. This means that they understand and are deeply integrated with the structure of HTTP requests and responses. They can provide HTTP-specific power-features when analyzing cooperative HTTP-based applications. However, HTTP proxies are useless for inspecting applications that don't use HTTP or won't send their traffic through the proxy.

An alternative way to spy on your programs is to use a lower-level tool called a *packet analyzer*. Packet analyzers look at traffic at the network level. This means that they see and show you all the gory details of every byte that you computer sends out over a network. This includes everything from HTTP application data all the way down to the ethernet control frames that your computer exchanges with your wi-fi router. Even if an application won't co-operate with your HTTP proxy, if it wants to send data over your network, your packet analyzer will see this data as it leaves your machine.

[TODO-pic] diff between proxy and packet analyzer

One popular packet analyzer is called *Wireshark*[LINK]. Since Wireshark doesn't inject itself into the path that data takes out of your machine, it can't provide the same kind of tools to edit requests and responses that proxies like Burp Suite can. However, Wireshark isn't completely ignorant. It understands the structure of a wide range of different protocols, not just HTTP. It uses this knowledge to reconstruct raw bytes into human-readable summaries at the different layers of the stack. For example, it can take the ethernet frames that your computer sends to your router, reconstruct them into TCP/IP packets, then reconstruct the TCP/IP packets into HTTP requests and responses. This allows it to display the data it captures very usefully in its UI, and allows you to filter traffic using queries like `http.method == GET TODO`. If it didn't understand how to roll up raw bytes into different protocols, all Wireshark would be able to show you is a structureless, meaningless stream of numbers.

[TODO-pic] screenshot of Wireshark

Packet analyzers see everything, but they can't edit or block traffic in the same way that proxies can. Another limitation of a packet analyzer is that it can't decrypt SSL/TLS encrypted traffic (which we'll talk about more in the next section). This is because the SSL/TLS protocol is so robust. The point of SSL/TLS encryption (and any other useful encryption applied to data sent over a network) is to prevent eavesdroppers from spying on your traffic. SSL/TLS has the incredible property that even if an attacker watches every single packet of data that a client and a server exchange, *including the packets in which they negotiate and exchange an encryption key*, if that data is SSL/TLS encrypted, the attacker won't be able to decrypt it.

Packet analyzers are only watching from the sidelines. From the point of view of decrypting SSL/TLS traffic, it's barely relevant that they run on the same computer as one of the participants in the encrypted conversation. In a very real sense they are spying on your traffic from exactly the same kind of vantage point as an attacker who has hacked into your network. If a packet analyzer were able to decrypt encrypted traffic by watching network packets, so could an evil-doer listening on your coffee shop's wi-fi. Instead, the best that Wireshark can do is to show you the encrypted bytes and effectively say "there's something interesting in here but unfortunately I can't tell you what."

[TODO-PIC] of TLS traffic in Wireshark

By contrast, because a proxy inserts itself in between the client and the server, it is directly involved in the encryption process. This means that it is able to decrypt and read the traffic. The proxy negotiates an encrypted connection with the client, and a second encrypted connection with the destination server. When the client wants to send data to the server (and vice versa), the client sends it over its encrypted connection to the proxy. The proxy decrypts the data, logs it so that you can inspect it, then re-encrypts it and sends it along its second encrypted connection with the destination server. This process is known as a *man-in-the-middle*.

[TODO-PIC] of MITM

Download Wireshark and set it running. The output may initially be overwhelming: Wireshark sees *everything*. To filter it to only show HTTP requests and responses, use the filter `TODO`. I made extensive use of Wireshark in my security vulnerability investigation "Remote code execution vulnerability in KensingtonWorks mouse manager"[LINK].

We've spoken a lot about encryption. Let's talk a little about how it works.

### HTTPS

HTTP requests are almost always sent over a network. Unfortunately the world is a squalid and threatening place, and this applies double on computer networks. You should assume that all networks are insecure, and that all traffic sent over them may be snooped on or tampered with. When your browser sends a HTTP request to Facebook with your username and password, this request may be seen by people on your coffee shop wi-fi, your ISP, your government, a foreign government that has hacked your ISP, or anyone else who has managed to insert themselves somewhere in the mazy route that your data takes from A to B.

Even though you should assume that every HTTP request you send might be intercepted, this doesn't mean that you should smash your phone and cut off your broadband. Instead, it means that you should make sure that every important HTTP request you send is *encrypted*. The current standard encryption protocol is called SSL/TLS, which stands for "Secure Sockets Layer/Transport Layer Security". The product of encrypting HTTP traffic with SSL/TLS is known as HTTPS; the "S" is for "secure". HTTPS is becoming so ubiquitous and straightforward to implement that not using it is commonly considered a security vulnerability.

As well as keeping HTTP traffic safe from eavesdropping and tamperering, SSL/TLS/HTTPS also allows a client to verify the identity of the server that they are talking to (and, more rarely, vice versa). When a client attempts to negotiate an encrypted connection with a server claiming to be `facebook.com`, the client will require the server to present an SSL/TLS *certificate*. The certificate must attest that the server is the real controller of `facebook.com` and be *cryptographically signed* by a trusted third-party called a *certificate authority* (CA). A CA should only issue a signed certificate for a domain once it has verified that the recipient does indeed own and control that domain.

I've written much more about certificates in my post "How does HTTPS actually work?"[LINK]. Certificates allow a client to be confident that the server they are talking to is the real `facebook.com` or `gmail.com`, and not an attacker pretending to be one of these services. This is important because it doesn't matter how mathematically bulletproof your encryption algorithm is if you exchange encryption keys with a hacker.

We said a paragraph ago that "you should make sure that every important HTTP request you send is encrypted". However, you don't directly get to decicde this. Your web browser will encrypt its conversations with any server that offers SSL/TLS, but if a server does not offer SSL/TLS then you can't unilaterally encrypt your requests and expect the server to figure things out. Instead your browser will send its requests in unencrypted plaintext and probably display a sad open padlock in the address bar.

[TODO-PIC] screenshot of padlock

Being pragmatic, it's probably safe enough to browse someone's personal blog over plain HTTP, but if your online bank doesn't offer HTTPS then you should find yourself a new bank. Similarly, the applications that you use on your computer and phone "should" encrypt communications between your device and their servers. However, if they don't then you'll probably never know unless you go snooping and you don't have any options other than accept the risk or stop using the application.

On the better-behaved side, many websites redirect unencrypted HTTP requests to their HTTPS equivalent using the 301 HTTP status code. For example, try using your browser to visit `http://robertheaton.com` (note the `http`, not `https`, at the start of the URL). You will be redirected to the equivalent HTTPS URL at `https://robertheaton.com`. You can see the HTTP redirect response by making the same request to `http://robertheaton.com` using `curl`:

```
$ curl http://robertheaton.com
<...snip...>
HTTP/1.1 301 Moved Permanently
Location: https://robertheaton.com/
<...snip...>
```

Many APIs also only accept HTTPS requests, although instead of redirecting unencrypted HTTP requests they often simply reject them:

```
$ curl http://app.asana.com/api/1.0
The Asana API can only be reached via HTTPS
$ curl http://api.stripe.com
{
  "error": {
    "message" : "The Stripe API is only accessible over HTTPS.  Please see <https://stripe.com/docs> for more information.",
    "type": "invalid_request_error"
  }
}
```

Adding SSL/TLS encryption to an HTTP conversation doesn't change anything about the HTTP layer. When sending an HTTPS request, the client opens a TCP connection with the server and forms its HTTP request exactly as normal. Then, instead of sending the request straight off to the server, the client first encrypts it. This first requires some further negotiations with the server to agree on an encryption key. Finally the client sends the encrypted request to the server. When the server receives the encrypted request it starts by decrypting it to recover the original plaintext HTTP request. It can then process the request just like a plaintext HTTP request, without having to care that it was ever encrypted. When the server comes to send an encrypted HTTP response back to the client, the exact same process is followed but with roles switched.

[TODO-PIC]

I've written much more about the details of how HTTPS works in my posts "How does HTTPS actually work?"[LINK] and "HTTPS in the real world"[LINK], in which we go deep into the details of TLS/SSL and public key cryptography.

----

We now have a good grasp on what is meant by the "HTTP" in "HTTP API". HTTP is TODO.

Now we're ready to look in more detail at APIs themselves.

### TODO POSSIBLE EXTRA TOPICS

* What is localhost?





Deleted section:

### Conventions and normality

Technology can be very flexible. The internet and the protocols that go into it are deliberately designed to be extensible for new use cases, and to allow different systems written in different languages by different companies to talk to each other.

Despite this flexibility, in practice most systems are built by piecing together the same components in the same ways. Servers can be anything, but they are usually racks of computers in purpose-built data centres. You can technically send HTTP requests via any communication medium that you like, but in practice you will always use TCP/IP. In general it's a good idea to follow these common paths unless you have a specific reason not to. Sometimes this is because the common paths are very good. Sometimes the common paths might be unfortunate accidents of history that make the world a bit worse, but it's still convenient to do whatever everyone else does.

Many choices are driven by flexible tradeoffs, not rigid technical requirements. The answer to "why can't I do X?" is often "well I suppose you could, but Y will probably work a little better." "Why can't I send my IP packets using carrier pidgeons?" "Well I suppose you could[LINK], but most people just send them over the internet."






A request target usually only needs to include the path (the bit after the `/`), and not the full URL (eg. `http://newspaper.com/articles/123`) because routing an HTTP request to the correct server on the internet is the job of the TCP/IP protocols, not the HTTP protocol.



API requests to create or update resources will also usually return the newly-created or updated resource to give the client full information about the operation that was just performed. We might expect a request to `POST /articles` to create a new article, and the HTTP response might look something like:

```json
TODO
```

If there was an error - say, the user didn't have the required permissions - then the response's status code should indicate a problem and the response body may give extra debug information (although it is not obliged to):

```json
{
    "success": false,
    "error": "Insufficient permissions"
}
```