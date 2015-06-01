SocialMediaAnalyzer.VisualizationController = (function() {
var that = {},
facebookData = null,
twitterData = null,
redditData = null,

 init = function() {
      console.log("init VisualizationController.js");
      initButtons();           
 },

 initButtons = function(){
 	
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
      $( '#twitter-post-result' ).render( twitterData, getDirective() );
  },

  setRedditPosts = function(){
      createTiles(redditData);               
      //$( '#reddit-post-result' ).render( redditData, getDirectiveText() );
  },

  setFacebookPosts = function(){         
      $( '#facebook-post-result' ).render( facebookData, getDirective() );
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

  createTiles = function(data){
    addTiles(data);
    addText(data);
  },

  addTiles = function(data){
    for (var i = 0; i<data.length;i++){
      var $tile = '<div class="tile" data-role="tile">' + 
                   '<div class="tile-content slide-up">' + 
                    '<div class="slide">' + 
                       '<div class="tile-image"><img id="tile-img-entry-' + i + '"></img></div>' + 
                    '</div>' + 
                    '<div class="slide-over">' + 
                       '<div class="tile-text" id="tile-text-entry-'+ i + '"></div>' + 
                    '</div>' + 
                   '</div>' + 
                 '</div>';
      $( '#reddit-post-result' ).append($tile);
      var text = data[i].text;
      var url = data[i].content.url;    

      var $txtContainer = $('#tile-text-entry-'+ i);
      var $imgContainer = $('#tile-img-entry-' + i);
      console.log(url);
      $txtContainer.text(text);
      $imgContainer.attr("src",  url);  
    }    
  },

  addText = function(data){
   
  },

  getDirectiveText = function(){
    directive = {
       '.tile':{
        'content<-':{
         '.slide-over':{
           'content<-':{
              '.tile-text':function(a){              	
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
        }
      }
      };
      return directive; 
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
  };;


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