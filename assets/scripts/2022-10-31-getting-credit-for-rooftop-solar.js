'use strict';

const rawSrectTradeTransactions = [
    ["Transaction Date", "Generation", "Price", "Total Sales", "Fee", "Net Sales", "Payment Date"],
    ["10-07-2022", "08/2022", "381", "381", "26.67", "354.33", "10-17-2022"],
    ["09-06-2022", "07/2022", "345", "345", "24.15", "320.85", "09-12-2022"],
    ["08-05-2022", "06/2022", "302.5", "302.5", "21.18", "281.32", "08-22-2022"],
    ["08-05-2022", "05/2022", "302.5", "302.5", "21.18", "281.32", "08-22-2022"],
    ["08-05-2022", "04/2022", "302.5", "302.5", "21.18", "281.32", "08-15-2022"],
    ["08-05-2022", "03/2022", "302.5", "302.5", "21.18", "281.32", "08-15-2022"],
];

const srecTradeTransactions = rawSrectTradeTransactions.slice(1).map(row => {
    return rawSrectTradeTransactions[0].reduce((acc, val, idx) => {
        acc[val] = row[idx];
        return acc;
    }, {})
});

const enphaseEnergyLifetime = {"system_id":2594969,"start_date":"2021-12-22","production":[44,19565,14117,12548,20427,3059,9604,5673,5282,8694,3135,6524,135,529,204,2882,1167,2763,2308,21712,23902,22015,12086,17965,11978,5016,12744,14274,20331,5160,16915,26401,16489,19186,13491,26866,26191,9778,9249,18971,23734,26128,24603,4591,2947,29521,29332,11766,29735,29178,23478,28786,20311,7270,26120,31236,25549,15796,29813,27197,32717,31488,6982,23513,4982,25686,27566,34228,33562,22082,28225,33091,34348,33655,15851,18311,32509,5927,26854,35414,2152,27004,35758,35023,33557,8731,31898,24433,20939,34569,34783,10244,8970,21965,24551,20194,29610,39268,26359,11533,28677,39552,28079,28282,10060,14828,5276,27160,26075,28610,38971,37433,37396,27663,41423,38914,41672,6919,29094,42161,30655,39394,41726,40811,35892,18772,34540,44399,43920,41022,15604,41495,30058,27122,20812,6761,8367,25845,44605,44241,31286,24762,19505,14255,37680,26456,36677,33328,40936,36031,44199,39265,31350,17668,38126,17938,19158,36324,39043,42584,43573,40883,26557,42564,44514,45877,45816,22760,40216,40696,40988,16389,36943,39016,28731,41753,34358,39460,41866,46502,44660,35841,26500,14571,30633,44111,39886,27705,42481,39979,39123,29156,35836,36455,43220,27329,33440,18489,34990,9497,37818,42756,35140,39150,36258,31147,29247,25710,33345,39814,39024,31771,40685,41198,41299,22257,13349,29107,30276,19380,39134,18778,35371,37344,38780,34243,22254,37197,40471,21640,31840,23407,41161,39583,39852,28206,17237,38331,35056,39006,31065,35940,12979,35447,37129,37742,26956,30611,26678,32617,36612,28846,33296,37295,33321,26034,34473,24515,22707,16210,21972,34357,19509,11601,17731,32468,32969,31015,33579,33606,33627,23485,33956,32241,15603,34406,24778,16749,22388,27946,27766,29303,7684,4895,4180,11778,8050,14809,30036,28374,19990,31602,30739,30049,23730,8434,30760,29221,23817,18491,26512,23744,30153,29375,29292,11786,10890],"meta":{"status":"normal","last_report_at":1666748570,"last_energy_at":1666734698,"operational_at":1640208642}}

const startDate = new Date(enphaseEnergyLifetime.start_date);
//const endDate = d3.timeDay.offset(startDate, enphaseEnergyLifetime.production.length); // end on last day of generation?
const endDate = new Date('2022-10-16');

function buildUsageGraph() {

    const height = 280;
    const width = 700;

    const topGutter = 10;
    const bottomGutter = 20;
    const leftGutter = 20;
    const rightGutter = 20;

    const svg = d3.select("#srec-generation")
        .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "none")

    const y = d3.scaleLinear()
        .domain([0, 50])
        .range([height - topGutter - bottomGutter, 0]);

    const yAxis = d3.axisLeft(y).ticks(5);

    svg.append("g")
        .attr("transform", `translate(${leftGutter},${topGutter})`)
        .call(yAxis);

    const extent = [ startDate, endDate ];
    const x = d3.scaleTime()
        .domain(extent)
        .range([0, width - leftGutter - rightGutter]);

    const xAxis = d3.axisBottom(x)

    svg.append("g")
        .attr("transform", `translate(${leftGutter},${height - bottomGutter })`)
        .call(xAxis);

    const graph = svg.append("g")
        .attr("transform", `translate(${leftGutter},${topGutter})`);

    const prepared = enphaseEnergyLifetime.production.map((v, i) => ({
        date: d3.timeDay.offset(startDate, i),
        kwh: v / 1000
    })).filter(({date}) => date <= endDate);

    graph.append("path")
        .datum(prepared)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x((d, i) => x(d.date))
            .y((d) => y(d.kwh))
        );

    const mvh = [];
    {
        let accum = 0;
        let idx = 0;
        for (const {date, kwh} of prepared) {
            accum += kwh;
            if (accum >= 1000) {
                accum -= 1000
                mvh.push({idx, date});
            }
            idx++
        }
    }

    const colorScheme = d3.scaleOrdinal(d3.schemeSet2)
    {
        let prevIdx = 0
        let i = 0
        for (const { idx, data} of mvh) {
            graph.append("path")
                .datum(prepared.slice(prevIdx, idx + 1))
                .attr("fill", colorScheme(i))
                .attr("stroke", "none")
                .attr("stroke-width", 0)
                .attr("d", d3.area()
                    .x((d) => x(d.date))
                    .y1((d) => y(d.kwh))
                    .y0((d) => y(0))
                );
            prevIdx = idx;
            i++;
        }
    }

    function mdy2Date(v) {
        const [m, d, y] = v.split('-', 3)
        return new Date(`${y}-${m}-${d}`);
    }

    const annotations = graph.append("g").attr("font-size", '10px');
    { 
        srecTradeTransactions.reverse();

        const transByDate = srecTradeTransactions.reduce((acc, val) => {
            if (acc[val["Transaction Date"]] == undefined) {
                acc[val["Transaction Date"]] = [val];
            } else {
                acc[val["Transaction Date"]].push(val);
            }
            return acc;
        }, {});
        

        let i = 0;
        let k = 0;
        let prevd;
        let prevdCnt = 0;

        for (const dt in transByDate) {

            const top = y(45) - (i * 14);
            const d = mdy2Date(dt);
            let j = 0;
            for (const transaction of transByDate[dt]) {

                const v = transByDate[dt][0];
                const offset = j;
                const color = colorScheme(k);

                annotations.append("line")
                    .attr("stroke", color)
                    .attr("x1", x(d) + offset)
                    .attr("x2", x(d) + offset)
                    .attr("y1", y(0))
                    .attr("y2", top + 1.5)
                j++;
                k++;
            }

            const len = transByDate[dt].length;
            const price = parseFloat(transByDate[dt][0]["Price"]).toFixed(2);
            const count =  len > 1 ? ` x${len}` : ''

            annotations.append("circle")
                .attr("fill", "currentColor")
                .attr("cx", x(d) + (len/2) - 0.5)
                .attr("cy", top)
                .attr("r", 3);

            annotations.append("text")
                .text(`\$${price}${count}`)
                .attr("x", x(d) + 7)
                .attr("y", top + 3)

            i++;
        }
    }

}

window.addEventListener('DOMContentLoaded', (event) => {
    buildUsageGraph();
});
