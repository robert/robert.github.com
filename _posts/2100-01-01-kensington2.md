

A few months ago I published details of a remote code execution (RCE) vulnerability in KensingtonWorks. This vulnerability was fixed, but thanks to Parsia Harman I've found another one. I've reported this problem to Kensington, but as of 2020-09-XX this second vulnerability has not been fixed. If you use KensingtonWorks I'd therefore suggest that you uninstall it and live without your power features for a little while while you wait for it to be fixed.

In this post we'll look at how this second vulnerability works, why Kensington's half-arsed fix to the first vulnerability left the door . We'll feel a bit mean for focussing on this one company when all software is buggy. But we'll remember that you can't learn how to make better omelettes without analyzing broken eggs.

-----

## The root cause

The root cause of both the first and second vulnerabilities is that KensingtonWorks runs a web server on the user's computer. The KensingtonWorks UI sends HTTP requests to this web server, which updates the settings of the user's mouse. I don't think this is a good way for Kensington to structure their program. It's bad manners to leave a web server running on the user's computer, using up a port, and it increases the tool's attack surface area, leading to shennanigans like the below.

It's possible for KensingtonWorks to use a local web server in a secure manner. However, it does not. The endpoints are entirely unauthenticated, presumably because Kensington did not anticipate anything trying to talk to the server other than their own, trusted UI. Unfortunately, browsers can send requests to it. This means that if a user running KensingtonWorks visits a malicious website controlled by an attacker, that website can send carefully crafted HTTP requests to the KensingtonWorks web server. This allows the attacker to mess with the user's mouse settings.

It's bad that an attacker can mess with a user's settings, but it's not a critical exploit. In order to convert this oddity into code execution we need to find a particularly dastardly way to mess with their settings.

In the first vulnerability, this was an endpoint called `emulateButtonClick`. If the attacker sent an HTTP request to `TODO`, KensingtonWorks would emulate a button click. This allowed the attacker to bind a mouse button to CONTINUE








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