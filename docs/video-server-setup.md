# Setting up the Hunarsaaz video server

This builds the machine that carries the video for live lectures. The portal
is already finished and waiting for it.

You need this on a server of its own. It cannot go on the cPanel hosting: a
video server needs open UDP ports, a public IP and real bandwidth, and shared
hosting gives you none of those.

Budget about two hours for the first one.


## 1. What to rent

A lecture of 100 students is mostly one person talking. Jitsi only forwards a
few video streams at a time (the portal sets that), so the load is the
teacher's video multiplied by the number of people receiving it.

One teacher at 1.5 Mbit/s to 100 students is roughly 150 Mbit/s going out, and
about 65 GB for a one-hour class. Pick the server for that number, not for the
CPU.

Minimum for 100 in a room:

    4 vCPU
    8 GB RAM
    1 Gbit/s network port
    20 TB or more traffic included, or unmetered
    Ubuntu 22.04 or 24.04

Hetzner (CPX31 or CPX41) and Contabo include 20 TB or more and cost roughly
€15-25/month. DigitalOcean and Linode are fine machines but bill for traffic
beyond 1 TB, which a few lectures will pass; at 65 GB a class that is about
15 hours of teaching a month before you start paying extra.

Pick a location close to Pakistan — Germany and Finland are the usual answer,
and Singapore is worth testing against them. Lower round-trip time is the
single biggest thing you can buy for call quality.


## 2. Point a name at it

In your DNS (where hunarsaaz.pk is managed), add:

    Type: A     Name: meet     Value: <the server's IP address>

so that meet.hunarsaaz.pk reaches the new machine. Wait until

    ping meet.hunarsaaz.pk

answers from the right address before going on. Jitsi's installer asks for a
certificate and that will fail if the name does not resolve yet.


## 3. Open the ports

On the provider's firewall and on the server itself:

    22/tcp      SSH, so you can get in
    80/tcp      certificate renewal
    443/tcp     the web interface
    10000/udp   the video itself — this is the important one

On the server:

    sudo ufw allow 22/tcp
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw allow 10000/udp
    sudo ufw enable

If 10000/udp is closed, calls connect and then nobody can see or hear anyone.


## 4. Install Jitsi

    sudo apt update && sudo apt upgrade -y
    sudo apt install -y gnupg2 curl apt-transport-https

    curl -sL https://prosody.im/files/prosody-debian-packages.key | \
      sudo gpg --dearmor -o /usr/share/keyrings/prosody.gpg
    echo "deb [signed-by=/usr/share/keyrings/prosody.gpg] http://packages.prosody.im/debian $(lsb_release -sc) main" | \
      sudo tee /etc/apt/sources.list.d/prosody.list

    curl -sL https://download.jitsi.org/jitsi-key.gpg.key | \
      sudo gpg --dearmor -o /usr/share/keyrings/jitsi.gpg
    echo "deb [signed-by=/usr/share/keyrings/jitsi.gpg] https://download.jitsi.org stable/" | \
      sudo tee /etc/apt/sources.list.d/jitsi-stable.list

    sudo apt update
    sudo apt install -y jitsi-meet

It asks two things:

  - the hostname: type meet.hunarsaaz.pk
  - the certificate: choose "Let's Encrypt certificate"

Then:

    sudo /usr/share/jitsi-meet/scripts/install-letsencrypt-cert.sh

Open https://meet.hunarsaaz.pk in a browser. You should get the Jitsi welcome
page. Do not go further until you do.


## 5. Lock it down so only the portal can start a class

Out of the box anyone who finds the address can open a room on your server and
use your bandwidth. Switch on token authentication so only people the portal
lets through can get in.

Pick a long random secret and keep it somewhere safe — you need the same value
in two places:

    openssl rand -hex 32

Edit /etc/prosody/conf.avail/meet.hunarsaaz.pk.cfg.lua and in the first
VirtualHost block change:

    authentication = "jitsi-anonymous"

to:

    authentication = "token"
    app_id = "hunarsaaz"
    app_secret = "PASTE-THE-SECRET-HERE"
    allow_empty_token = false

In the same file make sure these are in the modules_enabled list:

    "token_verification";

Then:

    sudo apt install -y jitsi-meet-tokens
    sudo systemctl restart prosody jicofo jitsi-videobridge2

After this, opening meet.hunarsaaz.pk directly will refuse you. That is
correct — the portal is the only way in now.


## 6. Tune it for large classes

Edit /etc/jitsi/videobridge/jvb.conf and inside the videobridge block set:

    videobridge {
      cc {
        // Only a few video streams go out at once however many people are in
        // the room. This is what keeps a 100-person lecture affordable.
        initial-last-n = 4
        trust-bwe = true
      }
      stats { enabled = true }
    }

Give the bridge more memory. Edit /etc/jitsi/videobridge/config and set:

    VIDEOBRIDGE_MAX_MEMORY=6144m

Edit /etc/jitsi/meet/meet.hunarsaaz.pk-config.js and set:

    channelLastN: 4,
    enableLayerSuspension: true,
    startAudioMuted: 5,
    startVideoMuted: 5,
    disableAudioLevels: true,

The last two mean that from the fifth person onwards everyone arrives muted
with their camera off, which is what you want in a lecture.

Then:

    sudo systemctl restart jitsi-videobridge2 jicofo

Raise the file limits as well, or the bridge runs out of sockets in a big
class. Edit /etc/systemd/system.conf:

    DefaultLimitNOFILE=65000
    DefaultLimitNPROC=65000
    DefaultLimitMEMLOCK=infinity

    sudo systemctl daemon-reload
    sudo systemctl restart jitsi-videobridge2


## 7. Tell the portal about it

In the portal's .env on the cPanel server (/home2/lqonfyud/hunarsaaz-portal),
add three lines:

    JITSI_DOMAIN=meet.hunarsaaz.pk
    JITSI_APP_ID=hunarsaaz
    JITSI_APP_SECRET=the-same-secret-from-step-5

The app id and secret must match what you put in the Prosody config exactly.
If they do not, students reach the room and are thrown out again.

Then restart the portal: cPanel > Setup Node.js App > Restart.


## 8. Test it before you teach with it

    1. Sign in to the portal as an instructor
    2. Live Classes > schedule one for a few minutes from now
    3. Press "Start the class"
    4. On a phone, on mobile data, not the same wifi, sign in as a
       student enrolled on that course and join
    5. Talk. Check you can hear and see each other both ways
    6. Share your screen from the instructor side
    7. End the class and check the register lists the student

Step 4 matters. A call that works between two machines in the same building
proves nothing: it is mobile networks and NAT that break video calls.


## What this does not include

**Recording.** Jitsi records through a separate component called Jibri, which
needs a second server of its own (it runs a whole browser to do it). If you
want recordings, the cheaper path is to have the instructor record their own
screen locally and upload it, then paste the link into the class afterwards —
the portal already has a field for that and shows it to enrolled students.

**More than about 150 in one room.** Past that, one bridge is not enough and
a meeting is the wrong shape anyway. The answer is to stream the lecture
one-way to viewers instead, which costs far less per person but gives them a
chat box rather than a microphone. Tell me when you get close and I will set
it up.

**Backups.** The video server holds nothing worth backing up — all the data
lives in the portal. If the machine dies, rebuild it from this document.
