const cron = require("node-cron");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const Booking = mongoose.model("Booking");
const User = mongoose.model("User");
const dotenv = require("dotenv");


const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.email,
        pass: process.env.pass,
    },
});


const sendDeactivationEmail = async (user) => {
    const mailOptions = {
        from: process.env.email,
        to: user.email,
        subject: "Account Deactivated ",
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
        <h2 style="color: #333;">Account Deactivation  </h2>
        <p>Dear ${user.email},</p>
        <p>We have noticed that you have missed check-ins for more than 5 approved bookings in our hotel booking system.</p>
        <p>So, your account has been deactivated. To reactivate your account, please contact Admin</p>
        <p>Best regards,<br>My Hotel Team</p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Deactivation email sent to ${user.email}`);
    } catch (error) {
        console.error(`Failed to send deactivation email to ${user.email}:`, error);
    }
};


const checkMissedBookings = async () => {
    console.log("Running cron job to check missed bookings at", new Date().toISOString());

    try {

        const currentDate = new Date();
        console.log("Current date for comparison:", currentDate.toISOString());

        const pastApprovedBookings = await Booking.find({

            checkedIn: false,
            status: "approved"
        }).select("userId checkIn checkedIn status");
        console.log(`Found ${pastApprovedBookings.length} approved bookings with past check-in dates and checkedIn: false`);
        if (pastApprovedBookings.length > 0) {
            console.log("------- booking--------", pastApprovedBookings[0]);
        }
        try {
            const allBookings = await Booking.find();

            const userMissedCounts = [];

            for (const booking of allBookings) {
                if (booking.checkedIn === false && booking.status === "approved") {
                    let found = false;

                    for (let i = 0; i < userMissedCounts.length; i++) {
                        if (userMissedCounts[i].userId.toString() === booking.userId.toString()) {
                            userMissedCounts[i].count += 1;
                            found = true;
                            break;
                        }
                    }

                    if (!found) {
                        userMissedCounts.push({ userId: booking.userId, count: 1 });
                    }
                }
            }

            const missedBookings = [];

            for (const entry of userMissedCounts) {
                if (entry.count > 5) {
                    missedBookings.push({ _id: entry.userId, missedCount: entry.count });
                }
            }

            console.log("Users with more than 5 missed check-ins:", missedBookings);

            for (const userData of missedBookings) {
                const userId = userData._id;
                const missedCount = userData.missedCount;

                const user = await User.findById(userId);
              

                if (user.isDisabled) {
                    console.log(`User ${user.email} is already deactivated. Skipping...`);
                    continue;
                }

                user.isDisabled = true;
                await user.save();
                console.log(`Deactivated user ${user.email} due to ${missedCount} missed check-ins.`);

                await sendDeactivationEmail(user);
            }

            if (missedBookings.length === 0) {
                console.log("No users found with more than 5 missed check-ins.");
            }
        } catch (error) {
            console.error("Error in checkMissedBookings cron job:", error);
        }

        // const missedBookings = await Booking.aggregate([
        //   {
        //     $match: {

        //       checkedIn: false,
        //       status: "approved",
        //     },
        //   },
        //   {
        //     $group: {
        //       _id: "$userId", 
        //       missedCount: { $sum: 1 },
        //     },
        //   },
        //   {
        //     $match: {
        //       missedCount: { $gt: 5 },
        //     },
        //   },
        // ]);

        // console.log("Users with more than 5 missed check-ins:", missedBookings);

        // for (const userData of missedBookings) {
        //   const userId = userData._id;
        //   const missedCount = userData.missedCount;

        //   const user = await User.findById(userId);
        //   if (!user) {
        //     console.log(`User with ID ${userId} not found. Skipping...`);
        //     continue;
        //   }
        //   if (user.isDisabled) {  
        //     console.log(`User ${user.email} is already deactivated. Skipping...`);
        //   }
        //   user.isDisabled = true;  
        //   await user.save();
        //   console.log(`Deactivated user ${user.email} due to ${missedCount} missed check-ins.`);

        //   await sendDeactivationEmail(user);
        // }


    } catch (error) {
        console.error("Error in checkMissedBookings cron job:", error);
    }
};


const scheduleCronJob = () => {
    cron.schedule("0 8 * * *", checkMissedBookings, {
        scheduled: true,
        timezone: "Asia/Kolkata",
    });
    console.log("Cron job for checking missed bookings scheduled to run daily at midnight IST.");
};




module.exports = { checkMissedBookings, scheduleCronJob };