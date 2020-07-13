



## No keys

We can get rid of the pixel colors in our pixel/ANSI pairs by replacing them with a convention. Instead of writing out every pixel color, we can have our code that reads and writes the file use the convention that we first write the ANSI color that `(0,0,0)` maps to, then `(0,0,1)`, then `(0,0,2)`, and so on. Once we reach `(0,0,255)`, we loop back round to `(0,1,0)`, then `(0,1,1)`, and so on. This convention means that we don't need to write out the pixel colors. We just write out a long list of ANSI colors, and the program that reads the file is responsible for assigning them to the appropriate pixel colors. For example, the snippet from above would become simply:

```
650C03
```

This halves our file size to 6 bytes for every pixel color.

## ASCII

The final step that we're going to make today is to stop thinking about our file in terms of strings and characters, and start thinking about it as a list of bytes.

Each character in an extended ASCII-encoded file takes up a byte of memory. A byte is made up of 8 bits. Each bit can have a value of either 0 or 1, so the 8 bits that make up a byte can together have `2**8 = 256` different values.

However, so far we've only been using a tiny subset of these possible values to represent our colors. We started by using the digits `0-9`, and then added in the letters `A-F` when we switched to writing our numbers as hex. But there are still `256-16 = 240` other byte values that we're not using. This means that we're wasting valuable opportunities to convey extra information. This is like trying to write a book with only one word on each page. We can still convey the same information, it just takes more pages.

We can stop thinking of the contents of our file in terms of characters like `A`, `B`, `1`, and `2`. Instead we can think of the contents in terms of bytes. A byte is effectively a number between 0 and 255. This number is all that is stored on your hard drive. A hard drive has no inherent concept of `A` or `1`. To interpret the bytes as meaningful characters a computer uses an *encoding*. Examples of encodings that you may or may not have come across are ASCII, UTF-8, and Unicode. Encodings can be a fiddly and frustrating subject, so we're going to ignore them.

After we've calculated the ANSI value that a pixel value maps to, we write it to our file. However, instead of writing it as the decimal number "245" or the hex number "F5", we write it as a byte. To do this in Python, we have to open the file in "binary mode" using the `b` flag to `open`:

```python
ansi = # ...calculate an ansi value...

# `w` means write mode
# `b` means binary mode
with open('./color_map.bin', 'wb') as f:
    # `bytes` converts a list of integers to
    # a list of bytes.
    f.write(bytes([ansi]))
```

We use the same scheme for implicitly mapping ANSI values to pixel values as in the hex example - the first pixel is for `(0,0,0)`, the second for `(0,0,1)`, and so on. This gives us a file that is exactly `256*256*256 = TODO` bytes, or `TODO MB` in size. This is Nx smaller than our original JSON file.

## Going *even* further

This is the smallest that a file can possibly be while still explicitly containing all the precomputed answers in a "straightforward" form. However, we could go even further. We could use a *lossless compression algorithm* on the file. Compression algorithms condense blocks of information by using patterns in them to express the same information in a terser manner. If a compression algorithm is lossless, this means that the original information can be perfectly reconstructed from the compressed output. For example, a string that alternates the letters `A` and `B` for ten thousand characters can most straightforwardly be represented as `ABABABABABAB...` and so on, taking up an entire byte for each character. Alternatively it can be represented using logic to the effect of "alternate the characters `A` and `B` for ten thousand characters." Representing the data in this way is a form of compression. Given a piece of code that will summarize the original string and another piece of code that will un-summarize it and turn it back into the original string, it is likely to be more efficient to store the data in a compressed form.

Compressing and uncompressing data takes time. Generally speaking the more space saving you want to make, the more time it takes to deflate and inflate your data. The more regular your input data, the more space savings a compression algorithm will be able to make. Our vague compression algorithm above will have a much harder time squeezing anything out of a string of ten thousand random characters than it did our highly regular `ABABABABAB...`.

We could express our computations in terms of regions. We could calculate and save information to the effect of "every pixel in between these 8 points should be mapped to this ANSI color". This would save us from writing out the same ANSI color over and over again. It would exploit our specific knowledge of our problem, and I imagine that representing our data in this way would give us even more savings over a generic compression algorithm. We'd have to do extra work when we read the file to turn this information into a full, precomputed color map.

## Conclusion

This is all academic, since - as I keep saying - Justin's program is perfectly fast already. Even if we wanted to go the precomputation route, most computers have enormous hard drives that won't notice an extra 300MB file. Even though it's technically more efficient to condense the size of our precomputed color map, doing so won't improve the way our program works in any meaningful way.

Of course, sometimes efficiency is critical. Websites need to be fast; embedded devices don't have much hard drive space. There's nothing wrong with optimizing your code when you need to, and knowing how to do so can often teach you a lot . Just don't feel like you have to unless you have a specific reason. In practice projects "I thought it would be interesting" is a great reason. "I like my program but I feel like a loser when my code is a bit slow" is not.





