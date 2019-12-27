---
layout: post
title: Featurewhack
published: false
---
Do you wonder whether you spend too much time looking at your phone? Adarsh Rao, PFAB reader, does. That's why he's written a program to analyze his WhatsApp message log files and estimate how much time he and his friends spend talking to each other on the platform. The results help Adarsh to better understand his use of technology.

Adarsh's program already works perfectly. But he wants to know how he can make it cleaner, tidier, and easier to work with and extend in the future. It just so happens that I've got a couple of suggestions.

This week, I'd like to talk about the high-level structure of Adarsh's program. In particular I'd like to discuss a common tradeoff in data processing: batch or streaming? By doing so, we'll learn how to evaluate the tradeoffs between different competing ways of solving any kind of problem.

## Batch or streaming?

A WhatsApp message log looks like this:

```
7/28/19, 10:56 PM - Harold: Hi. This is a business enquiry requesting a picture of your Dog.
7/28/19, 10:56 PM - Kumar: Hi, yes
7/28/19, 10:57 PM - Kumar: Thank you for getting in touch with us
7/28/19, 10:57 PM - Kumar: We are assigning a representative to fulfil your request
7/28/19, 10:57 PM - Kumar: Please hold
```

In order to analyze a log line, Adarsh needs to:

1. Load a log line from a file (we'll start by assuming that each log line directly corresponds to a message, although we'll see later that this is not the case)
2. Parse the line and pull out the name, date, time, and contents of the message
3. Calculate some statistics about the message - how long is its body, roughly how long did it take to type, etc?
4. Add these message statistics into aggregate statistics about the total number, average length, etc. of messages in the conversation

Adarsh has a choice to make for how he processes his log lines - "batch" or "streaming"?

In a batch approach, Adarsh would perform each of these 4 steps on every single line in his log file before moving onto the next step. He would load *all* log lines from the log file. Then he would parse *all* of the messages into their name, date, time and contents. Then he would calculate statistics for *every* parsed message, and then finally combine them all into aggregate statistics.

```
+-------+       +-------+       +-------+
|       |       |       |       |       |
|       |       |       |       |       |
|       |       |       |       |       |
| Load  +------>+ Parse +------>+Analyze|
|       |       |       |       |       |
|       |       |       |       |       |
|       |       |       |       |       |
+-------+       +-------+       +-------+
```

In a streaming approach, Adarsh would do the opposite. He would load one line from the input file at a time. After loading a single line, he would immediately parse that line into its name, date, time, and contents. Then he would calculate statistics for just that line, and fold those statistics into his running aggregate statistics. Then he would go back to the start and start fully processing the next line.

```
+-------+       +-------+       +-------+
| Load  +------>+ Parse +------>+Analyze|
+-------+       +-------+       +-------+
+-------+       +-------+       +-------+
| Load  +------>+ Parse +------>+Analyze|
+-------+       +-------+       +-------+
+-------+       +-------+       +-------+
| Load  +------>+ Parse +------>+Analyze|
+-------+       +-------+       +-------+
```

As is so often the case, neither one of batch or streaming is intrinsically better than the other, and the right approach depends entirely on context. Let's look at the advantages and disadvantages of each.

## Batch

A big advantage of a batch approach is that (in my opinion) the code is usually simpler and easier to read and write. Each step in the pipeline can be pulled out into its own function, and the resulting code largely explains itself. For example:

```
raw_log = File.read("samplelog.txt")
parsed_messages = parse_raw_log(raw_log)
message_stats = calculate_stats(parsed_messages)
```

Each step in this pipeline can easily be *unit-tested* individually:

```
# (these variables would be filled in with actual data)
raw_log = "..."
expected_parsed_messages = [{...}, {...}]
actual_parsed_messages = parse_raw_log(raw_log)

if actual_parsed_messages == expected_parsed_messages
  puts("TEST PASSED!")
else
  puts("TEST FAILED!")
end
```

Another advantage of a batch approach is that it requires fewer trips to the original source of the data. This is not particularly relevant for our situation, since reading data from a file is a very fast operation. However, suppose that we were instead loading our raw log data from a database. Suppose also that every query to this database takes at least 1 second to execute, since the program has to go through the niceties of establishing a new connection to the database, as well as sending each query on a roundtrip to the database and back. Repeatedly querying for a single record at a time (the equivalent of reading a single line from a file at a time) would make us pay this fixed overhead of 1 second for every single record, making our program very inefficient. Instead, querying for and processing big chunks of data all at once would allow us to *amortize* the fixed query cost over a large number of rows.

We don't even have to load and process *every* row at once in order to use a batch approach. Maybe we process our data using batch sizes of 10, 100, 1000, whatever. In fact, when you think about it, streaming is just batch with a batch size of 1 (woah). We'll blur these lines even more next week, but for this week we'll stick with the pure dichotomy between batch and streaming.

A disadvantage of a batch approach is that it typically uses more RAM, or *memory*, to run than a streaming one. It may be slower too. To see why, look again at the schematic batch pseudocode I laid out earlier:

```ruby
raw_log = File.read("samplelog.txt")
parsed_messages = parse_raw_log(raw_log)
message_stats = calculate_stats(parsed_messages)
```

When this (or any other) program runs, it stores its internal state and data in memory, including the data that is stored in variables. In the this program, we start by reading the entire log file all at once. We assign the result of this read to a variable called `raw_log`. If the log file is 10MB in size then this variable will probably take up roughly 10MB of memory.

Next, we parse all of these raw log lines and assign the result to another variable, `parsed_messages`. Since the data in `parsed_messages` is essentially the same as that in `raw_log` but in a different form, `parsed_messages` probably takes up about the same amount of memory again as `raw_log`. We're therefore using at least 20MB of memory to process a 10MB file. This isn't the end of the world, but it is a shame.

Let's therefore see how streaming works and how it is able to use less memory.

## Streaming

A pseudo-code sketch for a streaming approach might look something like this:

```ruby
stats = {}
File.open("samplelog.txt").each_line do |l|
  message = parse_raw_log_line(l)
  stats = add_message_to_stats(message, stats)
end
```

Ruby's `each_line` method reads the open file one line at a time, and passes each line into the *block* (the code between `do` and `end`) to be processed. `each_line` doesn't read another line from the file until the block has finished executing for the previous one.

Inside the block we use `parse_raw_log_line` to parse the single line into a single message, and then use `add_message_to_stats` to add the message into our aggregate stats-so-far. Once the block has finished executing, the Ruby interpreter is able to throw away (or *garbage collect*) the data for both the raw line and processed message, since it can see that the program won't reference them again. This means that it can reuse the piece of memory in which they were stored to load the next line and message.

This means that our streaming program requires much less memory to run than our batch one. It doesn't need to simultaneously hold in memory the entire raw contents of the file, plus the entire processed output. Instead, at any one time it only needs to store a single raw line and a single processed message.

Note that my claims of memory optimization are a high-level simplification; the exact behavior of the Ruby interpreter is more complex and harder to predict than this. However, we can still say with confidence that the streaming program will use less memory than the batch, even if we can't say exactly how much less without measuring.

## Code cleanliness

"You said that streaming code is often more complex than batch code, but that streaming code snippet you wrote just now didn't look too bad," I hear you say. No, but that was on easy mode. As I mentioned briefly at the start of this post, WhatsApp message logs aren't arranged neatly, one per line. Instead, if a message body contains a newline, the message logs will contain a newline too.

```
7/28/19, 11:07 PM - Kumar: With my family. And I have very few photos of him on this device
7/28/19, 11:07 PM - Harold: Here's an idea for the next time you return. 
Sample Message that is split over two-lines. 
7/30/19, 11:03 PM - Kumar: More messages
```

This unfortunate fact messes up our nice simple rule of "one log line per message", and makes both our batch and streaming approaches more complex. Now when we're processing a log line, we don't immediately know whether it is the end of the message or whether the message is continue on the next line. We only know that a message has ended when we process the next log line and find that a new message has started. Then we have to go *back* to the message that we were previously assembling, and add it to our stats and do whatever other processing we want to do on it, before resuming our parsing of our *new* message. It may be possible to simplify this logic by going through the file *backwards*. Why this might help is left as an exercise for the reader.

Nonetheless, it is entirely possible to incorporate this new logic into a streaming approach. Here's a reasonable, if still somewhat gnarly, attempt:

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
      stats = add_message_to_stats(current_message, stats)
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
stats = add_message_to_stats(current_message, stats)
```

I'm starting to get nervous. Previously the sections of our code that parse messages and calculate message statistics were entirely separate. This made them easy to understand and to write unit tests for. However, in this new version of our code, they have become deeply entwined. `add_message_to_stats` is now buried inside a double-nested if-statement inside the code that parses messages. It's now hard to assess at a glance whether our code is doing approximately the right thing, and hard to write neat unit tests that just test message parsing.

As we will see next week, it is in fact possible to write streaming code that handles multi-line messages without any sacrifice of *modularity*. It just requires a bit more work and imagination.

By constast, updating our batch code is easy. As a reminder, here's our current, high-level batch structure again:

```ruby
raw_log = File.read("samplelog.txt")
parsed_messages = parse_raw_logs(raw_log)
message_stats = calculate_stats(parsed_messages)
```

In order to get this code to handle multi-line messages we will have to make roughly the same updates that we made to our streaming code. However, this time we can make all of the updates inside our `parse_raw_logs` function. The *interface* of the function won't need to change at all - it will still accept an array of raw logs, and still return an array of parsed messages. The only thing that will change is the internal logic that does the parsing. The rest of our program, in particular the `calculate_stats` function, won't have to know or care that anything has changed.

## So what should Adarsh do?

If I were writing this program, I would start with a batch approach. The code is simpler and easier to get up and running, and even though it may be somewhat less efficient, I don't believe that this actually matters. I assume that we're processing the WhatsApp message logs for a single person with, at most, a few thousand messages. I also assume that we're running the program on a modern, relatively powerful computer. If both of these assumptions are correct then the fact that our code is slightly inefficient won't cause us any problems. Our computer will have plenty of memory to spare, and finishing our calculations in 28.5 seconds rather than 28.3 seconds won't materially affect our lives. In this situation I am happy to make my code somewhat less efficient if this also makes it easier to write, read, and understand.

However, suppose that this script continues to evolve. Eventually it becomes the backbone of a system inside a squillion-dollar company, responsible for processing and analyzing billions of message logs from millions of users. Suddenly resource efficiency becomes critical. Speeding up the code and cutting down its memory usage could save us hundreds of hours and thousands of dollars of computation time. Faced with this new set of priorities, we may well want to switch to a more efficient streaming approach. How could we modify our streaming code so as to make it as pleasant to work with as possible?

Find out in next week's edition of Programming Feedback for Advanced Beginners.
