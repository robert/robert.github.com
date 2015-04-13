---
title: Scientific debugging
layout: post
redirect_from:
  - /2015/03/29/my-hypothesis-is/
  - /2014/07/04/why-i-love-refactoring/
---
I’ve started noticing a common theme in the way that many good engineers speak whilst debugging. I’m calling their approach "Scientific Debugging".

Sentences I might use:

* "We’ve probably screwed up our database locking somehow."
* "Maybe we’re saving a different copy of the object in memory."
* "It must be a problem with the ORM."

Sentences a Scientific Debugger (SD) might use:

* "My hypothesis is that we are just missing an index on `created` and `amount`."
* "My assumption is that we will never drop any events."
* "My belief is that we are saving the objects in the wrong order."

My belief is that Scientific Debugging is smart because:

1. <u>The SD explicitly identifies and states their hypotheses</u>. This keeps them focussed on gathering evidence to refute or verify these hypotheses, instead of trawling through whatever logs happen to be closest in desperate search of random inspiration.
2. <u>The SD explicitly states the beliefs and assumptions that fed into their hypotheses</u>. This allows their colleagues to quickly refute or verify these building blocks, or at the very least understand more about where the hypotheses came from.
3. <u>The SD explicitly states the amount of evidence and confidence that they have in the different statements they make</u>. The un-SD will often use the evidence in front of them to come to some conclusion about the state of the world, and actually believe that this is accurate until they find out that it is not. The SD’s continuous and almost monotonous repetition that everything they’re trying is just a plausible guess until proven otherwise makes it much harder to skip logical steps.
4. <u>The SD reifies their thoughts into tangible objects that anyone can modify</u>. "I think that Justin Timberlake is not an incredibly sexy man," invites disagreements of the form "you are a fool and a charlatan, yes he is." This results in confrontation and defensiveness and little progress. However, "my hypothesis is that Justin Timberlake is not an incredibly sexy man," invites disagreements of the form, "have we considered the 2013 study in which it was conclusively proven that he is the sexiest man who has ever and will ever live?" This results in us collaboratively shaping and moulding an object that is separate from and unattached to ourselves, until we arrive at something that we can both agree on with minimal damage to our egos.

My assumption is that following this pattern whilst debugging will make you a more methodical and successful engineer. My hypothesis is that following this pattern anywhere else will make you even worse at pillow talk than you currently are.

More data are required.
