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
    
    
    var colorClasses = ['facebook-color', 'twitter-color', 'reddit-color'];
    var imgSource = ['/images/fb-icon-temp.png', '/images/twit-icon-temp.png', '/images/rdt-icon-temp.png']
    var barWidth = 75;
    var width = (barWidth + 10) * dataset.length;
    var height = 400;
    var duration = 2000;
    var xScale = d3.scale.linear().domain([0, dataset.length]).range([0, width]);
    var yScale = d3.scale.linear().domain([0, d3.max(dataset, function(d) { return d; })]).rangeRound([0, height-50]);
   
    var chart = d3.select("#vote-chart-container")
                 .append("svg:svg")
                 .attr("width", width)
                 .attr("height", height);      
  
    var bars = chart.selectAll("rect")
          .data(dataset) 
        .enter().append("svg:rect")
          .attr("class", "vote-chart")
          .attr("height", function(d) { 
            if(yScale(d)<=0) return 1;
            return yScale(d); })
          .attr("x", function(d, i) { return xScale(i); })
          .attr("y", height)
          .attr("width", barWidth)
          .attr("class", function(d,i){ return colorClasses[i]; })          
          .transition()
            .attr("y", function(d) {
             if(yScale(d)<=0) return 1; 
             return height - yScale(d); })
            .duration(duration)
            .delay(1500)
            .ease("linear");
          /*bars.on("mouseover", function(d) {     
            d3.select(this).transition()
                   .attr("width", function(){ return barWidth + 10; })
                   .attr("x", function(d, i) { return xScale(i) - 5 ; })
                   .duration(500);     
          });
          bars.on("mouseout", function(d) {
            
            d3.select(this).transition()
                           .attr("width", function(){ return barWidth - 10; })
                           .attr("x", function(d, i) { return xScale(i) + 5 ; })
                           .duration(500);
          });*/
    chart.selectAll("text")
              .data(dataset)
            .enter().append("svg:text")
              .attr("x", function(d, i) { return xScale(i) + barWidth; })
              .attr("y", function(d) {
                var yValue = height - yScale(d);
                  if(yValue >= 325){
                    return 325;
                  } else {
                  return yValue                  
                  }                  
                 })
              .attr("dx", - barWidth/2)
              .attr("dy", "1.2em")
              .attr("text-anchor", "middle")
              .text(function(d) { return d; })
              .attr("fill", "white");

    chart.selectAll("image")
              .data(dataset)
            .enter().append("svg:image")
              .attr("x", function(d, i) { return xScale(i); })
              .attr("y", function(d) {
                var yValue = height - yScale(d) - 45;
                  if(yValue >= 325){
                    return 325;
                  } else {
                  return yValue                  
                  }                  
                 })
              .attr("width", "75")
              .attr("height", "40px")
              .attr("xlink:href", function(d,i){ return imgSource[i]; });

	},

  createSentimentChart = function(dataset){
    var m = 10,
    r = 100,
    z = d3.scale.category20c(),
    labelr = 150;

    var svg = d3.select("#sentiment-chart-container").selectAll("svg")
                  .data(dataset)
                .enter().append("svg:svg")
                  .attr("width", 220)
                  .attr("height", 300)
                .append("svg:g")
                  .attr("transform", "translate(" + (r + m) + "," + (r + m) + ")");
    var arc = d3.svg.arc()
          .innerRadius(r / 2)
          .outerRadius(r);

     svg.selectAll("path")
          .data(d3.layout.pie())
        .enter().append("svg:path")
          .attr("d", arc)
          .style("fill", function(d, i) { return z(i); });
      
      //Labels
      svg.selectAll("g")
         .data(d3.layout.pie())
            .enter().append("g:text")
          .attr("x", function(d, i) { return 0; })
          .attr("y", function(d,i) { return 0;})
          .attr("transform", function(d) { return "translate(" + 
                            arc.centroid(d) + ")"; })         
          .attr("text-anchor", "middle")
          .text(function(d) { return d.value; })
          .attr("fill", "black");
  },

  createTokenChart = function(dataset){
    var colorClasses = ['facebook-color', 'twitter-color', 'reddit-color'];
    var barWidth = 75;
    var width = (barWidth + 10) * dataset.length;
    var height = 400;
    var duration = 2000;
    var xScale = d3.scale.linear().domain([0, dataset.length]).range([0, width]);
    var yScale = d3.scale.linear().domain([0, d3.max(dataset, function(d) { return d; })]).rangeRound([0, height-50]);
    var chart = d3.select("#token-chart-container")
                .append("svg:svg")
                .attr("width", width)
                .attr("height", height);

    var bars = chart.selectAll("rect")
          .data(dataset) 
        .enter().append("svg:rect")
          .attr("class", "vote-chart")
          .attr("height", function(d) { return yScale(d); })
          .attr("x", function(d, i) { return xScale(i); })
          .attr("y", height)
          .attr("width", barWidth)
          .attr("class", function(d,i){ return colorClasses[i]; })          
          .transition()
            .attr("y", function(d) { return height - yScale(d); })
            .duration(duration)
            .delay(1500)
            .ease("linear");


    chart.selectAll("text")
              .data(dataset)
            .enter().append("svg:text")
              .attr("x", function(d, i) { return xScale(i) + barWidth; })
              .attr("y", function(d) {
                var yValue = height - yScale(d);
                  if(yValue >= 325){
                    return 325;
                  } else {
                  return yValue                  
                  }                  
                 })
              .attr("dx", - barWidth/2)
              .attr("dy", "1.2em")
              .attr("text-anchor", "middle")
              .text(function(d) { return d; })
              .attr("fill", "white");


  },

  createCloudChart = function(dataset){
    var width = 600;
    var height = 300;
    var data = dataset.words;
    var frequencies = dataset.frequencies;
    var max =  Math.max.apply(Math, dataset.frequencies);
    var fill = d3.scale.category20();
    d3.layout.cloud().size([width, height])
        .words(data.map(function(d, i) {
         var frequency = frequencies[i];        
          return {text: d, size: 10 + (frequency / max) * 50};
        }))
        .padding(5)
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .font("Impact")
        .fontSize(function(d) { return d.size; })
        .on("end", drawWords)
        .start();    
  },

  drawWords = function (words) {
    var width = 600,
    height = 300;
      d3.select("#wordcloud-container").append("svg")
          .attr("width", width)
          .attr("height", height)
        .append("g")
          .attr("transform", "translate("+ width / 2 +","+ height / 2+")")
        .selectAll("text")
          .data(words)
        .enter().append("text")
          .style("font-size", function(d) { return d.size + "px"; })
          .style("font-family", "Impact")
          .attr("fill", "black")
          .attr("text-anchor", "middle")
          .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function(d) { return d.text.toLowerCase(); });
  };

that.createCloudChart = createCloudChart;
that.createTokenChart = createTokenChart;
that.createSentimentChart = createSentimentChart;
that.createVoteBarChart = createVoteBarChart;
that.init = init;
return that;
}());
