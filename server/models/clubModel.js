const mongoose = require("mongoose");

// Schema for new club
const ClubSchema = new mongoose.Schema({
  clubName: {
    type: String,
    unique: true,
    default: "",
    required: true,
  },
  clubAdminId: {
    type: String,
    unique: false,
    default: "",
    required: true,
  },
  governingBodyId: {
    type: String,
    unique: false,
    default: "",
    required: false,
  },
  collegeName: {
    type: String,
    unique: false,
    default: "",
    required: true,
  },
  description: {
    type: String,
    unique: false,
    default: "",
    required: true,
  },
  contractAddress: {
    type: String,
    unique: false,
    default: "",
    required: true,
  },
}, { timestamps: true },);

module.exports = mongoose.model.Clubs || mongoose.model("Clubs", ClubSchema);
