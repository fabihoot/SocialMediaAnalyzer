var my_access_token = '';
var id = 'facebook';
var optionsgetFB;
var optionsgetFBFeed;
var serializer = require('./serializer');       
var https = require('https');
var async = require('async');
var nextLink = '';


initSiteOptions = function(search_word, count, optionsChanged, nextLink){
  if(!optionsChanged){
    
      optionsgetFB = {
            host :    'graph.facebook.com',
            port :    443,
            path :    '/search?q=' + search_word + '&type=page&limit='+ count + '&access_token=' +  my_access_token + '&locale=en_US',
            method :  'GET'
    };
  
  } else {
    optionsgetFB = {
            host :    'graph.facebook.com',              
            port :    443,
            path :    getNextLink(),
            method :  'GET'
    };
  }
}

initFeedOptions = function(page_id){  
  optionsgetFBFeed  = {
        host :    'graph.facebook.com',
        port :    443,
        path:     '/'+ page_id + '/feed?limit=1&access_token=' +  my_access_token,
        method :  'GET'
  };
}

getFacebookData = function(search_word, count, callback){
 
  var facebookFeedEntries  = {"data" : []};
  var resultData = null;
  var siteOptionsChanged = false;
  
  async.whilst(
    function() {
    
        if(resultData == null){          
           return true;
        } else {
          for(var i = 0;i<resultData.data.length; i++){
            facebookFeedEntries.data.push(resultData.data[i]);
            if (facebookFeedEntries.data.length >= count){
              return false;
            }
          }                
          siteOptionsChanged = true;               
          return true;
          
        }

    },
    function( next ) {    
    initSiteOptions(search_word, count, siteOptionsChanged, nextLink);
    var reqGetFB = https.request(optionsgetFB, function(res) {
        
        var content = '';   
        res.on('data', function(data) {
                  
            content += data;   
                     
        });
  
          res.on('end', function(data) { 

            var formatedJSON = JSON.parse(content);            
            setNextLink(formatedJSON.paging.next);

            getFacebookFeeds(formatedJSON.data, function( data ){

              resultData = data;
              next(null, data);

            });
          });
  
      });   
       
      reqGetFB.end();
      reqGetFB.on('error', function(e) {
          console.error(e);
      });
  
    },
    function( err, result ) {
      callback( facebookFeedEntries );      
    }
  );
}

getFacebookFeeds = function(array, callback) {
    var facebookFeedEntries  = {"data" : []};
    
    async.times(array.length, function(n, next){
   
     requestFacebookFeedEntries( array[n].id, function( err, entry ){ 
      next( err, entry );
     })

    }, function(err, entries) {      
      formatMappingResponse(entries, facebookFeedEntries);     
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
      callback(e, null);      
      console.error(e);
    });
   
}

formatMappingResponse = function ( array, arrayToPush ){

for (var i = 0;i<array.length;i++){
        for(var j = 0;j<array[i].length;j++){

          arrayToPush.data.push(array[i][j]);
          
        }       
}
  
}
setNextLink = function(link){
  nextLink = link;
}
getNextLink = function(){
  return nextLink;
}
exports.getFacebookData = getFacebookData;