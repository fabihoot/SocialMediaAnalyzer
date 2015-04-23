var Snoocore = require('snoocore');
var id = "reddit";
var reddit = new Snoocore({
                      userAgent: 'SocialMediaAnalyzer@0.0.1 by cl4ptrap'                        
                      });
var serializer = require('./serializer'); 

getRedditData = function (keyword, callback) {
  var redditElements = {"data" : []};
    reddit.raw('http://www.reddit.com/search.json?q=' + keyword).get().then(function(result) {
      var length = result.data.children.length;    

      for(var i = 0; i < length; i++){
        var content = result.data.children[i].data;
        var redditElement = serializer.createMediaElement({
                                              id: 'reddit',
                                              data: content
                                          });

        redditElements.data[i] = redditElement;
      }

      callback(redditElements);
      
    }).done();
}

exports.getRedditData = getRedditData;