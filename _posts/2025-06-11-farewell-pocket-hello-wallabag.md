---
layout: default
title: Farewell Pocket, Hello Wallabag
subtitle: Preserving my mental health and reading the internet too
tag: technology
---
In the past few months I’ve found myself traveling more often for work, while also trying very hard to avoid passive news consumption. In an effort to carry around enough reading material, I’ve become a someone who checks out a continuous stream of books to my e-reader, a [Kobo Clara BW](https://us.kobobooks.com/products/kobo-clara-bw). I’ve also been a longtime [Pocket](https://getpocket.com/home) user, and was really enjoying using it to collect articles which I could then read later on the e-reader. It was a habit that got me out of the phone doom loop. You know, where you pick up your phone to read something, only to have a panic inducing push notification wipe all short term memory and send you down a dark spiral…

Anyhow, so of course [Pocket is getting shutdown](https://support.mozilla.org/en-US/kb/future-of-pocket). Like [others](https://jqno.nl/post/2025/06/04/reading-blogs-on-my-kobo-ereader-via-wallabag/), this shutdown has lead me [down the path](https://wallabag.org/news/20250524-pocket-shutdown/) to [Wallabag](https://wallabag.org/), a open source read-it-later service & [Wallabako](https://gitlab.com/anarcat/wallabako/), a Wallabag client for Kobo.

<div class="box mb-3">
<img src="/assets/images/2025-06-11-farewell-pocket-hello-wallabag/ereader.jpg" alt="Photo of an e-reader device" width="800" height="400"/>
<div class="is-size-7 pb-1">Wallabag Articles on my Kobo e-reader.</div>
</div>

I setup an account on [Wallabag.it](https://wallabag.it/en/) and set about installing tools on my e-reader to fetch my saved articles. The install process for these tools requires copying files to special locations, tweaking undocumented settings and generally smuggling functionality onto the device. I’ll admit to being rather terrified I’d brick my Kobo, but it all just worked. I installed [NickelMenu](https://pgaskin.net/NickelMenu/), [KOReader](https://koreader.rocks/) and Wallabako using the official instructions without any issues. For my needs I think I really could have just that last one. However I figured that out by trying them all.

Once you’ve got Wallabako on setup & synced, any unread articles just show up alongside all your books. The sync process could be a bit slicker, but as a reader it all works. I bookmark articles with the Firefox plugin, then later they show up on my Kobo and I read them. It’s great.

Naturally there are a few issues…

- The only big one is Wallabag’s authentication system. There is a [very long thread about it](https://github.com/wallabag/wallabag/issues/2800), which I haven’t had a chance to really read, but the bottom line is that something is wrong here. Setting up authentication for applications like the Firefox browser plugin or Wallabako requires app specific credentials in addition to your username and password. This isn’t how it’s done. We should only be giving them applications specific credentials. Also needing the username and password indicates real problems with the security model.
- When using Wallabako in the Kobo’s default GUI the articles are just mixed in with everything else. It would be great if they could be in a collection. Naturally [this was already explored](https://gitlab.com/anarcat/wallabako/-/issues/20) and seems unrealistic for unfortunate technical reasons.
- Wallabako’s sync seemed to un-DRM my Kobo. I hate that I care about this. The [DC Library](https://www.dclibrary.org/) e-book lending system is great, except that they use Adobe DRM. Plugging the Kobo back into my laptop and opening up Adobe Digital Editions seems to be all it takes to reauthorize, which is tolerable. At this point I’ve only run the sync once so far, which unauthorized my Kobo, and sent me crawling back to Adobe. I won’t attempt that until after I travel. So maybe it was a one time thing? I guess I’ll find out later.

Still it all works and these issues are more like minor annoyances for personal use. I still think it's a shame that Mozilla is shutting down Pocket & isn't going to open source any of the code behind it, but fantastic that there is a fully open source alternative that is just ready to go.
