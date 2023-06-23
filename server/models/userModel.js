const mongoose = require("mongoose");

// Schema for the users collection.

const UserSchema = new mongoose.Schema({
  collegeId: {
    type: String,
    required: false,
    unique: false,
    default: "",
  },
  registeredOn: {
    type: mongoose.Schema.Types.Date,
    required: false,
    unique: false,
    default: Date.now(),
  },
  collegeName: {
    type: String,
    required: false,
    unique: false,
    default: "",
  },
  rollNumber: {
    type: String,
    required: false,
    unique: false,
    default: "",
  },
  class: {
    type: String,
    required: false,
    unique: false,
    default: "",
  },
  division: {
    type: String,
    required: false,
    unique: false,
    default: "",
  },
  clubIds: {
    type: [{ clubId: String, clubName: String, contractAddress: String }],
    required: false,
    unique: false,
    default: [],
  },
  department: {
    type: String,
    required: false,
    unique: false,
    default: "",
  },
  designation: {
    type: String,
    required: false,
    unique: false,
    default: "",
  },
  name: {
    type: String,
    required: false,
    unique: false,
    default: "",
  },
  email: {
    type: String,
    required: [true, "Please provide an email!"],
    unique: [true, "Email already exists!"],
  },
  phone: {
    type: String,
    required: false,
    unique: false,
    default: "",
  },
  password: {
    type: String,
    required: [true, "Please provide an password!"],
    unique: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

// create a Users collection if not available else use Users colection.
module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);
