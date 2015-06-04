SocialMediaAnalyzer.VisualizationController = (function() {
var that = {},
facebookData = null,
twitterData = null,
redditData = null,
$facebookPostResultContainer = null,
$twitterPostResultContainer = null,
$redditPostResultContainer = null,


 init = function() {
      console.log("init VisualizationController.js");
      initContainer();           
 },

 initContainer = function(){
  $facebookPostResultContainer = $( '#facebook-post-result' );
  $twitterPostResultContainer = $( '#twitter-post-result' );
  $redditPostResultContainer = $( '#reddit-post-result' );
 },

 setFacebookData = function(data){
 	facebookData = data;
 },

 setTwitterData = function(data){
 	twitterData = data;
 },

 setRedditData = function(data){
 	redditData = data;
 },

 createVoteVisualization = function(){ 	
 	var fbVotes = 0;
 	var twitterVotes = 0;
 	var redditVotes = 0;
 	for(var i = 0;i<facebookData.length;i++) fbVotes = fbVotes + facebookData[i].votes.likes;
 	for(var i = 0;i<twitterData.length;i++) twitterVotes = twitterVotes + twitterData[i].votes.retweets;
 	for(var i = 0;i<redditData.length;i++) redditVotes = redditVotes + redditData[i].votes.score;
 	SocialMediaAnalyzer.Visualization.createVoteBarChart([fbVotes, twitterVotes, redditVotes]);
 },

 createSentimentVisualization = function(){
  var data = [];
  var allData = [facebookData, twitterData, redditData];
  allData.forEach(function(entry){
    var pos = 0;
    var neg = 0;
    var neut = 0;
    entry.forEach(function(element){     
      pos =  pos + element.sentiment.positive.score;
      neg = neg + element.sentiment.negative.score;
      //neut = neut + element.sentiment.neutral.score;
    });
    data.push([pos, neg]);
  });
  SocialMediaAnalyzer.Visualization.createSentimentChart(data);
 },

 createTokenVisualization = function(){
  var tokenFB = 0;
  var tokenTwit = 0;
  var tokenRddt = 0;

  for(var i = 0;i<facebookData.length;i++) tokenFB = tokenFB + facebookData[i].lang.tokens.length;
  for(var i = 0;i<twitterData.length;i++) tokenTwit = tokenTwit + twitterData[i].lang.tokens.length;
  for(var i = 0;i<redditData.length;i++) tokenRddt = tokenRddt + redditData[i].lang.tokens.length;

  tokenFB = Math.round(tokenFB / facebookData.length);
  tokenTwit =  Math.round(tokenTwit / twitterData.length);
  tokenRddt = Math.round(tokenRddt / redditData.length);

  SocialMediaAnalyzer.Visualization.createTokenChart([tokenFB, tokenTwit, tokenRddt]);
 },

 setTwitterPosts = function(){ 
      createTiles(twitterData, $twitterPostResultContainer);     
      //$( '#twitter-post-result' ).render( twitterData, getDirective() );
  },

  setRedditPosts = function(){
      createTiles(redditData, $redditPostResultContainer);               
      //$( '#reddit-post-result' ).render( redditData, getDirectiveText() );
  },

  setFacebookPosts = function(){
       createTiles(facebookData, $facebookPostResultContainer);        
      //$( '#facebook-post-result' ).render( facebookData, getDirective() );
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
        $imgContainer.attr("src",  url);
      } else if (type == 'link') { 
        $imgContainer.attr("src", "/images/link-icon.png");
      } else {
        $imgContainer.attr("src", "/images/text-icon.png");        
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
  }

  calcBackgroundColor = function(number){
    //.css('background','#8ec252')
  };

that.createTokenVisualization = createTokenVisualization
that.createSentimentVisualization = createSentimentVisualization;
that.createVoteVisualization = createVoteVisualization;
that.setFacebookData = setFacebookData;
that.setTwitterData = setTwitterData;
that.setRedditData = setRedditData;
that.setTwitterPosts = setTwitterPosts;
that.setFacebookPosts = setFacebookPosts;
that.setRedditPosts = setRedditPosts;
that.init = init;
return that;
}());