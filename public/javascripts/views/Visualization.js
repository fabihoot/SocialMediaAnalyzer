SocialMediaAnalyzer.Visualization = (function() {
	var that = {},

	init = function() {
		console.log("init Visualization.js");
	},

	createVoteVisualization = function(dataset){
		d3.select("body").selectAll("chart")
    	  .data(dataset)
    	  .enter()
    	  .append("div")
    	  .attr("class", "bar")
    	  .style("height", function(d) {
    	      var barHeight = d * 5;
    	      return barHeight + "px";
    	  });
	};

that.createVoteVisualization = createVoteVisualization;
that.init = init;
return that;
}());
