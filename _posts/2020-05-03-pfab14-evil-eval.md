---
permalink: /2020/05/03/pfab14-evil-eval/
layout: post
title: "PFAB #14: Evil `eval`"
tags:
  - Programming Projects for Advanced Beginners
  - PFAB
og_image: https://robertheaton.com/images/pfab-cover.png
redirect_from:
  - /pfab14
---
> This post is part of my "Programming Feedback for Advanced Beginners" series, which helps you make the leap from cobbling programs together to writing elegant, thoughtful code. [Subscribe now][subscribe] to receive PFAB in your inbox, every fortnight, entirely free.

*Programming Feedback for Advanced Beginners* reader Frankie Frankleberry writes:

> Here's a program I wrote recently. It works, but I'm really not sure if my code is "proper". I use Python's `eval` function, which never feels like a good idea. There might be a nicer way to do it...?

Frankie is absolutely correct; using the `eval` function is never a good idea. Fortunately, he's also correct that you almost never have to use it, and there are almost always better options available. In this post we'll learn what the `eval` function does, why it's wonderful and amazing, and why you should never, *ever* use it. We'll also see how we can rewrite Frankie's code using first-class functions to expunge the evil `eval` altogether. Frankie's code is written in Python, but the lessons are applicable to code written in many other languages.

## What does Frankie's program do?

Frankie's program is a data processing script that helps his business analyze its product ranges to see if any of them are mispriced. The program loads a big CSV of product data and flags any products meeting certain criteria, such as those with particularly low sales prices or profit margins. The company presumably uses the program's output to try to charge more money for the same stuff.

```
                     +---------------------+
+------------+   >-->+low_profit_products  +--->   +------------+
|            |   |   +---------------------+   |   |            |
|Product Data+---+-->+high_price_products  +---+-->+   Output   |
|            |   |   +---------------------+   |   |            |
+------------+   >-->+low_selling_products +--->   +------------+
                     +---------------------+
```

You can read Frankie's code on GitHub, as well as my refactored version (here's [his original code][original-file], here's [the updated version][updated-file], and here's [a commit showing just the changes][updated-commit]). In order to understand the changes that I made, we need to first understand Python's `eval` function.

## What does the `eval` function do?

Python's `eval` function takes a string and evaluates it as a Python expression. For example:

```python
# ==== EXAMPLE 1 ====
inp1 = "5"
inp2 = "8"
operator = "+"

# `eval` evaluates the string "5+8"
# and returns the result.
x = eval(inp1 + operator + inp2)

print("x is: " + x)
# => x is: 13

# ==== EXAMPLE 2 ====
function_name = "reverse"
l = [1,2,3,4]

# `eval` evaluates the string "reverse([1,2,3,4])"
# and returns the result.
y = eval(function_name + "(" + l + ")")

print("y is: " + y)
# => y is: [4,3,2,1]
```

Here's a rough outline of Frankie's code. It uses `eval` to loop through a list of filter functions:

```python
def low_profit_margin_products(data):
  # ...do some stuff and return a subset of data...

def low_sales_price_products(data):
  # ...do some other stuff and return another subset of data...

function_names = [
  "low_profit_margin_products",
  "low_sales_price_products",
]
dataset = load_data()

# This calls each function in function_names
# on our dataset.
outputs = []
for fn in function_names:
  # Evaluates strings like "low_profit_margin_products(dataset)"
  # and adds the result to `output`.
  outputs.append(eval(fn + "(dataset)"))

print(outputs)
```

`eval`-like methods exist in most other *interpreted languages* too, like Ruby and JavaScript. They allow you to dynamically construct the code of your program. They are flexible, powerful, and fun to work with, and you should never ever use them.

## Why is `eval` dangerous?

`eval` is dangerous because it can make your code insecure. The above `eval` example snippet is, in the exact form that it is currently written, technically fine. If you used it as part of a real website or other system, it would not introduce any immediate vulnerabilities. But the `eval` would still be lurking there, waiting for an innocuous-seeming change to turn it into a gaping flaw.

Here's a plausible story about the future. Suppose that Frankie's system keeps growing and adding new features. It becomes so useful that his company releases it as a standalone product that other organizations can use to analyze their own data. Frankie adds a UI in which users can select the filters that they want to run on their data. He asks users for the list of `function_names` that they want to run, and swaps that list in for the current, hard-coded `function_names` variable. His new code looks something like this:

```python
function_names = get_function_names_from_user_input()
dataset = load_data()

outputs = []
for fn in function_names:
  outputs.append(eval(fn + "(dataset)"))
```

Very elegant, but very, very insecure. To see why, think about what would happen if a user passed in a function name of:

```
print('hello world') and low_profit_margin_products
```

The code would assemble and then run the following string as code:

```python
print('hello world') and low_profit_margin_products(dataset)
```

This line would return the low profit margin products, as per usual, but before it did so it would execute `print('hello world')`. Printing `hello world` isn't going to bring down Frankie's company, but an attacker could use the same technique with a function name of:

```
exec('import os; os.rmdir("/")') and low_profit_margin_product
```

to erase Frankie's server's hard drive. That would ruin quite a few people's days.

The problem with `eval` is that it risks allowing attackers to craft malicious input (such as the above) that tricks your program into executing harmful code. This is not a theoretical threat; an attacker trying to exploit your system will often try feeding it a long list of sneaky inputs, designed to take advantage of insecure usages of tools like `eval`. Even if a program uses `eval` in a way that is technically safe today, it adds a subtle booby trap that future programmers might unwittingly stumble into when they update the code. You want your code to be secure, robust, and difficult to accidentally break.

As well as being a security risk, `eval` makes your code difficult to understand and work with. For example, suppose that you write several methods to work with "reports" called `create_report`, `delete_report`, and `update_report`. To reduce duplication in your code, you decide to use `eval` to wrap the functions up inside a single `perform_report_action` method, like so:

```python
def perform_report_action(action_type):
  """
  action_type is either "create", "delete" or "update".
  """
  # Debug statement
  print("Performing report action: " + action_type)

  # Check that the current user is allowed to perform this action
  if not current_user_has_permission_for_action_type(action_type):
    raise Exception("You are not authorized to perform this action!")

  # Save a database record saying that the action was performed
  # for auditing purposes.
  record_action_audit_log_in_database(action_type)

  # Use `eval` to actually execute the appropriate
  # action method
  return eval(action + "_report()")

c = perform_report_action("create")
d = perform_report_action("delete")
u = perform_report_action("update")
```

This fancy code works and saves you from repeating the code that performs the permission check and audit log for each report action. However, a few months later you decide to add some extra arguments to the `create_report` method. In order to make this change you'll need to update every existing usage of `create_report()`. You search through your project for the string "`create_report`". However, because of your previous cleverness, this string doesn't actually appear anywhere and so your search finds nothing. This makes it difficult for you to figure out where `create_report` is used, or even whether it is still used at all. You either give up and move onto something else, or make your change and accidentally break your system.

In summary, never use `eval` or any method like it.

## Why did Frankie use `eval`?

Frankie is a smart guy. In his email to me he even noted that he didn't like the `eval` function. So why did he use it?

Frankie had good intentions. He wanted to avoid writing repetitive code like this:

```python
fn = 'example-data.csv'
data = load_data(fn)

results1 = low_profit_products(data)
analysis1 = do_analysis(results1)

results2 = high_price_products(data)
analysis2 = do_analysis(results2)

results3 = low_selling_products(data)
analysis3 = do_analysis(results3)

# ...and so on...
```

He didn't like the way that this approach would require him to copy and paste several lines every time he wanted to add a new filter function to his program. Think about a similar situation - it's easy to pass multiple inputs through one function using a for-loop:

```python
# Multiple inputs
animals = ["cat", "dog", "horse", "monkey"]
for a in animals:
  # One function
  process_animal(a)
```

Shouldn't it be just as easy to pass one input through multiple functions?

It is, but it doesn't require the use of `eval` or anything like it. Instead, we can use *first-class functions*. We've talked about first-class functions in [a previous PFAB][pfab10], but here's a brief refresher.

### First-class functions

You learn very early on in your programming career that you can use a variable to store the output of a function:

```python
reversed_list = reverse([1,3,5,7,9])
print(reversed_list)
# => [9,7,5,3,1]
```

However, in Python you can also use a variable to store a function itself:

```python
f = reverse
reversed_list = f([1,3,5,7,9])
print(reversed_list)
# => [9,7,5,3,1]
```

Frankie's code contains a list of function name strings. He uses these names to call the corresponding functions using `eval`. Here's the relevant lines again:

```python
function_names = [
  "low_profit_products",
  "high_price_products",
  "low_selling_products",
]

outputs = []
for fn in function_names:
  outputs.append(eval(fn + "(dataset)"))
```

We can remove the need for `eval` by storing a list, not of function names, but of references to the functions themselves. We can iterate through this list using a for-loop, exactly as above, passing our dataset into each function in turn. This might look something like this:

```python
functions = [
  low_profit_products,
  high_price_products,
  low_selling_products,
]

outputs = []
for f in functions:
  outputs.append(f(dataset))
```

This version is much safer, and is even easier to read too. If we want to add a new filter function that performs a new analysis, all we have to do is add it to our list of functions. The for-loop takes care of the rest, no `eval`-ing or copy-pasting required.

---

Any time you think you need to use `eval` or any other method that evaluates a string as code, stop and think. There will almost certainly be another way to do what you want that is safer and clearer. You could go through an entire 40 year career as a programmer without using any methods like this in production code and you'd almost certainly have been doing it right.

First-class functions are wonderful. Passing around logic in the same way as any other value opens up a whole new world of elegant code. If you read my [full refactored version of Frankie's program][updated-file], you'll see that I took this concept even further and wrapped up each filter function inside a `Filter` object. Next time on PFAB we'll talk about why.

---

*[Subscribe to Programming Feedback for Advanced Beginners][subscribe] now*.

[updated-file]: https://github.com/robert/programming-feedback-for-advanced-beginners/blob/b059b83fd74c0b1b911dd5ed9a84d6ae0659c3af/editions/14-evil-eval/updated/main.py
[updated-commit]: https://github.com/robert/programming-feedback-for-advanced-beginners/commit/43c4a223a0b36c05cbc7a49dc404712b01c8e8f1
[pfab10]: https://robertheaton.com/2020/02/23/pfab10-first-class-functions-dependency-injection/
[subscribe]: https://advancedbeginners.substack.com
[original-file]: https://github.com/robert/programming-feedback-for-advanced-beginners/blob/master/editions/14-evil-eval/original/main.py
