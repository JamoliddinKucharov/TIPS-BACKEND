const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  profilePicture: { type: String },
  firstName: { type: String },
  inn: { type: String },
  brand: { type: String },
  address: { type: String },
  lastName: { type: String },
  balance: { type: String },
  history: { type: String },
});
module.exports = mongoose.model("User", userSchema);
