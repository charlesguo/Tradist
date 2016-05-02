var mongoose = require('mongoose');

var bubbleSchema = mongoose.Schema({
  counter: String,
  name: String,
  industry: String,
  mkt_cap: Number,
  vol_3_mth: Number,
  pchg_3_mth: Number,
  vol_6_mth: Number,
  pchg_6_mth: Number,
  vol_1_yr: Number,
  pchg_1_yr: Number,
  vol_3_yr: Number,
  pchg_3_yr: Number,
  vol_5_yr: Number,
  pchg_5_yr: Number
});

module.exports = mongoose.model('Bubble', bubbleSchema);
