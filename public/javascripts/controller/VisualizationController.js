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

  getDirectiveImage = function(){
    directive = {
         '.tile-content':{
           'content<-':{
              '.tile-image':function(a){
                console.log("A:", a);
                console.log("this", this);
                 $('.tile-image').css('background-image', this.content.url);
                  return this.text;                  
                }
              }
            }
          
      };
      return directive; 
  },

  createTiles = function(data, container){
    addTiles(data, container);
    addText(data);
  },

  addTiles = function(data, container){
    for (var i = 0; i<data.length;i++){
      var $tile = '<div class="tile" data-role="tile">' + 
                   '<div class="tile-content slide-right-2">' + 
                    '<div class="slide">' + 
                       '<div class="tile-text text-small padding10" id="tile-text-entry-'+ data[i].source +'-'+ i + '"></div>' + 
                    '</div>' + 
                    '<div class="slide-over op-amber">' +
                       '<div class="tile-image"><img id="tile-img-entry-'+ data[i].source +'-'+ i + '"></img></div>' +                        
                    '</div>' + 
                   '</div>' + 
                 '</div>';
      $( container ).append($tile);
      var text = data[i].text;
      var url = data[i].content.url;    

      var $txtContainer = $('#tile-text-entry-'+ data[i].source +'-'+ i);
      var $imgContainer = $('#tile-img-entry-'+ data[i].source +'-'+ i);
      
      $txtContainer.text(text);
      $imgContainer.attr("src",  url);  
    }    
  },

  addText = function(data){
   
  };

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