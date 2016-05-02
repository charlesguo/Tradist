var express = require('express');
var router = express.Router();

var Bubble = require("../models/bubble");

// Bubble Chart.
// Query the bubbles collection and return the bubbles json.
router.get('/bubbles', function(req,res) {
		Bubble.find({}, function(err, stocks) {
		if (err) res.json({Message: "Stocks cannot be found."});
		res.json(stocks);
		});
});

router.get('/bubblechart', function(req, res){
		res.render('index.html');
});

module.exports = router;
