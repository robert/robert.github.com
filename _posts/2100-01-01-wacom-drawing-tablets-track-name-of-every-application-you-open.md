---
title: "Wacom drawing tablets track the name of every application that you open"
layout: post
tags: [Online Tracking, Security]
og_image: https://robertheaton.com/images/wacom-cover.png
---
I have a Wacom graphical drawing tablet. I use this device to draw cover pictures for my blog posts, like this one:

<img src="/images/wacom-cover.png" />

Last week I set up my Wacom graphics drawing tablet on my new laptop. As part of installing the drivers I was asked to accept Wacom's privacy policy.

Being a mostly-normal person I never usually read privacy policies. Instead I vigorously hammer the "yes" button in an effort to reach the game, machine, or medical advice on the other side of the agreement as fast as possible. But Wacom's request made me pause. Why does a device that is essentially a mouse need a privacy policy? I wondered. Sensing skullduggery, I decided to make an exception to my anti-privacy-policy-policy and give this one a read.

In Wacom's defense (that's the only time you're going to see that phrase today), the document was short and clear, although as we'll see it wasn't entirely open about its more dubious intentions. In addition, despite its attempts to look like the kind of compulsory agreement that must be accepted in order to unlock the product behind it, as far as I can tell anyone with the presence of mind to decline it could do so with no adverse consequences.

With that attempt at even-handedness out the way, let's get kicking.

In section 3.1 of their privacy policy, Wacom wondered if it would be OK if they sent a few bits and bobs of data from my computer to Google Analytics. The half of my heart that cares about privacy sank. The other half of my heart, the half that enjoys snooping on snoopers and figuring out what they're up to, leapt. It was a disjointed feeling, probably similar to how it feels to get mugged by your favorite TV magician. Wacom didn't say exactly what data they were going to send themselves. I resolved to find out.

I began my investigation with a strong presumption of chicanery. I was unable to imagine the project kickoff meeting in which Wacom decided to bundle Google Analytics with their device, which - remember - is essentially a mouse, but managed to restrain themselves from also grabbing some deliciously intrusive information while they were at it. I Googled "wacom google analytics". There were a couple of Tweets and Reddit posts made by people who had also read Wacom's privacy policy and been unhappy about its contents, but no one had yet tried to find out exactly what data Wacom were grabbing. No one had investigated Wacom's understanding of the phrase "aggregate usage data" and whether it was anywhere near that of a reasonable person.

I told my son to clear my schedule. He bashed two wooden blocks together in understanding, encouragement, and sheer admiration.

## Snooping on the snoopers

In order to see what type of data Wacom was exfiltrating from my computer, I needed to snoop on the traffic that their driver was sending to Google Analytics. The normal way to do this is to set up a *proxy server* on your computer (I usually use [Burp Suite][burp]). You tell your target program that it should send its traffic through your proxy, which logs the data it receives, before finally re-sending the data on to its intended destination. When the destination sends back a response, the same process runs in reverse.

```
+-------------------------------+
|My computer                    |
|                               |
|   +------+        +------+    |    +---------+
|   |Wacom +------->+Burp  +-------->+Google   |
|   |Driver+<-------+Suite +<--------+Analytics|
|   +------+        +-+----+    |    +---------+
|                     | Log requests and responses
|                     v         |
|             /track?data=...   |
|                               |
+---------------------+---------+
```

Some applications, like web browsers, co-operate very well with proxies. They allow users to explicitly specify a proxy that they should send their traffic through. However, other applications (including the Wacom tablet drivers) provide no such conveniences. Instead, they require some special coaxing.

I started with a simple, alternative approach that was unlikely to work but was worth a try. I opened [Wireshark][wireshark], a program that watches your computer's network traffic. I wanted to use Wireshark to view the raw bytes that the Wacom driver was sending to Google Analytics. If Wacom was sending my data over unencrypted HTTP then I'd immediately be able to see all of its gory details, no extra work required. On the other hand, if Wacom was using [encrypted TLS/HTTPS][https1] then the traffic would appear as garbled nonsense that I would be unable to decrypt, since I wouldn't know the keys used to encrypt it. I closed any noisy, network-connecting programs to reduce the chatter on the line, pressed Wireshark's record button, and held onto my hat.

Unfortunately, no unencrypted HTTP traffic appeared; only encrypted, garbled TLS. But there was good news amidst this setback. Wireshark also picks up DNS requests, which are used to look up the IP address corresponding to a domain. I saw that my computer was making DNS requests to look up the IP address of `www.google-analytics.com`. The DNS response was coming back as `172.217.7.14`, and lots of TLS-encrypted traffic was then heading out to that IP address. This meant that *something* was indeed talking to Google Analytics.

[PIC of DNS]

I switched tactics and fired up Burp Suite proxy.

I now had two problems. First, I needed to persuade Wacom to send its Google Analytics traffic through Burp Suite. Second, I needed to make sure that Wacom would then complete a *TLS handshake* with Burp. To solve the first problem, I configured my laptop's global HTTP and HTTPS proxies to point to Burp Suite. This meant that every program that respected these global settings would send its traffic through my proxy.

<img src="/images/wacom-proxy-settings.png" />

Happily, it turned out that Wacom did respect my global proxy settings - my proxy quickly started logging "client failed TLS handshake" messages.

This brought me to my second problem. Since Wacom was talking to Google Analytics over TLS, it required the server to present a valid TLS certificate for  `www.google-analytics.com`. As far as Wacom is concerned, my proxy was now the server that it is talking to, not Google Analytics itself. This meant that I needed my proxy to present a certificate that Wacom would trust.

```
  (Must present a valid cert for www.google-analytics.com)
                      |
+---------------------|---------+
|My computer          |         |
|                     v         |
|   +------+        +------+    |    +---------+
|   |Wacom +------->+Burp  +-------->+Google   |
|   |Driver+<-------+Suite +<--------+Analytics|
|   +------+        +-+----+    |    +---------+
|                     | Log requests and responses
|                     v         |
|             /track?data=...   |
|                               |
+---------------------+---------+
```

The most difficult part of presenting such a certificate is that it needs to be *cryptographically signed* by a *certificate authority* that the program trusts. Burp Suite can generate and sign certificates for any domain, no problem, but since by default no computer or program trusts Burp Suite as a certificate authority, the certificates it signs are rejected (I've written much more about TLS and HTTPS [here][https1] and [here][https2]).

Once again, the process of persuading a *web browser* to trust Burp's root certificate is well-documented, but for a thick application like Wacom I'd need to do something slightly different. I therefore used OSX's Keychain to temporarily add Burp's certificate to my computer's list of root certificates.

<img src="/images/wacom-cert.png" />

I assumed that Wacom would load its list of root certificates from my computer, and that by adding Burp to this list, Wacom would start to trust Burp and would complete a TLS handshake with my proxy. I should have done this in a Virtual Machine for safety, but I figured this was probably safe enough.

I sat and waited. I watched Wireshark and Burp at the same time. If Wacom failed to connect to Burp, I'd see this failure in Wireshark. I was quite excited.

Nothing happened.

I tried drawing something using my Wacom tablet. Still nothing. I plugged and unplugged it. Nothing. Then I went into the Wacom Driver Settings and restarted the driver.

<img src="/images/wacom-restart.png" />

Everything happened.

When I restarted the Wacom driver, rather than lose all the data it had accumulated, the driver fired off everything it had  to Google Analytics. This meant that the exact data that Wacom was sending itself materialized in my Burp Suite. I took a look. My heart experienced the same half-down-half-up schism as it had half an hour ago.

Some of the events that Wacom were recording were arguably within their purview, such as "driver started" and "driver shutdown". I still don't want them to take this information because there's nothing in it for me, but their attempt to do so feels broadly justifiable. What requires more explanation is why Wacom think it's acceptable to record every time I open a new application, including the time, a pseudonymous string that uniquely identifies me, and the application's name.

<img src="/images/wacom-evidence1.png" />
<img src="/images/wacom-evidence2.png" />
<img src="/images/wacom-evidence3.png" />

----

I suspect that Wacom doesn't really think that recording the name of every application I open on my personal laptop is acceptable. I suspect that this is why their privacy policy doesn't really admit that this is what that they do. I imagine that if pressed they would argue that the name of every application I open on my personal laptop falls into one of their broad buckets like "aggregate data" or "usage statistics", although it's not immediately obvious to me which bucket.

It's well-known that no one reads privacy policies and that they're often a fig leaf of consent at best. But since Wacom's privacy policy makes no mention of their intention to record the name of every application I open on my personal laptop, I'd argue that it doesn't even given them the technical-fig-leaf-right to do so. In fact, I'd argue that even if someone had read and understood Wacom's privacy policy, and had knowingly consented to a reasonable interpretation of the words inside it, that person would still not have agreed to allow Wacom to log and track the name of every application that they opened on their personal laptop.

Of course, I'm not a lawyer, and I assume that whoever wrote this privacy policy is.

Wacom's privacy policy does say that they only want this data for product development purposes, and on this point I do actually believe them. This might be naive, since who knows what goes on behind the scenes when large troves of data are involved. But either way, while I do understand that product developers like to have usage data in order to monitor and improve their offerings, this doesn't give them the right to take it.

----

I care about this for two reasons.

The first is a principled fuck you. I don't care whether anything materially bad will or won't happen as a consequence of Wacom taking this data from me. I simply resent the fact that they're doing it.

The second is that we can absolutely also come up with scenarios that involve real harms. Maybe the very existence of a program is secret or sensitive information. What if a Wacom employee suddenly starts seeing entries spring up for "Half Life 3 Test Build"? Obviously I don't care about the secrecy of Valve's new games, but I assume that Valve does.

We can get more subtle. I personally use Google Analytics to track visitors to my website. I do feel bad about this, but I've got to get my self-esteem from somewhere. Google Analytics has a "User Explorer" tool, in which you can zoom in on the activity of a specific user. Suppose that someone at Wacom "fingerprints" a target person that they knew in real life by seeing that this person uses a very particular combination of applications. The Wacom employee then uses this information to find their target in the "User Explorer" tool. Finally the Wacom employee sees that their target also uses "LivingWith: Cancer Support".

Granted this example is a little contrived, but it's also an illustration that, even though this data doesn't come with a name and social security number attached, it is neither benign nor inert.

----

In some ways it feels unfair to single out Wacom. This isn't the dataset that's going to tip us into full, 1984-style surveillance capitalism. But Wacom is a particularly easy target for two reasons. First, their douchebaggery can be fully understood and analyzed using simple tools in a matter of minutes. And second, they weren't able to invent a partially-legitimate reason to send themselves their HTTP requests. This violates the first rule of the internet, which I just made up:

> The internet is increasingly about inventing partially-legitimate reasons to send yourself HTTP requests.

Once you have a partially-legitimate reason to send yourself an HTTP request, you can use the runoff data from this request to power your queazier systems. For example, Facebook's embedded "Like" button requires Facebook to send themselves HTTP requests from a wide swathe of websites around the internet. It's a quirky coincidence that the detritus from these requests allows them to track the behavior of their users all over the web. From a technical perspective, if you want a Facebook Like button then Facebook need to send themselves an HTTP request. You might not like some of the second-order consequences, but now you've entered somewhat murky territory in which Facebook are much better at fighting than you.

[PIC of FB Like]

Another, harder to analyze example - last year [my family rented a "Snoo"][snoo], a smart-crib that rocks and shushes your baby as he or she starts to cry. It comes with a smartphone app, although I wish it just came with a closed-circuit remote control. The app and the crib communicate with each other via Snoo's servers. Boom - Snoo have a legitimate way to send themselves HTTP requests. I have no idea what Snoo does with the runoff from our data, but I begrudgingly assume that [my baby][oscar] is sitting in a Hadoop cluster somewhere, quietly being transformed into quarterly product metric reports. There's nothing particularly malicious about this, but imagine the outcry if Snoo was sending the exact same data to their servers when they didn't have a dubiously-useful smartphone app to power.

Some companies are unable to find even partially-legitimate reasons to send themselves HTTP requests. Often they press ahead anyway and look unabashedly evil as a result. For example, Stylish is a popular browser extension used by millions of people to change the way that websites look. In 2018 [I revealed that Stylish also tracked every single website that its users visited][stylish1]. Stylish claimed that this was only because it wanted to show its users recommendations for ways to restyle the website they were currently on. This was too flimsy a reason to justify what was actually the indiscriminate inhaling of data in order to feed the online advertising models of SimilarWeb, Stylish's ad-tech parent company. The Stylish extension was swiftly booted out of the Chrome and Firefox stores. Unfortunately [it has since returned][stylish2], but if you want to restyle the way that websites look then you can use the very similarly-named "Stylus" extension instead.

Finally, one of my other finest shouts into the void was when [I reported that HP printers purloin metadata about the documents that you print][hp]. The internet was quite unhappy about this revelation for a few days, although everyone soon forgot about it. I assume that HP's printers still send back metadata about the documents that you print and that their share price is very healthy.

I think that Wacom are unquestionably in the illegitimate and noxious camp with Stylish, HP, and countless others. A device that is essentially a mouse has no legitimate reasons to make HTTP requests. Maybe Wacom could hide in the sweet safety of murky territory if they released some sort of mobile app integration or a weekly personal usage report. It would also help their case if they disabled their analytics while their tablet was unplugged (as far as I can tell they currently do not). Until then I'm happy to classify them as an obligingly clear case of nefariousness.

----

I'm personally not about to incinerate my Wacom tablet and buy a different one. These things are expensive, and privacy is hard to put a price on. If you too have a Wacom tablet (I assume, although have no direct evidence, that this tracking occurs for all of their models), open up the "Wacom Desktop Center" and click around until you find a way to disable the "Wacom Experience Program". Then the next time you're buying a tablet, remember that Wacom tries to track every app you open, and consider giving another brand a go.

----

### Postscript

I finished the first draft of this article three weeks ago. I went to get some final screenshots of the data that Wacom was purloining from Burp Suite. I restarted the Wacom driver, as per usual. But nothing happened. Wacom weren't illegitimately siphoning off my personal usage data any more.

The bastards.

I contemplated pretending I hadn't seen this and publishing my post anyway, but I'm nothing if not somewhat-honest. Then I contemplated publishing it with an additional coda explaining this latest development, but somehow "Wacom drawing tablets used to track the name of every application that you open but now seem to have stopped" didn't seem like as snappy a title. I decided to do some more investigating.

I had previously noticed that, before sending data to Google Analytics, the Wacom driver was sending a `HEAD` request to `http://link.wacom.com/analytics/analytics.xml`. Until now I hadn't thought anything of this. However, now this request was still being made, but was returning 404 instead of 200. I realized that it must be some kind of pre-flight check that allowed Wacom to turn off analytics collection without requiring users to install a driver update.

I found the following snippet in the driver's logfile, which confirmed my suspicions:

```
```

I wondered if Wacom had gotten wise to what I was up to and panic-disabled their tracking. This seemed unlikely, although the timing was rather coincidental. I decided that this was probsbly just a boneheaded mistake and that Wacom had accidentally broken their own command-and-control center. I impatiently waited for them to realize their goof and bring their data exfiltration operation back online. I contemplated emailing Wacom to alert them to their problem, but couldn't come up with an innocuous way to do so.

I decided to wait until the end of the month before doing anything in case the data was used for generating monthly reports. I hoped that on January 31st Wacom would realize that something had broken and bring everything back online.

On February 3rd I checked in on `http://link.wacom.com/analytics/analytics.xml`, and was elated at what I saw.

[PIC of hi rick]

I didn't know who Rick was, but I was glad he was back. Wacom were illegitimately siphoning off my personal usage data again, and I couldn't be happier. I grabbed some better screenshots, fixed some grammar, and hit publish.

[https1]: https://robertheaton.com/2014/03/27/how-does-https-actually-work/
[https2]: https://robertheaton.com/2018/11/28/https-in-the-real-world/
[wireshark]: https://www.wireshark.org/
[burp]: https://portswigger.net/burp
[stylish1]: https://robertheaton.com/2018/07/02/stylish-browser-extension-steals-your-internet-history/
[stylish2]: https://robertheaton.com/2018/08/16/stylish-is-back-and-you-still-shouldnt-use-it/
[hp]: https://robertheaton.com/2019/09/15/hp-printers-send-data-on-what-you-print-back-to-hp/
[snoo]: https://robertheaton.com/2019/11/21/how-to-man-in-the-middle-your-iot-devices/
[oscar]: https://robertheaton.com/2019/06/17/childbirth-a-fathers-eye-view/
