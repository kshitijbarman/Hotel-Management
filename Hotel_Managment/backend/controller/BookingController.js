
const Booking = require("../model/BookingModel");
const Room = require("../model/RoomModel");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { validateCoupon } = require("./couponController");
const { default: mongoose } = require("mongoose");
require("dotenv").config();


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.email,
    pass: process.env.pass,
  },
});

const bookingController = {
  createBooking: async (req, res) => {
    const {
      userId,
      roomId,
      name,
      members,
      checkIn,
      checkOut,
      hasChild,
      phone,
      couponCode,
      totalPrice,
    } = req.body;

    try {
      if (!userId || !roomId || !name || !members || !checkIn || !checkOut || !phone || totalPrice === undefined) {
        return res.status(400).json({ message: "All required fields must be provided" });
      }

      const room = await Room.findById(roomId);
      if (!room || !room.isActive || !room.isAvailable) {
        return res.status(400).json({ message: "Room not available" });
      }

      if (members > room.capacity) {
        return res.status(400).json({ message: "Members exceed room capacity" });
      }

      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      if (checkOutDate <= checkInDate) {
        return res.status(400).json({ message: "Check-out date must be after check-in date" });
      }

      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      const basePrice = room.price * nights;

      let validatedDiscount = 0;
      let validatedCouponCode = null;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isAdmin = user.role === 'admin';
      const userBookings = await Booking.find({ userId });
      const isFirstBooking = userBookings.length === 0;

      console.log('userrtype--------------', isAdmin);

      if (isAdmin && !couponCode) {
        validatedDiscount = 20;
        validatedCouponCode = "ADMIN20";
      } else if (isFirstBooking && !couponCode && !isAdmin) {
        validatedDiscount = 50;
        validatedCouponCode = "FIRSTBOOKING50";
      } else if (couponCode) {
        console.log('coupon code------------------', couponCode);

        const couponValidation = await validateCoupon(couponCode, checkInDate);
        console.log('valid date for coupon---------------', validateCoupon);
        if (!couponValidation.valid) {
          return res.status(400).json({ message: couponValidation.message });
        }


        validatedDiscount = couponValidation.discount;
        validatedCouponCode = couponCode;
      }


      const expectedTotalPrice = basePrice * (1 - validatedDiscount / 100);

      if (Math.abs(expectedTotalPrice - totalPrice) > 0.01) {
        return res.status(400).json({ message: "Total price mismatch" });
      }

      const booking = new Booking({
        userId,
        roomId,
        name,
        members,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        hasChild,
        phone,
        couponCode: validatedCouponCode,
        discountApplied: validatedDiscount,
        totalPrice: expectedTotalPrice,
      });

      await booking.save();

      room.isAvailable = false;
      await room.save();

      res.status(201).json({ message: "Booking created successfully", booking });
    } catch (error) {
      console.error("createBooking - Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },


// getAllBookings: async (req, res) => {
//   try {
//     const bookings = await Booking.find()
//       .populate("userId", "firstname lastname email")
//       .populate({
//         path: "roomId",
//         populate: [
//           { path: "hotel", model: "Hotel", select: "name" },
//           { path: "city", model: "City", select: "name" },
//           { path: "state", model: "State", select: "name" },
//         ],
//       });

//     res.status(200).json({ bookings });
//   } catch (error) {
//     console.error("Get All Bookings error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// },

getAllBookings: async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "firstname lastname email")
      .populate({
        path: "roomId",
        populate: {
          path: "hotel",
          model: "Hotel",
          select: "name city",
          populate: {
            path: "city",
            model: "City",
            select: "name state",
            populate: {
              path: "state",
              model: "State",
              select: "name",
            },
          },
        },
      });

    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Get All Bookings error:", error);
    res.status(500).json({ message: "Server error" });
  }
},


  // getAllBookings: async (req, res) => {
  //   try {
  //     const bookings = await Booking.find()
  //       .populate({
  //         path: 'roomId',
  //         populate: [
  //           { path: 'hotel', model: 'Hotel' },
  //           { path: 'city', model: 'City' },
  //           { path: 'state', model: 'State' },
  //         ],
  //       });
  //     res.json({ bookings });
  //   } catch (error) {
  //     console.error("Get All Bookings error:", error);
  //     res.status(500).json({ message: "Server error" });

  //   }
  // },

    getAllsBookings : async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate({
                path: 'roomId',
                populate: [
                    { path: 'hotel', model: 'Hotel' },
                    { path: 'city', model: 'City' },
                    { path: 'state', model: 'State' },
                ],
            });
        res.json({ bookings });
    } catch (error) {
        console.error("Get All Bookings error:", error);
        res.status(500).json({ message: "Server error" });
    }
},

    updateBookingStatus: async (req, res) => {
      try {
        const { bookingId } = req.params;
        const { status } = req.body;

        if (!["pending", "approved", "rejected"].includes(status)) {
          return res.status(400).json({ message: "Invalid status" });
        }

        const booking = await Booking.findById(bookingId).populate("roomId");
        if (!booking) {
          return res.status(404).json({ message: "Booking not found" });
        }

        booking.status = status;
        await booking.save();

        if (status === "approved" && booking.roomId) {
          booking.roomId.isAvailable = false;
          await booking.roomId.save();

          const populatedBooking = await Booking.findById(bookingId)
            .populate("userId", "firstname lastname email")
            .populate("roomId", "roomNumber type price");

          const mailOptions = {
            from: process.env.email,
            to: populatedBooking.userId.email,
            subject: "Booking Approved - My Hotel",
            html: `
            <h2>Booking Approved</h2>
            <p>Dear ${populatedBooking.userId.firstname} ${populatedBooking.userId.lastname},</p>
            <p>We are pleased to inform you that your booking with My Hotel has been approved. Here are the details:</p>
            <ul>
              <li><strong>Booking ID:</strong> ${populatedBooking._id}</li>
              <li><strong>Room:</strong> Room ${populatedBooking.roomId.roomNumber} (${populatedBooking.roomId.type})</li>
              <li><strong>Price per Night:</strong> ₹${populatedBooking.roomId.price}</li>
              <li><strong>Check-In Date:</strong> ${new Date(populatedBooking.checkIn).toLocaleDateString()}</li>
              <li><strong>Check-Out Date:</strong> ${new Date(populatedBooking.checkOut).toLocaleDateString()}</li>
              <li><strong>Guests:</strong> ${populatedBooking.members} ${populatedBooking.hasChild ? "(Includes children)" : ""}</li>
              <li><strong>Phone:</strong> ${populatedBooking.phone}</li>
              <li><strong>Coupon Applied:</strong> ${populatedBooking.couponCode || "None"} (${populatedBooking.discountApplied}%)</li>
              <li><strong>Total Price:</strong> ₹${populatedBooking.totalPrice.toFixed(2)}</li>
              <li><strong>Status:</strong> ${populatedBooking.status.charAt(0).toUpperCase() + populatedBooking.status.slice(1)}</li>
            </ul>
            <p>We look forward to welcoming you! If you have any questions, feel free to contact us.</p>
            <p>Best regards,<br>My Hotel Team</p>
          `,
          };

          try {
            await transporter.sendMail(mailOptions);
            console.log("Approval email sent to:", populatedBooking.userId.email);
          } catch (emailError) {
            console.error("Error sending approval email:", emailError);
          }
        }

        res.status(200).json({ message: `Booking ${status} successfully`, booking });
      } catch (error) {
        console.error("Update Booking Status error:", error);
        res.status(500).json({ message: "Server error" });
      }
    },

      getUserBookings: async (req, res) => {

        //using populate
        try {
          const token = req.headers.authorization?.split(" ")[1];
          if (!token) {
            return res.status(401).json({ message: "No token provided" });
          }

          const decoded = jwt.verify(token, "asdfghjkl");
          if (!decoded || !decoded._id) {
            return res.status(401).json({ message: "Invalid token" });
          }

          const bookings = await Booking.find({ userId: decoded._id })
            .populate("roomId", "roomNumber type price hotel");
          res.status(200).json(bookings);
        } catch (error) {
          console.error("Get User Bookings error:", error);
          res.status(500).json({ message: "Server error" });
        }

        //using lookup

        // try {
        //   const token = req.headers.authorization?.split(" ")[1];
        //   if (!token) {
        //     return res.status(401).json({ message: "No token provided" });
        //   }

        //   const decoded = jwt.verify(token, "asdfghjkl");
        //   if (!decoded || !decoded._id) {
        //     return res.status(401).json({ message: "Invalid token" });
        //   }

        //   const bookings = await Booking.aggregate([
        //     {
        //       $lookup: {
        //         from: "rooms",
        //         localField: "roomId",
        //         foreignField: "_id",
        //         as: "roomId",
        //       },
        //     },
        //   ]);

        //   //array----------------- Filter bookings for the specific user
        //   const userBookings = bookings.filter(b => b.userId.toString() === decoded._id.toString());

        //   res.status(200).json(userBookings);
        // } catch (error) {
        //   console.error("Get User Bookings error:", error);
        //   res.status(500).json({ message: "Server error" });
        // }
      },


        // getUserBookings: async (req, res) => {
        //   try {
        //     const token = req.headers.authorization?.split(" ")[1];
        //     if (!token) {
        //       return res.status(401).json({ message: "No token provided" });
        //     }

        //     const decoded = jwt.verify(token, "asdfghjkl");
        //     if (!decoded || !decoded._id) {
        //       return res.status(401).json({ message: "Invalid token" });
        //     }

        //     const bookings = await Booking.aggregate([

        //       {
        //         $lookup: {
        //           from: "rooms",
        //           localField: "roomId",
        //           foreignField: "_id",
        //           as: "roomDetails",
        //         },
        //       },

        //       {
        //         $lookup: {
        //           from: "hotels",
        //           localField: "roomDetails.hotel",
        //           foreignField: "_id",
        //           as: "hotelDetails",
        //         },
        //       },

        //     ]);

        //     res.status(200).json(bookings);
        //   } catch (error) {
        //     console.error("Get User Bookings error:", error);
        //     res.status(500).json({ message: "Server error" });
        //   }
        // },

        checkInBooking: async (req, res) => {
          try {
            const { bookingId } = req.params;

            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
              return res.status(401).json({ message: "No token provided" });
            }
            console.log('token-------------', token);

            const decoded = jwt.verify(token, "asdfghjkl");
            if (!decoded || !decoded._id) {
              return res.status(401).json({ message: "Invalid token" });
            }

            const booking = await Booking.findById(bookingId);
            if (!booking) {
              return res.status(404).json({ message: "Booking not found" });
            }

            if (booking.userId.toString() !== decoded._id) {
              return res.status(403).json({ message: "Unauthorized: You can only check in your own bookings" });
            }

            if (booking.status !== "approved") {
              return res.status(400).json({ message: "Booking must be approved before checking in" });
            }

            if (booking.checkedIn) {
              return res.status(400).json({ message: "Booking is already checked in" });
            }

            booking.checkedIn = true;
            await booking.save();

            res.status(200).json({ message: "Checked in successfully", booking });
          } catch (error) {
            console.error("Check-In Booking error:", error);
            res.status(500).json({ message: "Server error" });
          }
        },

          cancelBooking: async (req, res) => {
            try {
              const bookingId = req.params.bookingId;


              const booking = await Booking.findById(bookingId);
              if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
              }


              if (booking.status === 'cancelled') {
                return res.status(400).json({ message: 'Booking is already cancelled' });
              }


              if (booking.checkedIn) {
                return res.status(400).json({ message: 'Cannot cancel a checked-in booking' });
              }

              booking.status = 'cancelled';
              await booking.save();

              console.log('booking cancle-----------------------');

              await Room.findByIdAndUpdate(booking.roomId, { isAvailable: true });

              res.status(200).json({ message: 'Booking cancelled successfully' });
            } catch (err) {
              console.error('Cancel Booking Error:', err);
              res.status(500).json({ message: 'Server error', error: err.message });
            }
          },
            DeleteBooking: async (req, res) => {
              try {
                const booking = await Booking.findById(req.params.id);
                if (!booking) {
                  return res.status(404).json({ message: "Booking not found" });
                }
                // Optional: Add permission checks (e.g., only admins can delete)
                // if (req.user.role !== "admin") {
                //     return res.status(403).json({ message: "Unauthorized" });
                // }

                const room = await Room.findById(booking.roomId);
                if (!room) {
                  return res.status(404).json({ message: "Associated room not found" });
                }
                await Booking.findByIdAndDelete(req.params.id);
                room.isAvailable = true;
                await room.save();
                res.json({ message: "Booking deleted successfully" });
              } catch (error) {
                console.error("Error deleting booking:", error);
                res.status(500).json({ message: "Server error" });
              }
            }

    //   DeleteBooking: async (req, res) => {
    //   const { bookingId } = req.params;

    //   try {
    //     // Check if req.user is set
    //     if (!req.user) {
    //       return res.status(401).json({ message: 'User not authenticated' });
    //     }

    //     const userId = req.user._id;
    //     const userRole = req.user.role;

    //     // Find the booking
    //     const booking = await Booking.findById(bookingId);
    //     if (!booking) {
    //       return res.status(404).json({ message: "Booking not found" });
    //     }

    //     // Check if the user is authorized to delete the booking
    //     if (userRole !== 'admin' && booking.userId.toString() !== userId.toString()) {
    //       return res.status(403).json({ message: "You are not authorized to delete this booking" });
    //     }

    //     // Get the room associated with the booking
    //     const room = await Room.findById(booking.roomId);
    //     if (!room) {
    //       return res.status(404).json({ message: "Associated room not found" });
    //     }

    //     // Delete the booking
    //     await Booking.findByIdAndDelete(bookingId);

    //     // Set the room's isAvailable to true
    //     room.isAvailable = true;
    //     await room.save();

    //     res.status(200).json({ message: "Booking deleted successfully, room is now available" });
    //   } catch (error) {
    //     console.error("deleteBooking - Error:", error);
    //     res.status(500).json({ message: "Server error", error: error.message });
    //   }
    // },

  };





  module.exports = bookingController;