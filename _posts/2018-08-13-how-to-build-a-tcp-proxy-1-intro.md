---
title: "How to build a TCP proxy #1: Intro"
layout: post
published: false
---
I was trying to attack the user-location features of several dating apps. I wanted to see whether it was possible to reverse engineer the position of a target user by spoofing thousands of requests to the app (so far - ["yes but only to the nearest mile"](/2018/07/09/how-tinder-keeps-your-location-a-bit-private/)).  I pretended that each request was sent from a different location in the target's neighborhood, and each time I asked the app how far away the target was. I combined the results using maths and ingenuity to try and shake out an exact location.

<img src="/images/tinder-map.jpg" alt="Placing pins in a map based on Tinder distances" />

The project started well; by using [Burp Suite](https://portswigger.net/burp), a popular HTTP proxy, I could inspect, edit and replay all of the HTTP communication sent between my phone and the various dating apps' remote servers. But when I started work on probing one very successful app, I immediately hit a brick wall. I found that its communication did not show up in Burp or any of my other standard, HTTP-focussed tools. I spent a long time checking and double-checking my settings and configurations. Eventually it hit me - they weren't using HTTP at all. They must be using some other, mysterious, but still TCP-based protocol that my normal tools were not able to work with.

Wary but intrigued, I took some time out to build a generic TCP proxy that could handle any TCP-based protocol, not just HTTP. Once complete, my proxy allowed me to inspect the uncooperative app's communications with its servers. This meant that I could continue to creep on my fake dummy profile, with some promising results. I found my proxy so useful and enjoyed building it so much that I chronicled my expedition in the series of essays that you hold in your hand or hard-drive.

In this 4-part series, I will show you how to build a TCP proxy of your own. At the end of the project you'll be able to use your proxy to intercept, record, edit, and replay any form of TCP data sent by your smartphone, not just HTTP. You'll have learned a lot about a wide variety of key concepts, including DNS, TLS, and TCP. And you too will be able to try and rediscover the exact whereabouts of your own Testington McTest, age 28, lives in San Francisco, likes "Testing".

# 0. Pre-reading

If you haven't worked much with proxies or TLS encryption before then I'd suggest doing some pre-reading. I'll explain enough for you to get by during the project, but more background is always helpful.

* [Setup the Burp Suite proxy and experiment with it](https://portswigger.net/burp/help/suite_gettingstarted)
* [Intro to TLS and SSL](/2014/03/27/how-does-https-actually-work/)
* [Intro to Proxies](https://parsiya.net/categories/thick-client-proxying/)
* Read around about the *OSI Layer Model*, in particular the relationship between IP, TCP and HTTP

You may also find it illuminating to try out some of the existing tools for inspecting arbitrary TCP-based protocols. They have their problems, but they do do some things very well and provided invaluable inspiration for this project:

* NopeHTTP extension for [Burp Suite](https://github.com/summitt/Burp-Non-HTTP-Extension) - works nicely but crashes a lot, at least on my machine
* [mitmproxy](https://mitmproxy.org/) - has support for TCP proxying, but at time of writing not for inspecting or modifying packets

Once you are well-grounded and well-equipped, let's begin by answering one of life's fundamental questions.

# 1. What is a proxy?

A proxy is an intermediary that sends messages to a server on a client's behalf. Proxies are widely used for privacy, content filtering, censorship bypassing, caching, and several other purposes that I've accidentally left out. Proxies are also used by professional and amateur security penetration testers to inspect the data that a client (like a smartphone) exchanges with a remote server (like a dating app). 

When browsing the internet using a proxy, you don't directly ask Google "how do I cheat at poker?". Instead you send a request to your proxy, telling it to ask Google how to cheat at poker on your behalf. Your proxy asks Google, and sends you back the response. Google knows that it was talking to your proxy, but doesn't necessarily know that you were on the other side of it. Used correctly, a proxy can mask your identity from the servers you are talking to.

<img src="/images/tcp-1-proxy-privacy.png" />

A proxy used for penetration testing must also be able to read and print the data passing through it. This is the type of proxy we are going to build, known as a "man-in-the-middle" (MITM). Suppose that you want to use a MITM proxy (running on your own laptop) to inspect the traffic sent to and by your favorite dating app. You tell your smartphone to send its traffic to your MITM proxy, instead of directly to the servers it wants to communicate with. Then your smartphone does not ask the dating app's servers "how far away is Alex?". Rather, it asks your MITM proxy to ask the dating app how far away Alex is on its behalf.

<img src="/images/tcp-1-cheating-at-poker.png" />

Your MITM proxy dutifully makes this request, and sends back  to your smartphone any response it gets. But this time it also logs the contents of the request and response, allowing you to inspect their structure. You can use this information to modify requests from your smartphone on their way out, or even to spoof your own requests entirely from scratch.

# 2. Challenges

In order to build our TCP MITM proxy, we will need to solve 3 challenges. Our proxy must be able to: 

1. Receive traffic from a client (like your smartphone)
2. Send and receive traffic from the real remote server
3. Handle encryption between itself and the client

HTTP and HTTPS proxies have a lot to teach us about solving these problems. We can borrow some of their techniques wholesale, and devise our own replacements for others.

First, the bad news. HTTP/S proxies make extensive us of several first-class features of the HTTP protocol that exist only to help proxies route requests. These include `CONNECT` requests and the HTTP `Host` header, more on which later. Since we want our proxy to be capable of handling all TCP-based protocols, not just HTTP, we cannot take advantage of these HTTP-specific features. Other TCP-based protocols that you encounter may well have their own equivalent proxy-friendly features, but equally they may not. And you won't know whether the particular protocol you're inspecting has any such features until you're able to inspect its requests using a proxy, and you won't know how to proxy its requests until you've inspected its requests, and... Instead of wondering whether the chicken or the egg came first, you will have nothing but an empty chicken coop and broken dreams.

Don't worry. It's going to be a tricky journey, but TCP already has all the tools that we need. That is, if you know where to look.

# 2.1 Receive traffic from a client

We need to persuade your smartphone to send its traffic via our proxy.

This problem is easy for an HTTP proxy to solve. All sensible smartphones have a system setting that allows you to specify a proxy that your smartphone should use for all of its HTTP requests. In order to use an HTTP MITM proxy like Burp, you connect your laptop and smartphone to the same network, and tell your smartphone to use your laptop's local IP address as an HTTP proxy. You start your Burp proxy on your laptop, and your smartphone obligingly forwards all of its HTTP/S traffic to your laptop. Burp is instantly up and running.

<p style='text-align: center'>
<img src="/images/tcp-1-proxyscreenshot.png" style="width: 50%" />
</p>

However, smartphones do not have such proxy-friendly functionality for generic TCP traffic. Persuading your phone to send this traffic via our proxy will require rather more creativity, and a basic understanding of the *Domain Name System* (DNS) protocol.

## 2.1.1 A very brief introduction to DNS

The internet is an enormous graph of interconnected networks that can exchange data with each other. This data can be emails, last quarter's revenue figures, or the disappointing fourth season of Arrested Development. All of this data is sent as a series of *Internet Protocol (IP) packets*. The internet's routing system directs these IP packets to the correct destination using *IP addresses*. Interestingly, this system doesn't care at all about the host and domain names that we humans rely on to navigate the internet. IP packets sent to my servers aren't addressed to `robertheaton.com`. They're addressed to `104.18.33.191`.

However, "follow me on Twitter at [@RobJHeaton](https://twitter.com/robjheaton) or visit my website at `104.18.33.191`" doesn't have a great ring to it. This is where domain names and DNS comes in. Domain names (technically host names, but the difference isn't important to us and I won't quibble about terminology if you don't) are essentially human-understandable nicknames for IP addresses. Devices like your phone use DNS to translate from domain names (understood by humans) to IP addresses (understood by internet routers).

Suppose that you tell your browser to navigate to  `robertheaton.com`. As we now know, the IP routing system does not understand domain names. If your browser wants to send a request to my server, it has to find out its IP address first. It does this by making a DNS *A record* request (from now on referred to simply as a "DNS request") to a DNS server, asking it to translate (or "resolve") the domain `robertheaton.com` into its corresponding IP address. Once the DNS server responds with `104.18.33.191`, your browser sends out an HTTP request, addressed to this IP address.

<img src="/images/tcp-1-dns-intro.png" />

There are 20 or so free and public DNS servers capable of reliably making these translations. Google has a DNS server with IP address `8.8.8.8`. Verisign has one at `64.6.64.6 `, and so on. You can choose which of these servers your smartphone uses by typing the server's IP address into your smartphone's system settings. Usually this choice doesn't really matter.

Usually.

## 2.1.2 How does DNS help us with our proxy?

There's nothing intrinsically special about a DNS server. It's just a server that listens for and responds to DNS requests on UDP port 53. In fact, we can run a DNS server of our own on your laptop, and we can configure your smartphone to use our fake DNS server instead of Google's or Verizon's.

When a real DNS server receives a DNS request for a domain, it performs a DNS lookup in order to find the domain's IP address (we don't need to go into the details of DNS lookups here). And indeed, when our *fake* DNS server receives a DNS request for a domain, we will sometimes tell it to retrieve the domain's real IP address by asking a real DNS server to do a real DNS lookup. However, if the request is for a domain whose requests we want to send through our proxy (say, `targetapp.com`), our fake DNS server will instead respond with your laptop's local IP address.

<img src="/images/tcp-1-full-layout.png" />

As long as we format the DNS response correctly, your phone won't see anything wrong with it. It will accept that `targetapp.com` resolves to your laptop's local IP address, and dispatch any data that it wants to send to `targetapp.com` to your laptop.

To take advantage of this behavior and actually receive this rerouted data, we need to set up a second, proxy server on your laptop. This server will be the actual proxy - it will receive data from your phone, read and print it so that we can inspect it, and finally forward it on to its intended recipient.

However, working out who this intended recipient is will not be straightforward.

### 2.2 Send and receive traffic from the real remote server

Proxies, like all computer programs, are dumb as bricks. They don't magically know what to do with the data they receive, and the only way they can know is if they are explicitly told.

When you want to arrange dinner with your friend, you send a text to their phone number saying "Want to get dinner tonight?" This works well, unless your friend is particularly flakey or doesn't actually like you all that much. Now imagine that you have a personal assistant who you employ as a proxy for all your texts. You send all your texts to your PA, and they forward them on to your friends and enemies on your behalf. If you send your PA a text saying simply "Want to get dinner tonight?" then they won't know who to forward it on to. Since you have been a very unforgiving boss recently, your poor, presumably underpaid assistant will panic, delete the message, and pretend that they never received it.

There are many ways to address this PA proxy problem. You could attach a header to the message saying "Send-To: 415-123-1234". Or you could establish a rule ahead of time that all dinner suggestions should always be routed to your mother. Network proxies face similar challenges, and have come up with similar solutions. Let's look at how HTTP and HTTPS proxies figure out where to send the requests that they receive from their clients (like your smartphone).

# 2.2.1 HTTP

Proxies for unencrypted HTTP have it easy. HTTP/1.x requests contain a `Host` header, which explicitly specifies the domain that the request should be sent to. HTTP/2.x requests contain an `authority` pseudo-header containing the same information. HTTP proxies can easily parse out this values from the unencrypted request, and re-send the request accordingly. This is akin to including a "Send-To" field in your text messages to your assistant.

For brevity, from now on I will refer to HTTP/1.x's `Host` header and HTTP/2.x's `authority` pseudo-header collectively as "the Host header".

<img src="/images/tcp-1-host-header.png" />

# 2.2.2 HTTPS

HTTPS has it harder (although not as hard as us). There are 2 main types of HTTPS proxy. The first and most boring is a "forwarding proxy", which proxies HTTPS data without ever decrypting it. Since a forwarding proxy only ever sees data passing through it as unreadable, TLS-encrypted bytes of nonsense, it can't read the HTTP `Host` header, and so can't reuse the approach taken by HTTP proxies. It's no use sending your PA the encrypted name of your friend if they have no way to decrypt it.

The HTTPS protocol solves this problem by sending an additional, proxy-specific `CONNECT` request. If a client knows that its HTTPS requests are going to be passing through a proxy, it precedes each of them with a separate HTTP `CONNECT` request. This request explicitly tells the proxy, in unencrypted plaintext, the domain to which it should send the encrypted request that will follow shortly after. This means that the proxy does not need to decrypt the main payload in order to be able to route it correctly. This is like sending your PA a preliminary, unencrypted text message describing what they should do with the encrypted nonsense that you are about to send over.

The second type of HTTPS proxy, and the type that we are going to build, is a "man-in-the-middle" (MITM). As we have already briefly discussed, a MITM differs from a forwarding proxy because it is able to decrypt and read the data that passes through it. This means that it can read the plaintext contents of an HTTP request, and so can also read the intended destination stored in its HTTP `Host` header. The HTTPS MITM can forward the request to this location, in exactly the same way as an HTTP proxy does.

MITMs still usually prefer to imitate forwarding proxies and use `CONNECT` requests where possible. The exception is when a "non-proxy-aware" client doesn't know or doesn't care that they are connected to a proxy, and do not send preliminary `CONNECT` requests. In this situation, the `Host` header is a useful fallback.

# 2.2.3 What does this mean for our TCP proxy?

Unfortunately for us, both `CONNECT` requests and `Host` headers are HTTP-specific features. Other TCP-based protocols may contain similar instructions in a different form, but if your proxy doesn't know their form ahead of time then it will not be able to make use of them. Texting your PA your friend's phone number encoded in Base 64 will not help them if you don't tell them what you're doing and why. This is part of what makes our task of building a TCP proxy difficult.

Indeed, a smartphone app that goes to the trouble of using a custom TCP protocol may have done so at least partly because they want to make it hard for even benevolent snoopers like us to inspect how their API works. This would make proxy-unfriendliness a feature, not a bug.

We will therefore cheat a little. You're usually going to be using your proxy to inspect data sent by a single app. This app will probably send all of its interesting data to a single domain. TargetApp probably only sends data to `api.targetapp.com`. This means that our proxy doesn't have to be anything like as flexible and intelligent as a general-purpose HTTP proxy.

We can look at the logs of our fake DNS server from the previous section, and see the list domains that your phone is trying to contact. We can use intuition and guesswork to figure out the domain that is most interesting to us. For example, `api.targetapp.com` is probably more interesting than `stats.mobileanalytics.com`. We can then hard-core this domain into our proxy, and instruct it to simply send all of the data it receives from your smartphone on to this domain. It's as though you told your PA to route all the text messages you send them today over to [your good buddy, Steve Steveington](/2017/10/09/tracking-friends-and-strangers-using-whatsapp/).

# 2.3 How to handle TLS encryption

Any TCP-based protocol can use TLS encryption, not just HTTPS. This is because TLS doesn't care at all about the form of the messages it is encrypting. They can be HTTP, FTP, XML, or just total unstructured nonsense. This agnosticism means that our TCP proxy can reuse all the same TLS techniques commonly documented and used by HTTPS proxies.

# 2.3.1 TLS handshakes

We will need to make sure that our proxy can convince clients (like your smartphone) to make encrypted connections with it. TLS connections are agreed and verified by a process known as a *TLS handshake*. Once a handshake has been completed, decrypting the encrypted traffic sent over the connection is straightforward.

In order for your smartphone to agree to perform a TLS handshake with our proxy, we're going to need to present it with a valid *TLS certificate*. Not only that, but the TLS certificate must have its *Common Name* (a field in the certificate) set to be the domain that your smartphone thinks it is talking to (for example, `google.com`). And not only that, but the TLS certificate must be signed by a *Root Certificate Authority* (CA) that your smartphone trusts (more accurately, by a CA with a chain of trust that terminates at a Root CA). We will talk much more about these terms in part 4.

A real TLS certificate for a domain like `google.com,` signed by a real CA like Digicert, would probably be among the most valuable 4096 bytes in the history of the world, as it would allow a malicious actor to decrypt all encrypted traffic sent by anyone to `google.com`. If you are in possession of such a certificate then you should stop reading immediately and put in on eBay.

We will get around this problem by starting our own fake CA. We will generate a certificate for it, and tell your smartphone to trust both our CA's certificate and all certificates signed by it. We will then generate fake TLS certificates for `google.com`, `targetapp.com` and any other domains that we want to proxy requests for. We'll sign these certificates using our fake CA, and finally we'll present your smartphone with the certificate for the appropriate domain when it asks us to perform a TLS handshake with it.

During a TLS handshake, client and server agree on encryption keys. Our proxy will use these keys to decrypt the encrypted data sent by your phone, print this data to the terminal so we can inspect it, and then send it on to its intended destination over a separate TLS-encrypted TCP connection.

# 3. The Project

This project to build a generic TCP proxy is divided into 3 sections. Each section is designed as an incremental, self-contained addition that can be run and tested to make sure that everything we have built so far is working. After completing section 3 you will have a fully working TCP proxy that you can use to inspect and analyze any TCP-based protocol. The 3 sections are:

1. Spoof DNS requests so that TCP requests from your smartphone are sent to your laptop
2. Build a TCP proxy server that runs on your laptop and can proxy and inspect unencrypted TCP connections
3. Build a dummy Root Certificate Authority that allows your proxy to handle TLS-encrypted messages

I've written example code for each section using Python3. Whilst this does mean that you'll be best off using Python3 too, implementing the project in another language is also completely fine and doable.

Let's inspect some TCP protocols.
