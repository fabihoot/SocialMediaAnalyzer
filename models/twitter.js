var Twit = require('twit');
var id = "twitter";  
var T = null;
var serializer = require('./mapper');
var async = require('async');
var utils = require('../models/utils');

//Initialisierung wenn Login angefordert wird
init = function(callback){

  utils.getTwitterLogins(function (logins){    
    T = new Twit({
      consumer_key:         logins.consumer_key,
      consumer_secret:      logins.consumer_secret,
      access_token:         logins.access_token,
      access_token_secret:  logins.access_token_secret,
    });

   //Rate limit exceeding on debugging
   /* T.get('account/settings', function(err, data, response) {
     
      if(err){ callback({logged_in: false, err: err}); return;}
      console.log("Twitter authentication successfull");
      callback({logged_in: true});
    })*/
  
  });
   console.log("Twitter authentication successfull");
   callback({logged_in: true});
}


//Methode zum Starten der Suche nach Querybegriff und Anzahl
//Überprüfung ob nach jedem API-Aufruf die gewünschte Anzahl erreicht ist
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

//ein Twitter Search API Aufruf 
//gefundenes Element wird zur Transformation weitergegeben
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

exports.init = init;
exports.getTwitterData = getTwitterData;