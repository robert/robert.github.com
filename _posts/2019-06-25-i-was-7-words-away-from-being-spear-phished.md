---
title: I was 7 words away from being spear-phished
layout: post
tags: [Security]
og_image: https://robertheaton.com/images/phish-cover.png
---
Three weeks ago I received a very flattering email from the University of Cambridge, asking me to judge the Adam Smith Prize for Economics:

> Dear Robert,
>
> My name is Gregory Harris. I'm one of the Adam Smith Prize Organizers.
> 
> Each year we update the team of independent specialists who could assess the quality of the competing projects:
http://people.ds.cam.ac.uk/grh37/awards/Adam_Smith_Prize
>
> Our colleagues have recommended you as an experienced specialist in this field.
>
> We need your assistance in evaluating several projects for Adam Smith Prize.
>
> Looking forward to receiving your reply.
>
> Best regards,
> Gregory Harris

I wouldn't say I'm an "expert" in economics exactly, but the university's request wasn't that surprising. I do have a subscription to The Economist, and I do understand - very roughly - how and why central banks set interest rates. I've read "Capital in the Twenty-First Century" and basically got the gist of the first half. I've [written](/2018/06/05/why-economists-need-bureaucracy/) [a few](/2019/03/17/robert-prove-that-your-randomized-trial-really-was-random/) [blog](/2019/02/24/making-peace-with-simpsons-paradox/) [posts](/2019/03/31/the-robot-reserve-army-of-labor/) that I've generously tagged as "economics", and perhaps there's a new discipline of computational economics that I might be able to shed some software industry insight onto. Overall it felt perfectly plausible that the organizers of the Adam Smith prize would want my perspective. I assumed that being a judge for the Adam Smith Prize would be a lot of work and would not be paid, but it would still be great fuel for the ole ego.

All of this said, in my heart of hearts I knew that some wires had probably got crossed somewhere. There was no doubt a Professor Hobert Reaton at UC San Diego, expert in Heckscher-Ohlin trade theory, who was patiently waiting for the chance to further his career through a Transatlantic collaboration. Nonetheless, I judged this a thread worth pulling and a mild fantasy worth entertaining.

I reflexively did some basic security hygiene checks. The email was from an `@cam.ac.uk` email address. I hovered over the link in the email - `http://people.ds.cam.ac.uk/grh37/awards/Adam_Smith_Prize`. It pointed to the same URL that the email text claimed it did, and was located on a valid `cam.ac.uk` subdomain. It did strike me as a little odd that the page was hosted inside `gh327`'s personal directory instead of the main economics department's site; but hey, it's probably less bureaucracy that way. I clicked on the link and read a little about the history of the Adam Smith prize.

If "Gregory" had added just 7 extra words to this page - "THIS PAGE MUST BE VIEWED IN FIREFOX" - I would have been screwed. More on that later.

Next I think I visited the root `cam.ac.uk` website to make sure that this really was the domain of the University of Cambridge. I did a quick Google for `gregory harris cambridge` to see how much of a big deal he was. I couldn't find much - I vaguely remember turning up only a very sparse LinkedIn account. But that's fine; not everyone has to have a Twitter profile or a cooking blog.

I remember thinking that Gregory's email seemed very curt and poorly phrased, and that he could use a few lessons on how to most effectively ask strangers on the internet to do free work for him. He was lucky that I didn't care about such trivialities. He was also lucky that I didn't care that he'd missed a "the" in `We need your assistance in evaluating several projects for Adam Smith Prize`. Apparently I further didn't care that he'd unnecessarily capitalized the word `Organizers` in `Adam Smith Prize Organizers`, or that he didn't seem to understand that a paragraph can contain more than a single sentence.

At the time I just thought he wasn't a very good writer.

I sent Gregory a short reply, expressing preliminary interest and asking for more information.

> Hi Gregory,
>
> Thanks for your email, I'm certainly interested. Could you tell me a bit more about what this would involve and who recommended me?
>
> Best,
> Rob

Gregory quickly replied - I was in!

> Hi Rob,
>
> Thanks for prompt reply.
>
> Your candidacy is in the candidate list we received from the San Francisco State University.
>
> We'll send you the description of several projects and the list of questions and criteria to assess them. 
>
> I think the plan will be ready by mid-June.
>
> Best regards,
> Gregory

I started to feel like a bit of a huckster. I pictured Hobert Reaton sitting in his office in San Diego, all alone, wondering why no one wanted him to judge their competitions. I decided that I would share my reservations with my new friend, and be completely open about my skills and weaknesses. If he still wanted me to judge his competition then that wasn't my fault.

> Hi Gregory,
>
> I'm starting to wonder if some wires have got crossed - I've read a few books by Paul Krugman, but aside from that have never studied or practiced economics. I'm a software engineer - this is my experience and education https://www.linkedin.com/in/robertjheaton/ . What do you think? Is there maybe another Robert Heaton in San Francisco who knows a bit more about economics?
>
> Rob

However, Gregory agreed (rather quicker than I had hoped) that maybe a mistake had been made and that actually I wasn't of any use to him.

> Hi Rob,
>
> Yeah, it may be a mistake. I'll consult with my colleagues and get back to you shortly.
>
> Best regards,
> Gregory

This was the last I ever heard from Gregory Harris. I thought nothing more of the exchange.

---

On Friday I received an email from Coinbase:

> Hi there,
>
> You may have recently received an email from individuals named Gregory Harris or Neil Morris, claiming to administer prize grants for the University of Cambridge. These are in fact fraudulent profiles, and belong to an advanced attacker attempting to deliver malware to your laptop...

This made a lot of sense, when I thought about it.

---

I had almost fallen victim to a technically advanced spear-phishing campaign. As far as I can make out (I haven't seen this explicitly written anywhere, and I could very well be wrong about it), attackers compromised email accounts and webpages at the University of Cambridge belonging to two people called "Gregory Harris" and "Neil Morris". The attackers used these accounts to run a spear-phishing campaign, with the goal of inducing their targets to visit one of two compromised pages hosted on `http://people.ds.cam.ac.uk`. If a target who visited one of the attackers' pages was using Firefox, malicious Javascript on the page [exploited a 0-day vulnerability in Firefox](https://objective-see.com/blog/blog_0x43.html) that allowed the attackers to break out of the browser sandbox and drop malware directly onto the user's operating system. 

I had happily and repeatedly clicked on the link that "Gregory Harris" had sent me. Fortunately I was using Chrome, although. But all it would have taken is for the attackers to add the 7 words "THIS PAGE MUST BE VIEWED IN FIREFOX" to the top of their page, and I'd have been toast. I'd have chuckled at how some poor chumps still couldn't figure out basic cross-browser compatibility, and I'd have smugly copied the link over into Firefox. It's not clear to me why the attackers didn't do this. Maybe they didn't have complete control over the contents of the page, or maybe they wanted to be as subtle as possible. Next time, eh?

The attackers originally targeted employees of Coinbase, a cryptocurrency exchange. However, according to members of the Coinbase team who I briefly corresponded with, the attackers subsequently broadened their campaign to a larger pool of people they believed to be associated with cryptocurrency. Presumably they wanted to steal our delicious, untraceable blobs of the blockchain. The joke was at least partially on them, since I've never owned any cryptocurrency other than a handful of Stellars that I got for free and have lost the password for. If they or any other attackers can help me get them back then I would be very grateful.

Armed with two legitimate-seeming identities, a Firefox 0-day, and an email list of people associated with cryptocurrency (plus me), the attackers set to work. They ruthlessly exploited innocent people's slightly over-inflated beliefs of their own abilities and importance, and infected anyone viewing their links in Firefox on Mac OS with a Trojan. The Firefox vulnerabilities have now been fixed, and the webpages that the phishing emails pointed at have been taken down. But I'd be surprised if at least a few people haven't been taken for a Satoshi or a billion.

---

I'm not sure how the University of Cambridge fits into this story. I don't know if "Gregory Harris" and "Neil Morris" are real people whose university accounts were compromised, or if they're fake people created by someone who compromised the university computing system itself, or if I'm just completely misunderstanding what happened. I don't want to publicly pry too much into Gregory or Neil's online lives, just in case they are in fact real, but my strong suspicion is that they are fake. This is wild speculation, as is everything else that follows, so if you work in IT at the University of Cambridge then please don't hate me. Please do tell me more about what actually went on though.

I haven't been able to find any online trace of either Gregory Harris or Neil Morris, other than their alleged LinkedIn profiles. Once again, this is perfectly fine. Not everyone has to be on Instagram or write Star Wars fan fiction. However, Gregory Harris's LinkedIn profile has recently been taken down - it still appears in Google searches, but is not available on LinkedIn. And while Neil Morris's profile is still up, it sure looks like it's a fake.

Neil's profile looks reasonable enough at first glance.

<img src="/images/phish-neil-main.png" />

But a quick Google search reveals that his self-description has been copy and pasted from another LinkedIn profile.

<img src="/images/phish-neil-copy.png" />

To me, this is enough on its own to confirm my prior suspicions. But if we look closer we can start to detect several other funny odors too:

* Neil's description of his Master's degree is a little strange. He's gone to the trouble of writing "Five courses and a dissertation", but then only lists four courses.

<img src="/images/phish-neil-edu.png" />

* Neil spent 7 years at secondary school. That's standard in the UK. But his final 2 years apparently overlapped with his first 2 years at university. That doesn't make much sense.
* Neil describes his pre-university education as "High School". We don't have "High School" in the UK - we call it "Secondary School". This might make sense if Neil was American, or trying to communicate with an American audience, but there's no indication that this is the case.

<img src="/images/phish-neil-sec.png" />

* Neil's LinkedIn cover photo is a stock photo of Cambridge University. I didn't think twice about this at first, but in light of all of the above, it strikes me as a little odd. Does he really love his university so much that he uses a stock photo of it in his professional profile? Not even a nice photo of his office that he took himself? It seems more likely to me that this is the work of someone trying to make a phony profile that persuades the casual reader "I work at Cambridge University, nothing to see here".

<img src="/images/phish-neil-cover.png" />

Neil, if you are real and this is your real LinkedIn profile then I am so sorry. But if you're so real then why did you copy someone else's self-description?

---

I don't think that it was careless of me to click on the link in the phishing email. Browser 0-days that are exploited by a sub-domain of `cam.ac.uk` aren't in my personal threat model, and I think that this is sensible. Security always has to be balanced with pragmatism, and not everything can be GPG-signed by a web of trust that leads back to Bruce Schneier. My [Twitter DMs](https://twitter.com/RobJHeaton) are open for splenetic criticisms.

Nonetheless, this episode has left me feeling incredibly uneasy. Even though my story ends safely, I still fell for a phishing attack hook and line, if not also sinker. It was blind chance that the attack vector was a 0-day for a piece of software that I don't use, rather than something more run-of-the-mill. After a few more back and forths I think I would have probably have enabled macros on any Microsoft Office documents that Gregory Harris sent me, and I might even have run code for him if he said it was part of an entry into the competition. As I mentioned I don't have any cryptocurrency to lose, but I sure do have money in my online banking accounts that I'd like to keep there.

I don't have an exhaustive list of the morals of this story yet. I think the main one is that you should keep your guard up when communicating with internet people who you don't know, even if their email address and website domain look legit and their DKIM signatures check out. Also, remember that it's extremely easy to overlook a large number of inconsistencies and oddities if you believe someone's underlying story, especially if this story makes you feel good. Looking back it's obviously completely absurd that the *University of Cambridge* would ask me to judge *an economics competition*, and re-reading Gregory Harris's email it's immediately apparent that it is not the work of someone skilled in professional online communication. But I wasn't thinking critically, and had been lulled into a false sense of security by that `@cam.ac.uk` email address and my own ego.

Oh, a final moral - think twice before you start humble-bragging (and brag-bragging) to too many people that you've been asked to judge the Adam Smith Prize for Economics.
