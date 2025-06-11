---
layout: post
title: "diceomatic: a DSL for making children's dice games"
tags: [Babies, Programming]
og_image: https://robertheaton.com/images/sumchef/cover.webp
---
My five year-old is into football. Really, really, won't-sit-down, won't-let-anyone-else-sit-down into football. My wife and I spend every free minute taking half-hearted shots on goal; feigning agony as a daring counterattack puts us 23-0 down; and answering quiz questions about which hospital Harry Kane was born in.

To buy us a minute to breathe and shower, I invented a game called ["Dice Football"](https://docs.google.com/document/d/1rLwTG3LiXmAVnodnl0yjB4a6idm_zt21jFutJeNiX14/edit). In Dice Football you roll two 6-sided dice, add up the numbers, then consult a table to see what happens next. When the match is over you enter the results in [your tournament tracker](https://docs.google.com/spreadsheets/d/15mSKIDJ-Kh45pbUrwZ06DyPW7EcdG0dglga6R1CKTTM/edit?gid=0#gid=0). Then you start the next match. Hopefully you don't get bored for at least an hour. Dice Football is a single-player game, which means that no one has to win or lose, and that mummy and daddy get to do something else for a bit.

![image](/images/sumchef/dice-football.png)

*(Here's [a printable rules sheet for Dice Football](https://docs.google.com/document/d/1rLwTG3LiXmAVnodnl0yjB4a6idm_zt21jFutJeNiX14/edit), and one for [the tournament tracker](https://docs.google.com/spreadsheets/d/15mSKIDJ-Kh45pbUrwZ06DyPW7EcdG0dglga6R1CKTTM/edit?gid=0#gid=0).)*

Dice Football was a surprise, obsessive, breakout hit. As long as we kept our son fed with pens and exercise books, we could have all the showers we wanted. Dice Football was also a gateway into the world of dice-based simulation games, and over the following weeks I could barely keep up with my son's appetite for new games. His favourite was ["Dice US Federal Election,"](https://docs.google.com/spreadsheets/d/1k-lIiQhSuXffkIQcMNFxZdhkG7C3CZBnJ9fw70pjEkY/edit?gid=0#gid=0) where you roll dice to figure out which party wins each state, and when you're finished you borrow daddy's phone to add up the electoral college votes.

As the games kept coming, I ran out of interesting ways to generate sums with 6-sided dice. I bought some 20-siders, and these big boys kept things interesting for another week or two. But I started to chafe against the limits of any kind of simple polyhedra. I started to get ambitious.

I wanted to make games that used sums with arbitrarily customisable structure and difficulty. For example, instead of the simple `A+B = ?? (where 1<=A<=6 AND 1<=B<=6)` form of two 6-sided dice, I wanted sums like:

* `A*B + C*D = ??` (for example: `4*2 + 14*3 = ??`)
* And the addition portion crosses a 10 boundary
* And `A*B < 20` and `C*D < 50`
* And all variables are between 2 and 100

If the answer is even then it's a goal for Chelsea; if it's odd then it's a goal for Liverpool. Or whatever.

I couldn't build these sums using dice, and I certainly wasn't going to construct them by hand. I needed a way to generate an infinite stream of super-specific questions.

So I wrote one: `diceomatic`.

## `diceomatic`

`diceomatic` is a Python library for building highly-customisable, infinite dice games.

For example, to generate a stream of questions using the example constraints listed above, you write:

```python
from diceomatic import *

# Declare the variables
a, b, c, d, e = variables(["a", "b", "c", "d", "e"])
vs = [a, b, c, d, e]

# Declare the form of the equation
lhs = Add(Multiply(a, b), Multiply(c, d))
rhs = e

# Declare the constraints
constraints = [
	AdditionCrosses10Boundary(Multiply(a, b), Multiply(c, d)),
	IsLessThan(Multiply(a, b), Literal(20)),
	IsLessThan(Multiply(c, d), Literal(50)),
	Equal(lhs, rhs),
]
# Declare the domains over which to search for valid sums
domains = uniform_domains(vs, range(2, 100))

# Find variable bindings that form a valid equation
bindings = find_bindings(vs, domains, constraints, n_bindings=10)

# Print each set of bindings as an equation with a random value held out
for bnd in bindings:
	lhs_expr = expression_string(lhs, bnd, hold_out=e)
	rhs_expr = expression_string(rhs, bnd, hold_out=e)
	print(f"{lhs_expr} = {rhs_expr}")
```

This prints:

```
9 * 2 + 11 * 2 = __
4 * 2 + 10 * 4 = __
2 * 5 + 16 * 3 = __
6 * 2 + 5 * 6 = __
# ...and so on...
```

You can then save the sums as a PDF, print the PDF on a sheet of paper, and use it to power games of Extreme Dice Football.

## Advanced usage

You can do much more than print the questions though! You have programmatic access to them, which means you can do anything you want. You can put them on a website, or a game, or an app. Your code knows what the correct answer to each question is, so it can check whether the player's answer is correct. You can even automatically adjust the difficulty of the generated questions based on how the player does.

For example, I made a [Streamlit](https://streamlit.io) app for displaying sums and checking their answers, and I deployed it to Streamlit cloud. Now I can write a new game with new rules, program its format into into the app, hand my son an iPad, and have the iPad generate the equations of the form and difficulty needed to power the game.

![image](/images/sumchef/streamlit.png)

Truly a stream of infinite fun.

## Try it yourself

Install diceomatic using:

`pip install diceomatic`

See [the GitHub repo](https://github.com/robert/diceomatic) for docs and examples. PRs welcome!

## Links
* [diceomatic on GitHub](https://github.com/robert/diceomatic)
* [Dice US Federal Election](https://docs.google.com/spreadsheets/d/1k-lIiQhSuXffkIQcMNFxZdhkG7C3CZBnJ9fw70pjEkY/edit?gid=0#gid=0)
* [Dice Football](https://docs.google.com/document/d/1rLwTG3LiXmAVnodnl0yjB4a6idm_zt21jFutJeNiX14/edit)
* [Tournament tracker](https://docs.google.com/spreadsheets/d/15mSKIDJ-Kh45pbUrwZ06DyPW7EcdG0dglga6R1CKTTM/edit?gid=0#gid=0)