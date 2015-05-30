SocialMediaAnalyzer.Visualization = (function() {
	var that = {},

	init = function() {
		console.log("init Visualization.js");
    initListener();
	},

  initListener = function(){
     $(document).on('onRequestStart', onRequestStarted);
     $(document).on('onRequestFinished', onRequestFinished);      
  },

  onRequestStarted = function(event){
   event.preventDefault();   
   $('#preloader-container').removeClass('hidden');
   $('#preloader').removeClass('magictime vanishOut');
   $('#preloader').addClass('magictime vanishIn');
  },

  onRequestFinished = function(event){
    event.preventDefault();
    $('#accordion-container').removeClass('hidden');    
    $('#preloader').removeClass('magictime vanishIn');
    $('#preloader').addClass('magictime vanishOut'); 
  },

	createVoteBarChart = function(dataset){
    
    var charts = ['#vote-chart-fb', '#vote-chart-twitter', '#vote-chart-reddit'];
    var width = 100,
        height = 350;
    var barWidth = 75;

    var xScale = d3.scale.linear().domain([0, d3.max(dataset)]) // your data minimum and maximum
                                  .range([0, height]);
    var yScale = d3.scale.linear().domain([0, d3.max(dataset, function(d) { return d; })]).rangeRound([0, height]);
   
    for (var i = 0; i<dataset.length;i++){

    var chart = d3.select(charts[i])
                 .attr("width", width)
                 .attr("height", height);
      
		
     chart.selectAll("svg")
            .data([dataset[i]]) 
          .enter().append("svg:rect")
            .attr("x", function(d, i) { return xScale(i); })
            .attr("y", function(d) { return height - yScale(d); })
            .attr("width", barWidth)
            .attr("fill", "#2d578b")
            .text(function(d) { return d; })
            .attr("fill", "black")
             .transition()
             .duration(5000)
             .attr("height", function(d) { return yScale(d); });
    chart.selectAll("text")
              .data([dataset[i]])
            .enter().append("svg:text")
              .attr("x", function(d, i) { return xScale(i) + barWidth; })
              .attr("y", function(d) {
                var yValue = height - yScale(d);
                  if(yValue >= 460){
                    return 460;
                  } else {
                  return yValue                  
                  }
                 })
              .attr("dx", - barWidth/2)
              .attr("dy", "1.2em")
              .attr("text-anchor", "middle")
              .text(function(d) { return d; })
              .attr("fill", "black");
  
         
    }
    

	};

that.createVoteBarChart = createVoteBarChart;
that.init = init;
return that;
}());
