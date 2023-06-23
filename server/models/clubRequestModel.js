const mongoose = require('mongoose');

// Schema for new request
const ClubRequestSchema = new mongoose.Schema({
    clubId: {
        type: String,
        unique: false,
        default: "",
    },
    userId: {
        type: String,
        unique: false,
        default: "",
    },
    clubName: {
        type: String,
        unique: false,
        default: "",
        required: true,
    },
    userName: {
        type: String,
        unique: false,
        default: "",
        required: true,
    },
    clubAdminId: {
        type: String,
        unique: false,
        default: "",
        required: true,
    },
    contractAddress: {
        type: String,
        unique: false,
        default: "",
        required: false,
    },
    senderAddress: {
        type: String,
        unique: false,
        default: "",
        required: false,
    },
    status: {
        type: Boolean,
        unique: false,
        required: false,
        default: null,
    },
    isClicked: {
        type: Boolean,
        unique: false,
        required: false,
        default: false,
    },
});

module.exports = mongoose.model.ClubRequests || mongoose.model("ClubRequests", ClubRequestSchema);