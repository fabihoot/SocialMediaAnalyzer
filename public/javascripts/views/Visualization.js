SocialMediaAnalyzer.Visualization = (function() {
	var that = {},

	init = function() {
		console.log("init Visualization.js");
	},

	createVoteVisualization = function(dataset){
        console.log("create Visualization");        

        var x = d3.scale.linear()
            .domain([0, d3.max(dataset)])
            .range([0, 500]);


		d3.select(".vote-chart")
          .selectAll("div")
            .data(dataset)
          .enter().append("div")
            .style("width", function(d) { return x(d) + "px"; })
            .text(function(d) { return d; });
	};

that.createVoteVisualization = createVoteVisualization;
that.init = init;
return that;
}());
