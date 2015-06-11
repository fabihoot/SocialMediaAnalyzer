SocialMediaAnalyzer.VisualizationController = (function() {
var that = {},
facebookData = null,
twitterData = null,
redditData = null,
$facebookPostResultContainer = null,
$twitterPostResultContainer = null,
$redditPostResultContainer = null,
countLogins = 0,


 init = function() {
      console.log("init VisualizationController.js");
      initListener();
      initContainer();           
 },

 initContainer = function(){
  $facebookPostResultContainer = $( '#facebook-post-result' );
  $twitterPostResultContainer = $( '#twitter-post-result' );
  $redditPostResultContainer = $( '#reddit-post-result' );
 },

 initListener = function(){
  $(document).on('facebookLoginSuccess', onFacebookLoginSuccess);
  $(document).on('twitterLoginSuccess', onTwitterLoginSuccess);
  $(document).on('redditLoginSuccess', onRedditLoginSuccess);
 },

 onFacebookLoginSuccess = function(event){  
  SocialMediaAnalyzer.Visualization.showLoginSuccess('facebook');
  loginIsReady();
 },

 onTwitterLoginSuccess = function(event){  
  SocialMediaAnalyzer.Visualization.showLoginSuccess('twitter');
  loginIsReady();
 },

 onRedditLoginSuccess = function(event){  
  SocialMediaAnalyzer.Visualization.showLoginSuccess('reddit');
  loginIsReady();
 },

 loginIsReady = function(){
  countLogins++;
  if(countLogins>=3)SocialMediaAnalyzer.Visualization.enableSearch(); 
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
  var sumVotes = allFBVotes + allTwitterVotes + allRedditVotes;
 	SocialMediaAnalyzer.Visualization.createVoteBarChart({ allVotes: [allFBVotes, allTwitterVotes, allRedditVotes],
                                                         fbVotes: {
                                                          likes: likes,
                                                          shares: shares
                                                         },
                                                         twitterVotes: {
                                                          retweets: retweets,
                                                          favorites: favorites
                                                         },
                                                         redditVotes: { score: allRedditVotes},
                                                         sumVotes: sumVotes
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

  var minLengthFB = facebookData[0].lang.tokens.length; 
  var minLengthTwit = twitterData[0].lang.tokens.length;
  var minLengthRddt = redditData[0].lang.tokens.length;

  var maxLengthFB = facebookData[0].lang.tokens.length
  var maxLengthTwit = twitterData[0].lang.tokens.length;
  var maxLengthRddt = redditData[0].lang.tokens.length;

  for(var i = 0;i<facebookData.length;i++){
   var length =  facebookData[i].lang.tokens.length;
   tokenFB = tokenFB + length;
   if(maxLengthFB<length) maxLengthFB = length;
   if(minLengthFB>length) minLengthFB = length;  
  }
  for(var i = 0;i<twitterData.length;i++){ 
   var length =  twitterData[i].lang.tokens.length;
   tokenTwit = tokenTwit + length;
   if(maxLengthTwit<length) maxLengthTwit = length;
   if(minLengthTwit>length) minLengthTwit = length;  
  }
  for(var i = 0;i<redditData.length;i++){
   var length =  redditData[i].lang.tokens.length;   
   tokenRddt = tokenRddt + length;
   if(maxLengthRddt<length) maxLengthRddt = length;
   if(minLengthRddt>length) minLengthRddt = length;  
  }

  tokenFB = Math.round(tokenFB / facebookData.length);
  tokenTwit =  Math.round(tokenTwit / twitterData.length);
  tokenRddt = Math.round(tokenRddt / redditData.length);

  SocialMediaAnalyzer.Visualization.createTokenChart({avgTokens:[tokenFB, tokenTwit, tokenRddt], mins:[minLengthFB,minLengthTwit,minLengthRddt], max:[maxLengthFB,maxLengthTwit,maxLengthRddt]});
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
  },
  showPanels = function(){  
    $(document).trigger('onShowPanels');
  };

that.showPanels = showPanels;
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