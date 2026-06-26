const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    default: ""
  },
  lastName: {
    type: String,
    default: ""
  },
  mobile: {
    type: String,
    default: ""
  },
  profileImage: {
    url: {
      type: String,
      default: ""
    },
    filename: {
      type: String,
      default: ""
    }
  }
}, { timestamps: true });

UserSchema.plugin(passportLocalMongoose, {
  usernameField: 'username'
});

module.exports = mongoose.model("User", UserSchema);
