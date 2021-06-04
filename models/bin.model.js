const mongoose = require("mongoose");

/**
 * Return Bin Mongoose Model
 * @author Tejasvp25  <tejasvp25@gmail.com>
 * @param {String} model_name
 * @param {Mongoose.Schema} scheme
 * @Return Bin Model
 */
const Bin = mongoose.model(
  "bins",
  new mongoose.Schema(
    {
      data: String,
      owner_id: String,
      owner_username: String,
      private: Boolean,
      shared_with: [{ type: String }],
    },
    { timestamps: true }
  )
);

module.exports = Bin;
