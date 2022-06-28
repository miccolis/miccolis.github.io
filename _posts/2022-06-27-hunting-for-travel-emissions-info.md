---
layout: default
subtitle: Beyond cars & planes, data on the carbon footprint of travel modes in the US is hard to find.
---

The “Our World in Data” website has this nice chart about the [eCO2 emissions for various travel modes in Europe](https://ourworldindata.org/grapher/carbon-footprint-travel-mode).  It does a great job of breaking out important differences within a mode of transit (e.g. diesel vs petrol) and making the impact per kilometer really clear.

<div class="box mb-1">
<img src="/assets/images/2022-06-27-hunting-for-travel-emissions-info/our-world-in-data-chart.png" />
</div>
<div class="is-size-7 pb-3">Screenshot from https://ourworldindata.org/grapher/carbon-footprint-travel-mode</div>


However, it's very Europe specific. I really doubt all of the assumptions they make would hold true for the US. The average car MPG, electricity power mix, etc… are all different. So I've been looking for a similar chart built with US data.

What I've found so far is not impressive. For example, this chart of “[Average per passenger fuel economy by Travel Mode](https://afdc.energy.gov/data/10311)” from the US DOE's “Alternative Fuels Data Center.” It's built with data form  the “[Transportation Energy Data Book](https://tedb.ornl.gov/)”, which is published yearly by the Oak Ridge National Laboratory for the DOE.

<div class="box mb-1">
<img src="/assets/images/2022-06-27-hunting-for-travel-emissions-info/alt-fuels-chart.png"/>
</div>
<div class="is-size-7 pb-3">Screenshot from https://afdc.energy.gov/data/10311</div>

At first glance this looks reasonable, even though it's about energy used and not emissions. But as I looked closer I really came to dislike this chart for a host of reasons, but I'll limit myself here to a single one. They've manipulated the data and don't explain how. To get to the biggest offender you need to download the excel file version which contains this note:


> *Gasoline-Gallon Equivalents (GGE) are used to compare gasoline, diesel, and electricity on a level basis. Alterations to the source data were made to account for the inefficiencies of electricity production. This impacts rail the most because it has the highest level of electric power.

Sadly details about the “alterations” are not explained. As far as changes to account for “inefficiencies of electricity production” I did some math and it seems like they’re saying ~30% more power would be used to account for losses during generation and transmission. This may be a fair estimate, but they do not explain or cite how this figure was calculated. More alarming, they’ve reduced the average ridership figure for intercity trains by 11%! The"Transportation Energy Data Book” has 23.3 persons-per-vehicle but that’s been changed to 20.8 and I can’t understand why that would be justified. Despite being a spreadsheet with a embedded chart there are no formulas.

Looking at the “Passenger Travel and Energy Use” data in the "Transportation Energy Data Book” I think the folks who collected it would object to how their data is used. There is a big warning above the table about pretty much exactly what is happening in the above chart.

<div class="box mb-1">
<img src="/assets/images/2022-06-27-hunting-for-travel-emissions-info/tedb_ed_39_table_2_13.png" />
</div>
<div class="is-size-7 pb-3">Table 2.13 from the Transportation Energy Data Book, 39th edition</div>


In other words, you cannot take this data and use it to directly compare one mode of travel without great care. And it doesn’t really look like great care was taken in the “Alternative Fuels Data Center” website.

While it may be academically interesting to compare the efficiency of various modes of transit, I’m not really the audience for that data. It seems like this data is more to inform policy makers about the aggregate impact of each form of travel or another and not, for example, deciding whether to take Amtrak. 

Speaking of Amtrak, they have a pretty [“Travel Green”](https://www.amtrak.com/travel-green) page with graphic that is presented as it if shows the carbon savings of Amtrak vs other modes of travel. They also cite "Transportation Energy Data Book” as the source. Again, this is exactly the sort of use the authors warn against! At least this page avoids any magic manipulations to the data.


<div class="box mb-1">
<img src="/assets/images/2022-06-27-hunting-for-travel-emissions-info/amtrak-energy.png" />
</div>
<div class="is-size-7 pb-3">Image from https://www.amtrak.com/travel-green</div>


This infographic does not show the carbon savings of Amtrak vs other modes of travel. It shows every usage and its presentation conflates energy efficiency with environmental impact. There is a huge difference in the climate warming impact of emissions per BTU from burning jet fuel at altitude and the mainly nuclear & natural gas-based electricity that powers Amtrak’s northeast corridor. The climate impact is what most folks are looking for on a “Travel Green” page, but it’s not what this one is showing its readers.

While I’ve got a soft spot for Amtrak, I’m gonna have to rag on them a bit more here. In the Transportation Energy Data Book there is interesting stuff about Amtrak. In [Table 10.10](https://tedb.ornl.gov/wp-content/uploads/2022/03/TEDB_Ed_40.pdf#page=271) they show energy use and passenger data for Amtrak going back to 1971! …but the cited source is a bit unusual:


> Energy use – Personal communication with the Amtrak, Washington, DC. (Additional resources: www.amtrak.com, www.aar.org)

This “personal communication” business is all over the Amtrak data. For example; [Table A.16](https://tedb.ornl.gov/wp-content/uploads/2022/03/TEDB_Ed_40.pdf#page=387) breaks down Amtrak’s power use in Diesel and Electricity for the last 25 years. Again, weirdly interesting! But the source is "Personal communication with Amtrak, Washington, DC, 2020.” It’s hard to imagine a good reason why Amtrak doesn’t just publish these figures.

I’m still on the hunt for a “carbon footprint per travel mode” data set. While the “Transportation Energy Data Book” is a fantastic resource, the large variability at the national scale, that they note, makes the averages there not quite useful. It’s really wild to me that the data has been widely used in exactly the way that the authors directly caution against. It’s also too bad that the “Transportation Data Book” doesn’t contain data that would enable the comparison that seemingly everyone wants.
