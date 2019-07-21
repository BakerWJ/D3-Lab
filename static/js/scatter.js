'use strict';

(function() {
    let data = [];
    d3.json("/load-data", (d) => {
        return d;
    }).then((d) => {
        data = d['users'];
        createVis();
    }).catch((err) => {
        console.error(err)
    });

    function createVis() {
        var nests = d3.nest()
            .key((d) => {return d["hw1_hrs"];})
            .key((d) => {return d["experience_yr"];})
            .rollup((v) => {return v.length;})
            .entries(data);

        var margin = 20,
            width =400,
            height = 300;

        var svg = d3.select("#scatter")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        const yMap = data.map(function (d, i) {
            return d.hw1_hrs;
        });

        const xMap = data.map((d, i) => {
            return d.experience_yr;
        });

        const scX = d3.scaleLinear()
            .domain(d3.extent(xMap, (d) => {
                return d;
            }))
            .range([0, width]);

        const scY = d3.scaleLinear()
            .domain(d3.extent(xMap, (d) => {
                return d;
            }))
            .range([0, height]);



    }
})();