---
permalink: /2018/12/08/programming-projects-for-advanced-beginners/
title: Programming Projects for Advanced Beginners
layout: post
tags: [Programming Projects for Advanced Beginners]
og_image: https://robertheaton.com/images/ppab-cover.png
redirect_from:
  - /programming-projects-for-advanced-beginners
  - /ppab
---
<p style="text-align: center">
<img src="/images/ppab-cover.png" />
</p>

In a few, very specific ways, being a beginner programmer is easy. Everything is new and exciting; you're learning at least ten fresh things every day; and you're slicing through coding exercises as though they were made of butter instead of bytes.

{% include pfab.html %}

But then eventually, without really noticing it, you morph from being a beginner into an *advanced beginner*. You become acutely aware that there's more to life than 10-line brainteasers, even if some of those brainteasers are getting really quite complex. You start looking for bigger things to practice on, but everything is either too big or too small or too hard or too easy. You trip, fall, and begin tumbling gently down the mountain of optimism into the valley of despair. On your way earthward you muse that a "valley" implies a distant but visible edge, and that describing the advanced beginner period as a valley of despair kind of feels like describing the Pacific Ocean as a valley of water.

Folk wisdom says that the best way to progress is to work on projects, and this folk wisdom is entirely correct. But what should these projects be? Further folk wisdom says that a good place to start is by building tools to solve your own problems, like a recipe planner or an exercise tracker. But what if your only real problem is that you aren't yet as skilled a programmer as you would like to be? Even once you do find a plausible project idea, it can still be difficult to know whether it is actually achievable and well-matched to your current experience level. Is facial recognition hard? What about drawing bike routes on Google Maps? Finally, even if you do somehow manage to find a project that is both compelling and suitable, it's still all too easy to get completely, irrevocably stuck. These challenges do get easier to overcome with experience, but it doesn't matter whether the chicken or the egg comes first when you don't even know how to get to the farmers' market.

## Programming Projects for Advanced Beginners

To help you through the valley (and I promise it is just a valley), I've been writing a series of blog posts called *Programming Projects for Advanced Beginners*. This is a collection of guided projects in which you write complex programs that play games, paint pictures, and run artificial intelligences. The primary goal of the series is to strike a balance between steering you through the swampland of the valley of despair and allowing you to discover a path for yourself - even if that means that you get submerged in hopefully-not-toxic algae a few times. The projects can be completed in any language, and people have sent me versions that they've written in C++, Ruby, Java, and Python.

The first half of each project is broken up into bite-size milestones. At the start of each milestone we discuss what we want to achieve; why we want to achieve it; and how we can test that what we've done is correct. You then program the milestone on your own, although I've written reference code that you can refer to if you get completely stuck. At the end of the first half of a project, you will have built a fully functional core system that produces ASCII art images, plays Tic-Tac-Toe, or runs the Game of Life.

The second half is where you venture into the jungle solo, with little more than a couple of suggestions, a packed lunch, and a vague reminder to watch out for crocodiles. By this point you'll be quite familiar with the surrounding terrain, thanks to all the work we did together during the first half. You'll be able to build a wide range of elegant extensions on top of our solid base from half one. Before long you'll be coming up with your own extensions and your own projects, and at that point you won't need me at all.

These projects use almost no external libraries, which means no tedious troubleshooting or trawling through esoteric documentation that doesn't teach you any of the general principles of computer programming that you signed up for. Trawling and troubleshooting are still unfortunately skills that you will need to develop at some point, but they're not the way to get yourself feeling inspired and creative. They can wait until later.

The projects focus on methodology - breaking work down into manageable chunks and testing each chunk as you go. We talk about design patterns and techniques like modularity, interfaces, unit testing and caching, but with the aim of making you broadly aware of their existence rather than dwelling on the details. Our focus is on producing code that works, feeling great about it, and only then going back to see if we can tidy anything up.

{% include pfab.html %}

## The projects

So far I've written 6 Programming Projects for Advanced Beginners, with several more coming down the pipeline.

## [1. ASCII Art][proj-1]

<p style="text-align: center">
<img src="/images/ascii-good-luck.jpg" />
</p>

[Paint pictures out of ASCII characters][proj-1]. Hook your code up to your webcam.

## [2. Game of Life][proj-2]

<p style="text-align: center">
<img src="/images/ppab-gol.png" />
</p>

[Run the hypnotic *Conway's Game of Life*][proj-2]. Build beautiful patterns like the *Gosper Glider Gun* and invent your own *cellular automata*.

## [3. Unbeatable Tic-Tac-Toe AI][proj-3a]

<p style="text-align: center">
<img src="/images/tictactoe-example.png" />
</p>

[Build a command line Tic-Tac-Toe game][proj-3a], then use the *Minimax Algorithm* to turn it into an unbeatable TTT AI.

## [4. Photomosaics][proj-4]

<p style="text-align: center">
<img src="/images/mosaic-me.png" />
</p>

[Paint pictures out of other pictures][proj-4]. Learn how to speed up your code using caching and pre-computation.

## [5. Snake][proj-5]

<p style="text-align: center">
<img src="/images/snake-example.gif" />
</p>

[Build a command line version of the classic game "Snake"][proj-5]. Convert it into a multi-player Tron game.

## [6. User Logins](/2019/08/12/programming-projects-for-advanced-beginners-user-logins)

<p style="text-align: center">
<img src="/images/login-cover.png" />
</p>

[Starting from the absolute basics, learn how real-world companies authenticate their users and store their passwords safely in a database.](/2019/08/12/programming-projects-for-advanced-beginners-user-logins)

## [7. And introducing...Programming Videos for Advanced Beginners](/2019/07/27/programming-videos-for-advanced-beginners-battleships/)

<p style="text-align: center">
<iframe width="600" height="400" src="https://www.youtube.com/embed/videoseries?list=PLw22WCqAVCN6EXylkzhtMwvgcLq4TrcQX" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</p>

The detail-oriented, step-by-step PPAB approach comes to the big screen. We make a terminal version of the boardgame "Battleships" and have a great time doing it.

## Action

Choose the project that interests you the most, and give it a shot. Whether you finish it in a frenetic frenzy or stumble on an ambiguous sentence and give up, let me know (via [email][email] or [Twitter][twitter]). If any part was unclear then I'll clarify it for you and use your feedback to make the project better, and if you've managed to finish them all then I'll know that I should really hurry up and publish project #6.

Good luck!

{% include pfab.html %}

*You might also be interested in signing up for [my office hours](/office-hours), or for my newsletter (see below).*

### Acclaim for Programming Projects for Advanced Beginners

*"Just want you to know that I'm currently going through your "Programming Projects for Advanced Beginners" blog post series and it's been an awesome ride along the way!"*

*"I just completed advanced beginners part-1 and it was wonderfully written project/blog. Thank you very much."*

*"Really love how the blog post goes through the steps with explanation in code, thanks for sharing!"*

*"I finished the ASCII project a few days ago, it was great. When is the next one coming out??"*

*"I started with the Conway's Game of Life one and now I'm spending an hour or two each night putting together the tic tac toe game. Right now I'm building the board/turn sequence but I'm excited for the AI part…"*

*"Holy moly, that link is amazing. The way he describes the situation is amazing, so well written and accurate."*

<br/>

[proj-1]: /2018/06/12/programming-projects-for-advanced-beginners-ascii-art/
[proj-2]: /2018/07/20/project-2-game-of-life/
[proj-3a]: /2018/10/09/programming-projects-for-advanced-beginners-3-a/
[proj-3b]: /2018/10/09/programming-projects-for-advanced-beginners-3-b/
[proj-4]: /2018/11/03/programming-project-4-photomosaics/
[proj-5]: /2018/12/02/programming-project-5-snake
[email]: /about
[twitter]: https://twitter.com/robjheaton
