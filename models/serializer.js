var analyzer = require('./analyzer');
var mediaElement = {};


function createMediaElement(object){
	var element = {};
	switch(object.id){
		case 'twitter': 	element = twitterData(object); break;
		case 'facebook': 	element = facebookData(object); break;
		case 'reddit': 		element = redditData(object); break;
		default: 			element = console.error('invalid media id');

	}
	return element;
}

function twitterData(content){
	//ID: 		data.id
	//text: 	data.text
	//username: data.user.name
	//date: 	data.created_at	
	
	var data = content.data;
	var mediaElement = createNewMediaElement();
		
	mediaElement.id 	  =	data.id_str;
	mediaElement.text	  =	data.text;
	mediaElement.username =	data.user.name;
	mediaElement.date 	  =	data.created_at;
	mediaElement.type 	  = "text";
	mediaElement.source   =	content.id;
	mediaElement.lang.hashtags = formatHashtagArray(data.entities.hashtags);
	if(data.entities.urls.length > 0){
		var tempURL = data.entities.urls[0].expanded_url;
		
		if(getFileExtension(tempURL) == "jpg" || getFileExtension(tempURL) == "jpeg" || getFileExtension(tempURL) == "png" ){
			mediaElement.content.type = 'image';
	 	 	mediaElement.content.url = tempURL;	 	 	
	 	 } else {
	 	 	mediaElement.content.type = 'link';
			mediaElement.content.url = tempURL;
	 	 }	 
	} else {
		mediaElement.content.type = 'text';
		mediaElement.content.url = "https://twitter.com/"+ data.user.screen_name + "/status/" + data.id_str;
	}	

	mediaElement.votes.retweets = data.retweet_count;
	mediaElement.votes.favorites = data.favorite_count;
	
	return storeMediaElement(mediaElement);
}

function facebookData(content){
	//ID: 		data.id
	//text: 	data.message
	//username: data.from.name
	//date: 	data.created_time
	var data = content.data;
	var mediaElement = createNewMediaElement(); 	
	
	mediaElement.id 		= data.id;
	mediaElement.text		= data.message;
	mediaElement.username	= data.from.name;
	mediaElement.date 		= data.created_time;	
	mediaElement.source		= content.id;	

	if(data.hasOwnProperty('type')){
		if(data.type == 'photo'){
			mediaElement.content.type = 'image';
		} else if(data.type == 'status'){
			mediaElement.content.type = 'text';
		} else if(data.type == 'video'){
			mediaElement.content.type = 'video';
		} else if(data.type == 'link'){
			mediaElement.content.type = 'link';
		}
		if(data.hasOwnProperty('link')){
			mediaElement.content.url = data.link;
		}
		if(data.hasOwnProperty('picture')){
			mediaElement.content.thumbnail = data.picture;
		}
	}
	var likes = 0
	if(data.hasOwnProperty('likes')){
	  likes = data.likes.data.length;
	} 	
	mediaElement.votes.likes = likes;  

	var shares = 0;
	if(data.hasOwnProperty('shares')){
	  shares = data.shares.count;
	} 
	mediaElement.votes.shares = shares;  
	
	return storeMediaElement(mediaElement);
}

function redditData(content){
	//ID: 		data.id;
	//text: 	data.selftext
	//username: data.author
	//date: 	data.created
		
	var data = content.data;	
	var time = timeConverter(data.created);
	var mediaElement = createNewMediaElement();	
	
	mediaElement.id 		= data.id;
	if (data.selftext == ""){
		mediaElement.text	= data.title;
	} else {
		mediaElement.text   = data.selftext;
	}	

	if(data.hasOwnProperty('url')){	 
	 if(data.hasOwnProperty('domain')){
	 	if (data.domain == 'imgur.com' || data.domain == 'i.imgur.com'){
	 	 mediaElement.content.type = 'image';
	 	 mediaElement.content.thumbnail = data.thumbnail;
	 	 
	 	 if(getFileExtension(data.url) == "jpg" || getFileExtension(data.url) == "jpeg" || getFileExtension(data.url) == "png" ){
	 	 	mediaElement.content.url = data.url;	 	 	
	 	 } 
	 	} else if(data.domain == 'youtube.com'){
	 		mediaElement.content.type = 'video';	 		
	 	} else {
	 		mediaElement.content.type = 'text';	
	 	}
	 }
	 mediaElement.content.url = data.url;
	} 	

	mediaElement.username	= data.author;
	mediaElement.date 		= time;	
	mediaElement.source 	= content.id;	
	
	mediaElement.votes.upvotes = data.ups;
	mediaElement.votes.downvotes = data.downs;
	mediaElement.votes.score = data.score;
	
	return storeMediaElement(mediaElement);
}

function storeMediaElement(mediaElement){
	var analyzedMediaElement = analyzer.analyzeMediaElement(mediaElement);	
	return analyzedMediaElement;
}

function createNewMediaElement(){
	mediaElement = {
			id: 		"",
			text: 		"",
			username: 	"",
			date: 		"",
			source: 	"",
			type: 		"",
			lang: {
				probLang: "",
				length: "",
				tokens: [],
				tokensStopword: [],
				countTokens: "",
				types: 	[],
				countTypes: "",
				hashtags: []
			},
			sentiment: {},
			content:{
				type: "",
				url: "",
				thumbnail: ""				
			},
			votes: {
				likes: "",
				shares: "",
				retweets: "",
				favorites: "",
				upvotes: "",
				downvotes: "",
				score: ""
			}
		}
		return mediaElement;
}

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp*1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

function getFileExtension(filename){	
	return  filename.substr(filename.lastIndexOf('.')+1);
}

function formatHashtagArray(array){
	var hashtags = [];
	array.forEach(function(entry){
		hashtags.push(entry.text);
	});
	return hashtags;
}

exports.createMediaElement = createMediaElement;