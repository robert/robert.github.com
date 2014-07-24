---
layout: post
title: Is Ruby pass-by-reference or pass-by-value?
---
The two most widely known and easy to understand approaches to parameter passing amongst programming languages are pass-by-reference and pass-by-value. In one, ruthlessly technical sense, Ruby is pass-by-value, that's the end of the story, and we can all go home. However, we would miss out on a lot of subtlety if we did.

For Ruby does pass its arguments by value, but the values it passes are references.

Say what?

I find it helps to think of there being 2 different types of pass-by-value:

* Pass-value-by-value
* Pass-reference-by-value

Stop crying, everything's going to be OK. All of these paradigms can be simply and intuitively understood by how they cause the following 2 functions to behave:

{% highlight ruby %}
    def reassign(array)
      array = [0, 1]

    def append(array)
      array << 1

    array = [0]
    reassign(array)
    append(array)
{% endhighlight %}l

Let's explore.

<h3 style="font-weight: bolder">The variable is not the object</h3>

In his 1981 sci-fi bizarreo-fest, "<a href="http://en.wikipedia.org/wiki/VALIS" target="_blank">Valis</a>", Philip K. Dick writes that:

> "Hamlet was not written by Shakespeare; it was merely written by a man named Shakespeare."

He points out that there is a subtle difference between a thing, and the label we use to refer to that things. "The man named Shakespeare" is a man. "Shakespeare" is just a name. Ruby makes exactly the same distinction. If we do:

{% highlight ruby %}
    a = []
{% endhighlight %}

then `[]` is an empty array. `a` is a variable that points to this empty array, but `a` itself is not an empty array. I will draw and frequently refer to variables as "boxes" that contain objects; but however you conceive of it, this difference is key.

<img src="/images/Intro.jpg">

<h3 style="font-weight: bolder">Pass-by-reference</h3>

In pass-by-reference, the box (the variable) is passed directly into the function, and its contents (the object represented by the variable) implicitly come with it. Inside the function context, the argument is essentially a complete alias for the variable passed in by the caller. They are both the exact same box, and therefore also refer to the exact same object in memory.

<img src="/images/RubyPBRIntro.jpg">

Anything the function does to either the variable or the object it represents will therefore be visible to the caller. For example, the function could completely change the variable's content, and point it at a completely different object:

<img src="/images/RubyPBRReassign.jpg">

The function could also manipulate the object without reassigning it, with the same effect:

<img src="/images/RubyPBRAppend.jpg">

To reiterate, in pass-by-reference, the function and the caller both use the exact same variable and object.

<h3 style="font-weight: bolder">Pass-value-by-value</h3>

In pass-value-by-value, the function receives a copy of the argument objects passed to it by the caller, stored in a new location in memory.

<img src="/images/RubyPBVIntro.jpg">

The function then effectively supplies its own box to put the value in, and there is no longer any relationship between either the variables or the objects referred to by the function and the caller. The objects happen to have the same value, but they are totally separate, and nothing that happens to one will affect the other. If we again try to reassign:

<img src="/images/RubyPBVReassign.jpg">

Outside the function, nothing happens. Similarly:

<img src="/images/RubyPBVAppend.jpg">

The copies of variables and objects in the context of the caller are completely isolated.

<h3 style="font-weight: bolder">Pass-reference-by-value</h3>

Ruby is pass-by-value, but the values it passes are references.

A function receives a reference to (and will access) the same object in memory as used by the caller. However, it does not receive the box that the caller is storing this object in; as in pass-value-by-value, the function provides its own box and creates a new variable for itself. Let's try appending again:

<img src="/images/RubyPBORAppend.jpg">

Both the function and the caller refer to the same object in memory, so when the append function adds an extra item to the list, we see this in the caller too! They're different names for the same thing; different boxes containing the same object. This is what is meant by passing references by value - the function and caller reference the same object in memory, but accessed through different variables. This means that the same object is being stored in multiple different boxes, and the metaphor kind of breaks down. Pretend it's quantum or something.

But the key is that they really are <i>different</i> names, and <i>different</i> boxes. In pass-by-reference, they were essentially the same box. When you tried to reassign a variable, and put something different into the function's box, you also put it into the caller's box, because they were the same box. But, in pass-reference-by-value:

<img src="/images/RubyPBORReassign.jpg">

The caller doesn't care if you reassign the function's box. Different boxes, same content.

Now we see what Philip K. Dick was trying to tell us. A name and a person are different things. A variable and an object are different things. Armed with this knowledge, you can perhaps start to infer what happens when you do things like

{% highlight ruby %}
    array_a = [0]
    array_b = array_a
    array_b.append(1)
    print array_a
{% endhighlight %}

Now if you'll excuse me, I'm going to read <i>"Do Androids Dream Of Electric Sheep?"</i> - my meta-programming is a little rusty.

<h3 style="font-weight: bolder">Useful links</h3>

<ul>
<li><a target="_blank" href="http://javadude.com/articles/passbyvalue.htm">http://javadude.com/articles/passbyvalue.htm</a></li>
<li><a target="_blank" href="http://stackoverflow.com/questions/1872110/is-ruby-pass-by-reference-or-by-value">http://stackoverflow.com/questions/1872110/is-ruby-pass-by-reference-or-by-value</a></li>
</ul>
