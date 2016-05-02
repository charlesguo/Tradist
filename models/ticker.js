var mongoose = require('mongoose');

var tickerSchema = mongoose.Schema({
  name: String,
  date: Date,
  price: Number,
  level: Number,
  open: Number,
  high: Number,
  low: Number,
  close: Number,
  volume: Number
});


module.exports = mongoose.model('Ticker', tickerSchema);
