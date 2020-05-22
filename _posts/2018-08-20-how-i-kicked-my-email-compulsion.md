---
permalink: /2018/08/20/how-i-kicked-my-email-compulsion
title: How I kicked my email compulsion
layout: post
tags: [Productivity]
og_image: https://robertheaton.com/images/email-compulsion-whiteboard.png
---
One of the sadder things that I have witnessed occurred at gate 10 of San Francisco Airport. I was sitting patiently by the desk, waiting for the 17:37 Virgin Atlantic Flight VS019 to London Heathrow. A man in a hoodie sat down next to me and took out his laptop. Once I had exhausted my equanimity and phone battery I started snooping on what he was up to, letting my normally 20/20 eyes go slightly out of focus in order to preserve his privacy. I watched as he checked his Gmail account. No new emails. He checked another Gmail account. No new emails there either. He opened up a Microsoft Outlook inbox. Still nothing. He paused. He drummed his fingers on his trackpad. He switched back to the first Gmail account and started scrolling through his spam folder in search of some dumpster gold.

Email is like an inbox of chocolates - you never know what you're going to get, and once they're all gone you feel bloated and sad but all you can think about is how to get more chocolates. 

——

I don't know if I've ever been an email addict. *Addict* is a technical term with a specific meaning and a WHO ICD-10 definition. But I've definitely been a compulsive email checker. I forget when this habit formed, but it first started bothering me 5 years ago when I read a lot of inspirational books about productivity and focus and sangfroid. I no longer think that these books got everything right, but none of them advised staying more in touch with your emails. After reading them I began to notice that when I don't check my emails very often I feel more focussed, relaxed, present, and consistent. When I do check them I feel distracted, interrupted, and sad that no one wants to talk to me.

But an inbox is a tempting, intoxicating place. I exchange long emails with friends and family in Britain, many of whom are very thoughtful and entertaining writers. A few times a year one of my blog posts gets popular on Twitter, and I get a batch of nice emails with thanks and suggestions, as well as the occasional hostile one castigating me for being such an idiot. Once every few months I get a recruiting email from Facebook asking if I want to work on their machine learning team. These messages have a link at the bottom saying "click here to stop receiving Facebook recruiting emails". I'm never going to work at Facebook (the commute and the hollowness), and if I ever change my mind then I can just send them a message saying hi. But I still haven't clicked unsubscribe, and I don't think I ever will. I think Facebook should start charging for these quarterly ego-boosts.

I get work emails too. But there aren't very many of them, and they aren't usually directly addressed to or about me. I'm in the fortunate position of rarely having to respond to work emails much faster than "in the next few days", and so I find them much less captivating.

For the last 5 years I've desperately wanted to be the kind of person who doesn't check their emails very often. I've written several blog posts and dropped many conversational hints in which I heavily imply that I already am this kind of person. In my head they also smile a lot, own a dog, value the important things in life, understand what motivates them, are in touch with their emotions, and have a tight group of close friends that they see frequently and have known since childhood. Secretly not being this person made me feel really, singularly bad,

But, after four months of consistent work, that's who I am, at least for now. I still don't smile much or value the important things in life, but I might have become more open to getting a dog. I've been checking my personal emails 3 times a day or less for the last 2 months, and it's had a noticeable effect on my mood, happiness and self-esteem.

Your compulsion of choice might be Twitter, Instagram, or Reddit. Whatever it is, you might be a bit happier if you used it a bit less, so here are the habits and thought patterns that helped me with my emails. Of course I'm an unblinded, uncontrolled and self-absorbed sample of 1, but my claims are plausible, free to implement, and probably jive with some of the pop-psychology we've both read.

## Using an alarm clock

For close to a decade, I've used an alarm clock to time 45 minute bursts of focus. For these 45 minutes emails, phones, and anything like them are strictly off limits. Call it Pomodoro or whatever other whimsical name you like, but I don't think I could function without something that dings every 45 minutes and tells me that now is an appropriate time to go and make some tea. This was a good foundation for change.

## Rules and Willpower

I’ve heard that psychologists have shown that willpower is a finite resource. I don’t know if this is actually true, or if the social psychology replication crisis means that I don’t have to listen to psychologists any more. This particular claim is pithy and plausible enough that I’m going to assume it's still correct.

Between 2013 and a few months ago, I had an email-hungry gorilla on my back. She was always demanding to know whether any long-lost friends, reporters (it happened once, it could happen again), or well-wishers had gotten in touch during the last few minutes. I also had a vague and mounting sense of wanting to check my emails less. Every time I did open my inbox I felt like I had failed at something, and had given in to my cravings and my gorilla. Whenever I even considered checking my emails I felt a duty to try to resist. Then I either spent some willpower, which we're assuming is a finite resource, or gave in and felt like a gross loser.

Putting in place small, specific, personal rules helped me a lot. The first rule I tried was "don't check emails in the morning until after breakfast." I have this notion that the early morning is somehow a special, magical time, and that how you spend it says a lot about who you are. I don't know where this idea came from; I assume either Sesame Street or Tim Ferris. Nonetheless, I'm stuck with it.

This made checking my emails in the early morning feel particularly grubby. But it was also particularly tantalizing. My UK friends had had 8 hours in which to email me their latest witticisms, and my blog could have somehow become extremely popular in India overnight. Of course I was invariably met instead by an update to my bank's online Terms of Service and a newsletter from the ACLU asking for some money. But who knew what might be there tomorrow?

Instituting consistent, long-term rules made me more confident that future Robert was going to be pulling in the same direction as me. If future Robert was going to make some sacrifices, then it was worth current Robert making them too. "Don't check emails in the morning until after breakfast" was a good first rule. Before it, I didn't know what morning success looked like. All I knew was that rolling out of bed and opening Gmail before I had put on my coffee was an extreme morning failure.

## /etc/hosts

Despite the proliferation of apps and browser extensions that offer to block you from your least and most favorite websites, my favorite piece of self-control technology is an ancient vestige from the 80s known as the `/etc/hosts` file.

`/etc/hosts` was designed at a time when you could count the number of sites on the internet on one hundred hands. Back then it was a hardcoded internet telephone directory that you copied onto your computer, and that mapped from names (like `ROBERT HEATON` - this was before even the time of domain names) to IP addresses (like `104.18.33.191`). If your computer wanted to send data to someone over the internet then it had to look them up in `/etc/hosts` first. If they weren't in there, you couldn't talk to them.

Nowadays we have the *Domain Name System* protocol (DNS) to translate host and domain names into IP addresses for us. But `/etc/hosts` lives on, in the bowels of your hard drive. Even though it is now mostly empty by default, you can still manually insert your own entries into it. These entries tell your device to translate a particular domain into a particular IP address, instead of using DNS to look it up properly.

```
127.0.0.1 mail.google.com
```

I used the `/etc/hosts` file to make it harder to visit distracting websites. I routed `mail.google.com` to the "loopback" IP address `127.0.0.1`. This meant that my computer was completely incapable of sending requests to Gmail. I could temporarily disable this block by opening `/etc/hosts` and deleting the `mail.google.com` line, but `/etc/hosts` is awkward to open and requires root access and entering a password to edit. This gave me a few extra seconds to think about whether I was really doing the right thing.

<img src="/images/email-compulsion-bash.png" />

My `/etc/hosts` has since expanded beyond just `mail.google.com`, and now contains over 50 websites. Any time I realize that I have accidentally visited a website without first consulting my brain, it goes into `/etc/hosts` and gets blackholed to `127.0.0.1`. So far this is mostly social media or news sites that I don't think have my best interests at heart, and the personal blogs of a few people I am particularly jealous of.

## Willpower, part II

I continued making more small, incremental rules. I started ticking off daily successes in a grid on the whiteboard on my fridge each day, and crossing off the occasional failure. I boasted about my accomplishments to my wife, who dutifully agreed to be enthusiastic and supportive about my weird, new economy goals.

<img src="/images/email-compulsion-whiteboard.png" />

My next rule was "no email checking or computer use after 8pm". I made sure that I got my sweet daily ticks by actually turning off my computer at 8pm sharp and storing it in a stiff and awkward-to-open drawer. I'm sure that even 8pm is too late to be safely looking at a screen, but I have important blog posts to write and idiots to crush on chess.com.

## Willpower, part III

I had brought safety to the start and end of the day, but everything in between remained an indecorous minefield. I still checked my personal emails after every 45 minute work session, and at least once an hour when I was relaxing at home. This added up to a total of around 12-15 email checks every day. This isn't entirely mind-rotting, but it's still an incredible frequency with which to do something that you don't actually want to do and that you know makes you sad. Becoming that non-email-compulsive person, with their dog and their emotional intelligence, was going to take one final push.

At first I tried adding the rule "try not to check emails in between work sessions", but that was too vague. Then I tried "never check emails between work sessions", but that amount of instant cold turkey proved beyond me. I finally had success with the compromise rule "don't check emails after at least 1 work session per day".

After a month of practicing this baby-step I felt ready to go further. I instituted a fixed schedule of email checking, at 7am, 10am, 12pm, 4pm, and 7pm each day. This was a big reduction in checks, of around 40%. But, thanks to the gradual warm up of my previous rules, the transition was surprisingly easy, and I felt smug.

However, when I tried to explain to other people how serene and self-controlled I was being, 5 checks a day started to sound like a lot. It takes a long time and a surprisingly large number of fingers to count off "7, 10, 12, 4 and 7". No one was very impressed with me. I still considered this reduction a great achievement, but what's the point in great achievements if nobody else is envious of them?

So a few weeks later I turned the dial down one final time. Now I check my personal emails at 7am, 12pm, and 7pm. I don't think I need to go any further. I'm sure there are some monks somewhere in the Cotswolds who only check their emails twice a day after prayers, but for unbelievers I think 3 times a day is OK. 

## Conclusion

This might be starting to sound prescriptive and a bit too much like life advice. But I'm guessing that you're not reading this essay because you care all that deeply about my personal story and wellbeing. So let's finish by dropping the pretense at personal history and giving some direct recommendations.

Here's what you should do if you want to check your emails less often. Feel free to adapt these recommendations for your compulsion of choice.

* If your job allows, use a timer to time bursts of work
* Add websites that you visit that don't support your goals (including your email provider) to your `/etc/hosts` file. There are lots of how-to guides on the internet
* If you haven't already, take your email off your phone. You'll figure out how to survive without it
* Start setting small, specific daily goals for yourself. "Don't check emails until after breakfast". "No emails until I've gone for my evening run."
* Don't beat yourself up if you sometimes fail at those goals
* Give yourself a tick somewhere whenever you hit a goal for the day. Boast a little bit to someone who is societally obliged to listen
* Aim for an eventual goal that you think will make you happy

Good luck.
