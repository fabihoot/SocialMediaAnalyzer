var my_access_token = '';
var id = 'facebook';
var optionsgetFB;
var optionsgetFBFeed;
var serializer = require('./serializer');       
var https = require('https');


initSiteOptions = function(search_word){
  optionsgetFB = {
        host :    'graph.facebook.com',
        port :    443,
        path :    '/search?q=' + search_word + '&type=page&limit=5&access_token=' +  my_access_token,
        method :  'GET'
  };
}

initFeedOptions = function(page_id){
  console.log('init feed options');
  optionsgetFBFeed  = {
        host :    'graph.facebook.com',
        port :    443,
        path:     '/'+ page_id + '/feed?limit=10&access_token=' +  my_access_token,
        method :  'GET'
  };
}

getFacebookData = function(search_word, callback){   
  initSiteOptions(search_word);
  var reqGetFB = https.request(optionsgetFB, function(res) {
      
      var content = '';   
      res.on('data', function(data) {
                
          content += data;   
                   
      });

      res.on('end', function(data) {     
        var formatedJSON = JSON.parse(content);         
        getFacebookFeed(formatedJSON.data, function( data ){
          callback( data );
        });
      });

  });   
   
  reqGetFB.end();
  reqGetFB.on('error', function(e) {
      console.error(e);
  });
}

getFacebookFeed = function(array, callback) {
    var facebookElements  = {"data" : []};
    for(var i in array){    

        var page_id = array[i].id;        
        initFeedOptions(page_id);
        var reqGetFBFeed = https.request(optionsgetFBFeed, function(res) {
            var content = ''; 
            res.on('data', function(data) { 
            content += data; 
            });

            res.on('end', function() {

            var formatedJSON = JSON.parse(content);
            var array = formatedJSON.data;
                for (var i in array){
                  var msg = array[i].message;                  
                  var facebookElement = serializer.createMediaElement({
                                              id: 'facebook',
                                              data: array[i]
                                          });          
                  //TODO: send response to client
                  facebookElements.data[i] = facebookElement;
                }
                callback(facebookElements);
            });
        });

    reqGetFBFeed.end();
    reqGetFBFeed.on('error', function(e) {
      console.error(e);
    });
  }
 
}
exports.getFacebookData = getFacebookData;