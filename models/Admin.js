const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["superadmin", "infoadmin"],
  },
  image: { type: String },
  firstName: { type: String },
  lastName: { type: String },
});
module.exports = mongoose.model("Admin", userSchema);
