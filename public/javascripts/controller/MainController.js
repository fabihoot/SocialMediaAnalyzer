SocialMediaAnalyzer.MainController = (function() {
	var that = {},

	init = function() {
		console.log("init MainController");
		SocialMediaAnalyzer.VisualizationController.init();
		SocialMediaAnalyzer.LoginController.init();	
		SocialMediaAnalyzer.IndexController.init();					
	};

	that.init = init;	
	return that;
}());