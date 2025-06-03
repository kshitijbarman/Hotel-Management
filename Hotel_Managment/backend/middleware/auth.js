 
// const jwt = require("jsonwebtoken");
// const secret = process.env.secretKey;
// const userModel = require("../model/userModel");

// module.exports = async (req, res, next) => {
//   const barreToken = req.headers.authorization;

//   if (!barreToken || !barreToken.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Invalid or missing token" });
//   }

//   const token = barreToken.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ message: "No token found" });
//   }

//   try {
//     const decode = jwt.verify(token, secret);

//     // Fetch user from database after decoding the token
//     const user = await userModel.findOne({ email: decode.email });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Set the user info on the req object
//     req.user = {
//       id: user._id,
//       email: user.email,
//       role: user.role,
//     };

//     next(); // Proceed to the next middleware or route handler
//   } catch (error) {
//     console.error("Error verifying token:", error);
//     res.status(401).json({ message: "Authentication failed. Please log in again." });
//   }
// };


// File: middleware/auth.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Define the secret key
const secretKey = process.env.secretKey || 'asdfghjkl';

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};