---
permalink: /2020/05/17/pfab15-dont-overwork-your-functions/
layout: post
title: "PFAB #15: Don't overwork your functions"
tags:
  - Programming Projects for Advanced Beginners
  - PFAB
og_image: https://robertheaton.com/images/pfab-cover.png
redirect_from:
  - /pfab15
---
> This post is part of my "Programming Feedback for Advanced Beginners" series, in which I help you make the leap from cobbling programs together to writing elegant, thoughtful code. [Subscribe now][subscribe] to receive PFAB in your inbox, every fortnight, entirely free.

[Last time on Programming Feedback for Advanced Beginners][pfab14], we analyzed a data processing script written by PFAB reader Frankie Frankleberry. Frankie's program helps his company scrutinize its product ranges to see if any items are mispriced. The program loads a big CSV of product data and flags any products meeting certain criteria, such as those with particularly low sales prices or profit margins. The company presumably uses the program's output to try to charge more money for the same stuff.

[Last time we looked][pfab14] at how Frankie could use *first-class functions* to avoid having to use the evil `eval` function. This week we're going to look at some of his functions that have become overworked and responsible for too many different tasks. We'll see how we can take some weight off of them by migrating them into classes, and by the end of the episode Frankie's program will be looking positively cromulent.

You can read both [Frankie's original program][original-file] and [my refactored version][updated-file] on GitHub (and [here's a commit showing just the changes][updated-commit]). The code is written in Python, but the lessons are applicable to any language. If you haven't read [the previous episode of PFAB][pfab14] in which we started analyzing Frankie's program, start there.

## Describing filters

Frankie's program uses "filters" to select a subset of his input data matching a criteria. For example, a filter could select all products in the luxury category with a price below $50. In order to document his filters for his users, Frankie wants to associate each filter function with a plain-English description of what the function does. This might be used as follows:

```
$ python3 filter.py list-filters
######################
## 7 active filters ##
######################

1. low_price_products: Find all products that cost less than $2
2. low_selling_items: Find all items that have not sold any
    copies in the last week
3. ...etc...
```

In his code, Frankie wants each filter's description to be directly attached the function containing its logic. He doesn't want the functions to live in one part of his code and the descriptions in another. He doesn't want to have to write code like the following snippet, in which one function called `run_filter` is responsible for executing filters, and another completely separate function called `get_description` is responsible for keeping track of their descriptions:

```python
# `run_filter` runs the filter with the given filter name
def run_filter(filter_name):
    if filter_name == "low_price_products":
        return low_price_products()
    elif filter_name == ...
        # ...etc...

# `get_description` returns the description of the filter
# with the given name.
def get_description(filter_name):
    if filter_name == "low_price_products":
        return "Find all products costing less than $2"
    elif filter_name == ...
        # ...etc...

filter_name = "low_price_products"

print(f"Running function: {filter_name}")
print(get_description(filter_name))
run_filter(filter_name)
```

This code is unpleasant for at least two reasons. First, future programmers have to be careful to keep the two `if/elif` blocks in `run_filter` and `get_description` exactly in sync. This is not being checked or enforced, and it will be easy to forget to update a branch if a filter name changes or a new one is added.

Second, it's difficult for a programmer working on the code to see which description is associated with which function, because they have to hop back and forth between `run_function` and `get_description`. It would be clearer and more robust if the description and logic for a function lived right next to each other and didn't need to be matched up by strings and parallel if-statements.

Uniting a filter's description and its logic is a worthy aim. But as we'll see, the way in which Frankie achieved this goal created severla new problems. Let's look at Frankie's solution, the problems it created, and how we can fix them.

## Functions that do too much

Frankie bound his logic and descriptions together by requiring each filter function to accept a `description_only` boolean flag argument. If the function is called with `description_only=False`, the function filters the data as normal and returns the results as a dataset of some sort. But if it is called with `description_only=True`, it instead returns the description of the filter as a string. For example:

```python
def low_price_products(input, description_only):
    if description_only:
        return "Find all products costing less than $2"
    else:
        # ... do some filtering of `input` ...
        return output_data

print(low_price_products(data, description_only=False))
# Prints the filtered dataset
# => [{"product_name": "Banana", ...

print(low_price_products(data, description_only=True))
# Prints the description of `low_price_products`
# => "Find all the products that cost less than $2"
```

This approach tightly links logic and description, as desired, but at a high cost. The filter functions (like `low_price_products`) have become overworked. You should aim to have each component of your code be responsible for a single thing. Frankie's functions sometimes return a string, and other times return the output dataset. A function that can return multiple different types of data is by definition responsible for too much.

## Functions should always return the same data type

A rule of thumb:

> Functions should always return the same data type (list, dictionary, integer, string, custom class, etc.), regardless of the arguments that they are given.

As with all things in life and software, there are exceptions. A function that takes a Twitter username and searches for their profile information could reasonably return either:

* A dictionary of information if the username exists
* Or `nil` if it the username doesn't exist

Anything fancier than this is likely a bad idea, because it means that your function is doing too much.

## An aside on dynamically- and statically-typed languages

How easy or hard it is to write functions that return different data types depends on the programming language you are using. *Dynamically-typed* languages like Python and Ruby make it easy (arguably too easy). A loose but still helpful definition of a dynamically-typed language is one in which you don't specify in your code the data types of variables and function inputs and outputs. For example, in Python you write code that looks like:

```python
# We don't have to specify the type of `a` and `b`,
# or the type that `multiply` returns.
#
# New versions of Python do allow you to specify
# *type-hints*, but we can safely ignore type-hints
# for the sake of this discussion.
def multiply(a, b):
    return a * b

x = 3
y = 4
z = multiply(x, y)
```

By contrast, *statically-typed* languages like Go and Java require you to specify data types in your code (again, this is not the strict, textbook definition, but it's good enough). For example, you might rewrite the above Python code in Go as follows:

```go
// We specify that `a` and `b` are integers, and that
// the return value of `multiply` is an integer too.
func multiply(a int, b int) int {
    return a * b
}

// Sometimes the language's compiler can infer
// the type of a variable on its own.
x := 3
y := 4
z := multiply(x, y)
```

If we tried to write a filter function in Go that returned either a string or a dataset, the Go compiler would get upset when we tried to run our program:

```go
// XXX: we have to specify in advance the data type that
// `lowPriceItems` will return. This means that we
// can't have it return either a string or a Dataset -
// we have to choose one!
func lowPriceItems(input Dataset, descriptionOnly string) ????? {
    if descriptionOnly {
        return "This filter returns low priced items"
    } else {
        // ... do some filtering of `input` ...
        return outputDataset
    }
}
```

There are ways around this restriction if we were determined enough, but they are unlikely to be a good idea. For example, we could make a type called `FilterOutput` with two fields called `Description` and `Dataset`. We could tell the Go compiler that the `lowPriceItems` function will return a `FilterOutput` object and set only the field corresponding to the type of data that we want to return:

```go
// Define the FilterOutput type with 2 fields.
type FilterOutput struct {
    Description string
    Dataset dataset
}

// Now `lowPriceItems` will always return a `FilterOutput`
// object, so we can set this `FilterOutput` as the
// `lowPriceItems` return type.
func lowPriceItems(input Dataset, descriptionOnly string) FilterOutput {
    if descriptionOnly {
        // Return a `FilterOutput` with only the `Description`
        // field set.
        return FilterOutput{
            Description: "Find all products costing less than $2",
        }
    } else {
        // ... do some filtering of `input` ...
        //
        // Return a `FilterOutput` with only the `Dataset`
        // field set.
        return FilterOutput{
            Dataset: outputDataset
        }
    }
}
```

This approach would work but I would not recommend it, for the reasons already discussed. Instead, we should take the hint that the compiler is giving us and work out something cleaner.

## Binding data together in a class

Frankie wants to tightly bind together a filter's logic and its description. Instead of squeezing them both into the same function, let's hang them off of a class.

We'll define a class called `Filter`. This class's constructor will take two arguments:

* A first-class function containing the filter's logic (see PFABs [#10][pfab10] and [#14][pfab14] for more on first-class functions)
* A description string

`Filter` will have a single method called `apply`. This will take a dataset, run it through the filter function that was given to the constructor, and return the result.

```python
class Filter(object):

    def __init__(self, filter_f, description);
        self.filter_f = filter_f
        self.description = description

    def apply(self, input):
        return self.filter_f(input)
```

At the end of [the previous PFAB][pfab14], our code had a list of first-class functions that our code would pass our input dataset through:

```python
functions = [
    low_profit_products,
    high_price_products,
    low_selling_products,
]

input_data = load_data()
for f in functions:
    print(f(input_data))
```

To migrate this code to use this our `Filter` class, we'll convert the list of functions to a list of `Filter`s; add descriptions; and have the code pass our input dataset through each filter in turn:

```python
filters = [
    Filter(
        filter_f=low_price_items,
        description="Find all products costing less than $2"
    ),
    Filter(
        filter_f=low_selling_items,
        description="Find all items that have not sold any copies in the last week"
    ),
    # ...etc...
]

input_data = load_data()
for f in filters:
    print(f.description)
    print(f.apply(input_data))
```

This approach has several advantages. First, it splits up a filter's description and logic so that they are no longer squashed into the same function. `filter_f` always returns a dataset; `description` is always a string. Second, it gives us a framework on which we can hang additional properties of filters in the future, such as:

* The name of the filter
* The name of the team who owns the filter
* Who to email if the filter breaks
* Where the filter should load its input data from

Eventually we may find ourselves with so many extra properties on `Filter` that we split them off into smaller classes like `DataSource` and `FailureNotifier`. But that's a story for another day.

## In summary

Don't write functions that return drastically different data types. If you need to tightly couple several concepts or pieces of data together, consider hanging them off of a class instead.

[pfab14]: https://robertheaton.com/2020/05/03/pfab14-evil-eval/
[updated-file]: https://github.com/robert/programming-feedback-for-advanced-beginners/blob/b059b83fd74c0b1b911dd5ed9a84d6ae0659c3af/editions/14-evil-eval/updated/main.py
[updated-commit]: https://github.com/robert/programming-feedback-for-advanced-beginners/commit/43c4a223a0b36c05cbc7a49dc404712b01c8e8f1
[pfab10]: https://robertheaton.com/2020/02/23/pfab10-first-class-functions-dependency-injection/
[subscribe]: https://advancedbeginners.substack.com
[original-file]: https://github.com/robert/programming-feedback-for-advanced-beginners/blob/master/editions/14-evil-eval/original/main.py
