 SocialMediaAnalyzer.IndexController = (function() {
 var that = {};

 var $btnSubmit = $('#submit-button');
 var $txtKeyword = $('#input-keyword');
 var $inputPostCount = $('#slider_input');

 var $inputKeyword = $('#input-keyword');
 
 init = function() {
      console.log("init IndexController");
      initButton();        
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
    var keyword = $inputKeyword.val();   
    startRequestQuery(keyword);
 },

 dropValueToInput = function(value, slider){
    $("#slider_input").val(value);
 },

 startRequestQuery = function(searchTerm){   
    var postCount = $inputPostCount.val();
    var searchTerm = $txtKeyword.val();
    console.log(postCount);

    SocialMediaAnalyzer.Search.showPanels();
    if (searchTerm == "") return;
    if (postCount == "")  return;

    $.post('/twitter/', { keyword: searchTerm, count: postCount }, function(data){
      console.log('Server responded with : ', data);
      var content = data.data;
      SocialMediaAnalyzer.Search.setTwitterPosts(content);
      SocialMediaAnalyzer.VisualizationController.setTwitterData(content);
    });
 
    $.post('/facebook/', { keyword: searchTerm, count: postCount }, function(data){
       console.log('Server responded with : ', data);
       var content = data.data;
       SocialMediaAnalyzer.Search.setFacebookPosts(content);
       SocialMediaAnalyzer.VisualizationController.setFacebookData(content);
    });
 
     $.post('/reddit/', { keyword: searchTerm, count: postCount }, function(data){
       console.log('Server responded with : ', data);
       var content = data.data;
       SocialMediaAnalyzer.Search.setRedditPosts(content);
       SocialMediaAnalyzer.VisualizationController.setRedditData(content);
    });

    SocialMediaAnalyzer.Visualization.init();
    SocialMediaAnalyzer.VisualizationController.init(); 
 
 
};
that.init = init;
return that;
}());