---
permalink: /2017/12/04/why-not-how
title: Why, not how
layout: post
published: false
---
Last week I was trying to explain what an Object Relational Mapper (ORM) is to my wife, Gaby. I felt like I’d given the same mini-lecture at least ten times, and that every time I did the conversation was the same.

"Hey Rob, what does this ORM library do?"
"Blah blah blah. Blah blah blah blah blah. Blah! Does that help?"
"Not really, but I’ll go back and read the code a bit more."
"Great talk. It’s your turn to see what that snarling sound in the cupboard is by the way."

Slightly surprised, I figured that ORMs must just be harder to wrap your head around than I had thought. Happily, yesterday Gaby told me that she finally understood what they did. I congratulated her for her persistence and congratulated myself for being such a visionary teacher. She said that an eloquent blog post she found online had made everything much clearer, and that they’re actually quite simple once you look at them in the right way. I downgraded myself from "visionary" to "still pretty great".

Upon reflection, it is not surprising that I wasn’t much help. My mini-lectures were invariably along the lines of:

> When using an ORM, you have many classes that inherit from the ORM base model class. Each of these classes maps to a database table, and each instance of a class represents a record in a table. When you load a record from the database, the ORM populates the instance’s fields using the columns in the record.
> (when reading a draft of this post, Gaby helpfully noted that my actual explanation attempts were even less useful than this)

I stopped just short of describing the Ruby meta-programming that makes this all work. Donald Trump is president and sea-levels are rising, and we’ve all got enough problems without worrying about `define_method` and `class_eval`. Nonetheless, with hindsight it’s glaringly apparent that the above mini-lecture does not actually answer the question "what is an ORM?" It does answer the question "give me some implementation details of an ORM" rather handily though. Much more useful would have been:

> An ORM is a library that allows you to read and write data from a database. The main idea is to as far as possible shield you from having to actually write SQL queries, so you write something that looks like `User.load(101873)` rather than `SELECT * FROM users WHERE id=101873`. Let’s have a look at some examples.

Having established when one might use an ORM and why one might bother, with an absolute minimum of technical words requiring italics or air-quotes, we’re now set up perfectly to start talking about how to use them. Let’s practice. What is JSON? Is it "kind of like a series of nested dictionaries and lists that is often sent back in the body on an API’s HTTP response?" Yes, but it’s also "a message format often used for sending structured data between your browser and a server, like the list of posts to display on your Facebook newsfeed, including the content, who wrote them and at what time".

When explaining a technical concept, start by motivating why it is useful or interesting, not how it works. If you can’t then it’s your own fault for buying that Windows Phone in the first place.
