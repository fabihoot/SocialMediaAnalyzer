 SocialMediaAnalyzer.IndexController = (function() {
 var that = {},
 fb,twit,rddt = false;

 var $inputPostCount = $('#slider-input');
 var $inputKeyword = $('#input-keyword');
 var pCount = 0;
 
 //ruft Initialisierung von Listener und Buttons auf
 init = function() {
      console.log("init IndexController");
      initListener();
      initButton();
 },

 //Initialisierung der Listener
 initListener = function(){
    $(document).on('onCheckRequest', checkRequestsFinished);    
 },

//Initialissierung der Buttons und deren Funktion
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

//Starten eines Requests durch Drücken der Enter Taste
 onInputEnterPressed = function(event){
    event.preventDefault();
    SocialMediaAnalyzer.VisualizationController.reset();
    fb = twit = rddt = false;    
    startRequestQuery();
 }, 

//Methode zum Anpassen des Sliderwertes und Anzeige der Warnung wenn Wert 100 Posts übersteigt
 dropValueToInput = function(value, slider){
     $("#slider-input").val(value);
     var $warningPostCount = $('#warning-post-count');
     if(value > 100){
       $warningPostCount.removeClass('hidden');
       $warningPostCount.removeClass('magictime boingOutDown');      
       $warningPostCount.addClass('magictime boingInUp');      
     } else {       
       $warningPostCount.removeClass('magictime boingInUp');
       $warningPostCount.addClass('magictime boingOutDown');
     }
  },

//Starten eines Requests an den node.js Server mit Suchbegriff und Post Anzahl
 startRequestQuery = function(){   
    var postCount = $inputPostCount.val();
    var searchTerm = $inputKeyword.val();
    setPostCount(postCount);
    
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
    $(document).trigger('onRequestStart'); 
 
},

//Überprüfen ob alle 3 Requests abgeschlossen sind, erst dann kann Visualisierung erfolgen
checkRequestsFinished = function(event, id){  
  switch(id){
    case('facebook'): fb = true; break;
    case('twitter'): twit = true; break;
    case('reddit'): rddt = true; break;
  }

  if(fb&&twit&&rddt) startVisualizations();   
},

//starten der Visualisierungen, Anzeigen aller Panels, Erstellen der Post-Visualisierung
startVisualizations = function(){
  SocialMediaAnalyzer.VisualizationController.setTwitterPosts();
  SocialMediaAnalyzer.VisualizationController.setFacebookPosts();
  SocialMediaAnalyzer.VisualizationController.setRedditPosts();
  SocialMediaAnalyzer.VisualizationController.checkDataSetLength(pCount);

  SocialMediaAnalyzer.VisualizationController.showPanels();

  SocialMediaAnalyzer.VisualizationController.initSave();
  SocialMediaAnalyzer.VisualizationController.createVoteVisualization();
  SocialMediaAnalyzer.VisualizationController.createSentimentVisualization();
  SocialMediaAnalyzer.VisualizationController.createTokenVisualization();
  SocialMediaAnalyzer.VisualizationController.createCloudVisualization();
  SocialMediaAnalyzer.VisualizationController.createContentVisualization();
  $(document).trigger('onRequestFinished');
},

//Hilfsmethode zum Setzen des Postcounts
setPostCount = function(count){
  pCount = count;
};
that.init = init;
return that;
}());