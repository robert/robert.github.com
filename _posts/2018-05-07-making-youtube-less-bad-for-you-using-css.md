---
title: Making YouTube less bad for you using CSS
layout: post
og_image: https://robertheaton.com/images/youtube-pokemon-after.jpg
---
> Hopefully this will be the life hack that makes her love me again.

I’m a smug person. I'm extremely keen for you to know that I don’t have the Facebook app installed on my phone. And that I almost never look at my Twitter feed. Also I don’t sleep with my phone next to my bed and I have this really smart rule of no screens an hour before lights out. And whilst I did recently complete Skyrim on the PS4, I was very efficient about it and zipped through in only a little over 50 hours of play time, which might sound like a lot but is actually very quick compared to most people. And, despite all this effort and smugness, I still frequently get sucked into watching a very large number of YouTube videos that I didn’t actually want to watch and will probably not be putting on my resumé.  

No one sets out to see how many YouTube videos they can watch in a day. Nonetheless, this metric is the primary driver of YouTube employee happiness during bonus season, which makes it hard to feel that YouTube is fully on my side. I don’t like many of the behaviors that YouTube is incentivized to nudge me into. I don’t believe that recommended videos, comments and video annotations are designed to help me realize my conception of the good life, and anecdotally I know that many other people feel the same way. People say that willpower is a finite resource, and some of these people include footnotes to actual social-scientific studies. I am fully aware that no video is ever quite as earth-shattering as its title claims, but what if that extremely attractive person in the screengrab is actually in the video this time?

I’m sure that someone somewhere has searched YouTube for “hilray emilas”, tumbled down an auto-playing rabbit-vortex of endless thoughtful commentary, and come out the other side feeling educated, enlightened, and intellectually rejuvenated. I’m sure that YouTube does create valuable new cultural touchstones for the digital-first generation that my fossilized brain will never be able to comprehend. I understand that my parents thought that MSN Messenger was a waste of time, and that their parents thought that Kojak would prevent them from ever making anything of themselves. Nonetheless, I still tend to believe that this time something really is different.

One day, after having trekked about half-way along the treacherous Road of Recommended Videos that takes you all the way from Davids Frum through Duke, I stood up, had a long shower, and decided to make having positive interactions with YouTube use up much less willpower. I put together some [Stylus CSS rules](https://chrome.google.com/webstore/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne?hl=en) to remove the bits of YouTube that I don't believe have my best interests at heart, which it turns out is pretty much all of it except search results and actual videos.

NOTE - make sure you use Styl*us* and not Styl*ish*, a similar browser extension. Stylish is spyware that [steals and sells all your browsing history](/2018/07/02/stylish-browser-extension-tracks-every-website-you-visit/).

## Before

<p align="center">
<img src="/images/youtube-pokemon-before.jpg" />
</p>

<p align="center">
<img src="/images/youtube-katy-perry-before.jpg" />
</p>

## After

<p align="center">
<img src="/images/youtube-pokemon-after.jpg" />
</p>

<p align="center">
<img src="/images/youtube-katy-perry-after.jpg" />
</p>

These CSS rules:

* Hide the suggested videos in the sidebar
* Hide suggested videos at the end of a video
* Hide suggesting videos in the corner whilst you're still watching something else
* Hide comments
* Hide notifications
* Hide annotations - I think YouTube let’s you turn these off but I don’t think it sticks
* Hide miscellaneous buttons I never use - notifications, various buttons on the homepage, thumbs up/down
* Hide homepage videos
* And in the extreme version, hide all homepage content at all except a search bar

Removing the sections of websites that don’t serve your goals makes the internet a more relaxing place. Installing my YouTube tweaks for yourself via the [Stylish Chrome extension](https://userstyles.org/styles/159555/distraction-free-youtube) doesn’t require knowing anything about CSS or internet browsers. If you like the alterations then you should also check out my [previous attempts to turn down online noise](/2016/08/08/hide-the-internet/), and [let me know](https://twitter.com/robjheaton) if you have any other ideas for websites that need some moderation imposed on them.

---

<i>
To hide the distracting parts of YouTube for yourself:
</i>

* Download Stylus for [Chrome](https://chrome.google.com/webstore/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne?hl=en) or [Firefox](https://addons.mozilla.org/en-US/firefox/addon/styl-us). NOTE: do NOT download Styl*ish*, a similar extension. It is spyware that [steals and sells all your browsing history](/2018/07/02/stylish-browser-extension-tracks-every-website-you-visit/).
* Copy this [YouTube style](https://userstyles.org/styles/159555/distraction-free-youtube)
