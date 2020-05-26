Right code, wrong place
Hidden assumptions: right code, wrong place


Imagine you are the boss of a successful crime syndicate. If you already are the boss of a successful crime syndicate then you can skip this step. Because you are so good at committing crimes, you have made many enemies. You therefore protect yourself with two layers of bodyguards before anyone can enter your lair.

Your first bodyguard is responsible for searching people's bags. She also usually searches people's jackets as they are taking off their bags. This isn't part of her job description, but she's angling for a promotion.

Your second bodyguard is responsible for searching people's clothes. He notices that the first bodyguard searches people's coats, and after several years of working for you he gets lazy and starts to take shortcuts. He stops checking people's coats, assuing that your first bodyguard will catch anything bad. This system works, but it has a hidden fragility.

One day the first bodyguard is out at a dentist's appointment and her sister fills in for her. Her sister doesn't check people's coats. One of your many sworn enemies sneaks through your defences. The first you know of this is when you get shot in the face.

Your system of bodyguards was doing the right checks, but in the wrong places. Hidden assumptions can spell disaster when a system changes. This applies to programming just as much as crime; it applies double for programming that is used for crimes.

When analyzing readers' code, the code is often correct and functional today. If the program was never going to change then there would arguably be nothing wrong with leaving it exactly as it is. Code gets more complicated when it changes. One of the main ways you can think about this is "how easy will it be for someone who changes this code in the future to accidentally break it?" Putting the right code in the wrong place can lead to different pieces of your code making hidden assumptions about how the other pieces work. This is a surefire recipe for introducing bugs when your code changes or getting shot in the face when your bodyguard has their wisdom teeth out.

----

Today's example of putting the right code in the wrong place comes from one of my favorite ever books about programming: 
"Security by Design" by Bergh Johnson, Deogun, and Sawano. The book is a lucid guide to baking security into the heart of your systems and making it harder for you and your colleagues to inadvertently write vulnerabilities. You should buy it immediately.

This said, I dislike their very first example of secure design, on p12 of my paperback version, in which they try to protect an application against *Cross-Site Scripting* (XSS) attacks. XSS is an attack on web apps, in which an attacker tries to inject malicious JavaScript into your page. JavaScript is the programming language that website designers use to add dynamic elements to their sites. Because JavaScript code runs in the end-users browser, it has access to all the data on their page. For example, JavaScript that runs when a user loads `gmail.com` has access to all the emails that the user's browser has loaded. If an attacker can trick their victim's browser into executing JavaScript code written by the attacker, they can read sensitive data from the user's account and send it to themselves. This is an XSS attack.

An HTML page can include JavaScript in between two `<script>` tags, like so:

```html
<p>
    An HTML page can include JavaScript in between two &ltscript&gt tags, like so:
</p>

<script>stealAllYourData();</script>
```

Attackers attempt to exploit this by writing JavaScript in their usernames, messages, and anywhere else they are allowed to submit input. An attacker who sets their username to be `<script>stealAllYourData();</script>` is hoping that a vulnerable website will render this username in their profile page without *sanitizing* it. If the website simply prints their username in their profile page, the HTML might look something like this:

```html
<p>
    Profile page for: <script>stealAllYourData();</script>
</p>
```

When a victim visits the attacker's profile page, the attacker's JavaScript code will execute inside their browser. The attacker can write their code to achieve whatever their attack goal is.

### Defending against XSS

The way to defend against XSS attacks is to *sanitize* any and all user-supplied data before you write it into an HTML page. This means converting all special characters that can have special, JavaScript meanings such as `<` and `>` to their *escaped* versions. Browsers display escaped characters in exactly the same way as their unescaped versions, but they know not to interpret them as special characters. The browser interprets the string `<script>` as beginning a block of JavaScript, but interprets `&ltscript&gt` as simple, harmless text that it should display as `<script>`.

It's the application programmer's job to make sure that user-supplied input never gets interpreted as JavaScript by the browser.

### Sanitizing on the way in

In Secure by Design, the authors give an example of protecting against XSS. They suggest writing a `User` class, which checks when it is initialized that its username is not a potential XSS *payload*:

```java
// TODO
class User {

}
```

The authors suggest that `validateForXSS` would check that the given username contains only letters, numbers, and underscores. This will indeed prevent the username from being used for XSS. However, this is not the time and place to be worrying about XSS. There's nothing intrinsically wrong with a username of `<script>alert("hello");</script>`, so long as it is properly escaped when displayed in the browser. If you don't want to allow `<` or `>` in your usernames because you don't like the way they look then that's completely fine. However you should *not* think that this makes you safe from XSS. You still have more work to do.

### Escaping on the way out

There are two problems with sanitizing your data on its way in to your application:

1. It's useful to store data exactly as it was given to you, not some processed version of it. What if you need to use the data in a different context with different rules for escaping (for example, a SQL query)? What if you want to search your database for the string `<script>`?
2. It places your defence at the wrong point in your system. You should place your defences as close as possible to the place in which they will be needed.





It's not enough to write the right code. You also have to put it in the right place.



Sometimes you write the right code but in the wrong place
Consequence is often a system that technically works today but is fragile and easy to introduce bugs into in the future
Different pieces make subtle assumptions about each other's behavior that 
Common theme - is this easy to break in the future?


Today's example comes from Security by Design, a really great book
I'm certain that the authors know what they are doing and in a production system would design everything perfectly

A common type of attack on web apps is XSS
Inject JavaScript and try and get the website to run it
Read more here. Very understandable. Try it on your own apps!

Important to sanitize your data - make sure you display it in a way that won't cause the browser to intepret it as JS
In SBD they want to validate for XSS in the Username
But this shouldn't be the Username's job
It's perfectly reasonable to have a Twitter handle of `<script>alert("hello");</script>`. Twitter should just make sure to display the name in a way that doesn't cause problems
You might only want alphanumeric characters in your username, but this shouldn't be in order to protect against XSS. Should be for aesthetic reasons or whatever

Maybe in the future you decide to allow <>. V disconnected from XSS, maybe no one will think to make sure the output is being escaped
`validateForXSS` is a good method name, at least makes it clear that something important is happening here.
But maybe someone thinks "oh it's fine, we escape everything on the way out"

You're going to have to escape XSS when you display your data. This is the right place to do it. No amount of pre-validation makes it OK to not do this.
Doesn't hurt to do some checks in the Username if that's what you want to do anyway, but they're completely redundant and possibly misleading

Other examples:
Whenever one part of your code is responsible for enforcing a constraint that completely different parts of your code rely on
Not always bad, but always a bit risky 
Assumptions

* If you jump in a game then you will always be in the air (what if you are directly under a ceiling?)
* If you rely on the frontend of your website to stop users putting in bad data (what if they make HTTP requests manually?)
* You are a crime boss. You have 3 levels of protection. First layer has written down requirements, if they have a gun then he puts it in their left hand. Everyone else assumes this and so only checks there because get lazy.
First time you realize this assumption is when you get shot in the face