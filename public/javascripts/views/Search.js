SocialMediaAnalyzer.Search = (function() {
	var that = {},

	init = function() {
		console.log("init Search.js");
	},

  setTwitterPosts = function(json){
    var twitterData = {
          object: json
      },
      directive = {
         'li':{
           'content<-object':{
              'span':function(a){
                return this.text;
              }
            }
          }
      };      
      $( '#twitter-post-result' ).render( twitterData, directive );
  },

  setRedditPosts = function(json){
    var redditData = {
          object: json
      },
      directive = {
         'li':{
           'content<-object':{
              'span':function(a){
                return this.text;
              }
            }
          }
      };      
      $( '#reddit-post-result' ).render( redditData, directive );
  },

  setFacebookPosts = function(json){
    var facebookData = {
          object: json
      },
      directive = {
         'li':{
           'content<-object':{
              'span':function(a){
                return this.text;
              }
            }
          }
      };      
      $( '#facebook-post-result' ).render( facebookData, directive );
  },

	showPanels = function(){
	var $panelOne = $('#panel-heading-one');
 	var $panelTwo = $('#panel-heading-two');
 	var $panelThree = $('#panel-heading-three');
 	var $panelFour = $('#panel-heading-four');
 	
	$panelOne.fadeIn(500, function(){     
       $panelTwo.fadeIn(500, function(){
          $panelThree.fadeIn(500, function(){
             $panelFour.fadeIn(500, function(){
       
             });
          });
       });
    });
	};
   that.init = init;
   that.showPanels = showPanels;
   that.setTwitterPosts = setTwitterPosts;
   that.setFacebookPosts = setFacebookPosts;
   that.setRedditPosts = setRedditPosts;

   return that;
}());
