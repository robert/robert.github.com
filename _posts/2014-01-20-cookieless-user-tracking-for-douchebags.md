---
layout: post
title: Cookieless user tracking for douchebags
---
Cookies are the go-to mechanism for online user tracking. A cookie is essentially a tiny text file stored by your browser, so a website using a cookie to store a unique tracking ID for you can easily see that the user who searched for articles about UK Auditing Standards is the same user who later searched for articles about Really Quite Morally Troubling Monkey Porn (you disgust me). This doesn't even require you to log into anything, but fortunately your actual identity is therefore, in general, still a secret. Google Analytics collects such anonymised user data through <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage" target="_blank">a slightly more involved cookie structure</a>, but the principle is the same. Admission: I track visitor numbers using GA, but only for personal vanity.

If you delete a website's cookies, then to all cookie-based tracking systems you are a new person with a fresh identity, unencumbered by your frankly unconscionable past habits. Cookies have become well-known outside of web development circles, at least by name, and there is even an <a href="http://www.theeucookielaw.com/" target="_blank">EU Cookie Law</a> that sets out what is cool and what is not when using cookies. This is intended to allow users to know how they are being tracked and to give them the knowledge and the power to opt out.

But cookies are far from the final frontier. The function and intended purpose of a cookie is to allow client-side data persistence, and this is used in user tracking to store a unique tracking ID that can be used to identify each user. However, browsers store data in other ways, which can be exploited in unexpected ways. Michal Zalewski outlines a very interesting alternative in his excellent book <a href="http://lcamtuf.coredump.cx/tangled/" target="_blank">"The Tangled Web"</a>, and when expanded it goes a little something like this:

HTTP caching is great. If I am using the same image on every page of my site, why send all that data to a client every time they load a new page? HTTP caching instead allows a client to store the resources it receives from a server. When requesting a resource it has seen and stored before, the client says "here is some information about the version of this resource that I already have stored - should I just use this one?" The server can then say "yep, that's still valid, just use that" and return a blank 304 or "no, there's a new version, here it is" and return 200 and the updated resource.

Alarm bells should now be going off in your head. The client is storing data between requests, and can be told by the server to never replace this data through the medium of 304 Not Modified status codes. What if the server were to dynamically generate a `tracking_id.js` file containing a unique tracking ID for each client requesting the file for the first time? What if from then on it claimed that the file hasn't been modified whenever a client with a cached version sends a request? Wouldn't that result in a client-unique JS variable that could be used for tracking?

Well, yes, incredibly easily. In Sinatra:

{% highlight ruby %}
    get '/' do
      '<script type="text/javascript" src="/tracking_id.js"></script>'
      # Add more JS to use the trackingId variable to track the user
      # eg. _myTrackingFramework.track(trackingId);
    end

    get '/tracking_id.js' do
      last_modified Time.at(0)
      response['Content-Type'] = 'text/javascript'

      "var trackingId = '#{SecureRandom.uuid}';"
      # Also store the tracking_id for future reference
    end
{% endhighlight %}

When Steve visits `/`, his browser makes an additional request to `/tracking_id.js`. The HTTP request headers will look something like:

{% highlight text %}
    Accept: */*
    Accept-Encoding: gzip,deflate,sdch
    Accept-Language: en-US,en;q=0.8
    Connection: keep-alive
    Host: cookieless-user-tracking.herokuapp.com
    Referer: http://cookieless-user-tracking.herokuapp.com/
    User-Agent: *snip*
{% endhighlight %}

We generate and store a new tracking ID for Steve, and return a tiny JS file:

{% highlight javascript %}
    var trackingId = "33848722-da08-4b43-b0e8-0c6deaa906f6";
{% endhighlight %}

Steve goes away and comes back later with amorous monkeys on his mind. For safety, he clears his cookies and returns to our site. When he visits `/`, his browser again makes an additional request to `/tracking_id.js`. But this time the request headers look something like:

{% highlight text %}
    Accept: */*
    Accept-Encoding: gzip,deflate,sdch
    Accept-Language: en-US,en;q=0.8
    Connection: keep-alive
    Host: cookieless-user-tracking.herokuapp.com
    If-Modified-Since: Thu, 01 Jan 1970 00:00:00 GMT 
    Referer: http://cookieless-user-tracking.herokuapp.com/
    User-Agent: *snip*
{% endhighlight %}

The value of the `If-Modified-Since` header tells us that we only need to send back a new resource if it has been modified since the beginning of UNIX time. We choose to interpret this request creatively, and reply that our JS file has not been modified since the beginning of UNIX time and so Steve's browser should go ahead and use the same file we sent him before, with the same tracking ID as before. Bingo, jackpot, snake eyes. We die a little when we see what user #21987121 is searching for. 

Check out a proof of concept <a href="http://cookieless-user-tracking.herokuapp.com" target="_blank">here</a> (<a href="https://github.com/robert/cookieless-user-tracking" target="_blank">source</a>).

The only way for Steve to re-anonymise himself is to delete the browser cache. But caching makes the internet snappy and saves your mobile data tariff, so you don't want to do that on a whim. He could open up the Dev Tools and individually delete the cache for `/tracking_id.js` (<a href="http://cookieless-user-tracking.herokuapp.com" target="_blank">try it</a>), but he would be the only person in the history of time to even think about doing so.

This concrete and desperately easy example should convince you that cookies are far from the final frontier in tracking technology, and that staying completely anonymous is going to be somewhere between hard and impossible. I would encourage you to check out several excellent write-ups of a <a href="http://lucb1e.com/rp/cookielesscookies/" target="_blank">related ETags-based tracking mechanism</a>, and of course the infamous, almost-invincible <a href="http://samy.pl/evercookie/" target="_blank">Evercookie</a>. Michal Zalewski argues that a focus on the security and capabilities of cookies oversimplifies the issues, gives a false sense of security, and is therefore actively unhelpful. I feel that it's at least encouraging that privacy concerns and some of the basic terminology are at least in the public consciousness, but nonetheless find it hard to disagree with him.
