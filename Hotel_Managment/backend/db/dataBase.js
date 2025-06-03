const mongoose = require("mongoose");
require("dotenv").config();

const connectDb = async () => {
  await mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("database connected..");
    })
    .catch((err) => {
      console.log(err);
    }); 
};

module.exports = connectDb;
