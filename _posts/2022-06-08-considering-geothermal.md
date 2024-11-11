---
layout: default
subtitle: The emissions and cost impact of reducing natural gas consumption
scripts: 
    - d3.v7.min.js
    - 2022-06-08-considering-geothermal.js
tag: climate
---
Until recently I thought geothermal systems were only possible if you lived in a place with volcanic activity. Somewhere where molten lava wasn’t far from the surface, Iceland maybe.  What I've learned is that even if you don’t live in Iceland, using the earth for heat is still doable. Geothermal systems move heat from, and into, the ground using a heat pump.  A geothermal heat pump (also called ‘ground source’ as opposed to ‘air source,’ which is the more usual kind) circulates coolant through pipes that run underground. These systems can pull heat from the ground to warm your house, or shove heat down there when it’s too hot. 

Using the ground as a heat source, or heat sink, is a pretty ingenious heating & cooling solution. Unlike the air, which gets freezing cold in the winter and uncomfortably hot in the summer, the ground temperature never hits those extremes. [Below 30 feet the temperature is always going to be relatively stable and close to comfortable](https://builditsolar.com/Projects/Cooling/EarthTemperatures.htm).

I was looking into this because my parents are considering installing a geothermal heat pump. Currently they have a natural gas furnace for heating and an air conditioner (electric powered) for cooling. A geothermal heat pump would replace both and should be significantly more efficient. In terms of heating it should be 3 times more efficient than a gas furnace. For cooling, the improvement won’t be as dramatic, but should be noticeable.

I told my dad I could try and figure out what a geothermal system would do for his utility bills and carbon footprint. We had a classic “walking your parents through a website over the phone” conversation and eventually found where to download a year of usage data from PECO (the gas & electric utility in Pennsylvania where they live). Because it’s very visible in the data, I should mention that the house has solar panels. While my parents’ house is a net consumer of electricity, they generate a fair amount too.

<div id="current-usage"></div>
<div class="is-size-7 pb-3">Daily energy consumption and generation, in KWH, of natural gas and electric</div>

Over the course of a year the house consumed 947 KWH of electricity from the grid and 858 CCFs of natural gas. According to the [EIA calculator](https://www.eia.gov/energyexplained/units-and-calculators/energy-conversion-calculators.php) that amount of natural gas consumption is equivalent to 26,076 KWH of electricity. That means my parents are using 30 times more energy from gas than electricity! In addition to heating, he house has a natural gas water heater and cooking range. Based on gas usage during temperate weather we can assume that a maximum of 0.5 CCF per day are used for those appliances, and not heating. As the vast majority of the gas is used for heat, changing how the house is heated should have pretty big implications for power consumption and carbon footprint.

Because heat pumps concentrate heat and move it around rather than generating heat, they produce [3-4 KWH of heat for every 1 KWH of power they use](https://en.wikipedia.org/wiki/Ground_source_heat_pump#Thermal_performance). Even ignoring hard to predict efficiency gains for cooling, we can expect the energy needed for heating the house to drop to considerably.

<div id="geothermal-estimate"></div>
<div class="is-size-7 pb-3">Estimated daily energy consumption and generation, in KWH, of natural gas and electric with a ground source heat pump</div>

With a geothermal heat pump, the difference in overall energy required is pretty dramatic. Where daily peaks would previously reach up towards 400 KWH of overall energy consumption, this kind of heat pump would need half that amount. Switching over to geothermal is likely to reduce natural gas consumption by 704.5 CCFs, which would have emitted 8,217 lbs of CO2.

Because a geothermal heat pump will require more power to be pulled from the grid, it’s only fair to account for that here too. Assuming the old furnace was 80% efficient and a new geothermal heat pump is 300% efficient, the energy required to heat the house is going to be 5.5 MWH. Based on the [EPA estimated grid emissions for PA](https://www.epa.gov/egrid/data-explorer) (694.63 lbs C02 per MWH), getting the required electricity from the grid would generate 3,847 lbs of CO2. Switching from gas to a geothermal heat pump basically cuts heating emissions in half!

The cost comparison is less spectacular. In the winter my parents pay $1.06 per CCF of gas and $0.14 per KWH for electricity from the grid. On cold & cloudy days where previously the cost of heating the house would have been $10.14, it may now be more like $11.35 - potentially 12% more expensive. This cost may be offset a little by their solar generation, but that’s somewhat less likely during the winter months. Also we haven’t looked at the install yet.

The install is expensive and varies depending on a host of factors. Ranges I’ve seen look like [$10k to $30k](https://www.energysage.com/clean-heating-cooling/geothermal-heat-pumps/costs-benefits-geothermal-heat-pumps/). Compare this to an air source heat pump’s range of [$3,800 to $8,200](https://homeguide.com/costs/heat-pump-costhttps://homeguide.com/costs/heat-pump-cost). (Side note: both of those are lower that what I’ve heard from contractors. Recent inflation and energy prices are “exerting upward pressure” on costs for this work, and it’s safe to assume the high end of those ranges is now the middle.) There is a [federal tax credit for 26% of the cost of a geothermal system](https://dandelionenergy.com/federal-geothermal-tax-credit) which is great. Still, after the tax credit, folks are spending ~$22k and if they’re switching from natural gas, they could still have marginally higher ongoing costs.

The economic incentives aren’t aligned to make switch from gas furnace to geothermal heat pump an easy decision. If your air conditioning and/or gas furnace is at the end of its life, as in the case of my parents whose A/C is old & stopped working, you’ll need to spend serious cash no matter what you do. Even then, as [replacing a A/C unit is around $8k](https://www.consumeraffairs.com/homeowners/how-much-does-an-air-conditioner-cost.html), a geothermal system may be more than twice as expensive as just fixing the A/C and keeping natural gas for heat. From a climate impact perspective switching to a geothermal heat pump is a significant positive change.  Unfortunately, under existing policy and with current energy costs, a homeowner has to pay more for a system that emits less carbon.
