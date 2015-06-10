SocialMediaAnalyzer.Visualization = (function() {
	var that = {},
  colorClasses = ['facebook-color', 'twitter-color', 'reddit-color'],
  imgSource = ['/images/fb-icon-temp.png', '/images/twit-icon-temp.png', '/images/rdt-icon-temp.png'],
  $panelGeneral,
  $panelPosts,  

	init = function() {
		console.log("init Visualization.js");
    initListener();
    initContainer();
	},

  initContainer = function(){
    $panelGeneral = $('#frame-general');
    $panelPosts = $('#frame-posts')
    
  },

  initListener = function(){
     $(document).on('onRequestStart', onRequestStarted);
     $(document).on('onRequestFinished', onRequestFinished);
     $(document).on('onShowPanels', onShowPanels);
     $(document).on('onCheckRequest', onRequestFinishedId);            
  },  
  
  onShowPanels = function(event){
    event.preventDefault();      
    $panelGeneral.removeClass('hidden').addClass('magictime spaceInLeft');
    $panelGeneral.addClass("active").delay(2000);
    $panelPosts.removeClass('hidden').addClass('magictime spaceInLeft');   
    showCarousel(); 
  },

  showCarousel = function(){
    $('.carousel').carousel({
            auto: false,
            period: 20000,
            duration: 2000,
            height: 500
           
        });
  },

  onRequestStarted = function(event){
   event.preventDefault();   
    $('#preloader-facebook').removeClass('hidden');
    $('#preloader-ok-facebook').addClass('hidden'); 

    $('#preloader-twitter').removeClass('hidden');
    $('#preloader-ok-twitter').addClass('hidden');

    $('#preloader-reddit').removeClass('hidden');
    $('#preloader-ok-reddit').addClass('hidden');

    $("#info-search").removeClass('hidden');
    $("#info-login").addClass('magictime vanishOut').addClass('hidden');
    $("#info-search").addClass('magictime vanishIn');
  },

  onRequestFinished = function(event){
    event.preventDefault();
    $('#accordion-container').removeClass('hidden');    
    //$('#preloader').removeClass('magictime vanishIn');
    //$('#preloader').addClass('magictime vanishOut'); 
  },

  onRequestFinishedId = function(event, id){
    event.preventDefault();
    showLoginSuccess(id); 
  },

  showLoginSuccess = function(id){    
    $('#preloader-'+ id).addClass('hidden');
    $('#preloader-ok-'+ id).removeClass('hidden');   
  },

  enableSearch = function(){
    $('#input-keyword').removeAttr('disabled');
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
    var radius = 100, 
    innerR = 80;
    
    var color = d3.scale.linear().domain([0, 1]).range(["#00C333", "#FF1E00"]);
   
    
    var svg = d3.select("#sentiment-chart-container").selectAll("svg")
                  .data(dataset)
                .enter().append("svg:svg")
                  .attr("width", width)
                  .attr("height", height)                 
                .append("svg:g")                 
                 .attr("transform", "translate(" + radius * 1.1 + "," + radius * 1.1 + ")")

    var textTop = svg.append("text")
        .attr("id", function(d,i){ return "sent-text-top-" + d.source })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .attr("class", "textTop")
        .text( "total" )
        .attr("y", -10),
    textBottom = svg.append("text")
        .attr("id", function(d,i){ return "sent-text-bottom-" + d.source })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .attr("class", "textBottom")
        .text(function(d){ return d.score })
        .attr("y", 10);            
                
   var arc = d3.svg.arc()
        .innerRadius(innerR)
        .outerRadius(radius);
    
   var arcOver = d3.svg.arc()
        .innerRadius(innerR + 5)
        .outerRadius(radius + 5);

    var pie = d3.layout.pie()
                .value(function(d) { return d; });
   
  
   var arcs = svg.selectAll("g.slice")
        .data(function(d) { return pie(d.value); })
        .enter()
            .append("svg:g")                
                .attr("class", "slice")
        .on("mouseover", function(d,i ) {
                    
                    d3.select(this).select("path").transition()
                        .duration(200)
                        .attr("d", arcOver)
                    var temp = d.value;
                   
                    var txtTop = d3.select(d3.select(this.parentNode).selectAll('text')[0][0]);
                    var txtBottom = d3.select(d3.select(this.parentNode).selectAll('text')[0][1]);                    
                    
                    txtTop.text(function(d) {
                      var index = d.value.indexOf(temp);
                      var text = 'positive';
                      if(index == 1) text = 'negative';
                      return text;
                    })
                        .attr("y", -10);
                    txtBottom.text(d.value)
                        .attr("y", 10);
                })
        .on("mouseout", function(d) {
                    d3.select(this).select("path").transition()
                    .duration(100)
                    .attr("d", arc);
                
                textTop.text( "score" )
                    .attr("y", -10);
                textBottom.text(function(d){ return d.score });
        });  

   arcs.append("svg:path")        
        .attr("fill", function(d, i) { return color(i); } )
        .attr("d", arc);                

    for (var i = 0; i<dataset.length;i++){
      var $text = "<div class='cell sentiment-description-"+ dataset[i].source +"'><image src='images/circle_plus_grey.png' class='sentiment-icon'></image><text class='sentiment-description-text'>" + dataset[i].value[0] + "</text>" + 
                 "<image src='images/circle_minus_grey.png' class='sentiment-icon'></image><text class='sentiment-description-text'>" + dataset[i].value[1] + "</text></div>";
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
    var frequenciesMapped;

    d3.layout.cloud().size([width, height])
        .words(data.map(function(d, i) {
         var frequency = frequencies[i];           
         return {text: d, size: 10 + (frequency / max) * 75, value: frequency};
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
                 return "<span style='color:#d1d1d1'>" + d.value + "</span>";                 
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
   var width = 400,
   height = 400, 
   radius = 180, 
   innerR= 70,
   color = d3.scale.category10();

   var total = d3.sum(dataset.value);
    
   var vis = d3.select("#content-chart-container")
        .append("svg:svg")
        .data(dataset.value)
            .attr("width", width)
            .attr("height", height)
        .append("svg:g")
            .attr("transform", "translate(" + radius * 1.1 + "," + radius * 1.1 + ")")
    
   var textTop = vis.append("text")
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .attr("class", "textTop")
        .text( "total" )
        .attr("y", -10),
   textBottom = vis.append("text")
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .attr("class", "textBottom")
        .text(total)
        .attr("y", 10);
    
   var arc = d3.svg.arc()
        .innerRadius(innerR)
        .outerRadius(radius);
    
   var arcOver = d3.svg.arc()
        .innerRadius(innerR + 5)
        .outerRadius(radius + 5);
     
   var pie = d3.layout.pie()
        .value(function(d) {  return d; });
     
   var arcs = vis.selectAll("g.slice")
        .data(pie(dataset.value))
        .enter()
            .append("svg:g")
                .attr("class", "slice")
                .on("mouseover", function(d) {
                  
                    d3.select(this).select("path").transition()
                        .duration(200)
                        .attr("d", arcOver)
                    var type = dataset.type[dataset.value.indexOf(d.value)];
                    textTop.text(type)
                        .attr("y", -10);
                    textBottom.text(d.value)
                        .attr("y", 10);
                })
                .on("mouseout", function(d) {
                    d3.select(this).select("path").transition()
                    .duration(100)
                    .attr("d", arc);
                
                textTop.text( "total" )
                    .attr("y", -10);
                textBottom.text(total);
            });

    arcs.append("svg:path")
        .attr("fill", function(d, i) { return color(i); } )
        .attr("d", arc);
        
          var legend = d3.select("#content-chart-container").append("svg")
              .attr("class", "legend")
              .attr("width", radius)
              .attr("height", radius * 2)
              .selectAll("g")
              .data(dataset.type)
              .enter().append("g")
              .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
          
          legend.append("rect")
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", function(d, i) { return color(i); });
          
          legend.append("text")          
              .attr("x", 24)
              .attr("y", 9)
              .attr("dy", ".35em")
              .text(function(d) { return d; });      
  },

  createTiles = function(data, container){
   
    addTiles(data, container);      
  },

  addTiles = function(data, container){
    var maxVal = getMaxValue(data);
    var minVal = getMinValue(data);

    for (var i = 0; i<data.length;i++){
      var source = data[i].source;
      var text = data[i].text;
      var url = data[i].content.url;
      var thumbnail = data[i].content.thumbnail;
      var type = data[i].content.type;
      var score = data[i].sentiment.score;
      var textLength = data[i].text.length;
      var tokenCount = data[i].lang.countTokens;
      var username = data[i].username;
     
      var $tile = '<div class="tile" data-role="tile" id="tile-'+ source +'-'+ i + '" href="'+ url +'">' + 
                   '<div class="tile-content slide-right-2">' + 
                    '<div class="slide slide-height-top">' + 

                       '<div class="tile-image"><img id="tile-img-entry-'+ source +'-'+ i + '"></img></div>' +
                       '<div class="tile-sentiment text-small padding10 shadow" id="tile-sentiment-entry-'+ source +'-'+ i + '">'+ score + '</div>' + 
                    
                       '<div class="tile-text text-small padding10" id="tile-text-entry-'+ source +'-'+ i + '"></div>' +

                    '</div>' + 
                    '<div class="slide-over slide-height-bottom">' +
                        '<div class="tile-thumbnail"><img id="tile-img-thumb-'+ source +'-'+ i + '"></img></div>' + 
                        '<div class="tile-text text-small padding10" id="tile-text-length-'+ source +'-'+ i + '"></div>' +                             
                    '</div>' + 
                   '</div>' + 
                 '</div>';
      $( container ).append($tile);
      
      var $txtContainer = $('#tile-text-entry-'+ data[i].source +'-'+ i);
      var $imgContainer = $('#tile-img-entry-'+ data[i].source +'-'+ i);
      var $sentimentContainer = $('#tile-sentiment-entry-'+ data[i].source +'-'+ i);

      var $thumbnailContainer = $('#tile-img-thumb-'+ source +'-'+ i);
      var $txtLengthContainer = $('#tile-text-length-'+ data[i].source +'-'+ i);
      

      var $tileLink = $('#tile-'+ data[i].source +'-'+ i);
      $tileLink.click(function(){
        var url = $(this).attr("href");            
        var win = window.open(url);
        if(win){
            //Browser has allowed it to be opened
            win.focus();
        }else{
            //Broswer has blocked it
            alert('Please allow popups for this site');
        }
      });
      
      if(text.length > 140){
        text = text.substring(0,100) + ' [...]';
      }
      $txtContainer.html("<b>" + username +"</b></br>" +text);

      $txtLengthContainer.html("Length of Text: " + textLength + "<br/>" +
                               "Tokens:         " + tokenCount);
      
      var color = getColor(score, maxVal, minVal);
      $sentimentContainer.css('background', color);
      if(type == 'image'){
        $imgContainer.attr("src", "/images/image-icon.png"); 
        $thumbnailContainer.bind('error', function(e){
            //error has been thrown
            $(this).attr('src','/images/no-image-icon.png');
        }).attr('src', thumbnail);
      } else if (type == 'link') { 
        $imgContainer.attr("src", "/images/link-icon.png");
        $thumbnailContainer.attr("src", '/images/no-image-icon.png');
      } else if (type == 'text') {
        $imgContainer.attr("src", "/images/text-icon.png");
        $thumbnailContainer.attr("src", '/images/no-image-icon.png');     
      } else if(type == 'video') {
        $imgContainer.attr("src", "/images/video-icon.png");
        $thumbnailContainer.attr("src", '/images/no-image-icon.png');   
      }
      //Load image src 
       /*$imgContainer.bind('error', function(e){
            //error has been thrown
            $(this).attr('src','/images/no-image-icon.png');
        }).attr('src', url);*/ 
    }    
  },

  getColor = function(score, maxVal, minVal){
   var colors = d3.scale.linear().domain([minVal,0 ,maxVal]).range(["#FF1E00",'#EEEEEE' ,"#00C333"]);

  /*var color = Spectra(rgb);
   var lighter = color.lighten(10);*/

   return colors(score);

  },

  getMaxValue = function(data){
    var compValues = [];
    data.forEach(function(entry){
      compValues.push(entry.sentiment.score);
    });
    return Math.max.apply(Math,compValues);
  },

  getMinValue = function(data){
    var compValues = [];
    data.forEach(function(entry){
      compValues.push(entry.sentiment.score);
    });
    return Math.min.apply(Math,compValues);
  };

that.enableSearch = enableSearch;
that.showLoginSuccess = showLoginSuccess;
that.createTiles = createTiles;  
that.createContentChart = createContentChart;
that.createCloudChart = createCloudChart;
that.createTokenChart = createTokenChart;
that.createSentimentChart = createSentimentChart;
that.createVoteBarChart = createVoteBarChart;
that.init = init;
return that;
}());
