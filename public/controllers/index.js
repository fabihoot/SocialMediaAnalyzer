 var $btnSubmit = $('#submit-button');
 var $txtKeyword = $('#input-keyword');

 $btnSubmit.click(function(){

   var searchTerm = $txtKeyword.val();
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