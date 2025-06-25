const nodemailer = require("nodemailer");
require('dotenv').config();


const createTransporter = (email, mailkey) => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.email,
      pass: process.env.pass,
    },
  });
};

const sendOtpEmail = async (email, otp, senderEmail, mailkey) => {
  try {
    if (!email || !otp || !senderEmail || !mailkey) {
      console.error("Missing required fields for sending OTP email");
      return false;
    }
    console.log(email);
    console.log(otp);
    // console.log(name);
    console.log(senderEmail);
    console.log(mailkey);

    if (!email || !otp || !senderEmail || !mailkey) {
      console.error("Missing required fields for sending OTP email");
      return false;
    }

    const transporter = createTransporter(senderEmail, mailkey);

    const mailOptions = {
      from: "kshitijbarman1234@gmail.com",
      // to: email,
      to: senderEmail,
      subject: "Your OTP Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hello ,</h2>
          <p>Your verification code is:</p>
          <h1 style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email: ", error);
    return false;
  }
};

module.exports = { sendOtpEmail };
