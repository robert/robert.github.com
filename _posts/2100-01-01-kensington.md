---
layout: post
title: Kensington
tags: [Security]
og_image: TODO
---
Vulnerability summary: An attacker can exploit a flaw in the KensingtonWorks device manager program to execute arbitrary code on the victim's computer. The attacker lures the victim to a malicious website, which exploits the vulnerability using JavaScript. No user interaction with the page is required.

I've only tested the vulnerability on vTODO on OSX, but I assume that it applies to all older versions on all operating systems. The vulnerability is currently unpatched, meaning that the latest version of KensingtonWorks (vTODO) is vulnerable.

To mitigate the flaw, users should either:

* Uninstall KensingtonWorks and use their Kensington devices without the extra configuration that it provides (recommended)
* If this is not possible, it appears that disconnecting all Kensington devices also mitigates the vulnerability

======

In January, Twitter user FeloniousPunk sent me a tipoff:

[TODO-QUOTE]

After two minutes of research on Google, I learned that Kensington is a popular brand of mice, keyboards, trackballs, and other computer peripherals. KensingtonWorks is a new-ish piece of software that allows users to add power functionality to their Kensington devices, like setting a mouse button to be a direct shortcut to copy, paste, quit, forward, back, or any of a wide range of other actions.

I read over FeloniusPunk's messages again. I agreed that listening on a network port is a strange thing for a device manager like KensingtonWorks to do, since it shouldn't need to be receiving any network connections. However, I suspected that this was more likely to be a security problem, rather than a privacy one. From a privacy perspective there's nothing especially problematic about listening on a network port, but from a security point of view it increases the application's attack surface area and gives the developers more ways in which to make mistakes.

I peered closer. The `127.0` at the edge of FeloniusPunk's screenshot suggested that KensingtonWorks was only listening on the local *loopback interface*. This at least meant that the application was only accessible to other programs running on the user's machines, not other machines on their network. Nonetheless, I couldn't think of a good reason for KensingtonWorks to open up a network port. As Sherlock Holmes might have said, once you eliminate all the good reasons for doing something, all that's left are the questionable ones. If KensingtonWorks's developers had made one questionable decision in choosing to have their application use network ports, it seemed quite plausible that they had further more questionable decisions in its security model. I decided to take a closer look.

I downloaded and installed KensingtonWorks. First I confirmed that it was indeed only listening on `lo0`, the loopback interface:

```
lsof ETC TODO
```

Sadly (or happily, depending on your morals and point of view), I saw that it was indeed only listening on `lo0`. No matter. Next I wanted to see what information was being sent to it. I opened up Wireshark, a tool that allows you to watch the network traffic flowing in and out of your computer. I set Wireshark listening on `lo0`, filtered to port `9090`.

Traffic appeared immediately. Something was pinging the KensingtonWorks server every few seconds with an HTTP `GET` request to a URL with the path `/devices`. The KensingtonWorks server was sending back the response `[]`.

<img src="/images/kensington-slash-devices.png" />

Zooming in on the request showed:

```
GET /devices HTTP/1.1
Accept: application/json, text/plain, */*
User-Agent: axios/0.19.0
Host: localhost:9090
Connection: close
```

This was good news - since KensingtonWorks was using HTTP it would be straightforward to fiddle with. But the most important part of the HTTP request was the part that wasn't there: authentication.

Since there were no long, gibberish-looking tokens in the request, it was pesos to pizza that the KensingtonWorks server was not protected by any kind of password or key. This meant that any program able to send HTTP requests to the server could perform all of the same actions as the official Kensington program that was sending those pings to `/devices`. In particular, a malicious website controlled by an attacker could use JavaScript to send background HTTP requests to `http://localhost:9090`, without requiring the victim to interact with the page in any way. The attacker wouldn't be able to read any data returned by KensingtonWorks because of *Cross-Origin Resource Sharing* (CORS) restrictions that prevent pages from reading responses returned from other domains. However, the KensingtonWorks server presumably has some endpoints for updating configuration settings, and the attacker can send requests to these with no problems. The attacker doesn't care that they don't get to see the responses, since the requests have already done the damage.

This said, all I had so far was the `GET /devices` endpoint. This wasn't going to compromise any computers. I needed to find additional endpoints that would allow me to fiddle with the application's settings and cause some mischief. I clicked around KensingtonWorks and monitored Wireshark, trying to trigger more HTTP requests. But without any Kensington devices plugged the application was almost empty.

I assumed that if I bought myself a Kensington mouse then I'd be able to see more of the application's functionality. But Kensington mice aren't cheap, and £40 is a lot to pay for a boring, secure mouse. I wanted better evidence that there were vulnerabilities to be found before I purchased one. I decided to nose around in KensingtonWorks's application directory:

```bash
$ cd /Applications/KensingtonWorks\ .app/
```

Since KensingtonWorks is a native OSX application I assumed that it was probably written in a compiled language like Objective C. This would mean that most of the contents of the directory would be unintelligible binary files, not clean sourcecode. However, it was still worth trying to find some of the keywords that I had turned up so far:

```bash
$ ag "/devices" --search-binary
Binary file Contents/Resources/app.asar matches.

Binary file Contents/Frameworks/Electron Framework.framework/Versions/A/Resources/resources.pak matches.

Binary file Contents/Helper/KensingtonWorksHelper.app/Contents/MacOS/KensingtonWorksHelper matches.

Binary file Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework matches.
```

Excellent. As well as turning up some promising leads, these search results confirmed a suspicion I had had. We can see that the KensingtonWorks code includes a framework called Electron, which allows developers to write desktop applications using JavaScript. I would guess that whoever wrote KensingtonWorks was more familiar with writing web applications than desktop ones. They therefore decided to structure their application like a website. The frontend would be written in JavaScript (using Electron), and would communicate with a backend web server, running on the user's local machine instead of a remote one. This local server would be responsible for communicating with the mouse driver. In my opinion this makes some pragmatic sense, but leaving a web server lying around on the user's machine is too high a price to pay for a convenient development process. It increases the application's attack surface, opening it up to attacks like the one that will follow in a few paragraphs' time.

Returning to the search results, the file that most interested me was the one at `[...]/MacOS/KensingtonWorksHelper`. I opened it. The file was mostly compiled nonsense, but I searched for the string `/devices` and found a long, interesting line:

`^@success^@reason^@ response(failure): ^@HTTP/1.1 400 Bad Request^@device^@app^@127.0.0.1^@GET^@^/favapps$^@^/devices$^@^/config/apps$^@DELETE^@^/devices/([0-9]+)/emulatebuttonclick/([0-9]+)$^@^/config$^@^/config/general$^@^/config/buttons$^@^/config/pointer$^@^/config/scroll$^@^/config/snippets^@command server stopped^@maybe_unlock_and_signal_one^@event^@mutex^@kqueue^@pipe_select_interrupter^@kqueue interrupter registration^@kqueue re-registration^@boost::asio::streambuf too long^@^M`

This looked like a handy list of all the API endpoints in the KensingtonWorks server. The various `/config/*` endpoints looked interesting, but the one that really caught my eye was `/devices/([0-9]+)/emulatebuttonclick/([0-9]+)`. Emulating a button click sounded like a great way to do something nasty to a victim's computer. I wasn't sure what to put in place of those `([0-9]+)` placeholders, but I suspected that the first placeholder was for a device ID, and the second for a button ID. I would need to purchase a mouse of my own in order to understand more.

Before I shelled out £40 for a mouse I didn't want, I wanted to make absolutely certain that the product reached my high standards of insecurity. I wanted to investigate those `/config/*` endpoints from the `[...]/MacOS/KensingtonWorksHelper` file, so I tried making some `GET` requests:

```bash
$ curl localhost:9090/config
{"devices":[],"platform":"darwin","timestamp":1582451041,"trayIcon":true,"versionMajor":2,"versionMinor":0}
$ curl localhost:9090/config/general
{"timeStamp":"2020-04-16T17-34-17.000Z","trayIcon":true}
```

I wondered if I could update the `trayIcon` parameter. Using standard REST conventions, I guessed a form for an update request:

```bash
$ curl localhost:9090/config/general # double check the current state
{"timeStamp":"2020-04-16T17-34-17.000Z","trayIcon":true}
$ curl localhost:9090/config/general -X POST -d "{\"trayIcon\": false}"
{"timeStamp":"2020-04-16T17-34-17.000Z","trayIcon":false}
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

I put this code on a webpage on an unused domain I had. I visited the page, then checked the new state of my config:

```bash
$ curl localhost:9090/config/general
{"timeStamp":"2020-04-16T17-34-17.000Z","trayIcon":true}
```

My website had silently flipped the `trayIcon` setting back to `true`. I now had the code for a malicious website that could update a user's KensingtonWorks configuration. I still wanted to find out what other config settings KensingtonWorks had to offer, as well as what that `emulatebuttonclick` endpoint I had seen in the code did. I purchased the cheapest Kensington mouse I could find, and even paid £5 for expedited shipping. When the mouse arrived I plugged it in, hooked it up to KensingtonWorks, and started clicking around.

With a device now plugged in, a whole new UI was opened up. I set Wireshark listening on the loopback interface again and clicked on the buttons that allowed me to bind my mouse buttons to system shortcuts.

<img src="/images/kensington-ui.png" />

I bound my side mouse button to the "copy" command. I looked at Wireshark to see the request that doing so sent to the server:

<img src="/images/kensington-config-button.png" />

Zooming in on the request showed:

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

Once again, the request contained no authentication. The closest thing to authentication looked to be the `device` parameter in the query string, a 5-digit number that presuambly identified the target mouse in case the user had multiple Kensington devices. I manually re-sent this request from the command line with a different device ID:

```bash
$ curl localhost:9090/config/buttons?app=*&device=12345&button=4 \
    -X POST -d "{\"command\":\"editing_copy\",\"params\":{}}"
{"reason":"Setting for device does not exist","success":false}
```

The request failed. This suggested than an attacker would need to know their victim's device ID in order to execute an attack. I didn't know (and still don't) how device IDs were generated. It could be a random ID set when the device is plugged in, or a fixed ID representing the model of the device, or something else entirely. I wasn't worried - even if the ID was randomly generated, an attacker could brute force the 100,000 combinations quite quickly.

I updated my proof-of-concept attack website to bind my side mouse button to the "screenshot" command. I opened the website in Chrome, and re-opened KensingtonWorks. Success - my mouse's side button had been bound to "screenshot". I pressed it and took a screenshot for my log book.

This configuration caper was already an exploit on it's own, but it was a bit of a boring one. In order to weaponize it I would need to understand the `emulatebuttonclick` endpoint. I hadn't been able to find any way of triggering it from the UI, and the only place I had seen it mentioned was in the compiled application code.

Fortunately, it wasn't hard to infer how the endpoint worked. In the KensingtonWorks code the endpoint was written as `/devices/([0-9]+)/emulatebuttonclick/([0-9]+)`. It seemed likely that the placeholders represented device and button IDs, in the same form as in the `/config/buttons` endpoint. Since the endpoint sounded like it was causing something to happen, rather than simply retrieving information, I guessed that it was likely expecting a `POST` request rather than a `GET`. I used KensingtonWorks to bind my side button to the "screenshot" command, and used `curl` to hit the `emulatebuttonclick` endpoint. I heard a satisfying click as my computer took a screenshot.

Now all that remained was to string everything together. I wanted to use pairs of KensingtonWorks API requests to bind a sequence of commands to a mouse button and then emulate-click the button. I wanted to:

1. Use the "copy" command to copy a payload bash script from my attack website
1. Use the "open OSX terminal" command to open to OSX terminal
1. Use the "paste" command to paste and execute my payload bash script
1. Use the "quit" command to exit the terminal and clean up after myself

The payload bash script would give the attacker persistent access to the victim's machine. An example of such a command is `TODO`. The attacker could then sniff around on the machine, try to escalate to root privileges, or simply add the machine to a botnet.

I wrote a library that allowed me to write exploit code like this:

```javascript
var payload = document.getElementById('payload-command');
// TODO: set the contents to the command
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

However, I still didn't know how to deal with the device ID parameter. Was it fixed and predictable, or would I need to brute-force it by trying every possible ID between 0 and 99,999 until one worked? I could have bought more Kensington mice to try to see if the device ID varied between different products or between different instances of the same product. But I was already out £40 for one mouse that I was never going to use, so I assumed the worst case of randomization and started putting together a way to brute force the device ID.

I'd need to keep trying requests with different device IDs until one of them worked. However, because of Cross-Origin Resource Sharing (CORS) restrictions, my JavaScript wouldn't get to see *anything* about the response sent by the KensingtonWorks server, not even whether it succeeded or failed. I'd need to work around these protections somehow.

My first thought was to use a timing attack. My JavaScript wouldn't get to see any of the response's contents, but it would get to see when it arrived. I checked to see whether there was a difference in request duration between requests with valid and invalid IDs. Unfortunately, there wasn't. Instead, I used the same bind/emulatebuttonclick combination as before to report a request's status back to my script via a side-channel. I wrote a script that:

1. Registered a JavaScript `onpaste` callback to trigger some code whenever the website saw that the user had invoked the "paste" command
1. Used KensingtonWorks to bind a mouse button to the "paste" command
1. Iterated through every device ID from 0 to 99,999, attempting to emulate a click of the bound "paste" button
1. After each attempted click, the script waited a few milliseconds to see if the `onpaste` callback had triggered. If it had, it used the most recently attempted device ID to execute the full attack described above.

In my unscientific testing it was possible to try device IDs at a rate of over 20 per second. This would mean that a full scan from 0 to 99,999 would take under 2 hours. The mean time to success would be half the length of a full scan, meaning under 1 hour. The process could be sped up by not waiting the few milliseconds before checking whether the possible paste had completed. This would mean that my script could potentially report a slightly incorrect device ID, since the script could have sped paste the correct ID before the paste that it invoked had finished. To mitigate this, if my script detected a paste command, it could back up a few IDs and re-run the tests, only now pausing in between each attempt to ensure absolute accuracy.

An hour is admittedly a long time to require a victim to stay on a website, although it is only a few pirated episodes of *The Office*. The attacker can store their progress in a cookie as they go, and complete a full device ID scan over the course of several user sessions. It's also possible that the device ID is trivially predictable and none of this brute-forcing is necessary, but I'm not going to buy enough devices to find out.

----

## Conclusion

Fun bug, lame code etc
kensingotnmousehelp.com
