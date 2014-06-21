---
layout: post
title: Code review without your eyes
---
You’re part of a preternaturally enlightened dev team, and have set aside an entire day for nothing but code review. However, after the first 2 hours, you realise that you have forgotten your glasses and have just been staring at colourful blurs all morning. What do you do?

The correct answer is of course to go back home and get your glasses, since you only live a 10 minute walk away and it’s a nice day. But assume that as you left the house this morning you discovered that a swarm of particularly belligerent hornets had just completed construction on a nest in your glasses wardrobe and that they didn’t look keen on being disturbed. WHAT THEN.

The new correct answer is of course to avoid embarrassment by pretending that you are wearing contact lenses, and remembering that you can tell a surprising amount about a file without actually reading any of it.

<h3>Exhibit 1</h3>

<img width="500" src="/images/ex1.jpg" />

Concerns should absolutely be separated. And of course any class should only ever be responsible for doing one thing. But do you really need a User and a UserCreator? If this is all that a UserCreator has to do then I’m sure that Users can create themselves for now. Otherwise what was once a simple User.new becomes a unnecessarily hellish nightmare of grepping halfway round the world through multiple tiny files whenever you want to change anything or even understand what the foo is going on.

<h3>Exhibit 2</h3>

<img width="500" src="/images/ex2.jpg" />

So I can see that this is technically all very DRY, and there’s nothing that can be factored in the literal sense of the word. But from the length of that one monolithic method I’m guessing you’re not a unit tester. And whilst I can work out that that 20 line block in the middle is needed to work out who we need to send emails to if you give me an afternoon and some strong coffee, I would humbly suggest that you stick it inside a def users_to_send_emails_to so that I don’t have to.

<h3>Exhibit 3</h3>

<img width="500" src="/images/ex3.jpg" />

OK, this is probably progress from before. But whilst the inventor of the phrase “too much of a good thing” was most likely not thinking about small methods in Ruby classes when he came up with those words, this nonetheless still is too much of a good thing. Whilst the Ruby interpreter doesn’t care about you leaping between methods and having a stack trace longer than my arm (and I have VERY long arms), most human interpreters do. I’m as happy as the next guy to scroll around a file a bit, but when I start having to manually write my own stack trace to remember where I came from, it’s probably time to munge some of those methods back together.

<h3>Exhibit 4</h3>

<img width="500" src="/images/ex4.jpg" />

Again, namespacing is good. But by the time you get to the 6th level, it seems likely that you are trying to cram too much stuff into a small space. Consider either stop splitting up quite so finely (yes I can see that those 2 Helper classes could have their own namespace, buuuuut they really aren’t hurting anything in the next one up), or decoupling and splitting some code into an entirely different base namespace altogether.

<h3>Exhibit 5</h3>

<img width="500" src="/images/ex5.jpg" />

Clarificatory comments, thumbs up! Code that requires an accompanying essay to understand, thumbs down.

<h3>Exhibit 6</h3>

<img width="500" src="/images/ex6.jpg" />

Methods tend to need arguments in order to do their job. But if a method needs 8 arguments in order to know what job to do and how to do it, that method is way overworked. Spread the load and take some of the weight off its shoulders with a springtime refactoring. Split it into two, or maybe it makes more sense to give some of these arguments to the instance in its initializer. Could you deal with 8 arguments simultaneously? Then don’t expect your methods to.

So that’s how to do code review when you’ve forgotten your glasses or have been staring directly into the sun for longer than is medically recommended. If I was better at programming then I’m sure I could have come up with some far more subtle examples. On the other hand, one could argue (and I fully intend to do so) that triviality can sometimes be interesting, and even when it's not is almost always more important than we would like to think. However clear, simple and well-patterned your design may be, it’s all for naught if you construct it out of mud and toenails. 
