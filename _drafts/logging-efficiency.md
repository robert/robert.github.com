I was writing an emulator for the Nintendo Gameboy. An emulator is a program that TODO.

I'd never written an emulator for anything before and was finding it difficult. In particular, my program was incredibly slow. I had got it to display the startup "Nintendo" logo that made me think I was about to play Pokemon, but it was chugging down the screen very slowly.

[PIC]

To work out why my program was so slow, I used a tool called `perf`. The details of how `perf` works don't matter to us today, but in short it shows you which of your functions your program is spending most of its time in.

The `perf` output showed that my program was spending most of its time in some debug functions I had written to print the internal state of the Gameboy after every CPU operation. This was surprising to me because I didn't think I was using these functions. I had a "debug mode" flag that I had set to `False`, and if the flag was `False` then my program didn't print any debug output. So why was my program spending so much time inside these functions?

I looked at my code more closely and realized what the problem was:

```python
DEBUG_MODE = False

def log(output):
    """
    If `DEBUG_MODE` is `True` then prints `output`.
    
    If `DEBUG_MODE` is `False` then does nothing.
    """
    if DEBUG_MODE:
        print(output)

def dump_gameboy_state(gameboy):
    """
    Formats the internal state of `gameboy` in a human-readable form that
    is suitable for logging to the terminal.

    This function does a lot of work and so takes a long time to execute.
    """
    output = ""
    for register in gameboy.registers:
        # Do lots of work that takes a long time...
        # ...
        # ...

    return output

def run():
    """
    Initialize and run a Gameboy.
    """
    # Initialize a `Gameboy` object (the `Gameboy` class is defined elsewhere and
    # its internal details don't matter)
    gameboy = Gameboy()

    # Run the Gameboy in an infinite loop.
    while True:
        # Execute a single Gameboy loop - read user input, update the screen, etc.
        # (methods defined elsewhere)
        read_user_input()
        update_screen()
        # ...etc...

        # At the end of the loop, use `log` to print the state of `gameboy`. Note
        # that `log` will only actually print anything if `DEBUG_MODE` is set to
        # `True`.
        log(dump_gameboy_state(gameboy))

run()
```

The problem is that even though the `log` method isn't logging the output of `dump_gameboy_state` because `DEBUG_MODE` is set to `False`, we're still doing all the work to evaluate `dump_gameboy_state(gameboy)` so that we can pass the result into the `log` method. The output is never actually used by `log` or any other part of the program, but the program doesn't know this and so still evaluates it.

This means that on every pass through the `while True` loop, the program was executing the time-consuming `dump_gameboy_state` function. This was why my program was running so slowly.

To speed it up, I needed to prevent it from executing `dump_gameboy_state` unless the output was actually going to be logged. I could see two main solutions.

First, I could move the `if DEBUG_MODE` statement out of `log`:

```python
if DEBUG_MODE:
    log(dump_gameboy_state(gameboy))
```

Now if `DEBUG_MODE` is `False`, the program skips over `dump_gameboy_state` entirely. This is a simple and effective solution, but there are many other places that I want to use this kind of debug-logging logic, and it's a shame to have to wrap every line in `if DEBUG_MODE`. What if I want to change the way that debug mode works to have different debug levels?

Alternatively, I could make `dump_gameboy_state` lazily evaluated. This means adapting the `log` function so that the print output is only evaluated if `DEBUG_MODE` is `True` and its actually going to be needed.

To do this I would need to adapt my `log` method so that it accepts a function that returns a string, rather than a plain string. If `DEBUG_MODE` is `True` then `log` executes the function and prints the output so that it can print it. If `DEBUG_MODE` is `False` then `log` does nothing, skipping executing the function.

Here's what this might look like:

```python
def log(output_f):
    """
    `output_f` is a *function* that returns a string when called, not
    an actual string.
    """
    if DEBUG_MODE:
        print(output_f())

# ...<snip>...

# ## OPTION 1 ##

def dump():
    return dump_gameboy_state(gameboy)

# Note that we pass in `dump` without the `()`. This
# means that we don't actually call the function. `dump`
# on its own refers to the function `dump`,
# not the result of calling `dump`. This is what allows
# us to later call this function inside `log`.
log(dump)

# ## OPTION 2 ##

# An alternative shorthand using Python's `lambda` syntax.
# `lambda: dump_gameboy_state(gameboy)` means the same thing
# as the `def dump()` block above.
log(lambda: dump_gameboy_state(gameboy))
```

It's a little annoying having to use the `lambda` syntax for a simple log-line that doesn't warrant this kind of optimization, so I could write 2 log functions: one for when I want to print a short, simple string, and one for when I want to print the output of a lazily-executed function:

```python
def log(output):
    if DEBUG_MODE:
        print(output)

def log_f(output_f):
    if DEBUG_MODE:
        print(output_f())

# Log a simple string that doesn't require optimization
log("CPU cycle: " + cpu_cycle_n)

# Log the output of a complex function that I don't want
# to have to execute if `DEBUG_MODE` is `False`.
log_f(lambda: dump_gameboy_state(gameboy))
```

The general term for this kind of approach is lazy evaluation. Our example isn't strictly lazy by the formal Computer Science definition because XYZ, but it achieves the same goal.

### Laziness and `range`

Python uses lazy principles in other places too, and sometimes makes changes to introduce them. For example, take the `range` function. This is used to iterate over a sequence of numbers:

```python
for i in range(100):
    # TODO: good example of why you would do this in real life
```

In Python2, `range(100)` returned a list of all the integers from `0` to `100`:

```python
>>> range(100)
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, <...etc...>]
```

The problem is that this list takes time and space in memory to construct. For 100 integers this isn't a problem, but for larger numbers it can be.

However, in normal `for i in range(100)`-style usage, we never need all of the numbers at the same time. We only need to know the value of the number that we are currently processing. Instantiating a full list of all the numbers is therefore a waste, because we throw it away as soon as the loop is complete.

Because of this, in Python3 `range` was changed to instead return a special `Range` object. This object behaved identically to a list when used in a `for i in range(100)` statement, but made some internal optimizations. When used in a loop it returns each number in sequence, just like the full list, and it can even generate numbers on the fly when accessed directly using `[]`:

```python3
>>> range(100)[25]
25
```

Python2 actually had this capability already in a function called `xrange`, but Python3 got rid of the non-lazy (or eager) version entirely and made the zippier, lazy version the default.

### Other programming languages

Some programming languages are highly focussed on laziness. For example, the Scala language allows you to specify that the arguments to a function should not be evaluated when the function is called, and should only be evaluated inside the function if and when their outputs are actually needed. If their output are never needed (for example, because the function evaluation goes down a particular set of if-branches), the arguments are never evaluated, saving execution time.

```scala
TODO
```




Was writing a gameboy emulator
An emulator is...
Never done anything like this before, finding it pretty tough
Also you start to have to think a bit more about speed and efficiency
My program was incredibly slow

I ran perf on my program
Doesn't matter how it works, but it shows you where your program is spending all its time

Showed that it was spending all its time on string formatting and logging
This was surprising because I wasn't doing very much logging

I had a "debug" mode that logged the state of the emulator after every CPU cycle, but I almost always had that turned off
I looked at the code and saw what it was


TODO: when I looked at this my eyes instantly started to glaze over. Can I introduce this more gently?
Maybe it's the `class` that makes it look so intimidating
```python
class Logger:

    def __init__(self, debug_mode):
        self.debug_mode = debug_mode

    def log(self, output):
        if self.debug_mode:
            print(output)

class Gameboy:

    def dump_state(self):
        """
        This takes a long time.
        """
        return "..."

# Initialize the logger and gameboy
logger = Logger(debug_mode=False)
gameboy = Gameboy()

# Run the gameboy CPU loop forever
while True:
    # Run a gameboy CPU loop...

    # At the end, use `logger.log` to print the state of the gameboy, although
    # `logger.log` will only actually print anything if we initialised
    # the `logger` with `debug_mode=True`.
    logger.log(gameboy.dump_state())
```



Problem is that even if we don't print anything, dump_state still gets evaluated which means that we still do all the wasted computation

Simple solution - use if statement around the log method
Reasonable, but I also used log elsehwere and it's nice having a single switch

Simplest solution probably to pass in a function that gets evaluated
Python has lambda functions, other languages have similar things

Probably I'm just printing too much, even for debug mode, and should use an `if %`

General name for this is "laziness"
Delay doing work until it's actually needed
Can save work if value is never needed - this example, find another one
Can save space if we will never need all the values in a sequence at once - `range`, ideally another one

Opposite is eager

Some languages make it really easy to be lazy with function arguments eg. Scala
Haskell is ultra-lazy by default

Even Python is lazy in many situations
map, generators
What are some good, realish examples for these?