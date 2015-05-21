SocialMediaAnalyzer.Search = (function() {
	var that = {},

	init = function() {
		console.log("init Search.js");
    initListener();
	},

  initListener = function(){
    $(document).on('onShowPanels', showPanels);
  },
  
	showPanels = function(){
    console.log("show Panels");
  };

   that.init = init;
   that.showPanels = showPanels;
   return that;
}());
