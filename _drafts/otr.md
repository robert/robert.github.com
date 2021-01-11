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







https://otr.cypherpunks.ca/otr-wpes.pdf
Original paper


## Irl conversation properties




Privacy settings in the real world are quite good. You can have a conversation with your friend and be reasonably confident that no one is eavesdropping. No permanent record of the conversation is made, unless it's being secretly recorded or filmed, which for most people in most situations it probably isn't. I'm not sure whether these privacy settings are objectively good, or whether they're just what humans in free societies have grown up to expect and function with.

Technology makes communication easier, but it also changes its security properties. These changes don't necessarily increase or decrease security overall - they just change the threats that participants need to consider. No one can overhear an email or IM exchange with their meat-ears, but they might see your screen over your shoulder, or intercept your traffic as it travels over a network. Sending messages by text by default creates a papertrail of everything that you say. This is both useful and incriminating.

Let's consider a specific scenario: Alice and Bob want to talk to each other privately online. They are concerned about the possibility that Eve will eavesdrop or tamper with their messages. The most obvious defences that they need to erect are to ensure that Eve can't read their messages, and can't spoof fake messages.

These goals can be achieved with standard cryptographic protocols like PGP (Pretty Good Privacy) that provide both *encryption* (preventing Eve from reading their messages) and *authentication* (preventing Eve from spoofing fake messages).

Alice wants to use PGP to send an encrypted, authenticated message to Bob. First, she takes her private key and uses it to sign the unencrypted body of her message. This produces a digital signature that she appends to the body of her message. Then she takes Bob's public key and uses it to encrypt the message and signature together, producing an encrypted ciphertext. Finally, she sends the ciphertext to Bob over a messaging platform.

If Eve is listening on the connection between Alice and Bob and intercepts the encrypted message, she will be unable to decrypt it, because she doesn't have Bob's private key.

When Bob receives the message, he first uses his private key to decrypt the message. This allows him to read the message and its signature. Finally, he uses Alice's public key to verify the signature. Bob knows that no one could have produced this signature for this message without access to Alice's private key, which gives him very high confidence that the message was genuinely written and sent by Alice.

---BOX---

A basic understanding of PGP and *public key cryptography*, the technique that underlies it, is important for understanding why Off-The-Record Messaging is interesting and special. If you are familiar with these concepts then you can skip this box.

TODO: possibly explain PK crypto

---END BOX---

PGP gives Alice and Bob encryption and authentication. If everything goes perfectly, it works perfectly. However, in the real world, we have to plan for the very real possibility that sometimes everything will not go perfectly. Public key cryptography relies on private keys staying private. If a user's private key is stolen, the security properties of public key cryptography are blown apart. If Eve has access to Alice's private key then she can use it to sign fake messages and make it look like they came from Alice herself. If Eve has access to Bob's private key and can intercept Alice's message on its way to Bob, then Eve can decrypt and read the message.

It gets worse, however. Eve can use a stolen private key to read any future messages that she can intercept. But she can also read any old messages that were encrypted with that key that she has grabbed. If Bob has been using the same key then this could be months or even years of messages that were previously believed to be secret.

It gets even worse. Alice cryptographically signed all her messages so that Bob could be confident that they were authentic. However, whilst generating a signature requires access to Alice's private key, *verifying* a signature only requires her public key. By definition, this is freely available. This means that Eve can use Alice's signatures to verify the message's authenticity just as well as Bob can. This gives her a cryptographically verifiable transcript of Alice and Bob's communications that she can use in a court of law or send to an unfriendly journalist or anywhere else.

It's great that PGP gives encryption and authentication. However, the above, very plausible scenario, suggests two further desirable properties for a secure communication channel: *perfect forward secrecy* and *deniability*.

### Deniability

Deniability (also often known as repudiatability) is the ability for a person to credibly deny that they wrote a message. In-person conversations are usually easy to deny. If you claim that over lunch I told you TODO then I can credibly say that I didn't. Normal email conversations are deniable too. If you forward an email to a journalist in which I apparently say TODO then I can credibly claim that you either edited it or forged it from scratch.

By contrast, PGP-signed emails are not deniable.

When Alice sends a message to Bob, she might sign it in order to authenticate her identity to Bob. The signature allows Bob to be certain that the message was sent by Alice, and that its contents are the exact contents that Alice originally sent. This is a very useful property.

However, these same signatures mean that anyone who comes into possession of the signed emails can validate the signature in exactly the same way that Bob did. They will need access to Alice's public key, but this is unlikely to be a challenge since the whole point of public keys is that they can be distributed widely and publicly. Alice is therefore permanently on the record as having sent these messages. If Bob's email account gets hacked, or if Alice and Bob fall out and Bob forwards their past communication to her enemies or the press, she cannot deny having sent the messages in the same way as if she had never signed them.

TODO - you might think this is a benefit. I'm not sure it is, be careful what you wish for. And either way it's not a benefit for Alice. NB: wikipedia lists non-rep as an advantage of DKIM https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail#Non-repudiability . Sometimes non-rep is good - contracts, audit trails, etc

Authentication and deniability are in tension. Authentication requires Alice to be able to prove to Bob that she is Alice and her message is real. Deniability requires her to be able to credibly claim to have no idea who sent a message or why. The most interesting innovation of Off-The-Record Messaging is to achieve these seemingly opposed goals simultaneously.

For senders of casual, social messages, deniability is a desirable property. You don't want to have everything you say or write go into an indelible record that might come back to haunt you. This is not the same thing as saying that deniability is an objectively good thing that makes the world strictly better. You might think that it was a good thing that Wikileaks was able to prove the provenance of the Podesta emails

Sometimes we want messages to be un-deniable. For example, contracts are only useful if the participants can't credibly deny having made them. However, in my opinion it is sensible for casual online conversation to be deniable in the same way that casual real-life conversation is.

If a message is technically cryptographically deniable, this doesn't mean that it's worthless. We all assess and believe thousands of claims every day on the vague balance of probability that have no mathematical proof of their validity. Screenshots of a text conversation might be enough to convince you of TODO, even without a cryptographic signature.

Also note that anything can techncially be denied, even cryptographic signatures. You can always say that someone stole your computer and guessed your password. What we're trying to do here is make a denial more plausible. As we'll see, Off-The-Record Messaging goes to great lengths to make denials more plausible. "A dog ate my homework" is a much more believable excuse if you loudly and deliberately bought 20 ferocious dogs the day before.

### The Podesta Emails

https://blog.cryptographyengineering.com/2020/11/16/ok-google-please-publish-your-dkim-secret-keys/
https://wikileaks.org/podesta-emails/
https://wikileaks.org/podesta-emails/emailid/10667
https://wikileaks.org/DKIM-Verification.html

Deniability matters in the real world.

Email providers use a authentication method called DKIM to prove to mail recipients that an email is authentic and not spoofed by spammers. The email provider signs messages that they send with a private key, and makes the corresponding public key available. They make the key available via a DNS TXT record, although this detail is not important. The receiver of the messages looks up the public key and uses it to check the signature. If this verification fails, the receiver assumes that the message is forged and rejects it. This prevents spammers from sending fake, spoofed emails.

However, it also provides a permanent verification that a message is real, in exactly the same way as a PGP signature.Once again, you can try to insist that the email is bogus and that your email account was hacked or your email provider maliciously signed an email that you didn't really send. These are both technically possible, but they're much less plausible denials than simply saying "yeah that message is bogus, you have no proof that I sent it, now get out of my office."

Matthew Green points out [LINK] that this makes email hacking a much more lucrative pursuit for criminals. It's hard for a journalist or a foreign government to trust a stolen dump of emails received from an associate of an associate of an associate. Any of the people in the long chain of associates could have faked or embellished their contents. However, cryptographic signatures don't decay with social distance and personal unreliability. If the signature checks out then the emails are real, no matter how questionable the character from whom you acquired them. This means that stolen signed emails are a verifiable and therefore much more valuable commodity. Data thieves are able to piggy-back off of Google's (or any other DKIM signer's) credibility.

In March 2016, Wikileaks published a dump of emails hacked from the Gmail account of John Podesta, a US Democratic Party operative. With each email, Wikileaks included the corresponding DKIM signature, generated by Gmail or whichever provider sent the email. This allowed independent verification of the messages.

You may think that this specific hack was a good or a bad thing, and you may think that it's a good or a bad thing that the emails were cryptographically verificable. Either way, you probably agree that its generally a bad thing to incentivize email hacking. Even if you don't, you do have to agree that from John Podesta's point of view this hack and its verifiability was most definitely a bad thing, and that John Podesta and other email account owners are incentivized to want their conversations to happen off-the-record.

Matthew Green suggests that Google reduce the value of these dumps by regularly changing their DKIM keys and *publicly publishing* each private key once it has been taken out of service. This would mean that anyone could use that old private key to spoof a valid DKIM signature for an email. However, the purpose of DKIM is to allow email recipients to verify a message *at the time of receipt*. Once the receiver has verified and accepted the message, the signature becomes useless to everyone apart from future hackers who want to be able to prove the provenance of their haul.

It therefore doesn't matter if an attacker can spoof a signature for an old email. In fact it's desirable, because it means that they are now able to spoof the signatures for all the emails in their previously valuable dumps. Previously only the email provider could have generated the signatures. Now that anyone can generate them, the signatures don't prove anything about anything.

These are the key insights that Off-The-Record Messaging uses to provide both authentication and deniability: authentication only needs to be prove identity to a specific person at a specific time; and once the secret key material used to generate an authentication is made public then the associated authentications can be generated by anyone, and therefore no longer prove anything to anyone.

### Perfect Forward Secrecy

Perfect Forward Secrecy is the remarkable property that if an attacker compromises a user's private key, they still cannot decrypt traffic encrypted with that key.

Previously could store traffic forever and then decrypt it
This prevents that attack

Cool but not a key innovation of OTRM, just using a sensible thing off the shelf

## Off The Record Messaging

We already knew that encryption and authentication is a desirable property for a secure messaging platform
We've now seen that two less obvious properties are also highly desirable - deniability and PFS
We've also seen how common protocols may not provide these properties.
And I've said how I think that deniability is the coolest part of this

## Threat models

Let's talk in terms of some concrete situations and see what benefits OTRM brings to them

* Eve monitoring and storing all traffic, plus private keys are known and stolen (TODO?: do you not even need PKs for DH??)
* Unencrypted data dump stolen, including signatures
* Eve has completely compromised a machine and can see everything they can

Throughout the following protocol description, keep in mind 3 questions for each situation:

* What can Eve see?
* What can Eve verify to her own satisfaction?
* What can Eve prove to a sceptical third-party later?


## Key insights

Before we go into the details of OTRM I'd like to outline some of the key insights that make it achieve its goals. My hope is that once these all make sense then the technical details of the protocol will all make much more sense.


### Reconceve the purpose of a cryptographic signature

Key insight is making signautres restircted

Reconceive signatures as allowing a particular person at a particular time to satisfy themselves that a message is authentic. Outside of these bounds the signature doesn't prove anything. Achieve this by revealing key material once it has served its purpose

Be careful what you sign - Never sign anything apart from intermediate values [TODO - look this up more]

### Signatures don't prove anything to a sceptical third-party if in order to verify them you need to be able to create them

Signatures don't prove anything to a skeptcial third-party if in order to verify them you need to theoretically be able to create them
Analogy - using a key to open a door with a dead body and saying that only Alice has access to this room so it must have been her. Maybe you are much more trustworthy than Alice and so your story still checks out, but it's not mathematically proven

Signatures only help if a third party can both read a message and not create signatures for messages
If they can't read the message and can't create signatures then that's fine and normal
If they can do both then they can't prove anything to anyone else. Bad, but defend-able
If they can't read but can sign then that's weird but is probably OK




### Malleable encryption improves deniability

Usually it's hard to produce a ciphertext without the key
It's not quite hard enough that you can use it for authentication, but it's still hard

Making it easier to forge makes it easier to deny
=> TODO: when would this become relevant? If key is revealed because of poor RNG generation
=> If decryption key is revealed? If its symmetric then they could clearly have produced fake ciphertext already
Again, deniability is a sliding scale




### Principle of Most Privilege

Usually we want least privilege - an attacker who gets power X should not be able to easily pivot into power Y
But in this case we want compromising part of the system to give the attacker powers to manipualte it arbitrarily. Principle of Most Privilege!

If your security services are too powerful and can compromise anything at will then you can't credibly claim that you couldn't have possibly accessed a private key, so sigs become useless. I guess they become useless for your enemies too, so that's a nice win











## OTR summary

Brief overview, then we'll look at each step in more detail

* DH key exchange
* Encrypt using malleable stream cipher
* Bolt on auth using MAC with key that is hash of enc key
* Publish MAC keys to make them useless

## Encryption and PFS

Use DH to create a shared secret key then use this for PFS encryption.
Can use normal PKI to authenticate IDs

For many encryption schemes it's hard to produce sensible ciphertext without knowing the key
Shouldn't rely on this, but still. It's unlikely that anyone will be able to meaningfully disrupt your comms

However, if we chose a scheme with this property then we'd risk making our comms harder to repudiate by the back door. Technically not non-repudiatable, but much harder to do so credibly than it could be
If attacker recovers ciphertext and shared secret and ciphertext decrypts to something sensible then it's very likely to be a real message

So we want to go out of our way to make our message easy to mess with
Means that adding extra authentication for each message is extra important

## Authentication

MACs for signing, which require knowing the single key in order to either create or verify
Can only be verified by someone who could also have created the sig. This means that Bob can't prove that Alice wrote a message to a skeptical third-party
=> if Bob starts trying to do this then we leave the neat world of crypto and enter the messy real world. It seems unlikely that Bob would try to forge a message. But then if he's trying to prove to someone else that Alice said something then he probably has a grudge against her. Have to make a decision and interpret this info. OTR is just a tool to nudge the balance of probabilities in a direction

Make the MAC key the hash of the enc key so that anyone who can write a message can also sign it

Make sure the signature doesn't proove too much and make sure that it's not too hard to generate
Link it to other things - Principle of Most Privilege!!

Go even further - use the same key for signing and encryption (hash the encryption key to produce the signing key), so anyone who can read a message can also sign it. This provably avoids the bad case of read not sign (above)
Go even even further - publish the MAC key after it has served its purpose.
=> TODO: what scenario does this protect against? Eve recovers a dump of messages and deposits them with law enforcement, then law enforcement later recover the MAC key?
=> or just law enforcement recovers a dump of messages and you can say you don't know anything about them. Even if the courts still trust law enforcement, you've made the messages less useful.
=> journalists are less trustworthy than law enforcement (right?) but they can't provide any equivalent of the Podesta signatures. Public still might believe them, but your encryption scheme at least isn't working against you.
=> Don't consider journalists safe harbor so they have a problem immediately. even if we do assume law enforcement to be acting honestly, we can still deny
=> we're making our denial more plausible by requiring less James Bond espionage in order to carry it out

4.4 Revealing MAC keys
"This can be seen as the analogue
of perfect forward secrecy for authentication: anyone who
recovers the MAC key in the future is unable to use it to
verify the authenticity of past messages."
=> we only get this property if we can easily and reliably claim that the MAC keys are widely known to others. You could make this claim in normal circumstances, and sometimes you'd be telling the truth, but it's not very plausible. 

=> TODO?: doesn't this allow Eve to authenticate Alice? Or is this already assumed to be the case. Eve can authenticate that the person who published the MAC is also the person who sent the messages, but she probably knew that
=> TODO: how are the keys published?


MAC key is a hash of enc key so revealing it doesn't reveal our message

"Eve can’t
look at the MAC’d message and determine that Alice sent it,
because Eve doesn’t know the MAC key"

Law enforcement grabs a dump of messages and has managed to recover the enc key
=> even if we trust law enforcement not to have forged any messages, we can still say that someone else generated everything without having to say that they stole our keys? But then the sigs won't check out? OHHH so that's why we publish the MAC keys - we say that someone could have massaged our message to make it say anything, and then used the MAC keys we've published to sign it and make it look legit
=> TODO?: do we sign then encrypt or vv? Makes a difference for how hard it is to fiddle with a message and then produce a valid signature

## Threat models

Note: need to be more precise about what we mean by PGP. IMs encrypted with PGP?

* Eve monitoring all traffic
** PGP: fine because of encryption
** OTR: ditto

* Private keys compromised
** PGP: screwed, although could do a DH-type implementation that would be OK
** OTR: fine because of PFS

* Shared secret recovered (eg bad RNG)
** PGP: N/A
** OTR: fine, see below

* Unencrypted data dump recovered
** PGP: can prove that messages are authentic. If you had stripped the PGP sigs then you could be OK (TODO: right?)
** OTR: can't prove anything because of OTR

* Attacker has completely compromised receiver's machine and can see everything they can
** PGP: can read messages and prove authenticity. Can save PGP sigs even if they don't get stored by victim
** OTR: attacker can't prove anything, unless they can prove that they knew the info *before* the MAC keys were published. Could achieve this by publishing to a blockchain






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









