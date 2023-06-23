const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const profileRoutes = require("./routes/profileRoutes");
const isVerified = require('./middleware/authMiddleware');
const authRoutes = require("./routes/authRoutes");
const dbConnect = require("./config/database");
const clubRoutes = require("./routes/clubRoutes");
const clubRequestRoutes = require("./routes/clubRequestRoutes");
require('dotenv').config();

const app = express();

// middleware for app
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// connect the database 
dbConnect();

// routes
app.get("/", (req, res) => {
    res.status(200).send("This is the home page");
});

app.use("/auth", authRoutes);
app.use("/profile", isVerified, profileRoutes);
app.use("/club", isVerified, clubRoutes);
app.use("/clubRequests", isVerified, clubRequestRoutes);


// selecting the port
const PORT = process.env.PORT || 5000;

// Starting the server
app.listen(PORT, () => {
    console.log(`Server started at port:${PORT}`)
});
