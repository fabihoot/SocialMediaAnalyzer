var my_access_token = '';
var serializer = require('./serializer');       
var https = require('https');
var async = require('async');
var graph = require('fbgraph');

setAccessToken = function(access_token){ 
  my_access_token = access_token;
}

getFacebookData = function(search_word, count, callback){
  getFBPages(search_word, count, function(result){    
    callback(result);
  });
}

getFBPages = function(search_word, count, callback){
  var facebookFeedEntries  = {"data" : []};
  var resultData = null;
  var path = '/search?q=' + search_word + '&type=page&limit='+ count + '&access_token=' +  my_access_token + '&locale=en_US';
  var options = {
      timeout:  3000,
      pool:     { maxSockets:  Infinity },
      headers:  { connection:  "keep-alive" }
  };   
    
  async.whilst(
  function() {

  if(resultData == null){          
     return true;
  } else {
    for(var i = 0;i<resultData.length; i++){
    console.log(resultData[i]);            
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
    .get(path, function(err, res) {         
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
  console.log(page_id);

  graph  
  .get('/'+ page_id + '/feed?limit=1&access_token=' +  my_access_token, function(err, res) { 
  
  var element = res.data[0];
  if(res.data.length > 0){
    var facebookElement = serializer.createMediaElement({
                                 id: 'facebook',
                                 data: element
                             });        
    
     if (facebookElement != null){
       callback(null, facebookElement);   
     } else {
       callback(null, null);
     }
   }  else {
    callback(null, null);
   }
    
           
  });



}
exports.getFacebookData = getFacebookData;
exports.setAccessToken = setAccessToken;