---
title: WeSeeYou - Democratizing De-Anonymization
layout: post
tags: [Security]
og_image: https://robertheaton.com/images/weseeyouheader.jpg
---
Hi everyone, thanks for coming. My name is Hobert Reaton, founder and CEO of WeSeeYou, the most powerful online user happiness and de-anonymization tool on the market today. Before I begin, has everyone signed one of our NDAs? Fantastic, fantastic.

<p align="center">
<img src="/images/weseeyouheader.jpg" />
</p>

Now, I know that you all love your users. But how can you really, truly feel a bond with another human or possibly house pet unless you know who they really are? How can you really sell them the right illegal firework, mousepad extension or on-demand funeral unless you know their hopes, their dreams, their influencer rating and their multivariate demographic segment?

You’re wide open with your users; you tell them which member of Arcade Fire would make the best hedge fund manager, and exactly which college your founders were at when they came up with the idea to build an online marketplace for colors. In return you just want to know who you're talking to. You ask for your user's email address so that you can check in with them every now and then. Maybe you also politely request that they whitelist you on their adblocker so that you can send a few tiny messages to a few tiny ad exchanges. And ask them to login with Facebook in order to participate in some truly sparkling intellectual discourse in the comments section. But you are almost always met with rejection.

We at WeSeeYou are on a mission to democratize access to universal user de-anonymization. Want to know when a celebrity or other top influencer is contemplating a purchase? Want to watch the activity of friendly or unfriendly journalists as they browse your news? Want to know when Donald Trump reads your article? Want to nudge your prices up and down just a shade depending on the depth of your visitor’s pockets? Or do you just want to know the name of the person on the other side of the screen? WeSeeYou will tell you. And today I’m going to show you how.

## Pay close attention to what people say

People may not want to talk to you, but they sure talk to each other a lot. They write Tweets, blog posts, reviews on Amazon, answers on Stack Overflow, articles, comments on articles, comments on comments on articles. They use text, gifs, images, videos, gifs, gifs, more gifs.

But even more than that, they use links. And a link is an interesting thing. When Donald Trump tweets a link to your article, you can reasonably infer that he has at some point had his browser open at your URL. But there’s still so much that you don’t know. When was he there? What was he looking at before? Or after? Was it how to spell the word “receive”? Some surprisingly tame pornography? Or something else entirely? What is he going to look at next time he’s on your site? Nobody knows, apart from him and his very lightly regulated Internet Service Provider.

WeSeeYou can answer these questions, and many, many more. All we need is one Tweet with one link - one connection between @realDonaldTrump and any page on any WeSeeYou client's website. We are able to achieve a surprising amount on the back of this apparently universal human desire to publicly associate oneself with URLs.

## How it works

## 1. User loads your website

Your user loads a page on your website, say `news.com/green-eggs-reportedly-delicious-with-ham`, and our Javascript starts sniffing around. Your users are a diverse, eclectic bunch, and one of the ways they most like to express their individuality is through the hardware and software settings on their internet browsers. Maybe Alex uses the Linux x86 platform with a slightly uncommon version of the Quicktime plugin, and maybe Brenda’s laptop produces a very unique image hash when passing through WebGL fingerprinting. It’s all cool, no one’s judging, everyone’s different! We collect the values of as many browser settings as we can, and ping them over to our servers where we use them to calculate a “fingerprint” for this browser. There are so many settings in modern browsers that almost all users have a completely unique fingerprint, and so we know that anytime we see this fingerprint again, we are almost certainly dealing with the same user. The EFF have built a [proof of concept](https://panopticlick.eff.org/) of this technique that I’ll make sure to include in the slide notes, which - remember! - you have sworn not to share with anyone outside this room.

<p align="center">
<img src="/images/weseeyou2.jpg" />
</p>

Our server calculates the user’s fingerprint and sends the result back to our Javascript, which quickly and seamlessly adds it into the URL in the user’s browser - `news.com/green-eggs-reportedly-delicious-with-ham-asdf2498sfdkujsxd69142`. This URL is now completely unique to this user. We’ve tagged them.

I should note that the EFF have shown that browser fingerprints often change every few days, as users update or otherwise mess around with their browser settings. However, most people who share one link typically share many more, and we are developing some very promising algorithms to combine similar fingerprints for users who look like they might be the same person.

## 2. What we do is in the background

Now that WeSeeYou knows that one (and only one) of your users has viewed the URL `news.com/green-eggs-reportedly-delicious-with-ham-asdf2498sfdkujsxd69142`, we go searching the internet and see if anyone shares this unique URL. We scrape the entire internet looking for your URL, with a particular focus on blogs, forums, news articles, Reddit and government websites. We are constantly crawling Twitter, Google Plus, LinkedIn, and all of the other major walled gardens. Whenever we find it, we save the connection between the URL and the person who posted it, and shoot you a webhook or email with what we’ve found.

Suppose that we find the URL in a Tweet by @SteveSteveington. You now know with near certainty that the user with the browser fingerprint that generated that URL was that very same @SteveSteveington. The next time you see a user with that browser fingerprint again, you know, in realtime, that that user is @SteveSteveington. And of course, this works even if @SteveSteveington has never logged into your site and has never told you anything about himself. How you use this information is up to you.

<p align="center">
<img src="/images/weseeyou1.jpg" />
</p>

We can even de-anonymize many of those weird people who don’t use social media. Anyone who writes a blog post, Amazon review or government advisory that contain links and some indication of the author’s identity can be identified using the exact same techniques described above.

## 3. Sharing is both caring and excellent for identification rates

But you don’t just win when people share links to your site. WeSeeYou combines data from all of our clients to become more powerful than you could possibly imagine.

A user's fingerprint is not only unique; it is the same *regardless of which website is doing the fingerprinting*. This means that when WeSeeYou calculates a user’s fingerprint for you, we can check whether we’ve already seen this fingerprint on any of our other clients’ sites. If we’ve previously managed to connect this fingerprint to its user's identity, even if it was using Tweets and URLs that had nothing to do with your site, we can immediately tell you who they are. The user doesn't have to share any links or interact with your site in any way. Every single WeSeeYou client knows who @SteveSteveington is from the second they sign up.

We believe that if we work together then we can build up the largest internet usage database in the world, and then we can sell the information back to you. Don’t worry, your users' data is safe with us, and we won’t ever share it with anyone else unless they pay us ten cents per query, or five cents if they are on our enterprise plan.

<p align="center">
<img src="/images/weseeyou3.jpg" />
</p>


## What if they don’t like it?

“Hobert,” you say. "I love it, but what if our users don’t?” And I hear you - it’s a reasonable concern. Many users don’t understand that what’s good for you is good for them, and get up in arms about a few lousy HTTP requests. But don’t let this worry you.

First - our software is very unobtrusive. Your site will continue to work in exactly the same way, with nothing more that some almost invisible updates to the URL. Most modern URLs already contain one or even several incomprehensible IDs, and adding another one shouldn’t make anyone feel bad. We use many different URL schemes that incorporate our tracking identifier in many different ways for further disguise.

Second - have you seen what people put up with already? You know the kinds of things that your ad networks are doing - or perhaps you don’t and you’d prefer that things stayed that way.

Finally - your users don’t really have much of a choice. We have seen some tools that have been able to block Javascript requests to our domain, but we're developing libraries to allow you to route the fingerprint data to us via your servers. And honestly, if anyone wants to have an arms race, we’re extremely ready and very well-funded.

That’s all I have to say today folks. Would anyone like to talk pricing? Oops, be careful sir, there’s plenty of time…one second madam, I’ll be with you shortly…yes, come this way…come this way...

> Header illustration by [Jessamy Hawke](https://www.jessamyhawke.co.uk/)
