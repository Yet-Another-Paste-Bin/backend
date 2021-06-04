const mongoose = require("mongoose");

/**
 * Return User Mongoose Model
 * @author Tejasvp25  <tejasvp25@gmail.com>
 * @param {String} model_name
 * @param {Mongoose.Schema} scheme
 * @Return User Model
 */
const User = mongoose.model(
  "users",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    phoneno: String,
    passwordresettoken: String,
  })
);

module.exports = User;
