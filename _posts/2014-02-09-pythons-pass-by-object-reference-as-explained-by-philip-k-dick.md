---
layout: post
title: Is Python pass-by-reference or pass-by-value?
custom_meta: The two most widely known and easy to understand approaches to parameter passing amongst programming languages are pass-by-reference and pass-by-value.
bestof: true
tags: [Programming]
---
> "Suppose I say to Fat, or Kevin says to Fat, "You did not experience God. You merely experienced something with the qualities and aspects and nature and powers and wisdom and goodness of God." This is like the joke about the German proclivity toward double abstractions; a German authority on English literature declares, "Hamlet was not written by Shakespeare; it was merely written by a man named Shakespeare." In English the distinction is verbal and without meaning, although German as a language will express the difference (which accounts for some of the strange features of the German mind)."

> <div style="text-align: right">Valis, p71 (Book-of-the-Month-Club Edition) </div>

Philip K. Dick is not known for his light or digestible prose. The vast majority of his characters are high. Like, really, really, really high. And yet, in the above quote from Valis (published in 1981), he gives a remarkably foresighted explanation of the notoriously misunderstood Python parameter passing paradigm. <i>Plus ça change, plus c'est omnomnomnom drugs.</i>

The two most widely known and easy to understand approaches to parameter passing amongst programming languages are pass-by-reference and pass-by-value. Unfortunately, Python is "pass-by-object-reference", of which it is often said:

> "Object references are passed by value."

When I first read this smug and overly-pithy definition, I wanted to punch something. After removing the shards of glass from my hands and being escorted out of the strip club, I realised that all 3 paradigms can be understood in terms of how they cause the following 2 functions to behave:

{% highlight python %}
def reassign(list):
  list = [0, 1]

def append(list):
  list.append(1)

list = [0]
reassign(list)
append(list)
{% endhighlight %}

Let's explore.

<h3 style="font-weight: bolder">The variable is not the object</h3>

"Hamlet was not written by Shakespeare; it was merely written by a man named Shakespeare." Both Python and PKD make a crucial distinction between a thing, and the label we use to refer to that thing. "The man named Shakespeare" is a man. "Shakespeare" is just a name. If we do:

{% highlight python %}
a = []
{% endhighlight %}

then `[]` is the empty list. `a` is a variable that points to the empty list, but `a` itself is not the empty list. I draw and frequently refer to variables as "boxes" that contain objects; but however you conceive of it, this difference is key.

<img src="/images/Intro.jpg">

<h3 style="font-weight: bolder">Pass-by-reference</h3>

In pass-by-reference, the box (the variable) is passed directly into the function, and its contents (the object represented by the variable) implicitly come with it. Inside the function context, the argument is essentially a complete alias for the variable passed in by the caller. They are both the exact same box, and therefore also refer to the exact same object in memory.

<img src="/images/PBRIntro.jpg">

Anything the function does to either the variable or the object it represents will therefore be visible to the caller. For example, the function could completely change the variable's content, and point it at a completely different object:

<img src="/images/PBRReassign.jpg">

The function could also manipulate the object without reassigning it, with the same effect:

<img src="/images/PBRAppend.jpg">

To reiterate, in pass-by-reference, the function and the caller both use the exact same variable and object.

<h3 style="font-weight: bolder">Pass-by-value</h3>

In pass-by-value, the function receives a copy of the argument objects passed to it by the caller, stored in a new location in memory.

<img src="/images/PBVIntro.jpg">

The function then effectively supplies its own box to put the value in, and there is no longer any relationship between either the variables or the objects referred to by the function and the caller. The objects happen to have the same value, but they are totally separate, and nothing that happens to one will affect the other. If we again try to reassign:

<img src="/images/PBVReassign.jpg">

Outside the function, nothing happens. Similarly:

<img src="/images/PBVAppend.jpg">

The copies of variables and objects in the context of the caller are completely isolated.

<h3 style="font-weight: bolder">Pass-by-object-reference</h3>

Python is different. As we know, in Python, "Object references are passed by value".

A function receives a reference to (and will access) the same object in memory as used by the caller. However, it does not receive the box that the caller is storing this object in; as in pass-by-value, the function provides its own box and creates a new variable for itself. Let's try appending again:

<img src="/images/PBORAppend.jpg">

Both the function and the caller refer to the same object in memory, so when the append function adds an extra item to the list, we see this in the caller too! They're different names for the same thing; different boxes containing the same object. This is what is meant by passing the object references by value - the function and caller use the same object in memory, but accessed through different variables. This means that the same object is being stored in multiple different boxes, and the metaphor kind of breaks down. Pretend it's quantum or something.

But the key is that they really are <i>different</i> names, and <i>different</i> boxes. In pass-by-reference, they were essentially the same box. When you tried to reassign a variable, and put something different into the function's box, you also put it into the caller's box, because they were the same box. But, in pass-by-object-reference:

<img src="/images/PBORReassign.jpg">

The caller doesn't care if you reassign the function's box. Different boxes, same content.

Now we see what Philip K. Dick was trying to tell us. A name and a person are different things. A variable and an object are different things. Armed with this knowledge, you can perhaps start to infer what happens when you do things like 

{% highlight python %}
listA = [0]
listB = listA
listB.append(1)
print listA
{% endhighlight %}

You may also want to read about the interesting interactions these concepts have with mutable and immutable types. But those are stories for another day. Now if you'll excuse me, I'm going to read <i>"Do Androids Dream Of Electric Sheep?"</i> - my meta-programming is a little rusty.

<h3 style="font-weight: bolder">Useful links</h3>

<a target="_blank" href="http://foobarnbaz.com/2012/07/08/understanding-python-variables/">http://foobarnbaz.com/2012/07/08/understanding-python-variables/</a>
<a target="_blank" href="http://javadude.com/articles/passbyvalue.htm">http://javadude.com/articles/passbyvalue.htm</a>
