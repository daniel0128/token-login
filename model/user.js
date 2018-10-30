const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  email:{
    type: String,
    require: [true, 'email required.'],
    unique: true
  },
  password: {
    type: String
  },
  token: {
    type: String
  },
  // tokenexpire: {
  //   type: String
  // }
});

module.exports = mongoose.model('user', UserSchema);
