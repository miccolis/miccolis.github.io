---
layout: default
title: In the Clouds Since 2007
subtitle: How simplicity of early AWS was really nice
tag: technology
---
I was in San Francisco earlier this year for the first time since the pandemic. Despite a busy work schedule I managed to reconnect with a few friends and caught up on everything: met kids, talked politics & tech, got pitches a bunch of ideas, etc… A friend and former colleague asked if I still used AWS at my current company. Which, yes, we do. Then we got to talking about how pivotal it was when we started Mapbox and he asked if I remembered what year we started using AWS.

I suggested 2008, which seemed about right. I remember him staying “that would have been really early.” It was, in fact, [really early](https://en.wikipedia.org/wiki/Timeline_of_Amazon_Web_Services). In those days AWS accounts and Amazon.com accounts weren’t firmly separated. I knew I had some really old resources attached to my Amazon.com account, so I went to look or the earliest bucket. It was from 2007.

<div class="box mb-3">
<img src="/assets/images/2024-11-17-in-the-clouds/s3-devseed.png" alt="Screenshot of S3 web console showing a bucket named 'developmentseed'" width="800" height="239"/>
<div class="is-size-7 pb-1">The "developmentseed" bucket, we used it for backups and not much else.</div>
</div>

This is likely the very first thing I created on AWS. Before Mapbox, when all of the founding team was part of  [Development Seed](https://developmentseed.org/). I’m not certain it was the first thing any of us did on AWS. I think we also did a evaluation of EC2 around the same time.

As Development Seed we built a lot of websites. Hosting was a complicated mess. It was the era of shared hosting. Many of our clients were fine with that, others had traffic volumes and security concerns that precluded those quick & cheap solutions. For those we had to get servers racked, it was expensive and slow.  When “virtual hosting” became a thing it was great for us. For a while we used Slicehost, but around the time Mapbox started to emerge from Development Seed we switched entirely switched to AWS.

The first AWS re:Invent conference was in 2012. Werner Vogels’ keynote changed how I thought about “the cloud”. It changed how the whole team did. Werner chided the audience for naming servers, for our attachment to what should be transient entities. He hinted at that kind of hardware agnostic thinking that would become [AWS Lambda](https://www.allthingsdistributed.com/2024/11/aws-lambda-turns-10-a-rare-look-at-the-doc-that-started-it.html). It was a great talk and we rebuilt our approach to hosting inside of 6 months because of it. We stopped giving servers names, decommissioned our puppet infrastructure and spun up new ec2 instances for every deploy.

The changes his talk inspired paved the way for a self-serve approach to “DevOps” that was fantastic. There was a magical moment where teams used Cloudformation to spin up big sections of Mapbox’s infrastructure and could understand everything that was going on. Before VPC, when IAM roles could only be locked down so well. When the limitations of what AWS offered kept things simple, direct & effective. 

For certain, there were really awkward bits. Cloudformation was, and remains, a fabulous product with million rough edges. Back then it was the indecipherable errors, the lack of drift detection and the general slowness. It wasn’t just Cloudformation of course. All of AWS was just less mature. Traffic in AWS’s network wasn’t segregated and a Mapbox server would periodically get bombarded with requests intended for another company’s application because of a recycled IP address.

Still, it was a revelation compared to the process of contracting for specific hardware to be purchased and racked, with multi-year contract periods for everything. Even compared the other virtual server options at the time, the flexibility we got from AWS was magical. Our staging setup was exactly like production in every way that mattered. Before AWS it may not have that load balancing layer and certainly didn’t have a CDN in front of it. Suddenly it did. If we needed yet another staging setup to try something strange - no problem, just spin up the Cloudformation stack. It really was great and enabled a pace of growth that would have been much harder, if not impossible, just a few years before.
