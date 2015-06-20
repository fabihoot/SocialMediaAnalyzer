SocialMediaAnalyzer.LoginController = (function() {
	var that = {},

//Initialisierung der Logins
	init = function() {
		console.log("init LoginController.js");
		if (typeof(FB) != 'undefined' && FB != null ) {
        $.post('/request-id/', function(data){          
		      fbAsyncInit(data);
        });
		}
    initTwitter();		
    initReddit();
	},

//Request des Reddit Logins
  initReddit = function(){
    $.post('/reddit-login/', function(res){
      if(res.err){
        callLoginFailed('Reddit', res.err);
      } else {      
        $(document).trigger('redditLoginSuccess');
      }     
    });
  },

//Request des Twitter Logins
  initTwitter = function(){
    $.post('/twitter-login/', function(res){ 
      if(res.err){
        callLoginFailed('Twitter', res.err);
      } else {     
        $(document).trigger('twitterLoginSuccess');
      }
    });
  },

//Asynchroner Login mit der FB SDK API
	fbAsyncInit = function(data) {
  	FB.init({
    	appId      : data,
    	cookie     : true,    	                    
    	xfbml      : true, 
    	version    : 'v2.3'
  		});

	  	FB.getLoginStatus(function(response) {
	  	  statusChangeCallback(response);
	  	});
	
  	},
  
//Callback Methode für den Facebook Login
//User muss zuerst App authorisieren und Zugriff auf seine Daten gewähren
//erst dann kann ein Login der App mit den erworbenen Daten erfolgen
  statusChangeCallback = function(response) {   	 	
  		if (response.status === 'connected') {
  		 
  		  $.post('/facebook-login/', { token: response.authResponse.accessToken}, function(res){
         if(res.err){
           console.log(res);
           callLoginFailed('Facebook', res.err);
         } else {
           $(document).trigger('facebookLoginSuccess');
         }         
       });
  		} else if (response.status === 'not_authorized') {
  		
  		  document.getElementById('status').innerHTML = 'Please log ' +
  		    'into this app.';
  		} else {
  		  
  		  document.getElementById('status').innerHTML = 'Please log ' +
  		    'into Facebook.';
  		}
  },	
  
  //Login Status überprüfen
  checkLoginState = function() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  },

  //fehlerhafter Login ist erfolgt
   callLoginFailed = function(source, err){
     $.Notify({
     caption: 'Login failed',
     content: 'Error: '+ err + '<br/>Unfortunately you could not be logged in to ' + source + '! Please restart the node.js server or refresh the page! ' +
     'If the login still cannot be performed, contact the author of this page!',
     keepOpen: true,
     type: 'alert',
     icon: "<span class='mif-vpn-publ'></span>",
     style:{
       color: 'white'
     }
   });
  }

	that.init = init;
  return that;
}());