var sentiment = require('sentiment');
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
var analyze = require('Sentimental').analyze;
var lngDetector = new (require('languagedetect'));

analyzeMediaElement = function(mediaElement){	

	if(mediaElement.hasOwnProperty('text') && mediaElement.text != "" && mediaElement.text != undefined ){

		//console.log("Source is " + mediaElement.source);		
		//console.log("Text is " + mediaElement.text);
		//console.log("Language is " + mediaElement.lang.probLang);
		//console.log("Type is " + mediaElement.type);
		mediaElement.lang.probLang = checkLanguage(mediaElement.text);
		mediaElement.lang.tokens = tokenizeText(mediaElement.text);
		mediaElement.lang.countTokens = mediaElement.lang.tokens.length;		
		mediaElement.sentiment = sentimentAnalysis(mediaElement);		
		if(mediaElement.lang.probLang != 'english'){			
			return null;
		}
		if(mediaElement.source != 'twitter'){
			mediaElement.lang.hashtags = getHashtags(mediaElement.text);
		} 		
	} else {
		return null;
	}	
	return mediaElement;
}

sentimentAnalysis = function(mediaElement){	
		//Sentiment analysis with node module 'sentiment'
		var sent = sentiment(mediaElement.text);
		//console.log("Sentiment Score / Comparison: " + sent.score + " / " + sent.comparison);
	
		//Sentiment analysis with node module 'Sentimental'
		var an = analyze(mediaElement.text); 	
		return an;			
}

tokenizeText = function(text){
	var tokens = [];	
	tokens = tokenizer.tokenize(text);
	//stemTokens(tokens);
	return tokens;	
}

stemTokens = function(tokens){
	for (var i = 0; i < tokens.length; i++){
		tokens[i] = natural.PorterStemmer.stem(tokens[i]);		
	}
}

checkLanguage = function(text){	
	var problang = lngDetector.detect(text,1);
	if(problang.length > 0){
		return problang[0][0];
	} else {
		return "Could not identify language";
	}
}

getHashtags = function(str){
	var text = str.replace(/(\r\n|\n|\r)/gm,"");
	var tagslistarr = text.split(' ');
	var arr = [];
	for(var i = 0; i<tagslistarr.length; i++){
		if(tagslistarr[i].indexOf('#') == 0){
    	  arr.push(tagslistarr[i]);  
    	}    			
	}
	return arr;
}

exports.analyzeMediaElement = analyzeMediaElement;