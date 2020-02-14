---
layout: post
title: Don't let Magic Enhancer for Youtube slurp up your browsing history
tags: [Online Tracking]
og_image: https://robertheaton.com/images/pfab-cover.png
published: false
---
[Magic Enhancer for YouTube][magic-enhancer] is a handy Chrome Extension that improves the user interface of YouTube by hiding all the distracting bits. It is used by over 350,000 people. If you click the wrong buttons while installing it then it tracks the full URL of every website that you visit. 

The makers of Magic Enhancer, otherwise-invisible-presumably-shell-company BZO Technologies LC, are surprisingly open about their designs on your data. Their [privacy policy][privacy-policy] clearly states that they would like to record the URL of every website that you visit, and in order to enable the tracking you have to opt-in when installing the extension. But the justification they provide for needing this data is bogus; human beings are famous for clicking on buttons without reading the associated text; and I don't think that it should be possible for users to sign away this level of data to a random browser extension just by mashing a button. This isn't quite "you hereby assign all right of your firstborn child to us", but it's on that spectrum.

Magic Enhancer incorrectly claims that their tracking is technically necessary in order to power a feature that displays the number of likes and dislikes for a YouTube video.

<p style="text-align: center">
<img src="/images/magic-confirm.png" />
</p>

*(I've snipped out an image in the above screenshot to make it fit in this article)*

There is no possible way that such a feature would require slurping up the URL of every website that you visit, and this misdirection suggests that something nefarious is afoot. I have no idea what happens to your data once it reaches the Magic Enhancer servers, but the setup smells similar to [the type of data-hoovering performed by Stylish][stylish], another invasive Chrome extension that is owned by Similar Web, a web analytics company.

Let's have a look at the data that Magic Enhancer collects, and discuss how you can defend yourself if you don't trust the extension's developers but really like what they do to your YouTube interface.

----

I haven't contacted Magic Enhancer for comment about this story because the support email on their website doesn't work and their "Contact Us" page is blank.

----

To snoop on the traffic that Magic Enhancer sends, we set up [Burp Suite proxy][burp] and configure Chrome to send all its traffic through the proxy (see [my post about Wacom tablets tracking the name of every application you open][wacom] for more details on using proxies). We create a new Chrome profile to make sure we don't accidentally send Magic Enhancer any of our real, sensitive data, and install Magic Enhancer inside this profile. We turn on all of the "yes please track all my activity" settings. We stare at the Burp logs, looking for a suitably suspicious domain.

We soon see requests beaming out to `https://autohdvideoapi.com/embeddedPage`. We believe we have found our target. We look at the data in the body of these requests.

<p style="text-align: center">
<img src="/images/magic-burp.png" />
</p>

It looks like jibberish, but we've seen this flavor of nonsense before. For some reason many questionable analytics companies like to encode their data using base64 before sending it to themselves. We can only assume that this is to make it somewhat harder for a casual observer to see what they are doing. We wonder why they don't use something more difficult to decode, if only to make snooping on their activity more time-consuming.

Ours not to reason why, we write a quick script to decode the data:

```ruby
#!/usr/bin/env ruby
require 'base64'
require 'cgi'

data = {"ry":"Imh0dHAlM0ElMkYlMkZ0aGlzZG9lc250c2VlbWdvb2QuY29tJTJGIg==","nk":"Imh0dHAlM0ElMkYlMkZzaXRlcy5mb2kuY29tJTJGc2l0ZXMuYXNwJTNGZG9tYWluJTNEb2hkZWFyLmNvbSI=","ev":"Imh0dHAlM0ElMkYlMkZzaXRlcy5mb2kuY29tJTJGc2l0ZXMuYXNwJTNGZG9tYWluJTNEb2hkZWFyLmNvbSI="} # and so on for many more parameters
data.each do |k, v|
  decoded_v = CGI.unescape(Base64.decode64(v))
  puts "#{k}: #{decoded_v}"
end
```

We see that Magic Enhancer are indeed slurping up every URL that we visit, as promised by their privacy policy.

<p style="text-align: center">
<img src="/images/magic-evidence.png" />
</p>

For some reason they're also recording whether a page was reached by clicking on a link or by typing into the address bar.

----

Magic Enhancer's justification for grabbing this data is that they need it in order to enable video statistics. This is not true. Admittedly I can't actually get the video statistics feature to work, but whatever the feature is and however it is designed, its successful operation does not require Magic Enhancer to send themselves the URL of every website that you visit. It especially does not require information on whether the page was reached by clicking on a link or typing into the address bar.

To me, this is enough of a reason to uninstall the extension. It clearly has some sort of ulterior motive, and even though it's possible to disable the tracking in the extension and to block it at the system level for good measure (see below), life is complicated enough already without having to worry about your Chrome extensions betraying you in future auto-updates.

You might be entirely open and unembarrassed about what you click oclick onbehind closed doors. But even if you are unapologetically without shame and don't care at all about privacy for the sake of privacy, you should still care about security for the sake of your money and identity. [In a previous post about the Stylish browser extension][stylish] I suggested several reasons why many URLs (for example password reset links, secret login URLs) should be considered sensitive information in and of themselves. Since writing that post another reason to be protective of URLs has occurred to me. Suppose you installed one of these extensions on your work laptop and were browsing your company wiki. I doubt that anyone in your management chain would be happy about the URL `https://wiki.internal.ibm.com/posts/dealing-with-our-terrible-q3-results` being recorded in a random database somewhere.

---

This is a little like shooting fish in a barrel. "Yet another Chrome extension owned by an untraceable shell company is doing something questionable" is not big news. Perhaps more interesting are the ways in which you could try to protect yourself if you were determined to keep Magic Enhancer installed but wanted to place guard-rails around it.

### 1. Blackhole its analytics domain

We can prevent your data from reaching Magic Enhancer by configuring it to refuse to send traffic to the Magic Enhancer analytics domain.

Magic Enhancer sends your browsing history to the URL `https://autohdvideoapi.com/embeddedPage`. However, the internet backbone does not understand URLs or domains like `autohdvideoapi.com`. All it understands are IP addresses like `18.214.180.116`. Therefore, in order to send a request to `autohdvideoapi.com`, your computer first sends a *DNS request* to a *DNS server* asking "what is the IP address for `autohdvideoapi.com`?" When your computer receives back a *DNS response* containing an IP address, it sends out your request to that IP address.

We can bypass this process of *DNS resolution* for `autohdvideoapi.com`, thereby isolating Magic Enhancer from its mothership. To do so, we edit a special file called `/etc/hosts`. In this file we can hardcode associations between IP addresses and domains. In particular, we can hardcode `autohdvideoapi.com` to point at `127.0.0.1`, a special IP address called the *loopback address* that points back at your machine. We can do this by adding the following line to the file:

```
127.0.0.1 autohdvideoapi.com
```

This means that if your computer tries to send a request to `autohdvideoapi.com` then it will not make a DNS request to try to find out the IP address for this domain. Instead, it will use the hardcoded IP address of `127.0.0.1`, and will send the request that it would have otherwise sent to Magic Enhancer back to itself instead. Since your machine presumably isn't listening for any requests, these requests will be dropped on the floor and ignored, cutting off Magic Enhancer from its servers and ensuring that your data doesn't leave your computer. Note that this mitigation would fail if Magic Enhancer ever changed their analytics domain.

### 2. Edit the Chrome extension

Alternatively, it is trivial to edit the source code of the Magic Enhancer extension so that it doesn't send any of your data back to their servers. I assume that doing so is legal; if it isn't then don't do it. First, download the source code by running the following commands:

```bash
# Credit: https://gist.github.com/paulirish/78d6c1406c901be02c2d

extension_id=koiaokdomkpjdgniimnkhgbilbjgpeak
curl -L -o "$extension_id.zip" "https://clients2.google.com/service/update2/crx?response=redirect&os=mac&arch=x86-64&nacl_arch=x86-64&prod=chromecrx&prodchannel=stable&prodversion=44.0.2403.130&x=id%3D$extension_id%26uc" 
unzip -d "$extension_id-source" "$extension_id.zip"
```

Open the directory containing the downloaded code and search it for references to `autohdvideoapi.com`. In the version I tested I found one in `adBblock/bundle.js`.

<p style="text-align: center">
<img src="/images/magic-autohd.png" />
</p>

Edit the code and change this domain to be `localhost`. Save the file, open Chrome, open the Extensions panel, and choose "Open unpacked extension". Select the directory containing your edited extension and click "Open". Now you have installed a version of Magic Enhancer that is incapable of phoning home - all requests that would have been sent to `autohdvideoapi.com` are instead sent to `localhost`. Once again, this means that your data never reaches the Magic Enhancer servers.

It's possible that there are additional, obfuscated references to `autohdvideoapi.com` hiding in the code that are not found by a simple text search - for example `url = "a" + "u" + "t" + "o" + …`. But there probably aren't.

### 3. Send synthetic requests to the analytics endpoint

I don't know if this is legal (again, if it isn't then don't do it), since by "send synthetic requests to the analytics endpoint" I really mean "spam it with lies". Either way, there's nothing technically stopping us from sending Magic Enhancer polite, well-formatted HTTP requests in which we pretend to have viewed websites that we actually haven't. If we tried to flood Magic Enhancer with enough requests to bring down their infrastructure then this would be a DDoS attack, which is definitely illegal. But I don't know about the legality of sending a reasonable amount of well-behaved traffic that just happens to describe websites that we haven't visited. Is Magic Enhancer allowed to legally stipulate that only their own program is allowed to send data to what is public, unauthenticated endpoint? I have no idea.

This won't stop Magic Enhancer from gobbling up your entire browsing history, but it will muddy the waters.

-----

Of course, the easiest and most foolproof way to defend yourself against any nefariousness that Magic Enhancer may commit today or in the future is to uninstall it. But if you love Magic Enhancer's cinema mode too much to give it up then we've discussed several interesting - if fiddly - ways in which you can neuter it.

"Stop being so mean - the developers (kind of) explained what they were doing and users (sort of) knowingly and voluntarily opted into it!" you might say. I suppose I half-agree, although I don't think that this type of opting in should count and I don't think that it should insulate Magic Enhancer from charges of nefariousness. I certainly don't think that Magic Enhancer is software that you should run inside the application that you use to do your online banking.

Regardless, let's set aside any questions of ethics. If you're one of the 350,000 people who have installed Magic Enhancer, consider this post a helpful, clarifying explainer of how the product works and the tradeoffs that it asks of you. If you're OK with sending your entire browsing history to a random third-party server then you need not take any further action. But if you don't think this sounds like a good idea then open up the Magic Enhancer settings page,  make sure that you've disabled the tracking, or uninstall it and go in search of an alternative.

---

New - *[send me your privacy abuse tipoffs][tipoffs]*

---

[magic-enhancer]: https://chrome.google.com/webstore/detail/magic-enhancer-for-youtub/koiaokdomkpjdgniimnkhgbilbjgpeak?hl=en
[stylish]: https://robertheaton.com/2018/07/02/stylish-browser-extension-steals-your-internet-history/
[burp]: https://portswigger.net/burp
[wacom]: https://robertheaton.com/2020/02/05/wacom-drawing-tablets-track-name-of-every-application-you-open/
[privacy-policy]: https://autohdforyoutube.com/privacy
[tipoffs]: /tipoffs
