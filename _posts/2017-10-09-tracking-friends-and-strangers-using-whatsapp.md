---
title: Tracking friends and strangers using WhatsApp
layout: post
tags: [The Adventures of Steve Steveington, Tracking]
---
You and your good buddy, Steve Steveington, are in training for an arduous charity walk. You signed up together on the spur of the moment and pledged to hold each other accountable whilst you got in shape for the big day. However, you have developed reason to suspect that Steve Steveington is losing his commitment to the plan and is staying up until the early hours of the morning partying at nightclubs or playing Call of Duty. This is unacceptable - if he falls behind because he didn't take your training program seriously then you're not going to be the one to drag him round the punishing 5km course.

However, he insists he is getting the 8.5 hours a night that your program calls for. You are going to have to find proof of his transgressions and confront him with it. You start scheming. You have heard that you can track people's sleep patterns using their online status in [Facebook Messenger](https://defaultnamehere.tumblr.com/post/139351766005/graphing-when-your-facebook-friends-are-awake). However, this requires you to be friends with your target, and the Stevester blocked you after the [Tinder incident a few months ago](https://robertheaton.com/2014/12/08/fun-with-your-friends-facebook-and-tinder-session-tokens/). You consider hiring a private eye, but then you realize that you can perform the same status-tracking trick using SS's WhatsApp account and the "last seen" feature. This is just as well, because you have already spent almost all of your savings on energy bars and headbands.

The plan is simple. Every 10 seconds, you check your target's WhatsApp status, and note if they are online or not. For avid users, like Mr Steveington, their first and last times on the app each day will be very close to when they wake up and go to sleep. If SS goes offline between 1100PM and 0730AM each day, you can infer that he is following the plan and just seems dull and sluggish because he is a dull and sluggish person. However, if he instead only goes dark between 0300AM and 0800AM, you know that he is skimping on sleep to either party or play computer games in his underwear. As a side-benefit, you hope that you may be able to infer things like the number of times he wakes up during the night and the waxing and waning of his social life.

<p align="center">
<img src="/images/whatsapptracker1.png" />
</p>

WhatsApp does have some privacy settings. Users can chose whether to display their "last seen" to everyone, just their contacts, or no one. Fortunately and of course, the default for all of the privacy settings is to share everything with everyone, and few people think to tinker with them. WhatsApp seem to encourage openness in other ways too - only users who display their own "last seen" are allowed to see the "last seen" of others. In real life you have Groucho Marx glasses for when you want some privacy and anonymity, but the Groucho Marx glasses for the internet can be hard to find. *(EDIT 2017-10-11 - changing your privacy settings actually does not help - see postscript)*

Monitoring Steve Steveington on WhatsApp presents a different set of challenges to monitoring him on Facebook. Facebook sends data to your browser using straightforward HTTP requests that you can easily write a program to mimic. However, WhatsApp communicates with your browser using a much more complex Web Sockets-based protocol. You like to think of yourself as more of a generalist engineer, and something as esoteric and silly as Web Sockets falls outside of your definition of generalist. You decide instead to write a Chrome extension to watch and record the contents of your web.whatsapp.com activity. You manage to do this in 4 lines of Javascript.

```
// NOTE - Requires jQuery
setInterval(function() {
  var lastSeen = $('.pane-header .chat-body .emojitext').last().text();
  console.log(Math.floor(Date.now() / 1000) + ", " + lastSeen);
}, 1000);
```

You sign in to web.whatsapp.com on your old laptop which still works except you have to use an external mouse and the left shift key has fallen off. You set your Chrome extension running and hide the laptop under your bed. You come back a week later and see what Steve Steveington has been up to. You copy and paste the output from the developer console and draw a couple of graphs.

<p align="center">
<img src="/images/whatsapptrackersleep.jpg" />
</p>

The conniving rogue has been playing you for a fool. You are disappointed but not surprised. You confront him with your evidence. Harsh words are exchanged and not taken back. The 5km charity walk team disbands in a cloud of acrimony and recrimination.

With even more time on your hands than ever before, you go just a bit mad and start monitoring any and every phone number you can find. You start to build up a detailed record of your accountant's sleep patterns. You wonder what it is that she gets up to until two am every Wednesday. You build some interesting graphs of the WhatsApp usage patterns of some of your exes. You wonder what it is that causes them to send so many messages during some weeks, but almost none during others. One of your friends plays squash with Vanilla Ice and has his phone number. You investigate and it turns out that Vanilla has never adjusted his WhatsApp privacy settings. Also the dude NEVER seems to go to sleep. You're dying to know whether your friends Lara and Tara are secretly dating. You can't help but write multi-variate cross-correlation software that shows a striking alignment between their WhatsApp usage patterns.

<p align="center">
<img src="/images/whatsapptrackercorrelation.jpg" />
</p>

You start to expand your monitoring capacity. You register some more phone numbers and buy some more laptops to expand your bandwidth. You start learning more about the protocol that WhatsApp uses to communicate with your browser, and in the meantime set up some headless browsers that click through and record multiple conversations automatically. Where possible you combine WhatsApp status data with status data from Facebook to give an even more complete picture.

You start a company that runs a service that takes a phone number and returns WhatsApp usage for that number. You sell this information to health insurers and credit agencies, who are both very suspicious of people who are awake at 4am. In order to scale the company you get the 5km charity walk team back together and reconcile with Steve Steveington, who happens to be an expert in distributed systems engineering. The day of the 5km charity walk comes, but you have both been up all night working on your Java bindings and sleep right through it.

*EDIT 2017-10-09: after you share your story on the internet, it is pointed out to you that whilst Steve can hide his WhatsApp "last seen at", he _cannot_ hide his "online" status. You update your tools to monitor whether people are "online" or not, rather than relying on "last seen at". There is now no way at all for WhatsApp users to defend against your monitoring, and your company valuation skyrockets.*
