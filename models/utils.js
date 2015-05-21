var fs = require('fs');

getAppId = function (callback){	
	fs.readFile('./config/config.json', function(err, data){
		if (err) console.error(err);
		var obj = JSON.parse(data);		
		var appId = obj.facebook.appId;		
		callback(appId);
	});
}	
getAppSecret = function (callback){	
	fs.readFile('./config/config.json', function(err, data){
		if (err) console.error(err);
		var obj = JSON.parse(data);		
		var appSecret = obj.facebook.appSecret;		
		callback(appSecret);
	});
}
//exports.method = method;
exports.getAppId = getAppId;
exports.getAppSecret = getAppSecret;