---
permalink: /2019/04/13/open-source-for-advanced-beginners/
title: "Open Source for Advanced Beginners"
layout: post
tags: [Programming Projects for Advanced Beginners]
og_image: https://robertheaton.com/images/osab-cover-main.png
redirect_from:
  - /open-source-for-advanced-beginners
  - /open-source-for-advanced-beginners/
---
The three most common pieces of almost-useful advice given to people learning programming are:

* Think of a project and just work on it
* Read other people's code
* Work on open source projects

These suggestions are anecdotally very effective if you're able to put them into practice, but doing so can be extremely tough. How do you know if your project idea is feasible? Whose code should you read? How do you read it? Do you start at line 1 and go down? Which open source projects should you work on? And what does that mean exactly?

I've already attempted to make it easier to "think of a project and just work on it" with my ["Programming Projects for Advanced Beginners"](/programming-projects-for-advanced-beginners) blog posts. This series walks you through creating substantial and extensible projects, like [building a photomosaic](/2018/11/03/programming-project-4-photomosaics/) and [an AI that plays Tic-Tac-Toe](/2018/10/09/programming-projects-for-advanced-beginners-3-a/). You get detailed guidance, but not too much, and have to do all the difficult bits yourself.

<img src="/images/osab-cover-main.png" />

Now I'm working on a new series called ["Open Source Projects for Advanced Beginners"](/2019/04/14/open-source-for-advanced-beginners-1-bashplotlib/) that helps with suggestions 2 and 3: "read other people's code" and "work on open source projects". I've made copies of some open source codebases and come up with features that I think would make them better. Your task is to add them.

Despite the name, the goal of Open Source Projects for Advanced Beginners is not to help you get into open source. It's to help you get your first programming job. It does this by giving you experience of working in large codebases written by other people, and thus helping you to break the classic employment dilemma:

> "The best way to learn the skills you need to get a job as a programmer is to get a job as a programmer."
>
>   -- Joseph Heller, Catch 22 (probably, I haven't actually read it)

In Open Source Projects for Advanced Beginners, you'll:

* Practice reading other people's code
* Practice using other people's code
* See that other people's code can often be improved
* Practice using `git`, or learn about it for the first time
* See how larger projects are structured
* Work on a series of tasks in the same codebase, starting simple and gradually getting much harder
* Realize that you don't need to understand everything about a codebase in order to work productively in it

Open Source Projects for Advanced Beginners helps you solve the problems that many new programmers run into when they try to work on open source projects on their own:

* It's difficult to know which projects to work on - so I've found some projects for you
* It's very difficult to find tasks of the right level of difficulty - so I've found those for for you too
* Even if you find a project and a task, it's still difficult to understand how everything works and what you need to do - so my feature requests contain far, far more tips and suggestions than any other feature request ever written (claim not verified but probably true)

## Project 1 - `bashplotlib`

In [the first OSPAB project](/2019/04/14/open-source-for-advanced-beginners-1-bashplotlib/), you work on a Python library called `bashplotlib`. `bashplotlib` is an approachable, sensibly-written library that allows its users to plot graphs in the terminal.

<img src="/images/bpl-examples.png" />

We'll start by simply improving the way that `bashplotlib` displays graph titles. Then we'll add axis labels, write some tests, do some refactoring to improve the existing code, and finally add an entirely new type of graph. If you're ready to get started, [click here now](/2019/04/14/open-source-for-advanced-beginners-1-bashplotlib/).

## Conclusion

Most of the above is, of course, unverified assertion, with not a single Randomized Controlled Trial to back it up. I'm actually not at all certain that the OSAB series will directly help you get your first programming job. But I do think that there is a very plausible story that describes how it might. And I am confident that its projects will be enjoyable, and I am confident that you will learn a lot from them. [Give the first one a go, and let me know how you get on](/2019/04/14/open-source-for-advanced-beginners-1-bashplotlib/).

### Acclaim for Programming Projects for Advanced Beginners

*"Just want you to know that I'm currently going through your "Programming Projects for Advanced Beginners" blog post series and it's been an awesome ride along the way!"*

*"I just completed advanced beginners part-1 and it was wonderfully written project/blog. Thank you very much."*

*"Really love how the blog post goes through the steps with explanation in code, thanks for sharing!"*

*"I finished the ASCII project a few days ago, it was great. When is the next one coming out??"*

*"I started with the Conway's Game of Life one and now I'm spending an hour or two each night putting together the tic tac toe game. Right now I'm building the board/turn sequence but I'm excited for the AI part…"*

*"Holy moly, that link is amazing. The way he describes the situation is amazing, so well written and accurate."*

{% include pfab.html %}
<br/>
