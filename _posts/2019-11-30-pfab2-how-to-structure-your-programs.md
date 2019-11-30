---
title: "PFAB#2: How to structure your programs"
layout: post
tags: [Programming Projects for Advanced Beginners]
og_image: https://robertheaton.com/images/pfab-cover.png
redirect_from:
  - /pfab2
---
> Welcome to week 2 of Programming Feedback for Advanced Beginners. In this series I review a program [sent to me by one of my readers][feedback]. I analyze their code, highlight the things that I like, and discuss the things that I think could be better. Most of all, I suggest small and big changes that the author could make in order to bring their program up to a professional standard.
>
> (To receive all future PFABs as soon as they’re published, [subscribe by email][subscribe] or [follow me on Twitter][twitter]. For the chance to have your code analyzed and featured in future a PFAB, [go here][feedback])

[Last week][pfab1] we began studying [Tiffany Tiffleberry's Tic-Tac-Toe program][original-code]. We saw how to make the interface between the different pieces of Tiffany's program more consistent and intuitive by requiring all of its components to use the *0-2-form* of Tic-Tac-Toe co-ordinates. This week we're going to zoom out and discuss the program's overall structure. We'll see how we can break the program up into discrete pieces and define strict, tidy ways for these pieces to communicate with each other. Most importantly, we'll talk about why doing this is a good idea.

## The current state of affairs

Almost all of the logic in Tiffany's program ([read her code on GitHub][original-code]) currently hangs off of a single class called `Board`. Most of the individual functions in the class are perfectly sensibly written, but they're all heaped together in a single big ol' pile of logic spaghetti.

This means that the `Board` class is responsible for a lot of functionality that would never be part of a real-life `Board`'s job. A real Tic-Tac-Toe board, either drawn on paper or built unnecessarily lovingly out of wood, would not be responsible for asking players which moves they wanted to make. Neither would it be responsible for checking to see whether the game is over and for deciding who has won. Instead, it would be responsible for one thing and one thing only: keeping track of which pieces are in which squares.

The lack of structure in the current version of the program make it more challenging to understand and work with. This problem will only get worse as we add more features and functionality. Let's see how we can introduce some order. By the end of this post you'll have the blueprints for a beautifully designed game of Tic-Tac-Toe; try using them to complete [Programming Projects for Advanced Beginners #3: Tic-Tac-Toe AI][ttt] and [let me know how you get on][feedback]

## A different approach

We're going to see how we can break up the responsibilities of a Tic-Tac-Toe game into several components, and how we can wrap each component inside a class. These components will be:

1. `Board` - storing the game state, keeping track of the Xs and the Os
2. `GameManager` - managing the game, updating the game state, checking to see if anyone has won
3. `Player` - receiving input from the player, or coming up with AI-generated moves

None of these components should care about any of the internal details of any of the others. Instead, each component should present a clean *interface*, which should be the _only_ way that the rest of the program can communicate with it. For example, the `Board` class should present an interface with 2 methods:

* `update` - a method that allows the rest of the program to add a new move to the board. You give me a co-ordinate and a piece, and I'll update the board to place that piece in that co-ordinate
* `get` - a second method that allows the rest of the program to retrieve the piece currently in a particular square. You give me a co-ordinate, and I'll give you back the piece (if any) currently in that co-ordinate

In a pseudo-code skeleton:

```python
class Board:

    def __init__(dimensions):
        """
        Initializes a board that is `dimensions`
        in size.
        """

    def update(co_ords, piece):
        """
        Updates the game state to add `piece` at
        `co_ords`.
        """

    def get(co_ords):
        """
        Returns the current piece at `co_ords`.
        """
```

Here's a *dependency diagram* of our proposed program. It shows how the different components depend on each other in order to do their jobs. An arrow from component A to component B means that A calls B via the method(s) that the arrow is labeled with:

```
main--+
      |GameManager.play
+-----v-----+
|           |
|GameManager+------------------+
|           |                  |
+--+--------+                  |
   |            Player.get_move|
   |Board.get                  |
   |Board.update               |
   v                           v
+--+--------+              +---+--+
|           |   Board.get  |      |
|   Board   +<-------------+Player|
|           |              |      |
+-----------+              +------+
```

This diagram illustrates several interesting properties of our program. For one, the `Board` component doesn't have any arrows coming out of it. This means that it doesn't depend on any other components of our program, and so doesn't need to care about anything that the rest of the program does. This type of isolation can be very powerful. It makes our program easier to reason about than a big pile o' logic spaghetti that may or may not depend on itself in unexpected and undocumented ways. It allows us to change how a component (in this case `Board`) works without having to change other components at the same time. We can mess with `Player` or `GameManager` as much as we want, and we know that we won't have to change anything about `Board` because `Board` doesn't depend on them and doesn't care what they do or how. Similarly, `Player` doesn't care about `GameManager`, and whilst `GameManager` cares about `Board` and `Player`, it only needs to communicate with them through a total of 3 methods.

Let's look at each of 3 our components and their interfaces in more detail.

## More on `Board`

Our `Board` class doesn't know anything about the rules of Tic-Tac-Toe, because that's not its job. `Board` is very *generic* - in theory it could be used as the board for any other game played by adding pieces to squares on a board of a fixed size. It's unlikely that we will ever actually reuse `Board` for another game in this way, but the fact that it's feasible to do so is a good indicator that we've separated out the functionality of our program effectively.

`Board` can contain as many helper methods as it likes in order to help it keep track of the game state (eg. `square_is_empty`), but these are all internal *implementation details* that the rest of the program should neither know nor care about.

## `GameManager`

Since the `Board` class doesn't know anything about the rules of Tic-Tac-Toe, we need a separate component to house all the game logic. I've chosen to define a `GameManager` that acts as the game's referee. It keeps track of whose turn it is, makes sure that everything that the `Player`s try to do is legal, and ends the game when it deems one `Player` to have won.

As we can see from our dependency diagram, it also uses `Player`'s `get_move` function (more on which shortly) to ask the `Player`'s which moves they want to make. `GameManager` knows everything about the rules of Tic-Tac-Toe, but nothing about how to come up with good moves. `GameManager` is like a baseball umpire who knows everything about the dropped third strike and infield fly rules, but couldn't pitch even the slowest slider if their life depended on it.

Here's a pseudo-code skeleton for `GameManager`:

```python
class GameManager:

    def __init__(player_o, player_x):
        """
        Initializes a game between `player_o` and
        `player_x` (see `Player` class below for what
        these variables represent)
        """

    def play():
        """
        Plays out the game between `player_o` and
        `player_x` until it is over. May call many other
        functions on the GameManager class (like
        `is_legal_move` or `get_winner`) in order
        to implement all the logic of Tic-Tac-Toe.
        """
        # Make a new board
        board = Board((3,3))
        while True:
            # Work out cur_player and cur_side (O or X)
            # (need to define these methods elsewhere).
            # We could also attach the player's side to
            # the Player instead of tracking it here.
            cur_player = get_cur_player()
            cur_side = get_cur_side()

            # Use Player.get_move to ask the current
            # player for a move
            move = cur_player.get_move(board, cur_side)

            # Check move is legal, probably using Board.get
            if not is_legal_move(move):
                raise Exception("Invalid move!")

            # Use Board.update to update the Board
            board.update(move, cur_side)

            # Check if any player has won
            winner = get_winner()
            if winner is not None:
                print("Winner is %s" % winner")
                return
```

In exactly the same way as `Board`, `GameManager` can contain helper methods (like `is_valid_move` or `winning_player`) that help it run a successful game of Tic-Tac-Toe, but it keeps these hidden from the rest of the program.

## `Player`

`Player` is the third and final component in our game. It is responsible for producing moves, using either AI logic or a UI human. Its interface is a single method:

* `get_move(board, side)` - you give me a `Board` and tell me which side I'm playing, and I'll give you back the co-ordinates of the move I would like to play

The rest of the program doesn't have to care about how `get_move` chooses its move, so long as it accepts a board and a side and returns a pair of co-ordinates:

```python
class Player:

    def get_move(board, side):
        """
        Uses `board` and `side` to choose a next move in
        any way that it wants to. This could mean
        doing AI logic, or asking a human through the command
        line.

        Returns the chosen move as (x, y) co-ordinates.
        """
```

We can write multiple different classes that all "conform to the `Player` interface" (i.e. have a `get_move` method with the correct arguments and return value). For example, an AI `Player` class might look something like:

```python
class AIPlayer:

    def get_move(board, side):
        if board.get((0, 0)) == side:
            # etc...
        # <lots more code goes here>
        return chosen_co_ords
```

A human `Player` class might look something like:

```python
class HumanPlayer:

    def get_move(board, side):
        print(board)
        inp = input("You are %s. Where do you want to play?" % side)
        x, y = parse_input(inp)
        return (x, y)
```

Both of these classes have a function called `get_move` that takes arguments of `board` and `side`, and returns a co-ordinate. This is all the rest of the program cares about. This symmetry allows us to swap out humans, AIs, and other AIs without changing any of the rest of our code. (advanced note: *typed* languages like Java or C# will require you to explicitly state that `AIPlayer` is a *sub-class* of `Player` before it will allow to pass it in to a method that expects a `Player` object. *Dynamic* languages like Python or Ruby will allow you to pass any object into any method, but will throw an exception if they try to call `get_move` on an object that doesn't have a `get_move` method)

## Conclusion - try it yourself

We've seen how to break down a Tic-Tac-Toe program into several discrete components, and discussed why doing so is such a good idea. Try this type of analysis on the next program you write. What are the different jobs that your program needs to do? Can you split them out into different components? What's the simplest and most elegant way you can think of for these components to communicate with each other?

Furthermore:

* Using the tips in this post to complete [Programming Projects for Advanced Beginners #3: Tic-Tac-Toe AI][ttt], and [let me know how you get on][feedback].
* If you haven't already, sign up to the [PFAB newsletter][subscribe] to receive PFABs directly in your inbox, every weekend
* Follow me on [Twitter][twitter]
* Take a look through the archives: [Code review without your glasses](https://robertheaton.com/2014/06/20/code-review-without-your-eyes/)

## Advanced and entirely optional appendix

Instead of creating a new class for every type of player, we could instead create a generic `Player` class. This generic class would have an initializer accepts a `get_move_function`, and a `get_move` function that simply delegates to the `get_move_function` that it was initialized with. This approach would have the significant advantage of saving us from writing multiple `Player` classes, and would look something like this:

```python
class Player:

    def __init__(get_move_function):
        self.get_move_function = get_move_function

    def get_move(board, side):
        return self.get_move_function(board, side)

def get_move_human(board, side)
    print(board)
    inp = input("You are %s. Where do you want to play?" % side)
    x, y = parse_input(inp)
    return (x, y)

player = Player(get_move_human)
```

Note that passing around functions as arguments in this way is quite an advanced maneuver, and your programming language of choice might have varying levels of support for doing so. Google "first-class functions" for more details on this useful technique.

[ttt]: https://robertheaton.com/2018/10/09/programming-projects-for-advanced-beginners-3-a/
[feedback]: https://robertheaton.com/feedback
[twitter]: https://twitter.com/robjheaton
[subscribe]: https://advancedbeginners.substack.com/
[original-code]: https://github.com/robert/programming-feedback-for-advanced-beginners/blob/master/editions/1-2-tic-tac-toe/original.py
[pfab1]: https://robertheaton.com/pfab1
