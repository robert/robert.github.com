---
title: "Introducing afl-ruby: fuzz your Ruby programs using afl"
layout: post
tags: []
og_image: https://robertheaton.com/images/wfc-terminal.png
---
American Fuzzy Lop ([afl][afl-home]) is a popular fuzzer, traditionally used to find bugs in C and C++ code. [python-afl][python-afl] and [aflgo][aflgo] have adapted it for use with python and go, and now [afl-ruby][afl-ruby] (written by [Richo Healey][richo], with contributions from myself) allows you to use afl to fuzz Ruby programs too.

Here's how it works.

[afl-home]: http://lcamtuf.coredump.cx/afl/
[python-afl]: https://github.com/jwilk/python-afl
[aflgo]: https://github.com/aflgo/aflgo
[afl-ruby]: https://github.com/richo/afl-ruby
[richo]: https://twitter.com/rich0h

## Usage

### 1. Write a harness for your code

Fuzzing any program requires a fuzz harness that can be invoked by afl. You'll need to write a harness that:

* Initializes the [afl forkserver][afl-forkserver] using `AFL.init`
* Wraps the fuzzable piece of your harness in an `AFL.with_exceptions_as_crashes { ... }` block
* Reads bytes from `stdin` and uses them as input to your program

[afl-forkserver]: https://github.com/mirrorer/afl/tree/2fb5a3482ec27b593c57258baae7089ebdc89043/llvm_mode

For example:

```ruby
def byte
  $stdin.read(1)
end

def c
  r if byte == 'r'
end

def r
  s if byte == 's'
end

def s
  h if byte == 'h'
end

def h
  raise "Crashed"
end

require 'afl'

unless ENV['NO_AFL']
  AFL.init
end

AFL.with_exceptions_as_crashes do
  c if byte == 'c'
  exit!(0)
end
```

### 2. Patch afl

Next you'll need to apply a tiny patch to afl itself - for quick instructions see [the afl-ruby README][afl-ruby-readme-patch-afl]. The patch comments out afl's check that the target you give it has been instrumented properly. This fiddle is necessary because afl was not built to expect targets written in Ruby.

[afl-ruby-readme-patch-afl]: https://github.com/richo/afl-ruby#3-patch-afl

### 3. Build the afl-ruby gem

Afl-ruby is not yet available on Ruby gems, so you'll need to clone and build it yourself. This should be straightforward; once again [the README has instructions][afl-ruby-readme-build].

[afl-ruby-readme-build]: https://github.com/richo/afl-ruby#1-build-the-extension

### 4. Fuzz your program as normal using afl-fuzz

```
/path/to/afl/afl-fuzz \
  -i work/input \
  -o work/output \
  -- /usr/bin/ruby example/harness.rb
```

Afl finds the crash in the above example program in about 30 seconds on my laptop. Inspecting the `queue/` directory shows the points along the way at which afl realized it had found an interesting new branch.

[PIC of queue]

## Technical discussion

Afl was originally written to be used against C and C++ targets. How can it be adapted for use with Ruby, Python, and go? In order to answer this question, we'll need to spend a few paragraphs understanding how afl works.

Afl observes how different test cases change the execution path of your program, and uses this information to skillfully generate further interesting test cases. For example, afl might notice that if it twiddles the 10th byte of a test case *just so* then it triggers a new branch of a switch-statement inside your program. It will remember this useful nugget, and use it to design new test cases that continue to explore this uncharted section of your program.

The execution path of your program is not available to afl by default. In order to get this information, afl needs to augment your program with additional instrumentation that records the files and line numbers that get executed. We should note that afl does not typically record every single line that your program executes; it instead uses a probabilistic approach to minimize the amount of data that it needs to analyze. This detail is not important here.

Afl instruments C and C++ programs by requiring them to be compiled with a custom compiler (either `afl-clang`, `afl-gcc`, `afl-clang-fast`, or their C++ equivalents). These custom compilers compile your program so that it runs as normal, but with afl's instrumentation injected in too. Whenever your program executes a line of code, afl's instrumentation writes information about the line's number and filename to a *shared memory segment*. This memory segment can also be read by the afl process that is fuzzing your program, which means that it can see how each test case affects the internal behavior of your program, as required.

[PIC of the system]

Crucially, this means that the `afl-fuzz` command doesn't need to "know" anything about C or C++. When invoking `afl-fuzz`, you pass it the shell command that it should use to invoke your program. `afl-fuzz` then runs your program by shelling out to it, and feeds it test cases via `stdin`. Finally `afl-fuzz` reads execution path information directly from its shared memory segment - another completely language agnostic process.

This means that most of the work when adapting afl to new languages (like Ruby) is in adding instrumentation that writes execution path data to afl's shared memory segment. There are a few other steps, including initializing the afl forkserver and turning exceptions into crashes. But these are generally more straightforward, and I describe them in more detail in "Fuzzing in your favorite language using afl".

Many languages allow you to hook into their compiler or interpreter. For its part, Ruby has [`TracePoint`][tracepoint], a module in its standard library which allows us to register callbacks that run whenever the Ruby interpreter performs a particular action, such as running a line of code, entering a function, or returning from one. Afl-ruby uses `TracePoint` to register a callback that writes out information about executed files and line numbers to afl's shared memory segment.

[tracepoint]: https://ruby-doc.org/core-2.5.0/TracePoint.html

For now this callback is only invoked when a new function is called. This felt like a good balance between high-fidelity recording and overwhelming afl with too much detail that it doesn't need. It's certainly possible that a more frequent; infrequent; or nuanced scheme would produce better results. More research required.

## Differences and similarities between Ruby and C

There are two main differences between the processes of fuzzing Ruby and C programs. The first is in the type of bug that you can expect or hope to find. The most common bugclasses that fuzzing shakes out of low-level programs are those related to memory-mismanagement, like overflows, underflows, and segfaults. Fuzzers are more likely than humans to test programs with 1024 letter "A"s followed by a null byte, and so are more likely to find any bugs that doing so might reveal.

Ruby is a higher-level language than both C and C++, and so is less vulnerable to this kind of low-level goof. It's certainly possible that a `nil` might sneak into a place where a `nil` was not expected, but to find interesting bugs in Ruby code you will likely want to make more use of property-based-testing-style assertions. These are business logic statements that should always be true for every execution of your program, for example "money in should always equal money out" or "non-admins should never perform an admin action". After invoking the main body of your program, you can add if-statements to verify that these statements are indeed true. For example:

```ruby
AFL.init
AFL.with_exceptions_as_crashes do
  run_my_program()
  if money_in != money_out
    raise StandardError.new("Money in should always equal money out!")
  end
end
```

`lcamtuf`, the creator of afl, discusses this approach briefly in [the afl docs][assertions].

[assertions]: https://github.com/mirrorer/afl/blob/2fb5a3482ec27b593c57258baae7089ebdc89043/docs/life_pro_tips.txt#L100-L101

Second - Ruby is very slow, at least when compared to C and C++. Even the trivial example harness at the start of this post only reached 100 execs/second on my laptop, compared to real C programs that comfortably hit one or two thousand. You can either just be prepared to wait longer for your results, or look into a distributed fuzzer like [`roving`][roving], also originally built by Richo Healey and developed further by me as part of my work at Stripe.

[roving]: https://github.com/richo/roving

On the other hand, fuzzing Ruby and C programs remain very similar endeavors. Traditional afl is able to improve its test-case generation by manipulating a user-supplied set of example inputs or dictionary of common tokens, and these mechanisms still work perfectly well with afl-ruby. All the usual principles of writing good fuzzing harnesses still apply - stub out network calls and non-determinism, and try not to force the fuzzer to guess magic strings or checksums. Read the very clear and well-written [afl docs][afl-docs].

[afl-docs]: https://github.com/mirrorer/afl/tree/master/docs

Take `afl-ruby` for a spin, let us know what you find, and submit a PR if you have any improvements!

TODO: thanks to Richo and Jakub
