const express = require("express");
const clubModel = require("../models/clubModel");
const userModel = require("../models/userModel");
const clubRequestModel = require("../models/clubRequestModel");
const router = express.Router();
require("dotenv").config();

const SECRET = process.env.SECRET;

// create new club
router.post("/createClub", async (req, res) => {
  try {
    const clubName = req.body.clubName;
    const collegeName = req.body.collegeName;
    const description = req.body.description;
    const contractAddress = req.body.contractAddress;

    // fetch the id provided by the middleware.
    const clubAdminId = req.user.id;

    let clubCount = await clubModel.findOne({ clubName: clubName });

    if (clubCount) {
      return res.status(400).send({ msg: "Club already exists" });
    }

    const club = new clubModel({
      clubName,
      collegeName,
      description,
      clubAdminId,
      contractAddress,
    });

    try {
      await club.save();

      let admin = await userModel.findOneAndUpdate(
        { _id: clubAdminId },
        { $push: { clubIds: { clubId: club?._id, clubName: club?.clubName, contractAddress: club?.contractAddress } } }
      );

      res.status(200).send({
        msg: "Club created successfully!",
        result: club,
      });
    } catch (error) {
      res.status(500).send({
        msg: "Error creating club!",
        clubName: clubName,
        description: description,
        collegeName: collegeName,
        error: error.message,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ msg: "Internal Server Error! " + error.message });
    return;
  }
});

router.get("/checkIfClubExists", async (req, res) => {
  const clubName = req.query.clubName;
  console.log(clubName);
  let clubCount = await clubModel.findOne({ clubName: clubName });

  if (clubCount) {
    return res.status(200).send({ msg: "Club already exists" });
  }

  return res.status(500).send({ msg: "Club Does not exists" });
});

// get all clubs available
let listOfClubs = [];
router.get("/getAllClubs", async (req, res) => {
  const query = {};
  const options = {
    // sort: { clubName: 1 },
    // projection: {clubName: 1, description: 1 },
  };

  const cursor = clubModel.find(query, options, (err, docs) => {
    if (err) {
      res.status(500).send({ msg: "Internal Server Error" + err });
    } else {
      listOfClubs = docs;
      res.status(200).send({
        msg: "Successfully fetched all the documents",
        totalDocs: listOfClubs.length,
        result: listOfClubs,
        userId: req.user.id,
        userName: req.user.name,
      });
    }
  });

  // console.log("cursor" + cursor);

  // console.log(listOfClubs)
});

// get the club for the given id
router.get("/:clubId", async (req, res) => {
  const clubId = req.params.clubId;

  clubModel.findOne({ _id: clubId }, (err, doc) => {
    if (err) {
      res.status(500).send({ msg: "Internal Server Error" + err });
    } else {
      res.status(200).send({
        msg: "Successfully fetched the documents",
        result: doc,
      });
    }
  });
});

module.exports = router;
