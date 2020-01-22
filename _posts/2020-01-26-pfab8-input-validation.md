---
layout: post
title: "PFAB #8: Input validation - tradeoffs between convenience and surprise"
tags: [Programming Projects for Advanced Beginners]
og_image: https://robertheaton.com/images/pfab-cover.png
redirect_from:
  - /pfab8
---
> This post is part of my "[Programming Feedback for Advanced Beginners][subscribe]" series, which helps you make the leap from knowing syntax to writing clean, elegant code. [Subscribe now][subscribe] to learn something new about writing cleaner code every single fortnight, entirely free.

[In the previous installment of Programming Feedback for Advanced Beginners][pfab7] we began looking at Gianni Perez's breadth-first search library. We decided not to analyze its internal workings, and instead examined it from the outside and see how it looked and felt to external users. This week we're going to continue to study Gianni's library, and look at how it performs complex input validations.

*(Read [the previous PFAB][pfab7] before this one if you haven't already)*

## Input validation

Programs and functions validate their inputs in order to make sure that they don't do anything weird.

This might be in order to help them better serve their users. A user who inputs an email address of `3180 18th Street` is not going to be able to receive any emails from your service. Your service should therefore validate that their email address looks sensible, and complain if it doesn't.

Input validations are also a critical tool for preventing security vulnerabilities. It makes mathematical (if obtuse) sense for you to ask your bank to transfer me `-$1000`. Logically, you transferring me `-$1000` is the same as me transferring you `+$1000`. But your bank should still validate that requested transfer amounts are greater than zero, and reject any requests that fail this validation.

Many input validations are trivial, and simply check whether an input makes any sense at all. `number_of_cakes_ordered` *must* be greater than or equal to zero. `email_address` *must* look something like `x@y.z` (although the details can get gnarly). However, sometimes input validations are murkier and the appropriate way to handle invalid data is less clear. It might be possible, with a little imagination, for us to infer what the user meant, but it's not always clear that this is a good idea. In such situations, should we be sticklers or swashbucklers? As always, it depends.

---

Gianni's [breadth-first search code][bfs-code] faces a particularly subtle input validation conundrum. [Last week][pfab7] we saw that his `shortest_path` function takes in a graph and two nodes, and returns the shortest path between these nodes. However, it expects the graph to be passed in in a very specific format - a dictionary in which the keys are the names of the nodes in the graph, and the values are the neighbors of the nodes that can be reached from it. For example:

```javascript
{
    '1': ['2', '3'], // from node 1 you can step to node 2 or 3
    '2': ['1', '4'], // from node 2 you can step to node 1 or 4
    // ...etc...
}
```

It may or may not be sensible for Gianni to add validation that every node in the input graph has an entry in this data structure. But what should his validation do if a node is a dead-end, and so has no neighbors? In this situation he have two main options. First, we can continue to validate and require that the graph data structure explicitly records the fact that such nodes have no neighbors using an empty list. For example:

```javascript
{
    '1': [],
    // ...etc...
}
```

Or second, he can assume that a node's absence implies that it has no neighbors, and not raise an exception if a node is missing.

This is a complex, abstract problem to understand, so let's start by looking at a similar but stripped-down example. After we've finished, we'll apply the lessons within it to Gianni's breadth-first search code.

## Validating test scores

Suppose that we are writing a program to analyze a school's test scores. We have a function called `analzye_test_scores` that takes in a dataset of scores and uses them to calculate some statistics, like the mean, median, mode, and standard deviation:

```python
def analyze_test_scores(test_scores):
    # Do some analysis and return some statistics
```

This function expects `test_scores` to be a *nested dictionary* in which the top-level key is a student's name. It expects the nested key to be the name of the test, and the nested value to be the student's score in that test. For example:

```javascript
{
    'rob': {
        'algebra': 100,
        'history': 100
    },
    'sally': {
        'algebra': 12,
        'history': 8,
    },
    // etc...
}
```

However, it may be that not every student took every test. There are two ways for us to account for this possibility in our data structure. The most verbose and explicit way is to require that every student have a key-value pair for every subject, but if a student didn't take a test then the value should be `None` (or `nil`, or `null`, or however our language represents "nothing"). For example:

```javascript
{
    'rob': {
        'algebra': 100,
        'geography': None,
        'history': 100
    },
    'sally': {
        'algebra': 12,
        'geography': 7,
        'history': None,
    },
    // etc...
}
```

If we take this approach, our `analyze_test_scores` function would need to validate that every student has an entry for every subject, and throw an exception if they don't. One useful property of this approach is to safeguard against typos in the subject names. Maybe `jerome` doesn't have a score for `science` but he does inadvertantly have one for `sceince`. In this situation our zealous validation code would spot that something was wrong and loudly throw an exception.

Alternatively we could be more relaxed. We could allow users to pass in datasets with missing subject scores, and assume that any student without a key-value for a subject didn't take the test. This would be more convenient to use, but more open to silly typos. It would probably take us much longer to realize that `jerome` had only taken a test for `sceince` but not `science`.

Which of these two approaches is best? It depends.

## Trade offs between convenience and surprise

Whenever you're writing code that will be used by another programmer (you-in-a-month's-time counts as another programmer), put yourself in the mind of the person using your code. This person doesn't want to have to do much work, and they don't want to be confused. They want to maximize convenience and minimize surprise.

However, these goals are often in tension with each other. The most convenient code is that which requires no instruction and can figure out everything magically and perfectly. For example:

```python
output = analyze_test_scores(
    "The scores from last week, or maybe the week before? I forget."
)
print(format_output(
    output,
    structure="The way that Frankie did it the other day, that was really cool."
))
```

But with interpretation and inference comes great scope for silly, silent, surprising mistakes. In our test scores example, giving users the freedom to pass in partially filled-in datasets might make their life easier 95% of the time. But the other 5% of the time it saddles them with secretive bugs or - even worse - wrecks their results in ways that they'll never notice.

Can we have the best of both worlds? Can we make our library both convenient and unsurprising? By using techniques that I'll call "configurable validation" and "loader functions" we can certainly try.

## Configurable validation

We could give our users the flexibility to decide how much validation they want us to apply by adding an optional `strict_validation` parameter to our `analyze_test_scores` method. If this parameter is set to `True` then we throw an exception if data is missing. If it is set to `False` then we silently assume that a missing key means that a test wasn't taken.

Before you read any further - in languages that support *optional parameters*, should the default value of `strict_validation` be `True` or `False` if the user doesn't give us a value?

```python
# If test_data is missing test scores, this will throw an exception
stats = analyze_test_scores(test_data, strict_validation=True)

# This will silently fill in the blanks
stats = analyze_test_scores(test_data, strict_validation=False)

# What should this do?
stats = analyze_test_scores(test_data)
```

Answer - I think that the default value of `strict_validation` should be `True`. This ensures that users of our code who don't read our documentation don't accidentally run code with lax validation. Only users who know what they are doing and understand the risks involved will pass in `strict_validation=False`.

## Loader functions

Our library could also provide functions that load test result data on behalf of our users. For example, suppose that users retrieved their data by loading it from a specially-structured file. We could provide a function for loading, processing, and validating this data called `load_test_scores_from_file'. This function might look something like this:

```python
def load_test_scores_from_file(filepath):
    raw_data = open(filepath).read()

    # ...
    # Massage the raw data into the format that the
    # rest of our library expects it, including
    # `None`s for missing test scores.
    # ...

    return formatted_data
```

We could have this `load_test_scores_from_file` function be responsible for making the same validations and decisions that `analyze_test_scores` currently makes. If data is missing from the source file, this function could be responsible for either raising an exception or filling in the blanks with `None`s. It could even have its own `strict_validation` flag that it uses to decide how fussy to be.

This approach has several pleasing properties. It validates data immediately, at its source, and allows the rest of our program to assume that the data it receives is in the correct format. This simplifies communication between the different components of our program. They're now passing around a dataset that is known to be properly-formatted, rather than a dataset that may or may not be properly-formatted that they have to constantly check and decide how to handle.

In addition, validating data when it's loaded will likely make debugging easier. If a program raises an "invalid data!" exception while it's loading a dataset then it's clear that your problem is with your dataset itself. If it instead raises an exception several steps later, when the data is being processed, it's rather more work to trace back the flow of logic to where the data originally came from.

### Other data sources

We could also provide loader functions for loading data from other sources. We could provide functions called `load_test_scores_from_db` and `load_test_scores_from_api` that perform the exact same operations as `load_test_scores_from_file`, but load their raw data from different places. These functions would be responsible for formatting and validating the data, and for returning a dataset in exactly the same form as `load_test_scores_from_file` does.

We can provide standard loader functions for as many standard data sources as we have time and patience for. However, if our use wants to load their own data from their own, custom source (for example, a custom database or spreadsheet), then we can't give them very much direct support. That said, we can still provide a standalone validation function, called something like `preprocess_test_scores`. Our user can use this function in their own data loading code, allowing them to at least be confident that their custom-loaded data is in the right form:

```python
data = load_data_from_my_custom_data_store()
processed_data = preprocess_test_scores(data)

stats = analyze_test_scores(filled_in_data)
```

Users can bring their own data from their own sources, while also using our standardized validation and formatting functions to ensure that their data is in the right format.

A fully-featured library would likely provide all of these tools. It would provide standardized, full-service functions for loading data from standard sources (like files, databases, and APIs), but also provide the building blocks for users to bring their own data from their own sources. In the real world, time and energy are finite, so any library that you write should begin with the highest leverage, most useful tools. You can add additional, edge-case gadgets as and when they are needed.

## How does this apply to breadth-first search?

Gianni's breadth-first search conundrum is almost exactly analogous to that of our test-scores. Remember, we're trying to decide whether we should require users to give us fully-filled out dictionaries that contain an entry for every node, and whether we should assume that a missing node means that the node has no neighbors, or that the user has made an error.

We have exactly the same options as with our test scores. We can fill in the blanks on behalf of our user when they pass their dictionary into `shortest_path`. We can fill in the blanks when they load their data. We can give them optional parameters that they can use to allow them to choose the blank-handling behavior they prefer. Same decisions, different contexts.

## In conclusion

Think about how your library looks and feels to use. In particular, think about the tradeoffs between convenience and surprise. On their own these types of micro-decisions won't make or break your project, and neither will they get you fired or promoted. But they do all add up, and they are good practice for similar, larger decisions that do make a bigger difference.

Next time we're going to look at a brand new program that parses WhatsApp message logs. Don't miss it. Until then:

* [Subscribe][subscribe] to receive all PFABs in your inbox, every fortnight, for free
* Continue to build your skills with one of my [Programming Projects for Advanced Beginners][ppab]
* From the archives: [How does Tor work?][tor]

[tor]: https://robertheaton.com/2019/04/06/how-does-tor-work
[subscribe]: https://advancedbeginners.substack.com
[ppab]: https://robertheaton.com/ppab
[pfab7]: https://robertheaton.com/pfab7
[bfs-code]: https://github.com/robert/programming-feedback-for-advanced-beginners/blob/master/editions/6-breadth-first-search/updated/main.py
