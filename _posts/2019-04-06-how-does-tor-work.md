---
permalink: /2019/04/06/how-does-tor-work/index.html
title: "How does Tor work?"
layout: post
tags: [Security]
og_image: https://robertheaton.com/images/tor-cover.png
redirect_from:
  - /2019/04/06/a-comprehensive-introduction-to-tor/
  - /2019/04/06/how-does-to-work/
---
The internet is a dangerous place for Person X.

Person X is a pro-democracy activist who lives in an anti-democratic country. She uses the internet to communicate with other activists and human rights watchdogs. However, the government controls her country's only Internet Service Provider, and it uses this power to run a very effective online censorship and spying program.

Person X is not her real name, but that's OK because she's not a real person either.

<img src="/images/tor-cover.png" />

The first time that Person X used the internet to communicate with her fellow activists, she did so using unencrypted HTTP. The government was monitoring her network traffic, and was able to record the websites that she visited, the passwords that she used, and the messages that she sent. The government used her passwords to impersonate her online, and were able to destroy the activist cell that she was a part of. Once the government had seen enough, they arrested Person X and threw her in jail for reeducation.

Person X did not learn much about the dangers of freedom while she was in jail. However, she did learn a lot about encryption and HTTPS. When she was released she joined a new activist group, and she started making sure to only communicate with her new comrades over encrypted HTTPS. Of course, the government and secret police were still monitoring Person X's network, but thanks to HTTPS they could no longer read the contents of any of her messages. However, they could still read her IP packet headers, and see the IP addresses of the servers that she was accessing. They noticed that many of these IP addresses belonged to servers known to be hosting seditious material, and began blocking her access to them. Snooping on Person X's browsing destinations also alerted the government to the existence of several new activist servers that it hadn't previously known about.

Person X was frustrated and alone. Then one day a friend told here about the Tor network, and snuck her a USB stick containing a copy of the Tor browser. Person X started to use Tor to browse the internet, and was able to securely access banned websites once again. Even though the government had not stopped monitoring Person X's internet connection, Tor prevented them from seeing the IP addresses of the servers that she was accessing. The government no longer knew whether Person X was accessing harmless distractions that might help keep her downtrodden, or whether she was back to her old, troublemaking ways.

Worried, the government tried to block all Tor traffic across the entire country. Person X countered by using *bridge nodes* and *pluggable transports* (see below) to disguise the fact that she was using Tor at all. She is still by no means perfectly safe from online surveillance. She could still be busted by carelessness, a sufficiently motivated and powerful adversary, or by statistical bad luck. Nonetheless, she's in a much better place than she used to be. Her battle continues.

---

Admittedly Tor is also very useful for people interested in buying and selling guns, drugs, and child porn. But the world is a complex place, and it's my blog so I get to choose the protagonists.

---

## Introduction - Tor isn't magic

Tor nodes communicate over the same cables as everyone else. There's no secret skein of clandestine, dark-web fibre that only Julian Assange has the password for. Tor also uses the same servers, the same TCP/IP protocol, and the same encryption algorithms that the normal internet uses. Tor provides private connections over the public internet by using misdirection.

The most common way that people access the Tor network is through the Tor browser. The Tor browser looks and feels just like any other modern web browser. But whereas Chrome and Firefox send their internet traffic directly to the websites requested by the user, the Tor browser sends it traffic via the Tor network.

The Tor network is [a web of 6500 or so](https://metrics.torproject.org/networksize.html) (as of February 2019) servers called *relay nodes* (or just *relays*), all run and maintained by volunteers. Some of these volunteers are individuals; some are universities; some are companies. And even though they don't publicize this fact, some are almost certainly government intelligence agencies and other organizations interested in attacking the Tor network. However, while this type of subterfuge is absolutely something for Tor to be concerned about, it is not a particularly existential problem. As we will see, so long as the fraction of Tor relay nodes controlled by adversaries stays low, the network remains secure.

There's nothing special about Tor nodes or Tor traffic. Tor nodes are just normal computers connected to the normal internet that happen to be running a piece of software called `tor`. The Tor network is just what you get when these nodes start talking to each other. You can use the Tor network to access the normal internet, or special "onion sites" that are only accessible via Tor. In this post we're only going to look at how Tor accesses the normal internet. Onion sites are a fascinating story for another day.

## Tor uses misdirection to keep you safe from snoopers

When you visit a website using a normal web browser, your computer makes a direct TCP connection with the website's server. Anyone monitoring your internet connection (or that of the server) could trivially inspect your IP packet headers, discover the IP addresses of both you and the server, and deduce that you were communicating with each other. So long as you and the server were communicating using encrypted HTTPS, the snooper wouldn't be able to read the actual contents of your messages. But - as Person X knows all too well - sometimes even just knowing *who* you are communicating with is all the information an adversary needs.

By contrast, when you visit a website using the Tor browser, your computer never communicates with the website's server directly. Instead, the Tor browser constructs a twisty path through a random set of 3 Tor nodes, and sends your data via this *circuit*. The browser starts by sending your data to the first (or *guard*) node in the circuit. The guard node sends your data on to the second (or *middle*) node. The middle node sends your data on to the third (or *exit*) node, and finally the exit node sends your data to the website's server. The server sends its response back to the exit node, which takes care of propagating the response back to you, via the rest of the circuit.

<img src="/images/tor-network.png" />

All that a snooper watching your internet connection can see is traffic going to your guard relay node. The snooper has no easy way of knowing where your traffic goes after that. Similarly, all that a second snooper watching a web server's connection can see is traffic coming from Tor exit nodes. This snooper has no way of knowing where this traffic originated.

<img src="/images/tor-attacker-client.png" />

## Tor keeps you safe from the Tor network

What if an attacker gave up on eavesdropping, and instead set up a Tor relay node of their own? After all, if you can't beat ‘em, join their decentralized network. You don't need to prove your identity or good character in order to run a Tor relay, and the attacker could almost certainly keep their true intentions secret for a long time. The attacker's new relay would eventually become an accepted part of the network, and Tor users would start using it as part of their circuits. It's therefore not enough for Tor to protect its users from external eavesdroppers; it also has to protect its users from other participants in the Tor network.

This is not a theoretical threat. There almost certainly exist Tor relay nodes run by organizations that wish the network harm. However, so long as the fraction of Tor relay nodes controlled by adversaries remains low and manageable, Tor remains statistically secure.

Tor's definition of security is that no one (apart from the Tor end-user) is able to discover the IP addresses of both the origin and destination of a Tor circuit. If this property holds, Tor is secure, even if traffic sometimes flows through relay nodes controlled by an adversary. If traffic flows through an adversary-controlled relay, but does not help this adversary learn the IP addresses of both the origin and destination of a Tor circuit, then the Tor Foundation simply thanks the adversary for their generous donation of network bandwidth.

Let's see how Tor keeps its users safe from the Tor network itself. Let's look at what happens when Alice uses Tor to browse `topsecret.com`, and consider what each node in her circuit knows about her.

Alice's first (or *guard*) node knows her IP address, but it has no idea who she is talking to. The guard node is not responsible for communicating directly with the `topsecret.com` server, and it only ever forwards Alice's traffic to the middle node of the circuit. It has no way of knowing what the middle node does next.

The middle node knows nothing of any importance at all. It knows the IP address of the guard node and the exit node, but it has no idea who is on the other sides of either of them. It doesn't know that it is transporting Alice's traffic, and it doesn't know that this traffic is eventually headed to `topsecret.com`.

Finally, the exit node knows that someone is using Tor to browse `topsecret.com`. But since it only ever communicates with the middle node, it has no idea who this someone is.

All of this means that if Alice builds a circuit that passes through a single adversary-controlled node, she remains entirely safe. This is an impressive property that makes attacking the Tor network difficult, but it is not the end of the story. If Alice gets unlucky and chooses adversary-controlled nodes for both her guard and her exit nodes, she is back in danger of being deanonymized. We'll look more at this later.

## Can't relay nodes snoop on each other?

Suppose that Alice chooses an adversary-controlled guard node. What if this malicious guard node peaked at Alice's traffic before forwarding it on to the middle node? What if it read the routing instructions - including the end-server's IP address - that were only intended to be read by the nodes further down Alice's circuit? Wouldn't this allow the guard node to discover the IP addresses of both Alice and the server she is communicating with, thereby breaking Tor?

<img src="/images/tor-evil-guard.png" />

It would not. Tor prevents its relay nodes from snooping on each other's instructions by wrapping its payloads in multiple layers of TLS encryption. The inventor of this approach decided that this looked a bit like the layers of an onion, and this is where the name "Tor" or "The Onion Router" comes from. The analogy is a little tenuous if you ask me, but it makes for a whimsical logo.

When a Tor client constructs a circuit, it negotiates TLS sessions with each of the nodes it has chosen for its circuit using the nodes' TLS certificates and public keys (see below for more details on this process). The outcome of each TLS session negotiation is a symmetric encryption key, known only to the client and the node. In particular, thanks to TLS's impressive security properties, no node in the circuit knows the symmetric keys of any of the others.

When the client wants to communicate with the guard node - for example during the circuit setup - it encrypts its message using the symmetric key it agreed with the guard node. The guard node uses this key to decrypt the message, and reads it. That's normal enough, and is how TLS is usually used for [protocols like HTTPS](/2014/03/27/how-does-https-actually-work/).

Things get more onion-like when the client wants to send data through the full Tor circuit and out to the remote server on the other side. This time the client constructs its payload using three layers of encryption - one for each node in the circuit. The client assembles the data that it wants to send to the remote server, and encrypts it using the symmetric key it agreed with the exit node during their TLS negotiation. It then takes this encrypted output, and re-encrypts it using the symmetric key it agreed with the middle node. Finally, it takes the now doubly-encrypted output, and encrypts it for a third time using the symmetric key it agreed with the guard node.

The client is now ready to send its triply-encrypted payload through the circuit. It sends the payload to the guard node. The guard node uses its symmetric key to decrypt the first layer, peeling off the outermost layer of the onion. This gives the guard node a now doubly-encrypted payload, together with an instruction for where to forward it. A malicious guard node can't decrypt the payload any further, since it doesn't possess the necessary symmetric, TLS-negotiated keys.

<img src="/images/tor-triple-encryption.png" />

The guard node forwards the doubly-encrypted payload to the middle node. The middle node uses its own symmetric key to peel off the second layer of the onion. This gives it a singly-encrypted payload and an instruction for where to forward it.

The middle node forwards the singly-encrypted payload to the exit node. The exit node peels off the final layer of Tor's encryption, and sends the fully decrypted payload to the remote server on the other end of the Tor circuit. Tor's work is now complete. Hopefully the client and the server are using a further layer of encryption so that not even the exit node can read their actual plaintext messages. This could simply be a final layer of TLS, negotiated via the Tor circuit. However, this is up to the client and remote server to sort out, and is outside of the scope of Tor.

These multiple layers of encryption help to ensure that no relay node in the circuit knows the identity of both sides of the connection.

## The difference between Tor and a VPN

Compare a Tor circuit to a traditional VPN, another partially privacy-motivated piece of software. When you use a VPN, your computer sends all of your internet traffic to your VPN, and your VPN forwards it to the appropriate destinations. All your ISP or anyone watching your network ever sees is traffic heading from you to your VPN. They can't see inside your encrypted connection with your VPN, which means that they can't see which remote servers you are communicating with.

A VPN might therefore sound like a much simpler way of achieving the same level of privacy as Tor. It is not. The privacy from local adversaries that you get from a VPN comes at the cost of revealing everything you do to your VPN. Your VPN sits in the middle of all of your connections, seeing both sides of every connection. It communicates directly with both you and the end servers that you are talking to, and therefore sees both of your IP addresses. A VPN therefore doesn't give you the same separation of knowledge as Tor. Whereas a rogue Tor relay node is entirely survivable and par for the course, a rogue VPN provider can trivially log and exploit your entire browsing history. If you use a VPN then you had better be sure that you trust the security and integrity of whoever runs it.

<img src="/images/tor-vpn.png" />

What if you set up your VPN to forward all your traffic to a second VPN, and made that second VPN responsible for forwarding your traffic on to the appropriate destination? Now the first VPN only ever sees the IP addresses of you and of the second VPN. Similarly, the second VPN only ever sees the IP addresses of the first VPN and of the websites that you are communicating with. If you sign up to the second VPN using a fake name and a sufficiently anonymous source of funds, neither VPN ever knows your full story. This is called *proxy-chaining*, and is not a wholly bad idea, but at this point all you're really doing is gluing together a jerry-rigged, less secure version of Tor.

---

## Attacking Tor

Tor protects its users against *traffic analysis* attacks, in which an attacker tries to answer the broad question "who is Alice talking to?" However, Tor is quite open about the fact that it does not protect against *confirmation attacks*, in which an attacker tries to answer the specific question "is Alice talking to Bob?"

A confirmation attack is not trivial, and requires a large amount of up-front preparation. In order to confirm a hypothesis that Alice and Bob are talking to each other over a Tor circuit, an attacker needs to be able to monitor both ends of their circuit. The attacker can do this either by monitoring each of their internet connections directly, or by monitoring both the guard and exit nodes of one of Alice and Bob's Tor circuits.

Once the attacker has their monitoring set up, they can analyze the volume and shape of traffic that Alice and Bob send and receive. Even if Alice and Bob's communication is encrypted - and therefore unreadable by the attacker - the attacker can still see whether their broad traffic patterns match up with each other. Does Alice tend to receive packets at the same time as Bob sends them? If so, the attacker can reasonably infer that Alice and Bob are communicating with each other.

Circuits are constructed randomly, and so an attacker can't force Alice and Bob to construct their circuit using its rogue relay nodes. However, the more nodes and the more bandwidth an attacker controls, the more likely it becomes that Alice and Bob will eventually form a circuit that uses a guard and an exit node that are both controlled by the attacker. This is all the opening that the attacker needs. An attack in which an adversary systematically tries to ratchet up their control of a network is known as a *Sybil Attack*, after the main character of the book *Sybil* by Flora Rheta Schreiber.

Sybil Attacks are not theoretical. In 2014 researchers at Carnegie Mellon University appeared to [successfully carry out a Sybil Attack against the real life Tor network](https://splinternews.com/the-attack-that-broke-the-dark-web-and-how-tor-plans-to-1793853221). This was a controversial episode that I won't attempt to write a comprehensive account of. The academic literature contains many other, crazier attacks too. For example, [a 2006 paper by Steven Murdoch](https://www.freehaven.net/anonbib/cache/HotOrNot.pdf) describes the successful deanonymization of an onion server by hammering it with vast quantities of traffic, causing its CPU to overheat and slightly altering its clock skew.

Anecdotally I've heard that the NSA and GCHQ are not currently particularly concerned with fundamentally breaking the Tor network. If they need to go after any Tor users then they try to break their operational security instead. Ross Ulrich - founder of the Silk Road dark website - gave himself away by [careless use of social media](https://www.theguardian.com/technology/2013/oct/03/five-stupid-things-dread-pirate-roberts-did-to-get-arrested). If you want to buy weapons online then you still have to send your home address to a gun-toting stranger.

---

## How a Tor circuit is formed

Constructing and co-ordinating a circuit of 3 Tor nodes requires a deft touch and a detailed protocol. When asked to construct a circuit, the Tor daemon running on your computer has to choose the 3 nodes that it wants in its circuit, ask them if they're available, and negotiate a symmetric encryption key with each of them. Once your Tor browser has constructed a circuit, it uses this circuit for all of its traffic for the next 10 minutes, at which point it constructs a new one. It uses this new circuit for all new TCP streams, although any existing TCP streams using the old circuit stay there.

Let's start at the beginning, and look at how your Tor daemon chooses the 3 nodes that will form its circuit. In order to do this, your Tor daemon will need access to an up-to-date list of all nodes in the Tor network and their capabilities. It gets this list from Tor's *directory nodes*.

## Directory nodes

The state of the Tor network is tracked and publicized by a group of 9 trusted servers - known as *directory nodes* - each of which is controlled by a different person or organization. Having 9 independent nodes provides redundancy if any of them ever go down, as well as distributing trust more widely if any of them ever get compromised. The integrity of the Tor network relies heavily on the honesty and correctness of the directory nodes, and so making the network resilient to at least a partial compromise is critical.

When a Tor participant (either a client or a node) wants to know the current state of the network, it asks a directory node. Directory nodes are kept up to date on the latest network news by the relays themselves, which send each directory node a notification whenever they come online or update their settings. Whenever a directory node receives such a notification it updates its personal opinion of the current state of the Tor network.

<img src="/images/tor-directory-nodes.png" />

Since Tor is a real world distributed system, sometimes these update notifications fail, and the opinions of the directory nodes diverge. Perhaps directory nodes 1-7 successfully receive relay node A's "I'm online" notification, but nodes 8 and 9 do not. Suddenly the all-knowing co-ordinators of the Tor network disagree with each other. This disunity needs resolving.

The first version of Tor took a very passive and simple approach to conflict resolution. Each directory node returned the state of the the network as it personally saw it, and each client believed whichever directory node it had spoken to most recently. This would be a reasonable approach in many distributed systems, but for a privacy-paranoid system like Tor it was quite flawed.

It was flawed because nothing was ensuring that directory nodes were telling the truth. If an attacker were able to compromise even a single directory node, this attacker would have been able to lie about the state of the network with impunity. If a Tor client asked the compromised directory node "can I have a list of active Tor relay nodes please?" then the attacker could (for example) respond with a list containing only relay nodes that they controlled. The client would then construct a fully attacker-controlled circuit. Alternatively, if the attacker wanted to be more subtle, they could reply with the true list of Tor relay nodes, plus one extra exit node contolled by the attacker that they had until now kept secret. If the attacker made sure to only ever tell a single target Tor client about this extra exit node, then the attacker would know that any traffic seen by this extra exit node must have come from their target.

The second version of the Tor directory system made this kind of attack much harder. Instead of asking a single directory node for its view of the world, clients asked every directory node individually, and then combined their views into a consensus. This protocol change meant that a single rogue directory node could no longer distort a client's view of the network, as the rogue node would be outvoted by the remaining honest ones. However, clients could still end up computing differing consensus views of the network, depending on exactly when they had last spoken to each directory authority. This raised the possibility of statistical information leakage - a more mild version of the vulnerability described in the previous paragraph. In addition, now every client had to talk to every directory node, which greatly increased the amount of information overhead required to run the Tor network.

The third and current version of the directory system moves the responsibility for calculating a consensus from the clients over to the directory nodes themselves. Once an hour the 9 directory nodes exchange their views of the network with each other, and then combine these views into a single consensus. The resulting consensus is agreed upon and signed by all 9 directory nodes, and for the next hour every directory node returns this same signed view to every client. This approach maintains the fault tolerance and distributed trust benefits of a decentralized system, whilst ensuring that all clients see the same view of the network.

Once a client has retrieved an up to date picture of the network from a directory node, it is ready to form a circuit.

## Forming a circuit

A Tor circuit is made up of a guard node, a middle node, and an exit node. The client starts the circuit formation process by contacting the node it has chosen as its guard node. The client and guard node negotiate a TLS session, and the client asks the guard node to help it initialize a Tor circuit.

Next is the middle node. Tor's privacy requirements mean that the middle node mustn't ever know who the client is, or who the client is communicating with. This means that the client can't ever talk to the middle node directly - even just to negotiate a TLS session - since this would reveal the client's IP address to the middle. The client therefore talks to the middle node *via the guard node*. By sending traffic to each other through the guard node, the client and the middle node negotiate a new TLS session of their own, without ever making a direct connection with each other. Once they have finished, the client and the middle node have agreed a secret symmetric encryption key, and the client's Tor circuit has been extended by one node.

Next the client extends its circuit a second and final time, this time to the exit node. This process is identical to extending the circuit to the middle node, except this time the TLS session negotiation between client and exit node happens via both the guard and middle nodes. Once the final hop of the circuit has been established, the client has negotiated a separate, symmetric TLS key with each node in its circuit. The circuit is ready to send and receive data using the triply-encrypted method described several sections earlier.

## More on circuits

### Should you rely on randomness?

The Tor client chooses the relay nodes in its circuits randomly. However, in principle it could make these choices using any process it wanted. This begs the question; could you form better, more secure circuits by choosing relay nodes deliberately instead of randomly?

For example, one of the useful properties of using Tor is how it muddies jurisdictional waters by routing traffic across national borders. Should you therefore choose our nodes to ensure that we cross as many borders as possible? Should you choose them so that you enter and exit the Tor network in a friendly jurisdiction, or one other than the one in which you live?

In general the answer to these kinds of questions is no, unless you have a particularly good reason, and even then maybe not. Tor relies on the fact that all of its users' traffic is close to indistinguishable, and indeed traffic sent by uncustomized Tor clients should statistically look identical. But the more you customize your settings, the more you start to single yourself out. If you refuse to use exit nodes in Iran, or are only willing to use those in Sweden, attackers can narrow down the range of traffic that might belong to you. This might not be a practical problem for small customizations - refusing to use exit nodes in Syria is unlikely to give you away on its own - but small customizations have the potential to add up to a unique, identifiable configuration. Furthermore, if you really do have a good reason for making this kind of customization then it's possible that the internet is too much of a dangerous place for you, even if you're protected by Tor.

### Guard pinning

When a Tor client starts up for the first time, it chooses a small, random set of guard nodes. Then, for the next few months, it makes sure that each circuit it constructs uses one of these pre-selected nodes as its guard node. It still chooses new middle and exit nodes for each circuit.

This may sound counter-intuitive. Surely it would be better for Tor to reuse nothing, erase everything, and completely switch up its circuits as often as possible? The justification for guard pinning lies in Tor's specific threat model. Tor assumes that it may only take a single opening for an attacker to work out who you are and who you are talking to. Since a single vulnerable circuit can be ruinous, Tor doesn't try to minimize the average, expected number of vulnerable circuits that you will construct. Instead, through guard pinning, it tries to minimize the probability that you will ever construct one or more vulnerable circuits.

Guard pinning does not change the average, expected number of vulnerable circuits that you will construct. However, this is not the metric that Tor is trying to optimize. Guard pinning increase the chance that none of your circuits will be compromised (if you pin to good guard nodes). It also increases the chance that a large number of your circuits will be compromised (if you pin to bad guard nodes), but Tor assumes that this outcome is not *that* much worse than a single circuit being compromised. Statistically bunching up your vulnerable circuits therefore keeps you safer. On average.

Because your guard node is especially critical to the security and reliability of your Tor connection, only relays that have volunteered for and earned the *guard flag* may be used as guards. You can read more about the subtleties of guards and pinning on [the Tor Project website](https://www.torproject.org/docs/faq#EntryGuards).

### Bridge nodes

If a repressive state isn't able to crack Tor, it might instead try to block it. The complete, up-to-date list of Tor relay nodes is, by necessity, public and available for anyone to download from a directory node. The state can query a directory node for a list of active Tor relays, and censor all traffic sent to them. TorProject.org notes that "using Tor is legal in almost all countries", but they don't call them repressive states for nothing.

Tor tries to help its users circumvent the censors and hide the fact that they are using Tor through an additional type of node called a *bridge node*. A bridge node is essentially a proxy into the Tor network. A Tor user sends their traffic to the bridge node, which forwards their traffic onto the user's chosen guard node. Circuit construction and exchange of data with the remote server continue as normal, but with one additional hop via a bridge node.

<img src="/images/tor-bridge.png" />

Unlike relay nodes, the full list of bridge nodes is never published. This makes it difficult for censors to maintain a complete list of them, and therefore difficult for them to completely seal off their country from the Tor network. Tor users can ask to be sent the IP addresses of a handful of bridge nodes by [emailing bridges@bridges.torproject.org from a Gmail, Yahoo, or Riseup email address](https://www.torproject.org/docs/bridges.html.en#FindingMore). If the censors identify and block a bridge node, users can simply rotate onto another one.

Looking at destinations is not the only way in which censors can identify Tor traffic, however. They can also analyze the the traffic's shape and volume. This analysis is made difficult by the fact that traffic between Tor nodes is always encrypted using TLS. Traffic sent over an established TLS session always looks like identical garbled nonsense, whether it is being sent over Tor or not. However, the way in which Tor *establishes* a TLS session is subtly different to the way in which a non-Tor browser establishes one. A government censor could monitor its country's internet and watch for the telltale signs of a Tor TLS session being established. When it spots a connection that looks like its being established using Tor, it could block the connection and add the destination to a watchlist. Tor developers are countering with systems, called "pluggable transports", that disguise Tor traffic and make it look more like vanilla HTTPS.

---

## In conclusion

Tor keeps its users extremely anonymous against all except the most motivated of adversaries. But it isn't bulletproof, and Sybil attacks, confirmation attacks, and sheer bad luck can still ruin its users' otherwise bullet-free day.

The Tor browser is about as usable as it can be, given its privacy and security requirements. Anonymity and misdirection are fine words in the abstract, but they can be quite inconvenient when they have to be implemented on a real network. Requests sent through Tor are slow. Websites don't remember who you are, even when it would actually be kind of useful if they did. Your search results aren't personal- or local-ized, and you never stop having to click that stupid cookie law thing.

Since I don't have to evade any censors, I personally don't use Tor. I draw my convenience-privacy tradeoff line at a normal browser with several layers of adblockers and other privacy tools. I understand that this means that my ISP can see which websites I visit. On the other hand, my current ISP is Sonic Internet, whose marketing is bubbly and self-righteous enough to make me assume that they probably (hopefully) aren't doing anything too nefarious. 

I'm still glad that people like Person X have Tor. The first thing they teach you in kindergarten is "trust no one". But maybe even they'd agree that spreading your trust across three independent Tor relay operators is probably OK too.
