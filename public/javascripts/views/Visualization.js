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
    $('#preloader').removeClass('magictime vanishIn');
    $('#preloader').addClass('magictime vanishOut'); 
  },

	createVoteBarChart = function(dataset){
    
    var charts = ['#vote-chart-fb', '#vote-chart-twitter', '#vote-chart-reddit'];
    var w = 10;
    var h = 200;        
    var x = d3.scale.linear()
                    .domain([0, d3.max(dataset)])
                    .range([0, 200]);

    for (var i = 0; i<dataset.length;i++){
      
		d3.select(charts[i])
          .selectAll("div")
            .data([dataset[i]]) 
          .enter().append("div")
            .style("height", function(d) { return x(d) + "px"; })
            .style("width", w)
            .style("y", function(d) { return h - (d * 2) + "px"; })
            .text(function(d) { return d; });
    }
	};

that.createVoteBarChart = createVoteBarChart;
that.init = init;
return that;
}());
