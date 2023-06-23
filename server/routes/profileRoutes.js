const express = require('express');
const userModel = require('../models/userModel');
const router = express.Router();
require("dotenv").config();

const SECRET = process.env.SECRET;

router.get("/", async (req, res) => {
    const id = req.user.id;

    userModel.findOne({ _id: id }, (err, result) => {
        if (err) {
            res.status(500).send({
                "msg": "Unable to get the user",
                err,
            });
        }
        else {
            res.status(200).send(result);
        }
    });
});


router.put("/", async (req, res) => {
    const id = req.user.id;

    const body = req.body;
    userModel.findByIdAndUpdate(id, body, { new: true }, (err, info) => {
        if (err) {
            res.status(500).send({ "msg": "Unable to update the user profile!" });
        }
        else {
            res.status(200).send({ "msg": "user profile updated successfully!", info });
        }
    });
});

module.exports = router;