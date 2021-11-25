const mongoose = require("mongoose");

const User = mongoose.model("user", {
  email: {
    unique: true,
    type: String,
  },
  token: String,
  hash: String,
  salt: String,

  username: String,
  name: String,
  description: String,
});

module.exports = User;
