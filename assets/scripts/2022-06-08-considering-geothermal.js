'use strict';

{ // start scope 

function CCFtoKWH(ccf) {
    // From https://www.eia.gov/energyexplained/units-and-calculators/energy-conversion-calculators.php
    return ccf * 30.392; // 100 * 1037 / 3412 (ie 100 * [btu per cubic foot] / [btu per kwh])
}

const efficiencyGain = 3;
const furnceEfficiency = 0.8

/**
 * @param {Array<{date: string, kwh: number, ccf:number}>} series
 */
function addZeroCrossing(series) {
    const withCrossings = [];
    let prev = undefined;
    for (let {date, kwh, ccf} of series) {
        if (prev && ((prev.kwh < 0) !== (kwh < 0))) {
            const dUsage = kwh - prev.kwh;
            const dDt = date - prev.date;
            const slope = dUsage / dDt;
            const interpTime = new Date((Math.abs(prev.kwh / slope)) + prev.date.getTime());

            const dCcf = ccf - prev.ccf;
            const gslope = ccf / dDt;
            const interpCCF = prev.ccf + ((+interpTime - +date) * gslope);
            withCrossings.push({date: interpTime, kwh: 0, ccf: interpCCF});
        }
        const v = { date, kwh, ccf };
        withCrossings.push(v);
        prev = v;
    }
    return withCrossings;
}

function buildUsageGraph() {

    const height = 280;
    const width = 700;

    const bottomGutter = 20;
    const leftGutter = 30;
    const rightGutter = 0;

    const svg = d3.select("#current-usage")
        .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "none")

    const y = d3.scaleLinear()
        .domain([420, -100])
        .range([0, height - bottomGutter ]);

    const yAxis = d3.axisLeft(y).ticks(5);

    svg.append("g")
        .attr("transform", `translate(${leftGutter},0)`)
        .call(yAxis);

    const extent = [ joinedData[0].date, joinedData[joinedData.length - 1].date ];
    const x = d3.scaleTime()
        .domain(extent)
        .range([0, width - leftGutter - rightGutter]);

    const xAxis = d3.axisBottom(x)

    svg.append("g")
        .attr("transform", `translate(${leftGutter},${height - bottomGutter })`)
        .call(xAxis);

    const graph = svg.append("g")
        .attr("transform", `translate(${leftGutter},0)`);

    const prepared = addZeroCrossing(joinedData);

    graph.append("path")
        .datum(prepared)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.area()
            .x((d) => x(d.date))
            .y1((d) => y(d.kwh))
            .y0((d) => y(0))
        );

    graph.append("path")
        .datum(prepared)
        .attr("fill", "steelblue")
        .attr("stroke", "none")
        .attr("d", d3.area()
            .x((d) => x(d.date))
            .y1((d) => d.kwh > 0 ? y(d.kwh) : y(0))
            .y0((d) => y(0))
        );

    graph.append("path")
        .datum(prepared)
        .attr("fill", "lightgreen")
        .attr("stroke", "none")
        .attr("d", d3.area()
            .x((d) => x(d.date))
            .y1((d) => d.kwh < 0 ? y(d.kwh) : y(0))
            .y0((d) => y(0))
        );

    graph.append("path")
        .datum(joinedData)
        .attr("fill", "salmon")
        .attr("stroke", "none")
        .attr("stroke-width", 1.5)
        .attr("d", d3.area()
            .x((d) => x(d.date))
            .y1((d, i) => y(d.kwh > 0 ?
                d.kwh + CCFtoKWH(d.ccf) :
                CCFtoKWH(d.ccf)))
            .y0((d, i) => y(d.kwh > 0 ? d.kwh : 0 ))
        );

    const legend = svg.append("g").attr("font-size", 10)
        .attr("transform", `translate(50, 7)`);

    let offset = 10;
    for (const [label, color] of [
        [ 'Natural gas use (1 CCF = 30.392 KWH)', 'salmon' ],
        [ 'Grid provided electricity', 'steelblue' ],
        [ 'Excess electricity production', 'lightgreen' ]
    ]) {
        const item = legend
            .append("g")
            .attr("transform", (d, i) => `translate(0, ${offset})`);

        item.append("circle")
                .attr("fill", color)
                .attr("stroke", "dimgrey")
                .attr("stroke-width", "1")
                .attr("r", 5)
                .attr("x", 3);

        item.append("text")
                .text(label)
                .attr("x", 10)
                .attr("y", 4);

       offset += 20;
    }
}

function buildGeothermalGraph() {

    const smallerMultiple = 0.75
    const height = 280 * smallerMultiple;
    const width = 700;

    const bottomGutter = 20;
    const leftGutter = 30;
    const rightGutter = 0;

    const svg = d3.select("#geothermal-estimate")
        .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "none")

    const y = d3.scaleLinear()
        .domain([(420  + 100) * smallerMultiple - 100, -100])
        .range([0, height - bottomGutter ]);

    const yAxis = d3.axisLeft(y).ticks(5);

    svg.append("g")
        .attr("transform", `translate(${leftGutter},0)`)
        .call(yAxis);

    const extent = [ joinedData[0].date, joinedData[joinedData.length - 1].date ];
    const x = d3.scaleTime()
        .domain(extent)
        .range([0, width - leftGutter - rightGutter]);

    const xAxis = d3.axisBottom(x)

    svg.append("g")
        .attr("transform", `translate(${leftGutter},${height - bottomGutter })`)
        .call(xAxis);

    const graph = svg.append("g")
        .attr("transform", `translate(${leftGutter},0)`);

    const prepared = addZeroCrossing(joinedData.map(({date, ccf, kwh }) => {
        if (ccf > 0.5) {
            kwh += CCFtoKWH(ccf) * furnceEfficiency / efficiencyGain;
            ccf = 0.5;
        }
        return { date, ccf, kwh };
    }));


    graph.append("path")
        .datum(prepared)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.area()
            .x((d) => x(d.date))
            .y1((d) => y(d.kwh))
            .y0((d) => y(0))
        );

    graph.append("path")
        .datum(prepared)
        .attr("fill", "steelblue")
        .attr("stroke", "none")
        .attr("d", d3.area()
            .x((d) => x(d.date))
            .y1((d) => d.kwh > 0 ? y(d.kwh) : y(0))
            .y0((d) => y(0))
        );

    graph.append("path")
        .datum(prepared)
        .attr("fill", "lightgreen")
        .attr("stroke", "none")
        .attr("d", d3.area()
            .x((d) => x(d.date))
            .y1((d) => d.kwh < 0 ? y(d.kwh) : y(0))
            .y0((d) => y(0))
        );

    graph.append("path")
        .datum(prepared)
        .attr("fill", "salmon")
        .attr("stroke", "none")
        .attr("stroke-width", 1.5)
        .attr("d", d3.area()
            .x((d) => x(d.date))
            .y1((d, i) => y(d.kwh > 0 ?
                d.kwh + CCFtoKWH(d.ccf) :
                CCFtoKWH(d.ccf)))
            .y0((d, i) => y(d.kwh > 0 ? d.kwh : 0 ))
        );

    const legend = svg.append("g").attr("font-size", 10)
        .attr("transform", `translate(50, 7)`);

    let offset = 10;
    for (const [label, color] of [
        [ 'Natural gas use (1 CCF = 30.392 KWH)', 'salmon' ],
        [ 'Grid provided electricity', 'steelblue' ],
        [ 'Excess electricity production', 'lightgreen' ]
    ]) {
        const item = legend
            .append("g")
            .attr("transform", (d, i) => `translate(0, ${offset})`);

        item.append("circle")
                .attr("fill", color)
                .attr("stroke", "dimgrey")
                .attr("stroke-width", "1")
                .attr("r", 5)
                .attr("x", 3);

        item.append("text")
                .text(label)
                .attr("x", 10)
                .attr("y", 4);

       offset += 20;
    }
}

window.addEventListener('DOMContentLoaded', (event) => {
    buildUsageGraph();
    buildGeothermalGraph();
});

// Data below
const gasUsage = [{"date": "2021-04-30", "usage": 0.0}, {"date": "2021-05-01", "usage": 0.0}, {"date": "2021-05-02", "usage": 1.0}, {"date": "2021-05-03", "usage": 0.0}, {"date": "2021-05-04", "usage": 1.0}, {"date": "2021-05-05", "usage": 0.0}, {"date": "2021-05-06", "usage": 0.0}, {"date": "2021-05-07", "usage": 1.0}, {"date": "2021-05-08", "usage": 1.0}, {"date": "2021-05-09", "usage": 1.0}, {"date": "2021-05-10", "usage": 0.0}, {"date": "2021-05-11", "usage": 1.0}, {"date": "2021-05-12", "usage": 2.0}, {"date": "2021-05-13", "usage": 1.0}, {"date": "2021-05-14", "usage": 1.0}, {"date": "2021-05-15", "usage": 0.0}, {"date": "2021-05-16", "usage": 1.0}, {"date": "2021-05-17", "usage": 1.0}, {"date": "2021-05-18", "usage": 0.0}, {"date": "2021-05-19", "usage": 1.0}, {"date": "2021-05-20", "usage": 0.0}, {"date": "2021-05-21", "usage": 0.0}, {"date": "2021-05-22", "usage": 0.0}, {"date": "2021-05-23", "usage": 1.0}, {"date": "2021-05-24", "usage": 0.0}, {"date": "2021-05-25", "usage": 1.0}, {"date": "2021-05-26", "usage": 0.0}, {"date": "2021-05-27", "usage": 1.0}, {"date": "2021-05-28", "usage": 1.0}, {"date": "2021-05-29", "usage": 0.0}, {"date": "2021-05-30", "usage": 2.0}, {"date": "2021-05-31", "usage": 1.0}, {"date": "2021-06-01", "usage": 1.0}, {"date": "2021-06-02", "usage": 0.0}, {"date": "2021-06-03", "usage": 0.0}, {"date": "2021-06-04", "usage": 1.0}, {"date": "2021-06-05", "usage": 0.0}, {"date": "2021-06-06", "usage": 0.0}, {"date": "2021-06-07", "usage": 1.0}, {"date": "2021-06-08", "usage": 0.0}, {"date": "2021-06-09", "usage": 0.0}, {"date": "2021-06-10", "usage": 0.0}, {"date": "2021-06-11", "usage": 1.0}, {"date": "2021-06-12", "usage": 0.0}, {"date": "2021-06-13", "usage": 1.0}, {"date": "2021-06-14", "usage": 0.0}, {"date": "2021-06-15", "usage": 0.0}, {"date": "2021-06-16", "usage": 0.0}, {"date": "2021-06-17", "usage": 1.0}, {"date": "2021-06-18", "usage": 0.0}, {"date": "2021-06-19", "usage": 0.0}, {"date": "2021-06-20", "usage": 1.0}, {"date": "2021-06-21", "usage": 0.0}, {"date": "2021-06-22", "usage": 1.0}, {"date": "2021-06-23", "usage": 0.0}, {"date": "2021-06-24", "usage": 0.0}, {"date": "2021-06-25", "usage": 1.0}, {"date": "2021-06-26", "usage": 0.0}, {"date": "2021-06-27", "usage": 1.0}, {"date": "2021-06-28", "usage": 0.0}, {"date": "2021-06-29", "usage": 0.0}, {"date": "2021-06-30", "usage": 1.0}, {"date": "2021-07-01", "usage": 0.0}, {"date": "2021-07-02", "usage": 0.0}, {"date": "2021-07-03", "usage": 1.0}, {"date": "2021-07-04", "usage": 1.0}, {"date": "2021-07-05", "usage": 0.0}, {"date": "2021-07-06", "usage": 1.0}, {"date": "2021-07-07", "usage": 1.0}, {"date": "2021-07-08", "usage": 1.0}, {"date": "2021-07-09", "usage": 1.0}, {"date": "2021-07-10", "usage": 0.0}, {"date": "2021-07-11", "usage": 1.0}, {"date": "2021-07-12", "usage": 0.0}, {"date": "2021-07-13", "usage": 1.0}, {"date": "2021-07-14", "usage": 0.0}, {"date": "2021-07-15", "usage": 0.0}, {"date": "2021-07-16", "usage": 1.0}, {"date": "2021-07-17", "usage": 0.0}, {"date": "2021-07-18", "usage": 1.0}, {"date": "2021-07-19", "usage": 0.0}, {"date": "2021-07-20", "usage": 0.0}, {"date": "2021-07-21", "usage": 0.0}, {"date": "2021-07-22", "usage": 1.0}, {"date": "2021-07-23", "usage": 0.0}, {"date": "2021-07-24", "usage": 1.0}, {"date": "2021-07-25", "usage": 0.0}, {"date": "2021-07-26", "usage": 0.0}, {"date": "2021-07-27", "usage": 0.0}, {"date": "2021-07-28", "usage": 0.0}, {"date": "2021-07-29", "usage": 1.0}, {"date": "2021-07-30", "usage": 0.0}, {"date": "2021-07-31", "usage": 0.0}, {"date": "2021-08-01", "usage": 1.0}, {"date": "2021-08-02", "usage": 0.0}, {"date": "2021-08-03", "usage": 0.0}, {"date": "2021-08-04", "usage": 0.0}, {"date": "2021-08-05", "usage": 1.0}, {"date": "2021-08-06", "usage": 0.0}, {"date": "2021-08-07", "usage": 0.0}, {"date": "2021-08-08", "usage": 1.0}, {"date": "2021-08-09", "usage": 0.0}, {"date": "2021-08-10", "usage": 0.0}, {"date": "2021-08-11", "usage": 0.0}, {"date": "2021-08-12", "usage": 1.0}, {"date": "2021-08-13", "usage": 0.0}, {"date": "2021-08-14", "usage": 0.0}, {"date": "2021-08-15", "usage": 1.0}, {"date": "2021-08-16", "usage": 0.0}, {"date": "2021-08-17", "usage": 0.0}, {"date": "2021-08-18", "usage": 0.0}, {"date": "2021-08-19", "usage": 1.0}, {"date": "2021-08-20", "usage": 0.0}, {"date": "2021-08-21", "usage": 0.0}, {"date": "2021-08-22", "usage": 0.0}, {"date": "2021-08-23", "usage": 1.0}, {"date": "2021-08-24", "usage": 0.0}, {"date": "2021-08-25", "usage": 0.0}, {"date": "2021-08-26", "usage": 0.0}, {"date": "2021-08-27", "usage": 1.0}, {"date": "2021-08-28", "usage": 0.0}, {"date": "2021-08-29", "usage": 0.0}, {"date": "2021-08-30", "usage": 1.0}, {"date": "2021-08-31", "usage": 0.0}, {"date": "2021-09-01", "usage": 0.0}, {"date": "2021-09-02", "usage": 0.0}, {"date": "2021-09-03", "usage": 1.0}, {"date": "2021-09-04", "usage": 0.0}, {"date": "2021-09-05", "usage": 1.0}, {"date": "2021-09-06", "usage": 0.0}, {"date": "2021-09-07", "usage": 0.0}, {"date": "2021-09-08", "usage": 1.0}, {"date": "2021-09-09", "usage": 0.0}, {"date": "2021-09-10", "usage": 0.0}, {"date": "2021-09-11", "usage": 1.0}, {"date": "2021-09-12", "usage": 0.0}, {"date": "2021-09-13", "usage": 0.0}, {"date": "2021-09-14", "usage": 0.0}, {"date": "2021-09-15", "usage": 1.0}, {"date": "2021-09-16", "usage": 0.0}, {"date": "2021-09-17", "usage": 0.0}, {"date": "2021-09-18", "usage": 0.0}, {"date": "2021-09-19", "usage": 1.0}, {"date": "2021-09-20", "usage": 0.0}, {"date": "2021-09-21", "usage": 0.0}, {"date": "2021-09-22", "usage": 0.0}, {"date": "2021-09-23", "usage": 0.0}, {"date": "2021-09-24", "usage": 1.0}, {"date": "2021-09-25", "usage": 0.0}, {"date": "2021-09-26", "usage": 0.0}, {"date": "2021-09-27", "usage": 1.0}, {"date": "2021-09-28", "usage": 0.0}, {"date": "2021-09-29", "usage": 0.0}, {"date": "2021-09-30", "usage": 0.0}, {"date": "2021-10-01", "usage": 1.0}, {"date": "2021-10-02", "usage": 0.0}, {"date": "2021-10-03", "usage": 0.0}, {"date": "2021-10-04", "usage": 1.0}, {"date": "2021-10-05", "usage": 0.0}, {"date": "2021-10-06", "usage": 0.0}, {"date": "2021-10-07", "usage": 0.0}, {"date": "2021-10-08", "usage": 0.0}, {"date": "2021-10-09", "usage": 1.0}, {"date": "2021-10-10", "usage": 0.0}, {"date": "2021-10-11", "usage": 0.0}, {"date": "2021-10-12", "usage": 0.0}, {"date": "2021-10-13", "usage": 1.0}, {"date": "2021-10-14", "usage": 0.0}, {"date": "2021-10-15", "usage": 0.0}, {"date": "2021-10-16", "usage": 1.0}, {"date": "2021-10-17", "usage": 0.0}, {"date": "2021-10-18", "usage": 0.0}, {"date": "2021-10-19", "usage": 1.0}, {"date": "2021-10-20", "usage": 0.0}, {"date": "2021-10-21", "usage": 0.0}, {"date": "2021-10-22", "usage": 0.0}, {"date": "2021-10-23", "usage": 1.0}, {"date": "2021-10-24", "usage": 2.0}, {"date": "2021-10-25", "usage": 1.0}, {"date": "2021-10-26", "usage": 0.0}, {"date": "2021-10-27", "usage": 1.0}, {"date": "2021-10-28", "usage": 0.0}, {"date": "2021-10-29", "usage": 1.0}, {"date": "2021-10-30", "usage": 1.0}, {"date": "2021-10-31", "usage": 0.0}, {"date": "2021-11-01", "usage": 0.0}, {"date": "2021-11-02", "usage": 3.0}, {"date": "2021-11-03", "usage": 4.0}, {"date": "2021-11-04", "usage": 3.0}, {"date": "2021-11-05", "usage": 3.0}, {"date": "2021-11-06", "usage": 4.0}, {"date": "2021-11-07", "usage": 3.0}, {"date": "2021-11-08", "usage": 2.0}, {"date": "2021-11-09", "usage": 1.0}, {"date": "2021-11-10", "usage": 1.0}, {"date": "2021-11-11", "usage": 1.0}, {"date": "2021-11-12", "usage": 0.0}, {"date": "2021-11-13", "usage": 4.0}, {"date": "2021-11-14", "usage": 5.0}, {"date": "2021-11-15", "usage": 4.0}, {"date": "2021-11-16", "usage": 4.0}, {"date": "2021-11-17", "usage": 4.0}, {"date": "2021-11-18", "usage": 2.0}, {"date": "2021-11-19", "usage": 4.0}, {"date": "2021-11-20", "usage": 5.0}, {"date": "2021-11-21", "usage": 4.0}, {"date": "2021-11-22", "usage": 4.0}, {"date": "2021-11-23", "usage": 7.0}, {"date": "2021-11-24", "usage": 6.0}, {"date": "2021-11-25", "usage": 5.0}, {"date": "2021-11-26", "usage": 5.0}, {"date": "2021-11-27", "usage": 6.0}, {"date": "2021-11-28", "usage": 4.0}, {"date": "2021-11-29", "usage": 6.0}, {"date": "2021-11-30", "usage": 5.0}, {"date": "2021-12-01", "usage": 5.0}, {"date": "2021-12-02", "usage": 2.0}, {"date": "2021-12-03", "usage": 4.0}, {"date": "2021-12-04", "usage": 4.0}, {"date": "2021-12-05", "usage": 4.0}, {"date": "2021-12-06", "usage": 3.0}, {"date": "2021-12-07", "usage": 5.0}, {"date": "2021-12-08", "usage": 6.0}, {"date": "2021-12-09", "usage": 6.0}, {"date": "2021-12-10", "usage": 5.0}, {"date": "2021-12-11", "usage": 2.0}, {"date": "2021-12-12", "usage": 5.0}, {"date": "2021-12-13", "usage": 5.0}, {"date": "2021-12-14", "usage": 3.0}, {"date": "2021-12-15", "usage": 4.0}, {"date": "2021-12-16", "usage": 2.0}, {"date": "2021-12-17", "usage": 2.0}, {"date": "2021-12-18", "usage": 4.0}, {"date": "2021-12-19", "usage": 5.0}, {"date": "2021-12-20", "usage": 7.0}, {"date": "2021-12-21", "usage": 6.0}, {"date": "2021-12-22", "usage": 5.0}, {"date": "2021-12-23", "usage": 6.0}, {"date": "2021-12-24", "usage": 5.0}, {"date": "2021-12-25", "usage": 4.0}, {"date": "2021-12-26", "usage": 3.0}, {"date": "2021-12-27", "usage": 5.0}, {"date": "2021-12-28", "usage": 5.0}, {"date": "2021-12-29", "usage": 3.0}, {"date": "2021-12-30", "usage": 3.0}, {"date": "2021-12-31", "usage": 3.0}, {"date": "2022-01-01", "usage": 2.0}, {"date": "2022-01-02", "usage": 2.0}, {"date": "2022-01-03", "usage": 7.0}, {"date": "2022-01-04", "usage": 7.0}, {"date": "2022-01-05", "usage": 6.0}, {"date": "2022-01-06", "usage": 6.0}, {"date": "2022-01-07", "usage": 7.0}, {"date": "2022-01-08", "usage": 8.0}, {"date": "2022-01-09", "usage": 7.0}, {"date": "2022-01-10", "usage": 7.0}, {"date": "2022-01-11", "usage": 9.0}, {"date": "2022-01-12", "usage": 8.0}, {"date": "2022-01-13", "usage": 5.0}, {"date": "2022-01-14", "usage": 6.0}, {"date": "2022-01-15", "usage": 10.0}, {"date": "2022-01-16", "usage": 10.0}, {"date": "2022-01-17", "usage": 7.0}, {"date": "2022-01-18", "usage": 7.0}, {"date": "2022-01-19", "usage": 6.0}, {"date": "2022-01-20", "usage": 6.0}, {"date": "2022-01-21", "usage": 9.0}, {"date": "2022-01-22", "usage": 9.0}, {"date": "2022-01-23", "usage": 8.0}, {"date": "2022-01-24", "usage": 6.0}, {"date": "2022-01-25", "usage": 7.0}, {"date": "2022-01-26", "usage": 8.0}, {"date": "2022-01-27", "usage": 8.0}, {"date": "2022-01-28", "usage": 7.0}, {"date": "2022-01-29", "usage": 10.0}, {"date": "2022-01-30", "usage": 9.0}, {"date": "2022-01-31", "usage": 8.0}, {"date": "2022-02-01", "usage": 8.0}, {"date": "2022-02-02", "usage": 5.0}, {"date": "2022-02-03", "usage": 5.0}, {"date": "2022-02-04", "usage": 4.0}, {"date": "2022-02-05", "usage": 8.0}, {"date": "2022-02-06", "usage": 8.0}, {"date": "2022-02-07", "usage": 6.0}, {"date": "2022-02-08", "usage": 6.0}, {"date": "2022-02-09", "usage": 5.0}, {"date": "2022-02-10", "usage": 5.0}, {"date": "2022-02-11", "usage": 4.0}, {"date": "2022-02-12", "usage": 3.0}, {"date": "2022-02-13", "usage": 7.0}, {"date": "2022-02-14", "usage": 8.0}, {"date": "2022-02-15", "usage": 10.0}, {"date": "2022-02-16", "usage": 6.0}, {"date": "2022-02-17", "usage": 2.0}, {"date": "2022-02-18", "usage": 3.0}, {"date": "2022-02-19", "usage": 7.0}, {"date": "2022-02-20", "usage": 6.0}, {"date": "2022-02-21", "usage": 4.0}, {"date": "2022-02-22", "usage": 3.0}, {"date": "2022-02-23", "usage": 2.0}, {"date": "2022-02-24", "usage": 5.0}, {"date": "2022-02-25", "usage": 5.0}, {"date": "2022-02-26", "usage": 7.0}, {"date": "2022-02-27", "usage": 5.0}, {"date": "2022-02-28", "usage": 5.0}, {"date": "2022-03-01", "usage": 5.0}, {"date": "2022-03-02", "usage": 3.0}, {"date": "2022-03-03", "usage": 4.0}, {"date": "2022-03-04", "usage": 5.0}, {"date": "2022-03-05", "usage": 5.0}, {"date": "2022-03-06", "usage": 2.0}, {"date": "2022-03-07", "usage": 1.0}, {"date": "2022-03-08", "usage": 3.0}, {"date": "2022-03-09", "usage": 5.0}, {"date": "2022-03-10", "usage": 5.0}, {"date": "2022-03-11", "usage": 3.0}, {"date": "2022-03-12", "usage": 6.0}, {"date": "2022-03-13", "usage": 7.0}, {"date": "2022-03-14", "usage": 4.0}, {"date": "2022-03-15", "usage": 2.0}, {"date": "2022-03-16", "usage": 2.0}, {"date": "2022-03-17", "usage": 2.0}, {"date": "2022-03-18", "usage": 0.0}, {"date": "2022-03-19", "usage": 1.0}, {"date": "2022-03-20", "usage": 1.0}, {"date": "2022-03-21", "usage": 3.0}, {"date": "2022-03-22", "usage": 3.0}, {"date": "2022-03-23", "usage": 4.0}, {"date": "2022-03-24", "usage": 3.0}, {"date": "2022-03-25", "usage": 2.0}, {"date": "2022-03-26", "usage": 3.0}, {"date": "2022-03-27", "usage": 5.0}, {"date": "2022-03-28", "usage": 7.0}, {"date": "2022-03-29", "usage": 7.0}, {"date": "2022-03-30", "usage": 5.0}, {"date": "2022-03-31", "usage": 1.0}, {"date": "2022-04-01", "usage": 3.0}, {"date": "2022-04-02", "usage": 3.0}, {"date": "2022-04-03", "usage": 4.0}, {"date": "2022-04-04", "usage": 3.0}, {"date": "2022-04-05", "usage": 3.0}, {"date": "2022-04-06", "usage": 2.0}, {"date": "2022-04-07", "usage": 3.0}, {"date": "2022-04-08", "usage": 2.0}, {"date": "2022-04-09", "usage": 2.0}, {"date": "2022-04-10", "usage": 4.0}, {"date": "2022-04-11", "usage": 2.0}, {"date": "2022-04-12", "usage": 2.0}, {"date": "2022-04-13", "usage": 1.0}, {"date": "2022-04-14", "usage": 0.0}, {"date": "2022-04-15", "usage": 1.0}, {"date": "2022-04-16", "usage": 1.0}, {"date": "2022-04-17", "usage": 1.0}, {"date": "2022-04-18", "usage": 5.0}, {"date": "2022-04-19", "usage": 3.0}, {"date": "2022-04-20", "usage": 3.0}, {"date": "2022-04-21", "usage": 1.0}, {"date": "2022-04-22", "usage": 1.0}, {"date": "2022-04-23", "usage": 1.0}, {"date": "2022-04-24", "usage": 0.0}, {"date": "2022-04-25", "usage": 1.0}, {"date": "2022-04-26", "usage": 2.0}, {"date": "2022-04-27", "usage": 1.0}, {"date": "2022-04-28", "usage": 2.0}, {"date": "2022-04-29", "usage": 2.0}, {"date": "2022-04-30", "usage": 2.0}]

const electricUsage = [{"date": "2021-04-30", "usage": -41.190000000000005}, {"date": "2021-05-01", "usage": -76.30999999999999}, {"date": "2021-05-02", "usage": -50.850000000000016}, {"date": "2021-05-03", "usage": -0.2900000000000005}, {"date": "2021-05-04", "usage": -34.040000000000006}, {"date": "2021-05-05", "usage": 1.399999999999999}, {"date": "2021-05-06", "usage": -55.98}, {"date": "2021-05-07", "usage": -43.11000000000001}, {"date": "2021-05-08", "usage": -21.91}, {"date": "2021-05-09", "usage": -2.5299999999999976}, {"date": "2021-05-10", "usage": -8.040000000000006}, {"date": "2021-05-11", "usage": -56.20000000000001}, {"date": "2021-05-12", "usage": -41.39999999999999}, {"date": "2021-05-13", "usage": -63.68}, {"date": "2021-05-14", "usage": -57.929999999999986}, {"date": "2021-05-15", "usage": -60.999999999999986}, {"date": "2021-05-16", "usage": -36.49}, {"date": "2021-05-17", "usage": -62.86999999999998}, {"date": "2021-05-18", "usage": -72.1}, {"date": "2021-05-19", "usage": -66.12}, {"date": "2021-05-20", "usage": -62.62000000000001}, {"date": "2021-05-21", "usage": -52.910000000000004}, {"date": "2021-05-22", "usage": -27.959999999999994}, {"date": "2021-05-23", "usage": -32.05}, {"date": "2021-05-24", "usage": 8.879999999999999}, {"date": "2021-05-25", "usage": -31.119999999999997}, {"date": "2021-05-26", "usage": -6.409999999999993}, {"date": "2021-05-27", "usage": -42.410000000000004}, {"date": "2021-05-28", "usage": -5.070000000000001}, {"date": "2021-05-29", "usage": 1.7300000000000004}, {"date": "2021-05-30", "usage": 1.4200000000000013}, {"date": "2021-05-31", "usage": -25.490000000000002}, {"date": "2021-06-01", "usage": -35.120000000000005}, {"date": "2021-06-02", "usage": -10.009999999999998}, {"date": "2021-06-03", "usage": -0.9599999999999984}, {"date": "2021-06-04", "usage": -2.3499999999999983}, {"date": "2021-06-05", "usage": -28.890000000000008}, {"date": "2021-06-06", "usage": -11.560000000000013}, {"date": "2021-06-07", "usage": 8.0}, {"date": "2021-06-08", "usage": 4.57}, {"date": "2021-06-09", "usage": -6.170000000000003}, {"date": "2021-06-10", "usage": -42.28}, {"date": "2021-06-11", "usage": 18.23}, {"date": "2021-06-12", "usage": -25.910000000000007}, {"date": "2021-06-13", "usage": -14.030000000000001}, {"date": "2021-06-14", "usage": -22.49}, {"date": "2021-06-15", "usage": -45.84}, {"date": "2021-06-16", "usage": -60.620000000000005}, {"date": "2021-06-17", "usage": -55.910000000000004}, {"date": "2021-06-18", "usage": -57.519999999999996}, {"date": "2021-06-19", "usage": 11.360000000000001}, {"date": "2021-06-20", "usage": -24.020000000000007}, {"date": "2021-06-21", "usage": 9.87}, {"date": "2021-06-22", "usage": 10.33}, {"date": "2021-06-23", "usage": -56.180000000000014}, {"date": "2021-06-24", "usage": -53.660000000000004}, {"date": "2021-06-25", "usage": -50.709999999999994}, {"date": "2021-06-26", "usage": 2.4599999999999995}, {"date": "2021-06-27", "usage": 8.61}, {"date": "2021-06-28", "usage": 1.4699999999999958}, {"date": "2021-06-29", "usage": 11.850000000000001}, {"date": "2021-06-30", "usage": 16.430000000000003}, {"date": "2021-07-01", "usage": 22.409999999999997}, {"date": "2021-07-02", "usage": 11.84}, {"date": "2021-07-03", "usage": 17.150000000000002}, {"date": "2021-07-04", "usage": -21.48}, {"date": "2021-07-05", "usage": 7.870000000000003}, {"date": "2021-07-06", "usage": 47.769999999999996}, {"date": "2021-07-07", "usage": 61.25}, {"date": "2021-07-08", "usage": 57.09000000000001}, {"date": "2021-07-09", "usage": 29.36}, {"date": "2021-07-10", "usage": 42.010000000000005}, {"date": "2021-07-11", "usage": 56.85000000000001}, {"date": "2021-07-12", "usage": 61.83}, {"date": "2021-07-13", "usage": 56.86}, {"date": "2021-07-14", "usage": 10.55}, {"date": "2021-07-15", "usage": 18.65}, {"date": "2021-07-16", "usage": 25.03}, {"date": "2021-07-17", "usage": 25.89}, {"date": "2021-07-18", "usage": 37.92}, {"date": "2021-07-19", "usage": 22.0}, {"date": "2021-07-20", "usage": 14.069999999999999}, {"date": "2021-07-21", "usage": 2.890000000000002}, {"date": "2021-07-22", "usage": -31.090000000000007}, {"date": "2021-07-23", "usage": -31.93}, {"date": "2021-07-24", "usage": -28.590000000000003}, {"date": "2021-07-25", "usage": 23.749999999999996}, {"date": "2021-07-26", "usage": 19.06}, {"date": "2021-07-27", "usage": 11.069999999999995}, {"date": "2021-07-28", "usage": -11.650000000000002}, {"date": "2021-07-29", "usage": 31.709999999999997}, {"date": "2021-07-30", "usage": -1.1299999999999972}, {"date": "2021-07-31", "usage": -40.61}, {"date": "2021-08-01", "usage": 20.369999999999997}, {"date": "2021-08-02", "usage": -38.98}, {"date": "2021-08-03", "usage": -10.86}, {"date": "2021-08-04", "usage": -20.17}, {"date": "2021-08-05", "usage": -13.430000000000005}, {"date": "2021-08-06", "usage": -19.53000000000001}, {"date": "2021-08-07", "usage": 0.2899999999999969}, {"date": "2021-08-08", "usage": 9.89}, {"date": "2021-08-09", "usage": 25.930000000000003}, {"date": "2021-08-10", "usage": 39.07}, {"date": "2021-08-11", "usage": 24.95}, {"date": "2021-08-12", "usage": 13.599999999999998}, {"date": "2021-08-13", "usage": 7.239999999999995}, {"date": "2021-08-14", "usage": 16.290000000000003}, {"date": "2021-08-15", "usage": 8.009999999999998}, {"date": "2021-08-16", "usage": 12.940000000000003}, {"date": "2021-08-17", "usage": 40.62}, {"date": "2021-08-18", "usage": 41.1}, {"date": "2021-08-19", "usage": 12.46}, {"date": "2021-08-20", "usage": 46.97000000000001}, {"date": "2021-08-21", "usage": 3.4900000000000024}, {"date": "2021-08-22", "usage": 7.469999999999999}, {"date": "2021-08-23", "usage": 10.600000000000003}, {"date": "2021-08-24", "usage": -5.550000000000001}, {"date": "2021-08-25", "usage": -11.279999999999996}, {"date": "2021-08-26", "usage": -3.510000000000006}, {"date": "2021-08-27", "usage": 0.13000000000000078}, {"date": "2021-08-28", "usage": 29.749999999999996}, {"date": "2021-08-29", "usage": -1.2099999999999986}, {"date": "2021-08-30", "usage": 10.170000000000002}, {"date": "2021-08-31", "usage": 15.39}, {"date": "2021-09-01", "usage": 23.42}, {"date": "2021-09-02", "usage": -52.59999999999999}, {"date": "2021-09-03", "usage": -44.67}, {"date": "2021-09-04", "usage": -25.519999999999992}, {"date": "2021-09-05", "usage": 17.81}, {"date": "2021-09-06", "usage": -35.29}, {"date": "2021-09-07", "usage": -37.57}, {"date": "2021-09-08", "usage": -3.7500000000000036}, {"date": "2021-09-09", "usage": 29.14}, {"date": "2021-09-10", "usage": -20.630000000000003}, {"date": "2021-09-11", "usage": -35.629999999999995}, {"date": "2021-09-12", "usage": -37.19}, {"date": "2021-09-13", "usage": 1.6200000000000019}, {"date": "2021-09-14", "usage": 15.399999999999999}, {"date": "2021-09-15", "usage": 14.05}, {"date": "2021-09-16", "usage": -3.4000000000000012}, {"date": "2021-09-17", "usage": 28.03}, {"date": "2021-09-18", "usage": -11.07}, {"date": "2021-09-19", "usage": -30.459999999999994}, {"date": "2021-09-20", "usage": -29.06000000000001}, {"date": "2021-09-21", "usage": 3.1500000000000004}, {"date": "2021-09-22", "usage": 20.06}, {"date": "2021-09-23", "usage": 38.72000000000001}, {"date": "2021-09-24", "usage": -38.87}, {"date": "2021-09-25", "usage": -35.199999999999996}, {"date": "2021-09-26", "usage": -48.53000000000001}, {"date": "2021-09-27", "usage": -40.6}, {"date": "2021-09-28", "usage": 34.32}, {"date": "2021-09-29", "usage": -35.54}, {"date": "2021-09-30", "usage": -19.640000000000008}, {"date": "2021-10-01", "usage": -38.69}, {"date": "2021-10-02", "usage": -36.64}, {"date": "2021-10-03", "usage": -22.059999999999995}, {"date": "2021-10-04", "usage": 0.08000000000000407}, {"date": "2021-10-05", "usage": 37.73}, {"date": "2021-10-06", "usage": 10.989999999999998}, {"date": "2021-10-07", "usage": -8.58}, {"date": "2021-10-08", "usage": -15.969999999999997}, {"date": "2021-10-09", "usage": 2.6300000000000017}, {"date": "2021-10-10", "usage": 27.050000000000004}, {"date": "2021-10-11", "usage": 13.280000000000001}, {"date": "2021-10-12", "usage": 14.2}, {"date": "2021-10-13", "usage": 7.35}, {"date": "2021-10-14", "usage": -13.279999999999998}, {"date": "2021-10-15", "usage": -3.3699999999999948}, {"date": "2021-10-16", "usage": 1.450000000000002}, {"date": "2021-10-17", "usage": -21.450000000000003}, {"date": "2021-10-18", "usage": -23.550000000000004}, {"date": "2021-10-19", "usage": -49.54}, {"date": "2021-10-20", "usage": -44.949999999999996}, {"date": "2021-10-21", "usage": -42.27}, {"date": "2021-10-22", "usage": -4.0600000000000005}, {"date": "2021-10-23", "usage": 0.270000000000002}, {"date": "2021-10-24", "usage": 2.6200000000000006}, {"date": "2021-10-25", "usage": 5.339999999999994}, {"date": "2021-10-26", "usage": 33.57}, {"date": "2021-10-27", "usage": -8.420000000000002}, {"date": "2021-10-28", "usage": -24.559999999999995}, {"date": "2021-10-29", "usage": 40.559999999999995}, {"date": "2021-10-30", "usage": -4.169999999999999}, {"date": "2021-10-31", "usage": 2.25}, {"date": "2021-11-01", "usage": -28.25}, {"date": "2021-11-02", "usage": 55.699999999999996}, {"date": "2021-11-03", "usage": -1.4399999999999973}, {"date": "2021-11-04", "usage": 17.690000000000005}, {"date": "2021-11-05", "usage": 2.080000000000004}, {"date": "2021-11-06", "usage": 1.6599999999999984}, {"date": "2021-11-07", "usage": 14.220000000000002}, {"date": "2021-11-08", "usage": -7.73999999999999}, {"date": "2021-11-09", "usage": 1.1899999999999973}, {"date": "2021-11-10", "usage": -19.940000000000005}, {"date": "2021-11-11", "usage": 0.47999999999999643}, {"date": "2021-11-12", "usage": 7.190000000000002}, {"date": "2021-11-13", "usage": 21.37}, {"date": "2021-11-14", "usage": 32.13}, {"date": "2021-11-15", "usage": 24.519999999999996}, {"date": "2021-11-16", "usage": 1.2200000000000006}, {"date": "2021-11-17", "usage": 30.98}, {"date": "2021-11-18", "usage": -6.750000000000001}, {"date": "2021-11-19", "usage": -5.8299999999999965}, {"date": "2021-11-20", "usage": 8.67}, {"date": "2021-11-21", "usage": 20.430000000000003}, {"date": "2021-11-22", "usage": 27.159999999999997}, {"date": "2021-11-23", "usage": 2.4200000000000035}, {"date": "2021-11-24", "usage": 2.2400000000000024}, {"date": "2021-11-25", "usage": 23.650000000000002}, {"date": "2021-11-26", "usage": 27.44}, {"date": "2021-11-27", "usage": 27.34}, {"date": "2021-11-28", "usage": 27.870000000000005}, {"date": "2021-11-29", "usage": 16.200000000000003}, {"date": "2021-11-30", "usage": 72.8}, {"date": "2021-12-01", "usage": 1.490000000000001}, {"date": "2021-12-02", "usage": 28.709999999999994}, {"date": "2021-12-03", "usage": -5.010000000000004}, {"date": "2021-12-04", "usage": 28.51}, {"date": "2021-12-05", "usage": 11.769999999999998}, {"date": "2021-12-06", "usage": 33.70000000000001}, {"date": "2021-12-07", "usage": 37.2}, {"date": "2021-12-08", "usage": 50.89}, {"date": "2021-12-09", "usage": 29.400000000000006}, {"date": "2021-12-10", "usage": 34.279999999999994}, {"date": "2021-12-11", "usage": 33.72}, {"date": "2021-12-12", "usage": -5.380000000000001}, {"date": "2021-12-13", "usage": 7.319999999999997}, {"date": "2021-12-14", "usage": 1.4099999999999957}, {"date": "2021-12-15", "usage": 21.08}, {"date": "2021-12-16", "usage": -5.94}, {"date": "2021-12-17", "usage": 11.229999999999999}, {"date": "2021-12-18", "usage": 42.64}, {"date": "2021-12-19", "usage": 23.19}, {"date": "2021-12-20", "usage": 22.57}, {"date": "2021-12-21", "usage": 51.30999999999999}, {"date": "2021-12-22", "usage": 10.810000000000002}, {"date": "2021-12-23", "usage": 18.61}, {"date": "2021-12-24", "usage": 16.000000000000004}, {"date": "2021-12-25", "usage": 33.18}, {"date": "2021-12-26", "usage": -7.450000000000006}, {"date": "2021-12-27", "usage": 49.55}, {"date": "2021-12-28", "usage": 45.07}, {"date": "2021-12-29", "usage": 23.07}, {"date": "2021-12-30", "usage": 33.38}, {"date": "2021-12-31", "usage": 38.300000000000004}, {"date": "2022-01-01", "usage": 36.63999999999999}, {"date": "2022-01-02", "usage": 33.61}, {"date": "2022-01-03", "usage": 64.2}, {"date": "2022-01-04", "usage": 32.830000000000005}, {"date": "2022-01-05", "usage": 55.78}, {"date": "2022-01-06", "usage": 42.260000000000005}, {"date": "2022-01-07", "usage": 90.48}, {"date": "2022-01-08", "usage": 106.07999999999998}, {"date": "2022-01-09", "usage": 95.63999999999999}, {"date": "2022-01-10", "usage": 19.33}, {"date": "2022-01-11", "usage": 40.04}, {"date": "2022-01-12", "usage": 24.29}, {"date": "2022-01-13", "usage": 18.97000000000001}, {"date": "2022-01-14", "usage": 4.58}, {"date": "2022-01-15", "usage": 30.46}, {"date": "2022-01-16", "usage": 54.260000000000005}, {"date": "2022-01-17", "usage": 64.16999999999999}, {"date": "2022-01-18", "usage": 30.309999999999995}, {"date": "2022-01-19", "usage": 18.620000000000005}, {"date": "2022-01-20", "usage": 43.97999999999999}, {"date": "2022-01-21", "usage": 29.75}, {"date": "2022-01-22", "usage": 4.5600000000000005}, {"date": "2022-01-23", "usage": 20.520000000000003}, {"date": "2022-01-24", "usage": -0.1099999999999981}, {"date": "2022-01-25", "usage": 45.46999999999999}, {"date": "2022-01-26", "usage": 12.080000000000005}, {"date": "2022-01-27", "usage": 12.520000000000007}, {"date": "2022-01-28", "usage": 60.46999999999999}, {"date": "2022-01-29", "usage": 113.15}, {"date": "2022-01-30", "usage": 117.82}, {"date": "2022-01-31", "usage": 112.35999999999999}, {"date": "2022-02-01", "usage": 112.03000000000002}, {"date": "2022-02-02", "usage": 93.66000000000001}, {"date": "2022-02-03", "usage": 70.77}, {"date": "2022-02-04", "usage": 39.39}, {"date": "2022-02-05", "usage": 44.300000000000004}, {"date": "2022-02-06", "usage": 4.130000000000003}, {"date": "2022-02-07", "usage": 51.05999999999998}, {"date": "2022-02-08", "usage": 9.999999999999998}, {"date": "2022-02-09", "usage": -13.780000000000003}, {"date": "2022-02-10", "usage": -6.729999999999996}, {"date": "2022-02-11", "usage": -32.03}, {"date": "2022-02-12", "usage": -11.480000000000008}, {"date": "2022-02-13", "usage": 63.050000000000004}, {"date": "2022-02-14", "usage": 89.40999999999998}, {"date": "2022-02-15", "usage": 77.08999999999999}, {"date": "2022-02-16", "usage": 59.6}, {"date": "2022-02-17", "usage": 30.4}, {"date": "2022-02-18", "usage": -12.670000000000003}, {"date": "2022-02-19", "usage": 31.17}, {"date": "2022-02-20", "usage": -11.7}, {"date": "2022-02-21", "usage": -14.93}, {"date": "2022-02-22", "usage": 38.019999999999996}, {"date": "2022-02-23", "usage": 12.24}, {"date": "2022-02-24", "usage": 70.38999999999999}, {"date": "2022-02-25", "usage": 38.79999999999999}, {"date": "2022-02-26", "usage": 3.950000000000001}, {"date": "2022-02-27", "usage": -30.330000000000002}, {"date": "2022-02-28", "usage": -37.62}, {"date": "2022-03-01", "usage": 37.71}, {"date": "2022-03-02", "usage": -27.820000000000007}, {"date": "2022-03-03", "usage": -35.510000000000005}, {"date": "2022-03-04", "usage": -38.120000000000005}, {"date": "2022-03-05", "usage": -4.22}, {"date": "2022-03-06", "usage": 17.120000000000005}, {"date": "2022-03-07", "usage": -11.479999999999997}, {"date": "2022-03-08", "usage": -20.009999999999998}, {"date": "2022-03-09", "usage": 17.57}, {"date": "2022-03-10", "usage": -39.05}, {"date": "2022-03-11", "usage": -42.720000000000006}, {"date": "2022-03-12", "usage": 53.000000000000014}, {"date": "2022-03-13", "usage": 59.11}, {"date": "2022-03-14", "usage": -12.180000000000005}, {"date": "2022-03-15", "usage": 3.649999999999994}, {"date": "2022-03-16", "usage": -27.189999999999998}, {"date": "2022-03-17", "usage": 21.08}, {"date": "2022-03-18", "usage": -52.889999999999986}, {"date": "2022-03-19", "usage": -45.97000000000001}, {"date": "2022-03-20", "usage": 2.3900000000000006}, {"date": "2022-03-21", "usage": -36.17000000000001}, {"date": "2022-03-22", "usage": -30.67999999999999}, {"date": "2022-03-23", "usage": -8.189999999999996}, {"date": "2022-03-24", "usage": 61.87}, {"date": "2022-03-25", "usage": -25.189999999999994}, {"date": "2022-03-26", "usage": -10.97}, {"date": "2022-03-27", "usage": 20.47}, {"date": "2022-03-28", "usage": 14.020000000000003}, {"date": "2022-03-29", "usage": -28.140000000000008}, {"date": "2022-03-30", "usage": 48.919999999999995}, {"date": "2022-03-31", "usage": 22.45}, {"date": "2022-04-01", "usage": -13.950000000000006}, {"date": "2022-04-02", "usage": -48.339999999999996}, {"date": "2022-04-03", "usage": 11.64}, {"date": "2022-04-04", "usage": -26.430000000000003}, {"date": "2022-04-05", "usage": 14.41}, {"date": "2022-04-06", "usage": 29.240000000000006}, {"date": "2022-04-07", "usage": 28.629999999999995}, {"date": "2022-04-08", "usage": -65.98999999999998}, {"date": "2022-04-09", "usage": -21.92}, {"date": "2022-04-10", "usage": -17.97}, {"date": "2022-04-11", "usage": -45.32}, {"date": "2022-04-12", "usage": -38.050000000000004}, {"date": "2022-04-13", "usage": -49.220000000000006}, {"date": "2022-04-14", "usage": -56.149999999999984}, {"date": "2022-04-15", "usage": -71.42999999999998}, {"date": "2022-04-16", "usage": -35.4}, {"date": "2022-04-17", "usage": -41.82999999999999}, {"date": "2022-04-18", "usage": 9.370000000000001}, {"date": "2022-04-19", "usage": -5.679999999999996}, {"date": "2022-04-20", "usage": -59.839999999999996}, {"date": "2022-04-21", "usage": -28.499999999999996}, {"date": "2022-04-22", "usage": -50.779999999999994}, {"date": "2022-04-23", "usage": -17.2}, {"date": "2022-04-24", "usage": -61.03999999999999}, {"date": "2022-04-25", "usage": -12.660000000000004}, {"date": "2022-04-26", "usage": -3.8399999999999976}, {"date": "2022-04-27", "usage": -45.42}, {"date": "2022-04-28", "usage": -63.72999999999999}, {"date": "2022-04-29", "usage": -65.50999999999999}, {"date": "2022-04-30", "usage": -71.18}]


// because the increment of measurement is so large, assume some usage happend the previous day.
function smoothUsage(data) {
    const ret = [];
    const len = data.length;
    const lim = len - 1;
    for (let i = 0; i < len; i++) {
        const { date, usage } = data[i];
        if (i === 0 || usage < 1) {
            ret.push({ date, usage });
        } else {
            ret.push({
                date,
                usage: usage - 0.5 
            });
            ret[i-1].usage += 0.5
        }
    }
    return ret;
}

const joinedData = [];
if (gasUsage.length !== electricUsage.length) {
    console.error('Unable to merge data of different lengths')
} else {
    const gasConsumption = smoothUsage(gasUsage);
    const length = gasConsumption.length;
    for (let i = 0; i < length; i++) {
        if (gasConsumption[i].date !== electricUsage[i].date) {
            console.error('Refusing to process mismatched dates')
        } else {
            joinedData.push({
                ccf: gasConsumption[i].usage,
                kwh: electricUsage[i].usage,
                date: new Date(gasConsumption[i].date)
            });
        }
    }
    window.joinedData = joinedData;
}
} // end scope
