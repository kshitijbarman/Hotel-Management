
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import useDarkMode from "../../User/hooks/useDarkMode";
import api from "../../../Utils/api";
import Header from "./Header";
import Navigation from "./Navigation";
import OverviewScreen from "./OverviewScreen";
import RevenueScreen from "./RevenueScreen";
import ProfileScreen from "./ProfileScreen";
import UsersScreen from "./UsersScreen";
import BookingsScreen from "./BookingsScreen";
import HotelsScreen from "./HotelsScreen";
import CouponsScreen from "./CouponsScreen";
import jsPDF from "jspdf";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ChartDataLabels
);

const UserDashboard = () => {
  const [currentScreen, setCurrentScreen] = useState("overview");
  const [isDarkMode, toggleMode] = useDarkMode();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [overviewStats, setOverviewStats] = useState({
    bookings: 0,
    hotels: 0,
    locations: 0,
    coupons: 0,
  });
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [overviewError, setOverviewError] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    byState: [],
    byCity: [],
    byHotel: [],
    byDate: [],
  });
  const [revenueFilters, setRevenueFilters] = useState({
    startDate: "",
    endDate: "",
    state: "",
    city: "",
    hotel: "",
  });
  const [revenueLoading, setRevenueLoading] = useState(false);
  const [revenueError, setRevenueError] = useState(null);

  const [profileUsers, setProfileUsers] = useState([]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);

  const [bookingsList, setBookingsList] = useState([]);
  const [bookingsFilters, setBookingsFilters] = useState({
    status: "",
    hotel: "",
    startDate: "",
    endDate: "",
    search: "",
  });
  const [bookingsSort, setBookingsSort] = useState({
    field: "checkIn",
    order: "asc",
  });
  const [bookingsPage, setBookingsPage] = useState(1);
  const bookingsPerPage = 10;
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState(null);

  const [hotelsStates, setHotelsStates] = useState([]);
  const [hotelsCities, setHotelsCities] = useState([]);
  const [selectedHotelState, setSelectedHotelState] = useState("");
  const [selectedHotelCity, setSelectedHotelCity] = useState("");
  const [hotelsSearch, setHotelsSearch] = useState("");
  const [hotelsPage, setHotelsPage] = useState(1);
  const hotelsPerPage = 10;
  const [hotels, setHotels] = useState([]);
  const [hotelsLoading, setHotelsLoading] = useState(false);
  const [hotelsError, setHotelsError] = useState(null);

  const [roomsStates, setRoomsStates] = useState([]);
  const [roomsCities, setRoomsCities] = useState([]);
  const [roomsHotels, setRoomsHotels] = useState([]);
  const [selectedRoomState, setSelectedRoomState] = useState("");
  const [selectedRoomCity, setSelectedRoomCity] = useState("");
  const [selectedRoomHotel, setSelectedRoomHotel] = useState("");
  const [roomsSearch, setRoomsSearch] = useState("");
  const [roomsPage, setRoomsPage] = useState(1);
  const roomsPerPage = 10;
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [roomsError, setRoomsError] = useState(null);

  const [allCoupons, setAllCoupons] = useState([]);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [couponsError, setCouponsError] = useState(null);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState("bookings");
  const [reportStartDate, setReportStartDate] = useState("");
  const [reportEndDate, setReportEndDate] = useState("");

  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  const handleBack = () => {
    navigate("/admin");
  };

  const fetchUser = async () => {
    try {
      const response = await api.get("user/me");
      setUser(response.data.user);
    } catch (err) {
      setError("Failed to fetch user details. Please log in again.");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setOverviewLoading(true);
    try {
      const [bookingsRes, hotelsRes, locationsRes, couponsRes] =
        await Promise.all([
          api.get(isAdmin ? "api/bookings/" : "api/bookings/"),
          api.get("api/hotels"),
          api.get("api/states"),
          api.get("api/coupons/"),
        ]);
      setOverviewStats({
        bookings: Array.isArray(bookingsRes.data)
          ? bookingsRes.data.length
          : bookingsRes.data.bookings?.length || 0,
        hotels: Array.isArray(hotelsRes.data) ? hotelsRes.data.length : 0,
        locations: Array.isArray(locationsRes.data)
          ? locationsRes.data.length
          : 0,
        coupons: Array.isArray(couponsRes.data) ? couponsRes.data.length : 0,
      });
    } catch (err) {
      setOverviewError("Failed to fetch overview stats.");
    } finally {
      setOverviewLoading(false);
    }
  };

  const fetchBookings = async () => {
    setRevenueLoading(true);
    setBookingsLoading(true);
    try {
      const endpoint = isAdmin ? "/api/bookings/" : "/api/bookings/";
      const response = await api.get(endpoint);
      const bookingsData = response.data.bookings || [];
      setBookings(bookingsData);
      setBookingsList(bookingsData);
    } catch (err) {
      setRevenueError("Failed to fetch bookings.");
      setBookingsError("Failed to fetch bookings.");
    } finally {
      setRevenueLoading(false);
      setBookingsLoading(false);
    }
  };

  const fetchProfileUsers = async () => {
    setProfileLoading(true);
    try {
      const response = await api.get("/user/getAllUsers");
      const usersData = Array.isArray(response.data)
        ? response.data
        : response.data.userData || [];
      setProfileUsers(usersData);
    } catch (err) {
      setProfileError(
        "Failed to fetch users. Please check your permissions or try again."
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await api.get("/user/getAllUsers");
      const usersData = Array.isArray(response.data)
        ? response.data
        : response.data.userData || [];
      setUsers(usersData);
    } catch (err) {
      setUsersError(
        "Failed to fetch users. Please check your permissions or try again."
      );
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchHotelsCities = async () => {
    if (!selectedHotelState) return;
    setHotelsLoading(true);
    try {
      const response = await api.get(
        `/api/states/${selectedHotelState}/cities`
      );
      setHotelsCities(response.data || []);
      if (response.data.length > 0) {
        setSelectedHotelCity(response.data[0]._id);
      } else {
        setSelectedHotelCity("");
        setHotels([]);
      }
      setRoomsCities(response.data || []);
    } catch (err) {
      setHotelsError("Failed to fetch cities.");
    } finally {
      setHotelsLoading(false);
    }
  };

  const fetchHotels = async () => {
    if (!selectedHotelCity) return;
    setHotelsLoading(true);
    try {
      const response = await api.get(`/api/cities/${selectedHotelCity}/hotels`);
      setHotels(response.data || []);
    } catch (err) {
      setHotelsError("Failed to fetch hotels.");
    } finally {
      setHotelsLoading(false);
    }
  };

  const fetchAllHotels = async () => {
    setHotelsLoading(true);
    try {
      const response = await api.get("/api/hotels");
      setHotels(response.data || []);
      setSelectedHotelState("");
      setSelectedHotelCity("");
      setHotelsCities([]);
    } catch (err) {
      setHotelsError("Failed to fetch all hotels.");
    } finally {
      setHotelsLoading(false);
    }
  };

  const fetchRoomsHotels = async () => {
    if (!selectedRoomCity) return;
    setRoomsLoading(true);
    try {
      const response = await api.get(`/api/cities/${selectedRoomCity}/hotels`);
      setRoomsHotels(response.data || []);
      if (response.data.length > 0) {
        setSelectedRoomHotel(response.data[0]._id);
      } else {
        setSelectedRoomHotel("");
        setRooms([]);
      }
    } catch (err) {
      setRoomsError("Failed to fetch hotels for rooms.");
    } finally {
      setRoomsLoading(false);
    }
  };

  const fetchRooms = async () => {
    if (!selectedRoomHotel) return;
    setRoomsLoading(true);
    try {
      const response = await api.get(`/api/hotels/${selectedRoomHotel}/rooms`);
      setRooms(response.data || []);
    } catch (err) {
      setRoomsError("Failed to fetch rooms.");
    } finally {
      setRoomsLoading(false);
    }
  };

  const fetchCoupons = async () => {
    setCouponsLoading(true);
    try {
      const response = await api.get("/api/coupons/");
      const allCouponsData = response.data || [];
      setAllCoupons(allCouponsData);
      setAvailableCoupons(allCouponsData.filter((coupon) => coupon.isActive));
    } catch (err) {
      setCouponsError("Failed to fetch coupons.");
    } finally {
      setCouponsLoading(false);
    }
  };

  const fetchStates = async () => {
    setHotelsLoading(true);
    setRoomsLoading(true);
    try {
      const response = await api.get("/api/states");
      setHotelsStates(response.data || []);
      setRoomsStates(response.data || []);
    } catch (err) {
      setHotelsError("Failed to fetch states.");
      setRoomsError("Failed to fetch states.");
    } finally {
      setHotelsLoading(false);
      setRoomsLoading(false);
    }
  };

  const recentBookings = useMemo(() => {
    return [...bookingsList]
      .sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn))
      .slice(0, 5);
  }, [bookingsList]);

  // Report generation using jsPDF--------------------------------------------------
  const generateBookingsReport = async (startDate, endDate) => {
    try {
      let filteredBookings = sortedBookings;
      if (startDate) {
        filteredBookings = filteredBookings.filter(
          (booking) => new Date(booking.checkIn) >= new Date(startDate)
        );
      }
      if (endDate) {
        filteredBookings = filteredBookings.filter(
          (booking) => new Date(booking.checkOut) <= new Date(endDate)
        );
      }

      const doc = new jsPDF();
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      let yPosition = margin;

      // Title
      doc.setFontSize(20);
      doc.text("Bookings Report", margin, yPosition);
      yPosition += 15;

      // Report generation date and date range
      doc.setFontSize(12);
      doc.text(
        `Generated on: ${new Date().toLocaleString()}`,
        margin,
        yPosition
      );
      yPosition += 10;
      doc.text(
        `Date Range: ${startDate || "N/A"} to ${endDate || "N/A"}`,
        margin,
        yPosition
      );
      yPosition += 15;

      // Table Headers
      const headers = [
        "Booking ID",
        "Hotel",
        "Check-In",
        "Check-Out",
        "Status",
        "Total Price",
      ];
      const columnWidths = [40, 40, 30, 30, 25, 25];
      let xPosition = margin;
      doc.setFontSize(12);
      headers.forEach((header, index) => {
        doc.text(header, xPosition, yPosition);
        xPosition += columnWidths[index];
      });
      yPosition += 10;

      // Table Rows
      filteredBookings.forEach((booking, index) => {
        // Check if we need a new page
        if (yPosition > pageHeight - margin - 20) {
          doc.setFontSize(10);
          doc.text("Continued on next page...", margin, pageHeight - margin);
          doc.addPage();
          yPosition = margin;

          // Redraw headers on new page
          xPosition = margin;
          doc.setFontSize(12);
          headers.forEach((header, i) => {
            doc.text(header, xPosition, yPosition);
            xPosition += columnWidths[i];
          });
          yPosition += 10;
        }

        const row = [
          booking._id.slice(0, 8) + "...",
          booking.roomId?.hotel?.name || "N/A",
          new Date(booking.checkIn).toLocaleDateString(),
          new Date(booking.checkOut).toLocaleDateString(),
          booking.status || "N/A",
          `$${booking.totalPrice?.toFixed(2) || "0.00"}`,
        ];

        xPosition = margin;
        doc.setFontSize(10);
        row.forEach((cell, i) => {
          doc.text(cell, xPosition, yPosition);
          xPosition += columnWidths[i];
        });
        yPosition += 8;
      });

      // Total Bookings
      yPosition += 10;
      doc.setFontSize(12);
      doc.text(`Total Bookings: ${filteredBookings.length}`, margin, yPosition);

      // Save the PDF
      doc.save(`Bookings_Report_${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (err) {
      console.error("Error generating bookings report:", err);
      alert("Failed to generate bookings report.");
    }
  };

  // report generation -------------------------------------------------------
  const generateRevenueReport = async (startDate, endDate) => {
    try {
      let filteredRevenueData = { ...revenueData };
      if (startDate || endDate) {
        let filteredBookings = bookings;
        if (startDate) {
          filteredBookings = filteredBookings.filter(
            (booking) => new Date(booking.checkIn) >= new Date(startDate)
          );
        }
        if (endDate) {
          filteredBookings = filteredBookings.filter(
            (booking) => new Date(booking.checkOut) <= new Date(endDate)
          );
        }

        const totalRevenue = filteredBookings.reduce(
          (sum, booking) => sum + (booking.totalPrice || 0),
          0
        );

        const byState = uniqueStates
          .map((state) => {
            const stateBookings = filteredBookings.filter(
              (booking) => booking.roomId?.hotel?.city?.state?.name === state
            );
            return {
              stateName: state,
              revenue: stateBookings.reduce(
                (sum, booking) => sum + (booking.totalPrice || 0),
                0
              ),
            };
          })
          .filter((item) => item.revenue > 0);

        const byCity = uniqueCities
          .map((city) => {
            const cityBookings = filteredBookings.filter(
              (booking) => booking.roomId?.hotel?.city?.name === city
            );
            return {
              cityName: city,
              revenue: cityBookings.reduce(
                (sum, booking) => sum + (booking.totalPrice || 0),
                0
              ),
            };
          })
          .filter((item) => item.revenue > 0);

        const byHotel = uniqueHotels
          .map((hotel) => {
            const hotelBookings = filteredBookings.filter(
              (booking) => booking.roomId?.hotel?.name === hotel
            );
            return {
              hotelName: hotel,
              revenue: hotelBookings.reduce(
                (sum, booking) => sum + (booking.totalPrice || 0),
                0
              ),
            };
          })
          .filter((item) => item.revenue > 0);

        const byDate = [];
        const dates = [
          ...new Set(
            filteredBookings.map(
              (booking) => new Date(booking.checkIn).toISOString().split("T")[0]
            )
          ),
        ].sort();
        dates.forEach((date) => {
          const dateBookings = filteredBookings.filter(
            (booking) =>
              new Date(booking.checkIn).toISOString().split("T")[0] === date
          );
          byDate.push({
            date,
            revenue: dateBookings.reduce(
              (sum, booking) => sum + (booking.totalPrice || 0),
              0
            ),
          });
        });

        filteredRevenueData = {
          totalRevenue,
          byState,
          byCity,
          byHotel,
          byDate,
        };
      }

      const doc = new jsPDF();
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      let yPosition = margin;

      // Title
      doc.setFontSize(20);
      doc.text("Revenue Report", margin, yPosition);
      yPosition += 15;

      // Report generation date and date range
      doc.setFontSize(12);
      doc.text(
        `Generated on: ${new Date().toLocaleString()}`,
        margin,
        yPosition
      );
      yPosition += 10;
      doc.text(
        `Date Range: ${startDate || "N/A"} to ${endDate || "N/A"}`,
        margin,
        yPosition
      );
      yPosition += 15;

      // Total Revenue
      doc.setFontSize(14);
      doc.text(
        `Total Revenue: $${filteredRevenueData.totalRevenue.toFixed(2)}`,
        margin,
        yPosition
      );
      yPosition += 15;

      // Revenue by State
      doc.setFontSize(14);
      doc.text("Revenue by State:", margin, yPosition);
      yPosition += 10;

      filteredRevenueData.byState.forEach((state) => {
        if (yPosition > pageHeight - margin - 20) {
          doc.setFontSize(10);
          doc.text("Continued on next page...", margin, pageHeight - margin);
          doc.addPage();
          yPosition = margin;
        }
        doc.setFontSize(12);
        doc.text(
          `${state.stateName}: $${state.revenue.toFixed(2)}`,
          margin,
          yPosition
        );
        yPosition += 8;
      });
      yPosition += 10;

      // Revenue by City
      doc.setFontSize(14);
      doc.text("Revenue by City:", margin, yPosition);
      yPosition += 10;

      filteredRevenueData.byCity.forEach((city) => {
        if (yPosition > pageHeight - margin - 20) {
          doc.setFontSize(10);
          doc.text("Continued on next page...", margin, pageHeight - margin);
          doc.addPage();
          yPosition = margin;
        }
        doc.setFontSize(12);
        doc.text(
          `${city.cityName}: $${city.revenue.toFixed(2)}`,
          margin,
          yPosition
        );
        yPosition += 8;
      });
      yPosition += 10;

      // Revenue by Hotel
      doc.setFontSize(14);
      doc.text("Revenue by Hotel:", margin, yPosition);
      yPosition += 10;

      filteredRevenueData.byHotel.forEach((hotel) => {
        if (yPosition > pageHeight - margin - 20) {
          doc.setFontSize(10);
          doc.text("Continued on next page...", margin, pageHeight - margin);
          doc.addPage();
          yPosition = margin;
        }
        doc.setFontSize(12);
        doc.text(
          `${hotel.hotelName}: $${hotel.revenue.toFixed(2)}`,
          margin,
          yPosition
        );
        yPosition += 8;
      });

      // Save the PDF
      doc.save(`Revenue_Report_${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (err) {
      console.error("Error generating revenue report:", err);
      alert("Failed to generate revenue report.");
    }
  };

  const handleGenerateReport = () => {
    if (reportType === "bookings") {
      generateBookingsReport(reportStartDate, reportEndDate);
    } else if (reportType === "revenue") {
      generateRevenueReport(reportStartDate, reportEndDate);
    }
    setIsReportModalOpen(false);

    setReportType("bookings");
    setReportStartDate("");
    setReportEndDate("");
  };

  useEffect(() => {
    fetchUser();
    fetchStates();
  }, []);

  useEffect(() => {
    if (currentScreen === "overview") {
      fetchStats();
    } else if (currentScreen === "revenue") {
      fetchBookings();
    } else if (currentScreen === "profile") {
      fetchProfileUsers();
    } else if (currentScreen === "users") {
      fetchUsers();
    } else if (currentScreen === "bookings") {
      fetchBookings();
    } else if (currentScreen === "hotels") {
      fetchHotelsCities();
      fetchHotels();
    } else if (currentScreen === "rooms") {
      fetchRoomsHotels();
      fetchRooms();
    } else if (currentScreen === "coupons") {
      fetchCoupons();
    }
  }, [currentScreen]);

  useEffect(() => {
    fetchHotelsCities();
  }, [selectedHotelState]);

  useEffect(() => {
    fetchHotels();
  }, [selectedHotelCity]);

  useEffect(() => {
    fetchRoomsHotels();
  }, [selectedRoomCity]);

  useEffect(() => {
    fetchRooms();
  }, [selectedRoomHotel]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, []);

  const uniqueStates = useMemo(() => {
    return [
      ...new Set(
        bookings
          .map((booking) => booking.roomId?.hotel?.city?.state?.name)
          .filter(Boolean)
      ),
    ];
  }, [bookings]);

  const uniqueCities = useMemo(() => {
    return [
      ...new Set(
        bookings
          .map((booking) => booking.roomId?.hotel?.city?.name)
          .filter(Boolean)
      ),
    ];
  }, [bookings]);

  const uniqueHotels = useMemo(() => {
    return [
      ...new Set(
        bookings.map((booking) => booking.roomId?.hotel?.name).filter(Boolean)
      ),
    ];
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    return bookingsList.filter((booking) => {
      const matchesStatus = bookingsFilters.status
        ? booking.status === bookingsFilters.status
        : true;
      const matchesHotel = bookingsFilters.hotel
        ? booking.roomId?.hotel?.name === bookingsFilters.hotel
        : true;
      const matchesStartDate = bookingsFilters.startDate
        ? new Date(booking.checkIn) >= new Date(bookingsFilters.startDate)
        : true;
      const matchesEndDate = bookingsFilters.endDate
        ? new Date(booking.checkOut) <= new Date(bookingsFilters.endDate)
        : true;
      const matchesSearch = bookingsFilters.search
        ? booking._id
            .toLowerCase()
            .includes(bookingsFilters.search.toLowerCase()) ||
          booking.roomId?.hotel?.name
            .toLowerCase()
            .includes(bookingsFilters.search.toLowerCase())
        : true;
      return (
        matchesStatus &&
        matchesHotel &&
        matchesStartDate &&
        matchesEndDate &&
        matchesSearch
      );
    });
  }, [bookingsList, bookingsFilters]);

  const sortedBookings = useMemo(() => {
    return [...filteredBookings].sort((a, b) => {
      const order = bookingsSort.order === "asc" ? 1 : -1;
      if (bookingsSort.field === "checkIn") {
        return order * (new Date(a.checkIn) - new Date(b.checkIn));
      } else if (bookingsSort.field === "checkOut") {
        return order * (new Date(a.checkOut) - new Date(b.checkOut));
      }
      return 0;
    });
  }, [filteredBookings, bookingsSort]);

  const totalBookingPages = Math.ceil(sortedBookings.length / bookingsPerPage);
  const paginatedBookings = sortedBookings.slice(
    (bookingsPage - 1) * bookingsPerPage,
    bookingsPage * bookingsPerPage
  );

  const uniqueBookingStatuses = useMemo(() => {
    return [
      ...new Set(bookingsList.map((booking) => booking.status).filter(Boolean)),
    ];
  }, [bookingsList]);

  const uniqueBookingHotels = useMemo(() => {
    return [
      ...new Set(
        bookingsList
          .map((booking) => booking.roomId?.hotel?.name)
          .filter(Boolean)
      ),
    ];
  }, [bookingsList]);

  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) =>
      hotelsSearch
        ? hotel.name.toLowerCase().includes(hotelsSearch.toLowerCase())
        : true
    );
  }, [hotels, hotelsSearch]);

  const totalHotelPages = Math.ceil(filteredHotels.length / hotelsPerPage);
  const paginatedHotels = filteredHotels.slice(
    (hotelsPage - 1) * hotelsPerPage,
    hotelsPage * hotelsPerPage
  );

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) =>
      roomsSearch
        ? room.roomNumber.toLowerCase().includes(roomsSearch.toLowerCase()) ||
          (room.type &&
            room.type.toLowerCase().includes(roomsSearch.toLowerCase()))
        : true
    );
  }, [rooms, roomsSearch]);

  const totalRoomPages = Math.ceil(filteredRooms.length / roomsPerPage);
  const paginatedRooms = filteredRooms.slice(
    (roomsPage - 1) * roomsPerPage,
    roomsPage * roomsPerPage
  );

  const filteredRevenueData = useMemo(() => {
    let filtered = bookings;

    if (revenueFilters.startDate) {
      filtered = filtered.filter(
        (booking) =>
          new Date(booking.checkIn) >= new Date(revenueFilters.startDate)
      );
    }
    if (revenueFilters.endDate) {
      filtered = filtered.filter(
        (booking) =>
          new Date(booking.checkOut) <= new Date(revenueFilters.endDate)
      );
    }
    if (revenueFilters.state) {
      filtered = filtered.filter(
        (booking) =>
          booking.roomId?.hotel?.city?.state?.name === revenueFilters.state
      );
    }
    if (revenueFilters.city) {
      filtered = filtered.filter(
        (booking) => booking.roomId?.hotel?.city?.name === revenueFilters.city
      );
    }
    if (revenueFilters.hotel) {
      filtered = filtered.filter(
        (booking) => booking.roomId?.hotel?.name === revenueFilters.hotel
      );
    }

    const totalRevenue = filtered.reduce(
      (sum, booking) => sum + (booking.totalPrice || 0),
      0
    );

    const byState = uniqueStates
      .map((state) => {
        const stateBookings = filtered.filter(
          (booking) => booking.roomId?.hotel?.city?.state?.name === state
        );
        return {
          stateName: state,
          revenue: stateBookings.reduce(
            (sum, booking) => sum + (booking.totalPrice || 0),
            0
          ),
        };
      })
      .filter((item) => item.revenue > 0);

    const byCity = uniqueCities
      .map((city) => {
        const cityBookings = filtered.filter(
          (booking) => booking.roomId?.hotel?.city?.name === city
        );
        return {
          cityName: city,
          revenue: cityBookings.reduce(
            (sum, booking) => sum + (booking.totalPrice || 0),
            0
          ),
        };
      })
      .filter((item) => item.revenue > 0);

    const byHotel = uniqueHotels
      .map((hotel) => {
        const hotelBookings = filtered.filter(
          (booking) => booking.roomId?.hotel?.name === hotel
        );
        return {
          hotelName: hotel,
          revenue: hotelBookings.reduce(
            (sum, booking) => sum + (booking.totalPrice || 0),
            0
          ),
        };
      })
      .filter((item) => item.revenue > 0);

    const byDate = [];
    const dates = [
      ...new Set(
        filtered.map(
          (booking) => new Date(booking.checkIn).toISOString().split("T")[0]
        )
      ),
    ].sort();
    dates.forEach((date) => {
      const dateBookings = filtered.filter(
        (booking) =>
          new Date(booking.checkIn).toISOString().split("T")[0] === date
      );
      byDate.push({
        date,
        revenue: dateBookings.reduce(
          (sum, booking) => sum + (booking.totalPrice || 0),
          0
        ),
      });
    });

    return { totalRevenue, byState, byCity, byHotel, byDate };
  }, [bookings, revenueFilters, uniqueStates, uniqueCities, uniqueHotels]);

  useEffect(() => {
    setRevenueData(filteredRevenueData);
  }, [filteredRevenueData]);

  if (loading) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-300">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 dark:text-red-400">{error}</div>
    );
  }

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "dark bg-black" : "bg-white"}`}
    >
      <Header
        user={user}
        isDarkMode={isDarkMode}
        toggleMode={toggleMode}
        handleLogout={handleLogout}
        handleBack={handleBack}
      />
      <Navigation
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
      />
      <div className="flex justify-end absolute top-18 right-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <button
          onClick={() => setIsReportModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Generate Report
        </button>
      </div>
      <main className="max-w-12xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {currentScreen === "overview" && (
          <OverviewScreen
            overviewStats={overviewStats}
            overviewLoading={overviewLoading}
            overviewError={overviewError}
            isDarkMode={isDarkMode}
            fetchStats={fetchStats}
            totalUsers={users.length}
            totalRevenue={revenueData.totalRevenue.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            setCurrentScreen={setCurrentScreen}
            recentBookings={recentBookings}
          />
        )}
        {currentScreen === "revenue" && (
          <RevenueScreen
            revenueLoading={revenueLoading}
            revenueError={revenueError}
            revenueData={revenueData}
            revenueFilters={revenueFilters}
            setRevenueFilters={setRevenueFilters}
            isAdmin={isAdmin}
            isDarkMode={isDarkMode}
            fetchBookings={fetchBookings}
            uniqueStates={uniqueStates}
            uniqueCities={uniqueCities}
            uniqueHotels={uniqueHotels}
          />
        )}
        {currentScreen === "profile" && (
          <ProfileScreen
            profileLoading={profileLoading}
            profileError={profileError}
            profileUsers={profileUsers}
          />
        )}
        {currentScreen === "users" && (
          <UsersScreen
            usersLoading={usersLoading}
            usersError={usersError}
            users={users}
          />
        )}
        {currentScreen === "bookings" && (
          <BookingsScreen
            bookingsLoading={bookingsLoading}
            bookingsError={bookingsError}
            paginatedBookings={paginatedBookings}
            bookingsPage={bookingsPage}
            totalBookingPages={totalBookingPages}
            setBookingsPage={setBookingsPage}
            bookingsFilters={bookingsFilters}
            setBookingsFilters={setBookingsFilters}
            bookingsSort={bookingsSort}
            setBookingsSort={setBookingsSort}
            uniqueBookingStatuses={uniqueBookingStatuses}
            uniqueBookingHotels={uniqueBookingHotels}
          />
        )}
        {currentScreen === "hotels" && (
          <HotelsScreen
            hotelsLoading={hotelsLoading}
            hotelsError={hotelsError}
            hotelsStates={hotelsStates}
            selectedHotelState={selectedHotelState}
            setSelectedHotelState={setSelectedHotelState}
            hotelsCities={hotelsCities}
            selectedHotelCity={selectedHotelCity}
            setSelectedHotelCity={setSelectedHotelCity}
            hotelsSearch={hotelsSearch}
            setHotelsSearch={setHotelsSearch}
            paginatedHotels={paginatedHotels}
            hotelsPage={hotelsPage}
            totalHotelPages={totalHotelPages}
            setHotelsPage={setHotelsPage}
            fetchAllHotels={fetchAllHotels}
          />
        )}
        {currentScreen === "rooms" && (
          <RoomsScreen
            roomsLoading={roomsLoading}
            roomsError={roomsError}
            roomsStates={roomsStates}
            selectedRoomState={selectedRoomState}
            setSelectedRoomState={setSelectedRoomState}
            roomsCities={roomsCities}
            selectedRoomCity={selectedRoomCity}
            setSelectedRoomCity={setSelectedRoomCity}
            roomsHotels={roomsHotels}
            selectedRoomHotel={selectedRoomHotel}
            setSelectedRoomHotel={setSelectedRoomHotel}
            roomsSearch={roomsSearch}
            setRoomsSearch={setRoomsSearch}
            paginatedRooms={paginatedRooms}
            roomsPage={roomsPage}
            totalRoomPages={totalRoomPages}
            setRoomsPage={setRoomsPage}
          />
        )}
        {currentScreen === "coupons" && (
          <CouponsScreen
            couponsLoading={couponsLoading}
            couponsError={couponsError}
            allCoupons={allCoupons}
            availableCoupons={availableCoupons}
          />
        )}
      </main>

      {isReportModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Generate Report
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="bookings">Bookings Report</option>
                  <option value="revenue">Revenue Report</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Date (Optional)
                </label>
                <input
                  type="date"
                  value={reportStartDate}
                  onChange={(e) => setReportStartDate(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={reportEndDate}
                  onChange={(e) => setReportEndDate(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateReport}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}

      {isReportModalOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md  border">
            <h2 className="text-xl font-bold mb-4 text-black">
              Generate Report
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black bg-white"
                >
                  <option value="bookings">Bookings Report</option>
                  <option value="revenue">Revenue Report</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black">
                  Start Date (Optional)
                </label>
                <input
                  type="date"
                  value={reportStartDate}
                  onChange={(e) => setReportStartDate(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={reportEndDate}
                  onChange={(e) => setReportEndDate(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black bg-white"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateReport}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
