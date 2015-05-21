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
 	var $generalFrame = $('#frame-general');

 	$generalFrame.click(function(){
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
 },

 setTwitterPosts = function(){        
      $( '#twitter-post-result' ).render( twitterData, getDirective() );
  },

  setRedditPosts = function(){               
      $( '#reddit-post-result' ).render( redditData, getDirective() );
  },

  setFacebookPosts = function(){         
      $( '#facebook-post-result' ).render( facebookData, getDirective() );
  },

  getDirective = function(){
    directive = {
         '.tile':{
           'content<-':{
              '.tile-content':function(a){              	
                if(this.text.length > 100){
                  var temp = this.text.substring(0, 100);
                  temp = temp + "...";
                  return temp;
                } else {
                  return this.text;                  
                }
              }
            }
          }
      };
      return directive; 
  };

that.setFacebookData = setFacebookData;
that.setTwitterData = setTwitterData;
that.setRedditData = setRedditData;
that.setTwitterPosts = setTwitterPosts;
that.setFacebookPosts = setFacebookPosts;
that.setRedditPosts = setRedditPosts;
that.init = init;
return that;
}());