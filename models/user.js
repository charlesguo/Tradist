var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var UserSchema = mongoose.Schema({
  name: String,
  password: String,
  admin: Boolean
});

UserSchema.pre('save', function(next){
  const user = this;

  if(!user.isModified('password')) return next();

  bcrypt.genSalt(3, function(err,salt){
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err,hash){
      if (err) return next(err);
      console.log(user.password);
      user.password = hash;
      console.log(hash);
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    console.log(isMatch);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
