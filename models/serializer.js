var analyzer = require('./analyzer');
var mediaElement = {};
var allElements = [];

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
	
	mediaElement.id 	  =	data.id;
	mediaElement.text	  =	data.text;
	mediaElement.username =	data.user.name;
	mediaElement.date 	  =	data.created_at;
	mediaElement.source   =	content.id;

	storeMediaElement(mediaElement);
	return mediaElement;
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
	
	storeMediaElement(mediaElement);
	return mediaElement;
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
	mediaElement.text		= data.selftext;
	mediaElement.username	= data.author;
	mediaElement.date 		= time;
	mediaElement.source 	= content.id;
		
	storeMediaElement(mediaElement);
	return mediaElement;
}

function storeMediaElement(mediaElement){
	analyzer.analyzeMediaElement(mediaElement);
	allElements.push(mediaElement);
}

function createNewMediaElement(){
	mediaElement = {
			id: 		"",
			text: 		"",
			username: 	"",
			date: 		"",
			source: 	"",
			lang: {
				length: "",
				tokens: [],
				countTokens: "",
				types: 	[],
				countTypes: ""
			},
			sentiment: {}
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

exports.createMediaElement = createMediaElement;