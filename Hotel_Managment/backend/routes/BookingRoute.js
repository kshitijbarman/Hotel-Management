const express = require("express");
const router = express.Router();
const bookingController = require("../controller/BookingController");

router.post("/", bookingController.createBooking);
router.get("/", bookingController.getAllBookings);
router.get("/revenue", bookingController.getAllsBookings);
router.patch("/:bookingId/status", bookingController.updateBookingStatus);
router.get("/my-bookings", bookingController.getUserBookings);
router.post("/:bookingId/checkin", bookingController.checkInBooking);
router.post("/:bookingId/cancel",  bookingController.cancelBooking);
router.delete("/:id",  bookingController.DeleteBooking);

module.exports = router;