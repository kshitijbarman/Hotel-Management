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
      to: email,
      // to: senderEmail,
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

    // const mailOptions = {
    //   from: "vishnuparihar239925@gmail.com",
    //   to: email,
    //   subject: "🔐 OTP Verification Code - Action Required",
    //   html: `
    //     <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
    //       <h2 style="color: #333;">Hello,</h2>
    //       <p style="font-size: 16px; color: #555;">You recently requested to verify your account. Use the OTP below to proceed:</p>

    //       <div style="margin: 30px 0; text-align: center;">
    //         <span style="display: inline-block; background: #007bff; color: #fff; padding: 15px 30px; font-size: 32px; letter-spacing: 8px; border-radius: 8px;">
    //           ${otp}
    //         </span>
    //       </div>

    //       <p style="font-size: 15px; color: #666;">This OTP is valid for <strong>10 minutes</strong>.</p>
    //       <p style="font-size: 15px; color: #666;">If you did not request this code, you can safely ignore this email.</p>

    //       <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
    //       <p style="font-size: 13px; color: #aaa; text-align: center;">Thank you for using our service.</p>
    //     </div>
    //   `,
    // };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email: ", error);
    return false;
  }
};

module.exports = { sendOtpEmail };
