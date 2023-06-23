const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
require("dotenv").config();

const username = process.env.DX_EMAIL;
const password = process.env.DX_PASS;
const SECRET = process.env.SECRET;

const emailVerification = async (id, email, res, authToken) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: username,
            pass: password,
        }
    });

    const payload = {
        id: id,
        email: email,
    }

    const token = await jwt.sign(payload, SECRET, { expiresIn: "10m" });

    const mailConfigurations = {
        from: 'dxclubb@gmail.com',
        to: email,
        subject: 'Email Verification',
        text: `Hello, you have received this mail because you recently registered at DxClub website. Please validate the email address by clicking on -
        http://localhost:5000/auth/emailVerification/${token} 
        
        Thanks`
    };

    transporter.sendMail(mailConfigurations, (err, info) => {
        if (err) {
            console.log(err);
            res.status(401).send({ "msg": "Unable to send Email!" });
        }
        else {
            console.log("Send");
            res.status(200).send({
                "msg": "Verification mail send successfully!",
                authToken,
            });
        }
    });
};

module.exports = emailVerification;