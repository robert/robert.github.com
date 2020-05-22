---
permalink: /2016/09/12/building-a-magic-the-gathering-sealed-deck-ai/index.html
title: Building a Magic&#58; The Gathering sealed deck AI
custom_title: Building a Magic The Gathering sealed deck AI
layout: post
tags: Magic
---
As far as I know, there are no good Magic the Gathering AIs. For the time being you are almost definitely a better Magic player than [Deepmind](https://deepmind.com). Nonetheless, if a huge metal cuboid in a trench coat and dark glasses ever asks whether you have a Standard deck with you, tell it that you aren’t into Pokemon and run for the hills.

In this essay we’re going to analyze data from 280 Eldritch Moon sealed pools that went either 4-1 or 5-0 in [recent MTGO tournaments](http://magic.wizards.com/en/content/deck-lists-magic-online-products-game-info), and use this data to design a sealed deck building AI. We will then use this data and our AI to reason about what makes a sealed format "easy" or "hard". This will both make you a better limited player and keep you safe come the inevitable ascendancy of mecha-Finkel.

## Meet Lucille

Our sealed deck AI’s name is Lucille. Tragically, Lucille understands nothing about the mechanics of Magic the Gathering. She is, however, extremely good at statistics. It turns out that this is all she really needs.

## Lucille v1

The first version of Lucille is going to build her sealed decks in 2 stages:

1. Decide on 2 colors to play
2. Decide on 23 cards and 17 lands from within these colors

Human players will often go back and forth between these stages, examining a few different color combinations in detail before making a final decision. Lucille doesn’t know how to do this, and once she’s made a choice she sticks with it, goddamit. Lucille also doesn’t understand artifacts, multi-colored cards, non-basic lands, or splashing. But this is her first foray into Limited Magic. Give her a break.

### Decide on 2 colors to play

Lucille chooses her colors by looking for cards in her pool that typically make people more likely to play its colors. These might be bombs, removal, or something else entirely. In order to do this, she calculates a Desirability Rating for each card:

> ### Desirability Rating
> (The probability that a pool WITH a card plays its color AND plays the card) -<br/>
> (The probability that a pool WITHOUT the card plays its color)

This reflects the extent to which a card pulls a deck-builder into its color. Let’s look at the commons from Eldritch Moon, since these are the cards that we have the most data for:

#### Top 20 EMN common Desirability Ratings <small>(full list [here](/emn/desirability-ratings) )</small>

| # | Name | Color | Rating |
|---|---|---|---|
| 1 | [Brazen Wolves](#mtg) | R | 17.813681 |
| 2 | [Ulvenwald Captive](#mtg) |  G |  17.549225 |
| 3 | [Choking Restraints](#mtg) |  W |  16.139689 |
| 4 | [Drag Under](#mtg) |  U |  14.940711 |
| 5 | [Prey Upon](#mtg) |  G |  12.361744 |
| 6 | [Gavony Unhallowed](#mtg) |  B |  11.589744 |
| 7 | [Vildin-Pack Outcast](#mtg) |  R |  10.739993 |
| 8 | [Wretched Gryff](#mtg) |  U |   9.677757 |
| 9 | [Sigardian Priest](#mtg) |  W |   8.597120 |
| 10| [Midnight Scavengers](#mtg) |  B |   7.937011 |
| 11| [Olivia's Dragoon](#mtg) |  B |   7.145955 |
| 12| [Backwoods Survivalists](#mtg) |  G |   6.403162 |
| 13| [Certain Death](#mtg) |  B |   6.129782 |
| 14| [Ingenious Skaab](#mtg) |  U |   5.921619 |
| 15| [Galvanic Bombardment](#mtg) |  R |   4.435831 |
| 16| [Thermo-Alchemist](#mtg) |  R |   2.703690 |
| 17| [Exultant Cultist](#mtg) |  U |   2.219835 |
| 18| [Dawn Gryff](#mtg) |  W |   1.444444 |
| 19| [Ironclad Slayer](#mtg) |  W |   0.714286 |
| 20| [Alchemist's Greeting](#mtg) |  R |   0.102564 |

As we might expect, the cards at the top of the list are overwhelmingly good creatures and removal spells. Combat tricks and card draw tend not to feature.

The top cards are also those that fill a role that is otherwise hard to replace. There are few red cards that can provide the savage ground beating of a [Brazen Wolves](#mtg) attacking as a 4/3 on turn 4. [Ulvenwald Captive](#mtg) is the only good, common mana dork in the format. [Prey Upon](#mtg) is significantly higher than [Galvanic Bombardment](#mtg), despite being a much, much worse card. It provides the removal that a green-based deck might otherwise be missing. Bombardment is one of the best removal spells in the format, but a color that also has [Fiery Temper](#mtg), [Make Mischief](#mtg), [Incendiary Flow](#mtg) and [Savage Alliance](#mtg) can find replacements without much trouble.

<img src='/images/brazenwolves.jpeg' />
<img src='/images/ulvenwaldcaptive.jpeg' />
<img src='/images/galvanicbombardment.jpeg' />

[Gavony Unhallowed](#mtg) is the biggest surprise in this list, coming in at #6 and beating out many cards that appear to be much more powerful, including strong black commons like [Midnight Scavengers](#mtg) and [Boon of Emrakul](#mtg). However, it provides a uniquely large and reasonably costed body that can hold down the fort for black decks that might otherwise have trouble blocking anything with more than 2 power. It makes strong but otherwise flimsy black pools full of cards like [Olivia’s Bloodsworn](#mtg) a more viable option.

<img src='/images/gavonyunhallowed.jpeg' />

By contrast, despite being 2 power of flying for a mere 2 mana, [Tattered Haunter](#mtg) is so terrible on defense that it is not a strong pull into blue. If you are fortunate to get enough cards that can gum up the ground whilst it swings in the air then you will absolutely play it in your blue decks. But it’s whether or not you get those (relatively hard to come by) cards that will dictate whether or not you play blue, not whether or not you get a Tattered Haunter.

<img src='/images/tatteredhaunter.jpeg' />

This type of analysis allows Lucille to distinguish between solid cards that she is happy to play, like [Emrakul’s Evangel](#mtg), and the superficially similar but infinitely better [Tireless Tracker](#mtg). It allows her to realize that whilst she should be willing to play a large amount of crappy green filler for the opportunity to play the Tracker, she should not make these sacrifices for the Evangel. Importantly, she is able to make this distinction do this *without understanding anything about what the cards actually do*.

<img src='/images/emrakulsevangel.jpeg' />
<img src='/images/tirelesstracker.jpeg' />

Lucille chooses the colors in her pool with the largest number of high-Desirability Rating cards and proceeds to step 2.

### Decide on 23 cards and 17 lands

Lucille v1 is an ABC deck builder. She isn’t interested in synergies; she only cares about packing her deck with the most in-a-vacuum powerful cards that she can. In order to do this, she calculates a playability-rating for each card:

> ### Playability Rating
> The percentage of the time that someone plays a card, given that they have decided to play that card’s color

She chooses the 23 cards in her colors with the highest Playability Ratings, grabs a proportional amount of basic land, and is ready to battle. Unfortunately, she has no idea how to play Magic, so gets annihilated in the actual tournament. But she still had fun.

The more cards in a set with Playability Ratings close to 0 and 100%, the more straightforward this step is, and the better Lucille will be at it. The more cards that are murky and in between, the more opportunity there is for human players to use their squishy, contextual brains to outsmart her. Cards with high Playability Ratings will often be straightforwardly powerful cards. They will be a big part of the reason that you might choose to play the color in the first place. However, there will also be many thoroughly unexciting yet functional utility cards that won’t win you any games on their own, but will keep your opponent busy until you can get out the cards that will.

#### Top 20 EMN common and uncommon Playability Ratings <small>(full list [here](/emn/playability-ratings) )</small>

| Rank | Card | Color | Rating | Sample size
|---|---|---|---|---|
| 1 | [Boon of Emrakul](#mtg) |B | 100.0 | 64 |
| 2 | [Haunted Dead](#mtg) |   B  | 100.0 | 34
| 3 | [Murder](#mtg) |   B  | 100.0  | 34
| 4 | [Clear Shot](#mtg) |   G  | 100.0  | 30
| 5 | [Noose Constrictor](#mtg) |   G  | 100.0 |  34
| 6 | [Conduit of Storms](#mtg) |   R  | 100.0 | 28
| 7 | [Deranged Whelp](#mtg) |   R  | 100.0  | 20
| 8 | [Galvanic Bombardment](#mtg) | R | 100.0 | 62
| 9 | [Incendiary Flow](#mtg) | R | 100.0 | 32
| 10 | [Savage Alliance](#mtg) | R | 100.0 | 36
| 11 | [Smoldering Werewolf](#mtg) | R | 100.0 | 39
| 12 | [Advanced Stitchwing](#mtg) | U | 100.0 | 15
| 13 | [Ingenious Skaab](#mtg) | U | 100.0 | 34
| 14 | [Nebelgast Herald](#mtg) | U | 100.0 | 21
| 15 | [Scour the Laboratory](#mtg) | U | 100.0 |  8
| 16 | [Unsubstantiate](#mtg) | U | 100.0 | 12
| 17 | [Faith Unbroken](#mtg) | W | 100.0 | 34
| 18 | [Choking Restraints](#mtg) | W | 98.9 | 93
| 19 | [Brazen Wolves](#mtg) | R | 97.7  | 86
| 20 | [Sigardian Priest](#mtg) | W | 97.6 | 84

<script>
$(document).ready(function() {
  $('a[href=#mtg]').each(function() {
    console.log($(this).attr('href'));
    $(this).attr('href', 'http://gatherer.wizards.com/Pages/Search/Default.aspx?name=+[' + $(this).text() + ']');
  });
});
</script>

To choose a few examples of unexciting but extremely playable cards:

* 100% of the 20 red players with [Deranged Whelp](#mtg) played them
* 95% of the 56 green players with [Backwoods Survivalists](#mtg) played them
* 94% of the 35 blue players with [Tattered Haunters](#mtg) played them

<img src='/images/derangedwhelp.jpeg' />
<img src='/images/backwoodssurvivalists.jpeg' />

Tattered Haunter continues to be a great example. It is not the card that makes a blue pool playable; it’s the interaction like [Drag Under](#mtg) and the solid bodies like [Ingenious Skaab](#mtg) that do that. But whilst no one opens a Tattered Haunter and fist-pumps, few people pass up the opportunity to play one once they have decided to play Blue either.

## Evaluating Lucille

In order to evaluate Lucille, we could get Lucille and [LSV](https://twitter.com/lsv) to each build 100 sealed decks from the same 100 pools. The closer the decks that Lucille builds to the decks that LSV builds, the more powerful Lucille is.

## Evaluating a sealed format

Furthermore, for a given sealed format, the closer that Lucille gets to LSV, the simpler the format. Lucille v1 is not very smart. If all it takes to build a good deck is memorizing two lists of cards and numbers, there are not going to be many opportunities for a strong player to use their skills to their advantage.

### Synergy

In fact, we don’t even need to kidnap any professional Magic players to evaluate a sealed format (although if we’ve already gone to the trouble of kidnapping them then we might as well use them, there’s no point letting a good kidnapping go to waste). We can calculate the Desirability Ratings and Playability Ratings for the cards in the format, and compare them to those of other, historical formats. The more cards with high Desirability and Playability Ratings, the easier the format is to build decks for.

A format where the cards can be ranked in relatively fixed orders of Desirability and Playability and the best deck consists of the top 23 cards in your pool from this list is not going to be difficult. However, when a card’s value changes significantly depending on the cards that surround it, deck builders will be presented with rich, unfamiliar choices more often. This suggests that formats that reward "synergistic" decks are likely to be harder.

Some synergies are harder to identify and evaluate than others. If one card says "When you do X, loads of awesome stuff happens" and other cards say "Do X a bunch of times", it doesn’t take a genius to figure out that they are likely to go well together. However, we’re defining "synergy" very broadly here. When we say "synergy", we don’t just mean things with a name like "spells matter", "madness", "Humans". We simply mean "any time a card’s value changes depending on the cards surrounding it". For example:

* [Spectral Reserves](#mtg) gets slightly better when you also have a [Lone Rider](#mtg)
* [Infernal Skirge](#mtg) gets slightly better when you also have [Stromkirk Occultist](#mtg)

The better Lucille is, the simpler the format. The simpler the format, the better Lucille is.

## Making Lucille better

To help Lucille get better, we need to help her go beyond evaluating each card in a vacuum. We need to help her understand something about how different cards synergize (or not) with each other. For example:

* We could look at how much of a draw the presence or absence of certain _combinations_ of cards are into a color. Earlier I suggested that [Galvanic Bombardment](#mtg) is not that much of an additional draw into red, despite being a fantastic card, because red has plenty of other decent removal options. We could help Lucille take into account how the absence of _all_ of [Galvanic Bombardment](#mtg), [Savage Alliance](#mtg), [Incendiary Flow](#mtg) and [Fiery Temper](#mtg) affects the attractiveness of her red cards. We could also help her see that whilst [Graf Mole](#mtg) and [Ulvenwald Mysteries](#mtg) are decent cards on their own, they become much more attractive when you open a pool with both of them.
* We could analyze the range of mana curves in the format, and tell her that decks that veer a long way from the norm are less likely to be good. This will help her adjust between formats where having 5 6-drops is completely acceptable, and those where even 1 is tempting fate.

These are still fairly straightforward, heuristic approaches to building an AI. On the other hand, if Deepmind decided that it wanted to solve Magic the Gathering sealed deck, my guess is that it would approach this in one of two ways.

1. It could learn how to play Magic, play a zillion games against itself, and use this to learn what a good deck looks like and why. This is analogous to the approach taken by [AlphaGo](https://en.wikipedia.org/wiki/AlphaGo), and is likely to be the most effective.

2. Alternatively, it could search out much more data on sealed decks built by strong human players, but then take a much more fundamental and generalized approach to extracting the commonalities than we have taken here. It could learn that the best decks tend to have a couple of cards from the group of [Boon of Emrakul](#mtg), [Galvanic Bombardment](#mtg), [Rabid Bite](#mtg)…etc. It could learn that the best decks tend to have 17 lands, but sometimes when the average "Converted Mana Cost" (whatever that means) is low, this can go down to 16. Given enough data, there’s no reason to believe that it couldn’t identify all of the principles that humans use when building a sealed deck. And it *still* wouldn’t have to understand what any of these principles actually mean.

It’s conceivable that an AI trained on the aggregate of all the top players would pick up the best habits of each, and so come out as the best deck-builder in the world. However, it’s the former approach, where we train a computer to understand Magic from the ground up, that would be most likely to pick out strategies that humans had never considered. We can think of the latter as a prediction algorithm that predicts the deck-building choices of top human players. We could even train one AI that predicts the deck that Jon Finkel specifically would build. We could train another for LSV, another for Owen Turtenwald and another for…you. Now that’s progress.

---

<i>I’m going to re-run this analysis for future sets, and investigate how much variation in difficulty between them there actually is. If that sounds interesting to you then hit the subscribe button below.</i>
<br/>
<i>If you'd like the SQLite database that I used to run these analyses then email me for a copy.</i>
