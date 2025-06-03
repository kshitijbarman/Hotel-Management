 
// const Booking = require('../model/BookingModel');
// const User = require('../model/userModel');
// const Room = require('../model/RoomModel');
// const Hotel = require('../model/HotelModel');
// const City = require('../model/CityModel');
// const State = require('../model/StateModel');

// // Get booking trends (daily booking counts)
// const getBookingTrends = async (req, res) => {
//   try {
//     const stats = await Booking.aggregate([
//       {
//         $group: {
//           _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "Asia/Kolkata" } },
//           count: { $sum: 1 },
//         },
//       },
//       { $sort: { _id: 1 } },
//       { $limit: 30 },
//     ]);
//     res.json(stats.map(s => ({ date: s._id, count: s.count })));
//   } catch (error) {
//     console.error('Error fetching booking trends:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Get revenue trends (daily revenue)
// const getRevenueTrends = async (req, res) => {
//   try {
//     const stats = await Booking.aggregate([
//       { $match: { status: 'approved' } },
//       {
//         $group: {
//           _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "Asia/Kolkata" } },
//           totalRevenue: { $sum: "$totalPrice" },
//         },
//       },
//       { $sort: { _id: 1 } },
//       { $limit: 30 },
//     ]);
//     res.json(stats.map(s => ({ date: s._id, revenue: s.totalRevenue })));
//   } catch (error) {
//     console.error('Error fetching revenue trends:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Get user activity (active vs inactive users)
// const getUserActivity = async (req, res) => {
//   try {
//     const stats = await User.aggregate([
//       {
//         $group: {
//           _id: '$isActive',
//           count: { $sum: 1 },
//         },
//       },
//     ]);
//     const active = stats.find(s => s._id === true)?.count || 0;
//     const inactive = stats.find(s => s._id === false)?.count || 0;
//     res.json({ active, inactive });
//   } catch (error) {
//     console.error('Error fetching user activity:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Get booking status breakdown
// const getBookingStatusBreakdown = async (req, res) => {
//   try {
//     const stats = await Booking.aggregate([
//       {
//         $group: {
//           _id: '$status',
//           count: { $sum: 1 },
//         },
//       },
//     ]);
//     res.json(stats.map(s => ({ status: s._id, count: s.count })));
//   } catch (error) {
//     console.error('Error fetching booking status breakdown:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Get top hotels by bookings (using populate instead of $lookup)
// const getTopHotels = async (req, res) => {
//   try {
//     const bookings = await Booking.find({ status: 'approved' })
//       .populate({
//         path: 'roomId',
//         populate: { path: 'hotel' },
//       });

//     const hotelStats = {};
//     bookings.forEach(booking => {
//       if (booking.roomId && booking.roomId.hotel) {
//         const hotel = booking.roomId.hotel._id.toString();
//         const hotelName = booking.roomId.hotel.name;
//         if (!hotelStats[hotel]) {
//           hotelStats[hotel] = { hotel, hotelName, bookingCount: 0 };
//         }
//         hotelStats[hotel].bookingCount += 1;
//       }
//     });

//     const stats = Object.values(hotelStats)
//       .sort((a, b) => b.bookingCount - a.bookingCount)
//       .slice(0, 5);

//     res.json(stats);
//   } catch (error) {
//     console.error('Error fetching top hotels:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Get average booking value
// const getAverageBookingValue = async (req, res) => {
//   try {
//     const stats = await Booking.aggregate([
//       { $match: { status: 'approved' } },
//       {
//         $group: {
//           _id: null,
//           averageValue: { $avg: '$totalPrice' },
//           totalBookings: { $sum: 1 },
//         },
//       },
//     ]);
//     const result = stats[0] || { averageValue: 0, totalBookings: 0 };
//     res.json({ averageValue: result.averageValue.toFixed(2), totalBookings: result.totalBookings });
//   } catch (error) {
//     console.error('Error fetching average booking value:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Get bookings by status (for Bookings tab sub-tabs)
 

// const getBookingsByStatus = async (req, res) => {
//     try {
//       const { status } = req.query;
//       let query = {};
//       if (status && status !== 'all') {
//         if (status === 'checkins') {
//           query = { checkedIn: true };
//         } else if (status === 'new') {
//           query = { createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } };
//         } else {
//           query = { status };
//         }
//       }
//       console.log('Query:', query);
//       const bookings = await Booking.find(query)
//         .populate('userId', 'name email')
//         .populate({
//           path: 'roomId',
//           select: 'roomNumber hotel',
//           populate: { path: 'hotel', select: 'name' },
//         })
//         .lean();
//       console.log('Populated bookings:', JSON.stringify(bookings, null, 2));
//       res.json(bookings.map(booking => ({
//         ...booking,
//         roomId: {
//           ...booking.roomId,
//           hotel: booking.roomId.hotel || null,
//         },
//       })));
//     } catch (error) {
//       console.error('Error fetching bookings by status:', error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   };

// // Get all users (for Users tab)
// const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find().select('firstname lastname email role isDisabled createdAt');
//     console.log('Fetched users:', users);
//     res.json(users);
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Get revenue details (for Revenue tab)
// const getRevenueDetails = async (req, res) => {
//   try {
//     const stats = await Booking.aggregate([
//       { $match: { status: 'approved' } },
//       {
//         $group: {
//           _id: null,
//           totalRevenue: { $sum: '$totalPrice' },
//           totalBookings: { $sum: 1 },
//         },
//       },
//     ]);
//     const result = stats[0] || { totalRevenue: 0, totalBookings: 0 };
//     res.json(result);
//   } catch (error) {
//     console.error('Error fetching revenue details:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Get room stats (for Rooms tab)
// const getRoomStats = async (req, res) => {
//   try {
//     const totalRooms = await Room.countDocuments();
//     const bookings = await Booking.find({
//       checkIn: { $lte: new Date() },
//       checkOut: { $gte: new Date() },
//       status: 'approved',
//     }).populate('roomId');
    
//     const busyRoomIds = new Set(bookings.map(b => b.roomId?._id?.toString()));
//     const busyRooms = busyRoomIds.size;
//     const availableRooms = totalRooms - busyRooms;

//     res.json({ totalRooms, availableRooms, busyRooms });
//   } catch (error) {
//     console.error('Error fetching room stats:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Get all states (for State tab)
// const getAllStates = async (req, res) => {
//   try {
//     const states = await State.find().select('name');
//     res.json(states);
//   } catch (error) {
//     console.error('Error fetching states:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Get all cities (for City tab)
// const getAllCities = async (req, res) => {
//   try {
//     const cities = await City.find().populate('state', 'name').select('name state');
//     res.json(cities);
//   } catch (error) {
//     console.error('Error fetching cities:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Get all hotels (for Hotels tab)
// const getAllHotels = async (req, res) => {
//   try {
//     const hotels = await Hotel.find().populate('cityId', 'name').select('name cityId');
//     res.json(hotels);
//   } catch (error) {
//     console.error('Error fetching hotels:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Quick stats for Home tab widgets
// const getQuickStats = async (req, res) => {
//   try {
//     const [
//       bookingStats,
//       userStats,
//       revenueStats,
//       roomStats,
//       stateCount,
//       cityCount,
//       hotelCount,
//     ] = await Promise.all([
//       Booking.aggregate([
//         {
//           $group: {
//             _id: '$status',
//             count: { $sum: 1 },
//           },
//         },
//       ]),
//       User.aggregate([
//         {
//           $group: {
//             _id: '$isDisabled',
//             count: { $sum: 1 },
//           },
//         },
//       ]),
//       Booking.aggregate([
//         { $match: { status: 'approved' } },
//         {
//           $group: {
//             _id: null,
//             totalRevenue: { $sum: '$totalPrice' },
//           },
//         },
//       ]),
//       Room.countDocuments().then(totalRooms => {
//         return Booking.find({
//           checkIn: { $lte: new Date() },
//           checkOut: { $gte: new Date() },
//           status: 'approved',
//         })
//           .populate('roomId')
//           .then(bookings => {
//             const busyRoomIds = new Set(bookings.map(b => b.roomId?._id?.toString()));
//             const busyRooms = busyRoomIds.size;
//             return { totalRooms, availableRooms: totalRooms - busyRooms, busyRooms };
//           });
//       }),
//       State.countDocuments(),
//       City.countDocuments(),
//       Hotel.countDocuments(),
//     ]);

//     const stats = {
//       bookings: {
//         total: bookingStats.reduce((sum, s) => sum + s.count, 0),
//         breakdown: bookingStats,
//       },
//       users: {
//         active: userStats.find(s => s._id === true)?.count || 0,
//         inactive: userStats.find(s => s._id === false)?.count || 0,
//       },
//       revenue: revenueStats[0]?.totalRevenue || 0,
//       rooms: roomStats,
//       states: stateCount,
//       cities: cityCount,
//       hotels: hotelCount,
//     };

//     res.json(stats);
//   } catch (error) {
//     console.error('Error fetching quick stats:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// module.exports = {
//   getBookingTrends,
//   getRevenueTrends,
//   getUserActivity,
//   getBookingStatusBreakdown,
//   getTopHotels,
//   getAverageBookingValue,
//   getBookingsByStatus,
//   getAllUsers,
//   getRevenueDetails,
//   getRoomStats,
//   getAllStates,
//   getAllCities,
//   getAllHotels,
//   getQuickStats,
// };


const Booking = require('../model/BookingModel');
const User = require('../model/userModel');
const Room = require('../model/RoomModel');
const Hotel = require('../model/HotelModel');
const City = require('../model/CityModel');
const State = require('../model/StateModel');
 
const getBookingTrends = async (req, res) => {
  try {
 
    const bookings = await Booking.find().lean();

 
    const stats = {};
    bookings.forEach(booking => {
      const createdAt = new Date(booking.createdAt);
 
      createdAt.setHours(createdAt.getHours() + 5);
      createdAt.setMinutes(createdAt.getMinutes() + 30);
      const dateStr = createdAt.toISOString().split('T')[0];  
      if (!stats[dateStr]) {
        stats[dateStr] = 0;
      }
      stats[dateStr] += 1;
    });

 
    const result = Object.keys(stats)
      .map(date => ({ date, count: stats[date] }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-30); 

    res.json(result);
  } catch (error) {
    console.error('Error fetching booking trends:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
 
const getRevenueTrends = async (req, res) => {
  try {
 
    const bookings = await Booking.find({ status: 'approved' }).lean();

    
    const stats = {};
    bookings.forEach(booking => {
      const createdAt = new Date(booking.createdAt);
   
      createdAt.setHours(createdAt.getHours() + 5);
      createdAt.setMinutes(createdAt.getMinutes() + 30);
      const dateStr = createdAt.toISOString().split('T')[0];  
      if (!stats[dateStr]) {
        stats[dateStr] = 0;
      }
      stats[dateStr] += booking.totalPrice || 0;
    });

  
    const result = Object.keys(stats)
      .map(date => ({ date, revenue: stats[date] }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-30);  

    res.json(result);
  } catch (error) {
    console.error('Error fetching revenue trends:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

 
const getUserActivity = async (req, res) => {
  try {
 
    const users = await User.find().lean();
 
    let active = 0;
    let inactive = 0;
    users.forEach(user => {
      if (user.isDisabled === true) {
        inactive += 1;
      } else if (user.isDisabled === false) {
        active += 1;
      }
    });

    res.json({ active, inactive });
  } catch (error) {
    console.error('Error fetching user activity:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

 
const getBookingStatusBreakdown = async (req, res) => {
  try {
 
    const bookings = await Booking.find().lean();

 
    const stats = {};
    bookings.forEach(booking => {
      const status = booking.status;
      if (!stats[status]) {
        stats[status] = 0;
      }
      stats[status] += 1;
    });

 
    const result = Object.keys(stats).map(status => ({
      status,
      count: stats[status],
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching booking status breakdown:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
 
const getTopHotels = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: 'approved' })
      .populate({
        path: 'roomId',
        populate: { path: 'hotel' },
      })
      .lean();

    const hotelStats = {};
    bookings.forEach(booking => {
      if (booking.roomId && booking.roomId.hotel) {
        const hotelId = booking.roomId.hotel._id.toString();
        const hotelName = booking.roomId.hotel.name;
        if (!hotelStats[hotelId]) {
          hotelStats[hotelId] = { hotel: hotelId, hotelName, bookingCount: 0 };
        }
        hotelStats[hotelId].bookingCount += 1;
      }
    });

    const stats = Object.values(hotelStats)
      .sort((a, b) => b.bookingCount - a.bookingCount)
      .slice(0, 5);

    res.json(stats);
  } catch (error) {
    console.error('Error fetching top hotels:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

 
const getAverageBookingValue = async (req, res) => {
  try {
    
    const bookings = await Booking.find({ status: 'approved' }).lean();

    let totalPrice = 0;
    const totalBookings = bookings.length;

    bookings.forEach(booking => {
      totalPrice += booking.totalPrice || 0;
    });

    const averageValue = totalBookings > 0 ? (totalPrice / totalBookings).toFixed(2) : 0;

    res.json({ averageValue, totalBookings });
  } catch (error) {
    console.error('Error fetching average booking value:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

 
const getBookingsByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status && status !== 'all') {
      if (status === 'checkins') {
        query = { checkedIn: true };
      } else if (status === 'new') {
        query = { createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } };
      } else {
        query = { status };
      }
    }
    console.log('Query:', query);
    const bookings = await Booking.find(query)
      .populate('userId', 'name email')
      .populate({
        path: 'roomId',
        select: 'roomNumber hotel',
        populate: { path: 'hotel', select: 'name' },
      })
      .lean();
    console.log('Populated bookings:', JSON.stringify(bookings, null, 2));
    res.json(
      bookings.map(booking => ({
        ...booking,
        roomId: {
          ...booking.roomId,
          hotel: booking.roomId?.hotel || null,
        },
      }))
    );
  } catch (error) {
    console.error('Error fetching bookings by status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

 
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('firstname lastname email role isDisabled createdAt').lean();
    console.log('Fetched users:', users);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

 
const getRevenueDetails = async (req, res) => {
  try {
  
    const bookings = await Booking.find({ status: 'approved' }).lean();

    let totalRevenue = 0;
    const totalBookings = bookings.length;

    bookings.forEach(booking => {
      totalRevenue += booking.totalPrice || 0;
    });

    res.json({ totalRevenue, totalBookings });
  } catch (error) {
    console.error('Error fetching revenue details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

 
const getRoomStats = async (req, res) => {
  try {
    const totalRooms = await Room.countDocuments();
    const bookings = await Booking.find({
      checkIn: { $lte: new Date() },
      checkOut: { $gte: new Date() },
      status: 'approved',
    })
      .populate('roomId')
      .lean();

    const busyRoomIds = new Set(bookings.map(b => b.roomId?._id?.toString()));
    const busyRooms = busyRoomIds.size;
    const availableRooms = totalRooms - busyRooms;

    res.json({ totalRooms, availableRooms, busyRooms });
  } catch (error) {
    console.error('Error fetching room stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

 
const getAllStates = async (req, res) => {
  try {
    const states = await State.find().select('name').lean();
    res.json(states);
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

 
const getAllCities = async (req, res) => {
  try {
    const cities = await City.find()
      .populate('state', 'name')
      .select('name state')
      .lean();
    res.json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

 
const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find()
      .populate('cityId', 'name')
      .select('name cityId')
      .lean();
    res.json(hotels);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

 
const getQuickStats = async (req, res) => {
  try {
    const bookings = await Booking.find().lean();
    const users = await User.find().lean();
    const rooms = await Room.find().lean();
    const states = await State.find().lean();
    const cities = await City.find().lean();
    const hotels = await Hotel.find().lean();

 
    const bookingStats = {};
    bookings.forEach(booking => {
      const status = booking.status;
      if (!bookingStats[status]) {
        bookingStats[status] = 0;
      }
      bookingStats[status] += 1;
    });
    const bookingBreakdown = Object.keys(bookingStats).map(status => ({
      _id: status,
      count: bookingStats[status],
    }));
    const totalBookings = bookings.length;

 
    let activeUsers = 0;
    let inactiveUsers = 0;
    users.forEach(user => {
      if (user.isDisabled === true) {
        inactiveUsers += 1;
      } else if (user.isDisabled === false) {
        activeUsers += 1;
      }
    });

   
    let totalRevenue = 0;
    bookings.forEach(booking => {
      if (booking.status === 'approved') {
        totalRevenue += booking.totalPrice || 0;
      }
    });

    const totalRooms = rooms.length;
    const currentBookings = bookings.filter(booking => {
      const now = new Date();
      return (
        booking.checkIn <= now &&
        booking.checkOut >= now &&
        booking.status === 'approved'
      );
    });
    const busyRoomIds = new Set(currentBookings.map(b => b.roomId?.toString()));
    const busyRooms = busyRoomIds.size;
    const availableRooms = totalRooms - busyRooms;

    
    const stateCount = states.length;
    const cityCount = cities.length;
    const hotelCount = hotels.length;

    const stats = {
      bookings: {
        total: totalBookings,
        breakdown: bookingBreakdown,
      },
      users: {
        active: activeUsers,
        inactive: inactiveUsers,
      },
      revenue: totalRevenue,
      rooms: {
        totalRooms,
        availableRooms,
        busyRooms,
      },
      states: stateCount,
      cities: cityCount,
      hotels: hotelCount,
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching quick stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getBookingTrends,
  getRevenueTrends,
  getUserActivity,
  getBookingStatusBreakdown,
  getTopHotels,
  getAverageBookingValue,
  getBookingsByStatus,
  getAllUsers,
  getRevenueDetails,
  getRoomStats,
  getAllStates,
  getAllCities,
  getAllHotels,
  getQuickStats,
};