---
layout: default
subtitle: The District of Columbia’s SREC market has high enough prices to really make a difference
scripts: 
    - d3.v7.min.js
    - 2022-10-31-getting-credit-for-rooftop-solar.js
tag: climate
---

One of the first questions homeowners have when considering solar panels is, do these actually pay for themselves? Quickly followed by, ok, but how long will that take? Homeowners want to hear an answer that is around 5 years or less. In DC the answer is often right in this sweet spot.

How it works is a little more complicated than most people expect. There are three ways the cost of panels is offset - two of them feel normal, but the third is a whole world of weirdness. The straightforward ones are a reduction in your electricity bill and federal tax credits. The odd one is “Solar Renewable Energy Credits”, aka SRECs.  For every megawatt-hour (MWH) your system generates you can get a credit for that generation, specifically a SREC. These are very similar to carbon offsets, in that polluters can buy them to offset their polluting. In DC non-renewable electricity suppliers are required to purchase a certain number of SRECs or pay a $500 per MWH fine.

That $500 sets the price point for the top of the market. A typical rooftop system in DC generates 8 SRECs a year which can sell for $300-$400 each. Meanwhile your electricity bill can drop to nearly $0 (you’ll pay a minimum of ~$15 a month to be connected to the grid, but it’s a trivial price for what’s effectively an unlimited battery.) The reduction in electricity cost, combined with SREC means a solar system could be cash flow positive right away, depending on your financing, timing of your tax returns and when SREC sales actually happen.

A system like I installed costs ~$26k, but because of the the 26% tax credit I got ~$6k back from the government at tax time. This makes the cost after tax rebate around $20,000, which I really want to have paid back in 5 years. If I assume an average SREC price of $350 and a monthly electricity saving of $100, the yearly change in cash flow is $3,800. If that holds, I’d have paid off my system in 5.25 years.  Not bad! …and after those 5 years and 3 months I’ll have a very small electricity bill and still get a be able to sell SRECs. It's complicated, but in DC the SRECs can make solar panels a pretty great investment.

Without the SREC the payback time would be ~20 years, which is about the same as average warrantied lifetimes of these systems. So on paper it may still be worthwhile, but with such a long payback period that it’s a much harder decision to make for most folks.

The process and timeline for actually selling SRECs was a lot slower than I expected. I got extremely nervous that I’d made a huge mistake and wouldn’t see any of them sell. My December-installed system generated its first MWH in late February, but it didn’t sell for over 5 months. I don’t know enough to accuse folks of collusion, but it does seem that nobody buys SRECs till August, when the prices drop because the marketplace is overloaded with the summer’s production.
<div id="srec-generation"></div>
<div class="is-size-7 pb-3">Daily solar generation in KWH from Enphase with SREC transaction annotations from SREC Trade</div>

The graph above has my solar system's production, with each MWH in a different color. The annotations are SREC sales. In my case the system had generated enough power for 6 SRECS before I’d sold any at all. Then suddenly everything I had actually listed on the market sold and at a price a fair bit below what I’d been expecting.

From what I’ve seen, a delay of 2 months from generation to sales is the best case, even if there are active buyers. There is a delay between when you generate and when the marketplace pulls that information and another between them knowing your generation and putting that SREC up for sale. Say you’ve got panels and generate for a month. At some point in the next month the marketplace pulls your data (I haven’t been able to pin that day down yet, which is annoying). If you’ve generated enough, they’ll declare that you’ve got an SREC to sell which, after another 15 days, will be available for sale on the marketplace.

My original calculations didn’t take into account the actual behavior of the market as well as another fact of most markets; commission. SRECTrade charges 7%. Between this and the lower summer prices my average SREC per sale income this year is $300.20. If this pattern continues the payback period starts looking closer to 6 years. Longer than I’d like, but not by too much.

Predicting as far out as 2027, when I hope to have recouped my investment, is complicated. As it stands right now the penalty that drives SREC prices is dropping to $400 in 2024. At the same time, the new "Clean Energy DC Building Code Act” will require new buildings to be “net zero” by 2026. The rules for how a building is deemed carbon neutral have yet to be written so it’s hard to predict if SRECs will fit in. Getting to neutral without solar would have to rely on tools like SRECs or other forms of offsets. It’s hard to see for where things will go, but the DC government seems serious about these sorts of incentives, so we should expect to see their use continue.

