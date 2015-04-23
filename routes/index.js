var express = require('express');
var router = express.Router();
var twitter = require('../models/twitter');
var facebook = require('../models/facebook');
var reddit = require('../models/reddit');	

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Social Media Analyzer'});
});

router.post('/twitter/', function(req, res, next) {	
	var val = {
       keyword: req.body.keyword,
       count:   req.body.count
    }     
	scrapeTwitter(val, res);
	//res.send('Twitter Endpoint reached'); 	 	
});

router.post('/facebook/', function(req, res, next) {
    var val = {
       keyword: req.body.keyword,
       count:   req.body.count
    }	
  scrapeFacebook(val, res);
	//res.send('Facebook Endpoint reached'); 	 
});

router.post('/reddit/', function(req, res, next) {	
	var val = {
       keyword: req.body.keyword,
       count:   req.body.count
    }   
	scrapeReddit(val, res);
	//res.send('Reddit Endpoint reached'); 	 
});

scrapeTwitter = function(val, res){
    var search_word = val.keyword;
    var count       = val.count;    
    twitter.getTwitterData(search_word, count, function( data ){
    	res.send(data);
    });
   
}
scrapeReddit = function(val, res){
    var search_word = val.keyword;
    var count       = val.count;
    reddit.getRedditData(search_word, count, function( data ){
    	res.send(data);
    });
}
scrapeFacebook = function(val, res){
    var search_word = val.keyword;
    var count       = val.count;
    facebook.getFacebookData(search_word, count, function( data ){
    	res.send(data);
    });
}



module.exports = router;
