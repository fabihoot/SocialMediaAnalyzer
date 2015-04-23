 SocialMediaAnalyzer.IndexController = (function() {
 var that = {};

 var $btnSubmit = $('#submit-button');
 var $txtKeyword = $('#input-keyword');
 var $inputPostCount = $('#input-count');
 
 init = function() {
      console.log("init IndexController");
      initButton();        
 };

 initButton = function(){
    $btnSubmit.click(function(){

    var postCount = $inputPostCount.val();
    var searchTerm = $txtKeyword.val();

    SocialMediaAnalyzer.Search.showPanels();
    if (searchTerm == "") return;
    if (postCount == "")  return;

    console.log("keyword: " + searchTerm);
 
    $.post('/twitter/', { keyword: searchTerm, count: postCount }, function(data){
       console.log('Server responded with : ', data);
    });
 
    $.post('/facebook/', { keyword: searchTerm, count: postCount }, function(data){
       console.log('Server responded with : ', data);
    });
 
     $.post('/reddit/', { keyword: searchTerm, count: postCount }, function(data){
       console.log('Server responded with : ', data);
    });
 
  });
 };
   that.init = init;
   return that;
}());