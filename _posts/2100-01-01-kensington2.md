---
title: "Another RCE vulnerability in KensingtonWorks"
layout: post
published: false
---
A few months ago I published a remote code execution (RCE) vulnerability in KensingtonWorks, a tool made by a company called Kensington for adding power-user features to mice. Kensington fixed that flaw, but I've found another one that, as of 2020-09-XX, remains unpatched. Like the previous vulnerability, an attacker exploits this one by luring a victim to a malicious webpage. The victim doesn't need to interact with the page; all they need to do is stay on the site while background JavaScript silently exploits the KensingtonWorks defect. The attacker can then execute arbitrary code on the target's machine, taking near-complete control of it.

It's easy and virtuous-sounding to declare that KensingtonWorks user should "uninstall the application immediately and wait for a fix," and if you don't particularly value your power-user features then I think that this would be prudent. But if you do value these features then you've got a risk assessment on your hands.

In this post we'll look at how the second vulnerability works, and see the ways in which it's a direct consequence of Kensington's inadequate fix to the first. I'll feel a bit mean for zeroing in on the mistakes of one inoffensive company when all software is buggy and no one is safe. But I'll feel better when I remember that you can't learn how to make better omelettes without analyzing insecurely broken eggs.

-----

## The root cause

KensingtonWorks is an easy target because of poor design choices. The application consists of two components: a UI that users click on in order to configure their mouse; and a web server running on the user's local machine. The UI sends HTTP requests to the web server, which updates the user's mouse configuration accordingly.

In my opinion, this local web server is a bad idea. It's impolite to leave servers lying around on a user's computer, using up a port. Worse, the web server increases the tool's attack surface area, leading to monkey business like the below. It's certainly possible for an application like KensingtonWorks to use a local web server securely. But the approach exposes more skin to an attacker; gives Kensington more opportunities to make mistakes; and makes it easier for an attacker to discover and exploit any defects that do creep in.

The core flaw in the KensingtonWorks web server is that the HTTP endpoints it exposes are entirely unauthenticated. This means that an attacker can easily spoof the requests that the UI sends to the server, without needing to know a long, random API key or anything like it. Presumably Kensington didn't add authentication because they didn't expect anything to try to talk to the server other than their own, trusted UI. However, it's actually very easy for an attacker to send requests to the KensingtonWorks server. All they need to do is to get their victim to visit a malicious website that they control. The attacker can then have JavaScript on this website send carefully crafted HTTP requests to `localhost:9090` (the interface and port that KensingtonWorks listens on) that imitate requests that the KensingtonWorks UI would send. Since the server does not require authentication it will accept and process these requests as though they came from the UI, allowing the attacker to update the victim's mouse settings.

It's bad that an attacker can tinker with a user's settings, and this should be prevented on principle. But on its own this flaw would be an annoyance, not a critical exploit. The real problem comes if an attacker can chain the ability to bollix up a victim's config with another feature or vulnerability in KensingtonWorks, allowing them to turn an oddity into something much more severe.

In the first vulnerability that I found, I pivoted to code execution via an HTTP endpoint in KensingtonWorks at `/TODO/emulateButtonClick`. If an attacker sent an HTTP request to this endpoint, KensingtonWorks would act as though the user had just clicked a mouse button. Once again, on its own this would be a curiosity, not a calamity. But an attacker could also use KensingtonWorks's `/TODO` endpoint to bind mice buttons to power commands like "copy", "paste", and "open application". Having bound a command to a button, they could then forcibly execute it by hitting the `emulateButtonClick` endpoint. In my previous post[LINK] I showed how an attacker could combine these capabilities to copy a payload shell command, open a terminal, paste the payload command, and thereby get code execution and peristence.

After I pointed out this vulnerability to Kensington, they sort-of-fixed it. Unfortunately they did so by removing the `emulateButtonClick` HTTP endpoint; they did not fix the web server's underlying lack of authentication that made the whole exploit possible. This meant that an attacker could still mess with a victim's settings, even though they could no longer use `emulateButtonClick` to pivot to code execution. All they needed in order to get themselves back to code execution was an alternative fulcrum.

Here's one that I found.

## The second vulnerability

In my writeup of the first vulnerability I noted in passing that KensingtonWorks appeared to be written in Electron[LINK], a framework that allows developers to write desktop apps using HTML and JavaScript. [Parsia Harman][LINK] pointed out on Twitter that this meant that the application might be vulnerable to cross-site scripting (XSS). In an XSS attack, an attacker injects malicious JavaScript into a web page - or in our case into an Electron app. They do this by passing into the application input that looks something like `<script>evil_code_goes_here()</script>`. If the website (or Electron app) doesn't properly defend against XSS then it may render this input directly into a page. Instead of interpeting and displaying it as text, the browser (or Electron framework) will see it as JavaScript code. It will execute this code, allowing the attacker access to the user's data, or in our case, to their actual machine.

Websites and Electron apps can defend against XSS by *santizing* data from external sources when they display it. This means replacing potentially problematic characters like `<` and `>` with encoded equivalents that the browser/framework knows to interpret as text, not as code. However, KensingtonWorks does not. This is probably for the same reason that it doesn't authenticate HTTP requests that it receives: because the developers didn't expect attackers to be able to interact with the application. However, the whole point of attackers is that they do things that they shouldn't be able to do. It's best to have a vulnerability-free application, but given that this is impossible you should write your application with defence-in-depth that mitigates the fallout from any vulnerabilities that do slip in.

An attacker can exploit KensingtonWorks's lack of sanitization by creating another malicious website with more malicious JavaScript. Once they have lured a victim to this website, their JavaScript sends an HTTP request to `/TODO`, a KensingtonWorks endpoint that creates an "app-specific configuration". In this request the attacker gives their new app the improbable name:

`<script>...TODO`

When the user next opens the KensingtonWorks UI, the application will attempt to display a list of all the applications for which the user has created app-specific configurations. When KensingtonWorks comes to display the attacker's maliciously-named app, it interprets the app's name as JavaScript code and executes it. The `TODO` NodeJS function in the payload allows the attacker to run a shell command of their choice, giving them direct remote code execution.

A step-by-step guide:

1. Lure the victim to navigate their browser to a website that you control
2. Use the ID enumeration technique outlined in my previous post[LINK] to brute force the 5 digit ID of the victim's device. This takes a couple of minutes.
3. Once you've found the device ID, send a `POST` request to `/TODO` with a body of `TODO`
4. Wait for the victim to open the KensingtonWorks UI. Your payload shell command will silently execute, allowing you to take control of the victim's machine

Here's a proof of concept gif. I ran this attack on myself using the payload `TODO`. This meant that whenever KensingtonWorks opened, the `Calculator.app` program opened too. A more vicious payload like `TODO` would instead cause a victim's computer to phone home to a server controlled by an attacker. This would open a "reverse shell", allowing the attacker to execute further arbitrary commands, sniff round the victim's machine, and download their entire hard drive.

### How Kensington could patch this vulnerability

I notified Kensington about this vulnerability on `2020-TODO`, but they haven't fixed it or been in touch with me. A slapdash fix would be to add sanitization to every place in the program that displays variable data loaded from an external source. For safety, this should even be done for those data sources that an attacker shouldn't be able to influence.

However, the root cause of both this and the previous vulnerability I found is still the insecure local web server. As long as it is possible for an attacker to interfere with a victim's configuration using only a malicious website, KensingtonWorks is vulnerable to settings-manipulation, which is only a small mis-step away from another remote code execution flaw.

As I've already written, I don't think that KensingtonWorks should be using a local web server at all. However, I acknowledge that corporate constraints mean that a full rewrite of the tool is unlikely. If Kensington stick with the local web server model, they should at least add authentication that prevents attackers from interacting with it. I'm told that the industry standard for securing such local web servers is to require a custom HTTP header to be set on all requests sent to the tool. It doesn't matter what value the header takes, so long as its key is not part of the core HTTP spec. For example:

```
X-KensingtonWorks: 1
```

This works because browsers don't allow JavaScript running on webpages to set custom HTTP headers on their AJAX requests. Even though an attacker knows exactly what key and value they need to give their header, it's impossible for them to use browser JavaScript to set this header on an HTTP request to KensingtonWorks.

This approach might be the industry standard, but it still feels a little scanty to me. Other applications running on a user's machine aren't subject to the same restrictions as JavaScript running inside a browser. This means that they can still send arbitrary HTTP requests with arbitrary custom headers, allowing them to bypass KensingtonWorks's new authentication. You could argue that these applications are already executing code on the user's machine, so if they're malicious then it's already game over. But it still means that an otherwise innocuous vulnerability in a benign application that allows an attacker to make arbitrary HTTP requests can potentially be escalated to code execution via KensingtonWorks. Because of this I would prefer for the client and server to agree on a long, random string at installation-time that must be supplied with each HTTP request.

All of this said, requiring a custom header is still a substantial fix, which solves the vast majority of the currently open problems with much less work.

## Exploitation in the wild

I intuitively doubt that either this or the previous vulnerability I found has been exploited in the wild. You can check the network tab on your developer tools and see that *I'm* not trying to hack you as you read these words. Although if I was and you had KensingtonWorks installed then you'd be owned right about now.

Attackers follow the low-hanging fruit. It's much easier to get victims to download a fake version of Flash Player than it is to exploit a bug in a relatively uncommon piece of consumer software. However, I wouldn't rely on my intuition for your security. Kensington mice are expensive, and are probably disproportionately used by high-value targets. I think that vulnerbilities in KensingtonWorks are most likely to be useful for targeted attacks on key victims who are known to use the application ahead of time. These victims might be an engineer who tweeted about their new Kensington peripherals, or an executive who posed for a power-desk-photoshoot in front of their computer setup. They might be a friend whose emails you want to read, or an ex whose emails you really want to read. Once you know your target all you have to do is get them to visit your website and get them stick around for a few minutes. They don't have to download any zip files or enter any passwords or interact with the page in any way. Background JavaScript works out their device ID (see previous post[TODO]) and then breezes through the rest of the exploit. 

Another way to exploit the vulnerability on a wider scale could be to set up an unofficial Kensington support website and try to get it ranked highly on Google for Kensington-related search terms. Visitors to such a site are very likely to be exploitable KensingtonWorks users. There are easier ways to make a buck, but I've got to make my hobbies sound important somewhow.

I've only tested this vulnerability on the OSX 2.1.17 version of KensingtonWorks, but I think it's safe to assume that the Windows version is affected too. I do think that it's unlikely that you have been compromised already, but one way of checking (on OSX) is to run:

```
brew install jq
curl localhost:9090/config | jq | grep -A 5 -B 5 "<script>"
```

If this prints nothing then you're probably fine, unless the attacker cleaned up after themselves, which if they're any good they probably did. I'm sorry, I'm scaremongering again. But if the command prints anything that looks like XSS (eg. `<script>...</script>`) then you do have a problem.

SOMETHING SOMETHING END.






Websites probing local ports is nothing new - eBay were recently caught running port scans on their users[LINK] to learn about what their computers are doing.


But it could be, and there are probably quite a lot of executive types using Kensingtons
eBay does port scanning



Or if you can find a case study for a company-wide deployment of KensingtonWorks and target them with spear-phishing
I'm sure there are easier ways to make a buck but I've got to make my weird hobbies sound important somehow. And seriously this is bad, I would recommend uninstalling it

https://www.kensington.com/siteassets/software-support/kensingtonworks/release-notes/release-notes-for-kensingtonworks-macos-v2.pdf
https://www.kensington.com/siteassets/software-support/kensingtonworks/release-notes/release-notes-for-kensingtonworks-windows-v2.pdf
I've only tested this in OSX but they removed it from Windows too so I imagine that Windows is vulnerable too


I haven't heard anything back from Kensington, but I'd be happy to help


=========

Previously found a bug in KensingtonWorks
It was sort of fixed by removing the emulatebuttonclick endpoint
This fixed the fact that attackers could use the fact that they can mess with your settings to get RCE
It didn't fix the fact that they can mess with your settings, didn't fix root cause

Parsia pointed out to me that since KensingtonWorks is written in Electron, it might be vulnerable to XSS
It is!

Need to figure out device ID, see previous post
Then make a POST request with payload
Then restart KensingtonWorks


They should sanitize user input
But that's like removing the emulate endpoints - solves immediate problem but leaves open to nonsense in the future

I don't think they should be using a local web server at all
Given that they are, they should fully secure the endpoints to make it impossible for an attacker to mess with them
I'm told that just requiring a header is enough and is the industry standard, but I don't like it

Allows easier pivoting from vulns in other apps
I'd prefer to see a big long random string



Do I think this has ever been exploited? I doubt it
But it could be, and there are probably quite a lot of executive types using Kensingtons
eBay does port scanning

Don't click on phishing links, but also you should expect to be fine if you do (not always, see spear-phishing)
This bug is problematic because it allows malicious websites to break out of the browser sandbox

You could either try to massively exploit it and get control of random computers, but distributing fake versions of Flash Player is probably easier for that. You'd need to distribute a lot of spam and you'll only get paid off if someone clicks on your link AND they have a Kensington
I think it would be interesting to try to make a website that gives help with Kensington mice and gets ranked in Google
These mice aren't cheap, so you'll probably get higher value targets than average

Perhaps a better use case is to hack people you know. You'll know that they have a Kensington mouse, and you'll probably find it easier to get them to click on a link
If you have contacts inside a public company who use Kensington then consider using this exploit
Opportunistic




Or if you can find a case study for a company-wide deployment of KensingtonWorks and target them with spear-phishing
I'm sure there are easier ways to make a buck but I've got to make my weird hobbies sound important somehow. And seriously this is bad, I would recommend uninstalling it

https://www.kensington.com/siteassets/software-support/kensingtonworks/release-notes/release-notes-for-kensingtonworks-macos-v2.pdf
https://www.kensington.com/siteassets/software-support/kensingtonworks/release-notes/release-notes-for-kensingtonworks-windows-v2.pdf
I've only tested this in OSX but they removed it from Windows too so I imagine that Windows is vulnerable too


I haven't heard anything back from Kensington, but I'd be happy to help
