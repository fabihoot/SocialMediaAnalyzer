var Snoocore = require('snoocore');
var id = "reddit";
var reddit = new Snoocore({
                      userAgent: 'SocialMediaAnalyzer@0.0.1 by cl4ptrap'                        
                      });
var serializer = require('./serializer'); 

getRedditData = function (keyword, count, callback) {
  
  getPosts(count, keyword, function(data){

    var resultElements = data;    
    var redditElements = {"data" : [] };
    var arrayLength = resultElements.length;
     
    for(var i = 0; i < arrayLength; i++){
      
      var content = resultElements[i].data;     
      var redditElement = serializer.createMediaElement({
                                            id: 'reddit',
                                            data: content
                                        });
      redditElements.data.push(redditElement);

    }
    callback(redditElements);
  });
}

getPosts = function(count, keyword, callback){

  var children = [];

  function handleSlice(slice) {    
    if (children.length >= count) {
      callback(children);
      return;      
    }

    for (var i = 0; i < slice.children.length;i++){
       if (children.length <= count) {
        children = children.concat(slice.children[i]);
       }
    }    
    
    return slice.next().then(handleSlice);
  }

  return reddit.raw('http://www.reddit.com/search.json?q=' + keyword)
               .listing({limit: count})
               .then(handleSlice);
}


exports.getRedditData = getRedditData;