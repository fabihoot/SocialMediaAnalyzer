var fs = require('fs');

getFBAppId = function (callback){	
	fs.readFile('./config/config.json', function(err, data){
		if (err) console.error(err);
		var obj = JSON.parse(data);		
		var appId = obj.facebook.appId;		
		callback(appId);
	});
}	
getFBAppSecret = function (callback){	
	fs.readFile('./config/config.json', function(err, data){
		if (err) console.error(err);
		var obj = JSON.parse(data);		
		var appSecret = obj.facebook.appSecret;		
		callback(appSecret);
	});
}
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
//exports.method = method;
exports.getRedditLogins = getRedditLogins;
exports.getFBAppId = getFBAppId;
exports.getFBAppSecret = getFBAppSecret;