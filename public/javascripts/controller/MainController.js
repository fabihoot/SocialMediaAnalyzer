SocialMediaAnalyzer.MainController = (function() {
	var that = {},

	init = function() {
		console.log("init MainController");
		SocialMediaAnalyzer.LoginController.init();	
		SocialMediaAnalyzer.IndexController.init();	
		SocialMediaAnalyzer.Search.init();		
	};

	that.init = init;	
	return that;
}());