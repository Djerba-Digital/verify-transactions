//  DONE 100% SO FAR! GOOD WORK.
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//  LOG SCHEMA
const logSchema = new Schema(
  {
    state: {
      type: Object,
    },
    prevHash: {
      type: String,
    },
    currentHash: {
      type: String,
    },
    signature: {
      type: String,
    },
    timestamp: {
      type: Number,
      index: true,
    },
  },
  { collection: "Logs" }
);

module.exports = mongoose.model("logs", logSchema);
