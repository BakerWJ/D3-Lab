'use strict';

// IIFE
(function () {
    let data = [];

    d3.json("/load-data", (d) => {
        return d;
    }).then((d) => {
        data = d['users'];
        createVisDonut(data);
    }).catch((err) => {
        console.error(err)
    });
})();

function createVisDonut(data) {
    var lang = d3.nest()
        .key((d) => {return d["prog_lang"];})
        .rollup((v) => {return v.length;})
        .entries(data);

    var names = {"cpp":"C++", "py": "Python", "php": "PHP", "js":"Javascript", "other": "Other", "java":"Java"};

    var width = 300,
        height = 300,
        radius = 150;

    var color = d3.scaleOrdinal()
        .range(["#003f5c", "#444e86", "#955196", "#dd5182", "#ff6e54", "#ffa600"]);

    var arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(98);

    var hoverArc = d3.arc()
        .outerRadius(radius-10)
        .innerRadius(90);

    var pie = d3.pie()
        .sort(null)
        .value((d) => {return d.value;});

    var svg = d3.select("#donutChart")
        .append("svg")
        .attr('class', 'pie')
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var g = svg.selectAll('.arc')
        .data(pie(lang))
        .enter().append("g")
        .attr('class','arc')
        .attr("id", (d) => {
            return d.data.key;
        });

    g.append("path")
        .attr("d", arc)
        .on('mouseover', function (d) {
            g.selectAll("path")
                .attr('d', arc);
            g.selectAll("text").remove();
            d3.select(this)
                .attr('d', hoverArc);
            g.append("text")
                .attr("class", "name-text")
                .attr("text-anchor", "middle")
                .text(`${names[d.data.key]}`)
                .attr('dy','-1.2em');
            g.append("text")
                .attr("class", "value-text")
                .text(`${d.data.value}`)
                .attr('text-anchor', 'middle')
                .attr('dy', '.6em')
        })
        .on("click", (d) => {
            var svg1 = d3.select("#barChart");
            svg1.selectAll("*").remove();
            var svg2 = d3.select("#scatter");
            svg2.selectAll("*").remove();
            createVisBar(data.filter(x => x["prog_lang"] == d.data.key));
            createVisScatter(data.filter(x => x["prog_lang"] == d.data.key));
        })
        .style("fill", (d) => {return color(d.data.key)});
}