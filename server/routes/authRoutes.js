const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const emailVerification = require('../config/emailVerification');
const router = express.Router();
require('dotenv').config();
const SECRET = process.env.SECRET;

router.post('/register', async (req, res) => {

  try {
    const { name, email, password } = req.body;

    // check if the user is already created
    let userCount = await userModel.findOne({ email: email });

    if (userCount) {
      return res.status(400).send({ msg: "User already exists" });
    }

    let salt = bcrypt.genSaltSync(10);
    let hashpassword = bcrypt.hashSync(password, salt);

    const user = new userModel({
      name, email, password: hashpassword,
    });

    // save the new user
    user.save()
      .then((result) => {

        // create the payload for jwt token
        const payload = {
          user: {
            id: user._id,
            name: user.name,
          },
        };

        // create jwt token
        jwt.sign(payload, SECRET, async (error, token) => {
          if (error) {
            return res.status(400).json({ msg: "Invalid token signing" });
          } else {
            // res.status(200).send({
            //     msg: "User Created Successfully!",
            //     result,
            //     token: token,
            // });

            emailVerification(user._id, email, res, token);
            return;
          }
        });
      })
      .catch((error) => {
        res.status(500).send({
          msg: "Error creating user!",
          error,
        });
        return;
      });

  }
  catch (error) {
    console.log(error.message);
    res.status(500).send({ msg: "Internal Server Error!" });
    return;
  }

});


// Route for login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).send({ msg: "User does not exists" });
    }

    let isMatch = await bcrypt.compare(password, user.password);

    // check if password is different
    if (!isMatch) {
      return res
        .status(400)
        .send({ msg: "UserName or Password does not match" });
    }

    const payload = {
      user: {
        id: user._id,
        name: user.name,
      },
    };

    jwt.sign(payload, SECRET, (err, token) => {
      if (err) return res.status(400).send({ msg: " Error in signing token" });
      else {
        return res.status(200).send({
          msg: "User Created Successfully!",
          token: token,
          username: user.name,
        });
      }
    });
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({ msg: " Internal server error" });
  }
});

router.get("/emailVerification/:token", (req, res) => {
  const token = req.params.token;

  jwt.verify(token, SECRET, async (err, decoded) => {
    if (err) {
      console.log(err);
      res.send("Email verification failed, possibly the link is invalid or expired");
    }
    else {
      id = decoded.id;
      console.log(id);
      const filter = {_id: id};
      const update = {isVerified: true};
      await userModel.findOneAndUpdate(filter, update);
      res.send("Email verifified successfully");
    }
  });
});

module.exports = router;