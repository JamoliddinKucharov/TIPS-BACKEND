const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  companyName: { type: String, required: true, unique: true },
  companyPassword: { type: String, required: true },
  companyEmail: { type: String, unique: true },
  companyImage: { type: String },
  companyPhone: { type: String },
  photo: { type: String },
});

module.exports = mongoose.model("Company", userSchema);