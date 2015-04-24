var Twit = require('twit');
var id = "twitter";  
var T = new Twit({
    consumer_key:         'jsT8x1bQpzWFvUWD10zyA'
  , consumer_secret:      '221c0J7TFprjEAmIQSdhDWzwWtPscNb8eS6jDVlc'
  , access_token:         '2289566022-Q13zR4GVQSO8qJZiIxc8ureuwJJwiw5BqFqMLxD'
  , access_token_secret:  'nXYrEgYtq3yBHJ9j6Oh44fgd6oEugOqih352VrNzcUkHu'
});
var serializer = require('./serializer');


getTwitterData = function (keyword, count, callback){  
  var twitterElements = {"data" : []};
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
             //TODO: send response to client
             twitterElements.data[i] = twitterElement;             
        }
        callback(twitterElements); 
    }      
  });
}
exports.getTwitterData = getTwitterData;