SocialMediaAnalyzer.MainController = (function() {
	var that = {},

	init = function() {
		console.log("init MainController");
		SocialMediaAnalyzer.IndexController.init();		
	};

	that.init = init;	
	return that;
}());