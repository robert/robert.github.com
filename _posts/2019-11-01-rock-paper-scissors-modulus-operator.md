---
permalink: /2019/11/01/rock-paper-scissors-modulus-operator/index.html
title: Rock, Paper, Scissors, Modulus Operator
layout: post
tags: [Programming Projects for Advanced Beginners]
og_image: https://robertheaton.com/images/iot-cover.png
published: false
---
## The modulus operator: who won at Rock Paper Scissors?

How can we work out which player has won a round of Rock Paper Scissors, using only 4 lines of code?

Actually, let's back up to an entirely different but surprisingly relevant question: how can we check whether a number is odd or even?

If you said "use Ruby's `#even?` method":

```
2.even?
# => true
3.even?
# => false
```

then you are entirely correct, but also very boring and not at all helping with what I'm trying to do here. A more widely applicable method of checking whether a number is odd or even is by using the *modulus* operator, which calculates the remainder left over when you divide one number by another. For example, `10 modulo 3` is `1`, because we divide 10 by 3 and then return the remainder, which is 1.

The modulus operator exists in almost every language, and is often written using a `%` sign. Some more examples:

```
12 % 3 == 0
14 % 4 == 2
3 % 84 == 3
50 % 7 == 1
```

If a number `x` is exactly divisible by another number `y` then there will be no remainder left over, which means that `x % y == 0`. Since a number is even if it is exactly divisible by 2, we can check whether a number is odd or even by writing:

```
if x % 2 == 0:
    print("%d is even!" % x)
else:
    print("%d is odd!" % x)
```

If an `#even?` method (or similar) is available to you then you should absolutely use it, but it's fun to be familiar with alternative solutions too.

## Logging

The modulus operator is also useful when you are looping through an enormous list and want to print progress updates as you go. A basic, non-modulus-ed version of this might look something like:

```
n = 0
for value in my_list:
    process_value_or_whatever(value)
    n += 1
    print("Processed %d values" % n)
```

However, for truly enormous lists with tens of thousands of elements, printing a progress update for every single element is overwhelming and unnnecessary. You can scale back your output while still giving your user regular feedback by using the modulus operator to only print a status update once every (say) thousand elements:

```
n = 0
for value in my_list:
    process_value_or_whatever(value)
    n += 1
    if n % 1000 == 0:
      print("Processed %d values" % n)
```

The if-statement will trigger only when `n` is exactly divisible by 1000, and so this code will produce output that looks like:

```
Processed 1000 elements
Processed 2000 elements
Processed 3000 elements
Processed 4000 elements
# etc
```

## Rock, Paper, Scissors adjudication

As promised, let's finally use the modulus operator to adjudicate which player won a round of Rock, Paper, Scissors. The most direct, brute-force approach to this problem is to use a collosal pile of if-statements:

```
if player_1 == player_2:
    print("Draw!")
elif player_1 == SCISSORS && player_2 == ROCK:
    print("Player 2 wins!")
elif player_1 == SCISSORS && player_2 == PAPER:
    # etc etc etc...
```

This code has the advantage of being clear and explicit, but the disadvantage of being long, verbose, and easy to typo. Suppose that we instead assigned numbers to Rock, Paper, and Scissors:

```
ROCK = 0
PAPER = 1
SCISSORS = 2
```

We can then work out who has won using the following elegant, if slightly obtuse, code:

```
# Adjust these values accordingly
player_1 = ROCK
player_2 = SCISSORS

mod = (player_1 - player_2) % 3
if mod == 0: print("Draw!")
elif mod == 1: print("Player 1 wins!")
elif mod == 2: print("Player 2 wins!")
```

Go through these 4 lines very slowly and think about what they're doing and why they work.

## Advanced addendum: getting `#even?`

Ruby's `#even?` method tried to ruin my fun at the start of this post. But even `#even?` has to calculate its answer somewhere. Programming languages are programs too (we'll talk about that another day). This means we can look in the source code of the Ruby *interpreter* itself, which is written in C, and find [the code that defines `#even?`](https://apidock.com/ruby/v2_6_3/Integer/even%3F).

Give the following snippet a quick glance, but don't spend too much time on it. You'll almost certainly never have to look inside a programming language in real life; this is just an educational exercise to show that it is possible:

```
static VALUE
int_even_p(VALUE num)
{
    if (FIXNUM_P(num)) {
        if ((num & 2) == 0) {
            return Qtrue;
        }
    }
    else if (RB_TYPE_P(num, T_BIGNUM)) {
        return rb_big_even_p(num);
    }
    else if (rb_funcall(num, '%', 1, INT2FIX(2)) == INT2FIX(0)) {
        return Qtrue;
    }
    return Qfalse;
}
```

We don't need to understand any of the details of this code in order to recognize some familiar faces. Look at the third branch of the if-statement, which reads `else if rb_funcall(num, '%', 1, INT2FIX(2)) == INT2FIX(0)`. If you squint hard enough, you may be able to convince yourself that this is Ruby calling `num % 2 == 0` itself, under the hood.

The first branch is interesting too. This branch says that if `num` is a standard Ruby `Integer` (`if (FIXNUM_P(num))`), then the code checks for its even-ness using the *bitwise-and* operator (signified by that `&`). Bitwise-and is slightly faster than modulus at checking for even-ness, but it can't help us with our progress printing and Rock, Paper, Scissors refereeing in the same way that modulus can. Looking up *bitwise-and* on Wikipedia is left as an entirely optional exercise for the interested reader.

## This week's project ideas

### Small: write your own modulus

Pretend that the modulus operator didn't exist. You can still manually calculate `a % n` by repeatedly subtracting `n` from `a` as many times as possible until you reach 0, and then returning whatever is left over (for negative numbers you'll need to repeatedly *add* `a` to `n` instead - see below).

Your challenge is to write a function called `modulus` that takes two integer arguments called `a` and `n`, manually calculates `a % n`, and returns the result.

Test your function on positive numbers:

```
modulus(12, 3) # should == 0
modulus(14, 4) # should == 2
modulus(3, 84) # should == 3
modulus(50, 7) # should == 1
```

Research how and why the modulus operator works for negative numbers, and test your function with them:

```
modulus(10, 3) # should == 1
modulus(10, -2) # should == 2
```

### Big: Write a full command-line game of Rock, Paper, Scissors (plus Spock, Lizard)

Write a program that uses the modulus operator to work out who has won at Rock, Paper, Scissors, as in the example code above. Then adapt it to work out who has won at the expanded game of "[Rock, Paper, Scissors, Spock, Lizard](http://www.samkass.com/theories/RPSSL.htm)".

Work in small, incremental milestones:

* Start by hardcoding in variables for `player_1` and `player_2`, like in my example code above. Print out which player wins
* Then make your program interactive - have each player use 3 keys at opposite ends of the keyboard to input their choices. Google `$YOUR_LANGUAGE get password input` to find out how to hide players' input from each other. Either have each player press `Enter` after submitting their input, or have them both submit their input before pressing `Enter` once to submit them both
* At the start of your program, ask how many points your players would like to play to. Keep looping until one player has enough points to win
# Adapt your RPS code to work with [RPSSL](http://www.samkass.com/theories/RPSSL.htm)
* At the start of your program, ask whether your players would like to play RPS or RPSSL, and select the game logic accordingly

### Whatever you do

Email me your code, questions, ideas, hopes, bank account details, dreams. I read and respond to everything people send me.
