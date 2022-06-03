---
layout: default
subtitle: The emissions and cost impact of reducing natural gas consumption
scripts: 
    - d3.v7.min.js
    - 2022-06-08-considering-geothermal.js
---
Until recently I thought geothermal systems were only useful if you lived in a place with volcanic activity. Somewhere where molten lava wasn't far from the surface, Iceland maybe. What I've learned is that even if you don’t live in Iceland using the earth for heat is still doable. In a less volcanic context, geothermal is about moving heat from, and to, the ground using a heat pump.  A geothermal heat pump (also called ‘ground source’ as opposed to ‘air source’, which is the more usual kind) circulates a coolant through pipes that run underground. These systems can pull heat from the ground to warm your house, or shove heat down there when it’s too hot.

Using the ground as a heat source, or heat sink, is a pretty ingenious heating & cooling solution. Unlike the air, which gets freezing cold in the winter and uncomfortably hot in the summer, the ground temperature just never hits those extremes. [Below 30 feet the temperature is always going to be relatively stable and close to comfortable](https://builditsolar.com/Projects/Cooling/EarthTemperatures.htm).

I’m talking about this because my parents are considering installing a geothermal heat pump. Currently they have a natural gas furnace for heating and an air conditioner for cooling. A geothermal heat pump would replace both and should be significantly more efficient. In terms of heating it should be 3 times more efficient than a gas furnace. For cooling the improvement won’t be as dramatic but should also be noticeable.

I told my dad I could try and figure out what a geothermal system would do for his utility bills and carbon footprint. We had a classic “walking your parents through a website over the phone” conversation and eventually found where to download a year of usage data from PECO (the gas & electric utility in Pennsylvania where they live). Because it’s very visible in the data, I should mention that the house does have solar panels. While my parent’s house is a net consumer of electricity, they generate a fair amount too.

<div id="current-usage"></div>
<div class="is-size-7 pb-3">Daily energy consumption and generation, in KWH, of natural gas and electric</div>

Over the course of a year the house consumed 947 KWH of electricity from the grid and 858 CCFs of natural gas. According to the [EIA calculator](https://www.eia.gov/energyexplained/units-and-calculators/energy-conversion-calculators.php) that natural gas consumption is equivalent to 26,076 KWH of electricity. That’s 30 times more energy from gas than electricity! The house also has a natural gas water heater and cooking range. Based on gas usage during temperate weather we can assume that a maximum of 0.5 CCF per day are used for those appliances, and not heating. As the vast majority of the gas is used to heat, so changing how the house is heated should have pretty big implications for power consumption and carbon footprint.

Because heat pumps concentrate heat and move it around, rather than generating any heat, they produce [3-4 KWH of heat for every 1 KWH of power they use](https://en.wikipedia.org/wiki/Ground_source_heat_pump#Thermal_performance). Even ignoring hard to predict efficiency gains for cooling, we can expect the energy needed for heating the house to drop to considerably.

<div id="geothermal-estimate"></div>
<div class="is-size-7 pb-3">Estimated daily energy consumption and generation, in KWH, of natural gas and electric with a ground source heat pump</div>

With the geothermal heat pump the difference in overall energy required is pretty dramatic. Where daily peaks would previously reach up towards 400 KWH of overall energy consumption, it should be half that in the future. Switching over to geothermal is likely to reduce natural gas consumption by 704.5 CCFs, which would be responsible for 8,217 lbs of CO2.

Because it will require more power to be pulled from the grid it’s only fair to account for that here too. Assuming the old furnace was 80% efficient and a new geothermal heat pump is 300% efficient, the energy required to heat the house is going to be 5.5 MWH. Based on the [EPA estimated grid emissions for PA](https://www.epa.gov/egrid/data-explorer) (694.63 lbs C02 per MWH) getting the electricity from the grid would generate 3,847 lbs of CO2. Switching to a geothermal heat pump cuts the heating emissions almost in half!

The cost comparison is less spectacular. In the winter they pay $1.06 per CCF for gas and $0.14 per KWH for electricity the pull from the grid. On cold & cloudy days where previously the cost of heating the house would have been $10.14 it may now be more like $11.35. So potentially 12% more expensive. It may be offset a little by their solar generation, but during the winter months that’s somewhat less likely. Also we haven’t looked at the install yet.

The install is expensive and varies depending on a host of factors. Ranges I've seen look like [$10k to $30k](https://www.energysage.com/clean-heating-cooling/geothermal-heat-pumps/costs-benefits-geothermal-heat-pumps/). Compare this to an air source heat pump's range of [$3.8k to $8.2k](https://homeguide.com/costs/heat-pump-cost).(Side note: both of those are lower that what I've heard from contractors. Recent inflation and energy prices and “exerting upward pressure” on costs for this work. It seems safe to assume high end of those ranges is now the middle.) There is a federal rebate of 26%, which is great. Still, after the tax credit, folks are spending ~$22k and if they’re coming from natural gas, they could still have marginally higher ongoing costs.

When folks have the means, and care deeply, this is doable. But the economic incentives aren't aligned to make this an easy decision. If your air conditioning and/or gas furnace is at it’s end of life, as is the case of my parents whose A/C is old & stopped working, you need to spend serious cash no matter what you do. Even then it may be more than twice as expensive as just fixing the A/C and keeping natural gas for heat. Focusing on the climate impact, switching from a furnace & A/C to a geothermal heat pump is a significant positive change. Unfortunately it’s not something where, under existing policy and with current energy pricing, the financials encourge the less carbon emitting choice.
