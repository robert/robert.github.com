
https://godoc.org/github.com/coyim/otr3
https://github.com/python-otr/pure-python-otr



TODO: Skylar the sceptical third-party
TODO: do I need to mention socialist millionaires?



## Intro


The physical world has reasonably strong and, by definition, intuitive privacy settings. Suppose that you are having a clandestine conversation with a friend in a local park. If you secure any nearby shrubberies then you can be confident that no one is eavesdropping on you. And unless you're being secretly recorded or filmed, which in most situations is unlikely, you can be similarly confident that no permanent, verifiable record of the conversation is being made. You and your friend can have a secret, off-the-record exchange of views.

Technology makes communication easier, but it also changes its privacy settings. These changes don't necessarily increase or decrease net privacy, but they do change the threats and vectors that participants need to consider. No one can hide in the bushes and overhear your email or instant messages, but they can glimpse your screen over your shoulder or intercept your traffic as it travels over a network. There's no record of a conversation in a park apart from the other person's word, but emails and instant messages create a papertrail, which is both useful and incriminating.

The goal of Off-The-Record Messaging (OTR) is to replicate the privacy properties of casual, in-person conversation. Any fool with years and decades of experience in high-grade cryptography can design a communication protocol that is secure when things go right. OTR focuses on what happens when things go wrong.

Suppose that, as happens all too often, an attacker steals a dump of messages or a secret encryption key. Many encryption protocols can be used against the conversationalists, allowing the attacker to mathematically verify to the world the contents and authors of their stolen messages. The attacker may also be able to use a compromised secret key to decrypt years worth of previously-encrypted messages too.

It's always bad when an attacker steals a dump of messages or a private encryption key, but OTR's goal is to mitigate the fallout. OTR preserves the messages authors' ability to deny having ever sent stolen messages, and prevents the attacker from using a compromised encryption key to decrypt historical traffic.

OTR does this using standard, off-the-shelf ciphers and algorithms. Its (relatively) simple genius is in how it combines these well-understood tools. In order to understand the innovations of OTRM we don't need to pore over pages of mathematical proofs. Instead we have to think extremely precisely about the system-level ways in which known tools are chained together. OTR inspired the first version of the Signal Protocol, the eponymous protocol use by the increasingly popular secure messaging app Signal. Learning how OTR works increases your cryptographic imagination.

This long blog post/short book is based on [Borisov, Goldberg and Brewer 2004][otr-paper], the paper that first introduced OTR. It assumes very little prior knowledge. It can't hurt if you are already familiar in-passing with concepts like public and private keys and cryptographic signatures, but if you aren't then don't worry, we'll cover what you need to know.

The post/book explains for a generalist audience the concepts that Borisov, Goldberg and Brewer might have very reasonably taken for granted in their academic readers. Where they had but 7 pages in an academic journal, we have as long as we like in which to ponder the ways in which OTR intersects with the 2020 US Presidential Election, and how dead bodies in a series of convolutedly-structured rooms illustrate how a protocol can simultaneously achieve both authentication and deniability.

----

Let's consider Alice and Bob. Alice and Bob want to talk to each other online, but, as always in such situations, their privacy is under threat from the evil Eve. Alice and Bob are concerned that Eve may intercept their traffic; compromise their computers; and generally try to find out what they are saying or manipulate the contents of their messages.

One way in which Alice and Bob can prevent Eve from using their network traffic to read or spoof their communication is by using a standard cryptographic protocol like PGP (Pretty Good Privacy) that provides both *encryption* (preventing Eve from reading their messages) and *authentication* (preventing Eve from spoofing fake messages). PGP is very good at facilitating secret, verifiable communication. However, it comes with unexpected and often undesirable side-effects.

## The problems with PGP

Let's start by seeing how PGP works when everything goes according to plan. PGP handles its encryption using an *asymmetric cipher*, which means that encryption and decryption are performed with different keys. In order to use PGP, a user generates a pair of keys, called a keypair. One of these keys is their public key, which they can safely publish and make available to anyone who wants it, even their enemies. The other is their private key, which they must keep secret and safe at all costs. Messages encrypted with their public key can only be decrypted with their private key, and vice-versa.

[DONE-pic][1-pub-pri]
[DONE-pic][2-pri-pub]

Suppose that Alice wants to use PGP to send an encrypted message to Bob. She retrieves Bob's public key from wherever he has published it and uses it to encrypt her message. She sends the resulting ciphertext to Bob, and Bob uses his private key to decrypt and read it. Since the message can only be decrypted using Bob's private key, which only Bob knows, Alice and Bob can be confident that Eve can't read their message.

[DONE-pic][3-basic-enc]

However, even though Bob is the only person who can decrypt Alice's message, Bob has no strong proof that the message really was written by Alice. As far as he's concerned it could have been written and encrypted by Eve, or Eve could have intercepted and manipulated a real message from Alice. To prove to Bob that the message really was written by her, Alice *cryptographically signs* her message before sending it. To generate a cryptographic signature, Alice passes her message through a hash function, which is an algorithm that produces a random-seeming but consistent and fixed-length output for a given input. She encrypts the output of the hash function with her private key, and the result of this encryption is a *cryptographic signature* for her message (we'll see why in a second). Alice appends the signature to her encrypted message, and sends them both to Bob.

[DONE-pic][3-enc-sign]

[TODO-hash-or-encrypt-first?]

When Bob receives the message and signature, he uses the signature to prove to himself that the message was written by Alice and has not been tampered with. He does this by performing a similar but different process to the one that Alice used to generate the signature. He too calculates the hash of Alice's message, but he then uses Alice's *public* key to *decrypt* Alice's signature. If the resulting plaintext matches the hash of Alice's message then Bob can be confident that the signature was generated using Alice's private key, and that the contents of the message haven't changed. Since Alice is the only one who knows her private key, she is the only one who could have generated the signature, and so Bob can infer that the message really was written and signed by Alice.

[DONE-pic][4-enc-sign]

Messages are hashed before they are signed because the output of a hash function is always of the same, fixed length, meaning that signatures are also of the same fixed length. If they were not hashed then a long message would produce a long signature that would require unnecessary bandwidth to transmit, and a tiny message would produce a tiny signature that could be easy to forge.

[DONE-pic][5-sig-length]

This process is how PGP gives Alice and Bob privacy and authentication. If Eve is listening on the connection between Alice and Bob's computers and intercepts their encrypted message then she won't be able to decrypt it, because she doesn't know Bob's private key. And if Eve tries to spoof a fake message to Bob from Alice then she won't be able to produce a valid signature, because she doesn't know Alice's private key. When Bob tries to verify a signature forged by Eve, he will discover that something is afoot. If everything goes perfectly, PGP works perfectly.

However, in the real world, we have to plan for the very real possibility that sometimes everything does not go perfectly. PGP relies heavily on private keys staying private. If a user's private key is stolen then the security properties previously underpinned by it are entirely blown apart. If Eve has access to Bob's private key and intercepts Alice's message on its way to Bob, Eve can decrypt and read the message. If Eve also has access to Alice's private key then she can use it to sign fake messages that Eve herself has written, making it look like these messages came from Alice.

[DONE-pic][6-eve-stolen]

All encryption is underpinned by the assumption that private keys stay private, and so we should expect any protocol to be severely damaged if this assumption is broken. But with PGP the fallout gets worse. We know already that if Eve steals a private key then she can use it to decrypt any future PGP messages that she intercepts and that were encrypted using the corresponding public key. But suppose that Eve has been listening on the connection between Alice and Bob for months or years, patiently storing all of the encrypted traffic. Previously she had no way to read any of this traffic, but with access to Bob's private key Eve can read all of the traffic she has stored that was encrypted using Bob's public key. This gives her access to extra reams of historical, previously-secret messages.

But it gets *even* worse. Alice cryptographically signed all her PGP messages so that Bob could be confident that they were authentic. However, whilst generating a signature requires Alice's private key, *verifying* her signature only requires her public key, which is typically freely available. This means that Eve can use Alice's signatures to verify messages sent by Alice and stolen from Bob just as well as Bob can. If Eve gets access to Alice and Bob's signed messages, she also gets access to a cryptographically verifiable transcript of their communications. This prevents Alice and Bob from credibly denying that the stolen messages are real. In a few sections' time we'll look at some real-world examples of how cryptographic signatures like this can make life more awkward for victims of hacks.

PGP gives secrecy and authentication. But it's brittle, and it isn't robust to private key compromise. We'd ideally like an encryption protocol that better mitigates the consequences of a catastrophic hack. In particular we'd like two extra properties. First, we'd like *deniability*, which is the ability for a user to credibly deny that they ever sent hacked messages. And second, we'd like *forward secrecy*, which is the property that if an attacker compromises a user's private key then they are still unable to read past traffic that was encrypted using that keypair.

Let's examine these properties in detail, see how they work, and see why they are so desirable. Then we'll look at how they are achieved in Off-The-Record-Messaging.

### Deniability

Deniability is the ability for a person to credibly deny that they knew or did something. Statements from in-person conversations are normally easily deniable. If you claim that I told you that I planned to rob a bank then I can credibly retort that I didn't and you can't prove otherwise. Email conversations can be deniable too (although see below for a look into why they often aren't). Suppose that you forward to a journalist the text of an email in which I appear to describe my plans to rob eight banks. I can credibly claim that you edited the email or forged it from scratch. Once again, you can't prove that I'm lying. The public or the police or the judge might still believe your claims over mine, but nothing is mathematically provable and we're down into the murky world of human judgement.

By contrast, we've seen that PGP-signed messages are not deniable. If Alice signs a message and sends it to Bob then Bob can use the signature to validate that the message is authentic. However, anyone else who comes into possession of the message can also validate the signature and prove that Alice sent the message in exactly the same way that Bob did. Alice is therefore permanently on the record as having sent these messages. If Eve hacks Bob's messages, or if Alice and Bob fall out and Bob forwards their past communication to her enemies, Alice cannot plausibly deny having sent the messages in the same way as she could if she had never signed them. If you forward to a journalist an email in which I describe my plans to rob eight banks and that I cryptographically signed, I will be in a pickle.

On the face of it, deniability is in tension with authentication. Authentication requires that Bob can verify that a message was sent by Alice. Deniability requires that Alice can deny having ever sent that same message. As we'll see, one of the most interesting innovations of OTRM is how it achieves these seemingly contradictory goals simultaneously.

Technically anything can be denied, even cryptographic signatures. I can always claim that someone stole my computer and guessed my password, or infected my computer with malware, or stole my private keys while I was letting them use my computer to look up the football scores. These claims are not impossible, but they are unlikely and tricky to argue. Deniability is a sliding scale of plausibility, and OTRM goes goes to great lengths to make denials more believable and therefore more plausible. "A dog ate my homework" is a much more credible excuse if I ostentatiously purchased twenty ferocious dogs the day before.

On the flip side, it's perfectly reasonable to believe that a technically deniable message is authentic. We all assess and believe hundreds of claims every day on the vague balance of probability, with no mathematical proof of their validity. Screenshots of a text conversation might be enough to convince you of my plans to rob fifty-five banks, even if no cryptographic signatures are available.

But if signatures are available then that does make everything much easier.

### The Podesta Emails and the Hunter Biden laptop

For message senders, deniability is almost always a desirable property. There's rarely any advantage to having everything you say or write go into an indelible record that might come back to haunt you. This is not the same thing as saying that deniability is an objectively good thing that always makes the world strictly better. Just take the intertwined stories of the DKIM email verification protocol, US Democratic Party operative John Podesta, and the laptop of Hunter Biden, President Joe Biden's son.

Cryptographic signatures are used in many protocols, not just PGP. And where there's a cryptographic signature, there might also be a problem with deniability. In the old days, when an email provider received an email claiming to be from `rob@robmail.com`, there was no way for the provider to verify that the email really was sent by `rob@robmail.com`. They therefore typically hoped that it was, and accepted the email. Spammers abused this trust to bombard email inboxes with forged emails. The DKIM protocol was created in 2004 to allow email providers to verify that emails they receive are legitimate, and the procotol is still used to this day.

In order to use DKIM, email providers generate a signing keypair and publish their public key to the world (via a DNS TXT record, although the exact mechanism is not important to us here). When a user sends an email, their email provider generates a signature for their email using the provider's private signing key. The provider inserts this signature into the outgoing message as an email header.

[DONE-pic][7-dkim]

When the receiver's email provider receives the message, it looks up the sending provider's public key and uses it to check the DKIM signature against the email's contents, in exactly the same way as a recipient would check a PGP message signature against the PGP message's contents. If the signature is valid, the receiving provider accepts the message. If it isn't, the receiving provider assumes that the message is forged and rejects it. Since spammers don't have access to mail providers' signing keys, they can't generate valid signatures, and so can't generate fake emails that pass DKIM verification. DKIM is therefore very good at preventing email forging.

However, a DKIM signature also provides permanent proof that the signed message is real and unaltered, in much the same way as a PGP signature. DKIM signatures are part of the contents of an email, so they are saved in the recipient's inbox. If a hacker steals all the emails from an inbox, they can use the sending provider's public DKIM key to validate the DKIM signatures themselves, again in the same way as they would validate a PGP signature. The attacker already knows that the emails are legitimate, since they stole them with their own two hands. However, DKIM signatures allow them to prove this fact to a sceptical third-party as well, obliterating the emails' deniability. Email providers change, or *rotate*, their DKIM keys regularly, which means that the public key currently in their DNS record may be different to the key used to sign the message. Fortunately for the attacker, historical DKIM public keys for many large mail providers can easily be found on the internet.

Matthew Green, a professor at Johns Hopkins University, [points out](https://blog.cryptographyengineering.com/2020/11/16/ok-google-please-publish-your-dkim-secret-keys/) that making emails non-repudiatable like this is not one of the goals of the DKIM protocol. Rather, it's an odd side-effect that wasn't contemplated when DKIM was originally designed and deployed. Green also argues that DKIM signatures make email hacking a much more lucrative pursuit. It's hard for a journalist or a foreign government to trust a stolen dump of unsigned emails sent to them by an associate of an associate of an associate, since any of the people in this long chain of associates could have faked or embellished the the emails' contents. However, if the emails contain cryptographic DKIM signatures generated by trustworthy third parties (such as a reputable email provider), then the emails are provably real, no matter how questionable the character from whom they came. Cryptographic signatures don't decay with social distance or sordidness. Data thieves are able to piggy-back off of Gmail's (or any other DKIM signer's) credibility, making stolen, signed emails a verifiable and therefore more valuable commodity. 

In March 2016, Wikileaks published [a dump of emails](https://wikileaks.org/podesta-emails/) hacked from the Gmail account of John Podesta, a US Democratic Party operative. Alongside each email Wikileaks published [the corresponding DKIM signature](https://wikileaks.org/podesta-emails/emailid/10667), generated by Gmail or whichever provider sent the email. This allowed independent verification of the messages, which prevented Podesta from claiming that the emails were nonsense fabricated by crooks.

You may think that the Podesta hack was, in itself, a good thing for democracy, or a terrible thing for a private citizen. You may believe that the long-term verifiability of DKIM signatures is a virtue that increases transparency, or a failing that incentivizes email hacking. But whatever your opinions, you'd have to agree that John Podesta definitely wishes that his emails didn't have long-lived proofs of their provenance, and that most individual email users would like their own messages to be sent deniably and off-the-record.

Matthew Green has a counter-intuitive but elegant solution to this problem. Google already regularly rotate their DKIM keys. They do this as a best practice precaution, in case the keys have been compromised without Google realizing. Green proposes that, once Google (and other mail providers) have rotated a DKIM keypair and taken it out of service, they *publicly publish* the keypair's *private key*.

Publishing an old private key would mean that anyone could use it to spoof a valid-looking DKIM signature for an email. If the keypair were still in use, this would make Google's DKIM signatures useless. However, since the keypair has been retired, revealing the private key does not jeopardize the effectiveness of DKIM in any way. The purpose of DKIM is to allow *email recipients* to verify the authenticity of a message *at the time they receive that message*. Once the recipient has verified and accepted the message, they need never verify it again. The signature has no further use unless someone - such as an attacker - wants to later prove the provenance of the email.

Since DKIM only requires signatures to be valid and verifiable when the email is received, it doesn't matter if an attacker can spoof a signature for an old email. In fact it's desirable, because it renders worthless all DKIM signatures that were legitimately generated by the email provider using the now-public private key. Suppose that an attacker has stolen an old email dump containing many emails sent by Gmail, complete with DKIM signatures generated using Gmail's now-public private key. Previously, only Google could have generated these signatures, and so the signatures proved that the emails were genuine. However, since the private key is public, now anyone can trivially generate valid signatures themselves. Unless the attacker can prove that their signatures were generated while the key was still private (which in general they won't be able to), the signatures don't prove anything about anything to a sceptical third party. This applies even if the attacker really did steal the emails and is engaging in only a single layer of simple malfeasence.

The theory makes sense and the Podesta Emails are interesting, but how much difference does any of this really make? Wouldn't everyone have believed the Podesta Emails anyway, without the signatures? Possibly. But consider a more recent example in which I think that DKIM signatures could have changed the course of history, had they been available.

During the 2020 US election campaign, Republican operatives claimed to have gained access to a laptop belonging to Hunter Biden, the son of the then-Democratic candidate and now-President Joe Biden. The Republicans claimed that this laptop contained gobs of explosive emails and information about the Bidens that would shock the public.

The alleged story of how the Republicans got hold of this laptop is somewhat fantastical, running by way of a computer repair shop in a small town in Delaware. However, somewhat fantastical stories are sometimes true, and this is exactly the type of situation in which cryptographic signatures could play a big role in establishing credibility. It doesn't matter how wild the story is if the signatures validate. Indeed, in an effort to prove the laptop's provenance, Republicans released a single email, with [a single DKIM signature](https://github.com/robertdavidgraham/hunter-dkim), that they claimed came from the laptop.

[DONE-pic][8-dkim-email]

The DKIM signature of this email is valid, and it does indeed prove that `v.pozharskyi.ukraine@gmail.com` sent an email to `hbiden@rosemontseneca.com` about meeting the recipient's father, sometime between 2012 and 2015. However, it also raises a lot of questions, and provides a perfect example of the sliding-scale nature of deniability. The single email doesn't prove anything more than what it says. It doesn't prove who `v.pozharskyi.ukraine@gmail.com` is (although other evidence might), it doesn't prove that there are thousands more like it, and it doesn't prove that the email came from the alleged laptop.

The email is cryptographically verifiable, but without further evidence the associated story is still plausibly deniable. I imagine that if a full dump of emails and signatures had been released, a la Wikileaks and Podesta, then their combined weight could have been enough to overcome many circumstantial denials. If they were also sitting on a stack of additional, also-cryptographically-verifiable material then it's hard to understand why the Republicans chose to release only this single, not-particularly-incendiary example. Maybe the 2020 election could have gone a different way. Cryptographic deniability is important.

----

You can't deny that we've studied deniability in depth, so now let's look at the other new property that Off-The-Record-Messaging provides: forward secrecy.

## Forward Secrecy

Suppose that Alice and Bob are exchanging encrypted messages over a network connection. Eve is intercepting their traffic, but since their messages are encrypted she can't read them. Nonetheless, Eve decides to store Alice and Bob's encrypted traffic, just in case she can make use of it in the future.

Suppose also that a year later, Eve compromises one or both of Alice and Bob's private keys. For many encryption protocols, Eve would be able to go back to her archives and use her newly stolen keys to decrypt all the encrypted messages that she has stored over the years. This would be even more disastrous than if Eve could only read Alice and Bob's future messages. However, if Alice and Bob were using an encryption protocol with the remarkable property of *forward secrecy* then Eve would not be able to decrypt their stored historical traffic, even with access to their private keys.

Cryptography is a very precise field so I'll quote a technical definition of forward secrecy to show that I'm also a very precise person:

> [Perfect] Forward Secrecy is a feature of specific key agreement protocols that gives assurances your session keys will not be compromised even if the private key of the server is compromised. *([Wikipedia](https://en.wikipedia.org/wiki/Forward_secrecy))*

We don't need to know the mathematics of forward secrecy, but a quick synopsis is important. First, a few definitions. An encryption algorithm, or *cipher*, can be either symmetric or asymmetric. A symmetric cipher is one in which the same key is used to encrypt and decrypt the message, and an asymmetric cipher is one in which different keys are used for encryption and decryption.

[DONE-pic][9-symm]

PGP uses an asymmetric cipher. This means that different keys - specifically, a user's public and private keys - are used to encrypt and decrypt a message. We know already that encrypting a message directly using the recipient's public key does not give forward secrecy, because if an attacker compromises the recipient's private key then the attacker can read all of their PGP-encrypted messages.

[DONE-pic][10-asymm]

Encryption protocols that provide forward secrecy typically require Alice and Bob to instead use a symmetric cipher. Since a symmetric cipher uses the same key to encrypt and decrypt a message, Alice and Bob need to agree on a shared, symmetric key that they both know the value of. As we'll soon see, in order to achieve forward secrecy they need to go even further, and use each symmetric key only briefly before forgetting it and agreeing on a new one. These temporary symmetric keys are often called *ephemeral* or *session keys*.

Alice and Bob agree on each symmetric key via a process known as a *key-exchange*, which we'll look at in more detail shortly. Once Alice and Bob have agreed on a short-lived symmetric key, they use it to encrypt and decrypt a small number of messages (exactly 1, in the most cautious implementations). Finally, once they've finished with a key, Alice and Bob "forget" it, wiping it from their RAM, disk, and anywhere else from which an attacker might be able to recover it.

[DONE-pic][11-key-exchange]

Alice and Bob clearly need to agree on each symmetric key in a way that prevents Eve from working out the value of the key, even if she watches all of their key-exchange traffic. Agreeing on a secure session key over an insecure network is not trivial. Some key-exchange protocols take a simple approach that does indeed keep session keys secret, but does not provide forward secrecy.

In these, non-forward-secrecy protocols, Alice chooses a random shared secret and then uses Bob's public key to encrypt that shared secret. Alice then sends the encrypted shared secret to Bob, who uses his private key to decrypt it. Since Eve does not have access to the recipient's private key, she cannot read the shared secret. Alice and Bob are therefore free to use the shared secret to symmetrically encrypt and decrypt their message.

[DONE-pic][12-simple-key-exchange]

This approach keeps session keys secret so long as Bob's private key stays secret, but it does not provide forward secrecy. Suppose that Eve stores all of Alice and Bob's encrypted traffic and then later compromises Bob's private key. She can use this key to decrypt the encrypted session keys, and then use those session keys to decrypt the actual messages that Alice sent to Bob.

To give forward secrecy - and this is the very clever part - Alice and Bob must agree on each session key in such a way that prevents Eve from working out its value, even if she also compromises their long-lived private keys. Alice and Bob do still use their private keys during these key-exchanges, but only in order to prove their identities to each other.

OTRM uses a key-exchange protocol called *Diffie-Hellman*, which we'll look at more later. If Alice and Bob agree their session keys using a key-exchange protocol like Diffie-Hellman and fully forget them once they're no longer needed, then there is no way for anyone to work out what the values of those keys were; even the attacker, and even Alice and Bob. There is therefore no way, in any circumstances, for anyone to decrypt traffic that was encrypted using one of these forgotten keys. Forward secrecy, and with it one of the primary goals of OTRM, has been achieved.

Forward secrecy is often called "perfect forward secrecy", including by many very eminent cryptographers. Other, similarly eminent cryptographers object to the word "perfect" because (my paraphrasing) it promises too much. Nothing is perfect, and even when a forward secrecy protocol is correctly implemented, its guarantees are not perfect until the sender and receiver have finished forgotting a session key. Between the time at which a message is encrypted and the key is forgotten lies a window of opportunity for a sufficiently advanced attacker to steal the session key from the participants' RAM or anywhere else they might have stored it. In practice the guarantees of forward secrecy are still strong and remarkable. But when discussing Off-The-Record Messaging, a protocol whose entire reason for existence is to be robust to failures, this is exactly the kinds of edge-cases we should contemplate.

----

We knew already that encryption and authentication were highly desirable properties for a secure messaging protocol. Encryption prevents attackers from reading Alice and Bob's messages, while authentication allows them to be confident that they are talking to the right person and prevents attackers from modifying or faking their messages.

Now we've seen why deniability and forward secrecy are important too. Deniability allows participants to credibly claim to have not sent their messages in the event of a compromise. This mirrors the privacy properties of real-life conversation and makes the fallout of a data theft less harmful. Forward secrecy, the other property that we discussed, prevents attackers from reading historical encrypted messages, even if they compromise the long-lived private keys used at the base of the encryption process.

The goal of OTRM is to achieve all of these properties simultaneously, and now we're ready to see how. We'll start by looking at the broad mechanics of how an OTRM exchange works, then we'll delve deeper into its subtler design decisions.

## Off The Record Messaging

At a high level, an OTRM exchange looks similar to that of many other encryption protocols. To exchange an OTRM message, the sender and recipient must:

* Agree on a secret encryption key
* Verify each other's identities

Then the sender must:

* Encrypt the message
* Sign the message
* Send the message

And the recipient must:

* Decrypt the message
* Authenticate its contents

This sounds straightforward enough, but OTRM's insatiable hunger for deniability and forward secrecy mean that there's a lot of nuance in those little bullet points. There are also a few extra steps that I've left out for now because they won't make much sense until we get there.

Let's start at the top.

## Agreeing on an encryption key

OTRM performs its encryption using shared, symmetric, ephemeral session keys, as described in the "Forward Secrecy" section above. In short, Alice and Bob agree on a symmetric key, then use it to encrypt a message with a symmetric cipher. Once the message has been received and decrypted, they forget the session key and re-agree on a new one. The cadence at which new keys are agreed is discussed in detail in [the original OTR paper][otr-paper], but for our purposes we can assume that they are rotated roughly every message.

[DONE-pic][13-new-keys]

### Diffie-Hellman key exchange

In OTRM, Alice and Bob achieve forward secrecy by agreeing on their shared secret keys using a process called a Diffie-Hellman key exchange. The guts of Diffie-Hellman are complicated and not crucial to an understanding of OTRM. But, roughly speaking, Alice and Bob each separately choose a random secret number. They each send the other a specially-chosen number that is derived from, but isn't, their own random secret number. Now each knows their own random secret number, as well as the derived number that the other sent them. Thanks to the careful construction of the Diffie-Hellman protocol, each can use this information to derive the same final, secret key, which they can use as their shared session key. Even if Eve snoops on their communication and sees both of the derived numbers that they exchanged, she is unable to compute the final, secret key, because she doesn't know either of their initial random secrets.

[DONE-pic][14-eve-snoops]

Wikipedia has a good anology that uses paint instead of numbers [LINK-https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange#General_overview], but if you don't get it then don't worry, the details aren't important to us. What matters is that Diffie-Hellman allows Alice and Bob to agree on a shared symmetric key in a way that gives them forward secrecy.

## Verifying identities

We've described how Alice and Bob can agree on a shared secret session key that they can use for symmetric encryption. However, we haven't yet considered how they can verify the identity of the person they've agreed a session key with. At the moment Eve could intercept and drop all of Alice and/or Bob's traffic, and then spoof a separate Diffie-Hellman key-exchange with each of them herself! Alice and Bob would each have agreed a shared secret, but with Eve instead of each other. Eve would be able to read their messages and spoof replies, and Alice and Bob would have no way of knowing what had happened.

[DONE-pic][15-eve-key]

Even though OTRM doesn't use public key cryptography to directly encrypt its messages, it does use public key cryptography for identity verification. The original OTR paper ([Borisov, Goldberg and Brewer 2004][otr-paper]) recommended an elegant way to verify the identities of participants in a Diffie-Hellman key exchange. However, a few years later another paper ([Alexander and Goldberg 2007](https://www.cypherpunks.ca/~iang/pubs/impauth.pdf)) was published that described a weakness in the original approach. The second paper proposed a broadly similar but more complex alternative. Today we'll discuss the original, simpler, if slightly flawed procedure, since it's still a good illustration of the general principle.

We've seen how Alice and Bob send each other intermediate values that they derived from their secret, random values. We've seen also how Alice and Bob combine the other person's intermediate value with their own secret value to produce their shared secret key.

[TODO-PIC]

To prove their identities to each other, when Alice and Bob each sign the intermediate values that they send to the other person. Then, when they receive a signed intermediate value, they verify the signature against the other person's public key. If the signature doesn't check out, they abort the conversation. If it does, they can be sure that the secret value corresponding to this intermediate value is known only the person who signed the intermediate value. This allows Alice and Bob to each be sure that they're agreeing a shared secret with the right person.

[TODO-PIC]

Eve can still intercept and try to tamper with Alice and Bob's traffic, but she won't be able to get them to accept an intermediate Diffie-Hellman value derived from her own random secret. She therefore won't be able to trick them into negotiating an encrypted connection with her instead of each other.

On the other hand, Alexander and Goldberg 2007 does show other ways in which Eve can manipulate a key-exchange performed in this way. Eve can have Alice and Bob agree a connection with each other, but trick Bob into believing that he is talking to Eve when he is really talking to Alice.

[TODO-PIC]

Eve still can't read their messages, but this is nonetheless an unnacceptable level of shennanigans to allow in an otherwise robust protocol. OTRM therefore now uses the more intricate approach outlined in Alexander and Goldberg 2007.

[TODO-PIC]

Astute readers may be surprised by the very idea of this step. Haven't we been saying that public key cryptographic signatures are the enemy of deniability? We have, and this is a good instinct. However, all Alice and Bob sign are their intermediate key exchange values. All these signatures prove is that Alice and Bob exchanged two random-looking values. Alice and Bob don't sign their actual messages using their private keys, because this would leave them vulnerable to the deniability problems we've discussed previously.

Now that Alice and Bob have agreed on a shared secret key, Alice has to pass that key into a cipher in order to encrypt her message.

## Encrypting the message

A secret key agreed using Diffie-Hellman can be used with any symmetric cipher. In OTRM, Alice and Bob use a *stream cipher with AES in counter mode*. Once again, the details of what this means and how it works are not important to us. We can treat this cipher as a black box that Alice and Bob can combine with their symmetric key to encrypt or decrypt a message. What is important to us is that OTRM uses a stream cipher because it is *malleable*, meaning that it is particularly *easy* for an attacker to tamper with. We'll see why this counter-intuitive property is desirable shortly.

[TODO-pic]

Alice and Bob have now agreed on a key, verified each other's identities, and we've told them which cipher to use. They haven't used their private keys to sign anything important, which means that there's nothing cryptographically tying them back to their message in the event of a compromise. They are therefore ready to use their key and cipher to encrypt, exchange, and decrypt a message.

However, something is missing. In PGP, the job of a cryptographic signature is to prove both that a message really was originally sent by its purported sender, and that it hasn't been tampered with in transit. Because they signed their Diffie-Hellman key-exchange, Alice and Bob can each be confident in the other's identity, and so can be confident that no one else will be able to read their encrypted messages. But we haven't yet given them a way to be confident that their encrypted messages haven't been tampered with. The fact that a stream cipher is malleable and therefore particularly easy to tamper with makes this check especially important for OTRM.

Let's see how OTRM authenticates the contents of its messages without jeopardizing Alice and Bob's ability to deny that they sent them.

## Authenticating the message's contents

By performing a Diffie-Hellman key exchange, Alice and Bob have agreed on a shared secret key and have verified each other's identities. Alice can now use their shared secret key to encrypt and send a message, and be confident that only Bob will be able to read it.

However, even though Eve can't read Alice's message, she may still try to tamper with it on its way to Bob. Indeed, as we've just seen (although we haven't yet seen why), OTRM makes it especially *easy* for Eve to tamper with the message by using a stream cipher to perform its encryption. OTRM therefore needs to bolt on an extra piece of authentication so that Bob can verify that the message is unmolested.

PGP achieves this authentication by having the sender sign their messages using their private signing key. Unfortunately, as we know, an attacker can use PGP signatures to prove that stolen communication is genuine. OTRM avoids this problem and preserves deniability by being very careful about what information it signs and how. Think of a shady business owner who does all their deals through handshakes and verbal agreements because they don't want to put their signature onto any potentially incriminating documents. The shifty business owner won't sign a purchase order for five hundred stolen TVs, but they might put their name to a birthday card for their Auntie Sarah.

Alice and Bob use their private keys to prove their identities to each other by signing parts of their Diffie-Hellman key exchange. These signatures only authenticate their key exchange; they don't prove anything to Alice and Bob about the authenticity of the messages that they exchange using this key. Alice and Bob can be confident that Eve won't be able to read their messages, but they can't yet be confident that she won't be able to tamper with the messages without them realizing.

Since Alice and Bob don't want to sign their messages using their private signing keys, OTRM has to prove the integrity of its messages using a different type of cryptographic signature: an HMAC (Hash-Based Message Authentication Code). The critical property of an HMAC signature is that it is *symmetric*. In the same way that a symmetric cipher performs both encryption and decryption with the same key, a symmetric signature is both generated and verified using a single shared secret key. We'll see why this is important shortly.

[TODO-pic]

In order to generate an HMAC signature for a message, the signer passes the message and the secret key into the HMAC algorithm (how HMAC works internally is not important to us). The algorithm gives the signer back an HMAC signature, and the signer sends the message and HMAC signature to the recipient. In order to verify the signature, the recipient performs the same process, passing the message and the shared secret signing key into the HMAC algorithm, and getting back an HMAC signature. If the signature that the recipient calculates matches the signature provided by the sender then the recipient can be confident that the message has not changed and has not been tampered with.

[TODO-pic]

In order to use HMAC signatures to authenticate their messages, the sender and recipient need to agree on a shared secret signing key. In OTRM they use a *cryptographic hash* of their shared secret encryption key as their shared secret signing key.

[TODO-pic]

A cryptographic hash function is a *one-way* function that produces a random-seeming but consistent output for each input. Given an input it is very easy to calculate the cryptograhic hash output. But by contrast, given a cryptographic hash output it is impossible to calculate the input that produced it. Using the hash of their encryption key as their signing key is convenient, since it removes the need for Alice and Bob to perform another key-exchange dance. It also provides a subtle contribution towards deniability that we will discuss later.

[TODO-pic]

With an encryption secret and a signing secret both agreed, the sender signs their message using the shared signing secret and the HMAC algorithm. The sender encrypts the message and signature together using the shared encryption secret and a stream cipher with AES in counter mode. The sender then sends their encrypted message and signature to the recipient. Once the recipient receives the message they perform the same process in reverse: they decrypt the message in order to read it, and verify the HMAC signature in order to ensure it has not been tampered with.

[TODO-pic]

## An unexpected twist: publishing the signing key

Penultimately and oddly, the sender *publishes* the shared signing key to the world. This is safe because the HMAC key is a cryptographic hash of the encryption key, and so cannot be used to reconstruct the encryption key. However, this doesn't tell us why it is actively a useful thing to do; we'll talk about this in the next section.

Once the recipient has received, decrypted, and verified a message and the sender has published the private signing key, the participants can both forget and delete their session key. This step is necessary in order to preserve forward secrecy and make it impossible for an attacker to ever penetrate their encrypted traffic. The participants negotiate a new shared session encryption key for their next message.

In summary:

1. Sender and recipient agree on a secret encryption session key using Diffie-Hellman key exchange. They prove their identities to each other by signing the intermediate values in the exchange
2. Sender signs their message with an HMAC. They use a signing key equal to the cryptographic hash of the encryption key from step 1
3. Sender uses the encryption key from step 1 to encrypt their message and signature
4. Sender sends the encrypted ciphertext to the recipient
5. Recipient decrypts the cipherext and verifies the signature
6. Sender publishes the HMAC key
7. Sender and recipient forget their session keys

Some of these steps raise more questions than they answer. Why exactly does OTRM use HMAC signatures? Why does it use a malleable cipher? And why do participants publish their private signing keys?

Let's find out.

## Key insights of OTRM

### Why does OTRM use HMAC signatures?

Suppose that I drag you, panicked, down the corridor of an office building. I stop in front of a locked door. Hands shaking, I take out a key, unlock the door, and throw it open. You peer inside. You see a clear plexiglass screen, behind which is another room with another locked door. In the corner of this other room lies a dead body, still fresh. "My good buddy, Steve Steveington, was the only person with a key to that room!" I whisper, "He did this. You must arrest him." You're not a police officer so you can't do that, but you do agree that we should call the cops.

[TODO-PIC]

My story checked out and you called the law because I was able to show you that there was a dead body inside the locked room behind the plexiglass screen, without having been able to access that room. If I had needed to be able to open the dead-body-room myself in order to show you what was inside it, then I could not have shown you that a murder had been committed without becoming as much of a suspect as my good buddy, Steve Steveington. I was able to verify a murder without being able to have commited it.

Similarly, a person can verify a PGP signature without being able to create it. To create a signature you use a private key, but to verify it you use the corresponding public key. This is a usually-useful property that makes it easy to establish and propagate cryptographic trust. People often try to explain it by making an analogy to an intricate series of padlocks and boxes, but I find that these rarely make anything clearer and I've already used up my metaphor allowance for this section on the murder room thing.

However, as we've seen with the Podesta Emails, asymmetry can also allow hackers to turn your cryptographic signatures against you, preventing you from repudiating your hacked or leaked messages. One of the main goals of OTRM is to prevent signatures from coming back to bite you like this.

To see how OTRM acheives this goal, let's go back to the murder room. Suppose instead that I unlocked the door and opened it to reveal a single, simple room with the same dead body in the corner. "My good buddy, Steve Steveington, was the only person with a key to this room!" I whisper, "He did this. You must arrest him." You're still not a police officer, but you're also not an idiot. In order to show you what's behind this door, I've just opened it. As far as you're concerned I could also have easily committed the murder and dumped the body in the room myself.

[TODO-PIC]

By hiding the body in the single locked room, my good buddy, Steve Steveington, has put me in a bind. In order to show you that there's a dead body inside the room, I need to to unlock the door. However, by unlocking the door, I also demonstrate that I could have done the murder. I know that I didn't do the murder and I know that Steve Steveington really is the only other person with a key to the room, so I know that he must have done it. But I can't prove this to anyone else. OTRM uses a less murderous version of this insight to make its signatures both authenticatable and deniable.

OTRM uses HMAC signatures. Unlike PGP signatures, HMAC signatures are both created and verified using a single shared secret key, known to both the signer and the verifier. HMAC signatures are also both created and verified using the same procedure. The signer creates the signature by passing their message and the shared secret key into the HMAC algorithm. The verifier verifies the signature by performing the same operation and comparing their result with the given signature.

Suppose that an attacker has stolen a dump of messages, together with their HMAC signatures and the HMAC keys necessary to verify them. The attacker wants to use these HMAC signatures to prove that their dump is real, in the same way that Wikileaks used John Podesta's emails' DKIM signatures to prove that theirs was. In order to prove that a message's HMAC signature is valid, the attacker recomputes the signature by passing the message and the secret key into the HMAC algorithm. They then show a sceptical third-party that this generated signature matches the signature that they have stolen.

[TODO-pic]

However, since HMAC signatures are symmetric, anyone who can verify an HMAC signature must necessarily also be able to have produced it. This means that in order to prove to the sceptical third-party that the HMAC signature is real, the attacker must reveal that they have the tools necessary to have faked it. Even if the messages are real and were stolen fair and square, the attacker is in the same awkward position as I was when trying to show you the dead body in the single room. The sceptical third-party might still believe that the messages are genuine on the balance of probability, but this time the victim's cryptography doesn't inadvertantly work against them.

Does this mean that HMAC signatures are somehow better than PGP signatures? No. HMAC and PGP signatures are different, with different uses in different scenarios, and neither is better than the other. They are both ways of authenticating messages, and which is appropriate depends on the situation.

### Why does the sender publish their ephemeral HMAC signing keys?

Message signatures only need to allow a particular person at a particular time to satisfy themselves that a message is authentic. In OTRM, only the message recipient needs to be confident that the signature is valid, and they only need to be confident of this when they are initially receiving the message and checking its signature. Once the recipient has authenticated the message, they can record the fact that the signature was valid. They need never look at the signature again, and they need never trust it again.

This is why it is safe for Google to publish a private DKIM signing key once the key is retired, as suggested by Matthew Green many paragraphs ago. If Google publish a retired, private DKIM signing key then all signatures generated using that key become useless, but this is OK because all of the genuine signatures have already been verified and have served their intended purpose.

As we've seen, an OTRM recipient uses a message's HMAC signature to verify its authenticity. Once they have done this, the final step in an OTRM exchange is for the sender to publish the shared secret that they used to sign the message. The reason that they do this is similar but subtly different to the reason that Prof. Green asks Google to publish their DKIM keys. Prof. Green asks Google to publish their DKIM keys because this makes old, genuine signatures produced by the keys useless to an attacker wanting to prove the validity of stolen emails. However, we've seen that OTRM signatures are already close-to-useless to attackers because they are generated using the symmetric HMAC algorithm. A attacker can't ever use HMAC signatures to authenticate their swag to a sceptical third-party, because the third-party knows that the attacker could have trivially faked them. The attacker is in this predicament whether or not the participants publish their private signing keys.

Nonetheless, the attacker can still use the HMAC signatures they've stolen to give themselves and their trusted accomplices additional confidence that the corresponding messages are genuine. From the attacker's point of view, the HMAC keys are known only to Alice, Bob, and the attacker. Since the attacker knows that they didn't fake the messages, they can be confident that they were legitimately written and signed by Alice and Bob, even though they can't cryptographically prove this to anyone else. If the attacker has accomplices who trust them implicitly then those accomplices can be similarly confident. A court might trust an intelligence agency not to fake HMAC signatures, even thought they trivially could, and so take signatures as strong evidence of a message's genuineness.

However, by publishing their ephemeral HMAC signing keys, Alice and Bob make it harder for the attacker to be certain that their haul is genuine. Once anyone can see their ephemeral HMAC signing keys, anyone could have written and signed the messages and left them lying around on Bob's hard drive. Admittedly, the most plausible explanation for how the messages got there is still that Alice and Bob wrote and signed them, but publishing their signing keys is still a cheap and cunning way for Alice and Bob to introduce some extra uncertainty and deniability into the mix. The attacker can't be as certain as they used to be that their stolen messages are real, and anyone they give the messages to has to trust not only that the attacker is being honest (as before), but also that the messages weren't forged by a fourth-party. It's not an "I am Spartacus" moment so much as a "she is Spartacus, or maybe he is, or perhaps she is, I don't know, leave me alone."

### Why does OTRM use a malleable encryption cipher?

One of the main goals of OTRM is to make it as plausible as possible for the author of an encrypted, authenticated message to claim that they did not write it. We've already seen how OTRM signatures are designed so as to crumble to dust when compromised by an attacker. However, it's still possible for even an unsigned ciphertext to make hard-to-deny ties back to the true author. These ties aren't as mathemtically bulletproof as a signature, but in the interests of completeness OTRM tries to sever them too.

For many encryption ciphers, it's very hard to produce an encrypted ciphertext that decrypts to anything meaningful if you don't know the secret key. It's not quite hard enough that you can assume that any ciphertext that decrypts to a sensible plaintext must have been generated by someone with access to the secret key, but it is still very hard. This means that if a ciphertext produces sensible plaintext when decrypted then it's reasonable to infer that it was probably generated by someone with access to the secret key.

[TODO-pic]

To mitigate this incomplete but still undesirable connection, OTRM performs its encryption using a *malleable* stream cipher. A malleable cipher is one for which it's comparatively easy for an attacker to produce a ciphertext that decrypts to something sensible, even if they don't know the encryption key. If an attacker can correctly guess the plaintext that a stream cipher's ciphertext decrypts to, the attacker can manipulate that ciphertext so that it decrypts to any message of their choice of the same length. The attacker can do this even if they don't know the key used to encrypt the original ciphertext.

[TODO-pic]

This means that using a malleable cipher gives Alice and Bob an extra layer of deniability, very similar to the one that they get from publishing their HMAC signing keys. Let's consider a scenario in which this added layer might be useful. Suppose that Alice and Bob accidentally use a weak random-number generator when choosing their random secrets at the start of their Diffie-Hellman key exchanges. This means that Eve is able to deduce the values of their random secrets; work out their symmetric encryption keys; and use these keys to decrypt Alice and Bob's messages. This is already a very bad outcome, but OTRM's goal in disasters like this is to mitigate the mishap and make the revealed messages as deniable as possible.

[TODO-pic]

Alice and Bob didn't use their private keys to sign their messages directly, which already gives them a lot of wiggle room. But even though Eve can't cast-iron prove anything, but she can still try to build a case on-the-balance-of-probability. Alice and Bob signed parts of their Diffie-Hellman key exchange using their private keys. Eve can use these signatures to prove to a sceptical third-party that Alice and Bob performed a key exchange that produced a specific symmetric session key. Eve can then also show the third-party the encrypted messages that Alice and Bob exchanged, and demonstrate that the session key decrypts these messages into sensible plaintexts with valid signatures.

[TODO-pic]

Even without a malleable cipher, this isn't a total deniability disaster. Symmetrically encrypted ciphertexts are just as useless for proving authorship as symmetrically signed messages. If Eve is able to verify a symmetric signature then she must also have been able to forge it, and if Eve is able to decrypt a symmetrically encrypted ciphertext then she must have been able to forge that ciphertext too. Eve therefore can't use Alice and Bob's ciphertexts to rigorously prove that they wrote them, because Eve could have produced the ciphertexts herself. This is a general property of symmetric encryption, and applies even if the cipher that Alice and Bob use is not malleable.

However, as with HMAC signatures, the fact that the ciphertexts decrypt to a sensible plaintext does give Eve herself a lot of confidence that they are genuine, as well as anyone else who implicitly trusts Eve. If Eve knows that the symmetric encryption key was known only to Alice, Bob, and herself, and she knows that she didn't produce the ciphertext, then she knows that Alice or Bob must have.

To solve a similar problem with their HMAC signatures, Alice and Bob injected some extra uncertainty by publishing their HMAC signing keys after they had been used. This made it clear that anyone could have generated the signatures, not just Alice, Bob, or Eve. Eve could still guess that the signatures were probably generated by Alice or Bob, but now she also has to account for the increased possibility, however slight, that they were forged by a fourth-party.

Similarly, by using a malleable cipher, Alice and Bob make it more plausible that a ciphertext that can be legibly decrypted using their symmetric encryption key could have been produced by a fourth-party. All that this fourth-party would have had to do is intercept one of their messages, correctly guess its plaintext version, and exploit the malleability of the stream cipher used to generate it. This isn't trivial, but it's much easier than if Alice and Bob used a more robust, non-malleable cipher. I don't know whether this would have any power in a court, but it's fun to think about.

Note that even though stream ciphers are easier to tamper with than many other types of cipher, OTRM participants are protected by the bolted-on HMAC signature from their messages being blindly tampered with, so long as the attacker has not compromised their encryption session key. If an attacker who does not know their encryption session key is able to successfully tamper with a message then the HMAC signature will no longer validate, and the participants will know that they are under attack. If the attacker does know their encryption session key then the game is unavoidably up, and OTRM goes into deniability-preserving disaster-defence mode as described above.

### Why is the hash of the encryption key used as the signing key?

We previously mentioned that the value used for the HMAC symmetric signing key is equal to the hash of the symmetric encryption key. This choice gives two benefits. First, the participants have already negotiated a symmetric encryption key, and securely deriving the signing key from the encryption key saves the participants from having to perform a second negotiation. Second, and most interestingly, it means that any attacker who compromises an encryption session key also compromises the corresponding signing key by default, since all they need to do to calcualte the signing key is to take the hash of the encryption key.

This combines the two finesses that we have just talked about. We know already that any attacker who can decrypt a message could also have forged it, and any attacker who can verify a signature could also have forged that. By linking encryption and signing keys in this way, any attacker who can decrypt a message could also have forged both the message *and* its signature. Making it easier for an attacker to produce a total forgery in the event of a key compromise increases deniability. This is a good example of the Principle of Most Privilege.

### The Principle of Most Privilege

You may have heard of the Principle of Least Privilege. This security precept states:

> Any user, program, or process should have only the bare minimum privileges necessary to perform its function.

Applying Least Privilege to your system means that an attacker who compromises one part of it won't be able to easily pivot into new parts and powers, and will therefore only be able to do limited damage. This is why spies operate in small cells; if they are discovered and interrogated then they don't have enough knowledge or privileges to help their captors roll up their chain of command. This is also why you shouldn't give everyone in your company administrator access to all of your systems. You might trust everyone without reservation, but giving a user unnecessary powers needlessly worsens the consequences of their account getting compromised. It's bad if an attacker is able to read all of one person's emails; it's much worse if they can read everyone's emails, then delete them all, then forge new messages that they look like they came from the CEO.

Nonetheless, I would argue that OTRM goes out of its way to achieve the opposite: The Principle of Most Privilege! Remember that the worst-case situation that OTRM tries to prevent at all costs is the one in which an attacker:

1. Has access to unencrypted, signed messages
2. Can prove to a sceptcial third-party that the signatures are valid
3. Could *not* have produced the signatures themselves

This combination is a particular disaster because it means that the attacker can both read Alice and Bob's messages *and* use their cryptographic signatures to prove their legitimacy to a sceptical third-party. It's important that the attacker can verify the signatures (point 2), but *can't* produce them (point 3), because then the third-party can trust that the attacker didn't forge the signatures themselves. The attacker's capabilities are limited, which is Least Privilege in action but in an oddly unhelpful way.

As we've seen, OTRM prevents these 3 properties from occuring simultaneously by making it impossible for points 2 and 3 to be true at the same time. If an attacker can verify a signature (point 2) then they must have its symmetric HMAC key and so *could* have generated it themselves (the opposite of point 3). This is the Principle of Most Privilege - if you want to verify signatures, then you also have to be able to create them, whether you want to or not.

The ideal situation is of course that users' communications stay secret and no attacker has any access to anything. Any sensible encryption scheme works well when everything goes as planned, but OTRM puts substantial focus on what happens when it doesn't. Usually we want to segment powers and credentials; this is an odd situation in which we don't.

NB: The Principle of Most Privilege is not a real principle, I just made it up. Don't bother Googling it.

## CONCLUSION

TODO SOMETHING END







[otr-paper]: https://otr.cypherpunks.ca/otr-wpes.pdf