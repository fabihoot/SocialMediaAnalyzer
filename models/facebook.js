var token = '';
var serializer = require('./serializer');       
var https = require('https');
var async = require('async');
var graph = require('fbgraph');
var utils = require('../models/utils');

setAccessToken = function(access_token){ 
  getLongLivedAccessToken(access_token);
}

getLongLivedAccessToken = function(access_token){
  getAppData(function(appData){
    var APP_ID = appData[0];
    var APP_SECRET = appData[1];
    var path = "/oauth/access_token?" +
              "client_id=" + APP_ID + "&" + 
              "client_secret=" + APP_SECRET + "&" + 
              "grant_type=fb_exchange_token&" +
              "fb_exchange_token=" + access_token + "";
   
    graph.get(path, function(err, res) {
       token = res.access_token;
       graph.setAppSecret(APP_SECRET);    
       graph.setAccessToken(res.access_token);
     });
  });
  
}
getAppData = function(callback){
  async.parallel([
    function(next){    
    utils.getAppId(function(id){
      next(null, id);
    });
  }, 
    function(next){ 
    utils.getAppSecret(function(secret){
      next(null, secret);
    });
  }],
    function(err, results){     
     callback(results);
  });
}

getFacebookData = function(search_word, count, callback){
  getFBPages(search_word, count, function(result){    
    callback(result);
  });
}

getFBPages = function(search_word, count, callback){
  var facebookFeedEntries  = {"data" : []};
  var resultData = null;
  var path = '/search?q=' + search_word + '&type=page&limit='+ count + '&locale=en_US';
  var options = {
      timeout: 5000,
      pool:     { maxSockets:  Infinity },
      headers:  { connection:  "keep-alive" }
  };   
    
  async.whilst(
  function() {

  if(resultData == null){          
     return true;
  } else {
    for(var i = 0;i<resultData.length; i++){              
      facebookFeedEntries.data.push(resultData[i]);           
      if (facebookFeedEntries.data.length >= count){        
        return false;
      }
    }      
    return true;    
  }

  },
  function( next ) {
  graph
    .setOptions(options)
    .setAccessToken(token)
    .get(path, function(err, res) {
      if (err) console.log(err);         
      path = res.paging.next;     
       getFBFeedEntries(res.data, function( entries ){        
         resultData = entries;
         next(null, entries);
      });
    }); 

  },
  function( err, result ) {    
    callback( facebookFeedEntries );      
  }); 

}

getFBFeedEntries = function(array, callback){
    
    async.times(array.length, function(n, next){
   
     getFBFeedEntry( array[n].id, function( err, entry ){ 
      next( err, entry );
     })

    }, function(err, entries) {
    var array = [];
    for(var i = 0;i<entries.length;i++){
      if(entries[i] != null) array.push(entries[i]);
    }     
      callback(array);
    });
}

getFBFeedEntry = function(page_id, callback){
  
  graph.setAccessToken(token)
       .get('/'+ page_id + '/feed?limit=1', function(err, res) { 
  if (err) console.log(err); 
  if(res.data.length > 0){
    var facebookElement = serializer.createMediaElement({
                                 id: 'facebook',
                                 data: res.data[0]
                             });        
    
     if (facebookElement != null){
      getLikes(facebookElement.id, function( likes ){
       facebookElement.votes.likes = likes;
       callback(null, facebookElement);   
      });
     } else {
       callback(null, null);
     }
   }  else {
    callback(null, null);
   }
    
           
  });
}
getLikes = function(post_id, callback){
  graph.setAccessToken(token)
       .get('/' + post_id + '/likes?summary=true', function(err, res) { 
    callback(res.summary.total_count);
  }); 
}
exports.getFacebookData = getFacebookData;
exports.setAccessToken = setAccessToken;