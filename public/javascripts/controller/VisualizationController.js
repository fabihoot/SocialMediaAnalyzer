SocialMediaAnalyzer.VisualizationController = (function() {
var that = {},
facebookData = null,
twitterData = null,
redditData = null,

 init = function() {
      console.log("init VisualizationController");
      initButtons();           
 },

 initButtons = function(){
 	var $generalPanel = $('#panel-heading-one');

 	$generalPanel.click(function(){
 		SocialMediaAnalyzer.Visualization.createVoteVisualization(returnVoteArray());
 	});
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

 returnVoteArray = function(){ 	
 	var fbVotes = 0;
 	var twitterVotes = 0;
 	var redditVotes = 0;
 	for(var i = 0;i<facebookData.length;i++) fbVotes = fbVotes + facebookData[i].votes.likes;
 	for(var i = 0;i<twitterData.length;i++) twitterVotes = twitterVotes + twitterData[i].votes.retweets;
 	for(var i = 0;i<redditData.length;i++) redditVotes = redditVotes + redditData[i].votes.score;
 	return [fbVotes, twitterVotes, redditVotes];
 }; 


that.setFacebookData = setFacebookData;
that.setTwitterData = setTwitterData;
that.setRedditData = setRedditData;
that.init = init;
return that;
}());