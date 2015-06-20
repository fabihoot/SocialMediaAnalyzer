var token = '';
var serializer = require('./serializer');       
var https = require('https');
var async = require('async');
var graph = require('fbgraph');
var utils = require('../models/utils');

//Initialisierung wenn Login angefordert wird
init = function(access_token, callback){ 
  getLongLivedAccessToken(access_token, function(data){
    callback(data);
  });
}

//Hilfsmethode zum setzen des langlebigen Access Tokens
setToken = function(t){
  token = t;
}

//Anforderung des langlebigen Access Tokens
getLongLivedAccessToken = function(access_token, callback){
  getAppData(function(appData){
    var APP_ID = appData[0];
    var APP_SECRET = appData[1];
    var path = "/oauth/access_token?" +
              "client_id=" + APP_ID + "&" + 
              "client_secret=" + APP_SECRET + "&" + 
              "grant_type=fb_exchange_token&" +
              "fb_exchange_token=" + access_token + "";
    var options = {      
      pool:     { maxSockets:  Infinity },
      headers:  { connection:  "keep-alive" }
    };
   
    graph
    .setOptions(options)
    .get(path, function(err, res) {
       if(res == null){ console.log(err); callback({logged_in: false, err: "Cannot login to Facebook!"}); return;}
       if(err){ console.log(res); console.log(err); callback({logged_in: false, err: err}); return;}
       console.log('Facebook authentication successfull');       
       setToken(res.access_token);
       graph.setAppSecret(APP_SECRET);    
       graph.setAccessToken(res.access_token);
       callback({logged_in: true});  
     });
  });
  
}

//Abfrage der Konfigurationsvariablen aus der Datei config.json
getAppData = function(callback){
  async.parallel([
    function(next){    
    utils.getFBAppId(function(id){
      next(null, id);
    });
  }, 
    function(next){ 
    utils.getFBAppSecret(function(secret){
      next(null, secret);
    });
  }],
    function(err, results){     
     callback(results);
  });
}

//Ausführen eines Requests
getFacebookData = function(search_word, count, callback){
  getFBPages(search_word, count, function(result){    
    callback(result);
  });
}

//Abfrage der FB Seiten nach ihren IDs 
getFBPages = function(search_word, c, callback){
  var facebookFeedEntries  = {"data" : []};
  var resultData = null;
  var count = Math.floor(c/10);
  var path = '/search?q=' + search_word + '&type=page&limit='+ count + '&locale=en_US';
  var options = {      
      pool:     { maxSockets:  Infinity },
      headers:  { connection:  "keep-alive" }
  };   
    
  async.whilst(
  function() {

  if(resultData == null){          
     return true;
  } else {

    for(var i = 0;i<resultData.length; i++){              
      if(resultData.length>0) facebookFeedEntries.data.push(resultData[i]);
      console.log("current length: " +facebookFeedEntries.data.length);           
      if (facebookFeedEntries.data.length >= c){        
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
    
      if (err) {
        console.log("ERROR GETTING IDS");
        console.log(res);
        console.log("path: " + path);        
        callback({'error': err});
      return;
      }
     
      path = res.paging.next;
     
      if(res.paging.next=='undefined' || res.paging.next==undefined) {console.log(res); callback(facebookFeedEntries); return;}         
       getFBFeed(res.data, function( entries ){  
        console.log("valid entries from feed: " + entries.length);          
        resultData = entries;
        next(null, entries);
      });
    }); 
   

  },
  function( err, result ) {    
    callback( facebookFeedEntries );      
  }); 

}

//Abfrage eines Feeds einer Seite 
getFBFeed = function(array, callback){
    
    async.times(array.length, function(n, next){
    
     getFBFeedEntry( array[n].id, function( err, entry ){       
      next( err, entry );
     })

    }, function(err, entries) {
    var array = [];    
    if(entries.length > 0){
    for(var i = 0;i<entries.length;i++){
      if(entries[i] != null){
        for (var j = 0;j<entries[i].length;j++){
          if(entries[i][j] != null) array.push(entries[i][j]);        
        }
      }
    }   
      callback(array);
    } else {
      callback([]);
    }
    });
}

//Abfrage von 10 Feedeinträgen auf einer Seite
getFBFeedEntry = function(page_id, callback){   
  var options = {
      timeout: 15000,      
      pool:     { maxSockets:  Infinity },
      headers:  { connection:  "keep-alive" }
  }; 
  graph
  .setOptions(options)
  .setAccessToken(token)
  .get('/'+ page_id + '/feed?limit=10', function(err, res) {
 
  if(res == null){ console.log(err); console.log("res is null"); callback(null, null); return;}  
  if (err) {
        console.log("ERROR GETTING FEED ENTRIES");
        console.log(err);
        console.log("RESPONSE: " + res);        
        callback(null, null);
      return;
  }
 
  async.times(res.data.length, function(n, next){
   
    formatFBPosts( res.data[n], function( err, entry ){               
        next( err, entry );
    })
  },
  function(err, entries) {  
    callback(null, entries);
  });
           
  });
}

//Transformierung eines Facebook Feed Eintrages in gemeinsames Element
formatFBPosts = function(element, callback){ 
  var facebookElement = serializer.createMediaElement({
                                 id: 'facebook',
                                 data: element
                             });        
    
     if (facebookElement != null) {     
      getLikes(facebookElement.id, function( likes ){
       facebookElement.votes.likes = likes;
        callback(null, facebookElement);       
      });
     } else {
      callback(null, null);
     }
   
}

//Separate Abfrage von Likes des Beitrages
getLikes = function(post_id, callback){
  graph.setAccessToken(token)
       .get('/' + post_id + '/likes?summary=true', function(err, res) {       
    callback(res.summary.total_count);
  }); 
}
exports.getFacebookData = getFacebookData;
exports.init = init;