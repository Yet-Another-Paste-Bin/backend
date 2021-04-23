const mongoose = require("mongoose");

const User = mongoose.model(
  "users",
  new mongoose.Schema({
    _id: String,
    username: String,
    email: String,
    password: String,
    phoneno: String,
  })
);

module.exports = User;
