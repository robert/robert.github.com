---
permalink: /2018/07/02/stylish-browser-extension-steals-your-internet-history/
title: "\"Stylish\" browser extension steals all your internet history"
layout: post
tags: [Online Tracking]
og_image: https://robertheaton.com/images/stylish-prev2.png
og_image_width: 1568
og_image_height: 924
redirect_from:
  - /s
---
Before it became a covert surveillance tool disguised as an outstanding browser extension, [Stylish](https://userstyles.org) really was an outstanding browser extension. It bestowed upon its users nothing less than the power to change the appearance of the internet. Its extensive bank of user-made skins gave bright websites a dark background, undid disliked UI changes, and added manga pictures to everything that wasn't a manga picture already. I spent many wonderful hours in its simple CSS editor, [hiding the distracting parts of the web](/2016/08/08/hide-the-internet/) whilst unknowingly being spied on. Facebook news feed - gone. Twitter news feed - gone. Personal browsing history - gone. Quality of life and unexplained ennui - up and down respectively.

<p style="text-align: center;">
	<img src="/images/stylish-fb.jpg" />
</p>

Unfortunately, since January 2017, Stylish has been augmented with bonus spyware that records every single website that I and its 2 million other users visit *[[EDIT - I am told that the Chrome version has had tracking since January 2017, but the Firefox version has only had it since March 2018](https://twitter.com/Caspy7/status/1014971142581444610)]*. Stylish sends our complete browsing activity back to its servers, together with a unique identifier. This allows it's new owner, [SimilarWeb](https://www.similarweb.com), to connect all of an individual's actions into a single profile. And for users like me who have created a Stylish account on [userstyles.org](https://userstyles.org), this unique identifier can easily be linked to a login cookie. This means that not only does SimilarWeb own a copy of our complete browsing histories, they also own enough other data to theoretically tie these histories to email addresses and real-world identities.

Stylish's transition from visual Valhalla to privacy Chernobyl began when the original owner and creator of Stylish sold it in August 2016. In January 2017 the new owner sold it again, announcing that ["Stylish is now part of the SimilarWeb family"](https://forum.userstyles.org/discussion/53233/announcement-to-the-community). The SimilarWeb family's promotional literature lists "Market Solutions To See All Your Competitors' Traffic" amongst its interests. I'm starting to feel like I might have become the product. I understand that it probably isn't SimilarWeb company policy to threaten to show their users' browsing history to their mothers and rabbis unless they hand over a big pile of cash. But it wasn't Equifax company policy to lose all those Social Security Numbers either.

# Why this is dangerous

The SimilarWeb Privacy Policy says that they only collect "non-personal" data, and I assume that this is technically true. But accidents happen. When you unwittingly entrust your personal data to a company like SimilarWeb, not only do you have to hope that they have no actively evil intentions (besides those listed on their pricing page). You also have to hope that they have good data access controls, no rogue employees, and strong enough security to prevent the theft of all their data (formerly your data). Worse, even the filching of a nominally anonymized list of URLs has significant privacy and security implications. De-anonymization using IP addresses and the specifics of a user's browsing history is often straightforward. Who do *you* think that person visiting `https://www.linkedin.com/in/robertjheaton/edit` might be?

Single URLs with no additional context can be very sensitive too. For example, some websites use URLs containing special authentication tokens to log their users in automatically when they click a link in an email. When a user clicks on a link like `mysocialnetwork.com/inbox?login_token=fsdj80d...etc...`, the website uses the long, secret `login_token` in the URL as an alternative password, and logs the user into their account. This is a risky but sometimes defensible practice that relies on login tokens staying secret and unguessable. However, since they are part of the URL, Stylish happily records them and sends them back to the SimilarWeb servers. Their databases presumably contain secondary login credentials for user accounts on any number of other services.

Sensitive URLs crop up elsewhere too. My online medical provider shows me my medical documents using secret, 1000-character long URLs (generated by Amazon S3) that expire within a minute or so. For these pages, no login authentication beyond simply knowing the URL is required. Anyone who guessed the authentication token in the URL before it expired would be able to view and download my medical documents. In my opinion this is not best practice on the part of my online medical provider's engineering team. But the real world is full of things that are not best practice, and no conventional attacker is actually going to be able to guess a 1000-character long URL within a minute. Stylish makes life easier for them by harvesting the whole thing and recording it in their database. Now this stupid advertising company also owns pointers to my medical records. I really hope they never get hacked.

Most prevalently, many websites use URL tokens to allow users to reset a forgotten password. When a user clicks on the "Forgot Your Password?" button, the website sends them an email containing a special link. This link points to a long URL that looks something like `mysocialnetwork.com/password-reset?reset_token=a3dJ3...etc...`. When the user clicks on it, the website reads the `reset_token`, looks up the corresponding user, and allows them to safely reset their password. However, if an attacker were able to intercept these URLs and complete the password-reset process before the real user, they would gain total control over the account. Once again, Stylish hoovers up these password-reset URLs, taking its users' privacy and security into its own hands.

# See for yourself

Even though Stylish's new snooping functionality has been [public knowledge since the SimilarWeb announcement](https://www.bleepingcomputer.com/news/software/2-million-users-impacted-by-new-data-collection-policy-in-stylish-browser-add-on/), I only discovered it last week whilst doing some unrelated work on a different website. It was like catching my favorite uncle picking his nose and eating it and stealing my passport. On the other hand, I never paid my uncle for any of the nice things he did for me, so what did I expect?

Whilst looking at [Burp Suite](https://portswigger.net/burp), I noticed a large number of strange-looking requests going to `api.userstyles.org`.

<p style="text-align: center;">
	<img src="/images/stylish-burp-1-3.jpg" />
</p>

HTTP requests that send a large blob of obfuscated data to a URL ending in `/stats` are almost never good news for users. I noticed that the data blob contained only letters and numbers and ended in `%3D`, the URL encoding for an `=` sign. This made me suspect that the blob had been [Base64 encoded](https://en.wikipedia.org/wiki/Base64). I tried Base64 decoding it:

<p style="text-align: center;">
	<img src="/images/stylish-burp-2-2.jpg" />
</p>

Still nonsense. But the decoded string also contained only letters and numbers, and also ended in an `=` sign. I tried Base64 decoding it a second time:

<p style="text-align: center;">
	<img src="/images/stylish-3-2.jpg" />
</p>

Pyrrhic victory. When I looked at the contents of the decoded payload, I realized that Stylish was exfiltrating all my browsing data. I Googled "stylish spyware" and found lots of shops selling fashionable espionage gear. I also found plenty of articles confirming that [Stylish were up to no good](https://www.ghacks.net/2017/01/04/major-stylish-add-on-changes-in-regards-to-privacy/).

I looked closer at the decoded payload and noted a unique tracking identifier. I remembered that I had signed up for a Stylish account in order to [share some of my distraction-hiding skins with the world](/2016/08/08/hide-the-internet/). I wondered whether my session cookie would get appended to Stylish's tracking requests if I logged in to  `userstyles.org`.

Of course, it did. Stylish's session cookie is scoped to `*.userstyles.org`, so it gets sent to every `userstyles.org` sub-domain as well. To Stylish's very partial credit, the cookie is set to be very short-lived, and expires as soon as the browser is closed. This means that it is not appended to every tracking request - only the ones sent after the user logs in to `userstyles.org` but before they next close the browser. However, it only takes one tracking request containing one session cookie to permanently associate a user account with a Stylish tracking identifier. This means that Stylish and SimilarWeb still have all the data they need to connect a real-world identity to a browsing history, should they or a hacker choose to.

# Conclusion

It's not news that browser extensions can be a security nightmare. It's not even enough to trust an extension's current, benevolent owner. Even the benevolent have to make a buck eventually, and quiet sales to organizations like SimilarWeb are not uncommon. SimilarWeb claims that they need to track every single website Stylish's users visit in order to recommend them styles for the current webpage. This is a solution in search of a flimsy justification. If this were all they were doing then they would only need to send themselves the current page's domain, not the full URL. And it doesn't even begin to explain why they also need to scrape and send themselves your actual Google search results from your browser window.

<p style="text-align: center;">
	<img src="/images/stylish-google.jpg" />
</p>

There's a check box in the Stylish control panel that claims to disable tracking, although SimilarWeb helpfully enable it by default. It does appear to work, at least until the next change to Stylish's [2,000-word privacy policy](https://userstyles.org/login/policy) or 3,000-word Terms and Conditions. However, Stylish is no longer a well-meaning product with your best interests at heart. If you use and like Stylish, please uninstall it and switch to an alternative like [Stylus](https://www.ghacks.net/2017/05/16/stylus-is-a-stylish-fork-without-analytics/), an offshoot from the good old version of Stylish that works in much the same way, minus the spyware.

*UPDATE 2018-07-23: 2 days after publication of this post, Stylish was removed from the Chrome and Firefox stores. 3 weeks later, a new version is back in the Firefox store. [You shouldn't use this version either](/2018/08/16/stylish-is-back-and-you-still-shouldnt-use-it/).*
