---
title: "How to build a TCP proxy #3: The Proxy"
layout: post
published: false
---
This is part 3 of a 4-part project to build a generic TCP proxy. This proxy will be capable of handling any TCP-based protocol, not just HTTP.

So far, the fake DNS server that we built in part 2 is tricking your smartphone into sending TCP data to your laptop. In this section we're going to build our actual TCP proxy server, and run it on your laptop. Its job will be to listen for data sent from your phone; forward it to the real, remote server; and finally forward any responses from the server back to your phone. In other words, act like a proxy.

## 0. How our proxy will work

Our proxy will run on your laptop and listen for incoming TCP connections on port 80 (by convention, the unencrypted HTTP port). When it receives one, presumably from your smartphone, it will first make another TCP connection, this time with our target hostname's remote server. Second, it will take any data that it receives over the connection with your smartphone, and re-send it over its new connection with the remote server. Third, it will listen for response data coming back from the server. Fourth and finally, it will relay this response data back to your smartphone, completing the 4-step loop. Your smartphone will be able to talk to the remote server as normal, taking only a slight detour via our proxy.

We use HTTP for testing instead of some other TCP-based protocol because it's easier. To get your phone to make an HTTP request, all you have to do is visit a website. Our proxy isn't "non-HTTP" - it's "non-HTTP-*specific*". In addition, the first version of our TCP proxy will not be capable of handling TLS encryption. We will therefore have to take care to test using websites that use unecrypted HTTP, not HTTPS. We will add TLS support in part 4.

<img src="/images/tcp-3-big-picture.png" />

Let's take a closer look at each stage of this 4-step loop: from smartphone, to laptop, to remote server, and back again.

### 0.1 Phone to Laptop

The first stage is almost completely taken care of by our DNS server from the previous section of the project. Your phone has already been tricked into sending its TCP connections for our target hostname to your laptop, and all that remains is to ensure that our proxy receives them safely.

### 0.2 Laptop to Remote Server

When your phone makes a TCP connection with our proxy, our proxy makes a second TCP connection with the remote server. Our proxy sits in the middle of these two TCP connections, managing data-flow between them.

As we've seen in parts 1 and 2 of this project, this raises an important question. Our proxy needs to send the data that it receives from your phone to the appropriate remote server. But how does it know this remote server's hostname or IP address? The TCP layer doesn't have any mechanisms for telling proxies where data should ultimately be routed to. The HTTP layer does - the `Host` HTTP header and `CONNECT` requests - but these are of no use to us, since we want our proxy to work for all TCP-based protocols, not just HTTP.

This is a real problem, and we've already decided to solve it by cheating a little. We'll assume that we only want to proxy requests that your phone sends to a single "target hostname", and we'll hardcode that hostname's IP address into our proxy. Every piece of data that our proxy receives from your phone will be sent to this hardcoded address.

This simplification is very reasonable. If we're trying to reverse engineer TargetApp's TCP API, then we are probably only interested in requests sent to `targetapp.com`. It will actually be useful if requests for other hostnames bypass our proxy and continue to work as normal.

We should take care to configure our DNS server from part 2 to only spoof DNS responses for this same target hostname. For all other hostnames our DNS server should make a real DNS request, and respond to your phone with the hostname's real IP address. Otherwise you might accidentally send sensitive data to the wrong remote server.

### 0.3 Server to Laptop

Once our proxy has sent the remote server the data that it received from your smartphone, all that remains is to send any response data from the remote server back to your phone. In this third, server-to-laptop stage we will make sure that our proxy can receive response data from the remote server.

### 0.4 Laptop to Phone

Finally, we will send this response data from our proxy back to your phone. Your phone will receive the data in exactly the same form as if it had been talking to the remote server directly, and it will assume that everything that just happened was completely normal.

## 1. Building our proxy

I've built an example proxy using Python's `twisted` networking framework. I found that `twisted` gave the right amount of control over the innards of the proxy, whilst requiring very little boilerplate. In order to achieve this it introduces some of its own, new abstractions. These abstractions make my code very terse, but also a little cryptic for the uninitiated.

Twisted is built around "event-driven callbacks". This means that it automatically runs particular methods (or "callbacks") whenever a specific event occurs. The callbacks that we are interested in are `connectionMade` and `dataReceived`, both of which we define on a new class that inherits from `twisted`'s `Protocol`. `twisted` runs these callback methods for us whenever our protocol makes a new TCP connection or receives data on an existing connection. These are the only two hooks we need to make a TCP proxy.

Here's my code. It's followed by a more detailed explanation of the different components.

```
# See TODO - LINK to get the utils file
import utils

from twisted.internet import protocol, reactor
from twisted.internet import ssl as twisted_ssl
import dns.resolver

# Adapted from http://stackoverflow.com/a/15645169/221061

class TCPProxyProtocol(protocol.Protocol):
    """
    TCPProxyProtocol listens for TCP connections from a client (eg. a
    phone) and forwards them on to a specified destination (eg. an app's API
    server) over a second TCP connection, using a ProxyToServerProtocol.
    """
    def __init__(self):
        self.buffer = None
        self.proxy_to_server_protocol = None

    def connectionMade(self):
        """
        Called by twisted when a client connects to the proxy. Makes an
        connection from the proxy to the server to complete the chain.
        """
        print("Connection made from CLIENT => PROXY")
        proxy_to_server_factory = protocol.ClientFactory()
        proxy_to_server_factory.protocol = ProxyToServerProtocol
        proxy_to_server_factory.server = self

        reactor.connectTCP(DST_IP, DST_PORT, proxy_to_server_factory)

    def dataReceived(self, data):
        """
        Called by twisted when the proxy receives data from the client. Sends
        the data on to the server.

        CLIENT ===> PROXY ===> DST
        """
        print("")
        print("CLIENT => SERVER")
        print(FORMAT_FN(data))
        print("")
        if self.proxy_to_server_protocol:
            self.proxy_to_server_protocol.write(data)
        else:
            self.buffer = data

    def write(self, data):
        self.transport.write(data)


class ProxyToServerProtocol(protocol.Protocol):
    """
    ProxyToServerProtocol connects to a server over TCP. It sends the server data
    given to it by an TCPProxyProtocol, and uses the TCPProxyProtocol to
    send data that it receives back from the server on to a client.
    """

    def connectionMade(self):
        """
        Called by twisted when the proxy connects to the server. Flushes any
        buffered data on the proxy to server.
        """
        print("Connection made from PROXY => SERVER")
        self.factory.server.proxy_to_server_protocol = self
        self.write(self.factory.server.buffer)
        self.factory.server.buffer = ''

    def dataReceived(self, data):
        """
        Called by twisted when the proxy receives data from the server. Sends
        the data on to to the client.

        DST ===> PROXY ===> CLIENT
        """
        print("")
        print("SERVER => CLIENT")
        print(FORMAT_FN(data))
        print("")
        self.factory.server.write(data)

    def write(self, data):
        if data:
            self.transport.write(data)


def _noop(data):
    return data


FORMAT_FN = _noop


LISTEN_PORT = 80
DST_PORT = 80
DST_HOST = "nonhttps.com"
local_ip = utils.get_local_ip('en0')

# Look up the IP address of the target
print("Querying DNS records for %s..." % DST_HOST)
a_records = dns.resolver.query(DST_HOST, 'A')
print("Found %d A records:" % len(a_records))
for r in a_records:
    print("* %s" % r.address)
print("")
assert(len(a_records) > 0)

# The target may have multiple IP addresses - we
# simply choose the first one.
DST_IP = a_records[0].address
print("Choosing to proxy to %s" % DST_IP)

print("""
#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#
-#-#-#-#-#-RUNNING  TCP PROXY-#-#-#-#-#-
#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#

Dst IP:\t%s
Dst port:\t%d
Dst hostname:\t%s

Listen port:\t%d
Local IP:\t%s
""" % (DST_IP, DST_PORT, DST_HOST, LISTEN_PORT, local_ip))

print("""
Next steps:

1. Make sure you are spoofing DNS requests from the device you are trying to
proxy request from so that they return your local IP (%s).
2. Make sure you have set the destination and listen ports correctly (they should
generally be the same).
3. Use the device you are proxying requests from to make requests to %s and
check that they are logged in this terminal.
4. Look at the requests, write more code to replay them, fiddle with them, etc.

Listening for requests on %s:%d...
""" % (local_ip, DST_HOST, local_ip, LISTEN_PORT))

factory = protocol.ServerFactory()
factory.protocol = TCPProxyProtocol
reactor.listenTCP(LISTEN_PORT, factory)
reactor.run()
```

`TCPProxyProtocol` is our primary `Protocol` class. It is directly responsible for communicating with your phone, but delegates communicating with the remote server to the `ProxyToServerProtocol` class. We initialize our proxy server by instantiating one of these `TCPProxyProtocol` objects, and telling `twisted` to use it to listen on port 80 - by convention, the unencrypted HTTP port. Next, nothing happens until your laptop receives a TCP connection on port 80 (presumably from your phone). When twisted sees this connection "event", it invokes the `connectionMade` callback on our `TCPProxyProtocol`. At this point our proxy has made a connection with your smartphone, and step 1 of our 4-step process is complete.

`TCPProxyProtocol#connectionMade` constructs a new `ProxyToServerProtocol` object. It tells this new protocol to make a TCP connection with our target's remote server, the IP address of which we have passed into our proxy. This connection is once again made on port 80. If the `TCPProxyProtocol` receives any data from your phone before the `ProxyToServerProtocol` and the remote server have finished connecting, it adds the data to a buffer to make sure it doesn't get dropped. Once the connection is ready, `ProxyToServerProtocol` sends any data that the buffer has collected to the remote server. At this point our proxy has opened separate connections with both your smartphone and the remote server, and is sending data from your smartphone on to the remote server. Step 2 complete.

Finally, when the `ProxyToServerProtocol` receives data back from the remote server, `twisted` invokes the  `ProxyToServerProtocol`'s own `dataReceived` callback. The code in this callback instructs the original `TCPProxyProtocol` to send the data that the `ProxyToServerProtocol` received from the remote server back to your phone. Steps 3 and 4 complete.

## 3. Testing our proxy

Since we have not yet implemented TLS support for our proxy, we need to test our proxy using a website that does not have HTTPS enabled. I recommend nonhttps.com, a handy development hostname that, as promised, does not use HTTPS.

Before you begin testing, make sure that:

* Your DNS spoofing script is pointing at nonhttps.com
* Your smartphone has its DNS server set to be your laptop's IP address, as in part 2[LINK]
* Your TCP proxy script is also pointing at nonhttps.com
* Your TCP proxy script is set to listen on port 80

Then start both scripts and visit nonhttps.com on your phone. You should see your fake DNS server spoof the DNS request, returning the IP address of your laptop. You should then see your TCP proxy receive HTTP data from your smartphone, and log its contents to the terminal. Next, it should log the corresponding HTTP response that comes back from nonhttps.com. Finally, nonhttps.com should load in your phone's browser, as though nothing at all miraculous had just happened.

<img src="/images/tcp-3-demo-1.png" />
<img src="/images/tcp-3-demo-2.png" />

If this doesn't work then its time for some debugging.

* Can you use your DNS server and TCP proxy logs to pinpoint exactly where things are going wrong? Maybe your DNS spoofing is failing, or maybe everything is working apart from receiving data back from the remote server?
* Open up Wireshark and run it with the filter `tcp port 80`. Do you see anything that looks like an error? Do you see anything at all?
* Use your creativity, or the creativity of a friend or colleague
* If all else fails, send me an email!

## 4. Next up

Now you can proxy any TCP request that doesn't use TLS encryption. Even though we have been testing using HTTP requests for simplicity, notice that nowhere in our code do we even mention HTTP. We see only a generic, TCP-transported stream of bytes that can have any structure and use any application protocol that it likes.

All that remains is for us to make our proxy capable of handling TCP requests that *do* use TLS encryption. That's in the fourth and final section of this project.
