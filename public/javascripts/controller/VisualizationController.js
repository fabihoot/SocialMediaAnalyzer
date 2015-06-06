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

 createCloudVisualization = function(){
  var words = [];
  var allData = [facebookData, twitterData, redditData];
  allData.forEach(function(entry){
     entry.forEach(function(element){     
      element.lang.tokensStopword.forEach(function(token){
        words.push(token.toLowerCase());        
      });
     });         
  });

  SocialMediaAnalyzer.Visualization.createCloudChart(sortTokens(words));   
 },

 sortTokens = function(tokens) {
    var a = [], b = [], prev;

    tokens.sort();
    for ( var i = 0; i < tokens.length; i++ ) {
        if ( tokens[i] !== prev ) {
            a.push(tokens[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = tokens[i];
    }
    var max_of_array = Math.max.apply(Math, b);    
    return {words: a, frequencies: b};
 },

 setTwitterPosts = function(){ 
      SocialMediaAnalyzer.Visualization.createTiles(twitterData, $twitterPostResultContainer);     
      //$( '#twitter-post-result' ).render( twitterData, getDirective() );
  },

  setRedditPosts = function(){
      SocialMediaAnalyzer.Visualization.createTiles(redditData, $redditPostResultContainer);               
      //$( '#reddit-post-result' ).render( redditData, getDirectiveText() );
  },

  setFacebookPosts = function(){
       SocialMediaAnalyzer.Visualization.createTiles(facebookData, $facebookPostResultContainer);        
      //$( '#facebook-post-result' ).render( facebookData, getDirective() );
  };

that.createCloudVisualization = createCloudVisualization;
that.createTokenVisualization = createTokenVisualization;
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