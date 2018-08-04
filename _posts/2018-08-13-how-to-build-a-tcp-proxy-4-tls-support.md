---
title: "How to build a TCP proxy #4: TLS support"
layout: post
---
This is the final part of a 4-part project to build a generic TCP proxy. This proxy will be capable of handling any TCP-based protocol, not just HTTP. In part 3 we finished building a TCP proxy that can handle unencrypted protocols. We used this proxy to intercept and inspect plaintext HTTP requests sent by your phone, and it worked beautifully.

However, we aren't satisfied. We want our proxy to be capable of dealing with encrypted traffic too. Right now, any application that demands a TLS-encrypted connection, such as a mobile browser connecting to an HTTPS-only website, will refuse to do business with our proxy. This is because our proxy has no idea how to perform any of the steps required to establish a secure connection, including presenting a TLS certificate and negotiating a TLS handshake.

# 0. Things fall apart

Let's send our non-TLS enabled proxy an HTTPS request and watch as everything goes wrong. Change the domain in our DNS server to `google.com`. Change the domain in our proxy to `google.com` as well, and set the port that it listens and sends on to `443` (by convention, the HTTPS port). Set your phone's DNS server to be your laptop's local IP address, then start up our DNS server and TCP proxy.

Visit `google.com` on your phone. Google very sensibly insists on being served over HTTPS, and when your phone's browser finds out that our proxy doesn't understand TLS it will immediately give up and close its TCP connection. It will display an error.

Fortunately this is a very solvable problem. Let's teach our proxy to speak TLS.

(If you haven't come across TLS before or would like a refresher, have a read of [my introduction to HTTPS](/2014/03/27/how-does-https-actually-work/))

# 1. How to teach a proxy to speak TLS

I'm not going to tell you what we need to do in order to add TLS-support to our proxy. Instead, we'll figure out out the list of challenges that need solving together. We'll work backwards, starting with the current state of our proxy from part 3. This will help us see exactly why each step is necessary, and what would happen if we left it out.

## 1.1 Listen, SSL

In our code from part 3, our proxy listened for incoming TCP connections from your phone using the `listen` method of the `twisted` Python networking library. Conveniently, `twisted` also has a `listenSSL` method (TLS used to be called SSL, and the 2 acronyms are often used interchangeably). Both `listen` and `listenSSL` sit and wait for incoming TCP connections. But whereas `listen` immediately starts accepting application-layer data (like an HTTP request) as soon as a TCP connection is established, `listenSSL` first attempts to perform a TLS handshake with the client. Only once this handshake has been completed successfully does `listenSSL` start accepting (now encrypted) application-layer data. Let's therefore start by changing our proxy to use `listenSSL` instead of `listen`.

## 1.2 TLS certificates

`listenSSL` helpfully handles the low-level mechanics of handshakes and decryption for us. But in order to do this, it needs to be passed a *TLS certificate*. As we will see, TLS certificates are easy enough for us to create, but harder for us to get right.

Servers use TLS certificates to verify their identity. Your phone will refuse to do a TLS handshake with our proxy unless the *Common Name* on our certificate matches the domain that your phone believes it is talking to. Our next step will therefore be to generate and use our own TLS certificate, with its Common Name set to the domain of our target app (for now let's stick with `google.com`).

This might sound strange at first. The whole point of TLS is that when a server presents a client with a certificate for `google.com`, the client can be quite certain that it is talking to the real Google and not some dastardly man-in-the-middle. I wouldn't describe us as dastardly exactly, but if we can generate a certificate for `google.com` from the comfort of our own home then surely this can't bode well for the security of TLS?

However, clients like your phone check more than a certificate's domain when verifying its validity. They also check its "cryptographic signature". A cryptographic signature is a seal of approval attached to a certificate by some third party. This third party is usually a "Root Certificate Authority" (CA). CAs are (hopefully) secure and trustworthy organizations whose job it is to issue and sign TLS certificates. It is no exaggeration to say that they are collectively responsible for the integrity of encryption on the internet. Before issuing one of its customer with a certificate for a domain, a CA does due diligence to verify that the customer is indeed this domain's real owner.

Once the CA is satisfied, it generates a certificate (and private key) for the domain, and appends a cryptographic signature. This signature encodes a statement of the form "Verisign asserts that this certificate belongs to the true owner of `google.com`". The CA creates the signature by using its private key to encrypt the certificate's contents. A client can verify that the signature is valid by decrypting the signature using the CA's public key, and confirming that the decrypted text matches the text of the certificate. Since the signature could not have been generated without access to the CA's private key - which they hopefully keep extremely secret and secure - it is safe to assume that the CA endorses the contents of the certificate, and that the bearer (or more accurately, the organization in possession of the corresponding private key) is the true owner of the domain.

Airlines only trust passports signed by countries that they trust (as the people of the no-longer-sovereign nation of Robertopia discovered the hard way). In the same way, clients like your phone only trust TLS certificates that have been signed by a CA that they trust. Your phone decides which CAs to trust using a hard-coded list of CAs that have been approved by your phone's manufacturer. For example, [the list of trusted CAs pre-loaded into iOS11 is available online](https://support.apple.com/en-us/HT208125).

Since we are not the true owners of `google.com` (at least I'm not, I can't speak for you), we will never be able to convince one of these trusted CAs to sign our DIY `google.com` certificate.  And since none of them will vouch for our certificate, your phone will refuse to trust it.

We can fix this problem by starting our own root CA called "Robert's Trusty Certificate Corp". One extremely difficult way to get Robert's Trusty Certificate Corp onto your smartphone's list of approved root CAs would be to set up an actual company, hire a few hundred people to run it, build some extremely secure certificate generation infrastructure, fill in a large amount of paperwork to convince Google and Apple and the rest that we should be entrusted with the online security of hundreds of millions of people, and eventually get our CA's public key included in your phone's next OS update. Once this step is complete you can either continue to work on this TCP proxy project; run your fledgling infrastructure business; or turn rogue and try to empty the bank accounts of everyone in the entire world. The details are left as an exercise for the reader.

Since this all sounds like a lot of work, we'll do something easier. We'll still generate a root CA certificate for Robert's Trusty Certificate Corp. Then, rather than going through all the above rigmarole, we will manually add this certificate to your phone's list of trusted root CAs. This tells your phone to trust other certificates that are signed by Robert's Trusty Certificate Corp. We'll use RTCC's private key to sign our `google.com` certificate, and pass this signed certificate into our proxy's `listenSSL` method.

When our proxy presents your phone with its freshly signed `google.com` certificate, your phone will see that it is endorsed by "Robert's Trusty Certificate Corp". It will check its internal list of trusted CAs and see that this splendid and reputable outfit is on there. It will happily accept our certificate for `google.com` as valid, and continue negotiating a TLS session before beginning to send its TCP traffic.

Note that anyone who got hold of our homemade CA's private key would be able to use it to sign their own certificates for any domain they wanted. In the eyes of your phone (and your phone only), these certificates would be legitimate and trustworthy. An attacker would be able to use them to perform their own man-in-the-middle attack against you, allowing them to read your encrypted traffic. You should be very careful to keep your CA's private key safe on your laptop. You should also be sure to remove its public key from your phone's list of root CAs as soon as you are done with this project.

Once we have generated a TLS certificate that your phone will trust, we can pass it into our proxy via `listenSSL`. `twisted` will handle the rest for us, and our proxy will then be TLS-enabled.

# 2. Implementation

We need to:

* Generate a TLS certificate for the domain that we are trying to proxy for
* Install our root CA's public key as one of the trusted authorities on your phone
* Generate a root CA public/private key pair and use the private key to sign this TLS certificate
* Pass this certificate into `twisted`'s `listenSSL` function and use it to listen for incoming connections

This won't hurt a bit.

# 2.1 Generate a certificate

Libraries for creating and signing TLS certificates are available in most sensible programming languages. It only takes a few lines of code to generate our first "self-signed" certificate for `google.com`. A self-signed certificate is one that is signed using only its own private key. All this signature encodes is the vacuous statement "I assert that I am the true owner of this domain." It offers no other proof of its validity other than your inherent trust (or mistrust) of the organization and the network presenting it to you. This is like trying to get through immigration using a passport that you drew and stamped yourself.

<img src="/images/tcp-4-passport.png" />

Of course, the United States Customs and Immigration Service does not accept self-made passports, and your phone does not accept self-signed certificates.

# 2.2 Generate a Root Certificate Authority

There is one partial exception to this mistrust of self-signed certificates. A CA's trustworthiness comes from the fact that your phone's manufacturers vetted them and deemed them honest and secure enough to be installed as root CAs. Root CAs are at the top of the hierarchy of trust, and so their certificates are allowed to be self-signed. 

We'll generate a self-signed TLS certificate for "Robert's Trusty Certificate Corp", our homemade root CA. Now when generating a certificate for `google.com`, we'll sign it using our CA's new private key instead of self-signing it. This signature cryptographically encodes the statement "Robert's Trusty Certificate Corp asserts that this certificate belongs to the true owner of `google.com`".

# 2.3 Install the Root CA on your phone

Finally, we'll have to install our root CA on your phone, so that your phone will trust certificates signed by it. The safest way to do this is to:

1. Run the proxy server script below once. It will generate a root CA certificate and print out its location
2. Open the certificate file and copy the second half - everything including and after `-----BEGIN CERTIFICATE-----` - into a new file called `cert.pem`
2. Email `cert.pem` as a file attachement to an email account that you can access on your phone
3. Open the email on your phone and open the attachment
4. The remaining steps will depend on the make and model of your phone. For example, on iOS you have to install the key as a root CA, then find it in your system settings and enable it, ticking various "yes I'm aware that this is quite a risky thing to be doing" boxes along the way

There are fancier and less manual ways to install our root CA's certificate on your phone, but these steps will get you there.

# 2.4 Listen, SSL

We now have everything we need for a TLS-enabled, man-in-the-middle, TCP proxy. We need to update our proxy's startup script to create a certificate for our target domain (let's use `google.com` for testing). We need to sign it using our CA. Then we need to pass the signed certificate into our proxy so that it can present it to you phone.

```
import time

from twisted.internet import protocol, reactor
from twisted.internet import ssl as twisted_ssl
import dns.resolver

from OpenSSL.crypto import (X509Extension, X509, dump_privatekey, dump_certificate, load_certificate, load_privatekey,
                            PKey, TYPE_RSA, X509Req)
from OpenSSL.SSL import FILETYPE_PEM
import tempfile
import os
import netifaces as ni
 
# Adapted from http://stackoverflow.com/a/15645169/221061

class TLSTCPProxyProtocol(protocol.Protocol):
    """
    TLSTCPProxyProtocol listens for TCP connections from a client (eg. a
    phone) and forwards them on to a specified destination (eg. an app's API
    server) over a second TCP connection, using a ProxyToServerProtocol.

    It assumes that both legs of this trip are encrypted using TLS
    """
    def __init__(self):
        self.buffer = None
        self.proxy_to_server_protocol = None
 
    def connectionMade(self):
        """
        Called by twisted when a client connects to the proxy. Makes an TLS
        connection from the proxy to the server to complete the chain.
        """
        print("Connection made from CLIENT => PROXY")
        proxy_to_server_factory = protocol.ClientFactory()
        proxy_to_server_factory.protocol = ProxyToServerProtocol
        proxy_to_server_factory.server = self
 
        reactor.connectSSL(DST_IP, DST_PORT, proxy_to_server_factory, twisted_ssl.CertificateOptions())
 
    def dataReceived(self, data):
        """
        Called by twisted when the proxy receives data from the client. Sends
        the data on to the server.

        CLIENT ===> PROXY ===> DST
        """
        print("")
        print("CLIENT => SERVER")
        print(FORMAT_FN(data))
        WRITE_TO_FILE(data)
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
    given to it by an TLSTCPProxyProtocol, and uses the TLSTCPProxyProtocol to
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


# A class that represents a CA. It wraps a root CA TLS certificate, and can
# generate and sign certificates using this root cert.
#
# Adapted from https://github.com/allfro/pymiproxy/blob/master/src/miproxy/proxy.py
class CertificateAuthority(object):

    CERT_PREFIX = 'fake-cert'

    def __init__(self, ca_file, cache_dir=tempfile.mkdtemp()):
        print("Initializing CertificateAuthority ca_file=%s cache_dir=%s" % (ca_file, cache_dir))

        self.ca_file = ca_file
        self.cache_dir = cache_dir
        self._serial = self._get_serial()
        if not os.path.exists(ca_file):
            raise Exception("No cert exists at %s" % ca_file)
        else:
            self._read_ca(ca_file)

    def get_cert_path(self, cn):
        cnp = os.path.sep.join([self.cache_dir, '%s-%s.pem' % (self.CERT_PREFIX, cn)])
        if os.path.exists(cnp):
            print("Cert already exists common_name=%s" % cn)
        else:
            print("Creating and signing cert common_name=%s" % cn)
            key = PKey()
            key.generate_key(TYPE_RSA, 2048)

            # Generate CSR
            req = X509Req()
            req.get_subject().CN = cn
            req.set_pubkey(key)
            req.sign(key, 'sha1')

            # Sign CSR
            cert = X509()
            cert.set_subject(req.get_subject())
            cert.set_serial_number(123)
            cert.gmtime_adj_notBefore(0)
            cert.gmtime_adj_notAfter(31536000)
            cert.set_issuer(self.cert.get_subject())
            cert.set_pubkey(req.get_pubkey())
            cert.sign(self.key, 'sha1')

            with open(cnp, 'wb+') as f:
                f.write(dump_privatekey(FILETYPE_PEM, key))
                f.write(dump_certificate(FILETYPE_PEM, cert))

            print("Created cert common_name=%s location=%s" % (cn, cnp))

        return cnp

    def _get_serial(self):
        s = 1
        for c in filter(lambda x: x.startswith(self.CERT_PREFIX), os.listdir(self.cache_dir)):
            c = load_certificate(FILETYPE_PEM, open(os.path.sep.join([self.cache_dir, c])).read())
            sc = c.get_serial_number()
            if sc > s:
                s = sc
            del c
        return s

    def _read_ca(self, file):
        self.cert = load_certificate(FILETYPE_PEM, open(file).read())
        self.key = load_privatekey(FILETYPE_PEM, open(file).read())

    @staticmethod
    def generate_root_cert(path, common_name):
        if os.file.exists(path):
            raise Exception("Cert already exists at %s" % path)
        # Generate key
        key = PKey()
        key.generate_key(TYPE_RSA, 2048)

        # Generate certificate
        cert = X509()
        cert.set_version(3)
        cert.set_serial_number(1)
        cert.get_subject().CN = common_name
        cert.gmtime_adj_notBefore(0)
        cert.gmtime_adj_notAfter(315360000)
        cert.set_issuer(cert.get_subject())
        cert.set_pubkey(key)
        cert.sign(key, "sha256")

        with open(path, 'wb+') as f:
            f.write(dump_privatekey(FILETYPE_PEM, key))
            f.write(dump_certificate(FILETYPE_PEM, cert))


def get_local_ip(iface):
    ni.ifaddresses(iface)
    return ni.ifaddresses(iface)[ni.AF_INET][0]['addr']


# Alternative functions for formating output data
def _side_by_side_hex(data):
    BLOCK_SIZE = 16

    output_lines = []
    for i in range(0, len(data), BLOCK_SIZE):
        block = data[i:i+BLOCK_SIZE]
        _hex = ["%.2x" % el for el in block]
        _str = [chr(el) if chr(el).isprintable() else "." for el in block]
        line = " ".join(_hex).ljust((3*BLOCK_SIZE)+4) + "".join(_str).replace("\n", ".")
        output_lines.append(line)
    return "\n".join(output_lines)

def _stacked_hex(data):
    BLOCK_SIZE = 32

    hex_lines = []
    plaintext_lines = []
    for i in range(0, len(data), BLOCK_SIZE):
        block = data[i:i+BLOCK_SIZE]
        _hex = ["%.2x" % el for el in block]
        _str = [chr(el) if chr(el).isprintable() else "." for el in block]

        hex_line = " ".join(_hex)
        hex_lines.append(hex_line)

        plaintext_line = "  ".join(_str).replace("\n", ".")
        plaintext_lines.append(plaintext_line)

    lines = hex_lines + ["\n"] + plaintext_lines
    return "\n".join(lines)

def _replayable(data):
    d = data[0:4000]
    _hex = "".join(["%.2x" % el for el in d])
    _str = "".join([chr(el) if chr(el).isprintable() else "." for el in d])

    return _hex + "\n" + _str

def _noop(data):
    return data

# Change this line to use an alternative formating function
FORMAT_FN = _noop

# Record data sent to the server to files
DIR_NAME = "replays/messages-%d/" % time.time()
os.mkdir(DIR_NAME)
f_n = 0
def _write_to_file(data):
    # Global variables are bad but they do the job
    global f_n
    with open(DIR_NAME + str(f_n), 'wb') as f:
        f.write(data)
        f_n += 1
WRITE_TO_FILE = _write_to_file

ROOT_CA_PATH = "./root-ca6.pem"

LISTEN_PORT = 443
DST_PORT = 443
DST_HOST = "www.google.com"
local_ip = get_local_ip('en0')

print("Querying DNS records for %s..." % DST_HOST)
a_records = dns.resolver.query(DST_HOST, 'A')
print("Found %d A records:" % len(a_records))
for r in a_records:
    print("* %s" % r.address)
print("")
assert(len(a_records) > 0)

DST_IP = a_records[0].address
print("Choosing to proxy to %s" % DST_IP)

print("""
#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#
-#-#-#-#-#-RUNNING TLS TCP PROXY-#-#-#-#-#-
#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#

Root CA path:\t%s

Dst IP:\t%s
Dst port:\t%d
Dst hostname:\t%s

Listen port:\t%d
Local IP:\t%s
""" % (ROOT_CA_PATH, DST_IP, DST_PORT, DST_HOST, LISTEN_PORT, local_ip))
 
ca = CertificateAuthority(ROOT_CA_PATH)
certfile = ca.get_cert_path(DST_HOST)
with open(certfile) as f:
    cert = twisted_ssl.PrivateCertificate.loadPEM(f.read())

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
factory.protocol = TLSTCPProxyProtocol
reactor.listenSSL(LISTEN_PORT, factory, cert.options(), interface=local_ip)
reactor.run()
```

Before testing our proxy out, make sure that:

* Your DNS spoofing script is pointing at google.com
* Your smartphone has its DNS server set to be your laptop's IP address, like in [part 2](/2018/08/13/how-to-build-a-tcp-proxy-2-dns-spoofing)
* Your TCP proxy script is pointing at `www.google.com` (the `www` is important to make sure the TLS certificate has the right domain)
* Your TCP proxy script is set to listen and send on port 443

Then start the DNS spoofing script, start the TCP proxy script, and visit google.com on your phone. You should see the unencrypted plaintext of your HTTP request and response appear in the logs of your proxy!

<img src="/images/tcp-4-google-response.png" />

Even though the HTTP headers are now completely readable, the HTTP bodies may still look garbled:

<img src="/images/tcp-4-google-response-2.png" />

This is because the HTTP bodies have been compressed using *gzip* to reduce the amount of data sent to your phone. If you wrote the bodies to a file and `gunzip`-ed them, you would see that they too are now unencrypted.

That's it. We're done here.

# 3. Wrap up

It's been an arduous and well-written journey, but you're now able to proxy and inspect arbitrary TCP streams sent by your smartphone. Congratulations.

This was a much harder challenge than building a proxy that can only handle HTTP requests. Since we wanted to be able to proxy any TCP stream, not just HTTP requests, we couldn't make use of any of your phone's built-in HTTP proxy functionality. If you want to proxy HTTP requests from your smartphone via your laptop, all you have to do is connect the devices to the same network, tell your phone's proxy to use your laptop's IP address as a proxy, start Burp Suite, and you're immediately in business.

Life was much harder for us. We had to mess with the very fabric of how directions are given on the internet. We spoofed the responses to DNS requests sent by your phone. This tricked your phone into making TCP connections intended for the target domain with your laptop instead. We forwarded any data that your laptop received on this connection on to the target domain's server, and forwarded any response data from the server back to your smartphone. Your smartphone was none the wiser about what had happened.

We also added TLS support. We did this by creating our own Certificate Authority and installing its public key on your smartphone. We used its private key to sign TLS certificates that we had generated, and we used these certificates to negotiate TLS sessions between your phone and your laptop. When we were done we removed our CA's public key from your phone's list of trusted CAs (*didn't we?*), because we are paranoid security experts and we don't want to get man-in-the-middle-d for real.

# 4. Future work

Future work can be summarized as "make the TCP proxy more like [Burp Suite](https://portswigger.net/burp)". It would be very useful to be able save the data that flows across your connections to a file or a database. It would also be handy to be able to replay these requests later. And it would be absolutely fantastic if we could edit them first.

Congratulations on completing your proxy. If you have any feedback on this project, both on what worked well and what could be improved, I'd love to hear it.
