https://otr.cypherpunks.ca/
* Encryption
* Authentication
* PFS
* Deniability

https://godoc.org/github.com/coyim/otr3
https://github.com/python-otr/pure-python-otr

https://en.wikipedia.org/wiki/Off-the-Record_Messaging

https://en.wikipedia.org/wiki/Signal_Protocol
TODO?: does Signal Protocol implement OTR semantics?



TODO: perhaps briefly skim over the protocol first, then fill in all the gaps, then explain it again?

TODO: OTR uses opportunistic authentication, where users are expected to authenticate fingerprints out of band or using
a Socialist’s Millionaire’s Protocol. If this authentication is performed, it is secure, but it is often omitted.
=> does this mean they don't use public keys?





https://otr.cypherpunks.ca/otr-wpes.pdf
Original paper


This doesn't mean that it's completely impossible that the emails are bogus. However, it does mean that you have to make bolder claims

Once again, you can try to insist that the email is bogus and that your email account was hacked or your email provider maliciously signed an email that you didn't really send. These are both technically possible, but they're much less plausible denials than simply saying "yeah that message is bogus, you have no proof that I sent it, now get out of my office."

TODO: different keys for signing and encryption






Both Green's solution to DKIM signatures and OTRM use the same key insights to provide both authentication and deniability:

1. Signatures only needs to be prove identity to a specific person at a specific time
2. If the private key used to generate a signature is made public, that signature no longer proves anything to anyone







## Irl conversation properties




The physical world has reasonably strong and - by definition - intuitive privacy settings. Suppose that you have a clandestine conversation with a friend in a local park. If you inspect any nearby shrubberies then you can be relatively confident that no one is eavesdropping on you. And unless you're being secretly recorded or filmed, which in most situations is unlikely, you can be similarly confident that no permanent, verifiable record of the conversation is being made. You and your friend can easily have a secret, off-the-record exchange of views.

Technology makes communication easier, but it also changes its privacy settings. These changes don't necessarily increase or decrease net privacy, but they do change the threats and vectors that participants need to consider. No one can hide in your garden and overhear your email or instant messages, but they can glimpse your screen over your shoulder or intercept your traffic as it travels over a network. There's no record of a conversation in the middle of a park apart from the other person's word, but emails and instant messages create a papertrail, which is both useful and incriminating.

Let's consider Alice and Bob. Alice and Bob want to talk to each other online, but, as always, their privacy is under threat from the evil Eve. Alice and Bob are concerned that Eve may intercept their traffic; compromise their computers; and generally try to find out what they are saying or manipulate the contents of their messages.

One way in which Alice and Bob can prevent Eve from using their network traffic to read or spoof their communication is by using standard cryptographic protocols such as PGP (Pretty Good Privacy) that provide both *encryption* (preventing Eve from reading their messages) and *authentication* (preventing Eve from spoofing fake messages). PGP is very good at facilitating secret, verifiable communication. However, it comes with unexpected and often undesirable side-effects.

## The problems with PGP

Let's start with how PGP works when everything goes according to plan. Suppose that Alice wants to use PGP to send an encrypted message to Bob. She takes Bob's public key and uses it to encrypt her message. She sends the resulting ciphertext to Bob, and Bob uses his private key to decrypt and read it. Since the message can only be decrypted using Bob's private key, which only Bob knows, Alice and Bob can be confident that Eve can't read their message.

However, even though Bob is the only person who can decrypt Alice's message, Bob has no strong proof that the message really was written by Alice. As far as he's concerned it could have been written and encrypted by Eve, or Eve could have intercepted and manipulated a real message from Alice. To prove to Bob that the message really was written by her, Alice *cryptographically signs* her message before sending it. To generate a cryptographic signature, Alice uses a cryptographic hash function [TODO-does-it-have-to-be-crypto] to hash her message, the encrypts this hash with her private key. This gives Alice a *cryptographic signature* for her message. Alice appends the signature to her encrypted message, and sends them both to Bob.

When Bob receives the message and signature, he uses the signature to prove to himself that the message was written by Alice and has not been tampered with. Bob does this by performing a similar but different process to that used by Alice to generate the signature. He too calculates the hash of Alice's message, but then he uses Alice's *public* key to *decrypt* Alice's signature. If the resulting plaintext matches the hash of Alice's message then Bob can be confident that the signature was generated using Alice's private key, and that the contents of the message haven't changed. Since Alice is the only one who knows her private key, she is the only one who could have generated the signature, and so Bob can infer that the message really was written and signed by Alice.

[TODO-pic]

This is how PGP gives Alice and Bob privacy and authentication. If Eve is listening on the connection between Alice and Bob's computers and intercepts their encrypted message then she won't be able to decrypt it, because she doesn't know Bob's private key. If Eve tries to spoof a fake message to Bob from Alice then she won't be able to produce a valid signature because she doesn't know Alice's private key. When Bob verifies the signature attached to the message, he will discover that something is afoot. If everything goes perfectly, PGP works perfectly.

However, in the real world, we have to plan for the very real possibility that sometimes everything does not go perfectly. PGP relies on private keys staying private. If a user's private key is stolen then the security properties that it previously underpinned are blown apart. If Eve has access to Bob's private key and intercepts Alice's message on its way to Bob, then Eve can use Bob's private key to decrypt and read the message. If Eve also has access to Alice's private key then she can use it to sign fake messages that Eve herself has written, making it look like these messages came from Alice herself. If their private keys are compromised and used in this way then Alice and Bob have no good defences, apart from scrambling to generate and exchange new keys so that they can open a new encrypted line of communications.

It gets worse, however. We know already that if Eve steals a private key then she can use it to decrypt any future PGP messages that she intercepts and that were encrypted using the corresponding public key. But suppose that Eve had been listening on the connection between Alice and Bob for months or years, patiently storing all of the encrypted traffic. At the time she had no way to read any of it, but with access to Bob's private key Eve can read all of the old stored traffic that was encrypted using Bob's public key. This gives her access to stacks of previously-secret messages.

But it gets *even* worse. Alice cryptographically signed all her PGP messages so that Bob could be confident that they were authentic. However, while generating a signature requires Alice's private key, *verifying* that signature only requires her public key. By definition, this is typically freely available. This means that Eve can use Alice's signatures to verify messages sent by Alice that she steals from Bob just as well as Bob can. If Eve gets access to Alice and Bob's signed messages, she also gets access to a cryptographically verifiable transcript of their communications that prevent Alice and Bob from credibly denying that the stolen messages are real. In a few sections' time we'll look at some real-world examples of how cryptographic signatures can make life more awkward for victims of hacks.

It's great that PGP gives secrecy and authentication. However, it's also brittle, and it isn't robust to private key compromise. We'd ideally like an encryption protocol that better mitigates the fallout in the event of a catastrophic hack. In particular we'd like two extra properties. First, we'd like *deniability*, which is the ability for a user to credibly deny that they ever sent hacked messages. And second, we'd like *forward secrecy*, which is the property that if an attacker compromises a user's private key then they are still unable to read past traffic that was encrypted using that keypair.

TODO - OTRM gives us this.

Let's examine these properties in detail. We'll see how they can be achieved, and why they are so desirable.

### Deniability

Deniability is the ability for a person to credibly deny that they knew or did something. Statements from in-person conversations are normally easily deniable. If you claim that I told you that I planned to rob a bank [TODO-funnier] then I can credibly retort that I didn't, and that you can't prove anything. Email conversations can be deniable too (although see below for a look into why they often aren't). Suppose that you forward to a journalist an email that I sent you in which I appear to describe my plans to rob eight banks [TODO]. I can credibly claim that you edited the email or forged it from scratch, and once again, you can't prove anything. The public or the police or the judge might still believe your claims over mine, but nothing is mathematically provable and we're down in the murky world of human judgement.

By contrast, we've seen that PGP-signed emails are not deniable. If Alice signs a message and sends it to Bob then Bob can use it to validate that the message is authentic. However, anyone else who comes into possession of a signed email can also validate the signature and prove that Alice sent the message in exactly the same way that Bob did. The validator will need access to Alice's public key, but the whole point of public keys is that they can be distributed widely and publicly. Alice is therefore permanently on the record as having sent these messages. If Eve hacks Bob's messages, or if Alice and Bob fall out and Bob forwards their past communication to her enemies or the press, Alice cannot plausibly deny having sent the messages in the same way as if she had never signed them. If you forward to a journalist an email in which I describe my plans to rob eight banks and which I cryptographically signed, I will be in a pickle.

For message senders, deniability is almost always a desirable property. There's rarely any advantage to having everything you say or write go into an indelible record that might come back to haunt you. This is not the same thing as saying that deniability is an objectively good thing that always makes the world strictly better. Wikileaks used cryptographic signatures to verify the authenticity of a dump of emails stolen from John Podesta, a US Democratic Party operative who was central to Hilary Clinton's 2016 campaign for president. The signatures in question were generated as part of the DKIM (Domain Keys Identified Mail) protocol, not PGP, but the principle is very similar. We'll talk in more detail about how this verification worked shortly.

You might think that it was a good thing that John Podesta's emails were undeniable and verifiable; I tend to think that you should be careful what you wish for. But either way I think we can agree that John Podesta thinks that it was a very bad thing, and that he would be interested in making his future communications as deniable as possible. One of the main goals of protocols like OTRM is to reduce the harm done to people like John Podesta who are victims of message hacks, and who want to be able to deny their past communications if they are ever made public. The goal of attackers is to try to subvert these protections, and so the great cosmic dance continues.

Technically anything can be denied, even cryptographic signatures. You can always claim that someone stole your computer and guessed your password, or infected your computer with malware, or stole your private keys while you were letting them use your computer to look up the football scores. These claims are not impossible, but they are unlikely and tricky to argue. Deniability is a sliding scale of plausibility, and OTRM goes goes to great lengths to make denials more believable and therefore more plausible. "A dog ate my homework" is a much more credible excuse if you ostentatiously purchased 20 ferocious dogs the day before.

On the flip side, it's still perfectly reasonable to believe that a message is authentic, even if it is technically deniable. We all assess and believe hundreds of claims every day on the vague balance of probability, with no mathematical proof of their validity. Screenshots of a text conversation might be enough to convince you of [TODO-refer-back-to-above], even if no cryptographic signatures are available.

On the face of it, deniability is in tension with authentication. Authentication requires that Bob can verify that a message was sent by Alice. Deniability requires that Alice can deny having ever sent that same message. One of the most interesting innovations of OTRM is how it achieves these seemingly contradictory goals simultaneously.




### The Podesta Emails and the Hunter Biden laptop

https://blog.cryptographyengineering.com/2020/11/16/ok-google-please-publish-your-dkim-secret-keys/
https://wikileaks.org/podesta-emails/
https://wikileaks.org/podesta-emails/emailid/10667
https://wikileaks.org/DKIM-Verification.html

Cryptographic signatures are used in many protocols, not just PGP. And whenever there's a cryptographic signature, there might also be a problem with deniability. For example, take the stories of the DKIM email verification protocol, US Democratic Party operative John Podesta, and the laptop of Hunter Biden, President Joe Biden's son.

In the old days, when an email provider received an email claiming to be from `rob@robmail.com`, there was no way for the provider to verify that the email really was sent by `rob@robmail.com`. Spammers abused this trust to bombard email inboxes around the world with forged emails. The DKIM protocol was created in TODO to allow email providers to verify that emails they receive are legitimate, and the procotol is still used to this day.

In order to use DKIM, email providers generate a signing keypair and publish their public key to the world (via a DNS TXT record, although the exact mechanism is not important to us here). When a user sends an email, their email provider generates a signature for their email using their private signing key. The provider inserts this signature into the outgoing message as an email header.

[TODO-pic]

When the receiver's email provider receives the message, it looks up the sending provider's public key and uses it to check the DKIM signature against the email's contents. They perform this check in exactly the same way as a recipient would check a PGP signature. If the signature is valid, the receiving provider accepts the message. If it is not, the receiving provider assumes that the message is forged and rejects it. Since spammers don't have access to mail providers' signing keys, they can't generate valid signatures, and so can't generate fake emails that pass DKIM verification. DKIM is therefore very good at preventing email forging.

[TODO-img]

However, a DKIM signature provides permanent proof that the signed message is real and unaltered, in much the same way as a PGP signature. DKIM signatures are part of the contents of an email, so they are saved in the recipient's inbox. If a hacker steals all the emails from an inbox, they can use the sending provider's public DKIM key to validate DKIM signatures themselves. DKIM signing keys are rotated regularly so the key currently in the DNS record may be different to the key used to sign the message, but for many large mail providers historical DKIM public keys can easily be found on the internet. The attacker already knows that the emails are legitimate, since they stole them with their own two hands. However, DKIM signatures allow them to prove this to a sceptical third-party as well.

Matthew Green, a professor at Johns Hopkins University, points out that making emails non-repudiatable like this is not one of the goals of the DKIM protocol[LINK]. Rather, it's an odd side-effect that wasn't contemplated when DKIM was originally designed and deployed. Green also argues that DKIM signatures make email hacking a much more lucrative pursuit. It's hard for a journalist or a foreign government to trust a stolen dump of unsigned emails sent to them by an associate of an associate of an associate, since any of the people in this long chain of associates could have faked or embellished the the emails' contents. However, if the emails contain cryptographic DKIM signatures generated by trustworthy third parties (such as reputable email providers), then the emails are provably real, no matter how questionable the character from whom they came. Cryptographic signatures don't decay with social distance or sordidness. Data thieves are able to piggy-back off of Gmail's (or any other DKIM signer's) credibility, making stolen, signed emails a verifiable and therefore more valuable commodity. 

In March 2016, Wikileaks published a dump of emails hacked from the Gmail account of John Podesta, a US Democratic Party operative. Alongside each email Wikileaks published the corresponding DKIM signature, generated by Gmail or whichever provider sent the email. This allowed independent verification of the messages. You may think that the Podesta hack was, in itself, a good or a bad thing. You may believe that the long-term verifiability of DKIM signatures is a desirable property that increases transparency, or a harmful one that incentivizes email hacking. But whatever your opinions, you'd have to agree that John Podesta definitely wishes that his emails didn't have long-lived proofs of their provenance, and that most individual email users would like their own messages to be sent deniably and off-the-record.

Matthew Green has a counter-intuitive but elegant solution to this problem. Google already regularly change (or *rotate*) their DKIM keys as a best practice precaution, in case the keys have been compromised without Google realizing. Green proposes that once Google have rotated a DKIM keypair and taken it out of service then they *publicly publish* the keypair's *private key*.

Publishing the old private key would mean that anyone could use it to spoof a valid DKIM signature for an email. If the keypair were still in use, this would make Google's DKIM signatures useless. However, since the keypair has been retired, revealing the private key does not jeopardize the effectiveness of DKIM in any way. The purpose of DKIM is to allow *email recipients* to verify the authenticity of a message *at the time they receive that message*. Once the recipient has verified and accepted the message, they need never verify it again. The signature has no further use unless someone - such as an attacker - wants to later prove the provenance of the email.

Since DKIM only requires signatures to be valid and verifiable when the email is received, it doesn't matter if an attacker can spoof a signature for an old email. In fact it's desirable, because it renders worthless all DKIM signatures that were legitimately generated by the email provider using the now-public private key. Suppose that an attacker has stolen an old email dump containing many emails sent by Gmail, complete with DKIM signatures generated using Gmail's now-public private key. Previously, only Google could have generated these signatures, and so the signature proved that the emails were genuine. However, since the private key is now public, the attacker is now able to trivially generate the signatures themselves. Unless the attacker can prove that the signatures were generated while the key was still private (which in general they won't be able to), the signatures don't prove anything about anything to a sceptical third party.

The theory makes sense and the Podesta Emails are interesting, but how much difference does any of this really make? Wouldn't everyone have believed the Podesta Emails anyway, without the signatures? Possibly. But consider a more recent example in which I think DKIM signatures could have changed the course of history.

During the 2020 election campaign, Republican operatives claimed to have gained access to a laptop belonging to Hunter Biden, the son of the then-Democratic candidate and now-President Joe Biden. The Republicans claimed that this laptop contained gobs of explosive emails and information about the Bidens.

The story of how they allegedly got hold of this laptop is somewhat fantastical, involving Rudi Giulliani, Donald Trump's lawyer, and a computer repair shop in a small town in Delaware. However, somewhat fantastical stories are sometimes true, and this is exactly the type of situation in which cryptographic signatures could play a big role in establishing credibility. It doesn't matter how wild the story is if the signatures validate. Indeed, in an effort to prove the laptop's provenance, Republicans released a single email, with [a single DKIM signature](https://github.com/robertdavidgraham/hunter-dkim), that they claimed came from the laptop.

[TODO-pic]

The DKIM signature of this email is valid, and it does indeed prove that `v.pozharskyi.ukraine@gmail.com` sent an email to `hbiden@rosemontseneca.com` about meeting the recipient's father, sometime between 2012 and 2015. However, it also raises a lot of questions, and provides a perfect example of the sliding-scale nature of deniability. This single email doesn't prove anything more than what it says. It doesn't prove who `v.pozharskyi.ukraine@gmail.com` is, and it doesn't prove that the email came from the alleged laptop.

The email is cryptographically verifiable, but without further evidence the associated story and its claims of further madcap information are still plausibly deniable. It's possible that Hunter Biden was the victim of a completely separate attack, the spoils of which found their way into the hands of the Republicans. It's hard to understand why the Republicans chose to release this single, not-particularly-incendiary email if they were also sitting on a stack of additional, also-cryptographically-verifiable material. I imagine that if a full dump of emails and signatures had been released, a la Wikileaks and Podesta, then their combined weight would have been enough to overcome many circumstantial denials. Maybe the 2020 election would have gone the other way.



The second of the less-obvious desirable properties for an encrypted messaging protocol that we're going to discuss is *Forward Secrecy*.


### Forward Secrecy

Suppose that Alice and Bob are exchanging messages over an encrypted network connection. Eve is listening to their traffic, but since it is encrypted she is unable to read any of it. However, Eve decides to store the encrypted traffic, just in case she can make use of it in the future.

Suppose also that a year later, Eve compromises one or both of the private keys that Alice and Bob used to negotiate their encrypted connections. For many encryption protocols, Eve would be able to go back to her archives and use these keys to decrypt all of the encrypted traffic between Alice and Bob that she has stored over the years. However, if Alice and Bob were using a protocol with the property of *Forward Secrecy*, Eve would still not be able to read their traffic, even though she had compromised their private keys.

Cryptography is a very precise field so I'll quote a technical definition of Forward Secrecy to show that I'm also a very precise person:

> [Perfect] Forward Secrecy is a feature of specific key agreement protocols that gives assurances your session keys will not be compromised even if the private key of the server is compromised. [TODO-source]

The mathematics of how forward secrecy works are not important to us today. But briefly, the clever part typically relies on the two parties using their private keys to regularly agree on new short-lived session keys, and then using these short-lived keys to encrypt their traffic. They agree on these keys in such a way that the attacker cannot recover the session keys, even if the attacker compromises their long-lived private keys (this is the very clever part). The parties then briefly use each session key to encrypt and exchange a small number of messages (exactly 1, in the most cautious implementations). Finally, once a session key has been used to encrypt and decrypt a message, the parties "forget" it, wiping it from their RAM, disk, and anywhere else from which an attacker might be able to recover it. Once a session key has been forgotten in this way, there is no way to recover it, even if the attacker compromises their private keys. There is therefore no way to decrypt their traffic. Forward secrecy has been achieved.

PGP does not provide forward secrecy. PGP messages are encrypted using the recipient's public key and decrypted using their private key. If an attacker stores the encrypted messages and later compromises the recipient's private key, they can decrypt all historical messages encrypted to that key. One of the main goals of OTRM is to provide forward secrecy.

Forward secrecy is often called "perfect forward secrecy", including by many very eminent cryptographers. Other, similarly eminent cryptographers object to the word "perfect" because (my paraphrasing) it promises too much. Nothing is perfect, and even when a forward secrecy protocol is correctly implemented, its guarantees are not perfect until the sender and receiver have finished forgotting a session key. Between the time at which a message is encrypted and the key is forgotten lies a window of opportunity for a sufficiently advanced attacker to steal the session key from their RAM. In practice the guarantees of forward secrecy are still strong and remarkable. But when discussing Off-The-Record Messaging, a protocol whose entire reason for existence is to be robust to failures, these are exactly the kinds of edge-cases we should contemplate.

Forward Secrecy is a brilliant and desirable property that is highly desirable for OTRM, but it is not an innovation of the OTRM protocol. Instead, OTRM makes use of existing Foward Secrecy methods, without modifying them. We therefore won't focus on Forward Secrecy in this primer.

## Off The Record Messaging

We already knew that encryption and authentication are highly desirable properties for a secure messaging protocol. Encryption prevents attackers from reading your messages. Authentication allows you to be confident that you are talking to the right person, and prevents attackers from modifying or faking your messages.

We've now seen why deniability and forward secrecy are important too. Deniability allows participants to credibly claim to have not sent their messages, mirroring the privacy properties of real-life conversation and making the fallout of data theft less harmful. Forward secrecy prevents attackers from reading historical encrypted messages, even if they compromise the long-lived private keys used at the base of the encryption process.

Before we see how Off-The-Record Messaging achieves these properties, let's describe some specific scenarios and see . This is part of a process often called *threat modeling*. [TODO]



We're going to describe the OTRM protocol and demonstrate some properties of it. But first, in order to see why these properties are useful, let's describe some scenarios in which we would like it to protect its users. We'll see how PGP protects (or doesn't protect) its users in these scenarios, and then later we'll come back to these scenarios and see how OTRM handles them. This is a miniature example of a security analysis called a *threat model*.

## Scenarios

Our basic scenario is as follows:

> Alice and Bob are discussing sensitive topics by exchanging messages over a network. They want to keep their messages private, and they want to be able to authenticate their messages to ensure that they were sent by the right person and have not been tampered with. If their messages are exposed, either by an attacker or by the other person, they want to be able to deny that they sent them. They are aware that Eve, an attacker, is trying to compromise their communications and do them both harm.
>
> Alice and Bob need to use some form of encryption to keep their messages secret, and some form of cryptographic signature to ensure their authenticity. 

To see how robust different protocols are to disasters, we will analyze what happens when:

1. Eve is monitoring and storing all traffic between Alice and Bob. She has no access to their private keys
1. Eve is monitoring and storing all traffic between Alice and Bob. She then steals one or both of their private keys
2. Eve is monitoring and storing all traffic between Alice and Bob. TODO: a weak RNG means she can bust some stuff
3. Eve steals an unencrypted dump of all messages that Alice and Bob have exchanged, including their signatures
4. Eve completely compromises Alice and Bob's machines, and can see everything that they see in realtime

In each situation, think about:

1. What can Eve see?
2. What can Eve verify to her own satisfaction?
3. What can Eve prove to a sceptical third-party after the fact?

Let's see how PGP holds up in these scenarios.

### PGP

1. Eve is monitoring and storing all traffic between Alice and Bob. She then steals one or both of their private encryption keys

As we've discussed, PGP does not provide forward secrecy. If an attacker compromises the private key of a keypair used to encrypt a message, the attacker can trivially decrypt the message themselves. If Eve has stored historical encrypted traffic exchanged by Alice and Bob and steals Alice's private key, Eve can decrypt this traffic and read all messages sent to Alice.

On top of this, if Bob has PGP-signed all the messages that he sent to Alice then Eve can use these signatures and Bob's public key to prove the stolen messages' provenance to a sceptical third-party such as Wikileaks. This is good for Wikileaks but bad for Alice and Bob.

3. Eve steals an unencrypted dump of all messages that Alice and Bob have exchanged, including their signatures

The theft of an unencrypted message dump is always going to be disastrous for Alice and Bob. However, if the dump also includes PGP signatures, then Eve can once again use these signatures to prove the messages' provenance to a sceptical third-party. This is even worse.

4. Eve completely compromises Alice's machine, and can see everything that she sees and does in realtime

If Eve has completely compromised Alice's machine then she can see and decrypt all messages that Alice sends and receives. Eve can use PGP signatures to verify the veracity of messages that Alice receives to a sceptical third-party.



With all of this context under our belt, let's take a tour of the mechanics of OTRM. We'll then take a in-depth look at why and how OTRM achieves the goals that it sets itself of XYZ [TODO].

## OTR summary

TODO: OTRM requires handshake, PGP doesn't

To send an OTRM message, the sender and recipient must:

1. Generate and agree on a secret encryption key
2. Authenticate each other's identity
3. Encrypt and send a message

OTRM performs these steps in a way that keeps the sender's message both secret and tamper-proof. OTRM also provides forward secrecy, keeping the message secret even if the sender's long-lived private keys are compromised. Finally, OTRM provides deniability, allowing the sender to deny that they ever sent a message, even if the message and associated signature are made public.

## 1. Encrypt

The sender needs to encrypt their message so that snoopers can't read it but the intended recipient can. An encryption protocol consists of methods to allow the sender and receiver to:



As we've discussed above, the encryption scheme that we choose also needs to provide Perfect Forward Secrecy and Malleability.





In PGP encryption, the sender encrypts their message using the recipient's private key directly. However, many encryption protocols (including OTRM) take a slightly different approach. Instead of performing encryption using a private key, they have the sender and recipient being their conversation by agreeing on a shared secret session key. This is a short-lived or *ephemeral* key that the sender and recipient use to actually encrypt and decrypt the message, rather than using the private key directly. Encryption algorithms where the same key is used to encrypt and decrypt the message are known as *symmetric*; those in which different keys are used for encryption and decryption (such as PGP) are known as *asymmetric*.

The trick is in allowing Alice and Bob to agree on a shared secret in such a way that, even if Eve is watching every byte they send each other during the key-exchange process, Eve will still not know what the shared secret is. This essential requirement means that, for example, Alice can't simply send Bob a key, and then follow up with a message encrypted using that key. If Alice and Bob had met in person then they could have agreed on a shared secret then, but a protocol that required you to physically meet every person who you wanted to communicate with before you could send them a message would be of limited use.

Some key-exchange protocols have the sender choose a random shared secret, and then use the recipient's public key to encrypt the key. The sender sends the the encrypted key to the recipient, who uses their private key to decrypt it. Since Eve does not have access to the recipient's private key, she cannot deduce the shared secret. The sender is therefore free to use the shared secret to encrypt their message.

TODO: why use session keys?

This approach is effective, but it does not provide forward secrecy. If Eve stores all of Alice and Bob's encrypted traffic, and later compromises Bob's private key, she can use it to decrypt the shared secret on its way from Alice to Bob, and use the shared secret to decrypt the actual message.






OTRM achieves forward secrecy by agreeing on a shared secret key using a process called *Diffie-Hellman key exchange*. The details of how Diffie-Hellman achieves forward secrecy are not important to us here. [TODO how does signing work?]

Once a secret key has been agreed using Diffie-Hellman, OTRM use the key to encrypt a message using "a stream cipher with AES in counter mode". Once again, the details of what this means are not important - we can treat this algorithm as a black box into which we pass a secret key and a message, and get back an encrypted ciphertext,

However, the reason why OTRM chooses a stream cipher is important: stream ciphers are *malleable*. This means that it is relatively easy (or at least plausible) for an attacker to manipulate an encrypted ciphertext and turn it into a different ciphertext that correctly decrypts into a different plaintext. The attacker can manipulate ciphertexts in this way even if they are unable to decrypt the original version and do not know the secret key that was used to generate it. It's perhaps counter-intuitive to want to make manipulation *easier* for an attack, but we'll see why this property is useful later.

[TODO-pic]

## 2. Authenticate

TODO: I think signing intermediate keys prove identity, HMAC proves that message hasn't been tampered with

By performing a Diffie-Hellman key exchange, Alice and Bob have agreed on a shared secret key and have verified each other's identities. Alice can now use their shared secret key to encrypt and send a message, and be confident that only Bob will be able to read it.

However, even though Eve can't read Alice's message, she may still try to tamper with it on its way to Bob. Indeed, as we've seen, OTRM has Alice use a stream cipher in order to make it especially *easy* for Eve to tamper with messages. OTRM therefore needs to bolt on an extra piece of authentication that Bob can check to make sure that the message has not been tampered with.

PGP achieves authentication by having the sender sign their messages using their private signing key. However, we've seen the perils of this approach, and how an attacker can use PGP signatures to prove that embarrassing communication is genuine.

OTRM avoids the problems by being very careful about what information it signs. Think of a shady business owner who does all their deals through handshakes and verbal agreements because they don't want to put their signature onto any potentially incriminating documents. Alice and Bob have to sign *something* in order to prove their identities to each other, but as we've seen, the only data that they sign with their private signing keys is the intermediate key [TODO] in the Diffie-Hellman key exchange. If an attacker is somehow [TODO] able to prove that they signed these pieces of data, this doesn't prove that they wrote any of the message generated using the resulting key.

Since Alice and Bob don't want to sign their messages using their private signing keys, OTRM has to prove the integrity of its messages using a different type of cryptographic signature. It does this using HMAC (Hash-Based Message Authentication Code) signatures. The critical property of an HMAC signature is that it is symmetric, meaning that it is both generated and verified using a single shared secret key. We'll see why this is important shortly.

In order to generate an HMAC signature for a message, the signer passes the message and the secret key into the HMAC algorithm (once again, it doesn't matter to us how HMAC works) and gets back an HMAC signature. They send the message and HMAC signature to the recipient. In order to verify the signature, the recipient performs the same process, passing the message and the secret key into the HMAC algorithm, and getting back an HMAC signature. If the signature that the recipient calculates matches the signature provided by the sender then the recipient can be confident that the message has not changed and has not been tampered with.

In order to use HMAC signatures, the sender and recipient need to agree on shared secret signing key. OTRM has them use the *cryptographic hash* of their shared secret encryption key. A cryptographic hash is a one-way function that produces a random-seeming but consistent output for a given input. Given an input it is very easy to calculate the cryptograhic hash output. By contrast, given a cryptographic hash output it is impossible to calculate the input that produced it. Using the hash of their encryption key as their signing key is convenient, since it removes the need for Alice and Bob to perform another key-exchange. It also provides a subtle contribution towards deniability that we will discuss shortly.

With an encryption secret and a signing secret both agreed, the sender signs their message using HMAC and the signing secret, then encrypts the message and signature together using the shared encryption secret and a stream cipher with AES in counter mode. The sender sends their message to the recipient. Once the recipient receives the message they perform the same process in reverse; they decrypt the message in order to read it and verify the HMAC signature in order to ensure it has not been tampered with.

Finally, in an unexpected twist, the sender *publishes* the shared signing key to the world. This is safe because the HMAC key is a cryptographic hash of the encryption key, and so cannot be used to reconstruct the encryption key. However, this doesn't tell us why it is actively a useful thing to do; we'll talk about this in the next section.

In summary:

1. Sender and recipient agree on a secret encryption key using Diffie-Hellman key exchange
2. Sender signs their message with an HMAC. They use a signing key equal to the cryptographic hash of the encryption key from step 1
3. Sender uses the encryption key from step 1 to encrypt their message and signature
4. Sender sends the encrypted ciphertext to the recipient
5. Recipient decrypts the cipherext and verifies the signature
6. Sender publishes the HMAC key

## Key insights

Before we go into the details of OTRM I'd like to outline some of the key insights that make it achieve its goals. My hope is that once these all make sense then the technical details of the protocol will all make much more sense.




### Signatures don't prove anything to a sceptical third-party if in order to verify them you need to be able to create them

Suppose that I drag you, panicked, down the corridor of an office building. I stop in front of a locked door. Hands shaking, I take out a key, unlock the door, and throw it open. You peer inside. You see a clear plexiglass screen, behind which is another room with another locked door. In the corner of this other room lies a dead body, still fresh. "My good buddy, Steve Steveington, was the only person with a key to that room!" I whisper, "He did this. You must arrest him." You're not a police officer so you can't do that, but you do agree that we should call the cops.

[TODO-PIC]

My story checked out and you called the law because I was able to show you that there was a dead body in the locked room behind the plexiglass screen, without being able to access that room. If I had needed to be able to open the dead-body-room myself in order to show you what was inside it, then I could not have shown you that a murder had been committed without becoming as much of a suspect as my good buddy, Steve Steveington. I was able to verify a murder without been able to have commited it.

Similarly, a person can verify a PGP signature without being able to create it. To create a signature you use a private key; to verify it you use the corresponding public key. This is a usually-useful property that makes it easy to establish and propagate cryptographic trust. People often try to explain it by making a complex analogy to an intricate series of padlocks and boxes, but I find that those rarely make anything clearer and I've already used up my metaphor allowance for this section on the murder room thing.

However, as we've seen with the Podesta Emails, this property can also allow hackers to turn your cryptographic signatures against you, preventing you from repudiating your hacked or leaked messages. One of the main goals of OTRM is to prevent your signatures from coming back to bite you like this.

To see how OTRM acheives this goal, let's go back to the murder room. Suppose instead that I unlocked the door and opened it to reveal a single, simple room with the same dead body in the corner. "My good buddy, Steve Steveington, was the only person with a key to this room!" I whisper, "He did this. You must arrest him." You're still not a police officer, but you're also not an idiot. In order to show you what's behind this door, I've just opened it myself. As far as you're concerned I could also have easily committed the murder and dumped the body in the room.

[TODO-PIC]

By hiding the body in the single locked room, my good buddy, Steve Steveington, has put me in a bind. In order to show you that there's a dead body inside the room, I need to to unlock the door. However, by unlocking the door, I also demonstrate that I could have done the murder. I know that I didn't do the murder and I know that Steve Steveington really is the only other person with a key to the room, so I know that he must have done it. But I can't prove this to anyone else. OTRM uses a less murderous version of this insight to make its signatures both authenticatable and deniable.

OTRM uses HMAC signatures. Unlike PGP signatures, HMAC signatures are both created and verified using a single shared secret key, known to both the signer and the verifier. HMAC signatures are both created and verified using the same procedure. The signer creates the signature by passing their message and the shared secret key into the HMAC algorithm. In order to verify the signature, the verifier does the same. If the signature that the verifier computes matches the one provided by the signer then it is valid. If the signatures do not match then something is afoot.

Suppose that an attacker has stolen a dump of messages, together with their HMAC signatures and the HMAC keys necessary to verify them. In the same way that Wikileaks used John Podesta's emails' DKIM signatures to prove that his emails were authentic, the attacker wants to use the HMAC signatures to prove that their own stolen message dump is real. In order to be prove that an HMAC signature is valid, the attacker recomputes the signature by passing the message and the secret key into the HMAC algorithm. They then show a sceptical third-party that this generated signature matches the signature that they have stolen.

However, since HMAC signatures are symmetric, anyone who can verify an HMAC signature must necessarily could also have produced it. This means that in order to prove to the sceptical third-party that the HMAC signature is real, the attacker must reveal that they have the tools necessary to have faked it. Even if the messages are real and were stolen fair and square, the attacker is in the same awkward position that I was when trying to show you the dead body in the single room. The sceptical third-party might still believe that the messages are genuine on the balance of probability, but this time the victim's cryptography doesn't inadvertantly work against them.

Does this mean that HMAC signatures are somehow better than PGP signatures? Why doesn't everyone use HMAC signatures all the time instead of PGP ones? 

No. HMAC and PGP signatures are different, and neither is better than the other. They are both ways of authenticating messages, and the material difference between them is that HMAC signatures use a shared secret and PGP uses public key cryptography. Which is appropriate for a given situation depends on what key exchange methods are available. TODO - also deniability, also PK gives you auth.


Public key cryptography like PGP has the advantage that the participants don't need to talk to each other directly in order to agree a key - they can freely read each other's public keys. This is convenient. However, full public key cryptography requires lots of infrastructure and checks that are often glossed over, such as roots of trust, certificate chains, and key recovation [TODO-link-to-my-post]. By contrast, in order to create and verify an HMAC signature, participants need to first communicate directly and agree on a shared secret key. This is awkward, but it's also the only thing they need to do. Once they've exchanged a secret key, there's no other checks to worry about. However, HMAC doesn't do anything to prove the identity of the person you are talking to; you'll need a further check (possibly involving public key cryptography) to do that.

Which is most appropriate also depends on the context. HMAC works well when exchanging messages with one other person. However, suppose that I want to make a public post on Reddit with a new account, but I want to prove to anyone who reads it that the account belongs to me, Robert Heaton, and that I wrote the message. I could cryptographically sign my message.

An HMAC signature requires a shared secret, but if I share a secret with the whole world then it's not really a secret anymore, since anyone could use it to spoof a signature for any message. Even more importantly, no one would have any proof that the message and signature were really generated by me. I would need some additional way to demonstrate that they were generated by me, Robert Heaton. The idea of using an HMAC signature to authenticate a public message is nonsensical.

However, PGP is perfect for this use. I can publish my public key in a way that proves it belongs to me, perhaps via my website. This proves to the world that the key really does belong to me, Robert Heaton. Having access to my public key doesn't allow anyone to spoof my signatures, since they don't have my private key. 

### Reconceive the purpose of a cryptographic signature

Message signatures only need to allow a particular person at a particular time to satisfy themselves that a message is authentic. Only the intended verifier needs to be confident that the signature is valid, and they only need to be confident that it is valid when they initially check the signature. Once the verifier has authenticated the message, they can record the fact that the signature was valid. They need never look at the signature again, and they need never trust it again. This is why it is safe for Google to publish a private DKIM signing key once the key is retired, as suggested by Matthew Green many paragraphs ago. If Google publish a retired, private DKIM signing key then all signatures generated using that key become useless, but this is OK because all of the genuine signatures have already served their purpose.

As we saw in section X.XTODO, an OTRM message recipient uses its HMAC signature to verify the message authenticity. Once they have done so, the final step in an OTRM exchange is for the sender to publish the shared secret that they used to sign the message. The reason that they do this is similar but subtly different to the reason that Prof. Green asks Google to publish their DKIM keys. Prof. Green asks Google to publish their DKIM keys because this makes old, genuine signatures produced by the keys useless to an attacker wanting to prove the validity of stolen emails. However, we've seen that OTRM signatures are already useless to attackers because they are generated using the symmetric HMAC algorithm. Even if the sender didn't publish the signing keys, thieves still can't use HMAC signatures to authenticate their swag, because the sceptical third-party they are verifying them to knows that they could have trivially faked them.

However, the attacker can still use the signatures to give themselves and their trusted accomplices confidence that the messages they've stolen are genuine. From the attacker's point of view, the HMAC keys are known only to Alice, Bob, and the attacker. Since the attacker knows that they didn't fake the messages, they can be confident that they were legitimately written and signed by Alice and Bob, even though they can't cryptographically prove this to anyone else.

However, by publishing their ephemeral HMAC signing keys, Alice and Bob make it even easier for them to deny that they wrote the messages, and harder for the attacker to be certain that their haul is genuine. Now that everyone in the world can see their ephemeral HMAC signing keys, anyone could have written and signed the messages and left them lying around on Bob's hard drive. Admittedly, the most plausible explanation is still that Alice and Bob wrote the signed messages, but publishing their signing keys is still a cheap and cunning way to introduce some extra uncertainty. The attacker can't be as certain as they were that their messages are real, and anyone they give the messages to has to trust not only that the attacker is being honest (as before), but also that the messages weren't forged and used to dupe the attacker. It's not an "I am Spartacus" moment so much as a "she is Spartacus, or maybe he is, or perhaps her, I don't know, leave me alone."





### Malleable encryption improves deniability

The goal of OTRM is to make it as plausible as possible for the author of an encrypted, authenticated message to claim that they did not write it. We've already seen how OTRM signatures are designed so as to crumble to dust when compromised by an attacker. However, it's possible for an unsigned ciphertext on its own to make hard-to-deny ties back to the true author, even if they aren't quite mathemtically bulletproof. In the interests of completeness, OTRM tries as far as possible to sever even these diluted ties too.

For many encryption schemes, if you don't know the secret key then it's hard to produce an encrypted ciphertext that decrypts to anything meaningful. It's not quite hard enough that you can assume that any ciphertext that decrypts to a sensible plaintext must have been generated by someone with access to the secret key. However, it is still hard. This means that if a ciphertext produces sensible plaintext then it's reasonable to infer that it was probably generated by someone with access to the secret key.

If Eve is able to steal the ephemeral shared secret key that Alice and Bob used to encrypt a message


This is one reason why it's important to include extra layers of authentication in an encryption scheme.

, let alone one that makes any sense when decrypted



If you want to deny that you sent a mathematically decrypt-able message then you can claim that an attacker manipulated the message using a technique like a length-extension attack[LINKS], or that an attacker fully compromised your computer, accessed to your secret key, and generated the message themselves. These claims are technically possible but they're more outlandish than they need to be, and the goal of OTRM is to make denials as plausible as possible.

OTRM therefore deliberately chooses a *malleable* encryption cipher. This means that the cipher produces ciphertexts which are relatively straightforward for an attacker to modify, even if they don't know the secret key that generated the original ciphertext. OTRM performs its encryption using a malleable cipher called a *stream cipher*. Stream ciphers have the property that if an attacker steals a ciphertext and can guess its decrypted plaintext, they can easily manipulate the ciphertext to produce a new ciphertext that decrypts to *any* message of the same length.

[TODO-pic]

Malleability makes it easier for a victim to claim that a ciphertext that appears to have been written by them was in fact tampered with by someone else. I don't know whether this would have any power in a court of law, but it's fun to think about.



Steam ciphers are much easier for an attacker to tamper with than other types of cipher. This is why OTRM bolts on an extra layer of authentication using HMACs, which as we've seen is conveninently useless to sceptical third-parties.



Malleable ciphers give Alice and Bob the same kind of extra layer of deniability as publishing their HMAC keys. 

Suppose that Alice and Bob accidentally use a weak random-number generator when performing a Diffie-Hellman key exchange. Eve is able to use this weakness to deduce the symmetric encryption key that they agree on using Diffie-Hellman. Since Alice and Bob use the private keys to sign the intermediate values that they use in the key exchange, Eve can prove to a sceptical third-party that Alice and Bob performed a key exchange that produced the symmetric key that she has deduced.

This isn't the end of the world. Since Alice and Bob encrypt their messages using a symmetric cipher, it's already the case that if Eve can use the symmetric key to decrypt their messages to recover the plaintext, then Eve could have used that same symmetric key to have produced the ciphertext herself. Eve therefore can't use their ciphertexts to cast-iron incriminate them, because she could have produced the ciphertexts herself. This is exactly the same principle as for HMAC signatures, and it doesn't require the cipher that Alice and Bob use to be malleable.

However, as with HMAC signatures, the fact that the ciphertexts decrypt to a sensible plaintext does give Eve a lot of confidence that they are genuine, as well as anyone else who implicitly trusts Eve. In HMAC signatures Alice and Bob injected some extra uncertainty by publishing their HMAC signing keys after they had been used. This made it clear that anyone could have generated the signatures, not just Alice, Bob, or a hypothetical attacker.

Similarly, by using a malleable cipher, Alice and Bob make it more plausible that a ciphertext that can be decrypted to an intelligible plaintext using their symmetric encryption key could have been manipulated by anyone who was able to guess one of their real messages.






### Principle of Most Privilege

You may have heard of the Principle of Least Privilege. This security precept states:

> Any user, program, or process should have only the bare minimum privileges necessary to perform its function.

Applying Least Privilege to your system means that an attacker who compromises one part of it won't be able to easily pivot into new parts and powers, and so will only be able to do limited damage. This is why spies operate in small cells; if they are discovered and interrogated then they don't have enough knowledge or privileges to help their captors roll up their chain of command. This is also why you shouldn't give everyone in your company administrator access to all of your systems. You might trust everyone implicitly, but giving a user unnecessary powers needlessly worsens the consequences of their account getting compromised. It's bad if an attacker is able to read all of one person's emails; it's much worse if they can read everyone's emails and forge new messages that they look like they came from the CEO.

By contrast, I would argue that OTRM goes out of its way to achieve the opposite: The Principle of Most Privilege! To see why I think this, remember that the worst-case situation that OTRM tries to prevent at all costs is the one in which an attacker:

1. Has access to unencrypted, signed messages
2. Can prove to a sceptcial third-party that the signatures are valid
3. Could *not* have produced the signatures themselves

This combination is a disaster because means that the attacker can read Alice and Bob's messages and use their cryptographic signatures to prove their legitimacy to a sceptical third-party. It's important that the attacker can verify the signatures (point 2), but *can't* produce them (point 3), because then the third-party can trust that the attacker didn't forge the signatures themselves. The attacker's capabilities are limited, which is Least Privilege in action but in an oddly unhelpful way.

As we've seen, OTRM prevents these 3 properties from occuring simultaneously by making it impossible for points 2 and 3 to be true at the same time. If an attacker can verify a signature (point 2) then they must have its symmetric HMAC key and so *could* have generated it themselves (the opposite of point 3). This is the Principle of Most Privilege in action - if you want to verify signatures, then you have to also be able to create them.

The ideal situation is of course that users' communications stay secret and no one has any access to any of their messages, keys, or sigantures. Any sensible encryption scheme works well when everything goes as planned, but OTRM puts substantial focus on what happens when it doesn't. Usually we want to segment powers and credentials; this is an odd situation in which we don't.

NB: The Principle of Most Privilege is not a real principle, I just made it up. Don't bother Googling it.




## OTR summary

Brief overview, then we'll look at each step in more detail

* DH key exchange
* Encrypt using malleable stream cipher
* Bolt on auth using MAC with key that is hash of enc key
* Publish MAC keys to make them useless


### Agree a shared secret key using Diffie-Hellman

Use DH to create a shared secret key then use this for PFS encryption.
Can use normal PKI to authenticate IDs
It's the key exchange that makes it PFS, not the algo

Brief outline of DH


### Encrypt message using a malleable cipher

Could use any sensible encryption algo here
But we've said that malleable encryption is desirable in order to increase deniability
So we use a malleable stream cipher
Easy to manipulate



### Bolt authentication onto the side using HMAC

Since messages are easy to manipulate, we need to add authentication
Symmetric authentication is desirable because of Principle of Most Privilege

Make the MAC key the hash of the enc key so that anyone who can write a message can also sign it
Either attacker can do nothing or the whole system is busted open






### Publish old HMAC secrets to increase deniability

Publishing old HMAC secrets doesn't reveal keys because they are one-way hash

4.4 Revealing MAC keys
"This can be seen as the analogue
of perfect forward secrecy for authentication: anyone who
recovers the MAC key in the future is unable to use it to
verify the authenticity of past messages."
=> we only get this property if we can easily and reliably claim that the MAC keys are widely known to others. You could make this claim in normal circumstances, and sometimes you'd be telling the truth, but it's not very plausible. 








## Authentication

MACs for signing, which require knowing the single key in order to either create or verify
Can only be verified by someone who could also have created the sig. This means that Bob can't prove that Alice wrote a message to a skeptical third-party
=> if Bob starts trying to do this then we leave the neat world of crypto and enter the messy real world. It seems unlikely that Bob would try to forge a message. But then if he's trying to prove to someone else that Alice said something then he probably has a grudge against her. Have to make a decision and interpret this info. OTR is just a tool to nudge the balance of probabilities in a direction




Go even further - use the same key for signing and encryption (hash the encryption key to produce the signing key), so anyone who can read a message can also sign it. This provably avoids the bad case of read not sign (above)
Go even even further - publish the MAC key after it has served its purpose.
=> TODO: what scenario does this protect against? Eve recovers a dump of messages and deposits them with law enforcement, then law enforcement later recover the MAC key?
=> or just law enforcement recovers a dump of messages and you can say you don't know anything about them. Even if the courts still trust law enforcement, you've made the messages less useful.
=> journalists are less trustworthy than law enforcement (right?) but they can't provide any equivalent of the Podesta signatures. Public still might believe them, but your encryption scheme at least isn't working against you.
=> Don't consider journalists safe harbor so they have a problem immediately. even if we do assume law enforcement to be acting honestly, we can still deny
=> we're making our denial more plausible by requiring less James Bond espionage in order to carry it out



=> TODO?: doesn't this allow Eve to authenticate Alice? Or is this already assumed to be the case. Eve can authenticate that the person who published the MAC is also the person who sent the messages, but she probably knew that
=> TODO: how are the keys published?


"Eve can’t
look at the MAC’d message and determine that Alice sent it,
because Eve doesn’t know the MAC key"

Law enforcement grabs a dump of messages and has managed to recover the enc key
=> even if we trust law enforcement not to have forged any messages, we can still say that someone else generated everything without having to say that they stole our keys? But then the sigs won't check out? OHHH so that's why we publish the MAC keys - we say that someone could have massaged our message to make it say anything, and then used the MAC keys we've published to sign it and make it look legit
=> TODO?: do we sign then encrypt or vv? Makes a difference for how hard it is to fiddle with a message and then produce a valid signature








## ARCHIVE

# PGP
## Encryption
Encrypted using R's public key, decrypted using their private key
Doesn't say anything about who *sent* the message

## Authentication
Sig created using S's private key
Sig verified using S's public key
Totally separate to who is receiving the message
Oh so actually maybe encryption and auth *are* separated in PGP?

# OTRM
## Enc
Encrypted using shared secret, actively negotiated and verified using both parties' private/public keys

## Auth
Also done using same shared secret

Enc+auth are deliberately tied together because this means that anyone who can verify the sig could also have produced the message. This is not the case with PGP


## Forgeability

Forgeability - very easy to monkey with encfrypted text
Use a cipher that doesn't provide any integrity of authenticity
That is bolted on by the HMAC
=> is this really all we've really got for deniability? Seems a bit weak - relies on the fact that someone could have theoretically fully guessed the text and messed with it.
https://en.wikipedia.org/wiki/Stream_cipher_attacks
I guess it works even if you just do it with a small section of the message

Doesn't this only come into play if keys are revealed somehow anyway? (yes)


TODO?: Without this property, you'd have non-repudiatability by the back door (or unlikely repudiatability) - because it was encrypted using a secret value rather than a public key. If law enforcement recovered the shared secret (eg. bad RNG) and a message then they'd be able to prove that you (or Bob) wrote the message.
=> Could have been that someone else stole the shared secret but this is a less plausible denial

4.3
Anyone who can decyrpt a message can also update it and modify the MAC
This is different to PGP because in PGP signing is done using private key (https://protonmail.com/support/knowledge-base/how-to-use-pgp/ yes this is correct)
They say that if Eve can recover the the encryption key (eg poor RNG) then she still can't prove anything
This doesn't apply to PGP









## Misc

Doesn't necessarily revolutionize anything, but it's a marginal improvement
And is very interesting

You could deny any heinous Tweet by saying that someone stole your phone. In general we have to cancel everyone just to be sure


TODO?: do we sign then encrypt or vv? Makes a difference for how hard it is to fiddle with a message and then produce a valid signature

=> we're making our denial more plausible by requiring less James Bond espionage in order to carry it out

3.3
"Further, Bob can’t
even prove to a third party that Alice sent the message; all
he can prove is that someone with the MAC key generated
it, but for all anyone knows, Bob could have made up the
message himself!"
=> TODO?: Could Bob have invented the entire conversation, including the key exchange, after the bit where Alice sends him the Diffie-Hellman value and adds in her little bit of authentication? Just proves that *a* message was signed with *a* MAC key that was partially generated by Alice?


Consider the case where a sketchy journalist grabs your encrypted messages, signatures, and shared secrets
TODO?: Thanks to PFS they can't prove that this all came from you or your hard-drive (right?)

Consider the case where law enforcement grab your encrypted messages, signatures, and shared secrets.
If the courts and the public trust law enforcement then you can still claim that someone else monkeyed with the messages. It's a bit more plausible, especially if the dump passed through a few more hands to get to them
Even if we trust everything law enforcement say and view them as a safe harbor, you still have the defence that someone else monkeyed with the messages and law enforcement had nothing to do with it

Sidenote: As recording technology has become easier it's become easier to record and maybe prove this. But as fake technology has become better it's now somewhat more plausible to claim fakery

video taping Zero Knowledged proof

https://en.wikipedia.org/wiki/Deniable_authentication
In cryptography, deniable authentication refers to message authentication between a set of participants where the participants themselves can be confident in the authenticity of the messages, but it cannot be proved to a third party after the event.


Could just save messages but throw away sigs
But what if someone was watching you exchange messages? Or had root on your computer?
Sigs are radioactive - as soon as they get revealed you're screwed unless you reveal the keys that generated them, which is where OTRM comes in





## Qs

* If we didn't use stream cipher then would everythign technically still be deniable, this just makes tampering more likely/plausible?
* Suggest threat models
* Encrypt then sign or vv?













However, Off-The-Record Messaging is very wary about cryptographic trust. One of the primary aims of the protocol is to ensure that communication is, at least after-the-fact, untrustworthy and unverifiable. As we'll see, it therefore uses HMACs (TODO - explain acronym) to provide its signatures. An HMAC signature is produced by passing a message's contents and a single secret key through a cryptographic hash function. To verify a signature, the verifier must know the same secret key that the signer used to produce it, and must simply recompute the signature using the same process as the signer. This is in contrast to PGP signatures, where producing and verifying a signature are two different processes that use two different keys.

To see why this is helpful for OTRM, consider what happens if an attacker manages to steal everything about a conversation between two victims: the unencrypted messages, their signatures, the encryption and signing keys, the whole lot. The attacker wants to take the conversations to WikiLeaks and use the message signatures to prove that they are real.

The Podesta Emails have shown how effective this can be for PGP signatures. Wikileaks can verify the signatures using the public keys of the signers. The attacker can credibly claim not to have access to the private keys that generated the signature, so Wikileaks can have high confidence that the emails are genuine and were signed by the real sender. This works because PGP uses different keys to create and verify signatures.



However, HMAC signatures are both created and verified using the same, single key. 




Signatures only help if a third party can both read a message and not create signatures for messages
If they can't read the message and can't create signatures then that's fine and normal
If they can do both then they can't prove anything to anyone else. Bad, but defend-able
If they can't read but can sign then that's weird but is probably OK



====

### Revealing hMAC keys


However, if the third-party cast-iron trusts the thief then this doesn't matter. If they believe that the thief really did steal these messages and really didn't tamper with them then everyone concerned can be confident that the messages are real. Publishing the HMAC keys introduces some extra layers of doubt into even the most undoubting relationship.

Suppose that the attacker stole the messages and signatures from the victim. They use the signatures to "prove" to their associates that the messages are genuine. As we've seen, the signatures don't really prove anything, since the signatures are trivial to fake, but the attacker has worked with their associates for many years and they trust each other implicitly.



Publishing signing secrets in this way means that anyone can use them to fake signatures, which in turn means that all signatures generated by the key - both in the past and the future - become untrustworthy and useless. However, Alice and Bob don't care about this because they verified that the message signature was valid while the signing secret was still a secret.

Suppose that Eve stole an unencrypted dump of Alice's messages, including all the HMAC signatures. Since CONTINUE

It becomes impossible to tell whether an old signature was legitimately generated by the signer, or by a forger. The fact that old signatures become useless means that the signer's conversation partners can no longer trust them, but this is not a problem because they have presumably already used them to verify whatever information they were needed for. By contrast, the fact that old, legitimate signatures become useless to third-party verifiers is hugely problematic, because they have not yet been able to use them to verify the messages' veracity.


In our discussion of Google's DKIM keys, we observed that signers can short-circuit this trust by publishing their private signing key. 


It is possibly practical (although a pain) for users to reveal and rotate their signing keys once every few months. However, until a signing key is published, signatures generated using it stay valid and therefore dangerous. We want to reduce the hassle of revealing our signing keys, and increase the frequency with which we can do it.

As we'll see, OTRM's approach is to sign messages using a temporary, or *ephemeral* shared secret agreed by the two participants. This secret is generated on-the-fly, which means that revealing it doesn't really cost us anything, since we can trivially generate a new ephemeral shared secret for every message that we want to sign.

TODO: is it interesting that Alice and Bob both know it?

TODO: Be careful what you sign - Never sign anything apart from intermediate values [TODO - look this up more]


However, suppose an attacker has access to all the messages and signatures. This might happen if TODO. With normal PGP signatures, the attacker can use the signer's public key to verify their signatures. If their private key is still private, the attacker can be confident that the signatures were generated by the real conversant. They can take their stolen data to a third-party, who can run the same verification. Even if they are skeptical of the person bringing them the messages, they can be relatively confident that the sigantures and therefore the messages are legitimate.

TODO: what situation does this actually matter in? Dump stolen and verified at time t=0, then keys stolen later?


NOTE: Now the verifier doesn't just have to trust in the person bringing them the messages. Person with the messages might be completely honest, but have stolen a faked set of messages. This could have happened previousuy, but publishing MAC keys makes it more plausible




====

## NEW QUESTIONS

* 2021-01-24: why bother with a MAC rather than just a checksum? If someone can read the message then they can update the checksum. I guess we wanted to have malleability in order to make the messages easy to mess with, and they could update the checksum. What happens if we don't have malleability again?







## Irl conversation properties




The physical world has reasonably strong and - by definition - intuitive privacy settings. Suppose that you have a clandestine conversation with a friend in a local park. If you inspect any nearby shrubberies then you can be relatively confident that no one is eavesdropping on you. And unless you're being secretly recorded or filmed, which in most situations is unlikely, you can be similarly confident that no permanent, verifiable record of the conversation is being made. You and your friend can easily have a secret, off-the-record exchange of views.

Technology makes communication easier, but it also changes its privacy settings. These changes don't necessarily increase or decrease net privacy, but they do change the threats and vectors that participants need to consider. No one can hide in your garden and overhear your email or instant messages, but they can glimpse your screen over your shoulder or intercept your traffic as it travels over a network. There's no record of a conversation in the middle of a park apart from the other person's word, but emails and instant messages create a papertrail, which is both useful and incriminating.

Let's consider Alice and Bob. Alice and Bob want to talk to each other online, but, as always, their privacy is under threat from the evil Eve. Alice and Bob are concerned that Eve may intercept their traffic; compromise their computers; and generally try to find out what they are saying or manipulate the contents of their messages.

One way in which Alice and Bob can prevent Eve from using their network traffic to read or spoof their communication is by using standard cryptographic protocols such as PGP (Pretty Good Privacy) that provide both *encryption* (preventing Eve from reading their messages) and *authentication* (preventing Eve from spoofing fake messages). PGP is very good at facilitating secret, verifiable communication. However, it comes with unexpected and often undesirable side-effects.

## The problems with PGP

Let's start with how PGP works when everything goes according to plan. Suppose that Alice wants to use PGP to send an encrypted message to Bob. She takes Bob's public key and uses it to encrypt her message. She sends the resulting ciphertext to Bob, and Bob uses his private key to decrypt and read it. Since the message can only be decrypted using Bob's private key, which only Bob knows, Alice and Bob can be confident that Eve can't read their message.

However, even though Bob is the only person who can decrypt Alice's message, Bob has no strong proof that the message really was written by Alice. As far as he's concerned it could have been written and encrypted by Eve, or Eve could have intercepted and manipulated a real message from Alice. To prove to Bob that the message really was written by her, Alice *cryptographically signs* her message before sending it. To generate a cryptographic signature, Alice uses a cryptographic hash function [TODO-does-it-have-to-be-crypto] to hash her message, the encrypts this hash with her private key. This gives Alice a *cryptographic signature* for her message. Alice appends the signature to her encrypted message, and sends them both to Bob.

When Bob receives the message and signature, he uses the signature to prove to himself that the message was written by Alice and has not been tampered with. Bob does this by performing a similar but different process to that used by Alice to generate the signature. He too calculates the hash of Alice's message, but then he uses Alice's *public* key to *decrypt* Alice's signature. If the resulting plaintext matches the hash of Alice's message then Bob can be confident that the signature was generated using Alice's private key, and that the contents of the message haven't changed. Since Alice is the only one who knows her private key, she is the only one who could have generated the signature, and so Bob can infer that the message really was written and signed by Alice.

[TODO-pic]

This is how PGP gives Alice and Bob privacy and authentication. If Eve is listening on the connection between Alice and Bob's computers and intercepts their encrypted message then she won't be able to decrypt it, because she doesn't know Bob's private key. If Eve tries to spoof a fake message to Bob from Alice then she won't be able to produce a valid signature because she doesn't know Alice's private key. When Bob verifies the signature attached to the message, he will discover that something is afoot. If everything goes perfectly, PGP works perfectly.

However, in the real world, we have to plan for the very real possibility that sometimes everything does not go perfectly. PGP relies on private keys staying private. If a user's private key is stolen then the security properties that it previously underpinned are blown apart. If Eve has access to Bob's private key and intercepts Alice's message on its way to Bob, then Eve can use Bob's private key to decrypt and read the message. If Eve also has access to Alice's private key then she can use it to sign fake messages that Eve herself has written, making it look like these messages came from Alice herself. If their private keys are compromised and used in this way then Alice and Bob have no good defences, apart from scrambling to generate and exchange new keys so that they can open a new encrypted line of communications.

It gets worse, however. We know already that if Eve steals a private key then she can use it to decrypt any future PGP messages that she intercepts and that were encrypted using the corresponding public key. But suppose that Eve had been listening on the connection between Alice and Bob for months or years, patiently storing all of the encrypted traffic. At the time she had no way to read any of it, but with access to Bob's private key Eve can read all of the old stored traffic that was encrypted using Bob's public key. This gives her access to stacks of previously-secret messages.

But it gets *even* worse. Alice cryptographically signed all her PGP messages so that Bob could be confident that they were authentic. However, while generating a signature requires Alice's private key, *verifying* that signature only requires her public key. By definition, this is typically freely available. This means that Eve can use Alice's signatures to verify messages sent by Alice that she steals from Bob just as well as Bob can. If Eve gets access to Alice and Bob's signed messages, she also gets access to a cryptographically verifiable transcript of their communications that prevent Alice and Bob from credibly denying that the stolen messages are real. In a few sections' time we'll look at some real-world examples of how cryptographic signatures can make life more awkward for victims of hacks.

It's great that PGP gives secrecy and authentication. However, it's also brittle, and it isn't robust to private key compromise. We'd ideally like an encryption protocol that better mitigates the fallout in the event of a catastrophic hack. In particular we'd like two extra properties. First, we'd like *deniability*, which is the ability for a user to credibly deny that they ever sent hacked messages. And second, we'd like *forward secrecy*, which is the property that if an attacker compromises a user's private key then they are still unable to read past traffic that was encrypted using that keypair.

TODO - OTRM gives us this.

Let's examine these properties in detail. We'll see how they can be achieved, and why they are so desirable.

### Deniability

Deniability is the ability for a person to credibly deny that they knew or did something. Statements from in-person conversations are normally easily deniable. If you claim that I told you that I planned to rob a bank [TODO-funnier] then I can credibly retort that I didn't, and that you can't prove anything. Email conversations can be deniable too (although see below for a look into why they often aren't). Suppose that you forward to a journalist an email that I sent you in which I appear to describe my plans to rob eight banks [TODO]. I can credibly claim that you edited the email or forged it from scratch, and once again, you can't prove anything. The public or the police or the judge might still believe your claims over mine, but nothing is mathematically provable and we're down in the murky world of human judgement.

By contrast, we've seen that PGP-signed emails are not deniable. If Alice signs a message and sends it to Bob then Bob can use it to validate that the message is authentic. However, anyone else who comes into possession of a signed email can also validate the signature and prove that Alice sent the message in exactly the same way that Bob did. The validator will need access to Alice's public key, but the whole point of public keys is that they can be distributed widely and publicly. Alice is therefore permanently on the record as having sent these messages. If Eve hacks Bob's messages, or if Alice and Bob fall out and Bob forwards their past communication to her enemies or the press, Alice cannot plausibly deny having sent the messages in the same way as if she had never signed them. If you forward to a journalist an email in which I describe my plans to rob eight banks and which I cryptographically signed, I will be in a pickle.

For message senders, deniability is almost always a desirable property. There's rarely any advantage to having everything you say or write go into an indelible record that might come back to haunt you. This is not the same thing as saying that deniability is an objectively good thing that always makes the world strictly better. Wikileaks used cryptographic signatures to verify the authenticity of a dump of emails stolen from John Podesta, a US Democratic Party operative who was central to Hilary Clinton's 2016 campaign for president. The signatures in question were generated as part of the DKIM (Domain Keys Identified Mail) protocol, not PGP, but the principle is very similar. We'll talk in more detail about how this verification worked shortly.

You might think that it was a good thing that John Podesta's emails were undeniable and verifiable; I tend to think that you should be careful what you wish for. But either way I think we can agree that John Podesta thinks that it was a very bad thing, and that he would be interested in making his future communications as deniable as possible. One of the main goals of protocols like OTRM is to reduce the harm done to people like John Podesta who are victims of message hacks, and who want to be able to deny their past communications if they are ever made public. The goal of attackers is to try to subvert these protections, and so the great cosmic dance continues.

Technically anything can be denied, even cryptographic signatures. You can always claim that someone stole your computer and guessed your password, or infected your computer with malware, or stole your private keys while you were letting them use your computer to look up the football scores. These claims are not impossible, but they are unlikely and tricky to argue. Deniability is a sliding scale of plausibility, and OTRM goes goes to great lengths to make denials more believable and therefore more plausible. "A dog ate my homework" is a much more credible excuse if you ostentatiously purchased 20 ferocious dogs the day before.

On the flip side, it's still perfectly reasonable to believe that a message is authentic, even if it is technically deniable. We all assess and believe hundreds of claims every day on the vague balance of probability, with no mathematical proof of their validity. Screenshots of a text conversation might be enough to convince you of [TODO-refer-back-to-above], even if no cryptographic signatures are available.

On the face of it, deniability is in tension with authentication. Authentication requires that Bob can verify that a message was sent by Alice. Deniability requires that Alice can deny having ever sent that same message. One of the most interesting innovations of OTRM is how it achieves these seemingly contradictory goals simultaneously.




### The Podesta Emails and the Hunter Biden laptop

https://blog.cryptographyengineering.com/2020/11/16/ok-google-please-publish-your-dkim-secret-keys/
https://wikileaks.org/podesta-emails/
https://wikileaks.org/podesta-emails/emailid/10667
https://wikileaks.org/DKIM-Verification.html

Cryptographic signatures are used in many protocols, not just PGP. And whenever there's a cryptographic signature, there might also be a problem with deniability. For example, take the stories of the DKIM email verification protocol, US Democratic Party operative John Podesta, and the laptop of Hunter Biden, President Joe Biden's son.

In the old days, when an email provider received an email claiming to be from `rob@robmail.com`, there was no way for the provider to verify that the email really was sent by `rob@robmail.com`. Spammers abused this trust to bombard email inboxes around the world with forged emails. The DKIM protocol was created in TODO to allow email providers to verify that emails they receive are legitimate, and the procotol is still used to this day.

In order to use DKIM, email providers generate a signing keypair and publish their public key to the world (via a DNS TXT record, although the exact mechanism is not important to us here). When a user sends an email, their email provider generates a signature for their email using their private signing key. The provider inserts this signature into the outgoing message as an email header.

[TODO-pic]

When the receiver's email provider receives the message, it looks up the sending provider's public key and uses it to check the DKIM signature against the email's contents. They perform this check in exactly the same way as a recipient would check a PGP signature. If the signature is valid, the receiving provider accepts the message. If it is not, the receiving provider assumes that the message is forged and rejects it. Since spammers don't have access to mail providers' signing keys, they can't generate valid signatures, and so can't generate fake emails that pass DKIM verification. DKIM is therefore very good at preventing email forging.

[TODO-img]

However, a DKIM signature provides permanent proof that the signed message is real and unaltered, in much the same way as a PGP signature. DKIM signatures are part of the contents of an email, so they are saved in the recipient's inbox. If a hacker steals all the emails from an inbox, they can use the sending provider's public DKIM key to validate DKIM signatures themselves. DKIM signing keys are rotated regularly so the key currently in the DNS record may be different to the key used to sign the message, but for many large mail providers historical DKIM public keys can easily be found on the internet. The attacker already knows that the emails are legitimate, since they stole them with their own two hands. However, DKIM signatures allow them to prove this to a sceptical third-party as well.

Matthew Green, a professor at Johns Hopkins University, points out that making emails non-repudiatable like this is not one of the goals of the DKIM protocol[LINK]. Rather, it's an odd side-effect that wasn't contemplated when DKIM was originally designed and deployed. Green also argues that DKIM signatures make email hacking a much more lucrative pursuit. It's hard for a journalist or a foreign government to trust a stolen dump of unsigned emails sent to them by an associate of an associate of an associate, since any of the people in this long chain of associates could have faked or embellished the the emails' contents. However, if the emails contain cryptographic DKIM signatures generated by trustworthy third parties (such as reputable email providers), then the emails are provably real, no matter how questionable the character from whom they came. Cryptographic signatures don't decay with social distance or sordidness. Data thieves are able to piggy-back off of Gmail's (or any other DKIM signer's) credibility, making stolen, signed emails a verifiable and therefore more valuable commodity. 

In March 2016, Wikileaks published a dump of emails hacked from the Gmail account of John Podesta, a US Democratic Party operative. Alongside each email Wikileaks published the corresponding DKIM signature, generated by Gmail or whichever provider sent the email. This allowed independent verification of the messages. You may think that the Podesta hack was, in itself, a good or a bad thing. You may believe that the long-term verifiability of DKIM signatures is a desirable property that increases transparency, or a harmful one that incentivizes email hacking. But whatever your opinions, you'd have to agree that John Podesta definitely wishes that his emails didn't have long-lived proofs of their provenance, and that most individual email users would like their own messages to be sent deniably and off-the-record.

Matthew Green has a counter-intuitive but elegant solution to this problem. Google already regularly change (or *rotate*) their DKIM keys as a best practice precaution, in case the keys have been compromised without Google realizing. Green proposes that once Google have rotated a DKIM keypair and taken it out of service then they *publicly publish* the keypair's *private key*.

Publishing the old private key would mean that anyone could use it to spoof a valid DKIM signature for an email. If the keypair were still in use, this would make Google's DKIM signatures useless. However, since the keypair has been retired, revealing the private key does not jeopardize the effectiveness of DKIM in any way. The purpose of DKIM is to allow *email recipients* to verify the authenticity of a message *at the time they receive that message*. Once the recipient has verified and accepted the message, they need never verify it again. The signature has no further use unless someone - such as an attacker - wants to later prove the provenance of the email.

Since DKIM only requires signatures to be valid and verifiable when the email is received, it doesn't matter if an attacker can spoof a signature for an old email. In fact it's desirable, because it renders worthless all DKIM signatures that were legitimately generated by the email provider using the now-public private key. Suppose that an attacker has stolen an old email dump containing many emails sent by Gmail, complete with DKIM signatures generated using Gmail's now-public private key. Previously, only Google could have generated these signatures, and so the signature proved that the emails were genuine. However, since the private key is now public, the attacker is now able to trivially generate the signatures themselves. Unless the attacker can prove that the signatures were generated while the key was still private (which in general they won't be able to), the signatures don't prove anything about anything to a sceptical third party.

The theory makes sense and the Podesta Emails are interesting, but how much difference does any of this really make? Wouldn't everyone have believed the Podesta Emails anyway, without the signatures? Possibly. But consider a more recent example in which I think DKIM signatures could have changed the course of history.

During the 2020 election campaign, Republican operatives claimed to have gained access to a laptop belonging to Hunter Biden, the son of the then-Democratic candidate and now-President Joe Biden. The Republicans claimed that this laptop contained gobs of explosive emails and information about the Bidens.

The story of how they allegedly got hold of this laptop is somewhat fantastical, involving Rudi Giulliani, Donald Trump's lawyer, and a computer repair shop in a small town in Delaware. However, somewhat fantastical stories are sometimes true, and this is exactly the type of situation in which cryptographic signatures could play a big role in establishing credibility. It doesn't matter how wild the story is if the signatures validate. Indeed, in an effort to prove the laptop's provenance, Republicans released a single email, with [a single DKIM signature](https://github.com/robertdavidgraham/hunter-dkim), that they claimed came from the laptop.

[TODO-pic]

The DKIM signature of this email is valid, and it does indeed prove that `v.pozharskyi.ukraine@gmail.com` sent an email to `hbiden@rosemontseneca.com` about meeting the recipient's father, sometime between 2012 and 2015. However, it also raises a lot of questions, and provides a perfect example of the sliding-scale nature of deniability. This single email doesn't prove anything more than what it says. It doesn't prove who `v.pozharskyi.ukraine@gmail.com` is, and it doesn't prove that the email came from the alleged laptop.

The email is cryptographically verifiable, but without further evidence the associated story and its claims of further madcap information are still plausibly deniable. It's possible that Hunter Biden was the victim of a completely separate attack, the spoils of which found their way into the hands of the Republicans. It's hard to understand why the Republicans chose to release this single, not-particularly-incendiary email if they were also sitting on a stack of additional, also-cryptographically-verifiable material. I imagine that if a full dump of emails and signatures had been released, a la Wikileaks and Podesta, then their combined weight would have been enough to overcome many circumstantial denials. Maybe the 2020 election would have gone the other way.



The second of the less-obvious desirable properties for an encrypted messaging protocol that we're going to discuss is *Forward Secrecy*.


### Forward Secrecy

Suppose that Alice and Bob are exchanging messages over an encrypted network connection. Eve is listening to their traffic, but since it is encrypted she is unable to read any of it. However, Eve decides to store the encrypted traffic, just in case she can make use of it in the future.

Suppose also that a year later, Eve compromises one or both of the private keys that Alice and Bob used to negotiate their encrypted connections. For many encryption protocols, Eve would be able to go back to her archives and use these keys to decrypt all of the encrypted traffic between Alice and Bob that she has stored over the years. However, if Alice and Bob were using a protocol with the property of *Forward Secrecy*, Eve would still not be able to read their traffic, even though she had compromised their private keys.

Cryptography is a very precise field so I'll quote a technical definition of Forward Secrecy to show that I'm also a very precise person:

> [Perfect] Forward Secrecy is a feature of specific key agreement protocols that gives assurances your session keys will not be compromised even if the private key of the server is compromised. [TODO-source]

The mathematics of how forward secrecy works are not important to us today. But briefly, the clever part typically relies on the two parties using their private keys to regularly agree on new short-lived session keys, and then using these short-lived keys to encrypt their traffic. They agree on these keys in such a way that the attacker cannot recover the session keys, even if the attacker compromises their long-lived private keys (this is the very clever part). The parties then briefly use each session key to encrypt and exchange a small number of messages (exactly 1, in the most cautious implementations). Finally, once a session key has been used to encrypt and decrypt a message, the parties "forget" it, wiping it from their RAM, disk, and anywhere else from which an attacker might be able to recover it. Once a session key has been forgotten in this way, there is no way to recover it, even if the attacker compromises their private keys. There is therefore no way to decrypt their traffic. Forward secrecy has been achieved.

PGP does not provide forward secrecy. PGP messages are encrypted using the recipient's public key and decrypted using their private key. If an attacker stores the encrypted messages and later compromises the recipient's private key, they can decrypt all historical messages encrypted to that key. One of the main goals of OTRM is to provide forward secrecy.

Forward secrecy is often called "perfect forward secrecy", including by many very eminent cryptographers. Other, similarly eminent cryptographers object to the word "perfect" because (my paraphrasing) it promises too much. Nothing is perfect, and even when a forward secrecy protocol is correctly implemented, its guarantees are not perfect until the sender and receiver have finished forgotting a session key. Between the time at which a message is encrypted and the key is forgotten lies a window of opportunity for a sufficiently advanced attacker to steal the session key from their RAM. In practice the guarantees of forward secrecy are still strong and remarkable. But when discussing Off-The-Record Messaging, a protocol whose entire reason for existence is to be robust to failures, these are exactly the kinds of edge-cases we should contemplate.

Forward Secrecy is a brilliant and desirable property that is highly desirable for OTRM, but it is not an innovation of the OTRM protocol. Instead, OTRM makes use of existing Foward Secrecy methods, without modifying them. We therefore won't focus on Forward Secrecy in this primer.

## Off The Record Messaging

We already knew that encryption and authentication are highly desirable properties for a secure messaging protocol. Encryption prevents attackers from reading your messages. Authentication allows you to be confident that you are talking to the right person, and prevents attackers from modifying or faking your messages.

We've now seen why deniability and forward secrecy are important too. Deniability allows participants to credibly claim to have not sent their messages, mirroring the privacy properties of real-life conversation and making the fallout of data theft less harmful. Forward secrecy prevents attackers from reading historical encrypted messages, even if they compromise the long-lived private keys used at the base of the encryption process.

Before we see how Off-The-Record Messaging achieves these properties, let's describe some specific scenarios and see . This is part of a process often called *threat modeling*. [TODO]



We're going to describe the OTRM protocol and demonstrate some properties of it. But first, in order to see why these properties are useful, let's describe some scenarios in which we would like it to protect its users. We'll see how PGP protects (or doesn't protect) its users in these scenarios, and then later we'll come back to these scenarios and see how OTRM handles them. This is a miniature example of a security analysis called a *threat model*.

## Scenarios

Our basic scenario is as follows:

> Alice and Bob are discussing sensitive topics by exchanging messages over a network. They want to keep their messages private, and they want to be able to authenticate their messages to ensure that they were sent by the right person and have not been tampered with. If their messages are exposed, either by an attacker or by the other person, they want to be able to deny that they sent them. They are aware that Eve, an attacker, is trying to compromise their communications and do them both harm.
>
> Alice and Bob need to use some form of encryption to keep their messages secret, and some form of cryptographic signature to ensure their authenticity. 

To see how robust different protocols are to disasters, we will analyze what happens when:

1. Eve is monitoring and storing all traffic between Alice and Bob. She has no access to their private keys
1. Eve is monitoring and storing all traffic between Alice and Bob. She then steals one or both of their private keys
2. Eve is monitoring and storing all traffic between Alice and Bob. TODO: a weak RNG means she can bust some stuff
3. Eve steals an unencrypted dump of all messages that Alice and Bob have exchanged, including their signatures
4. Eve completely compromises Alice and Bob's machines, and can see everything that they see in realtime

In each situation, think about:

1. What can Eve see?
2. What can Eve verify to her own satisfaction?
3. What can Eve prove to a sceptical third-party after the fact?

Let's see how PGP holds up in these scenarios.

### PGP

1. Eve is monitoring and storing all traffic between Alice and Bob. She then steals one or both of their private encryption keys

As we've discussed, PGP does not provide forward secrecy. If an attacker compromises the private key of a keypair used to encrypt a message, the attacker can trivially decrypt the message themselves. If Eve has stored historical encrypted traffic exchanged by Alice and Bob and steals Alice's private key, Eve can decrypt this traffic and read all messages sent to Alice.

On top of this, if Bob has PGP-signed all the messages that he sent to Alice then Eve can use these signatures and Bob's public key to prove the stolen messages' provenance to a sceptical third-party such as Wikileaks. This is good for Wikileaks but bad for Alice and Bob.

3. Eve steals an unencrypted dump of all messages that Alice and Bob have exchanged, including their signatures

The theft of an unencrypted message dump is always going to be disastrous for Alice and Bob. However, if the dump also includes PGP signatures, then Eve can once again use these signatures to prove the messages' provenance to a sceptical third-party. This is even worse.

4. Eve completely compromises Alice's machine, and can see everything that she sees and does in realtime

If Eve has completely compromised Alice's machine then she can see and decrypt all messages that Alice sends and receives. Eve can use PGP signatures to verify the veracity of messages that Alice receives to a sceptical third-party.



With all of this context under our belt, let's take a tour of the mechanics of OTRM. We'll then take a in-depth look at why and how OTRM achieves the goals that it sets itself of XYZ [TODO].

## OTR summary

TODO: OTRM requires handshake, PGP doesn't

To send an OTRM message, the sender and recipient must:

1. Generate and agree on a secret encryption key
2. Authenticate each other's identity
3. Encrypt and send a message

OTRM performs these steps in a way that keeps the sender's message both secret and tamper-proof. OTRM also provides forward secrecy, keeping the message secret even if the sender's long-lived private keys are compromised. Finally, OTRM provides deniability, allowing the sender to deny that they ever sent a message, even if the message and associated signature are made public.

## 1. Encrypt

The sender needs to encrypt their message so that snoopers can't read it but the intended recipient can. An encryption protocol consists of methods to allow the sender and receiver to:



As we've discussed above, the encryption scheme that we choose also needs to provide Perfect Forward Secrecy and Malleability.





In PGP encryption, the sender encrypts their message using the recipient's private key directly. However, many encryption protocols (including OTRM) take a slightly different approach. Instead of performing encryption using a private key, they have the sender and recipient being their conversation by agreeing on a shared secret session key. This is a short-lived or *ephemeral* key that the sender and recipient use to actually encrypt and decrypt the message, rather than using the private key directly. Encryption algorithms where the same key is used to encrypt and decrypt the message are known as *symmetric*; those in which different keys are used for encryption and decryption (such as PGP) are known as *asymmetric*.

The trick is in allowing Alice and Bob to agree on a shared secret in such a way that, even if Eve is watching every byte they send each other during the key-exchange process, Eve will still not know what the shared secret is. This essential requirement means that, for example, Alice can't simply send Bob a key, and then follow up with a message encrypted using that key. If Alice and Bob had met in person then they could have agreed on a shared secret then, but a protocol that required you to physically meet every person who you wanted to communicate with before you could send them a message would be of limited use.

Some key-exchange protocols have the sender choose a random shared secret, and then use the recipient's public key to encrypt the key. The sender sends the the encrypted key to the recipient, who uses their private key to decrypt it. Since Eve does not have access to the recipient's private key, she cannot deduce the shared secret. The sender is therefore free to use the shared secret to encrypt their message.

TODO: why use session keys?

This approach is effective, but it does not provide forward secrecy. If Eve stores all of Alice and Bob's encrypted traffic, and later compromises Bob's private key, she can use it to decrypt the shared secret on its way from Alice to Bob, and use the shared secret to decrypt the actual message.






OTRM achieves forward secrecy by agreeing on a shared secret key using a process called *Diffie-Hellman key exchange*. The details of how Diffie-Hellman achieves forward secrecy are not important to us here. [TODO how does signing work?]

Once a secret key has been agreed using Diffie-Hellman, OTRM use the key to encrypt a message using "a stream cipher with AES in counter mode". Once again, the details of what this means are not important - we can treat this algorithm as a black box into which we pass a secret key and a message, and get back an encrypted ciphertext,

However, the reason why OTRM chooses a stream cipher is important: stream ciphers are *malleable*. This means that it is relatively easy (or at least plausible) for an attacker to manipulate an encrypted ciphertext and turn it into a different ciphertext that correctly decrypts into a different plaintext. The attacker can manipulate ciphertexts in this way even if they are unable to decrypt the original version and do not know the secret key that was used to generate it. It's perhaps counter-intuitive to want to make manipulation *easier* for an attack, but we'll see why this property is useful later.

[TODO-pic]

## 2. Authenticate

TODO: I think signing intermediate keys prove identity, HMAC proves that message hasn't been tampered with

By performing a Diffie-Hellman key exchange, Alice and Bob have agreed on a shared secret key and have verified each other's identities. Alice can now use their shared secret key to encrypt and send a message, and be confident that only Bob will be able to read it.

However, even though Eve can't read Alice's message, she may still try to tamper with it on its way to Bob. Indeed, as we've seen, OTRM has Alice use a stream cipher in order to make it especially *easy* for Eve to tamper with messages. OTRM therefore needs to bolt on an extra piece of authentication that Bob can check to make sure that the message has not been tampered with.

PGP achieves authentication by having the sender sign their messages using their private signing key. However, we've seen the perils of this approach, and how an attacker can use PGP signatures to prove that embarrassing communication is genuine.

OTRM avoids the problems by being very careful about what information it signs. Think of a shady business owner who does all their deals through handshakes and verbal agreements because they don't want to put their signature onto any potentially incriminating documents. Alice and Bob have to sign *something* in order to prove their identities to each other, but as we've seen, the only data that they sign with their private signing keys is the intermediate key [TODO] in the Diffie-Hellman key exchange. If an attacker is somehow [TODO] able to prove that they signed these pieces of data, this doesn't prove that they wrote any of the message generated using the resulting key.

Since Alice and Bob don't want to sign their messages using their private signing keys, OTRM has to prove the integrity of its messages using a different type of cryptographic signature. It does this using HMAC (Hash-Based Message Authentication Code) signatures. The critical property of an HMAC signature is that it is symmetric, meaning that it is both generated and verified using a single shared secret key. We'll see why this is important shortly.

In order to generate an HMAC signature for a message, the signer passes the message and the secret key into the HMAC algorithm (once again, it doesn't matter to us how HMAC works) and gets back an HMAC signature. They send the message and HMAC signature to the recipient. In order to verify the signature, the recipient performs the same process, passing the message and the secret key into the HMAC algorithm, and getting back an HMAC signature. If the signature that the recipient calculates matches the signature provided by the sender then the recipient can be confident that the message has not changed and has not been tampered with.

In order to use HMAC signatures, the sender and recipient need to agree on shared secret signing key. OTRM has them use the *cryptographic hash* of their shared secret encryption key. A cryptographic hash is a one-way function that produces a random-seeming but consistent output for a given input. Given an input it is very easy to calculate the cryptograhic hash output. By contrast, given a cryptographic hash output it is impossible to calculate the input that produced it. Using the hash of their encryption key as their signing key is convenient, since it removes the need for Alice and Bob to perform another key-exchange. It also provides a subtle contribution towards deniability that we will discuss shortly.

With an encryption secret and a signing secret both agreed, the sender signs their message using HMAC and the signing secret, then encrypts the message and signature together using the shared encryption secret and a stream cipher with AES in counter mode. The sender sends their message to the recipient. Once the recipient receives the message they perform the same process in reverse; they decrypt the message in order to read it and verify the HMAC signature in order to ensure it has not been tampered with.

Finally, in an unexpected twist, the sender *publishes* the shared signing key to the world. This is safe because the HMAC key is a cryptographic hash of the encryption key, and so cannot be used to reconstruct the encryption key. However, this doesn't tell us why it is actively a useful thing to do; we'll talk about this in the next section.

In summary:

1. Sender and recipient agree on a secret encryption key using Diffie-Hellman key exchange
2. Sender signs their message with an HMAC. They use a signing key equal to the cryptographic hash of the encryption key from step 1
3. Sender uses the encryption key from step 1 to encrypt their message and signature
4. Sender sends the encrypted ciphertext to the recipient
5. Recipient decrypts the cipherext and verifies the signature
6. Sender publishes the HMAC key

## Key insights

Before we go into the details of OTRM I'd like to outline some of the key insights that make it achieve its goals. My hope is that once these all make sense then the technical details of the protocol will all make much more sense.




### Signatures don't prove anything to a sceptical third-party if in order to verify them you need to be able to create them

Suppose that I drag you, panicked, down the corridor of an office building. I stop in front of a locked door. Hands shaking, I take out a key, unlock the door, and throw it open. You peer inside. You see a clear plexiglass screen, behind which is another room with another locked door. In the corner of this other room lies a dead body, still fresh. "My good buddy, Steve Steveington, was the only person with a key to that room!" I whisper, "He did this. You must arrest him." You're not a police officer so you can't do that, but you do agree that we should call the cops.

[TODO-PIC]

My story checked out and you called the law because I was able to show you that there was a dead body in the locked room behind the plexiglass screen, without being able to access that room. If I had needed to be able to open the dead-body-room myself in order to show you what was inside it, then I could not have shown you that a murder had been committed without becoming as much of a suspect as my good buddy, Steve Steveington. I was able to verify a murder without been able to have commited it.

Similarly, a person can verify a PGP signature without being able to create it. To create a signature you use a private key; to verify it you use the corresponding public key. This is a usually-useful property that makes it easy to establish and propagate cryptographic trust. People often try to explain it by making a complex analogy to an intricate series of padlocks and boxes, but I find that those rarely make anything clearer and I've already used up my metaphor allowance for this section on the murder room thing.

However, as we've seen with the Podesta Emails, this property can also allow hackers to turn your cryptographic signatures against you, preventing you from repudiating your hacked or leaked messages. One of the main goals of OTRM is to prevent your signatures from coming back to bite you like this.

To see how OTRM acheives this goal, let's go back to the murder room. Suppose instead that I unlocked the door and opened it to reveal a single, simple room with the same dead body in the corner. "My good buddy, Steve Steveington, was the only person with a key to this room!" I whisper, "He did this. You must arrest him." You're still not a police officer, but you're also not an idiot. In order to show you what's behind this door, I've just opened it myself. As far as you're concerned I could also have easily committed the murder and dumped the body in the room.

[TODO-PIC]

By hiding the body in the single locked room, my good buddy, Steve Steveington, has put me in a bind. In order to show you that there's a dead body inside the room, I need to to unlock the door. However, by unlocking the door, I also demonstrate that I could have done the murder. I know that I didn't do the murder and I know that Steve Steveington really is the only other person with a key to the room, so I know that he must have done it. But I can't prove this to anyone else. OTRM uses a less murderous version of this insight to make its signatures both authenticatable and deniable.

OTRM uses HMAC signatures. Unlike PGP signatures, HMAC signatures are both created and verified using a single shared secret key, known to both the signer and the verifier. HMAC signatures are both created and verified using the same procedure. The signer creates the signature by passing their message and the shared secret key into the HMAC algorithm. In order to verify the signature, the verifier does the same. If the signature that the verifier computes matches the one provided by the signer then it is valid. If the signatures do not match then something is afoot.

Suppose that an attacker has stolen a dump of messages, together with their HMAC signatures and the HMAC keys necessary to verify them. In the same way that Wikileaks used John Podesta's emails' DKIM signatures to prove that his emails were authentic, the attacker wants to use the HMAC signatures to prove that their own stolen message dump is real. In order to be prove that an HMAC signature is valid, the attacker recomputes the signature by passing the message and the secret key into the HMAC algorithm. They then show a sceptical third-party that this generated signature matches the signature that they have stolen.

However, since HMAC signatures are symmetric, anyone who can verify an HMAC signature must necessarily could also have produced it. This means that in order to prove to the sceptical third-party that the HMAC signature is real, the attacker must reveal that they have the tools necessary to have faked it. Even if the messages are real and were stolen fair and square, the attacker is in the same awkward position that I was when trying to show you the dead body in the single room. The sceptical third-party might still believe that the messages are genuine on the balance of probability, but this time the victim's cryptography doesn't inadvertantly work against them.

Does this mean that HMAC signatures are somehow better than PGP signatures? Why doesn't everyone use HMAC signatures all the time instead of PGP ones? 

No. HMAC and PGP signatures are different, and neither is better than the other. They are both ways of authenticating messages, and the material difference between them is that HMAC signatures use a shared secret and PGP uses public key cryptography. Which is appropriate for a given situation depends on what key exchange methods are available. TODO - also deniability, also PK gives you auth.


Public key cryptography like PGP has the advantage that the participants don't need to talk to each other directly in order to agree a key - they can freely read each other's public keys. This is convenient. However, full public key cryptography requires lots of infrastructure and checks that are often glossed over, such as roots of trust, certificate chains, and key recovation [TODO-link-to-my-post]. By contrast, in order to create and verify an HMAC signature, participants need to first communicate directly and agree on a shared secret key. This is awkward, but it's also the only thing they need to do. Once they've exchanged a secret key, there's no other checks to worry about. However, HMAC doesn't do anything to prove the identity of the person you are talking to; you'll need a further check (possibly involving public key cryptography) to do that.

Which is most appropriate also depends on the context. HMAC works well when exchanging messages with one other person. However, suppose that I want to make a public post on Reddit with a new account, but I want to prove to anyone who reads it that the account belongs to me, Robert Heaton, and that I wrote the message. I could cryptographically sign my message.

An HMAC signature requires a shared secret, but if I share a secret with the whole world then it's not really a secret anymore, since anyone could use it to spoof a signature for any message. Even more importantly, no one would have any proof that the message and signature were really generated by me. I would need some additional way to demonstrate that they were generated by me, Robert Heaton. The idea of using an HMAC signature to authenticate a public message is nonsensical.

However, PGP is perfect for this use. I can publish my public key in a way that proves it belongs to me, perhaps via my website. This proves to the world that the key really does belong to me, Robert Heaton. Having access to my public key doesn't allow anyone to spoof my signatures, since they don't have my private key. 

### Reconceive the purpose of a cryptographic signature

Message signatures only need to allow a particular person at a particular time to satisfy themselves that a message is authentic. Only the intended verifier needs to be confident that the signature is valid, and they only need to be confident that it is valid when they initially check the signature. Once the verifier has authenticated the message, they can record the fact that the signature was valid. They need never look at the signature again, and they need never trust it again. This is why it is safe for Google to publish a private DKIM signing key once the key is retired, as suggested by Matthew Green many paragraphs ago. If Google publish a retired, private DKIM signing key then all signatures generated using that key become useless, but this is OK because all of the genuine signatures have already served their purpose.

As we saw in section X.XTODO, an OTRM message recipient uses its HMAC signature to verify the message authenticity. Once they have done so, the final step in an OTRM exchange is for the sender to publish the shared secret that they used to sign the message. The reason that they do this is similar but subtly different to the reason that Prof. Green asks Google to publish their DKIM keys. Prof. Green asks Google to publish their DKIM keys because this makes old, genuine signatures produced by the keys useless to an attacker wanting to prove the validity of stolen emails. However, we've seen that OTRM signatures are already useless to attackers because they are generated using the symmetric HMAC algorithm. Even if the sender didn't publish the signing keys, thieves still can't use HMAC signatures to authenticate their swag, because the sceptical third-party they are verifying them to knows that they could have trivially faked them.

However, the attacker can still use the signatures to give themselves and their trusted accomplices confidence that the messages they've stolen are genuine. From the attacker's point of view, the HMAC keys are known only to Alice, Bob, and the attacker. Since the attacker knows that they didn't fake the messages, they can be confident that they were legitimately written and signed by Alice and Bob, even though they can't cryptographically prove this to anyone else.

However, by publishing their ephemeral HMAC signing keys, Alice and Bob make it even easier for them to deny that they wrote the messages, and harder for the attacker to be certain that their haul is genuine. Now that everyone in the world can see their ephemeral HMAC signing keys, anyone could have written and signed the messages and left them lying around on Bob's hard drive. Admittedly, the most plausible explanation is still that Alice and Bob wrote the signed messages, but publishing their signing keys is still a cheap and cunning way to introduce some extra uncertainty. The attacker can't be as certain as they were that their messages are real, and anyone they give the messages to has to trust not only that the attacker is being honest (as before), but also that the messages weren't forged and used to dupe the attacker. It's not an "I am Spartacus" moment so much as a "she is Spartacus, or maybe he is, or perhaps her, I don't know, leave me alone."





### Malleable encryption improves deniability

The goal of OTRM is to make it as plausible as possible for the author of an encrypted, authenticated message to claim that they did not write it. We've already seen how OTRM signatures are designed so as to crumble to dust when compromised by an attacker. However, it's possible for an unsigned ciphertext on its own to make hard-to-deny ties back to the true author, even if they aren't quite mathemtically bulletproof. In the interests of completeness, OTRM tries as far as possible to sever even these diluted ties too.

For many encryption schemes, if you don't know the secret key then it's hard to produce an encrypted ciphertext that decrypts to anything meaningful. It's not quite hard enough that you can assume that any ciphertext that decrypts to a sensible plaintext must have been generated by someone with access to the secret key. However, it is still hard. This means that if a ciphertext produces sensible plaintext then it's reasonable to infer that it was probably generated by someone with access to the secret key.

If Eve is able to steal the ephemeral shared secret key that Alice and Bob used to encrypt a message


This is one reason why it's important to include extra layers of authentication in an encryption scheme.

, let alone one that makes any sense when decrypted



If you want to deny that you sent a mathematically decrypt-able message then you can claim that an attacker manipulated the message using a technique like a length-extension attack[LINKS], or that an attacker fully compromised your computer, accessed to your secret key, and generated the message themselves. These claims are technically possible but they're more outlandish than they need to be, and the goal of OTRM is to make denials as plausible as possible.

OTRM therefore deliberately chooses a *malleable* encryption cipher. This means that the cipher produces ciphertexts which are relatively straightforward for an attacker to modify, even if they don't know the secret key that generated the original ciphertext. OTRM performs its encryption using a malleable cipher called a *stream cipher*. Stream ciphers have the property that if an attacker steals a ciphertext and can guess its decrypted plaintext, they can easily manipulate the ciphertext to produce a new ciphertext that decrypts to *any* message of the same length.

[TODO-pic]

Malleability makes it easier for a victim to claim that a ciphertext that appears to have been written by them was in fact tampered with by someone else. I don't know whether this would have any power in a court of law, but it's fun to think about.



Steam ciphers are much easier for an attacker to tamper with than other types of cipher. This is why OTRM bolts on an extra layer of authentication using HMACs, which as we've seen is conveninently useless to sceptical third-parties.



Malleable ciphers give Alice and Bob the same kind of extra layer of deniability as publishing their HMAC keys. 

Suppose that Alice and Bob accidentally use a weak random-number generator when performing a Diffie-Hellman key exchange. Eve is able to use this weakness to deduce the symmetric encryption key that they agree on using Diffie-Hellman. Since Alice and Bob use the private keys to sign the intermediate values that they use in the key exchange, Eve can prove to a sceptical third-party that Alice and Bob performed a key exchange that produced the symmetric key that she has deduced.

This isn't the end of the world. Since Alice and Bob encrypt their messages using a symmetric cipher, it's already the case that if Eve can use the symmetric key to decrypt their messages to recover the plaintext, then Eve could have used that same symmetric key to have produced the ciphertext herself. Eve therefore can't use their ciphertexts to cast-iron incriminate them, because she could have produced the ciphertexts herself. This is exactly the same principle as for HMAC signatures, and it doesn't require the cipher that Alice and Bob use to be malleable.

However, as with HMAC signatures, the fact that the ciphertexts decrypt to a sensible plaintext does give Eve a lot of confidence that they are genuine, as well as anyone else who implicitly trusts Eve. In HMAC signatures Alice and Bob injected some extra uncertainty by publishing their HMAC signing keys after they had been used. This made it clear that anyone could have generated the signatures, not just Alice, Bob, or a hypothetical attacker.

Similarly, by using a malleable cipher, Alice and Bob make it more plausible that a ciphertext that can be decrypted to an intelligible plaintext using their symmetric encryption key could have been manipulated by anyone who was able to guess one of their real messages.






### Principle of Most Privilege

You may have heard of the Principle of Least Privilege. This security precept states:

> Any user, program, or process should have only the bare minimum privileges necessary to perform its function.

Applying Least Privilege to your system means that an attacker who compromises one part of it won't be able to easily pivot into new parts and powers, and so will only be able to do limited damage. This is why spies operate in small cells; if they are discovered and interrogated then they don't have enough knowledge or privileges to help their captors roll up their chain of command. This is also why you shouldn't give everyone in your company administrator access to all of your systems. You might trust everyone implicitly, but giving a user unnecessary powers needlessly worsens the consequences of their account getting compromised. It's bad if an attacker is able to read all of one person's emails; it's much worse if they can read everyone's emails and forge new messages that they look like they came from the CEO.

By contrast, I would argue that OTRM goes out of its way to achieve the opposite: The Principle of Most Privilege! To see why I think this, remember that the worst-case situation that OTRM tries to prevent at all costs is the one in which an attacker:

1. Has access to unencrypted, signed messages
2. Can prove to a sceptcial third-party that the signatures are valid
3. Could *not* have produced the signatures themselves

This combination is a disaster because means that the attacker can read Alice and Bob's messages and use their cryptographic signatures to prove their legitimacy to a sceptical third-party. It's important that the attacker can verify the signatures (point 2), but *can't* produce them (point 3), because then the third-party can trust that the attacker didn't forge the signatures themselves. The attacker's capabilities are limited, which is Least Privilege in action but in an oddly unhelpful way.

As we've seen, OTRM prevents these 3 properties from occuring simultaneously by making it impossible for points 2 and 3 to be true at the same time. If an attacker can verify a signature (point 2) then they must have its symmetric HMAC key and so *could* have generated it themselves (the opposite of point 3). This is the Principle of Most Privilege in action - if you want to verify signatures, then you have to also be able to create them.

The ideal situation is of course that users' communications stay secret and no one has any access to any of their messages, keys, or sigantures. Any sensible encryption scheme works well when everything goes as planned, but OTRM puts substantial focus on what happens when it doesn't. Usually we want to segment powers and credentials; this is an odd situation in which we don't.

NB: The Principle of Most Privilege is not a real principle, I just made it up. Don't bother Googling it.




========



We're going to describe the OTRM protocol and demonstrate some properties of it. But first, in order to see why these properties are useful, let's describe some scenarios in which we would like it to protect its users. We'll see how PGP protects (or doesn't protect) its users in these scenarios, and then later we'll come back to these scenarios and see how OTRM handles them. This is a miniature example of a security analysis called a *threat model*.

## Scenarios

Our basic scenario is as follows:

> Alice and Bob are discussing sensitive topics by exchanging messages over a network. They want to keep their messages private, and they want to be able to authenticate their messages to ensure that they were sent by the right person and have not been tampered with. If their messages are exposed, either by an attacker or by the other person, they want to be able to deny that they sent them. They are aware that Eve, an attacker, is trying to compromise their communications and do them both harm.
>
> Alice and Bob need to use some form of encryption to keep their messages secret, and some form of cryptographic signature to ensure their authenticity. 

To see how robust different protocols are to disasters, we will analyze what happens when:

1. Eve is monitoring and storing all traffic between Alice and Bob. She has no access to their private keys
1. Eve is monitoring and storing all traffic between Alice and Bob. She then steals one or both of their private keys
2. Eve is monitoring and storing all traffic between Alice and Bob. TODO: a weak RNG means she can bust some stuff
3. Eve steals an unencrypted dump of all messages that Alice and Bob have exchanged, including their signatures
4. Eve completely compromises Alice and Bob's machines, and can see everything that they see in realtime

In each situation, think about:

1. What can Eve see?
2. What can Eve verify to her own satisfaction?
3. What can Eve prove to a sceptical third-party after the fact?

Let's see how PGP holds up in these scenarios.

### PGP

1. Eve is monitoring and storing all traffic between Alice and Bob. She then steals one or both of their private encryption keys

As we've discussed, PGP does not provide forward secrecy. If an attacker compromises the private key of a keypair used to encrypt a message, the attacker can trivially decrypt the message themselves. If Eve has stored historical encrypted traffic exchanged by Alice and Bob and steals Alice's private key, Eve can decrypt this traffic and read all messages sent to Alice.

On top of this, if Bob has PGP-signed all the messages that he sent to Alice then Eve can use these signatures and Bob's public key to prove the stolen messages' provenance to a sceptical third-party such as Wikileaks. This is good for Wikileaks but bad for Alice and Bob.

3. Eve steals an unencrypted dump of all messages that Alice and Bob have exchanged, including their signatures

The theft of an unencrypted message dump is always going to be disastrous for Alice and Bob. However, if the dump also includes PGP signatures, then Eve can once again use these signatures to prove the messages' provenance to a sceptical third-party. This is even worse.

4. Eve completely compromises Alice's machine, and can see everything that she sees and does in realtime

If Eve has completely compromised Alice's machine then she can see and decrypt all messages that Alice sends and receives. Eve can use PGP signatures to verify the veracity of messages that Alice receives to a sceptical third-party.

