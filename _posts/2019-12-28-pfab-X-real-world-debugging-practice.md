---
title: "PFAB#5: Real-world debugging practice"
layout: post
tags: [Programming Projects for Advanced Beginners]
og_image: https://robertheaton.com/images/pfab-cover.png
redirect_from:
  - /pfabX
published: false
---
Only half of programming is about writing code. The other half is about figuring out why the code you've written doesn't god damn work.

This post contains 3 excerpts from real-world programs that my readers have sent me, asking for assistance figuring out why their code isn't working. Your task is to find the responsible bugs and fix them. These bugsquashes are great practice for thinking methodically, and understanding code that you didn't originally write. You don't need to do any setup in order to tackle them, and you can run the code directly in your browser.

First, here's a step-by-step, whirlwind guide to what I like to call "scientific debugging":

## A very short guide to scientific debugging

For me, *un*-scientific debugging typically means alternating between:

* Sitting perfectly still, staring at my screen and waiting for divine inspriation to strike
* Flailing around trying semi-random changes that are very rarely actually summoned from the heavens

By constrast, scientific debugging means forming explicit hypotheses about what is wrong my code (which may themselves very well be wrong), then systematically trying to prove or disprove them, and then repeating this process, taking me inexorably closer and closer to a cure.

Here's how you can debug scientifically too:

1. Start by writing a short snippet of test code that precisely verifies whether your code is behaving correctly or not. This makes it easy to test your bugfixes (in the example bugs below I've added some test snippets for you).
2. If possible, form a hypothesis for what you *think* might be the problem ("I wonder if I'm forgetting to subtract 1 from the length of my array"). If you're feeling especially rigorous, write this hypothesis down and take notes throughout this entire process.
3. If you *are* able to form a hypothesis, work out how to prove or disprove it. For example "if this hypothesis is correct then the code should work for inputs below 0, but break for those above 0" or "if I add a print statement *here* then this variable should be `None`".
4. If you are able to prove that your hypothesis is correct, use this new knowledge to fix your code. Re-run your test case from step 1. If it passes, verify that your code works for other test cases too. This ensures that you haven't introduced new bugs or missed some even subtler edge-cases.
5. On the other hand, if your investigations instead *dis*-prove your hypothesis, this is still great progress. Now you understand your code better and know something that *isn't* wrong. Try to use your new knowledge to form a new hypothesis. Loop this process forever until you find the answer or give up and ask a friend.

If at any point you aren't able to come up with a new hypothesis ("what do you think is wrong?" "I literally have no idea"), add print-statements all over your code in order to better understand what is going on inside it. Form micro-hypotheses about how you think the internals of your code are working ("I believe that at this point in the code `first_name` should be `Robert`). Prove or disprove these hypotheses ("huh, it's actually `obert`"). Use this new knowledge to form hypotheses about the larger problems you are seeing ("ohhh I bet I'm accidentally chopping off the first character of every input, which would explain why I can't find my users in my database"). Prove or disprove them and repeat as above.

We'll talk in much more detail about scientific debugging in future PFABs, including examples and common patterns. But for now, here are today's bugs.

## The bugs

The bugs are written in Python, but the concepts in them are entirely generic. The bugs are all logic mistakes that you could easily accidentally write in almost any language. You don't need to anything about esoteric Python syntax in order to tackle the bugs, other that in order to print the variable `x` to the terminal you write `print(x)`.

### 1. Blank board

*View, run, and edit this code in your browser [here][repl1]*.

```python
def blank_board(width, height):
    """
    This function should return a "2-D array" that
    we can use to represent a 2-D board for a game
    like Tic-Tac-Toe or Battleships. For more on
    using 2-D arrays, see:

    * https://robertheaton.com/2018/06/12/programming-projects-for-advanced-beginners-ascii-art/
    * https://robertheaton.com/2018/07/20/project-2-game-of-life/
    * https://robertheaton.com/2018/10/09/programming-projects-for-advanced-beginners-3-a/
    """
    board = []
    row = []
    for _ in range(height):
        for _ in range(width):
            row.append(None)
        board.append(row)
        return board

if __name__ == "__main__":
    test_board = blank_board(4, 3)

    expected_board = [
        [None, None, None, None],
        [None, None, None, None],
        [None, None, None, None],
    ]
    # TODO: it looks like there's a bug with our
    # blank-board generating function! We should figure out
    # what it is and fix it so that this test passes.
    if test_board == expected_board:
        print("TEST PASSED!!")
    else:
        print("TEST FAILED!!")
```

### 2. Search Results

*View, run, and edit this code in your browser [here][repl2]*.

```python
def search(query):
    """
    This function is a "fake" search engine that
    we use to make this bugsquashing exercise
    more concise. In the original program it
    queried an internet search engine.

    This function returns "fake" search results
    by appending "-0", "-1", and "-2" to the given
    query. For example, the query "banana" will return:

    ["banana-0", "banana-1", "banana-2"]

    Note that using "fake" functions to simplify
    programs while testing or debugging is not
    cheating - it is a very common and sensible
    technique!
    """
    results = []
    for i in range(3):
        results.append(query + "-" + str(i))
    return results

def search_all(queries):
    all_results = []
    for q in queries:
        results = search(q)
        all_results.append(results)
    return all_results

if __name__ == "__main__":
    test_queries = ["cat", "dog", "mouse"]
    test_results = search_all(test_queries)

    expected_results = [
        "cat-0",
        "cat-1",
        "cat-2",
        "dog-0",
        "dog-1",
        "dog-2",
        "mouse-0",
        "mouse-1",
        "mouse-2",
    ]
    # TODO: it looks like there's a bug with our
    # searching function! We should figure out
    # what it is and fix it so that this test passes.
    if test_results == expected_results:
        print("TEST PASSED!!")
    else:
        print("TEST FAILED!!")
```

### 3. Power Battles

*View, run, and edit this code in your browser [here][repl3]*.

```python
EXTRA_POWER_NEEDED_TO_DEFEAT_ENEMY = 5

def player_has_enough_power_to_defeat_enemy(player_stats, enemy_stats):
    # Subtract the enemy power from the player power and make sure that
    # the difference is more than 5.
    player_stats['power'] = player_stats['power'] - enemy_stats['power']

    if player_stats['power'] > EXTRA_POWER_NEEDED_TO_DEFEAT_ENEMY:
        return True
    else:
        return False

if __name__ == "__main__":
    # In our game, the player defeats an enemy if they have more than
    # 5 greater power than the enemy.
    player_stats = {
        'name': 'Horatio',
        'power': 35,
    }

    enemy1_stats = {
        'name': 'Death Face',
        'power': 27,
    }
    enemy2_stats = {
        'name': 'Brain Eater',
        'power': 20,
    }

    # TODO: since our player has more than 5 extra power than both
    # Death Face and Brain Eater, we expect them to defeat
    # both enemies. However, this is not happening! We should figure
    # out what the bug is and fix it.
    if player_has_enough_power_to_defeat_enemy(player_stats, enemy1_stats):
        print("Player DEFEATS Enemy 1!")
    else:
        print("Player LOSES to Enemy 1!")
        exit(0)

    if player_has_enough_power_to_defeat_enemy(player_stats, enemy2_stats):
        print("Player DEFEATS Enemy 2!")
    else:
        print("Player LOSES to Enemy 2!")
        exit(0)
```

[repl1]: https://repl.it/@RobertHeaton1/Bug1-Blank-Board
[repl2]: https://repl.it/@RobertHeaton1/Bug2-Search-Results
[repl3]: https://repl.it/@RobertHeaton1/Bug3-Power-Battles
