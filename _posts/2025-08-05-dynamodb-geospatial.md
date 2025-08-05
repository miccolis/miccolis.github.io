---
layout: default
title:  A Take on using DynamoDB for Geospatial Data
subtitle: Also a few digressions about building and hosting Javascript applications
tag: technology
---

Back in 2018 AWS published a blog post about using DynamoDB for storing geospatial data. It talks about using [Z-order indexing to efficiently reference data](https://aws.amazon.com/blogs/database/z-order-indexing-for-multifaceted-queries-in-amazon-dynamodb-part-1/). Since reading that post I have wanted to give it a try, despite a bit of yak shaving along the way, I’ve got it done!

The approach I took is pretty much exactly what they talk about in the article, and I want to share what that looked like for me to implement, but I’m also gonna have some digressions along the way. Starting now…

### Digression one - Typescript for type-checking Javascript

I’m a huge fan of the type-checking  and have always missed it with Javascript. Of course I’m not alone and Typescript is out there to solve this problem. The problem for me is the transpilation time. Professionally I’ve always found that time `tsc` takes to be a major pain and in a personal project… I just cannot. Thankfully here I’m not alone either, and the Typescript folks have provided <a href="https://jsdoc.app/">JSDoc</a> support. 

<div class="box">
<pre>
/**
 * @param {APIGatewayProxyEventV2} event
 * @param {Uint8Array} jwtSecret
 */
export async function checkSession(event, jwtSecret) { ... }
</pre>

<div class="is-size-7 pb-1">Example from <a href="https://github.com/miccolis/morton-ddb/blob/48caaa709fa936b43e533f23995fc85eff930384/src/lib/helpers.js#L110-L114">https://github.com/miccolis/morton-ddb</a></div>
</div>

It works well enough. There are some [limitations](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#unsupported-tags), but they are being worked on. While I haven’t looked to closely at this myself, the Nodejs project is [working on stripping type annotations too](https://nodejs.org/en/learn/typescript/run-natively). This would also be a great path to getting the safety of type checking without the tax of `tsc`. Naturally would only work for projects run in node and not the browser, but most browser side Javascript already has bit of a transformation pipeline already so it’s less of an issue there.

### Digression the second - AWS hosting

I’ve already written about part of my experience here, how [getting a static web application hosting on AWS involves too many moving pieces](https://jeff.miccolis.net/posts/2024-11-09-hosting-hobby-app-aws.html).  One bit I didn’t go into on that post was using the new-ish Lambda Function URLs. These let you run bits of server-less code in response to a HTTP request with minimal configuration. Until these these were added you could only use API Gateway, which is significantly more setup and, frankly, a pretty confusing product to work with.

I hadn’t used Function URLs before, it works as advertised without all the extra stuff that API Gateway required. When using it behind a CDN like AWS Cloudfront I’m pretty sure it would be fine to use it in a production application. For an amateur use like I have, it’s pretty much perfect.

The access control features for AWS Function URLs are limited, so for I needed to implement my own authentication. Being a little old school and mainly expecting to use curl, I went with a cookie-based approach. As with any bespoke authentication system you end up stopping somewhere and here the main missing piece is a CSRF tokens. So a couple forms are subject to abuse. If this was a real app I’d probably switch over to all JSON payloads, at a minimum.  However my main audience is me using curl and I like working like...

    $> curl -c 🍪.txt --data "username=jeff" --password="mypassword" http://...

<br />
Related, it’s wild that the old “[simple requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS#simple_requests)” browser behavior survives. It’s been years since I thought about this, and I’d just assumed that the old “HTML forms can post anywhere” behavior was long dead. Apparently it’s not. I haven’t gone to deep on this, but maybe there are reasons. However it really bugs me that such a awful behavior, which pushes the CSRF complexity down into every web application, hasn’t been dealt with at the HTML spec level.

### Digression the third - Web Components

I used Web Components in the simple front-end app I built to help me verify the API was working and it was the first time I’d created a Web Component. I really want to like them & want them to be a useful feature of the “Web Platform”. I’d been reading about how Web Components are gonna solve a bunch of problems that various front end frameworks have been working on in a more generic way & as part of the browser itself. Unfortunately they didn’t live up to my expectations. I’ll admit I have not done full time “front end” development in years. Maybe my expectations are dated, or I just missed something. For me the amount of Javascript that’s needed, how tightly coupled it is to the HTML, issues around the Shadow DOM and sharing CSS styles, plus the reality of templates and slots… it’s all a lot and it doesn’t directly solve the problems I face when building a simple app. 

I completely understand the gap that it’s trying to fill, but the complexity it exposes don’t justify what you get from using it for an app like this. I know my thoughts about Web Components are shared by many others and I hope it leads to some change down the line.

### Finally we get to Geo filtering

Ok, enough digressions - this was going to be about using DynamoDB, a database with fairly simple indexing functionality, to do multi-dimensional geospatial searches. Lets get to that!

DynamoDB continues to be one of my favorite AWS services to use. To be sure I’ve got my gripes; it is kinda slow & the support for global secondary indexes in Cloudformation only allows you to add one at a time, breaking the idea that a template can be redeployed at any time, etc… Even with it’s limitations I really enjoy the way it makes you think about indexing and doesn’t penalize you for using human-readable compound keys. I’ve really enjoyed the data modeling that goes into using it effectively.

One of the things about DynamoDB that is a classic annoyance is how it does pagination. Instead of giving it an offset, the documentation encourages you to respect the `LastEvaluatedKey`. The documentation implies that this is a opaque value that you should just receive and then use as part of the next query to get another page of results. 

The thing is, it’s not an opaque value - it’s just encoded. The decoded value is a map of the primary and secondary key of that last visited item, as well as any attributes that were used to fetch it if a secondary index was used.

Those decoded values are perfect for my use case. As a z-order range is all “Z” like, it can leave the bounding box I’m querying for. By looking at the decoded `LastEvaluatedKey` I can tell if that item is outside my bounding box. If it is, I calculate the next spot where the z-order ranges reenters the bounding box and pickup there.

The algorithm for finding the next spot along a z-order range that enters a bounding box is commonly called `nextJumpIn` or `BIGMIN`. In that 2018 post from AWS they mention it in passing, but don’t even link to something useful to learn more. Recently <a href="https://chaos.social/@djh">@djh@chaos.social</a> did [a great write-up on this](https://www.openstreetmap.org/user/daniel-j-h/diary/406584). I highly recommended reading it, he does a great job explaining the problem space and links out to a few implementations.

For my needs I ended up using an implementation that he doesn’t link to, so I will here; <a href="https://www.npmjs.com/package/@thi.ng/morton">@thi.ng/morton</a> from <a href="https://mastodon.thi.ng/@toxi">@toxi@mastodon.thi.ng</a>. 

The way this all fits together is this;


1. As data is written to DynamoDB the original geometry is saved to one record, another record is created for every tiled area at the zoom level that was selected for that data set.  The idea being that based on the nature of data being saved you may need more, or less, resolution when querying from the DB. For a point location two records are created, but for lines or polygons it could be much more.
2. When a user queries for all the items in a bounding box it is translated into tiled coordinates for that data set and the we query DynamoDB for everything between the top left and bottom right z-order order values.
3. As the z-order curve can leave the bounding box, we also have include a filter in the DynamoDB query that discards anything outside the bbox at when it’s encountered.
4. DynamoDB returns results after scanning 2mb of data and sets that `LastEvaluatedKey` if there is more data to fetch. So it that key is missing, we do a final filter against the initial bounding box - as the conversion from lat/lon into tiles will grab extra data - and return results.
5. But if the `LastEvaluatedKey` key is there we decode is and see if that last evaluated record is outside the bounding box. If it is beyond our range, we find a location on the z-order curve that is back in our bounds using `ZCurve.bigMin()` and issue a new query from that location. If the location is withing the bounds, we use the `LastEvaluatedKey` as expected and keep paging through the data.

It all seems to work and was really fun to think through and pull all together. I’ve got no idea if I’ll ever use this code for anything that is actually useful, but it exists now and I’m feeling contented about having given it a try.

