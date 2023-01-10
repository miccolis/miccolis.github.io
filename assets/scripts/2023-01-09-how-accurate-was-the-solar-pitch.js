'use strict';


const startDate = new Date('2021-12-20')
const endDate = new Date('2022-12-20')

const projection = [
    [436, 368],
    [533, 465],
    [563, 733],
    [413, 956],
    [304, 936],
    [456, 1073],
    [681, 1054],
    [687, 969],
    [762, 764],
    [345, 675],
    [373, 380],
    [283, 339]
].map(([ usage, production ], idx) => ({
    date: new Date(`2022-${idx + 1}-01`),
    usage,
    production
}))

// Dates don't match, pepco is mid month numberes, enphase month proper
const actual= [
    [211, 394],
    [-33, 644],
    [-387, 768],
    [-488, 949],
    [-610, 935],
    [-468, 1100],
    [-576, 985],
    [-140, 1000],
    [-275, 793],
    [-300, 640],
    [-281, 560],
    [-13, 420]
].map(([ usage, production ], idx) => ({
    date: new Date(`2022-${idx + 1}-01`),
    usage: production + usage,
    production
}))

function buildGenerationGraph() {

    const height = 280;
    const width = 700;

    const topGutter = 10;
    const bottomGutter = 20;
    const leftGutter = 40;
    const rightGutter = 20;

    const svg = d3.select("#solar-generation")
        .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "none")

    const y = d3.scaleLinear()
        .domain([0, 1200])
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
        .call(xAxis.tickFormat(d3.timeFormat("%B")));

    const graph = svg.append("g")
        .attr("transform", `translate(${leftGutter},${topGutter})`);

    graph.append("path")
        .datum(projection)
        .attr("fill", "none")
        .attr("stroke", "tomato")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x((d) => x(d.date))
            .y((d) => y(d.production))
        );

    graph.append("g")
        .selectAll('rect')
        .data(projection)
            .enter()
            .append('rect')
                .attr("height", d => y(1200 - d.usage))
                .attr("width", 10)
                .attr('x', ((d) => x(d.date) - 10))
                .attr('y', ((d) => y(d.usage)))
                .attr("fill", 'steelblue')
                .attr("stroke", 'dimgrey')
                .attr("stroke-width", 1.5);

    graph.append("path")
        .datum(actual)
        .attr("fill", "none")
        .attr("stroke", "darkorange")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x((d) => x(d.date))
            .y((d) => y(d.production))
        );

    graph.append("g")
        .selectAll('rect')
        .data(actual)
            .enter()
            .append('rect')
                .attr("height", d => y(1200 - d.usage))
                .attr("width", 10)
                .attr('x', ((d) => x(d.date)))
                .attr('y', ((d) => y(d.usage)))
                .attr("fill", 'darkseagreen')
                .attr("stroke", 'dimgrey')
                .attr("stroke-width", 1.5);

    {
        const legendItem = graph.append("g")
            .selectAll("g")
            .data([
                { label: '2021 Usage', color: 'steelblue'},
                { label: '2022 Usage', color: 'darkseagreen'}
            ])
            .enter()
                .append('g')
                .attr('transform', (d, i) => `translate(550, ${22 * i})`)

        legendItem.append('rect')
            .attr("height", 10)
            .attr("width", 10)
            .attr("fill", d => d.color)
            .attr("stroke", 'dimgrey')
            .attr("stroke-width", 1.5);

        legendItem.append('text')
            .attr("font-size", 10)
            .attr('transform', `translate(15, 8.5)`)
            .text(d => d.label);
    }

    {
        const legendItem = graph.append("g")
            .selectAll("g")
            .data([
                { label: 'Projected Generation', color: 'tomato'},
                { label: 'Actual Generation', color: 'darkorange'},
            ])
            .enter()
                .append('g')
                .attr('transform', (d, i) => `translate(5, ${22 * i})`)

        legendItem.append('rect')
            .attr("height", 10)
            .attr("width", 10)
            .attr("fill", d => d.color)
            .attr("stroke", 'dimgrey')
            .attr("stroke-width", 1.5);

        legendItem.append('text')
            .attr("font-size", 10)
            .attr('transform', `translate(15, 8.5)`)
            .text(d => d.label);
    }
        

}

const srecSales = [
    ['2022-03', 281.32],
    ['2022-04', 281.32],
    ['2022-05', 281.32],
    ['2022-06', 281.32],
    ['2022-07', 320.85],
    ['2022-08', 354.33],
    ['2022-09', 344.10],
    ['2022-10', 344.10]
].map(([ month, net]) => ({
    date: new Date(`${month}-01`),
    net
}))

function buildSRECGraph() {

    const height = 140;
    const width = 700;

    const topGutter = 10;
    const bottomGutter = 20;
    const leftGutter = 40;
    const rightGutter = 20;

    const saleMax = 420;

    const svg = d3.select("#srec-income")
        .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "none")

    const y = d3.scaleLinear()
        .domain([0, saleMax])
        .range([height - topGutter - bottomGutter, 0]);

    const yAxis = d3.axisLeft(y).ticks(5);

    svg.append("g")
        .attr("transform", `translate(${leftGutter},${topGutter})`)
        .call(yAxis.tickFormat(d3.format("($.0f")));

    const extent = [ startDate, endDate ];
    const x = d3.scaleTime()
        .domain(extent)
        .range([0, width - leftGutter - rightGutter]);

    const xAxis = d3.axisBottom(x)

    svg.append("g")
        .attr("transform", `translate(${leftGutter},${height - bottomGutter })`)
        .call(xAxis.tickFormat(d3.timeFormat("%B")));

    const graph = svg.append("g")
        .attr("transform", `translate(${leftGutter},${topGutter})`);

    graph.append("path")
        .datum([
            new Date('2022-01-01'),
            new Date('2022-12-01')
        ])
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x((d) => x(d))
            .y((d) => y(390))
        );

    graph.append("g")
        .selectAll('rect')
        .data(srecSales)
            .enter()
            .append('rect')
                .attr("height", d => y(saleMax- d.net))
                .attr("width", 10)
                .attr('x', ((d) => x(d.date) - 5))
                .attr('y', ((d) => y(d.net)))
                .attr("fill", 'steelblue')
                .attr("stroke", 'dimgrey')
                .attr("stroke-width", 1.5);

}


window.addEventListener('DOMContentLoaded', (event) => {
    buildGenerationGraph();
    buildSRECGraph();
});
