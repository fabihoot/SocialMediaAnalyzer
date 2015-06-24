SocialMediaAnalyzer.VisualizationController = (function() {
var that = {},
facebookData = null,
twitterData = null,
redditData = null,
$facebookPostResultContainer = null,
$twitterPostResultContainer = null,
$redditPostResultContainer = null,
countLogins = 0,

 //ruft Initialisierung von Listener, Hilfe und Container auf
 init = function() {
      console.log("init VisualizationController.js");
      initListener();
      initContainer();
      initHelp();           
 },

 //Initialisierung der Buttons
 initContainer = function(){
  $facebookPostResultContainer = $( '#facebook-post-result' );
  $twitterPostResultContainer = $( '#twitter-post-result' );
  $redditPostResultContainer = $( '#reddit-post-result' );
 },

 //Initialisierung der Listener
 initListener = function(){
  $(document).on('facebookLoginSuccess', onFacebookLoginSuccess);
  $(document).on('twitterLoginSuccess', onTwitterLoginSuccess);
  $(document).on('redditLoginSuccess', onRedditLoginSuccess);
 },

 //Initialisierung der Hilfe
 initHelp = function(){
  $.facebox.settings.closeImage = '/images/closelabel.png';
  $.facebox.settings.loadingImage = '/images/loading.gif';

  $('#help-link').click(function(event){
    $.facebox('<div class="row padding20">' +
              '<h2>Help</h2>' + 
              '<text class="text-accent"> This web application is designed to crawl the three Social Media Sites <b>Facebook</b>, <b>Twitter</b> and ' + 
              ' <b>Reddit</b>. This concept offers you an alternative web based tool to explore the phenomen of cross online social network' + 
              ' user behavior.'+
              '</text></div>')
  });

 },


 //Initialisierung der Speicherungsfunktion
 initSave = function(){
  $inputSave = $( '#input-file' );
 
  $inputSave.click(function(event){    
    var pom = document.createElement('a');
    var filename = 'elements.json';
    var obj = {facebook: facebookData, twitter: twitterData, reddit: redditData};
    var result = JSON.stringify(obj, null, 4);
    pom.setAttribute('href', 'data:application/json,' + encodeURIComponent(result));
    pom.setAttribute('download', filename);
    pom.click();    
   });
  },
  
 //Reset bei erneuter Suche
 reset = function(){
  resetData();
  clearResultContainer();
  SocialMediaAnalyzer.Visualization.clearVisualizations();
 },

  //Reset der gesammelten Posts bei erneuter Suche
 resetData = function(){
  facebookData = null;
  twitterData = null;
  redditData = null;
 },

 //Leeren des Ergebniscontainers
 clearResultContainer = function(){
  $facebookPostResultContainer.empty();
  $twitterPostResultContainer.empty();
  $redditPostResultContainer.empty();
 },

 //Anzeige des Loginerfolgs bei Facebook
 onFacebookLoginSuccess = function(event){  
  SocialMediaAnalyzer.Visualization.showLoginSuccess('facebook');
  loginIsReady();
 },

 //Anzeige des Loginerfolgs bei Twitter
 onTwitterLoginSuccess = function(event){  
  SocialMediaAnalyzer.Visualization.showLoginSuccess('twitter');
  loginIsReady();
 },

 //Anzeige des Loginerfolgs bei Reddit
 onRedditLoginSuccess = function(event){  
  SocialMediaAnalyzer.Visualization.showLoginSuccess('reddit');
  loginIsReady();
 },

 //Alle Logins waren Erfolgreich
 loginIsReady = function(){
  countLogins++;
  if(countLogins>=3){SocialMediaAnalyzer.Visualization.enableSearch(); countLogins = 0;} 
 },

//Setzen der Facebook Suchergebnisse
 setFacebookData = function(data){
 	facebookData = data;
 },

//Setzen der Twitter Suchergebnisse
 setTwitterData = function(data){
 	twitterData = data;
 },

//Setzen der Reddit Suchergebnisse
 setRedditData = function(data){
 	redditData = data;
 },

//Überprüfeun der Länge der Ergebnisse, ob zu wenig geliefert wurden
 checkDataSetLength = function(count){
  var allData = [facebookData, twitterData, redditData];
  allData.forEach(function(entry){
    if(entry.length<count) SocialMediaAnalyzer.Visualization.notifySmallDataset(entry[0].source)
  });
 }

//Zusammenstellen der notwendigen Daten für die Vote Analyse
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
                                                         sumVotes: sumVotes});
 },

//Zusammenstellen der notwendigen Daten für die Sentiment Analyse
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

//Zusammenstellen der notwendigen Daten für die Token Analyse
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

  SocialMediaAnalyzer.Visualization.createTokenChart({avgTokens:[tokenFB, tokenTwit, tokenRddt],
                                                      mins:[minLengthFB,minLengthTwit,minLengthRddt],
                                                      max:[maxLengthFB,maxLengthTwit,maxLengthRddt]});
 },

//Zusammenstellen der notwendigen Daten für die Word Cloud
 createCloudVisualization = function(){
  
  var wordsFB = [];
  var wordsTwit = [];
  var wordsRddt = [];
  var allData = [facebookData, twitterData, redditData];
  allData.forEach(function(entry){
     entry.forEach(function(element){
      var source = element.source;     
      element.lang.tokensStopword.forEach(function(token){
       
        if(source == 'facebook') wordsFB.push(token.toLowerCase());
        if(source == 'twitter') wordsTwit.push(token.toLowerCase());        
        if(source == 'reddit') wordsRddt.push(token.toLowerCase());
      });
     });         
  });
  
  var calcFrequnciesFB = sortTokens(wordsFB);
  var calcFrequnciesTwit = sortTokens(wordsTwit);
  var calcFrequnciesRddt = sortTokens(wordsRddt);

  SocialMediaAnalyzer.Visualization.createCloudChart([calcFrequnciesFB, calcFrequnciesTwit, calcFrequnciesRddt]);   
 },

//Zusammenstellen der notwendigen Daten für die Content Analyse
 createContentVisualization = function(){  
  var allData = [facebookData, twitterData, redditData];
  var sumLink = sumText = sumVideo = sumImage = 0;
  
  var sumLinkFB = sumTextFB = sumVideoFB = sumImageFB = 0;
  var sumLinkTwit = sumTextTwit = sumVideoTwit = sumImageTwit = 0;
  var sumLinkRddt = sumTextRddt = sumVideoRddt = sumImageRddt = 0;

  var types = ['link', 'text', 'video', 'image'];
  var sumsFB = [sumLinkFB, sumTextFB, sumVideoFB, sumImageFB];
  var sumsTwit = [sumLinkTwit, sumTextTwit, sumVideoTwit, sumImageTwit];
  var sumsRddt =  [sumLinkRddt, sumTextRddt, sumVideoRddt, sumImageRddt];
  var sums = [sumsFB,sumsTwit,sumsRddt];
  var result = [];
  var sumAll = 0;

  for (var i = 0;i<allData.length;i++){
    var entry = allData[i];
    var sum = 0;
    for (var j = 0;j<allData[i].length;j++){
      var element = allData[i][j];
      switch(element.content.type){
        case 'link': sums[i][0]++; sumLink++; break;
        case 'text': sums[i][1]++; sumText++; break;
        case 'video': sums[i][2]++; sumVideo++; break;
        case 'image': sums[i][3]++; sumImage++; break;
        default: break;
      }
      sum++;
    }
   sumAll = sumAll + sum;
   var src = allData[i][0].source;
   result.push({ source: src, type: types, value: sums[i], total: sum});
  }
  result.push({source: "all", type: types, value: [sumLink, sumText, sumVideo, sumImage], total: sumAll});
 
  SocialMediaAnalyzer.Visualization.createContentChart(result);
 },

//Hilfsfunktion zum Erstellen eines Objektes von Wörtern und deren Häufigkeit
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

 //Setzen der notwendigen Daten für die Posts von Facebook
  setFacebookPosts = function(){
       SocialMediaAnalyzer.Visualization.createTiles(facebookData, $facebookPostResultContainer);   
  },

//Setzen der notwendigen Daten für die Posts von Twitter
 setTwitterPosts = function(){ 
      SocialMediaAnalyzer.Visualization.createTiles(twitterData, $twitterPostResultContainer);    
  },

//Setzen der notwendigen Daten für die Posts von Reddit
  setRedditPosts = function(){
      SocialMediaAnalyzer.Visualization.createTiles(redditData, $redditPostResultContainer);      
  },

//Freischalten der Panels
  showPanels = function(){  
    $(document).trigger('onShowPanels');
  };

that.initSave = initSave
that.reset = reset;
that.checkDataSetLength = checkDataSetLength;
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