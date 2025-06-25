const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const StateRoute = require("./routes/StateRoute");
const CityRoute = require("./routes/CityRoute");
const hotelRoutes = require("./routes/HotelRoute");
const RoomRoutes = require("./routes/RoomRoute");
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/BookingRoute");
const couponRoutes = require("./routes/CouponRoute");
const analyticsRoutes = require("./routes/DshboardRoute");
const locationroute = require("./routes/LocationRoute");
const fileUpload = require("express-fileupload");
require("dotenv").config();

const cron = require("node-cron");
const { startCronJobs } = require("./Crons/DeactivateUserCron");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());

// MongoDB Connection
const connectDB = async () => {
  try {
    // await mongoose.connect(
    //   "mongodb+srv://kshitijbarman1234:kshitij123@cluster0.rfhd7.mongodb.net/hotel_management"
    // );
    await mongoose.connect(process.env.mongoUrl);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process with failure
  }
};

app.use("/api/coupons", couponRoutes);

app.use("/user", userRoutes);

app.use("/api/locations", locationroute);

app.use("/api", StateRoute);

app.use("/api", CityRoute);

app.use("/api", hotelRoutes);

app.use("/api", RoomRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api", analyticsRoutes);

// const {
//   scheduleCronJob } = require("./Crons/DeactivateUserCron");

// scheduleCronJob();

// const { scheduleReportCronJob } = require("./Crons/BookingReportCron");

// scheduleReportCronJob();

const PORT = 6969;
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
