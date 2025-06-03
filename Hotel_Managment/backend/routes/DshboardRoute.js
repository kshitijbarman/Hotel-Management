const express = require('express');
const router = express.Router();
const analyticsController = require('../controller/DashboardController');

// Admin middleware (placeholder - implement based on your auth system)
const authAdmin = (req, res, next) => {
  const isAdmin = true; // Replace with actual admin authentication logic
  if (!isAdmin) return res.status(403).json({ message: 'Admin access required' });
  next();
};

// Analytics routes
router.get('/booking-trends', authAdmin, analyticsController.getBookingTrends);
router.get('/revenue-trends', authAdmin, analyticsController.getRevenueTrends);
router.get('/user-activity', authAdmin, analyticsController.getUserActivity);
router.get('/booking-status', authAdmin, analyticsController.getBookingStatusBreakdown);
router.get('/top-hotels', authAdmin, analyticsController.getTopHotels);
router.get('/average-booking-value', authAdmin, analyticsController.getAverageBookingValue);
router.get('/bookingss', authAdmin, analyticsController.getBookingsByStatus);
router.get('/userss', authAdmin, analyticsController.getAllUsers);
router.get('/revenue', authAdmin, analyticsController.getRevenueDetails);
router.get('/rooms', authAdmin, analyticsController.getRoomStats);
router.get('/states', authAdmin, analyticsController.getAllStates);
router.get('/cities', authAdmin, analyticsController.getAllCities);
router.get('/hotels', authAdmin, analyticsController.getAllHotels);
router.get('/quick-stats', authAdmin, analyticsController.getQuickStats);

module.exports = router;