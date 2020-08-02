---
layout: post
title: "What is an advanced beginner?"
tags:
  - Programming Projects for Advanced Beginners
  - PFAB
og_image: https://robertheaton.com/images/pfab-cover.png
---
I write blog posts for advanced beginner programmers. My goal is to help readers chop their way through the Valley of Despair and up the steep but scalable Cliff Face of Fulfilling Employment. The phrase "advanced beginners" strikes loud chords with many. My own definition changes a lot, but here's one version of it:

> An advanced beginner is someone who has learned a lot but doesn't know what to do next.

From emailing and talking with hundreds of advanced beginners, I believe that I’ve found two main subtypes: Alice and Bob. In this post I’ll describe who these people are and how I’m trying to help them.

It goes without saying that I'm not an authority on naming the different stages of software scholarship, and that even if I was, names are only names. If you feel like an advanced beginner but don’t identify with either Alice or Bob then [I’d love to know why][about]. If your name begins with a “C” then I’ll even name the new persona after you.

### Alice

Alice works in a frustrating job she doesn’t like. She’s heard that computer programming might be a fun and well-paid alternative. Some of her friends-of-friends have taught themselves to code in their spare time and have landed exciting new careers, and she’s decided that she’s going to learn too. Some Alices recently completed a computer science degree or a bootcamp, but still feel entirely unprepared for the real world.

Alice is medium-to-high-serious about learning. In the last 4 months she’s worked through both Learn Python the Hard Way and Python Crash Course. She’s enjoyed them both, and now really feels like she understands variables, if-statements, for-loops, functions, and so on.

Alice tries to work on bigger projects. But she almost always gets stuck. She doesn’t have any friends who are programmers, and so she doesn’t have anyone to help unstick her. She never knows whether her code isn’t working because the problem she’s trying to solve is too difficult, or because she missed out a comma. Even when her code works, she never knows whether she’s doing it “right”. People on the internet tell her not to worry about this, but she does, very much.

She buys another book called “Python for Beginners” but it's just the same stuff that she already knows. She buys “Python for Intermediates” but it’s all too difficult. She starts watching YouTube videos but they are mostly dross. She wants to get better but she hasn’t even been able to work on what “get better” means in this world. Maybe she needs to learn more languages? Alice reads “The Poignant Guide to Ruby” and enjoys it, but now she just knows two flavors of the same basics. She still doesn’t really understand classes and objects.

She does some Googling. “How do I get better at programming?” she asks. She finds lots of optimistic but perfectly useless advice. “Work on projects that solve your own problems!” OK, but my main problem is that I’m not as good at programming as I would like to be. “Read other people’s code!” OK, I went to github.com, now what? “Work on Open Source!” That sounds good, but where do I apply?

Many Alices stay on the sad side of the hump forever.

### Bob

Bob already has a job as a computer programmer at a small company. He likes his job but he feels like a fraud. He can slap together blobs of code that solve the immediate problems in front of him, but he has a nagging certainty that if anyone else looked at his creations then they would shout at him and call him a moron and a charlatan. He doesn’t know exactly why though. He wants to keep learning, but no one who he works with has the skills or interests to help him.

He tries pursuing some side-projects. They usually work, more or less, but he’s running out of ideas and he thinks that these projects have stopped teaching him very much. His codebases quickly turn to spaghetti, no matter how many Tweets he reads saying “Good programmers always make sure to separate their code’s concerns!” He has no idea how to stop this from happening.

I did not expect Bobs to see themselves as advanced beginners. I expected them to see the term as patronising and beneath them - “uh I know how to test my code thank you very much, have you seen the job title on my business card?” But sometimes even getting paid to write code isn't enough to fend off their worries that their code is terrible and their employer is a fool.

## How I’m trying to help

I write two (free) series for Alice and Bob called ["Programming Projects for Advanced Beginners"][ppab] and ["Programming Feedback for Advanced Beginners"][pfab]. Here’s how they work.

### Programming Projects for Advanced Beginners (PPAB)

The goal of PPAB is to help people write more code and have fun doing so. Each installment is a semi-guided project that breaks the end goal up into bite-size milestones without telling the reader how to eat them. The reader gets enough hints to save them from becoming irrevocably stuck, but still has to do all the difficult work themselves. The end result of each project is a complex program that does something snazzy, like produce [ASCII art][ascii] or [photomosaics][photomosaic] or an [unbeatable Tic-Tac-Toe AI][tictactoe]. Readers get a well-constructed base program that they can take off in their own directions.

PPAB doesn’t directly show readers how to write “good” code. It doesn't give much advice on how to structure programs or what modularity really means, but it does teach readers how to break down and think through problems. It also motivates them to write *more* code, which is surely a necessary precursor to that code becoming “good”. Readers who want to write better code should look to my other series, Programming Feedback for Advanced Beginners.

### Programming Feedback for Advanced Beginners (PFAB)

The goal of PFAB is to help readers contemplate their code from new angles, such as efficiency, reusability, and maintainability. PFAB gives readers the experience of analyzing abstractions with an experienced, kind, good-looking co-worker. Readers send me code that they’ve written and I suggest ways in which they can improve it. We cover topics like exception handling, program structure, and speed, and we deal with the murky tradeoffs inherent in programming in the real world. The most popular post in this series (which admittedly falls a little outside the normal recipe) is an 8,000 word behemoth called [Systems Design for Advanced Beginners][sdab], in which we look at how large tech companies lay out their databases, APIs, and other infrastructure. The moral of this particular PFAB is that there’s a lot going on inside these companies but none of it is magic.

## In conclusion

It can be tough being an advanced beginner, but it doesn't have to stay tough forever. If any of this resonates with you then I’d love to know what your story is and what else you think would help you to keep improving.

[about]: https://robertheaton.com/about
[ppab]: https://robertheaton.com/2018/12/08/programming-projects-for-advanced-beginners/
[pfab]: https://advancedbeginners.substack.com/
[ascii]: https://robertheaton.com/2018/06/12/programming-projects-for-advanced-beginners-ascii-art/
[photomosaic]: https://robertheaton.com/2018/11/03/programming-project-4-photomosaics/
[tictactoe]: https://robertheaton.com/2018/10/09/programming-projects-for-advanced-beginners-3-a/
[sdab]: https://robertheaton.com/2020/04/06/systems-design-for-advanced-beginners/