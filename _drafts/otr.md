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

Technology makes communication easier, but it also changes its security properties. These changes don't necessarily increase or decrease security overall - they just change the threats to privacy that participants need to consider. No one can overhear an email or IM exchange with their meat-ears, but they might see your screen over your shoulder, or intercept your traffic as it travels over a network. Sending messages by text by default creates a papertrail of everything that you say. This is both useful and incriminating.

Let's consider a specific scenario: Alice and Bob want to talk to each other privately online. They are concerned about the possibility that Eve will eavesdrop or tamper with their messages. The most obvious defences that they need to erect are to ensure that Eve can't read their messages, and can't spoof fake messages.

These goals can be achieved with standard cryptographic protocols like PGP (Pretty Good Privacy) that provide both *encryption* (preventing Eve from reading their messages) and *authentication* (preventing Eve from spoofing fake messages).

Alice wants to use PGP to send an encrypted, authenticated message to Bob. First, she takes her private key and uses it to sign the unencrypted body of her message. This produces a digital signature that she appends to the body of her message. Then she takes Bob's public key and uses it to encrypt the message and signature together, producing an encrypted ciphertext. Finally, she sends the ciphertext to Bob over a messaging platform.

If Eve is listening on the connection between Alice and Bob and intercepts the encrypted message, she will be unable to decrypt it, because she doesn't have Bob's private key.

When Bob receives the message, he first uses his private key to decrypt the message. This allows him to read the message and its signature. Finally, he uses Alice's public key to verify the signature. Bob knows that no one could have produced this signature for this message without access to Alice's private key, which gives him very high confidence that the message was genuinely written and sent by Alice.

---BOX---

A basic understanding of PGP and *public key cryptography*, the technique that underlies it, is important for understanding why Off-The-Record Messaging is interesting and special. If you are familiar with these concepts then you can skip this box.

TODO: possibly explain PK crypto

---END BOX---

PGP gives Alice and Bob encryption and authentication. If everything goes perfectly, it works perfectly. However, in the real world, we have to plan for the very real possibility that sometimes everything will not go perfectly. Public key cryptography relies on private keys staying private. If a user's private key is stolen, the security properties of public key cryptography are blown apart. If Eve has access to Alice's private key then she can use it to sign fake messages and make it look like they came from Alice herself. If Alice has access to Bob's private key and can intercept Alice's message on its way to Bob, then Eve can use Bob's private key to decrypt and read the message.

It gets worse, however. Eve can use a stolen private key to read any future messages that she can intercept. But she can also read any old messages that were encrypted with that key that she has grabbed. If Bob has been using the same key then this could be months or even years of messages that were previously believed to be secret.

It gets even worse. Alice cryptographically signed all her messages so that Bob could be confident that they were authentic. However, whilst generating a signature requires access to Alice's private key, *verifying* a signature only requires her public key. By definition, this is freely available. This means that Eve can use Alice's signatures to verify the message's authenticity just as well as Bob can. This gives her a cryptographically verifiable transcript of Alice and Bob's communications that she can use in a court of law or send to an unfriendly journalist or anywhere else.

It's great that PGP gives encryption and authentication. However, the above, very plausible scenario, suggests two further desirable properties for a secure communication channel: *perfect forward secrecy* and *deniability*.

### Deniability

Deniability (also often known as repudiatability) is the ability for a person to credibly deny that they wrote a message. In-person conversations are usually easy to deny. If you claim that I told you TODO then I can simply say that I didn't. Even normal email conversations are deniable. If you 




Deniability is a real-world concept






But if key gets leaked then people can read the messages
Not only that - they can cryptographically prove that Eve wrote the messages

Less obvious properties
* PFS
* Deniability

Deniability is the most interesting one imo
Deniability and authentication seem in tension - how can something be reliably authenticated but also deniable?
Key differences are WHO authentication is done to and WHEN
Only sometimes want deniability - a deniable contract is no good

Not necessarily saying that deniable convos are best for the world - they're just desirable for the individual who gets to deny them

Mention that not even Bob can prove Alice said something
Sidenote: As recording technology has become easier it's become easier to record and maybe prove this. But as fake technology has become better it's now somewhat more plausible to claim fakery

You always have implausible deniability
Encryption is missing plausible deniability. This is where OTR comes in

## Threat models

* Eve monitoring and storing all traffic between participants
* Eve monitoring and storing all traffic, plus private keys are known and stolen (TODO?: do you not even need PKs for DH??)
* Unencrypted data dump stolen, including signatures
* Eve has completely compromised a machine and can see everything they can

Questions:

* What can Eve see?
* What can Eve verify to her own satisfaction?
* What can Eve prove to a sceptical third-party later?

## PGP

Describe PGP and where it fails
* You can store encrypted messages and then decrypt it once you get the key or enough compute power to force it (ADD: something about doing this in Cold War)
* Signatures last forever - can prove that senders sent it. Denials are impluasible

## cf

https://en.wikipedia.org/wiki/Deniable_authentication
In cryptography, deniable authentication refers to message authentication between a set of participants where the participants themselves can be confident in the authenticity of the messages, but it cannot be proved to a third party after the event.

video taping Zero Knowledged proof

https://blog.cryptographyengineering.com/2020/11/16/ok-google-please-publish-your-dkim-secret-keys/
https://wikileaks.org/podesta-emails/
https://wikileaks.org/podesta-emails/emailid/10667
https://wikileaks.org/DKIM-Verification.html

Email providers like Google have made the decision, often without asking their customers, that anyone who guesses a customer’s email password — or phishes one of a company’s employees — should be granted a cryptographically undeniable proof that they can present to anyone in order to prove that the resulting proceeds of that crime are authentic. Maybe that proof will prove unnecessary for the criminals’ purposes. But it certainly isn’t without value. Removing that proof from criminal hands is an unalloyed good.

With the DKIM signature stuff, a sketchy jornalist can piggy-back off of Google's credibility
The dump can be sent along a convoluted chain of 30 people without losing any credibility
Not the case if they didn't have sigs




## Clever things to watch out for

Never sign anything apart from intermediate values

Reconceive signatures as allowing a particular person at a particular time to satisfy themselves that a message is authentic. Outside of these bounds the signature doesn't prove anything. Achieve this by revealing key material once it has served its purpose

Signatures don't prove anything to a skeptcial third-party if in order to verify them you need to theoretically be able to create them
Analogy - using a key to open a door with a dead body and saying that only Alice has access to this room so it must have been her. Maybe you are much more trustworthy than Alice and so your story still checks out, but it's not mathematically proven

Signatures only help if a third party can both read a message and not create signatures for messages
If they can't read the message and can't create signatures then that's fine and normal
If they can do both then they can't prove anything to anyone else. Bad, but defend-able
If they can't read but can sign then that's weird but is probably OK

Don't trust the person you're talking to - don't want them to be able to prove to a third-party that you said something

Plausible deniability is a sliding scale - you can always say that a dog ate your homework and no one can prove that it didn't. It's more believable if you move near a dog home with a taste for homework. That's what we do

Usually we want least privilege - an attacker who gets power X should not be able to easily pivot into power Y
But in this case we want compromising part of the system to give the attacker powers to manipualte it arbitrarily. Principle of Most Privilege!

If your security services are too powerful and can compromise anything at will then you can't credibly claim that you couldn't have possibly accessed a private key, so sigs become useless. I guess they become useless for your enemies too, so that's a nice win



OTR gives participants confidence in authenticity of convo without giving it to anyone else


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


## Qs

* If we didn't use stream cipher then would everythign technically still be deniable, this just makes tampering more likely/plausible?
* Suggest threat models
* Encrypt then sign or vv?









Real world conversations have pretty good privacy default settings. Not sure whether this is because they are objectively good, or because humans have evolved to expect and work with this
No one will hear, no one can prove that the conversation happened

Computers update the threat model and security properties

The most obvious is security from eavesdroppers
This is why encryption is used

Obviousy desirable properties:
* Encryption
* Authentication

But if key gets leaked then people can read the messages
Not only that - they can cryptographically prove that Eve wrote the messages

Less obvious properties
* PFS
* Deniability

Deniability is the most interesting one imo
Deniability and authentication seem in tension - how can something be reliably authenticated but also deniable?
Key differences are WHO authentication is done to and WHEN
Only sometimes want deniability - a deniable contract is no good

Not necessarily saying that deniable convos are best for the world - they're just desirable for the individual who gets to deny them

Mention that not even Bob can prove Alice said something
Sidenote: As recording technology has become easier it's become easier to record and maybe prove this. But as fake technology has become better it's now somewhat more plausible to claim fakery

You always have implausible deniability
Encryption is missing plausible deniability. This is where OTR comes in

## Threat models

* Eve monitoring and storing all traffic between participants
* Eve monitoring and storing all traffic, plus private keys are known and stolen (TODO?: do you not even need PKs for DH??)
* Unencrypted data dump stolen, including signatures
* Eve has completely compromised a machine and can see everything they can

Questions:

* What can Eve see?
* What can Eve verify to her own satisfaction?
* What can Eve prove to a sceptical third-party later?

## PGP

Describe PGP and where it fails
* You can store encrypted messages and then decrypt it once you get the key or enough compute power to force it (ADD: something about doing this in Cold War)
* Signatures last forever - can prove that senders sent it. Denials are impluasible

## cf

https://en.wikipedia.org/wiki/Deniable_authentication
In cryptography, deniable authentication refers to message authentication between a set of participants where the participants themselves can be confident in the authenticity of the messages, but it cannot be proved to a third party after the event.

video taping Zero Knowledged proof

https://blog.cryptographyengineering.com/2020/11/16/ok-google-please-publish-your-dkim-secret-keys/
https://wikileaks.org/podesta-emails/
https://wikileaks.org/podesta-emails/emailid/10667
https://wikileaks.org/DKIM-Verification.html

Email providers like Google have made the decision, often without asking their customers, that anyone who guesses a customer’s email password — or phishes one of a company’s employees — should be granted a cryptographically undeniable proof that they can present to anyone in order to prove that the resulting proceeds of that crime are authentic. Maybe that proof will prove unnecessary for the criminals’ purposes. But it certainly isn’t without value. Removing that proof from criminal hands is an unalloyed good.

With the DKIM signature stuff, a sketchy jornalist can piggy-back off of Google's credibility
The dump can be sent along a convoluted chain of 30 people without losing any credibility
Not the case if they didn't have sigs




## Clever things to watch out for

Never sign anything apart from intermediate values

Reconceive signatures as allowing a particular person at a particular time to satisfy themselves that a message is authentic. Outside of these bounds the signature doesn't prove anything. Achieve this by revealing key material once it has served its purpose

Signatures don't prove anything to a skeptcial third-party if in order to verify them you need to theoretically be able to create them
Analogy - using a key to open a door with a dead body and saying that only Alice has access to this room so it must have been her. Maybe you are much more trustworthy than Alice and so your story still checks out, but it's not mathematically proven

Signatures only help if a third party can both read a message and not create signatures for messages
If they can't read the message and can't create signatures then that's fine and normal
If they can do both then they can't prove anything to anyone else. Bad, but defend-able
If they can't read but can sign then that's weird but is probably OK

Don't trust the person you're talking to - don't want them to be able to prove to a third-party that you said something

Plausible deniability is a sliding scale - you can always say that a dog ate your homework and no one can prove that it didn't. It's more believable if you move near a dog home with a taste for homework. That's what we do

Usually we want least privilege - an attacker who gets power X should not be able to easily pivot into power Y
But in this case we want compromising part of the system to give the attacker powers to manipualte it arbitrarily. Principle of Most Privilege!

If your security services are too powerful and can compromise anything at will then you can't credibly claim that you couldn't have possibly accessed a private key, so sigs become useless. I guess they become useless for your enemies too, so that's a nice win



OTR gives participants confidence in authenticity of convo without giving it to anyone else


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

"If neither of the options above sounds like perfect forward secrecy, too bad --- that's as good as it gets in any protocol! Forward secrecy requires you to have full trust in your hardware and software for the entire time when your temporary key is live. It only guarantees that you are protected if you delete your key before your setup is compromised."
https://security.stackexchange.com/questions/155779/using-pfs-with-gnupg



## Qs

* If we didn't use stream cipher then would everythign technically still be deniable, this just makes tampering more likely/plausible?
* Suggest threat models
* Encrypt then sign or vv?

