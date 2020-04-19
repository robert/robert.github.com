---
layout: post
title: "PFAB #13: When code is too clever to be clean"
tags:
  - Programming Projects for Advanced Beginners
  - PFAB
og_image: https://robertheaton.com/images/pfab-cover.png
redirect_from:
  - /pfab13
---
> This post is part of my "Programming Feedback for Advanced Beginners" series, which helps you make the leap from cobbling programs together to writing elegant, thoughtful code. [Subscribe now][subscribe] to receive PFAB in your inbox, every fortnight, entirely free.

I just finished reading Robert Martin's *Clean Code*, one of the better-selling programming books of all time. I agreed with the vast majority of its recommendations, but that's not interesting. If you want to hear about the parts that I agreed with then you might as well just read it yourself. In this post I'm going to quibble with both its overall tone and some of its specific recommendations.

I wished that Martin had talked more about why and when it can be correct to compromise on code cleanliness. It's one thing to know how to write good code given plenty of time and clear requirements. It's another to know what to do when the clock is ticking and you have no idea what tomorrow will bring. You should never call your variables `x` and `asdf` instead of `preTaxSubTotal` and `authorName` in order to save a few milliseconds of typing, but it can sometimes be right to skip over whole libraries of best practices in the name of speed or simplicity. Martin often feels like a clean dogmatist, fond of hifalutin words like "craftsmanship". But sometimes being a craftsman or an artisan or any other word that makes being a salaried employee sound cooler requires making tradeoffs.

Maybe Martin is sensibly leaving this aspect of programming as a story for another day. I'm sure that he has very nuanced opinions about technical debt and compromises, but this particular book is called *Clean Code*, not *Clean Enough For Now Code*. Maybe it's better to learn the infinite time best approach, and make concessions from there.

Philosophy aside, I also disagreed with some of the books specifics. Let's look at what I think is a clear example of trying to be too clever, on p128 of my paperback version. See who you agree with.

## Trying to be too clever

In a past life, Martin worked on an environment monitoring system. He doesn't go into detail about its specifics, but it seems to have been responsible for measuring and controlling the temperature of buildings. Martin quotes a code snippet from one of the system's *unit tests*; a piece of code that runs the main program and verifies using *assertions* that it works in the way that the programmer expects. Martin does not like the test's code:

```java
@Test
public void turnOnLoTempAlarmAtThreshold() throws Exception {
  hw.setTemp(WAY_TOO_COLD);
  controller.tic();
  assertTrue(hw.heaterState());
  assertTrue(hw.blowerState());
  assertFalse(hw.coolerState());
  assertFalse(hw.hiTempAlarm());
  assertTrue(hw.loTempAlarm());
}
```

Martin writes:

> Notice, as you read the test, that your eye needs to bounce back and forth between the name of the state being checked, and the *sense* of the state being checked. You see `heaterState`, and then your eyes glissade left to `assertTrue`. You see `coolerState` and your eyes must track left to `assertFalse`. This is tedious and unreliable. It makes the test hard to read.

I'm not offended by these problems in the same way that Martin is. On the other hand, I didn't have to work in the codebase, and I could certainly believe that after reading and debugging 30 other near-identical tests then the style could begin to grate. Either way, I think that the cure that Martin proposes is worse than the disease:

> I improved the reading of this test greatly by transforming it into [the following code]:

```java
@Test
public void turnOnLoTempAlarmAtThreshold() throws Exception {
  wayTooCold();
  assertEquals("HBchL", hw.getState())
}
```

He continues:

> [...] the thing to note is the strange string in the `assertEquals`. Upper case means "on", lower case means "off", and the letters are always in the following order: `{heater, blower, cooler, hi-temp-alarm, lo-temp-alarm}`. [...] Notice, once you know the meaning, your eyes glide across that string and you can quickly interpret the results. Reading the test becomes almost a pleasure.

This refactored version is much more compact than the original. But this terseness comes at the cost of converting all of those clear, explicit `assert` statements into a too-cryptic secret language. To the uninitiated, it is impossible to understand what this test is doing. Even the already-initiated don't have it much easier. Is `hiTemp` the first or second `h`? What does that `B` stand for again?

The situation gets worse if the system ever evolves. What if we add another property to the `state`, like `hiHumidity`? What if we remove one? Or rename it? Going through each `HBchL`-like string and removing, adding, or updating the exact right character will be a chore. Pretend that you're a new programmer making a small change to the system. You know roughly how it works, but don't have any deep experience working with it. You make your change, run the tests, and see:

```
turnOnLoTempAlarmAtThreshold FAILED

> assertEquals("HBchL", hw.getState())
Expected: HBchL
Actual:   hBcHL
```

Even if you were familiar with roughly what the error message is getting at, it would require a distressingly keen eye to quickly understand the specific problem at hand. Contrast this error message with one you might expect from the original version:

```
turnOnLoTempAlarmAtThreshold FAILED

> assertTrue(hw.heaterState());
Expected: True
Actual:   False
```

We expected the heater to be on, but it was off. We can immediately start work figuring out why.

## So what do you suggest, genius?

As I've already said, I'm not particularly offended by the original code. Without meaning to be snarky, in the real world I'd probably just leave it as it is and try to find something more important to work on. But if I was writing a book or a blog about clean code and wanted to spend as much time as necessary to make it as pleasant as possible, I'd represent the state of the environment more using a more *explicit* data structure than a string.

I'd like the state data structure to be *self-documenting*, meaning that a reader can immediately see what the state is by reading the code. This requirement instantly rules out something trivial like an array of booleans - I don't like `HBchL`, but `[true, true, false, false, true]` would be much worse.

Much more reasonable would be to represent the state using a `Map`, giving us something like the following:

```java
@Test
public void turnOnLoTempAlarmAtThreshold() throws Exception {
  wayTooCold();
  assertEquals(Map.of(
    "heater", true,
    "blower", true,
    "cooler". false,
    "hiTemp", false,
    "loTemp", true,
  ), hw.getState())
}
```

The eye jumping that bothered Martin in the original version is gone. We use more lines and characters than his refactored version, but I claim that we get more than enough extra clarity to justify our troubles. However, I'm bothered by the lack of pro-active defence against a typo in the map's keys. I'd like us to warn the programmer if they accidentally write `haeter` or `bowler` instead of `heater` or `blower`. At the moment if the programmer makes this type of blunder then the test will fail - which is good - but it might take them a second (or an afternoon if they didn't sleep well last night) to figure out why.

To guard against typos, I'd like to wrap the state of the environment in a simple class called something like `EnvironmentState`. This class will expose properties for `heater`, `blower`, and so on, and will give us a single, centralized place in which to validate that any state we construct is valid. I'd ideally like to use *named parameters* to guard against typos. Calling a function with named parameters means that you explicitly say which argument each parameter you pass should be assigned to, instead of relying on their order. Java doesn't support named parameters, but in Python we might write:

```python
state = EnvironmentState(
  heater=True,
  blower=True,
  cooler=False,
  hi_temp=False,
  lo_temp=True,
)
```

Compare this to the alternative:

```python
state = EnvironmentState(
  True,
  True,
  False,
  False,
  True,
)
```

The former is easier to read, and doesn't require us to remember the exact order of the parameters. If someone tries to pass in `haeter=True`, Python will say "there's no such argument as `haeter`". The programmer immediately knows exactly what has gone wrong.

Since Java does not support named parameters, we need to find another way of helping the programmer realize when they have made a typo. I see two main ways to do this, depending on whether we want to represent our state using a Map or an `EnvironmentState` class.

If we want to stick with a Map, we could wrap the call to `assertEquals` inside our own method called `assertStateEquals`. `assertStateEquals` begins by checking that the given Map only contains valid properties. If it finds any invalid properties (eg. `haeter`) it immediately throws an exception with a helpful error message. If it doesn't, it calls `assertEquals` on the states, as before. The code would look like this:

```java
@Test
public void turnOnLoTempAlarmAtThreshold() throws Exception {
  wayTooCold();
  assertStateEquals(Map.of(
    "heater", true,
    "blower", true,
    "cooler". false,
    "hiTemp", false,
    "loTemp", true,
  ), hw.getState())
}
```

Alternatively, if we wanted to go the route of an `EnvironmentState` class, we could add a method called something like `EnvironmentState.fromMap`. This method would take a Map, validate that it contains only valid keys, and use those keys to construct an `EnvironmentState` object. If `EnvironmentState.fromMap` found any invalid keys (like `bowler`), it would throw an exception. The code might look like this:

```java
@Test
public void turnOnLoTempAlarmAtThreshold() throws Exception {
  wayTooCold();
  assertEquals(EnvironmentState.fromMap(Map.of(
    "heater", true,
    "blower", true,
    "cooler". false,
    "hiTemp", false,
    "loTemp", true,
  )), hw.getState())
}
```

This approach is my favorite. The resulting code is easy to read and has well-placed guardrails to catch and guide programmers when they make mistakes. Everything about what it means to be a valid state is wrapped up inside the `EnvironmentState` class, giving us a single place to go when we want to understand or modify the system. It's easy to add new properties to the state (like `humidityOk`). It's even easy to change those properties to have value-types other than booleans (like `tempCelsius: 34.5`), although that wasn't part of the specification so it's perhaps unfair to count it as a benefit. On the other hand, my approach is more verbose and more boilerplate-heavy than Martin's. If you preferred his to mine then I would think you were wrong, but I wouldn't think you were crazy. What makes code clean can vary according to taste.

---

*Clean Code* is packed with good ideas and examples. I found the writing style a little domineering at times, and I don't think I'd want to be friends with the author. But that's fine - I'm looking for professional advice, not a new golfing buddy. I'd recommend the book to anyone.

[subscribe]: https://advancedbeginners.substack.com
