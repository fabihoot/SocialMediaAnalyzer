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
 	var allFBVotes = 0;
  var likes = 0;
  var shares = 0;

 	var allTwitterVotes = 0;
  var retweets = 0;
  var favorites = 0;

 	var allRedditVotes = 0;

 	for(var i = 0;i<facebookData.length;i++){    
    allFBVotes = allFBVotes + facebookData[i].votes.likes + facebookData[i].votes.shares; 
    likes = likes + facebookData[i].votes.likes;
    shares = shares + facebookData[i].votes.shares;
  } 
 	for(var i = 0;i<twitterData.length;i++){
    allTwitterVotes = allTwitterVotes + twitterData[i].votes.retweets + twitterData[i].votes.favorites;
    retweets = retweets + twitterData[i].votes.retweets;
    favorites = favorites + twitterData[i].votes.favorites;
  } 
 	for(var i = 0;i<redditData.length;i++) allRedditVotes = allRedditVotes + redditData[i].votes.score;
 	SocialMediaAnalyzer.Visualization.createVoteBarChart({ allVotes: [allFBVotes, allTwitterVotes, allRedditVotes],
                                                         fbVotes: {
                                                          likes: likes,
                                                          shares: shares
                                                         },
                                                         twitterVotes: {
                                                          retweets: retweets,
                                                          favorites: favorites
                                                         },
                                                         redditVotes: { score: ""}
                                                       });
 },

 createSentimentVisualization = function(){
  var data = [];
  var allData = [facebookData, twitterData, redditData];
  allData.forEach(function(entry){
    var pos = 0;
    var neg = 0;
    
    entry.forEach(function(element){     
      pos =  pos + element.sentiment.positive.score;
      neg = neg + element.sentiment.negative.score;      
    });
    var src = entry[0].source;   
    data.push({source: src, value: [pos, neg], score: pos - neg});
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
  var calcFrequncies = sortTokens(words);  
  SocialMediaAnalyzer.Visualization.createCloudChart(calcFrequncies);   
 },

 createContentVisualization = function(){  
  var allData = [facebookData, twitterData, redditData];
  var sumLink = 0;
  var sumText = 0;
  var sumVideo = 0;
  var sumImage = 0;
  allData.forEach(function(entry){
    entry.forEach(function(element){

      switch(element.content.type){
        case 'link': sumLink++; break;
        case 'text': sumText++; break;
        case 'video': sumVideo++; break;
        case 'image': sumImage++; break;
        default: break;
      }

    });
  });
  SocialMediaAnalyzer.Visualization.createContentChart({type: ['link', 'text', 'video', 'image'], value: [sumLink, sumText, sumVideo, sumImage]});
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
    return {words: a, frequencies: b};
 },

 setTwitterPosts = function(){ 
      SocialMediaAnalyzer.Visualization.createTiles(twitterData, $twitterPostResultContainer);    
  },

  setRedditPosts = function(){
      SocialMediaAnalyzer.Visualization.createTiles(redditData, $redditPostResultContainer);      
  },

  setFacebookPosts = function(){
       SocialMediaAnalyzer.Visualization.createTiles(facebookData, $facebookPostResultContainer);   
  };

that.createContentVisualization = createContentVisualization;
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