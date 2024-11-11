---
layout: default
subtitle: Can I trust this Solar guy? ...or was it all just hype?
scripts: 
    - d3.v7.min.js
    - 2023-01-09-how-accurate-was-the-solar-pitch.js
tag: climate
---

The solar system on my house has been running for a year. Aside from an incident where a HVAC contractor accidentally disconnected a panel, the system has been working great. Making the decision to install solar panels was conceptually easy, but felt financially risky. Now that I have a year of data, I really wanted to know, how close to reality was the pitch I got from my solar installer?

The software they use is really slick. Hands down the best use of LiDAR I’ve seen in real life was modeling how the surrounding townhomes would cast shadows on my rooftop. Just totally futuristic stuff. At the end of the process you get a nice report that says how much power your should expect to generate, how much you may still need to buy and how quickly you’ll have the system paid off.

These reports are intended to make you feel good about “going solar”. With cute charts that show how, over the lifetime of the system, it’ll pay for itself and then save you $50,000! It looks great, but how accurate is it really? Now that I’ve got a year of data I wanted to compare reality to what was in the proposal. How did the fancy software do at predicting my home’s “solar potential”? How far off was the "Solar Renewable Energy Credits" (SREC) income from what was promised?

<div id="solar-generation"></div>
<div class="is-size-7 pb-3">Monthly solar generation in KWH from Enphase, monthly consumption from Pepco.</div>

The electricity generation projection indicated that I’d generate 8.7 Megawatt-hours (MWH) in a year. The installed system did 5% better than that, generating 9.2 MWH. The size of the system wasn’t limited by my roof space - we could have added more panels. Pepco has a limit for what a “facility” like mine can generate; 150% of the previous years’ use. That math looks like; `5.836 MWH * 1.5 = 8.754 MWH`. It’s really amazing to me that this is how it’s played out. The system does really generate all the power my house uses, and then a bunch more too.

Despite some changes in our monthly of electricity consumption from 2021 to 2022, for the year there was not even a 1% difference.  So on the energy consumption side there isn’t really anything interesting here. We used the same amount of power, just with different timing from the previous year. 

In the solar installer’s proposal there was an option to sell my SRECs at a fixed price. These sort of contracts have guaranteed prices that step down every few years. For the first three years you get $390 each, then $350 for two years, then $190 till year ten. If you want to make sure to get a certain SREC income in the first few years, for example to help pay off a loan, these contracts can make a lot of sense. If you have a loan, but also like risk, then you’re me, who ultimately decided to sell my SRECs at market rates.

<div id="srec-income"></div>
<div class="is-size-7 pb-3">SREC Sales by Month generated, compared to fixed price baseline at $390.</div>

Just looking at the first year, that $390 per SREC price is lot more than I got on the open market. My net sales were $2,488, while the fixed price contract would have yielded $3,396. I still think I made an OK decision selling on the market place in the long term. I don’t think the SREC prices are going to crash - it seems more likely that they will go up. I do I wish I’d set a minimum price and avoided the very low prices early in the year. Going into 2023 I’ve got a minimum price set, but it will be at least 6 months before I  have any indication if it’s too high. 

It hurts a little to see how far below the $390 “baseline” all of my SREC sales were. But I’m still optimistic that in the long term DC will keep the SREC price support in place and using the marketplace will have been the right decision. What is really impressive is how well the electricity generation prediction matched reality.  Over the course of a year I guess the affect of things like snow & cloud cover average out. It’s neat that everything evens out and that I could trust the proposal. The truly cool part is that in 2022 my house became a net producer of electricity, pushing 3.5 MWH back to the grid.

