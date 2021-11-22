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



```python
class Logger:

    def __init__(self, debug_mode):
        self.debug_mode = debug_mode

    def verbose_log(self, output):
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

    # At the end, use `verbose_log` to print the state of the gameboy, although
    # `verbose_log` will only actually print anything if we initialised
    # the `logger` with `debug_mode=True`.
    logger.verbose_log(gameboy.dump_state())
```

Problem is that even if we don't print anything, dump_state still gets evaluated which means that we still do all the wasted computation

Simple solution - use if statement around the log method
Reasonable, but I also used verbose_log elsehwere and it's nice having a single switch

Simplest solution probably to pass in a function that gets evaluated
Python has lambda functions, other languages have similar things

General name for this is "laziness"
Delay doing work until it's actually needed
Can save both time and space
When done well the programmer rarely needs to care that a value is lazy. They just write their code and benefit from the laziness for free

Some languages make it really easy to be lazy with function arguments eg. Scala

Even Python is lazy in many situations
map, generators
What are some good, realish examples for these?