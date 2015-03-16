var express = require('express');
var router = express.Router();
var twitter = require('../models/twitter');
var facebook = require('../models/facebook');
var reddit = require('../models/reddit');	

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Social Media Analyzer', name: 'Fabi' });
});

router.post('/twitter/', function(req, res, next) {	
	 var val = req.body.keyword;
	 scrapeTwitter(val, res);
	 //res.send('Twitter Endpoint reached'); 	 	
});

router.post('/facebook/', function(req, res, next) {	
	 var val = req.body.keyword;
	 //scrapeFacebook(val, res);
	 //res.send('Facebook Endpoint reached'); 	 
});

router.post('/reddit/', function(req, res, next) {	
	 var val = req.body.keyword;
	 scrapeReddit(val, res);
	 //res.send('Reddit Endpoint reached'); 	 
});

scrapeTwitter = function(search_word, res){    
    twitter.getTwitterData(search_word, function( data ){
    	res.send(data);
    });
   
}
scrapeReddit = function(search_word, res){
    reddit.getRedditData(search_word, function( data ){
    	res.send(data);
    });
}
scrapeFacebook = function(search_word, res){   
    facebook.getFacebookData(search_word, function( data ){
    	res.send(data);
    });
}



module.exports = router;
