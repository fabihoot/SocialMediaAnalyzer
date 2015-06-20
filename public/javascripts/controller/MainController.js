SocialMediaAnalyzer.MainController = (function() {
	var that = {},

	//Initialisiert alle anderen notwendigen Controller 
	init = function() {		
		SocialMediaAnalyzer.VisualizationController.init();
		SocialMediaAnalyzer.LoginController.init();	
		SocialMediaAnalyzer.IndexController.init();					
	};

	that.init = init;	
	return that;
}());