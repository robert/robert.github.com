---
permalink: /2013/07/29/padding-oracle-attack/
layout: post
title: The Padding Oracle Attack
bestof: true
tags: [Security]
---

We all know that you don't do your own crypto. We know that even though we've cleverly reversed the order of every word, shifted each letter along by 5 and added in dummy text to throw attackers off the scent, our ingenious cipher is going to get crushed to dust by anyone who knows what they're doing (or in this case a moderately intelligent 12 year-old).

But even implementing someone else's secure encryption algorithm is fraught with danger. And even using someone else's secure implementation of an encryption algorithm, with well-chosen secret keys and suchlike, is still open to brutally effective attacks. A skilled attacker needs only a tiny, indirect information leak in order to pick your encryption apart.

My point isn't that you should abandon encryption altogether or bring in $1000/hour consultants whenever you even think about using a cipher. My point is partly that you should never be complacent and should always be on the lookout for any way an attacker could gain *any* insight into your encryption, and partly that the Padding Oracle Attack is an incredibly cool demonstration of this. Read on.

## CBC Mode

CBC, or Cipher-Block Chaining, is a block cipher mode of encryption. This means that it encrypts plaintext by passing individual block of bytes (each character is a byte) of a fixed length through a "block cipher", which uses a secret key to pretty much mess up the block beyond recognition. So if you were encrypting the sentence:

{% highlight text %}
This is a sentence of a carefully chosen length.
{% endhighlight %}

you would encrypt the first block of 16 characters using your chosen block cipher algorithm, then the next block, then the final block. If the final block does not have exactly 16 characters then you add padding until it does (more on this later).

In CBC encryption, each block of plaintext is XORed with the previous ciphertext block before being passed into the cipher. This interdependency between blocks means that each ciphertext block depends on all plaintext blocks processed up to that point. Changing the first character of the plaintext changes every single character of the ciphertext. According to Wikipedia it is "one of two block cipher modes recommended by Niels Ferguson and Bruce Schneier." It is a mean encryption.

<img src="/images/cbc.png">
(Image from <a target="_blank" href="https://privacycanada.net/">Privacy Canada</a>)

## How padding works (important!)

The preferred method of padding block ciphertexts is PKCS7. In PKSC7, the value of each padded byte is the same as the number of bytes being added. So if a block is 12 characters, you pad it with `[04, 04, 04, 04]`. If it is 15 characters, you pad it with `[01]`. If it is exactly 16 characters, you add an entire extra block of `[16] * 16` (<a href="https://en.wikipedia.org/wiki/Padding_(cryptography)#PKCS7" target="_blank">read more</a>).

So a decrypted plaintext with a final block ending in `[... , 13, 06, 05]` is not valid. The original cipher text therefore could not have been valid - there are no allowed plaintexts that would encrypt to that ciphertext.

## The Padding Oracle Attack

It turns out that knowing whether or not a given ciphertext produces plaintext with valid padding is ALL that an attacker needs to break a CBC encryption. If you can feed in ciphertexts and somehow find out whether or not they decrypt to something with valid padding or not, then you can decrypt ANY given ciphertext.

So the only mistake that you need to make in your implementation of CBC encryption is to have an API endpoint that returns `200` if the ciphertext gives a plaintext with valid padding, and `500` if not. This is not unlikely - the Ruby OpenSSL library will be more than happy to help. Using the example code given in the <a target="_blank" href="http://www.ruby-doc.org/stdlib-1.9.3/libdoc/openssl/rdoc/OpenSSL/Cipher.html#documentation:">Ruby docs</a>:

{% highlight ruby %}
decipher = OpenSSL::Cipher::AES.new(128, :CBC)
decipher.decrypt
decipher.key = "the most secret!"
decipher.iv = "also very secret"

plain = decipher.update("thewrongpadding!") + decipher.final
{% endhighlight %}

throws an `OpenSSL::Cipher::CipherError: bad decrypt`, which if uncaught will return a `500` response.

So say we have stolen a ciphertext. If we are able to submit ciphertexts and find out if they decrypt to something with valid padding, how do we use this fact to completely decrypt out stolen ciphertext?

## The intermediate state

To repeat - in CBC encryption, each block of plaintext is XORed with the previous ciphertext block before being passed into the cipher. So in CBC decryption, each ciphertext is passed through the cipher, then XORed with the previous ciphertext block to give the plaintext.

<p style="text-align:center"><img src="/images/cbc2.png" /></p>

The attack works by calculating the "intermediate state" of the decryption (see diagram) for each ciphertext. This is the state of a ciphertext block *after* being decrypted by the block cipher but *before* being XORed with the previous ciphertext block. We do this by working *up* from the plaintext rather than *down* through the block cipher, and don't have to worry about the key or even the type of algorithm used in the block cipher.

Why is the intermediate state so important? Notice that:

{% highlight text %}
I2 = C1 ^ P2
and
P2 = C1 ^ I2
{% endhighlight %}

We know C1 already, as it is just part of our ciphertext, so if we find I2 then we can trivially find P2 and decrypt the ciphertext.

<p style="text-align:center"><img src="/images/cbcreal.png" /></p>

## Manipulating the ciphertext

Remember that we can pass in any ciphertext, and the server will tell us whether it decrypts to plaintext with valid padding or not. That's it. We exploit this by passing in `C1' + C2`, where `C1'` is a sneakily chosen ciphertext block, `C2` is the ciphertext block we are trying to decrypt, and `C1' + C2` is the concatenation of the two. We call the decrypted plaintext block produced `P'2`.

To begin with, we choose `C1'[1..15]` to be random bytes, and `C1'[16]` to be `00`. We pass `C1' + C2` to the server. If the server says we have produced a plaintext with valid padding, then we can be pretty sure that `P2'[16]` must be `01` (as this would give us valid padding). Of course, if the server comes back and tells us that our padding is invalid, then we just set `C1'[16]` to `01`, then `02`, and so on, until we hit the jackpot.

<p style="text-align:center"><img src="/images/cbcfake.png" /></p>

Lets say that it turns out that `C1'[16] = 94` gives us valid padding. So now we have:

{% highlight text %}
I2     = C1'     ^ P2'
I2[16] = C1'[16] ^ P2'[16]
       = 94      ^ 01
       = 95
{% endhighlight %}

We now know the final byte of the intermediate state! Notice that since `C2` is the same as it is in the real ciphertext, `I2` is also the same as in the real ciphertext. We can therefore go back to the ciphertext we are trying to decrypt:

{% highlight text %}
P2[16] = C1[16] ^ I2[16]
       = C1[16] ^ 95
{% endhighlight %}

We plugin in whatever `C1[16]` is and find the last byte of the actual ciphertext! At this stage this will just be padding, so we will have to do some more decrypting before we find something interesting.

## Do it again

We found the last byte by fiddling with `C1'` until we produced something with valid padding, and in doing so were able to infer that the final byte of `P'2` was `01`. We then used the fact that we knew `P2'[16]` and `C1'[16]` to find `I2[16]`. We continue on this theme to find the rest of the bytes of `I2`, and therefore decrypt the ciphertext block.

We now choose `C1'[1..14]` to be random bytes, `C1'[15]` to be the byte `00`, and `C1'[16]` to be a byte chosen so as to make `P2'[16] == 02`:
   
{% highlight text %}
C'1[16] = P'2[16] ^ I2[16]
        = 02      ^ 95
        = 93
{% endhighlight %}

So we can be sure that `P2'` will end in a `02`, and therefore the only way for `P2'` to have valid padding is if `P2[15]` is also `02`! We fiddle with `C1'[15]` until the server does its things and tells us we have passed it a ciphertext that decrypts to a plaintext with valid padding. Say this happens when `C1'[15] = 106` - we do exactly what we did before:

{% highlight text %}
I2     = C1'     ^ P2`
I2[15] = C1'[15] ^ P2'[15]
       = 106     ^ 02
       = 104
{% endhighlight %}

And presto, we know the second last byte of `I2` as well. We can therefore find the second last byte of `P2`, the real plaintext, again in exactly the same way as before:

{% highlight text %}
P2[15] = C1[15] ^ I2[15]
       = C1[15] ^ 104
{% endhighlight %}

Rinse, repeat, and read the entire 16 bytes of `C2`!

## The rest of the blocks

A cipherblock's decrypted form depends only on itself and the preceding cipherblock. So we can apply the above algorithm to every block in the ciphertext (apart from the first one). The first cipherblock would have been encrypted using an IV (initialization vector), a secret cipherblock chosen by the encrypter during the encryption process. Unless we know the IV, we can't decrypt the first block. There is nothing particularly clever we can do here, apart from trying stupidly obvious values like [0, 0, 0, ...] for the IV and seeing if we get anything sensible out. Hopefully the first 16 bytes will just be something like "Dearest Humphrey" anyway.

And that's the Padding Oracle Attack

## So this is why going anywhere near crypto is scary

We know that you don't use your own cryptography algorithms, and so we build on what's already devised and built. It's easy to then feel complacent when you're hiding behind a powerful cipher created by professionals. As long as you keep your secret keys secret and don't store anything in plaintext, you feel immune.

But as we have seen, it only takes the tiniest of side-channel information leaks in order to be completely vulnerable. Our imaginary developer implemented the algorithm perfectly using an existing library, used keys of a perfectly sensible length, and didn't do anything stupid like reuse nonces. Their only mistake was forgetting to catch an obscure exception, and in doing so telling us whether our ciphertexts decrypted to something valid.

Of course, this particular attack could be prevented by catching the exception, rate-limiting requests from the same IP address, or monitoring for suspicious requests, but that's obviously not the point. Attackers will always be sophisticated, and can exploit even the tiniest of implementation imperfections. Be careful with your crypto, even when it's someone else's!

## Thanks to

The <a href="http://www.matasano.com/articles/crypto-challenges/" target="_blank">Matasano Crypto Challenges</a> for switching me onto crypto. Highly highly recommended

Kindly translated into Russian by Alex at <a href="http://habrahabr.ru/post/247527/">habrahabr.ru</a>.
