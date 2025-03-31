const mongoose = require("mongoose");

const senderSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  profilePicture: { type: String },
});
module.exports = mongoose.model("Sender", senderSchema);
