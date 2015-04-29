var sentiment = require('sentiment');
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
var analyze = require('Sentimental').analyze;
var lngDetector = new (require('languagedetect'));

analyzeMediaElement = function(mediaElement){
	
	if(mediaElement.hasOwnProperty('text') && mediaElement.text != "" && mediaElement.text != undefined ){
		
		mediaElement.lang.tokens = tokenizeText(mediaElement.text);
		mediaElement.lang.countTokens = mediaElement.lang.tokens.length;
		mediaElement.lang.probLang = checkLanguage(mediaElement.text);
		mediaElement.sentiment = sentimentAnalysis(mediaElement);
		
		return mediaElement;
	} else {
		return null;
	}	
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
	return problang[0];
}

exports.analyzeMediaElement = analyzeMediaElement;