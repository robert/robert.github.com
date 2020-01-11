---
layout: post
title: How to run The Hive on AWS ElasticSearch
published: false
---
When my team at Stripe began setting up The Hive, my first thought was "I really hope we don't have to manage an ElasticSearch cluster".

[The Hive][thehive] is an security incident response tool. I'm sure many people would be offended if I described it as JIRA for security incidents, but you can't please everyone all the time. The Hive stores its data in ElasticSearch. Version 4 of The Hive, currently in development, is being built on top of a graph database, but is not yet ready for production use. Since The Hive is open source software that you deploy on your own infrastrucutre, if you want to use The Hive then you're going to need an ElasticSearch database.

I know that ElasticSearch is highly scalable and distributed and all the rest of it, but Stripe doesn't yet have a team that will set up and run a cluster on my team's behalf. My team's core competency is catching hackers, not Googling "elasticsearch wont turn on please help me". I personally have no appetite for learning how to replicate data across multiple machines, how to make and restore backups, or how to automatically verify that these backups are actually working. I'm sure that everything would probably work out fine if we just ran the entire database on a single machine and stitched together a cron job to make a backup every now and then, but the 1% of infinite parallel Roberts whose database got destroyed and whose backups weren't working would sure be grumpy with me if that was the way we went.

Because of this, I hoped that we could use AWS's managed ElasticSearch product. AWS might be expensive, but it takes good care of many of the things that I don't want to, and Stripe shouldn't put a price on my happiness. However, until recently, doing so was impossible. Clients can communicate with ElasticSearch over two protocols - a Java binary protocol, and HTTP. Until v3.4, The Hive communicated with its ElasticSearch backend using the Java binary protocol. However, AWS ElasticSearch only supports the HTTP protocol. This meant that anyone hoping to use The Hive was also going to have to manage their own ElasticSearch cluster. The internet was littered with hopeful threads asking "can I use The Hive with AWS ElasticSearch?" and sad answers saying "no".

Fortunately for the lazy among us, in v3.4.0 The Hive switched to communicating with ElasticSearch over the HTTP protocol. This made it possible to run it using AWS ElasticSearch. All doing so requires is a little extra plumbing.

## Signing AWS ElasticSearch requests

AWS ElasticSearch requires every request to it to be [signed using the requestor's AWS access key][sign]. However, since The Hive doesn't know anything about AWS, it won't sign any of its requests. This means that even if you set up an AWS ElasticSearch cluster and correctly point The Hive at it, the cluster will reject all queries that The Hive sends it, because they have not been signed.

We can get around this obstacle by writing a tiny *signing proxy* (technically a *reverse proxy*). This is a small web server that sits in between The Hive and AWS ElasticSearch. It accepts requests from The Hive, signs them, and forwards the signed request on to AWS ElasticSearch.

```
                  1.Unsigned               2.Signed
                   request                  request
+-----------------+      +-----------------+       +-----------------+
|                 |----->|                 |------>|                 |
|    The Hive     |      |  Signing Proxy  |       |AWS ElasticSearch|
|                 |<-----|                 |<------|                 |
+-----------------+      +-----------------+       +-----------------+
                 4.Response                3.Response
```

Since the request is now properly signed, AWS ElasticSearch accepts it. It runs the query contained in the request, and sends any response back to the signing proxy. Finally, the signing proxy forwards the response back to The Hive. Note that The Hive doesn't need to care or know anything about the chicanery that the signing proxy and AWS ElasticSearch perform with each other behind the scenes. All The Hive cares about is that it can send ElasticSearch requests to the signing proxy, and get back ElasticSearch responses.

## How to write a signing proxy

AWS signing proxies exist in various forms and languages already - Google "aws signing proxy YOUR_PREFERRED_LANGUAGE". You may be able to adapt one of them to work in your environment, or even copy one wholesale.

## How to run a signing proxy

### Where to run it

You can either run your signing proxy on the same hosts as The Hive, or different ones. Running it on the same hosts as The Hive is probably simpler and gives you fewer servers to maintain, but running it on separate servers is also entirely acceptable.

Whichever approach you choose, you should ideally have both The Hive and the signing proxy running on multiple servers for redundancy in case one of your servers explodes. Hosts running one or both of these services are almost entirely stateless (apart from The Hive's "streaming" service, which you can survive without), since they aren't hosting the ElasticSearch database. This means that you should be able to safely add or remove hosts from your rotation at will.

### Configuring The Hive

If you run the signing proxy on the same hosts that you run the Hive on then you should configure The Hive to connect to its database at `localhost:$PORT_NUMBER`. For example, if you run the signing proxy on port `1234`:

```
search {
  host "localhost:1234"
}
```

If you instead choose to run the signing proxy on different hosts then you should configure The Hive to connect to its database at the address of the load balancer in front of the signing proxy hosts (or however you distribute traffic inside your environment):

```
search {
  host "loadbalancer.signingproxy.mycorp.net:5678"
}
```

### IAM Permissions

You'll need to setup your [AWS IAM permissions][iam] so that the hosts running the signing proxy can talk to your ElasticSearch cluster. In particular, you'll need to give these hosts permission to perform all of the [`ESHttp*`][es-actions] actions on your cluster. Note that if you run your signing proxy on a separate host to The Hive, the hosts that run The Hive do *not* need permissions to talk directly to AWS ElasticSearch.

## In conclusion

Running The Hive with AWS ElasticSearch is a pragmatic choice for the resource-constrained, non-Elastic-expert incident response team. [Let me know how you get on][twitter] or if you have any questions or comments.

[es-actions]: https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/es-ac.html
[twitter]: https://twitter.com/robjheaton
[iam]: https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/es-ac.html
[thehive]: https://thehive-project.org/
[sign]: https://docs.aws.amazon.com/general/latest/gr/signing_aws_api_requests.html
