var sentiment = require('sentiment');
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
var analyze = require('Sentimental').analyze;

analyzeMediaElement = function(mediaElement){
	
	if(mediaElement.text != "" && mediaElement.text != undefined){

		mediaElement.lang.tokens = tokenizeText(mediaElement.text);
		mediaElement.lang.countTokens = mediaElement.lang.tokens.length;
		mediaElement.sentiment = sentimentAnalysis(mediaElement);
		
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

exports.analyzeMediaElement = analyzeMediaElement;