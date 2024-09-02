---
layout: post
title: "Generating infinite, age-appropriate Cat Crimes puzzles"
tags: [Programming]
og_image: https://robertheaton.com/images/cc.webp
---
A few weeks ago my 5-year-old and I tried playing *Cat Crimes*, a puzzle game in which you work out which of your cats ate your shoes. We had a wonderful time - for about 20 minutes.

In each round of Cat Crimes you get a puzzle card with a list of clues on it. You have to use the clues to figure out where in your front room each of your 6 cats were sitting. This tells you which one of them was responsible for your ruined stilettos. The game comes with 40 puzzle cards, ranging from the very easy to the mind-crushingly difficult.

<img src="/images/cc-cards.jpg" width="300" />

However, the problem is that "very easy" to "mind-crushingly difficult" is a lot of ground to cover in 40 puzzles, and by the fifth puzzle the clues had become too abstract and difficult for my little man. In the first few puzzles each new clue allowed us to immediately place a new cat and then forget about it. For example, a clue might have told us that Mr. Mittens was sitting opposite Pip Squeak. We already knew where Pip Squeak was sitting, so we could work out exactly where Mr. Mittens was sitting too. This is the perfect level of complexity for a small child and his aging father at 6am.

However, as the puzzles get harder the clues stopped neatly resolving like this. They still narrowed down the possible pussy permutations, but they didn't necessarily allow us to definitively place a new cat straightway. For example, a clue might have told us that Mr Mittens was sitting **next to** Pip Squeak. We know that Mr Mittens must have been on either Pip Squeak's left or right, but we couldn't say for sure which until we'd processed more clues. We might later learn that Duchess was sitting to Pip Squeak's left, which in turn would tell us that Mr. Mittens must be sitting to her right.

To follow this extended chain of logic you need to hold multiple simultaneous superpositions in your head. This is fun and challenging and good puzzle design, but my kid hasn't done superpositions at school yet so he didn't get it. I tried drawing some pictures for him, but they made no sense even to me. We got angry with each other and eventually gave up on the game altogether.

But we'd really had a great time with those first few puzzles, so that evening I wrote us a computer program that generated an infinite number of new beginner level Cat Crimes challenges. I ran it 20 times and printed out the challenges and their solutions. The next day we continued happily solving age-appropriate cat mysteries together.

### Downloads

You can download:

* [A PDF of 20 more beginner-level challenges](/puzzles.pdf)
* [The code for my challenge generator](https://github.com/robert/cat-crimes-puzzle-generator). You can use it to generate more challenges, or add new clue types, or update the rules used to select new challenges

The program works by generating random challenges until it finds one that has a single unique solution and meets certain constraints. The constraints ensure that the challenges are easy but not too easy. For example, a maximum of 3 cats can be asleep (meaning that they are out of the round), and a maximum of 2 clues are allowed to tell you a cat's exact position.

In order to play the puzzles you'll need to [buy the Cat Crimes game](https://www.thinkfun.com/products/cat-crimes/).

Good luck, and let me know how you get on!

### ChatGPT mode

At first I tried asking ChatGPT to generate puzzles for me. My puzzles are guaranteed to be solvable and probably about the right difficulty, but since they're randomly generated their solutions don't generally have much of a careful narrative behind them.

I thought that ChatGPT might be able to do better. "Absolutely!" it said when I asked it, but it kept giving me back puzzles that had either several different solutions or no solutions at all. No dice!

To fix this I added a ChatGPT mode to my tool. In this mode the tool gives you a prompt to paste into ChatGPT. The prompt asks ChatGPT it to give you a Cat Crimes puzzle formatted in a specific way. You paste ChatGPT's output back into the tool, and the tool checks whether the puzzle is valid. If it is then the tool converts the puzzle into printable card; if it's not then it prints an error message for you to give to ChatGPT to help it fix the problem. You continue this debugging loop until you have a valid (and hopefully more fun) puzzle.

### Disclaimer

I'm not associated with Cat Crimes in any way; this is a completely unofficial fan project. Cat Crimes is owned and published by Thinkfun Inc. Go and [buy it from them](https://www.thinkfun.com/products/cat-crimes/)!