const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {

  // this is the url to the database
  let db_url = process.env.DB_URL;

  // connect the database.
  mongoose.connect(
    db_url,
    {
      //   these are options to ensure that the connection is done properly
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to MongoDB Atlas!");
    })
    .catch((error) => {
      console.log("Unable to connect to MongoDB Atlas!");
      console.error(error);
    });
}

module.exports = dbConnect;