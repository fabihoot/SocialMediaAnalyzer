 SocialMediaAnalyzer.IndexController = (function() {
 var that = {},
 fb,twit,rddt = false;

 var $btnSubmit = $('#submit-button');
 var $txtKeyword = $('#input-keyword');
 var $inputPostCount = $('#slider_input');

 var $inputKeyword = $('#input-keyword');
 
 init = function() {
      console.log("init IndexController");
      initListener();
      initButton();        
 },

 initListener = function(){
    $(document).on('onCheckRequest', checkRequestsFinished);    
 },

 initButton = function(){ 
  $inputKeyword.keyup(function(e){
      if(e.keyCode == 13)
      {
          $(this).trigger("enterKey");
      }
  });
  $inputKeyword.bind("enterKey", onInputEnterPressed);
  $('#input-keyword').blur(function() {
    if($('#input-keyword').val() != ""){
      $('#search-placeholder').html("");
    } else {
      $('#search-placeholder').html("Keyword");
    }
  }); 
 },

 onInputEnterPressed = function(event){
    fb,twit,rddt = false   
    var keyword = $inputKeyword.val();   
    startRequestQuery(keyword);
 },

 dropValueToInput = function(value, slider){
    $("#slider_input").val(value);
 },

 startRequestQuery = function(searchTerm){   
    var postCount = $inputPostCount.val();
    var searchTerm = $txtKeyword.val();    

    SocialMediaAnalyzer.Search.showPanels();
    if (searchTerm == "") return;
    if (postCount == "")  return;

    $.post('/twitter/', { keyword: searchTerm, count: postCount }, function(data){
      console.log('Server responded with : ', data);
      var content = data.data.data;
      SocialMediaAnalyzer.VisualizationController.setTwitterData(content);     
      $(document).trigger('onCheckRequest', data.id);
    });
 
    $.post('/facebook/', { keyword: searchTerm, count: postCount }, function(data){
       console.log('Server responded with : ', data);
       var content = data.data.data;
       SocialMediaAnalyzer.VisualizationController.setFacebookData(content);      
       $(document).trigger('onCheckRequest', data.id);
    });
 
     $.post('/reddit/', { keyword: searchTerm, count: postCount }, function(data){
       console.log('Server responded with : ', data);
       var content = data.data.data;
       SocialMediaAnalyzer.VisualizationController.setRedditData(content);       
       $(document).trigger('onCheckRequest', data.id);
    });

    SocialMediaAnalyzer.Visualization.init();
    SocialMediaAnalyzer.VisualizationController.init(); 
 
 
},

checkRequestsFinished = function(event, id){  
  switch(id){
    case('facebook'): fb = true; break;
    case('twitter'): twit = true; break;
    case('reddit'): rddt = true; break;
  }

  if(fb&&twit&&rddt) startVisualizations();
},

startVisualizations = function(){
  console.log('start Visualizations');
   SocialMediaAnalyzer.VisualizationController.setTwitterPosts();
   SocialMediaAnalyzer.VisualizationController.setFacebookPosts();
   SocialMediaAnalyzer.VisualizationController.setRedditPosts();
};
that.init = init;
return that;
}());