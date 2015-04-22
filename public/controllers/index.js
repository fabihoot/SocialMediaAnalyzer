 var $btnSubmit = $('#submit-button');
 var $txtKeyword = $('#input-keyword');
 var $resultContainer = $('#result-container');

 var $panelOne = $('#panel-heading-one');
 var $panelTwo = $('#panel-heading-two');
 var $panelThree = $('#panel-heading-three');
 var $panelFour = $('#panel-heading-four');

 $btnSubmit.click(function(){

   var searchTerm = $txtKeyword.val();
   $panelOne.fadeIn(500, function(){     
      $panelTwo.fadeIn(500, function(){
         $panelThree.fadeIn(500, function(){
            $panelFour.fadeIn(500, function(){
      
            });
         });
      });
   });
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