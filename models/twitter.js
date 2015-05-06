var Twit = require('twit');
var id = "twitter";  
var T = new Twit({
    consumer_key:         'jsT8x1bQpzWFvUWD10zyA'
  , consumer_secret:      '221c0J7TFprjEAmIQSdhDWzwWtPscNb8eS6jDVlc'
  , access_token:         '2289566022-Q13zR4GVQSO8qJZiIxc8ureuwJJwiw5BqFqMLxD'
  , access_token_secret:  'nXYrEgYtq3yBHJ9j6Oh44fgd6oEugOqih352VrNzcUkHu'
});
var serializer = require('./serializer');
var async = require('async');


getTwitterData = function (keyword, count, callback){  
  var twitterElements = {"data" : []};
  var c = count;
  var resultData = null;
  async.whilst(
    function() {    
        if(resultData == null){          
           return true;
        } else {
          for(var i = 0;i<resultData.length; i++){
            twitterElements.data.push(resultData[i]);
            if (twitterElements.data.length >= count){
              return false;
            }
          }          
          return true;          
        }
    },
    function( next ) {
      requestTweets(keyword, count, function( data ){
          resultData = data;
          next(null, data);  
      });   
    },
    function( err, result ) {      
      callback( twitterElements );      
    }
  );
  
}

requestTweets = function(keyword, count, callback){
  var tweets = [];
  var c = count;
  T.get('search/tweets', { q: keyword + ' since:2014-11-11', count: c, language: 'en'}, function(err, data, response) {
  
    if(err!=null){
        console.log(err)
    } else {
        var length = data.statuses.length;   
        for (var i = 0; i < length; i++) {
            var twitterElement = serializer.createMediaElement({
                                              id: 'twitter',
                                              data: data.statuses[i]
                                          });
             if (twitterElement != null) tweets.push(twitterElement);             
        }
        callback(tweets); 
    }      
  });
}
exports.getTwitterData = getTwitterData;