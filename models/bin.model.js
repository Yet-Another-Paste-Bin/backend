const mongoose = require("mongoose");

const Bin = mongoose.model(
  "bins",
  new mongoose.Schema({
    _id: String,
    data: String,
    owner_id: String,
    owner_username: String,
    private: Boolean,
    shared_with: [{ type: String }],
  })
);

module.exports = Bin;
