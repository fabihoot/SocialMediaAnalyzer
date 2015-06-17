SocialMediaAnalyzer.Visualization = (function() {
	var that = {},
  colorClasses = ['facebook-color', 'twitter-color', 'reddit-color'],
  imgSource = ['/images/fb-icon-temp.png', '/images/twit-icon-temp.png', '/images/rdt-icon-temp.png'],
  $panelGeneral,
  $panelPosts,
  index = 0,  

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

  notifySmallDataset = function(source){
    $.Notify({
      caption: 'Dataset too small',
      content: 'Unfortunately ' + source.toUpperCase() + ' was not able to deliver as much data as you wanted. ' +
                'Be careful with the results! Adapt your keyword or try another search term!',
      keepOpen: true,
      type: 'alert',
      icon: "<span class='mif-vpn-publ'></span>",
      style:{
        color: 'white'
      }
    });
  },

  clearVisualizations = function(){
    $("#vote-chart-container").empty();
    $("#sentiment-chart-container").empty();
    $("#sentiment-chart-single-description").empty();
    $("#wordcloud-all").empty();
    $("#wordcloud-facebook").empty();
    $("#wordcloud-twitter").empty();
    $("#wordcloud-reddit").empty();
    $("#token-chart-container").empty();
    $("#content-all").empty();
    $("#content-facebook").empty();
    $("#content-twitter").empty();
    $("#content-reddit").empty();
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
                 .attr("height", height)
                 .attr("class", "place-right")
                 .attr("style", "margin-right:100px"); 
  
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

    var allVotes = data.sumVotes;
    var likes = data.fbVotes.likes;
    var shares = data.fbVotes.shares;
    var retweets = data.twitterVotes.retweets;
    var favorites = data.twitterVotes.favorites;
    var score = data.redditVotes.score;
    
    $('#text-votes-overall').html(allVotes);
    $('#text-fb-likes').html(likes);
    $('#text-fb-shares').html(shares);
    $('#text-twit-retweet').html(retweets);
    $('#text-twit-favorites').html(favorites);
    $('#text-rddt-score').html(score);   

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

    var maxPos = dataset[0].score;
    var maxNeg = dataset[0].score;

    var maxPosSrc = dataset[0].source;
    var maxNegSrc = dataset[0].source;

    for (var i = 0; i<dataset.length;i++){
      var $text = "<div class='cell sentiment-description-"+ dataset[i].source +"'><image src='images/circle_plus_grey.png' class='sentiment-icon'></image><text class='sentiment-description-text'>" + dataset[i].value[0] + "</text>" + 
                 "<image src='images/circle_minus_grey.png' class='sentiment-icon'></image><text class='sentiment-description-text'>" + dataset[i].value[1] + "</text></div>";
       $("#sentiment-chart-single-description").append($text);

        if(dataset[i].score > maxPos){
          maxPos = dataset[i].score;
          maxPosSrc = dataset[i].source;
        }
        if(dataset[i].score < maxNeg){
          maxNeg = dataset[i].score;
          maxNegSrc = dataset[i].source;
        }                  
    }
    $("#text-sent-most-negative").html(maxNegSrc);
    $("#text-sent-most-positive").html(maxPosSrc);      
     
  },

  createTokenChart = function(data){
    var dataset = data.avgTokens;
    var barWidth = 75;
    var width = (barWidth + 10) * dataset.length;
    var height = 400;
    var duration = 2000;
    var xScale = d3.scale.linear().domain([0, dataset.length]).range([0, width]);
    var yScale = d3.scale.linear().domain([0, d3.max(dataset, function(d) { return d; })]).rangeRound([0, height-50]);
    var chart = d3.select("#token-chart-container")
                .append("svg:svg")
                .attr("width", width)
                .attr("height", height)
                .attr("class", "place-right")
                .attr("style", "margin-right:100px");

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
                var text = "<strong>&#216; Tokens per Post: </strong> <span style='color:#d1d1d1'>" + d + "</span>" +
                           "<br/><strong>Longest: </strong><span style='color:#d1d1d1'>" + data.max[i] + " Tokens</span><br/>" +
                           "<strong>Shortest: </strong><span style='color:#d1d1d1'>" + data.mins[i] + " Tokens</span>"
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

    var average = 0;    
    for(var i = 0;i<dataset.length;i++){
      average = average + dataset[i];
    }
    average = Math.round(average / 3);
    var max = Math.max.apply(Math,data.max);
    var min = Math.min.apply(Math,data.mins);
   
    $("#text-post-length-average").html(average);
    $("#text-post-most-tokens").html(max);
    $("#text-post-least-tokens").html(min);
  },

  createCloudChart = function(dataset){
    var width = 300;
    var height = 200;
    var fill = d3.scale.category20();   
    var source = ['all', 'facebook', 'twitter', 'reddit'];

    for(var i=0;i<dataset.length;i++){

    var data = dataset[i].words;
    var frequencies = dataset[i].frequencies;
    var max =  Math.max.apply(Math, dataset[i].frequencies);
    index = i;
    d3.layout.cloud().size([width, height])
        .words(data.map(function(d, i) {
         var frequency = frequencies[i];           
         return {text: d, size: 10 + (frequency / max) * 50, value: frequency};
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
    var text = d3.select("#wordcloud-" + source[i]).select('g').selectAll('text').call(tip);     
    
    text.on('mouseover', tip.show)
         .on('mouseout', tip.hide); 
    var maxWord = data[frequencies.indexOf(max)];
    $("#text-token-most-" + source[i]).html(maxWord);
    $("#text-token-occurence-" + source[i]).html(max);   
    }
  },

  drawWords = function (words) {
    var width = 300, height = 200;
    var source = ['all', 'facebook', 'twitter', 'reddit'];    
   
    d3.select("div#wordcloud-" + source[index]).append("svg")
          .attr("width", width)
          .attr("height", height)
          .attr("style", "margin-left:-100px;")
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

  createContentChart = function(data){
  var width = 220,
  height = 220, 
  radius = 100, 
  innerR= 40,
  color = d3.scale.category10();
  var source = ['facebook', 'twitter', 'reddit', 'all'];

  for (var i = 0;i<data.length;i++){
   var dataset = data[i]; 
   var total = d3.sum(dataset.value);
    
   var vis = d3.select("#content-"+ source[i])
        .append("svg:svg")
        .data(dataset.value)
            .attr("width", width)
            .attr("height", height)
            .attr("class", "place-right")
        .append("svg:g")
            .attr("transform", "translate(" + radius * 1.1 + "," + radius * 1.1 + ")")
    
   var textTop = vis.append("text")
        .attr("dy", ".35em")
        .attr("id", "text-top-"+ dataset.source)
        .style("text-anchor", "middle")
        .attr("class", "textTop")        
        .text( "total" )
        .attr("y", -10),
   textBottom = vis.append("text")
        .attr("dy", ".35em")
        .attr("id", "text-bottom-"+ dataset.source)
        .style("text-anchor", "middle")
        .attr("class", "textBottom")
        .text(dataset.total)
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
                    
                   var txtTop = d3.select(d3.select(this.parentNode).selectAll('text')[0][0]);
                   var txtBottom = d3.select(d3.select(this.parentNode).selectAll('text')[0][1]);
                  
                   if(txtTop.attr("id") == "text-top-facebook"){
                    var index = 0;
                   } else if(txtTop.attr("id") == "text-top-twitter"){
                    var index = 1;
                   }else if(txtTop.attr("id") == "text-top-reddit"){
                    var index = 2;
                   }else if(txtTop.attr("id") == "text-top-all"){
                    var index = 3;
                   }                   
                   var type = data[index].type[data[index].value.indexOf(d.value)];                   
                   d3.select(this).select("path").transition()
                        .duration(200)
                        .attr("d", arcOver)
                    
                    
                    txtTop.text(type)
                        .attr("y", -10);
                    txtBottom.text(d.value)
                        .attr("y", 10);
                })
                .on("mouseout", function(d) {
                    d3.select(this).select("path").transition()
                    .duration(100)
                    .attr("d", arc);
                var txtTop = d3.select(d3.select(this.parentNode).selectAll('text')[0][0]);
                var txtBottom = d3.select(d3.select(this.parentNode).selectAll('text')[0][1]);

                   if(txtBottom.attr("id") == "text-bottom-facebook"){
                    var index = 0;
                   } else if(txtBottom.attr("id") == "text-bottom-twitter"){
                    var index = 1;
                   }else if(txtBottom.attr("id") == "text-bottom-reddit"){
                    var index = 2;
                   }else if(txtBottom.attr("id") == "text-bottom-all"){
                    var index = 3;
                   }
                var currentTotal = data[index].total; 
                txtTop.text( "total" )
                    .attr("y", -10);
                txtBottom.text(currentTotal);
            });

    arcs.append("svg:path")
        .attr("fill", function(d, i) { return color(i); } )
        .attr("d", arc);
    }    
          var legend = d3.select("#content-description").append("svg")
              .attr("class", "legend padding20")              
              .attr("width", radius)
              .attr("height", radius * 2)
              .selectAll("g")
              .data(data[0].type)
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
      var hashtagCount = data[i].lang.hashtags.length;
     
      var $tile = '<div class="tile shadow bg-tile-'+ source + '" data-role="tile" id="tile-'+ source +'-'+ i + '" href="'+ url +'">' + 
                   '<div class="tile-content slide-right-2">' + 
                    '<div class="slide slide-height-top">' + 

                       '<div class="tile-image"><img id="tile-img-entry-'+ source +'-'+ i + '"></img></div>' +
                       '<div class="tile-sentiment text-small padding10 shadow" id="tile-sentiment-entry-'+ source +'-'+ i + '"><b>'+ score + '</b></div>' + 
                    
                       '<div class="tile-text text-small padding10" id="tile-text-entry-'+ source +'-'+ i + '"></div>' +

                    '</div>' + 
                    '<div class="slide-over slide-height-bottom row cells2 grid">' +
                        '<div class="cell"><img id="tile-img-thumb-'+ source +'-'+ i + '"></img></div>' + 
                        '<div class="tile-text text-small padding10 cell" id="tile-text-length-'+ source +'-'+ i + '"></div>' +
                        '<div class="tile-text text-small padding10" id="tile-hashtags-'+ source +'-'+ i + '"></div>' +                             
                    '</div>' + 
                   '</div>' + 
                 '</div>';
      $( container ).append($tile);
      
      var $txtContainer = $('#tile-text-entry-'+ data[i].source +'-'+ i);
      var $imgContainer = $('#tile-img-entry-'+ data[i].source +'-'+ i);
      var $sentimentContainer = $('#tile-sentiment-entry-'+ data[i].source +'-'+ i);

      var $thumbnailContainer = $('#tile-img-thumb-'+ source +'-'+ i);
      var $txtLengthContainer = $('#tile-text-length-'+ data[i].source +'-'+ i);
      var $hashtagContainer = $('#tile-hashtags-'+ data[i].source +'-'+ i);
      var hashtagClick = false;

      var $tileLink = $('#tile-'+ data[i].source +'-'+ i);
      $tileLink.click(function(){        
        if(hashtagClick) {hashtagClick = false; return;}
        var url = $(this).attr("href");            
        var win = window.open(url);
        if(win){            
            win.focus();
        }else{            
            alert('Please allow popups for this site');
        }
        hashtagClick = false
      });
      $hashtagContainer.click(function(){        
        hashtagClick = true;
      });
      
      if(text.length > 60){
        text = text.substring(0,60) + ' [...]';
      }
      $txtContainer.html("<b>" + username +"</b></br>" +text);

      $txtLengthContainer.html("Length: <b>" + textLength + "</b><br/>" +
                               "Tokens:         <b>" + tokenCount+"</b>");

      
      $hashtagContainer.html("Hashtags: <b>" + hashtagCount + "</b><br/>");
      if(hashtagCount >= 1){
        data[i].lang.hashtags.forEach(function(tag){
          $hashtagContainer.append("<a target='_blank' href='https://twitter.com/search?q=#"+ tag + "'>#"+ tag+"</a><br/>");
        });
      }
      
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
      $thumbnailContainer.addClass("tile-thumbnail");      
    }    
  },

  getColor = function(score, maxVal, minVal){
   var colors = d3.scale.linear().domain([minVal,0 ,maxVal]).range(["#FF1E00",'#EEEEEE' ,"#00C333"]);
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

that.clearVisualizations = clearVisualizations;
that.notifySmallDataset = notifySmallDataset;
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
