var Snoocore = require('snoocore');
var id = "reddit";
var reddit = new Snoocore({
                      userAgent: '/u/cl4ptrap SocialMediaAnalyzer@0.0.1',
                      oauth: { 
                                type: 'script',
                                key: '', 
                                secret: '',
                                username: '',
                                password: '',
                                // make sure to set all the scopes you need.
                                scope: [ 'identity', 'read', 'vote' ] 
                              }                        
                      });
var serializer = require('./serializer');
var async = require('async');
var nextRedditLink = ""; 
var urlChanged = false;

getRedditData = function (keyword, count, callback) {
  var redditElements = {"data" : [] };
  var resultData = null;

  async.whilst(
    function() {   
        if(resultData == null){          
           return true;
        } else {
          for(var i = 0;i<resultData.length; i++){
            redditElements.data.push(resultData[i]);
            if (redditElements.data.length >= count){
              return false;
            }
          }          
          return true;          
        }
    },
    function( next ) {
      formatPosts(count, keyword, function(data){
        resultData = data;
        next(null, data);      
      });
    },
    function( err, result ) {              
      callback( redditElements );      
    }
  );
  
}

formatPosts = function(count, keyword, callback){
  var posts = [];
  requestPosts(count, keyword, function( data ){

    var resultElements = data.data.children;    
    var arrayLength = resultElements.length;
     
    for(var i = 0; i < arrayLength; i++){
      
      var content = resultElements[i].data;     
      var redditElement = serializer.createMediaElement({
                                            id: 'reddit',
                                            data: content
                                        });     
    if(redditElement != null) posts.push(redditElement);

    }
    callback(posts);
  });
}

requestPosts = function(count, keyword, callback){
  if(!urlChanged){   
    var params = {limit: count, q: keyword}
  } else {   
    var params = {limit: count, after: getNextRedditLink(), q: keyword}; 
  }
  reddit('/search/').get(params).then(function(data){
    console.log(data);
    setNextRedditLink(data.data.after);
    changeURL();
    callback(data);
  });
}

setNextRedditLink = function(link){ 
  nextRedditLink = link;
}
getNextRedditLink = function(){
  return nextRedditLink;
}
changeURL = function(){
  urlChanged = true;
}

exports.getRedditData = getRedditData;