---
title: "PFAB#7: How to write a library"
layout: post
tags:
  - Programming Projects for Advanced Beginners
  - PFAB
og_image: https://robertheaton.com/images/pfab-cover.png
redirect_from:
  - /pfab7
---
> Welcome to week 7 of Programming Feedback for Advanced Beginners. In this series I review a program [sent to me by one of my readers][feedback]. I highlight the things that I like and discuss the things that I think could be better. Most of all, I suggest small and big changes that the author could make in order to bring their program up to the next level.
>
> (To receive all future PFABs as soon as they’re published, [subscribe by email][subscribe] or [follow me on Twitter][twitter]. For the chance to have your code analyzed and featured in future a PFAB, [go here][feedback]) 

This week we're going to peruse a program sent to me by Gianni Perez, a security analyst from the US of A. He spends most of his days searching for exploits and vulnerabilities, not building and maintaining large software projects, but he'll frequently throw together quick scripts to automate parts of his work. He says that he's always looking to improve his programming skills, and he asked me to take a look at a small project he recently finished.

Gianni's program is an implementation of the *breadth-first search* algorithm for finding the shortest path from A to B. A variation of breadth-first search (called [*Dijkstra's Algorithm*][djikstra]) is used by car and train journey-planners to find you the best route from here to there (and show you adverts at the same time).

Breadth-first search is a staple of computer science undergraduate courses, although it's relatively rare that a real person has to implement it this outside of a university lab or an ill-conceived whiteboard job interview. Nonetheless, as we'll see, doing so can still be a satisfying and educational exercise.

Don't worry if the words "computer science" or "algorithm" make you nervous. We're going to be able to make intelligent observations about Gianni's code without having to know *anything* about the internals of breadth-first search. This is because we're not going to analyze whether Gianni has implemented the algorithm cleanly or even correctly (although as far as I can tell he has). Instead, we're going to pretend that we're considering whether to use his code as a *library* in order to perform breadth-first search in our own journey-planning project. We'll evaluate his code from the perspective of potential consumers, and discuss how to make *library code* more welcoming to new users.

Let's start with an optional paragraph or two summarizing what goes on inside a breadth-first search.

*(You may find it useful to [open Gianni's code][bfs-code] to reference while you read this post)*

## Breadth-first search

The goal of breadth-first search is to find the shortest path through a network from a source to a destination. These networks are known as a *graph*, and a *graph* is composed of *vertices* - the nodes of the graph - and *edges* - the lines joining these nodes together. Suppose that we were trying to find the shortest route from city A to city B along the highways. Cities would be our vertices, and the highways joining them would be our edges. The overall highway network would be our graph.

In breadth-first search you start at the source vertex and walk simultaneously along every possible path away from it, until one of these paths reaches your desired destination. The "breadth" in breadth-first search comes from the fact that you are trying every possible path simultaneously, instead of following one path at a time all the way to its end.

To perform the algorithm you start at the source vertex. For example, suppose you were trying to find the shortest path from A to E in the following graph. You would start at A:

```
           +---+
     +-----+ A +-----+
     |     +---+     |
     |               |
     +               +
+---+B+---+          C
|         |          +
|         |          |
+         +          |
D         E          +
          +---------+F
```

Next you simultaneously take a step from this source vertex to each one of its neighbors, and store a new path in your program for each one. If any of your paths have landed on your destination vertex then you declare victory and return that path as the shortest path. If not then you keep going.

```
           +---+
     +-----+ A +-----+
     |     +---+     |
     |               |
   +-+-+           +-+-+
+--+ B +--+        | C |
|  +---+  |        +-+-+
|         |          |
+         +          |
D         E          +
          +---------+F
```

In the next *iteration* through the algorithm you extend each path by one step to each of its new neighbors, creating and keeping track of further new paths where necessary. You repeat this process in each subsequent iteration too, stepping from the vertex at the end of each of your paths to each new neighbor that hasn't yet been touched by another path. You iterate until one of your paths steps onto your destination vertex.

```
             +---+
       xxxxxxx A +-----+
       x     +---+     |
       x               |
     +-x-+           +-+-+
  +--+ B xxxx        | C |
  |  +---+  x        +-+-+
  |         x          |
+-+-+     +-x-+        |
| D |     | E |      +-+-+
+---+     +---+------+ F |
                     +---+

Shortest path: A => B => E
```

At this point you know for certain that you have found the shortest path between your source and destination vertices. It's possible and indeed likely that there are other paths available between these two vertices. However, since you are tracing out every possible path simultaneously and only extending them by one hop at a time, those other paths are guaranteed to take more hops to trace out that the one you have found.

If this doesn't fully make sense then you can either Google "breadth first search", or continue reading this post without worrying too much. As potential users of this library we don't need to know anything about how it works internally. Do you know how your favorite programming language actually works? Me neither, but we're still both able to write programs with it just fine.

## How does a library look to its users?

As users of Gianni's library, we only care whether its code is correct, reasonably efficient, and easy to use. We don't care at all whether its insides are neat or messy or well-commented or opaque, because we're never going to see any of these innards ourselves. All we're going to see are the names of the methods that the library exposes to us, and the forms of input and output that they expect.

To illustrate the difference between a usable and a useless library, here's a simple example. Which of these functionally-equivalent chart-drawing libraries would you rather work with?

Number 1:

```python
import ch

ch.do(
    data,
    None,
    None,
    None,
    'x=Date|y=Sales Volume',
    'YES',
    5)
```

Or number 2:

```python
import chartlib

chartlib.draw_line_chart(
    data,
    x_axis_label="Date",
    y_axis_label="Sales Volume",
    show_gridlines=True,
    font_size=5)
```

Both libraries produce the same charts. Both libraries may even contain almost exactly the same code. But whereas library number 1 looks like an obfuscated nightmare to use, the second looks like a simple pleasure. The difference is in their *interfaces* - how the user interacts with them.

When analyzing Gianni's code through this lens, I noted a few subtle ways in which its functions' interfaces could be made more usable. In particular, I noticed some small but significant improvements that could be made to the form in which the functions return their results.

## What should a function return?

One of the library's most important functions is called `shortest_path`. This function takes in 3 arguments: a graph, a source vertex, and a destination vertex. As you might expect, it finds and returns the shortest path through the graph from the source to the destination. This is exactly the kind of function that is well-suited to being performed by a library. When writing our journey-planner product, we want to handle all of the parts of the code that are specific to our business - rendering the output maps, finding the user's location, showing them lots of adverts, and so on. But there's no reason for us to re-implement a core, generic computer science algorithm; much better to outsource this type of work to a dedicated, battle-tested algorithmic library like Gianni's.

However, from our outside perspective, `shortest_path` comes with a substantial irritation. Its output is a single string of the names of the vertices on the shortest path, joined together with ASCII arrows. For example, `"10->5->2-15"`. Suppose that we wanted to use this output to draw a route on a map, and to display this map in a webpage to our user (along with lots and lots of advertisements). In order to display each vertex on our map individually, we'd have to split the string returned by `shortest_path` (in the form `"10->5->2-15"`) back into its component vertices. This is a perfectly doable task, but also an annoying and unnecessary one.

Instead, I would much prefer it if `shortest_path` returned a *list* of the vertices on the shortest path (eg. `['10','5','2','15']`). This would give us maximum flexibility to decide how we want to present the results to our customers. `shortest_path`'s job should only be to calculate data; it shouldn't make any assumptions about how the caller wants to display it.

As a rule of thumb, separate out data calculation from data formatting wherever possible. Have your calculation components return their results as raw lists, dictionaries and objects, and avoid doing anything that smells like "display logic". Pass this output into a second component that knows nothing about how to calculate anything, but knows everything about to make data look good.

This applies even for code that you never intend to be used by anyone else. Separating out responsibilities for calculation and formatting allows you to completely change how your data is displayed without having to change anything about how this data produced (and vice versa).

```
+---------+
|Calculate|
+----+----+
     |
     v
+----+----+
| Format  |
+----+----+
     |
     v
+----+----+
| Output  |
+---------+
```

I've sketched out how I would change `shortest_path` and the way in which it is used [on GitHub][shortest-path-change].

## A second example

I spotted an almost identical problem in a second function called `bfs_traversal`. This function's job is to find and return the shortest distance from a source vertex to *every* other vertex in the graph. The original version of this function returned its output in a fancy display format called a `PrettyTable`. I don't know anything about `PrettyTable` - from some quick Googling it looks like it's a library that can be used to print cleanly structured tables to the terminal. But as a user of Gianni's breadth-first search library I don't *want* to know anything about `PrettyTable`. I just want to receive the data that I asked for in a raw, sensible structure, and then I'll take care of formatting and outputting it as I see fit.

I looked further at the code for `bfs_traversal`, and noticed that it already stores all of its interim data in exactly the kind of raw, dictionary structure that I actually want it to give back to me. The only problem is that the function then tries to be too helpful and do my formatting for me. Fixing this simply requires the removal of the `PrettyTable` code.

This code:

```python
def bfs_traversal(graph, source_vertex):
    distances = {}
    # <do a load of calculations>
    return convert_to_pretty_table(distances)
```

should become this code:

```python
def bfs_traversal(graph, source_vertex):
    distances = {}
    # <do a load of calculations>
    return distances
```

## Conclusion

We've seen how we can analyze the exterior of a piece code from a user's perspective, without having to know anything about what goes on inside. This idea is not specific to programming; we can (and do) critique the user interfaces of complex gadgets without needing to know how they work inside. We might not care to learn how to build a smartphone, but we can still give useful feedback on how one feels to use. Think about how your code might look to someone on the outside who doesn't care how it works and just wants it to be simple and intuitive to work with.

Next week we'll continue to look at Gianni's library, and suggest some more ways in which he could make it more convenient to use for a journey-planner-programmer in a hurry.

Until we meet again:

* To receive all future PFABs as soon as they're published, [subscribe to the mailing list][subscribe]
* Explore the archives: [Migrating bajillions of database records at Stripe][stripe-migration]
* If you've written some code that you'd like feedback on, [send it to me!][feedback]
* Was any of this post unclear? [Email][about] or [Tweet][twitter] at me with suggestions, comments, and feedback on my feedback. I'd love to hear from you.

[pfab1]: https://robertheaton.com/pfab1
[pfab2]: https://robertheaton.com/pfab2
[pfab3]: https://robertheaton.com/pfab3
[pfab4]: https://robertheaton.com/pfab4
[commute-times]: https://github.com/robert/programming-feedback-for-advanced-beginners/blob/master/editions/3-4-5-commute-times/original
[spear-fished]: https://robertheaton.com/2019/06/24/i-was-7-words-away-from-being-spear-phished/
[about]: https://robertheaton.com/about
[twitter]: https://twitter.com/robjheaton
[feedback]: https://robertheaton.com/feedback
[subscribe]: https://advancedbeginners.substack.com
[djikstra]: https://medium.com/basecs/finding-the-shortest-path-with-a-little-help-from-dijkstra-613149fbdc8e
[shortest-path-change]: https://github.com/robert/programming-feedback-for-advanced-beginners/commit/80041bdfe61502d85a3ca4fbf8a46875422ed6ed#diff-ee6b8f847e87b1d0e6d13bd6914415dcL92
[stripe-migration]: https://robertheaton.com/2015/08/31/migrating-bajillions-of-database-records-at-stripe/
[bfs-code]: https://github.com/robert/programming-feedback-for-advanced-beginners/blob/master/editions/6-breadth-first-search/original/main.py
