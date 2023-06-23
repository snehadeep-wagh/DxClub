const express = require("express");
const clubRequestModel = require("../models/clubRequestModel");
const userModel = require("../models/userModel");
const clubModel = require("../models/clubModel");
const router = express.Router();
require("dotenv").config();

const SECRET = process.env.SECRET;

router.get("/checkClubRequest", async (req, res) => {
  let clubId, userId;
  clubId = req.query.clubId;
  userId = req.query.userId;

  // check if the request is already created
  let clubRequestCount = await clubRequestModel.findOne({
    clubId,
    userId,
    isClicked: false,
  });
  let clubRequestAcceptCount = await clubRequestModel.findOne({
    clubId,
    status: true,
    userId,
  });
  if (clubRequestCount || clubRequestAcceptCount) {
    return res.status(200).send({
      msg: "Request already sent!",
      status: true,
    });
  } else {
    return res.status(200).send({
      msg: "Request already not sent!",
      status: false,
    });
  }
});

let listOfRequests = [];
router.get("/getAllRequests", async (req, res) => {
  const userId = req.user.id;
  const query = { clubAdminId: userId, isClicked: false };
  const options = {};

  const cursor = clubRequestModel.find(query, options, (err, docs) => {
    if (err) {
      res.status(500).send({ msg: "Internal Server Error " + err });
    } else {
      listOfRequests = docs;
      res.status(200).send({
        msg: "Successfully fetched all the documents",
        totalDocs: listOfRequests.length,
        result: listOfRequests,
      });
    }
  });

  console.log("cursor" + cursor);

  console.log(listOfRequests);
});

router.put("/sendClubRequest", async (req, res) => {
  try {
    let clubId, clubAdminId, userId, userName, clubName, contractAddress, senderAddress;
    clubId = req.body.clubId;
    clubAdminId = req.body.clubAdminId;
    userId = req.body.userId;
    userName = req.body.userName;
    clubName = req.body.clubName;
    contractAddress = req.body.contractAddress;
    senderAddress = req.body.senderAddress;

    console.log("contractAddress: " + contractAddress + "\n senderAddress: " + senderAddress)

    // check if the request is already created
    let clubRequestCount = await clubRequestModel.findOne({
      clubId,
      userId,
      isClicked: false,
    });

    if (clubRequestCount) {
      return res.status(400).send({ msg: "Requesst already sent!" });
    }

    const requestModel = new clubRequestModel({
      clubId,
      userId,
      clubAdminId,
      clubName,
      userName,
      contractAddress,
      senderAddress
    });

    requestModel
      .save()
      .then((result) => {
        res.status(200).send({
          msg: "Request send successfully!",
          result,
        });
        return;
      })
      .catch((error) => {
        res.status(500).send({
          msg: "Error creating request!",
          error,
        });
        return;
      });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ msg: "Internal Server Error!" });
    return;
  }
});

router.put("/updateRequest", async (req, res) => {
  const clubId = req?.body.clubId;
  const userId = req?.body.userId;
  const status = req?.body.status;

  console.log("status: " + status);

  const body = { isClicked: true, status };
  //   clubRequestModel.findOneAndUpdate(
  //     { clubId, userId },
  //     body,
  //     { new: true },
  //     (err, info) => {
  //       if (err) {
  //         res.status(500).send({ msg: "Unable to update the request! " + err });
  //       } else {
  //         res
  //           .status(200)
  //           .send({ msg: "user request updated successfully!", info });
  //       }
  //     }
  //   );

  try {
    let clubRequest = await clubRequestModel.findOneAndUpdate(
      { clubId, userId },
      body,
      { new: true }
    );
    let myClub = await clubModel.findById(clubId);
    let updatedUser = await userModel.findOneAndUpdate(
      { _id: userId },
      { $push: { clubIds: { clubId: clubId, clubName: myClub?.clubName } } },
      { new: true }
    );
    res
      .status(200)
      .send({ msg: "user request updated successfully!", clubRequest });
  } catch (err) {
    res.status(500).send({ msg: "Unable to update the request! " + err });
  }
});

module.exports = router;
