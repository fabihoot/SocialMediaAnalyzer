var sentiment = require('sentiment');
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
var analyze = require('Sentimental').analyze;
var lngDetector = new (require('languagedetect'));
var stopwordsEng = require('stopwords').english;


//Analyse eines Post Elements
//Überprüfung ob Text  valide und Sprache in Englisch
//Speichern und Zählen der Tokens 
//Berechnen des Sentiments
//Filtern der Hashtags auf Reddit und Facebook
analyzeMediaElement = function(mediaElement){	

	if(mediaElement.hasOwnProperty('text') && mediaElement.text != "" && mediaElement.text != undefined ){

		mediaElement.lang.probLang = checkLanguage(mediaElement.text);
		if(mediaElement.lang.probLang != 'english'){			
			return null;
		}
		mediaElement.lang.tokens = tokenizeText(mediaElement.text);
		mediaElement.lang.tokensStopword = getTokensAfterStopword(mediaElement.lang.tokens);
		mediaElement.lang.countTokens = mediaElement.lang.tokens.length;		
		mediaElement.sentiment = sentimentAnalysis(mediaElement);		
		if(mediaElement.source != 'twitter'){
			mediaElement.lang.hashtags = getHashtags(mediaElement.text);
		} 		
	} else {		
		return null;
	}	
	return mediaElement;
}

//Methode zur Sentiment Analyse
//Momentan wird nur das Modul "Sentimental" genutzt
sentimentAnalysis = function(mediaElement){	
		//Sentiment Analyse mit node Modul 'sentiment'
		var sent = sentiment(mediaElement.text);		
	
		//Sentiment Analyse mit node Modul 'Sentimental'
		var an = analyze(mediaElement.text); 	
		return an;			
}

//Tokenisierung des Texts
tokenizeText = function(text){
	var tokens = [];	
	tokens = tokenizer.tokenize(text);	
	return tokens;	
}

//Stammformreduktion des Textes (momentan nicht genutzt)
stemTokens = function(tokens){
	for (var i = 0; i < tokens.length; i++){
		tokens[i] = natural.PorterStemmer.stem(tokens[i]);		
	}
}

//Überprüfen der Sprache auf english
checkLanguage = function(text){	
	var problang = lngDetector.detect(text,1);
	if(problang.length > 0){
		return problang[0][0];
	} else {
		return "Could not identify language";
	}
}

//Filtern der Hashtags
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

//stoppwort-bereinigte Tokenliste erstellen
getTokensAfterStopword = function(tokens){
	var stopwordTokens = [];
	
	tokens.forEach(function(token){		
		if(!(stopwordsEng.indexOf(token.toLowerCase()) > -1)){			
		 stopwordTokens.push(token);
		}
	});	
	return stopwordTokens;
}

exports.analyzeMediaElement = analyzeMediaElement;