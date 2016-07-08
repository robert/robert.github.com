---
title: How to make Slack less bad
published: false
---
Slack claim to be in the business of "[making your working life simpler, more pleasant, and more productive](https://slack.com/)". We’re about to be cynical, so let’s acknowledge that this claim is probably at least partly true.

Then let’s acknowledge that they are actually in the much more profitable business of making money and driving product usage by belching out a cataclysm of urgent red circles and desktop alerts and mobile notifications. We should also note that they will be in this business until the not-too-distant day when every single office worker is either face down in a pool of blood at their desk or rocking back and forth in a county asylum muttering "Slackbot told me to do it".

## Facebook for work

[Yammer](https://www.yammer.com/), [tibbr](http://www.tibbr.com/) and [Chatter](http://www.salesforce.com/chatter/overview/) present themselves as Facebook for work. [Facebook At Work](https://work.fb.com/) presents itself as Facebook for work. However, none of these products are actually Facebook for work. Slack is. Slack packages up the things that other people type and presents them in a way that compels you to keep reading and searching and clicking and creating more typing of your own. Slack is ninety-five percent extremely dull, but seems more interesting than it really is because you know the people involved. Slack is mostly a sea of irrelevance, but occasionally surprises you with the delicious and variable reward of Shit Going Down. You open up Slack to answer a specific message or check a specific point of information, and then wake up twenty minutes later knee-deep in things you don’t really care about feeling like you just ate six donuts. Slack shouts at you with exciting red numbers, and you love it for this. This is all familiar to you.

[Image comparing FB notifications and Slack notifications]

Everything bad about Slack is fundamentally Slack’s fault. Slack’s sane default for a new user is to play a sound and send a desktop notification every time anything happens anywhere. There is no way to simply turn off the screaming red circle on the dock icon. There is no way to simply fold away the sidebar so you can focus on whatever it is you are trying to do. These UI nitpicks help us understand Slack’s conception of the Good Life. Fine tune controls on the level of noise each channel is allowed to make give the illusion of control and serenity, but, to go directly and without shame to the cigarette company analogies, what we’ve got is Marlboro Lights when what we really need is some way to stop smoking.

To be clear, if you are having a deliberate and hard-earned break from whatever it is you do when you are using your brain, and are freely choosing to focus wholeheartedly on goofing off on Slack, then I support you unreservedly. Personally, if and when I have the time to goof off on Slack then I generally prefer to finish working early and go home. I do see the value in workplace camaraderie, but not as much as in having a really great bath. For once I really don’t mean to be judgmental; everything is a tradeoff, and I almost definitely have fewer work friends than you.

## Don’t tell anyone but I actually quite like meetings and emails

Slack claims to reduce the number of meetings you have. A [survey of 461 Slack owners and administrators](https://slack.com/results) estimated that Slack had reduced the total number of meetings that they had by an average of 25.1% (±4.53 margin of error with 95% confidence).

A quick digression to pick on a marketing page minutia: this addition of an error margin and confidence interval is tiresome integritywashing. Slack knows that the reader knows that any survey results a company publishes about itself are pointless and should be ignored at all costs. Presumably by publishing the mathematical uncertainties they hope to convince the reader that they are not like the other companies, and that they are instead being evenhanded and scientific. However, as they are well aware, the primary uncertainty in the 25.1% number is not the sample size, or anything else that can be communicated by statistical analysis. The primary uncertainty is the fact that the data are all imaginary numbers made up by Slack owners and administrators who invented them based on nothing. Or at least I can only assume they are - the page wisely stops short of a methodology section. This means that the error margin and confidence interval are completely useless for evaluating the data, and their only possible function is to misleadingly increase the perceived Scienceyness of the survey.

Anyway, Slack claims to reduce the number of meetings you have, by an average of 25.1% (±4.53 margin of error with 95% confidence). Taking the claim at face value and ignoring the fact that, despite its two decimal places of error margin, it is made up, this sounds like a wonderful thing. Everyone with an office job knows that everyone with an office job hates meetings, and has bonded over this fact with other people with office jobs at dinner parties.

But reducing the number of meetings is not a moral good in itself. Meetings can be fantastic. A specified, planned period of time where you can get your thoughts together and come out with a set of defined objectives can be a beautiful thing. When a meeting is run with care, empathy, and a rigorous, adhered-to agenda, it can be a wonderful way to achieve spiritual enlightenment and enhance shareholder value at the same time. On the other hand, Jason Fried describes group chat, using words that I wish I had thought of first, as “an all-day meeting with random participants and no agenda”[LINK]. Replacing conference rooms and video calls with an amorphous, atemporal and poorly capitalized wall of text is not progress.

Everyone who has heard about forced context-switching will tell you about how horrible it is, and they will all be correct. However, without forced context-switching Slack loses a lot of its shine and sparkle. You should not expect any quiet mode features that work or are enabled by default. There is no way to send a message saying "hey, no rush, but if you could XYZ sometime in the next day or two that would be sweet." If you have ever sent or received such a message, you will have noticed Slack’s innovative feature whereby when someone types the words “hey, no rush but” they are auto-corrected in the mind of the receiver to "DO THIS NOW NOW NOW NOW I HATE YOU". Sending your request by email would allow the recipient to deal with it in their own time and mark it for later, but when Slack is available sending an email feels creepy and weird and like sending an intimate Snapchat asking for last quarter’s growth figures.

I know all this, but I still send Slack messages for non-urgent requests because they just get resolved *so quickly*.

## Solutions

This is not to say that Slack is an undiluted hot sewage enema. Slack is great for a lot of things. I just want:

* To be reachable in an everything-is-on-fire emergency (perhaps this is just what [PagerDuty](https://www.pagerduty.com/) is for, though)
* To be reachable when someone (especially remotes) has an important question that, all things considered, is worth the interruption
* To very occasionally be pulled into an opportunistic, ad-hoc discussion of something important
* It’s nice to say hi to the team (especially remotes) in a low-touch way in the morning, and to announce things like leaving early or being ill in a low-key way
* It’s nice to be able to say "papertrail: bringing down the search indexer" to create a public log of the actions you’ve been taking that might prove invaluable to someone panicking about the state of the search indexer

You’ll notice that these are either extremely urgent or not urgent at all. Slack is good for the kind of conversations that are so important and immediate that it is fine to force people to drop what they’re doing and read them, or so unimportant that it is fine if no one does. It’s terrible for everything in between. Unfortunately this describes the vast majority of workplace communication, and double-unfortunately Slack still need this to happen inside their product in order to make their usage figures look juicy.

To do Slack’s work for them and add in the features that they inexplicably missed out:

1. Turn on Do Not Disturb mode from 12:00AM to 11:30PM everyday

<p style="text-align: centre">
<img src="https://cloud.githubusercontent.com/assets/1565857/16693331/9bd380d6-44e9-11e6-98cf-8671216ca6d4.png" />
</p>

([see here](https://get.slack.help/hc/en-us/articles/214908388-Using-Do-Not-Disturb-in-Slack))

In a further moderately revealing UX choice, it is not possible to go into permanent Do Not Disturb mode. 23.5 hours per day is is the best you can do. It's fine to leave a small 11:30PM - 12:00AM chink in your armor, since you should either be asleep or negotiating with your captors for your release at this time. Perma-Do Not Disturb is preferable to turning off notifications entirely, since you want people to be able to reach you quickly if they really need to.

2. Remove notifications from the Slack dock icon

<p style="text-align: centre">
<img src="https://cloud.githubusercontent.com/assets/1565857/16693460/1763a316-44ea-11e6-87b8-6313d360bbeb.png" />
</p>

([see here](http://appsliced.co/ask/how-do-i-disable-the-red-badge-dock-alerts-in-os-x))

Even if you have turned off desktop notifications, you’ll still be tabbing through different applications whilst you do your actual work, and I defy you to ignore a "5" in a red circle for longer than 7 seconds. Turning icon notifications off entirely is not possible in the Slack app, so you’ll have to do it in the OS X notifications center.

3. Build your own protective shield

[Screenshot]

Despite your best efforts, you may still catch a hypnotic glimpse of an unread channel whilst tabbing between windows. Slack has no "neutral" mode that you can go into when you don’t want to be distracted, but you can make a decent substitute by creating your own Slack team and logging into that on the same machine as your main one. You can press Cmd-1 when you want to turn off the spigot of noise, and Cmd-2 when you want to flick it back on again. It takes a bit of training to get yourself to remember to do this, but it's surprisingly restful once you do.

When I’m getting a dopamine rush for workplace chatter, I can’t help but feel that something has gone quite wrong. That said, a company making an enterprise product that people are kind of scared of is probably doing very well. It’s relevant. No one is scared of a fax machine anymore.
