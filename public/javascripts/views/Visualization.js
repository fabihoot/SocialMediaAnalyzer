SocialMediaAnalyzer.Visualization = (function() {
	var that = {},
  colorClasses = ['facebook-color', 'twitter-color', 'reddit-color'],
  imgSource = ['/images/fb-icon-temp.png', '/images/twit-icon-temp.png', '/images/rdt-icon-temp.png'],

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

	createVoteBarChart = function(data){

    var dataset = data.allVotes;
    
    
    var barWidth = 75;
    var width = (barWidth + 10) * dataset.length;
    var height = 400;
    var duration = 2000;
    var xScale = d3.scale.linear().domain([0, dataset.length]).range([0, width]);
    var yScale = d3.scale.linear().domain([0, d3.max(dataset, function(d) { return d; })]).rangeRound([0, height-50]);     
                
    var chart = d3.select("#vote-chart-container")
                .data(dataset) 
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
             if(yScale(d)<=0) return height - 1; 
             return height - yScale(d); })
            .duration(duration)
            .delay(1500)
            .ease("linear");

    var tip = d3.tip()                
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d,i) {
                var text = "<strong>All Votes: </strong> <span style='color:#d1d1d1'>" + d + "</span>";
                if(i==0){
                  text = text +
                  "<br/><strong>Likes: </strong><span style='color:#d1d1d1'>" + data.fbVotes.likes + "</span><br/>" +
                  "<strong>Shares: </strong><span style='color:#d1d1d1'>" + data.fbVotes.shares + "</span>"
                } else if(i==1) {
                  text = text +
                  "<br/><strong>Retweets: </strong><span style='color:#d1d1d1'>" + data.twitterVotes.retweets + "</span><br/>" +
                  "<strong>Favorites: </strong><span style='color:#d1d1d1'>" + data.twitterVotes.favorites + "</span>"
                } else {

                }                 
                  return text;
                });    

    chart.selectAll('rect').call(tip);     

    chart.selectAll('rect').on('mouseover', tip.show)
                           .on('mouseout', tip.hide);
     
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
    var width = 260;
    var height = 220;
    var m = 10,
    r = 100,
    z = d3.scale.category20c();

    var svg = d3.select("#sentiment-chart-container").selectAll("svg")
                  .data(dataset)
                .enter().append("svg:svg")
                  .attr("width", width)
                  .attr("height", height)                 
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
          .attr("fill", "white");

    var id = ['facebook', 'twitter', 'reddit'];
    for (var i = 0; i<dataset.length;i++){
      var $text = "<div class='cell sentiment-description-"+ id[i] +"'><image src='images/circle_plus_grey.png' class='sentiment-icon'></image><text class='sentiment-description-text'>" + dataset[i][0] + "</text>" + 
                 "<image src='images/circle_minus_grey.png' class='sentiment-icon'></image><text class='sentiment-description-text'>" + dataset[i][1] + "</text></div>";
       $("#sentiment-chart-single-description").append($text);                
    }
     
  },

  createTokenChart = function(dataset){
   
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

    var tip = d3.tip()                
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d,i) {
                var text = "<strong>&#216; Tokens per Post: </strong> <span style='color:#d1d1d1'>" + d + "</span>";
                  return text;
                });

    chart.selectAll('rect').call(tip);     

    chart.selectAll('rect').on('mouseover', tip.show)
                           .on('mouseout', tip.hide);  


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
          return {text: d, size: 10 + (frequency / max) * 75};
        }))
        .padding(5)
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .font("Impact")
        .fontSize(function(d) { return d.size; })
        .on("end", drawWords)
        .start();

    var tip = d3.tip()                
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d,i) {                                
                 return "<span style='color:#d1d1d1'>" + frequencies[i] + "</span>";                 
                });    
    var text = d3.select("#wordcloud-container").select('g').selectAll('text').call(tip);     
    
    text.on('mouseover', tip.show)
         .on('mouseout', tip.hide);    
  },

  drawWords = function (words) {
    var width = 600, height = 300;
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

  },

  createContentChart = function(dataset){
   
    //Width and height
      var w = 300;
      var h = 300;      

      var outerRadius = w / 2;
      var innerRadius = 0;
      var arc = d3.svg.arc()
              .innerRadius(innerRadius)
              .outerRadius(outerRadius);
      
      var pie = d3.layout.pie();
      
      //Easy colors accessible via a 10-step ordinal scale
      var color = d3.scale.category10();

      //Create SVG element
      var svg = d3.select("#content-chart-container")
            .append("svg")
            .attr("width", w)
            .attr("height", h);
      
      //Set up groups
      var arcs = svg.selectAll("g.arc")
              .data(pie(dataset))
              .enter()
              .append("g")
              .attr("class", "arc")
              .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");
      
      //Draw arc paths
      arcs.append("path")
          .attr("fill", function(d, i) {
            return color(i);
          })
          .attr("d", arc);
      
      //Labels
      arcs.append("text")
          .attr("transform", function(d) {
            return "translate(" + arc.centroid(d) + ")";
          })
          .attr("text-anchor", "middle")
          .text(function(d) {
            return d.value;
          })
          .attr("fill", "white");
  },

  createTiles = function(data, container){
    var maxVal = getMaxValue(data);
    addTiles(data, container, maxVal);      
  },

  addTiles = function(data, container, maxVal){
    for (var i = 0; i<data.length;i++){
      var source = data[i].source;
      var text = data[i].text;
      var url = data[i].content.url;
      var type = data[i].content.type;
      var comparative = data[i].sentiment.comparative;
      var numb  = Math.round(comparative * 100) / 100
      //console.log("Type:",type, "Source", source);    
      var divToAppend = '<div class="tile-image color-'+ source +'""><img id="tile-img-entry-'+ source +'-'+ i + '"></img></div>';
      
      var $tile = '<div class="tile" data-role="tile">' + 
                   '<div class="tile-content slide-right-2">' + 
                    '<div class="slide slide-height-top">' + 
                       '<div class="tile-text text-small padding10" id="tile-text-entry-'+ source +'-'+ i + '"></div>' +
                       '<div class="tile-sentiment text-small padding10" id="tile-sentiment-entry-'+ source +'-'+ i + '">Sentiment comp.: '+ numb + '</div>' + 
                    '</div>' + 
                    '<div class="slide-over slide-height-bottom>' +
                       divToAppend +                        
                    '</div>' + 
                   '</div>' + 
                 '</div>';
      $( container ).append($tile);

      var $txtContainer = $('#tile-text-entry-'+ data[i].source +'-'+ i);
      var $imgContainer = $('#tile-img-entry-'+ data[i].source +'-'+ i);
      var $sentimentContainer = $('#tile-sentiment-entry-'+ data[i].source +'-'+ i);

      
      if(text.length > 140){
        text = text.substring(0,140) + '...';
      }
      $txtContainer.text(text);
      var color = getColor(comparative, maxVal);
      $sentimentContainer.css('background',color);
      if(type == 'image'){
        $imgContainer.bind('error', function(e){
            //error has been thrown
            $(this).attr('src','/images/no-image-icon.png');
        }).attr('src', url);
      } else if (type == 'link') { 
        //$imgContainer.attr("src", "/images/link-icon.png");
        $imgContainer.bind('error', function(e){
            //error has been thrown
            $(this).attr('src','/images/no-image-icon.png');
        }).attr('src', url);

      } else if (type == 'text') {
        $imgContainer.attr("src", "/images/text-icon.png");        
      } else if(type == 'video') {
        $imgContainer.attr("src", "/images/video-icon.png");        
      } 
    }    
  },

  getColor = function(score, maxVal){

   var value = Math.abs(score / maxVal);  
   var hue=((1-value)*120).toString(10);
   var hsl= ["hsl(",hue,",100%,50%)"].join("")
   var rgb = d3.hsl(hsl).rgb();
   var color = Spectra(rgb);
   var lighter = color.lighten(10);
   return lighter;

  },

  getMaxValue = function(data){
    var compValues = [];
    data.forEach(function(entry){
      compValues.push(entry.sentiment.comparative);
    });
    return Math.max.apply(Math,compValues);
  },

  calcBackgroundColor = function(number){
    //.css('background','#8ec252')
  };

that.createTiles = createTiles;  
that.createContentChart = createContentChart;
that.createCloudChart = createCloudChart;
that.createTokenChart = createTokenChart;
that.createSentimentChart = createSentimentChart;
that.createVoteBarChart = createVoteBarChart;
that.init = init;
return that;
}());
