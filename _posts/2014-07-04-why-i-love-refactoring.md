---
layout: post
title: Why I love refactoring
---
I love refactoring. If it weren’t for the obvious, disconnected-entirely-from-the-real-world deficiencies it would imply in my approach to software development, I would say that I like it more than building features. Let’s just say that I spend almost every Christmas, New Year and Kwanza extracting gems and building decorators and leave it at that.

When refactoring, you know more about the domain than when the code was first written, so can unwind the erroneous assumptions of the past. You can make much more educated guesses at what the code will need to do in the future, and can structure it accordingly. You can see where the performance problems are, and whether performance is in fact something you should be worried about at all.

You can see where the commonalities actually are. Perhaps you are refactoring Google’s search engine code, whose original authors didn’t realise that an advert is actually just a search result with a little yellow box next to it. With the benefit of 20/20 hindsight, you can unite these two previously disparate concepts under a common interface.

When you write a new feature, the codebase always becomes harder to understand. The average quality-per-line might go up, but unless there is a a whole load of red in your diff this doesn’t matter. All other things being equal, larger codebases are simply harder to navigate than small ones. They have more folders, more files, more layers and just more stuff to remember and places to grep. Building electric cars don’t reduce pollution - you have to get the petrol-powered vehicles off the road too. When refactoring, you are unquestionably being a good codebase citizen, and future developers will praise your very name when they `git blame`, long after you are dead/move to another company.

These are all good and prodigiously insightful reasons why refactoring is good for the health of your code, but they don’t really get at why I love it so much. It’s because writing good code is fun. Writing features is also fun and really quite essential, but there’s nothing quite as nice as having your one job be to write really nice code. You don’t have to worry about whether what you are writing is actually going to be useful to anyone, because you know it already is. You can in good conscience use the kinds of abstraction, separation of concerns and modularisation that you often have to warn yourself off when writing a feature for the first time. Yesterday’s yak-shaving becomes today’s urgent mammalian hairdressing.

It’s important to respect the people who wrote the first version. They were smart people under different constraints to you. Maybe getting something out the door that afternoon was absurdly important. Maybe the world looked different back then. Maybe no one knew that this code would actually become pretty important and would still be around two years later. Whatever the situation, they made their decisions for a reason and you should be mindful of this[0].

Unfortunately, you don’t win any prizes for having a nice codebase. If you did then the FTSE100 would be made up of ever-more terse and elegant implementations of merge-sort. But it is still incredibly important for achieving the thing that you do get prizes for; making something useful.

[0] Thanks to Andy Brody for this observation
