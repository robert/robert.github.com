---
layout: post
title: "PFAB #19: Working with raw bytes"
tags:
  - Programming Projects for Advanced Beginners
  - PFAB
og_image: https://robertheaton.com/images/pfab-cover.png
redirect_from:
  - /pfab19
---
> *This post is part of "Programming Feedback for Advanced Beginners", a regular series that helps you make the leap from cobbling programs together to writing elegant, thoughtful code. [Subscribe now][subscribe] to receive PFAB in your inbox, every fortnight, entirely free.*

On the past three editions of Programming Feedback for Advanced Beginners ([#16][pfab16], [#17][pfab17], [#18][pfab18]) we've been optimizing Justin Reppert's ASCII art generation program. If you haven't read these editions yet then start with them. You'll still get something out of this week's discussion if you don't, but they contain a lot of good stuff that you'll need in order for this week to properly click into place.

## Previously on PFAB

We've been focussing on the portion of Justin's program responsible for adding color to his ASCII art. We've been trying to optimize the algorithm that the program uses to add colors to the ASCII images that it prints to the terminal. Many terminals are only able to print a small number of colors, defined by the [ANSI standard][ansi-colors]. To deal with this limitation we need to write code that maps from the true color of each pixel in our input image to the closest ANSI color.

<p style="text-align: center"><img src="/images/ascii-speed-colors.png" /></p>

One approach we've been taking is to pre-compute the closest ANSI color code to every possible RGB pixel color and store this data in a file. When we run our program to convert an image to ASCII art, we first load up our pre-computed mappings of pixel colors to ANSI codes from our stored file. Then we look up the ANSI code corresponding to the color of each pixel, and print our ASCII character using that code.

[Last time][pfab18] we were working on shrinking the size of the file in which we store our pre-computed mapping so as to make it faster to load. We devised a file format in which each mapping from a pixel color to an ANSI code is represented by 8 somewhat cryptic characters of [*hexadecimal*][hex]. In this format, a block of characters that maps a pixel color to an ANSI code looks something like this:

```
5CFF0152
```

The first 6 characters in a block represent the RGB (red, green, blue) value of the pixel color using the hexadecimal counting system. The 7th and 8th characters in each block represent the ANSI color code that the pixel color maps to.

Let's look at this block in a little more detail. Two hexadecimal digits are capable of representing any number between 0 and 255. The first 2 characters in the block are the amount of red in the pixel color, expressed as a 2-digit hex number (`5C` in the above example). The 3rd and 4th are the amount of green (`FF`), and the 5th and 6th are the amount of blue (`01`). The 7th and 8th are the ANSI code (`52`), which is also a number between 0 and 255.

Since each block is exactly 8 characters long we don't need newlines or any other separator between them. Instead, the code that reads our file is responsible for chunking up the file into blocks of 8 characters itself.

This serialization format is already 70% smaller than our original [*pretty JSON*][pfab17]. But how can we make it even smaller?

## Remove the pixel colors

Currently each block contains both a pixel color (6 characters) and an ANSI code (2 characters). However, we can save significant space by writing only the ANSI codes. If we do this then we'll still need a way to keep track of which pixel color each ANSI code corresponds to, but we can do this using a convention instead of explicitly including 6 characters of pixel color for every pixel/ANSI mapping.

Remember that our file isn't storing the pixel/ANSI mapping for a specific image; it's storing the mapping from a pixel color to an ANSI code for *every* possible pixel color. When our program wants to convert the color of a pixel from a specific image to the closest ANSI code, it looks it up in the pre-computed mapping that it loaded from our file when it started up. Changing the form of our file doesn't change the ANSI code that any pixel color maps to. Instead it expresses the same information using fewer characters.

For our convention we can decree that the first two characters in the file are the closest ANSI code to the pixel color `(0,0,0)`. The next two characters are the closest code to the pixel color `(0,0,1)`, then the next two are for `(0,0,2)`, and so on. Once we reach the code for the pixel color `(0,0,255)` then we loop back round to `(0,1,0)`, then `(0,1,1)`, and so on. In more detail, we write the ANSI codes corresponding to:

```
(0,0,0)
(0,0,1)
(0,0,2)
...
And so on until the B value reaches 255,
at which point we increment the G value
by 1.
(0,0,255)
(0,1,0)
(0,1,1)
(0,1,2)
...
We keep cycling through all the possible
B values and incrementing the G value
each time B reaches 255. Once G reaches
255 we increment R by 1 and repeat the
whole process again.
(0,255,255)
(1,0,0)
(1,0,1)
(1,0,2)
...
And so on until we reach the ANSI code
for (255,255,255), at which point we're done.
(255,255,255)
```

Previously, to represent the fact that `(0,0,0)`, `(0,0,1)`, and `(0,0,2)` all map to the ANSI color code `0`, we would have to write the following (headings, newlines, and spaces added for clarity):

```
Pixel  ANSI
000000 00
000001 00
000002 00
```

Now we are using a convention that says that the first 2 characters in the file are the ANSI code for `(0,0,0)`, the next 2 are the code for `(0,0,1)`, the next 2 are the code for `(0,0,2)`, and so on. This means that we can write the above as the much terser:

```
00 00 00
```

When we do the calculations we'll find that `00` is the closest ANSI code to all the pixel colors from `(0,0,0)` to `(0,0,47)`, but once we reach `(0,0,48)` the closest code becomes `11`, and keeps changing as the pixel color changes.

This approach gets us all the way down to 2 characters - meaning a mere 2 bytes - per block.

## Think in terms of bytes instead of characters

We can still squeeze 1 final byte out of each block. To do this, we'll stop thinking about the contents of our file in terms of strings and characters, and start thinking about it in terms of bytes.

The contents of a file is stored on your hard drive as a long sequence of 0s and 1s. Each 0 or 1 is called a *bit*, but for convenience we more usually talk about groups of 8 bits, which is known as a *byte*. Each of the 8 bits in a byte can have a value of either 0 or 1, so a byte can take any of `2**8 = 256` different values.

If a file is intended to represent text then a computer needs a way to interpret the underlying bytes on its hard drive (like `00101011`) as textual characters (like `A`). The way it makes this translation is called a *character encoding*, which we touched on very briefly last time on PFAB. There are several different common types of encoding, such as ASCII and UTF-8, but we won't go into the details of how they work here.

Our strategy so far has been to express the information that we want to express in terms of characters, and then use a character encoding to save those characters to a file (by default Python 3 uses the UTF-8 encoding). When reconstructing our color map we read those characters back out of the file, and write code that interprets them as numbers.

We started out by representing numbers using the digits `0-9`. We added in the letters `A-F` when we switched to writing our numbers using hex. This means that there are still `256-16 = 240` other values that the bytes in our files could theoretically take that we're not using. This means that we're wasting valuable opportunities to convey extra data. This is like trying to write a book with only one word on each page. We can still convey the same information, it just takes more pages.

This means that we can squeeze our serialized file even smaller. We can stop thinking of the contents of our file in terms of encoded characters like `A`, `B`, `1`, and `2`, which we later re-interpret as numbers. Instead we can think of it in terms of the underlying bytes.

Remember that a byte can take any value between 0-255. Conveniently (and not coincidentally), the ANSI codes that we are trying to store are themselves numbers between 0-255. This means that we don't have to stick with our current approach of storing ANSI codes by writing them out as characters that are turned into bytes using a character encoding. Instead, we can write each ANSI code to our file directly as a single byte, with a single value between 0-255, without having to worry about converting this byte to and from characters. This means that we exploit the full space of each byte, allowing us to convey more information in the same amount of disk space.

To do this in Python, we open our file in "binary mode" by passing the `b` flag to `open`:

```python
# Calculate the ordered list of ansi codes
# as integers.
ansi_ids = # ...TODO...

# Open our output file for writing using "binary mode"
#
# The `w` flag means write mode
# The `b` means binary mode
with open('./color_map.bin', 'wb') as f:
    # `bytes` converts a list of integers to
    # a list of bytes, which we then write to
    # our file.
    f.write(bytes(ansi_ids))
```

When reading our file back into a color map that we use to produce an image, we read the file in binary mode too. We map each code to a pixel color in the same way as in the last hex example. This means that the first ANSI code byte corresponds to the pixel color `(0,0,0)`, the second to `(0,0,1)`, and so on. [Here are the changes I made to our code from last time][diff] to implement this approach.

This approach squishes our file down to a single byte for each pixel color/ANSI code pair, giving us a file that is `256*256*256 = 16.8 million bytes`, or `16.8 MB` in size. This is about 95% smaller than our original JSON file, which weighed in at around 400MB. The past few editions of PFAB have been a lot of (arguably unnecessary) work, but at least we've got something out of it. Surely we're done now?

Not quite.

## Compression algorithms

16.8MB is the smallest that our file can possibly go while still explicitly listing all the precomputed answers. However, there are still more tricks available to us. We could use a *lossless compression algorithm* on our file to scrunch our file up even further. Compression algorithms condense blocks of information by exploiting patterns in their contents to summarize them in a terser manner. For a compression algorithm to be *lossless* it must be able to perfectly reconstruct the original information from the compressed version, not just a rough approximation.

For example, consider a string that alternates the letters `A` and `B` for ten thousand characters. This data can be naively represented as the full string `ABABABABABAB...`, taking up a byte for each character and resulting in a file that is 10MB in size. However, the exact same information can also be condensed into and saved as a much shorter statement to the effect of "alternate the letters `A` and `B` for ten thousand characters". This is (very roughly speaking) the principle behind compression algorithms. A compression algorithm analyzes a block of information (like a file) for patterns (generally much more complex than in this toy example) and uses what it finds to summarize and un-summarize the information.

## Conclusion

This edition of PFAB has been fun, but it's also been almost entirely academic. As I keep saying, Justin's program is perfectly fast already. It might be technically more efficient to condense our precomputed color map, but most computers have enormous hard drives that won't notice an extra 400MB file or two. This means that shrinking our file won't improve our program in any meaningful way. Even if we truly did need to make it smaller for some good and unavoidable reason, in real life we would likely just slap a compression algorithm on our original JSON and call it a day.

Sometimes maximum efficiency *is* critical. Websites need to be fast, and cheap embedded devices need to cope with tiny hard drives. There's nothing wrong with optimizing your code when you need to, and learning how to do so can teach you a lot about how computers work. Just don't feel like you have to. "I thought it would be interesting" is a great reason to optimize your hobby project. "My code works fine already but I feel like a loser when my programs are a bit slow" is not.

## Further reading

PFAB reader Jason D'Souza has written [a great summary][jason] of the results of applying compression algorithms to our color map problem.

[jason]: https://gist.github.com/jasonrdsouza/fd407c579672584bb679780a37c27e37
[hex]: https://www.mathsisfun.com/hexadecimals.html
[pfab16]: https://robertheaton.com/pfab16-how-to-make-your-code-faster/
[pfab17]: https://robertheaton.com/pfab17-precomputation-sounds-like-cheating-but-isnt/
[pfab18]: https://robertheaton.com/pfab18-shrinking-serialized-data/
[subscribe]: https://advancedbeginners.substack.com
[diff]: https://github.com/robert/programming-feedback-for-advanced-beginners/commit/86cda4a4ea636ab6b96509d64aad6ee105a0d002
[ansi-colors]: https://www.lihaoyi.com/post/BuildyourownCommandLinewithANSIescapecodes.html#colors
