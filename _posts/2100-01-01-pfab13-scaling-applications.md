---
permalink: /2100/01/01/pfab13-scaling-applications
layout: post
title: "PFAB #13 - Scaling"
tags: [Programming Projects for Advanced Beginners]
og_image: https://robertheaton.com/images/pfab-cover.png
redirect_from:
  - /pfab13
published: false
---
People worry about scaling
Don't!

But still interesting to think about


Scaling could mean lots of users or lots of places

I don't think I made any of this code faster
We can muse about what circumstances might make us worry about speed - lots of places
Then going through every place would be slow
We could separately keep track of which category is currently enabled and which windows are currently displayed, and jump straight to disabling them
Data that is currently hidden and should stay hidden could be ignored
Come up with an analogy of avoiding wasted work
All this work happens on the frontend, so doesn't depend on the number of users, only the number of places

If we had an enormous amount of data then we would load it from a backend
Don't want to have to load all our places data at once on page load - would make the initial page load stupidly slow and waste a lot of time
THIS DOESN'T mean that the current approach of loading it all is bad but it's OK because the project is small
The current approach is *correct* for a small project. Loading data dynamically from a backend database would be *correct* for large amounts of data. Everything depends.
This matters for number of places, but could also start to matter for number of users if we had lots of users all trying to load data from our database at once
