var my_access_token = '';
var id = 'facebook';
var optionsgetFB;
var optionsgetFBFeed;
var serializer = require('./serializer');       
var https = require('https');
var async = require('async');


initSiteOptions = function(search_word, count){
var c = count / 10;  
  optionsgetFB = {
        host :    'graph.facebook.com',
        port :    443,
        path :    '/search?q=' + search_word + '&type=page&limit='+ c + '&access_token=' +  my_access_token + '&locale=en_US',
        method :  'GET'
  };
}

initFeedOptions = function(page_id){  
  optionsgetFBFeed  = {
        host :    'graph.facebook.com',
        port :    443,
        path:     '/'+ page_id + '/feed?limit=10&access_token=' +  my_access_token + '&locale=en_US',
        method :  'GET'
  };
}

getFacebookData = function(search_word, count, callback){   
  initSiteOptions(search_word, count);
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
    var facebookFeedEntries  = {"data" : []};
    
    async.times(array.length, function(n, next){
   
     requestFacebookFeedEntries( array[n].id, function( err, entry ){ 
      next( err, entry );
     })

    }, function(err, entries) {
      console.log(err);

      for (var i = 0;i<entries.length;i++){
        for(var j = 0;j<entries[i].length;j++){

          facebookFeedEntries.data.push(entries[i][j]);
          
        }       
      }      
     
      callback(facebookFeedEntries);
    });

}

requestFacebookFeedEntries = function(page_id, callback){
        var facebookElements = [];             
        initFeedOptions(page_id);
        var reqGetFBFeed = https.request(optionsgetFBFeed, function(res) {
            var content = ''; 

            res.on('data', function(data) { 
            content += data; 
            });

            res.on('end', function() {
            var entriesForOneFeed = JSON.parse(content);            
            var array = entriesForOneFeed.data;           
            for (var i in array){                             
              var facebookElement = serializer.createMediaElement({
                                          id: 'facebook',
                                          data: array[i]
                                      });        
             
             
              facebookElements.push(facebookElement);
             
              
            }           
            callback(null, facebookElements);  
            });
        });

    reqGetFBFeed.end();
    reqGetFBFeed.on('error', function(e) {
      console.error(e);
    });
   
}
exports.getFacebookData = getFacebookData;