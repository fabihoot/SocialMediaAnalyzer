var sentiment = require('sentiment');

analyzeMediaElement = function(mediaElement){
		var sent = sentiment(mediaElement.text);
		//console.log("Sentiment Score / Comparison: " + sent.score + " / " + sent.comparison);
	
}

exports.analyzeMediaElement = analyzeMediaElement;