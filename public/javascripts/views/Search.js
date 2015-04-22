SocialMediaAnalyzer.Search = (function() {
	var that = {},

	init = function() {
		console.log("init Search.js");
	},

	showPanels = function(){
	var $panelOne = $('#panel-heading-one');
 	var $panelTwo = $('#panel-heading-two');
 	var $panelThree = $('#panel-heading-three');
 	var $panelFour = $('#panel-heading-four');
 	
	$panelOne.fadeIn(500, function(){     
       $panelTwo.fadeIn(500, function(){
          $panelThree.fadeIn(500, function(){
             $panelFour.fadeIn(500, function(){
       
             });
          });
       });
    });
	};
   that.init = init;
   that.showPanels = showPanels;
   return that;
}());
