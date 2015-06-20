var fs = require('fs');

//Hilfsklasse zum Auslesen der Logindaten die in der conifg.json gespeichert sind

//FB App ID auslesen
getFBAppId = function (callback){	
	fs.readFile('./config/config.json', function(err, data){
		if (err) console.error(err);
		var obj = JSON.parse(data);		
		var appId = obj.facebook.appId;		
		callback(appId);
	});
}

//FB App Secret auslesen	
getFBAppSecret = function (callback){	
	fs.readFile('./config/config.json', function(err, data){
		if (err) console.error(err);
		var obj = JSON.parse(data);		
		var appSecret = obj.facebook.appSecret;		
		callback(appSecret);
	});
}

//Reddit Login Daten auslesen
getRedditLogins = function(callback){

	fs.readFile('./config/config.json', function(err, data){
		if (err) console.error(err);
		var obj = JSON.parse(data);		
		var data = {
			username: "",
			password:"",
			client_key:"",
			client_secret:""
		};
		
		data.username = obj.reddit.username;
		data.password = obj.reddit.password;  
		data.client_key = obj.reddit.client_key; 
		data.client_secret = obj.reddit.client_secret;				
		
		callback(data);
	});
}

//Twitter Login Daten auslesen
getTwitterLogins = function(callback){

	fs.readFile('./config/config.json', function(err, data){
		if (err) console.error(err);
		var obj = JSON.parse(data);		
		var data = {
			consumer_key: "",
			consumer_secret:"",
			access_token:"",
			access_token_secret:""
		};
		
		data.consumer_key = obj.twitter.consumer_key;
		data.consumer_secret = obj.twitter.consumer_secret;  
		data.access_token = obj.twitter.access_token; 
		data.access_token_secret = obj.twitter.access_token_secret;				
		
		callback(data);
	});
}
//exports.method = method;

exports.getTwitterLogins = getTwitterLogins;
exports.getRedditLogins = getRedditLogins;
exports.getFBAppId = getFBAppId;
exports.getFBAppSecret = getFBAppSecret;