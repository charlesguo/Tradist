// 'use strict';

const User          = require('../models/user');
// const Util          = require('../lib/utils');
// const debug         = require('debug')('controller');

// // POST /authorize -- A single function that acts as both a login and register
// function authorize(req, res) {
//
//     // Extract the allowed params
//     const userParams = {
//       email: req.body.email,
//       password: req.body.password,
//       name: req.body.name
//     };
//     if (!userParams.email || !userParams.password) return res.status(422).json({message: "Invalid Data"});
//
//     // attempt to find user by email and login or create depending on result
//     User.findOne({email: userParams.email}, (err,user) => {
//       if (user){
//         //login
//         user.authenticate(userParams.password, (err, isMatch) => {
//           if (err) throw err;
//
//           if (!isMatch) return res.status(401).json( {message: "Authorization Failed."});
//
//           res.status(200).json( { user: user, token: user.generateToken() });
//         });
//       } else {
//         //no user then we register instead
//         user = new User( userParams );
//
//         user.save((err, user) =>{
//           if (err) return res.status(422).json({errors: Util.mongooseErrMessages(err)});
//
//           res.status(201).json( {user: user, token: user.generateToken() });
//         });
//       }
//   });
// }
// // GET /logout
// function logout(req, res) {
//   if ( req.user ){
//     User.findById(req.user.id, (err, user) => {
//       if (err) return res.status(422).json({message: err.errmsg});
//       if (user){
//         user.logout();
//       }
//       res.status(200).json( {message: "Logged Out" });
//     });
//   } else {
//     //If we can't find a user then that is fine as that is the same as being logged out
//     res.status(200).json( {message: "Logged Out" });
//   }
// }

// GET /users
// function list(req, res) {
//   User.find((err, users) => {
//       res.status(200).json( {users: users });
//   });
// }


// INDEX
function getAll(request, response) {
  User.find(function(error, user) {
    if(error) response.json({message: 'Could not find any users.'});

    response.json({quotes: quotes});
  });
}

// CREATE
function createUser(request, response) {
  console.log('in POST');
  console.log('body:',request.body);
  var user = new User(request.body);

  user.save(function(error) {
    if(error) response.json({messsage: 'Could not create user b/c:' + error});
    console.log(user);
    response.json(user);
  });
}

// SHOW
function getUser(request, response) {
  var id = request.params.id;

  User.findById({_id: id}, function(error, user) {
    if(error) response.json({message: 'Could not find user b/c:' + error});

    response.json({user: user});
  });
}

// UPDATE
function updateUser(request, response) {
  var id = request.params.id;

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

// DELETE
function removeUser(request, response) {
  var id = request.params.id;

User.remove({_id: id}, function(error) {
    if(error) response.json({message: 'Could not delete user b/c:' + error});

    response.json({message: 'User successfully deleted'});
  });
}

module.exports = {
  getAll: getAll,
  createUser: createUser,
  getUser: getUser,
  updateUser: updateUser,
  removeUser: removeUser
};
