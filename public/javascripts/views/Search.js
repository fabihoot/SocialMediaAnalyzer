SocialMediaAnalyzer.Search = (function() {
	var that = {},
  $panelGeneral,
  $panelPosts,
  $panelMapping,

	init = function() {
		console.log("init Search.js");
    initListener();
    $panelGeneral = $('#frame-general');
    $panelPosts = $('#frame-posts');
    $panelMapping = $('#frame-mapping');    
	},

  initListener = function(){
    $(document).on('onShowPanels', showPanels);
  },
  
	showPanels = function(event){
    event.preventDefault();    
    $panelGeneral.removeClass('hidden').addClass('magictime spaceInLeft');
    $panelGeneral.addClass("active").delay(2000);
    $panelPosts.removeClass('hidden').addClass('magictime spaceInLeft'); 
    $panelMapping.removeClass('hidden').addClass('magictime spaceInLeft'); 
  };

   that.init = init;   
   return that;
}());
