Cryptography challenges for advanced beginners
Like Matasano ones but easier
Don't have to publish them all at once, do 5 or so then publish them


Crypto challenges
Arguably not really crypto, but you'd have to be a real killjob to quibble
Introduction to crypto, programming practice
Familiarity with tests
Brute forcing
Fitness functions - often used in ML
Write some of your code as a lib that you can reuse


At each stage suggest some helper functions that might be useful
Suggest the structure of future solutions, so how we might want to split up our work

Maybe even just publish these one puzzle at a time? Would make it easier to
talk about solutions to the previous puzzles

====

Have a story
Da Vinci code?
Convoluted detective story
Could try having an actual interesting story, doesn't have to be hammy
Don't try to overwrite it - don't want to put off people who don't care about the story or think it sucks

Depressed secret agent who isn't outputing much agenting

Zombie story where people keep dying and throwing their consciousness over to the next person

Act 1 Scene 2 of Julius Caesar
He thinks too much: such men are dangerous. 


Man is dying. Visibly in pain
Both he and his brother had the same disease, no one else cares
Brother found a cure then decided he couldn't be bothered to take it and died
Hid it from his brother

Brother and man had a complex relationship, which is how you say they hated each other if you don't wnat to say so
Stone and Crence were separated at birth? Crece found Stone, Stone told him to piss off? No, too distant

Jealous of eahc other

Stone 
Crence 

AI and man have worked together for a long time. AI doesn't know brother though. Why didn't you ever talk about him?
Man stole AI from space fleet or whatever



Stone dropped his spade and collapsed into the back of the bus.

"You found it?" asked TRACY.
"Yup" said Stone.
"Give it here then." Stone wiped sand and sweat off the disk and pushed it into the van's drive. TRACY hummed and said nothing.
"What does it say?"
"Pretty much exactly what you predicted."
"Cryptic?"
"Oh yes."

"If you'd listened to me then maybe we could have both lived. I knew you. Maybe you knew me too. Maybe that was the problem. He thinks too much: such men are dangerous."

"DSAHJASDHNILJAKSBGYULEFBSD"




There's going to be a whole lot of these, you'll probably want to make your code reusable
You can't afford to get this wrong, better write unit tests





Grumpy old man in a bus in the desert. Back pain. Scientist is his brother
AI computer helping him write his code giving him tips
Can't you just do this?
No I'm broken, can't do any new calculations, I'm basically just dreding up stuff from Wikipedia

Trying to find "the cure". Hidden by mad scientist
Wasn't trying to keep it secret, just trying to keep it obfuscated until someone cared enough to look

> I never made it far, despite - or because of - what I did. He thinks too much: such men are dangerous.



> I never felt taken seriously. The adventures of the dancing men.
> ABCDEFGHIJKLMNOPQRSTUVWXYZ
> ............TODO..........


> Like Harry Potter's Mr. Dudley (Vernon => Vernam)
> Link to GitHub gist with the pad


====

Auto solve Caesar cipher
Reusable function that takes a sentence and tells you what percentage of the words are in the dictionary
Multiple languages!

Just use openSSL somehow, having stolen someone's cert. Or HMAC
Even just implementing mapping a letter to another letter. One time pad

Message with a convoluted, non-cryptographic cipher

Simple XOR as the peak?

http://practicalcryptography.com/ciphers/classical-era/rail-fence/

Say you don't know what type of cipher has been used and have to try everything and use fitness functions

-------

1. Solve Caesar cipher with a known key
2. Solve jumble cipher with known key
3. Solve one-time pad having stolen the pad

4. Solve Caesar cipher without a known key, go on dictionary words as fitness
5. Solve jumble cipher, ditto

6. Caesar cipher, no punctuation so use 4-grams
7. Jumble cipher, ditto
