---
layout: post
title: Take back your time
published: false
---
When Facebook takes [fifty minutes of your day](http://www.nytimes.com/2016/05/06/business/facebook-bends-the-rules-of-audience-engagement-to-its-advantage.html), emails are crack and watching any kind of realtime feed is more fun than all but the most avant garde forms of sex, how is anyone meant to feel like they are in control on the information superhighway?

We can argue about whether Facebook’s fifty minutes is a testament to the engaging and valuable product that they have fashioned out of pure love, or whether it represents a nefarious plot to steal the world’s time and convert it to [failed New Jersey schools](https://www.buzzfeed.com/mollyhensleyclancy/what-happened-to-zuckerbergs-100-million). As with all things, it’s almost definitely a bit of both, but it’s worth remembering that delightful product and evil time vortex both look the same on a quarterly earnings call, and the latter is much easier to A/B test. If you believe that your level and style of internet usage is already right for you, and that it affords you the perfect balance of connectedness to the world, people you love and people with a similar name to someone you once met at a bar, then I’m not going to try and take us down the alleyway of debating whether there is a difference between value and perceived value. It’s a dark and dangerous side-road, and you look more intellectually muscular than me. When I use the general form of ‘you’, quash your anger and be assured that I am not talking about ‘you’ specifically.

Personally, I feel disproportionately grubby when I find myself standing in a knee-high sludge of Twitter feed or Articles That I Might Also Enjoy, with little recollection of how I got there. Even just flicking onto gmail.com and seeing that no one has contacted me since I went to get a glass of water makes me feel like I’ve lost something. Sometimes I sit down, fired up to do some focussed writing, and then just quickly check whether anything fun has happened on Hacker News in the last two hours. The time cost might only be a few minutes, or even only a few seconds if I can’t find any exposes of employee-soul-annhilation at Silicon Valley companies I don’t work for. But the gain is next to nothing, the dopamine monster living inside my brain gets slightly larger, and it destroys the idea that the most and only important thing for the next hour is writing.

On the other hand, there are times when you, being of sound mind and body, genuinely want to know what people you are interested in are thinking or doing. I still don’t entirely get Twitter (follow me [here](https://twitter.com/robjheaton)), but I can see how one might. News websites keep you in touch with the world, and news aggregators tell you which parts of the world to keep in touch with. Facebook messages, events and photos are all products with clear value according to even the most curmudgeonly and paternalistic definition of the word. Whilst every other heartbeat might be excessive, you do need to check Gmail sometimes.

You just need to be able to get in, do what you want to do and then get the hell out of Dodge without being waylaid by articles written from viewpoints that you are politically sympathetic to but will have forgotten completely come the morning. You need to ignore the parts of the page that are nothing more than a thin plastic tarp over a bottomless void, leaving only the predictable, old-fashioned widgets that enable you to have a specific plan and then click a button to execute that plan. “Dear Grandma, it was my birthday yesterday, where the fuck are my presents? Hope you are well. SEND. QUIT." If the page is all bottomless void then you need to be able to insert some additional safety ropes around the entire thing, so that you only enter when you have a trained support team ready to drag you out.

Enter Stylish. Stylish is a browser extension for [Chrome](https://chrome.google.com/webstore/detail/stylish/fjnbnpbmkenffdnngjfgmeleoegfcffe) and [Firefox](https://addons.mozilla.org/en-US/firefox/addon/stylish/) that allows you to manipulate a webpage’s [CSS](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Getting_started/What_is_CSS) into doing your bidding, rather than that of the organization that sent you the page. CSS is essentially the rules that tell your browser how to display a page. If you change the rules to say that a particular part of the page should be hidden, then your browser will hear and obey. It is straightforward to hide the Facebook newsfeed:

<p align="center">
<img src="https://cloud.githubusercontent.com/assets/1565857/15089699/b6e9eeac-13be-11e6-8ead-9c8bb74820aa.png" />
</p>

Or the Twitter newsfeed:

<p align="center">
<img src="https://cloud.githubusercontent.com/assets/1565857/15089698/b6d902d6-13be-11e6-836d-5dea1122ac6f.png" />
</p>

Or Hacker News:

<p align="center">
<img src="https://cloud.githubusercontent.com/assets/1565857/15089723/7838c1aa-13bf-11e6-93ec-87508fa3d8a6.png" />
</p>

Or BBC News:

<p align="center">
<img src="https://cloud.githubusercontent.com/assets/1565857/15089701/b6f4c0ca-13be-11e6-93be-91b42b78b5b1.png" />
</p>

Or even Gmail:

<p align="center">
<img src="https://cloud.githubusercontent.com/assets/1565857/15089929/4a8d855a-13c5-11e6-85d8-19a96c0c081c.png" />
</p>

If you want to just hide a page completely, you can use the rule `body {display: none}` to obliterate everything (see below). But I quite like only hiding a portion of the page where possible, because it reminds me that the site hasn’t just failed to load and makes me feel like a subversive internet cowboy. Your changes can be easily temporarily disabled:

<p align="center">
<img src="https://cloud.githubusercontent.com/assets/1565857/15089935/bcd4346a-13c5-11e6-8a74-0edcfe7d68b3.png" />
</p>

This gives you an out when you decide that you really would like to spend a bit of time catching up with your friends, or the state of the internet, or the world. But this tiny hack still inserts a friendly, inquisitive goblin that peeks over your shoulder and asks chirpily “are you sure you want to do that?” It yanks you outside of yourself for a brief second. It makes you remember that you have a definition of The Good Life, and whether it’s writing a screenplay, crushing your quarterly sales targets or simply being more present, it’s probably not this.

---

<i>
To hide distracting parts of the internet for yourself:

* Download Stylish for [Chrome](https://chrome.google.com/webstore/detail/stylish/fjnbnpbmkenffdnngjfgmeleoegfcffe) or [Firefox](https://addons.mozilla.org/en-US/firefox/addon/stylish/) 
* Install some or all of the above styles from [here](https://userstyles.org/users/331645)
* If you would like to hide additional sites, you can either create new style with the rule `body {display: none}` to hide everything, or (advanced) use [the developer tools](https://developer.chrome.com/devtools#dom-and-styles) to hide only that part of the site that is causing you problems
<i>
