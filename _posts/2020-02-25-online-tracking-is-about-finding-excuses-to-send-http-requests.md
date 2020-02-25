---
layout: post
title: Online tracking is about finding excuses to send HTTP requests
tags: [Online Tracking]
og_image: https://robertheaton.com/images/excuses-cover.png
---
Online tracking is about finding excuses to send HTTP requests. In particular, it's about *companies* finding excuses to send *themselves* HTTP requests, in order to record something about how people behave.

<img src="/images/excuses-cover.png" />

Whether these excuses are seen as legitimate has historically been loosely and societally defined. It's been based partly on gut feelings, and partly on what managed to become ubiquitous before anyone thought too hard about it. However in recent years laws like the EU's GDPR have gone some way towards encoding these intuitions in law, by requiring that data collection be [driven by an underlying "legitimate interest" in the information][ico]. Of course, if you are suddenly required to have a business reason to collect data then one obvious response is to make sure that the structure of your business gives you one.

----

Let's look at how different kinds of products can justify sending themselves HTTP requests.

The products best-placed to safely send themselves HTTP requests are those whose very use requires them. Bonus points if this usage requires the user to log in, or if it can otherwise be tied to some kind of persistent, unique identifier. For example, if you want to get some search results from Google, you're going to have to send Google an HTTP request. If you want to buy something from Amazon, you're going to have to send Amazon an HTTP request. If you want to scroll through photos of your attractive friends, you're going to have to send Facebook an HTTP request for each and every photo.

These companies aren't particularly shy about the fact that these conversations are remembered and used for predictions, adverts, and recommendations. You might prefer it if they forgot everything non-essential that you ever said to them, but there's no way for anyone to prove what happens behind the load-balancer, and so demanding this can feel futile. These remembered conversations sometimes turn into ads for something new and delightful that you would never have otherwise found. Other times they cause you to buy or click on things that waste your time and make your life worse. Either way you rarely feel in control.

But it's not a scandal if it's obvious.

----

Facebook's embedded "Like" button is a perfect example of creating a need for HTTP requests. Serving up Like buttons requires Facebook to send themselves HTTP requests from a wide swathe of websites around the internet. It's almost just a quirky coincidence that the detritus from these requests allows Facebook to track the behavior of their users all over the web. From a technical perspective, if you want a Facebook Like button then Facebook need to send themselves an HTTP request. You might not like some of the second-order consequences of their doing so, but now you've entered somewhat murky territory in which Facebook are much better at fighting than you.

It's not a scandal if it has API documentation.

----

Things gets somewhat fuzzier when your data is deliberately sent to a surprising third-party by a second-party who you were trusting and interacting with. For example, websites that serve ads from ad networks send data about you to third-party ad networks. This data allows these networks to follow and track you across the web. This might sound questionable, but in many countries `your continued use of this website means that you consent to our usage of cookies.`

It should probably be a scandal if your data is being shared with ad platforms that are tracking you across the internet, but by now it's so widespread that it's not.

----

I think that these third-party ad networks are the main reason why everyone should use an ad blocker. That said, I still don't unblock sites that claim to serve static, tracking-free ads. This is perhaps not very ethical of me, but I'm doing the best I can with the motivation that I have. I've never clicked on an ad in my life, and so I'm not contributing anything to GDP either way. I also skip past ads in podcasts, and feel particularly vindicated if I can fly past an entire ad without finding out anything about the company behind it. I'm sure that ZipRecru- offer a quality product but I'm proud to have no idea what it does.

----

Some devices could technically be made to function entirely locally, without talking to any external servers, but are instead designed with an integral cloud component that requires all of your usage to pass through the manufacturer's servers. An example is the Snoo, a "smart crib" that shushes and rocks your baby to sleep. It is controlled by an app on your phone ([which I’ve written about in the past][snoo]), and all of the commands that you send from your phone to the crib are sent on a roundtrip over the internet via the Snoo servers, rather than over your local network.

From a pure user experience point of view I would prefer it if the Snoo dispensed with the smartphone app entirely and added a simple control panel to the crib itself. Connectivity between app and crib can be temperamental, and when using the Snoo I never got any benefit from being able to manage the crib remotely. I'd have much preferred a few buttons on the base of the unit.

Given that the Snoo does require you to control it via an app, all else being equal I'd prefer it if the app talked to the crib over my local network rather than over the internet (although there may be technical reasons to avoid this approach). Communicating over the internet does allow you to control the Snoo without being connected to the same network as it, but I don't think I'm being judgmental when I say that if you're going to entrust your baby to an automatic wobbling device then it's good parenting practice to stay within wi-fi range.

Regardless of the reasons, one consequence of the fact that the Snoo communicates over the internet is that its manufacturers get to see their users' precise usage of their product as part of the product's normal operations. I personally find this irritating, but I’m not about to throw my toys out of the smartphone-controlled pram about it. By contrast, imagine the opprobrium if Snoo were recording the same data without a dubiously-useful smartphone app to power. As is, they get all of our usage information and can feed it into whatever analytics or reporting they desire, consciences clear. I begrudgingly assume that my baby is sitting in a Hadoop cluster somewhere, being transformed into quarterly product metrics. To be clear, Snoo isn't doing anything wrong, and I'm sure they're being perfect custodians of my data. I just think that it's interesting how structuring their device so that its communications have to flow through their external servers insulates them against accusations of snoopery.

It's not a scandal if it's a feature.

----

We all have to make practical decisions about where to store our information. Nothing is local anymore. In principal I like the idea of hosting all my cloud services on my own infrastructure, but I don't want to get paged if the server goes down. I don't want to apply OS updates, and I demand someone to Tweet about angrily if I get hacked.

Also I don't want to pay more than $2/month. And even if this self-hosting idea works I still can't self-host my bank account, even though card companies sell my transaction data.

----

Some companies try to invent reasons to send themselves HTTP requests that fall woefully short of credibility. For example, Stylish is a browser extension used by millions of people that changes the way that websites look. In 2018 [I revealed that Stylish also tracked every single website that its users visited][stylish1]. Stylish claimed that this was only because they wanted to show its users recommendations for ways to restyle the website they were currently on. This was a pathetically flimsy attempt to justify the indiscriminate inhaling of user data to feed to the online advertising models of SimilarWeb, Stylish's ad-tech parent. The Stylish extension was swiftly booted out of the Chrome and Firefox stores. Unfortunately [it has since returned][stylish2], but if you want to restyle the way that websites look then you can use the very similarly-named "Stylus" extension instead.

Other companies bury their data collection intentions in privacy policies and hope that no one notices. For example, in 2019 [I reported that HP printers purloin metadata about the documents that you print][hp]. The internet was quite unhappy about this revelation for a few days, although everyone soon forgot about it. In 2020 I noticed that [Wacom tracked the names of applications that you opened and sent the data to Google Analytics][wacom]. The internet did not appreciate this either and Wacom probably missed out on tens of sales.

It *is* a scandal if it's surprising, outside the core flow of product data, and if the justification is bullshit. This doesn't mean it's not profitable.

----

When [looking for new products and companies to skewer][tipoffs] I'm primarily hunting for technologically interesting scandals. But scandal isn't the same as harm. It's annoying, if perversely entertaining, that companies like [HP][hp] and [Wacom][wacom] secretly collect data about how you use their products. However, I think it's worse and more consequential that most companies on the internet report your activity on their site to Facebook, even though this is widely known and begrudgingly accepted.

I understand that many companies only want my usage data in order to understand their users and improve their products. But there's nothing in it for me, so if I'm given a choice then my response is always going to be "fuck you, pay me." Sometimes companies accept this challenge and do indeed offer money for data. Privacy is hard to value though. Is £2 off my next purchase of a 12-pack of vodka worth swiping a supermarket loyalty card for?

At the start of this post, I noted that it's useful if the fundamental structure of your business requires you to collect a lot of data, which you can then use for both core business purposes as well as quarterly metrics. I don't know the extent to which this line of thinking is responsible for the shape of the online world today, but it would sure explain a lot.

[ico]: https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/legitimate-interests/what-is-the-legitimate-interests-basis/
[stylish1]: https://robertheaton.com/2018/07/02/stylish-browser-extension-steals-your-internet-history/
[stylish2]: https://robertheaton.com/2018/08/16/stylish-is-back-and-you-still-shouldnt-use-it/
[wacom]: https://robertheaton.com/2020/02/05/wacom-drawing-tablets-track-name-of-every-application-you-open/
[hp]: https://robertheaton.com/2019/09/15/hp-printers-send-data-on-what-you-print-back-to-hp/
[snoo]: https://robertheaton.com/2019/11/21/how-to-man-in-the-middle-your-iot-devices/
[tipoffs]: https://robertheaton.com/tipoffs
