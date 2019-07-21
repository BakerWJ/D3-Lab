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
		var margin = {top: 30, right: 30, bottom: 50, left:45};
		var width = 400 - margin.left - margin.right;
		var height = 300 - margin.top - margin.bottom;
		var svg = d3.select("#scatter")
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top+margin.bottom)
			.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		var xScale = d3.scaleLinear()
			.domain(d3.extent(data, (d) => {
                return d["experience_yr"];
            }))
			.range([0, width]);


		var yhold = d3.extent(data, (d) => {
				return d["hw1_hrs"];
		});
		yhold[0] = 0;
		var yScale = d3.scaleLinear()
			.domain(yhold)
			.range([height, 0]);

		var xAxis = d3.axisBottom()
			.scale(xScale);

		var yAxis = d3.axisLeft()
			.scale(yScale);

		svg.append('g')
			.attr('transform', 'translate(0,' + height +')')
			.attr('class', 'x axis')
			.call(xAxis.ticks(5));

		svg.append('g')
			.attr('transform', 'translate(0,0)')
			.attr('class', 'y axis')
			.call(yAxis.ticks(3));

		var yMax = d3.extent(data, (d) => {
				return d["hw1_hrs"];
		})[1];

		var xMax = d3.extent(data, (d) => {
				return d["experience_yr"];
		})[1];

		var format_data = makeArray(3, (xMax+1)*(yMax+1));
		var counter = 0;
		for (var i = 0; i < xMax+1; i++) {
			for (var l = 0; l < yMax+1; l++) {
				format_data[counter][0] = i;
				format_data[counter][1] = l;
				format_data[counter][2] = 0;
				counter++;
			}
		}

		for (var i = 0; i < data.length; i++) {
			var hw = data[i]["hw1_hrs"];
			var exp = data[i]["experience_yr"];
			format_data[exp * 15 + hw][2]++;
		}

		const radius = d3.scaleSqrt()
            .domain(d3.extent(format_data, (d) => {
                return d[2];
            }))
            .range([0, 8]);





		var bubble = svg.selectAll('.bubble')
			.data(format_data)
			.enter().append('circle')
			.attr('class', 'bubble')
			.attr('cx', (d) => {return xScale(d[0])})
			.attr('cy', (d) => {return yScale(d[1])})
			.attr('r', (d) => {return radius(d[2]);})
			.style("fill", "#00858f");

		svg.append("text")
			.attr("class", "glabel")
			.attr("transform",
				"translate(" + (width/2) + " ," +
				(height + margin.top) + ")")
			.style("text-anchor", "middle")
			.style("font-size", "0.9em")
			.text("Programming Experience");


		svg.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 0 - margin.left)
			.attr("x",0 - (height / 2))
			.attr("dy", "1em")
			.style("text-anchor", "middle")
			.style("font-size", "0.9em")
			.text("Hours spent on HW1");

		function makeArray(d1, d2) {
			var arr = new Array(d1), i, l;
			for(i = 0, l = d2; i < l; i++) {
				arr[i] = new Array(d1);
			}
			return arr;
		}
	}
})();