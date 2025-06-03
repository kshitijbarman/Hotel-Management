 
// const cron = require("node-cron");
// const mongoose = require("mongoose");
// const nodemailer = require("nodemailer");
// const Booking = mongoose.model("Booking");
// const Room = mongoose.model("Room");
// const Hotel = mongoose.model("Hotel");
// const dotenv = require("dotenv");

 
// dotenv.config();

 
// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   auth: {
//     user: process.env.email,
//     pass: process.env.pass,
//   },
// });

 
// const sendReportEmail = async (report) => {
//   const mailOptions = {
//     from: process.env.email,
//     to: process.env.ADMIN_EMAIL ,
//     subject: `Daily Bookings Report - ${new Date().toLocaleDateString()}`,
//     html: report,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log(`Bookings report email sent to ${process.env.ADMIN_EMAIL}`);
//   } catch (error) {
//     console.error(`Failed to send bookings report email:`, error);
//   }
// };

 
// const fetchHotelName = async (roomId) => {
//   if (!roomId) return "N/A";
//   try {
//     const room = await Room.findById(roomId).populate("hotel");
//     if (!room || !room.hotel) return "Hotel Not Found";
//     return room.hotel.name || "Hotel Not Found";
//   } catch (err) {
//     console.error(`fetchHotelName for room ${roomId} - Error:`, err.message);
//     return "Hotel Not Found";
//   }
// };

 
// const generateBookingsReport = async () => {
//   console.log("Running cron job to generate bookings report at", new Date().toISOString());

//   try {
    
//     const bookings = await Booking.find()
//       .populate({
//         path: "roomId",
//         populate: { path: "hotel", strictPopulate: false },
//       })
//       .lean();

//     console.log(`Found ${bookings.length} bookings in total`);
//     if (bookings.length > 0) {
//       console.log("Sample booking:", bookings[0]);
//     }
 
//     const totalBookings = bookings.length;
//     const checkedIn = bookings.filter((b) => b.checkedIn).length;
//     const notCheckedIn = bookings.filter((b) => !b.checkedIn).length;
//     const pending = bookings.filter(
//       (b) => b.status === "pending" && !b.checkedIn && b.status !== "cancelled"
//     ).length;
//     const cancelled = bookings.filter((b) => b.status === "cancelled").length;
//     const approved = bookings.filter((b) => b.status === "approved").length;

 
//     const hotelNames = {};
//     for (const booking of bookings) {
//       if (booking.roomId?._id && !booking.roomId?.hotel?.name) {
//         const hotelName = await fetchHotelName(booking.roomId._id);
//         hotelNames[booking.roomId._id] = hotelName;
//       }
//     }

    
//     const bookingRows = bookings.map((booking) => {
//       const hotelName =
//         booking.roomId?.hotel?.name || hotelNames[booking.roomId?._id] || "No Hotel Name";
//       return `
//         <tr style="border-bottom: 1px solid #ddd;">
//           <td style="padding: 8px; text-align: left;">${booking._id}</td>
//           <td style="padding: 8px; text-align: left;">${hotelName}</td>
//           <td style="padding: 8px; text-align: left;">${
//             booking.roomId ? `Room ${booking.roomId.roomNumber} (${booking.roomId.type})` : "N/A"
//           }</td>
//           <td style="padding: 8px; text-align: left;">${new Date(
//             booking.checkIn
//           ).toLocaleDateString()}</td>
//           <td style="padding: 8px; text-align: left;">${new Date(
//             booking.checkOut
//           ).toLocaleDateString()}</td>
//           <td style="padding: 8px; text-align: left;">${
//             booking.status.charAt(0).toUpperCase() + booking.status.slice(1)
//           }</td>
//           <td style="padding: 8px; text-align: left;">${
//             booking.checkedIn ? "Checked In" : "Not Checked In"
//           }</td>
//         </tr>
//       `;
//     }).join("");
 
//     const report = `
//       <html>
//         <body style="font-family: Arial, sans-serif; color: #333;">
//           <h2 style="color: #1a73e8;">Daily Bookings Report - ${new Date().toLocaleDateString()}</h2>
//           <h3 style="color: #555;">Summary</h3>
//           <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
//             <tr>
//               <td style="padding: 8px; background-color: #f1f3f4; font-weight: bold;">Total Bookings</td>
//               <td style="padding: 8px;">${totalBookings}</td>
//             </tr>
//             <tr>
//               <td style="padding: 8px; background-color: #f1f3f4; font-weight: bold;">Checked In</td>
//               <td style="padding: 8px;">${checkedIn}</td>
//             </tr>
//             <tr>
//               <td style="padding: 8px; background-color: #f1f3f4; font-weight: bold;">Not Checked In</td>
//               <td style="padding: 8px;">${notCheckedIn}</td>
//             </tr>
//             <tr>
//               <td style="padding: 8px; background-color: #f1f3f4; font-weight: bold;">Pending</td>
//               <td style="padding: 8px;">${pending}</td>
//             </tr>
//             <tr>
//               <td style="padding: 8px; background-color: #f1f3f4; font-weight: bold;">Cancelled</td>
//               <td style="padding: 8px;">${cancelled}</td>
//             </tr>
//             <tr>
//               <td style="padding: 8px; background-color: #f1f3f4; font-weight: bold;">Approved</td>
//               <td style="padding: 8px;">${approved}</td>
//             </tr>
//           </table>

//           <h3 style="color: #555;">Booking Details</h3>
//           <table style="width: 100%; border-collapse: collapse;">
//             <thead>
//               <tr style="background-color: #1a73e8; color: white;">
//                 <th style="padding: 8px; text-align: left;">Booking ID</th>
//                 <th style="padding: 8px; text-align: left;">Hotel</th>
//                 <th style="padding: 8px; text-align: left;">Room</th>
//                 <th style="padding: 8px; text-align: left;">Check-In</th>
//                 <th style="padding: 8px; text-align: left;">Check-Out</th>
//                 <th style="padding: 8px; text-align: left;">Status</th>
//                 <th style="padding: 8px; text-align: left;">Check-In Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${bookingRows}
//             </tbody>
//           </table>

//           <p style="margin-top: 20px; color: #777;">
//             This is an automated report generated on ${new Date().toLocaleString()}.
//           </p>
//         </body>
//       </html>
//     `;

    
//     if (bookings.length > 0) {
//       await sendReportEmail(report);
//     } else {
//       console.log("No bookings found for the report.");
//     }
//   } catch (error) {
//     console.error("Error in generateBookingsReport cron job:", error);
//   }
// };

 
// const scheduleReportCronJob = () => {
//   cron.schedule("* *  * * *", generateBookingsReport, {
//     scheduled: true,
//     timezone: "Asia/Kolkata",
//   });
//   console.log("Cron job for generating bookings report scheduled to run daily at 10:00 PM IST.");
// };

 
// module.exports = { generateBookingsReport, scheduleReportCronJob };

const cron = require("node-cron");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const Booking = mongoose.model("Booking");
const Room = mongoose.model("Room");
const Hotel = mongoose.model("Hotel");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.email,
    pass: process.env.pass,
  },
});

const sendReportEmail = async (report) => {
  const mailOptions = {
    from: process.env.email,
    to: process.env.ADMIN_EMAIL,
    subject: `Daily Bookings Report - ${new Date().toLocaleDateString()}`,
    html: report,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Bookings report email sent to ${process.env.ADMIN_EMAIL}`);
  } catch (error) {
    console.error(`Failed to send bookings report email:`, error);
  }
};

const fetchHotelName = async (roomId) => {
  if (!roomId) return "N/A";
  try {
    const room = await Room.findById(roomId).populate("hotel");
    if (!room || !room.hotel) return "Hotel Not Found";
    return room.hotel.name || "Hotel Not Found";
  } catch (err) {
    console.error(`fetchHotelName for room ${roomId} - Error:`, err.message);
    return "Hotel Not Found";
  }
};

const generateBookingsReport = async () => {
  console.log("Running cron job to generate bookings report at", new Date().toISOString());

  try {
    const bookings = await Booking.find()
      .populate({
        path: "roomId",
        populate: { path: "hotel", strictPopulate: false },
      })
      .lean();

    console.log(`Found ${bookings.length} bookings in total`);
    if (bookings.length > 0) {
      console.log("Sample booking:", bookings[0]);
    }

    const totalBookings = bookings.length;
    const checkedIn = bookings.filter((b) => b.checkedIn).length;
    const notCheckedIn = bookings.filter((b) => !b.checkedIn).length;
    const pending = bookings.filter(
      (b) => b.status === "pending" && !b.checkedIn && b.status !== "cancelled"
    ).length;
    const cancelled = bookings.filter((b) => b.status === "cancelled").length;
    const approved = bookings.filter((b) => b.status === "approved").length;

    const hotelNames = {};
    for (const booking of bookings) {
      if (booking.roomId?._id && !booking.roomId?.hotel?.name) {
        const hotelName = await fetchHotelName(booking.roomId._id);
        hotelNames[booking.roomId._id] = hotelName;
      }
    }

    const bookingRows = bookings.map((booking) => {
      const hotelName =
        booking.roomId?.hotel?.name || hotelNames[booking.roomId?._id] || "No Hotel Name";
      return `
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 4px; text-align: left;">${booking._id}</td>
          <td style="padding: 4px; text-align: left;">${hotelName}</td>
          <td style="padding: 4px; text-align: left;">${
            booking.roomId ? `Room ${booking.roomId.roomNumber} (${booking.roomId.type})` : "N/A"
          }</td>
          <td style="padding: 4px; text-align: left;">${new Date(
            booking.checkIn
          ).toLocaleDateString()}</td>
          <td style="padding: 4px; text-align: left;">${new Date(
            booking.checkOut
          ).toLocaleDateString()}</td>
          <td style="padding: 4px; text-align: left;">${
            booking.status.charAt(0).toUpperCase() + booking.status.slice(1)
          }</td>
          <td style="padding: 4px; text-align: left;">${
            booking.checkedIn ? "Checked In" : "Not Checked In"
          }</td>
        </tr>
      `;
    }).join("");

    const report = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #000;">
          <h2 style="font-size: 18px; margin-bottom: 8px;">Daily Bookings Report - ${new Date().toLocaleDateString()}</h2>
          <h3 style="font-size: 14px; margin-bottom: 4px;">Summary</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">
            <tr>
              <td style="padding: 4px; font-weight: bold; border-bottom: 1px solid #e0e0e0;">Total Bookings</td>
              <td style="padding: 4px; border-bottom: 1px solid #e0e0e0;">${totalBookings}</td>
            </tr>
            <tr>
              <td style="padding: 4px; font-weight: bold; border-bottom: 1px solid #e0e0e0;">Checked In</td>
              <td style="padding: 4px; border-bottom: 1px solid #e0e0e0;">${checkedIn}</td>
            </tr>
            <tr>
              <td style="padding: 4px; font-weight: bold; border-bottom: 1px solid #e0e0e0;">Not Checked In</td>
              <td style="padding: 4px; border-bottom: 1px solid #e0e0e0;">${notCheckedIn}</td>
            </tr>
            <tr>
              <td style="padding: 4px; font-weight: bold; border-bottom: 1px solid #e0e0e0;">Pending</td>
              <td style="padding: 4px; border-bottom: 1px solid #e0e0e0;">${pending}</td>
            </tr>
            <tr>
              <td style="padding: 4px; font-weight: bold; border-bottom: 1px solid #e0e0e0;">Cancelled</td>
              <td style="padding: 4px; border-bottom: 1px solid #e0e0e0;">${cancelled}</td>
            </tr>
            <tr>
              <td style="padding: 4px; font-weight: bold; border-bottom: 1px solid #e0e0e0;">Approved</td>
              <td style="padding: 4px; border-bottom: 1px solid #e0e0e0;">${approved}</td>
            </tr>
          </table>

          <h3 style="font-size: 14px; margin-bottom: 4px;">Booking Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="padding: 4px; text-align: left; font-size: 12px;">Booking ID</th>
                <th style="padding: 4px; text-align: left; font-size: 12px;">Hotel</th>
                <th style="padding: 4px; text-align: left; font-size: 12px;">Room</th>
                <th style="padding: 4px; text-align: left; font-size: 12px;">Check-In</th>
                <th style="padding: 4px; text-align: left; font-size: 12px;">Check-Out</th>
                <th style="padding: 4px; text-align: left; font-size: 12px;">Status</th>
                <th style="padding: 4px; text-align: left; font-size: 12px;">Check-In Status</th>
              </tr>
            </thead>
            <tbody>
              ${bookingRows}
            </tbody>
          </table>

          <p style="margin-top: 12px; font-size: 12px; color: #666;">
            This is an automated report generated on ${new Date().toLocaleString()}.
          </p>
        </body>
      </html>
    `;

    if (bookings.length > 0) {
      await sendReportEmail(report);
    } else {
      console.log("No bookings found for the report.");
    }
  } catch (error) {
    console.error("Error in generateBookingsReport cron job:", error);
  }
};

const scheduleReportCronJob = () => {
  cron.schedule("0 8 * * *", generateBookingsReport, {
    scheduled: true,
    timezone: "Asia/Kolkata",
  });
  console.log("Cron job for generating bookings report scheduled to run daily at 10:00 PM IST.");
};



module.exports = { generateBookingsReport, scheduleReportCronJob };