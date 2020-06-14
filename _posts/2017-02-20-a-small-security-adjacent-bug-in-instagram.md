---
permalink: /2017/02/20/a-small-security-adjacent-bug-in-instagram/
title: A small, security-adjacent bug in Instagram
custom_meta: When a user updates their email address, Instagram (like almost all websites) sends a notification of the change to the old email address. This is primarily so that if an attacker compromises an Instagram account and attempts to completely lock the owner out by changing the account's email address, the victim is made aware of this change and can contact Instagram and attempt to recover their account.
layout: post
---
# Summary

When a user updates their email address, Instagram (like almost all websites) sends a notification of the change to the old email address. This is primarily so that if an attacker compromises an Instagram account and attempts to completely lock the owner out by changing the account's email address, the victim is made aware of this change and can contact Instagram and attempt to recover their account.

However, instead of informing a target that "your email address has been changed from $OLD_EMAIL to $NEW_EMAIL", a bug in Instagram’s notification email template means that the email reads "your email address has been changed from $OLD_EMAIL to $OLD_EMAIL." This makes the notification look much less alarming ("Your email address has been changed from you@mail.com to you@mail.com" vs "Your email address has been changed from you@mail.com to evil@mail.com"), and in at least one case (that of this allegedly technically-competent author) delayed the time for a user to identify and report an account takeover by several hours.

<p align="center">
<img src="/images/insta.jpg" />
</p>

# How to use this bug in your own hacking practise

* Gain access to target’s Instagram account, either by gaining access to their device or their Instagram password (this is admittedly the hardest step)
* Update the email address associated with target’s Instagram account to an email address controlled by you. As described above, they will receive a nonsensical notification about their email address being updated to itself. There is a good chance that they will ignore it
* Use the Instagram "Forgot your password?" flow to send yourself a password reset email. The target will receive no notification that their password has been updated, although all of their current sessions will be invalidated and they will be logged out.

You have now gained total control of the target’s Instagram account, without clearly tipping off your target . To further reduce the chance of being discovered, you could delay resetting the target's password until you want to lock them out of the account entirely, since it is only this step that causes them to be forcibly logged out from their current sessions. When this happens they will find that they are unable to log back in, and will have no choice but to confront the cataclysmic disaster that has befallen them. And contact Instagram support.

# Comments

Whilst I am certain that this bug makes Instagram accounts fractionally easier for attackers to take control of, it is not a big deal. An attacker has to actually gain access to a target's account before they can benefit from it, and even then a user with any degree of internet-security-paranoia is still likely to take the strange email as a sign that they should check that everything is OK. However, early humans evolved on the great plains of Pangea, where there were lots of lions and very little wifi, and we are already notoriously prone to machine-gunning ourselves in the foot when it comes to application security. Anything that makes this easier is bad.

As mentioned above, I stumbled across this bug when I received a strange looking email address update email for an Instagram account I had set up 7 years ago, in the bad old days before I had heard of password managers and when I thought that hunter2 was the height of security. Confused, I actually copied and pasted the "new" and "old" email addresses into 3 different REPLs to compare them for equality, thinking that maybe one of the letters was a Cyrillic "ь" in disguise or something.

```
~ rob$ python
>>> "cooldude123@gmail.com" == "cooldude123@gmail.com"
True
```

```
~ rob$ irb
:001 > "cooldude123@gmail.com" == "cooldude123@gmail.com"
 => true
```

```
~ rob$ scala
scala> "cooldude123@gmail.com" == "cooldude123@gmail.com"
res0: Boolean = true
```

It was only when I went to reset the password a few hours later, just to be on the safe side, and was informed that a notification email had been sent to `v******@b****.me` (this is not my email address) that I realized that I had been owned.

The Instagram account itself was 7 years old, unused and basically meaningless to me, but for completeness I emailed Instagram support to try and regain control of the account, and then started investigating why the email update notification I had received had not showed the email address of the attacker. I was hoping for something interesting like an edge case when two updates are made in quick succession, or when an empty update is made, or when the new email address includes a + symbol, or whatever. However, I quickly found out that there’s just a bug in the email template that prints the old email twice, which made me feel much less clever.

As part of my testing, I also noticed that the email update notifications have a small link at the bottom saying "If you didn't change your Instagram email address, click here to revert this change." This is a very smart feature, and should make it easy for account takeover targets to quickly undo the damage themselves. However, when I first received the email, I hadn’t seen this button, and I wasn’t sure why.

<p align="center">
<img src="/images/insta.jpg" />
</p>

Then I remembered that the email I had received had been in (I think) Russian. I am not Russian, and so this had the useful effect of immediately putting me on high security alert and made me more likely to investigate further. However, even after Gmail had  translated the email into something resembling English, I still had absolutely no intention of clicking on any of the links in it. If my Bible has taught me anything, it’s that you don’t click on links contained in suspicious Russian emails, no matter how confident you are that it might be safe, unless you are inside several layers of virtual machines and are air-gapped from everyone you love and everything you hold dear. And thus the attacker’s stereotypically sketchy l10n settings also had the effect of making me terrified of Instagram’s elegant and completely legit anti-account compromise tools.

I like to think that this was a planned and ingenious choice on the part of the attacker, and that they deliberately set my Instagram language to Russian before updating the email address. But I imagine that in reality Instagram takes its language settings from a per-device cookie, and that the settings on the account that they use to post artsy photos of themselves hanging out with their nefarious buddies in the evil mountain lair that they bought with their piles of Instagram gold simply carried over.

# Timeline

* 2017-02-07 - Reported bug to Facebook as a security vulnerability
* 2017-02-07 - Facebook reply saying that this is not a security vulnerability
* 2017-02-07 - Replied to Facebook saying that I think it is and can I have a bug bounty please
* 2017-02-08 - Facebook insist that it is not (probably correctly) and close the ticket
* 2017-02-20 - Blog post published
