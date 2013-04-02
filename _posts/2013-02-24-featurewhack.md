---
layout: post
title: Featurewhack
hn: 5298338
---
Imagine a game of whack-a-mole with 900 angry moles, many of whom have knives. Moles win.

Now imagine a second game with 1 mole that is already quite elderly and infirm. Bad time to be furry and blind.

As a feature you are building starts to get even a tiny bit big, you race towards a dystopian moleocracy at an alarming rate. Bugs and unforeseen dependencies spawn faster than you can whack them, with no end or regard for your now foolish looking scheduling predictions. It becomes increasingly impossible to imagine how you will ever finish the feature, let alone make it pleasant to use, and your only goal becomes getting it out in some form and moving onto something less depressing. Why? Can we stop this from happening?

(pause post for <a href="https://github.com/muan/whacamu" target="_blank">whacamu</a> by my pal <a href="http://twitter.com/muanchiou" target="_blank">@muanchiou</a>)

<iframe height='540' src='//muan.co/whacamu' style='border: 0;' width='100%' scrolling="no" align="middle"></iframe>

(resume post)

Back of the envelope:

In a reasonable, stable code base, the chance of something screwing up in a new feature is proportional to the number of relationships between pieces of that feature. Let’s say you are extending a POS system by building a cinema specific module. You decide to start by building the ability to sell single tickets, group discounts and popcorn. Any of those elements could have a knock-on impact on any of the others and drag you into more code or debugging. Selling popcorn means multiple products, which will affect how you architect single ticket selling. You can have group discounts for tickets, but not popcorn. The list of potential inter-dependencies is both enormous and boring.

There are currently 3 possible relationships between our 3 elements (AB,BC,BC) - add in the ability to record the identity of the cashier and this suddenly increases to 6 (AB,AC,AD,BC,BD,CD). Then add in a ticket + popcorn discount deal and you are staring at 10 relationships and ways in which things could go wrong. The complexity of your small cinema module is rapidly skyrocketing, in fact with the square of the feature size.

But there is more. The attention and care that you give to what you are building is essentially constant, and must be divided between the number of things that could be going wrong at any one time. So if the number of things that can go wrong is increasing with feature size squared, the amount of attention you can pay to each thing is going down at a corresponding rate. This means that there are n squared possible problems, each with an n squared chance of going wrong.

So whilst Feature Complexity goes up with the square of the feature size, the "Perceived Feature Complexity", an indication of how complicated the feature feels to a single developer, goes up with the fourth power of the feature size. Doubling the scope of a feature therefore increases the Perceived Feature Complexity, and more than likely also the time it takes to complete, by a terrifying factor of 16.

This feels like and may well be an exaggeration, but the relationship is definitely substantially worse than linear. It is particularly important that this argument is completely separate from any ideas of MVPs, feedback loops and iteration. Even if you were determined to build in every bell and/or whistle that occurred to anyone and everyone in your team and your team's extended family before you showed your product to anyone outside of your ivory tower, you would still get to your launch date multiple integer factors quicker by doing it in small chunks.

Get something small and manageable into development and production as soon as you can, even if it is hidden behind an admin-only flag. Give yourself a stable base to build the next layers on top of, rather than trying to build the house and the foundations at the same time. To aggressively mix metaphors, properly and conclusively whack all the moles in sight. Kill them dead. Only then should you invite the next wave to join the game.

Because could you take down an army of n to the power of four vicious moles? Are you sure? Do you want to find out?
