---
layout: post
title: "PFAB X: First-class functions and dependency injection"
published: false
---
In the previous edition of PFAB[TODO] we began looking at Adarsh Rao's program that analyzes WhatsApp message logs. We were debating the tradeoffs between taking a *batch* approach - where we load and process many records at once - and a *streaming* approach - where we load one record at a time, fully process it, and only then load the next record.

Last week we focussed on how to write a clean batch pipeline. This week we're going to look in detail at how to make a streaming pipeline *modular* by using *first-class functions* and *dependency injection*.

This edition is advanced stuff - this series isn't called "Programming Feedback for Advanced Beginners" for nothing. If after reading this post you think "OK, that's nice and all but I have no idea how to use any of it in my own code" then that's entirely fine and normal. My hope is that the next time you come across some code written in this style you'll think "oh I see what they're doing here." Then the next time you'll start to understand even more, and eventually you'll be writing this type of code yourself in your sleep.

## Lamenting our unmodular streaming code

At the end of last week'd PFAB, we were attempting to update our code to deal with the fact that WhatsApp messages can sometimes spread over multiple lines in a log file:

```
7/28/19, 11:07 PM - Harold: Here's an idea for the next time you return. 
Sample Message that is split over two-lines. 
7/30/19, 11:03 PM - Kumar: More messages
```

We were lamenting the fact that our updated streaming code was starting to look quite gnarly and un-modular. Our code that parses log lines into messages was becoming deeply entwined with our code that processes messages once they had been parsed. Look at the call to `update_stats` buried deep inside our log-parsing code:

```ruby
stats = {}
current_message = nil
File.readlines("samplelog.txt") do |l|
  parsed_line = parse_raw_log_line(l)

  # If this line is a new message, add the previous
  # message to our stats and reset current_message
  # to be this line.
  if parsed_line[:start_of_new_message]
    if !current_message.nil?
      stats = update_stats(current_message, stats)
    end
    current_message = parsed_line

  # If this line is not a new message, it must be a
  # continuation of the previous line's message. We
  # therefore add its contents to the current message.
  else
    current_message[:contents] += parsed_line[:contents]
  end
end

# We need to manually add the final message to our stats,
# since it won't be added by the above loop (urgh)
stats = update_stats(current_message, stats)
```

By contrast, the code for our batch version of the program remained nicely separated, with all the above logic wrapped up nicely inside separate functions:

```ruby
raw_log = File.read("samplelog.txt")
parsed_messages = parse_raw_logs(raw_log)
message_stats = calculate_stats(parsed_messages)
```

I promised that we would refactor our streaming code so that it looked as aesthetically pleasing as our batch code. Let's see how.

## Start from the end

When refactoring code to make it cleaner and tidier, I like to start from the end. How do I want my code to look to another programmer who is using it?

For the batch case this is easy. Our code is a pipeline with clearly separated steps - load data, parse data, analyze data. We want the results of one step to be passed directly into the next, and we want the code for each step to be entirely separate and isolated in different functions. When I was sketching out my version of the batch program, the first thing that I wrote was the high-level structure of the program:

```ruby
raw_log = File.read("samplelog.txt")
parsed_messages = parse_raw_log(raw_log)
message_stats = calculate_stats(parsed_messages)
```

This helped me see what functions I would need to write, the arguments that each function would need to accept, and the values that each function would need to return. With this chunked-up specification in hand, the rest of the program was just a matter of filling in the pre-designed blanks.

## Designing our streaming code

However, I found that coming up with this kind of high-level layout for streaming code was rather harder. Have a quick think about how you might do it. Don't worry if you can't come up with anything.

The reason that streaming is harder is that we don't have the simple, sequential execution that we had in the batch case. We have to read a line, parse it, check if we have finished composing a new message, add it to our stats if so, then go back, read another line, add it to our stats, and so on. We can't simply assemble a line of functions that feed data into each other.

The root cause of my discontent with our current streaming code is that our `update_stats` function is buried deep inside our code that parses log lines. This troubles me because if we wanted to reuse our log-parsing code to parse a different log file and perform a different action on each message (for example, write it to a message database), we would have to go inside our log-parsing code and conduct invasive surgery. By contrast, to make a similar update to our batch code we would just have to write a new `write_to_db` function and swap it in for our `calculate_stats` function, leaving our log-parsing code entirely untouched.

Some plausible but unsatisfactory solutions to this problem might include:

* Having two almost-duplicate copies of the same function, called (for example) `parse_log_file_and_calculate_stats` and `parse_log_file_and_copy_to_database`. However, copy-pasting code is always a shame, and it's particularly unfortunate that we'll have to make a new function for every single new processing action that we may want to perform in the future too.
* A slightly better alternative would be to pull our log-parsing code into a function called (say) `parse_log_file`, and to pass a string into `parse_log_file` that describes the processing action that we want to perform. Inside `parse_log_file` we would use a long if-statement to match the string to a function. For example:

```ruby
def parse_log_file(filename, processing_action)
  # <lots of parsing code goes here>

  case processing_action
  when 'update_stats`
    stats = update_stats(message, stats)
  when 'write_to_db'
    write_to_db(message)
  # ...etc...
  end

  # <lots more parsing code goes here>
end
```

However, this approach still has the disadvantage of requiring us to update `parse_log_file` every time we want to add a new processing action.

The solution is *first-class functions* and *dependency injection*.

## First-class functions

A programming language that supports *first-class functions* allow you to pass functions around as first-class variables.

To demonstrate, let's switch briefly to Python for a secon, where the syntax for first-class functions is simpler:

```python
def say_hello():
  print("HELLO!")

x = say_hello
x()
# => prints "HELLO!"
```

In Python, the line `x = say_hello` means "assign the function `say_hello` to the variable `x`". It is very different to the more familiar `x = say_hello()` (note the `()` after `say_hello`), which means "evaluate the function `say_hello`, then assign the result to the variable `x`."

After executing `x = say_hello`, `x` points to the `say_hello` function. This means that on the next line, `x` can be called like any other function by writing `x()`. This executes the code inside `say_hello`, printing "HELLO!".

### Dependency injection

Variables that point to functions can be passed around like any other type of variable. This allows you to pass around instructions and logic without having to immediately execute it. Passing around logic in this way is known as *dependency injection*, because you're injecting logic that the receiving function depends on. Take a look at the following snippet, which demonstrates a function that takes another function as an argument, and then runs that function twice:

```python
def say_hello():
  print("HELLO!")

def run_function_twice(my_function):
  my_function()
  my_function()

x = say_hello
run_function_twice(x)
# => prints "HELLO!" "HELLO!"

# Or simply:
run_function_twice(say_hello)
# => prints "HELLO!" "HELLO!"
```

### Translating first-class functions into Ruby

*(If you don't care about the specifics of Ruby and only care about the general principles, you can safely skip this section)*

Strictly speaking, Ruby doesn't have first-class functions. You can't assign a method to a variable in the same way that you can in Python:

```ruby
def say_hello()
  puts("HELLO!")
end

# In Python this would point `x` at the
# `say_hello` function:
x = say_hello
# But in Ruby it executes `say_hello`
# immediately and prints "HELLO!"
```

However, even though Ruby doesn't have true first-class functions, it does have a concept called a `Proc`, which is a different, slightly more verbose way of achieving the same thing (you don't need to worry too much about the details of `Proc`s unless you're interested). In order to perform dependency injection and produce the same behavior as our Python example above, we need to:

* Wrap the function we want to pass around inside `Proc.new`
* Invoke the `Proc` using `.call()`, instead of simply `()`

For example:

```ruby
def say_hello()
  puts("HELLO!")
end

def run_proc_twice(my_proc):
  my_proc.call()
  my_proc.call()
end

x = Proc.new { say_hello() }
x.call()
# => prints "HELLO!"

run_proc_twice(x)
# => prints "HELLO!" "HELLO!"
```

Don't worry too much about the syntactic specifics for now - if the general idea of dependency injection and passing around logic as variables makes sense then you're doing great. If it doesn't then please do [let me know][about].

## How does any of this help us?

Recall the second band-aid solution that we proposed to our problem: pass into `parse_log_file` a string describing the processing action that we want to perform, and then use a big if-statement inside `parse_log_file` to pick out and execute the logic that corresponds to this string.

This solution was OK, but how about we skip out the middleman? Instead of passing in a string that tells our function which logic to run, how about we pass in the logic itself in the form of a `Proc`?

At the top-level, this might look like this:

```ruby
update_stats_proc = Proc.new { |m| update_stats(m) }
parse_log_file(fname, update_stats_proc)
```

The `parse_log_file` function now accepts 2 arguments - a filename, and a `Proc` containing the logic that `parse_log_file` should perform whenever it finishes parsing a message. This means that if we want to add new functionality to our system, for example to parse messages and add them to a database, we can reuse the existing `parse_log_file` method and pass in a different `Proc`. Excitingly, we won't have to update a single line inside `parse_log_file`.

```ruby
write_to_db_proc = Proc.new { |m| write_to_db(m) }
parse_log_file(fname, write_to_db_proc)
```

Side-note: Ruby has a more elegant "block" syntax that we can use to achieve the same result in a more stylish manner:

```ruby
parse_log_file(fname) do |m|
  update_stats(m)
end
```

(Google "ruby block" and "ruby yield" for more details)

Now that we've fleshed out how we want our program to look, all that remains is to implement the individual pieces that we've designed. We want `parse_log_file` to be a function that takes 2 arguments: a filename and a message-processing `Proc`. It should read the given file, parse WhatsApp messages from it, and invoke the message-processing `Proc` on every message as it is parsed.

Something like this ought to do the trick:

```ruby
def parse_log_file(filename, message_processing_proc)
  current_message = nil
  File.foreach(filename) do |l|
    parsed_line = parse_log_line(l)

    if parsed_line[:new_message]
      if !current_message.nil?
        # If the line starts a new message, invoke
        # message_processing_proc on current_message
        # to process it.
        message_processing_proc.call(current_message)
      end
      current_message = parsed_line
    else
      current_message[:body] += parsed_line[:body]
    end
  end

  # Manually invoke message_processing_proc on the
  # final message.
  message_processing_proc.call(current_message)
end

message_count = 0
def update_stats(message)
  message_count += 1
end

update_stats_proc = Proc.new { |m| update_stats(m) }
parse_log_file(fname, update_stats_proc)
```

And there we have it - a streaming pipeline with the different steps of the pipeline as cleanly separated as they were in the batch pipeline.

## Future work

We can use first-class functions and dependency injection to make our code even more powerful and more modular.

### Configurable batch sizes

In the previous edition of PFAB, we mentioned that it is possible to combine streaming and batch approaches. We've so far thought of "streaming" as loading and processing one record at a time, and "batch" as loading and processing all records at once. However, we can also load and process "some" records at a time, in batches of a configurable size.

There may be interesting tensions at play in our choice of batch size. We might want to keep our batches small to reduce the amount of memory that we use (see last week's PFAB[TODO]). But we might also want to keep our batches large to reduce the number of separate times we have to load data from our data source. In between these competing priorities there is likely a happy middle-ground. Where? That all depends.

Let's once again take our top-down approach, and consider how we would like our batch-size code to look to other programmers who are using it. I would like it if our users simply passed in a `batch_size` parameter to our existing functions, and then we take care of the rest:

```ruby
parse_log_file(fname, batch_size) do |m|
  update_stats(m)
end
```

`parse_log_file`'s contract then becomes "you give me a filename, a message-processing function, and a batch size. I'll load message from your file in batches of `batch_size`, and run each record through the message-processing function." Go back to the previous definition of `parse_log_file` and think about how you might update it to work with a batch-size.

### More modularity

The `parse_log_file` function is currently responsible for both:

* Loading log data from a file
* Parsing log data into messages

For our current purposes, it's not a problem that `parse_log_file` has two jobs. However, suppose that we wanted to extend our system to work with additional *data sources*. In this expanded system, users can load their log data from not just a file, but also from a database or a website. The data is formatted in the same way in each new source type as it is in the log file. We therefore want to be able to reuse our log-parsing code, and just want to be able to configure the source from which the logs are originally loaded.

We could write a band-aid solution to this problem, similar to those proposed for our earlier problems. We could make multiple functions called `parse_log_database`, `parse_log_website`, `parse_log_file`, although this would require us to duplicate some code. Or we could pass a `sourcetype` argument into `parse_log_file` that indicated whether the function should load its data from a database, website, or file.

However, I would prefer to create additional modular building blocks that users of our code can string together themselves, in the same way that users can already string together parsing and processing. I'd like our streaming code to look like this:

```ruby
load_data_from_db(dbname) do |line|
  parse_and_transform_line(line) do |message|
    update_stats(message)
  end
end
```

The new component in the mix is `load_data_from_db`. Recall how our line-parsing function (now called `parse_and_transform_line`) works - it parses lines one-by-one, and passes each line into a user-provided `Proc` for further processing. In the same way, `load_data_from_db` loads lines from a database, and passes each line into a user-provided `Proc` for further processing.

This allows us to use the same line-parsing function, whether we're reading the original from databases or websites. At the same time, we can seamessly swap out the piece of the pipeline that deals with loading data. In fact, now every step of our pipeline can be replaced and customized, independent of all the other steps. For example, if we wanted to load our data from a website instead of a database, and to translate the messages into French instead of calculating statistics, we could swap out our first and last components of our pipeline and write:

```ruby
load_data_from_website(url) do |line|
  parse_and_transform_line(line) do |message|
    translate_message(message, 'french')
  end
end
```

Once again, implementing these postulated functionse is left as a difficult exercise for another day or an especially motivated reader. This process is nonetheless a good example of the power of top-down design.

## Should you actually write code like this?

Probably not. At least, not yet.

I've been somewhat less than honest in my presentation. The top-level code that I've sketched out is all very clean and delightful, but the lunch that it gives you is not free. Despite my hand-waving, actually implementing all of those methods will get complex quickly.

If you're writing a library that will be used by many other programmers then this is just part of your job. It's worth stuffing as much complexity as you can inside your library in order to make it as easy as possible for people on the outside to use. But if you're writing a small project that is currently only worked on by you and maybe one or two other people, embellishments like this might be more trouble than they're worth.

In particular, one of the biggest risks in erecting a framework inside a project is that it might turn out to be the wrong one. Adding new functionality to a framework that isn't designed to handle it is much harder than adding functionality to a project with no framework at all.

For example, all of the above code has assumed that message records are processed one at a time, in a complete vacuum. This sounds like a reasonable assumption. But as part of his analysis, Adarsh (the original author of this program) wants to be able to measure the time difference *in between* messages. This will require us to be able to peek back at past messages in order to read their timestamps, which is not a feature that our current framework has contemplated. Adding it to our now-opinionated framework will be substantially harder than adding it to a more freeform, unstructured program.

Don't undervalue flexibility. Every clever flourish that you add to your code makes some use-cases easier to handle, but probably also makes others much harder. When you know for sure(ish) the types of tasks that your system will and won't need to handle, then you can start to make assumptions and specialize. Until then, keep your options open, even if it makes your code a little more ragged around the edges for the time being.
