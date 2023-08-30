---
layout: post
title: "How to pass a coding interview with me"
tags: [Work]
og_image: https://robertheaton.com/images/interview-cover.png
---
In the last 10 years I've given more than 400 coding interviews. That's the equivalent of 2 working months just watching strangers having a crack at the same handful of programming challenges. Some of my would-be colleagues solve the problems without incident, but others run into trouble for similar, easily-correctable reasons. I wish I could give better feedback, but because of legal and time constraints that's not how the system works.

So instead of personalised advice, I've written this cheat sheet containing 22 tips about how to pass a programming challenge interview with me. The tips can't replace skill and practice, but they will help you calm your nerves, avoid silly mistakes, and showcase the best of your ability. Most of the tips are easy to implement, and put together they'll increase the number of interviews that you pass.

<img src="/images/interview.png" />

## Before the interview

### 1. If you do Google the question beforehand, delete your tracks afterwards

You might use Google to look up the questions that my company tends to ask before the interview. This does go against the spirit of the thing, but I'm not sure how much of a duty you have to uphold the integrity of my company's interview process. Plenty of people do it, and I imagine that it's usually very helpful. I do have to ding you if I notice that you've done it, though.

If you're doing the interview on the same computer you used to look up the question, make sure to close your tabs and delete your browser history before you start. I've interviewed several people who left a tab containing the leaked question open; interestingly they all did quite poorly.

### 2. Set up a basic program and make sure you can run it

If you're using your own laptop, set up a basic hello-world program and make sure you can run it. Write your solution in this file. This makes sure that you don't waste time at the start of the interview scrabbling around with a broken environment.

I've interviewed several people who used a laptop belonging to their current company, but then realised that it was so customised that they didn't know how to use it to write and run a basic program from scratch. They hacked around the problem by finding a simple part of their company's codebase and editing it to answer the question. This cost them time and stress, looked bad, and surely violated their employment contract.
## Introduction

### 3. Keep your personal intro short

It's usually not a technical interviewer's job to assess your experience and goals. I might start an interview by asking "My name is Rob, I work on this and that, what about you?" but this is just an icebreaker. Answer succinctly like "I'm Sarah, I work on the Infrastructure team at Badger corp. It's our job to make sure that our servers are reliable, secure, and easy to manage." I've had people go on for several minutes, which achieves nothing and wastes your time and energy.
### 4. Ask how much time you have to answer the question

Ask how long you have to answer the question so that you can manage your time accordingly. I should tell you this unprompted, but sometimes I forget and interviewees forget to ask.

## When you get the question

When you get the question I think it's useful having a repeatable script to check you understand what you're being asked to do, and to get all the extra metadata you need. I don't think this is particularly important, but it's easy to implement. I'd suggest:

- Restate the question, briefly
- Ask a clarifying question or two
- Ask how you're being assessed
- Sketch a solution that works for at least the base case

A few more details:
### 5. Restate the question, briefly

I'll either describe the question or send you a written version. Once you think you understand it, restate it briefly:

> "So the goal is to return all the triplets of numbers from the input list that add up to 0. Does that sound right?"

This allows the interviewer to correct you if you've got the wrong idea, and probably helps start to establish a mild rapport.

It's also possible that I only approve of rephrasing the question like this because it shows that you've read the same books saying that it's a good habit as I have.
### 6. Ask a clarifying question or two

Once you understand the problem, try to ask a clarifying question or two. This gives you an air of thoughtfulness and might even help you answer the question as well. Two off-the-shelf options are:

* "Can I assume that the input will be valid?"
* "What's the largest input size that we can expect?"
### 7. Ask how you're being assessed

The goal of any coding interview is to write good code at a decent pace, but the details can vary.
#### How far are you supposed to get?

Some interviews have multiple parts, and some deliberately have more parts than anyone could reasonably finish in the time allowed. Ask how far you're expected to get so that you can plan ahead.
#### Is the interviewer looking for efficient code, clean code, or both?

Some interviewers are looking for efficient code; some are looking for clean code. Most are probably looking for a bit of both. Ask them what they care about so that you can focus on the right things.
#### Should you write tests?

Simple unit tests will help you answer most questions (see below), but some interviewers might not want them, or some questions might not be easily testable (eg. those that use external dependencies like HTTP requests). You might as well clarify.
### 8. Sketch a solution that works for at least the base case

Start by drafting your program using prose or pseudocode. Don't start by writing actual code; even if you know that step 1 will be to read an input file, only read it once you know roughly what you're going to do afterwards.

This will probably help you get your own head in order, and will also allow a benevolent interviewer to correct any big misconceptions early, or at least know where they've come from. The more you say and do, the more partial credit an interviewer can give you if your code doesn't fully work.
## Debugging

### 9. Run your code frequently

Once you've started writing code, run it as frequently as you can. Some people start interviews by coding for 30 minutes, then execute their program for the first time with 15 minutes to go, then spend those 15 minutes drowning in bugs and faulty assumptions only now revealed. To avoid this, run your program often. Print the latest state and make sure it looks about right.

If you code for 40 minutes straight, then run your code once and it works first time, that's fine, you still pass. But running your code often gives you insurance when things go wrong. It makes it easier to give you partial credit for partial correctness, and probably helps you iterate and solve the problem faster too.
### 10.  Use hypotheses to debug

Your code won't actually work first time. When it fails, try to state specific hypotheses about why. Try saying things like:

> "My hypothesis is that I'm not filtering the list correctly. To check this I'm going to print the contents of the list after my filter, and in theory it should have 5 elements. Oh actually it does have 5 elements, so the filter can't be the problem here. In that case the problem must come after this line. The part of the code I'm least confident in is this bit, so I'm going to add some more print statements. Now..."

Hypotheses make your debugging methodical and easier to follow. They're useful in real life too, but it's harder to have good habits when no one's watching.
### 11. Common trivial mistakes

People often get derailed by the same trivial mistakes. Three of the most common ones:

* Forgetting to save files so that they keep running the old version of their code
* Trying to read an input file from the wrong location, often by getting relative paths wrong. If in doubt, use the full absolute path to the file (eg. `/Users/rob/interview/data/input.csv` instead of `../data/input.csv`). This is inelegant but forgivable and harder to mess up.
* Getting confused about whether a method mutates its input or returns a new output. Here's the difference:

```python
# ---- MUTATING ----

# CORRECT
# sort() sorts the list by mutating it in-place
inp1 = [3,7,1,8]
inp1.sort()
print(inp1)
# => [1,3,7,8]

# WRONG
# sort() doesn't return anything, so using its return value is pointless
inp2 = [3,7,1,8]
out2 = inp2.sort()
print(out2)
# => None

# ---- NON-MUTATING ----

# CORRECT
# sorted() sorts the list by returning a new list, so we have to use its
# return value
inp3 = [4,8,2,9]
out3 = sorted(inp3)
print(out3)
# => [2,4,8,9]

# WRONG
# sorted() doesn't mutate the input list, so using the same input variable
# will not do what you want
inp4 = [4,8,2,9]
sorted(inp4)
print(inp4)
# => [4,8,2,9]
```

### 12. Consider asking for help

This is a last resort, but if you're completely out of ideas then you can ask for help. I'll give you a nudge anyway once this looks like the only way forward, but if you already know you're stuck then you might as well say so now and save a minute or two.

Asking for help doesn't mean that you've failed unrecoverably. You might have done a good job of debugging. I might forget that it happened. You can use the time you saved to impress me elsewhere.

## Talking

### 13. Don't badmouth languages, libraries, or anything really

Some people blame their extremely popular tools when they make mistakes, presumably trying and failing to save face. They say "oh JavaScript, why do you have to do things like that?" or "that's just one of the many things I dislike about the Ruby standard libraries." It's possible that they're right, but they sound like a whiny buffoon.

### 14. Talk as much as you reasonably can

Describe what you're thinking and doing as much as possible. This helps me understand your work and to give you credit for your thought process, even when you make mistakes. If you solve the question perfectly without saying a word then you still pass, but running commentary gives you insurance in case things go wrong, and often helps you work better too.

## Writing the code

### 15. Don't define lots of functions or classes unless you're very certain it's a good idea

Functions, classes, and other forms of *abstraction* impose structure onto a program. If you've understood the true nature of the problem you're solving then abstraction can make your code terser, more readable, and more maintainable. But if you've misunderstood the problem then abstraction can impose the wrong structure, forcing the rest of your code to contort awkwardly around it.

If you're not absolutely certain that a block of code should be pulled into a method or class, leave it as it is with a `TODO` comment saying something like `TODO: probably extract this into a method`. This shows that you're thinking about structure and abstraction, without committing you to anything.

"Don't abstract too soon" is good advice for the real world, but it's particularly important in an interview. The costs of choosing an incorrect abstraction are higher than normal, since you don't have time to iterate. Even worse, you're more likely than normal to choose the wrong approach, since you've only been thinking about the problem for a few minutes.

Even worse than that, good programmers disagree about the right abstractions. Your useful logic boundary might be my unnecessary complexity. I might query your decisions during the interview, giving you a chance to explain them, but I might not. Even if I do, I might disagree with your justifications, and I might be completely wrong to do so. I started giving interviews to senior candidates after only 3 years of professional experience. I'm sure I roasted good engineers for bad reasons, and I'm sure I still do so today. If you avoid abstractions then you avoid disagreements where you can only ever lose, even if you're right. By contrast, it's hard to disagree with "I'd probably turn this into a function later once I'd finished the rest of the program."

Unfortunately abstraction feels fancy, and many interviewees can't resist looking clever. Too often they instead end up with a ball of overloaded mud which slows their progress, achieves nothing, and looks ugly. You should be quick to note where an abstraction might be appropriate, but slow to implement it.
### 16. Use `TODO`s

Start by getting your solution working for the base case, since this is probably the main thing you're being judged on. Most secondary problems you encounter along the way would be better solved later, including validation, error-handling, edge-cases, and cosmetic tidyups. Don't bother with them for now, and instead write comments describing the work still to be done, for example `TODO: don't hardcode this value`.

Once you've solved the base case you can sweep back through your `TODO`s. You can delete the ones that have become irrelevant, and polish off the ones that still apply. By this point you'll have 15 minutes extra understanding of the problem, and might make better decisions. If you don't have time to address them all then you've still shown that you know what should be done, netting you at least partial credit.

Some examples:

* `TODO: handle empty input`
* `TODO: validate that all numbers in list are positive`
* `TODO: better variable name`
* `TODO: factor out this logic with previous block`
* `TODO: handle exceptions`
* `TODO: tidyup`
* `TODO: don't hardcode this value`

## Testing

### 17. Write tests

Write basic tests to help you check your code. Your program should print something like `Pass,Pass,Pass` if the tests pass and `Pass,Pass,Fail` if one of them doesn't.

```
# Good

$ python3 interview_good.py
Pass
Pass
Fail - expected: [3,9,2], got: [3,9,3]
```

Don't print the return value of your program and verify it manually (eg. `[1,4,5]` followed by "oh yep that looks about right"). Eyeballing is easy to get wrong, especially when you have multiple test cases.

```
# Bad

$ python interview_bad.py
[1,4,5]
[2]
[3,9,3]
```
### 18. Don't use a testing framework unless you're required to, or you're very confident with it

Testing frameworks are good for producing maintainable, modular tests, but they require setup and configuration that can be easy to get wrong and time-consuming to get right.

In an interview all you need is a simple way to make sure your little program is behaving correctly. This can be easily accomplished with simple code like:

```python
actual1 = my_function([1,3,5])
expected1 = [2,4,6]
if actual1 == expected1:
    print("Pass")
else:
    print(f"Fail - expected: {expected1}, got: {actual1}")
```

You could package this up into a simple `assert_equal` method, but I wouldn't bother. A little repetition is fine. You can even say "in real life I'd use `pytest`" if you feel awkward about it.

If you truly are comfortable enough with a particular testing framework to use it in an interview then go ahead. Write an example test for your hello-world program from tip 2 and make sure you can run it ahead of time.
### 19. If a test passes, print `pass`

If you do use your own basic testing framework, print something showing when a test passes. If you instead continue silently, then if your program is correct it will run and exit without outputting anything. However, this could also happen if your program exits early for some erroneous reason. Does the following definitely mean your code works?

```
$ python3 interview_bad.py
$
```

Printing `pass` when a test passes means that you know your program ran properly. This output definitely means your code works:

```
$ python3 interview_good.py
Pass
Pass
Pass
$
```
### 20. If all your tests pass first time, try to make them fail

If all your tests pass first time, it's more likely that your testing setup is broken than you're a genius. Add a bug into your code and make sure that some tests fail. If they don't, something is wrong with your tests, as well as - probably - your code.

### 21. Don't do full TDD unless you actually find it helpful

TDD (test-driven development) is the practice of writing tests first, then writing code that passes these tests afterwards. Some swear by it; I find it laborious and unhelpful. In my experience, when someone attempts full TDD in an interview it usually takes a lot of extra time for little benefit. If you truly prefer to work this way then go for it, but don't do it to impress me.

If you haven't heard of TDD before then don't worry and don't learn about it, at least for this interview.
### 22. Keep your tests

Some people write a single test case and modify it when they want to check a different input. This means that they have no way to validate all of the other inputs that they've tried in one execution. This invites bugs and regressions, and makes it hard for either of us to tell if their program works for all cases or just the last one they checked.

Don't modify your test cases; write a new test for each input so that you can run them all at once.

------

This is how to pass an interview with me. Write clean code, save your energy for what matters, and put on a bit of a performance to make sure I notice your good parts. Other interviewers will have their own views. Different companies look for different things, and even different people within the same company look for different things, despite leadership's efforts to standardise on a consistent rubric.

But even though other people might have different priorities and interviews are half-charade, I still think that the tips in this post are universally good habits that will help you pass more of them. Good luck, and [let me know how you get on](/about)!

