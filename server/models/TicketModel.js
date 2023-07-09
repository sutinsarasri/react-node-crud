const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
    unique: true,
  },
  status: {
    type: String,
    require: true,
  },
  description: String,
  contact: String,
  createDate: Date,
  updateDate: Date,
});

ticketSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Tickets", ticketSchema);
