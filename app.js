'use strict';

var express       = require("express");
var app           = express();
var expressJWT    = require('express-jwt');
var jwt           = require('jsonwebtoken');
var port          = process.env.PORT || 3000;
var ejs           = require("ejs");
var path          = require("path");
var bcrypt = require('bcrypt');
// var router        = require('./config/routes');
var morgan        = require('morgan');
var bodyParser    = require("body-parser");
var apiRoutes     = express.Router();
var methodOverride = require('method-override');

var usersController = require('./controllers/usersController');

var mongoose      = require('mongoose');
var mongoUri =  process.env.MONGODB_URI || 'mongodb://localhost/tradist';
mongoose.connect(mongoUri);

var jwtSecret = process.env.JWT_SECRET || "tradist";
app.set('secretKey', 'tradist');

var Bubble = require("./models/bubble");
var Ticker = require("./models/ticker");
var User = require("./models/user");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
// app.use('/api',router);
app.use(express.static('public'));

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

function authorizeUser() {
  return expressJWT({secret: jwtSecret});
}

app.get('/', function(req, res){
  res.send('Welcome to Tradist! The API is at http://localhost:' + port + '/api');
});

app.post('/users/new', function createUser(request, response) {
  // console.log('in POST');
  // console.log('body:',request.body);
  var user = new User(request.body);

  user.save(function(error) {
    if(error) response.json({messsage: 'Could not create user b/c:' + error});
    // console.log(user);
    response.json(user);
  });
});

app.get('/api', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

// route to return all users (GET http://localhost:8080/api/users)


app.post('/authenticate', function(req, res) {
  // console.log(req.body.name)
  // find the user
  User.findOne({name: req.body.name}, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found!' });
    } else if (user) {

      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (err) throw err;

        if (!isMatch) {
          res.json({ success: false, message: 'Authentication failed. Wrong password.' });
          } else {
            // if user is found and password is right
            // create a token
            var tokenInfo = {
              id: user.id
            };
            var token = jwt.sign(tokenInfo, app.get('secretKey'), {
              expiresIn: 360000 // expires in 100 hours
            });

            // return the information including token as JSON
            res.json({
              success: true,
              message: 'Enjoy your token!',
              token: token
            });
          };
        });
      };
    });
});

app.get('/login', function(req, res) {
    res.render('login');
});

app.get('/timeseries/:name1/:name2', function(req, res) {
  res.render('multiple',{stockName1: req.params.name1, stockName2: req.params.name2});
});

app.get('/home', function(req, res) {
    res.render('home');
});

app.get('/timeseries/:name1/:name2', function(req, res) {
  res.render('multiple',{stockName1: req.params.name1, stockName2: req.params.name2});
});

app.get('/candlestick/:name', function(req, res) {
    res.render('candlestick', {stockName: req.params.name});
});

app.get('/heatmap', function(req, res) {
    res.render('heatmap');
});

app.get('/histogram/:name', function(req, res) {
    res.render('histogram', {stockName: req.params.name});
});

app.get('/bubblechart', function(req, res){
		res.render('index');
});

//route middleware to verify a token
app.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('secretKey'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
});

app.get('/api/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});

app.post('/api/users/:id/', function updateUser(request, response) {
  var id = request.params.id;

  if ( request.decoded.id !== id ){
    response.json({message: 'You are not authorized to perform this action.'});
  } else {
    User.findById({_id: id}, function(error, user) {
      if(error) response.json({message: 'Could not find user b/c:' + error});

      if(request.body.name) user.name = request.body.name;
      if(request.body.password) user.password = request.body.password;
      if(request.body.admin) user.admin = request.body.admin;

      user.save(function(error) {
        if(error) response.json({messsage: 'Could not update user b/c:' + error});

        response.json({message: 'User successfully updated'});

    });
  });
}
});

app.delete('/api/users/:id', function removeUser(request, response) {
  var id = request.params.id;

  if (request.decoded.id !== id){
    response.json({message: 'You are not authorized to perform this action.'});
  } else {
    User.remove({_id: id}, function(error) {
      if(error) response.json({message: 'Could not delete user b/c:' + error});

      response.json({message: 'User successfully deleted'});
    });
  }
});

app.get('/api/testauth', function(req, res){
  res.send('If this shows up, it means you have commented out the middleware to verify the token.');
});

app.get('/api/ticker', function(req, res) {
  Ticker.find({}, function (err, data) {
    if(err) res.json({message: 'Could not find commodities b/c:' + err});
    res.json(data);
  });
});

app.get('/api/ticker/:name', function(req, res) {
  Ticker.find({name: req.params.name}, function (err, data) {
    if(err) res.json({message: 'Could not find commodities b/c:' + err});
    res.json(data);
  });
});

app.get('/bubbles', function(req,res) {
		Bubble.find({}, function(err, stocks) {
		if (err) res.json({Message: "Stocks cannot be found."});
		res.json(stocks);
		});
});

app.listen(process.env.PORT || 3000);
console.log(`server started on port ${port}`);
