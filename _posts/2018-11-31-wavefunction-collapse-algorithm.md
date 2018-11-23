---
title: The Wavefunction Collapse Algorithm explained very clearly
layout: post
tags: [Computer Games]
og_image: https://robertheaton.com/images/snake-intro.png
published: false
---
The Wavefunction Collapse Algorithm is a procedural generation technique for riffing on examples. It takes an archetypical input, and produces randomly-generated outputs along the same lines.

<img src="/images/wfc-examples.png" />
*([Source][unity-wfc])*

It is most commonly applied to images, but has also been used to create [towns][unity-wfc], [skateparks][skater], and [terrible poetry][poetry].

<img src="/images/wfc-town.png" />
*([Source][unity-wfc])*

[unity-wfc]: https://selfsame.itch.io/unitywfc
[skater]: https://arcadia-clojure.itch.io/proc-skater-2016
[poetry]: https://github.com/mewo2/oisin
[wfc-home]: https://github.com/mxgmn/WaveFunctionCollapse

Wavefunction Collapse is a delightful algorithm, for two reasons. The first is that you don't have to manually specify any rules. You feed it an example, and it figures everything else out for itself. The second is that it doesn't use any neural networks, random forests, or anything else that sounds like machine learning. It is very clean and intuitive once you get the idea.

Most implementations and explanations of Wavefunction Collapse are of the full, optimized version of the algorithm. These are of course important and necessary, but can be challenging to get into. This post gives you a leg up by describing a constrained version of the algorithm that I've named an *Even Simpler Tiled Model*. Once you fully understand the technology behind an ESTM, explanations of more advanced versions of the algorithm should start to click into place.

This post also comes with a simplified but completely functional implementation of an ESTM. It is slow and inefficient, but the code is very readable and well commented.

Let's start with a story.

## Wedding

Imagine that you are planning your wedding. On top of making sure that you have enough turtle doves and power ballads, you need to design the seating plan for dinner. Your family can be very argumentative and volatile, so this will be difficult. Your dad can't sit within 2 tables of your mum. Your cousin will get grumpy and lonely if she doesn't sit with your other cousin. And it's probably for the best if Uncle Roy doesn't sit with the environmentalist wing of your partner's family. You realize that solving this seemingly intractable problem will require the Wavefunction Collapse Algorithm.

You start with a long list of rules and a blank seating plan.

<img src="/images/wfc-plan-intro.png" />

You construct your seating plan's initial *wavefunction*. This is a mapping of every seat to a list of the people able to sit in it. For now, any seat can contain any person; you, your friend who you only ever see at weddings, or your partner's disconcertingly unattractive ex. Your seating plan's wavefunction starts in a complete *superposition* (borrowing from the quantum) of every possible valid layout.

<img src="/images/wfc-table-superposition-better.png" />

Schrodinger's Cat was simultaneously both dead and alive until someone opened its box and checked on it; your table plan is simultaneously in every single possible layout until you get your shit together. A complete superposition is a useful theoretical construct, but it won't help grandma work out where she should sit. You need to reduce your seating plan wavefunction to a single, definite state that you can pin onto a notice board and turn into non-quantum namecards. 

You begin by *collapsing the wavefunction* for a single seat. You choose a seat, look at the list of people who are able to sit in it, and randomly assign it to one of them. The seat's wavefunction is now collapsed.

<img src="/images/wfc-table-collapsed.png" />

This choice has consequences that ripple out through the rest of your seating plan's wavefunction. If Uncle Roy is going to be on Table 6 then cousin Frank and Michele Obama (your partner is a family friend) certainly can't be. And if Michele isn't going to be on Table 6 then Barack won't want to be either. You update the seating plan wavefunction by crossing people off of lists of possible assignees.

<img src="/images/wfc-table-propagate.png" />

Once the ripples have settled you repeat this process. You choose another seat with more than one possible occupant, and collapse its wavefunction by random selecting one of these plausible people to sit in it. Once again, you propagate the ripples of this choice throughout the rest of the seating plan, deleting people from a seat's wavefunction as they become ineligible to sit in it.

You keep repeating this process until either every seat's wavefunction is collapsed (meaning that it has exactly 1 person sitting in it), or until you reach a *contradiction*. A contradiction is a wavefunction containing a seat in which nobody is able to sit, because they have all been ruled out by your previous choices. If you reach a contradiction then the easiest thing to do is to start again. Throw away your work so far, find a new blank table plan, and re-start the algorithm by collapsing the wavefunction for a different random seat. You could also implement a backtracking system that allows you to undo individual choices instead of discarding everything ("well what happens if Shilpa goes in seat 54 instead?"), but the wedding starts in 3 hours, your list of power ballads is just *Don't Wanna Miss A Thing* repeated 15 times, and you've got no time to be fancy.

After a few false starts you finally reach a fully collapsed state - one in which every seat is assigned to exactly one person and all of the rules are obeyed. You're done! You rush outside the wedding hall, pin the plan to the noticeboard, and sit back to calmly await the cake, presents, and Aerosmith that await you.

## From weddings to bitmaps

If you had a mind to, you absolutely could implement a variant of Wavefunction Collapse that produced seating plans for your wedding. It would take in a set of rules and collapse them into a valid layout, unless of course it ran into so many contradictions trying to deal with your screwball family that it implored you to call the whole thing off.

In more traditional Wavefunction Collapse, we're not trying to arrange people in a Holiday Inn convention room. We're trying to arrange pixels in an output image. However, the process is still remarkably similar.

[[TODO: more about what it is for?]]

[[TODO: Differences are in how rules are deduced, and other stuff]]

[PIC]

## Deducing rules

The most pleasing part of traditional Wavefunction Collapse is the way in which you teach the algorithm the rules for generating an output image. You don't have to explicitly enumerate or write out the restrictions; instead, you give the algorithm an example image, and it figures everything else out from there. The algorithm parses the example, and deduces how pixels or *tiles* are allowed to be arranged.

### Simple Tiled Model

Let's start by considering a simple, special case of Wavefunction Collapse that `mxgmn` (the algorithm's creator) calls a *Simple Tiled Model*. In a Simple Tiled Model, input and output images are built out of a small number of pre-defined tiles, and each square in the output image is affected and constrained only by its 4 immediate neighbors. For example, suppose we are generating random worlds for a top-down, 2-D game. We might have tiles for land, coast, sea and mountains.

<img src="/images/wfc-tiles.png" />

The rules for a *Simple Tiled Model* are complicated somewhat by the logic that it uses to account for symmetry, rotation and orientation. This ensures that sea tiles are only ever placed on the correct side of a coast tile.

<img src="/images/wfc-orientation.png" />

This symmetry-handling makes for better output images, but more complex code. To keep things simple whilst we're still learning, let's consider another special, even simpler case of a Wavefunction Collapse model. I'll call it an *Even Simpler Tiled Model*.

### Even Simpler Tiled Model

An Even Simpler Tiled Model is like a Simple Tiled Model, but the tiles have no symmetry properties. Each tile is a single pixel of a single color, meaning that there is no danger of mismatching their edges.

<img src="/images/wfc-terminal.png" />

The rules for an Even Simpler Tiled Model specify which tiles may be placed next to each, and at which direction. Each rule is a tuple of 2 tiles and a direction. For example `(SEA, COAST, LEFT)` means that a `SEA` tile can be placed to the `LEFT` of a `COAST` tile. This rule needs to be accompanied by another rule describing the situation from the `COAST`'s point of view - `(COAST, SEA, RIGHT)`.

<img src="/images/wfc-rules.png" />

If you want `SEA` tiles to be permitted to the `RIGHT` as well as the `LEFT` of `COAST` tiles then you'll need additional rules: `(SEA, COAST, RIGHT)` and `(COAST, SEA, LEFT)`.

Remember that we don't have to list all of these rules ourselves. Wavefunction Collapse can produce the ruleset for an Even Simpler Tile Model by parsing an example input image and compiling a list of all the 3-tuples that it contains.

<img src="/images/wfc-tuples.png" />

From our example image above, an Even Simpler Tiled Model observes that sea tiles can only go below or to the side of coast tiles, or anywhere next to other sea tiles. It also notes that coast tiles can go to the side of land, sea or other coast tiles, but only above sea tiles and below land ones. It makes no attempt to infer any more complex rules, like "sea tiles must be adjacent to at least one other sea tile". No tile exerts any influence over which types of tile may or may not be placed 2 or more squares away from it. This is like a wedding plan model in which the only type of rule is "X may sit next to Y".

We will also need to record the frequency with which the different tiles appear. We will use these numbers as weights when selecting which square's wavefunction to collapse, and when choosing which tile to assign to a square when it is being collapsed.

Once we know the rules that our output image must adhere to, we are ready to build and collapse our output image's wavefunction.

## Collapse

As in our seating plan example, we start the collapsing process with a wavefunction in which every square in our output image is in a superposition of every tile.

<img src="/images/wfc-land-superposition.png" />

We start by choosing a square whose wavefunction we will collapse. In our wedding planning example we made this choice randomly. However, as `mxgmn` has observed, this isn't how humans tend to approach these kinds of problems. Instead, they look for the squares with the lowest *entropy*. Entropy is a measurement of uncertainty and disorder. The higher a square's entropy, the more uncertain the tile that it will eventually resolve to is. The lower its entropy, the more it is already constrained, and the closer it is to being decided already.

The formula used in Wavefunction Collapse is *Shannon Entropy*. It makes use of the tile weights that we parsed from the input image in the previous step:

```
# Sums are over the weights of each allowed tile
shannon_entropy =
  log(sum(weight)) -
  (sum(weight * log(weight)) / sum(weight))
```

For example, in an Even Simpler Tile Model, a square with no information from its surrounding squares is completely unconstrained and is still able to be any tile. It therefore has very high entropy. But a square with several of its surrounding squares already collapsed might only have 2 tiles that it can possibly take on.

<img src="/images/wfc-entropy.png" />

Even though this square's wavefunction has not been fully collapsed, it is still very constrained, and therefore has a low *entropy*. It is these highly restricted tiles that humans tend to focus on. Even if you're not rigorously using Wavefunction Collapse to design your wedding seating plan, you will still tend to focus on the areas of the plan that already have the most strictures. You don't put Dwayne on Table 1, Seat 5, then arbitrarily leap over to putting Kathy on Table 7 (which is currently empty). Instead you seat Dwayne, then figure out who can sit next to him, then who can go next to them, and so on. I haven't seen this written anywhere else, but my intuition says that following this *minimal entropy heuristic* probably results in fewer *contradictions* than randomly choosing squares to collapse.

Once we've found the square in our wavefunction with the lowest entropy, we collapse its wavefunction. We do this by randomly choosing one of the tiles still available to the square, weighted by the tile weights that we parsed from the example input. Using the weights gives us a more realistic output image. Suppose that a square's wavefunction says that it can either be land or coast. We don't necessarily want to chose each option 50% of the time. If our input image contained more land tiles than coast tiles, we will want to reflect this bias in our random choices. We therefore use simple, global weights. If our input image contained `20` land tiles and `10` coast ones, we will collapse our square to land `2/3` of the time and coast the other `1/3`.

We propagate the consequences of our choice through the rest of our output matrix's wavefunction ("if that tile is sea then this one can't be land, which means that this one can't be mountain"). Once all the after-tremors have quietened down we repeat this process, using the minimal entropy heuristic to choose which tile to collapse next. We repeat this collapse-propagate loop until either our output's wavefunction is completely collapsed and we can return a result, or we reach a contradiction and return an error.

We have made a world (or an error).

## Beyond the Even Simpler Tiled Model

Symmetry
Overlapping tiles - Markov chains
Constraints
Performance optimization


In more complex versions of Wavefunction Collapse, tiles *can* influence each other at a larger distance. If you're into this kind of thing (and it's fine if you're not) `mxgmn` notes that the Simple Tiled Model is analogous to an order-1 Markov chain.
