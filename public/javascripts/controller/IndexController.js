 SocialMediaAnalyzer.IndexController = (function() {
 var that = {};

 var $btnSubmit = $('#submit-button');
 var $txtKeyword = $('#input-keyword');
 var $resultContainer = $('#result-container');
 
 init = function() {
      console.log("init IndexController");
      initButton();        
 };

 initButton = function(){
    $btnSubmit.click(function(){
 
    var searchTerm = $txtKeyword.val();
    SocialMediaAnalyzer.Search.showPanels();
    if (searchTerm == "") return;
    console.log("keyword: " + searchTerm);
 
    $.post('/twitter/', { keyword: searchTerm }, function(data){
       console.log('Server responded with : ', data);
    });
 
    $.post('/facebook/', { keyword: searchTerm }, function(data){
       console.log('Server responded with : ', data);
    });
 
     $.post('/reddit/', { keyword: searchTerm }, function(data){
       console.log('Server responded with : ', data);
    });
 
  });
 };
   that.init = init;
   return that;
}());