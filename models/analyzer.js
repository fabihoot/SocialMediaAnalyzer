var sentiment = require('sentiment');
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();

analyzeMediaElement = function(mediaElement){
		tokenizeText(mediaElement.text);
		var sent = sentiment(mediaElement.text);
		//console.log("Sentiment Score / Comparison: " + sent.score + " / " + sent.comparison);	
}

tokenizeText = function(text){
	var tokens = [];
	tokens = tokenizer.tokenize(text);
	stemTokens(tokens);	
}

stemTokens = function(tokens){
	for (var i = 0; i < tokens.length; i++){
		tokens[i] = natural.PorterStemmer.stem(tokens[i]);		
	}

}

exports.analyzeMediaElement = analyzeMediaElement;