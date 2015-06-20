var analyzer = require('./analyzer');
var mediaElement = {};

//Klasse zum Transformieren der unterschiedlichen Posts in ein gemeinsames Format

//Erstellen eines Elements abhängig von der Plattform
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


//Erstellen eines Twitter Elements
function twitterData(content){	
	var data = content.data;
	var mediaElement = createNewMediaElement();
	
	//Speicherung von simplen Daten	
	mediaElement.id 	  =	data.id_str;
	mediaElement.text	  =	data.text;
	mediaElement.username =	data.user.name;
	mediaElement.date 	  =	data.created_at;
	mediaElement.type 	  = "text";
	mediaElement.source   =	content.id;
	mediaElement.lang.hashtags = formatHashtagArray(data.entities.hashtags);

	//Speicherung des Contents abhängig vom Typ
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

	//Speicherung von Retweets und Favoriten
	mediaElement.votes.retweets = data.retweet_count;
	mediaElement.votes.favorites = data.favorite_count;
	
	return storeMediaElement(mediaElement);
}

//Erstellen eines Facebook Elements
function facebookData(content){
	
	var data = content.data;
	var mediaElement = createNewMediaElement(); 	
	
	//Speicherung von simplen Daten	
	mediaElement.id 		= data.id;
	mediaElement.text		= data.message;
	mediaElement.username	= data.from.name;
	mediaElement.date 		= data.created_time;	
	mediaElement.source		= content.id;	

	//Speicherung des Contents abhängig vom Typ
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

	//Abfragen von Likes und Shares
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

//Erstellen eines Reddit Elements
function redditData(content){
	
	var data = content.data;	
	var time = timeConverter(data.created);
	var mediaElement = createNewMediaElement();	
	
	//Überprüfen ob Text Inhalt hat oder nicht
	mediaElement.id 		= data.id;
	if (data.selftext == ""){
		mediaElement.text	= data.title;
	} else {
		mediaElement.text   = data.selftext;
	}	

	//Speicherung des Contents abhängig vom Typ
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

	//Speicherung von simplen Daten	
	mediaElement.username	= data.author;
	mediaElement.date 		= time;	
	mediaElement.source 	= content.id;	
	
	//Speichen der Votings, evtl werden zukünftigt wieder Up- und Downvotes mit der API geliefert
	mediaElement.votes.upvotes = data.ups;
	mediaElement.votes.downvotes = data.downs;
	mediaElement.votes.score = data.score;
	
	return storeMediaElement(mediaElement);
}


//Analysieren eines transformierten Elements
function storeMediaElement(mediaElement){
	var analyzedMediaElement = analyzer.analyzeMediaElement(mediaElement);	
	return analyzedMediaElement;
}

//Erstellen eines neuen Objekts nach einem Schema
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

//Hilfsfunktion zum Konvertieren von UNIX Zeitstempeln
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

//Hilfsfunktion zum Erkennen von Dateiendungen
function getFileExtension(filename){	
	return  filename.substr(filename.lastIndexOf('.')+1);
}

//Hilfsfunktion zum Speichern von Hashtagss
function formatHashtagArray(array){
	var hashtags = [];
	array.forEach(function(entry){
		hashtags.push(entry.text);
	});
	return hashtags;
}

exports.createMediaElement = createMediaElement;