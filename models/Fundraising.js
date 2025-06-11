const mongoose = require("mongoose");

const fundraisingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // 👈 muhim!
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, unique: true },
  phone: { type: String },
  image: { type: String },
  collection: { type: String },
  name: { type: String },
  type: { type: String },
  price: { type: String },
  comment: { type: String },
  photo: { type: String },
});

module.exports = mongoose.model("Fundraising", fundraisingSchema);
