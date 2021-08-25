3 or 4 posts:

* Instance vars
* Split out display
* How we represent state - previously an array that works but is fragile. What if scientific calculator? Prefer being more explicit. It's actually quite hard to figure out how to model it - kind of numbers but not

* Total refactor

## Total refactor

* Be more explicit about state and careful about how we represent it. Think about if we had a scientific calc
* Should we have a single-method interface? Honestly not sure. On balance for this level of complexity I quite like it


Also think about principles behind "make this better"



## Instance variables

Instance variables are variables attached to an instance of a class
Used to keep track of data that you want to attach to an instance

For example, in our calculator we need to keep track of the operation that the user is currently working on
Josh does this using an array - I actually don't love this but that's a story for another day

You can also have variables inside instance methods that you don't care about attaching to the object
These variables vanish at the end of the method they are used in
Sometimes they even vanish sooner, perhaps at the end of the if block or loop, depending on the scope rules of your language
(give some quick examples)

This is good. You don't want to keep variables that you don't need

In Jake's code, he's made several variables into instance variables that don't need to be
We don't need to use them outside the scope of the method the are used in
We should use them, do what we need with them, then let our program throw them away

substr
answer

How do you decide which variables you need to attach to an instance and which you don't?
You develop an intuition for it
In general, don't attach variables to instances until you absolutely have to
Think about your object. Does a variable "feel" like a property of that object?

substr is an intermediate variable for a method, won't need it anywhere else. If you do think you need it somewhere else then that's an odd pattern, might suggest you're doing something else wrong
answer is less obvious. Do we need to keep track of the last answer our calculator produced? Maybe
I used 2 principles - don't keep track of it unless we need it, and then I looked at the code and found that we didn't

If we later find that we do need it, that's fine, we can just update our code


## Split out display

Jake's calculator is responsible for calculating, and for updating the display
This is fine for now. Possible future problems:

* Can't easily write automated tests for just the calculating
* Can only be used in conjunction with a UI. WOuldn't it be cool if you could write a script that XYZ
* *TIghtly couples* the business logic and display logic. His code allows us to pass in the display div to the Claculator, which is cool and gives us some flexibility and de-coupling. But what if we wanted to update the display to display each digit separately? Or to add animation when a digit changes?

Makes changing and re-using your code easier

Often referred to as separation of concerns
Single responsibility principles
Sometimes you don't follow them because it's too much abstraction.
Learn with experience where the lines to draw are. Splitting out business logic and display logic is usually a great place to start
"Could I reuse my logic with a completely different display?"
"Could I easily reuse my display with a completely different driver?"

Not quite the same but you can use Gmail and email clients separately and interchangably

We're going to make the smallest change we can
Don't have Calculator update the div, just have it update an internal representation of what it thinks the display output should 