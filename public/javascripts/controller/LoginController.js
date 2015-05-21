SocialMediaAnalyzer.LoginController = (function() {
	var that = {},

	init = function() {
		console.log("init LoginController.js");
		if (typeof(FB) != 'undefined' && FB != null ) {
        $.post('/request-id/', function(data){          
		      fbAsyncInit(data);
        });
		}		
	},
  
	fbAsyncInit = function(data) {
  		FB.init({
    	appId      : data,
    	cookie     : true,  // enable cookies to allow the server to access 
    	                    // the session
    	xfbml      : true,  // parse social plugins on this page
    	version    : 'v2.3' // use version 2.3
  		});

  	// Now that we've initialized the JavaScript SDK, we call 
  	// FB.getLoginStatus().  This function gets the state of the
  	// person visiting this page and can return one of three states to
  	// the callback you provide.  They can be:
  	//
  	// 1. Logged into your app ('connected')
  	// 2. Logged into Facebook, but not your app ('not_authorized')
  	// 3. Not logged into Facebook and can't tell if they are logged into
  	//    your app or not.
  	//
  	// These three cases are handled in the callback function
	
	  	FB.getLoginStatus(function(response) {
	  	  statusChangeCallback(response);
	  	});
	
  	},
  	// This is called with the results from from FB.getLoginStatus().
  	statusChangeCallback = function(response) {
   	 	//console.log('statusChangeCallback');
   	 	//console.log(response);
   	 	// The response object is returned with a status field that lets the
   		// app know the current login status of the person.
   		// Full docs on the response object can be found in the documentation
   		// for FB.getLoginStatus().
   		if (response.status === 'connected') {
   		  // Logged into your app and Facebook.
   		  $.post('/facebook-login/', { token: response.authResponse.accessToken});
   		} else if (response.status === 'not_authorized') {
   		  // The person is logged into Facebook, but not your app.
   		  document.getElementById('status').innerHTML = 'Please log ' +
   		    'into this app.';
   		} else {
   		  // The person is not logged into Facebook, so we're not sure if
   		  // they are logged into this app or not.
   		  document.getElementById('status').innerHTML = 'Please log ' +
   		    'into Facebook.';
   		}
  	},	
  	// This function is called when someone finishes with the Login
  	// Button.  See the onlogin handler attached to it in the sample
  	// code below.
  	checkLoginState = function() {
  	  FB.getLoginStatus(function(response) {
  	    statusChangeCallback(response);
  	  });
  	};
	that.init = init;

   return that;
}());