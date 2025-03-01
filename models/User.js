const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["superadmin", "infoadmin", "user"],
    default: "user",
  },
  profilePicture: { type: String },
  firstName: { type: String },
  lastName: { type: String },
});
module.exports = mongoose.model("User", userSchema);
