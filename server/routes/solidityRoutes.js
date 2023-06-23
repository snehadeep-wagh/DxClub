const express = require('express');
const userModel = require('../models/userModel');
const router = express.Router();
require("dotenv").config();

const SECRET = process.env.SECRET;

